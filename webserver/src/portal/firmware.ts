// Firmware update (OTA) card: shows the running version, asks the device to display a one-time
// code on its own screen, then uploads build/chroninkle.bin with that code. Served by the
// firmware's ota_service (GET /api/ota/status, POST /api/ota/code, POST /api/ota/upload).
import { fetchApiJson } from './api';
import { t, translateServerMessage } from './i18n';
import type { CardField, StatusType, ValidatableField } from './types';

const OTA_STATUS_API = '/api/ota/status';
const OTA_CODE_API = '/api/ota/code';
const OTA_UPLOAD_API = '/api/ota/upload';

type OtaStatusResponse = {
  success: boolean;
  message?: string;
  project?: string;
  version?: string;
  max_size?: number;
  update_in_progress?: boolean;
};

export type FirmwareFileField = HTMLElement & {
  files: FileList | null;
  disabled: boolean;
  progressHidden: boolean;
  progressValue: number;
  progressMax: number;
  progressMessageText: string;
};

type ToggleableButton = HTMLElement & { disabled: boolean };

export interface FirmwareControllerDeps {
  card: CardField;
  versionText: HTMLElement;
  fileInput: FirmwareFileField;
  codeInput: ValidatableField;
  codeButton: ToggleableButton;
  updateButton: ToggleableButton;
  setFieldError: (field: ValidatableField, message: string) => void;
  clearFieldError: (field: ValidatableField) => void;
}

export function createFirmwareController(deps: FirmwareControllerDeps) {
  let busy = false;
  let maxSize = 0;

  const notify = (message: string, type: StatusType = 'info') => {
    deps.card.setNotification(message, type);
  };

  function setBusy(value: boolean) {
    busy = value;
    deps.codeButton.disabled = value;
    deps.updateButton.disabled = value;
    deps.fileInput.disabled = value;
  }

  async function loadStatus() {
    try {
      const data = await fetchApiJson<OtaStatusResponse>(OTA_STATUS_API);
      maxSize = data.max_size ?? 0;
      deps.versionText.textContent = t(
        `Installed version: ${data.version ?? '?'}`,
        `Versione installata: ${data.version ?? '?'}`
      );
    } catch (error) {
      console.error('Firmware status failed:', error);
      deps.versionText.textContent = t(
        'This firmware cannot be updated from the portal yet.',
        'Questo firmware non si può ancora aggiornare dal portale.'
      );
      deps.codeButton.disabled = true;
      deps.updateButton.disabled = true;
    }
  }

  async function requestCode() {
    if (busy) {
      return;
    }
    setBusy(true);
    try {
      await fetchApiJson<{ success: boolean; message?: string }>(OTA_CODE_API, {
        method: 'POST',
      });
      notify(
        t(
          'A 6-digit code is now shown on the device screen. Enter it below.',
          'Sullo schermo del dispositivo è comparso un codice di 6 cifre: inseriscilo qui sotto.'
        ),
        'info'
      );
    } catch (error) {
      notify(
        error instanceof Error
          ? error.message
          : t('Could not request a code.', 'Impossibile richiedere il codice.'),
        'error'
      );
    } finally {
      setBusy(false);
    }
  }

  function selectedFile(): File | null {
    const file = deps.fileInput.files?.[0] ?? null;
    if (!file) {
      notify(t('Choose the firmware file (.bin).', 'Scegli il file del firmware (.bin).'), 'error');
      return null;
    }
    if (!file.name.toLowerCase().endsWith('.bin')) {
      notify(
        t(
          'The firmware file must be a .bin (build/chroninkle.bin).',
          'Il file del firmware deve essere un .bin (build/chroninkle.bin).'
        ),
        'error'
      );
      return null;
    }
    if (maxSize > 0 && file.size > maxSize) {
      notify(
        t('The file is too big for this device.', 'Il file è troppo grande per questo dispositivo.'),
        'error'
      );
      return null;
    }
    return file;
  }

  function upload() {
    if (busy) {
      return;
    }
    const code = deps.codeInput.value.trim();
    if (!/^\d{6}$/.test(code)) {
      deps.setFieldError(
        deps.codeInput,
        t('Enter the 6-digit code from the device.', 'Inserisci il codice di 6 cifre del dispositivo.')
      );
      return;
    }
    deps.clearFieldError(deps.codeInput);
    const file = selectedFile();
    if (!file) {
      return;
    }

    setBusy(true);
    deps.fileInput.progressHidden = false;
    deps.fileInput.progressMax = 100;
    deps.fileInput.progressValue = 0;
    deps.fileInput.progressMessageText = t('Uploading...', 'Caricamento...');
    notify(
      t(
        'Updating: keep this page open and the device nearby.',
        'Aggiornamento in corso: tieni aperta questa pagina e il dispositivo vicino.'
      ),
      'info'
    );

    // XMLHttpRequest rather than fetch: it reports upload progress.
    const request = new XMLHttpRequest();
    request.open('POST', `${OTA_UPLOAD_API}?code=${encodeURIComponent(code)}`);
    request.setRequestHeader('Content-Type', 'application/octet-stream');
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        deps.fileInput.progressValue = percent;
        deps.fileInput.progressMessageText = `${percent}%`;
      }
    };
    request.onload = () => {
      let message = '';
      let success = false;
      try {
        const data = JSON.parse(request.responseText) as { success?: boolean; message?: string };
        success = request.status === 200 && data.success === true;
        message = translateServerMessage(data.message ?? '');
      } catch {
        message = '';
      }
      if (success) {
        deps.fileInput.progressValue = 100;
        deps.fileInput.progressMessageText = t('Done', 'Fatto');
        notify(
          t(
            'Update installed. The device restarts in a few seconds; reconnect to its Wi-Fi to use the portal again.',
            'Aggiornamento installato. Il dispositivo si riavvia tra pochi secondi: per usare di nuovo il portale ricollegati alla sua rete.'
          ),
          'success'
        );
        deps.codeInput.value = '';
        // The device is restarting: leave the controls disabled.
        return;
      }
      deps.fileInput.progressHidden = true;
      notify(message || t('Update failed.', 'Aggiornamento non riuscito.'), 'error');
      setBusy(false);
    };
    request.onerror = () => {
      deps.fileInput.progressHidden = true;
      notify(
        t(
          'Connection lost during the update. If the device restarted, wait and reconnect; otherwise try again.',
          'Connessione persa durante l’aggiornamento. Se il dispositivo si è riavviato attendi e ricollegati, altrimenti riprova.'
        ),
        'error'
      );
      setBusy(false);
    };
    request.send(file);
  }

  return { loadStatus, requestCode, upload, isBusy: () => busy };
}
