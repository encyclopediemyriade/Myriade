// ==================================================================
// 27. LE DÉFI D'UNE EXPÉDITION : « Me tester » (étape E2-8, 16/11/2026)
// ==================================================================
// La seconde partie (reprise_seconde_partie.md), choix d'Aubin des 15 et 16/11 :
//   • deux façons de valider l'étape 1 d'une expédition : les Rencontres (Découvrir) OU un défi réussi (Me tester) ;
//   • le défi : 2 questions par espèce (10 à 14), réussi avec 2 erreurs au plus ; la partie va toujours au bout ;
//     pièges proches (sosies, même groupe…), autres formes (femelle, jeune, hiver ; jamais larve ni chenille) ;
//     2 aides (retirer deux réponses, voir les silhouettes) ; pas de chronomètre ;
//   • chaque erreur est expliquée, côte à côte : votre choix et la bonne réponse, puis « Ce qui les sépare »
//     (un repère de chaque carte, sur la même partie du corps quand c'est possible) ;
//   • la coriace (l'espèce de l'expédition la plus ratée jusqu'ici) revient en dernière question ;
//   • réussi : l'étape 1 compte comme faite, les espèces deviennent Reconnues, mêmes empreintes que l'étape 1 ;
//     pas encore réussi (« Presque ») : les espèces réussies 2 fois sur 2 deviennent Reconnues, les autres « À revoir »
//     avec leur repère ; « Découvrir les N » ou « Rejouer le défi », à égalité ;
//   • changer de porte à tout moment sans rien perdre : « Quitter » garde ce qui est réussi 2 fois sur 2 ;
//     un nouveau défi repart de la première question.
// Mise à jour R241-R242 (17/11, retours du 16/11 au soir) : 3 questions par espèce (2 pour une espèce déjà reconnue), 20 au plus,
//   environ 3 erreurs permises sur 20 ; chaque espèce par plusieurs chemins (sa photo, « Laquelle est … ? », son cri ou une autre
//   forme) ; fausses réponses prises d'abord dans l'expédition ; « Quitter » remplacé par « ← » (le défi est mis de côté et se reprend).
// Le jeu a son écran (#vue-defiexp) et son état (defiExp) : il ne passe pas par les défis classiques (07).
// Sauvegarde : suivi.reconnuesDefi (espèces reconnues par un défi : leur étape 1 compte comme faite, voir especeFaite, 17),
//              suivi.defisExp[id] = { joues, reussi, meilleur, dernier: { bons, total } }.
const DEFI_PAR_ESPECE = 3;          // questions par espèce (R242, choix d'Aubin 13A du 16/11 au soir ; avant : 2)
const DEFI_MAX_QUESTIONS = 20;      // R242 (13A) : 20 questions au plus (avec 8 ou 9 espèces, certaines n'en ont que 2)
const DEFI_ERREURS_PERMISES = 2;    // (repère ancien : 2 erreurs sur 14) — voir erreursPermisesDefi
const SUJETS_SANS_DEFI = ["larve", "chenille"];   // stades trop difficiles à reconnaître (note 6)
// R242 (13A) : environ 3 erreurs permises sur 20, proportionnel au nombre de questions (2 au moins)
function erreursPermisesDefi(total) { return Math.max(2, Math.round(total * 3 / 20)); }
// ==================================================================
// Étape R249 (17/11, tâche Notion 36.41, choix d'Aubin « A ») : LE REPÊCHAGE, quand on rate de peu.
//   Pour 1 ou 2 erreurs de trop (4 ou 5 erreurs quand 3 sont permises sur 20) : un court écran « Repêchage · Vous y êtes
//   presque », puis une question par espèce manquée (2 au plus), posée par un autre chemin ; chaque bonne réponse efface
//   une erreur ; une erreur au repêchage ne coûte rien ; réussi après le repêchage = la même récompense qu'un défi réussi.
//   Écrit pour servir aux deux défis : celui de l'étape 1 (ici) et « Me tester » d'Approfondir (29_approfondir.js) :
//   repechageNecessaire, especesRepechage, ecranRepechage et enteteRepechage sont communs.
// ==================================================================
const REPECHAGE_MAX = 2;   // questions de repêchage au plus (et erreurs de trop au plus)
// Combien d'erreurs il faut effacer pour réussir : 1 ou 2 ; 0 = pas de repêchage (défi réussi, ou trop d'erreurs)
function repechageNecessaire(erreurs, permises) { const n = erreurs - permises; return n >= 1 && n <= REPECHAGE_MAX ? n : 0; }
// Les espèces du repêchage : une par espèce manquée, les plus manquées d'abord (à égalité, la dernière manquée), 2 au plus.
//   questions = [{ espece, juste }] dans l'ordre où elles ont été posées.
function especesRepechage(questions) {
  const n = new Map(), dernier = new Map();
  questions.forEach((q, i) => { if (q.juste === false) { n.set(q.espece, (n.get(q.espece) || 0) + 1); dernier.set(q.espece, i); } });
  return [...n.keys()].sort((a, b) => n.get(b) - n.get(a) || dernier.get(b) - dernier.get(a)).slice(0, REPECHAGE_MAX);
}
// L'écran d'annonce, commun aux deux défis (un seul bouton pour commencer ; « Passer » donne le résultat sans repêchage)
function ecranRepechage(titre, erreurs, permises, n) {
  const besoin = erreurs - permises;
  return `<div class="cdo dfx dfx-rep">
      <div class="dfx-haut"><button class="cdo-quitter dfx-sortir" id="dfx-quitter" aria-label="Revenir à l'expédition (le défi est gardé)">←</button>
        <span class="cdo-titre">${echapper(titre)}</span></div>
      <div class="dfx-rep-etiq">Repêchage</div>
      <h2>Vous y êtes presque</h2>
      <p class="cdo-sous">${erreurs} erreurs, ${permises} permises.</p>
      <ul class="dfx-lignes">
        <li>${n > 1 ? `${n} questions de plus, une par espèce manquée` : "Une question de plus, sur l'espèce manquée"}, posée${n > 1 ? "s" : ""} autrement.</li>
        <li>Chaque bonne réponse efface une erreur : il en faut ${besoin > 1 ? `${besoin}` : "une"}.</li>
        <li>Une erreur ici ne coûte rien.</li>
      </ul>
      <button class="cdo-suivant" id="dfx-rep-go">Commencer le repêchage</button>
      <button class="dfx-lien" id="dfx-rep-passer">Passer · voir le résultat</button>
    </div>`;
}
// Le haut de l'écran pendant le repêchage : « Repêchage · 1 / 2 » et sa propre barre (les erreurs effacées en vert)
function enteteRepechage(titre, rq, i) {
  const cases = rq.map((q, k) => `<i class="${q.repondu ? (q.juste ? "ok" : "ko") : k === i ? "cur" : ""}"></i>`).join("");
  return `<div class="dfx-haut"><button class="cdo-quitter dfx-sortir" id="dfx-quitter" aria-label="Revenir à l'expédition (le défi est gardé)">←</button>
      <span class="cdo-titre">Repêchage · ${echapper(titre)}</span><span class="dfx-compte">${Math.min(i + 1, rq.length)} / ${rq.length}</span></div>
    <div class="dfx-barre rep" style="grid-template-columns:repeat(${rq.length},1fr)">${cases}</div>`;
}
// R242 (13A) : combien de questions pour chaque espèce — 3, ou 2 pour une espèce déjà reconnue ailleurs (sa courte révision),
//   puis on retire une question aux espèces qui en ont 3 jusqu'à tenir dans les 20 (jamais moins de 2)
function questionsParEspece(x, deja) {
  const nb = new Map(x.liste.map(e => [e, deja && deja.has(e.nom_courant) ? 2 : DEFI_PAR_ESPECE]));
  let total = [...nb.values()].reduce((a, b) => a + b, 0);
  for (const e of melanger(x.liste.slice())) { if (total <= DEFI_MAX_QUESTIONS) break; if (nb.get(e) > 2) { nb.set(e, nb.get(e) - 1); total--; } }
  return nb;
}
function nbQuestionsDefi(x) {
  const deja = new Set(x.liste.filter(e => typeof estReconnue === "function" && estReconnue(e)).map(e => e.nom_courant));
  return [...questionsParEspece(x, deja).values()].reduce((a, b) => a + b, 0);
}
let defiExp = null;                 // le défi en cours
// R249 : la question à l'écran — celle du défi, ou celle du repêchage (d.rep = { questions, i, lance })
function qCouranteDefi(d) { return d.rep && d.rep.lance ? d.rep.questions[d.rep.i] : d.questions[d.i]; }
function erreursDefi(d) {
  const brutes = d.questions.filter(q => q.choix && q.choix !== q.espece).length;
  const effacees = d.rep ? d.rep.questions.filter(q => q.choix && q.choix === q.espece).length : 0;
  return brutes - effacees;
}
// R249 : une question de repêchage pour une espèce manquée, « par un autre chemin » : d'abord une façon pas encore posée
//   dans ce défi (son cri, puis « Laquelle est … ? »), sinon une photo pas encore vue (autre forme), sinon « Laquelle est … ? »
function questionAutreCheminDefi(e, d) {
  const x = d.x, posees = d.questions.filter(q => q.espece === e);
  const types = new Set(posees.map(q => q.type || "photo")), vues = posees.filter(q => q.photo).map(q => q.photo.src);
  const ph = photosDefi(e), pieges = piegesDefi(e, x, poolDefi(x));
  const avecPhotos = [e, ...pieges].every(o => estRenseigne(o.photo)) && pieges.length >= 3;
  const cri = typeof aUnCri === "function" && aUnCri(e) && typeof sonActif !== "undefined" && sonActif && avecPhotos;
  const neuve = ph.find(p => !vues.includes(p.src));
  let type = "photo", photo = null;
  if (cri && !types.has("cri")) type = "cri";
  else if (avecPhotos && !types.has("laquelle")) type = "laquelle";
  else if (neuve) photo = neuve;
  else if (avecPhotos) type = "laquelle";
  else photo = ph[0] || null;
  return { espece: e, type, photo, noms: melanger([e, ...pieges]), choix: null, retires: [], rep: true };
}

