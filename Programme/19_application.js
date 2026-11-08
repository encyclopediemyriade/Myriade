// 19_application.js — L'application installable, la sauvegarde dans un fichier et le numéro de version.
// Une partie du programme du jeu, chargée par jeu.html juste avant le démarrage (13).
//
// Étape ML7 (08/11/2026, demande d'Aubin : « l'application installable, avec un numéro de version ») :
//   • le jeu s'installe comme une application (icône sur l'écran d'accueil, plein écran, sans réseau) :
//     service-worker.js et manifest.webmanifest, à la racine du dossier Code ;
//   • « Sauvegarder votre partie » écrit toute la partie dans un petit fichier ; « Reprendre une partie »
//     la remet en place (autre appareil, ou navigateur qui a tout effacé : Safari le fait au bout de
//     7 jours sans visite, sauf pour une application installée) ;
//   • le numéro de version (version.js) s'affiche en bas d'« À propos » et dans les sauvegardes.
// Les lignes s'affichent dans « À propos → Réglages de la partie » (dessinerActionsAPropos, 06_encyclopedie.js).

// ------------------------------------------------------------------
// 1. Le numéro de version
// ------------------------------------------------------------------
function texteVersion() {
  return typeof VERSION_JEU === "string" ? `Version ${VERSION_JEU}${typeof DATE_VERSION === "string" ? ` du ${DATE_VERSION}` : ""}` : "";
}
if (typeof VERSION_JEU === "string") console.log("Myriade · " + texteVersion());

// ------------------------------------------------------------------
// 2. L'application installable
// ------------------------------------------------------------------
// Le service worker ne fonctionne que si le jeu est ouvert depuis Internet (https) ou depuis « localhost ».
// Ouvert depuis le dossier du PC (file://) ou depuis le petit serveur du PC sur le wifi (http://192.168…),
// le navigateur le refuse : le jeu marche normalement, sans installation possible.
const SITE_EN_LIGNE = /^https?:$/.test(location.protocol) && window.isSecureContext === true;
let invitationInstallation = null;   // la proposition d'installation gardée par Chrome / Edge / Android

function estApplicationInstallee() {
  return (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone === true;
}
function estAppareilApple() {
  return /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

if (SITE_EN_LIGNE && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => { /* refusé : le jeu marche quand même */ });
  });
}
// Demander au navigateur de ne pas effacer la partie quand l'appareil manque de place (accordé surtout aux applications installées)
if (navigator.storage && typeof navigator.storage.persist === "function") {
  navigator.storage.persisted().then(deja => { if (!deja) navigator.storage.persist(); }).catch(() => {});
}
window.addEventListener("beforeinstallprompt", ev => {
  ev.preventDefault();                 // pas de bandeau du navigateur : le bouton est dans À propos
  invitationInstallation = ev;
  if (typeof dessinerActionsAPropos === "function") dessinerActionsAPropos();
});
window.addEventListener("appinstalled", () => {
  invitationInstallation = null;
  if (typeof dessinerActionsAPropos === "function") dessinerActionsAPropos();
});
async function installerApplication() {
  if (!invitationInstallation) return;
  const invitation = invitationInstallation;
  invitationInstallation = null;
  try { await invitation.prompt(); } catch (e) { /* fenêtre fermée */ }
  if (typeof dessinerActionsAPropos === "function") dessinerActionsAPropos();
}

// La ligne « Installer Myriade » : son texte selon l'appareil (null = pas de ligne)
function ligneInstallation() {
  if (estApplicationInstallee()) return null;            // déjà dans l'application
  if (!SITE_EN_LIGNE) return null;                       // depuis le dossier du PC : rien à installer
  if (invitationInstallation) return {
    texte: "Ajoutez Myriade à votre écran d'accueil : le jeu s'ouvre comme une application, en plein écran, et même sans réseau.",
    bouton: "Installer" };
  if (estAppareilApple()) return {
    texte: "Pour ajouter Myriade à votre écran d'accueil : touchez <b>Partager</b> (le carré avec une flèche vers le haut), puis <b>Sur l'écran d'accueil</b>. Le jeu s'ouvre alors comme une application, et votre partie est mieux protégée." };
  return {
    texte: "Pour installer Myriade comme une application, cherchez <b>Installer</b> ou <b>Ajouter à l'écran d'accueil</b> dans le menu de votre navigateur." };
}

