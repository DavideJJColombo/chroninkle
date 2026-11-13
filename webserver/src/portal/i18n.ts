// Portal language. The portal follows the language chosen on the device (Settings > Language),
// read from GET /api/language; if the device doesn't answer (older firmware, dev server) it
// falls back to the browser language. UI strings are written in place as t('English',
// 'Italiano'); messages coming back from the firmware API go through translateServerMessage.

export type PortalLanguage = 'en' | 'it';

let currentLanguage: PortalLanguage = detectBrowserLanguage();

function detectBrowserLanguage(): PortalLanguage {
  const languages =
    typeof navigator !== 'undefined' ? navigator.languages ?? [navigator.language] : [];
  return languages.some((lang) => lang?.toLowerCase().startsWith('it')) ? 'it' : 'en';
}

export function getLanguage(): PortalLanguage {
  return currentLanguage;
}

export function isItalian(): boolean {
  return currentLanguage === 'it';
}

export function t(english: string, italian: string): string {
  return currentLanguage === 'it' ? italian : english;
}

export async function initLanguage(timeoutMs = 1500): Promise<PortalLanguage> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch('/api/language', {
      cache: 'no-store',
      signal: controller.signal,
    });
    if (response.ok) {
      const data = (await response.json()) as { language?: string };
      if (data.language === 'it' || data.language === 'en') {
        currentLanguage = data.language;
      }
    }
  } catch {
    // Keep the browser-language fallback.
  } finally {
    window.clearTimeout(timeoutId);
  }
  document.documentElement.lang = currentLanguage;
  return currentLanguage;
}

// Firmware API messages (wifi_service, timezone_service, gemini_service) are English.
const SERVER_MESSAGES: Record<string, string> = {
  Connected: 'Connesso',
  'Not connected': 'Non connesso',
  'Scanning for networks': 'Ricerca reti in corso',
  'Network scan complete': 'Ricerca reti completata',
  'Scan failed': 'Ricerca non riuscita',
  'Invalid Wi-Fi configuration payload': 'Configurazione Wi-Fi non valida',
  'Invalid JSON body': 'Richiesta non valida',
  'SSID required': 'Serve il nome della rete (SSID)',
  'Failed to start Wi-Fi connection': 'Impossibile avviare la connessione Wi-Fi',
  'Failed to disconnect Wi-Fi': 'Impossibile disconnettere il Wi-Fi',
  'Cleared saved Wi-Fi credentials': 'Credenziali Wi-Fi salvate cancellate',
  'Invalid time settings payload': 'Impostazioni ora non valide',
  'Time settings loaded': 'Impostazioni ora caricate',
  'Time settings updated': 'Impostazioni ora aggiornate',
  'Time runtime loaded': 'Ora caricata',
  'Timezone list loaded': 'Elenco fusi orari caricato',
  'Clock disabled': 'Orologio disattivato',
  'Automatic time off': 'Ora automatica disattivata',
  'Failed to save time settings': 'Impossibile salvare le impostazioni dell’ora',
  'Failed to set manual time': 'Impossibile impostare l’ora manualmente',
  'Invalid manual date/time': 'Data o ora non valide',
  'Invalid timezone_name': 'Fuso orario non valido',
  'Invalid enabled': 'Valore non valido',
  'Invalid location': 'Posizione non valida',
  'timezone_name required to enable clock': 'Seleziona prima un fuso orario',
  'timezone_name required to set manual time': 'Seleziona prima un fuso orario',
  'Invalid Gemini settings payload': 'Impostazioni Gemini non valide',
  'Invalid api_key': 'Chiave API non valida',
  'Gemini API key is required': 'Serve la chiave API di Gemini',
  'Gemini API key stored': 'Chiave API di Gemini salvata',
  'Failed to store Gemini API key': 'Impossibile salvare la chiave API di Gemini',
  'Gemini API key cleared': 'Chiave API di Gemini cancellata',
  'Failed to clear Gemini API key': 'Impossibile cancellare la chiave API di Gemini',
  'Request failed.': 'Richiesta non riuscita.',
  'Network forgotten': 'Rete dimenticata',
  'Network not saved': 'Rete non salvata',
  'Firmware status loaded': 'Stato del firmware caricato',
  'Update code shown on the device': 'Codice mostrato sul dispositivo',
  'Update code required': 'Serve il codice mostrato sul dispositivo',
  'Update code expired, request a new one': 'Codice scaduto: richiedine uno nuovo',
  'Too many wrong codes, request a new one': 'Troppi codici errati: richiedine uno nuovo',
  'Wrong update code': 'Codice errato',
  'An update is already in progress': 'È già in corso un aggiornamento',
  'No OTA partition available': 'Nessuna partizione disponibile per l’aggiornamento',
  'Firmware file has the wrong size': 'Il file del firmware ha una dimensione non valida',
  'Upload interrupted': 'Caricamento interrotto',
  'Not a firmware file (use build/chroninkle.bin)':
    'Non è un file firmware (usa build/chroninkle.bin)',
  'Firmware built for a different chip': 'Firmware compilato per un altro chip',
  'Firmware for a different project': 'Firmware di un altro progetto',
  'Could not start the update': 'Impossibile avviare l’aggiornamento',
  'Could not write the firmware': 'Impossibile scrivere il firmware',
  'Firmware file is corrupted': 'Il file del firmware è danneggiato',
  'Could not finish the update': 'Impossibile completare l’aggiornamento',
  'Could not activate the new firmware': 'Impossibile attivare il nuovo firmware',
  'Update installed, the device is restarting': 'Aggiornamento installato, il dispositivo si riavvia',
};

