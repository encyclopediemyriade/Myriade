// ==================================================================
// 20. LES FORMES D'EXPÉDITION (étapes R169 à R172, 08/11/2026)
//    Choix d'Aubin (08/11) : « A avec un peu de D » — maquettes « Myriade · Formes d'expédition (maquettes) ».
//    On garde les 3 étapes ; c'est la MANIÈRE de jouer qui change d'une expédition à l'autre :
//      - étape 1 « Par le cri » (R169)     : pour une espèce nouvelle qui a un cri, on l'écoute avant de voir la photo ;
//      - étape 1 « Par les indices » (R170) : quelques indices (milieu, traces, taille, silhouette), puis 4 photos sans nom ;
//      - étape 2 « La planche » (R171)      : au début de l'étape, une page où l'on relie des phrases aux espèces ;
//      - « Un lien du lieu » (R172)          : en fin d'expédition, une question sur un vrai lien de la finale du lieu.
//    Après chaque nouveauté, les questions classiques continuent comme avant : on apprend autant, rien ne recule.
//    Règle d'alternance : dans un lieu, deux expéditions qui se suivent n'ont jamais la même forme d'étape 1.
//    Ton (retour d'Aubin du 08/11) : varié, jamais enfantin — des textes sobres, on dit ce qu'on montre et ce qu'on demande.
//    Pour revenir à l'ancien jeu : FORMES_EXPEDITION = false (ou jouer jeu_1.0.0.html, la copie de la version 1.0.0).
// ==================================================================
const FORMES_EXPEDITION = true;
const FORMES = { classique: "Classique", cri: "Par le cri", indices: "Par les indices" };
const MIN_ESPECES_FORME = 3;        // une forme n'est choisie que si au moins 3 espèces de l'expédition s'y prêtent
const PHRASES_PLANCHE_MAX = 7;

// Une case lisible : ni vide, ni « NA », ni rose (à confirmer)
function lireCase(e, colonne) {
  if (!e || (e.a_confirmer || []).includes(colonne)) return null;
  const v = e[colonne];
  return estRenseigne(v) ? v : null;
}
function aUnCri(e) { return estRenseigne(e.photo) && fichierSon(e) !== "NA"; }
function traceDe(e) { return lireCase(e, "nom_trace_indice") || lireCase(e, "indice_presence"); }
function becDe(e) { return e.onglet === "Oiseaux" ? lireCase(e, "bec_forme") : null; }
// Étape R170 : les indices de base (où, taille, silhouette) suffisent ; une trace ou la forme du bec les enrichissent
function aDesIndices(e) { return estRenseigne(e.photo) && !!lireCase(e, "milieu_principal") && tailleNombre(e) !== null; }

// ---- La forme de l'étape 1 de chaque expédition (calculée une fois, lieu par lieu) ----
const memoFormes = new Map();
function groupeDeLExpedition(x) {
  return x.chapitre ? expeditionsDuChapitre(x.territoire, x.chapitre) : expeditionsDe(x.territoire);
}
function formeEtape1(x) {
  if (!FORMES_EXPEDITION || !x) return "classique";
  if (memoFormes.has(x.id)) return memoFormes.get(x.id);
  let prec = null;
  groupeDeLExpedition(x).forEach((y, i) => {
    const ok = { classique: true, cri: y.liste.filter(aUnCri).length >= MIN_ESPECES_FORME,
                 indices: y.liste.filter(e => aDesIndices(e) && !indicesAmbigus(e, y)).length >= MIN_ESPECES_FORME };   // R179
    const voulu = ["classique", "indices", "cri"][i % 3];   // la 1re expédition d'un lieu reste classique
    const f = ok[voulu] && voulu !== prec ? voulu : ["cri", "indices", "classique"].find(k => ok[k] && k !== prec) || "classique";
    memoFormes.set(y.id, f); prec = f;
  });
  return memoFormes.get(x.id) || "classique";
}
const PICTO_FORME = {
  classique: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 10h8M8 14h5"/></svg>',
  cri: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 10v4M9 7v10M13 4v16M17 8v8M21 11v2"/></svg>',
  indices: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/></svg>',
  planche: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
};
// La petite ligne du chemin du lieu : « Par le cri · Leur vie : sur une planche »
function libelleForme(x) {
  if (!FORMES_EXPEDITION || !x) return "";
  const f = formeEtape1(x), p = formePlanche(x);
  return `<span class="forme-chip">${PICTO_FORME[f]}${FORMES[f]}</span>${p ? `<span class="forme-chip">${PICTO_FORME.planche}La planche</span>` : ""}`;
}

// ==================================================================
// R169 · PAR LE CRI — avant la photo d'une espèce nouvelle, son cri
// ==================================================================
let formeAudio = null;
function arreterFormeAudio() { if (formeAudio) { formeAudio.pause(); formeAudio = null; } }
// Appelée au tout début de poserOuverture (09) : true = la forme a pris la main (elle reposera l'ouverture ensuite)
function formeAvantOuverture(espece) {
  if (!FORMES_EXPEDITION || !session || !session.expedition || session.expedition.etape !== 1 || session.formeFaite) return false;
  if (estIdentifiee(espece) || session.expedition.revue || session.expedition.rattrapage) return false;
  const x = expeditionParId(session.expedition.id);
  if (!x) return false;
  // Étape RF4 : avec la Rencontre complète, la façon d'entrer se choisit espèce par espèce (jamais deux fois de suite la même)
  const f = typeof RENCONTRE_COMPLETE !== "undefined" && RENCONTRE_COMPLETE ? entreeEspece(x, espece) : formeEtape1(x);
  if (f === "jumelles") { poserJumelles(espece); return true; }
  if (f === "sosie") { const autre = sosiePourEntree(espece); if (autre) { poserSosieEntree(espece, autre); return true; } }
  if (f === "cri" && aUnCri(espece) && !(sonDemande && !sonActif)) { poserEcoute(espece); return true; }
  if (f === "indices" && aDesIndices(espece) && !indicesAmbigus(espece, x)) {   // R179 : jamais deux espèces de l'expédition pour les mêmes indices
    const pieges = piegesIndices(espece, x);
    if (pieges.length >= 3) { poserIndices(espece, x, pieges); return true; }
  }
  return false;
}
// Le haut de la carte, sans photo, et une zone de réponses vide
function carteForme(espece, titre, phrase, classe) {
  session.formeFaite = true;
  enCours = { espece, champ: "forme" };
  derniereEspece = espece;
  arreterCri(); arreterFormeAudio();
  enTete(espece, false, false, titre);
  document.getElementById("photo-rencontre").classList.add("cache");
  for (const id of ["compteur-rencontre", "revision", "retour"]) document.getElementById(id).textContent = "";
  document.getElementById("affirmation").classList.add("cache");
  document.getElementById("suivant").classList.add("cache");
  document.getElementById("je-ne-sais-pas").classList.add("cache");
  document.getElementById("question").textContent = phrase;
  const zone = document.getElementById("reponses");
  zone.className = classe;
  zone.innerHTML = "";
  delete zone.dataset.repondu;
  return zone;
}
function anneauForme() {
  return `<button id="bouton-ecouter" class="anneau-ecoute" type="button" aria-label="Écouter le cri" title="Écouter (barre d'espace)">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle class="piste" cx="50" cy="50" r="40"/>
        <circle class="arc" id="arc-ecoute" cx="50" cy="50" r="40" stroke-dasharray="0 ${TOUR_ECOUTE}" transform="rotate(-90 50 50)"/>
        <circle class="disque" cx="50" cy="50" r="24"/>
        <path class="triangle" d="M44 38 L62 50 L44 62 Z"/>
        <rect class="carre" x="41" y="41" width="18" height="18" rx="3"/>
      </svg></button>`;
}
// Étape R169b (08/11, choix d'Aubin : « cri décrit + photo floue ») : pendant l'écoute, la photo très floue (on devine la
// silhouette et les couleurs, comme pour la question du cri) et le cri décrit en mots — sans jamais souffler le nom.
function descriptionCri(e) {
  let d = lireCase(e, "cri_son");
  if (!d) return null;
  const devine = t => typeof seDevineDuNom === "function" && seDevineDuNom(e, t);
  if (devine(d)) d = d.replace(/«[^»]*»/g, "").replace(/\s+([,;.])/g, "$1").replace(/\s{2,}/g, " ").trim().replace(/[,;]$/, "");
  return d && !devine(d) ? majuscule(d) : null;
}
function poserEcoute(espece) {
  const zone = carteForme(espece, "Un cri", "Écoutez-le, puis découvrez l'espèce.", "forme-ecoute");
  enTete(espece, true, false, "Un cri");                    // la photo revient, mais très floue (cadre-son)
  const cadre = document.getElementById("photo-rencontre");
  cadre.classList.remove("cache", "devoile");
  cadre.classList.add("cadre-son");
  cadre.innerHTML = celluleImage(espece) + anneauForme();
  const desc = descriptionCri(espece);
  zone.innerHTML = `${desc ? `<p class="fe-cri"><span class="fe-etiq">Le cri</span>${echapper(desc)}</p>` : ""}
    <p class="fe-aide">Le cri peut être réécouté à tout moment, aussi après la photo.</p>
    <button type="button" class="suivant bouton-annonce fe-go" id="fe-voir">Voir la photo ▶</button>
    <p class="fe-petit">Sans le son, la photo s'affiche directement.</p>`;
  cri = new Audio(fichierSon(espece));
  cri.onended = () => { const b = document.getElementById("bouton-ecouter"); if (b) b.classList.remove("en-lecture"); };
  document.getElementById("bouton-ecouter").onclick = ecouterCri;
  document.getElementById("fe-voir").onclick = () => {
    arreterCri();
    poserOuverture(espece);                       // la question habituelle (4 noms + « Me la présenter »), la photo apparaît
    const cadre = document.getElementById("photo-rencontre");
    const b = document.createElement("button");
    b.type = "button"; b.className = "fe-reecouter";
    b.innerHTML = `${PICTO_FORME.cri}<span>Réécouter</span>`;
    b.onclick = () => { arreterFormeAudio(); formeAudio = new Audio(fichierSon(espece)); formeAudio.play().catch(() => {}); };
    cadre.appendChild(b);
  };
}

