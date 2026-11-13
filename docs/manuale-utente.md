# Manuale d'uso di Chroninkle

![Chroninkle](../assets/logos/chroninkle-logo.png)

Chroninkle è un taccuino vocale tascabile. Tieni premuto un tasto, dici quello
che ti passa per la testa e Chroninkle lo tiene in ordine: lo trascrive, lo
riassume e lo smista tra Note, Da fare e Promemoria, su uno schermo che consuma
pochissimo e resta leggibile anche quando il dispositivo "dorme".

Questo manuale descrive il dispositivo come si comporta oggi, nella versione
italiana del firmware (1.2.0 o successive). Alcune immagini della presentazione
iniziale hanno ancora scritte in inglese e mostrano gesti dei tasti non più
attuali: fa fede questo manuale. Chroninkle si chiamava **Followup**: un
dispositivo con un firmware vecchio continua a mostrare il vecchio nome nella
rete Wi-Fi di configurazione finché non viene aggiornato.

La versione inglese di questo manuale è in [user-manual.md](user-manual.md).

## Indice

- [In breve: i tasti](#in-breve-i-tasti)
- [Prima configurazione](#prima-configurazione)
- [Registrare un pensiero](#registrare-un-pensiero)
- [La schermata Home](#la-schermata-home)
- [Note, Da fare e Promemoria](#note-da-fare-e-promemoria)
- [I dettagli di una registrazione](#i-dettagli-di-una-registrazione)
- [Argomenti](#argomenti)
- [Libri](#libri)
- [Impostazioni](#impostazioni)
- [Il portale web](#il-portale-web)
- [Aggiornare il firmware](#aggiornare-il-firmware)
- [Blocco, riposo e batteria](#blocco-riposo-e-batteria)
- [Spegnimento e ricarica](#spegnimento-e-ricarica)
- [Consigli e cose che sorprendono](#consigli-e-cose-che-sorprendono)

## In breve: i tasti

Chroninkle ha tre comandi fisici e nessuno schermo touch: si usa tutto con
questi.

| Comando | Pressione breve | Pressione prolungata |
|---|---|---|
| **Tasto Registra** | **Indietro**: esce da quello in cui sei entrato (una lista aperta, un'area di scorrimento, un selettore) | **Registra** un pensiero (vedi sotto) |
| **Bilanciere** (su / giù / premuto) | Inclinalo su o giù per spostare la selezione; premilo dritto (**Seleziona**) per scegliere o confermare | Tienilo inclinato per continuare a spostarti in quella direzione |
| **PWR** | **Blocca / sblocca** lo schermo | Circa 1 secondo: apre la conferma di **spegnimento** |

Alcune cose utili da sapere subito:

- **Il bilanciere è un solo comando, non tre tasti.** Inclinarlo su o giù
  sposta la selezione; premerlo dritto, quello che in questo manuale
  chiamiamo **Seleziona**, sceglie o conferma.
- **Il tasto Registra fa due cose.** Un tocco breve è **Indietro** ed esce da
  dove ti trovi; se invece lo *tieni premuto*, inizia a registrare. Non serve
  un tasto diverso per uscire da una lista o per registrare. Sullo schermo i
  suggerimenti lo chiamano anche "POWER".
- **Tenere premuto PWR per 6 secondi spegne il dispositivo in ogni caso**,
  qualunque cosa stia facendo lo schermo. È una sicurezza hardware, non
  dovrebbe servire nell'uso normale.
- Lo schermo è e-paper, in bianco e nero, e **lampeggia visibilmente** quando
  si ridisegna per intero (aprendo una nuova schermata, al risveglio, oppure
  ogni tanto per pulire le "ombre" lasciate dagli aggiornamenti rapidi). Gli
  aggiornamenti piccoli, come spostare la selezione o spuntare una casella,
  sono più discreti. È tutto normale.

## Prima configurazione

Alla prima accensione Chroninkle mostra una breve presentazione. Usa il
**bilanciere** per scorrerla (inclina per spostarti, premi per confermare) e
chiudila sull'ultima schermata. Puoi rivederla quando vuoi da
**Impostazioni → Guida**.

Per configurarlo davvero, Chroninkle crea una propria rete Wi-Fi chiamata
**`Chroninkle-XXXXXX`** (gli ultimi caratteri cambiano da dispositivo a
dispositivo) ogni volta che non conosce ancora nessuna rete. Collegati a
quella rete con il telefono o il computer (è aperta, senza password): di
solito la pagina di configurazione si apre da sola, altrimenti visita
`http://192.168.4.1`. Da lì puoi:

- **Collegare Chroninkle al tuo Wi-Fi**: cerca le reti, scegli la tua e
  inserisci la password. Ogni rete a cui il dispositivo si collega viene
  salvata (fino a 5) e usata in automatico quando è in zona.
- **Inserire la chiave API di Gemini**: è quella che permette trascrizioni e
  riepiloghi. Senza, le registrazioni vengono comunque salvate sulla scheda
  SD, ma non vengono trascritte. La chiave si ottiene da
  [Google AI Studio](https://aistudio.google.com/); si può partire con il
  piano gratuito, che ha dei limiti di utilizzo.
- **Impostare fuso orario, data e ora**: servono per avere orari corretti
  sulle registrazioni e per il raggruppamento "Oggi" in Note e Da fare.

Wi-Fi e ora si possono cambiare anche dopo, direttamente dal dispositivo
(pagine Rete e Ora delle [Impostazioni](#impostazioni)). Il portale serve
soprattutto la prima volta, per la chiave di Gemini, per gestire le reti
salvate e per [aggiornare il firmware](#aggiornare-il-firmware). Tutto il
resto è descritto in [Il portale web](#il-portale-web).

Il dispositivo parte in italiano. Per passare all'inglese vai in
**Impostazioni → Lingua**.

## Registrare un pensiero

È la funzione principale:

1. **Tieni premuto il tasto Registra.** Senti un suono di avvio. La
   registrazione parte un istante prima che il suono finisca, così la prima
   parola non viene tagliata; anzi, mentre tieni premuto Chroninkle conserva
   sempre l'ultimo secondo di audio, quindi si salva anche quello che hai
   detto un attimo prima di premere "per bene".
2. **Parla.** Una registrazione dura al massimo **60 secondi**; se continui a
   tenere premuto oltre il limite, si ferma da sola.
3. **Rilascia il tasto.** Senti un suono di fine. Da qui le strade sono due:
   - con lo **smistamento automatico** attivo (impostazione predefinita) e
     Gemini raggiungibile, la registrazione si archivia da sola: vedi
     [Smistamento automatico](#smistamento-automatico);
   - altrimenti si apre subito il menu **Salva registrazione come**, descritto
     qui sotto.

La registrazione non viene riprodotta prima di decidere: puoi riascoltarla
quando vuoi dal suo menu o dalla pagina dei dettagli.

### Il menu "Salva registrazione come"

Compare quando lo smistamento è impostato su **Manuale** oppure quando Gemini
non è raggiungibile (per esempio senza Wi-Fi). Ha cinque voci:

- **Nota**: un pensiero generico.
- **Da fare**: qualcosa da fare; finisce nella lista **Da fare**.
- **Idea**: qualcosa su cui riflettere più avanti.
- **Argomento**: non salva nessuna nota. Chroninkle trascrive quello che hai
  detto, ne ricava un nome breve e lo aggiunge come nuovo
  [argomento](#argomenti) (per esempio tieni premuto, dici "ristrutturazione
  cucina" e scegli Argomento: da quel momento quel progetto esiste come
  argomento da assegnare alle altre voci). Sulla scheda SD non viene salvato
  nulla, come per Scarta.
- **Scarta**: butta via la registrazione senza salvare niente.

Se hai scelto Nota, Da fare o Idea e Chroninkle ha Wi-Fi e chiave di Gemini,
la trascrizione avviene in background: compare per un attimo "Trascrizione in
corso...", poi un messaggio che conferma il salvataggio della trascrizione
oppure dice che non è riuscita.

### Smistamento automatico

Quando in **Impostazioni → Tipo** c'è **Automatico** e Chroninkle è online con
una chiave di Gemini funzionante, il menu non compare: con un'unica richiesta
Gemini trascrive la registrazione e capisce che cos'è.

- **Cose da fare con scadenza.** Se dici "domani devo comprare il latte,
  chiamare Marco entro venerdì alle 15 e pagare la bolletta" ottieni tre voci
  separate in Da fare, ognuna con il suo testo breve e la sua scadenza. La
  prima conserva l'audio della registrazione, le altre sono solo testo. Le
  scadenze vengono capite anche quando sono dette in modo relativo ("domani",
  "venerdì", "lunedì prossimo").
- **Idee e note** vengono salvate come tali.
- **Argomenti.** Se la registrazione riguarda chiaramente uno dei tuoi
  argomenti, viene collegata a quello. Per crearne uno nuovo basta dire, per
  esempio, "nuovo argomento ristrutturazione cucina".
- Un messaggio ti dice dove è finita, per esempio "3 attività aggiunte a Da
  fare" oppure "Salvato come Idea - Casa".

Gemini a volte può sbagliare. Se una nota doveva essere una cosa da fare usa
**Trasforma in attività** dal suo menu; negli altri casi eliminala e
registrala di nuovo.

### Se registri senza connessione

La registrazione viene comunque salvata sulla scheda SD e segnata come "da
trascrivere". Appena Chroninkle torna online ritenta da solo tutte quelle in
attesa; un piccolo numero nella barra di stato indica quante sono. Ogni
registrazione ha un solo tentativo automatico: se fallisce, la puoi trascrivere
a mano dalla pagina dei dettagli.

## La schermata Home

La Home è il cruscotto di Chroninkle. In alto trovi:

- la data di oggi e un messaggio di benvenuto che cambia nel tempo;
- un contatore delle attività, **Attività completate**, con "`fatte`/`totali`
  completate" e una barra di avanzamento, oppure "Ancora nessuna attività" se
  non hai ancora niente in Da fare.

Sotto c'è il menu principale, in quest'ordine:

- **Promemoria**: tutto quello che hai segnato per riprenderlo più avanti,
  qualunque sia il tipo (il numero indica quanti sono).
- **Da fare** (con il numero): le tue cose da fare.
- **Note** (con il numero): le tue note e idee.
- **Argomenti**: tutto quello che appartiene a un certo
  [argomento](#argomenti), compresi i riepiloghi scritti da Gemini.
- **Libri**: per leggere file `.txt` dalla [cartella dei libri](#libri).

Spostati inclinando il bilanciere e premilo per **Selezionare**.

## Note, Da fare e Promemoria

Queste tre schermate hanno la stessa struttura: le registrazioni sono
raggruppate per giorno. Seleziona un giorno per aprirlo e vedrai le singole
voci, ognuna con un estratto della trascrizione (oppure "solo audio" se non è
ancora stata trascritta), l'ora e la durata. Un tocco sul tasto Registra
richiude il giorno e ti riporta all'elenco dei giorni.

Dove finisce cosa:

- **Note**: tutto quello che è Nota o Idea.
- **Da fare**: tutte le cose da fare. Se una voce aperta ha una scadenza,
  l'etichetta a destra la mostra al posto di "Da fare": "Oggi", "Domani",
  "Ven 14 nov 15:00" oppure "Scaduta".
- **Promemoria**: tutto quello che hai segnato come promemoria, qualunque sia
  il tipo, con il tipo indicato sulla riga.

Selezionando una voce si apre un menu di azioni, che cambia a seconda della
schermata:

| Azione | Note | Da fare | Promemoria |
|---|:---:|:---:|:---:|
| Riproduci registrazione *(solo se l'audio esiste ancora)* | ✓ | ✓ | ✓ |
| Vedi dettagli | ✓ | ✓ | ✓ |
| Aggiungi ai promemoria / Togli dai promemoria | ✓ | ✓ | — |
| Trasforma in attività | ✓ | — | — |
| Completa / Segna come da fare | — | ✓ | — |
| Completa promemoria | — | — | ✓ |
| Archivia ora *(solo se già completata)* | — | ✓ | — |
| Elimina | ✓ | ✓ | ✓ |

Qualche precisazione:

- **Trasforma in attività** (in Note) serve a spostare una nota o un'idea in
  Da fare senza registrarla di nuovo.
- **Completa promemoria** (nella schermata Promemoria) è definitivo: segna la
  voce come fatta e toglie il promemoria, non va avanti e indietro.
- **Elimina cancella la voce per sempre.** Archiviare è un'altra cosa (vedi
  sotto).

### Archiviare le attività completate

In cima alla schermata Da fare c'è il selettore **In corso / Archiviate**.
Selezionalo e inclina il bilanciere per passare da una vista all'altra.

Un'attività completata non sparisce subito: resta spuntata in "In corso" per
un po', così vedi quello che hai fatto. Dopo un certo numero di giorni dal
completamento (7 di base, si cambia nelle [Impostazioni](#da-fare))
Chroninkle la **archivia** da solo: l'audio viene cancellato per liberare
spazio sulla scheda SD, ma il testo resta e la voce si sposta in "Archiviate",
dove puoi ancora leggerla. Puoi anche archiviarla subito con **Archivia ora**
dal suo menu.

Se rimetti da fare una voce archiviata (con "Segna come da fare") torna in
"In corso", ma l'audio cancellato non torna.

### Schermata di blocco e scadenze

Quando blocchi il dispositivo, la schermata di blocco elenca le attività in
sospeso mettendo prima quelle segnate come promemoria e, all'interno di ogni
gruppo, quelle con la scadenza più vicina (per esempio "Domani · Comprare il
latte"). Vedi [Blocco, riposo e batteria](#blocco-riposo-e-batteria).

## I dettagli di una registrazione

**Vedi dettagli** mostra la trascrizione completa, che si può scorrere se è
lunga: seleziona l'area di testo e inclina il bilanciere per spostarti a passi
del 10%. Per le attività con una scadenza, il testo inizia con "Scadenza: …".
Sotto ci sono:

- **Modifica argomenti**: apre l'elenco dei tuoi [argomenti](#argomenti);
  seleziona un argomento per spuntarlo o toglierlo, poi seleziona **Fatto** per
  salvare. Puoi spuntarne più di uno.
- **Indietro**: torna da dove sei arrivato.
- L'ultimo pulsante è **Riproduci** se esiste già una trascrizione, oppure
  **Trascrivi** se non c'è ancora. Se la trascrizione c'è ma il file audio non
  esiste più (per esempio dopo l'archiviazione, se l'hai cancellato via USB,
  o per le attività ricavate da una registrazione più lunga), il pulsante
  sparisce invece di offrire una riproduzione vuota.

## Argomenti

Gli argomenti sono etichette, per esempio il nome di un progetto, che puoi
assegnare a qualsiasi nota, idea o attività, indipendentemente dal tipo. Si
creano a voce (vedi [Registrare un pensiero](#registrare-un-pensiero)) oppure
dalle [Impostazioni](#argomenti-1), dove si possono anche rinominare ed
eliminare. La voce **Argomenti** della Home serve a sfogliarli:

1. Scegli un argomento dall'elenco.
2. Vedi tutto quello che gli appartiene, note, idee e attività insieme,
   raggruppato per giorno come nelle altre liste. Ogni riga indica il tipo
   (Nota/Idea/Da fare).
3. Seleziona una voce per aprirne i [dettagli](#i-dettagli-di-una-registrazione).
4. Quando l'argomento ha almeno una voce, accanto a **Indietro** compare
   **Riassumi**: un riepilogo scritto da Gemini di tutto quello che è stato
   collegato all'argomento, senza limiti di tempo (un argomento si può
   riprendere anche a mesi di distanza). Premi **Ottieni riepilogo** per
   generarlo; il risultato compare nell'area di testo, scorrevole come nella
   pagina dei dettagli. Tornando più tardi trovi il riepilogo già fatto; premi
   **Aggiorna** per farne uno nuovo. I riepiloghi sono scritti in italiano;
   quelli creati quando il dispositivo era in inglese restano in inglese
   finché non li aggiorni. Se Gemini non è ancora collegato, compare l'invito a
   configurarlo.
5. **Indietro** riporta all'elenco degli argomenti, oppure, dal riepilogo,
   alle voci di quell'argomento.

Se a un argomento non è ancora collegato niente, compare "Ancora nessuna voce
con questo argomento" e il pulsante Riassumi non c'è.

## Libri

La voce **Libri** della Home apre un semplice lettore di file di testo
`.txt`: copiali nella cartella `books` della scheda SD (via USB, da
Impostazioni → Memoria) e li troverai qui.

- Selezionando **Libri** vedi l'elenco dei file `.txt` di quella cartella.
  Spostati con il bilanciere e selezionane uno per aprire un menu con:
  - **Continua a leggere**: riapre il libro all'ultima pagina letta;
  - **Ricomincia dall'inizio**: riparte da pagina uno, sovrascrivendo la
    posizione salvata;
  - **Elimina**: cancella il libro (e la posizione salvata) dalla scheda SD,
    dopo una conferma. Non si può annullare.
- Durante la lettura, inclinando il bilanciere giri pagina avanti (giù) o
  indietro (su). Ogni libro ricorda l'ultima pagina, quindi uscendo e
  rientrando riprendi da lì.
- Un tocco sul tasto Registra chiude la lettura e torna all'elenco.
- Puoi tornare indietro fino all'inizio del libro in qualsiasi momento, anche
  subito dopo averlo riaperto. Un libro letto molto avanti può metterci un
  attimo ad aprirsi, mentre ricostruisce dove iniziavano le pagine precedenti.
- Il lettore guarda solo in quella cartella (non nelle sottocartelle) e legge
  solo file `.txt`. Le lettere accentate si vedono correttamente, anche nei
  file salvati con la vecchia codifica Latin-1.

## Impostazioni

Le Impostazioni funzionano come quelle di un telefono: un elenco di voci,
ognuna con la sua pagina, due interruttori che cambiano subito e un'azione in
fondo:

- **Rete**: Wi-Fi e Access point.
- **Ora**: fuso orario e orologio.
- **Lingua: Italiano**: premila per passare all'inglese (e viceversa). Lo
  schermo si ridisegna subito nella nuova lingua e la scelta resta salvata.
- **Tipo: Automatico**: premila per passare a **Manuale** (e viceversa). In
  Automatico Gemini smista da solo le registrazioni (vedi
  [Smistamento automatico](#smistamento-automatico)); in Manuale scegli tu dal
  menu dopo ogni registrazione.
- **Memoria**: stato e gestione della scheda SD.
- **Da fare**: archiviazione delle attività.
- **Argomenti**: crea, rinomina ed elimina gli argomenti.
- **Informazioni**: versione del firmware e ringraziamenti.
- **Guida**: rivede la presentazione iniziale. Non è una pagina ma
  un'azione diretta.

Seleziona una voce per aprirne la pagina. Ogni pagina ha in fondo un pulsante
**Indietro** che riporta alle Impostazioni; l'icona **Home** in basso, invece,
porta direttamente alla schermata Home.

### Rete

Dall'alto:

1. **WiFi**: accende o spegne il Wi-Fi.
2. **Access point**: accende o spegne la rete di configurazione di Chroninkle
   (quella del [portale web](#il-portale-web)).
3. L'elenco delle reti vicine: ogni riga indica se la rete è aperta o protetta,
   la potenza del segnale e se è quella a cui sei collegato. Scegli una rete,
   inserisci la password se serve (puoi mostrare o nascondere quello che
   scrivi) e premi **Connetti**. Se sei già collegato alla rete selezionata,
   lo stesso pulsante diventa **Disconnetti**. **Cerca** aggiorna l'elenco.

**Reti salvate.** Ogni rete a cui Chroninkle si collega viene ricordata, fino
a 5; quando se ne aggiunge una sesta, viene tolta quella usata meno di
recente. All'accensione e ogni volta che perde la connessione, Chroninkle
cerca le reti salvate in zona e si collega da solo a quella con il segnale
migliore: passare da casa all'ufficio o all'hotspot del telefono non richiede
niente. Per collegarti a mano a una rete salvata, selezionala e premi
**Connetti** lasciando vuota la password (il campo dice "Salvata: lascia
vuoto"). Se scegli a mano una rete e la connessione continua a fallire (per
esempio per una password sbagliata), dopo alcuni tentativi il dispositivo
torna a scegliere tra le reti salvate. Le reti salvate si vedono e si possono
dimenticare dal [portale web](#il-portale-web).

### Ora

Scegli il fuso orario dall'elenco (quello predefinito è **Europa centrale
(Italia)**), oppure inserisci data e ora a mano nei campi: ora e minuti, nel
formato a 24 ore, poi giorno, mese e anno (GG, MM, AAAA). Alla fine premi
**Sincronizza e salva**: salva quello che hai inserito e risincronizza
l'orologio da Internet, se c'è connessione.

### Memoria

1. Spazio libero e percentuale usata della scheda SD (solo se c'è una scheda
   inserita e montata).
2. **Attiva OTG**: rende la scheda SD visibile come chiavetta USB su un
   computer collegato con il cavo USB-C, per copiare i file direttamente.
   Mentre è attivo, la scheda non è disponibile per Chroninkle e per
   riaverla devi premere esplicitamente **Disattiva modalità OTG**. Non c'è un
   modo per uscirne per sbaglio con il cavo collegato: è voluto, così
   Chroninkle non tocca la scheda mentre il computer la sta usando.
3. **Formatta SD**: cancella completamente la scheda SD. Chroninkle chiede
   conferma ("La formattazione cancellerà tutto il contenuto della scheda
   SD") e, una volta confermato, non si può tornare indietro.

### Da fare

**Archivia attività dopo**: per quanti giorni un'attività completata resta
nella lista prima di essere archiviata (vedi
[Archiviare le attività completate](#archiviare-le-attività-completate)). Si
può scegliere tra 7, 14, 30, 60 o 90 giorni, oppure **Mai** per disattivare
l'archiviazione automatica (puoi comunque archiviare le singole voci a mano).
Il valore predefinito è 7 giorni.

### Argomenti

Crea, rinomina ed elimina gli [argomenti](#argomenti). All'inizio ce ne sono
già tre (**Home**, **Car**, **Shopping**, con il nome in inglese) per non
partire con un elenco vuoto: rinominali o eliminali come qualsiasi altro.
Puoi anche creare un argomento a voce, senza passare da qui.

- **Nuovo argomento**: apre la tastiera per scrivere il nome.
- Seleziona un argomento esistente per **Rinominarlo** (con la tastiera) o
  **Eliminarlo**. L'eliminazione chiede conferma; le voci che lo avevano lo
  perdono, ma mantengono gli altri argomenti.

### Informazioni

Mostra la versione del firmware installata e un ringraziamento: Chroninkle è
nato come fork di Followup, creato da ALXV Labs.

## Il portale web

Il portale è la pagina di configurazione che si apre dal telefono o dal
computer. Per raggiungerlo:

1. Sul dispositivo vai in **Impostazioni → Rete** e accendi **Access point**
   (alla prima accensione, senza reti salvate, si accende da solo).
2. Collega il telefono o il computer alla rete **`Chroninkle-XXXXXX`**.
3. La pagina si apre da sola; altrimenti visita `http://192.168.4.1`.

Il portale usa la stessa lingua del dispositivo e contiene:

- **Wi-Fi**: lo stato della connessione e il pulsante **Impostazioni**, che
  apre il pannello **Impostazioni Wi-Fi**. Lì puoi cercare le reti,
  collegarti (per una rete già salvata non serve la password) e vedere la
  sezione **Reti salvate**, con indicata quella connessa e un pulsante
  **Dimentica** per ciascuna. Dimenticare la rete in uso fa anche disconnettere
  il dispositivo.
- **Chiave API di Gemini**: per salvarla o cancellarla. Per sicurezza il
  portale non la mostra mai per intero.
- **Impostazione ora**: fuso orario, ora e data.
- **Aggiornamento firmware**: vedi la sezione successiva.

La rete di configurazione è aperta, senza password: tieni acceso l'Access
point solo mentre ti serve.

## Aggiornare il firmware

Dalla versione 1.1.0 il firmware si aggiorna senza cavo, dal portale:

1. Procurati il file del nuovo firmware (quello che finisce con `-ota.bin`,
   oppure `build/chroninkle.bin` se lo compili tu).
2. Apri il [portale web](#il-portale-web) e vai alla scheda **Aggiornamento
   firmware**, che mostra anche la versione installata.
3. Tieni il dispositivo sveglio (premi un tasto se lo schermo è a riposo) e
   tocca **Mostra codice**: sullo schermo del dispositivo compare un codice di
   6 cifre.
4. Scegli il file `.bin`, inserisci il codice e tocca **Aggiorna**. Vedi
   l'avanzamento sia nel portale sia sul dispositivo, che alla fine si riavvia
   da solo.

Il codice serve perché la rete del portale è aperta: solo chi ha in mano il
dispositivo può aggiornarlo. Vale 10 minuti e per un solo aggiornamento, e
dopo 5 tentativi sbagliati bisogna chiederne uno nuovo. Il dispositivo accetta
solo firmware Chroninkle e ne controlla l'integrità prima di installarlo. Se il
nuovo firmware non riesce ad avviarsi, al riavvio successivo torna da solo
alla versione precedente.

Il primo passaggio a un firmware con questa funzione, partendo da una
versione precedente alla 1.1.0, va fatto via cavo USB (vedi le istruzioni
allegate al firmware).

## Blocco, riposo e batteria

**Blocco**: una pressione breve di PWR blocca lo schermo. Il blocco manda
subito lo schermo a riposo, senza aspettare il solito tempo di inattività:
un dispositivo bloccato e messo in tasca o in borsa si spegne subito invece
di restare acceso ancora qualche minuto. Lo schermo fermo che vedi da
bloccato è un riepilogo delle tue attività in sospeso, non un orologio.

Da bloccato **scuotere il dispositivo non lo risveglia**: serve una vera
pressione di un tasto. È voluto: il movimento da solo (camminare, essere
portato in borsa) viene ignorato, così il dispositivo bloccato non continua a
risvegliarsi.

**Sblocco**: premi di nuovo PWR. Torni direttamente alla schermata Home, senza
passaggi intermedi.

**La schermata di blocco** mostra:

- il giorno della settimana e la data;
- il titolo **"DA FARE"**, oppure **"DA FARE - N IN SOSPESO"** se ci sono
  attività aperte, seguito da un massimo di cinque attività: prima quelle
  segnate come promemoria, poi le altre, ognuna ordinata per scadenza, con la
  scadenza davanti al testo. Se sono più di cinque compare la riga "+N altre
  in sospeso"; se non c'è niente da fare compare "Tutto fatto".

**Riposo automatico** (quando non è bloccato ma resta fermo): dopo circa 3
minuti senza movimento lo schermo va a riposo e si ferma sull'ultima
immagine invece di diventare bianco, così si capisce che "riposa" e non che è
spento o rotto. Dopo circa 30 minuti di inattività il dispositivo entra in un
riposo più profondo e scollega il Wi-Fi; premi il tasto Registra o PWR per
risvegliarlo.

## Spegnimento e ricarica

**Spegnimento**: tieni premuto PWR per circa un secondo. Compare la conferma
"Spegnere il dispositivo? Il dispositivo si spegnerà. Vuoi continuare?" con le
opzioni **Annulla** e **Spegni**. Confermando, il dispositivo si spegne. Se in
quel momento è collegato all'alimentazione USB resta acceso finché non stacchi
il cavo: spegnere e scollegare insieme è quello che lo spegne del tutto quando
è alimentato.

Come ultima risorsa, **tenere premuto PWR per 6 secondi toglie subito
l'alimentazione**, qualunque cosa stia facendo lo schermo: utile se il
dispositivo non risponde più.

**Ricarica**: collegalo con un cavo USB-C. La barra di stato mostra la
percentuale della batteria e il simbolo di ricarica mentre è collegato.

## Consigli e cose che sorprendono

- **Le registrazioni si fermano dopo 60 secondi**: abbastanza per elencare
  più cose da fare in una volta sola.
- **Detta più attività insieme.** Con lo smistamento automatico una frase come
  "domani latte, venerdì dentista alle 10 e chiamare la banca" diventa tre
  attività separate, con le loro scadenze.
- **Scarta cancella davvero**: con il menu manuale, se scegli Scarta sulla
  scheda SD non viene scritto niente.
- **Archiviare non è eliminare**: il testo di un'attività archiviata resta
  leggibile in "Archiviate"; se ne va solo l'audio, e solo dopo che è stata
  completata da un po' (o se la archivi tu).
- **Uno schermo bloccato e a riposo non è rotto**: l'e-paper resta
  sull'ultima immagine disegnata quando riposa, è normale.
- **Il lampeggio ogni tanto è voluto**: dopo alcuni aggiornamenti rapidi lo
  schermo si ridisegna per intero, diventando bianco per un attimo, per
  togliere le ombre delle schermate precedenti.
- **Gemini ha bisogno di Internet**: senza Wi-Fi le registrazioni si salvano
  lo stesso e vengono trascritte appena il dispositivo torna online.
