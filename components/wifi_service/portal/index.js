(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function n(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(o){if(o.ep)return;o.ep=!0;const s=n(o);fetch(o.href,s)}})();let _=Gt();function Gt(){return(typeof navigator<"u"?navigator.languages??[navigator.language]:[]).some(e=>e?.toLowerCase().startsWith("it"))?"it":"en"}function r(t,e){return _==="it"?e:t}async function Kt(t=1500){const e=new AbortController,n=window.setTimeout(()=>e.abort(),t);try{const i=await fetch("/api/language",{cache:"no-store",signal:e.signal});if(i.ok){const o=await i.json();(o.language==="it"||o.language==="en")&&(_=o.language)}}catch{}finally{window.clearTimeout(n)}return document.documentElement.lang=_,_}const ct={Connected:"Connesso","Not connected":"Non connesso","Scanning for networks":"Ricerca reti in corso","Network scan complete":"Ricerca reti completata","Scan failed":"Ricerca non riuscita","Invalid Wi-Fi configuration payload":"Configurazione Wi-Fi non valida","Invalid JSON body":"Richiesta non valida","SSID required":"Serve il nome della rete (SSID)","Failed to start Wi-Fi connection":"Impossibile avviare la connessione Wi-Fi","Failed to disconnect Wi-Fi":"Impossibile disconnettere il Wi-Fi","Cleared saved Wi-Fi credentials":"Credenziali Wi-Fi salvate cancellate","Invalid time settings payload":"Impostazioni ora non valide","Time settings loaded":"Impostazioni ora caricate","Time settings updated":"Impostazioni ora aggiornate","Time runtime loaded":"Ora caricata","Timezone list loaded":"Elenco fusi orari caricato","Clock disabled":"Orologio disattivato","Failed to save time settings":"Impossibile salvare le impostazioni dell’ora","Failed to set manual time":"Impossibile impostare l’ora manualmente","Invalid manual date/time":"Data o ora non valide","Invalid timezone_name":"Fuso orario non valido","Invalid enabled":"Valore non valido","Invalid location":"Posizione non valida","timezone_name required to enable clock":"Seleziona prima un fuso orario","timezone_name required to set manual time":"Seleziona prima un fuso orario","Invalid Gemini settings payload":"Impostazioni Gemini non valide","Invalid api_key":"Chiave API non valida","Gemini API key is required":"Serve la chiave API di Gemini","Gemini API key stored":"Chiave API di Gemini salvata","Failed to store Gemini API key":"Impossibile salvare la chiave API di Gemini","Gemini API key cleared":"Chiave API di Gemini cancellata","Failed to clear Gemini API key":"Impossibile cancellare la chiave API di Gemini","Request failed.":"Richiesta non riuscita.","Firmware status loaded":"Stato del firmware caricato","Update code shown on the device":"Codice mostrato sul dispositivo","Update code required":"Serve il codice mostrato sul dispositivo","Update code expired, request a new one":"Codice scaduto: richiedine uno nuovo","Too many wrong codes, request a new one":"Troppi codici errati: richiedine uno nuovo","Wrong update code":"Codice errato","An update is already in progress":"È già in corso un aggiornamento","No OTA partition available":"Nessuna partizione disponibile per l’aggiornamento","Firmware file has the wrong size":"Il file del firmware ha una dimensione non valida","Upload interrupted":"Caricamento interrotto","Not a firmware file (use build/chroninkle.bin)":"Non è un file firmware (usa build/chroninkle.bin)","Firmware built for a different chip":"Firmware compilato per un altro chip","Firmware for a different project":"Firmware di un altro progetto","Could not start the update":"Impossibile avviare l’aggiornamento","Could not write the firmware":"Impossibile scrivere il firmware","Firmware file is corrupted":"Il file del firmware è danneggiato","Could not finish the update":"Impossibile completare l’aggiornamento","Could not activate the new firmware":"Impossibile attivare il nuovo firmware","Update installed, the device is restarting":"Aggiornamento installato, il dispositivo si riavvia"},Wt=[["Disconnected and cleared credentials for ","Disconnesso, credenziali cancellate per "],["Connecting to ","Connessione a "]];function wt(t){if(_!=="it"||!t)return t;const e=ct[t]??ct[t.replace(/\.$/,"")];if(e)return e;for(const[n,i]of Wt)if(t.startsWith(n))return i+t.slice(n.length);return t}const Ut={"Eastern Time":"Nord America orientale","Central Time":"Nord America centrale","Mountain Time":"Nord America (Montagne Rocciose)","Pacific Time":"Nord America (Pacifico)","Alaska Time":"Alaska","Hawaii Time":"Hawaii","United Kingdom":"Regno Unito","Central Europe":"Europa centrale (Italia)","Eastern Europe":"Europa orientale",Japan:"Giappone",China:"Cina","Australia Eastern":"Australia orientale","Australia Central":"Australia centrale","Australia Western":"Australia occidentale"};function yt(t){return _==="it"?Ut[t]??t:t}function Zt(){if(_==="en")return;const t=(o,s,c)=>{document.getElementById(o)?.setAttribute(s,c)},e=(o,s)=>{const c=document.getElementById(o);c&&(c.textContent=s)};document.title="Configurazione Chroninkle",document.querySelector("main")?.setAttribute("aria-label","Configurazione Chroninkle"),t("wifiSettingsSheet","title","Impostazioni Wi-Fi"),t("wifiSettingsSheet","description","Cerca le reti disponibili e collega il tuo Chroninkle al Wi-Fi."),t("wifiSettingsCloseBtn","aria-label","Chiudi impostazioni Wi-Fi"),t("networkList","label","Reti disponibili"),t("password","label","Password Wi-Fi"),t("password","placeholder","Inserisci la password della rete"),e("scanBtn","Cerca reti"),e("connectBtn","Connetti"),t("geminiCard","title","Chiave API di Gemini"),t("geminiApiKeyInput","label","Chiave API di Gemini"),t("geminiApiKeyInput","placeholder","Inserisci la chiave API di Gemini"),e("geminiClearBtn","Cancella"),e("geminiSaveBtn","Salva"),t("timezoneLocationCard","title","Impostazione ora"),t("timezoneSelect","label","Fuso orario"),t("timezoneSelect","aria-label","Fuso orario"),t("manualTimeInput","label","Ora"),t("manualDateInput","label","Data");const n=document.querySelector("#timezoneLocationCard .form-helper-text");n&&(n.textContent="Imposta prima il fuso orario per sincronizzare l’ora locale. Se serve puoi anche impostare data e ora manualmente."),e("timezoneLocationClearBtn","Cancella"),e("timezoneLocationSaveBtn","Salva"),t("statusToast","aria-label","Notifica di stato"),t("firmwareCard","title","Aggiornamento firmware"),t("firmwareFileInput","label","File del firmware (.bin)"),t("firmwareCodeInput","label","Codice mostrato sul dispositivo"),e("firmwareHelpText","Tocca «Mostra codice» per far comparire un codice monouso sullo schermo del dispositivo, scegli build/chroninkle.bin, inserisci il codice e tocca «Aggiorna». Se il nuovo firmware non riesce ad avviarsi, il dispositivo torna da solo alla versione precedente."),e("firmwareCodeBtn","Mostra codice"),e("firmwareUpdateBtn","Aggiorna");const i=document.getElementById("wifiStatusCard")?.shadowRoot?.getElementById("settingsBtn");i&&(i.textContent="Impostazioni",i.setAttribute("aria-label","Impostazioni"))}const Jt={mode:"absolute",position:"bottom",height:"6rem",strength:2,divCount:5,exponential:!1,opacity:1,curve:"linear",zIndex:2},dt={linear:t=>t,bezier:t=>t*t*(3-2*t),"ease-in":t=>t*t,"ease-out":t=>1-Math.pow(1-t,2),"ease-in-out":t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2};function jt(t){switch(t){case"top":return"to top";case"left":return"to left";case"right":return"to right";default:return"to bottom"}}function Yt(){if(typeof CSS>"u"||typeof CSS.supports!="function")return!1;const t=CSS.supports("backdrop-filter","blur(1px)")||CSS.supports("-webkit-backdrop-filter","blur(1px)"),e=CSS.supports("mask-image","linear-gradient(to bottom, transparent, black)")||CSS.supports("-webkit-mask-image","linear-gradient(to bottom, transparent, black)");return t&&e}function Xt(t){const e={...Jt,...t},n=document.createElement("div"),i=document.createElement("div"),o=jt(e.position),s=Yt(),c=e.position==="top"||e.position==="bottom";if(n.className="gradual-blur",e.className&&n.classList.add(e.className),s||(n.classList.add("gradual-blur--fallback"),n.style.background=`linear-gradient(${o}, transparent 0%, ${e.fallbackColor||"rgba(255, 255, 255, 0.95)"} 100%)`),n.style.position=e.mode,n.style.pointerEvents="none",n.style.zIndex=String(e.zIndex),n.style.opacity="0",n.style.borderRadius="inherit",c?(n.style.height=e.height,n.style.width=e.width||"100%",n.style[e.position]="0",e.mode==="fixed"?(n.style.left="50%",n.style.right="auto",n.style.transform="translateX(-50%)"):(n.style.left="0",n.style.right="0")):(n.style.width=e.width||e.height,n.style.height="100%",n.style.top="0",n.style.bottom="0",n.style[e.position]="0"),i.className="gradual-blur__inner",n.appendChild(i),s){const d=100/e.divCount,u=dt[e.curve]||dt.linear;for(let h=1;h<=e.divCount;h+=1){const f=document.createElement("div"),A=u(h/e.divCount);let S=0;e.exponential?S=Math.pow(2,A*4)*.0625*e.strength:S=.0625*(A*e.divCount+1)*e.strength;const b=Math.round((d*h-d)*10)/10,x=Math.round(d*h*10)/10,k=Math.round((d*h+d)*10)/10,I=Math.round((d*h+d*2)*10)/10;let l=`transparent ${b}%, black ${x}%`;k<=100&&(l+=`, black ${k}%`),I<=100&&(l+=`, transparent ${I}%`),f.className="gradual-blur__layer",f.style.maskImage=`linear-gradient(${o}, ${l})`,f.style.webkitMaskImage=`linear-gradient(${o}, ${l})`,f.style.backdropFilter=`blur(${S.toFixed(3)}rem)`,f.style.setProperty("-webkit-backdrop-filter",`blur(${S.toFixed(3)}rem)`),f.style.opacity=String(e.opacity),i.appendChild(f)}}return window.getComputedStyle(e.mount).position==="static"&&(e.mount.style.position="relative"),e.mount.appendChild(n),{element:n,setVisible(d){n.style.opacity=d?"1":"0"},destroy(){n.remove()}}}const Qt=`:host {
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
`,te=document.createElement("template");te.innerHTML=`
  <style>${Qt}</style>
  <span class="badge">
    <slot></slot>
  </span>
`;const ee=`:host {
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
`,Z="ui-button",St=document.createElement("template");St.innerHTML=`
  <style>${ee}</style>
  <button type="button" part="button">
    <slot></slot>
  </button>
`;function ut(t){return t==="submit"||t==="reset"?t:"button"}class ne extends HTMLElement{static get observedAttributes(){return["disabled","aria-label","type"]}constructor(){super();const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(St.content.cloneNode(!0)),this.button=e.querySelector("button")}connectedCallback(){this.dataset.component=Z,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get type(){return ut(this.getAttribute("type"))}set type(e){this.setAttribute("type",ut(e))}focus(e){this.button.focus(e)}click(){this.button.click()}syncAttributes(){this.button.disabled=this.disabled,this.button.type=this.type,this.tabIndex=this.disabled?-1:0;const e=this.getAttribute("aria-label");e?this.button.setAttribute("aria-label",e):this.button.removeAttribute("aria-label")}}function ie(){customElements.get(Z)||customElements.define(Z,ne)}const oe=`:host {
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
`,J="ui-bottom-sheet",xt=document.createElement("template"),re=["a[href]","button:not([disabled])","details summary","input:not([disabled])","select:not([disabled])","textarea:not([disabled])",'[tabindex]:not([tabindex="-1"])'].join(", ");let G=0;xt.innerHTML=`
  <style>${oe}</style>
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
`;function ht(t){const e=getComputedStyle(t);return t.hasAttribute("hidden")||t.getAttribute("aria-hidden")==="true"||e.display==="none"||e.visibility==="hidden"?!1:t.tagName.includes("-")?e.display==="contents"||!!t.getClientRects().length:t.offsetParent!==null||e.position==="fixed"||!!t.getClientRects().length}function K(t){if(!t.shadowRoot)return[];const e=[],n=new Set;function i(o){if(o instanceof HTMLSlotElement){const s=o.assignedElements({flatten:!0});s.length>0?s.forEach(i):Array.from(o.children).forEach(i);return}if(o instanceof HTMLElement&&ht(o)){if(o.shadowRoot){Array.from(o.shadowRoot.childNodes).forEach(i);return}!n.has(o)&&o.matches(re)&&ht(o)&&(n.add(o),e.push(o)),Array.from(o.children).forEach(i)}}return Array.from(t.shadowRoot.childNodes).forEach(i),e}function ae(t,e){if(e===t||e.contains(t))return!0;let n=t;for(;n;){if(n===e)return!0;const i=n.getRootNode();if(!(i instanceof ShadowRoot))break;n=i.host}return!1}function W(t){return t.assignedNodes({flatten:!0}).some(e=>e.nodeType===Node.TEXT_NODE?e.textContent?.trim().length:e.nodeType===Node.ELEMENT_NODE)}class se extends HTMLElement{constructor(){super(),this.isAnimatingClose=!1,this.isSyncingOpenAttribute=!1,this.previousDocumentOverflow="",this.previousBodyOverflow="",this.triggerElement=null;const e=this.attachShadow({mode:"open"});e.append(xt.content.cloneNode(!0)),this.dialog=e.querySelector(".bottom-sheet-dialog"),this.titleElement=e.querySelector(".bottom-sheet-title"),this.descriptionElement=e.querySelector(".bottom-sheet-description"),this.headerActionsContainer=e.querySelector(".bottom-sheet-header-actions"),this.footerContainer=e.querySelector(".bottom-sheet-footer"),this.floatingContainer=e.querySelector(".bottom-sheet-floating"),this.headerActionsSlot=e.querySelector('slot[name="header-actions"]'),this.footerSlot=e.querySelector('slot[name="footer"]'),this.floatingSlot=e.querySelector('slot[name="floating-content"]'),G+=1,this.titleId=`bottomSheetTitle${G}`,this.descriptionId=`bottomSheetDescription${G}`,this.handleAnimationEndBound=this.handleAnimationEnd.bind(this),this.handleCancelBound=this.handleCancel.bind(this),this.handleClickBound=this.handleClick.bind(this),this.handleKeyDownBound=this.handleKeyDown.bind(this),this.handleSlotChangeBound=this.syncSlotVisibility.bind(this)}static get observedAttributes(){return["description","open","title"]}connectedCallback(){this.dataset.component=J,this.dialog.addEventListener("animationend",this.handleAnimationEndBound),this.dialog.addEventListener("cancel",this.handleCancelBound),this.dialog.addEventListener("click",this.handleClickBound),this.dialog.addEventListener("keydown",this.handleKeyDownBound),this.addEventListener("keydown",this.handleKeyDownBound),this.headerActionsSlot.addEventListener("slotchange",this.handleSlotChangeBound),this.footerSlot.addEventListener("slotchange",this.handleSlotChangeBound),this.floatingSlot.addEventListener("slotchange",this.handleSlotChangeBound),this.syncAttributes(),this.syncSlotVisibility(),this.hasAttribute("open")&&this.openInternal()}disconnectedCallback(){this.dialog.removeEventListener("animationend",this.handleAnimationEndBound),this.dialog.removeEventListener("cancel",this.handleCancelBound),this.dialog.removeEventListener("click",this.handleClickBound),this.dialog.removeEventListener("keydown",this.handleKeyDownBound),this.removeEventListener("keydown",this.handleKeyDownBound),this.headerActionsSlot.removeEventListener("slotchange",this.handleSlotChangeBound),this.footerSlot.removeEventListener("slotchange",this.handleSlotChangeBound),this.floatingSlot.removeEventListener("slotchange",this.handleSlotChangeBound),this.dialog.open&&this.dialog.close(),this.unlockDocumentScroll()}attributeChangedCallback(e){if(e==="open"){if(!this.isConnected||this.isSyncingOpenAttribute)return;this.hasAttribute("open")?this.openInternal():this.startClosing();return}this.syncAttributes()}get open(){return this.hasAttribute("open")}set open(e){this.toggleAttribute("open",e)}openBottomSheet(){this.open&&!this.isAnimatingClose||(this.triggerElement=document.activeElement instanceof HTMLElement?document.activeElement:null,this.open=!0)}closeBottomSheet(){!this.open&&!this.dialog.open||(this.open=!1)}focus(e){(K(this)[0]??this.dialog).focus(e)}syncAttributes(){const e=this.getAttribute("title")||"",n=this.getAttribute("description")||"";this.titleElement.id=this.titleId,this.titleElement.textContent=e,this.titleElement.hidden=e.length===0,this.descriptionElement.id=this.descriptionId,this.descriptionElement.textContent=n,this.descriptionElement.hidden=n.length===0,e.length>0?this.dialog.setAttribute("aria-labelledby",this.titleId):this.dialog.removeAttribute("aria-labelledby"),n.length>0?this.dialog.setAttribute("aria-describedby",this.descriptionId):this.dialog.removeAttribute("aria-describedby")}syncSlotVisibility(){this.headerActionsContainer.hidden=!W(this.headerActionsSlot),this.footerContainer.hidden=!W(this.footerSlot),this.floatingContainer.hidden=!W(this.floatingSlot)}handleAnimationEnd(e){!this.isAnimatingClose||e.target!==this.dialog||(this.dialog.classList.remove("closing"),this.dialog.close(),this.isAnimatingClose=!1,this.unlockDocumentScroll(),this.restoreTriggerFocus(),this.dispatchEvent(new Event("close",{bubbles:!0,composed:!0})))}handleCancel(e){e.preventDefault(),this.closeBottomSheet()}handleClick(e){this.isAnimatingClose||e.target===this.dialog&&this.closeBottomSheet()}handleKeyDown(e){if(e.currentTarget===this&&e.composedPath().includes(this.dialog))return;if(e.key==="Escape"){e.preventDefault(),this.closeBottomSheet();return}if(e.key!=="Tab")return;const n=K(this);if(n.length===0){e.preventDefault(),this.dialog.focus();return}const i=e.composedPath()[0],o=i instanceof HTMLElement?i:document.activeElement instanceof HTMLElement?document.activeElement:null,s=o===null?-1:n.findIndex(h=>ae(o,h)),c=e.shiftKey?-1:1,d=e.shiftKey?n.length-1:0,u=s===-1?d:(s+c+n.length)%n.length;e.preventDefault(),n[u].focus()}openInternal(){this.syncAttributes(),this.syncSlotVisibility(),this.isAnimatingClose&&(this.dialog.classList.remove("closing"),this.isAnimatingClose=!1),this.dialog.open?this.lockDocumentScroll():(this.lockDocumentScroll(),this.dialog.showModal()),requestAnimationFrame(()=>{if(!this.dialog.open)return;(K(this)[0]??this.dialog).focus()})}startClosing(){!this.dialog.open||this.isAnimatingClose||(this.dialog.classList.add("closing"),this.isAnimatingClose=!0)}lockDocumentScroll(){this.previousDocumentOverflow.length===0&&this.previousBodyOverflow.length===0&&(this.previousDocumentOverflow=document.documentElement.style.overflow,this.previousBodyOverflow=document.body.style.overflow),document.documentElement.style.overflow="hidden",document.body.style.overflow="hidden"}unlockDocumentScroll(){document.documentElement.style.overflow=this.previousDocumentOverflow,document.body.style.overflow=this.previousBodyOverflow,this.previousDocumentOverflow="",this.previousBodyOverflow=""}restoreTriggerFocus(){this.triggerElement&&document.contains(this.triggerElement)&&this.triggerElement.focus(),this.triggerElement=null}}function le(){customElements.get(J)||customElements.define(J,se)}const ce=`:host {
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
`,j="ui-card",At=document.createElement("template");At.innerHTML=`
  <style>${ce}</style>
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
`;function de(t,e){return t.includes("class=")?t.replace("<svg",`<svg class="${e}"`):t.replace("<svg",`<svg class="${e}"`)}class ue extends HTMLElement{static get observedAttributes(){return["title"]}constructor(){super();const e=this.attachShadow({mode:"open"});e.append(At.content.cloneNode(!0)),this.footerContainer=e.querySelector(".card-component__footer"),this.footerSlot=e.querySelector('slot[name="footer"]'),this.footerSlot.addEventListener("slotchange",()=>{this.syncFooterVisibility()}),this.iconElement=e.querySelector(".card-component__icon"),this.notificationElement=e.querySelector(".connection-notification"),this.titleElement=e.querySelector(".card-component__title")}connectedCallback(){this.dataset.component=j,this.syncAttributes(),this.syncFooterVisibility()}attributeChangedCallback(){this.syncAttributes()}get iconSvg(){return this.iconElement.innerHTML}set iconSvg(e){this.iconElement.innerHTML=e?de(e,"card-component__icon"):""}setNotification(e,n="info"){if(!e){this.notificationElement.hidden=!0,this.notificationElement.textContent="",this.notificationElement.removeAttribute("data-status"),this.notificationElement.setAttribute("role","status"),this.notificationElement.setAttribute("aria-live","polite");return}this.notificationElement.hidden=!1,this.notificationElement.textContent=e,this.notificationElement.setAttribute("data-status",n),n==="error"||n==="danger"?(this.notificationElement.setAttribute("role","alert"),this.notificationElement.setAttribute("aria-live","assertive")):n==="warning"?(this.notificationElement.setAttribute("role","alert"),this.notificationElement.setAttribute("aria-live","polite")):(this.notificationElement.setAttribute("role","status"),this.notificationElement.setAttribute("aria-live","polite"))}syncAttributes(){this.titleElement.textContent=this.getAttribute("title")||""}syncFooterVisibility(){const e=this.footerSlot.assignedElements({flatten:!0}).length>0;this.footerContainer.hidden=!e}}function he(){customElements.get(j)||customElements.define(j,ue)}const ge=`:host {
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
`,me=document.createElement("template");me.innerHTML=`
  <style>${ge}</style>
  <div class="form-control">
    <label></label>
    <div class="form-control__input-wrapper duration-fields">
      <ui-input variant="number" inputmode="numeric"></ui-input>
      <ui-input variant="number" inputmode="numeric"></ui-input>
    </div>
  </div>
`;const pe=`:host {
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
`,Y="ui-file-upload",Ct=document.createElement("template");Ct.innerHTML=`
  <style>${pe}</style>
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
`;class fe extends HTMLElement{static get observedAttributes(){return["accept","aria-label","disabled","label","multiple","name","progress-max","progress-message","progress-value","warning-text"]}constructor(){super();const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(Ct.content.cloneNode(!0)),this.helperText=e.querySelector(".form-helper-text"),this.input=e.querySelector("input"),this.labelElement=e.querySelector("label"),this.progressBar=e.querySelector("progress"),this.progressContainer=e.querySelector(".progress-bar"),this.progressMessage=e.querySelector(".progress-bar__message"),this.input.addEventListener("change",n=>{n.stopPropagation(),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}),this.input.addEventListener("input",n=>{n.stopPropagation(),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))})}connectedCallback(){this.dataset.component=Y,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get accept(){return this.input.accept}set accept(e){this.setAttribute("accept",e)}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get files(){return this.input.files}get progressHidden(){return this.progressContainer.hidden}set progressHidden(e){this.progressContainer.hidden=e}get progressMax(){return this.progressBar.max}set progressMax(e){this.progressBar.max=e}get progressMessageText(){return this.progressMessage.textContent||""}set progressMessageText(e){this.progressMessage.textContent=e}get progressValue(){return this.progressBar.value}set progressValue(e){this.progressBar.value=e}get value(){return this.input.value}get warningText(){return this.helperText.textContent||""}set warningText(e){this.helperText.textContent=e}focus(e){this.input.focus(e)}syncAttributes(){const e=this.id||"file-upload",n=this.getAttribute("label")||"",i=this.getAttribute("warning-text")||"";this.input.id=e,this.input.accept=this.getAttribute("accept")||"",this.input.disabled=this.disabled,this.tabIndex=this.disabled?-1:0,this.input.multiple=this.hasAttribute("multiple"),this.syncStringAttribute("aria-label"),this.syncStringAttribute("name"),this.hasAttribute("progress-max")&&(this.progressBar.max=Number(this.getAttribute("progress-max"))||100),this.hasAttribute("progress-value")&&(this.progressBar.value=Number(this.getAttribute("progress-value"))||0),this.hasAttribute("progress-message")&&(this.progressMessage.textContent=this.getAttribute("progress-message")||""),this.labelElement.htmlFor=e,this.labelElement.textContent=n,this.labelElement.hidden=n.length===0,this.helperText.textContent=i,this.helperText.hidden=i.length===0}syncStringAttribute(e){const n=this.getAttribute(e);if(n===null){this.input.removeAttribute(e);return}this.input.setAttribute(e,n)}}function be(){customElements.get(Y)||customElements.define(Y,fe)}const ve=`:host {
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
`,X="ui-icon-button",Tt=document.createElement("template");Tt.innerHTML=`
  <style>${ve}</style>
  <button type="button" part="button">
    <slot></slot>
  </button>
`;function gt(t){return t==="submit"||t==="reset"?t:"button"}class we extends HTMLElement{static get observedAttributes(){return["disabled","aria-label","type"]}constructor(){super();const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(Tt.content.cloneNode(!0)),this.button=e.querySelector("button")}connectedCallback(){this.dataset.component=X,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get type(){return gt(this.getAttribute("type"))}set type(e){this.setAttribute("type",gt(e))}focus(e){this.button.focus(e)}click(){this.button.click()}syncAttributes(){this.button.disabled=this.disabled,this.button.type=this.type,this.tabIndex=this.disabled?-1:0;const e=this.getAttribute("aria-label");e?this.button.setAttribute("aria-label",e):this.button.removeAttribute("aria-label")}}function ye(){customElements.get(X)||customElements.define(X,we)}const Se='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/></svg>',xe='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/></svg>',Ae=`:host {
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
`,Q="ui-input",kt=document.createElement("template");kt.innerHTML=`
  <style>${Ae}</style>
  <div class="form-control">
    <label></label>
    <div class="form-control__input-wrapper">
      <input />
      <span class="duration-fields__unit"></span>
    </div>
    <p class="form-helper-text"></p>
  </div>
`;function Ce(t){return t==="number"||t==="password"||t==="time"||t==="date"?t:"text"}function Te(t){return t==="password"||t==="number"||t==="time"||t==="date"?t:"text"}class ke extends HTMLElement{constructor(){super(),this.isPasswordVisible=!1,this.customValidationMessage="";const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(kt.content.cloneNode(!0)),this.input=e.querySelector("input"),this.helperText=e.querySelector(".form-helper-text"),this.label=e.querySelector("label"),this.suffix=e.querySelector(".duration-fields__unit"),this.toggleButton=document.createElement("button"),this.wrapper=e.querySelector(".form-control__input-wrapper"),this.toggleButton.className="password-toggle-btn",this.toggleButton.type="button",this.input.addEventListener("input",n=>{this.syncValidationState(),n.stopPropagation(),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))}),this.input.addEventListener("change",n=>{this.syncValidationState(),n.stopPropagation(),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}),this.input.addEventListener("invalid",()=>{this.syncValidationState()}),this.toggleButton.addEventListener("click",()=>{this.togglePasswordVisibility()})}static get observedAttributes(){return["aria-label","aria-invalid","autocomplete","disabled","helper-text","invalid","inputmode","label","max","maxlength","min","name","placeholder","readonly","required","step","suffix","type","value","variant"]}connectedCallback(){this.hasAttribute("variant")||this.setAttribute("variant","text"),this.dataset.component=Q,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get type(){return this.input.type}set type(e){this.setAttribute("type",e)}get value(){return this.input.value}set value(e){this.input.value=e,this.syncValidationState()}focus(e){this.input.focus(e)}select(){this.input.select()}get validationMessage(){return this.input.validationMessage}get validity(){return this.input.validity}get willValidate(){return this.input.willValidate}checkValidity(){const e=this.input.checkValidity();return this.syncValidationState(),e}reportValidity(){const e=this.input.reportValidity();return this.syncValidationState(),e}setCustomValidity(e){this.customValidationMessage=e,this.input.setCustomValidity(e),this.syncValidationState()}syncAttributes(){const e=Ce(this.getAttribute("variant")),n=this.getAttribute("helper-text")||"",i=this.id?`${this.id}Input`:"input",o=this.getAttribute("label")||"",s=this.getAttribute("suffix")||"",c=e==="password"?this.isPasswordVisible?"text":"password":this.getAttribute("type")||Te(e);if(this.input.id=i,this.input.type=c,this.input.disabled=this.disabled,this.tabIndex=this.disabled?-1:0,this.input.readOnly=this.hasAttribute("readonly"),this.input.required=this.hasAttribute("required"),this.syncStringAttribute("aria-label"),this.syncStringAttribute("autocomplete"),this.syncStringAttribute("inputmode"),this.syncStringAttribute("max"),this.syncStringAttribute("maxlength"),this.syncStringAttribute("min"),this.syncStringAttribute("name"),this.syncStringAttribute("placeholder"),this.syncStringAttribute("step"),this.hasAttribute("value")&&this.input.value!==this.getAttribute("value")&&(this.input.value=this.getAttribute("value")||""),this.input.setCustomValidity(this.customValidationMessage),this.label.htmlFor=i,this.label.textContent=o,this.label.hidden=o.length===0,this.helperText.textContent=n,this.helperText.hidden=n.length===0,this.wrapper.classList.toggle("duration-fields",e==="number"),this.suffix.textContent=s,this.suffix.hidden=e!=="number"||s.length===0,n.length>0){const d=`${i}HelperText`;this.helperText.id=d,this.input.setAttribute("aria-describedby",d)}else this.helperText.removeAttribute("id"),this.input.removeAttribute("aria-describedby");e==="password"?(this.toggleButton.isConnected||this.wrapper.append(this.toggleButton),this.toggleButton.disabled=this.disabled,this.toggleButton.setAttribute("aria-label",this.isPasswordVisible?r("Hide password","Nascondi password"):r("Show password","Mostra password")),this.toggleButton.innerHTML=Ee(this.isPasswordVisible?Se:xe,"password-icon")):(this.isPasswordVisible=!1,this.toggleButton.remove()),this.syncValidationState()}syncStringAttribute(e){const n=this.getAttribute(e);if(n===null){this.input.removeAttribute(e);return}this.input.setAttribute(e,n)}togglePasswordVisibility(){this.isPasswordVisible=!this.isPasswordVisible,this.syncAttributes()}syncValidationState(){const e=this.hasAttribute("invalid")||this.getAttribute("aria-invalid")==="true"||!this.input.validity.valid;this.classList.toggle("error",e),this.input.classList.toggle("error",e),this.hasAttribute("invalid")!==e&&this.toggleAttribute("invalid",e),this.getAttribute("aria-invalid")!==String(e)&&this.setAttribute("aria-invalid",String(e)),this.input.getAttribute("aria-invalid")!==String(e)&&this.input.setAttribute("aria-invalid",String(e))}}function Ee(t,e){return t.includes("class=")?t.replace("<svg",`<svg class="${e}"`):t.replace("<svg",`<svg class="${e}"`)}function Ie(){customElements.get(Q)||customElements.define(Q,ke)}const _e=`:host {
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
`,tt="ui-network-list",Et="networkList",et="network-list-label",It=document.createElement("template");It.innerHTML=`
  <style>${_e}</style>
  <div class="networks">
    <span id="${et}" hidden>Available networks</span>
    <ul
      id="${Et}"
      class="networks__list"
      role="listbox"
      aria-labelledby="${et}"
      tabindex="0"
    ></ul>
  </div>
`;class Le extends HTMLElement{static get observedAttributes(){return["aria-label","label"]}constructor(){super();const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(It.content.cloneNode(!0)),this.labelElement=e.querySelector(`#${et}`),this.listElement=e.querySelector(`#${Et}`),this.listElement.addEventListener("keydown",n=>{(n.key==="ArrowDown"||n.key==="ArrowUp"||n.key==="Home"||n.key==="End"||n.key===" ")&&n.preventDefault()})}connectedCallback(){this.tabIndex=0,this.dataset.component=tt,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}appendItem(e){this.listElement.appendChild(e)}clearItems(){this.listElement.innerHTML=""}focus(e){this.listElement.focus(e)}getOptions(){return Array.from(this.listElement.querySelectorAll('[role="option"]'))}scrollOptionIntoView(e){const n=this.getOptions()[e];if(!n)return;const i=this.listElement.scrollTop,o=i+this.listElement.clientHeight,s=n.offsetTop,c=s+n.offsetHeight;if(s<i){this.listElement.scrollTop=s;return}c>o&&(this.listElement.scrollTop=c-this.listElement.clientHeight)}setActiveDescendant(e){if(e){this.listElement.setAttribute("aria-activedescendant",e);return}this.listElement.removeAttribute("aria-activedescendant")}setEmptyState(e){this.clearItems(),this.appendItem(e)}syncAttributes(){const e=this.getAttribute("label")||r("Available networks","Reti disponibili"),n=this.getAttribute("aria-label");this.labelElement.textContent=e,n?this.listElement.setAttribute("aria-label",n):this.listElement.removeAttribute("aria-label")}}function ze(){customElements.get(tt)||customElements.define(tt,Le)}const Be=`:host {
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
`,nt="ui-network-status",_t="actionBtn",Lt="settingsBtn",zt="wifiStatusLabel",Bt="wifiStatusIcon",qt="wifiStatusNetwork",Mt=document.createElement("template");Mt.innerHTML=`
  <style>${Be}</style>
  <div class="wifi-status-card">
    <div class="wifi-status-card__content">
      <div class="wifi-status-card__status">
        <span class="card-icon" id="${Bt}"></span>
        <span id="${zt}" class="wifi-status-card__label">
          Disconnected
        </span>
        <span
          id="${qt}"
          class="wifi-status-card__network"
        ></span>
      </div>
      <div class="wifi-status-card__actions">
        <ui-button
          id="${_t}"
          variant="outline"
          inverse
          aria-label="Connect"
        >
          Connect
        </ui-button>
        <ui-button
          id="${Lt}"
          variant="outline"
          inverse
          aria-label="Settings"
        >
          Settings
        </ui-button>
      </div>
    </div>
  </div>
`;function qe(t,e){return t.includes("class=")?t.replace("<svg",`<svg class="${e}"`):t.replace("<svg",`<svg class="${e}"`)}class Me extends HTMLElement{static get observedAttributes(){return["action-label","network","status-label"]}constructor(){super();const e=this.attachShadow({mode:"open"});e.append(Mt.content.cloneNode(!0)),this.actionButton=e.querySelector(`#${_t}`),this.actionButton.addEventListener("click",n=>{n.stopPropagation(),this.dispatchEvent(new Event("action",{bubbles:!0,composed:!0}))}),this.iconElement=e.querySelector(`#${Bt}`),this.labelElement=e.querySelector(`#${zt}`),this.networkElement=e.querySelector(`#${qt}`),this.settingsButton=e.querySelector(`#${Lt}`),this.settingsButton.addEventListener("click",n=>{n.stopPropagation(),this.dispatchEvent(new Event("settings",{bubbles:!0,composed:!0}))})}connectedCallback(){this.dataset.component=nt,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get actionDisabled(){return!!this.actionButton.disabled}set actionDisabled(e){this.actionButton.disabled=e}get iconSvg(){return this.iconElement.innerHTML}set iconSvg(e){this.iconElement.innerHTML=e?qe(e,"wifi-icon"):""}get network(){return this.getAttribute("network")||""}set network(e){this.setAttribute("network",e)}get actionLabel(){return this.getAttribute("action-label")||r("Connect","Connetti")}set actionLabel(e){this.setAttribute("action-label",e)}get statusLabel(){return this.getAttribute("status-label")||r("Disconnected","Disconnesso")}set statusLabel(e){this.setAttribute("status-label",e)}syncAttributes(){this.actionButton.textContent=this.actionLabel,this.actionButton.setAttribute("aria-label",this.actionLabel),this.labelElement.textContent=this.statusLabel,this.networkElement.textContent=this.network,this.networkElement.hidden=this.network.length===0}}function Pe(){customElements.get(nt)||customElements.define(nt,Me)}const Ne=`:host {
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
`,Oe=document.createElement("template");Oe.innerHTML=`
  <style>${Ne}</style>
  <div class="form-control">
    <label></label>
    <div class="range-slider">
      <input class="range-slider__range" type="range" />
      <span class="range-slider__value"></span>
    </div>
  </div>
`;const Fe='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-80 240-320l57-57 183 183 183-183 57 57L480-80ZM298-584l-58-56 240-240 240 240-58 56-182-182-182 182Z"/></svg>',De=`:host {
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
`,it="ui-select",Pt=document.createElement("template");Pt.innerHTML=`
  <style>${De}</style>
  <div class="form-control">
    <label></label>
    <div class="form-control__input-wrapper">
      <select></select>
      <span class="select-icon"></span>
    </div>
    <p class="form-helper-text"></p>
  </div>
`;class $e extends HTMLElement{constructor(){super(),this.customValidationMessage="";const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(Pt.content.cloneNode(!0)),this.helperText=e.querySelector(".form-helper-text"),this.labelElement=e.querySelector("label"),this.select=e.querySelector("select");const n=e.querySelector(".select-icon");n.innerHTML=He(Fe,"select-icon"),this.select.addEventListener("change",i=>{this.syncValidationState(),i.stopPropagation(),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}),this.select.addEventListener("input",i=>{this.syncValidationState(),i.stopPropagation(),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))}),this.select.addEventListener("invalid",()=>{this.syncValidationState()})}static get observedAttributes(){return["aria-invalid","aria-label","disabled","helper-text","invalid","label","name","required","value"]}connectedCallback(){this.moveLightDomOptions(),this.dataset.component=it,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get innerHTML(){return this.select.innerHTML}set innerHTML(e){this.select.innerHTML=e,this.syncValidationState()}get value(){return this.select.value}set value(e){this.select.value=e,this.syncValidationState()}appendChild(e){return e instanceof HTMLOptionElement||e instanceof HTMLOptGroupElement?(this.select.appendChild(e),e):super.appendChild(e)}focus(e){this.select.focus(e)}get validationMessage(){return this.select.validationMessage}get validity(){return this.select.validity}get willValidate(){return this.select.willValidate}checkValidity(){const e=this.select.checkValidity();return this.syncValidationState(),e}reportValidity(){const e=this.select.reportValidity();return this.syncValidationState(),e}setCustomValidity(e){this.customValidationMessage=e,this.select.setCustomValidity(e),this.syncValidationState()}moveLightDomOptions(){Array.from(this.children).forEach(e=>{(e instanceof HTMLOptionElement||e instanceof HTMLOptGroupElement)&&this.select.appendChild(e)})}syncAttributes(){const e=this.getAttribute("helper-text")||"",n=this.id?`${this.id}Select`:"select",i=this.getAttribute("label")||"";if(this.select.id=n,this.select.disabled=this.disabled,this.tabIndex=this.disabled?-1:0,this.select.required=this.hasAttribute("required"),this.syncStringAttribute("aria-label"),this.syncStringAttribute("name"),this.hasAttribute("value")&&(this.select.value=this.getAttribute("value")||""),this.select.setCustomValidity(this.customValidationMessage),this.labelElement.htmlFor=n,this.labelElement.textContent=i,this.labelElement.hidden=i.length===0,this.helperText.textContent=e,this.helperText.hidden=e.length===0,e.length>0){const o=`${n}HelperText`;this.helperText.id=o,this.select.setAttribute("aria-describedby",o)}else this.helperText.removeAttribute("id"),this.select.removeAttribute("aria-describedby");this.syncValidationState()}syncStringAttribute(e){const n=this.getAttribute(e);if(n===null){this.select.removeAttribute(e);return}this.select.setAttribute(e,n)}syncValidationState(){const e=this.hasAttribute("invalid")||this.getAttribute("aria-invalid")==="true"||!this.select.validity.valid;this.classList.toggle("error",e),this.select.classList.toggle("error",e),this.hasAttribute("invalid")!==e&&this.toggleAttribute("invalid",e),this.getAttribute("aria-invalid")!==String(e)&&this.setAttribute("aria-invalid",String(e)),this.select.getAttribute("aria-invalid")!==String(e)&&this.select.setAttribute("aria-invalid",String(e))}}function Ve(){customElements.get(it)||customElements.define(it,$e)}function He(t,e){return t.includes("class=")?t.replace("<svg",`<svg class="${e}"`):t.replace("<svg",`<svg class="${e}"`)}const Re=`:host {
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
`,Ge=document.createElement("template");Ge.innerHTML=`
  <style>${Re}</style>
  <div class="form-control">
    <div class="switch-container">
      <button type="button" part="button">
        <span class="knob"></span>
      </button>
      <span class="switch-label"></span>
    </div>
  </div>
`;const Ke=`:host {
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
`,ot="ui-toast",Nt=document.createElement("template");Nt.innerHTML=`
  <style>${Ke}</style>
  <dialog class="toast-dialog" aria-live="polite">
    <p class="toast-dialog__message"></p>
  </dialog>
`;function mt(t){return t==="success"||t==="info"||t==="warning"||t==="error"||t==="danger"?t:null}class We extends HTMLElement{static get observedAttributes(){return["aria-label","message","status"]}constructor(){super();const e=this.attachShadow({mode:"open"});e.append(Nt.content.cloneNode(!0)),this.dialog=e.querySelector("dialog"),this.messageElement=e.querySelector(".toast-dialog__message")}connectedCallback(){this.dataset.component=ot,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get message(){return this.messageElement.textContent||""}set message(e){this.setAttribute("message",e)}get status(){return mt(this.getAttribute("status"))}set status(e){if(e){this.setAttribute("status",e);return}this.removeAttribute("status")}show(e,n){typeof e=="string"&&(this.message=e),n&&(this.status=n),this.dialog.open||this.dialog.show()}close(e){this.dialog.close(e)}syncAttributes(){const e=this.getAttribute("aria-label"),n=this.getAttribute("message")||"",i=mt(this.getAttribute("status"));e?this.dialog.setAttribute("aria-label",e):this.dialog.removeAttribute("aria-label"),this.messageElement.textContent=n,this.messageElement.id=this.id?`${this.id}Message`:"statusToastMessage",this.dialog.id=this.id||"statusToast",i?this.dialog.setAttribute("data-status",i):this.dialog.removeAttribute("data-status")}}function Ue(){customElements.get(ot)||customElements.define(ot,We)}const Ze='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m109-531-85-85q92-89 210-136.5T480-800q128 0 246 47.5T936-616l-85 85q-75-72-171-110.5T480-680q-104 0-200 38.5T109-531Zm169 169-84-84q59-55 132.5-84.5T480-560q80 0 153.5 29.5T766-446l-84 84q-42-38-93.5-58T480-440q-57 0-108.5 20T278-362Zm202 202q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Z"/></svg>',Je='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/></svg>',je='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q96-98 220-149t260-51q137 0 261 51t219 149L480-120ZM361-353q25-18 55.5-28t63.5-10q33 0 63.5 10t55.5 28l245-245q-78-59-170.5-90.5T480-720q-101 0-193.5 31.5T116-598l245 245Z"/></svg>',Ye='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q96-98 220-149t260-51q137 0 261 51t219 149L480-120ZM299-415q38-28 84-43.5t97-15.5q51 0 97 15.5t84 43.5l183-183q-78-59-170.5-90.5T480-720q-101 0-193.5 31.5T116-598l183 183Z"/></svg>',Xe='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q96-98 220-149t260-51q137 0 261 51t219 149L480-120ZM232-482q53-38 116-59.5T480-563q69 0 132 21.5T728-482l116-116q-78-59-170.5-90.5T480-720q-101 0-193.5 31.5T116-598l116 116Z"/></svg>',Qe='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q95-97 219.5-148.5T480-800q136 0 260.5 51.5T960-600L480-120Z"/></svg>',tn='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-601q93-93 215.5-146T480-800q142 0 264.5 53T960-601l-56 57q-81-81-190-128.5T480-720q-103 0-195 32.5T117-597l419 420-56 57Zm384-40L761-262q-18 11-38 16.5t-43 5.5q-68 0-114-46t-46-114q0-68 46-114t114-46q68 0 114 46t46 114q0 23-5.5 43T818-319l102 103-56 56ZM680-320q34 0 57-23t23-57q0-34-23-57t-57-23q-34 0-57 23t-23 57q0 34 23 57t57 23ZM480-177Z"/></svg>',en='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M280-240q-100 0-170-70T40-480q0-100 70-170t170-70q66 0 121 33t87 87h432v240h-80v120H600v-120H488q-32 54-87 87t-121 33Zm0-80q66 0 106-40.5t48-79.5h246v120h80v-120h80v-80H434q-8-39-48-79.5T280-640q-66 0-113 47t-47 113q0 66 47 113t113 47Zm0-80q33 0 56.5-23.5T360-480q0-33-23.5-56.5T280-560q-33 0-56.5 23.5T200-480q0 33 23.5 56.5T280-400Zm0-80Z"/></svg>',nn='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>',on='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/></svg>',rn='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m720-80 120-120-28-28-72 72v-164h-40v164l-72-72-28 28L720-80ZM480-800 243-663l237 137 237-137-237-137ZM120-321v-318q0-22 10.5-40t29.5-29l280-161q10-5 19.5-8t20.5-3q11 0 21 3t19 8l280 161q19 11 29.5 29t10.5 40v159h-80v-116L479-434 200-596v274l240 139v92L160-252q-19-11-29.5-29T120-321ZM720 0q-83 0-141.5-58.5T520-200q0-83 58.5-141.5T720-400q83 0 141.5 58.5T920-200q0 83-58.5 141.5T720 0ZM480-491Z"/></svg>',an={"Content-Type":"application/json",Accept:"application/json"},U=64,sn=2e3,ln=8,cn=2e3,dn=8,un=3e3,hn=750,gn=20,mn="/api/settings",pn=`${mn}/time`,fn="/api/runtime/time",bn=1e4;async function L(t,e){const n=new AbortController,i=setTimeout(()=>n.abort(),bn);let o;try{o=await fetch(t,{cache:"no-store",...e,signal:e?.signal??n.signal,headers:{...an,...e?.headers||{}}})}catch(u){throw n.signal.aborted?new Error(r(`Request to ${t} timed out. Check the device is still reachable.`,`La richiesta a ${t} è scaduta. Controlla che il dispositivo sia raggiungibile.`)):u}finally{clearTimeout(i)}const s=o.headers.get("content-type")||"",c=await o.text();if(!s.includes("application/json"))throw new Error(r(`Unexpected response for ${t}. Make sure you are connected to the device AP and loading the portal from the ESP32.`,`Risposta inattesa da ${t}. Assicurati di essere connesso alla rete del dispositivo e di aprire il portale da lì.`));const d=JSON.parse(c);if(typeof d.message=="string"&&(d.message=wt(d.message)),!o.ok||d.success!==!0)throw new Error(d.message||r("Request failed.","Richiesta non riuscita."));return d}const vn=(t,e)=>L(t,e),wn=(t,e)=>L(t,e),yn=(t,e)=>L(t,e),Ot=(t,e)=>L(t,e),Sn=(t,e)=>L(t,e);function w(t){const e=document.getElementById(t);if(!e)throw new Error(`Required portal element "#${t}" was not found.`);return e}function xn(){return{wifiStatusCard:w("wifiStatusCard"),wifiSettingsSheet:w("wifiSettingsSheet"),wifiSettingsCloseBtn:w("wifiSettingsCloseBtn"),wifiSettingsNotification:w("wifiSettingsNotification"),networkList:w("networkList"),passwordInput:w("password"),scanBtn:w("scanBtn"),connectBtn:w("connectBtn"),geminiCard:w("geminiCard"),geminiApiKeyInput:w("geminiApiKeyInput"),geminiClearBtn:w("geminiClearBtn"),geminiSaveBtn:w("geminiSaveBtn"),timezoneLocationCard:w("timezoneLocationCard"),timezoneSelect:w("timezoneSelect"),manualTimeInput:w("manualTimeInput"),manualDateInput:w("manualDateInput"),timezoneLocationClearBtn:w("timezoneLocationClearBtn"),timezoneLocationSaveBtn:w("timezoneLocationSaveBtn"),firmwareCard:w("firmwareCard"),firmwareVersionText:w("firmwareVersionText"),firmwareFileInput:w("firmwareFileInput"),firmwareCodeInput:w("firmwareCodeInput"),firmwareCodeBtn:w("firmwareCodeBtn"),firmwareUpdateBtn:w("firmwareUpdateBtn")}}function Ft(t){return(e,n="info")=>{t.setNotification(e,n)}}function An(t){return(e,n="info")=>{if(!e){t.hidden=!0,t.textContent="",t.removeAttribute("data-status"),t.setAttribute("role","status"),t.setAttribute("aria-live","polite");return}t.hidden=!1,t.textContent=e,t.setAttribute("data-status",n),n==="error"||n==="danger"?(t.setAttribute("role","alert"),t.setAttribute("aria-live","assertive")):n==="warning"?(t.setAttribute("role","alert"),t.setAttribute("aria-live","polite")):(t.setAttribute("role","status"),t.setAttribute("aria-live","polite"))}}function F(t){t.classList.remove("error"),t.removeAttribute("invalid"),t.setAttribute("aria-invalid","false"),t.setCustomValidity?.("")}function D(t,e){t.classList.add("error"),t.setAttribute("invalid",""),t.setAttribute("aria-invalid","true"),t.setCustomValidity?.(e)}function Cn(t,e){t.setAttribute("aria-checked",e?"true":"false")}function Tn(t){return t.getAttribute("aria-checked")==="true"}function kn(t,e){return t.includes("class=")?t.replace("<svg",`<svg class="${e}"`):t.replace("<svg",`<svg class="${e}"`)}function En(t){return new Promise(e=>{setTimeout(e,t)})}function In(){const t=document.documentElement.lang?.trim();return t||"en-US"}function _n(t){try{return new Intl.DateTimeFormat(In(),{hour:"numeric",timeZone:t,timeZoneName:"longGeneric"}).formatToParts(new Date).find(i=>i.type==="timeZoneName")?.value?.trim()||""}catch(e){return console.warn(`Failed to format timezone label for "${t}".`,e),""}}function pt(t){return/^(GMT|UTC)(?:[+-]\d{1,2}(?::\d{2})?)?$/.test(t)}function Ln(t){return(t.split("/").pop()||t).replace(/_/g," ")}function Dt(t){return t.split("/").map(e=>e.replace(/_/g," ")).join(" / ")}function zn(t){const e=t.map(o=>{const s=_n(o.name);return{cityLabel:Ln(o.name),genericLabel:s,name:o.name}}),n=new Map(e.map(o=>[o.name,o])),i=new Map;return e.forEach(o=>{!o.genericLabel||pt(o.genericLabel)||i.set(o.genericLabel,(i.get(o.genericLabel)||0)+1)}),new Map(t.map(o=>{const s=n.get(o.name),c=yt(o.description?.trim()||"");if(s?.genericLabel&&!pt(s.genericLabel)){const u=(i.get(s.genericLabel)||0)>1?`${s.genericLabel} (${s.cityLabel})`:s.genericLabel;return[o.name,u]}return c?[o.name,c]:[o.name,Dt(o.name)]}))}function Bn(t,e){return e.get(t.name)||yt(t.description?.trim()||"")||Dt(t.name)}function qn(t){const e=t.value.trim();if(!e)return null;const n=/^(\d{2}):(\d{2})$/.exec(e);if(!n)return null;const i=Number.parseInt(n[1],10),o=Number.parseInt(n[2],10);return!Number.isFinite(i)||!Number.isFinite(o)||i<0||i>23||o<0||o>59?null:i*60+o}const Mn="/api/ota/status",Pn="/api/ota/code",Nn="/api/ota/upload";function On(t){let e=!1,n=0;const i=(h,f="info")=>{t.card.setNotification(h,f)};function o(h){e=h,t.codeButton.disabled=h,t.updateButton.disabled=h,t.fileInput.disabled=h}async function s(){try{const h=await L(Mn);n=h.max_size??0,t.versionText.textContent=r(`Installed version: ${h.version??"?"}`,`Versione installata: ${h.version??"?"}`)}catch(h){console.error("Firmware status failed:",h),t.versionText.textContent=r("This firmware cannot be updated from the portal yet.","Questo firmware non si può ancora aggiornare dal portale."),t.codeButton.disabled=!0,t.updateButton.disabled=!0}}async function c(){if(!e){o(!0);try{await L(Pn,{method:"POST"}),i(r("A 6-digit code is now shown on the device screen. Enter it below.","Sullo schermo del dispositivo è comparso un codice di 6 cifre: inseriscilo qui sotto."),"info")}catch(h){i(h instanceof Error?h.message:r("Could not request a code.","Impossibile richiedere il codice."),"error")}finally{o(!1)}}}function d(){const h=t.fileInput.files?.[0]??null;return h?h.name.toLowerCase().endsWith(".bin")?n>0&&h.size>n?(i(r("The file is too big for this device.","Il file è troppo grande per questo dispositivo."),"error"),null):h:(i(r("The firmware file must be a .bin (build/chroninkle.bin).","Il file del firmware deve essere un .bin (build/chroninkle.bin)."),"error"),null):(i(r("Choose the firmware file (.bin).","Scegli il file del firmware (.bin)."),"error"),null)}function u(){if(e)return;const h=t.codeInput.value.trim();if(!/^\d{6}$/.test(h)){t.setFieldError(t.codeInput,r("Enter the 6-digit code from the device.","Inserisci il codice di 6 cifre del dispositivo."));return}t.clearFieldError(t.codeInput);const f=d();if(!f)return;o(!0),t.fileInput.progressHidden=!1,t.fileInput.progressMax=100,t.fileInput.progressValue=0,t.fileInput.progressMessageText=r("Uploading...","Caricamento..."),i(r("Updating: keep this page open and the device nearby.","Aggiornamento in corso: tieni aperta questa pagina e il dispositivo vicino."),"info");const A=new XMLHttpRequest;A.open("POST",`${Nn}?code=${encodeURIComponent(h)}`),A.setRequestHeader("Content-Type","application/octet-stream"),A.upload.onprogress=S=>{if(S.lengthComputable){const b=Math.round(S.loaded/S.total*100);t.fileInput.progressValue=b,t.fileInput.progressMessageText=`${b}%`}},A.onload=()=>{let S="",b=!1;try{const x=JSON.parse(A.responseText);b=A.status===200&&x.success===!0,S=wt(x.message??"")}catch{S=""}if(b){t.fileInput.progressValue=100,t.fileInput.progressMessageText=r("Done","Fatto"),i(r("Update installed. The device restarts in a few seconds; reconnect to its Wi-Fi to use the portal again.","Aggiornamento installato. Il dispositivo si riavvia tra pochi secondi: per usare di nuovo il portale ricollegati alla sua rete."),"success"),t.codeInput.value="";return}t.fileInput.progressHidden=!0,i(S||r("Update failed.","Aggiornamento non riuscito."),"error"),o(!1)},A.onerror=()=>{t.fileInput.progressHidden=!0,i(r("Connection lost during the update. If the device restarted, wait and reconnect; otherwise try again.","Connessione persa durante l’aggiornamento. Se il dispositivo si è riavviato attendi e ricollegati, altrimenti riprova."),"error"),o(!1)},A.send(f)}return{loadStatus:s,requestCode:c,upload:u,isBusy:()=>e}}function O(t,e,n){t.hasKey=n?.has_key===!0,t.last4=typeof n?.last4=="string"?n.last4:"",e.value=t.hasKey?t.last4?`******${t.last4}`:"******":""}function ft(t,e,n){t.hasKey=!1,t.last4="",e.value="",n("")}async function bt(t,e,n,i,o,s,c){const d=e.value.trim();if(!d){n(`${c} is required.`,"warning");return}t.isBusy=!0,n(s,"info"),i();try{const u=await o(t.settingsApi,{method:"PATCH",body:JSON.stringify({api_key:d})});O(t,e,u.settings),n(u.message||r(`${c} stored.`,`${c}: salvata.`),"success")}catch(u){console.error(`${c} save failed:`,u),n(u instanceof Error?u.message:r(`Failed to store ${c}.`,`Impossibile salvare: ${c}.`),"error")}finally{t.isBusy=!1,i()}}async function vt(t,e,n,i,o,s,c){t.isBusy=!0,n(s,"info"),i();try{const d=await o(t.resetApi,{method:"POST"});O(t,e,d.settings),n(d.message||c,"success")}catch(d){console.error(`${c} failed:`,d),n(d instanceof Error?d.message:r(`Failed to clear ${c}.`,`Impossibile cancellare: ${c}.`),"error")}finally{t.isBusy=!1,i()}}function Fn(t){const e={hasKey:!1,isBusy:!1,last4:"",resetApi:"/api/settings/gemini/reset",settingsApi:"/api/settings/gemini"},n={hasKey:!1,isBusy:!1,last4:"",resetApi:"/api/settings/openai/reset",settingsApi:"/api/settings/openai"};function i(b){const x=b?.routes;e.settingsApi=x?.settings||"/api/settings/gemini",e.resetApi=x?.reset||"/api/settings/gemini/reset"}function o(b){const x=b?.routes;n.settingsApi=x?.settings||"/api/settings/openai",n.resetApi=x?.reset||"/api/settings/openai/reset"}function s(b){O(e,t.geminiApiKeyInput,b)}function c(){ft(e,t.geminiApiKeyInput,t.notifyGemini)}function d(b){O(n,t.openAiApiKeyInput,b)}function u(){ft(n,t.openAiApiKeyInput,t.notifyOpenAi)}async function h(){if(!t.isGeminiModuleActive()||e.isBusy||e.hasKey)return;if(!t.geminiApiKeyInput.value.trim()){t.notifyGemini(r("Gemini API key is required.","Serve la chiave API di Gemini."),"warning");return}await bt(e,t.geminiApiKeyInput,t.notifyGemini,t.updateButtons,t.fetchGeminiModuleJson,r("Saving Gemini API key...","Salvataggio chiave API di Gemini..."),r("Gemini API key","Chiave API di Gemini"))}async function f(){!t.isGeminiModuleActive()||e.isBusy||await vt(e,t.geminiApiKeyInput,t.notifyGemini,t.updateButtons,t.fetchGeminiModuleJson,r("Clearing Gemini API key...","Cancellazione chiave API di Gemini..."),r("Gemini API key cleared.","Chiave API di Gemini cancellata."))}async function A(){if(!t.isOpenAiModuleActive()||n.isBusy||n.hasKey)return;if(!t.openAiApiKeyInput.value.trim()){t.notifyOpenAi("OpenAI API key is required.","warning");return}await bt(n,t.openAiApiKeyInput,t.notifyOpenAi,t.updateButtons,t.fetchOpenAiModuleJson,"Saving OpenAI API key...","OpenAI API key")}async function S(){!t.isOpenAiModuleActive()||n.isBusy||await vt(n,t.openAiApiKeyInput,t.notifyOpenAi,t.updateButtons,t.fetchOpenAiModuleJson,"Clearing OpenAI API key...","OpenAI API key cleared.")}return{applyGeminiSettings:s,applyOpenAiSettings:d,clearGeminiKey:f,clearGeminiSettings:c,clearOpenAiKey:S,clearOpenAiSettings:u,getGeminiHasKey:()=>e.hasKey,getOpenAiHasKey:()=>n.hasKey,isGeminiBusy:()=>e.isBusy,isOpenAiBusy:()=>n.isBusy,saveGeminiKey:h,saveOpenAiKey:A,updateGeminiRoutes:i,updateOpenAiRoutes:o}}function Dn(t){let e=!1,n=!1,i=!1,o=!1;async function s(){return t.fetchTimezoneListJson("/api/timezone/list")}function c(l){const m=l.settings,y=l.runtime;t.setSwitchChecked(t.clockModeToggle,!!m?.enabled),t.timezoneSelect.value=m?.timezone_name||"",t.clearFieldError(t.timezoneSelect),t.manualDateInput.value=typeof y?.current_date=="string"?y.current_date:"",t.manualTimeInput.value=typeof y?.current_time=="string"?y.current_time:""}function d(l){l&&(typeof l.clock_enabled=="boolean"&&t.setSwitchChecked(t.clockModeToggle,l.clock_enabled),t.manualDateInput.value=typeof l.current_date=="string"?l.current_date:"",t.manualTimeInput.value=typeof l.current_time=="string"?l.current_time:"")}async function u(){t.timezoneSelect.innerHTML="";const l=document.createElement("option");l.value="",l.textContent=r("Select timezone","Seleziona fuso orario"),t.timezoneSelect.appendChild(l);try{const m=await s(),y=Array.isArray(m.timezones)?m.timezones:[],T=t.buildTimezoneLabelMap(y);y.map(C=>({value:C.name,label:t.formatTimezoneLabel(C,T)})).sort((C,E)=>C.label.localeCompare(E.label)).forEach(C=>{const E=document.createElement("option");E.value=C.value,E.textContent=C.label,t.timezoneSelect.appendChild(E)})}catch(m){console.error("Timezone list fetch failed:",m),t.notify(m instanceof Error?m.message:r("Failed to load timezones.","Impossibile caricare i fusi orari."),"error")}}async function h(){if(!(e||n||i)){e=!0,n=!0,i=!0,t.onStateChange();try{const l=await t.fetchTimeSettingsJson(t.timeSettingsApi);c(l)}catch(l){console.error("Time settings status failed:",l),t.notify(l instanceof Error?l.message:r("Time settings status failed.","Impossibile leggere le impostazioni dell'ora."),"error")}finally{e=!1,n=!1,i=!1,t.onStateChange()}}}async function f(){if(!(i||o)){o=!0;try{for(let l=0;l<t.clockSyncPollAttempts;l++){const m=await t.fetchTimeRuntimeJson(t.timeRuntimeApi);if(d(m.runtime),m.runtime?.time_valid===!0&&typeof m.runtime.current_time=="string"&&m.runtime.current_time.length>0)return;l<t.clockSyncPollAttempts-1&&await new Promise(y=>{setTimeout(y,t.clockSyncPollIntervalMs)})}}catch(l){console.error("Clock refresh after WiFi connect failed:",l)}finally{o=!1}}}async function A(){if(!(document.hidden||e||n||i)&&t.isSwitchChecked(t.clockModeToggle))try{const l=await t.fetchTimeRuntimeJson(t.timeRuntimeApi);d(l.runtime)}catch(l){console.error("Time runtime status failed:",l)}}function S(){const l=t.timezoneSelect.value.trim(),m=t.manualDateInput.value.trim(),y=t.manualTimeInput.value.trim(),T=t.parseClockTimeInputValue(t.wakeupTimeInput),C=t.parseClockTimeInputValue(t.bedtimeTimeInput);return!!m!=!!y?(t.notify(r("Provide both current date and time for a manual clock set.","Per impostare l'ora a mano servono sia la data sia l'ora."),"error"),null):{timezoneName:l,manualDate:m,manualTime:y,wakeupMinutes:T??void 0,bedtimeMinutes:C??void 0}}async function b(l,m){return t.fetchTimeSettingsJson(t.timeSettingsApi,{method:"PATCH",body:JSON.stringify({timezone_name:l.timezoneName,enabled:m,manual_date:l.manualDate,manual_time:l.manualTime})})}async function x(){if(i||e||n){t.notifyClockMode("Clock mode update already in progress.","warning");return}const l=t.isSwitchChecked(t.clockModeToggle),m=!l,y=t.timezoneSelect.value.trim();t.setSwitchChecked(t.clockModeToggle,m),i=!0,t.notifyClockMode(m?"Enabling clock mode...":"Disabling clock mode...","info"),t.onStateChange();try{const T=await t.fetchTimeSettingsJson(t.timeSettingsApi,{method:"PATCH",body:JSON.stringify({enabled:m,timezone_name:m&&y?y:void 0})});c(T),t.notifyClockMode(T.message||(m?"Clock mode enabled.":"Clock mode disabled."),"success")}catch(T){t.setSwitchChecked(t.clockModeToggle,l),console.error("Clock mode toggle failed:",T);const C=T instanceof Error?T.message:"Failed to update clock mode.",E=C==="timezone_name required to enable clock"?r("Please set timezone first.","Imposta prima il fuso orario."):C;C==="timezone_name required to enable clock"&&(t.setFieldError(t.timezoneSelect,r("Select a timezone.","Seleziona un fuso orario.")),t.timezoneSelect.focus({preventScroll:!0})),t.notifyClockMode(E,"error")}finally{i=!1,t.onStateChange()}}async function k(){if(e||n||i||t.isTalkingClockModuleBusy()){t.notify(r("Time configuration update already in progress.","Aggiornamento dell'ora già in corso."),"warning");return}const l=S();if(l){if(!l.timezoneName){t.setFieldError(t.timezoneSelect,r("Select a timezone.","Seleziona un fuso orario.")),t.notify(r("Select a timezone.","Seleziona un fuso orario."),"error"),t.timezoneSelect.focus({preventScroll:!0});return}if(t.clearFieldError(t.timezoneSelect),t.isTalkingClockModuleActive()&&(l.wakeupMinutes===void 0||l.bedtimeMinutes===void 0)){t.notify("Wakeup and bedtime times are required for the talking clock module.","error"),t.focusTalkingClockTimeInput();return}e=!0,n=!0,i=!0,t.onTalkingClockBusyChange(t.isTalkingClockModuleActive()),t.notify(r("Saving time configuration...","Salvataggio impostazioni ora..."),"info"),t.onStateChange();try{const m=await b(l,t.isSwitchChecked(t.clockModeToggle));if(c(m),t.isTalkingClockModuleActive()){const y=await t.patchTalkingClockSettings({wakeup_minutes:l.wakeupMinutes,bedtime_minutes:l.bedtimeMinutes});t.applyTalkingClockModuleSettings(y.settings)}t.notify(r("Time configuration saved successfully.","Impostazioni ora salvate."),"success")}catch(m){console.error("Timezone/location save failed:",m),t.notify(m instanceof Error?m.message:r("Failed to save time configuration.","Impossibile salvare le impostazioni dell'ora."),"error")}finally{e=!1,n=!1,i=!1,t.onTalkingClockBusyChange(!1),t.onStateChange()}}}async function I(){if(e||n||i){t.notify(r("Time configuration update already in progress.","Aggiornamento dell'ora già in corso."),"warning");return}e=!0,n=!0,i=!0,t.notify(r("Clearing timezone/location...","Cancellazione fuso orario..."),"info"),t.onStateChange();try{const l=await t.fetchTimeSettingsJson(t.timeSettingsApi,{method:"PATCH",body:JSON.stringify({enabled:!1,timezone_name:""})});c(l),t.notify(r("Timezone/location cleared successfully.","Fuso orario cancellato."),"success")}catch(l){console.error("Timezone/location clear failed:",l),t.notify(l instanceof Error?l.message:r("Failed to clear timezone/location.","Impossibile cancellare il fuso orario."),"error")}finally{e=!1,n=!1,i=!1,t.onStateChange()}}return{applyTimeRuntimeStatus:d,applyTimeSettingsStatus:c,clearTimezoneLocation:I,fetchTimeRuntimeStatus:A,fetchTimeSettingsStatus:h,isClockBusy:()=>i,isLocationBusy:()=>n,isTimezoneBusy:()=>e,populateTimezoneOptions:u,refreshClockStatusAfterWifiConnect:f,saveTimezoneLocation:k,toggleClockModeSetting:x}}function $n(t,e){return t>=-50?e.fourBar:t>=-60?e.threeBar:t>=-70?e.twoBar:e.oneBar}function Vn(t){let e=[],n="",i=!1,o="",s=!1,c=!1,d=!1,u=-1;function h(){t.wifiStatusCard.hidden=!1,t.wifiStatusCard.statusLabel=i?r("Connected","Connesso"):r("Disconnected","Disconnesso"),t.wifiStatusCard.network=i?o:""}function f(){const a=document.createElement("li");a.className="networks__list-empty-state",a.innerHTML=`${t.svgWithClass(t.wifiFindIcon,"wifi-find-icon")}<p>Scan for available networks</p>`,t.networkList.setEmptyState(a)}function A(){if(e.length===0){n="",u=-1;return}const a=e.findIndex(g=>g.ssid===n);if(a>=0){u=a;return}n="",u=-1}function S(){const a=t.networkList.getOptions();a.forEach((g,v)=>{g.setAttribute("aria-selected",String(n===e[v]?.ssid))}),u>=0&&u<a.length?t.networkList.setActiveDescendant(a[u].id):t.networkList.setActiveDescendant(null)}function b(){const a=e.find(g=>g.ssid===n);return a?!a.is_open:!0}function x(a){n=a,u=e.findIndex(g=>g.ssid===a),b()||t.clearFieldError(t.passwordInput),S(),t.onStateChange()}function k(){if(A(),t.networkList.clearItems(),e.length===0){f();return}e.forEach((a,g)=>{const v=document.createElement("li");v.className="networks__item",v.id=`network-option-${g}`,v.setAttribute("role","option"),v.setAttribute("tabindex","-1"),v.setAttribute("aria-selected",String(n===a.ssid));const $=document.createElement("span");$.className="networks__item-ssid",$.textContent=a.ssid;const q=document.createElement("div");if(q.className="networks__item-details",o===a.ssid&&i){const R=document.createElement("span");R.title=r("Currently connected","Connesso ora"),R.innerHTML=t.svgWithClass(t.checkIcon,"wifi-connected-icon"),q.appendChild(R)}const V=document.createElement("span");V.title=a.is_open?r("Open","Aperta"):r("Secured","Protetta"),a.is_open||(V.innerHTML=t.svgWithClass(t.securityIcon,"wifi-security-icon")),q.appendChild(V);const H=document.createElement("span");H.title=r(`Signal strength: ${a.signal_strength} (${a.rssi} dBm)`,`Intensità del segnale: ${a.signal_strength} (${a.rssi} dBm)`),H.innerHTML=t.svgWithClass($n(a.rssi,t.signalIcons),"wifi-signal-icon"),q.appendChild(H),v.append($,q),v.addEventListener("click",()=>{u=g,x(a.ssid),t.networkList.focus({preventScroll:!0})}),t.networkList.appendItem(v)}),S()}function I(a){const g=i,v=o;i=a.connected===!0,o=typeof a.ssid=="string"?a.ssid:"",h(),(g!==i||v!==o)&&k(),t.onConnectionStateChange?.({wasConnected:g,previousNetwork:v,isCurrentlyConnected:i,connectedNetwork:o})}async function l(){if(!s){s=!0,t.notify(r("Scanning for networks...","Ricerca reti in corso..."),"info"),t.onStateChange();try{let a=r("Scanning for networks...","Ricerca reti in corso...");for(let g=0;g<t.scanPollAttempts;g++){const v=await t.fetchPortalJson("/api/scan");if(a=v.message||a,v.scan_in_progress===!0){if(t.notify(a,"info"),g<t.scanPollAttempts-1){await t.delayMs(t.scanPollIntervalMs);continue}}else{e=Array.isArray(v.networks)?v.networks:[],t.notify(a||r("Scan complete.","Ricerca completata."),"success"),k();return}}throw new Error(r("Network scan timed out. Please try again.","Ricerca reti scaduta. Riprova."))}catch(a){console.error("Scan failed:",a),t.notify(a instanceof Error?a.message:r("Scan failed. Please try again.","Ricerca non riuscita. Riprova."),"error"),e=[],k()}finally{s=!1,t.onStateChange()}}}async function m(){if(!c){c=!0,t.onStateChange();try{const a=await t.fetchPortalJson("/api/status");I(a),s||t.notify(a.message||r("Status updated.","Stato aggiornato."),a.connected?"success":"info")}catch(a){console.error("Status check failed:",a),t.notify(a instanceof Error?a.message:r("Status check failed.","Impossibile leggere lo stato."),"error")}finally{c=!1,t.onStateChange()}}}async function y(){if(!(d||!n)){if(b()&&t.passwordInput.value.trim().length===0){t.setFieldError(t.passwordInput,r("Please enter a WiFi password.","Inserisci la password del Wi-Fi.")),t.passwordInput.focus({preventScroll:!0});return}if(t.passwordInput.value.length>U){t.setFieldError(t.passwordInput,r(`WiFi password must be ${U} characters or fewer.`,`La password Wi-Fi può avere al massimo ${U} caratteri.`)),t.passwordInput.focus({preventScroll:!0});return}t.clearFieldError(t.passwordInput),d=!0,t.notify(r(`Connecting to ${n}...`,`Connessione a ${n}...`),"info"),t.onStateChange();try{const a=await t.fetchPortalJson("/api/configure",{method:"POST",body:JSON.stringify({ssid:n,password:t.passwordInput.value})});t.notify(a.message||r("Connection request sent.","Richiesta di connessione inviata."),"info");for(let g=0;g<t.statusPollAttempts;g++){await t.delayMs(t.statusPollIntervalMs);const v=await t.fetchPortalJson("/api/status");if(I(v),v.connected){t.notify(v.message||r("Connected.","Connesso."),"success");break}}i||t.notify(r("Connection in progress...","Connessione in corso..."),"info")}catch(a){console.error("Connection failed:",a),t.notify(a instanceof Error?a.message:r("Connection failed.","Connessione non riuscita."),"error")}finally{d=!1,t.onStateChange()}}}async function T(){if(!(d||c||!i)){c=!0,t.notify(r("Disconnecting...","Disconnessione..."),"info"),t.onStateChange();try{const a=await t.fetchPortalJson("/api/disconnect",{method:"POST"}),g=i,v=o;i=!1,o="",h(),k(),t.notify(a.message||r("Disconnected.","Disconnesso."),"success"),t.onConnectionStateChange?.({wasConnected:g,previousNetwork:v,isCurrentlyConnected:i,connectedNetwork:o})}catch(a){console.error("Disconnect failed:",a),t.notify(a instanceof Error?a.message:r("Disconnect failed.","Disconnessione non riuscita."),"error")}finally{c=!1,t.onStateChange()}}}function C(){if(lt()){T();return}if(d||c){t.notify(r("WiFi status is busy. Please wait.","Wi-Fi occupato. Attendi."),"warning");return}if(!n){t.notify(r("Select a WiFi network first.","Seleziona prima una rete Wi-Fi."),"error"),t.networkList.focus({preventScroll:!0});return}if(b()&&t.passwordInput.value.trim().length===0){t.setFieldError(t.passwordInput,r("Please enter a WiFi password.","Inserisci la password del Wi-Fi.")),t.notify(r("Please check if your password is correct.","Controlla che la password sia corretta."),"error"),t.passwordInput.focus({preventScroll:!0});return}t.clearFieldError(t.passwordInput),y()}function E(){t.passwordInput.value?.trim().length&&t.clearFieldError(t.passwordInput),t.onStateChange()}function Rt(a){if(e.length!==0)switch(A(),a.key){case"Tab":break;case"ArrowDown":{a.preventDefault();const g=u<e.length-1?u+1:0;u=g,x(e[g].ssid),t.networkList.scrollOptionIntoView(g);break}case"ArrowUp":{a.preventDefault();const g=u>0?u-1:e.length-1;u=g,x(e[g].ssid),t.networkList.scrollOptionIntoView(g);break}case"Home":{a.preventDefault(),u=0,x(e[0].ssid),t.networkList.scrollOptionIntoView(0);break}case"End":{a.preventDefault();const g=e.length-1;u=g,x(e[g].ssid),t.networkList.scrollOptionIntoView(g);break}case"Enter":case" ":{a.preventDefault(),u>=0&&u<e.length&&x(e[u].ssid);break}}}function lt(){return i&&o.length>0&&n===o}return{applyPortalStatus:I,checkStatus:m,connect:y,disconnect:T,getConnectedNetwork:()=>o,getSelectedNetwork:()=>n,handleConnectAction:C,handleListboxKeyDown:Rt,handlePasswordInput:E,isCheckingStatus:()=>c,isConnecting:()=>d,isCurrentlyConnected:()=>i,isScanning:()=>s,isSelectedConnected:lt,renderNetworkList:k,requiresPassword:b,scanNetworks:l,updateWifiStatusCard:h}}function P(t,e){e().finally(()=>{!t.disabled&&t.offsetParent!==null&&setTimeout(()=>{!t.disabled&&t.offsetParent!==null&&t.focus()},0)})}function Hn(t){const{controllers:e,dom:n,helpers:i}=t;function o(){n.wifiSettingsSheet.openBottomSheet(),e.wifiController.scanNetworks()}n.scanBtn.addEventListener("click",()=>{e.wifiController.scanNetworks()}),n.connectBtn.addEventListener("click",()=>{e.wifiController.handleConnectAction()}),n.wifiStatusCard.addEventListener("action",()=>{if(e.wifiController.isCurrentlyConnected()){e.wifiController.disconnect();return}o()}),n.wifiStatusCard.addEventListener("settings",()=>{o()}),n.wifiSettingsCloseBtn.addEventListener("click",()=>{n.wifiSettingsSheet.closeBottomSheet()}),n.passwordInput.addEventListener("input",()=>{e.wifiController.handlePasswordInput()}),n.networkList.addEventListener("keydown",s=>{e.wifiController.handleListboxKeyDown(s)}),n.geminiSaveBtn.addEventListener("click",()=>{P(n.geminiSaveBtn,()=>e.geminiController.saveGeminiKey())}),n.geminiClearBtn.addEventListener("click",()=>{P(n.geminiClearBtn,()=>e.geminiController.clearGeminiKey())}),n.geminiApiKeyInput.addEventListener("input",i.updateUi),n.timezoneLocationSaveBtn.addEventListener("click",()=>{if(!n.timezoneSelect.value.trim()){i.setFieldError(n.timezoneSelect,r("Select a timezone.","Seleziona un fuso orario.")),i.setTimezoneLocationNotification(r("Select a timezone.","Seleziona un fuso orario."),"error"),n.timezoneSelect.focus({preventScroll:!0});return}i.clearFieldError(n.timezoneSelect),P(n.timezoneLocationSaveBtn,()=>e.timeController.saveTimezoneLocation())}),n.timezoneLocationClearBtn.addEventListener("click",()=>{P(n.timezoneLocationClearBtn,()=>e.timeController.clearTimezoneLocation())}),n.timezoneSelect.addEventListener("change",()=>{n.timezoneSelect.value?.trim().length&&i.clearFieldError(n.timezoneSelect),i.updateUi()}),n.manualDateInput.addEventListener("input",i.updateUi),n.manualTimeInput.addEventListener("input",i.updateUi)}function Rn(t){const{controllers:e,dom:n}=t,i=e.wifiController.isScanning()||e.wifiController.isConnecting()||e.wifiController.isCheckingStatus(),o=e.wifiController.isSelectedConnected(),s=e.wifiController.getSelectedNetwork().trim(),c=s.length>0&&!o&&e.wifiController.requiresPassword(),d=o||s.length>0&&(!c||n.passwordInput.value.trim().length>0);n.scanBtn.disabled=i,n.connectBtn.disabled=i||!d,n.wifiStatusCard.actionDisabled=i,n.passwordInput.disabled=e.wifiController.isConnecting(),e.wifiController.isConnecting()?(n.connectBtn.textContent=r("Connecting...","Connessione..."),n.wifiStatusCard.actionLabel=r("Connecting...","Connessione...")):o?(n.connectBtn.textContent=r("Disconnect","Disconnetti"),n.wifiStatusCard.actionLabel=r("Disconnect","Disconnetti")):(n.connectBtn.textContent=r("Connect","Connetti"),n.wifiStatusCard.actionLabel=e.wifiController.isCurrentlyConnected()?r("Disconnect","Disconnetti"):r("Connect","Connetti"));const u=e.timeController.isTimezoneBusy()||e.timeController.isLocationBusy()||e.timeController.isClockBusy();n.timezoneSelect.disabled=u,n.manualDateInput.disabled=u,n.manualTimeInput.disabled=u,n.timezoneLocationSaveBtn.disabled=u||n.timezoneSelect.value.trim().length===0,n.timezoneLocationClearBtn.disabled=u||n.timezoneSelect.value.trim().length===0;const h=e.geminiController.isGeminiBusy(),f=e.geminiController.getGeminiHasKey();n.geminiApiKeyInput.readOnly=f||h,n.geminiApiKeyInput.disabled=h,n.geminiSaveBtn.disabled=h||f||n.geminiApiKeyInput.value.trim().length===0,n.geminiSaveBtn.hidden=f,n.geminiClearBtn.disabled=h||!f,n.geminiClearBtn.hidden=!f}le();ie();he();be();ye();Ie();ze();Pe();Ve();Ue();let rt=null;const p=xn(),$t=An(p.wifiSettingsNotification),Gn=Ft(p.geminiCard),Vt=Ft(p.timezoneLocationCard),Ht=()=>document.createElement("input"),Kn=document.createElement("button"),Wn=Ht(),Un=Ht(),Zn=document.createElement("input");function z(){Rn({controllers:{geminiController:st,timeController:B,wifiController:M},dom:p})}const st=Fn({fetchGeminiModuleJson:Ot,fetchOpenAiModuleJson:()=>Promise.resolve({}),geminiApiKeyInput:p.geminiApiKeyInput,isGeminiModuleActive:()=>!0,isOpenAiModuleActive:()=>!1,notifyGemini:Gn,notifyOpenAi:()=>{},openAiApiKeyInput:Zn,updateButtons:z}),B=Dn({applyTalkingClockModuleSettings:()=>{},bedtimeTimeInput:Un,clearFieldError:F,clockModeToggle:Kn,clockSyncPollAttempts:dn,clockSyncPollIntervalMs:cn,fetchTimeRuntimeJson:yn,fetchTimeSettingsJson:wn,fetchTimezoneListJson:Sn,focusTalkingClockTimeInput:()=>{},buildTimezoneLabelMap:zn,formatTimezoneLabel:Bn,isSwitchChecked:Tn,isTalkingClockModuleActive:()=>!1,isTalkingClockModuleBusy:()=>!1,manualDateInput:p.manualDateInput,manualTimeInput:p.manualTimeInput,notifyClockMode:()=>{},notify:Vt,onStateChange:z,onTalkingClockBusyChange:()=>{},parseClockTimeInputValue:qn,patchTalkingClockSettings:()=>Promise.resolve({success:!0}),setFieldError:D,setSwitchChecked:Cn,timeRuntimeApi:fn,timeSettingsApi:pn,timezoneSelect:p.timezoneSelect,wakeupTimeInput:Wn}),M=Vn({checkIcon:nn,clearFieldError:F,delayMs:En,fetchPortalJson:vn,networkList:p.networkList,notify:$t,onConnectionStateChange:({wasConnected:t,isCurrentlyConnected:e})=>{!t&&e&&B.refreshClockStatusAfterWifiConnect()},onStateChange:z,passwordInput:p.passwordInput,scanPollAttempts:gn,scanPollIntervalMs:hn,securityIcon:Je,setFieldError:D,signalIcons:{oneBar:je,twoBar:Ye,threeBar:Xe,fourBar:Qe},statusPollAttempts:ln,statusPollIntervalMs:sn,svgWithClass:kn,wifiFindIcon:tn,wifiStatusCard:p.wifiStatusCard}),at=On({card:p.firmwareCard,versionText:p.firmwareVersionText,fileInput:p.firmwareFileInput,codeInput:p.firmwareCodeInput,codeButton:p.firmwareCodeBtn,updateButton:p.firmwareUpdateBtn,setFieldError:D,clearFieldError:F});function N(){if(!rt)return;const t=document.documentElement,e=t.scrollHeight>window.innerHeight+1,n=window.scrollY+window.innerHeight>=t.scrollHeight-1;rt.setVisible(e&&!n)}function Jn(){p.wifiStatusCard.iconSvg=Ze,p.geminiCard.iconSvg=en,p.timezoneLocationCard.iconSvg=on,p.firmwareCard.iconSvg=rn,p.firmwareFileInput.progressHidden=!0,p.firmwareCodeBtn.addEventListener("click",()=>{at.requestCode()}),p.firmwareUpdateBtn.addEventListener("click",()=>{at.upload()}),M.renderNetworkList(),document.body&&(rt=Xt({mount:document.body,mode:"fixed",position:"bottom",height:"6rem",width:"100vw",strength:1.8,divCount:5,curve:"bezier",exponential:!0,opacity:1,zIndex:20,className:"page-gradual-blur",fallbackColor:"var(--color-bg-selected)"}),N(),window.addEventListener("scroll",N,{passive:!0}),window.addEventListener("resize",N),typeof ResizeObserver<"u"&&new ResizeObserver(()=>{N()}).observe(document.body)),z(),M.updateWifiStatusCard(),$t(""),Hn({controllers:{geminiController:st,timeController:B,wifiController:M},dom:p,helpers:{clearFieldError:F,setFieldError:D,setTimezoneLocationNotification:Vt,updateUi:z}}),jn(),window.setInterval(()=>{B.fetchTimeRuntimeStatus()},un)}async function jn(){await Promise.allSettled([B.populateTimezoneOptions(),B.fetchTimeSettingsStatus(),M.checkStatus(),Yn(),at.loadStatus()])}async function Yn(){try{const t=await Ot("/api/settings/gemini");st.applyGeminiSettings(t.settings)}catch(t){console.error("Gemini settings status failed:",t)}finally{z()}}Kt().then(()=>{Zt(),Jn()});