// ==================================================================
// R170 · PAR LES INDICES — quelques indices, puis la bonne photo parmi 4 (sans nom)
// ==================================================================
function tailleNombre(e) { const q = QUESTIONS.find(x => x.champ === "taille_max_cm"); const v = q && q.valeur(e); return typeof v === "number" ? v : null; }
function indicesDe(e) {
  const l = [];
  const milieu = lireCase(e, "milieu_principal"), trace = traceDe(e), t = typeof tailleRencontre === "function" ? tailleRencontre(e) : null;
  if (milieu) l.push({ etiq: "Où", texte: majuscule(milieu) });
  if (trace) l.push({ etiq: "Indice de présence", texte: majuscule(trace) });
  if (t) l.push({ etiq: "Taille", texte: majuscule(t.texte) });
  return l;   // étape R179 : la silhouette n'est plus montrée d'office (c'est le dernier « Un autre indice »)
}
// QI7 : les indices en plus, révélés un par un par « + Un autre indice » (sans dire lequel) :
// forme du bec (oiseaux), moment d'activité, puis une scène observée sur le terrain (questions insolites) quand elle existe.
function scenePourIndice(e) {
  if (typeof QUESTIONS_INSOLITES === "undefined" || !QUESTIONS_INSOLITES.scenes) return null;
  const c = QUESTIONS_INSOLITES.scenes.find(x => x.type === "qui" && x.espece === e.nom_courant);
  return c ? { etiq: "Scène observée", texte: c.scene, scene: true } : null;
}
// Étape R179 (retour d'Aubin du 09/11 : « un simple Un autre indice, jusqu'à 2 ou 3, toujours sans rien perdre ») :
// au plus 3 indices en plus — 2 parmi forme du bec / du museau, activité, scène, puis toujours la silhouette en dernier.
const INDICES_EN_PLUS_MAX = 3;
// La forme du museau des petits mammifères (colonne museau_forme, liste fermée ; à remplir dans les classeurs) :
// tant que la colonne est vide, pas d'indice.
function museauDe(e) {
  if (e.onglet !== "Mammiferes") return null;
  const v = lireCase(e, "museau_forme");
  return v ? { etiq: "Forme du museau", texte: majuscule(v) } : null;
}
function indicesEnPlus(e) {
  const l = [], bec = becDe(e), act = lireCase(e, "activite"), sc = scenePourIndice(e);
  const museau = typeof museauDe === "function" ? museauDe(e) : null;
  if (bec) l.push({ etiq: "Forme du bec", texte: majuscule(bec) });
  if (museau) l.push(museau);
  if (act && /^(surtout|à|de jour)/i.test(act)) l.push({ etiq: "Activité", texte: majuscule(act) });
  if (sc) l.push(sc);
  const sil = fichierSilhouette(e);
  const autres = l.slice(0, INDICES_EN_PLUS_MAX - (sil ? 1 : 0));
  return sil ? [...autres, { etiq: "Silhouette", image: sil }] : autres;
}
// ---- Étape RF7 (notes n° 13 et 15 ; consigne d'Aubin du 11/11 : « il faut simplement qu'il y ait quelques signes
//   distinctifs par rapport aux autres espèces de l'expédition, et la silhouette doit en faire partie ») ----
//   Les indices montrés d'office : la SILHOUETTE toujours, plus les 3 indices écrits qui la distinguent le mieux des autres
//   espèces de l'expédition (milieu, indice de présence, taille, forme du bec ou du museau, moment d'activité) ;
//   un indice que toutes les autres partagent n'est pas montré d'office. Les autres restent dans « + Un autre indice ».
const INDICES_ECRITS_OFFICE = 3;
function candidatsIndices(e) {
  const l = [], milieu = lireCase(e, "milieu_principal"), trace = traceDe(e), t = typeof tailleRencontre === "function" ? tailleRencontre(e) : null;
  const bec = becDe(e), museau = typeof museauDe === "function" ? museauDe(e) : null, act = lireCase(e, "activite");
  if (milieu) l.push({ etiq: "Où", texte: majuscule(milieu), cle: o => lireCase(o, "milieu_principal") });
  if (trace) l.push({ etiq: "Indice de présence", texte: majuscule(trace), cle: o => simplifier(traceDe(o) || "") });
  if (t) l.push({ etiq: "Taille", texte: majuscule(t.texte), taille: true });
  if (bec) l.push({ etiq: "Forme du bec", texte: majuscule(bec), cle: o => becDe(o) });
  if (museau) l.push({ ...museau, cle: o => { const m = museauDe(o); return m && m.texte; } });
  if (act && /^(surtout|à|de jour)/i.test(act)) l.push({ etiq: "Activité", texte: majuscule(act), cle: o => lireCase(o, "activite") });
  return l;
}
// Combien d'autres espèces de l'expédition cet indice écarte-t-il ?
function forceIndice(e, i, x) {
  const autres = x.liste.filter(o => o !== e);
  if (i.taille) { const a = tailleNombre(e); return a ? autres.filter(o => { const b = tailleNombre(o); return b && Math.max(a, b) / Math.min(a, b) >= 1.6; }).length : 0; }
  const v = i.cle(e);
  return autres.filter(o => { const w = i.cle(o); return w && w !== v; }).length;
}
function indicesDistinctifs(e, x) {
  const notes = candidatsIndices(e).map((i, rang) => ({ i, f: forceIndice(e, i, x), rang }));
  const choisis = notes.filter(n => n.f > 0).sort((a, b) => b.f - a.f || a.rang - b.rang).slice(0, INDICES_ECRITS_OFFICE)
    .sort((a, b) => a.rang - b.rang).map(n => n.i);
  const sil = fichierSilhouette(e);
  return [...(sil ? [{ etiq: "Silhouette", image: sil }] : []), ...choisis];
}
function indicesEnPlusRF7(e, x) {
  const montres = new Set(indicesDistinctifs(e, x).map(i => i.etiq));
  const reste = candidatsIndices(e).filter(i => !montres.has(i.etiq));
  const sc = scenePourIndice(e);
  return [...reste, ...(sc ? [sc] : [])].slice(0, INDICES_EN_PLUS_MAX);
}
// Les 3 autres photos : d'abord des espèces de l'expédition, puis du lieu, puis du territoire (même famille d'abord).
// Chacune doit se distinguer de la bonne par un indice MONTRÉ (milieu, taille nettement différente, indice de présence),
// et ne jamais être un sosie : sinon la question serait injuste.
// Deux espèces se distinguent par un indice MONTRÉ d'office : milieu, taille nettement différente, indice de présence
function seDistingueParIndices(e, o) {
  const milieu = lireCase(e, "milieu_principal"), trace = traceDe(e), taille = tailleNombre(e);
  const mo = lireCase(o, "milieu_principal"), to = tailleNombre(o), tr = traceDe(o);
  if (milieu && mo && mo !== milieu) return true;
  if (taille && to && Math.max(taille, to) / Math.min(taille, to) >= 1.6) return true;
  if (trace && tr && simplifier(tr) !== simplifier(trace)) return true;
  return false;
}
// Étape R179 (retour d'Aubin du 09/11 : « aucune autre espèce de l'expédition ne doit correspondre aux indices », ex. les deux
// musaraignes des « Mammifères du jardin ») : si une autre espèce de l'expédition a les mêmes indices (ou est un sosie),
// la description ne désigne plus une seule espèce : cette espèce-là se découvre de la façon classique.
// « Mêmes indices » = un sosie (groupe « À ne pas confondre ») qu'aucun indice montré d'office ne sépare (même milieu,
// taille voisine, même indice de présence) : deux musaraignes, le mulot et la souris… Une taupe et un hérisson, eux,
// se séparent par la silhouette : pas d'ambiguïté.
function indicesAmbigus(e, x) {
  const sosies = sosiesDe(e);
  return x.liste.some(o => o !== e && sosies.includes(o) && !seDistingueParIndices(e, o));
}
function piegesIndices(e, x) {
  const sosies = sosiesDe(e);
  const differe = o => seDistingueParIndices(e, o);
  // Étape RF7 (note n° 13 d'Aubin : « les écrevisses ont toutes la même silhouette, impossible à trouver ») : on choisit
  //   parmi des PHOTOS ; une fausse photo doit donc se distinguer À L'ŒIL, pas seulement par un indice écrit (le milieu ou
  //   la taille ne se voient pas sur une photo). Jamais une espèce du même ordre (rongeur / rongeur, écrevisse / écrevisse,
  //   passereau / passereau…) ni du même groupe du jeu (« Rongeurs des rivières »…).
  const visible = o => !(e.ordre && o.ordre && o.ordre === e.ordre) && !(e.nom_affichage_groupe && o.nom_affichage_groupe === e.nom_affichage_groupe);
  const ok = o => o !== e && estRenseigne(o.photo) && !sosies.includes(o) && differe(o) && visible(o);
  const lieu = groupeDeLExpedition(x).flatMap(y => y.liste);
  const terr = ESPECES.filter(o => String(o.territoire || "").split(" ; ").includes(x.territoire));
  // D'abord la même famille (expédition, puis lieu, puis territoire) ; une autre famille seulement si elle est dans l'expédition
  const choix = [];
  const memeFamille = [x.liste, lieu, terr].map(g => melanger([...new Set(g)].filter(o => ok(o) && o.onglet === e.onglet)));
  for (const o of [...memeFamille.flat(), ...melanger(x.liste.filter(o => ok(o) && o.onglet !== e.onglet))]) {
    if (choix.length >= 3) break;
    if (!choix.includes(o)) choix.push(o);
  }
  return choix;
}
function htmlIndice(i) {
  return `<li class="fe-indice"><span class="fe-etiq">${echapper(i.etiq)}</span>${i.image
    ? `<img class="fe-silhouette" src="${i.image}" alt="Silhouette de l'espèce">` : `<span class="fe-texte">${echapper(i.texte)}</span>`}</li>`;
}
function poserIndices(espece, x, pieges) {
  const indices = typeof RENCONTRE_COMPLETE !== "undefined" && RENCONTRE_COMPLETE ? indicesDistinctifs(espece, x) : indicesDe(espece);   // RF7
  const enPlus = typeof RENCONTRE_COMPLETE !== "undefined" && RENCONTRE_COMPLETE ? indicesEnPlusRF7(espece, x) : indicesEnPlus(espece);
  const zone = carteForme(espece, "Indices relevés", "Une espèce de l'expédition a laissé ces indices. Lisez-les, puis retrouvez-la parmi 4 photos.", "forme-indices");
  zone.innerHTML = `<ul class="fe-indices" id="fe-indices">${indices.map(htmlIndice).join("")}</ul>
    ${enPlus.length ? `<button type="button" class="fe-plus" id="fe-plus">+ Un autre indice</button>` : ""}
    <button type="button" class="suivant bouton-annonce fe-go" id="fe-go">Identifier l'espèce ▶</button>
    ${enPlus.length ? `<p class="fe-petit">Un indice de plus ne retire rien.</p>` : ""}`;
  const montres = indices.slice();
  if (enPlus.length) document.getElementById("fe-plus").onclick = ev => {
    const i = enPlus.shift();
    document.getElementById("fe-indices").insertAdjacentHTML("beforeend", htmlIndice(i));
    montres.push(i);
    if (!enPlus.length) ev.currentTarget.remove();
  };
  document.getElementById("fe-go").onclick = () => poserChoixIndices(espece, montres, pieges);
}
function poserChoixIndices(espece, montres, pieges) {
  const zone = carteForme(espece, "À quelle espèce correspondent ces indices ?", "", "forme-choix");
  // Étape RF7 (note n° 15 d'Aubin : « pouvoir revoir tous les indices ») : TOUS les indices relevés restent sous la question,
  //   chacun avec son étiquette, la silhouette comprise
  document.getElementById("question").innerHTML = `<ul class="fe-rappels">${montres.map(i => `<li class="fe-rappel${i.scene ? " fe-rappel-scene" : ""}">`
    + `<small>${echapper(i.etiq)}</small>${i.image ? `<img src="${i.image}" alt="Silhouette de l'espèce">` : `<span>${echapper(i.texte)}</span>`}</li>`).join("")}</ul>`;
  const especes = melanger([espece, ...pieges.slice(0, 3)]);
  zone.innerHTML = `<div class="fe-photos">${especes.map((e, i) => `<button type="button" class="fe-photo" data-i="${i}" aria-label="Photo ${i + 1}">${celluleImage(e, true)}</button>`).join("")}</div>`;
  zone.querySelectorAll(".fe-photo").forEach(b => b.onclick = () => {
    if (zone.dataset.repondu) return;
    zone.dataset.repondu = "oui";
    const choisie = especes[Number(b.dataset.i)], juste = choisie === espece;
    zone.querySelectorAll(".fe-photo").forEach(o => { o.disabled = true; if (especes[Number(o.dataset.i)] === espece) o.classList.add("juste"); });
    if (!juste) b.classList.add("fausse");
    try { jouerSon(juste ? "bonne" : "mauvaise"); } catch (err) {}
    const nom = typeof nomAvecArticle === "function" ? nomAvecArticle(espece) : espece.nom_courant;
    const raisons = montres.filter(i => i.texte && i.etiq !== "Où" && !i.scene).map(i => minuscule(i.texte));
    document.getElementById("retour").textContent = juste
      ? `C'est ${nom}.${raisons.length ? ` ${majuscule(raisons.join(" · "))}.` : ""}`
      : `C'était cette photo-ci : ${nom}.${raisons.length ? ` Les indices : ${raisons.join(" · ")}.` : ""}`;
    document.getElementById("nom").textContent = espece.nom_courant;
    const suite = document.createElement("button");
    suite.type = "button"; suite.className = "suivant bouton-annonce fe-go"; suite.textContent = "La découvrir →";
    // Étape R179 (retour d'Aubin du 09/11) : l'ouverture est faite ; la photo (« La reconnaîtriez-vous maintenant ? ») revient
    // à la FIN de la Rencontre, pas juste après (avant : on devinait l'espèce deux fois de suite).
    suite.onclick = () => { suite.remove(); if (session) session.ouvertureFaite = true; enCours = { espece, champ: OUVERTURE, explication: "", q: null, bonne: null }; pasEncoreConnue(); };
    document.getElementById("retour").after(suite);
  });
}

