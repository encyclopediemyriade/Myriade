// service-worker.js — L'application installable (étape ML7, 08/11/2026).
//
// Ce petit programme tourne en coulisse dans le navigateur, une fois le jeu ouvert depuis Internet
// (il ne sert à rien quand on ouvre jeu.html directement depuis le dossier du PC).
// Il garde une copie du jeu dans le téléphone : Myriade s'ouvre alors même sans réseau,
// et le navigateur accepte de l'installer comme une application (icône sur l'écran d'accueil).
//
// Trois règles :
//   1. Le programme et les données (« ?v=… ») : la copie gardée d'abord, le réseau sinon.
//      Le numéro de version change à chaque livraison, donc une nouvelle version est toujours rechargée.
//   2. La page jeu.html : le réseau d'abord (pour voir tout de suite une nouvelle version), la copie sinon.
//   3. Les photos, cris, silhouettes, pictos, empreintes : le réseau d'abord ; une copie est gardée
//      au passage, servie si le réseau manque ou tarde trop.
//
// NE PAS MODIFIER À LA MAIN la ligne VERSION ni la liste ESSENTIEL : Outils\changer_version.py les écrit.

const VERSION = "1.4.3";
const CACHE_JEU = "myriade-jeu-" + VERSION;   // le programme de CETTE version (effacé à la version suivante)
const CACHE_MEDIAS = "myriade-medias";        // photos et sons déjà vus (gardés d'une version à l'autre)
const ATTENTE_RESEAU = 4000;                  // en millisecondes : au-delà, on montre la copie gardée

// Ce qu'il faut pour jouer sans réseau (écrit par Outils\changer_version.py d'après jeu.html)
// DEBUT_ESSENTIEL
const ESSENTIEL = [
  "jeu.html",
  "Programme/style.css?v=1.4.3",
  "version.js?v=1.4.3",
  "especes.js?v=1.4.3",
  "cadrage.js?v=1.4.3",
  "territoires.js?v=1.4.3",
  "credits.js?v=1.4.3",
  "credits_silhouettes.js?v=1.4.3",
  "identite.js?v=1.4.3",
  "lieux_identite.js?v=1.4.3",
  "lieux_carte.js?v=1.4.3",
  "expeditions.js?v=1.4.3",
  "familles.js?v=1.4.3",
  "faits_questions.js?v=1.4.3",
  "Programme/01_questions.js?v=1.4.3",
  "Programme/02_progression.js?v=1.4.3",
  "Programme/03_questions_reponses.js?v=1.4.3",
  "Programme/04_fetes.js?v=1.4.3",
  "Programme/05_accueil.js?v=1.4.3",
  "Programme/06_encyclopedie.js?v=1.4.3",
  "Programme/07_parties.js?v=1.4.3",
  "Programme/08_petits_jeux.js?v=1.4.3",
  "Programme/09_rencontre.js?v=1.4.3",
  "Programme/10_premiere_visite.js?v=1.4.3",
  "Programme/11_commandes_test.js?v=1.4.3",
  "Programme/12_profil_badges.js?v=1.4.3",
  "Programme/15_territoire.js?v=1.4.3",
  "Programme/16_arcade.js?v=1.4.3",
  "Programme/17_expeditions.js?v=1.4.3",
  "Programme/20_formes.js?v=1.4.3",
  "Programme/21_insolites.js?v=1.4.3",
  "Programme/19_application.js?v=1.4.3",
  "Programme/13_demarrage.js?v=1.4.3",
  "Programme/14_clavier_menus.js?v=1.4.3",
  "Programme/18_cadrage.js?v=1.4.3",
  "manifest.webmanifest",
  "Images/myriade_icone.svg",
  "Images/myriade_logo.svg",
  "Images/icones/myriade_192.png",
  "Images/icones/myriade_512.png",
  "Images/icones/myriade_masque_512.png",
  "Images/icones/myriade_apple_180.png",
  "Polices/literata_latin-ext.woff2",
  "Polices/literata_latin.woff2",
  "Polices/worksans_latin-ext.woff2",
  "Polices/worksans_latin.woff2",
];
// FIN_ESSENTIEL

// Installation : on range l'essentiel. Une version neuve prend la place de l'ancienne sans attendre.
self.addEventListener("install", evenement => {
  evenement.waitUntil(
    caches.open(CACHE_JEU)
      .then(cache => cache.addAll(ESSENTIEL))
      .then(() => self.skipWaiting())
  );
});

// Activation : on efface le programme des versions précédentes (les photos sont gardées).
self.addEventListener("activate", evenement => {
  evenement.waitUntil(
    caches.keys()
      .then(noms => Promise.all(noms
        .filter(nom => nom.startsWith("myriade-jeu-") && nom !== CACHE_JEU)
        .map(nom => caches.delete(nom))))
      .then(() => self.clients.claim())
  );
});

function estMedia(url) {
  return /\/(Images|Sons|Silhouettes|Pictos|Empreintes|Polices)\//.test(url.pathname);
}

// Le réseau d'abord ; la copie gardée si le réseau échoue (ou tarde, quand une copie existe).
async function reseauDabord(requete, nomCache) {
  const cache = await caches.open(nomCache);
  const copie = await caches.match(requete, { ignoreSearch: true });   // dans n'importe quelle réserve
  const reseau = fetch(requete).then(reponse => {
    if (reponse && reponse.ok && reponse.type === "basic") cache.put(requete, reponse.clone());
    return reponse;
  });
  if (!copie) return reseau;
  const delai = new Promise(resoudre => setTimeout(() => resoudre(copie), ATTENTE_RESEAU));
  return Promise.race([reseau.catch(() => copie), delai]);
}

// La copie gardée d'abord ; le réseau sinon (et on la garde pour la prochaine fois).
async function copieDabord(requete) {
  const cache = await caches.open(CACHE_JEU);
  const copie = await cache.match(requete);
  if (copie) return copie;
  const reponse = await fetch(requete);
  if (reponse && reponse.ok && reponse.type === "basic") cache.put(requete, reponse.clone());
  return reponse;
}

self.addEventListener("fetch", evenement => {
  const requete = evenement.request;
  if (requete.method !== "GET") return;
  const url = new URL(requete.url);
  if (url.origin !== self.location.origin) return;   // les liens vers d'autres sites ne sont pas touchés

  if (requete.mode === "navigate" || url.pathname.endsWith(".html") || url.pathname.endsWith("/")) {
    evenement.respondWith(
      fetch(requete)
        .then(reponse => {
          if (reponse && reponse.ok && reponse.type === "basic" && url.pathname.endsWith("jeu.html")) {
            const double = reponse.clone();
            caches.open(CACHE_JEU).then(c => c.put("jeu.html", double));
          }
          return reponse;
        })
        .catch(() => caches.match("jeu.html", { ignoreSearch: true }))
    );
    return;
  }
  if (estMedia(url)) { evenement.respondWith(reseauDabord(requete, CACHE_MEDIAS)); return; }
  evenement.respondWith(copieDabord(requete));
});
