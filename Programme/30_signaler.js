// ==================================================================
// Étape CT1 (18/11/2026) — Contributions du joueur, 1re partie : « Signaler une erreur »
// Choix d'Aubin du 18/11 (maquettes « Signaler une erreur, série 1 » : 1A · 2A · 3A · 4A · 5A · 6B) :
//   - un petit lien texte en bas de la fiche de l'espèce (1A) ;
//   - un petit « Signaler » sous l'explication, après une réponse (2A) ;
//   - le formulaire s'ouvre dans un panneau qui monte du bas, par-dessus le jeu (3A) ;
//   - après l'envoi, le panneau se ferme et un bandeau dit « Merci pour votre contribution ! » (4A) ;
//   - Profil : une ligne « N signalements envoyés · merci » dans « Vos chiffres », cachée tant qu'il n'y en a aucun (5A) ;
//   - À propos : deux lignes « Une remarque sur le jeu » / « Proposer vos photos » (6B).
// Le formulaire est un formulaire Tally (gratuit) : https://tally.so/r/db0Rzo. Chaque envoi arrive dans la base Notion
// « Signalements des joueurs ». Le jeu remplit lui-même les cases cachées (espèce, question, version…), jamais le prénom.
// Valeurs de « endroit » : fiche · question · jeu (le formulaire montre les choix qui vont avec).
// ==================================================================

const SIGNALER_FORMULAIRE = "db0Rzo";
const SIGNALER_ADRESSE = "https://tally.so/embed/" + SIGNALER_FORMULAIRE;
let signalementEnCours = null;   // { endroit, cases } tant que le panneau est ouvert

const PICTO_SIGNALER = '<svg viewBox="0 0 24 24" aria-hidden="true" class="sig-picto"><path d="M6 21V4M6 4h10l-2 3.5 2 3.5H6"/></svg>';

function signalementOuvert() { return !!document.querySelector("#sig-panneau.ouvert"); }

// Les renseignements communs : territoire, lieu (le chapitre de l'expédition), version, appareil
function casesCommunes() {
  const exp = (typeof defi !== "undefined" && defi && defi.expedition) || (typeof session !== "undefined" && session && session.expedition)
    || (typeof expeditionAffichee !== "undefined" && expeditionAffichee) || null;
  let territoire = "";
  try { territoire = (exp && exp.territoire) || (typeof territoireActif === "function" ? territoireActif() : ""); } catch (err) { /* rien */ }
  return {
    territoire, lieu: (exp && (exp.chapitre || exp.titre)) || "",
    version: typeof VERSION_JEU !== "undefined" ? VERSION_JEU : "",
    appareil: (typeof surTelephone === "function" && surTelephone()) ? "téléphone" : "ordinateur",
  };
}
function casesEspece(e) {
  if (!e) return {};
  return { espece: e.nom_courant || "", nom_scientifique: e.nom_scientifique || "" };
}
function nomFichier(chemin) { return String(chemin || "").split("/").pop(); }

