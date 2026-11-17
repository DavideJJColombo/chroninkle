(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const h of s.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&i(h)}).observe(document,{childList:!0,subtree:!0});function n(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(o){if(o.ep)return;o.ep=!0;const s=n(o);fetch(o.href,s)}})();let B=ne();function ne(){return(typeof navigator<"u"?navigator.languages??[navigator.language]:[]).some(e=>e?.toLowerCase().startsWith("it"))?"it":"en"}function qt(){return B==="it"}function r(t,e){return B==="it"?e:t}async function ie(t=1500){const e=new AbortController,n=window.setTimeout(()=>e.abort(),t);try{const i=await fetch("/api/language",{cache:"no-store",signal:e.signal});if(i.ok){const o=await i.json();(o.language==="it"||o.language==="en")&&(B=o.language)}}catch{}finally{window.clearTimeout(n)}return document.documentElement.lang=B,B}const wt={Connected:"Connesso","Not connected":"Non connesso","Scanning for networks":"Ricerca reti in corso","Network scan complete":"Ricerca reti completata","Scan failed":"Ricerca non riuscita","Invalid Wi-Fi configuration payload":"Configurazione Wi-Fi non valida","Invalid JSON body":"Richiesta non valida","SSID required":"Serve il nome della rete (SSID)","Failed to start Wi-Fi connection":"Impossibile avviare la connessione Wi-Fi","Failed to disconnect Wi-Fi":"Impossibile disconnettere il Wi-Fi","Cleared saved Wi-Fi credentials":"Credenziali Wi-Fi salvate cancellate","Invalid time settings payload":"Impostazioni ora non valide","Time settings loaded":"Impostazioni ora caricate","Time settings updated":"Impostazioni ora aggiornate","Time runtime loaded":"Ora caricata","Timezone list loaded":"Elenco fusi orari caricato","Clock disabled":"Orologio disattivato","Automatic time off":"Ora automatica disattivata","Failed to save time settings":"Impossibile salvare le impostazioni dell’ora","Failed to set manual time":"Impossibile impostare l’ora manualmente","Invalid manual date/time":"Data o ora non valide","Invalid timezone_name":"Fuso orario non valido","Invalid enabled":"Valore non valido","Invalid location":"Posizione non valida","timezone_name required to enable clock":"Seleziona prima un fuso orario","timezone_name required to set manual time":"Seleziona prima un fuso orario","Invalid Gemini settings payload":"Impostazioni Gemini non valide","Invalid api_key":"Chiave API non valida","Gemini API key is required":"Serve la chiave API di Gemini","Gemini API key stored":"Chiave API di Gemini salvata","Failed to store Gemini API key":"Impossibile salvare la chiave API di Gemini","Gemini API key cleared":"Chiave API di Gemini cancellata","Failed to clear Gemini API key":"Impossibile cancellare la chiave API di Gemini","Request failed.":"Richiesta non riuscita.","Network forgotten":"Rete dimenticata","Network not saved":"Rete non salvata","Firmware status loaded":"Stato del firmware caricato","Update code shown on the device":"Codice mostrato sul dispositivo","Update code required":"Serve il codice mostrato sul dispositivo","Update code expired, request a new one":"Codice scaduto: richiedine uno nuovo","Too many wrong codes, request a new one":"Troppi codici errati: richiedine uno nuovo","Wrong update code":"Codice errato","An update is already in progress":"È già in corso un aggiornamento","No OTA partition available":"Nessuna partizione disponibile per l’aggiornamento","Firmware file has the wrong size":"Il file del firmware ha una dimensione non valida","Upload interrupted":"Caricamento interrotto","Not a firmware file (use build/chroninkle.bin)":"Non è un file firmware (usa build/chroninkle.bin)","Firmware built for a different chip":"Firmware compilato per un altro chip","Firmware for a different project":"Firmware di un altro progetto","Could not start the update":"Impossibile avviare l’aggiornamento","Could not write the firmware":"Impossibile scrivere il firmware","Firmware file is corrupted":"Il file del firmware è danneggiato","Could not finish the update":"Impossibile completare l’aggiornamento","Could not activate the new firmware":"Impossibile attivare il nuovo firmware","Update installed, the device is restarting":"Aggiornamento installato, il dispositivo si riavvia","Calendar settings loaded":"Impostazioni calendario caricate","Calendar added":"Calendario aggiunto","Calendar removed":"Calendario rimosso","Calendar link not valid":"Link del calendario non valido","Calendar list full":"Hai già aggiunto il numero massimo di calendari","Calendar already added":"Calendario già aggiunto","Calendar not found":"Calendario non trovato","Calendar needs Wi-Fi":"Per aggiornare il calendario serve il Wi-Fi","Calendar refresh started":"Aggiornamento del calendario avviato","Failed to save calendar settings":"Impossibile salvare le impostazioni del calendario","Invalid calendar settings payload":"Impostazioni calendario non valide","Not a calendar (use the secret iCal address)":"Non è un calendario (usa l’indirizzo segreto in formato iCal)","Download interrupted":"Download interrotto","Public address of a private calendar: use the secret address (HTTP 404)":"Hai incollato l’indirizzo pubblico di un calendario privato: usa l’indirizzo segreto (HTTP 404)","Secret address not found: it may have been reset (HTTP 404)":"Google non trova questo indirizzo segreto: forse è stato reimpostato (HTTP 404)","HTTP client init failed":"Errore interno di rete","Calendar bridge loaded":"Ponte del calendario caricato","Calendar bridge saved":"Ponte del calendario salvato","Calendar bridge removed":"Ponte del calendario rimosso","Calendar bridge test started":"Prova del ponte avviata","Calendar bridge not set up":"Il ponte del calendario non è configurato","Bridge address not valid":"Indirizzo del ponte non valido (deve iniziare con https://script.google.com/)","Secret word too short":"Parola segreta troppo corta (almeno 8 caratteri)","Failed to save calendar bridge":"Impossibile salvare il ponte del calendario","Invalid calendar bridge payload":"Dati del ponte non validi","Wrong secret word":"Parola segreta sbagliata (deve essere uguale a SECRET nello script)","Not the Taccuino bridge (check the address and access)":"Non risponde il ponte di Taccuino: controlla l’indirizzo e che l’accesso sia «Chiunque»","Device not connected to Wi-Fi":"Il dispositivo non è connesso al Wi-Fi"},oe=[["Disconnected and cleared credentials for ","Disconnesso, credenziali cancellate per "],["Connecting to ","Connessione a "],["Link not valid (","Link non valido ("],["Bridge error: ","Errore del ponte: "],["Connection failed (","Connessione non riuscita ("]];function M(t){if(B!=="it"||!t)return t;const e=wt[t]??wt[t.replace(/\.$/,"")];if(e)return e;for(const[n,i]of oe)if(t.startsWith(n))return i+t.slice(n.length);return t}const re={"Eastern Time":"Nord America orientale","Central Time":"Nord America centrale","Mountain Time":"Nord America (Montagne Rocciose)","Pacific Time":"Nord America (Pacifico)","Alaska Time":"Alaska","Hawaii Time":"Hawaii","United Kingdom":"Regno Unito","Central Europe":"Europa centrale (Italia)","Eastern Europe":"Europa orientale",Japan:"Giappone",China:"Cina","Australia Eastern":"Australia orientale","Australia Central":"Australia centrale","Australia Western":"Australia occidentale"};function Mt(t){return B==="it"?re[t]??t:t}function ae(){if(B==="en")return;const t=(o,s,h)=>{document.getElementById(o)?.setAttribute(s,h)},e=(o,s)=>{const h=document.getElementById(o);h&&(h.textContent=s)};document.title="Configurazione Taccuino",document.querySelector("main")?.setAttribute("aria-label","Configurazione Taccuino"),t("wifiSettingsSheet","title","Impostazioni Wi-Fi"),t("wifiSettingsSheet","description","Cerca le reti disponibili e collega il tuo Taccuino al Wi-Fi."),t("wifiSettingsCloseBtn","aria-label","Chiudi impostazioni Wi-Fi"),t("networkList","label","Reti disponibili"),t("password","label","Password Wi-Fi"),t("password","placeholder","Inserisci la password della rete"),e("scanBtn","Cerca reti"),e("connectBtn","Connetti"),t("geminiCard","title","Chiave API di Gemini"),t("geminiApiKeyInput","label","Chiave API di Gemini"),t("geminiApiKeyInput","placeholder","Inserisci la chiave API di Gemini"),e("geminiClearBtn","Cancella"),e("geminiSaveBtn","Salva"),t("timezoneLocationCard","title","Impostazione ora"),t("timezoneSelect","label","Fuso orario"),t("timezoneSelect","aria-label","Fuso orario"),t("manualTimeInput","label","Ora"),t("manualDateInput","label","Data"),t("autoTimeToggle","label","Ora automatica (da internet)");const n=document.querySelector("#timezoneLocationCard p.form-helper-text:not([id])");n&&(n.textContent="Con l’ora automatica attiva, il dispositivo prende l’ora da internet ogni volta che è sul Wi-Fi. Disattivala per tenere la data e l’ora che inserisci qui."),e("timezoneLocationClearBtn","Cancella"),e("timezoneLocationSaveBtn","Salva"),t("statusToast","aria-label","Notifica di stato"),t("calendarCard","title","Calendario Google"),t("calendarUrlInput","label","Indirizzo segreto in formato iCal"),e("calendarHelp","Da Google Calendar sul computer: Impostazioni, scegli il calendario e copia «Indirizzo segreto in formato iCal», poi incollalo qui. Il dispositivo mostrerà gli impegni dei prossimi giorni in Home, alla voce Agenda. Tieni il link per te: chi lo ha può vedere il calendario."),e("calendarRefreshBtn","Aggiorna"),e("calendarAddBtn","Aggiungi"),t("bridgeCard","title","Calendario: aggiungere eventi"),e("bridgeHelp","Per far aggiungere al dispositivo gli appuntamenti che registri a un calendario «Taccuino», installa il piccolo script ponte nel tuo account Google (vedi il manuale, «Aggiungere eventi al calendario»), poi incolla qui il suo indirizzo e la parola segreta che hai scelto."),t("bridgeUrlInput","label","Indirizzo del ponte (finisce con /exec)"),t("bridgeSecretInput","label","Parola segreta"),t("bridgeSecretInput","placeholder","La parola SECRET scritta nello script"),e("bridgeTestBtn","Prova"),e("bridgeSaveBtn","Salva"),t("firmwareCard","title","Aggiornamento firmware"),t("firmwareFileInput","label","File del firmware (.bin)"),t("firmwareCodeInput","label","Codice mostrato sul dispositivo"),e("firmwareHelpText","Tocca «Mostra codice» per far comparire un codice monouso sullo schermo del dispositivo, scegli build/chroninkle.bin, inserisci il codice e tocca «Aggiorna». Se il nuovo firmware non riesce ad avviarsi, il dispositivo torna da solo alla versione precedente."),e("firmwareCodeBtn","Mostra codice"),e("firmwareUpdateBtn","Aggiorna");const i=document.getElementById("wifiStatusCard")?.shadowRoot?.getElementById("settingsBtn");i&&(i.textContent="Impostazioni",i.setAttribute("aria-label","Impostazioni"))}const se={mode:"absolute",position:"bottom",height:"6rem",strength:2,divCount:5,exponential:!1,opacity:1,curve:"linear",zIndex:2},yt={linear:t=>t,bezier:t=>t*t*(3-2*t),"ease-in":t=>t*t,"ease-out":t=>1-Math.pow(1-t,2),"ease-in-out":t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2};function le(t){switch(t){case"top":return"to top";case"left":return"to left";case"right":return"to right";default:return"to bottom"}}function ce(){if(typeof CSS>"u"||typeof CSS.supports!="function")return!1;const t=CSS.supports("backdrop-filter","blur(1px)")||CSS.supports("-webkit-backdrop-filter","blur(1px)"),e=CSS.supports("mask-image","linear-gradient(to bottom, transparent, black)")||CSS.supports("-webkit-mask-image","linear-gradient(to bottom, transparent, black)");return t&&e}function de(t){const e={...se,...t},n=document.createElement("div"),i=document.createElement("div"),o=le(e.position),s=ce(),h=e.position==="top"||e.position==="bottom";if(n.className="gradual-blur",e.className&&n.classList.add(e.className),s||(n.classList.add("gradual-blur--fallback"),n.style.background=`linear-gradient(${o}, transparent 0%, ${e.fallbackColor||"rgba(255, 255, 255, 0.95)"} 100%)`),n.style.position=e.mode,n.style.pointerEvents="none",n.style.zIndex=String(e.zIndex),n.style.opacity="0",n.style.borderRadius="inherit",h?(n.style.height=e.height,n.style.width=e.width||"100%",n.style[e.position]="0",e.mode==="fixed"?(n.style.left="50%",n.style.right="auto",n.style.transform="translateX(-50%)"):(n.style.left="0",n.style.right="0")):(n.style.width=e.width||e.height,n.style.height="100%",n.style.top="0",n.style.bottom="0",n.style[e.position]="0"),i.className="gradual-blur__inner",n.appendChild(i),s){const l=100/e.divCount,c=yt[e.curve]||yt.linear;for(let u=1;u<=e.divCount;u+=1){const p=document.createElement("div"),g=c(u/e.divCount);let w=0;e.exponential?w=Math.pow(2,g*4)*.0625*e.strength:w=.0625*(g*e.divCount+1)*e.strength;const f=Math.round((l*u-l)*10)/10,S=Math.round(l*u*10)/10,T=Math.round((l*u+l)*10)/10,k=Math.round((l*u+l*2)*10)/10;let _=`transparent ${f}%, black ${S}%`;T<=100&&(_+=`, black ${T}%`),k<=100&&(_+=`, transparent ${k}%`),p.className="gradual-blur__layer",p.style.maskImage=`linear-gradient(${o}, ${_})`,p.style.webkitMaskImage=`linear-gradient(${o}, ${_})`,p.style.backdropFilter=`blur(${w.toFixed(3)}rem)`,p.style.setProperty("-webkit-backdrop-filter",`blur(${w.toFixed(3)}rem)`),p.style.opacity=String(e.opacity),i.appendChild(p)}}return window.getComputedStyle(e.mount).position==="static"&&(e.mount.style.position="relative"),e.mount.appendChild(n),{element:n,setVisible(l){n.style.opacity=l?"1":"0"},destroy(){n.remove()}}}const ue=`:host {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 1.75rem;
  padding: 0 var(--spacing-sm);
  border: var(--border-01) solid var(--color-border);
  border-radius: var(--radius-full);
  background-color: var(--color-bg-selected);
  color: var(--color-text-secondary);
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-semibold);
  line-height: 1;
  white-space: nowrap;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: inherit;
}
`,he=document.createElement("template");he.innerHTML=`
  <style>${ue}</style>
  <span class="badge">
    <slot></slot>
  </span>
`;const ge=`:host {
  display: inline-flex;
  height: 44px;
  width: auto;
  min-width: 96px;
  vertical-align: middle;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

button {
  all: unset;
  box-sizing: border-box;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  width: auto;
  min-height: 44px;
  min-width: 96px;
  padding: var(--spacing-3xs) var(--spacing-sm);
  border: var(--border-01) solid transparent;
  border-radius: var(--button-radius);
  background-color: var(--color-text-secondary);
  color: var(--color-text-inverse);
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-regular);
  line-height: 1.25;
  text-align: center;
}

button:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

button:disabled {
  background-color: var(--color-bg-mute);
  color: var(--color-text-mute);
  cursor: default;
}

:host([variant="primary"]) button {
  background-color: var(--color-bg-brand);
  color: var(--color-text-inverse);
}

:host([variant="primary"]) button:not(:disabled):is(:hover, :active) {
  background-color: var(--color-bg-brand-hover);
}

:host([variant="secondary"]) button {
  background-color: var(--color-bg-active);
  color: var(--color-fg-active);
}

:host([variant="secondary"]) button:not(:disabled):is(:hover, :active) {
  background-color: var(--color-bg-active);
  color: var(--color-fg-active);
}

:host([variant="outline"]) button {
  background-color: transparent;
  border-color: var(--color-border);
  color: var(--color-text-secondary);
}

:host([variant="outline"]) button:not(:disabled):is(:hover, :active) {
  background-color: var(--color-border);
  border-color: var(--color-border);
}

:host([variant="ghost"]) button {
  background-color: transparent;
  border-color: transparent;
  color: var(--color-text-secondary);
}

:host([variant="ghost"]) button:not(:disabled):is(:hover, :active) {
  background-color: var(--color-overlay);
}

:host([inverse]) button {
  color: var(--color-text-inverse);
}

:host([variant="outline"][inverse]) button {
  border-color: var(--color-text-inverse);
}

:host([variant="outline"][inverse]) button:not(:disabled):is(:hover, :active),
:host([variant="ghost"][inverse]) button:not(:disabled):is(:hover, :active) {
  background-color: var(--color-overlay);
  border-color: var(--color-text-inverse);
}

:host([rounded]) button {
  border-radius: var(--radius-full);
  padding: var(--spacing-xs) var(--spacing-lg);
}

::slotted(svg) {
  flex-shrink: 0;
}
`,tt="ui-button",Pt=document.createElement("template");Pt.innerHTML=`
  <style>${ge}</style>
  <button type="button" part="button">
    <slot></slot>
  </button>
`;function St(t){return t==="submit"||t==="reset"?t:"button"}class me extends HTMLElement{static get observedAttributes(){return["disabled","aria-label","type"]}constructor(){super();const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(Pt.content.cloneNode(!0)),this.button=e.querySelector("button")}connectedCallback(){this.dataset.component=tt,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get type(){return St(this.getAttribute("type"))}set type(e){this.setAttribute("type",St(e))}focus(e){this.button.focus(e)}click(){this.button.click()}syncAttributes(){this.button.disabled=this.disabled,this.button.type=this.type,this.tabIndex=this.disabled?-1:0;const e=this.getAttribute("aria-label");e?this.button.setAttribute("aria-label",e):this.button.removeAttribute("aria-label")}}function pe(){customElements.get(tt)||customElements.define(tt,me)}const fe=`:host {
  display: contents;
}

:host([hidden]) {
  display: none;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.bottom-sheet-dialog {
  position: fixed;
  inset: auto 0 0 0;
  display: flex;
  width: 100%;
  max-height: 96vh;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-text);
  overflow: visible;
  transform: translateY(100%);
  max-width: 768px;
  margin: auto;
}

.bottom-sheet-dialog:not([open]) {
  pointer-events: none;
  visibility: hidden;
}

.bottom-sheet-dialog[open] {
  animation: bottom-sheet-open 320ms ease forwards;
}

.bottom-sheet-dialog.closing {
  animation: bottom-sheet-close 320ms ease forwards;
}

.bottom-sheet-dialog::backdrop {
  background: var(--color-overlay);
  backdrop-filter: blur(4px) saturate(180%);
  -webkit-backdrop-filter: blur(4px) saturate(180%);
}

.bottom-sheet-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 0;
  border-top: var(--border-01) solid var(--color-border);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  background: var(--color-bg);
  box-shadow: 0 -8px 24px rgb(0 0 0 / 0.16);
  overflow: hidden;
}

.bottom-sheet-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  padding-right: var(--spacing-sm);
  border-bottom: var(--border-01) solid var(--color-border);
}

.bottom-sheet-header-copy {
  display: grid;
  gap: var(--spacing-3xs);
  min-width: 0;
}

.bottom-sheet-title,
.bottom-sheet-description {
  margin: 0;
}

.bottom-sheet-title {
  font-size: var(--font-size-heading);
  font-weight: var(--font-weight-semibold);
  line-height: 1.2;
}

.bottom-sheet-description {
  color: var(--color-text-secondary);
  font-size: var(--font-size-label);
  line-height: 1.5;
}

.bottom-sheet-header-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--spacing-xs);
  flex-shrink: 0;
}

.bottom-sheet-body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  min-height: 0;
  padding: var(--spacing-md);
  overflow: auto;
}

.bottom-sheet-footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  /* Extra bottom padding so the footer buttons clear the iOS home indicator / safe area and
     aren't clipped at the bottom of the sheet. */
  padding: var(--spacing-md) var(--spacing-md) var(--spacing-6xl);
  border-top: var(--border-01) solid var(--color-border);
  background: var(--color-bg);
}

.bottom-sheet-title[hidden],
.bottom-sheet-description[hidden],
.bottom-sheet-header-actions[hidden],
.bottom-sheet-footer[hidden] {
  display: none;
}

::slotted([slot="footer"]) {
  flex-shrink: 0;
}

@keyframes bottom-sheet-open {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}

@keyframes bottom-sheet-close {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(100%);
  }
}
`,et="ui-bottom-sheet",Nt=document.createElement("template"),be=["a[href]","button:not([disabled])","details summary","input:not([disabled])","select:not([disabled])","textarea:not([disabled])",'[tabindex]:not([tabindex="-1"])'].join(", ");let J=0;Nt.innerHTML=`
  <style>${fe}</style>
  <dialog class="bottom-sheet-dialog" part="dialog">
    <div class="bottom-sheet-content" part="content">
      <div class="bottom-sheet-header" part="header">
        <div class="bottom-sheet-header-copy">
          <h2 class="bottom-sheet-title" part="title"></h2>
          <p class="bottom-sheet-description" part="description"></p>
        </div>
        <div class="bottom-sheet-header-actions" part="header-actions">
          <slot name="header-actions"></slot>
        </div>
      </div>
      <div class="bottom-sheet-body" part="body">
        <slot></slot>
      </div>
      <div class="bottom-sheet-footer" part="footer">
        <slot name="footer"></slot>
      </div>
    </div>
    <div class="bottom-sheet-floating" part="floating-content">
      <slot name="floating-content"></slot>
    </div>
  </dialog>
`;function Ct(t){const e=getComputedStyle(t);return t.hasAttribute("hidden")||t.getAttribute("aria-hidden")==="true"||e.display==="none"||e.visibility==="hidden"?!1:t.tagName.includes("-")?e.display==="contents"||!!t.getClientRects().length:t.offsetParent!==null||e.position==="fixed"||!!t.getClientRects().length}function j(t){if(!t.shadowRoot)return[];const e=[],n=new Set;function i(o){if(o instanceof HTMLSlotElement){const s=o.assignedElements({flatten:!0});s.length>0?s.forEach(i):Array.from(o.children).forEach(i);return}if(o instanceof HTMLElement&&Ct(o)){if(o.shadowRoot){Array.from(o.shadowRoot.childNodes).forEach(i);return}!n.has(o)&&o.matches(be)&&Ct(o)&&(n.add(o),e.push(o)),Array.from(o.children).forEach(i)}}return Array.from(t.shadowRoot.childNodes).forEach(i),e}function ve(t,e){if(e===t||e.contains(t))return!0;let n=t;for(;n;){if(n===e)return!0;const i=n.getRootNode();if(!(i instanceof ShadowRoot))break;n=i.host}return!1}function Y(t){return t.assignedNodes({flatten:!0}).some(e=>e.nodeType===Node.TEXT_NODE?e.textContent?.trim().length:e.nodeType===Node.ELEMENT_NODE)}class we extends HTMLElement{constructor(){super(),this.isAnimatingClose=!1,this.isSyncingOpenAttribute=!1,this.previousDocumentOverflow="",this.previousBodyOverflow="",this.triggerElement=null;const e=this.attachShadow({mode:"open"});e.append(Nt.content.cloneNode(!0)),this.dialog=e.querySelector(".bottom-sheet-dialog"),this.titleElement=e.querySelector(".bottom-sheet-title"),this.descriptionElement=e.querySelector(".bottom-sheet-description"),this.headerActionsContainer=e.querySelector(".bottom-sheet-header-actions"),this.footerContainer=e.querySelector(".bottom-sheet-footer"),this.floatingContainer=e.querySelector(".bottom-sheet-floating"),this.headerActionsSlot=e.querySelector('slot[name="header-actions"]'),this.footerSlot=e.querySelector('slot[name="footer"]'),this.floatingSlot=e.querySelector('slot[name="floating-content"]'),J+=1,this.titleId=`bottomSheetTitle${J}`,this.descriptionId=`bottomSheetDescription${J}`,this.handleAnimationEndBound=this.handleAnimationEnd.bind(this),this.handleCancelBound=this.handleCancel.bind(this),this.handleClickBound=this.handleClick.bind(this),this.handleKeyDownBound=this.handleKeyDown.bind(this),this.handleSlotChangeBound=this.syncSlotVisibility.bind(this)}static get observedAttributes(){return["description","open","title"]}connectedCallback(){this.dataset.component=et,this.dialog.addEventListener("animationend",this.handleAnimationEndBound),this.dialog.addEventListener("cancel",this.handleCancelBound),this.dialog.addEventListener("click",this.handleClickBound),this.dialog.addEventListener("keydown",this.handleKeyDownBound),this.addEventListener("keydown",this.handleKeyDownBound),this.headerActionsSlot.addEventListener("slotchange",this.handleSlotChangeBound),this.footerSlot.addEventListener("slotchange",this.handleSlotChangeBound),this.floatingSlot.addEventListener("slotchange",this.handleSlotChangeBound),this.syncAttributes(),this.syncSlotVisibility(),this.hasAttribute("open")&&this.openInternal()}disconnectedCallback(){this.dialog.removeEventListener("animationend",this.handleAnimationEndBound),this.dialog.removeEventListener("cancel",this.handleCancelBound),this.dialog.removeEventListener("click",this.handleClickBound),this.dialog.removeEventListener("keydown",this.handleKeyDownBound),this.removeEventListener("keydown",this.handleKeyDownBound),this.headerActionsSlot.removeEventListener("slotchange",this.handleSlotChangeBound),this.footerSlot.removeEventListener("slotchange",this.handleSlotChangeBound),this.floatingSlot.removeEventListener("slotchange",this.handleSlotChangeBound),this.dialog.open&&this.dialog.close(),this.unlockDocumentScroll()}attributeChangedCallback(e){if(e==="open"){if(!this.isConnected||this.isSyncingOpenAttribute)return;this.hasAttribute("open")?this.openInternal():this.startClosing();return}this.syncAttributes()}get open(){return this.hasAttribute("open")}set open(e){this.toggleAttribute("open",e)}openBottomSheet(){this.open&&!this.isAnimatingClose||(this.triggerElement=document.activeElement instanceof HTMLElement?document.activeElement:null,this.open=!0)}closeBottomSheet(){!this.open&&!this.dialog.open||(this.open=!1)}focus(e){(j(this)[0]??this.dialog).focus(e)}syncAttributes(){const e=this.getAttribute("title")||"",n=this.getAttribute("description")||"";this.titleElement.id=this.titleId,this.titleElement.textContent=e,this.titleElement.hidden=e.length===0,this.descriptionElement.id=this.descriptionId,this.descriptionElement.textContent=n,this.descriptionElement.hidden=n.length===0,e.length>0?this.dialog.setAttribute("aria-labelledby",this.titleId):this.dialog.removeAttribute("aria-labelledby"),n.length>0?this.dialog.setAttribute("aria-describedby",this.descriptionId):this.dialog.removeAttribute("aria-describedby")}syncSlotVisibility(){this.headerActionsContainer.hidden=!Y(this.headerActionsSlot),this.footerContainer.hidden=!Y(this.footerSlot),this.floatingContainer.hidden=!Y(this.floatingSlot)}handleAnimationEnd(e){!this.isAnimatingClose||e.target!==this.dialog||(this.dialog.classList.remove("closing"),this.dialog.close(),this.isAnimatingClose=!1,this.unlockDocumentScroll(),this.restoreTriggerFocus(),this.dispatchEvent(new Event("close",{bubbles:!0,composed:!0})))}handleCancel(e){e.preventDefault(),this.closeBottomSheet()}handleClick(e){this.isAnimatingClose||e.target===this.dialog&&this.closeBottomSheet()}handleKeyDown(e){if(e.currentTarget===this&&e.composedPath().includes(this.dialog))return;if(e.key==="Escape"){e.preventDefault(),this.closeBottomSheet();return}if(e.key!=="Tab")return;const n=j(this);if(n.length===0){e.preventDefault(),this.dialog.focus();return}const i=e.composedPath()[0],o=i instanceof HTMLElement?i:document.activeElement instanceof HTMLElement?document.activeElement:null,s=o===null?-1:n.findIndex(u=>ve(o,u)),h=e.shiftKey?-1:1,l=e.shiftKey?n.length-1:0,c=s===-1?l:(s+h+n.length)%n.length;e.preventDefault(),n[c].focus()}openInternal(){this.syncAttributes(),this.syncSlotVisibility(),this.isAnimatingClose&&(this.dialog.classList.remove("closing"),this.isAnimatingClose=!1),this.dialog.open?this.lockDocumentScroll():(this.lockDocumentScroll(),this.dialog.showModal()),requestAnimationFrame(()=>{if(!this.dialog.open)return;(j(this)[0]??this.dialog).focus()})}startClosing(){!this.dialog.open||this.isAnimatingClose||(this.dialog.classList.add("closing"),this.isAnimatingClose=!0)}lockDocumentScroll(){this.previousDocumentOverflow.length===0&&this.previousBodyOverflow.length===0&&(this.previousDocumentOverflow=document.documentElement.style.overflow,this.previousBodyOverflow=document.body.style.overflow),document.documentElement.style.overflow="hidden",document.body.style.overflow="hidden"}unlockDocumentScroll(){document.documentElement.style.overflow=this.previousDocumentOverflow,document.body.style.overflow=this.previousBodyOverflow,this.previousDocumentOverflow="",this.previousBodyOverflow=""}restoreTriggerFocus(){this.triggerElement&&document.contains(this.triggerElement)&&this.triggerElement.focus(),this.triggerElement=null}}function ye(){customElements.get(et)||customElements.define(et,we)}const Se=`:host {
  display: block;
  width: 100%;
}

:host([hidden]) {
  display: none;
  visibility: hidden;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

h2 {
  margin: 0;
}

.card-component {
  background-color: var(--color-bg-input);
  border-radius: var(--radius-lg);
  border: var(--border-01) solid var(--color-border);
  box-shadow: none;
}

.card-component__container {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: var(--color-bg);
  border-radius: inherit;
  padding: var(--spacing-lg);
  box-shadow: none;
}

.card-component__header {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: var(--spacing-sm);
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-component__icon {
  width: 24px;
  height: 24px;
  fill: var(--color-text-secondary);
  margin-right: var(--spacing-xs);
}

.card-component__title {
  font-size: var(--font-size-heading);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.card-component__content {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: var(--spacing-xs);
  gap: var(--spacing-md);
}

.connection-notification {
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-secondary);
  font-size: var(--font-size-label);
}

.connection-notification[hidden] {
  display: none;
}

.connection-notification[data-status="warning"] {
  color: var(--color-text-warning);
}

.connection-notification[data-status="success"] {
  color: var(--color-meter-green);
}

.connection-notification[data-status="error"],
.connection-notification[data-status="danger"] {
  color: var(--color-text-danger);
}

.card-actions {
  margin-top: var(--spacing-xl);
}

.wifi-connection-form__actions {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  gap: var(--spacing-sm);
}

.card-component__footer[hidden] {
  display: none;
}

::slotted(.card-component__description) {
  font-size: var(--font-size-label);
  line-height: 1.5;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-secondary);
}

::slotted([slot="footer"]) {
  width: auto;
}
`,nt="ui-card",$t=document.createElement("template");$t.innerHTML=`
  <style>${Se}</style>
  <div class="card-component">
    <div class="card-component__container">
      <div class="card-component__header">
        <span class="card-icon">
          <span class="card-component__icon"></span>
        </span>
        <h2 class="card-component__title"></h2>
      </div>
      <div
        class="connection-notification"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        hidden
      ></div>
      <div class="card-component__content">
        <slot></slot>
      </div>
      <div class="card-actions wifi-connection-form__actions card-component__footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
`;function Ce(t,e){return t.includes("class=")?t.replace("<svg",`<svg class="${e}"`):t.replace("<svg",`<svg class="${e}"`)}class Te extends HTMLElement{static get observedAttributes(){return["title"]}constructor(){super();const e=this.attachShadow({mode:"open"});e.append($t.content.cloneNode(!0)),this.footerContainer=e.querySelector(".card-component__footer"),this.footerSlot=e.querySelector('slot[name="footer"]'),this.footerSlot.addEventListener("slotchange",()=>{this.syncFooterVisibility()}),this.iconElement=e.querySelector(".card-component__icon"),this.notificationElement=e.querySelector(".connection-notification"),this.titleElement=e.querySelector(".card-component__title")}connectedCallback(){this.dataset.component=nt,this.syncAttributes(),this.syncFooterVisibility()}attributeChangedCallback(){this.syncAttributes()}get iconSvg(){return this.iconElement.innerHTML}set iconSvg(e){this.iconElement.innerHTML=e?Ce(e,"card-component__icon"):""}setNotification(e,n="info"){if(!e){this.notificationElement.hidden=!0,this.notificationElement.textContent="",this.notificationElement.removeAttribute("data-status"),this.notificationElement.setAttribute("role","status"),this.notificationElement.setAttribute("aria-live","polite");return}this.notificationElement.hidden=!1,this.notificationElement.textContent=e,this.notificationElement.setAttribute("data-status",n),n==="error"||n==="danger"?(this.notificationElement.setAttribute("role","alert"),this.notificationElement.setAttribute("aria-live","assertive")):n==="warning"?(this.notificationElement.setAttribute("role","alert"),this.notificationElement.setAttribute("aria-live","polite")):(this.notificationElement.setAttribute("role","status"),this.notificationElement.setAttribute("aria-live","polite"))}syncAttributes(){this.titleElement.textContent=this.getAttribute("title")||""}syncFooterVisibility(){const e=this.footerSlot.assignedElements({flatten:!0}).length>0;this.footerContainer.hidden=!e}}function xe(){customElements.get(nt)||customElements.define(nt,Te)}const Ae=`:host {
  display: block;
  width: 100%;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.form-control {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-control label {
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-regular);
  margin-bottom: var(--spacing-xs);
}

.form-control__input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  gap: var(--spacing-sm);
}

.duration-fields {
  align-items: center;
}

.duration-fields ui-input {
  min-width: 0;
  flex: 1 1 0;
}
`,ke=document.createElement("template");ke.innerHTML=`
  <style>${Ae}</style>
  <div class="form-control">
    <label></label>
    <div class="form-control__input-wrapper duration-fields">
      <ui-input variant="number" inputmode="numeric"></ui-input>
      <ui-input variant="number" inputmode="numeric"></ui-input>
    </div>
  </div>
`;const Ee=`:host {
  display: block;
  width: 100%;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

input,
textarea {
  margin: 0;
  font: inherit;
  color: inherit;
  -webkit-user-select: auto;
}

p {
  margin: 0;
}

.form-control {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-control label {
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-regular);
  margin-bottom: var(--spacing-xs);
}

.form-control__input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  gap: var(--spacing-sm);
}

.form-control__input-wrapper input {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  border: var(--border-01) solid var(--color-border);
  min-height: 44px;
  padding: var(--spacing-sm);
  border-radius: var(--input-radius);
  background-color: var(--color-bg-input);
  color: var(--color-text);
  font-size: var(--font-size-label);
}

.form-control__input-wrapper input:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.form-control__input-wrapper input::file-selector-button {
  background-color: transparent;
  border: var(--border-01) solid var(--color-border);
  background-color: var(--color-bg);
  color: var(--color-text);
  border-radius: var(--radius-sm);
  min-height: 24px;
  font-size: var(--font-size-label);
  padding: var(--spacing-xs) var(--spacing-md);
  margin-right: var(--spacing-md);
}

.progress-bar {
  position: relative;
  width: 100%;
}

.progress-bar[hidden] {
  display: none;
}

.progress-bar progress[value] {
  -webkit-appearance: none;
  appearance: none;
  border: none;
  width: 100%;
  height: 12px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-top: var(--spacing-sm);
}

.progress-bar progress[value]::-webkit-progress-bar {
  background-color: var(--color-bg-active);
  border-radius: var(--radius-lg);
}

.progress-bar progress[value]::-webkit-progress-value {
  background-color: var(--color-meter-green);
  border-radius: var(--radius-lg);
}

.progress-bar__message {
  font-size: var(--font-size-label);
  line-height: 1.25;
  color: var(--color-text-secondary);
  margin-top: var(--spacing-xs);
}

.form-helper-text {
  margin-top: var(--spacing-lg);
  font-size: var(--font-size-caption);
  line-height: 1.5;
  color: var(--color-text-secondary);
}
`,it="ui-file-upload",Ot=document.createElement("template");Ot.innerHTML=`
  <style>${Ee}</style>
  <div class="form-control">
    <label></label>
    <div class="form-control__input-wrapper">
      <input type="file" />
    </div>
    <div class="progress-bar">
      <progress value="0" max="100"></progress>
      <div class="progress-bar__message"></div>
    </div>
    <p class="form-helper-text"></p>
  </div>
`;class _e extends HTMLElement{static get observedAttributes(){return["accept","aria-label","disabled","label","multiple","name","progress-max","progress-message","progress-value","warning-text"]}constructor(){super();const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(Ot.content.cloneNode(!0)),this.helperText=e.querySelector(".form-helper-text"),this.input=e.querySelector("input"),this.labelElement=e.querySelector("label"),this.progressBar=e.querySelector("progress"),this.progressContainer=e.querySelector(".progress-bar"),this.progressMessage=e.querySelector(".progress-bar__message"),this.input.addEventListener("change",n=>{n.stopPropagation(),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}),this.input.addEventListener("input",n=>{n.stopPropagation(),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))})}connectedCallback(){this.dataset.component=it,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get accept(){return this.input.accept}set accept(e){this.setAttribute("accept",e)}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get files(){return this.input.files}get progressHidden(){return this.progressContainer.hidden}set progressHidden(e){this.progressContainer.hidden=e}get progressMax(){return this.progressBar.max}set progressMax(e){this.progressBar.max=e}get progressMessageText(){return this.progressMessage.textContent||""}set progressMessageText(e){this.progressMessage.textContent=e}get progressValue(){return this.progressBar.value}set progressValue(e){this.progressBar.value=e}get value(){return this.input.value}get warningText(){return this.helperText.textContent||""}set warningText(e){this.helperText.textContent=e}focus(e){this.input.focus(e)}syncAttributes(){const e=this.id||"file-upload",n=this.getAttribute("label")||"",i=this.getAttribute("warning-text")||"";this.input.id=e,this.input.accept=this.getAttribute("accept")||"",this.input.disabled=this.disabled,this.tabIndex=this.disabled?-1:0,this.input.multiple=this.hasAttribute("multiple"),this.syncStringAttribute("aria-label"),this.syncStringAttribute("name"),this.hasAttribute("progress-max")&&(this.progressBar.max=Number(this.getAttribute("progress-max"))||100),this.hasAttribute("progress-value")&&(this.progressBar.value=Number(this.getAttribute("progress-value"))||0),this.hasAttribute("progress-message")&&(this.progressMessage.textContent=this.getAttribute("progress-message")||""),this.labelElement.htmlFor=e,this.labelElement.textContent=n,this.labelElement.hidden=n.length===0,this.helperText.textContent=i,this.helperText.hidden=i.length===0}syncStringAttribute(e){const n=this.getAttribute(e);if(n===null){this.input.removeAttribute(e);return}this.input.setAttribute(e,n)}}function Ie(){customElements.get(it)||customElements.define(it,_e)}const Le=`:host {
  display: inline-flex;
  width: 44px;
  height: 44px;
  min-width: 44px;
  vertical-align: middle;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

button {
  all: unset;
  box-sizing: border-box;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  padding: 0;
  border: var(--border-01) solid transparent;
  border-radius: var(--button-radius);
  background-color: var(--color-text-secondary);
  color: var(--color-text-inverse);
  cursor: pointer;
}

button:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

button:disabled {
  background-color: var(--color-bg-mute);
  color: var(--color-text-mute);
  cursor: default;
}

:host([variant="primary"]) button {
  background-color: var(--color-bg-brand);
  color: var(--color-text-inverse);
}

:host([variant="primary"]) button:not(:disabled):is(:hover, :active) {
  background-color: var(--color-bg-brand-hover);
}

:host([variant="secondary"]) button {
  background-color: var(--color-bg-active);
  color: var(--color-fg-active);
}

:host([variant="secondary"]) button:not(:disabled):is(:hover, :active) {
  background-color: var(--color-bg-active);
  color: var(--color-fg-active);
}

:host([variant="outline"]) button {
  background-color: transparent;
  border-color: var(--color-border);
  color: var(--color-text-secondary);
}

:host([variant="outline"]) button:not(:disabled):is(:hover, :active) {
  background-color: var(--color-border);
  border-color: var(--color-border);
}

:host([variant="ghost"]) button {
  background-color: transparent;
  border-color: transparent;
  color: var(--color-text-secondary);
}

:host([variant="ghost"]) button:not(:disabled):is(:hover, :active) {
  background-color: var(--color-overlay);
}

:host([inverse]) button {
  color: var(--color-text-inverse);
}

:host([variant="outline"][inverse]) button {
  border-color: var(--color-text-inverse);
}

:host([variant="outline"][inverse]) button:not(:disabled):is(:hover, :active),
:host([variant="ghost"][inverse]) button:not(:disabled):is(:hover, :active) {
  background-color: var(--color-overlay);
  border-color: var(--color-text-inverse);
}

:host([rounded]) button {
  border-radius: var(--radius-full);
}

::slotted(svg) {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  fill: currentColor;
}
`,ot="ui-icon-button",Ft=document.createElement("template");Ft.innerHTML=`
  <style>${Le}</style>
  <button type="button" part="button">
    <slot></slot>
  </button>
`;function Tt(t){return t==="submit"||t==="reset"?t:"button"}class Be extends HTMLElement{static get observedAttributes(){return["disabled","aria-label","type"]}constructor(){super();const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(Ft.content.cloneNode(!0)),this.button=e.querySelector("button")}connectedCallback(){this.dataset.component=ot,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get type(){return Tt(this.getAttribute("type"))}set type(e){this.setAttribute("type",Tt(e))}focus(e){this.button.focus(e)}click(){this.button.click()}syncAttributes(){this.button.disabled=this.disabled,this.button.type=this.type,this.tabIndex=this.disabled?-1:0;const e=this.getAttribute("aria-label");e?this.button.setAttribute("aria-label",e):this.button.removeAttribute("aria-label")}}function ze(){customElements.get(ot)||customElements.define(ot,Be)}const qe='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/></svg>',Me='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/></svg>',Pe=`:host {
  display: block;
  width: 100%;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

input,
button,
select,
textarea {
  margin: 0;
  font: inherit;
  color: inherit;
}

input,
textarea {
  -webkit-user-select: auto;
}

p {
  margin: 0;
}

.form-control__input-wrapper input,
.password-toggle-btn {
  font: inherit;
}

.form-control {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-control label {
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-regular);
  margin-bottom: var(--spacing-xs);
}

.form-helper-text {
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-caption);
  line-height: 1.25;
  color: var(--color-text-secondary);
}

.form-control__input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  gap: var(--spacing-sm);
}

.form-control__input-wrapper input {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  border: var(--border-01) solid var(--color-border);
  min-height: 44px;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--input-radius);
  background-color: var(--color-bg-input);
  color: var(--color-text);
  font-size: var(--font-size-label);
  line-height: normal;
  appearance: none;
  -webkit-appearance: none;
}

.form-control__input-wrapper input::placeholder {
  color: var(--color-text-mute);
}

.form-control__input-wrapper input[type="time"]::-webkit-calendar-picker-indicator,
.form-control__input-wrapper input[type="date"]::-webkit-calendar-picker-indicator {
  display: none;
  -webkit-appearance: none;
}

.form-control__input-wrapper input:focus-visible,
.password-toggle-btn:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

:host(.error) input,
:host([invalid]) input,
:host([aria-invalid="true"]) input,
.form-control__input-wrapper input.error {
  outline: var(--focus-ring-width) solid var(--color-meter-red);
  outline-offset: var(--focus-ring-offset);
}

.duration-fields {
  align-items: center;
}

.duration-fields input {
  min-width: 0;
  flex: 1 1 0;
}

.duration-fields__unit {
  flex: 0 0 auto;
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-regular);
  color: var(--color-text-secondary);
  text-transform: uppercase;
}

.duration-fields__unit[hidden] {
  display: none;
}

.password-toggle-btn {
  position: absolute;
  right: 6px;
  display: flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: var(--radius-xs);
  background-color: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
}

.password-toggle-btn:disabled {
  color: var(--color-text-mute);
  cursor: default;
}

.password-toggle-btn:not(:disabled):is(:hover, :active) {
  background-color: var(--color-overlay);
}

.password-icon {
  width: 24px;
  height: 24px;
  fill: var(--color-text-secondary);
}
`,rt="ui-input",Dt=document.createElement("template");Dt.innerHTML=`
  <style>${Pe}</style>
  <div class="form-control">
    <label></label>
    <div class="form-control__input-wrapper">
      <input />
      <span class="duration-fields__unit"></span>
    </div>
    <p class="form-helper-text"></p>
  </div>
`;function Ne(t){return t==="number"||t==="password"||t==="time"||t==="date"?t:"text"}function $e(t){return t==="password"||t==="number"||t==="time"||t==="date"?t:"text"}class Oe extends HTMLElement{constructor(){super(),this.isPasswordVisible=!1,this.customValidationMessage="";const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(Dt.content.cloneNode(!0)),this.input=e.querySelector("input"),this.helperText=e.querySelector(".form-helper-text"),this.label=e.querySelector("label"),this.suffix=e.querySelector(".duration-fields__unit"),this.toggleButton=document.createElement("button"),this.wrapper=e.querySelector(".form-control__input-wrapper"),this.toggleButton.className="password-toggle-btn",this.toggleButton.type="button",this.input.addEventListener("input",n=>{this.syncValidationState(),n.stopPropagation(),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))}),this.input.addEventListener("change",n=>{this.syncValidationState(),n.stopPropagation(),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}),this.input.addEventListener("invalid",()=>{this.syncValidationState()}),this.toggleButton.addEventListener("click",()=>{this.togglePasswordVisibility()})}static get observedAttributes(){return["aria-label","aria-invalid","autocomplete","disabled","helper-text","invalid","inputmode","label","max","maxlength","min","name","placeholder","readonly","required","step","suffix","type","value","variant"]}connectedCallback(){this.hasAttribute("variant")||this.setAttribute("variant","text"),this.dataset.component=rt,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get type(){return this.input.type}set type(e){this.setAttribute("type",e)}get value(){return this.input.value}set value(e){this.input.value=e,this.syncValidationState()}focus(e){this.input.focus(e)}select(){this.input.select()}get validationMessage(){return this.input.validationMessage}get validity(){return this.input.validity}get willValidate(){return this.input.willValidate}checkValidity(){const e=this.input.checkValidity();return this.syncValidationState(),e}reportValidity(){const e=this.input.reportValidity();return this.syncValidationState(),e}setCustomValidity(e){this.customValidationMessage=e,this.input.setCustomValidity(e),this.syncValidationState()}syncAttributes(){const e=Ne(this.getAttribute("variant")),n=this.getAttribute("helper-text")||"",i=this.id?`${this.id}Input`:"input",o=this.getAttribute("label")||"",s=this.getAttribute("suffix")||"",h=e==="password"?this.isPasswordVisible?"text":"password":this.getAttribute("type")||$e(e);if(this.input.id=i,this.input.type=h,this.input.disabled=this.disabled,this.tabIndex=this.disabled?-1:0,this.input.readOnly=this.hasAttribute("readonly"),this.input.required=this.hasAttribute("required"),this.syncStringAttribute("aria-label"),this.syncStringAttribute("autocomplete"),this.syncStringAttribute("inputmode"),this.syncStringAttribute("max"),this.syncStringAttribute("maxlength"),this.syncStringAttribute("min"),this.syncStringAttribute("name"),this.syncStringAttribute("placeholder"),this.syncStringAttribute("step"),this.hasAttribute("value")&&this.input.value!==this.getAttribute("value")&&(this.input.value=this.getAttribute("value")||""),this.input.setCustomValidity(this.customValidationMessage),this.label.htmlFor=i,this.label.textContent=o,this.label.hidden=o.length===0,this.helperText.textContent=n,this.helperText.hidden=n.length===0,this.wrapper.classList.toggle("duration-fields",e==="number"),this.suffix.textContent=s,this.suffix.hidden=e!=="number"||s.length===0,n.length>0){const l=`${i}HelperText`;this.helperText.id=l,this.input.setAttribute("aria-describedby",l)}else this.helperText.removeAttribute("id"),this.input.removeAttribute("aria-describedby");e==="password"?(this.toggleButton.isConnected||this.wrapper.append(this.toggleButton),this.toggleButton.disabled=this.disabled,this.toggleButton.setAttribute("aria-label",this.isPasswordVisible?r("Hide password","Nascondi password"):r("Show password","Mostra password")),this.toggleButton.innerHTML=Fe(this.isPasswordVisible?qe:Me,"password-icon")):(this.isPasswordVisible=!1,this.toggleButton.remove()),this.syncValidationState()}syncStringAttribute(e){const n=this.getAttribute(e);if(n===null){this.input.removeAttribute(e);return}this.input.setAttribute(e,n)}togglePasswordVisibility(){this.isPasswordVisible=!this.isPasswordVisible,this.syncAttributes()}syncValidationState(){const e=this.hasAttribute("invalid")||this.getAttribute("aria-invalid")==="true"||!this.input.validity.valid;this.classList.toggle("error",e),this.input.classList.toggle("error",e),this.hasAttribute("invalid")!==e&&this.toggleAttribute("invalid",e),this.getAttribute("aria-invalid")!==String(e)&&this.setAttribute("aria-invalid",String(e)),this.input.getAttribute("aria-invalid")!==String(e)&&this.input.setAttribute("aria-invalid",String(e))}}function Fe(t,e){return t.includes("class=")?t.replace("<svg",`<svg class="${e}"`):t.replace("<svg",`<svg class="${e}"`)}function De(){customElements.get(rt)||customElements.define(rt,Oe)}const He=`:host {
  display: block;
  width: 100%;
}

:host([hidden]) {
  display: none;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

ol,
ul,
menu,
summary {
  margin: 0;
  padding: 0;
  list-style: none;
}

p {
  margin: 0;
}

.networks {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: var(--spacing-lg);
}

.networks__list {
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
  height: 320px;
  overflow-y: auto;
  border: var(--border-01) solid var(--color-border);
  padding: var(--spacing-xs);
  border-radius: var(--radius-lg);
}

.networks__list:focus {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.networks__list-empty-state {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--color-text-secondary);
  font-size: var(--font-size-heading);
}

.wifi-find-icon {
  width: 64px;
  height: 64px;
  fill: var(--color-text-mute);
}

.networks__item {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: var(--spacing-sm) var(--spacing-xs);
  border: var(--border-01) solid transparent;
  min-height: 32px;
  font-size: var(--font-size-label);
  justify-content: space-between;
  border-radius: var(--radius-xs);
}

.networks__item-ssid {
  font-weight: var(--font-weight-semibold);
}

.networks__item-details {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.networks__item ~ .networks__item {
  border-top: var(--border-01) solid var(--color-bg-selected);
}

.networks__item[aria-selected="true"] {
  background-color: var(--color-bg-active);
  outline: var(--focus-ring-width) solid var(--color-fg-active);
  outline-offset: var(--focus-ring-offset);
}

.wifi-security-icon,
.wifi-signal-icon,
.wifi-connected-icon {
  width: 16px;
  height: 16px;
  fill: var(--color-text-secondary);
}
`,at="ui-network-list",Ht="networkList",st="network-list-label",Rt=document.createElement("template");Rt.innerHTML=`
  <style>${He}</style>
  <div class="networks">
    <span id="${st}" hidden>Available networks</span>
    <ul
      id="${Ht}"
      class="networks__list"
      role="listbox"
      aria-labelledby="${st}"
      tabindex="0"
    ></ul>
  </div>
`;class Re extends HTMLElement{static get observedAttributes(){return["aria-label","label"]}constructor(){super();const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(Rt.content.cloneNode(!0)),this.labelElement=e.querySelector(`#${st}`),this.listElement=e.querySelector(`#${Ht}`),this.listElement.addEventListener("keydown",n=>{(n.key==="ArrowDown"||n.key==="ArrowUp"||n.key==="Home"||n.key==="End"||n.key===" ")&&n.preventDefault()})}connectedCallback(){this.tabIndex=0,this.dataset.component=at,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}appendItem(e){this.listElement.appendChild(e)}clearItems(){this.listElement.innerHTML=""}focus(e){this.listElement.focus(e)}getOptions(){return Array.from(this.listElement.querySelectorAll('[role="option"]'))}scrollOptionIntoView(e){const n=this.getOptions()[e];if(!n)return;const i=this.listElement.scrollTop,o=i+this.listElement.clientHeight,s=n.offsetTop,h=s+n.offsetHeight;if(s<i){this.listElement.scrollTop=s;return}h>o&&(this.listElement.scrollTop=h-this.listElement.clientHeight)}setActiveDescendant(e){if(e){this.listElement.setAttribute("aria-activedescendant",e);return}this.listElement.removeAttribute("aria-activedescendant")}setEmptyState(e){this.clearItems(),this.appendItem(e)}syncAttributes(){const e=this.getAttribute("label")||r("Available networks","Reti disponibili"),n=this.getAttribute("aria-label");this.labelElement.textContent=e,n?this.listElement.setAttribute("aria-label",n):this.listElement.removeAttribute("aria-label")}}function Ge(){customElements.get(at)||customElements.define(at,Re)}const Ve=`:host {
  display: block;
  width: 100%;
}

:host([hidden]) {
  display: none;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.wifi-status-card {
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  background-color: var(--color-bg-brand);
  padding: var(--spacing-md) var(--spacing-md);
  border-radius: var(--radius-lg);
}

.wifi-status-card__content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  width: 100%;
}

.wifi-status-card__content .wifi-icon {
  width: 32px;
  height: 32px;
  fill: var(--color-text-inverse);
}

.wifi-status-card__actions {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-left: auto;
}

.wifi-status-card__status {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  min-width: 0;
}

.wifi-status-card__label {
  font-size: var(--font-size-label);
  color: var(--color-text-inverse);
  font-weight: var(--font-weight-medium);
}

.wifi-status-card__network {
  font-size: var(--font-size-label);
  color: var(--color-text-inverse);
  font-weight: var(--font-weight-semibold);
  min-width: 0;
  overflow-wrap: anywhere;
}
`,lt="ui-network-status",Gt="actionBtn",Vt="settingsBtn",Kt="wifiStatusLabel",Ut="wifiStatusIcon",Wt="wifiStatusNetwork",Zt=document.createElement("template");Zt.innerHTML=`
  <style>${Ve}</style>
  <div class="wifi-status-card">
    <div class="wifi-status-card__content">
      <div class="wifi-status-card__status">
        <span class="card-icon" id="${Ut}"></span>
        <span id="${Kt}" class="wifi-status-card__label">
          Disconnected
        </span>
        <span
          id="${Wt}"
          class="wifi-status-card__network"
        ></span>
      </div>
      <div class="wifi-status-card__actions">
        <ui-button
          id="${Gt}"
          variant="outline"
          inverse
          aria-label="Connect"
        >
          Connect
        </ui-button>
        <ui-button
          id="${Vt}"
          variant="outline"
          inverse
          aria-label="Settings"
        >
          Settings
        </ui-button>
      </div>
    </div>
  </div>
`;function Ke(t,e){return t.includes("class=")?t.replace("<svg",`<svg class="${e}"`):t.replace("<svg",`<svg class="${e}"`)}class Ue extends HTMLElement{static get observedAttributes(){return["action-label","network","status-label"]}constructor(){super();const e=this.attachShadow({mode:"open"});e.append(Zt.content.cloneNode(!0)),this.actionButton=e.querySelector(`#${Gt}`),this.actionButton.addEventListener("click",n=>{n.stopPropagation(),this.dispatchEvent(new Event("action",{bubbles:!0,composed:!0}))}),this.iconElement=e.querySelector(`#${Ut}`),this.labelElement=e.querySelector(`#${Kt}`),this.networkElement=e.querySelector(`#${Wt}`),this.settingsButton=e.querySelector(`#${Vt}`),this.settingsButton.addEventListener("click",n=>{n.stopPropagation(),this.dispatchEvent(new Event("settings",{bubbles:!0,composed:!0}))})}connectedCallback(){this.dataset.component=lt,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get actionDisabled(){return!!this.actionButton.disabled}set actionDisabled(e){this.actionButton.disabled=e}get iconSvg(){return this.iconElement.innerHTML}set iconSvg(e){this.iconElement.innerHTML=e?Ke(e,"wifi-icon"):""}get network(){return this.getAttribute("network")||""}set network(e){this.setAttribute("network",e)}get actionLabel(){return this.getAttribute("action-label")||r("Connect","Connetti")}set actionLabel(e){this.setAttribute("action-label",e)}get statusLabel(){return this.getAttribute("status-label")||r("Disconnected","Disconnesso")}set statusLabel(e){this.setAttribute("status-label",e)}syncAttributes(){this.actionButton.textContent=this.actionLabel,this.actionButton.setAttribute("aria-label",this.actionLabel),this.labelElement.textContent=this.statusLabel,this.networkElement.textContent=this.network,this.networkElement.hidden=this.network.length===0}}function We(){customElements.get(lt)||customElements.define(lt,Ue)}const Ze=`:host {
  display: block;
  width: 100%;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

input,
textarea {
  margin: 0;
  font: inherit;
  color: inherit;
  -webkit-user-select: auto;
}

.form-control {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-control label {
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-regular);
  margin-bottom: var(--spacing-xs);
}

.range-slider {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.range-slider__range {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 34px;
  border-radius: var(--radius-full);
  background: var(--color-bg-input);
  outline: none;
}

.range-slider__range:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.range-slider__range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--color-bg);
  border: var(--border-03) solid var(--color-bg-brand);
  box-shadow: 0px 2px 6px -2px rgba(32, 32, 32, 0.4);
  cursor: pointer;
  transition: background 0.15s ease-in-out;
}

.range-slider__range::-webkit-slider-thumb:hover {
  background: var(--color-bg);
}

.range-slider__range:active::-webkit-slider-thumb {
  background: var(--color-bg);
}

.range-slider__range::-moz-range-thumb {
  width: 30px;
  height: 30px;
  border: var(--border-03) solid var(--color-bg-brand);
  border-radius: 50%;
  background: var(--color-bg);
  box-shadow: 0px 2px 6px -2px rgba(32, 32, 32, 0.4);
  cursor: pointer;
  transition: background 0.15s ease-in-out;
}

.range-slider__range::-moz-range-thumb:hover {
  background: var(--color-bg);
}

.range-slider__range:active::-moz-range-thumb {
  background: var(--color-bg);
}

.range-slider__value {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  height: 28px;
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-inverse);
  background: var(--color-bg-brand);
  border-radius: var(--radius-md);
}
`,Je=document.createElement("template");Je.innerHTML=`
  <style>${Ze}</style>
  <div class="form-control">
    <label></label>
    <div class="range-slider">
      <input class="range-slider__range" type="range" />
      <span class="range-slider__value"></span>
    </div>
  </div>
`;const je='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-80 240-320l57-57 183 183 183-183 57 57L480-80ZM298-584l-58-56 240-240 240 240-58 56-182-182-182 182Z"/></svg>',Ye=`:host {
  display: block;
  width: 100%;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

input,
button,
select,
textarea {
  margin: 0;
  font: inherit;
  color: inherit;
}

input,
textarea {
  -webkit-user-select: auto;
}

p {
  margin: 0;
}

.form-control {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-control label {
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-regular);
  margin-bottom: var(--spacing-xs);
}

.form-helper-text {
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-caption);
  line-height: 1.25;
  color: var(--color-text-secondary);
}

.form-control__input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  gap: var(--spacing-sm);
}

.form-control__input-wrapper select {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  border: var(--border-01) solid var(--color-border);
  min-height: 44px;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--input-radius);
  background-color: var(--color-bg-input);
  color: var(--color-text);
  font-size: var(--font-size-label);
  line-height: normal;
  appearance: none;
  -webkit-appearance: none;
}

.select-icon {
  position: absolute;
  width: 32px;
  height: 18px;
  background-color: transparent;
  border-radius: var(--radius-xs);
  right: 2px;
  fill: var(--color-text-secondary);
  pointer-events: none;
}

.form-control__input-wrapper select:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

:host(.error) select,
:host([invalid]) select,
:host([aria-invalid="true"]) select,
.form-control__input-wrapper select.error {
  outline: var(--focus-ring-width) solid var(--color-meter-red);
  outline-offset: var(--focus-ring-offset);
}
`,ct="ui-select",Jt=document.createElement("template");Jt.innerHTML=`
  <style>${Ye}</style>
  <div class="form-control">
    <label></label>
    <div class="form-control__input-wrapper">
      <select></select>
      <span class="select-icon"></span>
    </div>
    <p class="form-helper-text"></p>
  </div>
`;class Xe extends HTMLElement{constructor(){super(),this.customValidationMessage="";const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(Jt.content.cloneNode(!0)),this.helperText=e.querySelector(".form-helper-text"),this.labelElement=e.querySelector("label"),this.select=e.querySelector("select");const n=e.querySelector(".select-icon");n.innerHTML=tn(je,"select-icon"),this.select.addEventListener("change",i=>{this.syncValidationState(),i.stopPropagation(),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}),this.select.addEventListener("input",i=>{this.syncValidationState(),i.stopPropagation(),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))}),this.select.addEventListener("invalid",()=>{this.syncValidationState()})}static get observedAttributes(){return["aria-invalid","aria-label","disabled","helper-text","invalid","label","name","required","value"]}connectedCallback(){this.moveLightDomOptions(),this.dataset.component=ct,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get innerHTML(){return this.select.innerHTML}set innerHTML(e){this.select.innerHTML=e,this.syncValidationState()}get value(){return this.select.value}set value(e){this.select.value=e,this.syncValidationState()}appendChild(e){return e instanceof HTMLOptionElement||e instanceof HTMLOptGroupElement?(this.select.appendChild(e),e):super.appendChild(e)}focus(e){this.select.focus(e)}get validationMessage(){return this.select.validationMessage}get validity(){return this.select.validity}get willValidate(){return this.select.willValidate}checkValidity(){const e=this.select.checkValidity();return this.syncValidationState(),e}reportValidity(){const e=this.select.reportValidity();return this.syncValidationState(),e}setCustomValidity(e){this.customValidationMessage=e,this.select.setCustomValidity(e),this.syncValidationState()}moveLightDomOptions(){Array.from(this.children).forEach(e=>{(e instanceof HTMLOptionElement||e instanceof HTMLOptGroupElement)&&this.select.appendChild(e)})}syncAttributes(){const e=this.getAttribute("helper-text")||"",n=this.id?`${this.id}Select`:"select",i=this.getAttribute("label")||"";if(this.select.id=n,this.select.disabled=this.disabled,this.tabIndex=this.disabled?-1:0,this.select.required=this.hasAttribute("required"),this.syncStringAttribute("aria-label"),this.syncStringAttribute("name"),this.hasAttribute("value")&&(this.select.value=this.getAttribute("value")||""),this.select.setCustomValidity(this.customValidationMessage),this.labelElement.htmlFor=n,this.labelElement.textContent=i,this.labelElement.hidden=i.length===0,this.helperText.textContent=e,this.helperText.hidden=e.length===0,e.length>0){const o=`${n}HelperText`;this.helperText.id=o,this.select.setAttribute("aria-describedby",o)}else this.helperText.removeAttribute("id"),this.select.removeAttribute("aria-describedby");this.syncValidationState()}syncStringAttribute(e){const n=this.getAttribute(e);if(n===null){this.select.removeAttribute(e);return}this.select.setAttribute(e,n)}syncValidationState(){const e=this.hasAttribute("invalid")||this.getAttribute("aria-invalid")==="true"||!this.select.validity.valid;this.classList.toggle("error",e),this.select.classList.toggle("error",e),this.hasAttribute("invalid")!==e&&this.toggleAttribute("invalid",e),this.getAttribute("aria-invalid")!==String(e)&&this.setAttribute("aria-invalid",String(e)),this.select.getAttribute("aria-invalid")!==String(e)&&this.select.setAttribute("aria-invalid",String(e))}}function Qe(){customElements.get(ct)||customElements.define(ct,Xe)}function tn(t,e){return t.includes("class=")?t.replace("<svg",`<svg class="${e}"`):t.replace("<svg",`<svg class="${e}"`)}const en=`:host {
  display: block;
  width: 100%;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.form-control {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.switch-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.switch-label {
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-medium);
  flex-shrink: 0;
}

button {
  all: unset;
  box-sizing: border-box;
  position: relative;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  width: 62px;
  height: 34px;
  padding: 0;
  border: none;
  border-radius: var(--radius-full);
  background-color: var(--color-bg-input);
  color: inherit;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.switch-label[hidden] {
  display: none;
}

button[data-checked] {
  background-color: var(--color-bg-brand);
}

button::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  opacity: 0;
  box-shadow: 0 0 0 var(--focus-ring-width) currentColor;
  transition: opacity 0.2s ease;
}

button:focus-visible::before {
  opacity: 0.35;
}

.knob {
  position: absolute;
  left: 2px;
  width: 30px;
  height: 30px;
  border-radius: var(--radius-full);
  background-color: var(--color-fg-knob-off);
  box-shadow: 0 2px 6px -2px rgba(32, 32, 32, 0.4);
  transition:
    transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    background-color 0.2s ease;
}

button[data-checked] .knob {
  background-color: var(--color-fg-knob-on);
}
`,dt="ui-toggle",jt=document.createElement("template");jt.innerHTML=`
  <style>${en}</style>
  <div class="form-control">
    <div class="switch-container">
      <button type="button" part="button">
        <span class="knob"></span>
      </button>
      <span class="switch-label"></span>
    </div>
  </div>
`;function xt(t){return t==="submit"||t==="reset"?t:"button"}class nn extends HTMLElement{static get observedAttributes(){return["aria-checked","aria-label","disabled","label","type"]}constructor(){super();const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(jt.content.cloneNode(!0)),this.button=e.querySelector("button"),this.knob=e.querySelector(".knob"),this.labelElement=e.querySelector(".switch-label"),this.labelElement.addEventListener("click",()=>{this.disabled||this.button.click()})}connectedCallback(){this.hasAttribute("role")||this.setAttribute("role","switch"),this.hasAttribute("aria-checked")||this.setAttribute("aria-checked","false"),this.dataset.component=dt,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get type(){return xt(this.getAttribute("type"))}set type(e){this.setAttribute("type",xt(e))}focus(e){this.button.focus(e)}click(){this.button.click()}syncAttributes(){const e=this.getAttribute("aria-checked")==="true",n=this.getAttribute("aria-label"),i=this.getAttribute("label")||"";this.button.disabled=this.disabled,this.button.type=this.type,this.tabIndex=this.disabled?-1:0,this.button.setAttribute("role","switch"),this.button.setAttribute("aria-checked",String(e)),n?this.button.setAttribute("aria-label",n):this.button.removeAttribute("aria-label"),this.button.toggleAttribute("data-checked",e),this.knob.style.transform=e?"translateX(28px)":"translateX(0)",this.labelElement.textContent=i,this.labelElement.hidden=i.length===0}}function on(){customElements.get(dt)||customElements.define(dt,nn)}const rn=`:host {
  display: contents;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.toast-dialog {
  position: fixed;
  left: 50%;
  bottom: var(--spacing-4xl);
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: inherit;
  width: min(50vw, calc(100vw - 2rem));
  max-width: calc(100vw - 2rem);
  pointer-events: none;
  z-index: 30;
}

.toast-dialog[open] {
  display: block;
  animation: toast-dialog-fade 2.6s ease forwards;
}

.toast-dialog::backdrop {
  display: none;
}

.toast-dialog__message {
  margin: 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-lg);
  min-height: 44px;
  overflow: hidden;
  border: var(--border-01) solid var(--color-meter-green);
  border-radius: var(--radius-lg);
  background: var(--color-bg-active);
  color: var(--color-text);
  box-shadow: 0 0.5rem 1.25rem var(--color-overlay);
  font-size: var(--font-size-label);
  line-height: 1.25;
  text-align: center;
  text-overflow: ellipsis;
}

.toast-dialog[data-status='error'] .toast-dialog__message,
.toast-dialog[data-status='danger'] .toast-dialog__message {
  border-color: var(--color-text-danger);
  background: var(--color-bg-danger);
  color: var(--color-text-danger);
}

.toast-dialog[data-status='warning'] .toast-dialog__message {
  border-color: var(--color-meter-yellow);
  background: var(--color-bg-selected);
  color: var(--color-text-warning);
}

@keyframes toast-dialog-fade {
  0% {
    opacity: 0;
    transform: translate(-50%, 0.75rem);
  }

  12%,
  78% {
    opacity: 1;
    transform: translate(-50%, 0);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -0.25rem);
  }
}
`,ut="ui-toast",Yt=document.createElement("template");Yt.innerHTML=`
  <style>${rn}</style>
  <dialog class="toast-dialog" aria-live="polite">
    <p class="toast-dialog__message"></p>
  </dialog>
`;function At(t){return t==="success"||t==="info"||t==="warning"||t==="error"||t==="danger"?t:null}class an extends HTMLElement{static get observedAttributes(){return["aria-label","message","status"]}constructor(){super();const e=this.attachShadow({mode:"open"});e.append(Yt.content.cloneNode(!0)),this.dialog=e.querySelector("dialog"),this.messageElement=e.querySelector(".toast-dialog__message")}connectedCallback(){this.dataset.component=ut,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get message(){return this.messageElement.textContent||""}set message(e){this.setAttribute("message",e)}get status(){return At(this.getAttribute("status"))}set status(e){if(e){this.setAttribute("status",e);return}this.removeAttribute("status")}show(e,n){typeof e=="string"&&(this.message=e),n&&(this.status=n),this.dialog.open||this.dialog.show()}close(e){this.dialog.close(e)}syncAttributes(){const e=this.getAttribute("aria-label"),n=this.getAttribute("message")||"",i=At(this.getAttribute("status"));e?this.dialog.setAttribute("aria-label",e):this.dialog.removeAttribute("aria-label"),this.messageElement.textContent=n,this.messageElement.id=this.id?`${this.id}Message`:"statusToastMessage",this.dialog.id=this.id||"statusToast",i?this.dialog.setAttribute("data-status",i):this.dialog.removeAttribute("data-status")}}function sn(){customElements.get(ut)||customElements.define(ut,an)}const ln='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m109-531-85-85q92-89 210-136.5T480-800q128 0 246 47.5T936-616l-85 85q-75-72-171-110.5T480-680q-104 0-200 38.5T109-531Zm169 169-84-84q59-55 132.5-84.5T480-560q80 0 153.5 29.5T766-446l-84 84q-42-38-93.5-58T480-440q-57 0-108.5 20T278-362Zm202 202q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Z"/></svg>',cn='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/></svg>',dn='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q96-98 220-149t260-51q137 0 261 51t219 149L480-120ZM361-353q25-18 55.5-28t63.5-10q33 0 63.5 10t55.5 28l245-245q-78-59-170.5-90.5T480-720q-101 0-193.5 31.5T116-598l245 245Z"/></svg>',un='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q96-98 220-149t260-51q137 0 261 51t219 149L480-120ZM299-415q38-28 84-43.5t97-15.5q51 0 97 15.5t84 43.5l183-183q-78-59-170.5-90.5T480-720q-101 0-193.5 31.5T116-598l183 183Z"/></svg>',hn='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q96-98 220-149t260-51q137 0 261 51t219 149L480-120ZM232-482q53-38 116-59.5T480-563q69 0 132 21.5T728-482l116-116q-78-59-170.5-90.5T480-720q-101 0-193.5 31.5T116-598l116 116Z"/></svg>',gn='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q95-97 219.5-148.5T480-800q136 0 260.5 51.5T960-600L480-120Z"/></svg>',mn='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-601q93-93 215.5-146T480-800q142 0 264.5 53T960-601l-56 57q-81-81-190-128.5T480-720q-103 0-195 32.5T117-597l419 420-56 57Zm384-40L761-262q-18 11-38 16.5t-43 5.5q-68 0-114-46t-46-114q0-68 46-114t114-46q68 0 114 46t46 114q0 23-5.5 43T818-319l102 103-56 56ZM680-320q34 0 57-23t23-57q0-34-23-57t-57-23q-34 0-57 23t-23 57q0 34 23 57t57 23ZM480-177Z"/></svg>',pn='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M280-240q-100 0-170-70T40-480q0-100 70-170t170-70q66 0 121 33t87 87h432v240h-80v120H600v-120H488q-32 54-87 87t-121 33Zm0-80q66 0 106-40.5t48-79.5h246v120h80v-120h80v-80H434q-8-39-48-79.5T280-640q-66 0-113 47t-47 113q0 66 47 113t113 47Zm0-80q33 0 56.5-23.5T360-480q0-33-23.5-56.5T280-560q-33 0-56.5 23.5T200-480q0 33 23.5 56.5T280-400Zm0-80Z"/></svg>',fn='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>',bn='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/></svg>',vn='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m720-80 120-120-28-28-72 72v-164h-40v164l-72-72-28 28L720-80ZM480-800 243-663l237 137 237-137-237-137ZM120-321v-318q0-22 10.5-40t29.5-29l280-161q10-5 19.5-8t20.5-3q11 0 21 3t19 8l280 161q19 11 29.5 29t10.5 40v159h-80v-116L479-434 200-596v274l240 139v92L160-252q-19-11-29.5-29T120-321ZM720 0q-83 0-141.5-58.5T520-200q0-83 58.5-141.5T720-400q83 0 141.5 58.5T920-200q0 83-58.5 141.5T720 0ZM480-491Z"/></svg>',kt=`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm80 240v-80h400v80H280Zm0 160v-80h280v80H280Z"/></svg>
`,wn={"Content-Type":"application/json",Accept:"application/json"},X=64,yn=2e3,Sn=8,Cn=2e3,Tn=8,xn=3e3,An=750,kn=20,En="/api/settings",_n=`${En}/time`,In="/api/runtime/time",Ln=1e4;async function E(t,e){const n=new AbortController,i=setTimeout(()=>n.abort(),Ln);let o;try{o=await fetch(t,{cache:"no-store",...e,signal:e?.signal??n.signal,headers:{...wn,...e?.headers||{}}})}catch(c){throw n.signal.aborted?new Error(r(`Request to ${t} timed out. Check the device is still reachable.`,`La richiesta a ${t} è scaduta. Controlla che il dispositivo sia raggiungibile.`)):c}finally{clearTimeout(i)}const s=o.headers.get("content-type")||"",h=await o.text();if(!s.includes("application/json"))throw new Error(r(`Unexpected response for ${t}. Make sure you are connected to the device AP and loading the portal from the ESP32.`,`Risposta inattesa da ${t}. Assicurati di essere connesso alla rete del dispositivo e di aprire il portale da lì.`));const l=JSON.parse(h);if(typeof l.message=="string"&&(l.message=M(l.message)),!o.ok||l.success!==!0)throw new Error(l.message||r("Request failed.","Richiesta non riuscita."));return l}const Bn=(t,e)=>E(t,e),zn=(t,e)=>E(t,e),qn=(t,e)=>E(t,e),Xt=(t,e)=>E(t,e),Mn=(t,e)=>E(t,e),Q="/api/settings/calendar",Pn="/api/calendar/refresh",Nn=3e3;function $n(t){let e=null,n=!1,i;function o(g){const w=new Date(g*1e3),f=S=>String(S).padStart(2,"0");return qt()?`${f(w.getDate())}/${f(w.getMonth()+1)} ${f(w.getHours())}:${f(w.getMinutes())}`:w.toLocaleString("en-US",{month:"numeric",day:"numeric",hour:"numeric",minute:"2-digit"})}function s(){const g=e?.settings?.calendars??[],w=e?.settings?.max??3;if(t.list.replaceChildren(),g.length>0){const T=document.createElement("h3");T.className="saved-networks__title",T.textContent=r(`Calendars (${g.length}/${w})`,`Calendari (${g.length}/${w})`),t.list.appendChild(T);const k=document.createElement("ul");k.className="saved-networks__list",g.forEach((_,N)=>{const I=document.createElement("li");I.className="saved-networks__item";const L=document.createElement("span");L.className="saved-networks__ssid",L.textContent=_.name?`${_.name} · ${_.masked_url}`:_.masked_url,I.appendChild(L);const d=document.createElement("ui-button");d.setAttribute("variant","secondary"),d.textContent=r("Remove","Rimuovi"),d.disabled=n,d.addEventListener("click",()=>{u(N)}),I.appendChild(d),k.appendChild(I)}),t.list.appendChild(k)}const f=e?.runtime,S=t.statusText;if(!f||g.length===0)S.hidden=!0;else if(S.hidden=!1,f.fetching)S.textContent=r("Downloading the calendar...","Download del calendario in corso...");else if(f.last_error){const T=/^Calendar (\d+): (.*)$/.exec(f.last_error),k=T?`${r("Calendar","Calendario")} ${T[1]}: ${M(T[2])}`:M(f.last_error);S.textContent=`${r("Last update failed","Ultimo aggiornamento non riuscito")}: ${k}`}else if((f.last_success_epoch??0)>0){const T=f.event_count??0;S.textContent=r(`Updated ${o(f.last_success_epoch??0)}: ${T} events in the next 7 days.`,`Aggiornato il ${o(f.last_success_epoch??0)}: ${T} impegni nei prossimi 7 giorni.`)}else f.network_connected?S.textContent=r("Not downloaded yet.","Non ancora scaricato."):S.textContent=r("Waiting for Wi-Fi: the device downloads the calendar once it is online.","In attesa del Wi-Fi: il dispositivo scarica il calendario appena è online.");t.addButton.disabled=n||g.length>=w,t.refreshButton.disabled=n||g.length===0,t.refreshButton.hidden=g.length===0}async function h(){window.clearTimeout(i);try{e=await E(Q)}catch(g){console.error("Calendar settings failed:",g),t.list.closest("ui-card")?.setAttribute("hidden","");return}s(),e?.runtime?.fetching&&!document.hidden&&(i=window.setTimeout(()=>{h()},Nn))}async function l(g,w,f){if(n)return!1;let S=!1;n=!0,s();try{e=await E(g,w),t.notify(f,"success"),S=!0}catch(T){t.notify(T instanceof Error?T.message:r("Request failed.","Richiesta non riuscita."),"error")}finally{n=!1,s(),window.clearTimeout(i),i=window.setTimeout(()=>{h()},1500)}return S}async function c(){const g=t.urlInput.value.trim();if(!g){t.notify(r("Paste the calendar link first.","Incolla prima il link del calendario."),"warning");return}await l(Q,{method:"PATCH",body:JSON.stringify({add_url:g})},r("Calendar added.","Calendario aggiunto."))&&(t.urlInput.value="")}async function u(g){await l(Q,{method:"PATCH",body:JSON.stringify({remove_index:g})},r("Calendar removed.","Calendario rimosso."))}async function p(){await l(Pn,{method:"POST"},r("Updating the calendar...","Aggiornamento del calendario..."))}return{load:h,addCalendar:c,refresh:p}}const Et="/api/settings/calendar-bridge",On="/api/calendar-bridge/test",Fn=2500;function Dn(t){let e=null,n=!1,i;function o(){const u=e?.settings?.configured===!0,p=e?.runtime,g=[];if(u){switch(g.push(`${r("Bridge","Ponte")}: ${e?.settings?.masked_url??""}`),p?.test_state){case"running":g.push(r("Testing the bridge...","Prova del ponte in corso..."));break;case"ok":g.push(r(`Working: events go to the "${p.test_message||"Taccuino"}" calendar.`,`Funziona: gli eventi vanno nel calendario "${p.test_message||"Taccuino"}".`));break;case"error":g.push(`${r("Test failed","Prova non riuscita")}: ${M(p.test_message??"")}`);break}const w=p?.outbox_count??0;w>0&&g.push(r(`${w} events waiting to be sent.`,`${w} eventi in attesa di invio.`)),p?.last_write_error&&p.test_state!=="error"&&g.push(`${r("Last send failed","Ultimo invio non riuscito")}: ${M(p.last_write_error)}`)}t.statusText.hidden=g.length===0,t.statusText.textContent=g.join(" · "),t.testButton.hidden=!u,t.testButton.disabled=n||p?.test_state==="running",t.saveButton.disabled=n,t.saveButton.textContent=u?r("Save / Remove","Salva / Rimuovi"):r("Save","Salva")}function s(){window.clearTimeout(i),e?.runtime?.test_state==="running"&&!document.hidden&&(i=window.setTimeout(()=>{h()},Fn))}async function h(){try{e=await E(Et)}catch(u){console.error("Calendar bridge settings failed:",u),t.statusText.closest("ui-card")?.setAttribute("hidden","");return}o(),s()}async function l(){if(n)return;const u=t.urlInput.value.trim(),p=t.secretInput.value.trim();n=!0,o();try{e=await E(Et,{method:"PATCH",body:JSON.stringify({url:u,secret:p})}),t.secretInput.value="",t.notify(u||p?r("Bridge saved: testing it...","Ponte salvato: lo provo..."):r("Bridge removed.","Ponte rimosso."),"success"),(u||p)&&(e.runtime={...e.runtime??{},test_state:"running"})}catch(g){t.notify(g instanceof Error?g.message:r("Request failed.","Richiesta non riuscita."),"error")}finally{n=!1,o(),s()}}async function c(){if(!n){n=!0,o();try{e=await E(On,{method:"POST"}),e.runtime={...e.runtime??{},test_state:"running"}}catch(u){t.notify(u instanceof Error?u.message:r("Request failed.","Richiesta non riuscita."),"error")}finally{n=!1,o(),s()}}}return{load:h,save:l,test:c}}function y(t){const e=document.getElementById(t);if(!e)throw new Error(`Required portal element "#${t}" was not found.`);return e}function Hn(){return{wifiStatusCard:y("wifiStatusCard"),wifiSettingsSheet:y("wifiSettingsSheet"),wifiSettingsCloseBtn:y("wifiSettingsCloseBtn"),wifiSettingsNotification:y("wifiSettingsNotification"),networkList:y("networkList"),passwordInput:y("password"),scanBtn:y("scanBtn"),connectBtn:y("connectBtn"),savedNetworks:y("savedNetworks"),geminiCard:y("geminiCard"),geminiApiKeyInput:y("geminiApiKeyInput"),geminiClearBtn:y("geminiClearBtn"),geminiSaveBtn:y("geminiSaveBtn"),geminiStatusText:y("geminiStatusText"),timezoneLocationCard:y("timezoneLocationCard"),timezoneSelect:y("timezoneSelect"),autoTimeToggle:y("autoTimeToggle"),timeSyncStatus:y("timeSyncStatus"),manualTimeInput:y("manualTimeInput"),manualDateInput:y("manualDateInput"),timezoneLocationClearBtn:y("timezoneLocationClearBtn"),timezoneLocationSaveBtn:y("timezoneLocationSaveBtn"),calendarCard:y("calendarCard"),calendarList:y("calendarList"),calendarUrlInput:y("calendarUrlInput"),calendarStatus:y("calendarStatus"),calendarAddBtn:y("calendarAddBtn"),calendarRefreshBtn:y("calendarRefreshBtn"),bridgeCard:y("bridgeCard"),bridgeUrlInput:y("bridgeUrlInput"),bridgeSecretInput:y("bridgeSecretInput"),bridgeStatus:y("bridgeStatus"),bridgeTestBtn:y("bridgeTestBtn"),bridgeSaveBtn:y("bridgeSaveBtn"),firmwareCard:y("firmwareCard"),firmwareVersionText:y("firmwareVersionText"),firmwareFileInput:y("firmwareFileInput"),firmwareCodeInput:y("firmwareCodeInput"),firmwareCodeBtn:y("firmwareCodeBtn"),firmwareUpdateBtn:y("firmwareUpdateBtn")}}function R(t){return(e,n="info")=>{t.setNotification(e,n)}}function Rn(t){return(e,n="info")=>{if(!e){t.hidden=!0,t.textContent="",t.removeAttribute("data-status"),t.setAttribute("role","status"),t.setAttribute("aria-live","polite");return}t.hidden=!1,t.textContent=e,t.setAttribute("data-status",n),n==="error"||n==="danger"?(t.setAttribute("role","alert"),t.setAttribute("aria-live","assertive")):n==="warning"?(t.setAttribute("role","alert"),t.setAttribute("aria-live","polite")):(t.setAttribute("role","status"),t.setAttribute("aria-live","polite"))}}function G(t){t.classList.remove("error"),t.removeAttribute("invalid"),t.setAttribute("aria-invalid","false"),t.setCustomValidity?.("")}function V(t,e){t.classList.add("error"),t.setAttribute("invalid",""),t.setAttribute("aria-invalid","true"),t.setCustomValidity?.(e)}function Gn(t,e){t.setAttribute("aria-checked",e?"true":"false")}function Vn(t){return t.getAttribute("aria-checked")==="true"}function Kn(t,e){return t.includes("class=")?t.replace("<svg",`<svg class="${e}"`):t.replace("<svg",`<svg class="${e}"`)}function Un(t){return new Promise(e=>{setTimeout(e,t)})}function Wn(){const t=document.documentElement.lang?.trim();return t||"en-US"}function Zn(t){try{return new Intl.DateTimeFormat(Wn(),{hour:"numeric",timeZone:t,timeZoneName:"longGeneric"}).formatToParts(new Date).find(i=>i.type==="timeZoneName")?.value?.trim()||""}catch(e){return console.warn(`Failed to format timezone label for "${t}".`,e),""}}function _t(t){return/^(GMT|UTC)(?:[+-]\d{1,2}(?::\d{2})?)?$/.test(t)}function Jn(t){return(t.split("/").pop()||t).replace(/_/g," ")}function Qt(t){return t.split("/").map(e=>e.replace(/_/g," ")).join(" / ")}function jn(t){const e=t.map(o=>{const s=Zn(o.name);return{cityLabel:Jn(o.name),genericLabel:s,name:o.name}}),n=new Map(e.map(o=>[o.name,o])),i=new Map;return e.forEach(o=>{!o.genericLabel||_t(o.genericLabel)||i.set(o.genericLabel,(i.get(o.genericLabel)||0)+1)}),new Map(t.map(o=>{const s=n.get(o.name),h=Mt(o.description?.trim()||"");if(s?.genericLabel&&!_t(s.genericLabel)){const c=(i.get(s.genericLabel)||0)>1?`${s.genericLabel} (${s.cityLabel})`:s.genericLabel;return[o.name,c]}return h?[o.name,h]:[o.name,Qt(o.name)]}))}function Yn(t,e){return e.get(t.name)||Mt(t.description?.trim()||"")||Qt(t.name)}function Xn(t){const e=t.value.trim();if(!e)return null;const n=/^(\d{2}):(\d{2})$/.exec(e);if(!n)return null;const i=Number.parseInt(n[1],10),o=Number.parseInt(n[2],10);return!Number.isFinite(i)||!Number.isFinite(o)||i<0||i>23||o<0||o>59?null:i*60+o}const Qn="/api/ota/status",ti="/api/ota/code",ei="/api/ota/upload";function ni(t){let e=!1,n=0;const i=(u,p="info")=>{t.card.setNotification(u,p)};function o(u){e=u,t.codeButton.disabled=u,t.updateButton.disabled=u,t.fileInput.disabled=u}async function s(){try{const u=await E(Qn);n=u.max_size??0,t.versionText.textContent=r(`Installed version: ${u.version??"?"}`,`Versione installata: ${u.version??"?"}`)}catch(u){console.error("Firmware status failed:",u),t.versionText.textContent=r("This firmware cannot be updated from the portal yet.","Questo firmware non si può ancora aggiornare dal portale."),t.codeButton.disabled=!0,t.updateButton.disabled=!0}}async function h(){if(!e){o(!0);try{await E(ti,{method:"POST"}),i(r("A 6-digit code is now shown on the device screen. Enter it below.","Sullo schermo del dispositivo è comparso un codice di 6 cifre: inseriscilo qui sotto."),"info")}catch(u){i(u instanceof Error?u.message:r("Could not request a code.","Impossibile richiedere il codice."),"error")}finally{o(!1)}}}function l(){const u=t.fileInput.files?.[0]??null;return u?u.name.toLowerCase().endsWith(".bin")?n>0&&u.size>n?(i(r("The file is too big for this device.","Il file è troppo grande per questo dispositivo."),"error"),null):u:(i(r("The firmware file must be a .bin (build/chroninkle.bin).","Il file del firmware deve essere un .bin (build/chroninkle.bin)."),"error"),null):(i(r("Choose the firmware file (.bin).","Scegli il file del firmware (.bin)."),"error"),null)}function c(){if(e)return;const u=t.codeInput.value.trim();if(!/^\d{6}$/.test(u)){t.setFieldError(t.codeInput,r("Enter the 6-digit code from the device.","Inserisci il codice di 6 cifre del dispositivo."));return}t.clearFieldError(t.codeInput);const p=l();if(!p)return;o(!0),t.fileInput.progressHidden=!1,t.fileInput.progressMax=100,t.fileInput.progressValue=0,t.fileInput.progressMessageText=r("Uploading...","Caricamento..."),i(r("Updating: keep this page open and the device nearby.","Aggiornamento in corso: tieni aperta questa pagina e il dispositivo vicino."),"info");const g=new XMLHttpRequest;g.open("POST",`${ei}?code=${encodeURIComponent(u)}`),g.setRequestHeader("Content-Type","application/octet-stream"),g.upload.onprogress=w=>{if(w.lengthComputable){const f=Math.round(w.loaded/w.total*100);t.fileInput.progressValue=f,t.fileInput.progressMessageText=`${f}%`}},g.onload=()=>{let w="",f=!1;try{const S=JSON.parse(g.responseText);f=g.status===200&&S.success===!0,w=M(S.message??"")}catch{w=""}if(f){t.fileInput.progressValue=100,t.fileInput.progressMessageText=r("Done","Fatto"),i(r("Update installed. The device restarts in a few seconds; reconnect to its Wi-Fi to use the portal again.","Aggiornamento installato. Il dispositivo si riavvia tra pochi secondi: per usare di nuovo il portale ricollegati alla sua rete."),"success"),t.codeInput.value="";return}t.fileInput.progressHidden=!0,i(w||r("Update failed.","Aggiornamento non riuscito."),"error"),o(!1)},g.onerror=()=>{t.fileInput.progressHidden=!0,i(r("Connection lost during the update. If the device restarted, wait and reconnect; otherwise try again.","Connessione persa durante l’aggiornamento. Se il dispositivo si è riavviato attendi e ricollegati, altrimenti riprova."),"error"),o(!1)},g.send(p)}return{loadStatus:s,requestCode:h,upload:c,isBusy:()=>e}}function D(t,e,n){t.hasKey=n?.has_key===!0||n?.configured===!0;const i=n?.last4??n?.api_key_last4;t.last4=typeof i=="string"?i:"",e.value=t.hasKey?t.last4?`******${t.last4}`:"******":""}function It(t,e,n){t.hasKey=!1,t.last4="",e.value="",n("")}async function Lt(t,e,n,i,o,s,h){const l=e.value.trim();if(!l){n(`${h} is required.`,"warning");return}t.isBusy=!0,n(s,"info"),i();try{const c=await o(t.settingsApi,{method:"PATCH",body:JSON.stringify({api_key:l})});D(t,e,c.settings),n(c.message||r(`${h} stored.`,`${h}: salvata.`),"success")}catch(c){console.error(`${h} save failed:`,c),n(c instanceof Error?c.message:r(`Failed to store ${h}.`,`Impossibile salvare: ${h}.`),"error")}finally{t.isBusy=!1,i()}}async function Bt(t,e,n,i,o,s,h){t.isBusy=!0,n(s,"info"),i();try{const l=await o(t.resetApi,{method:"POST"});D(t,e,l.settings),n(l.message||h,"success")}catch(l){console.error(`${h} failed:`,l),n(l instanceof Error?l.message:r(`Failed to clear ${h}.`,`Impossibile cancellare: ${h}.`),"error")}finally{t.isBusy=!1,i()}}function ii(t){const e={hasKey:!1,isBusy:!1,last4:"",resetApi:"/api/settings/gemini/reset",settingsApi:"/api/settings/gemini"},n={hasKey:!1,isBusy:!1,last4:"",resetApi:"/api/settings/openai/reset",settingsApi:"/api/settings/openai"};function i(f){const S=f?.routes;e.settingsApi=S?.settings||"/api/settings/gemini",e.resetApi=S?.reset||"/api/settings/gemini/reset"}function o(f){const S=f?.routes;n.settingsApi=S?.settings||"/api/settings/openai",n.resetApi=S?.reset||"/api/settings/openai/reset"}function s(f){D(e,t.geminiApiKeyInput,f)}function h(){It(e,t.geminiApiKeyInput,t.notifyGemini)}function l(f){D(n,t.openAiApiKeyInput,f)}function c(){It(n,t.openAiApiKeyInput,t.notifyOpenAi)}async function u(){if(!t.isGeminiModuleActive()||e.isBusy||e.hasKey)return;if(!t.geminiApiKeyInput.value.trim()){t.notifyGemini(r("Gemini API key is required.","Serve la chiave API di Gemini."),"warning");return}await Lt(e,t.geminiApiKeyInput,t.notifyGemini,t.updateButtons,t.fetchGeminiModuleJson,r("Saving Gemini API key...","Salvataggio chiave API di Gemini..."),r("Gemini API key","Chiave API di Gemini"))}async function p(){!t.isGeminiModuleActive()||e.isBusy||await Bt(e,t.geminiApiKeyInput,t.notifyGemini,t.updateButtons,t.fetchGeminiModuleJson,r("Clearing Gemini API key...","Cancellazione chiave API di Gemini..."),r("Gemini API key cleared.","Chiave API di Gemini cancellata."))}async function g(){if(!t.isOpenAiModuleActive()||n.isBusy||n.hasKey)return;if(!t.openAiApiKeyInput.value.trim()){t.notifyOpenAi("OpenAI API key is required.","warning");return}await Lt(n,t.openAiApiKeyInput,t.notifyOpenAi,t.updateButtons,t.fetchOpenAiModuleJson,"Saving OpenAI API key...","OpenAI API key")}async function w(){!t.isOpenAiModuleActive()||n.isBusy||await Bt(n,t.openAiApiKeyInput,t.notifyOpenAi,t.updateButtons,t.fetchOpenAiModuleJson,"Clearing OpenAI API key...","OpenAI API key cleared.")}return{applyGeminiSettings:s,applyOpenAiSettings:l,clearGeminiKey:p,clearGeminiSettings:h,clearOpenAiKey:w,clearOpenAiSettings:c,getGeminiHasKey:()=>e.hasKey,getOpenAiHasKey:()=>n.hasKey,isGeminiBusy:()=>e.isBusy,isOpenAiBusy:()=>n.isBusy,saveGeminiKey:u,saveOpenAiKey:g,updateGeminiRoutes:i,updateOpenAiRoutes:o}}const oi="/api/wifi/saved",ri="/api/wifi/forget";function ai(t){let e=[],n=5,i=!1;function o(){const l=t.container;l.replaceChildren();const c=document.createElement("h3");if(c.className="saved-networks__title",c.textContent=r(`Saved networks (${e.length}/${n})`,`Reti salvate (${e.length}/${n})`),l.appendChild(c),e.length===0){const g=document.createElement("p");g.className="form-helper-text",g.textContent=r("None yet: a network is saved when the device connects to it.","Nessuna: una rete viene salvata quando il dispositivo vi si connette."),l.appendChild(g);return}const u=document.createElement("ul");u.className="saved-networks__list";for(const g of e){const w=document.createElement("li");w.className="saved-networks__item";const f=document.createElement("span");f.className="saved-networks__ssid",f.textContent=g.connected?`${g.ssid} · ${r("connected","connessa")}`:g.ssid,w.appendChild(f);const S=document.createElement("ui-button");S.setAttribute("variant","secondary"),S.setAttribute("aria-label",r(`Forget ${g.ssid}`,`Dimentica ${g.ssid}`)),S.textContent=r("Forget","Dimentica"),S.disabled=i,S.addEventListener("click",()=>{h(g.ssid)}),w.appendChild(S),u.appendChild(w)}l.appendChild(u);const p=document.createElement("p");p.className="form-helper-text",p.textContent=r("The device joins the strongest saved network in range by itself.","Il dispositivo si collega da solo alla rete salvata con il segnale migliore."),l.appendChild(p)}async function s(){try{const l=await E(oi);e=(l.networks??[]).map(c=>({ssid:c.ssid,connected:c.connected===!0})),n=l.max??n}catch(l){console.error("Saved networks failed:",l),t.container.hidden=!0;return}t.container.hidden=!1,o()}async function h(l){if(!i){i=!0,o();try{await E(ri,{method:"POST",body:JSON.stringify({ssid:l})}),t.notify(r(`${l} forgotten.`,`${l} dimenticata.`),"success")}catch(c){t.notify(c instanceof Error?c.message:r("Could not forget the network.","Impossibile dimenticare la rete."),"error")}finally{i=!1,await s(),t.onChange()}}}return{load:s,isSaved:l=>!!l&&e.some(c=>c.ssid===l)}}function si(t){let e=!1,n=!1,i=!1,o=!1,s;function h(d){const b=new Date(d*1e3),C=a=>String(a).padStart(2,"0"),A=`${C(b.getDate())}/${C(b.getMonth()+1)}`;return qt()?`${A} ${C(b.getHours())}:${C(b.getMinutes())}`:b.toLocaleString("en-US",{month:"numeric",day:"numeric",hour:"numeric",minute:"2-digit"})}function l(){const d=t.syncStatusText;if(!d)return;const b=s;if(!t.isSwitchChecked(t.clockModeToggle)){d.textContent=r("Off: the device keeps the date and time you set.","Disattivata: il dispositivo tiene la data e l'ora impostate.");return}if(b?.sync_in_progress){d.textContent=r("Syncing with the internet...","Sincronizzazione in corso...");return}const C=b?.last_network_sync_epoch??0;if(b?.has_network_sync&&C>0){d.textContent=r(`Last synced: ${h(C)}`,`Ultima sincronizzazione: ${h(C)}`);return}d.textContent=r("Not synced yet: it will sync as soon as the device is on Wi-Fi.","Non ancora sincronizzata: lo farà appena il dispositivo è sul Wi-Fi.")}function c(){t.setSwitchChecked(t.clockModeToggle,!t.isSwitchChecked(t.clockModeToggle)),l()}async function u(){return t.fetchTimezoneListJson("/api/timezone/list")}function p(d){const b=d.settings,C=d.runtime;t.setSwitchChecked(t.clockModeToggle,!!b?.enabled),s=C,l(),t.timezoneSelect.value=b?.timezone_name||"",t.clearFieldError(t.timezoneSelect),t.manualDateInput.value=typeof C?.current_date=="string"?C.current_date:"",t.manualTimeInput.value=typeof C?.current_time=="string"?C.current_time:""}function g(d){d&&(s=d,l(),t.manualDateInput.value=typeof d.current_date=="string"?d.current_date:"",t.manualTimeInput.value=typeof d.current_time=="string"?d.current_time:"")}async function w(){t.timezoneSelect.innerHTML="";const d=document.createElement("option");d.value="",d.textContent=r("Select timezone","Seleziona fuso orario"),t.timezoneSelect.appendChild(d);try{const b=await u(),C=Array.isArray(b.timezones)?b.timezones:[],A=t.buildTimezoneLabelMap(C);C.map(a=>({value:a.name,label:t.formatTimezoneLabel(a,A)})).sort((a,v)=>a.label.localeCompare(v.label)).forEach(a=>{const v=document.createElement("option");v.value=a.value,v.textContent=a.label,t.timezoneSelect.appendChild(v)})}catch(b){console.error("Timezone list fetch failed:",b),t.notify(b instanceof Error?b.message:r("Failed to load timezones.","Impossibile caricare i fusi orari."),"error")}}async function f(){if(!(e||n||i)){e=!0,n=!0,i=!0,t.onStateChange();try{const d=await t.fetchTimeSettingsJson(t.timeSettingsApi);p(d)}catch(d){console.error("Time settings status failed:",d),t.notify(d instanceof Error?d.message:r("Time settings status failed.","Impossibile leggere le impostazioni dell'ora."),"error")}finally{e=!1,n=!1,i=!1,t.onStateChange()}}}async function S(){if(!(i||o)){o=!0;try{for(let d=0;d<t.clockSyncPollAttempts;d++){const b=await t.fetchTimeRuntimeJson(t.timeRuntimeApi);if(g(b.runtime),b.runtime?.time_valid===!0&&typeof b.runtime.current_time=="string"&&b.runtime.current_time.length>0)return;d<t.clockSyncPollAttempts-1&&await new Promise(C=>{setTimeout(C,t.clockSyncPollIntervalMs)})}}catch(d){console.error("Clock refresh after WiFi connect failed:",d)}finally{o=!1}}}async function T(){if(!(document.hidden||e||n||i)&&t.isSwitchChecked(t.clockModeToggle))try{const d=await t.fetchTimeRuntimeJson(t.timeRuntimeApi);g(d.runtime)}catch(d){console.error("Time runtime status failed:",d)}}function k(){const d=t.timezoneSelect.value.trim(),b=t.manualDateInput.value.trim(),C=t.manualTimeInput.value.trim(),A=t.parseClockTimeInputValue(t.wakeupTimeInput),a=t.parseClockTimeInputValue(t.bedtimeTimeInput);return!!b!=!!C?(t.notify(r("Provide both current date and time for a manual clock set.","Per impostare l'ora a mano servono sia la data sia l'ora."),"error"),null):{timezoneName:d,manualDate:b,manualTime:C,wakeupMinutes:A??void 0,bedtimeMinutes:a??void 0}}async function _(d,b){return t.fetchTimeSettingsJson(t.timeSettingsApi,{method:"PATCH",body:JSON.stringify({timezone_name:d.timezoneName,enabled:b,manual_date:d.manualDate,manual_time:d.manualTime})})}async function N(){if(i||e||n){t.notifyClockMode("Clock mode update already in progress.","warning");return}const d=t.isSwitchChecked(t.clockModeToggle),b=!d,C=t.timezoneSelect.value.trim();t.setSwitchChecked(t.clockModeToggle,b),i=!0,t.notifyClockMode(b?"Enabling clock mode...":"Disabling clock mode...","info"),t.onStateChange();try{const A=await t.fetchTimeSettingsJson(t.timeSettingsApi,{method:"PATCH",body:JSON.stringify({enabled:b,timezone_name:b&&C?C:void 0})});p(A),t.notifyClockMode(A.message||(b?"Clock mode enabled.":"Clock mode disabled."),"success")}catch(A){t.setSwitchChecked(t.clockModeToggle,d),console.error("Clock mode toggle failed:",A);const a=A instanceof Error?A.message:"Failed to update clock mode.",v=a==="timezone_name required to enable clock"?r("Please set timezone first.","Imposta prima il fuso orario."):a;a==="timezone_name required to enable clock"&&(t.setFieldError(t.timezoneSelect,r("Select a timezone.","Seleziona un fuso orario.")),t.timezoneSelect.focus({preventScroll:!0})),t.notifyClockMode(v,"error")}finally{i=!1,t.onStateChange()}}async function I(){if(e||n||i||t.isTalkingClockModuleBusy()){t.notify(r("Time configuration update already in progress.","Aggiornamento dell'ora già in corso."),"warning");return}const d=k();if(d){if(!d.timezoneName){t.setFieldError(t.timezoneSelect,r("Select a timezone.","Seleziona un fuso orario.")),t.notify(r("Select a timezone.","Seleziona un fuso orario."),"error"),t.timezoneSelect.focus({preventScroll:!0});return}if(t.clearFieldError(t.timezoneSelect),t.isTalkingClockModuleActive()&&(d.wakeupMinutes===void 0||d.bedtimeMinutes===void 0)){t.notify("Wakeup and bedtime times are required for the talking clock module.","error"),t.focusTalkingClockTimeInput();return}e=!0,n=!0,i=!0,t.onTalkingClockBusyChange(t.isTalkingClockModuleActive()),t.notify(r("Saving time configuration...","Salvataggio impostazioni ora..."),"info"),t.onStateChange();try{const b=await _(d,t.isSwitchChecked(t.clockModeToggle));if(p(b),t.isTalkingClockModuleActive()){const C=await t.patchTalkingClockSettings({wakeup_minutes:d.wakeupMinutes,bedtime_minutes:d.bedtimeMinutes});t.applyTalkingClockModuleSettings(C.settings)}t.notify(r("Time configuration saved successfully.","Impostazioni ora salvate."),"success")}catch(b){console.error("Timezone/location save failed:",b),t.notify(b instanceof Error?b.message:r("Failed to save time configuration.","Impossibile salvare le impostazioni dell'ora."),"error")}finally{e=!1,n=!1,i=!1,t.onTalkingClockBusyChange(!1),t.onStateChange()}}}async function L(){if(e||n||i){t.notify(r("Time configuration update already in progress.","Aggiornamento dell'ora già in corso."),"warning");return}e=!0,n=!0,i=!0,t.notify(r("Clearing timezone/location...","Cancellazione fuso orario..."),"info"),t.onStateChange();try{const d=await t.fetchTimeSettingsJson(t.timeSettingsApi,{method:"PATCH",body:JSON.stringify({enabled:!1,timezone_name:""})});p(d),t.notify(r("Timezone/location cleared successfully.","Fuso orario cancellato."),"success")}catch(d){console.error("Timezone/location clear failed:",d),t.notify(d instanceof Error?d.message:r("Failed to clear timezone/location.","Impossibile cancellare il fuso orario."),"error")}finally{e=!1,n=!1,i=!1,t.onStateChange()}}return{applyTimeRuntimeStatus:g,applyTimeSettingsStatus:p,clearTimezoneLocation:L,fetchTimeRuntimeStatus:T,fetchTimeSettingsStatus:f,isClockBusy:()=>i,isLocationBusy:()=>n,isTimezoneBusy:()=>e,populateTimezoneOptions:w,refreshClockStatusAfterWifiConnect:S,saveTimezoneLocation:I,toggleAutoTimeStaged:c,toggleClockModeSetting:N}}function li(t,e){return t>=-50?e.fourBar:t>=-60?e.threeBar:t>=-70?e.twoBar:e.oneBar}function ci(t){let e=[],n="",i=!1,o="",s=!1,h=!1,l=!1,c=-1;function u(){t.wifiStatusCard.hidden=!1,t.wifiStatusCard.statusLabel=i?r("Connected","Connesso"):r("Disconnected","Disconnesso"),t.wifiStatusCard.network=i?o:""}function p(){const a=document.createElement("li");a.className="networks__list-empty-state",a.innerHTML=`${t.svgWithClass(t.wifiFindIcon,"wifi-find-icon")}<p>Scan for available networks</p>`,t.networkList.setEmptyState(a)}function g(){if(e.length===0){n="",c=-1;return}const a=e.findIndex(v=>v.ssid===n);if(a>=0){c=a;return}n="",c=-1}function w(){const a=t.networkList.getOptions();a.forEach((v,x)=>{v.setAttribute("aria-selected",String(n===e[x]?.ssid))}),c>=0&&c<a.length?t.networkList.setActiveDescendant(a[c].id):t.networkList.setActiveDescendant(null)}function f(){if(t.isSavedNetwork?.(n))return!1;const a=e.find(v=>v.ssid===n);return a?!a.is_open:!0}function S(a){n=a,c=e.findIndex(v=>v.ssid===a),f()||t.clearFieldError(t.passwordInput),t.passwordInput.setAttribute("placeholder",t.isSavedNetwork?.(a)?r("Saved - leave empty","Salvata: lascia vuoto"):r("Enter network password","Inserisci la password della rete")),w(),t.onStateChange()}function T(){if(g(),t.networkList.clearItems(),e.length===0){p();return}e.forEach((a,v)=>{const x=document.createElement("li");x.className="networks__item",x.id=`network-option-${v}`,x.setAttribute("role","option"),x.setAttribute("tabindex","-1"),x.setAttribute("aria-selected",String(n===a.ssid));const K=document.createElement("span");K.className="networks__item-ssid",K.textContent=a.ssid;const $=document.createElement("div");if($.className="networks__item-details",o===a.ssid&&i){const Z=document.createElement("span");Z.title=r("Currently connected","Connesso ora"),Z.innerHTML=t.svgWithClass(t.checkIcon,"wifi-connected-icon"),$.appendChild(Z)}const U=document.createElement("span");U.title=a.is_open?r("Open","Aperta"):r("Secured","Protetta"),a.is_open||(U.innerHTML=t.svgWithClass(t.securityIcon,"wifi-security-icon")),$.appendChild(U);const W=document.createElement("span");W.title=r(`Signal strength: ${a.signal_strength} (${a.rssi} dBm)`,`Intensità del segnale: ${a.signal_strength} (${a.rssi} dBm)`),W.innerHTML=t.svgWithClass(li(a.rssi,t.signalIcons),"wifi-signal-icon"),$.appendChild(W),x.append(K,$),x.addEventListener("click",()=>{c=v,S(a.ssid),t.networkList.focus({preventScroll:!0})}),t.networkList.appendItem(x)}),w()}function k(a){const v=i,x=o;i=a.connected===!0,o=typeof a.ssid=="string"?a.ssid:"",u(),(v!==i||x!==o)&&T(),t.onConnectionStateChange?.({wasConnected:v,previousNetwork:x,isCurrentlyConnected:i,connectedNetwork:o})}async function _(){if(!s){s=!0,t.notify(r("Scanning for networks...","Ricerca reti in corso..."),"info"),t.onStateChange();try{let a=r("Scanning for networks...","Ricerca reti in corso...");for(let v=0;v<t.scanPollAttempts;v++){const x=await t.fetchPortalJson("/api/scan");if(a=x.message||a,x.scan_in_progress===!0){if(t.notify(a,"info"),v<t.scanPollAttempts-1){await t.delayMs(t.scanPollIntervalMs);continue}}else{e=Array.isArray(x.networks)?x.networks:[],t.notify(a||r("Scan complete.","Ricerca completata."),"success"),T();return}}throw new Error(r("Network scan timed out. Please try again.","Ricerca reti scaduta. Riprova."))}catch(a){console.error("Scan failed:",a),t.notify(a instanceof Error?a.message:r("Scan failed. Please try again.","Ricerca non riuscita. Riprova."),"error"),e=[],T()}finally{s=!1,t.onStateChange()}}}async function N(){if(!h){h=!0,t.onStateChange();try{const a=await t.fetchPortalJson("/api/status");k(a),s||t.notify(a.message||r("Status updated.","Stato aggiornato."),a.connected?"success":"info")}catch(a){console.error("Status check failed:",a),t.notify(a instanceof Error?a.message:r("Status check failed.","Impossibile leggere lo stato."),"error")}finally{h=!1,t.onStateChange()}}}async function I(){if(!(l||!n)){if(f()&&t.passwordInput.value.trim().length===0){t.setFieldError(t.passwordInput,r("Please enter a WiFi password.","Inserisci la password del Wi-Fi.")),t.passwordInput.focus({preventScroll:!0});return}if(t.passwordInput.value.length>X){t.setFieldError(t.passwordInput,r(`WiFi password must be ${X} characters or fewer.`,`La password Wi-Fi può avere al massimo ${X} caratteri.`)),t.passwordInput.focus({preventScroll:!0});return}t.clearFieldError(t.passwordInput),l=!0,t.notify(r(`Connecting to ${n}...`,`Connessione a ${n}...`),"info"),t.onStateChange();try{const a=await t.fetchPortalJson("/api/configure",{method:"POST",body:JSON.stringify({ssid:n,password:t.passwordInput.value})});t.notify(a.message||r("Connection request sent.","Richiesta di connessione inviata."),"info");for(let v=0;v<t.statusPollAttempts;v++){await t.delayMs(t.statusPollIntervalMs);const x=await t.fetchPortalJson("/api/status");if(k(x),x.connected){t.notify(x.message||r("Connected.","Connesso."),"success");break}}i||t.notify(r("Connection in progress...","Connessione in corso..."),"info")}catch(a){console.error("Connection failed:",a),t.notify(a instanceof Error?a.message:r("Connection failed.","Connessione non riuscita."),"error")}finally{l=!1,t.onStateChange()}}}async function L(){if(!(l||h||!i)){h=!0,t.notify(r("Disconnecting...","Disconnessione..."),"info"),t.onStateChange();try{const a=await t.fetchPortalJson("/api/disconnect",{method:"POST"}),v=i,x=o;i=!1,o="",u(),T(),t.notify(a.message||r("Disconnected.","Disconnesso."),"success"),t.onConnectionStateChange?.({wasConnected:v,previousNetwork:x,isCurrentlyConnected:i,connectedNetwork:o})}catch(a){console.error("Disconnect failed:",a),t.notify(a instanceof Error?a.message:r("Disconnect failed.","Disconnessione non riuscita."),"error")}finally{h=!1,t.onStateChange()}}}function d(){if(A()){L();return}if(l||h){t.notify(r("WiFi status is busy. Please wait.","Wi-Fi occupato. Attendi."),"warning");return}if(!n){t.notify(r("Select a WiFi network first.","Seleziona prima una rete Wi-Fi."),"error"),t.networkList.focus({preventScroll:!0});return}if(f()&&t.passwordInput.value.trim().length===0){t.setFieldError(t.passwordInput,r("Please enter a WiFi password.","Inserisci la password del Wi-Fi.")),t.notify(r("Please check if your password is correct.","Controlla che la password sia corretta."),"error"),t.passwordInput.focus({preventScroll:!0});return}t.clearFieldError(t.passwordInput),I()}function b(){t.passwordInput.value?.trim().length&&t.clearFieldError(t.passwordInput),t.onStateChange()}function C(a){if(e.length!==0)switch(g(),a.key){case"Tab":break;case"ArrowDown":{a.preventDefault();const v=c<e.length-1?c+1:0;c=v,S(e[v].ssid),t.networkList.scrollOptionIntoView(v);break}case"ArrowUp":{a.preventDefault();const v=c>0?c-1:e.length-1;c=v,S(e[v].ssid),t.networkList.scrollOptionIntoView(v);break}case"Home":{a.preventDefault(),c=0,S(e[0].ssid),t.networkList.scrollOptionIntoView(0);break}case"End":{a.preventDefault();const v=e.length-1;c=v,S(e[v].ssid),t.networkList.scrollOptionIntoView(v);break}case"Enter":case" ":{a.preventDefault(),c>=0&&c<e.length&&S(e[c].ssid);break}}}function A(){return i&&o.length>0&&n===o}return{applyPortalStatus:k,checkStatus:N,connect:I,disconnect:L,getConnectedNetwork:()=>o,getSelectedNetwork:()=>n,handleConnectAction:d,handleListboxKeyDown:C,handlePasswordInput:b,isCheckingStatus:()=>h,isConnecting:()=>l,isCurrentlyConnected:()=>i,isScanning:()=>s,isSelectedConnected:A,renderNetworkList:T,requiresPassword:f,scanNetworks:_,updateWifiStatusCard:u}}function O(t,e){e().finally(()=>{!t.disabled&&t.offsetParent!==null&&setTimeout(()=>{!t.disabled&&t.offsetParent!==null&&t.focus()},0)})}function di(t){const{controllers:e,dom:n,helpers:i}=t;function o(){n.wifiSettingsSheet.openBottomSheet(),e.wifiController.scanNetworks()}n.scanBtn.addEventListener("click",()=>{e.wifiController.scanNetworks()}),n.connectBtn.addEventListener("click",()=>{e.wifiController.handleConnectAction()}),n.wifiStatusCard.addEventListener("action",()=>{if(e.wifiController.isCurrentlyConnected()){e.wifiController.disconnect();return}o()}),n.wifiStatusCard.addEventListener("settings",()=>{o()}),n.wifiSettingsCloseBtn.addEventListener("click",()=>{n.wifiSettingsSheet.closeBottomSheet()}),n.passwordInput.addEventListener("input",()=>{e.wifiController.handlePasswordInput()}),n.networkList.addEventListener("keydown",s=>{e.wifiController.handleListboxKeyDown(s)}),n.geminiSaveBtn.addEventListener("click",()=>{O(n.geminiSaveBtn,()=>e.geminiController.saveGeminiKey())}),n.geminiClearBtn.addEventListener("click",()=>{O(n.geminiClearBtn,()=>e.geminiController.clearGeminiKey())}),n.geminiApiKeyInput.addEventListener("input",i.updateUi),n.timezoneLocationSaveBtn.addEventListener("click",()=>{if(!n.timezoneSelect.value.trim()){i.setFieldError(n.timezoneSelect,r("Select a timezone.","Seleziona un fuso orario.")),i.setTimezoneLocationNotification(r("Select a timezone.","Seleziona un fuso orario."),"error"),n.timezoneSelect.focus({preventScroll:!0});return}i.clearFieldError(n.timezoneSelect),O(n.timezoneLocationSaveBtn,()=>e.timeController.saveTimezoneLocation())}),n.timezoneLocationClearBtn.addEventListener("click",()=>{O(n.timezoneLocationClearBtn,()=>e.timeController.clearTimezoneLocation())}),n.timezoneSelect.addEventListener("change",()=>{n.timezoneSelect.value?.trim().length&&i.clearFieldError(n.timezoneSelect),i.updateUi()}),n.manualDateInput.addEventListener("input",i.updateUi),n.manualTimeInput.addEventListener("input",i.updateUi)}function ui(t){const{controllers:e,dom:n}=t,i=e.wifiController.isScanning()||e.wifiController.isConnecting()||e.wifiController.isCheckingStatus(),o=e.wifiController.isSelectedConnected(),s=e.wifiController.getSelectedNetwork().trim(),h=s.length>0&&!o&&e.wifiController.requiresPassword(),l=o||s.length>0&&(!h||n.passwordInput.value.trim().length>0);n.scanBtn.disabled=i,n.connectBtn.disabled=i||!l,n.wifiStatusCard.actionDisabled=i,n.passwordInput.disabled=e.wifiController.isConnecting(),e.wifiController.isConnecting()?(n.connectBtn.textContent=r("Connecting...","Connessione..."),n.wifiStatusCard.actionLabel=r("Connecting...","Connessione...")):o?(n.connectBtn.textContent=r("Disconnect","Disconnetti"),n.wifiStatusCard.actionLabel=r("Disconnect","Disconnetti")):(n.connectBtn.textContent=r("Connect","Connetti"),n.wifiStatusCard.actionLabel=e.wifiController.isCurrentlyConnected()?r("Disconnect","Disconnetti"):r("Connect","Connetti"));const c=e.timeController.isTimezoneBusy()||e.timeController.isLocationBusy()||e.timeController.isClockBusy();n.timezoneSelect.disabled=c,n.manualDateInput.disabled=c,n.manualTimeInput.disabled=c,n.timezoneLocationSaveBtn.disabled=c||n.timezoneSelect.value.trim().length===0,n.timezoneLocationClearBtn.disabled=c||n.timezoneSelect.value.trim().length===0;const u=e.geminiController.isGeminiBusy(),p=e.geminiController.getGeminiHasKey();n.geminiApiKeyInput.readOnly=p||u,n.geminiApiKeyInput.disabled=u,n.geminiSaveBtn.disabled=u||p||n.geminiApiKeyInput.value.trim().length===0,n.geminiSaveBtn.hidden=p,n.geminiClearBtn.disabled=u||!p,n.geminiClearBtn.hidden=!p}ye();pe();xe();Ie();ze();De();Ge();We();Qe();on();sn();let ht=null;const m=Hn(),ft=Rn(m.wifiSettingsNotification),hi=R(m.geminiCard),te=R(m.timezoneLocationCard),ee=()=>document.createElement("input"),gi=ee(),mi=ee(),pi=document.createElement("input");function P(){ui({controllers:{geminiController:bt,timeController:z,wifiController:q},dom:m})}const bt=ii({fetchGeminiModuleJson:Xt,fetchOpenAiModuleJson:()=>Promise.resolve({}),geminiApiKeyInput:m.geminiApiKeyInput,isGeminiModuleActive:()=>!0,isOpenAiModuleActive:()=>!1,notifyGemini:hi,notifyOpenAi:()=>{},openAiApiKeyInput:pi,updateButtons:P}),z=si({applyTalkingClockModuleSettings:()=>{},bedtimeTimeInput:mi,clearFieldError:G,clockModeToggle:m.autoTimeToggle,clockSyncPollAttempts:Tn,clockSyncPollIntervalMs:Cn,fetchTimeRuntimeJson:qn,fetchTimeSettingsJson:zn,fetchTimezoneListJson:Mn,focusTalkingClockTimeInput:()=>{},buildTimezoneLabelMap:jn,formatTimezoneLabel:Yn,isSwitchChecked:Vn,isTalkingClockModuleActive:()=>!1,isTalkingClockModuleBusy:()=>!1,manualDateInput:m.manualDateInput,manualTimeInput:m.manualTimeInput,notifyClockMode:()=>{},notify:te,onStateChange:P,onTalkingClockBusyChange:()=>{},parseClockTimeInputValue:Xn,patchTalkingClockSettings:()=>Promise.resolve({success:!0}),setFieldError:V,setSwitchChecked:Gn,timeRuntimeApi:In,timeSettingsApi:_n,timezoneSelect:m.timezoneSelect,syncStatusText:m.timeSyncStatus,wakeupTimeInput:gi}),fi=R(m.calendarCard),gt=$n({list:m.calendarList,urlInput:m.calendarUrlInput,statusText:m.calendarStatus,addButton:m.calendarAddBtn,refreshButton:m.calendarRefreshBtn,notify:fi}),bi=R(m.bridgeCard),mt=Dn({urlInput:m.bridgeUrlInput,secretInput:m.bridgeSecretInput,statusText:m.bridgeStatus,saveButton:m.bridgeSaveBtn,testButton:m.bridgeTestBtn,notify:bi}),H=ai({container:m.savedNetworks,notify:ft,onChange:()=>{q.checkStatus()}}),q=ci({checkIcon:fn,clearFieldError:G,delayMs:Un,fetchPortalJson:Bn,networkList:m.networkList,notify:ft,onConnectionStateChange:({wasConnected:t,isCurrentlyConnected:e})=>{!t&&e&&z.refreshClockStatusAfterWifiConnect(),H.load()},onStateChange:P,passwordInput:m.passwordInput,isSavedNetwork:t=>H.isSaved(t),scanPollAttempts:kn,scanPollIntervalMs:An,securityIcon:cn,setFieldError:V,signalIcons:{oneBar:dn,twoBar:un,threeBar:hn,fourBar:gn},statusPollAttempts:Sn,statusPollIntervalMs:yn,svgWithClass:Kn,wifiFindIcon:mn,wifiStatusCard:m.wifiStatusCard}),pt=ni({card:m.firmwareCard,versionText:m.firmwareVersionText,fileInput:m.firmwareFileInput,codeInput:m.firmwareCodeInput,codeButton:m.firmwareCodeBtn,updateButton:m.firmwareUpdateBtn,setFieldError:V,clearFieldError:G});function F(){if(!ht)return;const t=document.documentElement,e=t.scrollHeight>window.innerHeight+1,n=window.scrollY+window.innerHeight>=t.scrollHeight-1;ht.setVisible(e&&!n)}function vi(){m.wifiStatusCard.iconSvg=ln,m.geminiCard.iconSvg=pn,m.calendarCard.iconSvg=kt,m.bridgeCard.iconSvg=kt,m.timezoneLocationCard.iconSvg=bn,m.firmwareCard.iconSvg=vn,m.wifiStatusCard.addEventListener("settings",()=>{H.load()}),m.firmwareFileInput.progressHidden=!0,m.autoTimeToggle.addEventListener("click",t=>{t.composedPath().some(e=>e instanceof HTMLButtonElement)&&z.toggleAutoTimeStaged()});for(const t of[m.geminiSaveBtn,m.geminiClearBtn])t.addEventListener("click",()=>{window.setTimeout(()=>{vt()},1500)});m.calendarAddBtn.addEventListener("click",()=>{gt.addCalendar()}),m.calendarRefreshBtn.addEventListener("click",()=>{gt.refresh()}),m.bridgeSaveBtn.addEventListener("click",()=>{mt.save()}),m.bridgeTestBtn.addEventListener("click",()=>{mt.test()}),m.firmwareCodeBtn.addEventListener("click",()=>{pt.requestCode()}),m.firmwareUpdateBtn.addEventListener("click",()=>{pt.upload()}),q.renderNetworkList(),document.body&&(ht=de({mount:document.body,mode:"fixed",position:"bottom",height:"6rem",width:"100vw",strength:1.8,divCount:5,curve:"bezier",exponential:!0,opacity:1,zIndex:20,className:"page-gradual-blur",fallbackColor:"var(--color-bg-selected)"}),F(),window.addEventListener("scroll",F,{passive:!0}),window.addEventListener("resize",F),typeof ResizeObserver<"u"&&new ResizeObserver(()=>{F()}).observe(document.body)),P(),q.updateWifiStatusCard(),ft(""),di({controllers:{geminiController:bt,timeController:z,wifiController:q},dom:m,helpers:{clearFieldError:G,setFieldError:V,setTimezoneLocationNotification:te,updateUi:P}}),wi(),window.setInterval(()=>{z.fetchTimeRuntimeStatus()},xn)}async function wi(){await Promise.allSettled([z.populateTimezoneOptions(),z.fetchTimeSettingsStatus(),q.checkStatus(),H.load(),vt(),gt.load(),mt.load(),pt.loadStatus()])}const yi=4e3;let zt;function Si(t){const e=m.geminiStatusText,n=t.settings,i=t.runtime;if(!(n?.has_key===!0||n?.configured===!0)||!i)return e.hidden=!0,!1;if(e.hidden=!1,i.ready){const c=i.last_model_display_name;return e.textContent=c?r(`Gemini connected (${c}).`,`Gemini collegato (${c}).`):r("Gemini connected.","Gemini collegato."),!1}let s=i.not_ready_reason||r("Gemini not ready.","Gemini non è pronto.");const h=n?.api_key_length??0;if(h>0){const c=n?.api_key_prefix?`${n.api_key_prefix}…`:"",u=n?.last4??n?.api_key_last4??"";s+=` · ${r("Saved key","Chiave salvata")}: ${c}${u} (${h} ${r("characters","caratteri")})`}const l=i.last_http_status??0;return i.last_error_message&&l>0?s+=` · ${r("Google says","Risposta di Google")}: ${i.last_error_message} (HTTP ${l})`:i.last_error_message&&(s+=` · ${r("Details","Dettagli")}: ${i.last_error_message}`),e.textContent=s,!0}async function vt(){window.clearTimeout(zt);try{const t=await Xt("/api/settings/gemini");bt.applyGeminiSettings(t.settings),Si(t)&&!document.hidden&&(zt=window.setTimeout(()=>{vt()},yi))}catch(t){console.error("Gemini settings status failed:",t)}finally{P()}}ie().then(()=>{ae(),vi()});