// ==================================================================
// RF4 · LES ENTRÉES, ESPÈCE PAR ESPÈCE (11/11, choix d'Aubin : jumelles et sosie ; critère C1 : deux espèces de suite
//   ne se découvrent pas de la même façon). Entrées possibles : classique, aux jumelles (la photo commence sur sa tête),
//   elle ou son sosie, par le cri, par les indices. La forme de l'expédition reste la préférée quand elle n'a pas servi
//   à l'espèce d'avant ; sinon la moins jouée dans l'expédition. Mémoire de la partie seulement (entreesVues).
// ==================================================================
const entreesVues = {};
function fichierPhoto(e) { return String(e.photo || "").split("/").pop(); }
function sosiePourEntree(e) {
  if (typeof sosiesDe !== "function") return null;
  const c = sosiesDe(e).filter(o => estRenseigne(o.photo) && typeof critereSosie === "function" && critereSosie(e, o));
  return c.find(estIdentifiee) || c[0] || null;
}
function entreesPossibles(e, x) {
  const p = ["classique"];
  if (estRenseigne(e.photo) && typeof CADRAGE !== "undefined" && CADRAGE[fichierPhoto(e)]) p.push("jumelles");
  if (sosiePourEntree(e)) p.push("sosie");
  if (aUnCri(e) && !(sonDemande && !sonActif)) p.push("cri");
  if (aDesIndices(e) && !indicesAmbigus(e, x) && piegesIndices(e, x).length >= 3) p.push("indices");
  return p;
}
function entreeEspece(x, e) {
  const vues = entreesVues[x.id] = entreesVues[x.id] || [];
  const possibles = entreesPossibles(e, x), derniere = vues[vues.length - 1];
  const ok = possibles.filter(f => f !== derniere);
  let f;
  if (!ok.length) f = possibles[0];
  else if (ok.includes(formeEtape1(x))) f = formeEtape1(x);
  else {
    const compte = k => vues.filter(v => v === k).length, min = Math.min(...ok.map(compte));
    f = auHasard(ok.filter(k => compte(k) === min));
  }
  vues.push(f);
  return f;
}
// Aux jumelles (sobre, sans effet de longue-vue) : la question habituelle, la photo d'abord resserrée sur la tête ;
//   « Voir plus large » élargit en deux fois ; la réponse montre la photo entière.
const ZOOMS_JUMELLES = [3, 1.8, 1];
function poserJumelles(espece) {
  session.formeFaite = true;
  poserOuverture(espece);
  const cadre = document.getElementById("photo-rencontre"), c = CADRAGE[fichierPhoto(espece)];
  if (!cadre || !c) return;
  let i = 0;
  cadre.classList.add("jumelles");
  cadre.style.setProperty("--ox", c[0] + "%"); cadre.style.setProperty("--oy", c[1] + "%"); cadre.style.setProperty("--zoom", ZOOMS_JUMELLES[0]);
  const b = document.createElement("button");
  b.type = "button"; b.className = "fe-plus-large"; b.textContent = "Voir plus large";
  b.onclick = ev => { ev.stopPropagation(); i = Math.min(i + 1, ZOOMS_JUMELLES.length - 1); cadre.style.setProperty("--zoom", ZOOMS_JUMELLES[i]); if (i === ZOOMS_JUMELLES.length - 1) b.remove(); };
  cadre.appendChild(b);
}
// Elle ou son sosie : « Laquelle est la mésange nonnette ? » entre elle et son sosie, puis le repère qui les sépare
function poserSosieEntree(espece, autre) {
  const nom = nomAvecArticle(espece);
  const zone = carteForme(espece, "Elle ou son sosie", `Laquelle est ${nom} ?`, "forme-choix");
  session.sosieFait = true;                          // l'encart « À ne pas confondre » ne revient pas plus tard
  const especes = melanger([espece, autre]);
  zone.innerHTML = `<div class="fe-photos">${especes.map((e, i) => `<button type="button" class="fe-photo" data-i="${i}" aria-label="Photo ${i + 1}">${celluleImage(e, true)}</button>`).join("")}</div>`;
  zone.querySelectorAll(".fe-photo").forEach(b => b.onclick = () => {
    if (zone.dataset.repondu) return;
    zone.dataset.repondu = "oui";
    const juste = especes[Number(b.dataset.i)] === espece;
    zone.querySelectorAll(".fe-photo").forEach(o => { o.disabled = true; const e = especes[Number(o.dataset.i)];
      if (e === espece) o.classList.add("juste");
      o.insertAdjacentHTML("beforeend", `<span class="fe-legende">${echapper(e.nom_courant)}</span>`); });
    if (!juste) b.classList.add("fausse");
    try { jouerSon(juste ? "bonne" : "mauvaise"); } catch (err) {}
    const critere = critereSosie(espece, autre);
    document.getElementById("retour").textContent = `${juste ? "Bien vu. " : ""}C'est ${juste ? "elle" : "l'autre photo"} : ${nom}.${critere ? ` Le repère : ${critere}.` : ""}`;
    document.getElementById("nom").textContent = espece.nom_courant;
    const suite = document.createElement("button");
    suite.type = "button"; suite.className = "suivant bouton-annonce fe-go"; suite.textContent = "La découvrir →";
    suite.onclick = () => { suite.remove(); if (session) session.ouvertureFaite = true; enCours = { espece, champ: OUVERTURE, explication: "", q: null, bonne: null }; pasEncoreConnue(); };
    document.getElementById("retour").after(suite);
  });
}