const SERVER_MESSAGE_PREFIXES: Array<[string, string]> = [
  ['Disconnected and cleared credentials for ', 'Disconnesso, credenziali cancellate per '],
  ['Connecting to ', 'Connessione a '],
];

export function translateServerMessage(message: string): string {
  if (currentLanguage !== 'it' || !message) {
    return message;
  }
  const exact = SERVER_MESSAGES[message] ?? SERVER_MESSAGES[message.replace(/\.$/, '')];
  if (exact) {
    return exact;
  }
  for (const [english, italian] of SERVER_MESSAGE_PREFIXES) {
    if (message.startsWith(english)) {
      return italian + message.slice(english.length);
    }
  }
  return message;
}

// Timezone catalog descriptions from timezone_service (kept in sync with
// LocalizedTimezoneLabel in main/time_page_coordinator.cpp).
const TIMEZONE_LABELS: Record<string, string> = {
  'Eastern Time': 'Nord America orientale',
  'Central Time': 'Nord America centrale',
  'Mountain Time': 'Nord America (Montagne Rocciose)',
  'Pacific Time': 'Nord America (Pacifico)',
  'Alaska Time': 'Alaska',
  'Hawaii Time': 'Hawaii',
  'United Kingdom': 'Regno Unito',
  'Central Europe': 'Europa centrale (Italia)',
  'Eastern Europe': 'Europa orientale',
  Japan: 'Giappone',
  China: 'Cina',
  'Australia Eastern': 'Australia orientale',
  'Australia Central': 'Australia centrale',
  'Australia Western': 'Australia occidentale',
};

export function translateTimezoneLabel(label: string): string {
  return currentLanguage === 'it' ? (TIMEZONE_LABELS[label] ?? label) : label;
}

// Static markup in index.html.
export function applyStaticTranslations(): void {
  if (currentLanguage === 'en') {
    return;
  }
  const setAttr = (id: string, attr: string, value: string) => {
    document.getElementById(id)?.setAttribute(attr, value);
  };
  const setText = (id: string, value: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  };

  document.title = 'Configurazione Chroninkle';
  document.querySelector('main')?.setAttribute('aria-label', 'Configurazione Chroninkle');

  setAttr('wifiSettingsSheet', 'title', 'Impostazioni Wi-Fi');
  setAttr(
    'wifiSettingsSheet',
    'description',
    'Cerca le reti disponibili e collega il tuo Chroninkle al Wi-Fi.'
  );
  setAttr('wifiSettingsCloseBtn', 'aria-label', 'Chiudi impostazioni Wi-Fi');
  setAttr('networkList', 'label', 'Reti disponibili');
  setAttr('password', 'label', 'Password Wi-Fi');
  setAttr('password', 'placeholder', 'Inserisci la password della rete');
  setText('scanBtn', 'Cerca reti');
  setText('connectBtn', 'Connetti');

  setAttr('geminiCard', 'title', 'Chiave API di Gemini');
  setAttr('geminiApiKeyInput', 'label', 'Chiave API di Gemini');
  setAttr('geminiApiKeyInput', 'placeholder', 'Inserisci la chiave API di Gemini');
  setText('geminiClearBtn', 'Cancella');
  setText('geminiSaveBtn', 'Salva');

  setAttr('timezoneLocationCard', 'title', 'Impostazione ora');
  setAttr('timezoneSelect', 'label', 'Fuso orario');
  setAttr('timezoneSelect', 'aria-label', 'Fuso orario');
  setAttr('manualTimeInput', 'label', 'Ora');
  setAttr('manualDateInput', 'label', 'Data');
  setAttr('autoTimeToggle', 'label', 'Ora automatica (da internet)');
  const helper = document.querySelector('#timezoneLocationCard p.form-helper-text:not([id])');
  if (helper) {
    helper.textContent =
      'Con l’ora automatica attiva, il dispositivo prende l’ora da internet ogni volta che è ' +
      'sul Wi-Fi. Disattivala per tenere la data e l’ora che inserisci qui.';
  }
  setText('timezoneLocationClearBtn', 'Cancella');
  setText('timezoneLocationSaveBtn', 'Salva');

  setAttr('statusToast', 'aria-label', 'Notifica di stato');

  setAttr('firmwareCard', 'title', 'Aggiornamento firmware');
  setAttr('firmwareFileInput', 'label', 'File del firmware (.bin)');
  setAttr('firmwareCodeInput', 'label', 'Codice mostrato sul dispositivo');
  setText(
    'firmwareHelpText',
    'Tocca «Mostra codice» per far comparire un codice monouso sullo schermo del dispositivo, ' +
      'scegli build/chroninkle.bin, inserisci il codice e tocca «Aggiorna». Se il nuovo ' +
      'firmware non riesce ad avviarsi, il dispositivo torna da solo alla versione precedente.'
  );
  setText('firmwareCodeBtn', 'Mostra codice');
  setText('firmwareUpdateBtn', 'Aggiorna');

  // The Wi-Fi status card's Settings button lives in its (open) shadow root.
  const settingsButton = document
    .getElementById('wifiStatusCard')
    ?.shadowRoot?.getElementById('settingsBtn');
  if (settingsButton) {
    settingsButton.textContent = 'Impostazioni';
    settingsButton.setAttribute('aria-label', 'Impostazioni');
  }
}