function especesReconnuesDefi() { return (suivi && suivi.reconnuesDefi) || []; }
function reconnueParDefi(e) { return especesReconnuesDefi().includes(e.nom_courant); }
function etatDefiExp(x) { return (suivi && suivi.defisExp && suivi.defisExp[x.id]) || null; }

// Les photos possibles d'une espèce pour le défi : la principale et les autres formes (pas larve ni chenille)
function photosDefi(e) { return photosJeu(e); }   // R234 : règle commune (02), têtards d'amphibiens « jeune » compris
// Le pool des pièges : les espèces du territoire de l'expédition (comme Coup d'œil), avec une photo
function poolDefi(x) { return ESPECES.filter(e => territoiresJeu(e).includes(x.territoire) && estRenseigne(e.photo)); }
// R242 (choix 10B) : les fausses réponses sont prises d'abord dans l'expédition, quand elle a des espèces proches
//   (sosie, même groupe, ou même famille et taille comparable) ; on complète comme Coup d'œil (espèces proches du territoire)
function piegesDefi(e, x, pool) {
  const t = tailleCoup(e), proche = o => { const u = tailleCoup(o); return !t || !u || Math.max(t, u) / Math.min(t, u) <= 3; };
  const sosies = typeof sosiesDe === "function" ? sosiesDe(e) : [];
  const ici = melanger(x.liste.filter(o => o !== e && estRenseigne(o.photo)
    && (sosies.includes(o) || (o.nom_affichage_groupe && o.nom_affichage_groupe === e.nom_affichage_groupe) || (o.onglet === e.onglet && proche(o)))));
  const choisis = ici.slice(0, 3);
  for (const o of piegesCoupDoeil(e, pool.filter(p => !choisis.includes(p)))) if (choisis.length < 3 && !choisis.some(c => c.nom_courant === o.nom_courant)) choisis.push(o);
  return choisis;
}
// La coriace de l'expédition : l'espèce la plus ratée jusqu'ici (au moins 2 erreurs), sinon aucune
function coriaceExp(x) {
  const parEspece = {};
  for (const [cle, n] of Object.entries((suivi && suivi.echecs) || {})) { const nom = cle.split("|")[0]; parEspece[nom] = (parEspece[nom] || 0) + n; }
  let meilleure = null, max = 1;
  for (const e of x.liste) if ((parEspece[e.nom_courant] || 0) > max) { max = parEspece[e.nom_courant]; meilleure = e; }
  return meilleure;
}
// L'ordre des questions : un premier tour (chaque espèce une fois), puis un second ; jamais deux fois de suite la même ;
// la coriace en dernière question
function ordreDefi(x, nb) {
  const tours = [];
  for (let k = 0; k < DEFI_PAR_ESPECE; k++) tours.push(...melanger(x.liste.filter(e => (nb ? nb.get(e) : 2) > k)));
  const cor = coriaceExp(x);
  if (cor) {
    const i = tours.lastIndexOf(cor);
    tours.splice(i, 1); tours.push(cor);
  }
  for (let k = 1; k < tours.length; k++) if (tours[k] === tours[k - 1]) {
    const j = tours.findIndex((e, m) => m !== k && m !== tours.length - 1 && e !== tours[k - 1] && (m === 0 || tours[m - 1] !== tours[k]) && (m + 1 >= tours.length || tours[m + 1] !== tours[k]));
    if (j >= 0) [tours[k], tours[j]] = [tours[j], tours[k]];
  }
  return tours;
}

