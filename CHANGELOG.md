# Changelog

All notable changes to Chroninkle (renamed from Followup at 0.6.0) are
documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning follows
[Semantic Versioning](docs/versioning.md). History prior to 0.2.0 is available
via `git log`, not backfilled here.

## [Unreleased]

## [1.10.1] - 2026-11-14

### Changed

- **No tag menu offline, whatever the Sorting setting.** Without Gemini the take
  is always saved as a Note flagged `pending_classification` and sorted by
  Gemini once online (1.10.0 did this only with Sorting on Auto). Manual
  sorting still shows the menu when online.

## [1.10.0] - 2026-11-14

### Changed

- **Automatic sorting works offline too.** With Sorting on Auto and Gemini
  unreachable, the tag menu no longer opens: the take is saved as a Note with
  the new `pending_classification` metadata flag ("Saved: Gemini will sort it
  when online"). When the offline retry (or the Transcribe button) transcribes
  it, the same Gemini call classifies it, and the answer is applied exactly as
  online: transcript, type, topic, todos with deadlines, extra todo entries,
  "new topic". The archive work moved into
  `recording_session_service::ApplyClassifiedAnswer` (shared by the live
  session and `transcription_retry_service`), with
  `BuildAutoClassifyTranscribeOptions` and a new
  `recording_archive_service::LoadMetadata`. The menu still opens when online
  but the transcription slot is busy.

## [1.9.0] - 2026-11-14

### Added

- **Settings > Volume.** A new Settings item cycles the speaker volume
  1/5 -> ... -> 5/5 -> Muted -> 1/5 with a preview sound at each step, saved in
  NVS (`app_state/volume`, default 5/5) and applied at boot
  (`feedback_service::ApplyVolumeLevel`). Levels are 6 dB apart (codec volume
  52/64/76/88/100). Muted skips every system cue (`SystemSoundService::SetMuted`,
  reporting them as completed so flows waiting on a cue carry on); clip
  playback from the Details page still plays. Settings rows are 54 px high to
  fit nine items.

## [1.8.1] - 2026-11-14

### Fixed

- **Recordings made offline lost their automatic transcription after a
  reboot.** Wi-Fi connecting at boot started the retry batch before the
  Gemini key check had finished; every pending recording was refused
  ("couldn't start"), marked as failed and never retried. The batch now waits
  for Gemini to be ready (its ready edge starts it) and a refusal keeps the
  recording pending.
- **One failed attempt no longer ends automatic retries.** Temporary failures
  (no answer, timeout, rate limit, server errors, transcription busy with a
  live recording) keep the recording pending and schedule another batch 10
  minutes later, up to 4 attempts per recording per boot; only permanent
  failures are recorded on the note.

## [1.8.0] - 2026-11-14

### Added

- **Agenda: read-only Google Calendar.** A new `calendar_service` downloads up
  to 3 calendars from their "secret address in iCal format" (pasted in the
  setup portal's new **Google Calendar** card, saved in NVS `calendar/urls`)
  over HTTPS on its own task: when Wi-Fi connects, every 30 minutes while
  online, when the Agenda opens and on **Refresh**. A streaming iCalendar
  reader (`ics_calendar.*`, host-tested) keeps only today and the next 7 days,
  expands recurring events (DAILY/WEEKLY/MONTHLY/YEARLY with INTERVAL, COUNT,
  UNTIL, BYDAY, BYMONTHDAY), and applies EXDATE, moved/cancelled instances and
  cancelled events.
- **Home > Agenda** (new menu item, with a badge counting the events left
  today; the menu rows shrink a little to fit six items) opens an Agenda page:
  events grouped by day (Today, Tomorrow, then weekday and date), time range or
  "All day", title and location, plus when it last updated, **Refresh** and
  **Back**.
- Portal routes `GET/PATCH /api/settings/calendar` and
  `POST /api/calendar/refresh`; the portal lists the calendars masked, with
  Remove, and the result of the last download.

## [1.7.6] - 2026-11-14

### Fixed

- **The hotspot name/password message stayed on screen** for its full two
  minutes, covering Home even after the phone had joined. It now goes away as
  soon as a phone or computer joins the setup hotspot (`WIFI_EVENT_AP_STACONNECTED`,
  new `UiState::ap_clients`) or the hotspot is turned off. The password stays
  under the Access point toggle on Settings > Network.

## [1.7.5] - 2026-11-14

### Fixed

- **Google's reason for rejecting the key is shown.** On a 401 Google sends a
  `WWW-Authenticate: Bearer` header, and `esp_http_client_perform()` then gave
  up with `ESP_ERR_NOT_SUPPORTED` before reading the body, so the portal showed
  a library error instead of Google's message. The key check now reads the
  response itself, and the 401 is reported as a rejected key with Google's own
  message. The portal also shows the saved key's first 4 characters and length
  (`api_key_prefix`, `api_key_length`) to spot a key pasted incomplete or of the
  wrong kind.

## [1.7.4] - 2026-11-14

### Fixed

- **Gemini unreachable while the setup portal was open.** The portal's web
  server (7 client sockets + listen + control) and the captive DNS socket used
  all 10 lwIP sockets, so the key check and transcription failed with
  `ESP_ERR_ESP_TLS_CANNOT_CREATE_SOCKET` whenever a phone had the portal open.
  The socket limit is now 16 (`CONFIG_LWIP_MAX_SOCKETS`) and the portal uses
  at most 4 client sockets.

## [1.7.3] - 2026-11-14

### Added

- **Connection diagnostics for the Gemini key check.** When the check can't
  reach Google, the error shown in the setup portal now also names the failing
  stage (e.g. `ESP_ERR_ESP_TLS_CANNOT_RESOLVE_HOSTNAME`), the DNS server the
  device uses and what the Gemini host resolves to, so a DNS problem can be
  told apart from a blocked connection.

## [1.7.2] - 2026-11-14

### Fixed

- **Gemini key check retried once the clock is synced.** The key check runs as
  soon as Wi-Fi connects, often before the network time arrives; with the
  clock unset its TLS certificate check fails and Gemini stayed "unreachable"
  after the three quick retries. It is now checked again on every network time
  sync (`HandleTimezoneEvent` -> `gemini_service::RetryAuthentication`).
- **Connection errors are described.** A key check that gets no answer now
  reports the transport error with the TLS error code and certificate flags,
  and flags an unset or wrong device clock; the setup portal shows it as
  "Details" under the key, and the device says "Gemini: clock not set yet"
  when that is the cause.

## [1.7.1] - 2026-11-14

### Fixed

- **The setup portal never showed a saved Gemini key.** It read `has_key` /
  `last4`, which the firmware didn't send (it sends `configured` /
  `api_key_last4`): after saving, the key field emptied again as if nothing
  was stored. The firmware now sends both names and the portal reads both.
- **Why transcription doesn't run is now shown.** The portal's Gemini card
  shows the device's verdict on the key (connected, missing, not valid, needs
  Wi-Fi, request limit, Google's own error and HTTP status), refreshed until
  the check finishes. On the device, a recording saved without transcription
  and a refused **Transcribe** say the reason (`gemini_service::
  NotReadyReason`) instead of "Transcription unavailable", and pressing
  **Transcribe** re-checks the key.

## [1.7.0] - 2026-11-13

### Changed

- **Wi-Fi power save.** While connected, the Wi-Fi radio now uses modem sleep
  (`WIFI_PS_MIN_MODEM`): it sleeps between the access point's beacons and wakes
  by itself for traffic. Before, power save was disabled (`WIFI_PS_NONE`) and
  the radio stayed fully on for as long as the device was awake, including the
  minutes with the display asleep before light sleep. Expect lower battery
  drain while idle; replies from Gemini and the portal may take a few
  milliseconds longer.

## [1.6.0] - 2026-11-13

### Changed

- **Renamed to Taccuino** everywhere a user sees the name: the setup hotspot
  is now `Taccuino-XXXXXX` (`CONFIG_CHRONINKLE_WIFI_AP_PREFIX`), the setup
  portal's title and header (with the notebook mark), the onboarding
  carousel's text and its first and last pictures (which showed the Followup
  logo), the About page (now crediting Chroninkle and Followup), the README
  and both manuals. The internal project name (`chroninkle.bin`, checked by
  the OTA update), the Kconfig namespace and NVS keys are unchanged, so
  updates from the portal and saved settings keep working.

