import type { ConsentLocaleBundle } from '../../definitions';

/** Generated from the official IAB TCF translations (GVL v179) plus the plugin's UI copy. */
export const de: ConsentLocaleBundle = {
  "ui": {
    "firstLayer.learnMore": "Mehr erfahren",
    "firstLayer.partners": "Liste der Partner.",
    "btn.consent": "Einwilligen",
    "btn.manage": "Optionen verwalten",
    "btn.acceptAll": "Alle akzeptieren",
    "btn.confirm": "Auswahl bestätigen",
    "btn.back": "Zurück",
    "manage.header": "Datenpräferenzen",
    "manage.title": "Ihre Daten verwalten",
    "manage.subtitle": "Sie können wählen, wie Ihre personenbezogenen Daten verwendet werden. Anbieter bitten um Ihre Erlaubnis für Folgendes:",
    "manage.viewDetails": "Details anzeigen",
    "manage.storageTitle": "Speicherung, Dauer und Nutzungsdetails",
    "manage.vendorPreferences": "Anbieterpräferenzen",
    "vendors.title": "Unsere Anbieter bestätigen",
    "vendors.subtitle": "Anbieter können Ihre Daten nutzen, um Dienste bereitzustellen. Wenn Sie einen Anbieter ablehnen, kann er die geteilten Daten nicht mehr nutzen.",
    "vendors.dataCollected": "Erhobene und verarbeitete Daten:",
    "vendors.company": "Unternehmen:",
    "vendors.purposes": "Zwecke:",
    "vendors.privacyPolicy": "Datenschutzerklärung",
    "vendors.consent": "Einwilligung",
    "details.examples": "Beispiele",
    "details.vendors": "Anbieter",
    "firstLayer.title": "{appName} möchte Ihre personenbezogenen Daten verwenden",
    "firstLayer.body": "Ihre personenbezogenen Daten werden verarbeitet, und Informationen von Ihrem Gerät (Cookies, eindeutige Kennungen und andere Gerätedaten) können von {count} Partnern gespeichert, abgerufen und mit ihnen geteilt oder speziell von dieser App genutzt werden.",
    "manage.consentWithCount.one": "Einwilligung ({count} Anbieter)",
    "manage.consentWithCount.other": "Einwilligung ({count} Anbieter)",
    "manage.legIntWithCount.one": "Berechtigtes Interesse ({count} Anbieter)",
    "manage.legIntWithCount.other": "Berechtigtes Interesse ({count} Anbieter)",
    "manage.tcfVendors": "TCF-Anbieter",
    "vendors.tcfVendors": "TCF-Anbieter",
    "vendors.header": "Anbieterpräferenzen",
    "firstLayer.geolocation": "Wir und unsere Partner können genaue Standortdaten verwenden.",
    "firstLayer.legInt": "Einige Anbieter verarbeiten Ihre personenbezogenen Daten möglicherweise auf Grundlage eines berechtigten Interesses, dem Sie widersprechen können, indem Sie unten Ihre Optionen verwalten. Sie können Ihre Einwilligung jederzeit in den Datenschutzeinstellungen der App ändern oder widerrufen.",
    "manage.specialFeatures": "Besondere Merkmale",
    "manage.howItWorks": "So funktioniert diese Consent-Management-Plattform (CMP):",
    "manage.cmpChoices": "Datenschutzoptionen der CMP",
    "manage.storageBody": "Ihre Auswahl zu Zwecken und Anbietern beeinflusst, wie Ihnen personalisierte Werbung angezeigt wird. In dieser App wird Ihre Auswahl {days} Tage lang im Gerätespeicher mit dem Präfix „IABTCF_“ gespeichert; danach fragen wir erneut.",
    "vendors.otherVendors": "Andere Anbieter",
    "vendors.retention": "Speicherdauer: {days} Tage.",
    "vendors.legInt": "Berechtigtes Interesse",
    "vendors.alwaysActive": "Immer aktiv",
    "vendors.legIntPurposes": "Zwecke (berechtigtes Interesse):",
    "vendors.specialFeatures": "Besondere Merkmale:",
    "vendors.location": "Ort der Verarbeitung:",
    "vendors.category.marketing": "Marketing",
    "vendors.category.functional": "Funktional",
    "vendors.category.essential": "Unbedingt erforderlich"
  },
  "purposes": {
    "1": {
      "name": "Speichern von oder Zugriff auf Informationen auf einem Endgerät",
      "shortName": "Speichern von oder Zugriff auf Informationen auf einem Endgerät",
      "description": "Cookies, Endgeräte- oder ähnliche Online-Kennungen (z. B. login-basierte Kennungen, zufällig generierte Kennungen, netzwerkbasierte Kennungen) können zusammen mit anderen Informationen (z. B. Browsertyp und Browserinformationen, Sprache, Bildschirmgröße, unterstützte Technologien usw.) auf Ihrem Endgerät gespeichert oder von dort ausgelesen werden, um es jedes Mal wiederzuerkennen, wenn es eine App oder einer Webseite aufruft. Dies geschieht für einen oder mehrere der hier aufgeführten Verarbeitungszwecke.",
      "illustrations": [
        "Die meisten in dieser Mitteilung erläuterten Verarbeitungszwecke beruhen auf der Speicherung von oder dem Zugriff auf Informationen auf Ihrem Endgerät, wenn Sie eine App verwenden oder eine Webseite besuchen. So kann es beispielsweise erforderlich sein, dass ein Anbieter oder Webseitenbetreiber bei Ihrem ersten Besuch einer Webseite ein Cookie auf Ihrem Endgerät speichert, um dieses bei Ihren nächsten Besuchen wiederzuerkennen (indem er dieses Cookie jedes Mal erneut abruft)."
      ]
    },
    "2": {
      "name": "Verwendung reduzierter Daten zur Auswahl von Werbeanzeigen",
      "shortName": "Anzeige von Werbung auf Basis reduzierter Daten",
      "description": "Werbeanzeigen, die Ihnen auf diesem Dienst präsentiert werden, können auf reduzierten Daten basieren, wie z. B. der Webseite oder App, die Sie gerade verwenden, Ihrem ungefähren Standort, Ihrem Gerätetyp oder den Inhalten, mit denen Sie interagieren (oder interagiert haben) (z. B., um die Anzeigefrequenz der Werbung zu begrenzen, die Ihnen ausgespielt werden).",
      "illustrations": [
        "Ein Autohersteller will seine Elektrofahrzeuge bei umweltbewussten Nutzern, die in der Stadt leben, nach Feierabend bewerben.Die Werbung wird Benutzern, deren ungefährerer Standort darauf hindeutet, dass sie sich in einem städtischen Raum befinden, nach 18:30 Uhr auf einer Seite mit ähnlichen Inhalten (z. B. einem Artikel über Klimaschutzmaßnahmen) angezeigt.",
        "Ein großer Hersteller von Wasserfarben möchte eine Online-Werbekampagne für sein neuestes Wasserfarben-Sortiment durchführen. Dabei soll die Zielgruppe diversifiziert werden, um möglichst viele Amateur- und Profikünstler zu erreichen, und es soll vermieden werden, die Anzeige neben ungeeigneten Inhalten (z. B. Artikel über das Streichen des Hauses) zu zeigen. Die Häufigkeit, mit der Ihnen die Anzeige präsentiert wurde, wird erfasst und begrenzt, um zu vermeiden, dass Sie sie zu oft zu sehen bekommen."
      ]
    },
    "3": {
      "name": "Erstellung von Profilen für personalisierte Werbung",
      "shortName": "Erstellung eines Profils für personalisierte Werbung",
      "description": "Informationen über Ihre Aktivitäten auf diesem Dienst (wie ausgefüllte Formulare, angesehene Inhalte) können gespeichert und mit anderen Informationen über Sie (z. B. Informationen aus Ihrer vorherigen Aktivität auf diesem Dienst oder anderen Webseiten oder Apps) oder ähnlichen Benutzern kombiniert werden. Diese werden dann verwendet, um ein Profil über Sie zu erstellen oder zu verbessern (dies kann z. B. mögliche Interessen und persönliche Merkmale beinhalten). Ihr Profil kann (auch zu einem späteren Zeitpunkt) verwendet werden, um es zu ermöglichen, Ihnen Werbung zu präsentieren, die aufgrund Ihrer möglichen Interessen für Sie wahrscheinlich relevanter ist.",
      "illustrations": [
        "Wenn Sie beispielsweise mehrere Artikel über das beste Fahrradzubehör im Handel lesen, können diese Informationen verwendet werden, um ein Profil über Ihr Interesse an Fahrradzubehör zu erstellen. Ein solches Profil kann zu einem späteren Zeitpunkt auf derselben oder einer anderen Webseite oder App verwendet oder verbessert werden, um Ihnen Werbung für eine bestimmte Fahrradzubehörmarke anzuzeigen. Wenn Sie sich auch einen Konfigurator für ein Fahrzeug auf der Webseite eines Luxusautoherstellers ansehen, können diese Informationen mit Ihrem Interesse an Fahrrädern kombiniert werden, um Ihr Profil zu verfeinern, und zur Annahme führen, dass Sie an Luxusfahrradausrüstung interessiert sind.",
        "Ein Bekleidungsunternehmen möchte seine neue Kollektion hochwertiger Babykleidung bewerben.Es setzt sich mit einer Agentur in Verbindung, die über ein Netzwerk von Kunden mit hohem Einkommen verfügt (z. B. Supermärkte der gehobenen Preisklasse) und bittet die Agentur, Profile junger Eltern oder Paare zu erstellen, von denen angenommen werden kann, dass sie wohlhabend sind und kürzlich ein Kind bekommen haben, damit diese später verwendet werden können, um Werbung in Partner-Apps zu schalten."
      ]
    },
    "4": {
      "name": "Verwendung von Profilen zur Auswahl personalisierter Werbung",
      "shortName": "Anzeige personalisierter Werbung",
      "description": "Werbung, die Ihnen auf diesem Dienst angezeigt wird, kann auf Ihrem Werbeprofil basieren.  Dieses Werbeprofil kann Ihre Aktivitäten (wie ausgefüllte Formulare, angesehene Inhalte) auf diesem Dienst oder anderen Webseiten oder Apps, mögliche Interessen und persönliche Merkmale beinhalten.",
      "illustrations": [
        "Ein Online-Händler möchte einen begrenzten Ausverkauf für Laufschuhe bewerben.Er möchte gezielt Werbung für Benutzer schalten, die sich zuvor Laufschuhe in seiner mobilen App angesehen haben.Tracking-Technologien können verwendet werden, um festzustellen, ob Sie die mobile App in der Vergangenheit verwendet haben, um nach Laufschuhen zu suchen, und um Ihnen so die entsprechende Werbung in der App anzuzeigen.",
        "Ein Profil, das für personalisierte Werbung in Bezug auf eine Person erstellt wurde, die auf einer Webseite nach Fahrradzubehör gesucht hat, kann verwendet werden, um die entsprechende Werbung für Fahrradzubehör auf einer mobilen App eines anderen Anbieters anzuzeigen."
      ]
    },
    "5": {
      "name": "Erstellung von Profilen zur Personalisierung von Inhalten",
      "shortName": "Erstellung eines Profils für personalisierte Inhalte",
      "description": "Informationen über Ihre Aktivitäten auf diesem Dienst (wie zum Beispiel: ausgefüllte Formulare, angesehene nicht werbliche Inhalte) können gespeichert und mit anderen Informationen über Sie (wie Ihrer vorherigen Aktivität auf diesem Dienst oder anderen Webseiten oder Apps) oder ähnlichen Benutzern kombiniert werden.Diese werden dann verwendet, um ein Profil über Sie zu erstellen oder zu ergänzen (dies kann z.B. mögliche Interessen und persönliche Merkmale beinhalten). Ihr Profil kann (auch zu einem späteren Zeitpunkt) verwendet werden, um Ihnen Inhalte anzuzeigen, die aufgrund Ihrer möglichen Interessen für Sie wahrscheinlich relevanter sind, indem z. B. die Reihenfolge, in der Ihnen Inhalte angezeigt werden, geändert wird, um es Ihnen noch leichter zu machen, Inhalte zu finden, die Ihren Interessen entsprechen.",
      "illustrations": [
        "Sie lesen auf einer Social-Media-Plattform mehrere Artikel darüber, wie man ein Baumhaus baut. Diese Information kann einem Profil hinzugefügt werden, um Ihr Interesse an Inhalten zu Aktivitäten im Freien sowie an Do-it-yourself-Anleitungen festzuhalten (mit dem Ziel, die Personalisierung von Inhalten zu ermöglichen, sodass Ihnen beispielsweise in Zukunft mehr Blog-Posts und Artikel über Baumhäuser und Holzhütten präsentiert werden).",
        "Sie haben sich in verschiedenen TV-Apps drei Videos zum Thema Weltraumforschung angesehen. Eine davon unabhängige Nachrichtenplattform, die Sie bisher nicht genutzt haben, erstellt basierend auf diesem Nutzungsverhalten ein Profil und erfasst Weltraumforschung als ein Thema von möglichem Interesse für zukünftige Videos."
      ]
    },
    "6": {
      "name": "Verwendung von Profilen zur Auswahl personalisierter Inhalte",
      "shortName": "Anzeige personalisierter Inhalte",
      "description": "Inhalte, die Ihnen auf diesem Dienst präsentiert werden, können auf Ihren Inhaltsprofilen basieren, die Ihre Aktivitäten auf diesem oder anderen Diensten (wie Formulare, die Sie einreichen, Inhalte, die Sie sich ansehen), mögliche Interessen und persönliche Aspekte widerspiegeln können. Dies kann beispielsweise dazu genutzt werden, um die Reihenfolge anzupassen, in der Ihnen Inhalte angezeigt werden, um es Ihnen noch leichter zu machen, (Nicht-Werbe-)Inhalte zu finden, die Ihren Interessen entsprechen.",
      "illustrations": [
        "Sie lesen auf einer Social-Media-Plattform Artikel über vegetarisches Essen und verwenden dann die Koch-App eines von der Plattform unabhängigen Unternehmens. Das Profil, das über Sie auf der Social-Media-Plattform erstellt wurde, wird verwendet, um Ihnen auf der Startseite der Koch-App vegetarische Rezepte zu präsentieren.",
        "Sie haben sich auf verschiedenen Webseiten drei Videos zum Thema Rudersport angesehen. Wenn Sie Ihre TV-App verwenden, empfiehlt Ihnen eine von den Webseiten unabhängige Video-Sharing-Plattform, basierend auf einem Profil das über Sie erstellt wurde als Sie sich die Online-Videos auf diesen Websites angesehen haben, fünf weitere Videos zum Thema Rudersport, die für Sie von Interesse sein könnten."
      ]
    },
    "7": {
      "name": "Messung der Werbeleistung",
      "shortName": "Messung der Werbeleistung",
      "description": "Informationen darüber, welche Werbung Ihnen präsentiert wird und wie Sie damit interagieren, können verwendet werden, um festzustellen, wie sehr eine Werbung Sie oder andere Benutzer angesprochen hat und ob die Ziele der Werbekampagne erreicht wurden. Die Informationen umfassen zum Beispiel, ob Sie sich eine Anzeige angesehen haben, ob Sie daraufgeklickt haben, ob sie Sie dazu animiert hat, ein Produkt zu kaufen oder eine Webseite zu besuchen usw. Diese Informationen sind hilfreich, um die Relevanz von Werbekampagnen zu ermitteln.",
      "illustrations": [
        "Sie haben auf der Webseite eines Webseitenbetreibers auf eine Werbung über einen „Black Friday“-Rabatt eines Online-Shops geklickt und ein Produkt gekauft. Ihr Klick wird mit diesem Kauf verknüpft. Ihre Interaktion und die anderer Benutzer wird gemessen, um herauszufinden, wie viele Klicks auf die Anzeige zu einem Kauf geführt haben.",
        "Sie gehören zu den wenigen, die in der App eines App-Betreibers auf eine Werbung, über einen Rabatt anlässlich eines besonderen Ereignisses (z.B. „internationaler Tag der Anerkennung“), eines Online-Geschenkeshops geklickt haben. Der App-Betreiber möchte Statistiken darüber erhalten, wie oft eine bestimmte Anzeige innerhalb der App, insbesondere die Anzeige zu einem besonderen Ereignis (z.B. „internationaler Tag der Anerkennung“) von Ihnen und anderen Benutzern angesehen oder angeklickt wurde, um dem App-Betreiber und seinen Partnern (wie Agenturen) zu helfen, die Anzeigenschaltung zu optimieren."
      ]
    },
    "8": {
      "name": "Messung der Performance von Inhalten",
      "shortName": "Messung der Leistung von Inhalten",
      "description": "Informationen darüber, welche Werbung Ihnen präsentiert wird und wie Sie damit interagieren, können dazu verwendet werden festzustellen, ob (nicht werbliche) Inhalte z. B. die beabsichtigte Zielgruppe erreicht und Ihren Interessen entsprochen haben. Dazu gehören beispielsweise Informationen darüber, ob Sie einen bestimmten Artikel gelesen, sich ein bestimmtes Video angesehen, einen bestimmten Podcast angehört oder sich eine bestimmte Produktbeschreibung angesehen haben, wie viel Zeit Sie auf diesem Dienst und den von Ihnen besuchten Webseiten verbracht haben usw. Diese Informationen helfen dabei, die Relevanz von (nicht werblichen) Inhalten, die Ihnen angezeigt werden, zu ermitteln.",
      "illustrations": [
        "Sie haben in der mobilen App eines App-Betreibers einen Blog-Post zum Thema Wandern gelesen und einen Link zu einem empfohlenen ähnlichen Post angetippt. Ihre Interaktionen werden aufgezeichnet, um festzuhalten, dass der erste Post zum Thema Wandern für Sie nützlich war und dass er Sie erfolgreich zum Lesen des ähnlichen Posts animiert hat. Diese Informationen werden gemessen, um herauszufinden, ob in Zukunft mehr Posts zum Thema Wandern verfasst werden sollen und wo sie auf dem Startbildschirm der mobilen App platziert werden sollten.",
        "Ihnen wurde ein Video über Modetrends präsentiert, aber Sie und mehrere andere Benutzer haben dieses nach 30 Sekunden abgebrochen. Diese Information wird zur Evaluierung der geeigneten Länge zukünftiger Videos zu Modetrends verwendet."
      ]
    },
    "9": {
      "name": "Analyse von Zielgruppen durch Statistiken oder Kombinationen von Daten aus verschiedenen Quellen",
      "shortName": "Verständnis unserer Zielgruppe durch Statistiken",
      "description": "Basierend auf der Kombination von Datensätzen (wie Benutzerprofilen, Statistiken, Marktforschung, Analysedaten) können Berichte über Ihre Interaktionen und die anderer Benutzer mit Werbe- oder (nicht werblichen) Inhalten erstellt werden, um gemeinsame Merkmale zu ermitteln (z. B., um festzustellen, welche Zielgruppen für eine Werbekampagne oder für bestimmte Inhalte empfänglich sind).",
      "illustrations": [
        "Der Eigentümer eines Online-Buchhandels möchte eine Auswertung, wie viele Besucher seine Webseite besucht haben, ohne etwas zu kaufen, oder wie viele die Webseite besucht haben, um die neuste Promi-Biographie des Monats zu kaufen, sowie das Durchschnittsalter der Besucher und wie viele davon männlich bzw. weiblich sind, aufgeteilt je nach Kategorie. Daten über Ihre Navigation auf der Webseite und Ihre persönlichen Merkmale werden dann verwendet und mit anderen solcher Daten kombiniert, um diese Statistiken zu erstellen.",
        "Ein Werbetreibender möchte die Art der Zielgruppe, die mit seinen Anzeigen interagiert, besser verstehen. Er beauftragt ein Forschungsinstitut, die Eigenschaften von Benutzern, die mit der Anzeige interagiert haben, mit typischen Attributen von Benutzern ähnlicher Plattformen über verschiedene Geräte hinweg zu vergleichen. Dieser Vergleich zeigt dem Werbetreibenden, dass seine Zielgruppe hauptsächlich über mobile Geräte auf die Werbung zugreift und wahrscheinlich im Alter zwischen 45–60 Jahren liegt."
      ]
    },
    "10": {
      "name": "Entwicklung und Verbesserung der Angebote",
      "shortName": "Verbesserung unserer Angebote",
      "description": "Informationen über Ihre Aktivitäten auf diesem Angebot, wie z. B. Ihre Interaktion mit Anzeigen oder Inhalten, können dabei helfen, Produkte und Angebote zu verbessern und neue Produkte und Angebote zu entwickeln basierend auf Benutzerinteraktionen, der Art der Zielgruppe usw. Dieser Verarbeitungszweck umfasst nicht die Entwicklung, Ergänzung oder Verbesserung von Benutzerprofilen und Kennungen.",
      "illustrations": [
        "Eine Technologieplattform, die mit einem Social-Media-Anbieter zusammenarbeitet, stellt ein Wachstum in den Nutzerzahlen ihrer mobilen App fest und erkennt basierend auf den Benutzerprofilen, dass viele von ihnen sich über mobile Verbindungen einwählen. Die Plattform verwendet zur Verbesserung der Ladegeschwindigkeit von Anzeigen eine neue Technologie zur Auslieferung von Werbung, die für mobile Endgeräte optimiert ist und eine geringe Bandbreite benötigt.",
        "Ein Werbetreibender sucht nach einer Möglichkeit, Anzeigen auf einem neuartigen Endgerät anzuzeigen. Er sammelt Informationen darüber, wie Benutzer mit dieser neuen Art von Endgerät interagieren, um herauszufinden, ob er einen neuen Mechanismus für die Anzeige von Werbung auf dieser Art von Endgerät entwickeln kann."
      ]
    },
    "11": {
      "name": "Verwendung reduzierter Daten zur Auswahl von Inhalten",
      "shortName": "Anzeige von Inhalten auf Basis reduzierter Daten",
      "description": "Inhalte, die Ihnen auf diesem Dienst präsentiert werden, können auf reduzierten Daten basieren, wie z. B. der Webseite oder App, die Sie verwenden, Ihrem ungefähren Standort, Ihrem Endgerätetyp oder der Information, mit welchen Inhalten Sie interagieren (oder interagiert haben) (z. B. zur Begrenzung wie häufig Ihnen ein Video oder ein Artikel angezeigt wird).",
      "illustrations": [
        "Ein Reisemagazin hat auf seiner Webseite einen Artikel über die neuen Online-Kurse veröffentlicht, die von einer Sprachschule angeboten werden, um die Reiseerfahrungen im Ausland zu verbessern. Die Blog-Posts der Reiseschule werden direkt am Ende der Seite eingefügt und basierend auf Ihrem ungefähren Standort ausgewählt (z. B. Blog-Posts mit dem Lehrplan für den Kurs einer Sprache, die nicht die Sprache Ihres Landes ist).",
        "Eine mobile App für Sportnachrichten hat eine neue Sparte mit Artikeln über die neuesten Fußballspiele eingeführt. Jeder Artikel enthält Videos mit Highlights des Spiels, die von einer externen Streaming-Plattform gehostet werden. Wenn Sie ein Video vorspulen, kann diese Information verwendet werden, um im Anschluss ein Video abzuspielen, das kürzer ist."
      ]
    }
  },
  "specialFeatures": {
    "1": {
      "name": "Verwendung genauer Standortdaten",
      "description": "Mit Ihrer Zustimmung kann Ihr genauer Standort (mit einem Radius von weniger als 500 Metern) zur Unterstützung der in diesem Rahmenwerk erläuterten Zwecke verwendet werden.",
      "illustrations": []
    },
    "2": {
      "name": "Geräte anhand von aktiv angeforderten Informationen identifizieren",
      "description": "Mit Ihrer Zustimmung können bestimmte für Ihr Endgerät spezifische Merkmale angefordert und verwendet werden, um es von anderen Endgeräten zu unterscheiden (wie z. B. die installierten Zeichensätze oder Plugins, die Auflösung Ihres Bildschirms), um die in diesem Rahmenwerk erläuterten Zwecke zu unterstützen.",
      "illustrations": []
    }
  },
  "dataCategories": {
    "1": "IP-Adressen",
    "2": "Gerätemerkmale",
    "3": "Gerätekennungen",
    "4": "Probabilistische Kennungen",
    "5": "Aus Authentifizierungen abgeleitete Kennungen",
    "6": "Surf- und Interaktionsdaten",
    "7": "Vom Benutzer bereitgestellte Daten",
    "8": "Ungefähre Standort-Daten",
    "9": "Genaue Standortdaten",
    "10": "Benutzerprofile",
    "11": "Datenschutzeinstellungen"
  },
  "stacks": {
    "1": "Genaue Standortdaten und Identifikation durch Scannen von Endgeräten",
    "2": "Werbung basierend auf einer reduzierten Menge von Daten und Messung von Werbeleistung",
    "3": "Personalisierte Werbung",
    "4": "Werbung basierend auf einer reduzierten Menge von Daten, Messung von Werbeleistung und Zielgruppenforschung",
    "5": "Werbung basierend auf einer reduzierten Menge von Daten, einem personalisierten Werbeprofil und Messung von Werbeleistung",
    "6": "Auswahl personalisierter Werbung und Messung von Werbeleistung",
    "7": "Auswahl personalisierter Werbung, Messung von Werbeleistung und Zielgruppenforschung",
    "8": "Personalisierte Werbung und Messung von Werbeleistung",
    "9": "Personalisierte Werbung, Messung von Werbeleistung und Zielgruppenforschung",
    "10": "Personalisierte Werbung",
    "11": "Personalisierte Inhalte",
    "12": "Auswahl personalisierter Inhalte und Messung der Performance von Inhalten",
    "13": "Auswahl personalisierter Inhalte, Messung von Inhalten und Zielgruppenforschung",
    "14": "Personalisierte Inhalte und Messung von Inhalten",
    "15": "Personalisierte Inhalte, Messung von Inhalten und Zielgruppenforschung",
    "16": "Personalisierte Inhalte, Messung von Inhalten, Zielgruppenforschung und Entwicklung von Angeboten",
    "17": "Messung von Werbeleistung und Inhalten sowie Zielgruppenforschung",
    "18": "Messung von Werbeleistung und Inhalten",
    "19": "Messung von Werbeleistung und Zielgruppenforschung",
    "20": "Messung von Werbeleistung und der Performance von Inhalten, Zielgruppenforschung sowie Entwicklung und Verbesserung der Angebote",
    "21": "Messung der Performance von Inhalten, Zielgruppenforschung sowie Entwicklung und Verbesserung der Angebote",
    "22": "Messung der Performance von Inhalten sowie Entwicklung und Verbesserung der Angebote",
    "23": "Auswahl personalisierter Werbung und Inhalte, Messung von Werbeleistung und der Performance von Inhalten",
    "24": "Auswahl personalisierter Werbung und Inhalte, Messung von Werbeleistung und der Performance von Inhalten sowie Zielgruppenforschung",
    "25": "Personalisierte Werbung und Inhalte, Messung von Werbeleistung und der Performance von Inhalten",
    "26": "Personalisierte Werbung und Inhalte, Messung von Werbeleistung und der Performance von Inhalten sowie Zielgruppenforschung",
    "27": "Erstellung von Profilen für personalisierte Werbung und Inhalte",
    "28": "Erstellung von Profilen für personalisierte Werbung und Inhalte",
    "29": "Werbung basierend auf einer reduzierten Menge von Daten, Messung von Werbeleistung und der Performance von Inhalten sowie Zielgruppenforschung",
    "30": "Auswahl personalisierter Inhalte, personalisierte Inhalte, Messung von Werbeleistung und der Performance Inhalten sowie Zielgruppenforschung",
    "31": "Auswahl personalisierter Werbung und Inhalte, Messung von Werbeleistung und der Performance von Inhalten, Zielgruppenforschung sowie Entwicklung und Verbesserung der Angebote",
    "32": "Werbung basierend auf einer reduzierten Menge von Daten, personalisierte Inhalte, Messung von Werbeleistung und der Performance von Inhalten sowie Zielgruppenforschung",
    "33": "Werbung basierend auf einer reduzierten Menge von Daten, personalisierte Inhalte, Messung von Werbeleistung und der Performance von Inhalten, Zielgruppenforschung sowie Entwicklung und Verbesserung von Angeboten",
    "34": "Werbung basierend auf einer reduzierten Menge von Daten, personalisierte Inhalte, Messung der Performance von Inhalten und Zielgruppenforschung",
    "35": "Werbung basierend auf einer reduzierten Menge von Daten, personalisierte Inhalte, Messung der Performance von Inhalten, Zielgruppenforschung sowie die Entwicklung und Verbesserung von Angeboten",
    "36": "Werbung basierend auf einer reduzierten Menge von Daten, personalisierte Inhalte und Messung von Werbeleistung",
    "37": "Werbung basierend auf einer reduzierten Menge von Daten, personalisierte Inhalte, Messung von Werbeleistung sowie Entwicklung und Verbesserung von Angeboten",
    "38": "Personalisierte Werbung, Messung von Werbeleistung sowie Entwicklung und Verbesserung von Angeboten",
    "39": "Personalisierte Werbung, Messung von Werbeleistung, Zielgruppenforschung sowie Entwicklung und Verbesserung von Angeboten",
    "40": "Personalisierte Werbung, Messung von Werbeleistung und der Performance von Inhalten, Zielgruppenforschung sowie Entwicklung und Verbesserung von Angeboten",
    "41": "Personalisierte Werbung, Auswahl personalisierter Inhalte, Messung von Werbeleistung und der Performance von Inhalten, Zielgruppenforschung sowie Entwicklung und Verbesserung von Angeboten",
    "42": "Personalisierte Werbung und Inhalte, Messung von Werbeleistung und der Performance von Inhalten, Zielgruppenforschung sowie Entwicklung und Verbesserung von Angeboten",
    "43": "Inhalte basierend auf einer reduzierten Menge von Daten und Messung der Performance von Inhalten",
    "44": "Personalisierte Inhalte",
    "45": "Werbung auf der Grundlage begrenzter Daten, Messung der Werbeleistung, Zielgruppenforschung und Entwicklung von Dienstleistungen"
  },
  "stackSummaries": {
    "26": "Personalisierte Werbung und Inhalte sowie Messung ihrer Leistung",
    "42": "Personalisierte Werbung und Inhalte, Messung ihrer Leistung und Verbesserung unserer Angebote"
  }
};