// Étape R241 (17/11, notes 17 et 33 du 16/11, tâches 36.17 et 36.33) : le défi en cours est SAUVEGARDÉ à chaque réponse
//   (suivi.defisEnCours[id] : questions posées, réponses, aides). Sortir (« ← » en haut, touche retour) le met de côté,
//   sans feuille ni question ; « Reprendre le défi » repart de la question où l'on s'était arrêté. Rien n'est perdu.
function sauverDefiExp() {
  const d = defiExp;
  if (!d || !suivi) return;
  suivi.defisEnCours = suivi.defisEnCours || {};
  const plat = q => ({ e: q.espece.nom_courant, t: q.type || "photo", p: q.photo ? q.photo.src : null, s: q.photo ? q.photo.sujet || "" : "",
      n: q.noms.map(o => o.nom_courant), c: q.choix ? q.choix.nom_courant : null, r: q.retires.map(o => o.nom_courant) });
  suivi.defisEnCours[d.x.id] = { i: d.i, aides: { ...d.aides }, questions: d.questions.map(plat),
    rep: d.rep ? { i: d.rep.i, lance: !!d.rep.lance, questions: d.rep.questions.map(plat) } : null };   // R249 : le repêchage aussi
  sauvegarder();
}
function oublierDefiExp(x) { if (suivi && suivi.defisEnCours && suivi.defisEnCours[x.id]) { delete suivi.defisEnCours[x.id]; sauvegarder(); } }
function defiEnPause(x) {
  const s = suivi && suivi.defisEnCours && suivi.defisEnCours[x.id];
  const repEnCours = s && s.rep && s.rep.questions && s.rep.questions.some(q => !q.c);   // R249 : un repêchage pas fini
  return !!(s && s.questions && (s.questions.some(q => !q.c) || repEnCours) && !etapeFinie(x, 1));
}
function reprendreDefiExp(x) {
  const s = suivi && suivi.defisEnCours && suivi.defisEnCours[x.id];
  if (!s) { lancerDefiExp(x); return; }
  const E = n => especeParNom(n);
  const relire = q => {
    const e = E(q.e); if (!e) return null;
    const photo = q.p ? (photosDe(e).find(p => p.src === q.p) || { src: q.p, sujet: q.s }) : null;
    return { espece: e, type: q.t || "photo", photo, noms: q.n.map(E).filter(Boolean), choix: q.c ? E(q.c) : null, retires: (q.r || []).map(E).filter(Boolean) };
  };
  const questions = s.questions.map(relire);
  const repQ = s.rep && s.rep.questions ? s.rep.questions.map(relire) : null;   // R249
  if (questions.some(q => !q || q.noms.length < 2) || (repQ && repQ.some(q => !q || q.noms.length < 2))) { oublierDefiExp(x); lancerDefiExp(x); return; }   // données changées : on repart
  const i = questions.findIndex(q => !q.choix);
  defiExp = { x, questions, i: i < 0 ? questions.length - 1 : i, aides: { retirer: true, silhouettes: true, ...(s.aides || {}) }, silhouettesVisibles: false,
              avantGain: gainExp(x), avantEtapes: empreintesExp(x), dejaReconnues: new Set(x.liste.filter(estReconnue).map(e => e.nom_courant)) };
  if (repQ) { repQ.forEach(q => q.rep = true); const j = repQ.findIndex(q => !q.choix); defiExp.rep = { questions: repQ, i: j < 0 ? repQ.length - 1 : j, lance: !!s.rep.lance }; }
  montrer("defiexp");
  if (defiExp.rep && !defiExp.rep.lance) { afficherAnnonceRepechage(); return; }   // R249 : repris sur l'écran « Vous y êtes presque »
  afficherQuestionDefiExp();
}
// Sortir du défi : il est mis de côté (ce qui est réussi 2 fois sur 2 est gardé tout de suite, comme avant), retour à l'expédition
function mettreDefiDeCote() {
  const d = defiExp;
  if (!d) return;
  const x = d.x, k = d.questions.findIndex(q => !q.choix);
  sauverDefiExp(); arreterSonDefi();
  const gardees = especesGagneesDefi(d, false, k < 0 ? d.questions.length : k);   // (R249 : pendant le repêchage, seulement les espèces sans faute)
  if (gardees.length) reconnaitreParDefi(x, gardees);
  defiExp = null;
  ouvrirExpedition(x);
  setTimeout(() => afficherBulle("Défi mis de côté · vous pourrez le reprendre"), 250);
}
function lancerDefiExp(x) {
  if (!x) return;
  if (typeof oublierDefiExp === "function") oublierDefiExp(x);   // R241 : un nouveau défi remplace celui mis de côté
  if (typeof estOuverte === "function" && !estOuverte(x)) { afficherBulle("Cette expédition s'ouvrira en avançant sur le chemin"); return; }
  suivi.derniereExpedition = suivi.derniereExpedition || {};
  suivi.derniereExpedition[x.territoire] = x.id;
  suivi.expLancees = suivi.expLancees || {};          // l'expédition compte comme commencée (ses empreintes en dépendent)
  suivi.expLancees[x.id] = true;
  if (x.chapitre) { suivi.chapitreCourant = suivi.chapitreCourant || {}; suivi.chapitreCourant[x.territoire] = x.chapitre; }
  sauvegarder();
  const pool = poolDefi(x);
  const vues = {}, rang = {};
  const dejaReconnues = new Set(x.liste.filter(estReconnue).map(e => e.nom_courant));
  const nb = questionsParEspece(x, dejaReconnues);
  // R242 (choix 10A) : chaque espèce par plusieurs chemins — 1re : sa photo, « Quelle est cette espèce ? » ;
  //   2e : « Laquelle est … ? » (le nom est donné, 4 photos) ; 3e : son cri (4 photos), sinon une autre forme (femelle, jeune…),
  //   sinon de nouveau « Laquelle est … ? ». Jamais larve ni chenille (photosJeu).
  const questions = ordreDefi(x, nb).map(e => {
    const k = rang[e.nom_courant] = (rang[e.nom_courant] || 0) + 1;
    const deja = vues[e.nom_courant] || [];
    const ph = photosDefi(e);
    const pieges = piegesDefi(e, x, pool);
    const avecPhotos = [e, ...pieges].every(o => estRenseigne(o.photo)) && pieges.length >= 3;
    let type = "photo";
    if (k === 2 && avecPhotos) type = "laquelle";
    if (k >= 3) {
      const forme = ph.find(p => !deja.includes(p.src) && etiquetteForme(p.sujet));
      type = typeof aUnCri === "function" && aUnCri(e) && typeof sonActif !== "undefined" && sonActif && avecPhotos ? "cri"
        : forme ? "photo" : avecPhotos ? "laquelle" : "photo";
    }
    let photo = null;
    if (type === "photo") {
      photo = deja.length ? (ph.find(p => !deja.includes(p.src) && etiquetteForme(p.sujet)) || ph.find(p => !deja.includes(p.src)) || ph[0]) : ph[0];
      if (photo) vues[e.nom_courant] = [...deja, photo.src];
    }
    const noms = melanger([e, ...pieges]);
    return { espece: e, type, photo: photo || null, noms, choix: null, retires: [] };
  });
  defiExp = { x, questions, i: 0, aides: { retirer: true, silhouettes: true }, silhouettesVisibles: false, prevues: nb,
              avantGain: gainExp(x), avantEtapes: empreintesExp(x), dejaReconnues };
  montrer("defiexp");
  afficherQuestionDefiExp();
}

