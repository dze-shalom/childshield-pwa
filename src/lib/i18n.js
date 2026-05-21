// ChildShield — UI Translations
// en = English | fr = French | pe = Cameroonian Pidgin English

export const translations = {

  nav: {
    home:      { en: 'Home',       fr: 'Accueil',         pe: 'Home' },
    safeZones: { en: 'Safe Zones', fr: 'Zones Sûres',     pe: 'Safe Place' },
    report:    { en: 'Report',     fr: 'Signaler',        pe: 'Report' },
    dashboard: { en: 'Dashboard',  fr: 'Tableau de Bord', pe: 'Dashboard' },
    getHelp:   { en: 'Get Help',   fr: 'Aide',            pe: 'Find Help' },
    missing:   { en: 'Missing Child', fr: 'Enfant Disparu', pe: 'Pikin Don Lost' },
  },

  home: {
    reportBtn:     { en: 'Report Missing Child',                     fr: 'Signaler un Enfant Disparu',          pe: 'Report Say Pikin Don Lost' },
    reportBtnSub:  { en: 'Tap to trigger community alert instantly',  fr: 'Appuyez pour alerter la communauté',  pe: 'Press here make community know' },
    active:        { en: 'Active',     fr: 'Actifs',      pe: 'Active' },
    resolved:      { en: 'Resolved',   fr: 'Résolus',     pe: 'Done' },
    guardians:     { en: 'Guardians',  fr: 'Gardiens',    pe: 'Community' },
    activeAlerts:  { en: 'Active Alerts',       fr: 'Alertes en Cours',    pe: 'Current Alert Dem' },
    recentlyFound: { en: 'Recently Resolved',   fr: 'Récemment Résolus',   pe: 'Pikin Dem Wey Dem Don Find' },
    quickActions:  { en: 'Quick Actions',        fr: 'Actions Rapides',     pe: 'Quick Action' },
    reportIncident:{ en: 'Report Incident',      fr: 'Signaler Incident',   pe: 'Report Wahala' },
    suspiciousActivity: { en: 'Suspicious activity', fr: 'Activité suspecte', pe: 'Suspicious person' },
    safeReporting: { en: 'Safe Reporting',       fr: 'Signalement Sûr',     pe: 'Report Safe' },
    sexualAbuse:   { en: 'Sexual abuse',          fr: 'Abus sexuel',         pe: 'Bad touch report' },
    findSupport:   { en: 'Find support',          fr: 'Trouver du soutien',  pe: 'Find help' },
    botOnline:     { en: 'Online 24/7',           fr: 'En ligne 24h/24',     pe: 'Online all time' },
    avgResponse:   { en: 'Average community response time', fr: 'Temps de réponse moyen', pe: 'How fast community respond' },
  },

  alert: {
    title:       { en: 'Missing Child Alert',       fr: 'Alerte Enfant Disparu',     pe: 'Alert: Pikin Don Lost' },
    step:        { en: 'Step',                      fr: 'Étape',                     pe: 'Step' },
    of:          { en: 'of',                        fr: 'sur',                       pe: 'of' },
    photoHint:   { en: "Upload child's photo (optional but recommended)", fr: 'Photo de l\'enfant (optionnel mais recommandé)', pe: 'Upload pikin photo (e go help)' },
    uploadPhoto: { en: 'Upload Photo',              fr: 'Ajouter Photo',             pe: 'Add Photo' },
    changePhoto: { en: 'Change Photo',              fr: 'Changer Photo',             pe: 'Change Photo' },
    photo:       { en: 'Photo',                     fr: 'Photo',                     pe: 'Photo' },
    fullName:    { en: "Child's Full Name *",        fr: 'Nom Complet de l\'Enfant *', pe: 'Pikin Full Name *' },
    namePH:      { en: 'e.g. Amara Tchinda',        fr: 'ex. Amara Tchinda',         pe: 'e.g. Amara Tchinda' },
    age:         { en: 'Age *',                     fr: 'Âge *',                     pe: 'Age *' },
    gender:      { en: 'Gender *',                  fr: 'Sexe *',                    pe: 'Boy or Girl *' },
    male:        { en: 'Male',                      fr: 'Masculin',                  pe: 'Boy' },
    female:      { en: 'Female',                    fr: 'Féminin',                   pe: 'Girl' },
    select:      { en: 'Select',                    fr: 'Choisir',                   pe: 'Choose' },
    description: { en: 'Description *',             fr: 'Description *',             pe: 'How E Look *' },
    descPH:      { en: 'Clothing, hair, any distinguishing features (scars, birthmarks, etc)', fr: 'Vêtements, coiffure, signes distinctifs', pe: 'Wetin e wear, hair, any mark wey e get' },
    nextLocation:{ en: 'Next: Last Known Location →', fr: 'Suivant: Dernier Lieu Vu →', pe: 'Continue: Where Dem Last See Am →' },
    lastSeenArea:{ en: 'Last Seen Area *',          fr: 'Dernière Zone Vue *',       pe: 'Last Place Dem See Am *' },
    selectArea:  { en: 'Select area...',            fr: 'Choisir une zone...',       pe: 'Choose area...' },
    moreDetails: { en: 'Any Additional Location Details', fr: 'Détails Supplémentaires sur le Lieu', pe: 'Any other thing about location' },
    moreDetailsPH:{ en: 'Near the roundabout, behind the church...', fr: 'Près du rond-point, derrière l\'église...', pe: 'Near roundabout, behind church...' },
    whatsappNote:{ en: 'After submission, a pre-formatted WhatsApp message will be ready to share.', fr: 'Après soumission, un message WhatsApp formaté sera prêt à partager.', pe: 'After you send, WhatsApp message go ready to share.' },
    nextContact: { en: 'Next: Contact Info →',     fr: 'Suivant: Contact →',        pe: 'Continue: Contact →' },
    yourName:    { en: 'Your Name / Relationship *', fr: 'Votre Nom / Relation *',  pe: 'Your Name / How You Know Di Pikin *' },
    yourNamePH:  { en: 'e.g. Parent - Mama Tchinda', fr: 'ex. Parent - Maman Tchinda', pe: 'e.g. Parent - Mama Tchinda' },
    contactNum:  { en: 'Contact Number *',          fr: 'Numéro de Contact *',      pe: 'Phone Number *' },
    summary:     { en: 'Alert Summary',             fr: 'Résumé de l\'Alerte',      pe: 'Summary of Alert' },
    photoAttached:{ en: 'Photo attached',           fr: 'Photo jointe',             pe: 'Photo dey' },
    falseAlert:  { en: 'This alert will be sent to all verified ChildShield users in your area. False alerts may be subject to review.', fr: 'Cette alerte sera envoyée à tous les utilisateurs ChildShield vérifiés dans votre zone. Les fausses alertes peuvent être examinées.', pe: 'Dis alert go reach all ChildShield people for your area. False alert go reviewed.' },
    back:        { en: '← Back',                   fr: '← Retour',                 pe: '← Go Back' },
    send:        { en: 'Send Alert Now',            fr: 'Envoyer l\'Alerte Maintenant', pe: 'Send Alert Now' },
    sent:        { en: 'Alert Sent!',               fr: 'Alerte Envoyée!',          pe: 'Alert Don Send!' },
    sentSub:     { en: 'The community has been notified.', fr: 'La communauté a été notifiée.', pe: 'Community don hear.' },
    viewShare:   { en: 'View Alert & Share on WhatsApp', fr: 'Voir & Partager sur WhatsApp', pe: 'See Alert & Share for WhatsApp' },
    backHome:    { en: 'Back to Home',              fr: 'Retour à l\'Accueil',      pe: 'Go Back Home' },
  },

  detail: {
    title:        { en: 'Alert Details',           fr: 'Détails de l\'Alerte',     pe: 'Alert Details' },
    share:        { en: 'Share',                   fr: 'Partager',                 pe: 'Share' },
    missing:      { en: 'MISSING — HELP FIND THIS CHILD', fr: 'DISPARU — AIDEZ À RETROUVER CET ENFANT', pe: 'PIKIN DON LOST — HELP FIND AM' },
    resolved:     { en: 'CHILD FOUND — RESOLVED',  fr: 'ENFANT RETROUVÉ — RÉSOLU', pe: 'DEM DON FIND PIKIN — DONE' },
    foundPrompt:  { en: 'Child has been found? Let the community know', fr: 'L\'enfant a été retrouvé? Informez la communauté', pe: 'Dem don find pikin? Make community know' },
    reportFound:  { en: 'Report Child Found',      fr: 'Signaler Enfant Retrouvé', pe: 'Report Say Dem Find Pikin' },
    howFound:     { en: 'found?',                  fr: 'retrouvé(e)?',             pe: 'dem find am?' },
    thankYouMsg:  { en: 'Message to the community (optional)', fr: 'Message pour la communauté (optionnel)', pe: 'Message for community (no must)' },
    thankYouPH:   { en: 'e.g. Thank you to everyone who shared this alert. {name} is safe and home now.', fr: 'ex. Merci à tous ceux qui ont partagé cette alerte.', pe: 'e.g. Thank una wey share dis alert. {name} don reach house safe.' },
    cancel:       { en: 'Cancel',                 fr: 'Annuler',                  pe: 'No Do' },
    confirmFound: { en: 'Confirm Child Found',    fr: 'Confirmer Enfant Retrouvé', pe: 'Confirm Say Dem Find Pikin' },
    foundSafe:    { en: 'has been found safe',    fr: 'a été retrouvé(e) sain(e) et sauf(ve)', pe: 'don reach house safe' },
    thankCommunity:{ en: 'Thank the community by sharing this message on WhatsApp.', fr: 'Remerciez la communauté en partageant ce message sur WhatsApp.', pe: 'Thank community by sharing dis message for WhatsApp.' },
    shareThankYou:{ en: 'Share Thank You on WhatsApp', fr: 'Partager Merci sur WhatsApp', pe: 'Share Thank You for WhatsApp' },
    backHome:     { en: 'Back to Home',           fr: 'Retour à l\'Accueil',      pe: 'Go Back Home' },
    lastSeen:     { en: 'Last Seen',              fr: 'Vu en Dernier',            pe: 'Last Place Dem See Am' },
    timeNotRec:   { en: 'Time not recorded',      fr: 'Heure non enregistrée',    pe: 'Time no dey' },
    description:  { en: 'Description',           fr: 'Description',              pe: 'How E Look' },
    contact:      { en: 'Contact',               fr: 'Contact',                  pe: 'Contact' },
    reported:     { en: 'Reported',              fr: 'Signalé',                  pe: 'Dem Report Am' },
    whatsappCta:  { en: 'Share on WhatsApp Status', fr: 'Partager sur WhatsApp Status', pe: 'Share for WhatsApp Status' },
    whatsappSub:  { en: 'Alert your contacts and increase visibility instantly', fr: 'Alertez vos contacts et augmentez la visibilité', pe: 'Tell your contacts, help find di pikin fast' },
    sightings:    { en: 'Community Sightings',   fr: 'Signalements Communauté',  pe: 'People Wey Don See Am' },
    sawChild:     { en: 'I saw this child',       fr: 'J\'ai vu cet enfant',      pe: 'I Don See Di Pikin' },
    noSightings:  { en: 'No sightings reported yet', fr: 'Aucun signalement pour l\'instant', pe: 'Nobody don see am yet' },
    noSightingsSub:{ en: 'Be the first to help — report if you see this child', fr: 'Soyez le premier à aider', pe: 'If you see am, please report' },
    reportSighting:{ en: 'Report a Sighting',    fr: 'Signaler une Observation', pe: 'Report Say You See Am' },
    locationPH:   { en: 'Location (e.g. near GS Buea Town)', fr: 'Lieu (ex. près de GS Buea Town)', pe: 'Where you see am (e.g. near GS Buea Town)' },
    sightingPH:   { en: 'What did you see? When? Any other details...', fr: 'Qu\'avez-vous vu? Quand? Autres détails...', pe: 'Wetin you see? When? Any other thing...' },
    submitSighting:{ en: 'Submit Sighting',      fr: 'Soumettre',                pe: 'Send Report' },
    sightingThanks:{ en: 'Sighting submitted! Thank you for helping.', fr: 'Signalement envoyé! Merci.', pe: 'E don send! Thank you for di help.' },
    notFound:     { en: 'Alert not found',       fr: 'Alerte introuvable',       pe: 'Alert no dey' },
    yearsOld:     { en: 'years old',             fr: 'ans',                      pe: 'years' },
  },

  report: {
    title:       { en: 'Report Incident',          fr: 'Signaler un Incident',      pe: 'Report Wahala' },
    exit:        { en: 'Exit',                     fr: 'Quitter',                   pe: 'Exit' },
    anonymous:   { en: 'All reports are anonymous — no login, no name, no identity stored.', fr: 'Tous les rapports sont anonymes — aucune connexion, aucun nom stocké.', pe: 'All report dem na anonymous — nobody go know say na you.' },
    sexual:      { en: 'Sexual Harassment or Abuse', fr: 'Harcèlement ou Abus Sexuel', pe: 'Bad Touch or Abuse' },
    sexualSub:   { en: 'Private confidential flow · Trained specialists only · Quick Exit', fr: 'Flux privé confidentiel · Spécialistes formés · Sortie Rapide', pe: 'Private · Only trained people go see am · Exit Quick' },
    type:        { en: 'Type of Incident *',       fr: 'Type d\'Incident *',        pe: 'Wetin Happen *' },
    location:    { en: 'Location *',               fr: 'Lieu *',                    pe: 'Where E Happen *' },
    selectLoc:   { en: 'Select area...',           fr: 'Choisir une zone...',       pe: 'Choose area...' },
    what:        { en: 'What happened? *',         fr: 'Que s\'est-il passé? *',    pe: 'Wetin Happen? *' },
    whatPH:      { en: 'Describe what you saw. Include the person\'s appearance, what they were doing, time, and exact location.', fr: 'Décrivez ce que vous avez vu. Apparence, actions, heure, lieu exact.', pe: 'Talk wetin you see. How di person look, wetin dem do, time and where.' },
    submit:      { en: 'Submit Anonymous Report',  fr: 'Soumettre le Rapport',      pe: 'Send Anonymous Report' },
    note:        { en: 'Reviewed by trained moderators within 2 hours', fr: 'Examiné par des modérateurs dans les 2 heures', pe: 'Trained people go check am within 2 hours' },
    received:    { en: 'Report Received',          fr: 'Rapport Reçu',              pe: 'Dem Don Receive Your Report' },
    receivedSub: { en: 'Your anonymous report has been submitted. A community moderator will review it within 2 hours.', fr: 'Votre rapport anonyme a été soumis. Un modérateur l\'examinera dans les 2 heures.', pe: 'Your anonymous report don go. Moderator go check am within 2 hours.' },
    backHome:    { en: 'Back to Home',             fr: 'Retour à l\'Accueil',       pe: 'Go Back Home' },
  },

  help: {
    title:        { en: 'Get Help Now',            fr: 'Obtenir de l\'Aide',        pe: 'Find Help Now' },
    quickExit:    { en: 'Quick Exit',              fr: 'Sortie Rapide',             pe: 'Exit Quick' },
    privacy:      { en: 'This page does not store your visit. Use Quick Exit to leave immediately.', fr: 'Cette page ne stocke pas votre visite. Utilisez Sortie Rapide pour partir immédiatement.', pe: 'Dis page no save your visit. Press Exit Quick make you comot fast.' },
    emergency:    { en: 'Emergency Numbers',       fr: 'Numéros d\'Urgence',        pe: 'Emergency Numbers' },
    sexAbuse:     { en: 'Sexual Harassment & Abuse', fr: 'Harcèlement & Abus Sexuels', pe: 'Bad Touch & Abuse' },
    reportAbuse:  { en: 'Report Sexual Abuse — Safe & Private', fr: 'Signaler Abus Sexuel — Sûr & Privé', pe: 'Report Bad Touch — Safe & Private' },
    reportAbuseSub:{ en: 'Confidential flow · Trained specialists only · Quick Exit available', fr: 'Flux confidentiel · Spécialistes formés uniquement', pe: 'E dey private · Only trained people go see am' },
    stepByStep:   { en: 'Step-by-Step Guidance',  fr: 'Guide Étape par Étape',     pe: 'Step by Step Help' },
    childVoice:   { en: 'Chat with ChildVoice',   fr: 'Discuter avec ChildVoice',  pe: 'Talk to ChildVoice for WhatsApp' },
    childVoiceSub:{ en: 'Anonymous WhatsApp support · Available 24/7', fr: 'Support WhatsApp anonyme · 24h/24', pe: 'Anonymous WhatsApp support · Dey 24/7' },
    footer:       { en: 'In a life-threatening emergency, always call 17 first', fr: 'En cas d\'urgence vitale, appelez toujours le 17 en premier', pe: 'If e dey serious, call 17 first' },
  },

  notification: {
    title:  { en: 'Enable missing child alerts',  fr: 'Activer les alertes enfant disparu', pe: 'Allow Missing Pikin Alert' },
    body:   { en: 'Get instant browser notifications when a child is reported missing in your area.', fr: 'Recevez des notifications quand un enfant est signalé disparu près de chez vous.', pe: 'Make your phone tell you when pikin don lost near you.' },
    enable: { en: 'Enable',  fr: 'Activer',  pe: 'Allow' },
  },

  install: {
    iphone:      { en: 'Install on iPhone',      fr: 'Installer sur iPhone',   pe: 'Put am for iPhone' },
    android:     { en: 'Install on Android',     fr: 'Installer sur Android',  pe: 'Put am for Android' },
    installCs:   { en: 'Install ChildShield',    fr: 'Installer ChildShield',  pe: 'Download ChildShield' },
    installSub:  { en: 'Add to home screen for instant access', fr: 'Ajouter à l\'écran d\'accueil', pe: 'Put for homescreen make you open am fast' },
    install:     { en: 'Install',  fr: 'Installer',  pe: 'Add' },
    how:         { en: 'How?',     fr: 'Comment?',   pe: 'How?' },
  },

  card: {
    viewDetails: { en: 'View Details', fr: 'Voir Détails', pe: 'See More' },
    share:       { en: 'Share',        fr: 'Partager',     pe: 'Share' },
  },
}