// ==================================================================
// R171 · LA PLANCHE — au début de l'étape 2, relier des phrases aux espèces
// ==================================================================
const PHRASES_PLANCHE = {
  regime_alimentaire_type: v => `Régime : ${minuscule(v)}`,
  activite: v => /^(surtout|à|de jour)/i.test(v) ? `Active ${minuscule(v)}` : null,
  hibernation: v => /^oui/i.test(v) ? "Hiberne" : null,
  deplacement_saisonnier: v => majuscule(v),
  naissance: v => majuscule(v),
  pelage_hiver: v => /change/i.test(v) ? "Change de couleur en hiver" : null,
  milieu_principal: v => `Vit surtout : ${minuscule(v)}`,
  emplacement_nid: v => `Nid : ${minuscule(v)}`,
  saison_reproduction: (v, e) => `${accouplementSeul(e) ? "S'accouple" : "Se reproduit"} ${saisonEnPhrase(v)}`,   // étape R184
  saison_observation: v => `Se croise ${saisonEnPhrase(v)}`,
  defense_principale: v => `Pour se défendre : ${minuscule(v)}`,
  indice_presence: v => `Indice de présence : ${minuscule(v)}`,
  niveau_estran: v => `Sur l'estran : ${minuscule(v)}`,
};
function phrasePlanche(q, v, e) {
  const f = PHRASES_PLANCHE[q.champ];
  if (f) return f(v, e);
  if (!q.libelle) return null;
  return `${String(q.libelle).replace(/\s*\?$/, "")} : ${minuscule(v).replace(" : ", ", ")}`;
}
// Les phrases possibles : une par espèce au plus, vraie pour ELLE SEULE parmi les espèces montrées sur la planche
// (règle de la réciprocité R166 : toutes les autres espèces montrées doivent être des pièges sûrs).
// Une espèce qui rendrait une phrase douteuse n'est simplement pas montrée sur la planche (elle reste dans la suite de l'étape).
// neuves = seulement ce qui n'est pas encore trouvé. Renvoie { phrases, montrees }.
function phrasesPlanche(x, neuves) {
  const toutes = x.liste.filter(e => estRenseigne(e.photo));
  const cands = [];
  for (const e of toutes) {
    if (neuves && (!estIdentifiee(e) || faiteDans(x, e, 2))) continue;
    const possibles = new Set(questionsPossibles(e).map(q => q.champ));
    for (const c of champsEtape(e, 2).filter(c => CHAMPS_MODE_DE_VIE.includes(c) && !CHAMPS_SANS_DUO.includes(c) && (!neuves || nbBonnes(e, c) === 0))) {   // R178 : ni défense ni chasse
      const q = QUESTIONS.find(k => k.champ === c);
      if (!q || q.format || q.type === "nombre" || q.tirer || !possibles.has(c)) continue;
      const bonne = valeurDe(e, q);
      if (!estRenseigne(bonne) || typeof bonne !== "string") continue;
      const texte = phrasePlanche(q, bonne, e);
      if (!texte) continue;
      const surs = new Set(especesPieges(e, q, bonne));
      cands.push({ e, champ: c, q, bonne, texte, conflits: toutes.filter(o => o !== e && (!surs.has(o) || conflitPlanche(c, e, o))), hasard: Math.random() });
    }
  }
  cands.sort((a, b) => a.conflits.length - b.conflits.length || a.hasard - b.hasard);
  const phrases = [], exclues = new Set(), textes = new Set(), faites = new Set();
  for (const p of cands) {
    if (phrases.length >= PHRASES_PLANCHE_MAX) break;
    if (faites.has(p.e) || exclues.has(p.e) || textes.has(p.texte)) continue;
    if (p.conflits.some(o => faites.has(o))) continue;               // elle rendrait douteuse une phrase déjà choisie
    if (toutes.length - exclues.size - p.conflits.filter(o => !exclues.has(o)).length < 4) continue;   // au moins 4 espèces montrées
    phrases.push(p); faites.add(p.e); textes.add(p.texte);
    for (const o of p.conflits) exclues.add(o);
  }
  return { phrases, montrees: toutes.filter(o => !exclues.has(o)) };
}
// Étape R184 (10/11, demande d'Aubin : « chaque phrase ne doit convenir qu'à une seule espèce de la planche ») :
// « Se reproduit au printemps » (un oiseau) se lirait aussi vrai pour un mammifère qui met bas au printemps (la fouine :
// accouplement en été, petits au printemps). La saison de reproduction ne se compare qu'entre espèces de la même famille ;
// une espèce d'une autre famille rend la phrase douteuse et n'est pas montrée.
function conflitPlanche(champ, e, o) {
  if (champ === "saison_reproduction") return o.onglet !== e.onglet && (accouplementSeul(e) || accouplementSeul(o));
  return false;
}
const memoPlanche = new Map();
function formePlanche(x) {
  if (!FORMES_EXPEDITION || !x) return false;
  if (memoPlanche.has(x.id)) return memoPlanche.get(x.id);
  // Une planche de préférence après une expédition sans planche, ou quand l'étape 1 est classique ; et jamais deux
  // expéditions de suite qui se jouent exactement pareil (même étape 1, même étape 2) quand on peut l'éviter.
  let prec = false, combo = "";
  for (const y of groupeDeLExpedition(x)) {
    const possible = y.liste.filter(e => estRenseigne(e.photo)).length >= 4 && phrasesPlanche(y, false).phrases.length >= MIN_ESPECES_FORME;
    const f1 = formeEtape1(y);
    let p = possible && (!prec || f1 === "classique");
    if (f1 + p === combo && (p || possible)) p = !p;
    memoPlanche.set(y.id, p); prec = p; combo = f1 + p;
  }
  return !!memoPlanche.get(x.id);
}
function planchePrete(x) {
  if (!formePlanche(x) || (suivi && suivi.planchesFaites && suivi.planchesFaites[x.id])) return false;
  return phrasesPlanche(x, true).phrases.length >= MIN_ESPECES_FORME;
}
let planche = null;
function fermerEcranForme() {
  const z = document.getElementById("forme-ecran");
  if (z) z.remove();
  planche = null;
}
function ecranForme(x, k) {
  lancementDirect = true;
  montrer("jouer");
  lancementDirect = false;
  for (const id of ["choix-longueur", "carte-rencontre", "fin-defi", "fin-session"]) document.getElementById(id).classList.add("cache");
  majFilExpedition(x, k);
  let z = document.getElementById("forme-ecran");
  if (!z) { z = document.createElement("div"); z.id = "forme-ecran"; document.getElementById("vue-rencontre").appendChild(z); }
  window.scrollTo(0, 0);
  return z;
}
function ouvrirPlancheExp(x) {
  const { phrases, montrees } = phrasesPlanche(x, true);
  if (phrases.length < MIN_ESPECES_FORME) { marquerPlanche(x); lancerExpedition(x, 2); return; }
  ecranForme(x, 2);
  planche = { x, phrases, especes: melanger(montrees), choisie: null, places: {}, rates: [] };
  dessinerPlanche();
}
function marquerPlanche(x) { suivi.planchesFaites = suivi.planchesFaites || {}; suivi.planchesFaites[x.id] = true; sauvegarder(); }
function dessinerPlanche() {
  const z = document.getElementById("forme-ecran"), p = planche;
  if (!z || !p) return;
  const nPlaces = Object.keys(p.places).length, fini = nPlaces >= p.phrases.length;
  z.innerHTML = `<div class="fp-carte">
    <div class="fp-tete"><span class="fp-lib">${PICTO_FORME.planche}La planche · Leur vie</span>
      <h2>Reliez chaque phrase à son espèce</h2><p>${fini ? "Toutes les phrases sont placées." : "Sélectionnez une phrase, puis l'espèce."}</p>
      <span class="fp-compte">${nPlaces} / ${p.phrases.length}</span></div>
    <div class="fp-especes">${p.especes.map(e => {
      const placee = p.phrases.findIndex((f, i) => p.places[i] && f.e === e);
      const f = placee >= 0 ? p.phrases[placee] : null;
      return `<button type="button" class="fp-espece${f ? (p.rates.includes(placee) ? " revue" : " placee") : ""}" data-nom="${echapper(e.nom_courant)}"${fini ? " disabled" : ""}>
        <img src="${photoMini(e.photo)}" alt=""><span class="fp-nom">${echapper(e.nom_courant)}</span>${f ? `<span class="fp-phrase-posee">${echapper(f.texte)}</span>` : ""}</button>`; }).join("")}</div>
    <div class="fp-phrases">${p.phrases.map((f, i) => p.places[i] ? "" : `<button type="button" class="fp-phrase${p.choisie === i ? " choisie" : ""}" data-i="${i}">${echapper(f.texte)}</button>`).join("")}</div>
    <p class="fp-retour" id="fp-retour">${p.retour || ""}</p>
    <div class="fp-pied">${fini ? `<button type="button" class="bouton-accueil principal" id="fp-suite">Continuer l'étape 2 ▶</button>`
      : `<span class="fp-aide">Une phrase mal placée est expliquée ; elle reviendra plus tard dans l'étape.</span>`}</div></div>`;
  z.querySelectorAll(".fp-phrase").forEach(b => b.onclick = () => { p.choisie = Number(b.dataset.i); p.retour = ""; dessinerPlanche(); });
  z.querySelectorAll(".fp-espece").forEach(b => b.onclick = () => placerPhrase(b.dataset.nom));
  const s = document.getElementById("fp-suite");
  if (s) s.onclick = () => { const x = p.x; marquerPlanche(x); fermerEcranForme(); lancerExpedition(x, 2); };
}
function placerPhrase(nom) {
  const p = planche;
  if (!p || p.choisie === null) { if (p) { p.retour = "Sélectionnez d'abord une phrase."; dessinerPlanche(); } return; }
  const i = p.choisie, f = p.phrases[i], e = f.e;
  p.places[i] = true; p.choisie = null;
  if (e.nom_courant === nom) {                     // juste : la chose est trouvée, comme une bonne réponse
    marquerVue(e);
    progression[e.nom_courant].acquis[f.champ] = nbBonnes(e, f.champ) + 1;
    if (typeof noterRevue === "function") noterRevue(e, f.champ);
    if (typeof noterReussite === "function") noterReussite(e, f.champ);
    sauvegarder();
    try { jouerSon("bonne"); } catch (err) {}
    p.retour = `${e.nom_courant} : ${minuscule(f.texte)}. +1 pour sa fiche.`;
  } else {                                         // erreur : expliquée, pas comptée (la question reviendra dans l'étape)
    p.rates.push(i);
    try { jouerSon("mauvaise"); } catch (err) {}
    const ex = f.q.explication ? accordGenre(f.q.explication(e, f.bonne), e) : "";
    p.retour = `C'était ${typeof nomAvecArticle === "function" ? nomAvecArticle(e) : e.nom_courant}. ${ex}`;
  }
  dessinerPlanche();
}

