/* Slabikář — data: slova, písmenka, země, věty, čepice */
'use strict';

/* SLA-BI-KY obrázek. Slova se nabízejí, až dítě zná všechna jejich písmena. */
const RAW = `
MÁ-MA 👩|TÁ-TA 👨|LA-MA 🦙|KO-LO 🚲|RY-BA 🐟|KO-ZA 🐐|NO-HA 🦵|RU-KA ✋|SO-VA 🦉|VO-DA 💧|KÁ-VA ☕|AU-TO 🚗|O-KO 👁️|PI-LA 🪚
KO-RU-NA 👑|RA-KE-TA 🚀|BO-TA 👢|ŽÁ-BA 🐸|DÝ-NĚ 🎃|MÍ-SA 🥣|SÁ-NĚ 🛷|LO-KO-MO-TI-VA 🚂|TE-LE-VI-ZE 📺|BA-NÁN 🍌|MO-TÝL 🦋
ME-LOUN 🍉|TU-LI-PÁN 🌷|RŮ-ŽE 🌹|PE-RO 🪶|LI-MO-NÁ-DA 🥤|DÁ-REK 🎁|MĚ-SÍC 🌙|PA-VOUK 🕷️|TE-LE-FON ☎️|HO-DI-NY ⏰|PO-HÁR 🏆
KAK-TUS 🌵|SA-LÁT 🥗|TY-GR 🐯|LEV 🦁|PES 🐕|LES 🌲|NOS 👃|SÝR 🧀|DŮM 🏠|MÍČ ⚽|LUK 🏹|KŮŇ 🐴|SŮL 🧂|ZUB 🦷|DORT 🎂|VLAK 🚆
KOČ-KA 🐈|MYŠ 🐭|ŠNEK 🐌|HAD 🐍|SLON 🐘|ŽI-RA-FA 🦒|ZE-BRA 🦓|O-PI-CE 🐒|LIŠ-KA 🦊|MED-VĚD 🐻|KRÁ-VA 🐄|PRA-SE 🐖|SLE-PI-CE 🐔
HRUŠ-KA 🍐|JA-HO-DA 🍓|HVĚZ-DA ⭐|LOĎ ⛵|KLÍČ 🔑|KNI-HA 📖|JE-ŽEK 🦔|VČE-LA 🐝|DI-NO-SAU-RUS 🦕|ČE-PI-CE 🧢|RU-KA-VI-CE 🧤
PO-NOŽ-KA 🧦|KAL-HO-TY 👖|TRIČ-KO 👕|ŠA-TY 👗|BA-LÓN 🎈|KOST-KA 🎲|BU-BEN 🥁|KY-TA-RA 🎸|TRUM-PE-TA 🎺|SLUN-CE ☀️|MRAK ☁️
DU-HA 🌈|O-HEŇ 🔥|SNĚ-HU-LÁK ☃️|STROM 🌳|KYT-KA 🌼|HOU-BA 🍄|LE-TA-DLO ✈️|TRAK-TOR 🚜|PO-LÉV-KA 🍲|CHLÉB 🍞|MLÉ-KO 🥛
VEJ-CE 🥚|ZMRZ-LI-NA 🍦|BON-BON 🍬|ŽI-DLE 🪑|LŽÍ-CE 🥄
A-NA-NAS 🍍|AU-TO-BUS 🚌|AN-DĚL 👼|A-VO-KÁ-DO 🥑|OV-CE 🐑|O-REL 🦅|O-ŘECH 🌰|OK-NO 🪟|U-CHO 👂|ÚS-TA 👄|U-LI-TA 🐚|U-FO 🛸
MA-PA 🗺️|LAM-PA 💡|LU-PA 🔍|PO-LE 🌾|MA-SO 🥩|SE-LE 🐷|TE-LE 🐮|MOST 🌉|LIST 🍃|ME-TLA 🧹|PA-LE-TA 🎨|TLA-PA 🐾|STO 💯|PO-STEL 🛏️
JO-JO 🪀|JE-TEL 🍀|O-LEJ 🛢️|JE-LEN 🦌|PÁV 🦚|VÍ-LA 🧚|VA-NA 🛁|VLK 🐺|PÁ-NEV 🍳|NO-TA 🎵|NI-TĚ 🧵|MI-MI-NO 👶|TE-NIS 🎾
PLA-NE-TA 🪐|AN-TÉ-NA 📡|TU-LEŇ 🦭|DĚ-DA 👴|MED 🍯|LED 🧊|DÍ-TĚ 🧒|DI-A-MANT 💎|PĚT 5️⃣|OSM 8️⃣|DVA 2️⃣|DE-SET 🔟
KLUK 👦|KO-A-LA 🐨|KLAUN 🤡|KA-MI-ON 🚚|KO-KOS 🥥|KI-VI 🥝|KO-TVA ⚓|KOS-TEL ⛪|KLO-KAN 🦘|PTÁK 🐦|SA-NIT-KA 🚑|KÁ-NO-E 🛶
KO-ME-TA ☄️|MAS-KA 🎭|VLAJ-KA 🚩|PLA-ME-ŇÁK 🦩
RAK 🦞|RÁ-DI-O 📻|TRÁ-VA 🌱|PRST 👆|VR-TUL-NÍK 🚁|MO-TOR-KA 🏍️|PA-PÍR 📄|SE-KE-RA 🪓|OS-TROV 🏝️|ME-RUŇ-KA 🍑|KRÁL 🤴|DRAK 🐉
KA-ME-RA 🎥|KAR-TA 🃏|MR-KEV 🥕|O-KUR-KA 🥒|KO-MÁR 🦟|VE-VER-KA 🐿️|VÍ-TR 🌬️|TEP-LO-MĚR 🌡️
ZÁ-MEK 🏰|ZVON 🔔|ZE-LÍ 🥬|ZE-MĚ 🌍|VÁ-ZA 🏺|PE-NÍ-ZE 💰|ZÁ-KU-SEK 🍰
BRAM-BO-RA 🥔|BLESK ⚡|BE-RAN 🐏|RO-BOT 🤖|KRAB 🦀|JA-BL-KO 🍎|O-BÁL-KA ✉️|KLO-BOUK 🎩|KA-BÁT 🧥|TRAM-VAJ 🚋|O-BRAZ 🖼️|BAS-KET-BAL 🏀
HO-RA 🏔️|HOUS-LE 🎻|HEL-MA ⛑️|HO-KEJ 🏒|HO-LUB 🕊️|HO-TEL 🏨|BA-TOH 🎒|ROH-LÍK 🥐|SNÍH ❄️|LÁ-HEV 🍼|MED-VÍ-DEK 🧸
BÝK 🐂|BRÝ-LE 👓|MÝ-DLO 🧼|BO-TY 👟|HRA-NOL-KY 🍟|HROZ-NY 🍇|JA-ZYK 👅|KLÁ-VE-SY 🎹|KO-RÁ-LY 📿|NE-TO-PÝR 🦇|KRO-KO-DÝL 🐊
CI-BU-LE 🧅|CIT-RON 🍋|CIR-KUS 🎪|CES-TA 🛣️|SRD-CE ❤️|PA-LEC 👍|KO-PEC ⛰️|NOC 🌃|TA-NEC 💃|PO-LI-CI-E 🚓|KRA-BI-CE 📦|PRIN-CEZ-NA 👸
CYK-LIS-TA 🚴|ZA-JÍC 🐇
ČAJ 🍵|ČERT 😈|ČA-RO-DĚJ 🧙|ČO-KO-LÁ-DA 🍫|ČÍS-LO 🔢|RAJ-ČE 🍅|KO-LÁČ 🥧|PO-ME-RANČ 🍊|VI-DLIČ-KA 🍴|SVÍČ-KA 🕯️|KO-LO-TOČ 🎠
BA-BIČ-KA 👵|O-ČI 👀|PO-ČÍ-TAČ 💻|PTÁ-ČEK 🐤|TERČ 🎯|ZA-JÍ-ČEK 🐰|TUČ-ŇÁK 🐧
ŠÁ-LA 🧣|ŠKO-LA 🏫|ŠTĚ-NĚ 🐶|KO-ŠÍK 🧺|TAŠ-KA 👜|PA-POU-ŠEK 🦜|BE-RUŠ-KA 🐞|DEŠT-NÍK ☂️|DÉŠŤ 🌧️|POŠ-TA 📮|KO-ŠI-LE 👔|MI-KU-LÁŠ 🎅
MAŠ-LE 🎀|JEŠ-TĚR-KA 🦎|ŠTĚ-TEC 🖌️|ŠROUB 🔩
ŽEL-VA 🐢|ŽRA-LOK 🦈|NŮŽ-KY ✂️|LY-ŽE 🎿|VĚŽ 🗼|TUŽ-KA ✏️|RÝ-ŽE 🍚|BĚ-ŽEC 🏃|KO-LO-BĚŽ-KA 🛴|JED-NO-RO-ŽEC 🦄
ŘE-KA 🏞️|ŘE-TĚZ ⛓️|TA-LÍŘ 🍽️|MO-ŘE 🌊|DVE-ŘE 🚪|KU-ŘE 🐥|TŘI 3️⃣|ČTY-ŘI 4️⃣|KU-KU-ŘI-CE 🌽|TŘE-ŠEŇ 🍒|RY-BÁŘ 🎣|LÉ-KAŘ 🩺|PE-KAŘ 🥖
BOUŘ-KA ⛈️|PŘÍ-ŠE-RA 👾
CHO-BOT-NI-CE 🐙|CHA-LU-PA 🏡|KACH-NA 🦆|DUCH 👻|HROCH 🦛|LE-NO-CHOD 🦥|ŠA-CHY ♟️|SMÍCH 😂|CHLE-BÍ-ČEK 🥪
FON-TÁ-NA ⛲|FO-ŤÁK 📷|FILM 🎬|DEL-FÍN 🐬|SE-MA-FOR 🚦|MI-KRO-FON 🎤|SO-FA 🛋️|FA-BRI-KA 🏭|SURF 🏄
GO-RI-LA 🦍|GÓL 🥅|GE-PARD 🐆|GLÓ-BUS 🌐|MAN-GO 🥭|HAM-BUR-GER 🍔|ŠPA-GE-TY 🍝|VA-GÓN 🚃|LE-GO 🧱|MAG-NET 🧲
`.replace(/\n/g, '|');