// ---------- Le panneau (3A) ----------
function ouvrirSignalement(endroit, cases) {
  fermerSignalement(true);
  signalementEnCours = { endroit, cases };
  const sujet = endroit === "jeu" ? "Sur le jeu"
    : endroit === "question" ? (cases.espece ? `Sur une question : <b>${echapper(cases.espece)}</b>` : "Sur une question")
    : `Sur la fiche : <b>${echapper(cases.espece || "")}</b>`;
  const p = new URLSearchParams({ hideTitle: "1", transparentBackground: "1", alignLeft: "1", endroit });
  for (const [k, v] of Object.entries(cases)) if (v !== undefined && v !== null && String(v) !== "") p.set(k, String(v).slice(0, 400));
  const enLigne = navigator.onLine !== false;
  const corps = enLigne
    ? `<iframe class="sig-cadre" src="${SIGNALER_ADRESSE}?${p.toString()}" title="Formulaire : signaler une erreur" loading="eager"></iframe>`
    : `<p class="sig-horsligne">Il faut une connexion pour envoyer un signalement.</p>`;
  const panneau = document.createElement("div");
  panneau.id = "sig-panneau";
  panneau.innerHTML = `<div class="sig-voile" data-sig-fermer></div>
    <div class="sig-feuille" role="dialog" aria-modal="true" aria-labelledby="sig-titre">
      <span class="sig-poignee" aria-hidden="true"></span>
      <div class="sig-tete">${PICTO_SIGNALER}<span class="sig-titre" id="sig-titre">Signaler une erreur</span>
        <button type="button" class="sig-fermer" data-sig-fermer aria-label="Fermer">×</button></div>
      <p class="sig-sujet">${sujet}</p>
      <div class="sig-corps">${corps}</div>
    </div>`;
  document.body.appendChild(panneau);
  panneau.querySelectorAll("[data-sig-fermer]").forEach(b => b.onclick = () => fermerSignalement());
  requestAnimationFrame(() => panneau.classList.add("ouvert"));
}
function fermerSignalement(tout_de_suite = false) {
  const panneau = document.getElementById("sig-panneau");
  signalementEnCours = null;
  if (!panneau) return;
  if (tout_de_suite) { panneau.remove(); return; }
  panneau.classList.remove("ouvert");
  setTimeout(() => panneau.remove(), 260);
}

// Tally prévient la page quand le formulaire est envoyé (message « Tally.FormSubmitted »)
window.addEventListener("message", ev => {
  if (!signalementEnCours || typeof ev.data !== "string" || !/^https:\/\/tally\.so$/.test(ev.origin || "")) return;
  let m = null;
  try { m = JSON.parse(ev.data); } catch (err) { return; }
  if (!m || m.event !== "Tally.FormSubmitted") return;
  suivi.signalements = (suivi.signalements || 0) + 1;   // compteur du Profil (5A)
  try { sauvegarder(); } catch (err) { /* sans sauvegarde */ }
  fermerSignalement();
  merciSignalement();
});