// ==================================================================
// R172 · UN LIEN DU LIEU — en fin d'expédition, une question sur un lien de la finale (deux de ses espèces)
// ==================================================================
function lienPourExpedition(x) {
  if (!FORMES_EXPEDITION || !x || !x.chapitre) return null;
  const c = chapitreParNom(x.territoire, x.chapitre);
  if (!c || !estLieu(c) || finaleFaite(x.territoire, c.nom)) return null;
  const noms = new Set(x.liste.map(e => e.nom_courant)), trouves = liensTrouvesFinale(x.territoire, c.nom);
  return liensDuLieu(x.territoire, c.nom).find(k => k.nature_b === "espece" && noms.has(k.a) && noms.has(k.b) && !trouves.includes(cleLien(k))) || null;
}
// Appelée par finExpedition (17), juste avant le résumé du téléphone : quand l'expédition vient d'être terminée,
// le bouton principal propose d'abord le lien ; après, il reprend son texte et son action.
function proposerLienDuLieu(x, k, info, apres) {
  if (typeof RENCONTRE_COMPLETE !== "undefined" && RENCONTRE_COMPLETE) return;   // étape RF3 : les liens sont dans l'étape 2 « Leurs liens »
  if (k !== 2 || !(apres >= NB_ETAPES && info.avant < NB_ETAPES)) return;
  const lien = lienPourExpedition(x);
  if (!lien) return;
  const bouton = document.getElementById("bouton-rejouer-defi");
  const texte = bouton.textContent, action = bouton.onclick;
  bouton.textContent = "Un lien du lieu ▶";
  bouton.onclick = () => ouvrirLienDuLieu(x, lien, () => {
    bouton.textContent = texte; bouton.onclick = action;
    if (typeof dernierResumeFin !== "undefined" && dernierResumeFin && typeof resumeFinTelephone === "function") resumeFinTelephone(dernierResumeFin);
  });
}
function ouvrirLienDuLieu(x, lien, apres) {
  const z = document.createElement("div");
  z.id = "forme-ecran";
  const ancien = document.getElementById("forme-ecran"); if (ancien) ancien.remove();
  document.getElementById("fin-defi").classList.add("cache");
  const finTel = document.getElementById("resume-fin-defi") || null; if (finTel) finTel.classList.add("cache");
  document.getElementById("vue-rencontre").appendChild(z);
  const a = especeParNom(lien.a), b = especeParNom(lien.b), c = chapitreParNom(x.territoire, x.chapitre);
  const choix = melanger([lien.phrase, ...lien.pieges]);
  const fini = () => {
    z.remove();
    document.getElementById("fin-defi").classList.remove("cache");
    if (finTel) finTel.classList.remove("cache");
    apres();
    window.scrollTo(0, 0);
  };
  z.innerHTML = `<div class="fp-carte fl-carte">
    <div class="fp-tete"><span class="fp-lib">${PICTO_LIENS}Un lien du lieu</span>
      <h2>Deux espèces de cette expédition</h2></div>
    <div class="fl-duo">${[a, b].map(e => `<figure><img src="${photoMini(e.photo)}" alt=""><figcaption>${echapper(e.nom_courant)}</figcaption></figure>`).join('<span class="fl-trait" aria-hidden="true"></span>')}</div>
    <h3 class="fl-question">${echapper(lien.question || "Quel est leur lien ?")}</h3>
    <div class="fl-choix">${choix.map((v, i) => `<button type="button" class="fl-rep" data-i="${i}">${echapper(v)}</button>`).join("")}</div>
    <p class="fp-retour" id="fl-retour"></p>
    <div class="fp-pied"><button type="button" class="bouton-accueil principal cache" id="fl-suite">Continuer</button></div></div>`;
  z.querySelectorAll(".fl-rep").forEach(btn => btn.onclick = () => {
    const juste = choix[Number(btn.dataset.i)] === lien.phrase;
    z.querySelectorAll(".fl-rep").forEach(o => { o.disabled = true; if (choix[Number(o.dataset.i)] === lien.phrase) o.classList.add("juste"); });
    if (!juste) btn.classList.add("fausse");
    try { jouerSon(juste ? "bonne" : "mauvaise"); } catch (err) {}
    const cle = x.territoire + "|" + c.nom, n = liensDuLieu(x.territoire, c.nom).length;
    if (juste) {
      suivi.finalesTrouves = suivi.finalesTrouves || {};
      const l = suivi.finalesTrouves[cle] = suivi.finalesTrouves[cle] || [];
      if (!l.includes(cleLien(lien))) l.push(cleLien(lien));
      sauvegarder();
    }
    const trouves = liensTrouvesFinale(x.territoire, c.nom).length;
    document.getElementById("fl-retour").innerHTML = `${echapper(lien.phrase)}<br><small>${juste
      ? `Compte pour la finale ${echapper(deLieu(c.nom))} : ${trouves} lien${trouves > 1 ? "s" : ""} sur ${n} trouvé${trouves > 1 ? "s" : ""}. Les autres sont dans la finale.`
      : `La finale ${echapper(deLieu(c.nom))} vous le reposera.`}</small>`;
    const s = document.getElementById("fl-suite"); s.classList.remove("cache"); s.onclick = fini; s.focus();
  });
  window.scrollTo(0, 0);
}