/* Pořadí souhlásek jako ve slabikáři. Stanice 0 jsou samohlásky. */
const ORDER = ['M','L','P','S','T','J','V','N','D','K','R','Z','B','H','Y','C','Č','Š','Ž','Ř','CH','F','G'];
const VOW = ['A','E','I','O','U'];
const NORM = {'Á':'A','É':'E','Ě':'E','Í':'I','Ó':'O','Ú':'U','Ů':'U','Ý':'Y','Ď':'D','Ť':'T','Ň':'N'};
/* souhlásky, po kterých se píše tvrdé y (pro slabiky s Y) */
const YCONS = ['H','CH','K','R','D','T','N','B','L','M','P','S','V','Z'];
/* hlásky, které jdou táhnout (nápověda při nahrávání) */
const CONT = ['M','L','S','V','N','R','Z','F','J','H','Š','Ž','Ř','CH'];

/* Země na trati: každá má 4 stanice. */
const REGIONS = [
  {id:'louka',  n:'Louka',  hello:'Vítej na louce!'},
  {id:'les',    n:'Les',    hello:'Vítej v lese!'},
  {id:'farma',  n:'Farma',  hello:'Vítej na farmě!'},
  {id:'hory',   n:'Hory',   hello:'Vítej v horách!'},
  {id:'more',   n:'Moře',   hello:'Vítej u moře!'},
  {id:'vesmir', n:'Vesmír', hello:'Vítej ve vesmíru!'}
];
const ZN = ORDER.length + 1;                       /* 24 stanic s písmenky */
const zoneLetter = z => z > 0 && z < ZN ? ORDER[z - 1] : null;
const zoneLabel  = z => z === 0 ? 'A' : z < ZN ? ORDER[z - 1] : '★';
const zoneRegion = z => REGIONS[Math.floor(z / 4) % REGIONS.length];

