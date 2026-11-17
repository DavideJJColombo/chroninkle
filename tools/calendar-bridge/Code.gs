/**
 * Taccuino -> Google Calendar bridge.
 *
 * Runs in YOUR Google account (script.google.com) and adds the events your Taccuino device
 * sends to a calendar named "Taccuino" (created the first time). The device never gets access
 * to your Google account: it only knows this script's web-app address and the secret below.
 *
 * Setup (once, on a computer):
 *  1. Go to https://script.google.com, "New project", delete the sample code and paste this file.
 *  2. Change SECRET below to a word or code only you know (at least 8 characters), and save.
 *  3. Pick the "setup" function in the toolbar and press Run: authorize when asked (it's your
 *     own script; Google may warn that the app isn't verified: Advanced > Go to project). It
 *     creates the "Taccuino" calendar.
 *  4. Deploy > New deployment > type "Web app": Execute as "Me", Who has access "Anyone".
 *  5. Copy the "Web app" URL (it ends with /exec) and paste it, with the same SECRET, in the
 *     device's setup portal, "Calendar: add events" card, then press "Test".
 *
 * To change the code later: Deploy > Manage deployments > edit > Version "New version".
 */

const SECRET = 'cambia-questa-parola';
const CALENDAR_NAME = 'Taccuino';

function doPost(e) {
  let request;
  try {
    request = JSON.parse(e.postData.contents);
  } catch (err) {
    return reply({ ok: false, error: 'bad_request' });
  }
  if (!request || request.secret !== SECRET) {
    return reply({ ok: false, error: 'wrong_secret' });
  }
  try {
    const calendar = getCalendar();
    switch (request.action) {
      case 'ping':
        return reply({ ok: true, calendar: calendar.getName() });
      case 'create':
        return reply(createEvent(calendar, request));
      case 'delete':
        return reply(deleteEvent(calendar, request));
      default:
        return reply({ ok: false, error: 'unknown_action' });
    }
  } catch (err) {
    return reply({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

// Run once from the editor: grants the calendar permission and creates the calendar.
function setup() {
  if (SECRET === 'cambia-questa-parola' || SECRET.length < 8) {
    throw new Error('Change SECRET first (at least 8 characters).');
  }
  Logger.log('Calendar ready: ' + getCalendar().getName());
}

// Opening the URL in a browser shows that the bridge is installed (no data is returned).
function doGet() {
  return reply({ ok: true, bridge: 'taccuino-calendar' });
}

function getCalendar() {
  const found = CalendarApp.getCalendarsByName(CALENDAR_NAME);
  if (found.length > 0) {
    return found[0];
  }
  return CalendarApp.createCalendar(CALENDAR_NAME, { summary: 'Eventi creati da Taccuino' });
}

function createEvent(calendar, request) {
  const title = String(request.title || '').trim().substring(0, 200);
  if (!title) {
    return { ok: false, error: 'missing_title' };
  }
  const options = { description: 'Creato da Taccuino' };
  if (request.all_day) {
    // "YYYY-MM-DD", read in the script's own time zone.
    const parts = String(request.date || '').split('-').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) {
      return { ok: false, error: 'bad_date' };
    }
    const day = new Date(parts[0], parts[1] - 1, parts[2]);
    const next = new Date(parts[0], parts[1] - 1, parts[2] + 1);
    const existing = findSame(calendar, title, day, next, true);
    if (existing) {
      return { ok: true, id: existing.getId(), duplicate: true };
    }
    const event = calendar.createAllDayEvent(title, day, options);
    return { ok: true, id: event.getId() };
  }
  const start = new Date(Number(request.start) * 1000);
  const end = new Date(Number(request.end) * 1000);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
    return { ok: false, error: 'bad_time' };
  }
  // The device retries after a timeout: don't create the same event twice.
  const existing = findSame(calendar, title, start, end, false);
  if (existing) {
    return { ok: true, id: existing.getId(), duplicate: true };
  }
  const event = calendar.createEvent(title, start, end, options);
  return { ok: true, id: event.getId() };
}

function findSame(calendar, title, start, end, allDay) {
  const events = calendar.getEvents(start, end);
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    if (event.getTitle() === title && event.isAllDayEvent() === allDay &&
        (allDay || event.getStartTime().getTime() === start.getTime())) {
      return event;
    }
  }
  return null;
}

function deleteEvent(calendar, request) {
  const event = calendar.getEventById(String(request.id || ''));
  if (!event) {
    return { ok: true, missing: true };
  }
  event.deleteEvent();
  return { ok: true };
}

function reply(object) {
  return ContentService.createTextOutput(JSON.stringify(object))
    .setMimeType(ContentService.MimeType.JSON);
}
