// Saved Wi-Fi networks, listed in the Wi-Fi sheet with a Forget button each. The device joins
// the strongest saved network in range on its own (wifi_service); a saved network can be joined
// again from the list above without retyping its password.
import { fetchApiJson } from './api';
import { t } from './i18n';
import type { StatusType } from './types';

const SAVED_NETWORKS_API = '/api/wifi/saved';
const FORGET_NETWORK_API = '/api/wifi/forget';

type SavedNetworksResponse = {
  success: boolean;
  message?: string;
  max?: number;
  networks?: Array<{ ssid: string; connected?: boolean }>;
};

export interface SavedNetworksDeps {
  container: HTMLElement;
  notify: (message: string, type?: StatusType) => void;
  onChange: () => void;
}

export function createSavedNetworksController(deps: SavedNetworksDeps) {
  let saved: Array<{ ssid: string; connected: boolean }> = [];
  let max = 5;
  let busy = false;

  function render() {
    const container = deps.container;
    container.replaceChildren();

    const heading = document.createElement('h3');
    heading.className = 'saved-networks__title';
    heading.textContent = t(`Saved networks (${saved.length}/${max})`, `Reti salvate (${saved.length}/${max})`);
    container.appendChild(heading);

    if (saved.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'form-helper-text';
      empty.textContent = t(
        'None yet: a network is saved when the device connects to it.',
        'Nessuna: una rete viene salvata quando il dispositivo vi si connette.'
      );
      container.appendChild(empty);
      return;
    }

    const list = document.createElement('ul');
    list.className = 'saved-networks__list';
    for (const network of saved) {
      const item = document.createElement('li');
      item.className = 'saved-networks__item';

      const name = document.createElement('span');
      name.className = 'saved-networks__ssid';
      name.textContent = network.connected
        ? `${network.ssid} · ${t('connected', 'connessa')}`
        : network.ssid;
      item.appendChild(name);

      const forget = document.createElement('ui-button') as HTMLElement & { disabled: boolean };
      forget.setAttribute('variant', 'secondary');
      forget.setAttribute('aria-label', t(`Forget ${network.ssid}`, `Dimentica ${network.ssid}`));
      forget.textContent = t('Forget', 'Dimentica');
      forget.disabled = busy;
      forget.addEventListener('click', () => {
        void forgetNetwork(network.ssid);
      });
      item.appendChild(forget);
      list.appendChild(item);
    }
    container.appendChild(list);

    const help = document.createElement('p');
    help.className = 'form-helper-text';
    help.textContent = t(
      'The device joins the strongest saved network in range by itself.',
      'Il dispositivo si collega da solo alla rete salvata con il segnale migliore.'
    );
    container.appendChild(help);
  }

  async function load() {
    try {
      const data = await fetchApiJson<SavedNetworksResponse>(SAVED_NETWORKS_API);
      saved = (data.networks ?? []).map((item) => ({
        ssid: item.ssid,
        connected: item.connected === true,
      }));
      max = data.max ?? max;
    } catch (error) {
      // Older firmware without saved networks: keep the section hidden.
      console.error('Saved networks failed:', error);
      deps.container.hidden = true;
      return;
    }
    deps.container.hidden = false;
    render();
  }

  async function forgetNetwork(ssid: string) {
    if (busy) {
      return;
    }
    busy = true;
    render();
    try {
      await fetchApiJson<SavedNetworksResponse>(FORGET_NETWORK_API, {
        method: 'POST',
        body: JSON.stringify({ ssid }),
      });
      deps.notify(t(`${ssid} forgotten.`, `${ssid} dimenticata.`), 'success');
    } catch (error) {
      deps.notify(
        error instanceof Error ? error.message : t('Could not forget the network.', 'Impossibile dimenticare la rete.'),
        'error'
      );
    } finally {
      busy = false;
      await load();
      deps.onChange();
    }
  }

  return {
    load,
    isSaved: (ssid: string | null | undefined) => !!ssid && saved.some((item) => item.ssid === ssid),
  };
}