// ---------- Le merci (4A) ----------
let minuteurMerciSig = null;
function merciSignalement() {
  let b = document.getElementById("sig-merci");
  if (!b) {
    b = document.createElement("div");
    b.id = "sig-merci";
    b.setAttribute("role", "status");
    b.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg><span>Merci pour votre contribution !</span>`;
    document.body.appendChild(b);
  }
  requestAnimationFrame(() => b.classList.add("visible"));
  clearTimeout(minuteurMerciSig);
  minuteurMerciSig = setTimeout(() => b.classList.remove("visible"), 3200);
}

// ---------- 1A : le lien en bas de la fiche ----------
function lienSignalerFiche(e) {
  return `<p class="sig-bas-fiche"><button type="button" class="sig-lien" id="sig-fiche">Signaler une erreur sur cette fiche</button></p>`;
}
function brancherSignalerFiche(zone, e) {
  const b = zone && zone.querySelector("#sig-fiche");
  if (!b) return;
  b.onclick = () => ouvrirSignalement("fiche", Object.assign(casesEspece(e), {
    media: [nomFichier(e.photo), nomFichier(e.cri_son || e.cri)].filter(Boolean).join(" · ") }, casesCommunes()));
}

// ---------- 2A : « Signaler » sous l'explication, après une réponse ----------
// Les zones d'explication : la Rencontre et les expéditions (#retour), le défi « Me tester » et Approfondir (#dfx-retour),
// l'étape 2 « Ensemble, dans ce lieu » (#en-retour). Le lien se pose dès que l'explication est écrite.
function texteDe(el) { return el ? el.textContent.replace(/\s+/g, " ").trim() : ""; }
function contexteQuestion(retour) {
  const id = retour.id;
  let e = null, q = null;
  if (id === "retour" && typeof enCours !== "undefined" && enCours) e = enCours.espece;
  if (id === "dfx-retour") {
    if (typeof apf !== "undefined" && apf) { try { q = apf.mode === "tester" ? qCouranteApprof(apf) : apf.aPoser[apf.j]; } catch (err) { q = null; } }
    else if (typeof defiExp !== "undefined" && defiExp) { try { q = qCouranteDefi(defiExp); } catch (err) { q = null; } }
    if (q) e = typeof q.espece === "string" ? (typeof especeParNom === "function" ? especeParNom(q.espece) : null) : q.espece;
  }
  const carte = id === "retour" ? (document.getElementById("vue-rencontre") || document)
    : id === "dfx-retour" ? (document.getElementById("vue-defiexp") || document)
    : (retour.closest(".fp-carte") || document);
  const question = id === "retour" ? (texteDe(document.getElementById("question")) || texteDe(document.getElementById("affirmation")))
    : texteDe(carte.querySelector(id === "dfx-retour" ? ".cdo-q" : ".fl-question"));
  const bonnes = [...carte.querySelectorAll(".reponse.juste, .en-rep.bonne, .en-rep.juste, .fl-rep.juste, .cdo-nom.bon, button.bon")].map(texteDe).filter(Boolean);
  const choisies = [...carte.querySelectorAll(".reponse.fausse, .reponse.presque, .en-rep.fausse, .fl-rep.fausse, .cdo-nom.mauvais, button.fausse")].map(texteDe).filter(Boolean);
  const media = e ? nomFichier(e.photo) : "";
  return Object.assign(casesEspece(e), {
    question: (question || (id === "retour" && typeof enCours !== "undefined" && enCours && enCours.champ ? "[" + enCours.champ + "]" : "")).slice(0, 300), bonne_reponse: bonnes.join(" ; "),
    reponse_choisie: choisies.length ? choisies.join(" ; ") : (bonnes.length ? "la bonne" : ""), media,
  }, casesCommunes());
}
// Le lien est posé juste APRÈS la zone d'explication (pas dedans : certaines parties relisent ou réécrivent son texte),
// et il n'est visible que quand l'explication est écrite.
function majLienQuestion(retour) {
  let p = retour.sigLien;
  if (!p) {
    p = document.createElement("p");
    p.className = "sig-sous-retour";
    p.innerHTML = `<button type="button" class="sig-lien">Signaler</button>`;
    p.querySelector("button").onclick = ev => { ev.stopPropagation(); ouvrirSignalement("question", contexteQuestion(retour)); };
    retour.sigLien = p;
  }
  const bouton = retour.id === "dfx-retour" ? retour.querySelector("#dfx-suivant") : null;   // défi, Approfondir : le bouton est dans la zone
  if (bouton) { if (bouton.previousElementSibling !== p) bouton.before(p); }
  else if (retour.nextElementSibling !== p) retour.insertAdjacentElement("afterend", p);   // il suit l'explication quand elle change de place (R138)
  const plein = !!texteDe(retour).replace(/Signaler$/, "").trim() && !retour.classList.contains("cache");
  if (p.hidden === plein) p.hidden = !plein;
}
const ZONES_RETOUR = ["retour", "dfx-retour", "en-retour"];
try {
  new MutationObserver(() => {
    for (const id of ZONES_RETOUR) { const r = document.getElementById(id); if (r) majLienQuestion(r); }
  }).observe(document.body, { childList: true, subtree: true });
} catch (err) { /* navigateur sans MutationObserver : pas de lien */ }

// ---------- 6B : À propos, « Une remarque sur le jeu » ----------
function brancherRemarqueJeu() {
  const b = document.getElementById("ap-remarque");
  if (b && !b.dataset.sig) { b.dataset.sig = "1"; b.onclick = () => ouvrirSignalement("jeu", casesCommunes()); }
}
document.addEventListener("click", ev => { if (ev.target.closest && ev.target.closest("#ap-remarque")) { brancherRemarqueJeu(); } }, true);
brancherRemarqueJeu();
