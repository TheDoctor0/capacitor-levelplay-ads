import type { ConsentLocaleBundle } from '../../definitions';

/** Generated from the official IAB TCF translations (GVL v179) plus the plugin's UI copy. */
export const hr: ConsentLocaleBundle = {
  "ui": {
    "firstLayer.learnMore": "Saznajte više",
    "firstLayer.partners": "Popis partnera.",
    "btn.consent": "Pristajem",
    "btn.manage": "Upravljanje opcijama",
    "btn.acceptAll": "Prihvati sve",
    "btn.confirm": "Potvrdi odabir",
    "btn.back": "Natrag",
    "manage.header": "Postavke podataka",
    "manage.title": "Upravljajte svojim podacima",
    "manage.subtitle": "Možete odabrati kako se koriste vaši osobni podaci. Dobavljači traže vaše dopuštenje za sljedeće:",
    "manage.viewDetails": "Prikaži pojedinosti",
    "manage.storageTitle": "Pohrana, trajanje i pojedinosti o korištenju",
    "manage.vendorPreferences": "Postavke dobavljača",
    "vendors.title": "Potvrdite naše dobavljače",
    "vendors.subtitle": "Dobavljači mogu koristiti vaše podatke za pružanje usluga. Odbijanjem dobavljača možete ga spriječiti da koristi podatke koje ste podijelili.",
    "vendors.dataCollected": "Prikupljeni i obrađeni podaci:",
    "vendors.company": "Tvrtka:",
    "vendors.purposes": "Svrhe:",
    "vendors.privacyPolicy": "Pravila privatnosti",
    "vendors.consent": "Privola",
    "details.examples": "Primjeri",
    "details.vendors": "Dobavljači",
    "firstLayer.title": "{appName} traži vašu privolu za korištenje vaših osobnih podataka za:",
    "firstLayer.body": "Vaši osobni podaci bit će obrađeni, a informacije s vašeg uređaja (kolačići, jedinstveni identifikatori i drugi podaci o uređaju) mogu se pohranjivati, njima se može pristupati i dijeliti ih s {count} partnera ili ih može koristiti isključivo ova aplikacija.",
    "manage.consentWithCount.one": "Privola ({count} dobavljač)",
    "manage.consentWithCount.few": "Privola ({count} dobavljača)",
    "manage.consentWithCount.other": "Privola ({count} dobavljača)",
    "manage.legIntWithCount.one": "Legitimni interes ({count} dobavljač)",
    "manage.legIntWithCount.few": "Legitimni interes ({count} dobavljača)",
    "manage.legIntWithCount.other": "Legitimni interes ({count} dobavljača)",
    "manage.tcfVendors": "TCF dobavljači",
    "vendors.tcfVendors": "TCF dobavljači",
    "vendors.header": "Postavke dobavljača",
    "firstLayer.geolocation": "Mi i naši partneri možemo koristiti precizne podatke o geolokaciji.",
    "firstLayer.legInt": "Neki dobavljači mogu obrađivati vaše osobne podatke na temelju legitimnog interesa, čemu se možete usprotiviti upravljanjem opcijama u nastavku. Privolu možete u bilo kojem trenutku promijeniti ili povući u postavkama privatnosti aplikacije.",
    "manage.specialFeatures": "Posebne značajke",
    "manage.howItWorks": "Kako funkcionira ova platforma za upravljanje privolama (CMP):",
    "manage.cmpChoices": "Izbori privatnosti CMP-a",
    "manage.storageBody": "Vaši izbori u vezi sa svrhama i dobavljačima utječu na to kako vam se prikazuje personalizirano oglašavanje. U ovoj se aplikaciji vaši izbori spremaju u pohranu uređaja s prefiksom „IABTCF_” na {days} dana, nakon čega vas ponovno pitamo.",
    "vendors.otherVendors": "Ostali dobavljači",
    "vendors.retention": "Čuvanje: {days} dana.",
    "vendors.legInt": "Legitimni interes",
    "vendors.alwaysActive": "Uvijek aktivno",
    "vendors.legIntPurposes": "Svrhe (legitimni interes):",
    "vendors.specialFeatures": "Posebne značajke:",
    "vendors.location": "Mjesto obrade:",
    "vendors.category.marketing": "Marketing",
    "vendors.category.functional": "Funkcionalni",
    "vendors.category.essential": "Nužni"
  },
  "purposes": {
    "1": {
      "name": "Pohrana i/ili pristup podacima na uređaju",
      "description": "Kolačići, uređaji ili slični mrežni identifikatori (npr. identifikatori na temelju prijave, nasumično dodijeljeni identifikatori, identifikatori na mreži) zajedno s drugim informacijama (npr. vrsta preglednika i informacije o pregledniku, jezik, veličina zaslona, podržane tehnologije itd.) mogu se pohraniti ili pročitati na vašem uređaju kako bi ga prepoznao svaki put kada se poveže s aplikacijom ili s web-mjestom, za jednu ili više ovdje predstavljenih svrha.",
      "illustrations": [
        "Većinske svrhe objašnjene u ovoj obavijesti odnose se na pohranu ili pristup informacijama s vašeg uređaja kada koristite aplikaciju ili posjetite web-mjesto. Primjerice, dobavljač ili izdavač možda će trebati pohraniti kolačić na vaš uređaj tijekom vašeg prvog posjeta web-mjestu kako bi se mogao prepoznati vaš uređaj tijekom sljedećih posjeta (svaki put pristupanjem tom kolačiću)."
      ]
    },
    "2": {
      "name": "Korištenje ograničenih podataka za odabir oglašavanja",
      "description": "Oglašavanje prikazano na ovoj usluzi može se temeljiti na ograničenim podacima, kao što su web-mjesto ili aplikacija koju koristite, vaša neprecizna lokacija, vrsta uređaja ili sadržaj s kojim ste (ili ste bili) u interakciji (primjerice, kako bi se ograničio broj prikaza oglasa).",
      "illustrations": [
        "Proizvođač automobila želi promovirati svoja električna vozila ekološki osviještenim korisnicima koji žive u gradu nakon radnog vremena. Oglašavanje je prikazano na stranici s povezanim sadržajem (kao što je članak o akcijama za sprječavanje klimatskih promjena) nakon 18:30 sati korisnicima čija neprecizna lokacija upućuje na to da se nalaze u urbanoj zoni.",
        "Veliki proizvođač akvarelnih boja želi provesti internetsku reklamnu kampanju za svoju najnoviju ponudu akvarela, diverzificirajući svoju publiku kako bi dosegao što je moguće više amaterskih i profesionalnih umjetnika i izbjegavajući prikazivanje oglasa pored sadržaja koji se ne podudara (primjerice, članke o tome kako obojiti svoju kuću). Utvrđuje se i ograničava koliko puta vam je oglas prikazan kako bi se izbjeglo prečesto prikazivanje oglasa."
      ]
    },
    "3": {
      "name": "Kreiranje profila za personalizirano oglašavanje",
      "description": "Podaci o vašoj aktivnosti na ovoj usluzi (kao što su obrasci koje pošaljete, sadržaj koji gledate) mogu se pohraniti i kombinirati s drugim podacima o vama (primjerice, podacima iz vaše prethodne aktivnosti na ovoj usluzi i drugim web-mjestima ili aplikacijama) ili sličnim korisnicima. Oni se zatim koriste za izgradnju ili poboljšanje profila o vama (što može uključivati moguće interese i osobne aspekte). Ovaj subjekt i drugi subjekti mogu vaš profil koristiti (također kasnije) za prikazivanje oglašavanja koje se čini relevantnijim na temelju vaših mogućih interesa.",
      "illustrations": [
        "Ako pročitate nekoliko članaka o najboljoj dodatnoj opremi za bicikle koju možete kupiti, te informacije mogu se koristiti za izradu profila o vašem interesu za dodatnu opremu za bicikle. Takav profil može se kasnije koristiti ili poboljšati na istom ili drugom web-mjestu ili aplikaciji kako bi vam se prikazalo oglašavanje za određeni brend dodatne opreme za bicikle. Ako pogledate i konfigurator vozila na web-mjestu proizvođača luksuznih automobila, te informacije mogu se kombinirati s vašim interesom za bicikle kako bi se poboljšao vaš profil i pretpostavilo da ste zainteresirani za luksuznu biciklističku opremu.",
        "Tvrtka za proizvodnju odjeće želi promovirati svoju novu liniju vrhunske odjeće za bebe. Ona stupa u kontakt s agencijom koja ima mrežu klijenata s kupcima visokih prihoda (kao što su luksuzni supermarketi) i traži od agencije da izradi profile mladih roditelja ili parova za koje se može pretpostaviti da su bogati i da imaju prinovu, kako bi se oni kasnije mogli koristiti za prikazivanje oglašavanja unutar partnerskih aplikacija na temelju tih profila."
      ]
    },
    "4": {
      "name": "Korištenje profila za odabir personaliziranog oglašavanja",
      "description": "Oglašavanje koje vam je prikazano na ovoj usluzi može se temeljiti na vašim profilima oglašavanja koji mogu odražavati vašu aktivnost na ovoj usluzi ili drugim web-mjestima ili aplikacijama (poput obrazaca koje pošaljete, sadržaja koji pogledate), moguće interese i osobne aspekte.",
      "illustrations": [
        "Trgovac na mreži želi oglašavati ograničenu prodaju tenisica za trčanje. Želi ciljati oglašavanje korisnicima koji su prethodno gledali tenisice za trčanje na njegovoj mobilnoj aplikaciji. Tehnologije praćenja mogu se koristiti kako bi se prepoznalo da ste prethodno koristili mobilnu aplikaciju za gledanje tenisica za trčanje kako bismo vam predstavili odgovarajući oglas u aplikaciji.",
        "Profil izrađen za personalizirano oglašavanje u odnosu na osobu koja je pretražila dodatnu opremu za bicikle na web-mjestu može se upotrijebiti za prikaz relevantnog oglasa za dodatnu opremu za bicikle u mobilnoj aplikaciji druge organizacije."
      ]
    },
    "5": {
      "name": "Kreiranje profila za personaliziranje sadržaja",
      "description": "Podaci o vašoj aktivnosti na ovoj usluzi (kao što su obrasci koje pošaljete, nereklamni sadržaj koji gledate) mogu se pohraniti i kombinirati s drugim podacima o vama (primjerice, vaša prethodna aktivnost na ovoj usluzi ili drugim web-mjestima ili aplikacijama) ili sličnim korisnicima. Oni se zatim koriste za izgradnju ili poboljšanje profila o vama (što može, primjerice, uključivati moguće interese i osobne aspekte). Vaš profil može se koristiti (također kasnije) za prikazivanje sadržaja koji se čini relevantnijim na temelju vaših mogućih interesa, kao što je prilagođavanje redoslijeda u kojem vam se sadržaj prikazuje, tako da je još lakše pronaći sadržaj koji odgovara vašim interesima.",
      "illustrations": [
        "Pročitali ste nekoliko članaka o tome kako izgraditi kućicu na drvetu na platformi društvenih medija. Te informacije mogu se dodati profilu kako bi se označio vaš interes za sadržaj koji se odnosi na boravak na otvorenom, kao i vodiče „uradi sam” (s ciljem omogućavanja personalizacije sadržaja, tako da vam se, na primjer, u budućnosti prikazuje više objava na blogovima i članaka o kućicama na drvetu i drvenim kolibama).",
        "Pregledali ste tri videozapisa o istraživanju svemira u različitim TV aplikacijama. Nepovezana platforma za vijesti s kojom niste imali kontakt gradi profil na temelju pregledavanja tog sadržaja, označavajući istraživanje svemira kao temu od mogućeg interesa za druge videozapise."
      ]
    },
    "6": {
      "name": "Korištenje profila za odabir personaliziranog sadržaja",
      "description": "Sadržaj koji vam je predstavljen na ovoj usluzi može se temeljiti na vašim profilima za personalizaciju sadržaja, koji mogu odražavati vašu aktivnost na ovoj ili drugim uslugama (primjerice, obrasci koje pošaljete, sadržaj koji gledate), moguće interese i osobne aspekte. Primjerice, ovo se može koristiti za prilagođavanje redoslijeda prema kojem vam se sadržaj prikazuje, tako da vam je još lakše pronaći (ne-reklamni) sadržaj koji odgovara vašim interesima.",
      "illustrations": [
        "Čitate članke o vegetarijanskoj prehrani na platformi društvenih medija, a zatim koristite aplikaciju za kuhanje nepovezane tvrtke. Profil izrađen o vama na platformi društvenih medija koristit će se za prikazivanje vegetarijanskih recepata na zaslonu dobrodošlice aplikacije za kuhanje.",
        "Pregledali ste tri videozapisa o veslanju na različitim web-mjestima. Nevezana platforma za dijeljenje videozapisa preporučit će još pet videozapisa o veslanju koji bi vas mogli zanimati kada koristite svoju TV aplikaciju, na temelju profila izgrađenog o vama kada ste posjetili ta različita web-mjesta kako biste gledali videozapise na mreži."
      ]
    },
    "7": {
      "name": "Mjerenje performansi oglašavanja",
      "description": "Informacije o tome koje vam se oglašavanje prikazuje i kako komunicirate s njime mogu se koristiti za određivanje toga koliko je vama ili drugim korisnicima oglas bio koristan i jesu li postignuti ciljevi oglašavanja. Na primjer, jeste li vidjeli oglas, jeste li kliknuli na njega, jeste li na temelju njega kupili proizvod ili posjetili web-mjesto itd. To je vrlo korisno za razumijevanje relevantnosti reklamnih kampanja.",
      "illustrations": [
        "Kliknuli ste na oglas o popustu za „crni petak” mrežne trgovine na web-mjestu izdavača i kupili proizvod. Vaš će klik biti povezan s ovom kupnjom. Izmjerit će se vaša interakcija i interakcija s drugim korisnicima kako bi se znalo koliko je klikova na oglas dovelo do kupnje.",
        "Vi ste jedna od rijetkih osoba koje su kliknule na oglas o popustu za „međunarodni dan zahvalnosti” mrežne suvenirnice unutar aplikacije izdavača. Izdavač želi imati izvješća kako bi razumio koliko ste često određeni oglas unutar aplikacije, a posebno oglas za „međunarodni dan zahvalnosti”, pregledavali ili kliknuli vi i drugi korisnici kako bi izdavač i njegovi partneri (kao što su agencije) lakše optimizirali prikazivanje oglasa."
      ]
    },
    "8": {
      "name": "Mjerenje performansi sadržaja",
      "description": "Informacije o tome koji vam je sadržaj prikazan i vašem angažmanu s njime mogu se koristiti za utvrđivanje je li (nereklamni) sadržaj, primjerice, dostigao ciljanu publiku i bio usklađen s vašim interesima. Na primjer, jeste li pročitali članak, pogledali videozapis, poslušali podcast ili pogledali opis proizvoda, koliko ste vremena proveli na ovoj usluzi i web-mjestima koje posjećujete itd. To je vrlo korisno za razumijevanje relevantnosti (nereklamnog) sadržaja koji vam je prikazan.",
      "illustrations": [
        "Pročitali ste objavu na blogu o planinarenju putem mobilne aplikacije izdavača i slijedili poveznicu na preporučenu i povezanu objavu. Vaše će se interakcije zabilježiti tako da prikazuju da vam je početna objava o planinarenju bila korisna i da vas je uspješno zainteresirala za povezanu objavu. To će se mjeriti kako bi se znalo hoće li se kreirati više objava o planinarenju u budućnosti i gdje ih treba postaviti na početni zaslon mobilne aplikacije.",
        "Prikazan vam je videozapis o modnim trendovima, ali vi i nekoliko drugih korisnika prestali ste gledati nakon 30 sekundi. Te se informacije zatim koriste za procjenu odgovarajuće duljine budućih videozapisa o modnim trendovima."
      ]
    },
    "9": {
      "name": "Razumijevanje publike kroz statistiku ili kombinacije podataka iz različitih izvora",
      "description": "Izvješća se mogu generirati na temelju kombinacije skupova podataka (poput korisničkih profila, statistike, istraživanja tržišta, analitičkih podataka) u vezi s vašim interakcijama i interakcijama drugih korisnika s oglašavanjem ili (nereklamnim) sadržajem kako bi se utvrdile uobičajene karakteristike (primjerice, kako bi se utvrdilo koja ciljana publika više prihvaća oglasnu kampanju ili određeni sadržaj).",
      "illustrations": [
        "Vlasnik mrežne knjižare želi komercijalno izvještavanje koje prikazuje udio posjetitelja koji su pregledali i napustili njegovu stranicu bez kupnje, ili su pregledali i kupili najnoviju autobiografiju slavne osobe tog mjeseca, kao i prosječnu dob i distribuciju žena/muškaraca u svakoj kategoriji. Podaci koji se odnose na vašu navigaciju na njegovom web-mjestu i na vaše osobne karakteristike zatim se koriste i kombiniraju s drugim takvim podacima za izradu ove statistike.",
        "Oglašivač želi bolje razumjeti vrstu publike koja komunicira s njegovim oglasima. Poziva istraživački institut da usporedi karakteristike korisnika koji su bili u interakciji s oglasom s tipičnim atributima korisnika sličnih platformi na različitim uređajima. Ova usporedba otkriva oglašivaču da njegova oglasna publika uglavnom pristupa oglasima putem mobilnih uređaja i vjerojatno je u rasponu dobi od 45 do 60 godina."
      ]
    },
    "10": {
      "name": "Razvoj i poboljšanje usluga",
      "description": "Informacije o vašoj aktivnosti na ovoj usluzi, kao što su vaša interakcija s oglasima ili sadržajem, mogu biti vrlo korisne za poboljšanje proizvoda i usluga te za izgradnju novih proizvoda i usluga na temelju interakcija korisnika, vrste publike itd. Ova specifična svrha ne uključuje razvoj ili poboljšanje korisničkih profila i identifikatora.",
      "illustrations": [
        "Tehnološka platforma koja surađuje s pružateljem usluga društvenih medija primjećuje rast korisnika mobilnih aplikacija i uočava na temelju njihovih profila da se mnogi od njih povezuju putem mobilnih veza. Koristi novu tehnologiju za prikaz oglasa koji su formatirani za mobilne uređaje i koji imaju nisku propusnost kako bi se poboljšale njihove performanse.",
        "Oglašivač traži način prikazivanja oglasa na novoj vrsti uređaja za korisnike. Prikuplja informacije o načinu na koji korisnici komuniciraju s ovom novom vrstom uređaja kako bi utvrdio može li izgraditi novi mehanizam za prikazivanje oglašavanja na ovoj vrsti uređaja."
      ]
    },
    "11": {
      "name": "Korištenje ograničenih podataka za odabir sadržaja",
      "description": "Sadržaj prikazan na ovoj usluzi može se temeljiti na ograničenim podacima, kao što su web-mjesto ili aplikacija koju koristite, vaša neprecizna lokacija, vrsta uređaja ili sadržaj s kojim ste (ili ste bili) u interakciji (primjerice, kako bi se ograničio broj prikaza videozapisa ili članka).",
      "illustrations": [
        "Putnički časopis objavio je članak na svojem web-mjestu o novim mrežnim tečajevima koje je predložila jezična škola kako bi se poboljšala iskustva putovanja u inozemstvu. Objave na blogu škole umeću se izravno na dnu stranice, a odabiru se na temelju vaše neprecizne lokacije (primjerice, objave na blogu koje objašnjavaju program tečaja jezika koji se razlikuju od jezika zemlje u kojoj se nalazite).",
        "Mobilna aplikacija za sportske vijesti započela je s objavom nove vrste članaka koji pokrivaju najnovije nogometne utakmice. Svaki članak uključuje videozapise koje pruža zasebna platforma za prijenos koja prikazuju ključne trenutke svake utakmice. Ako premotavate videozapis unaprijed, te se informacije mogu koristiti za odabir kraćeg videozapisa za sljedeću reprodukciju."
      ]
    }
  },
  "specialFeatures": {
    "1": {
      "name": "Korištenje preciznih geolokacijskih podataka",
      "description": "Uz vaš pristanak, vaša precizna lokacija (u radijusu manjem od 500 metara) može se koristiti kao podrška svrhama objašnjenima u ovoj obavijesti.",
      "illustrations": []
    },
    "2": {
      "name": "Identificiranje uređaja na temelju aktivno zatraženih informacija",
      "description": "Uz vaše pristanak, određene karakteristike specifične za vaš uređaj mogu se zatražiti i koristiti za razlikovanje od drugih uređaja (kao što su instalirani fontovi ili dodaci, rezolucija vašeg zaslona) kao podrška svrhama objašnjenima u ovoj obavijesti.",
      "illustrations": []
    }
  },
  "dataCategories": {
    "1": "IP adrese",
    "2": "Karakteristike uređaja",
    "3": "Identifikatori uređaja",
    "4": "Vjerojatnosni identifikatori",
    "5": "Identifikatori dobiveni autentifikacijom",
    "6": "Podaci o pregledavanju i interakciji",
    "7": "Podaci koje je dostavio korisnik",
    "8": "Podaci o približnoj lokaciji",
    "9": "Precizni podaci o lokaciji",
    "10": "Profili korisnika",
    "11": "Izbori u pogledu privatnosti"
  },
  "stacks": {
    "1": "Precizni geolokacijski podaci i identifikacija putem skeniranja uređaja",
    "2": "Oglašavanje na temelju ograničenih podataka i mjerenje oglašavanja",
    "3": "Personalizirano oglašavanje",
    "4": "Oglašavanje na temelju ograničenih podataka, mjerenje oglašavanja i istraživanja publike",
    "5": "Oglašavanje na temelju ograničenih podataka, profil za personalizirano oglašavanje i mjerenje oglašavanja",
    "6": "Odabir personaliziranog oglašavanja i mjerenje oglašavanja",
    "7": "Odabir personaliziranog oglašavanja, mjerenje oglašavanja i uvidi u publiku",
    "8": "Personalizirano oglašavanje i mjerenje oglašavanja",
    "9": "Personalizirano oglašavanje, mjerenje oglašavanja i uvidi u publiku",
    "10": "Personalizirano oglašavanje",
    "11": "Personalizirani sadržaj",
    "12": "Odabir personaliziranog sadržaja i mjerenje sadržaja",
    "13": "Odabir personaliziranog sadržaja, mjerenje sadržaja i uvidi u publiku",
    "14": "Personalizirani sadržaj i mjerenje sadržaja",
    "15": "Personalizirani sadržaj, mjerenje sadržaja i uvidi u publiku",
    "16": "Personalizirani sadržaj, mjerenje sadržaja, uvidi u publiku i razvoj usluga",
    "17": "Mjerenje oglašavanja i sadržaja te uvidi u publiku",
    "18": "Mjerenje oglašavanja i sadržaja",
    "19": "Mjerenje oglašavanja i uvidi u publiku",
    "20": "Mjerenje oglašavanja i sadržaja, uvidi u publiku i razvoj usluga",
    "21": "Mjerenje sadržaja, uvidi u publiku i razvoj usluga.",
    "22": "Mjerenje sadržaja i razvoj proizvoda",
    "23": "Odabir personaliziranog oglašavanja i sadržaja, mjerenje oglašavanja i sadržaja",
    "24": "Odabir personaliziranog oglašavanja i sadržaja, mjerenje oglašavanja i sadržaja te uvidi u publiku",
    "25": "Personalizirano oglašavanje i sadržaj, mjerenje oglašavanja i sadržaja",
    "26": "Odabir personaliziranog oglašavanja i sadržaja, mjerenje oglašavanja i sadržaja te uvidi u publiku",
    "27": "Profil za personalizirano oglašavanje i sadržaj",
    "28": "Odabir personaliziranog oglašavanja i sadržaja",
    "29": "Oglašavanje na temelju ograničenih podataka, mjerenje oglašavanja i sadržaja te uvidi u publiku",
    "30": "Odabir personaliziranog oglašavanja, personalizirani sadržaj, mjerenje oglašavanja i sadržaja te uvidi u publiku",
    "31": "Odabir personaliziranog oglašavanja, personalizirani sadržaj, mjerenje oglašavanja i sadržaja, uvidi u publiku i razvoj usluga",
    "32": "Oglašavanje na temelju ograničenih podataka, personalizirani sadržaj, mjerenje oglašavanja i sadržaja te uvidi u publiku",
    "33": "Oglašavanje na temelju ograničenih podataka, personalizirani sadržaj, mjerenje oglašavanja i sadržaja, uvidi u publiku i razvoj usluga",
    "34": "Oglašavanje na temelju ograničenih podataka, personalizirani sadržaj, mjerenje sadržaja i uvidi u publiku",
    "35": "Oglašavanje na temelju ograničenih podataka, personalizirani sadržaj, mjerenje sadržaja, uvidi u publiku i razvoj usluga",
    "36": "Oglašavanje na temelju ograničenih podataka, personalizirani sadržaj i mjerenje oglašavanja",
    "37": "Oglašavanje na temelju ograničenih podataka, personalizirani sadržaj, mjerenje oglašavanja i razvoj usluga",
    "38": "Personalizirano oglašavanje, mjerenje oglašavanja i razvoj usluga",
    "39": "Personalizirano oglašavanje, mjerenje oglašavanja, uvidi u publiku i razvoj usluga",
    "40": "Personalizirano oglašavanje, mjerenje oglašavanja i sadržaja, uvidi u publiku i razvoj usluga",
    "41": "Personalizirano oglašavanje, odabir personaliziranog oglašavanja, mjerenje oglašavanja i sadržaja, uvidi u publiku i razvoj usluga",
    "42": "Personalizirano oglašavanje i sadržaj, mjerenje oglašavanja i sadržaja, uvidi u publiku i razvoj usluga",
    "43": "Sadržaj na temelju ograničenih podataka i mjerenje sadržaja",
    "44": "Personalizirani sadržaj",
    "45": "Oglašavanje na temelju ograničenih podataka, mjerenje oglašavanja, istraživanje publike i razvoj usluga"
  }
};
