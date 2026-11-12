(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&o(c)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();let I=$t();function $t(){return(typeof navigator<"u"?navigator.languages??[navigator.language]:[]).some(e=>e?.toLowerCase().startsWith("it"))?"it":"en"}function a(t,e){return I==="it"?e:t}async function Vt(t=1500){const e=new AbortController,n=window.setTimeout(()=>e.abort(),t);try{const o=await fetch("/api/language",{cache:"no-store",signal:e.signal});if(o.ok){const i=await o.json();(i.language==="it"||i.language==="en")&&(I=i.language)}}catch{}finally{window.clearTimeout(n)}return document.documentElement.lang=I,I}const st={Connected:"Connesso","Not connected":"Non connesso","Scanning for networks":"Ricerca reti in corso","Network scan complete":"Ricerca reti completata","Scan failed":"Ricerca non riuscita","Invalid Wi-Fi configuration payload":"Configurazione Wi-Fi non valida","Invalid JSON body":"Richiesta non valida","SSID required":"Serve il nome della rete (SSID)","Failed to start Wi-Fi connection":"Impossibile avviare la connessione Wi-Fi","Failed to disconnect Wi-Fi":"Impossibile disconnettere il Wi-Fi","Cleared saved Wi-Fi credentials":"Credenziali Wi-Fi salvate cancellate","Invalid time settings payload":"Impostazioni ora non valide","Time settings loaded":"Impostazioni ora caricate","Time settings updated":"Impostazioni ora aggiornate","Time runtime loaded":"Ora caricata","Timezone list loaded":"Elenco fusi orari caricato","Clock disabled":"Orologio disattivato","Failed to save time settings":"Impossibile salvare le impostazioni dell’ora","Failed to set manual time":"Impossibile impostare l’ora manualmente","Invalid manual date/time":"Data o ora non valide","Invalid timezone_name":"Fuso orario non valido","Invalid enabled":"Valore non valido","Invalid location":"Posizione non valida","timezone_name required to enable clock":"Seleziona prima un fuso orario","timezone_name required to set manual time":"Seleziona prima un fuso orario","Invalid Gemini settings payload":"Impostazioni Gemini non valide","Invalid api_key":"Chiave API non valida","Gemini API key is required":"Serve la chiave API di Gemini","Gemini API key stored":"Chiave API di Gemini salvata","Failed to store Gemini API key":"Impossibile salvare la chiave API di Gemini","Gemini API key cleared":"Chiave API di Gemini cancellata","Failed to clear Gemini API key":"Impossibile cancellare la chiave API di Gemini","Request failed.":"Richiesta non riuscita."},Rt=[["Disconnected and cleared credentials for ","Disconnesso, credenziali cancellate per "],["Connecting to ","Connessione a "]];function Ht(t){if(I!=="it"||!t)return t;const e=st[t]??st[t.replace(/\.$/,"")];if(e)return e;for(const[n,o]of Rt)if(t.startsWith(n))return o+t.slice(n.length);return t}const Gt={"Eastern Time":"Nord America orientale","Central Time":"Nord America centrale","Mountain Time":"Nord America (Montagne Rocciose)","Pacific Time":"Nord America (Pacifico)","Alaska Time":"Alaska","Hawaii Time":"Hawaii","United Kingdom":"Regno Unito","Central Europe":"Europa centrale (Italia)","Eastern Europe":"Europa orientale",Japan:"Giappone",China:"Cina","Australia Eastern":"Australia orientale","Australia Central":"Australia centrale","Australia Western":"Australia occidentale"};function bt(t){return I==="it"?Gt[t]??t:t}function Kt(){if(I==="en")return;const t=(i,s,c)=>{document.getElementById(i)?.setAttribute(s,c)},e=(i,s)=>{const c=document.getElementById(i);c&&(c.textContent=s)};document.title="Configurazione Chroninkle",document.querySelector("main")?.setAttribute("aria-label","Configurazione Chroninkle"),t("wifiSettingsSheet","title","Impostazioni Wi-Fi"),t("wifiSettingsSheet","description","Cerca le reti disponibili e collega il tuo Chroninkle al Wi-Fi."),t("wifiSettingsCloseBtn","aria-label","Chiudi impostazioni Wi-Fi"),t("networkList","label","Reti disponibili"),t("password","label","Password Wi-Fi"),t("password","placeholder","Inserisci la password della rete"),e("scanBtn","Cerca reti"),e("connectBtn","Connetti"),t("geminiCard","title","Chiave API di Gemini"),t("geminiApiKeyInput","label","Chiave API di Gemini"),t("geminiApiKeyInput","placeholder","Inserisci la chiave API di Gemini"),e("geminiClearBtn","Cancella"),e("geminiSaveBtn","Salva"),t("timezoneLocationCard","title","Impostazione ora"),t("timezoneSelect","label","Fuso orario"),t("timezoneSelect","aria-label","Fuso orario"),t("manualTimeInput","label","Ora"),t("manualDateInput","label","Data");const n=document.querySelector("#timezoneLocationCard .form-helper-text");n&&(n.textContent="Imposta prima il fuso orario per sincronizzare l’ora locale. Se serve puoi anche impostare data e ora manualmente."),e("timezoneLocationClearBtn","Cancella"),e("timezoneLocationSaveBtn","Salva"),t("statusToast","aria-label","Notifica di stato");const o=document.getElementById("wifiStatusCard")?.shadowRoot?.getElementById("settingsBtn");o&&(o.textContent="Impostazioni",o.setAttribute("aria-label","Impostazioni"))}const Wt={mode:"absolute",position:"bottom",height:"6rem",strength:2,divCount:5,exponential:!1,opacity:1,curve:"linear",zIndex:2},lt={linear:t=>t,bezier:t=>t*t*(3-2*t),"ease-in":t=>t*t,"ease-out":t=>1-Math.pow(1-t,2),"ease-in-out":t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2};function Zt(t){switch(t){case"top":return"to top";case"left":return"to left";case"right":return"to right";default:return"to bottom"}}function Ut(){if(typeof CSS>"u"||typeof CSS.supports!="function")return!1;const t=CSS.supports("backdrop-filter","blur(1px)")||CSS.supports("-webkit-backdrop-filter","blur(1px)"),e=CSS.supports("mask-image","linear-gradient(to bottom, transparent, black)")||CSS.supports("-webkit-mask-image","linear-gradient(to bottom, transparent, black)");return t&&e}function Jt(t){const e={...Wt,...t},n=document.createElement("div"),o=document.createElement("div"),i=Zt(e.position),s=Ut(),c=e.position==="top"||e.position==="bottom";if(n.className="gradual-blur",e.className&&n.classList.add(e.className),s||(n.classList.add("gradual-blur--fallback"),n.style.background=`linear-gradient(${i}, transparent 0%, ${e.fallbackColor||"rgba(255, 255, 255, 0.95)"} 100%)`),n.style.position=e.mode,n.style.pointerEvents="none",n.style.zIndex=String(e.zIndex),n.style.opacity="0",n.style.borderRadius="inherit",c?(n.style.height=e.height,n.style.width=e.width||"100%",n.style[e.position]="0",e.mode==="fixed"?(n.style.left="50%",n.style.right="auto",n.style.transform="translateX(-50%)"):(n.style.left="0",n.style.right="0")):(n.style.width=e.width||e.height,n.style.height="100%",n.style.top="0",n.style.bottom="0",n.style[e.position]="0"),o.className="gradual-blur__inner",n.appendChild(o),s){const d=100/e.divCount,u=lt[e.curve]||lt.linear;for(let f=1;f<=e.divCount;f+=1){const b=document.createElement("div"),k=u(f/e.divCount);let T=0;e.exponential?T=Math.pow(2,k*4)*.0625*e.strength:T=.0625*(k*e.divCount+1)*e.strength;const v=Math.round((d*f-d)*10)/10,w=Math.round(d*f*10)/10,C=Math.round((d*f+d)*10)/10,_=Math.round((d*f+d*2)*10)/10;let l=`transparent ${v}%, black ${w}%`;C<=100&&(l+=`, black ${C}%`),_<=100&&(l+=`, transparent ${_}%`),b.className="gradual-blur__layer",b.style.maskImage=`linear-gradient(${i}, ${l})`,b.style.webkitMaskImage=`linear-gradient(${i}, ${l})`,b.style.backdropFilter=`blur(${T.toFixed(3)}rem)`,b.style.setProperty("-webkit-backdrop-filter",`blur(${T.toFixed(3)}rem)`),b.style.opacity=String(e.opacity),o.appendChild(b)}}return window.getComputedStyle(e.mount).position==="static"&&(e.mount.style.position="relative"),e.mount.appendChild(n),{element:n,setVisible(d){n.style.opacity=d?"1":"0"},destroy(){n.remove()}}}const jt=`:host {
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
`,Yt=document.createElement("template");Yt.innerHTML=`
  <style>${jt}</style>
  <span class="badge">
    <slot></slot>
  </span>
`;const Xt=`:host {
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
`,W="ui-button",vt=document.createElement("template");vt.innerHTML=`
  <style>${Xt}</style>
  <button type="button" part="button">
    <slot></slot>
  </button>
`;function ct(t){return t==="submit"||t==="reset"?t:"button"}class Qt extends HTMLElement{static get observedAttributes(){return["disabled","aria-label","type"]}constructor(){super();const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(vt.content.cloneNode(!0)),this.button=e.querySelector("button")}connectedCallback(){this.dataset.component=W,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get type(){return ct(this.getAttribute("type"))}set type(e){this.setAttribute("type",ct(e))}focus(e){this.button.focus(e)}click(){this.button.click()}syncAttributes(){this.button.disabled=this.disabled,this.button.type=this.type,this.tabIndex=this.disabled?-1:0;const e=this.getAttribute("aria-label");e?this.button.setAttribute("aria-label",e):this.button.removeAttribute("aria-label")}}function te(){customElements.get(W)||customElements.define(W,Qt)}const ee=`:host {
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
`,Z="ui-bottom-sheet",yt=document.createElement("template"),ne=["a[href]","button:not([disabled])","details summary","input:not([disabled])","select:not([disabled])","textarea:not([disabled])",'[tabindex]:not([tabindex="-1"])'].join(", ");let R=0;yt.innerHTML=`
  <style>${ee}</style>
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
`;function dt(t){const e=getComputedStyle(t);return t.hasAttribute("hidden")||t.getAttribute("aria-hidden")==="true"||e.display==="none"||e.visibility==="hidden"?!1:t.tagName.includes("-")?e.display==="contents"||!!t.getClientRects().length:t.offsetParent!==null||e.position==="fixed"||!!t.getClientRects().length}function H(t){if(!t.shadowRoot)return[];const e=[],n=new Set;function o(i){if(i instanceof HTMLSlotElement){const s=i.assignedElements({flatten:!0});s.length>0?s.forEach(o):Array.from(i.children).forEach(o);return}if(i instanceof HTMLElement&&dt(i)){if(i.shadowRoot){Array.from(i.shadowRoot.childNodes).forEach(o);return}!n.has(i)&&i.matches(ne)&&dt(i)&&(n.add(i),e.push(i)),Array.from(i.children).forEach(o)}}return Array.from(t.shadowRoot.childNodes).forEach(o),e}function ie(t,e){if(e===t||e.contains(t))return!0;let n=t;for(;n;){if(n===e)return!0;const o=n.getRootNode();if(!(o instanceof ShadowRoot))break;n=o.host}return!1}function G(t){return t.assignedNodes({flatten:!0}).some(e=>e.nodeType===Node.TEXT_NODE?e.textContent?.trim().length:e.nodeType===Node.ELEMENT_NODE)}class oe extends HTMLElement{constructor(){super(),this.isAnimatingClose=!1,this.isSyncingOpenAttribute=!1,this.previousDocumentOverflow="",this.previousBodyOverflow="",this.triggerElement=null;const e=this.attachShadow({mode:"open"});e.append(yt.content.cloneNode(!0)),this.dialog=e.querySelector(".bottom-sheet-dialog"),this.titleElement=e.querySelector(".bottom-sheet-title"),this.descriptionElement=e.querySelector(".bottom-sheet-description"),this.headerActionsContainer=e.querySelector(".bottom-sheet-header-actions"),this.footerContainer=e.querySelector(".bottom-sheet-footer"),this.floatingContainer=e.querySelector(".bottom-sheet-floating"),this.headerActionsSlot=e.querySelector('slot[name="header-actions"]'),this.footerSlot=e.querySelector('slot[name="footer"]'),this.floatingSlot=e.querySelector('slot[name="floating-content"]'),R+=1,this.titleId=`bottomSheetTitle${R}`,this.descriptionId=`bottomSheetDescription${R}`,this.handleAnimationEndBound=this.handleAnimationEnd.bind(this),this.handleCancelBound=this.handleCancel.bind(this),this.handleClickBound=this.handleClick.bind(this),this.handleKeyDownBound=this.handleKeyDown.bind(this),this.handleSlotChangeBound=this.syncSlotVisibility.bind(this)}static get observedAttributes(){return["description","open","title"]}connectedCallback(){this.dataset.component=Z,this.dialog.addEventListener("animationend",this.handleAnimationEndBound),this.dialog.addEventListener("cancel",this.handleCancelBound),this.dialog.addEventListener("click",this.handleClickBound),this.dialog.addEventListener("keydown",this.handleKeyDownBound),this.addEventListener("keydown",this.handleKeyDownBound),this.headerActionsSlot.addEventListener("slotchange",this.handleSlotChangeBound),this.footerSlot.addEventListener("slotchange",this.handleSlotChangeBound),this.floatingSlot.addEventListener("slotchange",this.handleSlotChangeBound),this.syncAttributes(),this.syncSlotVisibility(),this.hasAttribute("open")&&this.openInternal()}disconnectedCallback(){this.dialog.removeEventListener("animationend",this.handleAnimationEndBound),this.dialog.removeEventListener("cancel",this.handleCancelBound),this.dialog.removeEventListener("click",this.handleClickBound),this.dialog.removeEventListener("keydown",this.handleKeyDownBound),this.removeEventListener("keydown",this.handleKeyDownBound),this.headerActionsSlot.removeEventListener("slotchange",this.handleSlotChangeBound),this.footerSlot.removeEventListener("slotchange",this.handleSlotChangeBound),this.floatingSlot.removeEventListener("slotchange",this.handleSlotChangeBound),this.dialog.open&&this.dialog.close(),this.unlockDocumentScroll()}attributeChangedCallback(e){if(e==="open"){if(!this.isConnected||this.isSyncingOpenAttribute)return;this.hasAttribute("open")?this.openInternal():this.startClosing();return}this.syncAttributes()}get open(){return this.hasAttribute("open")}set open(e){this.toggleAttribute("open",e)}openBottomSheet(){this.open&&!this.isAnimatingClose||(this.triggerElement=document.activeElement instanceof HTMLElement?document.activeElement:null,this.open=!0)}closeBottomSheet(){!this.open&&!this.dialog.open||(this.open=!1)}focus(e){(H(this)[0]??this.dialog).focus(e)}syncAttributes(){const e=this.getAttribute("title")||"",n=this.getAttribute("description")||"";this.titleElement.id=this.titleId,this.titleElement.textContent=e,this.titleElement.hidden=e.length===0,this.descriptionElement.id=this.descriptionId,this.descriptionElement.textContent=n,this.descriptionElement.hidden=n.length===0,e.length>0?this.dialog.setAttribute("aria-labelledby",this.titleId):this.dialog.removeAttribute("aria-labelledby"),n.length>0?this.dialog.setAttribute("aria-describedby",this.descriptionId):this.dialog.removeAttribute("aria-describedby")}syncSlotVisibility(){this.headerActionsContainer.hidden=!G(this.headerActionsSlot),this.footerContainer.hidden=!G(this.footerSlot),this.floatingContainer.hidden=!G(this.floatingSlot)}handleAnimationEnd(e){!this.isAnimatingClose||e.target!==this.dialog||(this.dialog.classList.remove("closing"),this.dialog.close(),this.isAnimatingClose=!1,this.unlockDocumentScroll(),this.restoreTriggerFocus(),this.dispatchEvent(new Event("close",{bubbles:!0,composed:!0})))}handleCancel(e){e.preventDefault(),this.closeBottomSheet()}handleClick(e){this.isAnimatingClose||e.target===this.dialog&&this.closeBottomSheet()}handleKeyDown(e){if(e.currentTarget===this&&e.composedPath().includes(this.dialog))return;if(e.key==="Escape"){e.preventDefault(),this.closeBottomSheet();return}if(e.key!=="Tab")return;const n=H(this);if(n.length===0){e.preventDefault(),this.dialog.focus();return}const o=e.composedPath()[0],i=o instanceof HTMLElement?o:document.activeElement instanceof HTMLElement?document.activeElement:null,s=i===null?-1:n.findIndex(f=>ie(i,f)),c=e.shiftKey?-1:1,d=e.shiftKey?n.length-1:0,u=s===-1?d:(s+c+n.length)%n.length;e.preventDefault(),n[u].focus()}openInternal(){this.syncAttributes(),this.syncSlotVisibility(),this.isAnimatingClose&&(this.dialog.classList.remove("closing"),this.isAnimatingClose=!1),this.dialog.open?this.lockDocumentScroll():(this.lockDocumentScroll(),this.dialog.showModal()),requestAnimationFrame(()=>{if(!this.dialog.open)return;(H(this)[0]??this.dialog).focus()})}startClosing(){!this.dialog.open||this.isAnimatingClose||(this.dialog.classList.add("closing"),this.isAnimatingClose=!0)}lockDocumentScroll(){this.previousDocumentOverflow.length===0&&this.previousBodyOverflow.length===0&&(this.previousDocumentOverflow=document.documentElement.style.overflow,this.previousBodyOverflow=document.body.style.overflow),document.documentElement.style.overflow="hidden",document.body.style.overflow="hidden"}unlockDocumentScroll(){document.documentElement.style.overflow=this.previousDocumentOverflow,document.body.style.overflow=this.previousBodyOverflow,this.previousDocumentOverflow="",this.previousBodyOverflow=""}restoreTriggerFocus(){this.triggerElement&&document.contains(this.triggerElement)&&this.triggerElement.focus(),this.triggerElement=null}}function re(){customElements.get(Z)||customElements.define(Z,oe)}const ae=`:host {
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
`,U="ui-card",wt=document.createElement("template");wt.innerHTML=`
  <style>${ae}</style>
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
`;function se(t,e){return t.includes("class=")?t.replace("<svg",`<svg class="${e}"`):t.replace("<svg",`<svg class="${e}"`)}class le extends HTMLElement{static get observedAttributes(){return["title"]}constructor(){super();const e=this.attachShadow({mode:"open"});e.append(wt.content.cloneNode(!0)),this.footerContainer=e.querySelector(".card-component__footer"),this.footerSlot=e.querySelector('slot[name="footer"]'),this.footerSlot.addEventListener("slotchange",()=>{this.syncFooterVisibility()}),this.iconElement=e.querySelector(".card-component__icon"),this.notificationElement=e.querySelector(".connection-notification"),this.titleElement=e.querySelector(".card-component__title")}connectedCallback(){this.dataset.component=U,this.syncAttributes(),this.syncFooterVisibility()}attributeChangedCallback(){this.syncAttributes()}get iconSvg(){return this.iconElement.innerHTML}set iconSvg(e){this.iconElement.innerHTML=e?se(e,"card-component__icon"):""}setNotification(e,n="info"){if(!e){this.notificationElement.hidden=!0,this.notificationElement.textContent="",this.notificationElement.removeAttribute("data-status"),this.notificationElement.setAttribute("role","status"),this.notificationElement.setAttribute("aria-live","polite");return}this.notificationElement.hidden=!1,this.notificationElement.textContent=e,this.notificationElement.setAttribute("data-status",n),n==="error"||n==="danger"?(this.notificationElement.setAttribute("role","alert"),this.notificationElement.setAttribute("aria-live","assertive")):n==="warning"?(this.notificationElement.setAttribute("role","alert"),this.notificationElement.setAttribute("aria-live","polite")):(this.notificationElement.setAttribute("role","status"),this.notificationElement.setAttribute("aria-live","polite"))}syncAttributes(){this.titleElement.textContent=this.getAttribute("title")||""}syncFooterVisibility(){const e=this.footerSlot.assignedElements({flatten:!0}).length>0;this.footerContainer.hidden=!e}}function ce(){customElements.get(U)||customElements.define(U,le)}const de=`:host {
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
`,ue=document.createElement("template");ue.innerHTML=`
  <style>${de}</style>
  <div class="form-control">
    <label></label>
    <div class="form-control__input-wrapper duration-fields">
      <ui-input variant="number" inputmode="numeric"></ui-input>
      <ui-input variant="number" inputmode="numeric"></ui-input>
    </div>
  </div>
`;const he=`:host {
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
`,ge=document.createElement("template");ge.innerHTML=`
  <style>${he}</style>
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
`;const me=`:host {
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
`,J="ui-icon-button",St=document.createElement("template");St.innerHTML=`
  <style>${me}</style>
  <button type="button" part="button">
    <slot></slot>
  </button>
`;function ut(t){return t==="submit"||t==="reset"?t:"button"}class fe extends HTMLElement{static get observedAttributes(){return["disabled","aria-label","type"]}constructor(){super();const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(St.content.cloneNode(!0)),this.button=e.querySelector("button")}connectedCallback(){this.dataset.component=J,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get type(){return ut(this.getAttribute("type"))}set type(e){this.setAttribute("type",ut(e))}focus(e){this.button.focus(e)}click(){this.button.click()}syncAttributes(){this.button.disabled=this.disabled,this.button.type=this.type,this.tabIndex=this.disabled?-1:0;const e=this.getAttribute("aria-label");e?this.button.setAttribute("aria-label",e):this.button.removeAttribute("aria-label")}}function pe(){customElements.get(J)||customElements.define(J,fe)}const be='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/></svg>',ve='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/></svg>',ye=`:host {
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
`,j="ui-input",xt=document.createElement("template");xt.innerHTML=`
  <style>${ye}</style>
  <div class="form-control">
    <label></label>
    <div class="form-control__input-wrapper">
      <input />
      <span class="duration-fields__unit"></span>
    </div>
    <p class="form-helper-text"></p>
  </div>
`;function we(t){return t==="number"||t==="password"||t==="time"||t==="date"?t:"text"}function Se(t){return t==="password"||t==="number"||t==="time"||t==="date"?t:"text"}class xe extends HTMLElement{constructor(){super(),this.isPasswordVisible=!1,this.customValidationMessage="";const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(xt.content.cloneNode(!0)),this.input=e.querySelector("input"),this.helperText=e.querySelector(".form-helper-text"),this.label=e.querySelector("label"),this.suffix=e.querySelector(".duration-fields__unit"),this.toggleButton=document.createElement("button"),this.wrapper=e.querySelector(".form-control__input-wrapper"),this.toggleButton.className="password-toggle-btn",this.toggleButton.type="button",this.input.addEventListener("input",n=>{this.syncValidationState(),n.stopPropagation(),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))}),this.input.addEventListener("change",n=>{this.syncValidationState(),n.stopPropagation(),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}),this.input.addEventListener("invalid",()=>{this.syncValidationState()}),this.toggleButton.addEventListener("click",()=>{this.togglePasswordVisibility()})}static get observedAttributes(){return["aria-label","aria-invalid","autocomplete","disabled","helper-text","invalid","inputmode","label","max","maxlength","min","name","placeholder","readonly","required","step","suffix","type","value","variant"]}connectedCallback(){this.hasAttribute("variant")||this.setAttribute("variant","text"),this.dataset.component=j,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get type(){return this.input.type}set type(e){this.setAttribute("type",e)}get value(){return this.input.value}set value(e){this.input.value=e,this.syncValidationState()}focus(e){this.input.focus(e)}select(){this.input.select()}get validationMessage(){return this.input.validationMessage}get validity(){return this.input.validity}get willValidate(){return this.input.willValidate}checkValidity(){const e=this.input.checkValidity();return this.syncValidationState(),e}reportValidity(){const e=this.input.reportValidity();return this.syncValidationState(),e}setCustomValidity(e){this.customValidationMessage=e,this.input.setCustomValidity(e),this.syncValidationState()}syncAttributes(){const e=we(this.getAttribute("variant")),n=this.getAttribute("helper-text")||"",o=this.id?`${this.id}Input`:"input",i=this.getAttribute("label")||"",s=this.getAttribute("suffix")||"",c=e==="password"?this.isPasswordVisible?"text":"password":this.getAttribute("type")||Se(e);if(this.input.id=o,this.input.type=c,this.input.disabled=this.disabled,this.tabIndex=this.disabled?-1:0,this.input.readOnly=this.hasAttribute("readonly"),this.input.required=this.hasAttribute("required"),this.syncStringAttribute("aria-label"),this.syncStringAttribute("autocomplete"),this.syncStringAttribute("inputmode"),this.syncStringAttribute("max"),this.syncStringAttribute("maxlength"),this.syncStringAttribute("min"),this.syncStringAttribute("name"),this.syncStringAttribute("placeholder"),this.syncStringAttribute("step"),this.hasAttribute("value")&&this.input.value!==this.getAttribute("value")&&(this.input.value=this.getAttribute("value")||""),this.input.setCustomValidity(this.customValidationMessage),this.label.htmlFor=o,this.label.textContent=i,this.label.hidden=i.length===0,this.helperText.textContent=n,this.helperText.hidden=n.length===0,this.wrapper.classList.toggle("duration-fields",e==="number"),this.suffix.textContent=s,this.suffix.hidden=e!=="number"||s.length===0,n.length>0){const d=`${o}HelperText`;this.helperText.id=d,this.input.setAttribute("aria-describedby",d)}else this.helperText.removeAttribute("id"),this.input.removeAttribute("aria-describedby");e==="password"?(this.toggleButton.isConnected||this.wrapper.append(this.toggleButton),this.toggleButton.disabled=this.disabled,this.toggleButton.setAttribute("aria-label",this.isPasswordVisible?a("Hide password","Nascondi password"):a("Show password","Mostra password")),this.toggleButton.innerHTML=Ae(this.isPasswordVisible?be:ve,"password-icon")):(this.isPasswordVisible=!1,this.toggleButton.remove()),this.syncValidationState()}syncStringAttribute(e){const n=this.getAttribute(e);if(n===null){this.input.removeAttribute(e);return}this.input.setAttribute(e,n)}togglePasswordVisibility(){this.isPasswordVisible=!this.isPasswordVisible,this.syncAttributes()}syncValidationState(){const e=this.hasAttribute("invalid")||this.getAttribute("aria-invalid")==="true"||!this.input.validity.valid;this.classList.toggle("error",e),this.input.classList.toggle("error",e),this.hasAttribute("invalid")!==e&&this.toggleAttribute("invalid",e),this.getAttribute("aria-invalid")!==String(e)&&this.setAttribute("aria-invalid",String(e)),this.input.getAttribute("aria-invalid")!==String(e)&&this.input.setAttribute("aria-invalid",String(e))}}function Ae(t,e){return t.includes("class=")?t.replace("<svg",`<svg class="${e}"`):t.replace("<svg",`<svg class="${e}"`)}function Te(){customElements.get(j)||customElements.define(j,xe)}const Ce=`:host {
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
`,Y="ui-network-list",At="networkList",X="network-list-label",Tt=document.createElement("template");Tt.innerHTML=`
  <style>${Ce}</style>
  <div class="networks">
    <span id="${X}" hidden>Available networks</span>
    <ul
      id="${At}"
      class="networks__list"
      role="listbox"
      aria-labelledby="${X}"
      tabindex="0"
    ></ul>
  </div>
`;class ke extends HTMLElement{static get observedAttributes(){return["aria-label","label"]}constructor(){super();const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(Tt.content.cloneNode(!0)),this.labelElement=e.querySelector(`#${X}`),this.listElement=e.querySelector(`#${At}`),this.listElement.addEventListener("keydown",n=>{(n.key==="ArrowDown"||n.key==="ArrowUp"||n.key==="Home"||n.key==="End"||n.key===" ")&&n.preventDefault()})}connectedCallback(){this.tabIndex=0,this.dataset.component=Y,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}appendItem(e){this.listElement.appendChild(e)}clearItems(){this.listElement.innerHTML=""}focus(e){this.listElement.focus(e)}getOptions(){return Array.from(this.listElement.querySelectorAll('[role="option"]'))}scrollOptionIntoView(e){const n=this.getOptions()[e];if(!n)return;const o=this.listElement.scrollTop,i=o+this.listElement.clientHeight,s=n.offsetTop,c=s+n.offsetHeight;if(s<o){this.listElement.scrollTop=s;return}c>i&&(this.listElement.scrollTop=c-this.listElement.clientHeight)}setActiveDescendant(e){if(e){this.listElement.setAttribute("aria-activedescendant",e);return}this.listElement.removeAttribute("aria-activedescendant")}setEmptyState(e){this.clearItems(),this.appendItem(e)}syncAttributes(){const e=this.getAttribute("label")||a("Available networks","Reti disponibili"),n=this.getAttribute("aria-label");this.labelElement.textContent=e,n?this.listElement.setAttribute("aria-label",n):this.listElement.removeAttribute("aria-label")}}function Ee(){customElements.get(Y)||customElements.define(Y,ke)}const _e=`:host {
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
`,Q="ui-network-status",Ct="actionBtn",kt="settingsBtn",Et="wifiStatusLabel",_t="wifiStatusIcon",It="wifiStatusNetwork",Lt=document.createElement("template");Lt.innerHTML=`
  <style>${_e}</style>
  <div class="wifi-status-card">
    <div class="wifi-status-card__content">
      <div class="wifi-status-card__status">
        <span class="card-icon" id="${_t}"></span>
        <span id="${Et}" class="wifi-status-card__label">
          Disconnected
        </span>
        <span
          id="${It}"
          class="wifi-status-card__network"
        ></span>
      </div>
      <div class="wifi-status-card__actions">
        <ui-button
          id="${Ct}"
          variant="outline"
          inverse
          aria-label="Connect"
        >
          Connect
        </ui-button>
        <ui-button
          id="${kt}"
          variant="outline"
          inverse
          aria-label="Settings"
        >
          Settings
        </ui-button>
      </div>
    </div>
  </div>
`;function Ie(t,e){return t.includes("class=")?t.replace("<svg",`<svg class="${e}"`):t.replace("<svg",`<svg class="${e}"`)}class Le extends HTMLElement{static get observedAttributes(){return["action-label","network","status-label"]}constructor(){super();const e=this.attachShadow({mode:"open"});e.append(Lt.content.cloneNode(!0)),this.actionButton=e.querySelector(`#${Ct}`),this.actionButton.addEventListener("click",n=>{n.stopPropagation(),this.dispatchEvent(new Event("action",{bubbles:!0,composed:!0}))}),this.iconElement=e.querySelector(`#${_t}`),this.labelElement=e.querySelector(`#${Et}`),this.networkElement=e.querySelector(`#${It}`),this.settingsButton=e.querySelector(`#${kt}`),this.settingsButton.addEventListener("click",n=>{n.stopPropagation(),this.dispatchEvent(new Event("settings",{bubbles:!0,composed:!0}))})}connectedCallback(){this.dataset.component=Q,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get actionDisabled(){return!!this.actionButton.disabled}set actionDisabled(e){this.actionButton.disabled=e}get iconSvg(){return this.iconElement.innerHTML}set iconSvg(e){this.iconElement.innerHTML=e?Ie(e,"wifi-icon"):""}get network(){return this.getAttribute("network")||""}set network(e){this.setAttribute("network",e)}get actionLabel(){return this.getAttribute("action-label")||a("Connect","Connetti")}set actionLabel(e){this.setAttribute("action-label",e)}get statusLabel(){return this.getAttribute("status-label")||a("Disconnected","Disconnesso")}set statusLabel(e){this.setAttribute("status-label",e)}syncAttributes(){this.actionButton.textContent=this.actionLabel,this.actionButton.setAttribute("aria-label",this.actionLabel),this.labelElement.textContent=this.statusLabel,this.networkElement.textContent=this.network,this.networkElement.hidden=this.network.length===0}}function ze(){customElements.get(Q)||customElements.define(Q,Le)}const Be=`:host {
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
`,Me=document.createElement("template");Me.innerHTML=`
  <style>${Be}</style>
  <div class="form-control">
    <label></label>
    <div class="range-slider">
      <input class="range-slider__range" type="range" />
      <span class="range-slider__value"></span>
    </div>
  </div>
`;const qe='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-80 240-320l57-57 183 183 183-183 57 57L480-80ZM298-584l-58-56 240-240 240 240-58 56-182-182-182 182Z"/></svg>',Pe=`:host {
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
`,tt="ui-select",zt=document.createElement("template");zt.innerHTML=`
  <style>${Pe}</style>
  <div class="form-control">
    <label></label>
    <div class="form-control__input-wrapper">
      <select></select>
      <span class="select-icon"></span>
    </div>
    <p class="form-helper-text"></p>
  </div>
`;class Ne extends HTMLElement{constructor(){super(),this.customValidationMessage="";const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(zt.content.cloneNode(!0)),this.helperText=e.querySelector(".form-helper-text"),this.labelElement=e.querySelector("label"),this.select=e.querySelector("select");const n=e.querySelector(".select-icon");n.innerHTML=De(qe,"select-icon"),this.select.addEventListener("change",o=>{this.syncValidationState(),o.stopPropagation(),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}),this.select.addEventListener("input",o=>{this.syncValidationState(),o.stopPropagation(),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))}),this.select.addEventListener("invalid",()=>{this.syncValidationState()})}static get observedAttributes(){return["aria-invalid","aria-label","disabled","helper-text","invalid","label","name","required","value"]}connectedCallback(){this.moveLightDomOptions(),this.dataset.component=tt,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get innerHTML(){return this.select.innerHTML}set innerHTML(e){this.select.innerHTML=e,this.syncValidationState()}get value(){return this.select.value}set value(e){this.select.value=e,this.syncValidationState()}appendChild(e){return e instanceof HTMLOptionElement||e instanceof HTMLOptGroupElement?(this.select.appendChild(e),e):super.appendChild(e)}focus(e){this.select.focus(e)}get validationMessage(){return this.select.validationMessage}get validity(){return this.select.validity}get willValidate(){return this.select.willValidate}checkValidity(){const e=this.select.checkValidity();return this.syncValidationState(),e}reportValidity(){const e=this.select.reportValidity();return this.syncValidationState(),e}setCustomValidity(e){this.customValidationMessage=e,this.select.setCustomValidity(e),this.syncValidationState()}moveLightDomOptions(){Array.from(this.children).forEach(e=>{(e instanceof HTMLOptionElement||e instanceof HTMLOptGroupElement)&&this.select.appendChild(e)})}syncAttributes(){const e=this.getAttribute("helper-text")||"",n=this.id?`${this.id}Select`:"select",o=this.getAttribute("label")||"";if(this.select.id=n,this.select.disabled=this.disabled,this.tabIndex=this.disabled?-1:0,this.select.required=this.hasAttribute("required"),this.syncStringAttribute("aria-label"),this.syncStringAttribute("name"),this.hasAttribute("value")&&(this.select.value=this.getAttribute("value")||""),this.select.setCustomValidity(this.customValidationMessage),this.labelElement.htmlFor=n,this.labelElement.textContent=o,this.labelElement.hidden=o.length===0,this.helperText.textContent=e,this.helperText.hidden=e.length===0,e.length>0){const i=`${n}HelperText`;this.helperText.id=i,this.select.setAttribute("aria-describedby",i)}else this.helperText.removeAttribute("id"),this.select.removeAttribute("aria-describedby");this.syncValidationState()}syncStringAttribute(e){const n=this.getAttribute(e);if(n===null){this.select.removeAttribute(e);return}this.select.setAttribute(e,n)}syncValidationState(){const e=this.hasAttribute("invalid")||this.getAttribute("aria-invalid")==="true"||!this.select.validity.valid;this.classList.toggle("error",e),this.select.classList.toggle("error",e),this.hasAttribute("invalid")!==e&&this.toggleAttribute("invalid",e),this.getAttribute("aria-invalid")!==String(e)&&this.setAttribute("aria-invalid",String(e)),this.select.getAttribute("aria-invalid")!==String(e)&&this.select.setAttribute("aria-invalid",String(e))}}function Oe(){customElements.get(tt)||customElements.define(tt,Ne)}function De(t,e){return t.includes("class=")?t.replace("<svg",`<svg class="${e}"`):t.replace("<svg",`<svg class="${e}"`)}const Fe=`:host {
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
`,$e=document.createElement("template");$e.innerHTML=`
  <style>${Fe}</style>
  <div class="form-control">
    <div class="switch-container">
      <button type="button" part="button">
        <span class="knob"></span>
      </button>
      <span class="switch-label"></span>
    </div>
  </div>
`;const Ve=`:host {
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
`,et="ui-toast",Bt=document.createElement("template");Bt.innerHTML=`
  <style>${Ve}</style>
  <dialog class="toast-dialog" aria-live="polite">
    <p class="toast-dialog__message"></p>
  </dialog>
`;function ht(t){return t==="success"||t==="info"||t==="warning"||t==="error"||t==="danger"?t:null}class Re extends HTMLElement{static get observedAttributes(){return["aria-label","message","status"]}constructor(){super();const e=this.attachShadow({mode:"open"});e.append(Bt.content.cloneNode(!0)),this.dialog=e.querySelector("dialog"),this.messageElement=e.querySelector(".toast-dialog__message")}connectedCallback(){this.dataset.component=et,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get message(){return this.messageElement.textContent||""}set message(e){this.setAttribute("message",e)}get status(){return ht(this.getAttribute("status"))}set status(e){if(e){this.setAttribute("status",e);return}this.removeAttribute("status")}show(e,n){typeof e=="string"&&(this.message=e),n&&(this.status=n),this.dialog.open||this.dialog.show()}close(e){this.dialog.close(e)}syncAttributes(){const e=this.getAttribute("aria-label"),n=this.getAttribute("message")||"",o=ht(this.getAttribute("status"));e?this.dialog.setAttribute("aria-label",e):this.dialog.removeAttribute("aria-label"),this.messageElement.textContent=n,this.messageElement.id=this.id?`${this.id}Message`:"statusToastMessage",this.dialog.id=this.id||"statusToast",o?this.dialog.setAttribute("data-status",o):this.dialog.removeAttribute("data-status")}}function He(){customElements.get(et)||customElements.define(et,Re)}const Ge='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m109-531-85-85q92-89 210-136.5T480-800q128 0 246 47.5T936-616l-85 85q-75-72-171-110.5T480-680q-104 0-200 38.5T109-531Zm169 169-84-84q59-55 132.5-84.5T480-560q80 0 153.5 29.5T766-446l-84 84q-42-38-93.5-58T480-440q-57 0-108.5 20T278-362Zm202 202q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Z"/></svg>',Ke='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/></svg>',We='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q96-98 220-149t260-51q137 0 261 51t219 149L480-120ZM361-353q25-18 55.5-28t63.5-10q33 0 63.5 10t55.5 28l245-245q-78-59-170.5-90.5T480-720q-101 0-193.5 31.5T116-598l245 245Z"/></svg>',Ze='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q96-98 220-149t260-51q137 0 261 51t219 149L480-120ZM299-415q38-28 84-43.5t97-15.5q51 0 97 15.5t84 43.5l183-183q-78-59-170.5-90.5T480-720q-101 0-193.5 31.5T116-598l183 183Z"/></svg>',Ue='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q96-98 220-149t260-51q137 0 261 51t219 149L480-120ZM232-482q53-38 116-59.5T480-563q69 0 132 21.5T728-482l116-116q-78-59-170.5-90.5T480-720q-101 0-193.5 31.5T116-598l116 116Z"/></svg>',Je='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q95-97 219.5-148.5T480-800q136 0 260.5 51.5T960-600L480-120Z"/></svg>',je='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-601q93-93 215.5-146T480-800q142 0 264.5 53T960-601l-56 57q-81-81-190-128.5T480-720q-103 0-195 32.5T117-597l419 420-56 57Zm384-40L761-262q-18 11-38 16.5t-43 5.5q-68 0-114-46t-46-114q0-68 46-114t114-46q68 0 114 46t46 114q0 23-5.5 43T818-319l102 103-56 56ZM680-320q34 0 57-23t23-57q0-34-23-57t-57-23q-34 0-57 23t-23 57q0 34 23 57t57 23ZM480-177Z"/></svg>',Ye='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M280-240q-100 0-170-70T40-480q0-100 70-170t170-70q66 0 121 33t87 87h432v240h-80v120H600v-120H488q-32 54-87 87t-121 33Zm0-80q66 0 106-40.5t48-79.5h246v120h80v-120h80v-80H434q-8-39-48-79.5T280-640q-66 0-113 47t-47 113q0 66 47 113t113 47Zm0-80q33 0 56.5-23.5T360-480q0-33-23.5-56.5T280-560q-33 0-56.5 23.5T200-480q0 33 23.5 56.5T280-400Zm0-80Z"/></svg>',Xe='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>',Qe='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/></svg>',tn={"Content-Type":"application/json",Accept:"application/json"},K=64,en=2e3,nn=8,on=2e3,rn=8,an=3e3,sn=750,ln=20,cn="/api/settings",dn=`${cn}/time`,un="/api/runtime/time",hn=1e4;async function q(t,e){const n=new AbortController,o=setTimeout(()=>n.abort(),hn);let i;try{i=await fetch(t,{cache:"no-store",...e,signal:e?.signal??n.signal,headers:{...tn,...e?.headers||{}}})}catch(u){throw n.signal.aborted?new Error(a(`Request to ${t} timed out. Check the device is still reachable.`,`La richiesta a ${t} è scaduta. Controlla che il dispositivo sia raggiungibile.`)):u}finally{clearTimeout(o)}const s=i.headers.get("content-type")||"",c=await i.text();if(!s.includes("application/json"))throw new Error(a(`Unexpected response for ${t}. Make sure you are connected to the device AP and loading the portal from the ESP32.`,`Risposta inattesa da ${t}. Assicurati di essere connesso alla rete del dispositivo e di aprire il portale da lì.`));const d=JSON.parse(c);if(typeof d.message=="string"&&(d.message=Ht(d.message)),!i.ok||d.success!==!0)throw new Error(d.message||a("Request failed.","Richiesta non riuscita."));return d}const gn=(t,e)=>q(t,e),mn=(t,e)=>q(t,e),fn=(t,e)=>q(t,e),Mt=(t,e)=>q(t,e),pn=(t,e)=>q(t,e);function y(t){const e=document.getElementById(t);if(!e)throw new Error(`Required portal element "#${t}" was not found.`);return e}function bn(){return{wifiStatusCard:y("wifiStatusCard"),wifiSettingsSheet:y("wifiSettingsSheet"),wifiSettingsCloseBtn:y("wifiSettingsCloseBtn"),wifiSettingsNotification:y("wifiSettingsNotification"),networkList:y("networkList"),passwordInput:y("password"),scanBtn:y("scanBtn"),connectBtn:y("connectBtn"),geminiCard:y("geminiCard"),geminiApiKeyInput:y("geminiApiKeyInput"),geminiClearBtn:y("geminiClearBtn"),geminiSaveBtn:y("geminiSaveBtn"),timezoneLocationCard:y("timezoneLocationCard"),timezoneSelect:y("timezoneSelect"),manualTimeInput:y("manualTimeInput"),manualDateInput:y("manualDateInput"),timezoneLocationClearBtn:y("timezoneLocationClearBtn"),timezoneLocationSaveBtn:y("timezoneLocationSaveBtn")}}function qt(t){return(e,n="info")=>{t.setNotification(e,n)}}function vn(t){return(e,n="info")=>{if(!e){t.hidden=!0,t.textContent="",t.removeAttribute("data-status"),t.setAttribute("role","status"),t.setAttribute("aria-live","polite");return}t.hidden=!1,t.textContent=e,t.setAttribute("data-status",n),n==="error"||n==="danger"?(t.setAttribute("role","alert"),t.setAttribute("aria-live","assertive")):n==="warning"?(t.setAttribute("role","alert"),t.setAttribute("aria-live","polite")):(t.setAttribute("role","status"),t.setAttribute("aria-live","polite"))}}function it(t){t.classList.remove("error"),t.removeAttribute("invalid"),t.setAttribute("aria-invalid","false"),t.setCustomValidity?.("")}function ot(t,e){t.classList.add("error"),t.setAttribute("invalid",""),t.setAttribute("aria-invalid","true"),t.setCustomValidity?.(e)}function yn(t,e){t.setAttribute("aria-checked",e?"true":"false")}function wn(t){return t.getAttribute("aria-checked")==="true"}function Sn(t,e){return t.includes("class=")?t.replace("<svg",`<svg class="${e}"`):t.replace("<svg",`<svg class="${e}"`)}function xn(t){return new Promise(e=>{setTimeout(e,t)})}function An(){const t=document.documentElement.lang?.trim();return t||"en-US"}function Tn(t){try{return new Intl.DateTimeFormat(An(),{hour:"numeric",timeZone:t,timeZoneName:"longGeneric"}).formatToParts(new Date).find(o=>o.type==="timeZoneName")?.value?.trim()||""}catch(e){return console.warn(`Failed to format timezone label for "${t}".`,e),""}}function gt(t){return/^(GMT|UTC)(?:[+-]\d{1,2}(?::\d{2})?)?$/.test(t)}function Cn(t){return(t.split("/").pop()||t).replace(/_/g," ")}function Pt(t){return t.split("/").map(e=>e.replace(/_/g," ")).join(" / ")}function kn(t){const e=t.map(i=>{const s=Tn(i.name);return{cityLabel:Cn(i.name),genericLabel:s,name:i.name}}),n=new Map(e.map(i=>[i.name,i])),o=new Map;return e.forEach(i=>{!i.genericLabel||gt(i.genericLabel)||o.set(i.genericLabel,(o.get(i.genericLabel)||0)+1)}),new Map(t.map(i=>{const s=n.get(i.name),c=bt(i.description?.trim()||"");if(s?.genericLabel&&!gt(s.genericLabel)){const u=(o.get(s.genericLabel)||0)>1?`${s.genericLabel} (${s.cityLabel})`:s.genericLabel;return[i.name,u]}return c?[i.name,c]:[i.name,Pt(i.name)]}))}function En(t,e){return e.get(t.name)||bt(t.description?.trim()||"")||Pt(t.name)}function _n(t){const e=t.value.trim();if(!e)return null;const n=/^(\d{2}):(\d{2})$/.exec(e);if(!n)return null;const o=Number.parseInt(n[1],10),i=Number.parseInt(n[2],10);return!Number.isFinite(o)||!Number.isFinite(i)||o<0||o>23||i<0||i>59?null:o*60+i}function O(t,e,n){t.hasKey=n?.has_key===!0,t.last4=typeof n?.last4=="string"?n.last4:"",e.value=t.hasKey?t.last4?`******${t.last4}`:"******":""}function mt(t,e,n){t.hasKey=!1,t.last4="",e.value="",n("")}async function ft(t,e,n,o,i,s,c){const d=e.value.trim();if(!d){n(`${c} is required.`,"warning");return}t.isBusy=!0,n(s,"info"),o();try{const u=await i(t.settingsApi,{method:"PATCH",body:JSON.stringify({api_key:d})});O(t,e,u.settings),n(u.message||a(`${c} stored.`,`${c}: salvata.`),"success")}catch(u){console.error(`${c} save failed:`,u),n(u instanceof Error?u.message:a(`Failed to store ${c}.`,`Impossibile salvare: ${c}.`),"error")}finally{t.isBusy=!1,o()}}async function pt(t,e,n,o,i,s,c){t.isBusy=!0,n(s,"info"),o();try{const d=await i(t.resetApi,{method:"POST"});O(t,e,d.settings),n(d.message||c,"success")}catch(d){console.error(`${c} failed:`,d),n(d instanceof Error?d.message:a(`Failed to clear ${c}.`,`Impossibile cancellare: ${c}.`),"error")}finally{t.isBusy=!1,o()}}function In(t){const e={hasKey:!1,isBusy:!1,last4:"",resetApi:"/api/settings/gemini/reset",settingsApi:"/api/settings/gemini"},n={hasKey:!1,isBusy:!1,last4:"",resetApi:"/api/settings/openai/reset",settingsApi:"/api/settings/openai"};function o(v){const w=v?.routes;e.settingsApi=w?.settings||"/api/settings/gemini",e.resetApi=w?.reset||"/api/settings/gemini/reset"}function i(v){const w=v?.routes;n.settingsApi=w?.settings||"/api/settings/openai",n.resetApi=w?.reset||"/api/settings/openai/reset"}function s(v){O(e,t.geminiApiKeyInput,v)}function c(){mt(e,t.geminiApiKeyInput,t.notifyGemini)}function d(v){O(n,t.openAiApiKeyInput,v)}function u(){mt(n,t.openAiApiKeyInput,t.notifyOpenAi)}async function f(){if(!t.isGeminiModuleActive()||e.isBusy||e.hasKey)return;if(!t.geminiApiKeyInput.value.trim()){t.notifyGemini(a("Gemini API key is required.","Serve la chiave API di Gemini."),"warning");return}await ft(e,t.geminiApiKeyInput,t.notifyGemini,t.updateButtons,t.fetchGeminiModuleJson,a("Saving Gemini API key...","Salvataggio chiave API di Gemini..."),a("Gemini API key","Chiave API di Gemini"))}async function b(){!t.isGeminiModuleActive()||e.isBusy||await pt(e,t.geminiApiKeyInput,t.notifyGemini,t.updateButtons,t.fetchGeminiModuleJson,a("Clearing Gemini API key...","Cancellazione chiave API di Gemini..."),a("Gemini API key cleared.","Chiave API di Gemini cancellata."))}async function k(){if(!t.isOpenAiModuleActive()||n.isBusy||n.hasKey)return;if(!t.openAiApiKeyInput.value.trim()){t.notifyOpenAi("OpenAI API key is required.","warning");return}await ft(n,t.openAiApiKeyInput,t.notifyOpenAi,t.updateButtons,t.fetchOpenAiModuleJson,"Saving OpenAI API key...","OpenAI API key")}async function T(){!t.isOpenAiModuleActive()||n.isBusy||await pt(n,t.openAiApiKeyInput,t.notifyOpenAi,t.updateButtons,t.fetchOpenAiModuleJson,"Clearing OpenAI API key...","OpenAI API key cleared.")}return{applyGeminiSettings:s,applyOpenAiSettings:d,clearGeminiKey:b,clearGeminiSettings:c,clearOpenAiKey:T,clearOpenAiSettings:u,getGeminiHasKey:()=>e.hasKey,getOpenAiHasKey:()=>n.hasKey,isGeminiBusy:()=>e.isBusy,isOpenAiBusy:()=>n.isBusy,saveGeminiKey:f,saveOpenAiKey:k,updateGeminiRoutes:o,updateOpenAiRoutes:i}}function Ln(t){let e=!1,n=!1,o=!1,i=!1;async function s(){return t.fetchTimezoneListJson("/api/timezone/list")}function c(l){const g=l.settings,p=l.runtime;t.setSwitchChecked(t.clockModeToggle,!!g?.enabled),t.timezoneSelect.value=g?.timezone_name||"",t.clearFieldError(t.timezoneSelect),t.manualDateInput.value=typeof p?.current_date=="string"?p.current_date:"",t.manualTimeInput.value=typeof p?.current_time=="string"?p.current_time:""}function d(l){l&&(typeof l.clock_enabled=="boolean"&&t.setSwitchChecked(t.clockModeToggle,l.clock_enabled),t.manualDateInput.value=typeof l.current_date=="string"?l.current_date:"",t.manualTimeInput.value=typeof l.current_time=="string"?l.current_time:"")}async function u(){t.timezoneSelect.innerHTML="";const l=document.createElement("option");l.value="",l.textContent=a("Select timezone","Seleziona fuso orario"),t.timezoneSelect.appendChild(l);try{const g=await s(),p=Array.isArray(g.timezones)?g.timezones:[],A=t.buildTimezoneLabelMap(p);p.map(S=>({value:S.name,label:t.formatTimezoneLabel(S,A)})).sort((S,E)=>S.label.localeCompare(E.label)).forEach(S=>{const E=document.createElement("option");E.value=S.value,E.textContent=S.label,t.timezoneSelect.appendChild(E)})}catch(g){console.error("Timezone list fetch failed:",g),t.notify(g instanceof Error?g.message:a("Failed to load timezones.","Impossibile caricare i fusi orari."),"error")}}async function f(){if(!(e||n||o)){e=!0,n=!0,o=!0,t.onStateChange();try{const l=await t.fetchTimeSettingsJson(t.timeSettingsApi);c(l)}catch(l){console.error("Time settings status failed:",l),t.notify(l instanceof Error?l.message:a("Time settings status failed.","Impossibile leggere le impostazioni dell'ora."),"error")}finally{e=!1,n=!1,o=!1,t.onStateChange()}}}async function b(){if(!(o||i)){i=!0;try{for(let l=0;l<t.clockSyncPollAttempts;l++){const g=await t.fetchTimeRuntimeJson(t.timeRuntimeApi);if(d(g.runtime),g.runtime?.time_valid===!0&&typeof g.runtime.current_time=="string"&&g.runtime.current_time.length>0)return;l<t.clockSyncPollAttempts-1&&await new Promise(p=>{setTimeout(p,t.clockSyncPollIntervalMs)})}}catch(l){console.error("Clock refresh after WiFi connect failed:",l)}finally{i=!1}}}async function k(){if(!(document.hidden||e||n||o)&&t.isSwitchChecked(t.clockModeToggle))try{const l=await t.fetchTimeRuntimeJson(t.timeRuntimeApi);d(l.runtime)}catch(l){console.error("Time runtime status failed:",l)}}function T(){const l=t.timezoneSelect.value.trim(),g=t.manualDateInput.value.trim(),p=t.manualTimeInput.value.trim(),A=t.parseClockTimeInputValue(t.wakeupTimeInput),S=t.parseClockTimeInputValue(t.bedtimeTimeInput);return!!g!=!!p?(t.notify(a("Provide both current date and time for a manual clock set.","Per impostare l'ora a mano servono sia la data sia l'ora."),"error"),null):{timezoneName:l,manualDate:g,manualTime:p,wakeupMinutes:A??void 0,bedtimeMinutes:S??void 0}}async function v(l,g){return t.fetchTimeSettingsJson(t.timeSettingsApi,{method:"PATCH",body:JSON.stringify({timezone_name:l.timezoneName,enabled:g,manual_date:l.manualDate,manual_time:l.manualTime})})}async function w(){if(o||e||n){t.notifyClockMode("Clock mode update already in progress.","warning");return}const l=t.isSwitchChecked(t.clockModeToggle),g=!l,p=t.timezoneSelect.value.trim();t.setSwitchChecked(t.clockModeToggle,g),o=!0,t.notifyClockMode(g?"Enabling clock mode...":"Disabling clock mode...","info"),t.onStateChange();try{const A=await t.fetchTimeSettingsJson(t.timeSettingsApi,{method:"PATCH",body:JSON.stringify({enabled:g,timezone_name:g&&p?p:void 0})});c(A),t.notifyClockMode(A.message||(g?"Clock mode enabled.":"Clock mode disabled."),"success")}catch(A){t.setSwitchChecked(t.clockModeToggle,l),console.error("Clock mode toggle failed:",A);const S=A instanceof Error?A.message:"Failed to update clock mode.",E=S==="timezone_name required to enable clock"?a("Please set timezone first.","Imposta prima il fuso orario."):S;S==="timezone_name required to enable clock"&&(t.setFieldError(t.timezoneSelect,a("Select a timezone.","Seleziona un fuso orario.")),t.timezoneSelect.focus({preventScroll:!0})),t.notifyClockMode(E,"error")}finally{o=!1,t.onStateChange()}}async function C(){if(e||n||o||t.isTalkingClockModuleBusy()){t.notify(a("Time configuration update already in progress.","Aggiornamento dell'ora già in corso."),"warning");return}const l=T();if(l){if(!l.timezoneName){t.setFieldError(t.timezoneSelect,a("Select a timezone.","Seleziona un fuso orario.")),t.notify(a("Select a timezone.","Seleziona un fuso orario."),"error"),t.timezoneSelect.focus({preventScroll:!0});return}if(t.clearFieldError(t.timezoneSelect),t.isTalkingClockModuleActive()&&(l.wakeupMinutes===void 0||l.bedtimeMinutes===void 0)){t.notify("Wakeup and bedtime times are required for the talking clock module.","error"),t.focusTalkingClockTimeInput();return}e=!0,n=!0,o=!0,t.onTalkingClockBusyChange(t.isTalkingClockModuleActive()),t.notify(a("Saving time configuration...","Salvataggio impostazioni ora..."),"info"),t.onStateChange();try{const g=await v(l,t.isSwitchChecked(t.clockModeToggle));if(c(g),t.isTalkingClockModuleActive()){const p=await t.patchTalkingClockSettings({wakeup_minutes:l.wakeupMinutes,bedtime_minutes:l.bedtimeMinutes});t.applyTalkingClockModuleSettings(p.settings)}t.notify(a("Time configuration saved successfully.","Impostazioni ora salvate."),"success")}catch(g){console.error("Timezone/location save failed:",g),t.notify(g instanceof Error?g.message:a("Failed to save time configuration.","Impossibile salvare le impostazioni dell'ora."),"error")}finally{e=!1,n=!1,o=!1,t.onTalkingClockBusyChange(!1),t.onStateChange()}}}async function _(){if(e||n||o){t.notify(a("Time configuration update already in progress.","Aggiornamento dell'ora già in corso."),"warning");return}e=!0,n=!0,o=!0,t.notify(a("Clearing timezone/location...","Cancellazione fuso orario..."),"info"),t.onStateChange();try{const l=await t.fetchTimeSettingsJson(t.timeSettingsApi,{method:"PATCH",body:JSON.stringify({enabled:!1,timezone_name:""})});c(l),t.notify(a("Timezone/location cleared successfully.","Fuso orario cancellato."),"success")}catch(l){console.error("Timezone/location clear failed:",l),t.notify(l instanceof Error?l.message:a("Failed to clear timezone/location.","Impossibile cancellare il fuso orario."),"error")}finally{e=!1,n=!1,o=!1,t.onStateChange()}}return{applyTimeRuntimeStatus:d,applyTimeSettingsStatus:c,clearTimezoneLocation:_,fetchTimeRuntimeStatus:k,fetchTimeSettingsStatus:f,isClockBusy:()=>o,isLocationBusy:()=>n,isTimezoneBusy:()=>e,populateTimezoneOptions:u,refreshClockStatusAfterWifiConnect:b,saveTimezoneLocation:C,toggleClockModeSetting:w}}function zn(t,e){return t>=-50?e.fourBar:t>=-60?e.threeBar:t>=-70?e.twoBar:e.oneBar}function Bn(t){let e=[],n="",o=!1,i="",s=!1,c=!1,d=!1,u=-1;function f(){t.wifiStatusCard.hidden=!1,t.wifiStatusCard.statusLabel=o?a("Connected","Connesso"):a("Disconnected","Disconnesso"),t.wifiStatusCard.network=o?i:""}function b(){const r=document.createElement("li");r.className="networks__list-empty-state",r.innerHTML=`${t.svgWithClass(t.wifiFindIcon,"wifi-find-icon")}<p>Scan for available networks</p>`,t.networkList.setEmptyState(r)}function k(){if(e.length===0){n="",u=-1;return}const r=e.findIndex(h=>h.ssid===n);if(r>=0){u=r;return}n="",u=-1}function T(){const r=t.networkList.getOptions();r.forEach((h,m)=>{h.setAttribute("aria-selected",String(n===e[m]?.ssid))}),u>=0&&u<r.length?t.networkList.setActiveDescendant(r[u].id):t.networkList.setActiveDescendant(null)}function v(){const r=e.find(h=>h.ssid===n);return r?!r.is_open:!0}function w(r){n=r,u=e.findIndex(h=>h.ssid===r),v()||t.clearFieldError(t.passwordInput),T(),t.onStateChange()}function C(){if(k(),t.networkList.clearItems(),e.length===0){b();return}e.forEach((r,h)=>{const m=document.createElement("li");m.className="networks__item",m.id=`network-option-${h}`,m.setAttribute("role","option"),m.setAttribute("tabindex","-1"),m.setAttribute("aria-selected",String(n===r.ssid));const D=document.createElement("span");D.className="networks__item-ssid",D.textContent=r.ssid;const B=document.createElement("div");if(B.className="networks__item-details",i===r.ssid&&o){const V=document.createElement("span");V.title=a("Currently connected","Connesso ora"),V.innerHTML=t.svgWithClass(t.checkIcon,"wifi-connected-icon"),B.appendChild(V)}const F=document.createElement("span");F.title=r.is_open?a("Open","Aperta"):a("Secured","Protetta"),r.is_open||(F.innerHTML=t.svgWithClass(t.securityIcon,"wifi-security-icon")),B.appendChild(F);const $=document.createElement("span");$.title=a(`Signal strength: ${r.signal_strength} (${r.rssi} dBm)`,`Intensità del segnale: ${r.signal_strength} (${r.rssi} dBm)`),$.innerHTML=t.svgWithClass(zn(r.rssi,t.signalIcons),"wifi-signal-icon"),B.appendChild($),m.append(D,B),m.addEventListener("click",()=>{u=h,w(r.ssid),t.networkList.focus({preventScroll:!0})}),t.networkList.appendItem(m)}),T()}function _(r){const h=o,m=i;o=r.connected===!0,i=typeof r.ssid=="string"?r.ssid:"",f(),(h!==o||m!==i)&&C(),t.onConnectionStateChange?.({wasConnected:h,previousNetwork:m,isCurrentlyConnected:o,connectedNetwork:i})}async function l(){if(!s){s=!0,t.notify(a("Scanning for networks...","Ricerca reti in corso..."),"info"),t.onStateChange();try{let r=a("Scanning for networks...","Ricerca reti in corso...");for(let h=0;h<t.scanPollAttempts;h++){const m=await t.fetchPortalJson("/api/scan");if(r=m.message||r,m.scan_in_progress===!0){if(t.notify(r,"info"),h<t.scanPollAttempts-1){await t.delayMs(t.scanPollIntervalMs);continue}}else{e=Array.isArray(m.networks)?m.networks:[],t.notify(r||a("Scan complete.","Ricerca completata."),"success"),C();return}}throw new Error(a("Network scan timed out. Please try again.","Ricerca reti scaduta. Riprova."))}catch(r){console.error("Scan failed:",r),t.notify(r instanceof Error?r.message:a("Scan failed. Please try again.","Ricerca non riuscita. Riprova."),"error"),e=[],C()}finally{s=!1,t.onStateChange()}}}async function g(){if(!c){c=!0,t.onStateChange();try{const r=await t.fetchPortalJson("/api/status");_(r),s||t.notify(r.message||a("Status updated.","Stato aggiornato."),r.connected?"success":"info")}catch(r){console.error("Status check failed:",r),t.notify(r instanceof Error?r.message:a("Status check failed.","Impossibile leggere lo stato."),"error")}finally{c=!1,t.onStateChange()}}}async function p(){if(!(d||!n)){if(v()&&t.passwordInput.value.trim().length===0){t.setFieldError(t.passwordInput,a("Please enter a WiFi password.","Inserisci la password del Wi-Fi.")),t.passwordInput.focus({preventScroll:!0});return}if(t.passwordInput.value.length>K){t.setFieldError(t.passwordInput,a(`WiFi password must be ${K} characters or fewer.`,`La password Wi-Fi può avere al massimo ${K} caratteri.`)),t.passwordInput.focus({preventScroll:!0});return}t.clearFieldError(t.passwordInput),d=!0,t.notify(a(`Connecting to ${n}...`,`Connessione a ${n}...`),"info"),t.onStateChange();try{const r=await t.fetchPortalJson("/api/configure",{method:"POST",body:JSON.stringify({ssid:n,password:t.passwordInput.value})});t.notify(r.message||a("Connection request sent.","Richiesta di connessione inviata."),"info");for(let h=0;h<t.statusPollAttempts;h++){await t.delayMs(t.statusPollIntervalMs);const m=await t.fetchPortalJson("/api/status");if(_(m),m.connected){t.notify(m.message||a("Connected.","Connesso."),"success");break}}o||t.notify(a("Connection in progress...","Connessione in corso..."),"info")}catch(r){console.error("Connection failed:",r),t.notify(r instanceof Error?r.message:a("Connection failed.","Connessione non riuscita."),"error")}finally{d=!1,t.onStateChange()}}}async function A(){if(!(d||c||!o)){c=!0,t.notify(a("Disconnecting...","Disconnessione..."),"info"),t.onStateChange();try{const r=await t.fetchPortalJson("/api/disconnect",{method:"POST"}),h=o,m=i;o=!1,i="",f(),C(),t.notify(r.message||a("Disconnected.","Disconnesso."),"success"),t.onConnectionStateChange?.({wasConnected:h,previousNetwork:m,isCurrentlyConnected:o,connectedNetwork:i})}catch(r){console.error("Disconnect failed:",r),t.notify(r instanceof Error?r.message:a("Disconnect failed.","Disconnessione non riuscita."),"error")}finally{c=!1,t.onStateChange()}}}function S(){if(at()){A();return}if(d||c){t.notify(a("WiFi status is busy. Please wait.","Wi-Fi occupato. Attendi."),"warning");return}if(!n){t.notify(a("Select a WiFi network first.","Seleziona prima una rete Wi-Fi."),"error"),t.networkList.focus({preventScroll:!0});return}if(v()&&t.passwordInput.value.trim().length===0){t.setFieldError(t.passwordInput,a("Please enter a WiFi password.","Inserisci la password del Wi-Fi.")),t.notify(a("Please check if your password is correct.","Controlla che la password sia corretta."),"error"),t.passwordInput.focus({preventScroll:!0});return}t.clearFieldError(t.passwordInput),p()}function E(){t.passwordInput.value?.trim().length&&t.clearFieldError(t.passwordInput),t.onStateChange()}function Ft(r){if(e.length!==0)switch(k(),r.key){case"Tab":break;case"ArrowDown":{r.preventDefault();const h=u<e.length-1?u+1:0;u=h,w(e[h].ssid),t.networkList.scrollOptionIntoView(h);break}case"ArrowUp":{r.preventDefault();const h=u>0?u-1:e.length-1;u=h,w(e[h].ssid),t.networkList.scrollOptionIntoView(h);break}case"Home":{r.preventDefault(),u=0,w(e[0].ssid),t.networkList.scrollOptionIntoView(0);break}case"End":{r.preventDefault();const h=e.length-1;u=h,w(e[h].ssid),t.networkList.scrollOptionIntoView(h);break}case"Enter":case" ":{r.preventDefault(),u>=0&&u<e.length&&w(e[u].ssid);break}}}function at(){return o&&i.length>0&&n===i}return{applyPortalStatus:_,checkStatus:g,connect:p,disconnect:A,getConnectedNetwork:()=>i,getSelectedNetwork:()=>n,handleConnectAction:S,handleListboxKeyDown:Ft,handlePasswordInput:E,isCheckingStatus:()=>c,isConnecting:()=>d,isCurrentlyConnected:()=>o,isScanning:()=>s,isSelectedConnected:at,renderNetworkList:C,requiresPassword:v,scanNetworks:l,updateWifiStatusCard:f}}function P(t,e){e().finally(()=>{!t.disabled&&t.offsetParent!==null&&setTimeout(()=>{!t.disabled&&t.offsetParent!==null&&t.focus()},0)})}function Mn(t){const{controllers:e,dom:n,helpers:o}=t;function i(){n.wifiSettingsSheet.openBottomSheet(),e.wifiController.scanNetworks()}n.scanBtn.addEventListener("click",()=>{e.wifiController.scanNetworks()}),n.connectBtn.addEventListener("click",()=>{e.wifiController.handleConnectAction()}),n.wifiStatusCard.addEventListener("action",()=>{if(e.wifiController.isCurrentlyConnected()){e.wifiController.disconnect();return}i()}),n.wifiStatusCard.addEventListener("settings",()=>{i()}),n.wifiSettingsCloseBtn.addEventListener("click",()=>{n.wifiSettingsSheet.closeBottomSheet()}),n.passwordInput.addEventListener("input",()=>{e.wifiController.handlePasswordInput()}),n.networkList.addEventListener("keydown",s=>{e.wifiController.handleListboxKeyDown(s)}),n.geminiSaveBtn.addEventListener("click",()=>{P(n.geminiSaveBtn,()=>e.geminiController.saveGeminiKey())}),n.geminiClearBtn.addEventListener("click",()=>{P(n.geminiClearBtn,()=>e.geminiController.clearGeminiKey())}),n.geminiApiKeyInput.addEventListener("input",o.updateUi),n.timezoneLocationSaveBtn.addEventListener("click",()=>{if(!n.timezoneSelect.value.trim()){o.setFieldError(n.timezoneSelect,a("Select a timezone.","Seleziona un fuso orario.")),o.setTimezoneLocationNotification(a("Select a timezone.","Seleziona un fuso orario."),"error"),n.timezoneSelect.focus({preventScroll:!0});return}o.clearFieldError(n.timezoneSelect),P(n.timezoneLocationSaveBtn,()=>e.timeController.saveTimezoneLocation())}),n.timezoneLocationClearBtn.addEventListener("click",()=>{P(n.timezoneLocationClearBtn,()=>e.timeController.clearTimezoneLocation())}),n.timezoneSelect.addEventListener("change",()=>{n.timezoneSelect.value?.trim().length&&o.clearFieldError(n.timezoneSelect),o.updateUi()}),n.manualDateInput.addEventListener("input",o.updateUi),n.manualTimeInput.addEventListener("input",o.updateUi)}function qn(t){const{controllers:e,dom:n}=t,o=e.wifiController.isScanning()||e.wifiController.isConnecting()||e.wifiController.isCheckingStatus(),i=e.wifiController.isSelectedConnected(),s=e.wifiController.getSelectedNetwork().trim(),c=s.length>0&&!i&&e.wifiController.requiresPassword(),d=i||s.length>0&&(!c||n.passwordInput.value.trim().length>0);n.scanBtn.disabled=o,n.connectBtn.disabled=o||!d,n.wifiStatusCard.actionDisabled=o,n.passwordInput.disabled=e.wifiController.isConnecting(),e.wifiController.isConnecting()?(n.connectBtn.textContent=a("Connecting...","Connessione..."),n.wifiStatusCard.actionLabel=a("Connecting...","Connessione...")):i?(n.connectBtn.textContent=a("Disconnect","Disconnetti"),n.wifiStatusCard.actionLabel=a("Disconnect","Disconnetti")):(n.connectBtn.textContent=a("Connect","Connetti"),n.wifiStatusCard.actionLabel=e.wifiController.isCurrentlyConnected()?a("Disconnect","Disconnetti"):a("Connect","Connetti"));const u=e.timeController.isTimezoneBusy()||e.timeController.isLocationBusy()||e.timeController.isClockBusy();n.timezoneSelect.disabled=u,n.manualDateInput.disabled=u,n.manualTimeInput.disabled=u,n.timezoneLocationSaveBtn.disabled=u||n.timezoneSelect.value.trim().length===0,n.timezoneLocationClearBtn.disabled=u||n.timezoneSelect.value.trim().length===0;const f=e.geminiController.isGeminiBusy(),b=e.geminiController.getGeminiHasKey();n.geminiApiKeyInput.readOnly=b||f,n.geminiApiKeyInput.disabled=f,n.geminiSaveBtn.disabled=f||b||n.geminiApiKeyInput.value.trim().length===0,n.geminiSaveBtn.hidden=b,n.geminiClearBtn.disabled=f||!b,n.geminiClearBtn.hidden=!b}re();te();ce();pe();Te();Ee();ze();Oe();He();let nt=null;const x=bn(),Nt=vn(x.wifiSettingsNotification),Pn=qt(x.geminiCard),Ot=qt(x.timezoneLocationCard),Dt=()=>document.createElement("input"),Nn=document.createElement("button"),On=Dt(),Dn=Dt(),Fn=document.createElement("input");function L(){qn({controllers:{geminiController:rt,timeController:z,wifiController:M},dom:x})}const rt=In({fetchGeminiModuleJson:Mt,fetchOpenAiModuleJson:()=>Promise.resolve({}),geminiApiKeyInput:x.geminiApiKeyInput,isGeminiModuleActive:()=>!0,isOpenAiModuleActive:()=>!1,notifyGemini:Pn,notifyOpenAi:()=>{},openAiApiKeyInput:Fn,updateButtons:L}),z=Ln({applyTalkingClockModuleSettings:()=>{},bedtimeTimeInput:Dn,clearFieldError:it,clockModeToggle:Nn,clockSyncPollAttempts:rn,clockSyncPollIntervalMs:on,fetchTimeRuntimeJson:fn,fetchTimeSettingsJson:mn,fetchTimezoneListJson:pn,focusTalkingClockTimeInput:()=>{},buildTimezoneLabelMap:kn,formatTimezoneLabel:En,isSwitchChecked:wn,isTalkingClockModuleActive:()=>!1,isTalkingClockModuleBusy:()=>!1,manualDateInput:x.manualDateInput,manualTimeInput:x.manualTimeInput,notifyClockMode:()=>{},notify:Ot,onStateChange:L,onTalkingClockBusyChange:()=>{},parseClockTimeInputValue:_n,patchTalkingClockSettings:()=>Promise.resolve({success:!0}),setFieldError:ot,setSwitchChecked:yn,timeRuntimeApi:un,timeSettingsApi:dn,timezoneSelect:x.timezoneSelect,wakeupTimeInput:On}),M=Bn({checkIcon:Xe,clearFieldError:it,delayMs:xn,fetchPortalJson:gn,networkList:x.networkList,notify:Nt,onConnectionStateChange:({wasConnected:t,isCurrentlyConnected:e})=>{!t&&e&&z.refreshClockStatusAfterWifiConnect()},onStateChange:L,passwordInput:x.passwordInput,scanPollAttempts:ln,scanPollIntervalMs:sn,securityIcon:Ke,setFieldError:ot,signalIcons:{oneBar:We,twoBar:Ze,threeBar:Ue,fourBar:Je},statusPollAttempts:nn,statusPollIntervalMs:en,svgWithClass:Sn,wifiFindIcon:je,wifiStatusCard:x.wifiStatusCard});function N(){if(!nt)return;const t=document.documentElement,e=t.scrollHeight>window.innerHeight+1,n=window.scrollY+window.innerHeight>=t.scrollHeight-1;nt.setVisible(e&&!n)}function $n(){x.wifiStatusCard.iconSvg=Ge,x.geminiCard.iconSvg=Ye,x.timezoneLocationCard.iconSvg=Qe,M.renderNetworkList(),document.body&&(nt=Jt({mount:document.body,mode:"fixed",position:"bottom",height:"6rem",width:"100vw",strength:1.8,divCount:5,curve:"bezier",exponential:!0,opacity:1,zIndex:20,className:"page-gradual-blur",fallbackColor:"var(--color-bg-selected)"}),N(),window.addEventListener("scroll",N,{passive:!0}),window.addEventListener("resize",N),typeof ResizeObserver<"u"&&new ResizeObserver(()=>{N()}).observe(document.body)),L(),M.updateWifiStatusCard(),Nt(""),Mn({controllers:{geminiController:rt,timeController:z,wifiController:M},dom:x,helpers:{clearFieldError:it,setFieldError:ot,setTimezoneLocationNotification:Ot,updateUi:L}}),Vn(),window.setInterval(()=>{z.fetchTimeRuntimeStatus()},an)}async function Vn(){await Promise.allSettled([z.populateTimezoneOptions(),z.fetchTimeSettingsStatus(),M.checkStatus(),Rn()])}async function Rn(){try{const t=await Mt("/api/settings/gemini");rt.applyGeminiSettings(t.settings)}catch(t){console.error("Gemini settings status failed:",t)}finally{L()}}Vt().then(()=>{Kt(),$n()});
