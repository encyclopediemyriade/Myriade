// ==================================================================
// 27. LE DÉFI D'UNE EXPÉDITION : « Me tester » (étape E2-8, 16/11/2026)
// ==================================================================
// La seconde partie (reprise_seconde_partie.md), choix d'Aubin des 15 et 16/11 :
//   • deux façons de valider l'étape 1 d'une expédition : les Rencontres (Découvrir) OU un défi réussi (Me tester) ;
//   • le défi : 2 questions par espèce (10 à 14), réussi avec 2 erreurs au plus ; la partie va toujours au bout ;
//     pièges proches (sosies, même groupe…), autres formes (femelle, jeune, hiver ; jamais larve ni chenille) ;
//     aides : retirer deux réponses (2 fois), voir les silhouettes (1 fois) — R285 ; pas de chronomètre ;
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
// Étape R285b (note 6 du 21/11, choix 6B d'Aubin, 21 h 51) : toutes les questions annoncées sont posées. Dès que les bonnes
//   réponses suffisent, le jeu le dit (« le défi est réussi ») ; la question qui reste sert à revoir l'espèce et ne compte plus.
//   La ligne au-dessus de l'explication, commune aux deux défis : erreurs = après cette réponse ; i = rang de la question.
function ligneRepechage(juste, erreurs, permises, i, n) {
  const avant = juste ? erreurs + 1 : erreurs, reste = n - 1 - i;
  if (!juste || avant <= permises) return "";   // une erreur ici ne coûte rien ; après la réussite, rien à redire
  if (erreurs > permises) return `<p class="dfx-efface">Une erreur effacée.</p>`;
  const suite = reste > 1 ? ` Encore ${reste} questions, pour revoir ces espèces : elles ne comptent plus.` : reste === 1 ? " Dernière question, pour revoir l'espèce : elle ne compte plus." : "";
  return `<p class="dfx-efface">Erreur effacée · le défi est réussi.${suite}</p>`;
}
// ==================================================================
// Étape R274 (19/11, session T5 du test du 19/11, n° 8 ; choix 5A d'Aubin, qui complète « la partie va au bout » du 17/11) :
//   critère « le joueur sait où il en est, et n'est jamais retenu dans un défi qu'il ne peut plus réussir ».
//   • un compte discret sous la barre : « 2 erreurs sur 3 permises » (au-delà : « 4 erreurs · 3 permises · repêchage à la fin ») ;
//   • le défi est PERDU quand même le repêchage ne peut plus le sauver (plus de 2 erreurs de trop : la 6e quand 3 sont
//     permises). À ce moment, une seule fois : « Continuer quand même » ou « Arrêter et découvrir ces espèces ».
//   Commun aux deux défis (étape 1 ici, « Me tester » d'Approfondir dans 29_approfondir.js).
// ==================================================================
function defiPerdu(erreurs, permises) { return erreurs > permises + REPECHAGE_MAX; }
function texteCompteErreurs(erreurs, permises) {
  const s = n => n > 1 ? "s" : "";
  if (!erreurs) return `Aucune erreur · ${permises} permise${s(permises)}`;
  if (erreurs <= permises) return `${erreurs} erreur${s(erreurs)} sur ${permises} permise${s(permises)}`;
  return `${erreurs} erreurs · ${permises} permise${s(permises)}${defiPerdu(erreurs, permises) ? "" : " · repêchage à la fin"}`;
}
function ligneCompteErreurs(erreurs, permises) {
  return `<p class="dfx-erreurs${erreurs > permises ? " trop" : ""}" id="dfx-erreurs">${texteCompteErreurs(erreurs, permises)}</p>`;
}
function majCompteErreurs(erreurs, permises) {
  const l = document.getElementById("dfx-erreurs");
  if (l) { l.textContent = texteCompteErreurs(erreurs, permises); l.classList.toggle("trop", erreurs > permises); }
}
// Le choix, quand le défi est perdu. mot = « défi » ou « test » ; arreter = le texte du bouton d'arrêt
function blocDefiPerdu(mot, arreter) {
  return `<div class="dfx-perdu" id="dfx-perdu"><b>Ce ${mot} ne sera pas réussi cette fois.</b>
      <p>Il y a trop d'erreurs pour le repêchage. Vous pouvez aller au bout pour vous entraîner, ou vous arrêter là : ce qui est réussi est gardé.</p>
      <div class="dfx-boutons"><button class="cdo-second" id="dfx-continuer">Continuer quand même</button><button class="cdo-suivant" id="dfx-arreter">${arreter}</button></div></div>`;
}
// Le même choix en plein écran : quand on reprend un défi mis de côté juste à ce moment-là
function ecranDefiPerdu(titre, mot, arreter, erreurs, permises) {
  return `<div class="cdo dfx dfx-rep"><div class="dfx-haut"><button class="cdo-quitter dfx-sortir" id="dfx-quitter" aria-label="Revenir à l'expédition (le ${mot} est gardé)">←</button>
      <span class="cdo-titre">${echapper(titre)}</span></div>
      <p class="cdo-sous">${texteCompteErreurs(erreurs, permises)}</p>${blocDefiPerdu(mot, arreter)}</div>`;
}
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
        ${n > besoin ? `<li>Toutes les questions sont posées : une fois le défi réussi, la dernière sert à revoir l'espèce.</li>` : ""}
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
  const nb = new Map(x.liste.map(e => [e, !jouableEnJeu(e) ? 0 : deja && deja.has(e.nom_courant) ? 2 : DEFI_PAR_ESPECE]));   // R284 (45.04) : sans photo, aucune question
  let total = [...nb.values()].reduce((a, b) => a + b, 0);
  for (const e of melanger(x.liste.slice())) { if (total <= DEFI_MAX_QUESTIONS) break; if (nb.get(e) > 2) { nb.set(e, nb.get(e) - 1); total--; } }
  if (typeof DEFI_VARIE !== "undefined" && DEFI_VARIE) ajusterPassagesVarie(x, nb);
  return nb;
}
// Étape R284 (45.01) : depuis que repères et indices doivent vraiment départager, certaines expéditions n'ont plus assez de
//   façons différentes pour tenir 5A (aucune façon plus de 5 fois). Plutôt que de répéter une façon, on retire un passage aux
//   espèces qui en ont 3 (jamais moins de 2) jusqu'à ce que les façons possibles suffisent.
function ajusterPassagesVarie(x, nb) {
  const pool = poolDefi(x), f = new Map(x.liste.filter(jouableEnJeu).map(e => [e, faconsEspece(e, x, pool)]));
  const sep = paireSepareDefi(x) ? 2 : 0, qq = x.liste.filter(e => jouableEnJeu(e) && nb.get(e) > 0).length >= 4 ? 4 : 0;
  const capacite = FACONS_SIMPLES.reduce((s, fa) => s + Math.min(FACON_MAX, [...f.values()].reduce((a, o) => a + (o[fa] || 0), 0)), 0) + sep + qq;
  let total = [...nb.values()].reduce((a, b) => a + b, 0);
  const ordre = x.liste.filter(e => nb.get(e) > 2).sort((a, b) => a.nom_courant.localeCompare(b.nom_courant));   // toujours les mêmes (le compte de la porte reste juste)
  for (const e of ordre) { if (total <= capacite) break; nb.set(e, nb.get(e) - 1); total--; }
}
function nbQuestionsDefi(x) {
  const deja = new Set(x.liste.filter(e => typeof estReconnue === "function" && estReconnue(e)).map(e => e.nom_courant));
  const sepa = typeof DEFI_VARIE !== "undefined" && DEFI_VARIE && paireSepareDefi(x) ? 1 : 0;   // R283 : « Ce qui les sépare » = une question pour deux espèces
  return [...questionsParEspece(x, deja).values()].reduce((a, b) => a + b, 0) - sepa;
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
  const ici = melanger(x.liste.filter(o => o !== e && jouableEnJeu(o)
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
  for (const e of x.liste) if (jouableEnJeu(e) && (parEspece[e.nom_courant] || 0) > max) { max = parEspece[e.nom_courant]; meilleure = e; }
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
// Étape R285 (47.03, choix « Une de plus » du 21/11, 20 h 40) : « Retirer deux réponses » 2 fois par partie,
//   « Voir les silhouettes » 1 fois ; le bouton dit ce qui reste. Une ancienne partie (aides en oui / non) est reprise sans rien perdre :
//   aide encore là = le nouveau nombre ; « Retirer » déjà utilisé = 1 restante ; silhouettes déjà vues = 0.
const AIDES_DEFI = { retirer: 2, silhouettes: 1 };
function aidesDefi(a) {
  const n = (v, max) => v === true || v === undefined || v === null ? max : v === false ? max - 1 : Number.isFinite(+v) ? Math.max(0, Math.min(max, +v)) : max;
  return { retirer: n(a && a.retirer, AIDES_DEFI.retirer), silhouettes: n(a && a.silhouettes, AIDES_DEFI.silhouettes) };
}
function texteAideDefi(nom, reste, max) {
  return `${nom}<span class="dfx-aide-reste">${reste > 0 ? `${reste} restante${reste > 1 ? "s" : ""}` : `déjà utilisée${max > 1 ? "s" : ""}`}</span>`;
}
function sauverDefiExp() {
  const d = defiExp;
  if (!d || !suivi) return;
  suivi.defisEnCours = suivi.defisEnCours || {};
  const plat = q => ({ e: q.espece.nom_courant, t: q.type || "photo", p: q.photo ? q.photo.src : null, s: q.photo ? q.photo.sujet || "" : "",
      n: q.noms.map(o => o.nom_courant), c: q.choix ? q.choix.nom_courant : null, r: q.retires.map(o => o.nom_courant),
      // R283 : ce qu'il faut pour reposer les nouvelles façons à l'identique
      ...(q.rp ? { rp: { partie: q.rp.partie, texte: q.rp.texte, couleur: q.rp.couleur || "NA", pour: q.rp.pour || "" } } : {}),
      ...(q.indices ? { ix: q.indices.map(i => [i.etiq, i.texte]) } : {}),
      ...(q.autre ? { a: q.autre.nom_courant, it: q.items.map(z => [z.e.nom_courant, z.rp.texte, z.rp.partie, z.place ? z.place.nom_courant : null]) } : {}),
      ...(q.type === "quiestqui" ? { g: q.g, po: !!q.pose } : {}) });
  suivi.defisEnCours[d.x.id] = { i: d.i, aides: { ...d.aides }, pv: !!d.perduVu, questions: d.questions.map(plat),
    rep: d.rep ? { i: d.rep.i, lance: !!d.rep.lance, questions: d.rep.questions.map(plat) } : null };   // R249 : le repêchage aussi
  sauvegarder();
}
function oublierDefiExp(x) { if (suivi && suivi.defisEnCours && suivi.defisEnCours[x.id]) { delete suivi.defisEnCours[x.id]; sauvegarder(); } }
function defiEnPause(x) {
  const s = suivi && suivi.defisEnCours && suivi.defisEnCours[x.id];
  const repEnCours = s && s.rep && s.rep.questions && s.rep.questions.some(q => !q.c);   // R249 : un repêchage pas fini
  return !!(s && s.questions && (s.questions.some(q => !q.c || (q.t === "quiestqui" && !q.po)) || repEnCours) && !etapeFinie(x, 1));   // R283 : une manche pas finie
}
function reprendreDefiExp(x) {
  const s = suivi && suivi.defisEnCours && suivi.defisEnCours[x.id];
  if (!s) { lancerDefiExp(x); return; }
  const E = n => especeParNom(n);
  const relire = q => {
    const e = E(q.e); if (!e) return null;
    const photo = q.p ? (photosDe(e).find(p => p.src === q.p) || { src: q.p, sujet: q.s }) : null;
    const base = { espece: e, type: q.t || "photo", photo, noms: q.n.map(E).filter(Boolean), choix: q.c ? E(q.c) : null, retires: (q.r || []).map(E).filter(Boolean) };
    // R283 : les nouvelles façons ; une donnée qui manque (ou une façon inconnue) → la question d'avant, sur sa photo
    const enPhoto = () => ({ ...base, type: "photo", photo: photo || photosDefi(e)[0] || null });
    if (base.type === "repere") return q.rp && q.rp.texte ? { ...base, rp: q.rp } : enPhoto();
    if (base.type === "indices") return q.ix && q.ix.length ? { ...base, indices: q.ix.map(([etiq, texte]) => ({ etiq, texte })) } : enPhoto();
    if (base.type === "separe") {
      const b = q.a && E(q.a), items = (q.it || []).map(([n, texte, partie, pl]) => ({ e: E(n), rp: { texte, partie }, place: pl ? E(pl) : null }));
      return b && items.length === 4 && items.every(z => z.e) ? { ...base, autre: b, items } : enPhoto();
    }
    if (base.type === "quiestqui") return photo && q.g ? { ...base, g: q.g, pose: !!q.po } : enPhoto();
    return ["photo", "laquelle", "cri"].includes(base.type) ? base : enPhoto();
  };
  const questions = s.questions.map(relire);
  const repQ = s.rep && s.rep.questions ? s.rep.questions.map(relire) : null;   // R249
  if (questions.some(q => !q || q.noms.length < 2) || (repQ && repQ.some(q => !q || q.noms.length < 2))) { oublierDefiExp(x); lancerDefiExp(x); return; }   // données changées : on repart
  const i = questions.findIndex(q => !faiteDefi(q));   // R283
  defiExp = { x, questions, i: i < 0 ? questions.length - 1 : i, aides: aidesDefi(s.aides), silhouettesVisibles: false,
              avantGain: gainExp(x), avantEtapes: empreintesExp(x), dejaReconnues: new Set(x.liste.filter(estReconnue).map(e => e.nom_courant)), perduVu: !!s.pv };
  if (repQ) { repQ.forEach(q => q.rep = true); const j = repQ.findIndex(q => !q.choix); defiExp.rep = { questions: repQ, i: j < 0 ? repQ.length - 1 : j, lance: !!s.rep.lance }; }
  montrer("defiexp");
  if (defiExp.rep && !defiExp.rep.lance) { afficherAnnonceRepechage(); return; }   // R249 : repris sur l'écran « Vous y êtes presque »
  if (!defiExp.rep && !defiExp.perduVu && i > 0 && defiPerdu(erreursDefi(defiExp), erreursPermisesDefi(questions.length))) { afficherChoixDefiPerdu(); return; }   // R274 (5A)
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
// R274 (5A) : « Arrêter et découvrir ces espèces » — le défi s'arrête là : ce qui est réussi est gardé (comme « ← »),
//   il compte comme un défi joué, puis les Rencontres (Découvrir) commencent pour les espèces qui restent.
function arreterDefiExp() {
  const d = defiExp;
  if (!d) return;
  const x = d.x, k = d.questions.findIndex(q => !q.choix), poses = k < 0 ? d.questions.length : k;
  arreterSonDefi(); oublierDefiExp(x);
  const gardees = especesGagneesDefi(d, false, poses);
  if (gardees.length) reconnaitreParDefi(x, gardees);
  const bons = d.questions.filter(q => q.choix && q.choix === q.espece).length;
  suivi.defisExp = suivi.defisExp || {};
  const st = suivi.defisExp[x.id] = suivi.defisExp[x.id] || { joues: 0, reussi: false, meilleur: 0 };
  st.joues++; st.meilleur = Math.max(st.meilleur || 0, bons); st.dernier = { bons, total: poses };
  sauvegarder();
  defiExp = null;
  if (x.liste.every(e => faiteDans(x, e, 1))) { ouvrirExpedition(x); return; }   // (ne devrait pas arriver : rien ne reste à découvrir)
  lancerExpedition(x, 1);
  if (gardees.length) setTimeout(() => afficherBulle(gardees.length > 1 ? `${gardees.length} espèces déjà reconnues · gardées` : "1 espèce déjà reconnue · gardée"), 400);
}
function brancherChoixDefiPerdu(continuer) {
  document.getElementById("dfx-continuer").onclick = () => { defiExp.perduVu = true; sauverDefiExp(); continuer(); };
  document.getElementById("dfx-arreter").onclick = arreterDefiExp;
}
function afficherChoixDefiPerdu() {
  const d = defiExp, zone = document.getElementById("vue-defiexp");
  arreterSonDefi();
  zone.innerHTML = ecranDefiPerdu(`Me tester · ${d.x.titre}`, "défi", "Arrêter et découvrir ces espèces", erreursDefi(d), erreursPermisesDefi(d.questions.length));
  document.getElementById("dfx-quitter").onclick = mettreDefiDeCote;
  brancherChoixDefiPerdu(afficherQuestionDefiExp);
  window.scrollTo(0, 0);
}
function lancerDefiExp(x) {
  if (!x) return;
  if (typeof oublierDefiExp === "function") oublierDefiExp(x);   // R241 : un nouveau défi remplace celui mis de côté
  if (typeof estOuverte === "function" && !estOuverte(x)) { afficherBulle("Cette expédition s'ouvrira en avançant sur le chemin"); return; }
  if (typeof noterDepartExp === "function") noterDepartExp(x);   // R277 (37.03) : ce qui est déjà au carnet avant l'expédition
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
  if (DEFI_VARIE) {   // R283 : reconnaître autrement (repère, indices, Qui est qui ?, Ce qui les sépare)
    defiExp = { x, questions: questionsDefiVarie(x, nb, pool), i: 0, aides: aidesDefi(), silhouettesVisibles: false, prevues: nb,
                avantGain: gainExp(x), avantEtapes: empreintesExp(x), dejaReconnues };
    montrer("defiexp");
    afficherQuestionDefiExp();
    return;
  }
  // R242 (choix 10A) : chaque espèce par plusieurs chemins — 1re : sa photo, « Quelle est cette espèce ? » ;
  //   2e : « Laquelle est … ? » (le nom est donné, 4 photos) ; 3e : son cri (4 photos), sinon une autre forme (femelle, jeune…),
  //   sinon de nouveau « Laquelle est … ? ». Jamais larve ni chenille (photosJeu).
  // Étape R264 (40.15, choix 8B) : les questions de chaque espèce sont préparées dans l'ordre (1re photo, 2e « Laquelle
  //   est… ? », 3e cri ou autre forme), puis enchaînées pour que jamais deux questions de suite ne soient du même genre
  //   (avant : un tour entier de « Quelle est cette espèce ? », puis un tour de « Laquelle est… ? »), ni sur la même
  //   espèce ; la coriace reste la dernière.
  const prevues = new Map();
  for (const e of x.liste) for (let k = 0; k < (nb ? nb.get(e) : 2); k++) prevues.set(e, (prevues.get(e) || 0) + 1);
  const parEspece = new Map([...prevues.keys()].map(e => [e, []]));
  const preparer = e => {
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
  };
  for (const [e, n] of prevues) for (let k = 0; k < n; k++) parEspece.get(e).push(preparer(e));
  const genreQ = q => q.type === "photo" && q.photo && etiquetteForme(q.photo.sujet) ? "forme" : q.type;
  const suite = enchainerVarie(prevues, (e, r) => [genreQ(parEspece.get(e)[r - 1])], { derniere: coriaceExp(x), max: 99 });
  const vuesRang = new Map();
  const questions = suite.map(z => { const r = vuesRang.get(z.e) || 0; vuesRang.set(z.e, r + 1); return parEspece.get(z.e)[r]; });
  defiExp = { x, questions, i: 0, aides: aidesDefi(), silhouettesVisibles: false, prevues: nb,
              avantGain: gainExp(x), avantEtapes: empreintesExp(x), dejaReconnues };
  montrer("defiexp");
  afficherQuestionDefiExp();
}

// ==================================================================
// Étape R283 (21/11, chantier « Me tester, reconnaître autrement », choix d'Aubin « 1A · 2A · 3A · 4A · 5A » du 21/11, 13 h 34 ;
//   fiche reprise_me_tester_varie.md ; maquettes https://claude.ai/artifact/HkrDM44xTU1xmLaM3RJqbc).
//   Constat d'Aubin : photo, « Laquelle est… ? », cri, « c'est un peu toujours la même chose ». Le défi reconnaît désormais
//   de sept façons, et la RÈGLE DU TEST tient partout : la question ne montre jamais sa réponse (on montre l'animal et on
//   demande qui c'est, ou on donne un nom, un repère, des indices SANS photo de la réponse ; la photo vient après).
//   • 1A « Le repère » : un repère de la carte (forme de la photo principale), 4 noms sans photo ; les fausses réponses ont une
//     carte qui dit autre chose sur la même partie du corps, jamais le même repère ; après la réponse, la photo.
//   • 2A « Ce qui les sépare » : une vraie paire de sosies de l'expédition, 4 repères (2 + 2) à placer sous les deux noms,
//     jamais un repère que les deux partagent ; juste si les 4 sont à leur place ; une fois par défi ; compte pour les deux.
//   • 3A « Par les indices » : 3 indices au plus (où, indice de présence, taille, activité ; jamais ce qui se lit sur la photo),
//     4 photos ; réunis, ils ne désignent qu'une des 4.
//   • 4A « Qui est qui ? » : une manche de 4 espèces (4 photos sans nom, 4 noms à placer), compte pour 4 questions ;
//     un nom mal placé revient à sa liste et compte une erreur pour cette espèce (une seule par espèce).
//   • 5A : en 20 questions, jamais deux fois de suite la même façon, aucune plus de 5 fois (la manche compte pour 4).
//   Chaque espèce garde ses 3 passages (2 si déjà reconnue) ; la coriace reste la dernière question ; une espèce sans carte ni
//   indices sûrs garde les façons d'avant (photo, « Laquelle est… ? », cri).
// ==================================================================
const DEFI_VARIE = true;          // false = le défi d'avant (R242-R264 : photo, « Laquelle est… ? », cri)
const FACON_MAX = 5;              // 5A : aucune façon plus de 5 fois
const FACONS_SIMPLES = ["photo", "silhouette", "laquelle", "cri", "repere", "indices"];   // « silhouette » : la question photo d'une espèce sans photo libre
const INDICES_DEFI = ["Où", "Indice de présence", "Taille", "Activité"];   // 3A : ni bec ni museau (ils se voient sur la photo)
function faiteDefi(q) { return q.type === "quiestqui" ? !!q.pose : !!q.choix; }
function especesDeQ(q) { return q.autre ? [q.espece, q.autre] : [q.espece]; }
function formeCourte(sujet) { const t = etiquetteForme(sujet); return t ? t.replace(/^(La|Le|L')\s?/, "").replace(/^./, c => c.toUpperCase()) : ""; }
// Un mot du nom dans un texte donnerait la réponse (« Calotte bleu vif » → la mésange bleue ; « Gorge » → le rougegorge)
function racinesNom(e) { return [...motsRepere(e.nom_courant)].filter(w => w.length >= 4); }
function texteDitNom(texte, e) {
  const r = racinesNom(e);
  return [...motsRepere(texte)].some(w => w.length >= 4 && r.some(n => n.slice(0, 4) === w.slice(0, 4) || n.includes(w)));
}
function cartesReperes(o) { const r = reperesDe(o); return r ? r.reperes : []; }
// Le même repère sur la carte d'une autre espèce : presque les mêmes mots ; ou, sur la même partie, la même couleur franche,
//   un même mot de couleur, ou deux mots en commun (« Tête noire, grandes joues blanches » et « Joues blanches… » : à moitié vrai)
const MOTS_COULEUR = ["noir", "blan", "jaun", "roug", "roux", "rous", "bleu", "vert", "gris", "brun", "oran", "rose", "viol", "dore", "beig", "fauv", "crem", "ocre", "somb", "argen", "pour"];
function couleursDe(t) { return [...motsRepere(t)].map(w => MOTS_COULEUR.find(c => w.startsWith(c))).filter(Boolean); }
function repereCommun(x, o) {
  const mx = motsRepere(x.texte), cx = couleursDe(x.texte);
  return cartesReperes(o).some(y => {
    if (!reperesDifferent(x.texte, y.texte)) return true;
    if (!x.partie || x.partie === "NA" || y.partie !== x.partie) return false;
    if (x.couleur && x.couleur !== "NA" && y.couleur === x.couleur) return true;
    if (couleursDe(y.texte).some(c => cx.includes(c))) return true;
    return [...motsRepere(y.texte)].filter(w => mx.has(w)).length >= 2;
  }) || ficheCommune(x, o);
}
// Sa carte dit autre chose sur la même partie (« Calotte noire » face à « Calotte bleu vif ») : la fausse réponse est sûre
function repereContraste(x, o) { return cartesReperes(o).some(y => y.partie === x.partie && reperesDifferent(x.texte, y.texte)); }

// ==================================================================
// Étape R284 (21/11 au soir, Notion 45.01, choix d'Aubin 5A ; notes 2b, 3, 6, 7 du 21/11 au soir) : dans Me tester, un repère
//   ou un indice n'est montré que s'il départage VRAIMENT. « Dos brun » posé face au campagnol agreste (« Pelage long et
//   ébouriffé », mais dos brun dans sa fiche), « Museau court et arrondi » face à la taupe, au renard et à la crossope (hors de
//   l'expédition, alors que les deux campagnols ont eux aussi le museau arrondi) : on gagnait sans lire le repère.
//   • Une fausse réponse doit CONTREDIRE le repère (pas seulement « dire autre chose ») : sur la même partie, une autre couleur
//     sans couleur commune, ou le contraire (court / long, pointu / arrondi, nu / poilu…) ; la fiche compte aussi (couleur,
//     couleur dominante, formes du museau, de la queue, des oreilles) : si elle porte le repère, la fausse réponse est écartée.
//   • Les fausses réponses ne viennent que de l'expédition ; s'il n'y en a pas 3 sûres, un autre repère, sinon une autre façon.
//   • Par les indices : plus d'indice ajouté « pour faire nombre » ; la taille ne sépare que si les fourchettes (mâles et
//     femelles comprises) ne se touchent pas ; fausses photos de l'expédition seulement.
// ==================================================================
const SENS_CONTRAIRES = [
  [/^court/, /^long/],
  [/^pointu/, /^(arrondi|rond)/],
  [/^nue?s?$/, /^(poilu|velu|touffu|fourni)/],
  [/^grand/, /^petit/],
  [/^clair/, /^(fonce|sombre)/],
  [/^large/, /^etroit/],
  [/^droit/, /^(courbe|recourbe|arque)/],
];
function motsSimples(t) { return String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").split(/[^a-z]+/).filter(Boolean); }
// Les « sens » d'un texte : "g:m" = le membre m du couple de contraires g (« Museau court et arrondi » → court, arrondi)
function sensDe(t) {
  const s = new Set(), mots = motsSimples(t);
  SENS_CONTRAIRES.forEach((g, gi) => g.forEach((re, mi) => { if (mots.some(w => re.test(w))) s.add(gi + ":" + mi); }));
  return s;
}
function sensContraires(a, b) {   // a et b disent le contraire l'un de l'autre sur au moins un couple, sans rien partager de ce couple
  for (const k of a) { const g = k.split(":")[0]; const autres = [...b].filter(z => z.split(":")[0] === g); if (autres.length && !autres.includes(k) && ![...a].some(z => z.split(":")[0] === g && autres.includes(z))) return true; }
  return false;
}
function sensCommun(a, b) { return [...a].some(k => b.has(k)); }
function couleursRepere(r) { return [...new Set([...couleursDe(r.texte), ...(r.couleur && r.couleur !== "NA" ? couleursDe(r.couleur) : [])])]; }
// Ce que la fiche dit de cette partie : couleurs (colonne « couleur », découpée par parties, et couleur dominante pour le dos,
//   le corps ou le pelage) et formes (museau, queue, oreilles)
const PARTIES_FICHE = { dos: /^(dos|dessus)/, corps: /^(corps|dessus)/, pelage: /^(pelage|dessus)/, ventre: /^(ventre|dessous)/, queue: /^queue/, tete: /^tete/,
  gorge: /^gorge/, poitrine: /^poitrine/, ailes: /^aile/, pattes: /^patte/, bec: /^bec/, museau: /^museau/, oreilles: /^oreille/, calotte: /^calotte/, cou: /^cou$/ };
const FORMES_FICHE = { museau: ["museau_forme"], queue: ["queue_forme"], oreilles: ["oreilles_forme", "oreilles_taille"] };
function ficheDe(o, partie) {
  const re = PARTIES_FICHE[partie];
  const morceaux = String(estRenseigne(o.couleur) ? o.couleur : "").split(/[,;]/).map(s => s.trim()).filter(Boolean);
  const general = ["dos", "corps", "pelage"].includes(partie);
  const couleurs = re ? morceaux.filter((m, k) => { const mots = motsSimples(m); return mots.some(w => re.test(w)) || (general && k === 0 && !Object.values(PARTIES_FICHE).some(r => mots.some(w => r.test(w)))); }) : [];
  if (general && estRenseigne(o.couleur_dominante)) couleurs.push(o.couleur_dominante);
  const formes = (FORMES_FICHE[partie] || []).map(c => lireCase(o, c)).filter(v => estRenseigne(v) && v !== "NA");
  return { couleurs: [...new Set(couleurs.flatMap(couleursDe))], sens: sensDe(formes.join(" ")) };
}
function ficheCommune(x, o) {
  if (!x.partie || x.partie === "NA") return false;
  const f = ficheDe(o, x.partie), cx = couleursRepere(x);
  return cx.some(c => f.couleurs.includes(c)) || sensCommun(sensDe(x.texte), f.sens);
}
// La fausse réponse contredit le repère : sur la même partie, sa carte (ou sa fiche) dit une autre couleur, ou le contraire
function contreditPar(x, couleurs, sens) {
  const cx = couleursRepere(x);
  return (cx.length && couleurs.length && !couleurs.some(c => cx.includes(c))) || sensContraires(sensDe(x.texte), sens);
}
function ligneContredit(x, y) { return y.partie === x.partie && contreditPar(x, couleursRepere(y), sensDe(y.texte)); }
function repereContredit(x, o) {
  if (!x.partie || x.partie === "NA") return false;
  if (cartesReperes(o).some(y => ligneContredit(x, y))) return true;
  const f = ficheDe(o, x.partie);
  return contreditPar(x, f.couleurs, f.sens);
}
// Ce que la fiche dit de contraire, en quelques mots (« Queue courte », « Museau pointu », « Dos gris »), pour l'explication
const NOMS_PARTIES = { dos: "Dos", corps: "Corps", pelage: "Pelage", ventre: "Ventre", queue: "Queue", tete: "Tête", gorge: "Gorge", poitrine: "Poitrine",
  ailes: "Ailes", pattes: "Pattes", bec: "Bec", museau: "Museau", oreilles: "Oreilles", calotte: "Calotte", cou: "Cou" };
function ligneFicheContraire(x, o) {
  const nom = NOMS_PARTIES[x.partie];
  if (!nom) return "";
  for (const c of FORMES_FICHE[x.partie] || []) {
    const v = lireCase(o, c);
    if (estRenseigne(v) && v !== "NA" && sensContraires(sensDe(x.texte), sensDe(v))) return `${nom} ${String(v).toLowerCase()}`;
  }
  const f = ficheDe(o, x.partie), cx = couleursRepere(x);
  if (cx.length && f.couleurs.length && !f.couleurs.some(c => cx.includes(c))) {
    const v = ["dos", "corps", "pelage"].includes(x.partie) && estRenseigne(o.couleur_dominante) ? o.couleur_dominante : "";
    return v ? `${nom} ${String(v).toLowerCase()}` : "";
  }
  return "";
}
// R284 (45.04, choix 2A) : une espèce sans photo libre reste rencontrée (sa silhouette), mais n'est jamais posée dans les jeux,
//   ni comme bonne réponse ni comme fausse réponse (une silhouette « photo à venir » à côté de vraies photos n'aide pas)
function jouableEnJeu(e) { return !!e && estRenseigne(e.photo); }
// Les fourchettes de taille (mâles et femelles comprises) ; sans minimum connu : « jusqu'à » pour la bonne réponse (tout ce qui
//   est plus petit colle), les 6/10 du maximum pour une fausse réponse
function fourchetteTailleDefi(e, bonne) {
  const q = QUESTIONS.find(z => z.champ === "taille_max_cm"), v = q ? q.valeur(e) : null;
  if (typeof v !== "number") return null;
  const f = q.fourchette ? q.fourchette(e) : null;
  return f && f[0] < f[1] ? [Math.min(f[0], v), Math.max(f[1], v)] : [bonne ? 0 : v * 0.6, v];
}
function taillesDisjointes(e, o) {
  const a = fourchetteTailleDefi(e, true), b = fourchetteTailleDefi(o, false);
  if (!a || !b) return false;
  const [p, g] = a[1] < b[0] ? [a, b] : b[1] < a[0] ? [b, a] : [null, null];
  return !!p && g[0] / Math.max(p[1], 0.01) >= 1.2;   // un écart net entre les deux fourchettes
}
// R285 (47.02, note 4) : un repère de silhouette ne se comprend pas seul (« Petite, ronde, queue courte », « Trapu, pattes
//   courtes », « Papillon de taille moyenne ») : il n'est jamais donné sans photo
const MOTS_SILHOUETTE = /^(et|tres|petit|petite|petits|petites|grand|grande|gros|grosse|rond|ronde|trapu|trapue|massif|massive|elance|elancee|svelte|mince|fin|fine|dodu|dodue|robuste|allonge|allongee|compact|compacte|minuscule|enorme|fluet|fluette)$/;
function repereDeSilhouette(t) {
  const debut = motsSimples(String(t).split(",")[0]);
  return (debut.length > 0 && debut.every(w => MOTS_SILHOUETTE.test(w))) || /silhouette|allure|taille moyenne/.test(motsSimples(t).join(" "));
}
// Les repères qu'on peut donner seuls : ceux de la photo principale, sur une partie dite, sans le nom dedans (parties visibles d'abord)
function reperesInterrogeables(e) {
  const r = reperesDe(e);
  if (!r) return [];
  return reperesPourForme(r, formePourPhoto(r, "")).filter(x => x.partie && x.partie !== "NA" && x.texte && !texteDitNom(x.texte, e) && !repereDeSilhouette(x.texte))
    .map((x, i) => ({ x, i })).sort((a, b) => rangPartie(a.x.partie) - rangPartie(b.x.partie) || a.i - b.i).map(o => o.x);
}
// 1A (R284 : 45.01) : 3 fausses réponses de l'expédition, dont la carte ou la fiche CONTREDIT le repère, jamais ne le porte
function piegesRepere(e, x, rp, pool) {
  const ok = o => o !== e && jouableEnJeu(o) && reperesDe(o) && repereContredit(rp, o) && !repereCommun(rp, o) && !texteDitNom(rp.texte, o);
  const l = melanger(x.liste.filter(ok)).sort((a, b) => (a.onglet === e.onglet ? 0 : 1) - (b.onglet === e.onglet ? 0 : 1));
  return l.filter((o, k) => l.findIndex(z => z.nom_courant === o.nom_courant) === k).slice(0, 3);
}
// ==================================================================
// Étape R285 (47.02, choix « B » d'Aubin du 21/11, 20 h 25 ; notes 2, 4 et 5 du 21/11 au soir sur la 1.28.0) : « Par les
//   indices » et « Le repère » restent, à la même fréquence, mais justes et qui orientent. Aubin : « L'indice ne doit pas
//   forcément être unique à une espèce mais la combinaison d'indices doit l'être » ; un joueur qui connaît les animaux trouve
//   à coup sûr. Le défaut de R284 : une simple différence de fiche passait pour une exclusion (la chevêche « écartée » parce
//   que sa fiche dit « Pelotes de réjection » et non « Cris nocturnes », ou « À l'aube et au crépuscule » et non « la nuit »).
//   • Activité : l'aube et le crépuscule recoupent le jour ET la nuit ; seuls « le jour » et « la nuit » s'excluent.
//   • Indice de présence : chaque fiche n'en a qu'un, son absence ne prouve rien. N'écartent que les indices propres à un
//     groupe (pelotes et fientes : oiseaux ; guano : chauves-souris ; mue : reptiles, insectes, araignées, crustacés…).
//     Les cris et les chants ne sont pas un indice de présence ici (ils sont retirés du texte).
//   • Où : le milieu principal n'est qu'un milieu parmi d'autres ; il n'écarte que ce qui vit dans l'eau face à ce qui vit
//     sur la terre ferme (un poisson face à un renard), jamais deux milieux de terre ou deux milieux d'eau.
//   • Taille : dite en comparaison avec un animal connu (« De la taille d'un merle »), seulement si les 4 réponses ont la même
//     mesure (du bec à la queue, sans la queue…), avec des fourchettes nettement séparées.
// ==================================================================
const CRIS_INDICE = /^(des |les )?(cris?|chants?|choeurs?|roucoulements?|hurlements?|claquements?|stridulations?|sifflements?)\b/;
// Les indices propres à un groupe : qui peut les laisser (familles du jeu, ou ordre pour les chauves-souris)
const INDICES_DE_GROUPE = [
  { re: /pelote/, peut: o => o.onglet === "Oiseaux" },
  { re: /fiente|rochers blanchis/, peut: o => o.onglet === "Oiseaux" },
  { re: /^plumes?\b/, peut: o => o.onglet === "Oiseaux" },
  { re: /proies? (parfois )?empalee|empales/, peut: o => o.onglet === "Oiseaux" },
  { re: /guano/, peut: o => o.ordre === "Chiroptères" },
  { re: /^poils?$/, peut: o => o.onglet === "Mammiferes" },
  { re: /taupiniere|tumuli|souille|griffade|griffure|troncs? griffe|hutte|barrage/, peut: o => o.onglet === "Mammiferes" },
  { re: /\bmue\b|exuvie/, peut: o => ["Reptiles", "Insectes", "Araignees_mille_pattes", "Crustaces"].includes(o.onglet) },
  { re: /trace de reptation/, peut: o => o.onglet === "Reptiles" },
  { re: /^toiles? (ronde|en nappe|pouponniere)|^toile$/, peut: o => o.onglet === "Araignees_mille_pattes" },
  { re: /chenille|toiles? de chenilles|oothequ/, peut: o => o.onglet === "Insectes" },
  { re: /tetard/, peut: o => o.onglet === "Amphibiens" },
  { re: /frayere/, peut: o => o.onglet === "Poissons" },
  { re: /turricule|tortillons de sable/, peut: o => o.onglet === "Vers_meduses_compagnie" },
];
function elementsTrace(t) { return String(t || "").split(/,|;| et /).map(z => z.trim()).filter(Boolean); }
// Le texte de l'indice de présence pour Me tester : sans les cris ; vide s'il ne reste rien
function traceDefi(e) {
  const l = elementsTrace(traceDe(e)).filter(z => !CRIS_INDICE.test(simplifier(z)));
  return l.length ? majuscule(l.join(", ")) : "";
}
function groupesTrace(e) {
  const l = elementsTrace(traceDefi(e)).map(simplifier);
  return INDICES_DE_GROUPE.filter(g => l.some(z => g.re.test(z)));
}
// Les moments d'activité : jour, nuit, aube et crépuscule (« de jour comme de nuit » = tous)
function momentsActivite(t) {
  const s = motsSimples(t).join(" ");
  if (!s) return [];
  if (/jour comme de nuit|nuit comme de jour|toute la journee|a toute heure|jour et nuit/.test(s)) return ["jour", "nuit", "crepuscule"];
  const m = [];
  if (/\bjour\b|diurne|journee/.test(s)) m.push("jour");
  if (/\bnuit\b|nocturne/.test(s)) m.push("nuit");
  if (/aube|crepuscul|soir|matin/.test(s)) m.push("crepuscule");
  return m;
}
// R285 : deux activités ne s'excluent que si l'une est « le jour » seul et l'autre « la nuit » seule
function activitesExclues(a, b) {
  const x = momentsActivite(a), y = momentsActivite(b);
  const pur = m => m.length === 1 && m[0] !== "crepuscule";
  return pur(x) && pur(y) && x[0] !== y[0];
}
// R285 : vivre dans l'eau (poissons ; mollusques, crustacés, vers des eaux) ou sur la terre ferme
const MILIEUX_DE_BORD = ["Marais", "Dunes et plages", "Estuaires et lagunes"];
function especeDansLEauDefi(o) {
  const m = lireCase(o, "milieu_principal");
  return o.onglet === "Poissons" || (["Mollusques", "Crustaces", "Vers_meduses_compagnie"].includes(o.onglet) && MILIEUX_AQUATIQUES.includes(m) && !MILIEUX_DE_BORD.includes(m));
}
function especeSurTerreDefi(o) {
  const m = lireCase(o, "milieu_principal");
  return !!m && o.onglet !== "Poissons" && !MILIEUX_AQUATIQUES.includes(m) && !MILIEUX_DE_BORD.includes(m) && !["Mares et étangs", "Marais"].includes(m)
    && ["Mammiferes", "Oiseaux", "Reptiles", "Insectes", "Araignees_mille_pattes", "Mollusques"].includes(o.onglet);
}
// R285 : la taille dite en comparaison, avec des animaux connus mesurés de la même façon
const TAILLES_CONNUES = {
  "du bec à la queue": [["un roitelet", 9], ["une mésange", 12], ["un moineau", 15], ["un merle", 25], ["un pigeon", 32], ["une corneille", 47], ["une buse", 53], ["un héron cendré", 95], ["un cygne", 150]],
  "de long, sans la queue": [["une souris", 8], ["un rat", 20], ["un écureuil", 22], ["un hérisson", 25], ["un lapin", 40], ["un chat", 50], ["un renard", 70], ["un chevreuil", 120], ["un sanglier", 150], ["un cerf", 210]],
  "au garrot": [["un chat", 30], ["un renard", 40], ["un chevreuil", 70], ["un cerf", 120]],
  "de long|Poissons": [["un vairon", 8], ["une sardine", 20], ["une truite", 40], ["un brochet", 90], ["un thon", 200]],
  "de long|Reptiles": [["un lézard des murailles", 20], ["un lézard vert", 35], ["une vipère", 65], ["une couleuvre", 130]],
  "de long|Amphibiens": [["une rainette", 4.5], ["une grenouille", 9], ["une salamandre", 18]],
  "de long|Crustaces": [["une crevette", 5], ["une écrevisse", 11], ["un homard", 45]],
  "de long": [["une fourmi", 0.6], ["une coccinelle", 0.7], ["une abeille", 1.3], ["un hanneton", 2.7], ["une sauterelle verte", 5], ["un ver de terre", 12]],
  "(coquille)": [["un petit-gris (escargot)", 3.5], ["une moule", 6], ["une huître", 10]],
};
function mesureDefi(o) { return mesureTaille(o).fiche; }
function tailleMilieu(o) { const f = fourchetteTailleDefi(o, false); return f ? Math.sqrt(Math.max(f[0], 0.01) * f[1]) : null; }
function tailleComparee(o) {
  const m = tailleMilieu(o), mes = mesureDefi(o);
  const refs = TAILLES_CONNUES[mes + "|" + o.onglet] || TAILLES_CONNUES[mes];
  if (!m || !refs) return "";
  const nomSimple = simplifier(o.nom_courant);   // jamais « un peu plus petit qu'un rat » pour le rat noir
  const [nom, v] = refs.filter(r => !nomSimple.includes(simplifier(r[0].replace(/^(un|une) /, "").split(/[ (]/)[0]))).sort((a, b) => Math.abs(Math.log(m / a[1])) - Math.abs(Math.log(m / b[1])))[0];
  const k = m / v, de = nom.replace(/^(un|une) /, "$1 ");
  if (k > 1.6) return `Plus grand que ${de}`.replace("que un", "qu'un").replace("que une", "qu'une");
  if (k < 0.62) return `Plus petit que ${de}`.replace("que un", "qu'un").replace("que une", "qu'une");
  if (k > 1.18) return `Un peu plus grand qu'${de}`;
  if (k < 0.85) return `Un peu plus petit qu'${de}`;
  return `De la taille d'${de}`;
}
// Les indices de Me tester (Où, indice de présence sans les cris, taille comparée, activité)
function candidatsIndicesDefi(e) {
  const l = [], milieu = lireCase(e, "milieu_principal"), trace = traceDefi(e), t = tailleComparee(e), act = lireCase(e, "activite");
  if (milieu) l.push({ etiq: "Où", texte: majuscule(milieu) });
  if (trace) l.push({ etiq: "Indice de présence", texte: trace });
  if (t) l.push({ etiq: "Taille", texte: t, taille: true });
  if (act && momentsActivite(act).length) l.push({ etiq: "Activité", texte: majuscule(act) });
  return l.filter(i => INDICES_DEFI.includes(i.etiq) && !texteDitNom(i.texte, e));
}
// 3A : un indice sépare-t-il la bonne espèce de cette fausse photo ? (R285 : seulement si l'indice la contredit vraiment)
function separeParIndice(e, i, o) {
  if (i.taille || i.etiq === "Taille") return mesureDefi(e) === mesureDefi(o) && taillesDisjointes(e, o) && !!tailleComparee(e)
    && Math.abs(Math.log(tailleMilieu(e) / tailleMilieu(o))) >= Math.log(1.5) && tailleComparee(o) !== tailleComparee(e);
  if (i.etiq === "Indice de présence") {
    if (!traceDefi(e)) return false;
    const mien = simplifier(traceDefi(o));
    return groupesTrace(e).some(g => !g.peut(o) && !elementsTrace(mien).some(z => g.re.test(z)));
  }
  if (i.etiq === "Activité") return activitesExclues(lireCase(e, "activite"), lireCase(o, "activite"));
  if (i.etiq === "Où") return (especeDansLEauDefi(e) && especeSurTerreDefi(o)) || (especeSurTerreDefi(e) && especeDansLEauDefi(o));
  return false;
}
// R284 (45.01) : les fausses photos viennent de l'expédition seulement (jamais un sosie), et chacune est écartée par un indice
//   montré ; on essaie plusieurs trios avant de renoncer. R285 : la taille n'est montrée que si les 4 ont la même mesure.
function questionIndicesDefi(e, x) {
  if (!jouableEnJeu(e) || indicesAmbigus(e, x)) return null;
  const tous = candidatsIndicesDefi(e);
  if (!tous.length) return null;
  const sosies = sosiesDe(e);
  const possibles = x.liste.filter((o, k, l) => o !== e && l.indexOf(o) === k && jouableEnJeu(o) && !sosies.includes(o) && tous.some(i => separeParIndice(e, i, o)));
  if (possibles.length < 3) return null;
  // tous les trios possibles, dans un ordre tiré au hasard, ceux de la même famille d'abord (R285 : un trio mêlé empêche la taille)
  const l = melanger(possibles.slice()).slice(0, 12), trios = [];
  for (let i = 0; i < l.length; i++) for (let j = i + 1; j < l.length; j++) for (let k = j + 1; k < l.length; k++) trios.push([l[i], l[j], l[k]]);
  const meme = t => t.filter(o => o.onglet === e.onglet).length;
  trios.sort((a, b) => meme(b) - meme(a));
  for (const pieges of trios) {
    const memeMesure = pieges.every(o => mesureDefi(o) === mesureDefi(e));
    const cands = tous.filter(i => !i.taille || memeMesure);
    const choisis = [];
    let reste = pieges.slice();
    while (reste.length && choisis.length < 3) {   // l'indice qui écarte le plus de fausses photos qui restent
      const m = cands.filter(i => !choisis.includes(i)).map(i => ({ i, n: reste.filter(o => separeParIndice(e, i, o)).length })).sort((a, b) => b.n - a.n)[0];
      if (!m || !m.n) break;
      choisis.push(m.i); reste = reste.filter(o => !separeParIndice(e, m.i, o));
    }
    if (reste.length) continue;   // réunis, les indices ne désigneraient pas une seule des 4
    return { indices: cands.filter(i => choisis.includes(i)).map(i => ({ etiq: i.etiq, texte: i.texte, taille: !!i.taille })), pieges };
  }
  return null;
}
// 2A : les repères d'une espèce qui la séparent de son sosie (jamais un repère partagé ; ceux qui parlent de la même partie d'abord)
function reperesSeparables(a, b) {
  return reperesInterrogeables(a).filter(x => !repereCommun(x, b) && !texteDitNom(x.texte, b))
    .map((x, i) => ({ x, i, c: repereContraste(x, b) ? 0 : 1 })).sort((p, q) => p.c - q.c || p.i - q.i).map(o => o.x);
}
function paireSepareDefi(x) {
  const paires = [];
  for (const a of x.liste) for (const b of sosiesDe(a)) {
    if (!x.liste.includes(b) || a.nom_courant >= b.nom_courant || !jouableEnJeu(a) || !jouableEnJeu(b)) continue;
    const ra = reperesSeparables(a, b), rb = reperesSeparables(b, a);
    if (ra.length >= 2 && rb.length >= 2) paires.push({ a, b, ra: ra.slice(0, 2), rb: rb.slice(0, 2) });
  }
  return paires.length ? melanger(paires)[0] : null;
}
// Ce que chaque espèce peut recevoir : combien de fois chaque façon (le repère : 2 repères différents au plus ; indices et cri : 1)
function faconsEspece(e, x, pool) {
  const pieges = piegesDefi(e, x, pool);
  const avecPhotos = [e, ...pieges].every(o => estRenseigne(o.photo)) && pieges.length >= 3;
  const cri = typeof aUnCri === "function" && aUnCri(e) && typeof sonActif !== "undefined" && sonActif && avecPhotos;
  const reps = reperesInterrogeables(e).map(rp => ({ rp, pieges: piegesRepere(e, x, rp, pool) })).filter(o => o.pieges.length >= 3).slice(0, 2);
  const ind = questionIndicesDefi(e, x);
  const sansPhoto = !estRenseigne(e.photo);
  return { photo: sansPhoto ? 0 : 9, silhouette: sansPhoto ? 9 : 0, laquelle: avecPhotos ? 2 : 0, cri: cri ? 1 : 0, repere: reps.length, indices: ind ? 1 : 0, reps, ind };
}
// 5A : le déroulé. Les deux manches (Ce qui les sépare, Qui est qui ?) d'abord réservées, puis un tirage glouton refait 60 fois,
//   gardé quand il ne met jamais deux fois de suite la même façon ni la même espèce, et aucune façon plus de 5 fois.
function planDefiVarie(x, nb, pool) {
  const f = new Map(x.liste.map(e => [e, faconsEspece(e, x, pool)]));
  const reste = new Map(x.liste.map(e => [e, nb.get(e) || 0]));
  const cor = coriaceExp(x), blocs = [];
  const sep = paireSepareDefi(x);
  if (sep && reste.get(sep.a) > (sep.a === cor ? 1 : 0) && reste.get(sep.b) > (sep.b === cor ? 1 : 0)) {
    blocs.push({ bloc: true, facon: "separe", especes: [sep.a, sep.b], sep, taille: 1 });
    reste.set(sep.a, reste.get(sep.a) - 1); reste.set(sep.b, reste.get(sep.b) - 1);
  }
  const libres = e => reste.get(e) - (e === cor ? 1 : 0);
  const pourQq = melanger(x.liste.filter(e => estRenseigne(e.photo) && libres(e) > 0)).sort((a, b) => libres(b) - libres(a));
  if (pourQq.length >= 4) {
    const qq = pourQq.slice(0, 4);
    blocs.push({ bloc: true, facon: "quiestqui", especes: qq, taille: 4 });
    qq.forEach(e => reste.set(e, reste.get(e) - 1));
  }
  const noteSuite = suite => {   // la vraie mesure : mêmes espèces ou même façon à la suite, façons au-delà de 5 ; une manche pas en tête
    const compte = {};
    let n = suite.length && suite[0].bloc ? 5 : 0;
    suite.forEach((o, k) => { compte[o.facon] = (compte[o.facon] || 0) + o.taille; if (k) n += penalite(suite[k - 1], o, {}); });
    for (const c of Object.values(compte)) n += Math.max(0, c - FACON_MAX) * 50;
    return n;
  };
  const penalite = (prec, o, compte) => (prec && o.especes.some(e => prec.especes.includes(e)) ? 1000 : 0) + (prec && prec.facon === o.facon ? 100 : 0)
    + Math.max(0, (compte[o.facon] || 0) + o.taille - FACON_MAX) * 50;
  let meilleure = null, scoreMin = Infinity;
  for (let essai = 0; essai < 60 && scoreMin > 0; essai++) {
    const r = new Map(reste), vus = new Map(x.liste.map(e => [e, []])), compte = {}, suite = [], aPlacer = blocs.slice();
    const usage = (e, fa) => vus.get(e).filter(z => z === fa).length;
    const options = e => FACONS_SIMPLES.filter(fa => usage(e, fa) < f.get(e)[fa]);
    let fin = null;
    if (cor && r.get(cor) > 0) { r.set(cor, r.get(cor) - 1); fin = cor; }
    const total = [...r.values()].reduce((a, b) => a + b, 0) + aPlacer.length;
    for (let n = 0; n < total; n++) {
      const prec = suite[suite.length - 1], possibles = [...aPlacer];
      for (const e of x.liste) if (r.get(e) > 0) for (const fa of options(e)) possibles.push({ especes: [e], facon: fa, taille: 1 });
      let choix = null, pMin = Infinity;
      for (const o of melanger(possibles)) {
        let p = penalite(prec, o, compte) + (compte[o.facon] || 0) * 0.8 + Math.random() * 0.5;
        if (o.bloc) p += n < 2 ? 6 : -0.5;                 // pas de manche tout au début
        else { const e = o.especes[0]; p += usage(e, o.facon) * 3 - r.get(e) * (0.5 + 3 / options(e).length); }   // peu de façons possibles = à placer tôt, entre les autres
        if (n === 0 && o.facon !== "photo") p += 2;        // on commence doucement, par une photo
        if (p < pMin) { pMin = p; choix = o; }
      }
      if (!choix) break;
      suite.push(choix); compte[choix.facon] = (compte[choix.facon] || 0) + choix.taille;
      if (choix.bloc) aPlacer.splice(aPlacer.indexOf(choix), 1); else r.set(choix.especes[0], r.get(choix.especes[0]) - 1);
      choix.especes.forEach(e => vus.get(e).push(choix.facon));
    }
    if (fin) {   // la coriace, en dernier, avec la façon qui va le mieux après la précédente
      const prec = suite[suite.length - 1];
      const fa = options(fin).map(z => ({ z, p: penalite(prec, { especes: [fin], facon: z, taille: 1 }, compte) + usage(fin, z) * 3 + Math.random() })).sort((a, b) => a.p - b.p)[0];
      const o = { especes: [fin], facon: fa ? fa.z : estRenseigne(fin.photo) ? "photo" : "silhouette", taille: 1 };
      suite.push(o); compte[o.facon] = (compte[o.facon] || 0) + 1;
    }
    const s = noteSuite(suite);
    if (s < scoreMin) { scoreMin = s; meilleure = { suite, fin: !!fin }; }
  }
  // Retouche : des échanges de deux places, gardés quand ils améliorent (la coriace reste la dernière)
  const l = meilleure ? meilleure.suite : [];
  const retoucher = () => {
    const bout = l.length - (meilleure && meilleure.fin ? 1 : 0);
    for (let k = 0; k < 400 && scoreMin > 0 && bout > 2; k++) {
      const i = Math.floor(Math.random() * bout), j = Math.floor(Math.random() * bout);
      if (i === j) continue;
      [l[i], l[j]] = [l[j], l[i]];
      const s = noteSuite(l);
      if (s < scoreMin) scoreMin = s; else [l[i], l[j]] = [l[j], l[i]];
    }
  };
  retoucher();
  // R284 (45.01) : dernier filet — une façon encore au-delà de 5 : on retire une de ses questions à une espèce qui en a 3
  //   (jamais la coriace en dernier, jamais une manche), puis on retouche
  const passages = e => l.filter(o => o.especes.includes(e)).length;
  for (let k = 0; k < 6; k++) {
    const compte = {};
    l.forEach(o => { compte[o.facon] = (compte[o.facon] || 0) + o.taille; });
    const trop = Object.keys(compte).find(fa => compte[fa] > FACON_MAX && !["quiestqui", "separe"].includes(fa));
    if (!trop) break;
    const i = l.findIndex((o, j) => !o.bloc && o.facon === trop && passages(o.especes[0]) > 2 && !(meilleure.fin && j === l.length - 1));
    if (i < 0) break;
    l.splice(i, 1);
    scoreMin = noteSuite(l); retoucher();
  }
  return { suite: l, f };
}
// Les questions, dans l'ordre du déroulé
function questionsDefiVarie(x, nb, pool) {
  const { suite, f } = planDefiVarie(x, nb, pool);
  const vues = {}, usage = new Map(), questions = [];
  const prendrePhoto = (e, auHasard) => {
    const ph = photosDefi(e), deja = vues[e.nom_courant] || [];
    const neuves = ph.filter(p => !deja.includes(p.src));
    const photo = auHasard ? (melanger(neuves)[0] || ph[0]) : deja.length ? (neuves.find(p => etiquetteForme(p.sujet)) || neuves[0] || ph[0]) : ph[0];
    if (photo) vues[e.nom_courant] = [...deja, photo.src];
    return photo || null;
  };
  let g = 0;
  for (const u of suite) {
    if (u.facon === "quiestqui") {
      g++;
      const noms = melanger(u.especes.slice());
      for (const e of melanger(u.especes.slice())) questions.push({ espece: e, type: "quiestqui", g, photo: prendrePhoto(e, true), noms, choix: null, retires: [], pose: false });
      continue;
    }
    if (u.facon === "separe") {
      const { a, b, ra, rb } = u.sep;
      const items = melanger([...ra.map(rp => ({ e: a, rp })), ...rb.map(rp => ({ e: b, rp }))]).map(o => ({ ...o, place: null }));
      questions.push({ espece: a, autre: b, type: "separe", photo: null, noms: [a, b], items, choix: null, retires: [] });
      continue;
    }
    const e = u.especes[0], fe = f.get(e), n = usage.get(e) || {}, rang = n[u.facon] || 0;
    n[u.facon] = rang + 1; usage.set(e, n);
    const base = { espece: e, type: u.facon, photo: null, choix: null, retires: [] };
    if (u.facon === "repere") questions.push({ ...base, rp: fe.reps[rang].rp, noms: melanger([e, ...fe.reps[rang].pieges]) });
    else if (u.facon === "indices") questions.push({ ...base, indices: fe.ind.indices, noms: melanger([e, ...fe.ind.pieges]) });
    else if (u.facon === "photo" || u.facon === "silhouette") questions.push({ ...base, type: "photo", facon: u.facon, photo: prendrePhoto(e, false), noms: melanger([e, ...piegesDefi(e, x, pool)]) });
    else questions.push({ ...base, noms: melanger([e, ...piegesDefi(e, x, pool)]) });
  }
  return questions;
}
// 1A : la question du repère (sans photo). Le dessin de la partie n'est montré que si les 4 réponses ont la même silhouette de famille.
function corpsRepereDefi(q) {
  const rp = q.rp, r = reperesDe(q.espece);
  const contours = q.noms.map(o => contourDe(o, reperesDe(o)));
  const dessin = r && contours[0] && contours.every(c => c === contours[0]) ? dessinPartie(contours[0], rp.partie) : "";
  const forme = rp.pour && !["tous", "adulte"].includes(rp.pour) && r && formesReperes(r).length > 1 ? (NOMS_FORME[rp.pour] || majuscule(rp.pour)) : "";
  return `<div class="dfx-facon">Le repère</div>
    <p class="cdo-q">À qui est ce repère ?</p>
    <div class="dfx-repere">${dessin ? `<span class="rp-image">${dessin}</span>` : ""}<span>${forme ? `<small>${echapper(forme)}</small>` : ""}<b>${echapper(texteRepereDefi(q))}</b></span></div>
    <p class="dfx-consigne">Sans photo : retrouvez l'espèce à qui il appartient.</p>
    <div class="cdo-noms dfx-noms-col">${q.noms.map((e, k) => boutonNomDefi(e, k, q)).join("")}</div>`;
}
// R285 (47.02, note 4) : quand les 4 réponses ne sont pas du même groupe, le repère dit de qui il parle
//   (« Cet oiseau : queue courte, tête aplatie… »)
function groupeDitDefi(e) {
  const g = { Oiseaux: "Cet oiseau", Mammiferes: e.ordre === "Chiroptères" ? "Cette chauve-souris" : "Ce mammifère", Insectes: "Cet insecte",
    Poissons: "Ce poisson", Reptiles: "Ce reptile", Amphibiens: "Cet amphibien", Mollusques: "Ce mollusque", Crustaces: "Ce crustacé",
    Araignees_mille_pattes: e.ordre === "Aranéides" ? "Cette araignée" : "" }[e.onglet];
  return g || "";
}
function groupeDefi(e) { return e.onglet === "Mammiferes" && e.ordre === "Chiroptères" ? "chauve-souris" : e.onglet === "Araignees_mille_pattes" ? e.ordre : e.onglet; }
function texteRepereDefi(q) {
  const memes = q.noms.every(o => groupeDefi(o) === groupeDefi(q.espece)), g = groupeDitDefi(q.espece);
  return memes || !g ? majuscule(q.rp.texte) : `${g} : ${minusculeTexte(q.rp.texte)}`;
}
// Après la réponse juste : la photo, avec le repère
function photoRepereDefi(q) {
  const ph = q.rp.pour ? photosDe(q.espece).find(p => p.sujet && FORME_DE_SUJET[p.sujet] === q.rp.pour) : null;
  const img = ph ? imagePhoto(ph.src, q.espece.nom_courant, true) : celluleImage(q.espece, true);
  return `<div class="dfx-rp-photo agrandir-groupe"><figure class="agr" data-legende="${echapper(q.espece.nom_courant)}"><span class="agr-cadre">${img}${LOUPE_SVG}</span>
      <figcaption><b>${echapper(q.espece.nom_courant)}</b><span>${echapper(majuscule(q.rp.texte))}</span></figcaption></figure></div>`;
}
// Après une erreur sur le repère : ce que dit chacune des deux cartes sur cette partie
function blocRepereErreur(q, choisie) {
  const rc = reperesDe(choisie), principale = rc ? reperesPourForme(rc, formePourPhoto(rc, "")) : [];
  const meme = [...principale, ...cartesReperes(choisie)].filter(z => z.partie === q.rp.partie && reperesDifferent(z.texte, q.rp.texte));
  // R284 : la ligne qui dit le contraire d'abord ; sinon ce que dit sa fiche (« Queue courte »), sinon la ligne de la même partie
  const y = meme.find(z => ligneContredit(q.rp, z)) || (ligneFicheContraire(q.rp, choisie) ? { texte: ligneFicheContraire(q.rp, choisie) } : null) || meme[0];
  const ligne = (e, t, cls) => `<li><i class="${cls}"></i><span><b>${echapper(majuscule(nomCourt(e)))} :</b> ${echapper(minusculeTexte(t))}</span></li>`;
  return `<div class="dfx-separe"><small>Ce qui les sépare</small><ul>${ligne(q.espece, q.rp.texte, "ok")}${y ? ligne(choisie, y.texte, "ko") : ""}</ul></div>`;
}
// 3A : la question des indices (4 photos, aucun nom)
function corpsIndicesDefi(q) {
  return `<div class="dfx-facon">Par les indices</div>
    <p class="cdo-q">${q.indices.every(i => i.etiq === "Indice de présence") ? "Qui a laissé ces indices ?" : "Qui suis-je ?"}</p>
    <ul class="fe-indices dfx-indices">${q.indices.map(i => `<li class="fe-indice"><span class="fe-etiq">${echapper(i.etiq)}</span><span class="fe-texte">${echapper(i.texte)}</span></li>`).join("")}</ul>
    <div class="ore-photos dfx-photos">${q.noms.map((e, k) => boutonPhotoDefi(e, k, q)).join("")}</div>`;
}
// R285 : après une erreur, la taille est dite en comparaison ET en centimètres (pour apprendre)
function texteIndicePour(o, etiq) {
  if (etiq === "Taille") { const c = tailleComparee(o), t = tailleRencontre(o); return c ? `${c}${t ? ` (${t.texte})` : ""}` : (t ? majuscule(t.texte) : ""); }
  if (etiq === "Où" && especeDansLEauDefi(o)) { const m = lireCase(o, "milieu_principal"); return m ? `Dans l'eau : ${minusculeTexte(m)}` : ""; }
  const c = candidatsIndicesDefi(o).find(z => z.etiq === etiq);
  return c ? c.texte : etiq === "Indice de présence" ? "Ne laisse pas cet indice" : "";
}
// Après une erreur sur les indices : le premier indice qui les sépare VRAIMENT (R285), pour les deux espèces
function blocIndicesErreur(q, choisie) {
  const sep = q.indices.find(i => separeParIndice(q.espece, i, choisie)) || q.indices.find(i => simplifier(texteIndicePour(choisie, i.etiq)) !== simplifier(i.texte));
  const l = sep ? { i: sep.etiq === "Taille" ? { ...sep, texte: texteIndicePour(q.espece, "Taille") } : sep, autre: texteIndicePour(choisie, sep.etiq) } : null;
  if (!l || !l.autre) return null;
  const ligne = (e, t, cls) => `<li><i class="${cls}"></i><span><b>${echapper(majuscule(nomCourt(e)))} :</b> ${echapper(minusculeTexte(t))}</span></li>`;
  return `<div class="dfx-separe"><small>Ce qui les sépare · ${echapper(minusculeTexte(l.i.etiq))}</small><ul>${ligne(q.espece, l.i.texte, "ok")}${ligne(choisie, l.autre, "ko")}</ul></div>`;
}
// 2A : placer 4 repères sous les deux noms (sans photo), puis « Vérifier »
function corpsSepareDefi(q) {
  return `<div class="dfx-facon">Ce qui les sépare</div>
    <p class="cdo-q">À qui est chaque repère ?</p>
    <p class="dfx-consigne">Sans photo : touchez le nom de l'espèce sous chaque repère.</p>
    <ul class="dfx-sp">${q.items.map((it, k) => `<li class="dfx-sp-item" data-k="${k}"><span class="dfx-sp-txt">${echapper(majuscule(it.rp.texte))}</span>
      <span class="dfx-sp-choix">${q.noms.map((e, n) => `<button type="button" class="dfx-sp-nom${it.place === e ? " choisi" : ""}" data-k="${k}" data-n="${n}" aria-pressed="${it.place === e}">${echapper(e.nom_courant)}</button>`).join("")}</span></li>`).join("")}</ul>
    <button class="cdo-suivant" id="dfx-sp-ok"${q.items.every(it => it.place) ? "" : " disabled"}>Vérifier</button>`;
}
function brancherSepareDefi(q) {
  const zone = document.getElementById("vue-defiexp");
  zone.querySelectorAll(".dfx-sp-nom").forEach(b => b.onclick = () => {
    if (q.choix) return;
    q.items[+b.dataset.k].place = q.noms[+b.dataset.n];
    b.parentNode.querySelectorAll("button").forEach(o => { const on = o === b; o.classList.toggle("choisi", on); o.setAttribute("aria-pressed", on); });
    document.getElementById("dfx-sp-ok").disabled = !q.items.every(z => z.place);
  });
  document.getElementById("dfx-sp-ok").onclick = () => verifierSepareDefi(q);
}
function verifierSepareDefi(q) {
  if (!defiExp || q.choix || !q.items.every(z => z.place)) return;
  const juste = q.items.every(z => z.place === z.e), faux = q.items.filter(z => z.place !== z.e).length;
  q.choix = juste ? q.espece : q.autre;
  const zone = document.getElementById("vue-defiexp");
  zone.querySelectorAll(".dfx-sp-item").forEach((li, k) => {
    const it = q.items[k];
    li.classList.add(it.place === it.e ? "ok" : "ko");
    li.querySelectorAll("button").forEach((b, n) => { b.disabled = true; if (q.noms[n] === it.e) b.classList.add("bon"); else if (q.noms[n] === it.place) b.classList.add("faux"); });
  });
  const ok = document.getElementById("dfx-sp-ok"); if (ok) ok.remove();
  const fig = e => `<figure class="ok agr" data-legende="${echapper(e.nom_courant)}"><span class="agr-cadre">${celluleImage(e, true)}${LOUPE_SVG}</span><span>${echapper(e.nom_courant)}</span>
      <ul class="dfx-sp-rp">${q.items.filter(z => z.e === e).map(z => `<li class="${z.place === z.e ? "ok" : "ko"}">${echapper(majuscule(z.rp.texte))}</li>`).join("")}</ul></figure>`;
  const html = `<div class="dfx-erreur dfx-sp-fin">${juste ? `<small class="dfx-oui">Les 4 repères sont à leur place</small>`
      : `<small class="dfx-pas">Pas cette fois</small><b class="dfx-cetait">${faux > 1 ? `${faux} repères mal placés` : "Un repère mal placé"}</b>`}
    <div class="dfx-duo agrandir-groupe">${fig(q.espece)}${fig(q.autre)}</div></div>`;
  conclureReponseDefi(q, juste, html);
}
// 4A : la manche « Qui est qui ? » (les questions d'un même groupe g, à la suite)
// « du merle noir », « de la mésange bleue », « de l'hermine », « des… »
function deNomAvecArticle(e) { const t = nomAvecArticle(e); return /^le /.test(t) ? "du " + t.slice(3) : /^les /.test(t) ? "des " + t.slice(4) : "de " + t; }
function groupeQq(d, q) { return d.questions.filter(z => z.type === "quiestqui" && z.g === q.g); }
function corpsQuiEstQui(d, q) {
  // R284 (45.02, choix 3A ; notes 4a et 4b du 21/11 au soir) : les noms restent en haut et gardent leur place une fois posés
  //   (grisés), pour que les photos ne bougent jamais sous le doigt ; la consigne dit les deux sens
  const gr = groupeQq(d, q), pose = e => { const z = gr.find(y => y.espece === e); return !z || z.pose; };
  const restants = q.noms.filter(e => !pose(e));
  return `<div class="dfx-facon">Qui est qui ?</div>
    <p class="cdo-q">${restants.length ? "Touchez une photo et son nom, dans l'ordre que vous voulez." : "Les 4 sont à leur place."}</p>
    <div class="dfx-qq-noms">${q.noms.map(e => pose(e)
      ? `<button type="button" class="dfx-qq-nom place" disabled aria-label="${echapper(e.nom_courant)} : placé">${echapper(e.nom_courant)}</button>`
      : `<button type="button" class="dfx-qq-nom${d.qqNom === e ? " choisi" : ""}" data-nom="${echapper(e.nom_courant)}" aria-pressed="${d.qqNom === e}">${echapper(e.nom_courant)}</button>`).join("")}</div>
    <div class="dfx-qq-grille">${gr.map((z, k) => `<div class="dfx-qq-case${z.pose ? " pose" : ""}${d.qqPhoto === k ? " choisie" : ""}" data-k="${k}">
        <button type="button" class="dfx-qq-ph" data-k="${k}" aria-label="Photo ${k + 1}${z.photo && formeCourte(z.photo.sujet) ? ` · ${formeCourte(z.photo.sujet)}` : ""}"${z.pose ? " disabled" : ""}>${z.photo ? imagePhoto(z.photo.src, `Photo ${k + 1}`, true) : celluleImage(z.espece, true)}${z.photo && formeCourte(z.photo.sujet) ? `<small>${echapper(formeCourte(z.photo.sujet))}</small>` : ""}</button>
        <div class="dfx-qq-place">${z.pose ? `✓ ${echapper(z.espece.nom_courant)}` : ""}</div></div>`).join("")}</div>`;
}
function brancherQuiEstQui(d, q) {
  const bloc = document.getElementById("dfx-qq");
  if (!bloc) return;
  const gr = groupeQq(d, q);
  bloc.querySelectorAll(".dfx-qq-nom:not(.place)").forEach(b => b.onclick = () => {
    const e = especeParNom(b.dataset.nom);
    if (d.qqPhoto != null) { placerQuiEstQui(d, q, e, gr[d.qqPhoto]); return; }
    d.qqNom = d.qqNom === e ? null : e; redessinerQuiEstQui(d, q);
  });
  bloc.querySelectorAll(".dfx-qq-ph").forEach(b => b.onclick = () => {
    const k = +b.dataset.k;
    if (d.qqNom) { placerQuiEstQui(d, q, d.qqNom, gr[k]); return; }
    d.qqPhoto = d.qqPhoto === k ? null : k; redessinerQuiEstQui(d, q);
  });
}
function redessinerQuiEstQui(d, q, faute) {
  const bloc = document.getElementById("dfx-qq");
  if (!bloc) return;
  bloc.innerHTML = corpsQuiEstQui(d, q);
  if (faute != null) { const c = bloc.querySelector(`.dfx-qq-case[data-k="${faute}"]`); if (c) { c.classList.add("faute"); setTimeout(() => c.classList.remove("faute"), 900); } }
  brancherQuiEstQui(d, q);
}
// Un nom posé sur une photo : juste, il reste ; faux, il revient à sa liste et compte une erreur pour cette espèce (la première seulement)
function placerQuiEstQui(d, q, e, z) {
  const gr = groupeQq(d, q), es = gr.find(y => y.espece === e);
  d.qqNom = null; d.qqPhoto = null;
  if (!es || !z || z.pose) { redessinerQuiEstQui(d, q); return; }
  const bon = z.espece === e;
  if (!es.choix) {
    es.choix = bon ? e : z.espece;
    if (d.dejaReconnues.has(e.nom_courant)) { if (bon) acquerir(e, IDENTIFICATION); else noterEchec(e, IDENTIFICATION); }
    else if (!bon && typeof noterEchec === "function") noterEchec(e, IDENTIFICATION);
  }
  if (bon) es.pose = true;
  try { jouerSon(bon ? "bonne" : "mauvaise"); } catch (err) {}
  sauverDefiExp();
  majCompteErreurs(erreursDefi(d), erreursPermisesDefi(d.questions.length));
  const barre = document.querySelector("#vue-defiexp .dfx-barre"); if (barre) barre.outerHTML = enteteDefiExp().match(/<div class="dfx-barre[^"]*"[^>]*>.*<\/div>$/s)[0];
  redessinerQuiEstQui(d, q, bon ? null : gr.indexOf(z));
  if (gr.every(y => y.pose)) finirQuiEstQui(d, q);
}
function finirQuiEstQui(d, q) {
  const gr = groupeQq(d, q), fautes = gr.filter(y => y.choix !== y.espece);
  const html = fautes.length ? `<div class="dfx-erreur dfx-qq-fin"><small class="dfx-pas">Pas du premier coup</small>
      ${fautes.map(y => `<p class="dfx-qq-faute"><b>${echapper(y.espece.nom_courant)}</b> · votre premier choix : la photo ${echapper(deNomAvecArticle(y.choix))}.</p>${blocSepare(y.espece, y.choix, y.photo && y.photo.sujet)}`).join("")}</div>`
    : `<p class="dfx-qq-bravo">Les 4 du premier coup.</p>`;
  conclureReponseDefi(q, !fautes.length, html, { son: false, noter: false });
}

// Le haut de l'écran : « Quitter », l'expédition, « 5 / 14 », puis la barre (une case par question)
function enteteDefiExp() {
  const d = defiExp;
  if (d.rep && d.rep.lance) return enteteRepechage(d.x.titre, d.rep.questions.map(q => ({ repondu: !!q.choix, juste: q.choix === q.espece })), d.rep.i);   // R249
  // R283 : la manche « Qui est qui ? » occupe 4 cases (« 9 à 12 / 20 »)
  const qc = d.questions[d.i], gr = qc && qc.type === "quiestqui" ? d.questions.map((z, k) => k).filter(k => d.questions[k].type === "quiestqui" && d.questions[k].g === qc.g) : [d.i];
  const cases = d.questions.map((q, k) => `<i class="${q.choix ? (q.choix === q.espece ? "ok" : "ko") : gr.includes(k) ? "cur" : ""}"></i>`).join("");
  const n = d.questions.length, compte = gr.length > 1 ? `${gr[0] + 1} à ${gr[gr.length - 1] + 1} / ${n}` : `${Math.min(d.i + 1, n)} / ${n}`;
  return `<div class="dfx-haut"><button class="cdo-quitter dfx-sortir" id="dfx-quitter" aria-label="Revenir à l'expédition (le défi est gardé)">←</button>
      <span class="cdo-titre">Me tester · ${echapper(d.x.titre)}</span><span class="dfx-compte">${compte}</span></div>
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
  // R264 (39) : les photos des 2 questions suivantes se chargent pendant qu'on répond à celle-ci
  if (!enRep) for (const s of d.questions.slice(d.i + 1, d.i + 3)) {
    if (s.photo) prechargerPhotos([s.photo.src]);
    if (s.type !== "photo") prechargerEspeces(s.noms, true);
  }
  if (q.type === "quiestqui") { d.qqNom = null; d.qqPhoto = null; }
  const zone = document.getElementById("vue-defiexp");
  const etiquette = q.photo ? etiquetteForme(q.photo.sujet) : "";
  const enPhotos = q.type === "laquelle" || q.type === "cri" || q.type === "indices";
  const sansAides = q.type === "separe" || q.type === "quiestqui";   // R283 : rien à retirer dans une manche
  const corps = q.type === "repere" ? corpsRepereDefi(q) : q.type === "indices" ? corpsIndicesDefi(q) : q.type === "separe" ? corpsSepareDefi(q)
    : q.type === "quiestqui" ? `<div id="dfx-qq">${corpsQuiEstQui(d, q)}</div>`
    : q.type === "cri"
    ? `<div class="ore-ecoute dfx-ecoute"><button class="ore-play" id="dfx-play" aria-label="Écouter le cri">${PLAY_SVG}</button><p class="cdo-q">À qui est ce cri ?</p></div>
       <div class="ore-photos dfx-photos">${q.noms.map((e, k) => boutonPhotoDefi(e, k, q)).join("")}</div>`
    : q.type === "laquelle"
    ? `<p class="cdo-q dfx-q-nom">Laquelle est ${echapper(nomAvecArticle(q.espece))} ?</p>
       <div class="ore-photos dfx-photos">${q.noms.map((e, k) => boutonPhotoDefi(e, k, q)).join("")}</div>`
    : `<div class="cdo-photo">${imageQuestionDefi(q)}${etiquette ? `<small class="cdo-forme">${echapper(etiquette.replace(/^(La|Le|L')\s?/, "").replace(/^./, c => c.toUpperCase()))}</small>` : ""}</div>
       <p class="cdo-q">Quelle est cette espèce ?</p>
       <div class="cdo-noms">${q.noms.map((e, k) => boutonNomDefi(e, k, q)).join("")}</div>`;
  zone.innerHTML = `<div class="cdo dfx">${enteteDefiExp()}${enRep ? "" : ligneCompteErreurs(erreursDefi(d), erreursPermisesDefi(d.questions.length))}
      ${corps}
      <div class="cdo-retour" id="dfx-retour"></div>
      ${enRep || sansAides ? "" : `<div class="dfx-aides" id="dfx-aides"><small>Vos aides</small>
        <button class="cdo-second" id="dfx-retirer"${d.aides.retirer > 0 && !q.retires.length ? "" : " disabled"}>${texteAideDefi("Retirer deux réponses", d.aides.retirer, AIDES_DEFI.retirer)}</button>
        ${enPhotos ? "" : `<button class="cdo-second" id="dfx-silh"${d.aides.silhouettes > 0 && !d.silhouettesVisibles ? "" : " disabled"}>${texteAideDefi("Voir les silhouettes", d.aides.silhouettes, AIDES_DEFI.silhouettes)}</button>`}</div>`}
    </div>`;   // R249 : pas d'aide pendant le repêchage (une erreur n'y coûte rien)
  zone.querySelectorAll(".cdo-nom, .dfx-ph").forEach(b => b.onclick = () => repondreDefiExp(q.noms[+b.dataset.k], b));
  if (q.type === "separe") brancherSepareDefi(q);
  if (q.type === "quiestqui") brancherQuiEstQui(d, q);
  const play = document.getElementById("dfx-play");
  if (play) { play.onclick = () => ecouter(q.espece); setTimeout(() => { if (defiExp && qCouranteDefi(defiExp) === q && !q.choix) ecouter(q.espece); }, 250); }
  document.getElementById("dfx-quitter").onclick = mettreDefiDeCote;   // R241 (36.33) : plus de feuille « Quitter le défi ? »
  const retirer = document.getElementById("dfx-retirer"); if (retirer) retirer.onclick = () => aideRetirer(q);
  const silh = document.getElementById("dfx-silh"); if (silh) silh.onclick = () => aideSilhouettes();
  window.scrollTo(0, 0);
  if (typeof calerJeuSousPouce === "function") calerJeuSousPouce(zone);   // étape R265 (40.03)
}
function boutonNomDefi(e, k, q) {
  const silh = defiExp.silhouettesVisibles && typeof fichierSilhouette === "function" ? fichierSilhouette(e) : "";
  const retire = q.retires.includes(e);
  return `<button class="cdo-nom${silh ? " avec-silh" : ""}${retire ? " retire" : ""}" data-k="${k}"${retire ? " disabled" : ""}>${silh ? `<img class="dfx-silh" src="${silh}" alt="" onerror="this.remove()">` : ""}<span>${echapper(e.nom_courant)}</span></button>`;
}
// Aide 1 : deux mauvaises réponses disparaissent (2 fois par défi, R285 ; une seule fois par question)
function aideRetirer(q) {
  const d = defiExp;
  if (!(d.aides.retirer > 0) || q.choix || q.retires.length) return;
  d.aides.retirer--;
  q.retires = melanger(q.noms.filter(e => e !== q.espece)).slice(0, 2);
  afficherQuestionDefiExp();
}
// Aide 2 : la silhouette de chaque réponse, jusqu'à la fin de la question (une fois par défi)
function aideSilhouettes() {
  const d = defiExp;
  if (!(d.aides.silhouettes > 0) || qCouranteDefi(d).choix || d.silhouettesVisibles) return;
  d.aides.silhouettes--; d.silhouettesVisibles = true;
  afficherQuestionDefiExp();
}

function repondreDefiExp(choisie, bouton) {
  const d = defiExp, q = d ? qCouranteDefi(d) : null;
  if (!d || q.choix || q.type === "separe" || q.type === "quiestqui") return;   // R283 : les deux manches ont leur propre fin
  q.choix = choisie;
  const juste = choisie === q.espece;
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
  // R265 (40.12, 6A) : une bonne réponse a sa ligne « Oui » et un repère de terrain (le nom n'est pas redit, R239)
  //   R283 : après le repère (posé sans photo), la photo arrive avec le repère, pour expliquer
  const oui = typeof verdictHtml === "function" ? `<p class="apf-verdict">${verdictHtml({ juste: true, complement: q.type === "repere" ? "" : complementReconnaissance(q.espece, q.photo && q.photo.sujet) })}</p>` : "";
  const bloc = q.type === "repere" ? blocRepereErreur(q, choisie) : q.type === "indices" ? blocIndicesErreur(q, choisie) : null;
  const html = juste ? `${oui}${q.type === "repere" ? photoRepereDefi(q) : ""}`
    : `${erreurCoteACote(q.espece, choisie, q.photo && q.photo.sujet, bloc)}${q.type === "cri" && typeof aUnCri === "function" && aUnCri(choisie)
      ? `<div class="dfx-ecouter"><small>Écoutez les deux :</small><button class="cdo-second" data-ecoute="${echapper(q.espece.nom_courant)}">${PLAY_SVG}${echapper(q.espece.nom_courant)}</button><button class="cdo-second" data-ecoute="${echapper(choisie.nom_courant)}">${PLAY_SVG}${echapper(choisie.nom_courant)}</button></div>` : ""}`;
  conclureReponseDefi(q, juste, html);
}
// R283 : la suite d'une réponse, commune à toutes les façons (son, compte, sauvegarde, explication, « Question suivante »)
//   opts.son = false : déjà joué (Qui est qui ?, à chaque nom posé) ; opts.noter = false : déjà noté espèce par espèce
function conclureReponseDefi(q, juste, explication, opts = {}) {
  const d = defiExp, enRep = !!(d.rep && d.rep.lance);   // R249
  if (opts.son !== false) try { jouerSon(juste ? "bonne" : "mauvaise"); } catch (err) {}   // R239 (36.04) : les mêmes petits sons que le reste du jeu
  const zone = document.getElementById("vue-defiexp");
  // Une espèce déjà reconnue avant le défi : la réponse compte pour elle, comme dans Coup d'œil (les autres attendent la fin)
  if (opts.noter !== false) for (const e of especesDeQ(q)) {
    if (d.dejaReconnues.has(e.nom_courant)) { if (juste) acquerir(e, IDENTIFICATION); else if (!enRep) noterEchec(e, IDENTIFICATION); }
    else if (!juste && !enRep && typeof noterEchec === "function") noterEchec(e, IDENTIFICATION);   // pour la coriace des prochains défis (R249 : une erreur au repêchage ne compte pas)
  }
  sauverDefiExp();   // R241 : le défi en cours est gardé à chaque réponse
  d.silhouettesVisibles = false;
  const aides = document.getElementById("dfx-aides");
  if (aides) aides.style.visibility = "hidden";   // R265 : la place reste, les réponses ne bougent pas
  // R249 : au repêchage, c'est fini à la dernière question, ou dès que les erreurs effacées suffisent
  const fin = enRep ? d.rep.i >= d.rep.questions.length - 1 : d.questions.every(faiteDefi);   // R285b (6B) : toutes les questions du repêchage sont posées
  // R274 (5A) : le compte des erreurs suit ; avec l'erreur qui rend le défi impossible à réussir (même repêché), le choix
  //   « Continuer quand même » / « Arrêter et découvrir ces espèces » remplace « Question suivante », une seule fois.
  if (!enRep) majCompteErreurs(erreursDefi(d), erreursPermisesDefi(d.questions.length));
  const perdu = !enRep && !fin && !juste && !d.perduVu && defiPerdu(erreursDefi(d), erreursPermisesDefi(d.questions.length));
  const suivant = perdu ? blocDefiPerdu("défi", "Arrêter et découvrir ces espèces") : `<button class="cdo-suivant" id="dfx-suivant">${fin ? "Voir le résultat" : "Question suivante"}</button>`;
  const retour = document.getElementById("dfx-retour");
  retour.innerHTML = `${enRep ? ligneRepechage(juste, erreursDefi(d), erreursPermisesDefi(d.questions.length), d.rep.i, d.rep.questions.length) : ""}${explication}${suivant}`;   // R249, R285b
  retour.querySelectorAll("[data-ecoute]").forEach(b => b.onclick = () => ecouter(especeParNom(b.dataset.ecoute)));
  zone.querySelector(".dfx-barre").outerHTML = enteteDefiExp().match(/<div class="dfx-barre[^"]*"[^>]*>.*<\/div>$/s)[0];
  // R283 : la question suivante est la première pas encore faite (la manche « Qui est qui ? » en occupe 4)
  const avancer = () => { if (fin) finDefiExp(); else { if (enRep) d.rep.i++; else d.i = d.questions.findIndex(z => !faiteDefi(z)); sauverDefiExp(); afficherQuestionDefiExp(); } };
  if (perdu) {   // R274 : pas de bouton fixé ici, les deux choix sont dans la page, sous l'explication
    brancherChoixDefiPerdu(avancer);
    const bloc = document.getElementById("dfx-perdu");
    setTimeout(() => { if (document.body.contains(bloc)) bloc.scrollIntoView({ block: "end", behavior: "smooth" }); }, 60);
    return;
  }
  document.getElementById("dfx-suivant").onclick = avancer;
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
function erreurCoteACote(bonne, choisie, sujet, autreBloc) {   // R283 : autreBloc = l'explication propre à la façon (repère, indices)
  const bloc = autreBloc || blocSepare(bonne, choisie, sujet);
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
    for (const e of especesDeQ(q)) { const k = c.get(e); if (!k) continue; k.poses++; if (q.choix === q.espece) k.bons++; }   // R283 : « Ce qui les sépare » compte pour les deux
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
  const prevues = e => d.questions.filter(q => especesDeQ(q).includes(e)).length;   // R242 : 2 ou 3 selon l'espèce (R283 : la paire compte pour les deux)
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
  // R284 (45.04) : jamais une silhouette « photo à venir » à côté des vraies photos du bilan (l'espèce sans photo : son nom seul)
  const vignette = e => jouableEnJeu(e) ? `<img src="${photoMini(photoEsp(e))}" alt="${echapper(e.nom_courant)}">` : "";
  if (reussi && FIN_TEST_VIVANTE) {                   // étape R267 (40.16) : la fin « comme les autres »
    const ensuite = typeof aUneEtape2 === "function" && aUneEtape2(x) && !etapeFinie(x, 2);
    zone.innerHTML = `<div class="cdo dfx dfx-fin dft">${ecranFinTest({ x, etiq: `${x.titre} · Me tester`, titre: "Défi réussi",
        bons, total, sous: `bonnes réponses${repechage ? " · repêché" : ""}`, empreintes,
        ronds: x.liste.filter(jouableEnJeu).map(e => ({ e, ok: faiteDans(x, e, 1) })), tous: x.liste.map(e => ({ e, ok: faiteDans(x, e, 1) })), motOk: "reconnues", ratees: rateesDefi(d),
        pied: `${ensuite ? `<p class="dft-suite">Ensuite : <b>${titreEtape(2)}</b>, comment elles vivent ici.</p>` : ""}
          <button class="cdo-suivant dft-principal" id="dfx-voir">Revenir à l'expédition</button>` })}</div>`;
    animerGainFinTest(empreintes);
  } else if (reussi) {
    const ensuite = typeof aUneEtape2 === "function" && aUneEtape2(x) && !etapeFinie(x, 2);
    zone.innerHTML = `<div class="cdo dfx dfx-fin">
        <div class="dfx-medaille" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>
        <h2>Défi réussi</h2>
        <p class="cdo-sous">${bons} bonnes réponses sur ${total}${repechage ? " · repêché" : ""}</p>
        <div class="dfx-ronds">${x.liste.map(vignette).join("")}</div>
        <ul class="dfx-lignes">
          <li>Les ${x.liste.length} espèces sont <b>reconnues</b>.</li>
          <li>${empreintes ? `+${empreintes} empreinte${empreintes > 1 ? "s" : ""} : celles des Rencontres.` : "Vos empreintes des Rencontres étaient déjà gagnées."}</li>
          ${ensuite ? `<li>Pour les <b>comprendre</b> : ${titreEtape(2)}, comment elles vivent ici.</li>` : ""}
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
        ${FIN_TEST_VIVANTE ? `<div class="dft-carte dft-court"><div class="dft-etiq">${echapper(x.titre)} · Me tester</div>
          <h2 class="dft-titre">${erreursDefi(d) <= erreursPermisesDefi(total) + 2 ? "Presque" : "Pas encore"}</h2>
          <div class="dft-score"><b>${bons}</b><span>/ ${total}</span></div><p class="dft-sous">bonnes réponses · il en faut ${total - erreursPermisesDefi(total)}</p></div>`
        : `<h2>${erreursDefi(d) <= erreursPermisesDefi(total) + 2 ? "Presque" : "Pas encore"}</h2>
        <p class="cdo-sous">${bons} bonnes réponses sur ${total} · il en faut ${total - erreursPermisesDefi(total)}</p>`}
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
    feter({ exp: x, etiquette: `Expédition · ${x.titre}`, titre: finieAussi ? "Expédition terminée !" : etapeReussie(1),
            detail: empreintes ? `+${empreintes} empreinte${empreintes > 1 ? "s" : ""}` : "", son: "badge",
            visuel: `<div class="fete-visuel rang exp-fete">${PAS_SVG}</div>` });
  } else if (empreintes) setTimeout(() => afficherBulle(`+${empreintes} empreinte${empreintes > 1 ? "s" : ""}`), 600);
  if (empreintes) verifierOuverture();
}

// ==================================================================
// Étape R267 (Notion 40.16, choix 9B du 19/11 ; note 18 d'Aubin : « faire comme les autres, mettre un score en avant,
//   mettre les empreintes gagnées… rendre les choses un peu plus vivantes ») : la fin d'un « Me tester » (étape 1 et
//   Approfondir). En un coup d'œil : le score en très gros, « +N » empreintes qui s'envolent vers le compteur, une petite
//   marque ✓ sous chaque photo, la jauge du lieu qui monte (la part gagnée en vert), les questions ratées repliées, et le
//   bouton de la suite fixé en bas (téléphone). La grande fête reste réservée à la première fois (étape finie).
//   o = { x, etiq, titre, bons, total, sous, ronds: [{ e, ok }], motOk, empreintes, ratees: [{ nom, detail }], pied (HTML) }
// ==================================================================
const FIN_TEST_VIVANTE = true;   // false = l'ancien écran (rond vert, lignes)
function jaugeLieuFinTest(x, gain) {
  const c = x && x.chapitre && chapitreParNom(x.territoire, x.chapitre);
  if (!c || !estLieu(c) || toutDebloque()) return "";
  const max = empreintesMaxLieu(x.territoire, c), apres = Math.min(empreintesDuLieu(x.territoire, c), max), avant = Math.max(0, apres - (gain || 0));
  return `<div class="dft-lieu"><div class="dft-lieu-texte"><span>${echapper(c.nom)}</span><b>${apres} sur ${max}</b></div>${dessinJaugeGain(avant, apres - avant, max)}</div>`;
}
function ecranFinTest(o) {
  const tous = o.tous || o.ronds, n = tous.filter(r => r.ok).length;   // R284 : o.tous = toutes les espèces, quand les ronds n'en montrent qu'une partie
  const ronds = o.ronds.map(r => `<span class="dft-rond${r.ok ? " ok" : ""}"><img src="${photoMini(photoEsp(r.e))}" alt="${echapper(r.e.nom_courant)}" onerror="this.onerror=null;this.src='${photoEsp(r.e)}'">${r.ok ? `<i aria-hidden="true">✓</i>` : ""}</span>`).join("");
  const ratees = (o.ratees || []).length ? `<details class="dft-ratees"><summary>${o.ratees.length > 1 ? `Les ${o.ratees.length} questions ratées` : "La question ratée"}</summary>
      <ul>${o.ratees.map(r => `<li><b>${echapper(r.nom)}</b>${r.detail ? `<small>${echapper(r.detail)}</small>` : ""}</li>`).join("")}</ul></details>` : "";
  return `<div class="dft-carte">
      <div class="dft-etiq">${echapper(o.etiq || "")}</div>
      <h2 class="dft-titre">${o.titre}</h2>
      <div class="dft-score"><b>${o.bons}</b><span>/ ${o.total}</span></div>
      <p class="dft-sous">${o.sous}</p>
      ${o.empreintes ? `<div class="dft-gain" id="dft-gain">+${o.empreintes} ${PAS_SVG}</div>` : ""}
      <div class="dft-ronds">${ronds}</div>
      ${n ? `<p class="dft-mot">${n === tous.length ? `Les ${n} espèces sont <b>${o.motOk}</b>.` : `${n} espèce${n > 1 ? "s" : ""} sur ${tous.length} ${n > 1 ? "sont" : "est"} <b>${o.motOk}</b>.`}</p>` : ""}
      ${jaugeLieuFinTest(o.x, o.empreintes)}
      ${ratees}
    </div>${o.pied || ""}`;
}
// « +N » : il apparaît, puis s'envole vers le compteur d'empreintes du haut (comme « Tout récupérer » sur l'accueil)
function animerGainFinTest(n) {
  const el = document.getElementById("dft-gain");
  if (!el || !n) return;
  let essais = 0;   // pendant la grande fête (la 1re fois), on attend qu'elle se ferme : l'envol se voit ensuite
  const partir = () => {
    if (!document.body.contains(el)) return;
    if (typeof feteOuverte !== "undefined" && feteOuverte && essais++ < 30) { setTimeout(partir, 300); return; }
    if (typeof envolEmpreintes === "function") envolEmpreintes(el, n);
  };
  setTimeout(partir, 900);
}
function rateesDefi(d) {
  const nom = e => e ? e.nom_courant : "";
  const forme = { photo: "sa photo", laquelle: "« Laquelle est… ? »", cri: "son cri", repere: "son repère", indices: "ses indices", quiestqui: "« Qui est qui ? »" };
  return d.questions.filter(q => q.choix && q.choix !== q.espece).map(q => q.type === "separe"   // R283
    ? { nom: `${nom(q.espece)} et ${nom(q.autre)}`, detail: "« Ce qui les sépare » · des repères mal placés" }
    : { nom: nom(q.espece),
    detail: `${q.type !== "quiestqui" && q.photo && etiquetteForme(q.photo.sujet) ? etiquetteForme(q.photo.sujet) : forme[q.type] || "sa photo"} · votre choix : ${nom(q.choix)}` });
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
// Étape R271 (test du 19/11, n° 20 : « Environ 14 min » annoncé pour 7 espèces, 25 à 30 min en vrai) : une Rencontre, c'est
//   une demi-douzaine de questions et deux écrans à lire, soit 3 à 4 minutes par espèce. On annonce une fourchette honnête.
function minutesRencontres(n) {
  if (n <= 1) return "3 à 4";
  const arrondi = v => v >= 10 ? Math.round(v / 5) * 5 : Math.round(v);
  return `${arrondi(n * 3)} à ${arrondi(n * 4)}`;
}
function minutesDefi(nq) { return Math.max(3, Math.round(nq * 0.3)); }   // R242 (13A) : d'après le nombre de questions (20 → environ 6 min)
// R274 (test du 19/11, n° 8 ; choix 6A, qui ajuste « deux portes égales » du 16/11) : critère « un nouveau joueur comprend par
//   où commencer ». Tant que l'expédition n'a jamais été jouée, « Découvrir » est la porte pleine (vert foncé) et « Me tester »
//   la porte claire ; ensuite les deux portes ont le même style (claires). Avant : « Me tester » toujours pleine.
function porteDecouvrir(titre, texte, bas, pleine) {
  return `<button class="dfx-p decouvrir${pleine ? " pleine" : ""}" data-porte="decouvrir">${PICTO_DECOUVRIR}<b>${titre}</b><span>${texte}</span><small>${bas}</small></button>`;
}
function porteTester(titre, texte, bas) {
  return `<button class="dfx-p tester" data-porte="tester">${PICTO_TESTER}<b>${titre}</b><span>${texte}</span><small>${bas}</small></button>`;
}
function portesEtape1(x) {
  const n = x.liste.length, av = avanceeEtape(x, 1), st = etatDefiExp(x);
  const gain = `<small class="dfx-gain">+${gainEtape(x, 1)} ${PAS_SVG} · 1 par espèce, quelle que soit la façon</small>`;
  const reste = n - av.faites;
  if (defiEnPause(x)) {                     // R241 (36.17) : un défi mis de côté — « Reprendre le défi » d'abord (comme « Continuer les Rencontres », 2B)
    const s = suivi.defisEnCours[x.id], total = s.questions.length, faites = s.questions.filter(q => q.c).length;
    const erreurs = s.questions.filter(q => q.c && q.c !== q.e).length;
    return `<div class="dfx-portes encours"><div class="etiq-jeu">${nomEtape(1)}</div>
        <div class="dfx-encours"><div class="dfx-encours-haut"><b>Me tester · en cours</b><small>${faites} sur ${total}</small></div>
          <i class="jauge-jeu"><b style="width:${Math.round(100 * faites / Math.max(1, total))}%"></b></i>
          <div class="dfx-prochaine"><span>${erreurs ? `${erreurs} erreur${erreurs > 1 ? "s" : ""} jusqu'ici` : "Aucune erreur jusqu'ici"} · ${erreursPermisesDefi(total)} permise${erreursPermisesDefi(total) > 1 ? "s" : ""}</span></div>
          <button class="cdo-suivant" data-porte="reprendre">Reprendre le défi</button></div>
        <button class="dfx-plutot" data-porte="decouvrir">${PICTO_DECOUVRIR}Découvrir plutôt</button>
        <small class="dfx-note">Le défi reste de côté : vous pourrez le reprendre plus tard.</small>${gain}</div>`;
  }
  if (st && st.dernier && !st.reussi) {     // après un défi pas réussi
    return `<div class="dfx-portes"><div class="etiq-jeu">${nomEtape(1)}</div>
        <p class="dfx-bandeau">Dernier défi : <b>${st.dernier.bons} sur ${st.dernier.total}</b>.${av.faites ? ` ${av.faites} espèce${av.faites > 1 ? "s sont" : " est"} déjà reconnue${av.faites > 1 ? "s" : ""} ; il en reste ${reste}.` : ""} Continuez comme vous préférez.</p>
        <div class="dfx-deux-portes">${porteDecouvrir("Découvrir", `Rencontrer ${reste > 1 ? `les ${reste} espèces` : "l'espèce"} ${av.faites ? "qui reste" + (reste > 1 ? "nt" : "") : "de l'expédition"}.`, `${minutesRencontres(reste)} min`)}
          ${porteTester("Me tester", `Rejouer le défi sur les ${n} espèces.`, `Environ ${minutesDefi(nbQuestionsDefi(x))} min`)}</div>${gain}</div>`;
  }
  const commencees = av.faites > 0 || x.liste.some(e => estTentee(x, e));
  if (commencees) {                         // Rencontres en cours (2B)
    const p = especeAConnaitre(x);
    const prochaine = !p ? (aRattraper(x).length ? `À revoir : ${texteARevoir(x)}` : "")
      : especeFaite(p, 1) ? `À revoir ici : ${especesARevoirIci(x).length} espèce${especesARevoirIci(x).length > 1 ? "s" : ""} déjà rencontrée${especesARevoirIci(x).length > 1 ? "s" : ""} ailleurs (une photo chacune)`
      : `Prochaine rencontre : ${estIdentifiee(p) ? echapper(p.nom_courant) : "une espèce inconnue"}`;
    const vign = p && !especeFaite(p, 1) ? `<span class="dfx-vign${estIdentifiee(p) ? "" : " inconnue"}"><img src="${photoMini(photoEsp(p))}" alt=""></span>` : "";
    return `<div class="dfx-portes encours"><div class="etiq-jeu">${nomEtape(1)}</div>
        <div class="dfx-encours"><div class="dfx-encours-haut"><b>Découvrir · en cours</b><small>${av.faites} sur ${n}</small></div>
          <i class="jauge-jeu"><b style="width:${Math.round(100 * av.faites / n)}%"></b></i>
          ${prochaine ? `<div class="dfx-prochaine">${vign}<span>${prochaine}</span></div>` : ""}
          <button class="cdo-suivant" data-porte="decouvrir">Continuer les Rencontres</button></div>
        <button class="dfx-plutot" data-porte="tester">${PICTO_TESTER}Me tester plutôt</button>
        <small class="dfx-note">Le défi porte sur les ${n} espèces.${av.faites ? ` ${av.faites > 1 ? `Les ${av.faites} déjà reconnues le restent` : "Celle déjà reconnue le reste"}, quoi qu'il arrive.` : ""}</small>${gain}</div>`;
  }
  return `<div class="dfx-portes"><div class="etiq-jeu">${nomEtape(1)}</div>
      <p class="dfx-phrase">Deux façons de reconnaître ces ${n} espèces : les découvrir une à une, ou vous tester tout de suite. Vous pourrez changer en route.</p>
      <div class="dfx-deux-portes">${porteDecouvrir("Découvrir", "Chaque espèce, une à une : sa carte, sa vie.", `${minutesRencontres(n)} min, en une ou plusieurs fois`, !(st && st.joues))}
        ${porteTester("Me tester", `${nbQuestionsDefi(x)} questions, ${erreursPermisesDefi(nbQuestionsDefi(x))} erreurs permises. Chaque erreur est expliquée.`, `Environ ${minutesDefi(nbQuestionsDefi(x))} min · 3 aides`)}</div>${gain}</div>`;
}
function brancherPortes(zone, x) {
  zone.querySelectorAll("[data-porte]").forEach(b => b.onclick = () => b.dataset.porte === "tester" ? lancerDefiExp(x) : b.dataset.porte === "reprendre" ? reprendreDefiExp(x) : lancerExpedition(x, 1));
  zone.querySelectorAll("[data-rencontrer]").forEach(b => b.onclick = () => { const e = especesSansRencontre(x)[0]; if (e) rencontrerEspeceExp(x, e); });
}
// Les espèces reconnues par un défi dont la Rencontre n'a pas été faite (photo, sa vie, Étonnant restent à voir)
// Étape R263 (Notion 40.17, 19c, « Rencontrer les 4 espèces restantes » alors que tout était fait) : une espèce dont la Rencontre
//   a été faite n'y entre plus, même avec une question ratée (elle reviendra au rattrapage). Rencontre faite = notée à la fin
//   (suivi.rencontresFaites, depuis R263) ou, pour les parties d'avant, une chose de sa vie déjà trouvée (le défi n'en demande pas).
function rencontreDejaFaite(e) {
  if (suivi && suivi.rencontresFaites && suivi.rencontresFaites[e.nom_courant]) return true;
  return typeof champsEtape === "function" && champsEtape(e, 2).some(c => nbBonnes(e, c) >= 1);
}
function especesSansRencontre(x) {
  return x.liste.filter(e => reconnueParDefi(e) && estRenseigne(e.photo) && trouvesEspece(e, 1) < butEspece(e, 1) && !rencontreDejaFaite(e));
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