// ==================================================================
// RF3 · « LEURS LIENS » (11/11, choix d'Aubin : l'expédition = Rencontres, puis Leurs liens, puis Approfondir)
//   Après les Rencontres, 3 questions au plus sur les liens entre les espèces de l'expédition :
//   1) les liens de la finale du lieu (deux de ses espèces, ou une de ses espèces et un élément du lieu) ;
//   2) « qui mange qui ? » tiré des fiches (prédateurs et proies), quand un nom désigne une seule espèce de
//      l'expédition et que l'inverse n'est pas vrai aussi.
//   Jamais d'échec : une erreur est expliquée. Ces liens NE COMPTENT PAS pour la finale : elle les reposera
//   (une révision, plus tard), et elle garde ainsi toutes ses questions.
// ==================================================================
const LIENS_ETAPE2_MAX = 3;
function sansAccent(t) { return String(t || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/s\b/g, "").trim(); }
function itemsListe(e, c) { return String(e[c + "_items"] || "").split(";").map(t => t.trim()).filter(t => t && !t.startsWith("NA")); }
function especesDuNom(item, liste) {
  const i = sansAccent(item);
  if (i.length < 4) return [];
  return liste.filter(b => { const n = sansAccent(b.nom_courant); return n === i || n.startsWith(i + " "); });
}
function mangeDans(a, b, liste) {   // a mange b, d'après la fiche de b (prédateurs) ou de a (proies)
  const autres = liste.filter(o => o !== a && o !== b);
  const parPred = itemsListe(b, "predateurs").some(it => { const m = especesDuNom(it, [a, ...autres]); return m.length === 1 && m[0] === a; });
  const parProie = itemsListe(a, "proies").some(it => { const m = especesDuNom(it, [b, ...autres]); return m.length === 1 && m[0] === b; });
  return parPred || parProie;
}
const memoLiensExp = new Map();
function candidatsLiens(x) {
  if (memoLiensExp.has(x.id)) return memoLiensExp.get(x.id);
  const liste = x.liste, noms = new Set(liste.map(e => e.nom_courant)), res = [];
  const c = x.chapitre && chapitreParNom(x.territoire, x.chapitre);
  if (c && typeof liensDuLieu === "function")
    for (const k of liensDuLieu(x.territoire, c.nom))
      if (noms.has(k.a) && (k.nature_b !== "espece" || noms.has(k.b)) && k.pieges && k.pieges.length) res.push({ type: "lien", lien: k });
  const deja = new Set(res.filter(r => r.lien.nature_b === "espece").map(r => [r.lien.a, r.lien.b].sort().join("|")));
  for (const a of liste) for (const b of liste) {
    if (a === b || deja.has([a.nom_courant, b.nom_courant].sort().join("|"))) continue;
    if (mangeDans(a, b, liste) && !mangeDans(b, a, liste)) { res.push({ type: "mange", a, b }); deja.add([a.nom_courant, b.nom_courant].sort().join("|")); }
  }
  memoLiensExp.set(x.id, res);
  return res;
}
function liensExpVus(x) { return !!(suivi && suivi.liensExp && suivi.liensExp[x.id]); }
// Rien ne recule : la première fois, les expéditions déjà finies (règle d'avant RF3) sont notées « liens vus »
function migrerLiensRF3() {
  if (!suivi || suivi.liensExpRF3) return;
  suivi.liensExp = suivi.liensExp || {};
  for (const y of EXPEDITIONS) { const x = expeditionParId(y.id); if (x && etapeFinieSansLiens(x, 2)) suivi.liensExp[x.id] = true; }
  suivi.liensExpRF3 = true;
  sauvegarder();
}
function liensOk(x) { migrerLiensRF3(); return liensExpVus(x) || candidatsLiens(x).length === 0; }
let liensExp = null;
function ouvrirLiensExp(x) {
  // les liens de la finale d'abord, puis « qui mange qui » ; on varie les espèces (pas trois fois le brochet)
  const tous = [...melanger(candidatsLiens(x).filter(r => r.type === "lien")), ...melanger(candidatsLiens(x).filter(r => r.type === "mange"))];
  const nomsDe = r => r.type === "lien" ? [r.lien.a, r.lien.nature_b === "espece" ? r.lien.b : null].filter(Boolean) : [r.a.nom_courant, r.b.nom_courant];
  const items = [], vus = new Set();
  for (const passe of [0, 1]) for (const r of tous) {
    if (items.length >= LIENS_ETAPE2_MAX || items.includes(r)) continue;
    if (passe === 0 && nomsDe(r).some(n => vus.has(n))) continue;
    items.push(r); nomsDe(r).forEach(n => vus.add(n));
  }
  if (!items.length) { marquerLiensExp(x); lancerExpedition(x, 2); return; }
  ecranForme(x, 2);
  liensExp = { x, items: melanger(items), i: 0, justes: 0, avantGain: gainExp(x), avant: empreintesExp(x) };
  dessinerLienExp();
}
function marquerLiensExp(x) { suivi.liensExp = suivi.liensExp || {}; suivi.liensExp[x.id] = true; sauvegarder(); }
function deLEspece(e) { const t = nomAvecArticle(e); return /^le /.test(t) ? "du " + t.slice(3) : /^les /.test(t) ? "des " + t.slice(4) : "de " + t; }
function figureLien(e) { return `<figure><img src="${photoMini(photoEsp(e))}" alt=""><figcaption>${echapper(e.nom_courant)}</figcaption></figure>`; }
function figureElement(nom) { const p = photoElement(nom); return `<figure>${p ? `<img src="${p}" alt="">` : `<span class="fl-vide"></span>`}<figcaption>${echapper(nom)}</figcaption></figure>`; }
function dessinerLienExp() {
  const z = document.getElementById("forme-ecran"), L = liensExp;
  if (!z || !L) return;
  const it = L.items[L.i];
  let duo, question, bonne, choix, explication;
  if (it.type === "lien") {
    const k = it.lien, a = especeParNom(k.a);
    duo = k.nature_b === "espece" ? [figureLien(a), figureLien(especeParNom(k.b))] : [figureLien(a), figureElement(k.b)];
    question = k.question || "Quel est leur lien ?";
    bonne = k.nature_b === "espece" ? k.phrase : k.b;
    choix = melanger([bonne, ...k.pieges.slice(0, 2)]);
    explication = k.phrase;
  } else {
    const a = it.a, b = it.b, A = nomAvecArticle(a), B = nomAvecArticle(b);
    duo = [figureLien(a), figureLien(b)];
    question = "Lequel des deux mange l'autre ?";
    bonne = `${majuscule(A)} mange parfois ${B}.`;
    choix = melanger([bonne, `${majuscule(B)} mange parfois ${A}.`]);
    explication = `${majuscule(A)} compte parmi les prédateurs ${deLEspece(b)}.`;
  }
  z.innerHTML = `<div class="fp-carte fl-carte">
    <div class="fp-tete"><span class="fp-lib">${PICTO_LIENS}Leurs liens</span><span class="fp-compte">${L.i + 1} / ${L.items.length}</span></div>
    <div class="fl-duo">${duo.join('<span class="fl-trait" aria-hidden="true"></span>')}</div>
    <h3 class="fl-question">${echapper(question)}</h3>
    <div class="fl-choix">${choix.map((v, i) => `<button type="button" class="fl-rep" data-i="${i}">${echapper(v)}</button>`).join("")}</div>
    <p class="fp-retour" id="fl-retour"></p>
    <div class="fp-pied"><button type="button" class="bouton-accueil principal cache" id="fl-suite">${L.i + 1 < L.items.length ? "Lien suivant" : "Continuer"}</button></div></div>`;
  z.querySelectorAll(".fl-rep").forEach(btn => btn.onclick = () => {
    const juste = choix[Number(btn.dataset.i)] === bonne;
    z.querySelectorAll(".fl-rep").forEach(o => { o.disabled = true; if (choix[Number(o.dataset.i)] === bonne) o.classList.add("juste"); });
    if (!juste) btn.classList.add("fausse");
    try { jouerSon(juste ? "bonne" : "mauvaise"); } catch (err) {}
    if (juste) L.justes++;
    if (typeof noterLienConnu === "function") noterLienConnu(cleLienExp(it));   // étape B1 : badge « Leurs liens »
    document.getElementById("fl-retour").innerHTML = `${juste ? "Bravo ! " : ""}${echapper(explication)}`;
    const s = document.getElementById("fl-suite"); s.classList.remove("cache"); s.focus();
    s.onclick = () => { if (L.i + 1 < L.items.length) { L.i++; dessinerLienExp(); window.scrollTo(0, 0); } else finirLiensExp(); };
  });
  window.scrollTo(0, 0);
}
function finirLiensExp() {
  const L = liensExp, x = L.x;
  marquerLiensExp(x);
  fermerEcranForme(); liensExp = null;
  if (!etapeFinie(x, 2)) { lancerExpedition(x, 2); return; }   // il reste un peu de leur vie : la partie habituelle
  const gagnees = Math.max(0, gainExp(x) - L.avantGain);
  session = null;
  ouvrirExpedition(x);
  if (L.avant < NB_ETAPES) {
    feter({ etiquette: `Expédition · ${x.titre}`, titre: "Expédition terminée !", detail: `${L.justes} lien${L.justes > 1 ? "s" : ""} sur ${L.items.length} trouvé${L.justes > 1 ? "s" : ""}${gagnees ? ` · +${gagnees} empreintes` : ""}`,
            son: "badge", visuel: `<div class="fete-visuel rang exp-fete">${PAS_SVG}</div>` });
    if (gagnees) verifierOuverture();
  }
}

