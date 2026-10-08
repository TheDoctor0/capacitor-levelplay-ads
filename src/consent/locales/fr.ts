import type { ConsentLocaleBundle } from '../../definitions';

/** Generated from the official IAB TCF translations (GVL v179) plus the plugin's UI copy. */
export const fr: ConsentLocaleBundle = {
  "ui": {
    "firstLayer.learnMore": "En savoir plus",
    "firstLayer.partners": "Liste des partenaires.",
    "btn.consent": "Consentir",
    "btn.manage": "Gérer les options",
    "btn.acceptAll": "Tout accepter",
    "btn.confirm": "Confirmer les choix",
    "btn.back": "Retour",
    "manage.header": "Préférences de données",
    "manage.title": "Gérez vos données",
    "manage.subtitle": "Vous pouvez choisir la manière dont vos données personnelles sont utilisées. Des fournisseurs demandent votre autorisation pour :",
    "manage.viewDetails": "Voir les détails",
    "manage.storageTitle": "Stockage, durée et détails d’utilisation",
    "manage.vendorPreferences": "Préférences des fournisseurs",
    "vendors.title": "Confirmez nos fournisseurs",
    "vendors.subtitle": "Les fournisseurs peuvent utiliser vos données pour fournir des services. Refuser un fournisseur peut l’empêcher d’utiliser les données que vous avez partagées.",
    "vendors.dataCollected": "Données collectées et traitées :",
    "vendors.company": "Société :",
    "vendors.purposes": "Finalités :",
    "vendors.privacyPolicy": "Politique de confidentialité",
    "vendors.consent": "Consentement",
    "details.examples": "Exemples",
    "details.vendors": "Fournisseurs",
    "firstLayer.title": "{appName} demande votre consentement pour utiliser vos données personnelles afin de :",
    "firstLayer.body": "Vos données personnelles seront traitées et les informations de votre appareil (cookies, identifiants uniques et autres données de l’appareil) peuvent être stockées, consultées et partagées avec {count} partenaires, ou utilisées spécifiquement par cette application.",
    "manage.consentWithCount.one": "Consentement ({count} fournisseur)",
    "manage.consentWithCount.other": "Consentement ({count} fournisseurs)",
    "manage.legIntWithCount.one": "Intérêt légitime ({count} fournisseur)",
    "manage.legIntWithCount.other": "Intérêt légitime ({count} fournisseurs)",
    "manage.tcfVendors": "Fournisseurs TCF",
    "vendors.tcfVendors": "Fournisseurs TCF",
    "vendors.header": "Préférences des fournisseurs",
    "firstLayer.geolocation": "Nos partenaires et nous-mêmes pouvons utiliser des données de géolocalisation précises.",
    "firstLayer.legInt": "Certains fournisseurs peuvent traiter vos données personnelles sur la base de l’intérêt légitime, auquel vous pouvez vous opposer en gérant vos options ci-dessous. Vous pouvez modifier ou retirer votre consentement à tout moment dans les paramètres de confidentialité de l’application.",
    "manage.specialFeatures": "Fonctionnalités spéciales",
    "manage.howItWorks": "Fonctionnement de cette plateforme de gestion du consentement (CMP) :",
    "manage.cmpChoices": "Choix de confidentialité de la CMP",
    "manage.storageBody": "Vos choix concernant les finalités et les fournisseurs influencent la manière dont la publicité personnalisée vous est présentée. Dans cette application, vos choix sont enregistrés dans le stockage de l’appareil avec le préfixe « IABTCF_ » pendant {days} jours, puis nous vous redemandons.",
    "vendors.otherVendors": "Autres fournisseurs",
    "vendors.retention": "Conservation : {days} jours.",
    "vendors.legInt": "Intérêt légitime",
    "vendors.alwaysActive": "Toujours actif",
    "vendors.legIntPurposes": "Finalités (intérêt légitime) :",
    "vendors.specialFeatures": "Fonctionnalités spéciales :",
    "vendors.location": "Lieu du traitement :",
    "vendors.category.marketing": "Marketing",
    "vendors.category.functional": "Fonctionnels",
    "vendors.category.essential": "Essentiels"
  },
  "purposes": {
    "1": {
      "name": "Stocker et/ou accéder à des informations sur un appareil",
      "shortName": "Stocker et/ou accéder à des informations sur un appareil",
      "description": "Les cookies, appareils ou identifiants en ligne similaires (par ex. identifiants de connexion, identifiants assignés de façon aléatoire, identifiants réseau) ainsi que toutes autres informations (par ex. type et informations de navigateur, langue, taille d’écran, technologies prises en charge, etc.) peuvent être conservés ou lus sur votre appareil pour reconnaître celui-ci à chacune de ses connexions à une application ou à un site Web, pour une ou plusieurs des finalités présentées ici.",
      "illustrations": [
        "La plupart des finalités expliquées dans le présent avis dépendent du stockage ou de l’accès aux informations à partir de votre appareil lorsque vous utilisez une application ou consultez un site Web. Par exemple, un fournisseur ou un éditeur peut avoir besoin de mémoriser un cookie sur votre appareil lors de votre première consultation sur un site Web afin de pouvoir reconnaître votre appareil lors de vos prochaines visites (en accédant à ce cookie à chaque connexion)."
      ]
    },
    "2": {
      "name": "Utiliser des données limitées pour sélectionner la publicité",
      "shortName": "Afficher des publicités basées sur des données limitées",
      "description": "La publicité qui vous est présentée sur ce service peut être basée sur des données limitées, telles que le site Web ou l’application que vous utilisez, votre emplacement approximatif, votre type d’appareil ou les contenus avec lesquels vous interagissez (ou avez interagi) (par exemple, pour limiter le nombre de fois où une publicité donnée vous est diffusée).",
      "illustrations": [
        "Un constructeur automobile souhaite promouvoir ses véhicules électriques auprès d’utilisateurs soucieux de l’environnement vivant en ville après les heures de bureau. La publicité est présentée sur une page avec du contenu connexe (tel qu’un article sur les actions de changement climatique) après 18 h 30 aux utilisateurs dont l’emplacement approximatif suggère qu’ils se trouvent en zone urbaine.",
        "Un grand producteur de peintures aquarelles souhaite diffuser une campagne de publicité en ligne pour sa dernière gamme d’aquarelles, en diversifiant son public pour atteindre autant d’artistes amateurs et professionnels que possible et en évitant de diffuser cette publicité aux côtés de contenus sans rapport (par exemple, des articles sur des méthodes de peinture pour une maison). Le nombre de fois où la publicité vous est présentée est détecté et limité afin d’éviter de vous la présenter trop fréquemment."
      ]
    },
    "3": {
      "name": "Créer des profils pour la publicité personnalisée",
      "shortName": "Créer un profil pour la publicité personnalisée",
      "description": "Les informations sur votre activité sur ce service (comme les formulaires que vous soumettez, les contenus que vous consultez) peuvent être conservées et conjuguées à d’autres informations vous concernant (par exemple, les informations de votre activité précédente sur ce service et d’autres sites Web ou applications) ou concernant des utilisateurs similaires. Ces informations servent ensuite à créer ou à améliorer un profil vous concernant (qui peut comporter d’éventuels centres d’intérêt et renseignements personnels). Votre profil peut être utilisé (également ultérieurement) pour présenter des publicités qui semblent plus pertinentes en fonction de vos centres d’intérêt éventuels par cette entité et d’autres entités.",
      "illustrations": [
        "Si vous lisez plusieurs articles sur les meilleurs accessoires de vélo à acheter, ces informations pourraient servir à créer un profil sur votre centre d’intérêt pour les accessoires de vélo. Un tel profil peut être utilisé ou amélioré ultérieurement, sur le même site Web ou toute autre application pour vous présenter des publicités d’une marque d’accessoires de vélo spécifique. Si vous regardez également un outil de configuration pour un véhicule sur le site Web d’un constructeur automobile de luxe, ces informations pourraient être conjuguées à votre centre d’intérêt pour les vélos afin d’affiner votre profil et de supposer que vous portez un intérêt particulier pour des équipements de cyclisme de luxe.",
        "Une entreprise de vêtements souhaite promouvoir sa nouvelle gamme de vêtements haut de gamme pour bébés. Elle contacte une agence qui dispose d’un réseau de clients à revenus élevés (comme les supermarchés haut de gamme) et demande à l’agence de créer des profils de jeunes parents ou couples, dont on peut supposer qu’ils sont aisés financièrement et qu’ils vont avoir un nouvel enfant. Ces profils pourront être utilisés ultérieurement pour présenter de la publicité dans des applications partenaires."
      ]
    },
    "4": {
      "name": "Utiliser des profils pour sélectionner des publicités personnalisées",
      "shortName": "Afficher des publicités personnalisées",
      "description": "La publicité qui vous est présentée sur ce service peut être basée sur vos profils publicitaires, qui peuvent être créés en fonction de votre activité sur ce service ou d’autres sites Web ou applications (comme les formulaires que vous soumettez, les contenus que vous consultez), ainsi que sur vos éventuels centres d’intérêt et renseignements personnels.",
      "illustrations": [
        "Un détaillant en ligne souhaite faire la publicité d’une vente limitée de chaussures de course. Il souhaite cibler la publicité pour les utilisateurs ayant déjà regardé des chaussures de running sur son application mobile. Les technologies de suivi peuvent être utilisées pour reconnaître que vous avez déjà utilisé l’application mobile pour consulter des chaussures de course afin de vous présenter la publicité correspondante sur l’application.",
        "Un profil créé pour la publicité personnalisée en relation avec une personne ayant recherché des accessoires de vélo sur un site Web peut être utilisé pour présenter la publicité pertinente pour les accessoires de vélo sur une application mobile d’une autre organisation."
      ]
    },
    "5": {
      "name": "Créer des profils de contenus personnalisés",
      "shortName": "Créer un profil pour des contenus personnalisés",
      "description": "Les informations concernant votre activité sur ce service (par exemple, les formulaires que vous soumettez, les contenus non publicitaires que vous consultez) peuvent être mémorisées et conjuguées à d’autres informations vous concernant (tels que les informations de votre activité précédente sur ce service ou d’autres sites Web ou applications) ou concernant des utilisateurs similaires. Ces informations servent ensuite à créer ou à améliorer un profil vous concernant (qui peut comporter, par exemple, d’éventuels centres d’intérêt et renseignements personnels). Votre profil peut servir (également à toute date ultérieure) à présenter des contenus qui semblent plus pertinents par rapport à vos éventuels centres d’intérêt, par exemple en adaptant l’ordre dans lequel les contenus vous sont présentés afin qu’il soit d’autant plus facile pour vous de trouver des contenus correspondant à vos centres d’intérêt.",
      "illustrations": [
        "Ces informations peuvent être ajoutées à un profil pour consigner votre intérêt pour les contenus liés aux activités en extérieur ainsi que pour les guides de bricolage (en vue de permettre la personnalisation des contenus afin que par exemple, vous receviez davantage de billets de blog et d’articles sur les maisons dans les arbres et les cabanes en bois à l’avenir).",
        "Vous avez visionné trois vidéos sur l’exploration spatiale sur diverses applications TV. Une plateforme d’actualités avec laquelle vous n’avez pas eu de contact crée un profil basé sur ce comportement de visualisation, en consignant votre intérêt pour l’exploration de l’espace à titre de centre d’intérêt potentiel pour d’autres vidéos."
      ]
    },
    "6": {
      "name": "Utiliser des profils pour sélectionner des contenus personnalisés",
      "shortName": "Afficher des contenus personnalisés",
      "description": "Les contenus qui vous sont présentés sur ce service peuvent être basés sur vos profils de personnalisation de contenu qui peuvent correspondre à votre activité sur ce service ou d’autres services (par exemple, les formulaires que vous soumettez, le contenu que vous consultez, les éventuels centres d’intérêt et renseignements personnels). Cela peut par exemple être utilisé en adaptant l’ordre de présentation des contenus afin qu’il soit d’autant plus facile pour vous de trouver (sans publicité) des contenus correspondant à vos centres d’intérêt.",
      "illustrations": [
        "Vous lisez des articles sur la nourriture végétarienne sur une plateforme de réseaux sociaux, puis vous utilisez l’application de cuisine d’une entreprise indépendante. Le profil créé à votre sujet sur la plateforme de réseaux sociaux servira à vous présenter des recettes végétariennes sur l’écran d’accueil de l’application de cuisine.",
        "Vous avez visionné trois vidéos sur l'aviron sur divers sites Web. Une plateforme de partage de vidéos non consultée recommandera cinq autres vidéos sur l’aviron susceptibles de vous intéresser lorsque vous utilisez votre application TV, en se basant sur un profil créé à votre sujet à partir de vos visites sur divers sites Web pour consulter des vidéos en ligne."
      ]
    },
    "7": {
      "name": "Mesurer la performance des publicités",
      "shortName": "Mesurer la performance des publicités",
      "description": "Les informations concernant la publicité qui vous est présentée et la manière dont vous interagissez avec elles peuvent être exploitées pour déterminer dans quelle mesure une publicité a été efficace pour vous ou d’autres utilisateurs et si les objectifs de la publicité ont été atteints. Par exemple, si vous avez vu une publicité, si vous avez cliqué dessus, si elle vous a conduit à acheter un produit ou à visiter un site Web, etc. Ces informations s’avèrent très utiles pour appréhender la pertinence des campagnes publicitaires.",
      "illustrations": [
        "Vous avez cliqué sur une publicité concernant une remise « Black Friday » d’une boutique en ligne sur un site Web et acheté un produit. Votre clic sera lié à cet achat. Votre interaction ainsi que  celle des autres utilisateurs seront mesurées pour déterminer le nombre de clics effectués sur la publicité qui ont abouti à un achat.",
        "Vous êtes l’une des rares personnes à avoir cliqué sur une publicité concernant une remise « Journée internationale» d’une boutique de cadeaux en ligne dans l’application d’un éditeur. L’éditeur souhaite disposer de rapports pour comprendre à quelle fréquence un placement publicitaire spécifique au sein de l’application, et notamment la publicité « Journée internationale d’appréciation », a été consultée ou fait l’objet de clics de votre part et d’autres utilisateurs pour permettre à l’éditeur et à ses partenaires (comme les agences) d’optimiser leurs placements publicitaires."
      ]
    },
    "8": {
      "name": "Mesurer la performance des contenus",
      "shortName": "Mesurer la performance des contenus",
      "description": "Les informations concernant les contenus qui vous sont présentés et la manière dont vous interagissez avec ceux-ci peuvent servir à déterminer si des contenus (non publicitaires), par exemple, ont atteint leur public cible et correspondent à vos centres d’intérêt. Par exemple, si vous lisez un article, visionnez une vidéo, écoutez un podcast ou consultez une description de produit, combien de temps avez-vous passé sur ce service et les pages Web que vous visitez, etc. Ces informations s’avèrent très utiles pour comprendre la pertinence des contenus (non publicitaires) qui vous sont présentés.",
      "illustrations": [
        "Vous avez lu un article de blog sur la randonnée sur une application mobile d’un éditeur et suivi un lien vers un article recommandé et connexe. Vos interactions seront enregistrées de sorte à préciser que la publication initiale sur la randonnée vous a été utile et qu'elle a réussi à susciter votre intérêt pour la publication liée. Cela sera mesuré pour savoir s’il faut produire davantage de publications sur la randonnée à l’avenir et où les placer sur l’écran d’accueil de l’application mobile.",
        "On vous a présenté une vidéo sur les tendances de la mode, mais vous et plusieurs autres utilisateurs avez cessé de regarder au bout de 30 secondes. Ces informations servent ensuite à évaluer la bonne longueur de vidéos futures sur les tendances de la mode."
      ]
    },
    "9": {
      "name": "Comprendre les publics par le biais de statistiques ou de combinaisons de données provenant de différentes sources",
      "shortName": "Comprendre notre audience grâce à des statistiques",
      "description": "Des rapports peuvent être générés en fonction de la combinaison d’ensembles de données (comme les profils d’utilisateurs, les statistiques, les études de marché, les données analytiques) concernant vos interactions et celles d’autres utilisateurs avec des contenus publicitaires ou (non publicitaires) afin d’identifier les caractéristiques communes (par exemple, pour déterminer quels publics cibles sont les plus réceptifs à une campagne publicitaire ou à certains contenus).",
      "illustrations": [
        "Le propriétaire d’une librairie en ligne souhaite obtenir des rapports commerciaux montrant la proportion de visiteurs ayant consulté et quitté son site sans acheter, ou ayant consulté et acheté la dernière autobiographie du mois, ainsi que l’âge moyen et la répartition hommes/femmes pour chaque catégorie. Les données relatives à votre navigation sur son site et à vos caractéristiques personnelles sont ensuite utilisées et combinées avec d’autres données de ce type pour produire ces statistiques.",
        "Un annonceur souhaite mieux comprendre le type d’audience interagissant avec ses publicités. Il est fait appel à un institut de recherche pour comparer les caractéristiques des utilisateurs qui ont interagi avec la publicité avec les attributs typiques des utilisateurs de plateformes similaires, sur différents appareils. Cette comparaison indique à l’annonceur que son public publicitaire accède principalement aux publicités par le biais d’appareils mobiles et se trouve probablement dans la tranche d’âge de 45 à 60 ans."
      ]
    },
    "10": {
      "name": "Développer et améliorer les services",
      "shortName": "Améliorer nos services",
      "description": "Les informations sur votre activité sur ce service, telles que vos interactions avec des publicités ou du contenu, peuvent être très utiles pour améliorer les produits et services et pour créer de nouveaux produits et services en fonction des interactions des utilisateurs, du type d’audience, etc. Cette finalité spécifique n’inclut pas le développement ou l’amélioration des profils et des identifiants des utilisateurs.",
      "illustrations": [
        "Une plateforme technologique travaillant avec un fournisseur de réseaux sociaux constate une croissance des utilisateurs d’applications mobiles, et voit en fonction de leurs profils que beaucoup d’entre eux se connectent via des connexions mobiles. Il utilise une nouvelle technologie pour diffuser des publicités formatées pour les appareils mobiles et à faible bande passante afin d’améliorer leurs performances.",
        "Un annonceur cherche un moyen d’afficher des publicités sur un nouveau type d’appareil grand public. Il collecte des informations sur la façon dont les utilisateurs interagissent avec ce nouveau type d’appareil pour déterminer s’il peut créer un nouveau mécanisme pour afficher de la publicité sur ce type d’appareil."
      ]
    },
    "11": {
      "name": "Utiliser des données limitées pour sélectionner le contenu",
      "shortName": "Afficher des contenus basés sur des données limitées",
      "description": "Le contenu qui vous est présenté sur ce service peut être basé sur des données limitées, telles que le site Web ou l’application que vous utilisez, votre emplacement non précis, votre type d’appareil ou le contenu avec lequel vous interagissez (ou avez interagi) (par exemple, pour limiter le nombre de diffusions d’une vidéo ou d’un article à votre attention).",
      "illustrations": [
        "Un magazine de voyage a publié un article sur son site Web sur les nouveaux cours en ligne proposés par une école de langues, afin d’améliorer les expériences de voyage à l’étranger. Les articles de blog de l’école sont insérés directement au bas de la page et sélectionnés en fonction de votre emplacement non précis (par exemple, les articles de blog expliquant le programme du cours pour différentes langues que la langue du pays dans lequel vous vous trouvez).",
        "Une application mobile d’actualités sportives a lancé une nouvelle section d’articles couvrant les matchs de football les plus récents. Chaque article comprend des vidéos hébergées par une plateforme de streaming distincte présentant les moments forts de chaque rencontre. Si vous faites avancer rapidement une vidéo, ces informations peuvent être utilisées pour sélectionner une vidéo plus courte à lire ensuite."
      ]
    }
  },
  "specialFeatures": {
    "1": {
      "name": "Utiliser des données de géolocalisation précises",
      "description": "Avec votre acceptation, votre emplacement précis (dans un rayon inférieur à 500 mètres) peut être utilisé à l’appui des finalités expliquées dans le présent avis.",
      "illustrations": []
    },
    "2": {
      "name": "Identifier les appareils à partir des informations demandées explicitement",
      "description": "Avec votre acceptation, certaines caractéristiques spécifiques à votre appareil peuvent être demandées et utilisées pour le distinguer d’autres appareils (comme les polices ou plug-ins installés, la résolution de votre écran) à l’appui des finalités expliquées dans le présent avis.",
      "illustrations": []
    }
  },
  "dataCategories": {
    "1": "Adresses IP",
    "2": "Caractéristiques de l'appareil",
    "3": "Identifiants de l’appareil",
    "4": "Identifiants probabilistes",
    "5": "Identifiants dérivés de l’authentification",
    "6": "Données de navigation et d’interaction",
    "7": "Données fournies par l’utilisateur",
    "8": "Données de localisation non précises",
    "9": "Données de localisation précises",
    "10": "Profils d’utilisateurs",
    "11": "Choix en matière de confidentialité"
  },
  "stacks": {
    "2": "Publicité basée sur des données limitées et mesure de performance des publicités",
    "3": "Publicités personnalisées",
    "4": "Publicités basées sur des données limitées, mesure de performance des publicités et études d’audience",
    "5": "Publicités basées sur des données limitées, profil de publicités personnalisées et mesure de performance des publicités",
    "6": "Sélection de publicités personnalisées et mesure de performance des publicités",
    "7": "Sélection de publicités personnalisées, mesure de performance des publicités et études d’audience",
    "8": "Publicités personnalisées et mesure de performance des publicités",
    "9": "Publicités personnalisées, mesure de performance des publicités et études d’audience",
    "10": "Publicités personnalisées",
    "11": "Contenu personnalisé",
    "12": "Sélection de contenu personnalisé et mesure de performance du contenu",
    "13": "Sélection de contenu personnalisé, mesure de performance du contenu et études d’audience",
    "14": "Contenu personnalisé et mesure de performance du contenu",
    "15": "Contenu personnalisé, mesure de performance du contenu et études d’audience",
    "16": "Contenu personnalisé, mesure de performance du contenu, études d’audience et développement de services",
    "17": "Mesure de performance des publicités et du contenu et études d’audience",
    "18": "Mesure de performance des publicités et du contenu",
    "19": "Mesure de performance des publicités et études d’audience",
    "20": "Mesure de performance des publicités et du contenu, études d’audience et développement de services",
    "21": "Mesure de performance du contenu, études d’audience et développement de services.",
    "22": "Mesure de performance du contenu et développement de services",
    "23": "Sélection de publicités et de contenu personnalisés et mesure de performance des publicités et du contenu",
    "24": "Sélection de publicités et de contenu personnalisé, mesure de performance des publicités et du contenu et études d’audience",
    "25": "Publicités et contenu personnalisés et mesure de performance des publicités et du contenu",
    "26": "Publicités et contenu personnalisés, mesure de performance des publicités et du contenu et études d’audience",
    "27": "Publicités personnalisées et profil de contenu",
    "28": "Sélection de publicités et de contenu personnalisés",
    "29": "Publicité basée sur des données limitées, mesure de performance des publicités et du contenu et études d’audience",
    "30": "Sélection de publicités et de contenu personnalisés, mesure de performance des publicités et du contenu et études d’audience",
    "31": "Sélection de publicités et de contenu personnalisés, mesure de performance des publicités et du contenu, études d’audience et développement de services",
    "32": "Publicité basée sur des données limitées, contenu personnalisé, mesure de performance des publicités et du contenu et études d’audience",
    "33": "Publicité basée sur des données limitées, contenu personnalisé, mesure de performance des publicités et du contenu, études d’audience et développement de services",
    "34": "Publicité basée sur des données limitées, contenu personnalisé, mesure de performance du contenu et études d’audience",
    "35": "Publicité basée sur des données limitées, contenu personnalisé, mesure de performance du contenu, études d’audience et développement de services",
    "36": "Publicité basée sur des données limitées, contenu personnalisé et mesure de performance des publicités",
    "37": "Publicité basée sur des données limitées, contenu personnalisé, mesure de performance des publicités et développement de services",
    "38": "Publicités personnalisées, mesure de performance des publicités et développement de services",
    "39": "Publicités personnalisées, mesure de performance des publicités, études d’audience et développement de services",
    "40": "Publicités personnalisées, mesure de performance des publicités et du contenu, études d’audience et développement de services",
    "41": "Publicités personnalisées, sélection de contenu personnalisé, mesure de performance des publicités et du contenu, études d’audience et développement de services",
    "42": "Publicités et contenu personnalisés, mesure de performance des publicités et du contenu, études d’audience et développement de services",
    "43": "Contenu basé sur des données limitées et mesure de performance du contenu",
    "44": "Contenu personnalisé",
    "45": "Publicité basée sur des données limitées, des mesures de performances des publicités, des études d’audience et le développement de services",
    "1": "Données de géolocalisation précises et identification par analyse de l’appareil"
  },
  "stackSummaries": {
    "26": "Publicités et contenus personnalisés, et mesure de leur performance",
    "42": "Publicités et contenus personnalisés, mesure de leur performance et amélioration de nos services"
  }
};
