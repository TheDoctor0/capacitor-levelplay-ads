import type { ConsentLocaleBundle } from '../../definitions';

/** Generated from the official IAB TCF translations (GVL v179) plus the plugin's UI copy. */
export const ro: ConsentLocaleBundle = {
  "ui": {
    "firstLayer.learnMore": "Află mai multe",
    "firstLayer.partners": "Lista partenerilor.",
    "btn.consent": "Sunt de acord",
    "btn.manage": "Gestionează opțiunile",
    "btn.acceptAll": "Acceptă tot",
    "btn.confirm": "Confirmă opțiunile",
    "btn.back": "Înapoi",
    "manage.header": "Preferințe privind datele",
    "manage.title": "Gestionează-ți datele",
    "manage.subtitle": "Puteți alege cum sunt folosite datele dumneavoastră personale. Furnizorii vă cer permisiunea pentru următoarele:",
    "manage.viewDetails": "Vezi detalii",
    "manage.storageTitle": "Stocare, durată și detalii de utilizare",
    "manage.vendorPreferences": "Preferințe privind furnizorii",
    "vendors.title": "Confirmă furnizorii noștri",
    "vendors.subtitle": "Furnizorii vă pot folosi datele pentru a oferi servicii. Refuzarea unui furnizor îl poate împiedica să folosească datele pe care le-ați partajat.",
    "vendors.dataCollected": "Date colectate și prelucrate:",
    "vendors.company": "Companie:",
    "vendors.purposes": "Scopuri:",
    "vendors.privacyPolicy": "Politica de confidențialitate",
    "vendors.consent": "Consimțământ",
    "details.examples": "Exemple",
    "details.vendors": "Furnizori",
    "firstLayer.title": "{appName} dorește să vă folosească datele personale",
    "firstLayer.body": "Datele dumneavoastră personale vor fi prelucrate, iar informațiile de pe dispozitiv (cookie-uri, identificatori unici și alte date ale dispozitivului) pot fi stocate, accesate și partajate cu {count} parteneri sau folosite exclusiv de această aplicație.",
    "manage.consentWithCount.one": "Consimțământ ({count} furnizor)",
    "manage.consentWithCount.few": "Consimțământ ({count} furnizori)",
    "manage.consentWithCount.other": "Consimțământ ({count} de furnizori)",
    "manage.legIntWithCount.one": "Interes legitim ({count} furnizor)",
    "manage.legIntWithCount.few": "Interes legitim ({count} furnizori)",
    "manage.legIntWithCount.other": "Interes legitim ({count} de furnizori)",
    "manage.tcfVendors": "Furnizori TCF",
    "vendors.tcfVendors": "Furnizori TCF",
    "vendors.header": "Preferințe privind furnizorii",
    "firstLayer.geolocation": "Noi și partenerii noștri putem folosi date precise de geolocalizare.",
    "firstLayer.legInt": "Unii furnizori vă pot prelucra datele personale pe baza interesului legitim, la care vă puteți opune gestionând opțiunile de mai jos. Vă puteți modifica sau retrage consimțământul oricând din setările de confidențialitate ale aplicației.",
    "manage.specialFeatures": "Funcționalități speciale",
    "manage.howItWorks": "Cum funcționează această platformă de gestionare a consimțământului (CMP):",
    "manage.cmpChoices": "Opțiuni de confidențialitate CMP",
    "manage.storageBody": "Opțiunile dumneavoastră privind scopurile și furnizorii influențează modul în care vă este prezentată publicitatea personalizată. În această aplicație, opțiunile sunt salvate în memoria dispozitivului cu prefixul „IABTCF_” timp de {days} zile, apoi vă întrebăm din nou.",
    "vendors.otherVendors": "Alți furnizori",
    "vendors.retention": "Păstrare: {days} zile.",
    "vendors.legInt": "Interes legitim",
    "vendors.alwaysActive": "Mereu activ",
    "vendors.legIntPurposes": "Scopuri (interes legitim):",
    "vendors.specialFeatures": "Funcționalități speciale:",
    "vendors.location": "Locul prelucrării:",
    "vendors.category.marketing": "Marketing",
    "vendors.category.functional": "Funcționale",
    "vendors.category.essential": "Esențiale"
  },
  "purposes": {
    "1": {
      "name": "Stocarea și/sau accesarea informațiilor de pe un dispozitiv",
      "shortName": "Stocarea și/sau accesarea informațiilor de pe un dispozitiv",
      "description": "Modulele cookie, dispozitivele sau identificatorii online similari (de exemplu, identificatorii de autentificare, identificatorii alocați aleatoriu, identificatorii de rețea) împreună cu alte informații (de exemplu, tipul browserului și informațiile despre acesta, limba, dimensiunea ecranului, tehnologiile acceptate etc.) pot fi stocate sau citite pe dispozitivul dvs. pentru a le recunoaște de fiecare dată când se conectează la o aplicație sau la un site web, pentru unul sau mai multe scopuri prezentate aici.",
      "illustrations": [
        "Majoritatea scopurilor explicate în această notificare se bazează pe stocarea sau accesarea informațiilor de pe dispozitivul dvs. atunci când utilizați o aplicație sau vizitați un site web. De exemplu, un furnizor sau editor poate stoca un modul cookie pe dispozitivul dvs. în timpul primei dvs. accesări a unui site-web, pentru a putea recunoaște dispozitivul dvs. în timpul următoarelor accesări (prin accesarea acestui modul cookie de fiecare dată)."
      ]
    },
    "2": {
      "name": "Utilizarea de date limitate pentru a selecta publicitatea",
      "shortName": "Afișarea reclamelor pe baza unor date limitate",
      "description": "Publicitatea care vă este prezentată în cadrul acestui serviciu se poate baza pe date limitate, cum ar fi site-ul web sau aplicația pe care o utilizați, locația dvs. neprecisă, tipul de dispozitiv sau conținutul cu care interacționați (sau ați interacționat) (de exemplu, pentru a limita numărul de afișări ale unei reclame).",
      "illustrations": [
        "Un producător auto dorește să își promoveze vehiculele electrice în rândul utilizatorilor preocupați de mediu care locuiesc în oraș după orele de program. Publicitatea este prezentată, după ora 18:30, pe o pagină cu conținut asociat (cum ar fi un articol despre acțiuni privind schimbările climatice), utilizatorilor a căror locație imprecisă sugerează că aceștia se află într-o zonă urbană.",
        "Un mare producător de vopsele acuarelă dorește să realizeze o campanie de publicitate online pentru cea mai recentă gamă de acuarele, diversificându-și publicul pentru a ajunge la cât mai mulți artiști amatori și profesioniști posibil și pentru a evita să afișeze reclama lângă un conținut nepotrivit (de exemplu, articole despre cum să îți vopsești casa). Este detectat și limitat numărul de ori în care v-a fost prezentată reclama, pentru a evita prezentarea acesteia de prea multe ori."
      ]
    },
    "3": {
      "name": "Crearea profilurilor pentru publicitate personalizată",
      "shortName": "Crearea unui profil pentru reclame personalizate",
      "description": "Informațiile despre activitatea dvs. din acest serviciu (cum ar fi formularele pe care le trimiteți, conținutul pe care îl consultați) pot fi stocate și combinate cu alte informații despre dvs. (de exemplu, informații privind activitatea dvs. anterioară de pe acest serviciu și alte site-uri web sau aplicații) sau utilizatori similari. Acestea sunt utilizate apoi pentru a construi sau îmbunătăți un profil despre dvs. (care poate include posibile interese și aspecte personale). Profilul dvs. poate fi utilizat (și mai târziu), de această entitate sau alte entități, pentru a prezenta publicitate care pare mai relevantă pe baza posibilelor dvs. interese.",
      "illustrations": [
        "Dacă citiți mai multe articole despre cele mai bune accesorii de cumpărat pentru biciclete, aceste informații pot fi utilizate pentru a crea un profil despre interesul dvs. față de accesoriile pentru biciclete. Un astfel de profil poate fi utilizat sau îmbunătățit ulterior pe același site web sau pe un alt site web sau aplicație pentru a vă prezenta publicitate pentru un anumit brand de accesorii pentru bicicletă. Dacă vă uitați și la un configurator de preț pentru un vehicul pe un site al unui producător de mașini de lux, aceste informații pot fi combinate cu interesul dvs. legat de biciclete, pentru a perfecționa profilul dvs. și pentru a pleca de la premisa că sunteți interesat(ă) de echipamentele de ciclism de lux.",
        "O companie de îmbrăcăminte dorește să își promoveze noua linie de haine exclusiviste pentru bebeluși. Aceasta contactează o agenție care are o rețea de clienți cu venituri mari (cum ar fi supermarketuri exclusiviste) și solicită agenției să creeze profiluri ale părinților tineri sau ale cuplurilor despre care se poate presupune că sunt înstărite și au un nou copil, astfel încât acestea să poată fi utilizate ulterior pentru a împiedica publicitatea în cadrul aplicațiilor partenere în baza acelor profiluri."
      ]
    },
    "4": {
      "name": "Utilizarea profilurilor pentru selectarea publicității personalizate",
      "shortName": "Afișarea reclamelor personalizate",
      "description": "Publicitatea care vă este prezentată în cadrul acestui serviciu se poate baza pe profilurile dvs. de publicitate, care pot reflecta activitatea dvs. în cadrul acestui serviciu sau pe alte site-uri web sau aplicații (precum formularele pe care le trimiteți, conținutul pe care îl vizualizați), posibilele interese și aspectele personale.",
      "illustrations": [
        "Un comerciant online dorește să facă publicitate unei reduceri limitate la papucii de alergare. Acesta dorește să direcționeze publicitatea către utilizatorii care au vizualizat anterior pantofi de alergat pe aplicațiile mobile. Tehnologiile de urmărire pot fi utilizate pentru a recunoaște faptul că ați utilizat anterior aplicații mobile pentru a vizualiza pantofi de alergare, cu scopul de a vă prezenta reclamele corespunzătoare în aplicație.",
        "Un profil creat pentru publicitate personalizată în legătură cu o persoană care a căutat accesorii pentru biciclete pe un site web poate fi utilizat pentru a prezenta publicitatea relevantă pentru accesoriile pentru biciclete pe o aplicație mobilă a unei alte organizații."
      ]
    },
    "5": {
      "name": "Crearea profilurilor de conținut personalizat",
      "shortName": "Crearea unui profil pentru conținut personalizat",
      "description": "Informațiile despre activitatea dvs. în cadrul acestui serviciu (de exemplu, formularele pe care le trimiteți, conținutul fără caracter publicitar) pot fi stocate și combinate cu alte informații despre dvs. (cum ar fi activitatea dvs. anterioară în cadrul acestui serviciu sau pe alte site-uri web sau aplicații) sau utilizatori similari. Acestea sunt utilizate apoi pentru a construi sau îmbunătăți un profil despre dvs. (care ar putea include, de exemplu, posibile interese și aspecte personale). Profilul dvs. poate fi utilizat (și ulterior) pentru a prezenta conținut care pare mai relevant în baza posibilelor dvs. interese, cum ar fi prin adaptarea ordinii în care vă este afișat conținutul, astfel încât să fie și mai ușor pentru dvs. să găsiți conținut care se potrivește intereselor dvs.",
      "illustrations": [
        "Citiți mai multe articole despre cum să construiți o casă în copac pe o platformă de socializare. Aceste informații pot fi adăugate la un profil pentru a marca interesul dvs. față de conținutul legat de natură, precum și ghidurile de bricolaj (cu obiectivul de a permite personalizarea conținutului, astfel că, de exemplu, vi se prezintă pe viitor mai multe postări despre bloguri și articole legate de case construite în copac și cabane din lemn).",
        "Ați vizionat trei videoclipuri despre explorarea spațiului în diferite aplicații TV. O platformă de știri neafiliată cu care nu ați avut contact construiește un profil pe baza comportamentului de vizualizare respectiv, marcând explorarea spațiului ca un subiect de interes posibil pentru alte videoclipuri."
      ]
    },
    "6": {
      "name": "Utilizarea profilurilor pentru selectarea conținutului personalizat",
      "shortName": "Afișarea conținutului personalizat",
      "description": "Conținutul care v-a fost prezentat în cadrul acestui serviciu se poate baza pe profilurile dvs. de personalizare a conținutului, care pot reflecta activitatea dvs. pe acestea sau în cadrul altor servicii (de exemplu, formularele pe care le trimiteți, conținutul pe care îl vizualizați), posibilele interese și aspectele personale. De exemplu, acesta poate fi utilizat pentru adaptarea ordinii în care conținutul vă este afișat, astfel încât să fie și mai ușor pentru dvs. să găsiți conținut (fără caracter publicitar) care să corespundă intereselor dvs.",
      "illustrations": [
        "Citiți articole despre mâncarea vegetariană pe o platformă de socializare și apoi utilizați aplicația de gătit a unei companii neafiliate. Profilul construit despre dvs. pe platforma de socializare va fi utilizat pentru a vă prezenta rețete vegetariene pe ecranul de întâmpinare al aplicației de gătit.",
        "Ați vizionat trei videoclipuri despre canotaj pe diferite site-uri. O platformă de conținut video neafiliată vă va recomanda alte cinci videoclipuri despre canotaj care v-ar putea interesa atunci când utilizați aplicația TV, pe baza unui profil construit despre dvs. atunci când ați vizitat acele site-uri web diferite pentru a viziona videoclipuri online."
      ]
    },
    "7": {
      "name": "Măsurarea performanței reclamelor",
      "shortName": "Măsurarea performanței reclamelor",
      "description": "Informațiile privind publicitatea care vă este prezentată și modul în care interacționați cu aceasta pot fi utilizate pentru a stabili cât de bine a funcționat o reclamă pentru dvs. sau pentru alți utilizatori și dacă au fost atinse obiectivele acesteia. De exemplu, dacă ați vizualizat o reclamă, dacă ați făcut clic pe ea, dacă v-a determinat să cumpărați un produs sau să vizitați un site web etc. Acest lucru este foarte util pentru a înțelege relevanța campaniilor publicitare.",
      "illustrations": [
        "Ați făcut clic pe o reclamă despre o reducere de „black Friday” promovată de un magazin online pe site-ul web al unui editor și ați achiziționat un produs.Clicul dvs. va fi asociat cu această achiziție. Interacțiunea dvs. și cea a altor utilizatori va fi măsurată pentru a afla câte clicuri pe reclamă au dus la o achiziție.",
        "Sunteți una dintre puținele persoane care au făcut clic pe o reclamă despre o reducere de „ziua internațională a aprecierii” oferită de un magazin de cadouri online în aplicația unui editor.Editorul dorește să primească rapoarte pentru a înțelege cât de des este vizualizată sau accesată o plasare de reclame în cadrul aplicației și în special reclama privind „ziua internațională a aprecierii”, de către dvs. sau de alți utilizatori, pentru a putea ajuta editorul și partenerii acestuia (cum ar fi agențiile) să optimizeze plasarea de reclame."
      ]
    },
    "8": {
      "name": "Măsurarea performanței conținutului",
      "shortName": "Măsurarea performanței conținutului",
      "description": "Informațiile cu privire la conținutul care vă este prezentat și la modul în care interacționați cu acesta pot fi utilizate pentru a stabili dacă, de exemplu, conținutul (fără caracter publicitar) a ajuns la publicul vizat și dacă corespunde intereselor dvs. De exemplu, indiferent dacă citiți un articol, vizionați un videoclip, ascultați un podcast sau vizualizați o descriere a produsului, cât timp petreceți pe acest serviciu și pe paginile web pe care le vizitați etc. Acest lucru este foarte util pentru a înțelege relevanța conținutului (fără caracter publicitar) care vă este prezentat.",
      "illustrations": [
        "Ați citit o postare de blog despre drumeții pe o aplicație mobilă a unui editor și ați urmat un link către o postare recomandată și conexă. Interacțiunile dvs. vor fi înregistrate pentru a arăta că postarea inițială despre drumeții v-a fost utilă și că a reușit să vă facă să fiți interesați și de postarea conexă. Această măsurare va fi făcută pentru a ști dacă trebuie produse pe viitor mai multe postări despre drumeții și pentru a ști unde trebuie plasate pe ecranul de pornire al aplicației mobile.",
        "Vi s-a prezentat un videoclip despre tendințele modei, dar dvs. și alți câțiva utilizatori ați încetat să vizionați videoclipul după 30 de secunde. Aceste informații sunt apoi utilizate pentru a evalua lungimea corectă a viitoarelor videoclipuri despre tendințele modei."
      ]
    },
    "9": {
      "name": "Înțelegerea publicului prin statistici sau combinații de date din surse diferite",
      "shortName": "Înțelegerea publicului nostru prin statistici",
      "description": "Înțelegerea publicului prin statistici sau combinații de date din surse diferite Rapoartele pot fi generate pe baza combinației de seturi de date (cum ar fi profilurile de utilizator, statisticile, cercetarea de piață, datele analitice) cu privire la interacțiunile dvs. și cele ale altor utilizatori cu conținut publicitar sau (fără caracter publicitar) pentru a identifica caracteristicile comune (de exemplu, pentru a determina care audiențe țintă sunt mai receptive la o campanie publicitară sau la un anumit conținut).",
      "illustrations": [
        "Proprietarul unei librării online dorește raportarea comercială care să arate proporția vizitatorilor care au consultat și au părăsit site-ul său fără să facă achiziții sau au consultat și cumpărat ultima autobiografie a unei celebrități din luna respectivă, precum și vârsta medie și distribuția bărbați/femei a fiecărei categorii. Datele referitoare la navigarea dvs. pe site-ul său și la caracteristicile dvs. personale sunt apoi utilizate și combinate cu alte astfel de date pentru a produce aceste statistici.",
        "Un agent de publicitate dorește să înțeleagă mai bine tipul de public care interacționează cu reclamele sale. Acesta solicită unui institut de cercetare să compare caracteristicile utilizatorilor care au interacționat cu reclama, cu atributele tipice ale utilizatorilor platformelor similare, pe diferite dispozitive. Această comparație dezvăluie agentului de publicitate că audiența reclamelor sale accesează în principal reclamele prin intermediul dispozitivelor mobile și că este probabil cuprinsă în intervalul de vârstă 45-60 de ani."
      ]
    },
    "10": {
      "name": "Dezvoltarea și îmbunătățirea serviciilor",
      "shortName": "Îmbunătățirea serviciilor noastre",
      "description": "Informațiile despre activitatea dvs. în cadrul acestui serviciu, cum ar fi interacțiunea dvs. cu reclamele sau conținutul, pot fi foarte utile pentru a îmbunătăți produsele și serviciile și pentru a construi noi produse și servicii pe baza interacțiunilor cu utilizatorul, a tipului de public etc. Acest scop specific nu include dezvoltarea sau îmbunătățirea profilurilor de utilizator și a identificatorilor.",
      "illustrations": [
        "O platformă de tehnologie care lucrează cu un furnizor de rețele de socializare observă o creștere a utilizatorilor de aplicații mobile și observă pe baza profilurilor acestora că mulți dintre ei se conectează prin conexiuni mobile. Aceasta utilizează o nouă tehnologie pentru a furniza reclame formatate pentru dispozitive mobile și cu lățime de bandă redusă, pentru a îmbunătăți performanța acestora.",
        "Un agent de publicitate caută o modalitate de a afișa reclame pe un nou tip de dispozitiv de consum.Acesta colectează informații cu privire la modul în care utilizatorii interacționează cu acest nou tip de dispozitiv pentru a stabili dacă poate construi un nou mecanism pentru afișarea publicității pe acest tip de dispozitiv."
      ]
    },
    "11": {
      "name": "Utilizarea datelor limitate pentru a selecta conținutul",
      "shortName": "Afișarea conținutului pe baza unor date limitate",
      "description": "Conținutul prezentat în acest serviciu se poate baza pe date limitate, cum ar fi site-ul web sau aplicația pe care o utilizați, locația dvs. imprecisă, tipul dispozitivului dvs. sau conținutul cu care interacționați (sau ați interacționat) (de exemplu, pentru a limita numărul de prezentări ale unui videoclip sau ale unui articol).",
      "illustrations": [
        "O revistă de turism a publicat un articol pe site-ul său despre noile cursuri online propuse de o școală de limbi străine, pentru a îmbunătăți experiențele de călătorie în străinătate. Postările de pe blogul școlii sunt introduse direct în partea de jos a paginii și selectate pe baza locației dvs. imprecise (de exemplu, postările de pe blog care explică programa de curs pentru limbile diferite de cea din țara în care vă aflați).",
        "O aplicație de știri sportive pentru mobil a început o nouă secțiune de articole care acoperă cele mai recente meciuri de fotbal. Fiecare articol include videoclipuri găzduite de o platformă separată de streaming care prezintă punctele culminante ale fiecărui meci. Dacă derulați un videoclip, aceste informații pot fi utilizate pentru a selecta următorul videoclip mai scurt pentru redare."
      ]
    }
  },
  "specialFeatures": {
    "1": {
      "name": "Utilizarea unor date precise de geolocație",
      "description": "Cu acceptul dvs., locația dvs. precisă (pe o rază mai mică de 500 de metri) poate fi utilizată pentru a susține scopurile explicate în această notificare.",
      "illustrations": []
    },
    "2": {
      "name": "Identificarea dispozitivelor pe baza informațiilor solicitate în mod activ",
      "description": "Cu acceptul dvs., anumite caracteristici specifice dispozitivului dvs. pot fi solicitate și utilizate pentru a-l diferenția de alte dispozitive (cum ar fi fonturile sau plugin-urile instalate, rezoluția ecranului dvs.) în sprijinul scopurilor explicate în această notificare.",
      "illustrations": []
    }
  },
  "dataCategories": {
    "1": "Adrese IP",
    "2": "Caracteristicile dispozitivului",
    "3": "Identificatorii dispozitivului",
    "4": "Identificatori probabilistici",
    "5": "Identificatori derivați din autentificare",
    "6": "Date privind navigarea și interacțiunea",
    "7": "Date furnizate de utilizator",
    "8": "Date neprecise despre locație",
    "9": "Date precise despre locație",
    "10": "Profilurile utilizatorilor",
    "11": "Opțiuni de confidențialitate"
  },
  "stacks": {
    "2": "Publicitatea bazată pe date limitate și măsurători ale publicității",
    "3": "Publicitate personalizată",
    "4": "Publicitatea bazată pe date limitate, măsurători ale publicității și înțelegerea audienței",
    "5": "Publicitatea bazată pe date limitate, profil personalizat de publicitate și măsurători ale publicității",
    "6": "Selectarea publicității personalizate și măsurători ale publicității",
    "7": "Selectarea publicității personalizate, măsurători ale publicității și cercetarea audienței",
    "8": "Publicitate personalizată și măsurători ale publicității",
    "9": "Publicitate personalizată, măsurători ale publicității și cercetarea audienței",
    "10": "Publicitate personalizată",
    "11": "Conținut personalizat",
    "12": "Selectarea conținutului personalizat și măsurători de conținut",
    "13": "Selectarea conținutului personalizat, măsurători de conținut și cercetarea audienței",
    "14": "Conținut personalizat și măsurători de conținut",
    "15": "Conținut personalizat, măsurători de conținut și cercetarea audienței",
    "16": "Conținut personalizat, măsurători de conținut, cercetarea audienței și dezvoltarea serviciilor",
    "17": "Măsurători ale publicității și de conținut și cercetarea audienței",
    "18": "Măsurători ale publicității și de conținut",
    "19": "Măsurători ale publicității și cercetarea audienței",
    "20": "Măsurători ale publicității și de conținut, cercetarea audienței și dezvoltarea serviciilor",
    "21": "Măsurători de conținut, cercetarea audienței și dezvoltarea serviciilor.",
    "22": "Măsurători de conținut și dezvoltarea serviciilor",
    "23": "Selectarea publicității și conținutului personalizat, măsurători ale publicității și de conținut",
    "24": "Selectarea publicității și conținutului personalizat, măsurători ale publicității și de conținut și cercetarea audienței",
    "25": "Publicitate și conținut personalizat, măsurători ale publicității și de conținut",
    "26": "Publicitate și conținut personalizat, măsurători ale publicității și de conținut și cercetarea audienței",
    "27": "Publicitate personalizată și profil de conținut",
    "28": "Selectarea publicității și conținutului personalizat",
    "29": "Publicitate bazată pe date limitate, măsurători ale publicității și de conținut și cercetarea audienței",
    "30": "Selectarea publicității personalizate, a conținutului personalizat, a măsurătorilor de publicitate și de conținut și a cercetării audienței",
    "31": "Selectarea publicității personalizate, a conținutului personalizat, a măsurătorilor de publicitate și de conținut, a cercetării audienței și a dezvoltării serviciilor",
    "32": "Publicitate bazată pe date limitate, conținut personalizat, măsurători ale publicității și de conținut și cercetări ale audienței",
    "33": "Publicitate bazată pe date limitate, conținut personalizat, măsurători de publicitate și de conținut, cercetarea audienței și dezvoltarea serviciilor",
    "34": "Publicitatea bazată pe date limitate, conținut personalizat, măsurători de conținut și cercetarea audienței",
    "35": "Publicitate bazată pe date limitate, conținut personalizat, măsurători de conținut, cercetarea audienței și dezvoltarea serviciilor",
    "36": "Publicitate bazată pe date limitate, conținut personalizat și măsurători ale publicității",
    "37": "Publicitate bazată pe date limitate, conținut personalizat, măsurători ale publicității și dezvoltarea serviciilor",
    "38": "Publicitate personalizată, măsurători ale publicității și dezvoltarea serviciilor",
    "39": "Publicitate personalizată, măsurători ale publicității, cercetarea audienței și dezvoltarea serviciilor",
    "40": "Publicitate personalizată, măsurători ale publicității și de conținut, cercetarea audienței și dezvoltarea serviciilor",
    "41": "Publicitate personalizată, selectarea conținutului personalizat, măsurători ale publicității și de conținut, cercetarea audienței și dezvoltarea serviciilor",
    "42": "Publicitate și conținut personalizat, măsurători ale publicității și de conținut, cercetarea audienței și dezvoltarea serviciilor",
    "43": "Conținut bazat pe date limitate și măsurători de conținut",
    "44": "Conținut personalizat",
    "45": "Publicitate bazată pe date limitate, măsurători de publicitate, cercetarea audienței și dezvoltarea serviciilor",
    "1": "Date precise de geolocație și identificarea prin scanarea dispozitivului"
  },
  "stackSummaries": {
    "26": "Reclame și conținut personalizate și măsurarea performanței acestora",
    "42": "Reclame și conținut personalizate, măsurarea performanței acestora și îmbunătățirea serviciilor noastre"
  }
};