// ==================================================================
// R173 · LA RÉVISION GROUPÉE (08/11, choix d'Aubin « on commence par 2 et 3 »)
//    Les espèces déjà connues ailleurs ne repassent plus une par une (« Quelle est cette espèce ? » sur la même photo) :
//    elles sont revues ensemble, dans un seul « Qui est qui ? » (4 au plus par écran). Critère : plus rapide, sans perdre
//    la valeur de la révision — une espèce sur laquelle on s'est trompé n'est pas comptée et reviendra.
//    Une seule espèce à revoir : l'ancienne question sur sa photo.
// ==================================================================
const REVUE_GROUPEE = true;
const REVUE_MAX = 4;
function aRevoirAvecPhoto(x) { return especesARevoirIci(x).filter(e => estRenseigne(e.photo)); }
function revueGroupeePossible(x) { return FORMES_EXPEDITION && REVUE_GROUPEE && aRevoirAvecPhoto(x).length >= 2; }
let revue = null;
function ouvrirRevueGroupee(x) {
  const especes = aRevoirAvecPhoto(x).slice(0, REVUE_MAX);
  lancementDirect = true; montrer("jouer"); lancementDirect = false;
  for (const id of ["choix-longueur", "carte-rencontre", "fin-defi", "fin-session"]) document.getElementById(id).classList.add("cache");
  majFilExpedition(x, 1);
  let z = document.getElementById("intermede-exp");
  if (!z) { z = document.createElement("div"); z.id = "intermede-exp"; document.getElementById("vue-rencontre").appendChild(z); }
  revue = { x, especes, choix: null, reste: especes.length, ratees: new Set(), avantGain: gainExp(x), avantFinie: etapeFinie(x, 1) };
  dessinerRevueGroupee();
  window.scrollTo(0, 0);
}
function dessinerRevueGroupee() {
  const z = document.getElementById("intermede-exp"), rv = revue;
  if (!z || !rv) return;
  const photos = melanger(rv.especes.slice()), noms = melanger(rv.especes.slice());
  const n = rv.especes.length;
  z.innerHTML = `<div class="im-carte"><div class="im-tete"><span class="im-lib">Révision</span><h2>Déjà rencontrées ailleurs</h2>
      <p>Vous connaissez déjà ${n === 2 ? "ces deux espèces" : `ces ${n} espèces`}. Sélectionnez un nom puis sa photo, ou une photo puis son nom.</p></div>
    <div class="im-photos">${photos.map(e => `<button type="button" class="im-photo" data-i="${rv.especes.indexOf(e)}">
        <img src="${photoMini(e.photo)}" alt=""><span class="im-etiquette"></span></button>`).join("")}</div>
    <div class="im-noms">${noms.map(e => `<button type="button" class="im-nom" data-i="${rv.especes.indexOf(e)}">${echapper(e.nom_courant)}</button>`).join("")}</div>
    <p class="im-retour" id="im-retour"></p></div>`;
  const retour = document.getElementById("im-retour");
  const marquer = () => {
    z.querySelectorAll(".im-nom").forEach(o => o.classList.toggle("choisi", !!rv.choix && rv.choix.sorte === "nom" && Number(o.dataset.i) === rv.choix.i));
    z.querySelectorAll(".im-photo").forEach(o => o.classList.toggle("choisi", !!rv.choix && rv.choix.sorte === "photo" && Number(o.dataset.i) === rv.choix.i));
  };
  const associer = (iNom, iPhoto) => {
    const ph = z.querySelector(`.im-photo[data-i="${iPhoto}"]`), e = rv.especes[iNom];
    rv.choix = null; marquer();
    if (iNom === iPhoto) {
      ph.classList.add("juste"); ph.querySelector(".im-etiquette").textContent = e.nom_courant;
      const b = z.querySelector(`.im-nom[data-i="${iNom}"]`); b.disabled = true; b.classList.add("place");
      rv.reste--; retour.textContent = "";
      try { jouerSon("bonne"); } catch (err) {}
      if (rv.reste === 0) setTimeout(() => { if (revue === rv) finirRevueGroupee(); }, 700);
    } else {
      // l'erreur porte sur les deux espèces confondues : aucune n'est comptée cette fois
      rv.ratees.add(rv.especes[iNom]); rv.ratees.add(rv.especes[iPhoto]);
      ph.classList.remove("non"); void ph.offsetWidth; ph.classList.add("non");
      try { jouerSon("mauvaise"); } catch (err) {}
      retour.textContent = `Ce n'est pas la bonne paire : « ${e.nom_courant} » va avec une autre photo.`;
    }
  };
  z.querySelectorAll(".im-nom").forEach(b => b.onclick = () => {
    if (b.disabled) return;
    const i = Number(b.dataset.i); retour.textContent = "";
    if (rv.choix && rv.choix.sorte === "photo") { associer(i, rv.choix.i); return; }
    rv.choix = rv.choix && rv.choix.sorte === "nom" && rv.choix.i === i ? null : { sorte: "nom", i }; marquer();
  });
  z.querySelectorAll(".im-photo").forEach(ph => ph.onclick = () => {
    if (ph.classList.contains("juste")) return;
    const i = Number(ph.dataset.i); retour.textContent = "";
    if (rv.choix && rv.choix.sorte === "nom") { associer(rv.choix.i, i); return; }
    rv.choix = rv.choix && rv.choix.sorte === "photo" && rv.choix.i === i ? null : { sorte: "photo", i }; marquer();
  });
}
function finirRevueGroupee() {
  const rv = revue, x = rv.x, z = document.getElementById("intermede-exp");
  const justes = rv.especes.filter(e => !rv.ratees.has(e));
  for (const e of justes) {                      // comme une photo reconnue en révision (étape 316) : comptée ici, +1 pour la photo
    marquerVue(e);
    progression[e.nom_courant].acquis[IDENTIFICATION] = nbBonnes(e, IDENTIFICATION) + 1;
    if (typeof noterRevue === "function") noterRevue(e, IDENTIFICATION);
    marquerRevue(x.id, e);
  }
  sauvegarder();
  majBandeExpedition(x);
  const gagnees = Math.max(0, gainExp(x) - rv.avantGain), n = rv.ratees.size;
  // Étape R184 (demande d'Aubin) : les espèces confondues sont reposées tout de suite, une par une (« Vous arrivez à la
  // reconnaître maintenant ? ») ; ratées encore, elles comptent quand même ici (leur photo reviendra dans les prochaines parties).
  const confondues = rv.especes.filter(e => rv.ratees.has(e) && especesARevoirIci(x).includes(e));
  const suite = confondues.length ? (confondues.length > 1 ? "Les reconnaître maintenant ▶" : "La reconnaître maintenant ▶")
              : !etapeFinie(x, 1) ? "Continuer ▶" : "Voir l'expédition";   // étape R182 : une étape finie ramène à l'expédition
  z.innerHTML = `<div class="im-carte"><div class="im-tete"><span class="im-lib">Révision</span>
      <h2>${justes.length === rv.especes.length ? "Toutes retrouvées" : `${justes.length} sur ${rv.especes.length} retrouvée${justes.length > 1 ? "s" : ""}`}</h2>
      <p>${n ? `${n === 1 ? "L'espèce confondue revient tout de suite" : `Les ${n} espèces confondues reviennent tout de suite`}, une par une.` : "Elles comptent pour cette expédition."}${gagnees ? ` +${gagnees} empreinte${gagnees > 1 ? "s" : ""}` : ""}</p></div>
    <div class="im-photos petit">${rv.especes.map(e => `<span class="im-photo${rv.ratees.has(e) ? "" : " juste"}"><img src="${photoMini(e.photo)}" alt=""><span class="im-etiquette">${echapper(e.nom_courant)}</span></span>`).join("")}</div>
    <div class="im-pied"><button class="bouton-accueil principal" id="im-suite">${suite}</button></div></div>`;
  document.getElementById("im-suite").onclick = () => { revue = null; fermerIntermede();
    if (confondues.length) { session = null; lancerRevueExpedition(x, confondues); return; }   // étape R184
    if (etapeFinie(x, 1)) { session = null; ouvrirExpedition(x); } else lancerExpedition(x, 1); };
  if (etapeFinie(x, 1) && !rv.avantFinie) {
    feter({ etiquette: `Expédition · ${x.titre}`, titre: "Étape 1 réussie", detail: `Prochaine étape : leur vie (+${GAIN_FIN_EXPEDITION} empreintes à la clé).`,
            son: "badge", visuel: `<div class="fete-visuel rang exp-fete">${PAS_SVG}</div>` });
  }
  if (gagnees) verifierOuverture();
}