/* Věty sovičky. Klíč nahrávky je text malými písmeny, takže jdou přemluvit. */
const PH = {
  hello:'Ahoj! Pojedeme vláčkem?', go:'Jedeme!',
  first:'Co slyšíš na začátku?', last:'Co slyšíš na konci?', clap:'Vytleskej slovo. Kolik má slabik?',
  find:'Najdi slabiku.', findh:'Najdi písmenko.', build:'Slož slabiku.', word:'Slož slovo.',
  read:'Přečti slovo a najdi obrázek.', pick:'Najdi správné slovo.', pairs:'Najdi velké a malé písmenko.',
  paint:'Vybarvi písmenko.', speak:'Přečti to nahlas.', mole:'Chyť písmenko, kterým to začíná.',
  ok1:'Výborně!', ok2:'Paráda!', ok3:'Super!', ok4:'To je ono!', ok5:'Skvěle!', ok6:'Jsi šikulka!',
  no1:'Zkus to ještě jednou.', no2:'Poslouchej dobře.',
  station:'Stanice!', egg:'Vajíčko! Ťukej na něj.', name:'Jak se bude jmenovat?', gift:'Dárek! Otevři ho.',
  hat:'Komu dáš čepici?', letter:'Nové písmenko!', night:'Zlaté vajíčko se vylíhne zítra.',
  hatch:'Zlaté vajíčko se klube!', medal:'Medaile pro tebe!', sleep:'Sovička jde spát. Zítra jedeme dál!',
  end:'Hotovo, šikovný!',
  /* chválí snahu, pozornost a vytrvalost (growth mindset) */
  ok7:'Dobře posloucháš!', ok8:'Čteš čím dál líp!', ok9:'Pěkně přečteno!', ok10:'Trénink se vyplácí!', ok11:'Vidíš, jak ti to jde?',
  re1:'Nevzdáváš se, super!', re2:'Napodruhé to vyšlo!', re3:'Zkoušet znovu se vyplatí!', re4:'Opravil sis to. Výborně!',
  oo1:'Chyba nevadí, z chyb se učíme.', oo2:'Hmm, ještě ne. Zkus to znovu.', oo3:'Klidně si to poslechni ještě jednou.',
  hd1:'Tohle bylo těžké. Příště to půjde líp.', hd2:'Nevadí, ukážu ti to.', hd3:'Těžké úkoly nás učí nejvíc.',
  en2:'Dobrá práce! Každá jízda tě posouvá.', en3:'Jsi zase o kousek dál!', en4:'Dneska ses zase něco naučil.'
};
/* skupiny vět: hra z nich vybírá; ve studiu jsou nadpisy, ať jde nahrát po svém */
const PHG = {
  praise: ['ok1','ok2','ok3','ok4','ok5','ok6','ok7','ok8','ok9','ok10','ok11'],
  retry: ['re1','re2','re3','re4'],
  oops: ['no1','no2','oo1','oo2','oo3'],
  hard: ['hd1','hd2','hd3'],
  end: ['end','en2','en3','en4']
};
const PHSEC = [
  ['Zadání úkolů', ['first','last','clap','find','findh','build','word','read','pick','pairs','paint','speak','mole','letter']],
  ['Pochvala za správnou odpověď', PHG.praise],
  ['Když to vyjde napodruhé', PHG.retry],
  ['Když se splete (povzbuzení)', PHG.oops],
  ['Když to nejde ani napodruhé', PHG.hard],
  ['Konec jízdy', PHG.end],
  ['Vláček, vajíčka a dárky', ['hello','go','station','egg','name','gift','hat','night','hatch','medal','sleep']]
];
const PRAISE = PHG.praise;