// ── Array translations (steps, lists) ────────────────────────────────────────

export const arrTranslations = {
  install: {
    iosSteps: {
      en: ['Open this page in Safari (not Chrome)', 'Tap the Share icon at the bottom of the screen', 'Scroll down and tap "Add to Home Screen"', 'Tap "Add" — done!'],
      fr: ['Ouvrez cette page dans Safari (pas Chrome)', 'Appuyez sur l\'icône Partager en bas', 'Faites défiler et appuyez sur "Sur l\'écran d\'accueil"', 'Appuyez sur "Ajouter" — terminé!'],
      pe: ['Open dis page for Safari (no be Chrome)', 'Press di Share button wey dey bottom', 'Scroll down, press "Add to Home Screen"', 'Press "Add" — e don ready!'],
    },
    androidSteps: {
      en: ['Tap the three-dot menu in the top-right corner of Chrome', 'Tap "Add to Home screen" or "Install app"', 'Tap "Add" to confirm'],
      fr: ['Appuyez sur le menu trois points en haut à droite', 'Appuyez sur "Ajouter à l\'écran d\'accueil"', 'Appuyez sur "Ajouter" pour confirmer'],
      pe: ['Press di three dot for top right of Chrome', 'Press "Add to Home screen" or "Install app"', 'Press "Add" to confirm'],
    },
  },

  help: {
    whatToDo: {
      en: [
        { title: 'I need to report abuse right now', steps: ['Call 17 (Police) immediately', 'Go to the nearest police station with a gender desk', 'You will not be judged — police are trained to help'] },
        { title: 'A child told me something happened', steps: ['Believe them — children rarely lie about abuse', 'Stay calm, do not question them intensively', 'Call Child Protection Hotline: +237 222 22 40 40', 'Take them to the nearest hospital for a check-up'] },
        { title: 'I am a child and I need help', steps: ['You are not alone and this is not your fault', 'Go to the nearest school, church, or police station', 'Tell any adult you trust what happened', 'Call 17 — they will help even if you have no credit'] },
      ],
      fr: [
        { title: 'Je dois signaler un abus maintenant', steps: ['Appelez le 17 (Police) immédiatement', 'Allez au poste de police le plus proche avec un bureau genre', 'Vous ne serez pas jugé — la police est formée pour aider'] },
        { title: 'Un enfant m\'a dit que quelque chose s\'est passé', steps: ['Croyez-le — les enfants mentent rarement sur les abus', 'Restez calme, ne l\'interrogez pas intensivement', 'Appelez la Hotline Protection Enfant: +237 222 22 40 40', 'Emmenez-le à l\'hôpital le plus proche'] },
        { title: 'Je suis un enfant et j\'ai besoin d\'aide', steps: ['Tu n\'es pas seul et ce n\'est pas ta faute', 'Va à l\'école, l\'église ou au poste de police le plus proche', 'Parle à un adulte de confiance', 'Appelle le 17 — ils aideront même sans crédit'] },
      ],
      pe: [
        { title: 'I want report abuse right now', steps: ['Call 17 (Police) now now', 'Go nearest police station wey get gender desk', 'No shame — police dem know how to help'] },
        { title: 'Pikin tell me say something happen', steps: ['Believe di pikin — pikin no dey lie about abuse', 'Stay calm, no ask too much question', 'Call Child Protection Hotline: +237 222 22 40 40', 'Take am go hospital'] },
        { title: 'Na me be di pikin and I need help', steps: ['You no dey alone and e no be your fault', 'Go nearest school, church or police station', 'Tell any adult wey you trust wetin happen', 'Call 17 — dem go help even if you no get credit'] },
      ],
    },
  },
}

// ── Core helpers ──────────────────────────────────────────────────────────────

const LANG_KEY = 'childshield_lang'

export function getLang() {
  try { return localStorage.getItem(LANG_KEY) || 'en' } catch { return 'en' }
}

export function setLang(lang) {
  try { localStorage.setItem(LANG_KEY, lang) } catch {}
}

export function t(section, key) {
  const lang = getLang()
  return translations[section]?.[key]?.[lang]
    ?? translations[section]?.[key]?.en
    ?? key
}

export function tArr(section, key) {
  const lang = getLang()
  return arrTranslations[section]?.[key]?.[lang]
    ?? arrTranslations[section]?.[key]?.en
    ?? []
}
