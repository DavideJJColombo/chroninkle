import type { FirmwareFileField } from './firmware';
import type {
  BottomSheetField,
  CardField,
  NetworkListField,
  NetworkStatusField,
  ValidatableField,
} from './types';

function getRequiredElement<T>(id: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Required portal element "#${id}" was not found.`);
  }

  return element as T;
}

export interface PortalDom {
  // WiFi
  wifiStatusCard: NetworkStatusField;
  wifiSettingsSheet: BottomSheetField;
  wifiSettingsCloseBtn: HTMLElement;
  wifiSettingsNotification: HTMLDivElement;
  networkList: NetworkListField;
  passwordInput: ValidatableField;
  scanBtn: HTMLButtonElement;
  connectBtn: HTMLButtonElement;
  savedNetworks: HTMLElement;
  // Gemini API key
  geminiCard: CardField;
  geminiApiKeyInput: ValidatableField & { readOnly: boolean };
  geminiClearBtn: HTMLButtonElement;
  geminiSaveBtn: HTMLButtonElement;
  // Time / timezone
  timezoneLocationCard: CardField;
  timezoneSelect: ValidatableField;
  autoTimeToggle: HTMLButtonElement;
  timeSyncStatus: HTMLElement;
  manualTimeInput: ValidatableField;
  manualDateInput: ValidatableField;
  timezoneLocationClearBtn: HTMLButtonElement;
  timezoneLocationSaveBtn: HTMLButtonElement;
  // Firmware update (OTA)
  firmwareCard: CardField;
  firmwareVersionText: HTMLElement;
  firmwareFileInput: FirmwareFileField;
  firmwareCodeInput: ValidatableField;
  firmwareCodeBtn: HTMLElement & { disabled: boolean };
  firmwareUpdateBtn: HTMLElement & { disabled: boolean };
}

export function createPortalDom(): PortalDom {
  return {
    wifiStatusCard: getRequiredElement<NetworkStatusField>('wifiStatusCard'),
    wifiSettingsSheet: getRequiredElement<BottomSheetField>('wifiSettingsSheet'),
    wifiSettingsCloseBtn: getRequiredElement<HTMLElement>('wifiSettingsCloseBtn'),
    wifiSettingsNotification: getRequiredElement<HTMLDivElement>('wifiSettingsNotification'),
    networkList: getRequiredElement<NetworkListField>('networkList'),
    passwordInput: getRequiredElement<ValidatableField>('password'),
    scanBtn: getRequiredElement<HTMLButtonElement>('scanBtn'),
    connectBtn: getRequiredElement<HTMLButtonElement>('connectBtn'),
    savedNetworks: getRequiredElement<HTMLElement>('savedNetworks'),

    geminiCard: getRequiredElement<CardField>('geminiCard'),
    geminiApiKeyInput: getRequiredElement<ValidatableField & { readOnly: boolean }>(
      'geminiApiKeyInput'
    ),
    geminiClearBtn: getRequiredElement<HTMLButtonElement>('geminiClearBtn'),
    geminiSaveBtn: getRequiredElement<HTMLButtonElement>('geminiSaveBtn'),

    timezoneLocationCard: getRequiredElement<CardField>('timezoneLocationCard'),
    timezoneSelect: getRequiredElement<ValidatableField>('timezoneSelect'),
    autoTimeToggle: getRequiredElement<HTMLButtonElement>('autoTimeToggle'),
    timeSyncStatus: getRequiredElement<HTMLElement>('timeSyncStatus'),
    manualTimeInput: getRequiredElement<ValidatableField>('manualTimeInput'),
    manualDateInput: getRequiredElement<ValidatableField>('manualDateInput'),
    timezoneLocationClearBtn: getRequiredElement<HTMLButtonElement>('timezoneLocationClearBtn'),
    timezoneLocationSaveBtn: getRequiredElement<HTMLButtonElement>('timezoneLocationSaveBtn'),

    firmwareCard: getRequiredElement<CardField>('firmwareCard'),
    firmwareVersionText: getRequiredElement<HTMLElement>('firmwareVersionText'),
    firmwareFileInput: getRequiredElement<FirmwareFileField>('firmwareFileInput'),
    firmwareCodeInput: getRequiredElement<ValidatableField>('firmwareCodeInput'),
    firmwareCodeBtn: getRequiredElement<HTMLElement & { disabled: boolean }>('firmwareCodeBtn'),
    firmwareUpdateBtn: getRequiredElement<HTMLElement & { disabled: boolean }>('firmwareUpdateBtn'),
  };
}