/* Samolepky (náklad do vagónků) */
const STICK = ['🦄','🐙','🦖','🐳','🦀','🐞','🐧','🦜','🐢','🦩','🐬','🐼','🐨','🦘','🐊','🦚','🐠','🐲','🌻','🍀','🍒','🍩','🧁','🚁','🛸','🏰','🎠','🪁','🧸','⚓','🛶','🌋','🎪','🦭','🐿️','🦥','🪐','🌵','🐝','🍉'];

/* Čepice pro kamarády */
const HATS = [
  {id:'party', n:'čepička'}, {id:'crown', n:'koruna'}, {id:'tophat', n:'cylindr'}, {id:'cap', n:'kšiltovka'},
  {id:'bow', n:'mašle'}, {id:'flower', n:'kytička'}, {id:'pirate', n:'pirátský klobouk'}, {id:'chef', n:'kuchařská čepice'},
  {id:'wizard', n:'kouzelnický klobouk'}, {id:'prop', n:'vrtulka'}, {id:'cowboy', n:'kovbojský klobouk'}, {id:'beanie', n:'kulich'}
];

const MEDALS = [25, 50, 100, 200, 350, 500, 750, 1000, 1500, 2000, 3000, 5000];

/* Jména kamarádů se skládají ze slabik. Tyhle kousky ve jméně být nesmí. */
const NAMEBAD = ['KAK','PIP','PIC','PIČ','SER','ČUR','CUR','VOL','JEB','SUK','ŠUK','BUZ','KAD','MOČ','ŘIT','RIT','ŽID','NAC','DUR','PAK','LUL',
  'KOZ','ZAB','BIJ','KUR','DUP','ŠUL','NUL','TUP','FUJ','HOV','PRD','MRD','KOK','CEC','DEB','BLB','HNU','PEN','VAG','CIP','PIZ','HUJ','LOL',
  'NEG','NIG','GEJ','HOM','FEN','ČUB','ROM','CIK','SEX','HIT','SAT','JED','ZLO','ZLE','ZLA','BOL','NEM','NUD','SMU','VIN','LEN','HAD','HLU'];

