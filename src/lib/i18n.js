// ChildShield — UI Translations
// Languages: en (English), fr (French), pe (Cameroonian Pidgin English)

export const translations = {

  // ── Navigation ─────────────────────────────────────────────────────────────
  nav: {
    home:       { en: 'Home',       fr: 'Accueil',         pe: 'Home' },
    safeZones:  { en: 'Safe Zones', fr: 'Zones Sûres',     pe: 'Safe Place' },
    report:     { en: 'Report',     fr: 'Signaler',        pe: 'Report' },
    dashboard:  { en: 'Dashboard',  fr: 'Tableau de Bord', pe: 'Dashboard' },
    getHelp:    { en: 'Get Help',   fr: 'Aide',            pe: 'Find Help' },
    missing:    { en: 'Missing Child', fr: 'Enfant Disparu', pe: 'Pikin Don Lost' },
  },

  // ── Home page ──────────────────────────────────────────────────────────────
  home: {
    reportBtn:      { en: 'Report Missing Child',                    fr: 'Signaler un Enfant Disparu',          pe: 'Report Say Pikin Don Lost' },
    reportBtnSub:   { en: 'Tap to trigger community alert instantly', fr: 'Appuyez pour alerter la communauté', pe: 'Press here make community know' },
    active:         { en: 'Active',      fr: 'Actifs',       pe: 'Active' },
    resolved:       { en: 'Resolved',    fr: 'Résolus',      pe: 'Done' },
    guardians:      { en: 'Guardians',   fr: 'Gardiens',     pe: 'Community' },
    activeAlerts:   { en: 'Active Alerts',          fr: 'Alertes en Cours',    pe: 'Current Alert Dem' },
    recentlyFound:  { en: 'Recently Resolved',      fr: 'Récemment Résolus',   pe: 'Pikin Dem Wey Dem Don Find' },
    quickActions:   { en: 'Quick Actions',           fr: 'Actions Rapides',     pe: 'Quick Action' },
    reportIncident: { en: 'Report Incident',         fr: 'Signaler un Incident', pe: 'Report Wahala' },
    suspiciousActivity: { en: 'Suspicious activity', fr: 'Activité suspecte',   pe: 'Suspicious person' },
    safeReporting:  { en: 'Safe Reporting',          fr: 'Signalement Sûr',     pe: 'Report Safe' },
    sexualAbuse:    { en: 'Sexual abuse',             fr: 'Abus sexuel',         pe: 'Bad touch report' },
    findSupport:    { en: 'Find support',             fr: 'Trouver du soutien',  pe: 'Find help' },
    botOnline:      { en: 'Online 24/7',              fr: 'En ligne 24h/24',     pe: 'Online all time' },
    avgResponse:    { en: 'Average community response time', fr: 'Temps de réponse communautaire moyen', pe: 'How fast community respond' },
    locationNotice: { en: 'Showing alerts near you', fr: 'Alertes près de chez vous', pe: 'Alert near your area' },
  },

  // ── New Alert form ─────────────────────────────────────────────────────────
  alert: {
    title:        { en: 'Missing Child Alert',       fr: 'Alerte Enfant Disparu',   pe: 'Alert: Pikin Don Lost' },
    step:         { en: 'Step',                      fr: 'Étape',                   pe: 'Step' },
    of:           { en: 'of',                        fr: 'sur',                     pe: 'of' },
    photoHint:    { en: "Upload child's photo (optional but recommended)", fr: 'Télécharger la photo (optionnel mais recommandé)', pe: 'Upload pikin photo (e go help)' },
    uploadPhoto:  { en: 'Upload Photo',              fr: 'Télécharger Photo',        pe: 'Add Photo' },
    changePhoto:  { en: 'Change Photo',              fr: 'Changer Photo',            pe: 'Change Photo' },
    fullName:     { en: "Child's Full Name",         fr: 'Nom Complet de l\'Enfant', pe: 'Pikin Full Name' },
    namePlaceholder: { en: 'e.g. Amara Tchinda',    fr: 'ex. Amara Tchinda',        pe: 'e.g. Amara Tchinda' },
    age:          { en: 'Age',                       fr: 'Âge',                      pe: 'Age' },
    gender:       { en: 'Gender',                    fr: 'Sexe',                     pe: 'Boy or Girl' },
    male:         { en: 'Male',                      fr: 'Masculin',                 pe: 'Boy' },
    female:       { en: 'Female',                    fr: 'Féminin',                  pe: 'Girl' },
    selectGender: { en: 'Select',                    fr: 'Choisir',                  pe: 'Choose' },
    description:  { en: 'Description',              fr: 'Description',              pe: 'How E Look' },
    descPlaceholder: { en: 'Clothing, hair, any distinguishing features', fr: 'Vêtements, coiffure, signes distinctifs', pe: 'Wetin e wear, hair, any mark wey e get' },
    nextLocation: { en: 'Next: Last Known Location →', fr: 'Suivant: Dernier Lieu Vu →', pe: 'Continue: Where Dem Last See Am →' },
    lastSeenArea: { en: 'Last Seen Area',            fr: 'Dernière Zone Vue',        pe: 'Last Place Dem See Am' },
    additionalDetails: { en: 'Any Additional Location Details', fr: 'Détails Supplémentaires', pe: 'Any other thing about location' },
    nextContact:  { en: 'Next: Contact Info →',     fr: 'Suivant: Contact →',       pe: 'Continue: Contact Info →' },
    yourName:     { en: 'Your Name / Relationship', fr: 'Votre Nom / Relation',     pe: 'Your Name / How You Know Di Pikin' },
    contact:      { en: 'Contact Number',            fr: 'Numéro de Contact',        pe: 'Phone Number' },
    summary:      { en: 'Alert Summary',             fr: 'Résumé de l\'Alerte',      pe: 'Summary of Alert' },
    sendAlert:    { en: 'Send Alert Now',            fr: 'Envoyer l\'Alerte',        pe: 'Send Alert Now' },
    back:         { en: '← Back',                   fr: '← Retour',                 pe: '← Go Back' },
    alertSent:    { en: 'Alert Sent!',               fr: 'Alerte Envoyée!',          pe: 'Alert Don Send!' },
    alertSentSub: { en: 'The community has been notified.', fr: 'La communauté a été notifiée.', pe: 'Community don hear.' },
    viewShare:    { en: 'View Alert & Share on WhatsApp', fr: 'Voir & Partager sur WhatsApp', pe: 'See Alert & Share for WhatsApp' },
    backHome:     { en: 'Back to Home',              fr: 'Retour à l\'Accueil',      pe: 'Go Back Home' },
    photoAttached:{ en: 'Photo attached',            fr: 'Photo jointe',             pe: 'Photo dey' },
  },

  // ── Report Incident form ────────────────────────────────────────────────────
  report: {
    title:          { en: 'Report Incident',          fr: 'Signaler un Incident',    pe: 'Report Wahala' },
    anonymous:      { en: 'All reports are anonymous', fr: 'Tous les rapports sont anonymes', pe: 'Nobody go know say na you report' },
    incidentType:   { en: 'Type of Incident',         fr: 'Type d\'Incident',         pe: 'Wetin Happen' },
    location:       { en: 'Location',                 fr: 'Lieu',                    pe: 'Where E Happen' },
    whatHappened:   { en: 'What happened?',           fr: 'Que s\'est-il passé?',    pe: 'Wetin Happen?' },
    submit:         { en: 'Submit Anonymous Report',  fr: 'Soumettre le Rapport',    pe: 'Send Report' },
    received:       { en: 'Report Received',          fr: 'Rapport Reçu',            pe: 'Dem Don Receive Your Report' },
  },

  // ── Common ─────────────────────────────────────────────────────────────────
  common: {
    submit:     { en: 'Submit',     fr: 'Soumettre',  pe: 'Send' },
    cancel:     { en: 'Cancel',     fr: 'Annuler',    pe: 'No Do' },
    continue:   { en: 'Continue',   fr: 'Continuer',  pe: 'Continue' },
    back:       { en: 'Back',       fr: 'Retour',     pe: 'Go Back' },
    share:      { en: 'Share',      fr: 'Partager',   pe: 'Share' },
    resolve:    { en: 'Child Found', fr: 'Enfant Retrouvé', pe: 'Dem Don Find Pikin' },
    loading:    { en: 'Loading…',   fr: 'Chargement…', pe: 'E dey load…' },
    notFound:   { en: 'Alert not found', fr: 'Alerte introuvable', pe: 'Alert no dey' },
    viewDetails:{ en: 'View Details', fr: 'Voir Détails', pe: 'See More' },
    active:     { en: 'active',     fr: 'actif',      pe: 'active' },
  },
}

// ── Hook + context ─────────────────────────────────────────────────────────

const LANG_KEY = 'childshield_lang'

export function getLang() {
  return localStorage.getItem(LANG_KEY) || 'en'
}

export function setLang(lang) {
  localStorage.setItem(LANG_KEY, lang)
}

export function t(section, key) {
  const lang = getLang()
  return translations[section]?.[key]?.[lang]
    ?? translations[section]?.[key]?.['en']
    ?? key
}
