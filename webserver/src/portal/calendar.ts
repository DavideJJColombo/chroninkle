// Google Calendar card: the device downloads each calendar's "secret address in iCal format"
// (calendar_service) and shows the next days of events on Home > Agenda. Links are listed
// masked, with a Remove button each; the status line says when it last updated or why not.
import { fetchApiJson } from './api';
import { isItalian, t, translateServerMessage } from './i18n';
import type { StatusType } from './types';

const SETTINGS_API = '/api/settings/calendar';
const REFRESH_API = '/api/calendar/refresh';
const STATUS_POLL_MS = 3000;

type CalendarResponse = {
  success: boolean;
  message?: string;
  settings?: {
    max?: number;
    calendars?: Array<{ masked_url: string; name?: string }>;
  };
  runtime?: {
    fetching?: boolean;
    has_data?: boolean;
    last_success_epoch?: number;
    event_count?: number;
    last_error?: string;
    network_connected?: boolean;
  };
};

export interface CalendarDeps {
  list: HTMLElement;
  urlInput: HTMLInputElement & { value: string };
  statusText: HTMLElement;
  addButton: HTMLElement & { disabled: boolean };
  refreshButton: HTMLElement & { disabled: boolean };
  notify: (message: string, type?: StatusType) => void;
}

export function createCalendarController(deps: CalendarDeps) {
  let data: CalendarResponse | null = null;
  let busy = false;
  let pollTimer: number | undefined;

  function formatTime(epoch: number): string {
    const date = new Date(epoch * 1000);
    const pad = (value: number) => String(value).padStart(2, '0');
    return isItalian()
      ? `${pad(date.getDate())}/${pad(date.getMonth() + 1)} ${pad(date.getHours())}:${pad(date.getMinutes())}`
      : date.toLocaleString('en-US', { month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  }

  function render() {
    const calendars = data?.settings?.calendars ?? [];
    const max = data?.settings?.max ?? 3;
    deps.list.replaceChildren();
    if (calendars.length > 0) {
      const heading = document.createElement('h3');
      heading.className = 'saved-networks__title';
      heading.textContent = t(`Calendars (${calendars.length}/${max})`, `Calendari (${calendars.length}/${max})`);
      deps.list.appendChild(heading);
      const list = document.createElement('ul');
      list.className = 'saved-networks__list';
      calendars.forEach((calendar, index) => {
        const item = document.createElement('li');
        item.className = 'saved-networks__item';
        const name = document.createElement('span');
        name.className = 'saved-networks__ssid';
        name.textContent = calendar.name ? `${calendar.name} · ${calendar.masked_url}` : calendar.masked_url;
        item.appendChild(name);
        const remove = document.createElement('ui-button') as HTMLElement & { disabled: boolean };
        remove.setAttribute('variant', 'secondary');
        remove.textContent = t('Remove', 'Rimuovi');
        remove.disabled = busy;
        remove.addEventListener('click', () => void removeCalendar(index));
        item.appendChild(remove);
        list.appendChild(item);
      });
      deps.list.appendChild(list);
    }

    const runtime = data?.runtime;
    const status = deps.statusText;
    if (!runtime || calendars.length === 0) {
      status.hidden = true;
    } else {
      status.hidden = false;
      if (runtime.fetching) {
        status.textContent = t('Downloading the calendar...', 'Download del calendario in corso...');
      } else if (runtime.last_error) {
        // "Calendar 2: <reason>" when one of several calendars failed.
        const match = /^Calendar (\d+): (.*)$/.exec(runtime.last_error);
        const reason = match
          ? `${t('Calendar', 'Calendario')} ${match[1]}: ${translateServerMessage(match[2])}`
          : translateServerMessage(runtime.last_error);
        status.textContent = `${t('Last update failed', 'Ultimo aggiornamento non riuscito')}: ${reason}`;
      } else if ((runtime.last_success_epoch ?? 0) > 0) {
        const count = runtime.event_count ?? 0;
        status.textContent = t(
          `Updated ${formatTime(runtime.last_success_epoch ?? 0)}: ${count} events in the next 7 days.`,
          `Aggiornato il ${formatTime(runtime.last_success_epoch ?? 0)}: ${count} impegni nei prossimi 7 giorni.`
        );
      } else if (!runtime.network_connected) {
        status.textContent = t(
          'Waiting for Wi-Fi: the device downloads the calendar once it is online.',
          'In attesa del Wi-Fi: il dispositivo scarica il calendario appena è online.'
        );
      } else {
        status.textContent = t('Not downloaded yet.', 'Non ancora scaricato.');
      }
    }
    deps.addButton.disabled = busy || calendars.length >= max;
    deps.refreshButton.disabled = busy || calendars.length === 0;
    deps.refreshButton.hidden = calendars.length === 0;
  }

  async function load() {
    window.clearTimeout(pollTimer);
    try {
      data = await fetchApiJson<CalendarResponse>(SETTINGS_API);
    } catch (error) {
      // Older firmware without the calendar: hide the card.
      console.error('Calendar settings failed:', error);
      deps.list.closest('ui-card')?.setAttribute('hidden', '');
      return;
    }
    render();
    if (data?.runtime?.fetching && !document.hidden) {
      pollTimer = window.setTimeout(() => void load(), STATUS_POLL_MS);
    }
  }

  async function send(path: string, init: RequestInit, success: string): Promise<boolean> {
    if (busy) {
      return false;
    }
    let ok = false;
    busy = true;
    render();
    try {
      data = await fetchApiJson<CalendarResponse>(path, init);
      deps.notify(success, 'success');
      ok = true;
    } catch (error) {
      deps.notify(error instanceof Error ? error.message : t('Request failed.', 'Richiesta non riuscita.'), 'error');
    } finally {
      busy = false;
      render();
      // The download runs on the device; follow it until it finishes.
      window.clearTimeout(pollTimer);
      pollTimer = window.setTimeout(() => void load(), 1500);
    }
    return ok;
  }

  async function addCalendar() {
    const url = deps.urlInput.value.trim();
    if (!url) {
      deps.notify(t('Paste the calendar link first.', 'Incolla prima il link del calendario.'), 'warning');
      return;
    }
    const added = await send(
      SETTINGS_API,
      { method: 'PATCH', body: JSON.stringify({ add_url: url }) },
      t('Calendar added.', 'Calendario aggiunto.')
    );
    if (added) {
      deps.urlInput.value = '';
    }
  }

  async function removeCalendar(index: number) {
    await send(
      SETTINGS_API,
      { method: 'PATCH', body: JSON.stringify({ remove_index: index }) },
      t('Calendar removed.', 'Calendario rimosso.')
    );
  }

  async function refresh() {
    await send(REFRESH_API, { method: 'POST' }, t('Updating the calendar...', 'Aggiornamento del calendario...'));
  }

  return { load, addCalendar, refresh };
}
