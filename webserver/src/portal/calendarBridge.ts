// "Calendar: add events" card: the address of the Apps Script bridge installed in the user's
// Google account (tools/calendar-bridge/Code.gs) and its secret word. The device sends the
// appointments the user confirms to a "Taccuino" calendar through it.
import { fetchApiJson } from './api';
import { t, translateServerMessage } from './i18n';
import type { StatusType } from './types';

const BRIDGE_API = '/api/settings/calendar-bridge';
const TEST_API = '/api/calendar-bridge/test';
const POLL_MS = 2500;

type BridgeResponse = {
  success: boolean;
  message?: string;
  settings?: { configured?: boolean; masked_url?: string };
  runtime?: {
    outbox_count?: number;
    pending_proposals?: number;
    last_write_error?: string;
    test_state?: string;
    test_message?: string;
    network_connected?: boolean;
  };
};

export interface CalendarBridgeDeps {
  urlInput: { value: string };
  secretInput: { value: string };
  statusText: HTMLElement;
  saveButton: HTMLElement & { disabled: boolean };
  testButton: HTMLElement & { disabled: boolean };
  notify: (message: string, type?: StatusType) => void;
}

export function createCalendarBridgeController(deps: CalendarBridgeDeps) {
  let data: BridgeResponse | null = null;
  let busy = false;
  let pollTimer: number | undefined;

  function render() {
    const configured = data?.settings?.configured === true;
    const runtime = data?.runtime;
    const lines: string[] = [];
    if (configured) {
      lines.push(`${t('Bridge', 'Ponte')}: ${data?.settings?.masked_url ?? ''}`);
      switch (runtime?.test_state) {
        case 'running':
          lines.push(t('Testing the bridge...', 'Prova del ponte in corso...'));
          break;
        case 'ok':
          lines.push(
            t(
              `Working: events go to the "${runtime.test_message || 'Taccuino'}" calendar.`,
              `Funziona: gli eventi vanno nel calendario "${runtime.test_message || 'Taccuino'}".`
            )
          );
          break;
        case 'error':
          lines.push(`${t('Test failed', 'Prova non riuscita')}: ${translateServerMessage(runtime.test_message ?? '')}`);
          break;
        default:
          break;
      }
      const queued = runtime?.outbox_count ?? 0;
      if (queued > 0) {
        lines.push(t(`${queued} events waiting to be sent.`, `${queued} eventi in attesa di invio.`));
      }
      if (runtime?.last_write_error && runtime.test_state !== 'error') {
        lines.push(`${t('Last send failed', 'Ultimo invio non riuscito')}: ${translateServerMessage(runtime.last_write_error)}`);
      }
    }
    deps.statusText.hidden = lines.length === 0;
    deps.statusText.textContent = lines.join(' · ');
    deps.testButton.hidden = !configured;
    deps.testButton.disabled = busy || runtime?.test_state === 'running';
    deps.saveButton.disabled = busy;
    deps.saveButton.textContent = configured
      ? t('Save / Remove', 'Salva / Rimuovi')
      : t('Save', 'Salva');
  }

  function schedulePoll() {
    window.clearTimeout(pollTimer);
    if (data?.runtime?.test_state === 'running' && !document.hidden) {
      pollTimer = window.setTimeout(() => void load(), POLL_MS);
    }
  }

  async function load() {
    try {
      data = await fetchApiJson<BridgeResponse>(BRIDGE_API);
    } catch (error) {
      // Older firmware without the bridge: hide the card.
      console.error('Calendar bridge settings failed:', error);
      deps.statusText.closest('ui-card')?.setAttribute('hidden', '');
      return;
    }
    render();
    schedulePoll();
  }

  async function save() {
    if (busy) {
      return;
    }
    const url = deps.urlInput.value.trim();
    const secret = deps.secretInput.value.trim();
    busy = true;
    render();
    try {
      // Both fields empty = remove the bridge.
      data = await fetchApiJson<BridgeResponse>(BRIDGE_API, {
        method: 'PATCH',
        body: JSON.stringify({ url, secret }),
      });
      deps.secretInput.value = '';
      deps.notify(
        url || secret
          ? t('Bridge saved: testing it...', 'Ponte salvato: lo provo...')
          : t('Bridge removed.', 'Ponte rimosso.'),
        'success'
      );
      if (url || secret) {
        data.runtime = { ...(data.runtime ?? {}), test_state: 'running' };
      }
    } catch (error) {
      deps.notify(error instanceof Error ? error.message : t('Request failed.', 'Richiesta non riuscita.'), 'error');
    } finally {
      busy = false;
      render();
      schedulePoll();
    }
  }

  async function test() {
    if (busy) {
      return;
    }
    busy = true;
    render();
    try {
      data = await fetchApiJson<BridgeResponse>(TEST_API, { method: 'POST' });
      data.runtime = { ...(data.runtime ?? {}), test_state: 'running' };
    } catch (error) {
      deps.notify(error instanceof Error ? error.message : t('Request failed.', 'Richiesta non riuscita.'), 'error');
    } finally {
      busy = false;
      render();
      schedulePoll();
    }
  }

  return { load, save, test };
}