// ==================================================================
// R174 · COMPARER DANS APPROFONDIR (08/11) — « Laquelle est la plus lourde ? » entre deux espèces de l'expédition
//    Pour les mesures (taille, envergure, poids, longévité), Approfondir peut poser, au hasard avec l'estimation,
//    une comparaison entre l'espèce et une autre espèce de la même famille de l'expédition, nettement différente
//    (au moins 1,5 fois). L'explication donne les deux chiffres et l'écart. Bonne réponse = la mesure est trouvée.
// ==================================================================
const COMPARAISONS = {
  taille_max_cm: ["Laquelle est la plus grande ?", "Laquelle est la plus petite ?"],
  envergure_max_cm: ["Laquelle a la plus grande envergure ?", "Laquelle a la plus petite envergure ?"],
  poids_max_kg: ["Laquelle est la plus lourde ?", "Laquelle est la plus légère ?"],
  longevite_max_annees: ["Laquelle peut vivre le plus longtemps ?", "Laquelle vit le moins longtemps ?"],
};
const ECART_COMPARAISON = 1.5;
function valeurMesure(e, q) { const v = q && q.valeur ? q.valeur(e) : valeurDe(e, q); return typeof v === "number" && v > 0 ? v : null; }
function autresComparables(espece, q) {
  if (!defi || !defi.expedition || defi.expedition.etape !== 4 || !COMPARAISONS[q.champ]) return [];
  const v = valeurMesure(espece, q);
  if (!v || !estRenseigne(espece.photo)) return [];
  const deja = defi.duos || [];
  return defi.especes.filter(o => o !== espece && o.onglet === espece.onglet && estIdentifiee(o) && estRenseigne(o.photo)
    && !deja.includes([espece.nom_courant, o.nom_courant].sort().join("|"))
    && valeurMesure(o, q) && Math.max(v, valeurMesure(o, q)) / Math.min(v, valeurMesure(o, q)) >= ECART_COMPARAISON
    && sansChevauchement(espece, o, q));
}
// Les fourchettes ne se chevauchent pas : le plus petit de la grande espèce dépasse le plus grand de la petite
// (sinon « la plus lourde » pourrait être à moitié vrai)
function fourchetteMesure(e, q) { const f = q.fourchette ? q.fourchette(e) : null, v = valeurMesure(e, q); return f && f[0] > 0 && f[0] <= f[1] ? f : [v, v]; }
function sansChevauchement(a, b, q) {
  const fa = fourchetteMesure(a, q), fb = fourchetteMesure(b, q);
  return fa[0] > fb[1] || fb[0] > fa[1];
}
// Appelée par poserQuestion (03) pour une question chiffrée : "compare" une fois sur deux quand c'est possible
function formatComparaison(espece, q) {
  if (!FORMES_EXPEDITION || dernierFormat === "compare") return null;
  return autresComparables(espece, q).length && Math.random() < 0.5 ? "compare" : null;
}
function texteMesure(e, q) {
  if (q.champ === "taille_max_cm" && typeof tailleRencontre === "function") { const t = tailleRencontre(e); if (t) return t.texte; }
  if (q.champ === "poids_max_kg" && typeof poidsRencontre === "function") { const p = poidsRencontre(e); if (p) return p.texte; }
  const v = valeurMesure(e, q);
  if (q.champ === "longevite_max_annees") return `jusqu'à ${nombre(v)} ans`;
  if (q.champ === "envergure_max_cm") return `jusqu'à ${nombre(v)} cm d'envergure`;
  return nombre(v);
}
function poserComparaison(espece, q) {
  const autre = auHasard(autresComparables(espece, q));
  if (defi) { defi.duos = defi.duos || []; defi.duos.push([espece.nom_courant, autre.nom_courant].sort().join("|")); }
  const va = valeurMesure(espece, q), vb = valeurMesure(autre, q), plus = va > vb;
  enTete(espece, false, false, q.libelle || "Comparer");   // « Longévité », « Poids »… (la question dit déjà « Laquelle »)
  document.getElementById("question").textContent = COMPARAISONS[q.champ][plus ? 0 : 1];
  const zone = document.getElementById("reponses");
  zone.className = "grille-photos duo-exp";
  for (const e of melanger([espece, autre])) {
    const b = document.createElement("button");
    b.className = "reponse choix-photo";
    b.innerHTML = `<div class="photo">${celluleImage(e, true)}</div><div class="legende">${e.nom_courant}</div>`;
    if (e === espece) b.dataset.juste = "oui";
    b.onclick = () => repondre(b, e === espece);
    zone.appendChild(b);
  }
  const r = Math.max(va, vb) / Math.min(va, vb);
  const ecart = r >= 1.8 ? `environ ${nombre(Math.round(r * 2) / 2)} fois plus` : "nettement plus";
  enCours.explication = `${espece.nom_courant} : ${texteMesure(espece, q)} ; ${autre.nom_courant} : ${texteMesure(autre, q)} — ${ecart}.`;
}
