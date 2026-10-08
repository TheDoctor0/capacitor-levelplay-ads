import type { ConsentLocaleBundle } from '../../definitions';

/** Generated from the official IAB TCF translations (GVL v179) plus the plugin's UI copy. */
export const pl: ConsentLocaleBundle = {
  "ui": {
    "firstLayer.learnMore": "Dowiedz się więcej",
    "firstLayer.partners": "Lista partnerów.",
    "btn.consent": "Zgadzam się",
    "btn.manage": "Zarządzaj opcjami",
    "btn.acceptAll": "Zaakceptuj wszystko",
    "btn.confirm": "Potwierdź wybór",
    "btn.back": "Wstecz",
    "manage.header": "Preferencje dotyczące danych",
    "manage.title": "Zarządzaj swoimi danymi",
    "manage.subtitle": "Możesz zdecydować, jak będą wykorzystywane Twoje dane osobowe. Dostawcy proszą o Twoją zgodę na:",
    "manage.viewDetails": "Zobacz szczegóły",
    "manage.storageTitle": "Przechowywanie, czas trwania i szczegóły użycia",
    "manage.vendorPreferences": "Preferencje dotyczące dostawców",
    "vendors.title": "Potwierdź naszych dostawców",
    "vendors.subtitle": "Dostawcy mogą wykorzystywać Twoje dane do świadczenia usług. Odrzucenie dostawcy może uniemożliwić mu korzystanie z udostępnionych danych.",
    "vendors.dataCollected": "Zbierane i przetwarzane dane:",
    "vendors.company": "Firma:",
    "vendors.purposes": "Cele:",
    "vendors.privacyPolicy": "Polityka prywatności",
    "vendors.consent": "Zgoda",
    "details.examples": "Przykłady",
    "details.vendors": "Dostawcy",
    "firstLayer.title": "{appName} prosi o Twoją zgodę na wykorzystanie Twoich danych osobowych w celu:",
    "firstLayer.body": "Twoje dane osobowe będą przetwarzane, a informacje z Twojego urządzenia (pliki cookie, unikalne identyfikatory i inne dane urządzenia) mogą być przechowywane, odczytywane i udostępniane {count} partnerom lub wykorzystywane wyłącznie przez tę aplikację.",
    "manage.consentWithCount.one": "Zgoda ({count} dostawca)",
    "manage.consentWithCount.few": "Zgoda ({count} dostawcy)",
    "manage.consentWithCount.many": "Zgoda ({count} dostawców)",
    "manage.consentWithCount.other": "Zgoda ({count} dostawców)",
    "manage.legIntWithCount.one": "Prawnie uzasadniony interes ({count} dostawca)",
    "manage.legIntWithCount.few": "Prawnie uzasadniony interes ({count} dostawcy)",
    "manage.legIntWithCount.many": "Prawnie uzasadniony interes ({count} dostawców)",
    "manage.legIntWithCount.other": "Prawnie uzasadniony interes ({count} dostawców)",
    "manage.tcfVendors": "Dostawcy TCF",
    "vendors.tcfVendors": "Dostawcy TCF",
    "vendors.header": "Preferencje dotyczące dostawców",
    "firstLayer.geolocation": "My i nasi partnerzy możemy wykorzystywać dokładne dane geolokalizacyjne.",
    "firstLayer.legInt": "Niektórzy dostawcy mogą przetwarzać Twoje dane osobowe na podstawie prawnie uzasadnionego interesu, wobec którego możesz wnieść sprzeciw, zarządzając opcjami poniżej. Zgodę możesz w każdej chwili zmienić lub wycofać w ustawieniach prywatności aplikacji.",
    "manage.specialFeatures": "Funkcje specjalne",
    "manage.howItWorks": "Jak działa ta platforma zarządzania zgodami (CMP):",
    "manage.cmpChoices": "Wybory prywatności CMP",
    "manage.storageBody": "Twoje wybory dotyczące celów i dostawców wpływają na sposób wyświetlania spersonalizowanych reklam. W tej aplikacji Twoje wybory są zapisywane w pamięci urządzenia z prefiksem „IABTCF_” przez {days} dni, a potem zapytamy ponownie.",
    "vendors.otherVendors": "Inni dostawcy",
    "vendors.retention": "Okres przechowywania: {days} dni.",
    "vendors.legInt": "Prawnie uzasadniony interes",
    "vendors.alwaysActive": "Zawsze aktywne",
    "vendors.legIntPurposes": "Cele (prawnie uzasadniony interes):",
    "vendors.specialFeatures": "Funkcje specjalne:",
    "vendors.location": "Miejsce przetwarzania:",
    "vendors.category.marketing": "Marketing",
    "vendors.category.functional": "Funkcjonalne",
    "vendors.category.essential": "Niezbędne"
  },
  "purposes": {
    "1": {
      "name": "Przechowywanie informacji na urządzeniu lub dostęp do nich",
      "shortName": "Przechowywanie informacji na urządzeniu lub dostęp do nich",
      "description": "Pliki cookie, identyfikatory urządzeń lub podobne identyfikatory online (np. identyfikatory oparte na logowaniu, identyfikatory przypisywane losowo, identyfikatory sieciowe) w połączeniu z innymi informacjami (takimi jak rodzaj przeglądarki i informacje w niej zawarte, język, rozmiar ekranu, obsługiwane technologie itp.) mogą być przechowywane lub odczytywane na Twoim urządzeniu celem rozpoznania urządzenia za każdym razem, gdy następuje połączenie z aplikacją lub witryną internetową – w celach tutaj przedstawionych.",
      "illustrations": [
        "Większość celów, o których mowa w niniejszym powiadomieniu, wiąże się z przechowywaniem lub uzyskiwaniem dostępu do informacji z Twojego urządzenia użytkownika, gdy korzystasz z aplikacji lub odwiedzasz witrynę internetową. Na przykład dostawca lub wydawca mogą umieścić pliki cookie na Twoim urządzeniu, gdy po raz pierwszy odwiedzasz witrynę internetową. Chodzi o możliwość rozpoznania urządzenia podczas kolejnych wizyt (w ramach każdorazowego dostępu do określonych plików cookie)."
      ]
    },
    "2": {
      "name": "Wykorzystywanie ograniczonych danych do wyboru reklam",
      "shortName": "Wyświetlanie reklam na podstawie ograniczonych danych",
      "description": "Reklamy prezentowane Tobie w serwisie mogą opierać się na ograniczonych danych takich jak witryna internetowa lub aplikacja, z których korzystasz, Twoja nieprecyzyjna lokalizacja, rodzaj urządzenia albo treści przeglądane przez Ciebie (na przykład w celu ograniczenia liczby wyświetleń danej reklamy).",
      "illustrations": [
        "Producent samochodów chce promować swoje pojazdy elektryczne wśród świadomych ekologicznie użytkowników żyjących w mieście, po godzinach pracy. Reklama wyświetla się na stronie z powiązaną treścią (np. w związku z artykułem na temat działań dotyczacych zmian klimatycznych) po godzinie 18:30. Jest widoczna dla użytkowników, których nieprecyzyjna lokalizacja wskazuje na to, że znajdują się w strefie miejskiej.",
        "Duży producent akwareli chce przeprowadzić kampanię reklamową online dotyczącą najnowszej gamy oferowanego asortymentu. Zależy mu na dywersyfikacji odbiorców i chce dotrzeć do jak największej liczby amatorów malarstwa i profesjonalnych artystów. Wolałby, aby reklama nie pojawiała się obok niedopasowanych treści, na przykład przy artykule dotyczacym tego, jak pomalowac dom. Wykrywana jest liczba wyświetleń reklamy. Podlega ona ograniczeniom, tak aby użytkownik nie oglądał jej zbyt często."
      ]
    },
    "3": {
      "name": "Tworzenie profili w celu spersonalizowanych reklam",
      "shortName": "Tworzenie profilu do spersonalizowanych reklam",
      "description": "Informacje na temat Twojej aktywności w serwisie (np. przesyłane formularze, przeglądane treści) mogą być przechowywane i łączone z innymi informacjami dotyczącymi Ciebie (na przykład informacjami o Twojej poprzedniej aktywności w serwisie, innych witrynach internetowych lub aplikacjach) lub podobnych osób. Informacje te wykorzystuje się następnie do tworzenia lub ulepszania profilu odnoszącego się do Ciebie (który to profil może na przykład obejmować Twoje zainteresowania i cechy osobiste). Twój profil może być wykorzystywany (również później) do pokazywania reklam, które wydają się bardziej odpowiednie, biorąc pod uwagę Twoje możliwe zainteresowania.",
      "illustrations": [
        "Jeśli przeczytałeś kilka artykułów o najlepszych akcesoriach rowerowych do kupienia, to informacja ta może zostać wykorzystana do stworzenia profilu o Tobie odnośnie do faktu, iż interesują Cię akcesoria rowerowe. Takiego profilu można użyć lub poprawić go później, w tej samej lub w innej witrynie bądź w aplikacji. Wszystko po to, żeby pokazać Ci reklamę konkretnej marki akcesoriów rowerowych. Jeśli spojrzysz również na konfigurator wyposażenia pojazdu  w witrynie producenta samochodów luksusowych, informacja ta może zostać powiązania z tym, że interesujesz się rowerami. Rzecz w tym, aby udoskonalić Twój profil  w oparciu o założenie, że interesujesz się luksusowym sprzętem rowerowy.",
        "Firma odzieżowa chce wypromować nową linię ubrań dziecięcych najwyższej klasy. Nawiązuje kontakt z agencją, która obsługuje sieć sklepów odwiedzanych przez zamożnych klientów (np. eleganckich supermarketów). Firma odzieżowa prosi agencję o utworzenie profili młodych rodziców lub par, które prawdopodobnie są zamożne i mają od niedawna dzieci. Profile te mają być później wykorzystane do wyświetlania odpowiednich reklam w aplikacjach partnerów przeznaczonych dla młodych par."
      ]
    },
    "4": {
      "name": "Wykorzystanie profili do wyboru spersonalizowanych reklam",
      "shortName": "Wyświetlanie spersonalizowanych reklam",
      "description": "Reklamy, ktore są Ci prezentowane w tym serwisie mogą być oparta na Twoich profilach reklamowych, które mogą odzwierciedlać Twoją aktywność w serwisie, innych witrynach internetowych lub aplikacjach (np. przesyłane formularze, przeglądane treści), możliwe zainteresowania i cechy osobiste.",
      "illustrations": [
        "Sklep internetowy chce reklamować ograniczoną czasowo wyprzedaż butów do biegania. Sklep pragnie kierować reklamy do użytkowników, którzy wcześniej oglądali buty do biegania w aplikacji mobilnej. Technologie śledzące mogą być wykorzystywane do rozpoznawania, czy użytkownik wcześniej korzystał z aplikacji mobilnej do przeglądania butów do biegania. Chodzi o pokazanie odpowiednich reklam w aplikacji./ po to aby wyswietlic tobie odpowiednie technologie",
        "Profil utworzony z myślą o spersonalizowanej reklamie w odniesieniu do osoby, która szuka akcesoriów rowerowych w witrynie internetowej, może zostać wykorzystany do wyświetlania odpowiedniej reklamy takich akcesoriów w aplikacji mobilnej innej organizacji."
      ]
    },
    "5": {
      "name": "Tworzenie profili w celu personalizacji treści",
      "shortName": "Tworzenie profilu do spersonalizowanych treści",
      "description": "Informacje na temat Twojej aktywności w serwisie (np. przesyłane formularze, przeglądane treści niezwiązane z reklamami) mogą być przechowywane i łączone z innymi informacjami dotyczącymi Ciebie (na przykład informacjami o Twojej poprzedniej aktywności w usłudze, innych witrynach internetowych lub aplikacjach) lub podobnych osób. Informacje te wykorzystuje się następnie do tworzenia lub ulepszania Twojego profilu (który to profil może obejmować możliwe zainteresowania i cechy osobiste). Twój profil może być wykorzystywany (również później) do prezentowania treści, które wydają się bardziej odpowiednie w oparciu o Twoje ewentualne zainteresowania, na przykład poprzez dostosowanie kolejności wyświetlania treści, aby jeszcze łatwiej było Ci znaleźć treści odpowiadające Twoim zainteresowaniom.",
      "illustrations": [
        "Przeczytałeś kilka artykułów na platformie mediów społecznościowych o tym, jak zbudować domek na drzewie. Informacje te mogą zostać dodane do Twojego profilu, aby oznaczyć Twoje zainteresowanie treściami związanymi z aktywnością na świeżym powietrzu oraz przewodnikami dla samouków (chodzi o umożliwienie personalizacji treści, tak aby na przykład w przyszłości wyświetlało Ci się więcej postów na blogach i artykułów na temat domków na drzewach czy drewnianych chatek w lesie).",
        "Obejrzałeś trzy filmy na temat eksploracji przestrzeni kosmicznej w różnych aplikacjach telewizyjnych. Niezależna platforma informacyjna, z którą nie miałeś jeszcze do czynienia, tworzy profil oparty na dotychczasowych treściach przeglądanych przez Ciebie. Oznacza zatem eksplorację przestrzeni kosmicznej jako temat, który może Ci się wydać nteresujący w innych materiałach wideo."
      ]
    },
    "6": {
      "name": "Wykorzystywanie profili w celu doboru spersonalizowanych treści",
      "shortName": "Wyświetlanie spersonalizowanych treści",
      "description": "Treści prezentowane w serwisie mogą być oparte na Twoich profilach spersonalizowanej treści, które mogą odzwierciedlać Twoją aktywność w tym lub innym serwisie (bierze się pod uwagę przesyłane formularze, przeglądane treści itd.), możliwe zainteresowania i aspekty osobiste. Informacje te mogą zostać wykorzystane na przykład do dostosowania kolejności wyświetlania treści, aby jeszcze bardziej ułatwić Ci przeglądanie właściwych (niereklamowych) treści odpowiadających Twoim zainteresowaniom.",
      "illustrations": [
        "Czytasz artykuły na temat wegetarianizmu na pewnej platformie mediów społecznościowych. Następnie zaczynasz korzystać z aplikacji kulinarnej niezależnej firmy. Profil utworzony na Twój temat na platformie mediów społecznościowych będzie wykorzystywany do prezentowania Ci przepisów wegetariańskich na ekranie powitalnym aplikacji kulinarnej.",
        "Obejrzałeś trzy filmy o wioślarstwie w różnych witrynach internetowych. Niezależna platforma udostępniająca materiały wideo zarekomenduje Ci  pięć innych filmów na temat wioślarstwa, które mogą Cię zainteresować podczas korzystania z aplikacji telewizyjnej – w oparciu o profil utworzony na Twój temat po odwiedzeniu przez Ciebie wspomnianych wcześniej witryn internetowych w celu obejrzenia filmów online."
      ]
    },
    "7": {
      "name": "Pomiar efektywności reklam",
      "shortName": "Pomiar skuteczności reklam",
      "description": "Informacje dotyczące tego, które reklamy są Ci pokazywane, jak również tego, jak na nie reagujesz, mogą pomóc określić, na ile dobrze zadziałała dana reklama na Ciebie lub inne osoby i czy cele reklamy zostały osiągnięte. Na przykład czy w ogóle widziałeś reklamę, czy ją na nią kliknąłeś, czy skłoniła to Ciebie do zakupu produktu lub odwiedzenia witryny internetowej itp. Jest to bardzo pomocne w zrozumieniu  znaczenia kampanii reklamowych.",
      "illustrations": [
        "Kliknąłeś reklamę dotyczącą rabatów Black Friday oferowanych przez sklep internetowy na witrynie internetowej wydawcy i dokonałeś zakupu produktu. Twoje kliknięcie zostanie powiązane z tym zakupem. Dokonany zostanie pomiar Twojej interakcji celem sprawdzenia, ile kliknięć reklamy doprowadziło do zakupu.",
        "Jesteś jedną z niewielu osób, które kliknęły reklamę dotyczącą zniżki z okazji „międzynarodowego dnia uznania”, oferowanej przez sklep internetowy z prezentami w aplikacji wydawcy. Wydawca chce uzyskać odpowiednie raporty, aby dowiedzieć się, jak często Ty lub inni użytkownicy oglądali konkretne reklamy w aplikacji, a w szczególności tę dotyczącą „międzynarodowego dnia uznania”. Rzecz w tym, aby pomóc wydawcy i jego partnerom (np. agencjom) w optymalizacji lokowania reklam."
      ]
    },
    "8": {
      "name": "Pomiar efektywności treści",
      "shortName": "Pomiar skuteczności treści",
      "description": "Informacje dotyczące prezentowanych Ci treści oraz Twoje reakcje na nie mogą zostać wykorzystane do określenia, czy (niereklamowe) treści dotarły – na przykład – do zamierzonych odbiorców i czy odpowiadały Twoim zainteresowaniom. Pozwalają się dowiedzieć, czy przeczytałeś artykuł, obejrzałeś film, słuchałeś podcastu lub sprawdziłeś opis produktu, ile czasu spędziłeś, korzystając z serwisu, jakie witryny internetowe odwiedziłeś itp. Pomaga to poznać znaczenie (niereklamowych) pokazywanych Tobie treści.",
      "illustrations": [
        "Przeczytałeś wpis na blogu o pieszej turystyce w aplikacji mobilnej wydawcy, po czym skorzystałeś z linku do polecanego i powiązanego postu. Twoja reakcja zostanie zarejestrowana, gdyż pozwala sądzić, że początkowy post dotyczący pieszych wędrówek był przydatny i udało się zainteresować Cię powiązanym postem. Odpowiednie wskaźniki zostaną zmierzone, aby dowiedzieć się, czy w przyszłości tworzyć więcej postów na temat pieszych wędrówek i gdzie je umieszczać na ekranie głównym aplikacji mobilnej.",
        "Został Ci zaprezentowany materiał wideo o trendach modowych, ale przestałeś go oglądać po 30 sekundach. Ta informacja pozwala określić prawidłową długości przyszłych filmów o trendach modowych."
      ]
    },
    "9": {
      "name": "Rozumienie odbiorców dzięki statystyce lub kombinacji danych z różnych źródeł",
      "shortName": "Poznawanie naszych odbiorców dzięki statystykom",
      "description": "Można generować raporty na podstawie kombinacji zestawów danych (takich jak profile użytkowników, statystyki, badania rynku, dane analityczne) dotyczących reakcji użytkowników na treści reklamowe lub niereklamowe. Chodzi o identyfikację wspólnych cech (na przykład określenie, którzy odbiorcy docelowi są bardziej otwarci na kampanię reklamową lub treści danego typu).",
      "illustrations": [
        "Właściciel księgarni internetowej chce, aby raporty handlowe pokazywały odsetek odwiedzających, którzy odwiedzili witrynę i opuścili ją, nic nie kupiwszy, osób, które odwiedziły witrynę i kupiły ostatnią autobiografię celebryty miesiąca, jak również średni wiek i rozkład dystrybucji poszczególnych kategorii wśród kobiet i mężczyzn. Dane związane z nawigacją przez Ciebie po witrynie i Twoimi cechami osobistymi są następnie wykorzystywane i łączone z innymi odpowiednimi informacjami w celu wygenerowania wspomnianych statystyk.",
        "Reklamodawca chce lepiej poznać preferencje odbiorców, którzy wchodzą w interakcje z jego reklamami. Zleca więc instytutowi badawczemu porównanie cech charakterystycznych użytkowników, którzy zareagowali na reklamę z typowymi atrybutami użytkowników podobnych platform na różnych urządzeniach. Wypracowane porównanie uświadamia reklamodawcy, że odbiorcy jego reklam uzyskują do nich dostęp głównie za pośrednictwem urządzeń mobilnych i są to zwykle osoby w wieku od 45 do 60 lat."
      ]
    },
    "10": {
      "name": "Rozwój i ulepszanie usług",
      "shortName": "Ulepszanie naszych usług",
      "description": "Informacje na temat Twojej aktywności w serwisie, np. odnoszące się do Twoich reakcji na reklamy lub treści, mogą być bardzo pomocne w ulepszaniu produktów i usług oraz tworzeniu nowych produktów i usług w oparciu o Twoje interakcje, typ odbiorców itp. Ten konkretny cel nie obejmuje tworzenia ani ulepszania profili czy identyfikatorów użytkowników.",
      "illustrations": [
        "Platforma technologiczna współpracująca z dostawcą mediów społecznościowych zauważa wzrost liczby użytkowników aplikacji mobilnych i wyciąga wniosek – na podstawie profili użytkowników – że wielu z nich korzysta z połączeń mobilnych. Decyduje się na skorzystanie z nowej technologii dostarczania reklam sformatowanych specjalnie pod kątem urządzeń mobilnych. Są to reklamy o niskiej przepustowości, a jednocześnie bardzo wysokiej efektywności.",
        "Reklamodawca poszukuje nowej metody wyświetlania reklam na nowym typie urządzenia konsumenckiego. W związku z tym gromadzi informacje dotyczące sposobów interakcji użytkowników z nowym urządzeniem. Chciałby dowiedzieć się, czy może zbudować nowy mechanizm wyświetlania reklam na urządzeniu tego rodzaju."
      ]
    },
    "11": {
      "name": "Wykorzystywanie ograniczonych danych do wyboru treści",
      "shortName": "Wyświetlanie treści na podstawie ograniczonych danych",
      "description": "Treści prezentowane Tobie w serwisie mogą opierać się na ograniczonych danych takich jak witryna internetowa lub aplikacja, z których korzystasz, Twoja nieprecyzyjna lokalizacja, rodzaj urządzenia albo treści przeglądane przez Ciebie (na przykład w celu ograniczenia liczby wyświetleń danego filmu lub artykułu).",
      "illustrations": [
        "Magazyn podróżniczy opublikował w swojej witrynie internetowej artykuł na temat nowych kursów online prowadzonych przez szkołę językową, ukierunkowanych na ułatwianie komunikacji w czasie podróży. Wpisy na blogu szkoły są umieszczane bezpośrednio w dolnej części strony. Dobiera się je na podstawie Twojej nieprecyzyjnej lokalizacji  (na przykład wpisy na blogu wyjaśniające program kursów dotyczących języków innych niż język kraju, w którym się znajdujesz).",
        "Aplikacja mobilna z wiadomościami sportowymi zaczęła publikować nową serię artykułów na temat ostatnich meczów piłkarskich. W każdym artykule są filmy (dostarczane przez niezależną platformę streamingową) z najciekawszymi fragmentami poszczególnych meczów. Jeżeli użytkownik przyspieszy jakiś film, może to oznaczać, że następny prezentowany materiał wideo powinien być krótszy."
      ]
    }
  },
  "specialFeatures": {
    "1": {
      "name": "Użycie dokładnych danych geolokalizacyjnych",
      "description": "Za zgodą użytkownika do realizacji celów określonych w niniejszym powiadomieniu można wykorzystywać dokładną lokalizację użytkownika (mowa tu o promieniu nieprzekraczającym 500 metrów).",
      "illustrations": []
    },
    "2": {
      "name": "Identyfikowanie urządzeń na podstawie aktywnie żądanych informacji",
      "description": "Za zgodą użytkownika może zostać wysłane żądanie o podanie określonych cech urządzenia użytkownika, które pozwolą na odróżnienie go od innych urządzeń (np. zainstalowane wtyczki i czcionki, rozdzielczość ekranu) – w związku z realizacją celów, o których mowa w niniejszym powiadomieniu.",
      "illustrations": []
    }
  },
  "dataCategories": {
    "1": "Adresy IP",
    "2": "Charakterystyka urządzenia",
    "3": "Identyfikatory urządzeń",
    "4": "Identyfikatory probabilistyczne",
    "5": "Identyfikatory pochodzące z uwierzytelniania",
    "6": "Dane z przeglądania i interakcji",
    "7": "Dane dostarczone przez użytkownika",
    "8": "Nieprecyzyjne dane lokalizacyjne",
    "9": "Precyzyjne dane lokalizacyjne",
    "10": "Profile użytkowników",
    "11": "Wybory (preferencje) dotyczące prywatności"
  },
  "stacks": {
    "1": "Precyzyjne dane geolokalizacyjne i identyfikacja poprzez skanowanie urządzeń",
    "2": "Reklamy oparte na ograniczonych danych i pomiarach reklam",
    "3": "Reklamy spersonalizowana",
    "4": "Reklamy oparte na ograniczonych danych, pomiarach reklam i zrozumieniu odbiorców",
    "5": "Reklamy oparte na ograniczonych danych, spersonalizowany profil reklamowy i pomiar reklam",
    "6": "Wybór spersonalizowanych reklam i pomiar reklam",
    "7": "Wybór spersonalizowanych reklam, pomiar reklam i badanie odbiorców",
    "8": "Reklamy spersonalizowane i pomiar reklam",
    "9": "Reklamy spersonalizowane, pomiar reklam i badanie odbiorców",
    "10": "Reklamy spersonalizowane",
    "11": "Spersonalizowane treści",
    "12": "Wybór spersonalizowanych treści i pomiar treści",
    "13": "Wybór spersonalizowanych treści, pomiar treści i badanie odbiorców",
    "14": "Spersonalizowane treści i pomiar treści",
    "15": "Spersonalizowane treści, pomiar treści i badanie odbiorców",
    "16": "Spersonalizowane treści, pomiar treści, badanie odbiorców i ulepszanie usług",
    "17": "Pomiar reklam i treści oraz badanie odbiorców",
    "18": "Pomiar reklam i treści",
    "19": "Pomiar reklam i badanie odbiorców",
    "20": "Pomiar reklam i treści, badanie odbiorców, ulepszanie usług",
    "21": "Pomiar treści, badanie odbiorców i ulepszanie usług",
    "22": "Pomiar treści i ulepszanie usług",
    "23": "Wybór spersonalizowanych reklam i treści oraz pomiar reklam i treści",
    "24": "Wybór spersonalizowanych reklam i treści, pomiar reklam i treści oraz badanie odbiorców",
    "25": "Spersonalizowane reklamy i treści oraz pomiar reklam i treści",
    "26": "Spersonalizowane reklamy i treści, pomiar reklam i treści oraz badanie odbiorców",
    "27": "Profil bazujący na spersonalizowanych reklamach i treściach",
    "28": "Wybór spersonalizowanych reklam i treści",
    "29": "Reklama oparta na ograniczonych danych, pomiar reklam i treści,  badanie odbiorców",
    "30": "Wybór spersonalizowanych reklam, spersonalizowane treści, pomiar reklam i treści oraz  badanie odbiorców",
    "31": "Wybór spersonalizowanych reklam, spersonalizowane treści, pomiar reklam i treści,  badanie odbiorców oraz ulepszanie usług",
    "32": "Reklama oparta na ograniczonych danych, spersonalizowane treści, pomiar reklam i treści oraz  badanie odbiorców",
    "33": "Reklama oparta na ograniczonych danych, spersonalizowane treści, pomiar reklam i treści,  badanie odbiorców oraz ulepszanie usług",
    "34": "Reklama oparta na ograniczonych danych, spersonalizowane treści, pomiar treści oraz  badanie odbiorców",
    "35": "Reklama oparta na ograniczonych danych, spersonalizowane treści, pomiar treści,  badanie odbiorców oraz ulepszanie usług",
    "36": "Reklama oparta na ograniczonych danych, spersonalizowane treści i pomiar reklam",
    "37": "Reklama oparta na ograniczonych danych, spersonalizowane treści, pomiar reklam i ulepszanie usług",
    "38": "Spersonalizowane reklamy, pomiar reklam i ulepszanie usług",
    "39": "Spersonalizowane reklamy, pomiar reklam,  badanie odbiorców i ulepszanie usług",
    "40": "Spersonalizowane reklamy, pomiar reklam i treści, badanie odbiorców i ulepszanie usług",
    "41": "Spersonalizowane reklamy, wybór spersonalizowanych treści, pomiar reklam i treści,  badanie odbiorców oraz ulepszanie usług",
    "42": "Spersonalizowane reklamy i treści, pomiar reklam i treści,  badanie odbiorców i ulepszanie usług",
    "43": "Treści oparte na ograniczonych danych i pomiar treści",
    "44": "Spersonalizowane treści",
    "45": "Reklama oparta na ograniczonych danych, mierzenie efektywności reklam, analiza grona odbiorców oraz ulepszanie usług"
  },
  "stackSummaries": {
    "26": "Spersonalizowane reklamy i treści oraz pomiar ich skuteczności",
    "42": "Spersonalizowane reklamy i treści, pomiar ich skuteczności i ulepszanie naszych usług"
  }
};