## [1.5.0] - 2026-11-13

### Changed

- **New startup logo.** The boot splash shows the new Taccuino mark (a
  notebook with its elastic band, and the name) instead of the Chroninkle
  logo. The attribution line above the Followup and ALXV Labs logos follows
  the UI language ("Based on" / "Basato su").

### Removed

- The three Chroninkle logo assets (stacked, horizontal and icon); only the
  stacked one was ever drawn.

### Fixed

- `scripts/generate_epaper_project_assets.py` runs on Linux: without macOS
  `sips` it converts PNGs with Pillow.

## [1.4.0] - 2026-11-13

### Added

- **Automatic time on/off.** The Time page has a new **Automatic time:
  Yes/No** button (staged, applied with Save), and the setup portal's time
  card a matching switch. With it off, the time set by hand is kept even
  while online and lwIP's hourly re-sync is stopped; before, connecting to
  Wi-Fi always overrode a manual time. Save reads **Save** instead of **Sync
  & Save** when it is off.
- **Last sync shown.** A line under the button (and under the portal switch)
  says when the clock last synced from the internet, or that it never has.
- **Backup time servers.** Besides `pool.ntp.org`, SNTP now also asks
  `time.google.com` and `ntp1.inrim.it` (`CONFIG_LWIP_SNTP_MAX_SERVERS=3`).