// ------------------------------------------------------------------
// 3. Sauvegarder la partie dans un fichier, et la reprendre
// ------------------------------------------------------------------
const FORMAT_SAUVEGARDE = 1;
const CLE_AVANT_IMPORT = "myriade-partie-avant-import";   // la partie remplacée, gardée par précaution
let fichierEnAttente = null;   // la sauvegarde lue, en attente du « Oui, remplacer »
let messageFichier = "";       // une erreur à afficher sous « Reprendre une partie »

function dateDuJour() {
  const d = new Date(), deux = n => String(n).padStart(2, "0");
  return { iso: `${d.getFullYear()}-${deux(d.getMonth() + 1)}-${deux(d.getDate())}`,
           fr: `${deux(d.getDate())}/${deux(d.getMonth() + 1)}/${d.getFullYear()}`,
           heure: `${deux(d.getHours())}:${deux(d.getMinutes())}` };
}
function nbEspecesCarnet() {
  try { return infoRangCarnet().n; } catch (e) { return null; }
}
function nomDeFichierPartie() {
  const prenom = (typeof prenomJoueur === "function" ? prenomJoueur() : "")
    .normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
  return `myriade_partie${prenom ? "_" + prenom : ""}_${dateDuJour().iso}.json`;
}

async function sauvegarderDansFichier() {
  const jour = dateDuJour();
  suivi.derniereSauvegardeFichier = jour.fr;
  sauvegarder();                                           // la partie à jour, avec la date de cette sauvegarde
  let partie;
  try { partie = JSON.parse(localStorage.getItem(CLE_SAUVEGARDE)); } catch (e) { partie = null; }
  if (!partie) { messageFichier = "Impossible de lire la partie dans ce navigateur."; dessinerActionsAPropos(); return; }
  const contenu = {
    jeu: "Myriade", format: FORMAT_SAUVEGARDE,
    version: typeof VERSION_JEU === "string" ? VERSION_JEU : "",
    date: `${jour.fr} à ${jour.heure}`,
    prenom: typeof prenomJoueur === "function" ? prenomJoueur() : "",
    especes: nbEspecesCarnet(),
    partie: partie,
  };
  const nom = nomDeFichierPartie();
  const fichier = new Blob([JSON.stringify(contenu)], { type: "application/json" });
  messageFichier = "";
  // Sur iPhone et iPad, la feuille « Partager » permet d'enregistrer le fichier dans « Fichiers » (ou de l'envoyer)
  if (estAppareilApple() && navigator.canShare) {
    try {
      const f = new File([fichier], nom, { type: "application/json" });
      if (navigator.canShare({ files: [f] })) {
        await navigator.share({ files: [f], title: "Ma partie de Myriade" });
        dessinerActionsAPropos();
        return;
      }
    } catch (e) {
      if (e && e.name === "AbortError") { dessinerActionsAPropos(); return; }   // feuille fermée
    }
  }
  const lien = document.createElement("a");
  lien.href = URL.createObjectURL(fichier);
  lien.download = nom;
  document.body.appendChild(lien);
  lien.click();
  setTimeout(() => { URL.revokeObjectURL(lien.href); lien.remove(); }, 1000);
  dessinerActionsAPropos();
}

// Lit le fichier choisi. S'il est bon : `suite(contenu)` ; sinon : `erreur(message)`.
function lireSauvegarde(fichier, suite, erreur) {
  if (!fichier) return;
  const lecteur = new FileReader();
  lecteur.onload = () => {
    let contenu = null;
    try { contenu = JSON.parse(lecteur.result); } catch (e) { contenu = null; }
    if (!contenu || contenu.jeu !== "Myriade" || !contenu.partie || typeof contenu.partie !== "object") {
      erreur("Ce fichier n'est pas une sauvegarde de Myriade.");
      return;
    }
    suite(contenu);
  };
  lecteur.onerror = () => erreur("Impossible de lire ce fichier.");
  lecteur.readAsText(fichier);
}
// Dans À propos : la partie lue attend la confirmation (rien n'est remplacé avant le « Oui »)
function lireFichierPartie(fichier) {
  messageFichier = ""; fichierEnAttente = null;
  lireSauvegarde(fichier,
    contenu => { fichierEnAttente = contenu; dessinerActionsAPropos("reprendre"); },
    message => { messageFichier = message; dessinerActionsAPropos(); });
}
// Sur la première page de la première visite (nouvel appareil) : « Vous avez déjà une partie ? »
// Il n'y a pas encore de partie à remplacer : la partie du fichier est reprise tout de suite.
function poserReprendreBienvenue() {
  const corps = document.getElementById("corps-bienvenue");
  if (!corps) return;
  const bloc = document.createElement("p");
  bloc.className = "bienvenue-reprendre";
  bloc.innerHTML = `Vous avez déjà une partie sauvegardée dans un fichier&nbsp;?
    <label class="lien-reprendre">Reprendre ma partie<input type="file" accept=".json,application/json" class="cache-visuel"></label>
    <span class="apropos-erreur" role="status"></span>`;
  corps.appendChild(bloc);
  const champ = bloc.querySelector("input"), message = bloc.querySelector(".apropos-erreur");
  champ.onchange = () => lireSauvegarde(champ.files && champ.files[0],
    contenu => { fichierEnAttente = contenu; reprendrePartieDuFichier(); },
    texte => { message.textContent = texte; champ.value = ""; });
}

