import type { ConsentLocaleBundle } from '../../definitions';

/**
 * Built-in English copy for the custom consent modal. Every other locale and
 * every per-publisher override is merged over this bundle, so it doubles as the
 * fallback for any missing key.
 *
 * UI strings support `{var}` interpolation (e.g. `{appName}`, `{count}`).
 * The catalogues (purposes, technologies, dataCategories, legalBases,
 * retention, countries) and the per-service descriptions are transcribed from
 * the reference CMP and cover the services in `consent/services.example.json`.
 */
export const en: ConsentLocaleBundle = {
  ui: {
    // First layer
    'firstLayer.title': '{appName} asks for your consent to use your personal data to:',
    'firstLayer.body':
      'Your personal data will be processed and information from your device (cookies, ' +
      'unique identifiers and other device data) may be stored by, accessed by and shared ' +
      'with {count} partners or used specifically by this app. We and our partners may use ' +
      'precise geolocation data.',
    'firstLayer.partners': 'List of partners.',
    'firstLayer.legInt':
      'Some vendors may process your personal data on the basis of legitimate interest, ' +
      'which you can object to by managing your options below.',

    // Manage layer
    'manage.title': 'Manage your data',
    'manage.subtitle': 'You can choose how your personal data is used.',
    'tab.categories': 'Categories',
    'tab.services': 'Services',

    // Buttons
    'btn.consent': 'Consent',
    'btn.manage': 'Manage options',
    'btn.acceptAll': 'Accept all',
    'btn.confirm': 'Confirm choices',

    // Links
    'link.privacyPolicy': 'Privacy Policy',
    'link.legalNotice': 'Legal Notice',
    'link.privacyPolicyOf': 'Click here to read the privacy policy of the data processor',
    'link.cookiePolicyOf': 'Click here to read the cookie policy of the data processor',
    'link.optOutOf': 'Click here to opt out from this processor across all domains',

    // Detail section headers + hints
    'section.description': 'Description of Service',
    'section.company': 'Processing Company',
    'section.purposes': 'Data Purposes',
    'section.purposes.hint': 'This list represents the purposes of the data collection and processing.',
    'section.technologies': 'Technologies Used',
    'section.technologies.hint': 'This list represents all technologies this service uses to collect data.',
    'section.dataCollected': 'Data Collected',
    'section.dataCollected.hint':
      'This list represents all (personal) data that is collected by or through the use of this service.',
    'section.legalBasis': 'Legal Basis',
    'section.legalBasis.hint': 'In the following the required legal basis for the processing of data is listed.',
    'section.location': 'Location of Processing',
    'section.retention': 'Retention Period',
    'section.transfer': 'Transfer to Third Countries',
    'section.transfer.hint':
      'This service may forward the collected data to a different country. Please note that this ' +
      'service might transfer the data to a country without the required data protection standards. ' +
      'Below you can find a list of countries to which the data is being transferred. For more ' +
      "information regarding safeguards please refer to the provider's privacy policy or contact " +
      'the provider directly.',
    'section.recipients': 'Data Recipients',
  },

  categories: {
    marketing: {
      name: 'Marketing',
      description: 'These technologies are used by advertisers to serve ads that are relevant to your interests.',
    },
    functional: {
      name: 'Functional',
      description: 'These technologies enable us to analyse usage behavior in order to measure and improve performance.',
    },
    essential: {
      name: 'Essential',
      description: 'These technologies are required to activate the core functionality of our service.',
    },
  },

  purposes: {
    advertisement: 'Advertisement',
    improvement_of_service: 'Improvement of service',
    marketing: 'Marketing',
    create_personalised_ads_profile: 'Create personalised ads profile',
    reportings: 'Reportings',
    segmentation: 'Segmentation',
    optimization: 'Optimization',
    providing_service: 'Providing Service',
    statistics: 'Statistics',
    analytics: 'Analytics',
    compliance_legal_obligations: 'Compliance with legal obligations',
    functionality: 'Functionality',
    website_security: 'Website security',
    personalisation: 'Personalisation',
    sign_up_features: 'Sign up features',
    authentication: 'Authentication',
    product_development: 'Product development',
    consent_storage: 'Consent storage',
    payment: 'Payment',
    transaction_tracking: 'Transaction tracking',
    tracking: 'Tracking',
    detecting_code_errors: 'Detecting code errors',
    develop_improve_products: 'Develop and improve products',
  },

  technologies: {
    cookies: 'Cookies',
    tracking_code: 'Tracking code',
    web_beacons: 'Web beacons',
    mobile_sdks: 'Mobile SDKs',
    pixel: 'Pixel',
    local_storage: 'Local storage',
  },

  dataCategories: {
    advertising_identifier: 'Advertising identifier',
    gaid: 'Android/Google Advertising ID',
    country: 'Country',
    device_information: 'Device information',
    ip_address: 'IP address',
    user_behaviour: 'User behaviour',
    language_information: 'Language information',
    purchase_information: 'Purchase information',
    device_id: 'Device ID',
    unique_id: 'Unique ID',
    user_id: 'User ID',
    last_name: 'Last name',
    first_name: 'First name',
    email_address: 'E-mail address',
    contact_information: 'Contact information',
    address: 'Address',
    bank_details: 'Bank details',
    account_information: 'Account information',
    data_identifiers: 'Data identifiers',
    usage_data: 'Usage data',
    referrer_url: 'Referrer URL',
    location_information: 'Location information',
    date_and_time_of_visit: 'Date and time of visit',
    facebook_user_id: 'Facebook user ID',
    websites_visited: 'Websites visited',
    geographic_location: 'Geographic location',
    preferences: 'Preferences',
    website_interaction: 'Website interaction',
    transaction_information: 'Transaction information',
    device_operating_system: 'Device operating system',
    browser_type: 'Browser type',
    click_path: 'Click path',
    cookie_id: 'Cookie ID',
    information_from_third_party_sources: 'Information from third party sources',
    hardware_software_type: 'Hardware/software type',
    username: 'Username',
    identifiers: 'Identifiers',
    profile_information: 'Profile information',
    profile_picture: 'Profile picture',
    configuration_of_app_settings: 'Configuration of app settings',
    user_agent: 'User agent',
    app_crashes: 'App crashes',
    opt_in_opt_out_data: 'Opt-in and opt-out data',
    user_settings: 'User settings',
    consent_id: 'Consent ID',
    time_of_consent: 'Time of consent',
    consent_type: 'Consent type',
    template_version: 'Template version',
    banner_language: 'Banner language',
    anonymised_user_data: 'Anonymised user data',
    date_of_purchase: 'Date of purchase',
    purchase_activity: 'Purchase activity',
    credit_debit_card_number: 'Credit and debit card number',
    log_in_info: 'Log-in info',
    browser_information: 'Browser information',
    time_zone: 'Time zone',
    error_data: 'Error data',
  },

  legalBases: {
    art6_1_a: 'Art. 6 para. 1 s. 1 lit. a GDPR',
    art6_1_b: 'Art. 6 para. 1 s. 1 lit. b GDPR',
    art6_1_c: 'Art. 6 para. 1 s. 1 lit. c GDPR',
    art6_1_d: 'Art. 6 para. 1 s. 1 lit. d GDPR',
    art6_1_e: 'Art. 6 para. 1 s. 1 lit. e GDPR',
    art6_1_f: 'Art. 6 para. 1 s. 1 lit. f GDPR',
  },

  retention: {
    until_not_needed: 'The data will be deleted as soon as they are no longer needed for the processing purposes.',
    up_to_2_years: 'The data will be kept for up to 2 years.',
    consent_one_year:
      'The consent data (given consent and revocation of consent) are stored for one year. ' +
      'The data will then be deleted immediately.',
  },

  // Country names resolve via the platform's Intl.DisplayNames at runtime; only
  // overrides and non-ISO pseudo-codes (e.g. the EU) live here.
  countries: {
    EU: 'European Union',
    US: 'United States of America',
  },

  // Per-service descriptions live in the services config (ConsentService.description),
  // not here. This map stays available only as an optional localization override,
  // keyed by service id, and is empty by default.
  serviceDescriptions: {},
};