### Changed

- **Hourly re-syncs are recorded.** lwIP's background SNTP update (every hour
  while online) now also updates the RTC chip and the last-sync time; before,
  only the sync on connect did.
- **Failed syncs are retried.** If a sync fails while online, it is tried
  again after 5 minutes, up to three times per connection. The wait for an
  answer went from 2 to 8 seconds.

## [1.3.0] - 2026-11-13

### Security

- **The setup hotspot is password-protected.** It used to be open, so anyone
  nearby could reach the setup portal while it was on. It now uses WPA2 with
  an 8-digit random password (WPA2's minimum length), shown on the device
  screen when the hotspot comes up and under its toggle on Settings > Network.
  A new password is made on each day the hotspot is first started; a hotspot
  left on past midnight keeps its password until it is turned off.

## [1.2.0] - 2026-11-13

### Added

- **Saved Wi-Fi networks.** Up to 5 networks are remembered (most recently
  used first) instead of one. At startup and on every reconnect the device
  scans and joins the strongest saved network in range, so it moves between
  home, office and hotspot by itself. A saved network can be joined again
  without its password (the device's password field says so). The setup
  portal's Wi-Fi settings list the saved networks with a **Forget** button
  each (`GET /api/wifi/saved`, `POST /api/wifi/forget`). The network saved by
  earlier firmware is carried over automatically.

### Changed

- Disconnecting from the portal now forgets only the network being left; the
  other saved networks stay.

## [1.1.0] - 2026-11-12

### Added

- Italian user interface, selectable in Settings > Language (Italian by
  default in this build): every screen, dialog and toast, dates (24-hour
  clock, day/month/year entry), the setup portal and Gemini's transcripts and
  summaries. Fonts now include accented letters and typographic punctuation.
- Automatic sorting of recordings (Settings > Sorting): one Gemini call
  transcribes a recording and files it as a note, idea or todo, links it to an
  existing topic, splits several todos spoken together and reads their
  deadlines, shown on the Todos list, the Details page and the lock screen.
- Firmware update from the setup portal, guarded by a one-time code shown on
  the device screen; rollback to the previous firmware if the new one fails.

### Changed

- Recordings can last up to 60 seconds (configurable) and are no longer
  played back before the tag menu.
- Default timezone Central Europe.

## [1.0.0] - 2026-09-24

This is the last planned release before v2, a complete front-end rewrite
(dropping the current text-driven copy for a graphical, icon-based
interface — see `docs/todo.md`). 1.0 marks this as the stable baseline the
v1 UI settles on before that rewrite starts.

### Added

- A new **About** page under Settings, showing the installed firmware
  version and an acknowledgment of the original Followup project (by ALXV
  Labs) this device builds on.

### Changed

- Finished the in-repo Followup → Chroninkle rename: the ESP-IDF project
  name, the `CONFIG_FOLLOWUP_*` → `CONFIG_CHRONINKLE_*` Kconfig namespace
  (including the Wi-Fi setup hotspot's default name, now
  `Chroninkle-XXXXXX`), the `followup_task_config` → `chroninkle_task_config`
  FreeRTOS task table, remaining source comments/log strings/onboarding
  copy, the `webserver/` setup portal, and the internal docs. Only the
  GitHub repository name remains, tracked separately in `docs/todo.md`.
- Screen navigation now uses a quick partial refresh instead of the slow,
  flashy full-screen waveform for almost every transition. Only going to
  the Home screen and locking/shutting down still do a full refresh; the
  existing idle-deferred ghost-clear flush (`EpaperPanel::NeedsGhostingFlush`)
  keeps ghosting in check automatically as partials become far more
  frequent.

### Fixed

- The AXP2101's emergency 6-second PWR hold now explicitly forces
  power-off (`Axp2101Driver::setLongPressPowerOFF()`, register 0x22 bit 0)
  instead of relying on the chip's unverified factory default, which could
  have been "restart" instead of "power off" — silently breaking the
  documented "hardware escape even if firmware is wedged" guarantee.
  Also removed `Axp2101::SetButtonPowerOffRestarts()`, an unused and
  misleadingly-named wrapper (it actually toggled an unrelated PWROK
  pin-pull-low feature on register 0x10, not this one) that had led a
  previous investigation to the wrong fix.

## [0.6.1] - 2026-09-18

### Fixed

- Selecting a row in Todos or Notes no longer reboots the device. The
  `input_callbacks` dispatcher task ran every page callback on a 4096-byte
  stack, but page entry reads the recording archive off the SD card, and that
  FATFS/SDMMC call chain peaked at 4088 bytes — leaving no margin, so an
  interrupt arriving at depth overwrote the stack canary. FreeRTOS only checks
  that canary at a context switch, which is why the panic appeared on the next
  button press and looked like Select was at fault. The dispatcher stack is now
  8192 bytes, matching the other real-work tasks in the project.

### Added

- The boot log now reports `esp_reset_reason()`, so an unexpected reset is
  distinguishable from a deliberate restart without attaching a serial monitor
  at the right moment.

### Changed

- The boot splash now leads with the new **Chroninkle** name and mark, in a
  stacked lockup (`assets/logos/chroninkle-logo-stacked.png`,
  `EmbeddedLogoId::kChroninkleLogoStacked`), reflecting the project's rename
  from Followup. A horizontal lockup (`chroninkle-logo.png`) and an
  icon-only mark (`chroninkle-icon.png`) are generated alongside it for
  future use. The previous Folloup logo and the ALXV Labs logo it launched
  under move to a smaller "Based on" attribution line at the bottom of the
  same splash (75% of their old splash size) rather than disappearing
  (`display_service::DrawSplashScreen`). No other Followup branding changes
  yet — this is the first step of the rename.
- The Record button's quick tap is now a dedicated **Back** button instead of
  a second select/confirm button: it exits an entered list/scroll/control
  (`button_service::IsBackGesture`). The rocker-middle FN button is now the
  sole select/confirm control (`button_service::IsSelectButton`). Holding the
  rocker's down-tilt no longer exits an entered control either — that hold is
  freed up for continuous scrolling within one, reserved for later. Recording
  (press-and-hold the Record button) is unaffected. Updated the onboarding
  carousel's text and artwork (`assets/images/slide2.png`,
  `assets/images/slide3.png`) to match.

## [0.4.0] - 2026-09-13

### Added

- On-device `.txt` reader: a new "Books" item on the Home menu browses `.txt`
  files in a configurable SD card folder (`CONFIG_FOLLOWUP_TEXT_READER_FOLDER`,
  default `books`) and opens a paginated reading view. Each book remembers its
  last-read page position in a `<filename>.pos` sidecar next to it on the SD
  card. Page turns (UP/DOWN tilt) use a partial refresh; long-press DOWN
  returns to the book list.

## [0.3.1] - 2026-09-13

### Fixed

- Holding PWR to power the device back on after a manual shutdown sometimes
  didn't register on the first attempt. Shortened the AXP2101's PWRON
  power-on hold requirement from 1s to 512ms
  (`Axp2101::PowerKeyPressOnTime::k512Ms`), reducing how much uninterrupted
  contact a single press needs against physical key bounce. Confirmed
  reliable on-device across repeated shutdown/power-on cycles.

## [0.3.0] - 2026-09-11

### Changed

- Reordered the Home screen's main menu to Follow up, Todos, Notes, Topics
  (was Follow up, Topics, Notes, Todos).

## [0.2.0] - 2026-09-11

### Added

- Semantic versioning for the firmware: `version.txt` as the source of truth,
  a boot-time version log line, this changelog, and `docs/versioning.md`
  describing the workflow.

### Changed

- Baselined the starting version at 0.2.0 rather than 0.1.0, reflecting the
  substantial feature work already merged since this repo forked from
  `alxv2016/folloup-sticky` (topics, summarization, offline-transcription
  retry, settings redesign, and more — see `git log` for the full history).
