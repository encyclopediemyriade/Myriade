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
//   3. Les photos, cris, silhouettes, pictos, empreintes : la copie gardée d'abord, tout de suite ; le réseau la remet
//      à jour en arrière-plan (au cas où le fichier aurait changé), une fois par version (R264). Sans copie : le réseau,
//      et on la garde au passage.
//      (Étape R193, n° 11.8 : avant, chaque photo attendait le réseau même déjà gardée, d'où les photos de
//       l'encyclopédie qui apparaissaient une par une.)
//
// NE PAS MODIFIER À LA MAIN la ligne VERSION ni la liste ESSENTIEL : Outils\changer_version.py les écrit.

const VERSION = "1.37.0";
const CACHE_JEU = "myriade-jeu-" + VERSION;   // le programme de CETTE version (effacé à la version suivante)
const CACHE_MEDIAS = "myriade-medias";        // photos et sons déjà vus (gardés d'une version à l'autre)
const ATTENTE_RESEAU = 1500;                  // en millisecondes : au-delà, on montre la copie gardée (R239b, 36.03 : 4 s avant ; la
                                              // nouvelle version continue d'arriver en arrière-plan et sert au lancement suivant)

// Ce qu'il faut pour jouer sans réseau (écrit par Outils\changer_version.py d'après jeu.html)
// DEBUT_ESSENTIEL
const ESSENTIEL = [
  "jeu.html",
  "Programme/style.css?v=1.37.0",
  "version.js?v=1.37.0",
  "especes.js?v=1.37.0",
  "verif_photos.js?v=1.37.0",
  "reperes.js?v=1.37.0",
  "cadrage.js?v=1.37.0",
  "territoires.js?v=1.37.0",
  "credits.js?v=1.37.0",
  "credits_silhouettes.js?v=1.37.0",
  "identite.js?v=1.37.0",
  "lieux_identite.js?v=1.37.0",
  "lieux_carte.js?v=1.37.0",
  "expeditions.js?v=1.37.0",
  "rarete.js?v=1.37.0",
  "liens_especes.js?v=1.37.0",
  "liens_elements.js?v=1.37.0",
  "comparees_verifiees.js?v=1.37.0",
  "familles.js?v=1.37.0",
  "faits_questions.js?v=1.37.0",
  "moments.js?v=1.37.0",
  "empreintes_tailles.js?v=1.37.0",
  "photos_moyennes.js?v=1.37.0",
  "Programme/01_questions.js?v=1.37.0",
  "Programme/02_progression.js?v=1.37.0",
  "Programme/03_questions_reponses.js?v=1.37.0",
  "Programme/04_fetes.js?v=1.37.0",
  "Programme/05_accueil.js?v=1.37.0",
  "Programme/06_encyclopedie.js?v=1.37.0",
  "Programme/07_parties.js?v=1.37.0",
  "Programme/08_petits_jeux.js?v=1.37.0",
  "Programme/09_rencontre.js?v=1.37.0",
  "Programme/10_premiere_visite.js?v=1.37.0",
  "Programme/11_commandes_test.js?v=1.37.0",
  "Programme/12_profil_badges.js?v=1.37.0",
  "Programme/15_territoire.js?v=1.37.0",
  "Programme/16_arcade.js?v=1.37.0",
  "Programme/17_expeditions.js?v=1.37.0",
  "Programme/20_formes.js?v=1.37.0",
  "Programme/21_insolites.js?v=1.37.0",
  "Programme/26_ensemble.js?v=1.37.0",
  "relief_carte.js?v=1.37.0",
  "Programme/25_carte.js?v=1.37.0",
  "Programme/19_application.js?v=1.37.0",
  "Programme/32_rarete.js?v=1.37.0",
  "Programme/13_demarrage.js?v=1.37.0",
  "Programme/14_clavier_menus.js?v=1.37.0",
  "Programme/18_cadrage.js?v=1.37.0",
  "Programme/23_reperes.js?v=1.37.0",
  "Programme/24_coup_doeil.js?v=1.37.0",
  "Programme/27_defi_exp.js?v=1.37.0",
  "Programme/28_oreille.js?v=1.37.0",
  "Programme/29_approfondir.js?v=1.37.0",
  "Programme/30_signaler.js?v=1.37.0",
  "Programme/31_sous_le_pouce.js?v=1.37.0",
  "Programme/22_typographie.js?v=1.37.0",
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

// Étape R193 : un média gardé est servi tout de suite ; le réseau rafraîchit la copie en arrière-plan.
// Étape R264 (Notion 39) : ce rafraîchissement se fait UNE fois par version et par fichier (avant : à chaque affichage,
//   chaque photo déjà gardée était retéléchargée en arrière-plan : sur un téléphone, deux fois plus de données à chaque écran).
//   Une marque « déjà vérifiée » est rangée dans la réserve de la version (effacée à la version suivante).
// Étape R280 (44.07, note 7 du 20/11 au soir : un petit temps d'attente à chaque image ou picto, même déjà gardé) :
//   • la copie est cherchée DIRECTEMENT dans la réserve des médias, par son adresse exacte (avant : dans toutes les réserves du
//     téléphone, sans tenir compte du « ?… » de l'adresse : une recherche lente quand la réserve compte des centaines de photos) ;
//   • la marque « déjà vérifiée » n'est plus lue avant de répondre : la copie part tout de suite, la vérification se fait après,
//     et une liste en mémoire évite de la refaire pour un fichier déjà vu depuis le réveil de ce programme.
const reserves = {};
function reserve(nom) { return reserves[nom] || (reserves[nom] = caches.open(nom)); }
const mediasVerifies = new Set();
async function copieEtMiseAJour(requete, evenement) {
  const cache = await reserve(CACHE_MEDIAS);
  const url = new URL(requete.url), marque = "verifie-medias" + url.pathname;
  let copie = await cache.match(requete);
  if (!copie && url.search) copie = await cache.match(requete, { ignoreSearch: true });      // même fichier, gardé sous une autre adresse
  if (!copie) copie = await (await reserve(CACHE_JEU)).match(requete);                       // polices et icônes de l'essentiel
  const telecharger = () => fetch(requete).then(async reponse => {
    if (reponse && reponse.status === 200 && reponse.type === "basic") {
      cache.put(requete, reponse.clone()).catch(() => {});
      mediasVerifies.add(url.pathname);
      (await reserve(CACHE_JEU)).put(marque, new Response("1")).catch(() => {});
    }
    return reponse;
  });
  if (!copie) return telecharger();
  if (!mediasVerifies.has(url.pathname)) evenement.waitUntil((async () => {
    if (await (await reserve(CACHE_JEU)).match(marque)) { mediasVerifies.add(url.pathname); return; }   // déjà vérifiée pendant cette version
    await telecharger();
  })().catch(() => {}));
  return copie;
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
  if (estMedia(url)) { evenement.respondWith(copieEtMiseAJour(requete, evenement)); return; }   // étape R193
  evenement.respondWith(copieDabord(requete));
});