function reprendrePartieDuFichier() {
  if (!fichierEnAttente) return;
  try {
    const actuelle = localStorage.getItem(CLE_SAUVEGARDE);
    if (actuelle) localStorage.setItem(CLE_AVANT_IMPORT, actuelle);   // par précaution
    localStorage.setItem(CLE_SAUVEGARDE, JSON.stringify(fichierEnAttente.partie));
  } catch (e) {
    messageFichier = "Le navigateur a refusé d'enregistrer la partie (navigation privée ?).";
    fichierEnAttente = null;
    dessinerActionsAPropos();
    return;
  }
  location.reload();   // le jeu repart avec la partie reprise
}

function resumeFichier(c) {
  const qui = c.prenom ? `La partie de <b>${echapper(c.prenom)}</b>` : "Cette partie";
  const quand = c.date ? `, sauvegardée le ${echapper(c.date)}` : "";
  const combien = Number.isFinite(c.especes) ? ` (${c.especes} espèce${c.especes > 1 ? "s" : ""} au carnet)` : "";
  return `${qui}${quand}${combien}`;
}

// ------------------------------------------------------------------
// 4. Les lignes de « Réglages de la partie » (appelées par dessinerActionsAPropos, 06)
// ------------------------------------------------------------------
function htmlReglagesApplication(attente) {
  const derniere = suivi && suivi.derniereSauvegardeFichier;
  let html = `<div class="apropos-action" data-cle="sauver">
      <p>Sauvegardez votre partie dans un fichier, pour la reprendre sur un autre appareil ou si le navigateur l'efface.
        <br><small>${derniere ? `Dernière sauvegarde : le ${echapper(derniere)}.` : "Aucune sauvegarde pour l'instant."}</small></p>
      <button class="bouton-apropos" type="button" id="bouton-sauver-fichier">Sauvegarder</button>
    </div>`;
  if (attente === "reprendre" && fichierEnAttente) {
    html += `<div class="apropos-action" data-cle="reprendre">
        <p><b>${resumeFichier(fichierEnAttente)}. Elle remplacera la partie en cours. Continuer&nbsp;?</b></p>
        <span class="apropos-boutons"><button class="bouton-apropos confirmer" type="button" id="bouton-reprendre-oui">Oui, reprendre</button><button class="bouton-apropos annuler" type="button" id="bouton-reprendre-non">Annuler</button></span>
      </div>`;
  } else {
    html += `<div class="apropos-action" data-cle="reprendre">
        <p>Reprendre une partie sauvegardée dans un fichier. Elle remplace la partie en cours.
          ${messageFichier ? `<br><small class="apropos-erreur">${echapper(messageFichier)}</small>` : ""}</p>
        <label class="bouton-apropos bouton-fichier">Reprendre<input type="file" id="champ-fichier-partie" accept=".json,application/json" class="cache-visuel"></label>
      </div>`;
  }
  const inst = ligneInstallation();
  if (inst) html += `<div class="apropos-action" data-cle="installer">
      <p>${inst.texte}</p>
      ${inst.bouton ? `<button class="bouton-apropos" type="button" id="bouton-installer">${inst.bouton}</button>` : ""}
    </div>`;
  return html;
}
function brancherReglagesApplication() {
  const sauver = document.getElementById("bouton-sauver-fichier");
  if (sauver) sauver.onclick = () => sauvegarderDansFichier();
  const champ = document.getElementById("champ-fichier-partie");
  if (champ) champ.onchange = () => lireFichierPartie(champ.files && champ.files[0]);
  const oui = document.getElementById("bouton-reprendre-oui");
  if (oui) oui.onclick = () => reprendrePartieDuFichier();
  const non = document.getElementById("bouton-reprendre-non");
  if (non) non.onclick = () => { fichierEnAttente = null; dessinerActionsAPropos(); };
  const installer = document.getElementById("bouton-installer");
  if (installer) installer.onclick = () => installerApplication();
}