/* Jména kamarádů: skutečná a legrační, ze slabik, které jdou přečíst. Nabízí se jen ta, která dítě umí. */
const NAMES = `MI-MI|MO-MO|MU-MU|LU-LU|LI-LI|LO-LA|LA-LA|LO-LO|MI-LU|MO-LI|LU-MI|ME-LO|MÍ-LA|
PU-PU|PO-PO|PA-PU|PU-PÍK|PE-PÍK|PO-LÍK|LU-PÍK|PA-PI-LO|PI-MO|PU-MA|
SU-SU|SÁ-SA|SO-SO|MI-SA|LI-SA|PI-SÍK|SU-MÍK|SA-LÁ-MEK|SO-PO-LÍK|
TU-TU|TO-TO|TI-TI|TO-MÍK|TU-LÍK|TO-PÍK|MO-TÁ-LEK|PE-TU-LE|TA-PI-TU|
JU-JU|JO-JO|JU-PÍ|JO-LI|MA-JÁ-LEK|JE-TÍK|
VO-VO|VI-VI|VÍ-LA|VA-LÍ-ČEK|VO-PI-ČÁK|
NU-NU|NO-NO|NI-NA|NE-LI|NO-SÍ-LEK|MO-NI|NA-NU|
DU-DU|DO-DO|DÁ-DA|DI-DI|DO-NÍK|MA-DLA|DU-PÍK|
KO-KO|KU-KU|KI-KI|KU-KÍK|KO-MÍK|KU-LÍK|KO-LO-TOČ|LO-KÍK|MA-KÁ-ČEK|KO-KO-SKA|
RU-RU|RO-RO|RA-RA|MU-RÍK|KO-RÁ-LEK|DRA-KÍK|PRA-SÍK|ŽRA-LÍK|
ZU-ZU|ZI-ZI|ZO-ZO|ZU-BÍK|ZA-JÍ-ČEK|
BU-BU|BO-BO|BI-BI|BU-BÁK|BO-BEK|BÁ-BO-RA|BAM-BU-LE|BU-BLI-NA|BO-BÍK|BA-BU-LE|
HU-HU|HO-HO|HA-HA|HO-PÍK|HU-BÍK|HOP-SA-LÍK|HU-LÁ-ČEK|
BY-DLÍK|MY-ŠÁK|SY-SEL|
CI-CI|CU-CU|CO-CO|CI-LI-NA|CUP-TÍK|
ČI-ČI|ČU-ČU|ČO-ČO|ČU-ME-LA|ČÍ-ŽEK|ČO-KO-LÁ-DA|
ŠU-ŠU|ŠI-ŠI|ŠMU-DLA|ŠI-ŠKA|ŠUŠ-NÍK|ŠO-PÍK|PA-ŠÍK|
ŽU-ŽU|ŽI-ŽI|ŽU-ŽÍK|ŽA-BÍK|ŽE-LÍK|
ŘÍ-ŘA|ŘE-PÍK|BŘÍ-ŠEK|HŘÍ-BEK|
CHU-CHU|CHO-CHO|CHLU-PÁČ|CHRU-PÍK|CHO-BO-TÍK|
FU-FU|FI-FI|FÍ-KUS|FLÍ-ČEK|FU-NÍK|
GU-GU|GO-GO|GU-LÁŠ|GO-GO-LÍN|GU-MÍK`.replace(/\n/g, '').split('|').map(x => x.trim()).filter(Boolean).map(x => x.split('-'));