// Le haut de l'écran : « Quitter », l'expédition, « 5 / 14 », puis la barre (une case par question)
function enteteDefiExp() {
  const d = defiExp;
  if (d.rep && d.rep.lance) return enteteRepechage(d.x.titre, d.rep.questions.map(q => ({ repondu: !!q.choix, juste: q.choix === q.espece })), d.rep.i);   // R249
  const cases = d.questions.map((q, k) => `<i class="${q.choix ? (q.choix === q.espece ? "ok" : "ko") : k === d.i ? "cur" : ""}"></i>`).join("");
  return `<div class="dfx-haut"><button class="cdo-quitter dfx-sortir" id="dfx-quitter" aria-label="Revenir à l'expédition (le défi est gardé)">←</button>
      <span class="cdo-titre">Me tester · ${echapper(d.x.titre)}</span><span class="dfx-compte">${Math.min(d.i + 1, d.questions.length)} / ${d.questions.length}</span></div>
    <div class="dfx-barre" style="grid-template-columns:repeat(${d.questions.length},1fr)">${cases}</div>`;
}
function imageQuestionDefi(q) {
  if (q.photo) return imagePhoto(q.photo.src, "Photo à reconnaître", false);
  return celluleImage(q.espece, false);   // sans photo libre : la silhouette, « photo à venir »
}
function arreterSonDefi() { if (typeof sonOreille !== "undefined" && sonOreille) { try { sonOreille.pause(); } catch (err) { /* rien */ } } }
const PLAY_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>`;
// R242 (10A) : une réponse en photo (« Laquelle est … ? », le cri) ; le nom s'écrit après la réponse
function boutonPhotoDefi(e, k, q) {
  const retire = q.retires.includes(e);
  return `<button class="ore-photo dfx-ph${retire ? " retire" : ""}" data-k="${k}" aria-label="Réponse ${k + 1}"${retire ? " disabled" : ""}>${celluleImage(e, true)}<span class="ore-nom"></span></button>`;
}
function afficherQuestionDefiExp() {
  const d = defiExp, q = qCouranteDefi(d), enRep = !!(d.rep && d.rep.lance);   // R249 : aussi les questions du repêchage
  arreterSonDefi();
  const zone = document.getElementById("vue-defiexp");
  const etiquette = q.photo ? etiquetteForme(q.photo.sujet) : "";
  const enPhotos = q.type === "laquelle" || q.type === "cri";
  const corps = q.type === "cri"
    ? `<div class="ore-ecoute dfx-ecoute"><button class="ore-play" id="dfx-play" aria-label="Écouter le cri">${PLAY_SVG}</button><p class="cdo-q">À qui est ce cri ?</p></div>
       <div class="ore-photos dfx-photos">${q.noms.map((e, k) => boutonPhotoDefi(e, k, q)).join("")}</div>`
    : q.type === "laquelle"
    ? `<p class="cdo-q dfx-q-nom">Laquelle est ${echapper(nomAvecArticle(q.espece))} ?</p>
       <div class="ore-photos dfx-photos">${q.noms.map((e, k) => boutonPhotoDefi(e, k, q)).join("")}</div>`
    : `<div class="cdo-photo">${imageQuestionDefi(q)}${etiquette ? `<small class="cdo-forme">${echapper(etiquette.replace(/^(La|Le|L')\s?/, "").replace(/^./, c => c.toUpperCase()))}</small>` : ""}</div>
       <p class="cdo-q">Quelle est cette espèce ?</p>
       <div class="cdo-noms">${q.noms.map((e, k) => boutonNomDefi(e, k, q)).join("")}</div>`;
  zone.innerHTML = `<div class="cdo dfx">${enteteDefiExp()}
      ${corps}
      <div class="cdo-retour" id="dfx-retour"></div>
      ${enRep ? "" : `<div class="dfx-aides" id="dfx-aides"><small>Vos aides</small>
        <button class="cdo-second" id="dfx-retirer"${d.aides.retirer ? "" : " disabled"}>Retirer deux réponses</button>
        ${enPhotos ? "" : `<button class="cdo-second" id="dfx-silh"${d.aides.silhouettes ? "" : " disabled"}>Voir les silhouettes</button>`}</div>`}
    </div>`;   // R249 : pas d'aide pendant le repêchage (une erreur n'y coûte rien)
  zone.querySelectorAll(".cdo-nom, .dfx-ph").forEach(b => b.onclick = () => repondreDefiExp(q.noms[+b.dataset.k], b));
  const play = document.getElementById("dfx-play");
  if (play) { play.onclick = () => ecouter(q.espece); setTimeout(() => { if (defiExp && qCouranteDefi(defiExp) === q && !q.choix) ecouter(q.espece); }, 250); }
  document.getElementById("dfx-quitter").onclick = mettreDefiDeCote;   // R241 (36.33) : plus de feuille « Quitter le défi ? »
  const retirer = document.getElementById("dfx-retirer"); if (retirer) retirer.onclick = () => aideRetirer(q);
  const silh = document.getElementById("dfx-silh"); if (silh) silh.onclick = () => aideSilhouettes();
  window.scrollTo(0, 0);
}
function boutonNomDefi(e, k, q) {
  const silh = defiExp.silhouettesVisibles && typeof fichierSilhouette === "function" ? fichierSilhouette(e) : "";
  const retire = q.retires.includes(e);
  return `<button class="cdo-nom${silh ? " avec-silh" : ""}${retire ? " retire" : ""}" data-k="${k}"${retire ? " disabled" : ""}>${silh ? `<img class="dfx-silh" src="${silh}" alt="" onerror="this.remove()">` : ""}<span>${echapper(e.nom_courant)}</span></button>`;
}
// Aide 1 : deux mauvaises réponses disparaissent (une fois par défi)
function aideRetirer(q) {
  const d = defiExp;
  if (!d.aides.retirer || q.choix) return;
  d.aides.retirer = false;
  q.retires = melanger(q.noms.filter(e => e !== q.espece)).slice(0, 2);
  afficherQuestionDefiExp();
}
// Aide 2 : la silhouette de chaque réponse, jusqu'à la fin de la question (une fois par défi)
function aideSilhouettes() {
  const d = defiExp;
  if (!d.aides.silhouettes || qCouranteDefi(d).choix) return;
  d.aides.silhouettes = false; d.silhouettesVisibles = true;
  afficherQuestionDefiExp();
}

function repondreDefiExp(choisie, bouton) {
  const d = defiExp, q = d ? qCouranteDefi(d) : null;
  if (!d || q.choix) return;
  const enRep = !!(d.rep && d.rep.lance);   // R249
  q.choix = choisie;
  const juste = choisie === q.espece;
  try { jouerSon(juste ? "bonne" : "mauvaise"); } catch (err) {}   // R239 (36.04) : les mêmes petits sons que le reste du jeu
  const zone = document.getElementById("vue-defiexp");
  zone.querySelectorAll(".cdo-nom").forEach((b, k) => {
    b.disabled = true;
    if (q.noms[k] === q.espece) b.classList.add("bon");
    else if (b === bouton) b.classList.add("faux");
  });
  // R242 (10A) + R239 (36.32) : réponse en photos → la bonne en grand, les autres en rangée avec leur nom ; toucher = agrandir
  const grille = zone.querySelector(".dfx-photos");
  if (grille) {
    grille.classList.add("repondu", "agrandir-groupe");
    zone.querySelectorAll(".dfx-ph").forEach((b, k) => {
      b.setAttribute("aria-disabled", "true"); b.classList.add("agr"); b.dataset.legende = q.noms[k].nom_courant;
      b.querySelector(".ore-nom").textContent = q.noms[k].nom_courant;
      if (q.noms[k] === q.espece) b.classList.add("bon"); else if (b === bouton) b.classList.add("faux"); else b.classList.add("autre");
    });
  }
  // Une espèce déjà reconnue avant le défi : la réponse compte pour elle, comme dans Coup d'œil (les autres attendent la fin)
  if (d.dejaReconnues.has(q.espece.nom_courant)) { if (juste) acquerir(q.espece, IDENTIFICATION); else if (!enRep) noterEchec(q.espece, IDENTIFICATION); }
  else if (!juste && !enRep && typeof noterEchec === "function") noterEchec(q.espece, IDENTIFICATION);   // pour la coriace des prochains défis (R249 : une erreur au repêchage ne compte pas)
  sauverDefiExp();   // R241 : le défi en cours est gardé à chaque réponse
  d.silhouettesVisibles = false;
  const aides = document.getElementById("dfx-aides");
  if (aides) aides.remove();
  // R249 : au repêchage, c'est fini à la dernière question, ou dès que les erreurs effacées suffisent
  const fin = enRep ? (d.rep.i >= d.rep.questions.length - 1 || erreursDefi(d) <= erreursPermisesDefi(d.questions.length)) : d.i >= d.questions.length - 1;
  const suivant = `<button class="cdo-suivant" id="dfx-suivant">${fin ? "Voir le résultat" : "Question suivante"}</button>`;
  const retour = document.getElementById("dfx-retour");
  if (juste && enRep) retour.innerHTML = `<p class="dfx-efface">Une erreur effacée.</p>${suivant}`;   // R249
  else if (juste) retour.innerHTML = suivant;   // R239 (36.09) : plus de ligne verte qui répète la réponse
  else retour.innerHTML = `${erreurCoteACote(q.espece, choisie, q.photo && q.photo.sujet)}${q.type === "cri" && typeof aUnCri === "function" && aUnCri(choisie)
      ? `<div class="dfx-ecouter"><small>Écoutez les deux :</small><button class="cdo-second" data-ecoute="${echapper(q.espece.nom_courant)}">${PLAY_SVG}${echapper(q.espece.nom_courant)}</button><button class="cdo-second" data-ecoute="${echapper(choisie.nom_courant)}">${PLAY_SVG}${echapper(choisie.nom_courant)}</button></div>` : ""}${suivant}`;
  retour.querySelectorAll("[data-ecoute]").forEach(b => b.onclick = () => ecouter(especeParNom(b.dataset.ecoute)));
  zone.querySelector(".dfx-barre").outerHTML = enteteDefiExp().match(/<div class="dfx-barre[^"]*"[^>]*>.*<\/div>$/s)[0];
  document.getElementById("dfx-suivant").onclick = () => { if (fin) finDefiExp(); else { if (enRep) d.rep.i++; else d.i++; sauverDefiExp(); afficherQuestionDefiExp(); } };
  const btn = document.getElementById("dfx-suivant"), r = btn.getBoundingClientRect();
  montrerSuiteJeu(btn, r);   // R234 (notes 15-16) : bouton fixé en bas sur téléphone, un seul défilement doux vers l'explication
  const ph = zone.querySelector(".cdo-photo"); if (ph) ph.onclick = () => document.getElementById("dfx-suivant").click();
}

// L'erreur expliquée, côte à côte (choix d'Aubin 2A) : votre choix, la bonne réponse, puis ce qui les sépare
// R243 : le bloc « Ce qui les sépare » seul (sert aussi à Coup d'œil)
function blocSepare(bonne, choisie, sujet) {
  const s = separeEntre(bonne, choisie, sujet);
  const ligne = (e, rp, cls) => `<li><i class="${cls}"></i><span><b>${echapper(majuscule(nomCourt(e)))} :</b> ${echapper(minusculeTexte(rp.texte))}</span></li>`;
  return s ? `<div class="dfx-separe"><small>${s.titre}</small>${s.critere ? `<p>${echapper(majuscule(s.critere))}</p>`
      : `<ul>${ligne(bonne, s.bonne, "ok")}${s.choisie ? ligne(choisie, s.choisie, "ko") : ""}</ul>`}</div>` : "";
}
function erreurCoteACote(bonne, choisie, sujet) {
  const bloc = blocSepare(bonne, choisie, sujet);
  return `<div class="dfx-erreur"><small class="dfx-pas">Pas cette fois</small><b class="dfx-cetait">C'était ${echapper(nomAvecArticle(bonne))}</b>
      <div class="dfx-duo agrandir-groupe"><figure class="ko agr" data-legende="Votre choix · ${echapper(choisie.nom_courant)}"><figcaption>Votre choix</figcaption><span class="agr-cadre">${celluleImage(choisie, true)}${LOUPE_SVG}</span><span>${echapper(choisie.nom_courant)}</span></figure>`
    + `<figure class="ok agr" data-legende="La bonne réponse · ${echapper(bonne.nom_courant)}"><figcaption>La bonne réponse</figcaption><span class="agr-cadre">${q2Image(bonne, sujet)}${LOUPE_SVG}</span><span>${echapper(bonne.nom_courant)}</span></figure></div>${bloc}</div>`;   // R239 (16b) : toucher pour agrandir
}
// La bonne espèce sous la forme de la photo posée (la femelle si c'était la femelle)
function q2Image(e, sujet) {
  const p = sujet ? photosDe(e).find(x => x.sujet === sujet) : null;
  return p ? imagePhoto(p.src, e.nom_courant, true) : celluleImage(e, true);
}
function nomCourt(e) { return e.nom_courant; }
function minusculeTexte(t) { return t ? t.charAt(0).toLowerCase() + t.slice(1) : ""; }
// Ce qui sépare deux espèces : un repère de chaque carte sur la même partie du corps, mais différent
// (« cravate noire sur le ventre jaune » / « tache blanche sur la nuque » s'il n'y a pas de partie commune) ;
// sinon le critère du groupe « À ne pas confondre » ; sinon le premier repère de chacune ; sinon rien.
// Étape R243 (17/11, note 21 du 16/11, tâche 36.21) : on cherche d'abord sur les parties presque toujours visibles sur une photo
//   (tête, museau, couleur du dos, ailes, coquille…), ensuite seulement queue, pattes, dessous ou détails à la loupe.
const ORDRE_PARTIES_VISIBLES = ["tete", "museau", "calotte", "bec", "oeil", "gorge", "cou", "poitrine", "dos", "corps", "ailes", "ailes_avant",
  "coquille", "carapace", "abdomen", "thorax", "cephalothorax", "crete", "cornes", "oreilles", "ventre", "ailes_arriere", "bouche", "antennes",
  "pinces", "nageoire_dos", "nageoire_cote", "queue", "nageoire_queue", "nageoires_dessous", "pattes"];
function rangPartie(p) { const i = ORDRE_PARTIES_VISIBLES.indexOf(p); return i < 0 ? ORDRE_PARTIES_VISIBLES.length : i; }
function separeEntre(bonne, choisie, sujet) {
  const rb = typeof reperesDe === "function" ? reperesDe(bonne) : null, rc = typeof reperesDe === "function" ? reperesDe(choisie) : null;
  const lb = (rb ? reperesPourForme(rb, formePourPhoto(rb, sujet || "")) : []).map((x, i) => ({ x, i }))
    .sort((a, b) => rangPartie(a.x.partie) - rangPartie(b.x.partie) || a.i - b.i).map(o => o.x);   // R243 : les parties visibles d'abord
  const lc = rc ? reperesPourForme(rc, formePourPhoto(rc, "")) : [];
  const different = (a, b) => typeof reperesDifferent === "function" ? reperesDifferent(a.texte, b.texte) : a.texte !== b.texte;
  // R243 : partie par partie (les plus visibles d'abord), la paire la plus comparable (le plus de mots en commun, mais différente)
  const communs = (a, b) => { if (typeof motsRepere !== "function") return 0; const A = motsRepere(a.texte), B = motsRepere(b.texte); return [...A].filter(w => B.has(w)).length; };
  for (const p of [...new Set(lb.map(x => x.partie))]) {
    if (!p || p === "NA") continue;
    let meilleure = null;
    for (const x of lb.filter(z => z.partie === p)) for (const y of lc.filter(z => z.partie === p))
      if (different(x, y) && (!meilleure || communs(x, y) > meilleure.n)) meilleure = { x, y, n: communs(x, y) };
    if (meilleure) return { titre: "Ce qui les sépare", bonne: meilleure.x, choisie: meilleure.y };
  }
  const g = typeof CONFUSIONS !== "undefined" ? CONFUSIONS.find(gr => gr.especes.includes(bonne.nom_courant) && gr.especes.includes(choisie.nom_courant) && gr.critere) : null;
  if (g) return { titre: "Ce qui les sépare", critere: g.critere };
  if (lb.length && lc.length) {
    const y = lc.find(z => different(lb[0], z));
    if (y) return { titre: "Pour les reconnaître", bonne: lb[0], choisie: y };
  }
  if (lb.length) return { titre: `Pour ${pe(bonne).la} reconnaître`, bonne: lb[0], choisie: null };
  return null;
}

// Le compte par espèce : combien de bonnes réponses sur combien de questions
function comptesDefiExp(d, jusqua) {
  const c = new Map(d.x.liste.map(e => [e, { bons: 0, poses: 0 }]));
  d.questions.slice(0, jusqua === undefined ? d.questions.length : jusqua).forEach(q => {
    if (!q.choix) return;
    const k = c.get(q.espece); k.poses++; if (q.choix === q.espece) k.bons++;
  });
  // R249 : chaque bonne réponse au repêchage efface une erreur de son espèce (jamais plus de bonnes que de questions)
  if (jusqua === undefined && d.rep) d.rep.questions.forEach(q => { if (q.choix && q.choix === q.espece) { const k = c.get(q.espece); if (k) k.bons = Math.min(k.poses, k.bons + 1); } });
  return c;
}
// Les espèces gagnées : toutes si le défi est réussi ; sinon celles réussies 2 fois sur 2
function reconnaitreParDefi(x, especes) {
  suivi.reconnuesDefi = suivi.reconnuesDefi || [];
  for (const e of especes) {
    if (!estIdentifiee(e)) acquerir(e, IDENTIFICATION);
    if (!suivi.reconnuesDefi.includes(e.nom_courant)) suivi.reconnuesDefi.push(e.nom_courant);
    if (typeof marquerRevue === "function") marquerRevue(x.id, e);   // elle compte pour cette expédition (étape 316)
  }
  sauvegarder();
}
function especesGagneesDefi(d, reussi, jusqua) {
  const c = comptesDefiExp(d, jusqua);
  const prevues = e => d.questions.filter(q => q.espece === e).length;   // R242 : 2 ou 3 selon l'espèce
  return d.x.liste.filter(e => reussi || (c.get(e).poses >= prevues(e) && c.get(e).poses > 0 && c.get(e).bons === c.get(e).poses));
}

// R249 : l'écran « Repêchage · Vous y êtes presque »
function lancerRepechageDefi(d) {
  const especes = especesRepechage(d.questions.map(q => ({ espece: q.espece, juste: q.choix === q.espece })));
  d.rep = { questions: especes.map(e => questionAutreCheminDefi(e, d)), i: 0, lance: false };
  sauverDefiExp();
  afficherAnnonceRepechage();
}
function afficherAnnonceRepechage() {
  const d = defiExp, zone = document.getElementById("vue-defiexp");
  arreterSonDefi();
  zone.innerHTML = ecranRepechage(`Me tester · ${d.x.titre}`, erreursDefi(d), erreursPermisesDefi(d.questions.length), d.rep.questions.length);
  document.getElementById("dfx-quitter").onclick = mettreDefiDeCote;
  document.getElementById("dfx-rep-go").onclick = () => { d.rep.lance = true; sauverDefiExp(); afficherQuestionDefiExp(); };
  document.getElementById("dfx-rep-passer").onclick = () => { d.rep.questions.forEach(q => { if (!q.choix) q.passee = true; }); d.rep.passe = true; finDefiExp(); };
  window.scrollTo(0, 0);
}
function finDefiExp() {
  const d = defiExp, x = d.x;
  const total = d.questions.length, bons = d.questions.filter(q => q.choix === q.espece).length;
  // R249 : 4 ou 5 erreurs (pour 3 permises) → le repêchage, une seule fois par défi
  if (!d.rep && repechageNecessaire(total - bons, erreursPermisesDefi(total))) { lancerRepechageDefi(d); return; }
  const reussi = erreursDefi(d) <= erreursPermisesDefi(total);   // R249 : les erreurs effacées au repêchage ne comptent plus
  const repechage = !!(d.rep && d.rep.questions.some(q => q.choix === q.espece));
  oublierDefiExp(x); arreterSonDefi();   // R241 : le défi est fini, plus rien à reprendre
  const gagnees = especesGagneesDefi(d, reussi);
  reconnaitreParDefi(x, gagnees);
  suivi.defisExp = suivi.defisExp || {};
  const st = suivi.defisExp[x.id] = suivi.defisExp[x.id] || { joues: 0, reussi: false, meilleur: 0 };
  st.joues++; st.reussi = st.reussi || reussi; st.meilleur = Math.max(st.meilleur || 0, bons); st.dernier = { bons, total };
  sauvegarder();
  const empreintes = Math.max(0, gainExp(x) - d.avantGain), etapeGagnee = empreintesExp(x) > d.avantEtapes;
  if (typeof majBandeExpedition === "function") try { majBandeExpedition(x); } catch (e) { /* la bande n'est pas affichée */ }
  const zone = document.getElementById("vue-defiexp");
  const c = comptesDefiExp(d);
  const aRevoir = x.liste.filter(e => !faiteDans(x, e, 1));
  const vignette = e => `<img src="${photoMini(photoEsp(e))}" alt="${echapper(e.nom_courant)}">`;
  if (reussi) {
    const ensuite = typeof aUneEtape2 === "function" && aUneEtape2(x) && !etapeFinie(x, 2);
    zone.innerHTML = `<div class="cdo dfx dfx-fin">
        <div class="dfx-medaille" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>
        <h2>Défi réussi</h2>
        <p class="cdo-sous">${bons} bonnes réponses sur ${total}${repechage ? " · repêché" : ""}</p>
        <div class="dfx-ronds">${x.liste.map(vignette).join("")}</div>
        <ul class="dfx-lignes">
          <li>Les ${x.liste.length} espèces sont <b>reconnues</b>.</li>
          <li>${empreintes ? `+${empreintes} empreinte${empreintes > 1 ? "s" : ""} : celles de l'étape 1.` : "Vos empreintes de l'étape 1 étaient déjà gagnées."}</li>
          ${ensuite ? `<li>Pour les <b>comprendre</b> : l'étape Ensemble, comment elles vivent ici.</li>` : ""}
        </ul>
        <button class="cdo-suivant" id="dfx-voir">Revenir à l'expédition</button>
      </div>`;
  } else {
    const gardees = x.liste.filter(e => faiteDans(x, e, 1));
    const repere = e => { const r = typeof reperesDe === "function" ? reperesDe(e) : null; const q = d.questions.find(z => z.espece === e && z.choix !== e);
      const l = r ? reperesPourForme(r, formePourPhoto(r, (q && q.photo && q.photo.sujet) || "")) : [];
      const forme = q && q.photo && etiquetteForme(q.photo.sujet);
      return l.length ? `${forme ? `${forme} : ` : ""}${forme ? minusculeTexte(l[0].texte) : l[0].texte}` : ""; };
    const n = aRevoir.length;
    zone.innerHTML = `<div class="cdo dfx dfx-fin">
        <h2>${erreursDefi(d) <= erreursPermisesDefi(total) + 2 ? "Presque" : "Pas encore"}</h2>
        <p class="cdo-sous">${bons} bonnes réponses sur ${total} · il en faut ${total - erreursPermisesDefi(total)}</p>
        ${gardees.length ? `<div class="dfx-groupe ok"><small>Reconnues · gardées</small><div class="dfx-pastilles">${gardees.map(e => `<span>${vignette(e)}${echapper(e.nom_courant)}</span>`).join("")}</div></div>` : ""}
        ${n ? `<div class="dfx-groupe"><small>À revoir</small><ul class="dfx-revoir">${aRevoir.map(e => `<li>${vignette(e)}<span><b>${echapper(e.nom_courant)}</b>${repere(e) ? `<small>${echapper(repere(e))}</small>` : ""}</span></li>`).join("")}</ul></div>` : ""}
        <p class="dfx-deux">Deux façons de finir l'expédition :</p>
        <div class="dfx-boutons"><button class="cdo-second" id="dfx-decouvrir">Découvrir ${n > 1 ? `les ${n}` : "la dernière"}</button><button class="cdo-suivant" id="dfx-rejouer">Rejouer le défi</button></div>
        <button class="dfx-lien" id="dfx-voir">Plus tard · revenir à l'expédition</button>
      </div>`;
    document.getElementById("dfx-decouvrir").onclick = () => { defiExp = null; lancerExpedition(x, 1); };
    document.getElementById("dfx-rejouer").onclick = () => lancerDefiExp(x);
  }
  document.getElementById("dfx-voir").onclick = () => { defiExp = null; ouvrirExpedition(x); };
  window.scrollTo(0, 0);
  if (etapeGagnee) {
    const finieAussi = etapeFinie(x, 2);   // une expédition sans étape 2 se termine avec l'étape 1
    feter({ etiquette: `Expédition · ${x.titre}`, titre: finieAussi ? "Expédition terminée !" : "Étape 1 réussie",
            detail: empreintes ? `+${empreintes} empreinte${empreintes > 1 ? "s" : ""}` : "", son: "badge",
            visuel: `<div class="fete-visuel rang exp-fete">${PAS_SVG}</div>` });
  } else if (empreintes) setTimeout(() => afficherBulle(`+${empreintes} empreinte${empreintes > 1 ? "s" : ""}`), 600);
  if (empreintes) verifierOuverture();
}

// (R241, note 33 : la feuille « Quitter le défi ? » est retirée ; sortir met le défi de côté, voir mettreDefiDeCote.
//  « Découvrir plutôt » reste sur la page de l'expédition.)

// ==================================================================
// Étape E2-9 (16/11) : l'expédition à deux portes (choix d'Aubin « 1A » puis série 2 « 1B · 2A · 3A », Rencontres en cours « 2B »)
//   • au départ : deux portes égales, « Découvrir » / « Me tester », et une phrase : on peut changer en route ;
//   • Rencontres en cours : « Continuer les Rencontres » d'abord (progression, prochaine espèce), « Me tester plutôt » dessous ;
//   • après un défi pas réussi : le dernier défi, ce qui est gardé, puis les deux portes (« Découvrir les N », « Rejouer le défi ») ;
//   • l'étape 1 finie par un défi : les Rencontres restent jouables (photo, sa vie, Étonnant), sans empreintes en double.
// Une espèce déjà connue ailleurs passe d'elle-même par la courte révision (une photo), comme avant (étape 316) : c'est
// sa « manche défi » ; rien ne change pour elle.
// ==================================================================
const PICTO_DECOUVRIR = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="14" r="3.5"/><circle cx="17" cy="14" r="3.5"/><path d="M10.5 14h3M3.5 14l2-7h3l1 4M20.5 14l-2-7h-3l-1 4"/></svg>`;
const PICTO_TESTER = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.8"/></svg>`;
function minutesRencontres(n) { return Math.max(2, Math.round(n * 2)); }
function minutesDefi(nq) { return Math.max(3, Math.round(nq * 0.3)); }   // R242 (13A) : d'après le nombre de questions (20 → environ 6 min)
function porteDecouvrir(titre, texte, bas) {
  return `<button class="dfx-p decouvrir" data-porte="decouvrir">${PICTO_DECOUVRIR}<b>${titre}</b><span>${texte}</span><small>${bas}</small></button>`;
}
function porteTester(titre, texte, bas) {
  return `<button class="dfx-p tester" data-porte="tester">${PICTO_TESTER}<b>${titre}</b><span>${texte}</span><small>${bas}</small></button>`;
}
function portesEtape1(x) {
  const n = x.liste.length, av = avanceeEtape(x, 1), st = etatDefiExp(x);
  const gain = `<small class="dfx-gain">+${gainEtape(x, 1)} ${PAS_SVG} · 1 par espèce, par l'une ou l'autre porte</small>`;
  const reste = n - av.faites;
  if (defiEnPause(x)) {                     // R241 (36.17) : un défi mis de côté — « Reprendre le défi » d'abord (comme « Continuer les Rencontres », 2B)
    const s = suivi.defisEnCours[x.id], total = s.questions.length, faites = s.questions.filter(q => q.c).length;
    const erreurs = s.questions.filter(q => q.c && q.c !== q.e).length;
    return `<div class="dfx-portes encours"><div class="etiq-jeu">Étape 1 · Reconnaître</div>
        <div class="dfx-encours"><div class="dfx-encours-haut"><b>Me tester · en cours</b><small>${faites} sur ${total}</small></div>
          <i class="jauge-jeu"><b style="width:${Math.round(100 * faites / Math.max(1, total))}%"></b></i>
          <div class="dfx-prochaine"><span>${erreurs ? `${erreurs} erreur${erreurs > 1 ? "s" : ""} jusqu'ici` : "Aucune erreur jusqu'ici"} · ${erreursPermisesDefi(total)} permise${erreursPermisesDefi(total) > 1 ? "s" : ""}</span></div>
          <button class="cdo-suivant" data-porte="reprendre">Reprendre le défi</button></div>
        <button class="dfx-plutot" data-porte="decouvrir">${PICTO_DECOUVRIR}Découvrir plutôt</button>
        <small class="dfx-note">Le défi reste de côté : vous pourrez le reprendre plus tard.</small>${gain}</div>`;
  }
  if (st && st.dernier && !st.reussi) {     // après un défi pas réussi
    return `<div class="dfx-portes"><div class="etiq-jeu">Étape 1 · Reconnaître</div>
        <p class="dfx-bandeau">Dernier défi : <b>${st.dernier.bons} sur ${st.dernier.total}</b>.${av.faites ? ` ${av.faites} espèce${av.faites > 1 ? "s sont" : " est"} déjà reconnue${av.faites > 1 ? "s" : ""} ;` : ""} il en reste ${reste}. Continuez comme vous préférez.</p>
        <div class="dfx-deux-portes">${porteDecouvrir("Découvrir", `Rencontrer ${reste > 1 ? `les ${reste} espèces` : "l'espèce"} à revoir.`, `Environ ${minutesRencontres(reste)} min`)}
          ${porteTester("Me tester", `Rejouer le défi sur les ${n} espèces.`, `Environ ${minutesDefi(nbQuestionsDefi(x))} min`)}</div>${gain}</div>`;
  }
  const commencees = av.faites > 0 || x.liste.some(e => estTentee(x, e));
  if (commencees) {                         // Rencontres en cours (2B)
    const p = especeAConnaitre(x);
    const prochaine = !p ? (aRattraper(x).length ? `À revoir : ${texteARevoir(x)}` : "")
      : especeFaite(p, 1) ? `À revoir ici : ${especesARevoirIci(x).length} espèce${especesARevoirIci(x).length > 1 ? "s" : ""} déjà rencontrée${especesARevoirIci(x).length > 1 ? "s" : ""} ailleurs (une photo chacune)`
      : `Prochaine rencontre : ${estIdentifiee(p) ? echapper(p.nom_courant) : "une espèce inconnue"}`;
    const vign = p && !especeFaite(p, 1) ? `<span class="dfx-vign${estIdentifiee(p) ? "" : " inconnue"}"><img src="${photoMini(photoEsp(p))}" alt=""></span>` : "";
    return `<div class="dfx-portes encours"><div class="etiq-jeu">Étape 1 · Reconnaître</div>
        <div class="dfx-encours"><div class="dfx-encours-haut"><b>Découvrir · en cours</b><small>${av.faites} sur ${n}</small></div>
          <i class="jauge-jeu"><b style="width:${Math.round(100 * av.faites / n)}%"></b></i>
          ${prochaine ? `<div class="dfx-prochaine">${vign}<span>${prochaine}</span></div>` : ""}
          <button class="cdo-suivant" data-porte="decouvrir">Continuer les Rencontres</button></div>
        <button class="dfx-plutot" data-porte="tester">${PICTO_TESTER}Me tester plutôt</button>
        <small class="dfx-note">Le défi porte sur les ${n} espèces.${av.faites ? ` ${av.faites > 1 ? `Les ${av.faites} déjà reconnues le restent` : "Celle déjà reconnue le reste"}, quoi qu'il arrive.` : ""}</small>${gain}</div>`;
  }
  return `<div class="dfx-portes"><div class="etiq-jeu">Étape 1 · Reconnaître</div>
      <p class="dfx-phrase">Deux façons de reconnaître ces ${n} espèces : les découvrir une à une, ou vous tester tout de suite. Vous pourrez changer en route.</p>
      <div class="dfx-deux-portes">${porteDecouvrir("Découvrir", "Chaque espèce, une à une : sa carte, sa vie.", `Environ ${minutesRencontres(n)} min`)}
        ${porteTester("Me tester", `${nbQuestionsDefi(x)} questions, ${erreursPermisesDefi(nbQuestionsDefi(x))} erreurs permises. Chaque erreur est expliquée.`, `Environ ${minutesDefi(nbQuestionsDefi(x))} min · 2 aides`)}</div>${gain}</div>`;
}
function brancherPortes(zone, x) {
  zone.querySelectorAll("[data-porte]").forEach(b => b.onclick = () => b.dataset.porte === "tester" ? lancerDefiExp(x) : b.dataset.porte === "reprendre" ? reprendreDefiExp(x) : lancerExpedition(x, 1));
  zone.querySelectorAll("[data-rencontrer]").forEach(b => b.onclick = () => { const e = especesSansRencontre(x)[0]; if (e) rencontrerEspeceExp(x, e); });
}
// Les espèces reconnues par un défi dont la Rencontre n'a pas été faite (photo, sa vie, Étonnant restent à voir)
function especesSansRencontre(x) {
  return x.liste.filter(e => reconnueParDefi(e) && estRenseigne(e.photo) && trouvesEspece(e, 1) < butEspece(e, 1));
}
function rencontrerEspeceExp(x, e) {
  rencontreDuJour = null; session = null;
  modeLibre = false; depuisArcade = false;
  jeuChoisi = "rencontre";
  lancementDirect = true; montrer("jouer"); lancementDirect = false;
  demarrerFocus(e, { expedition: { id: x.id, etape: 1, avant: empreintesExp(x), avantGain: gainExp(x), avantTerr: empreintesTerritoire(x.territoire),
                                    faitesAvant: avanceeEtape(x, 1).faites } });
  majFilExpedition(x, 1);
  window.scrollTo(0, 0);
}
