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
// Le jeu a son écran (#vue-defiexp) et son état (defiExp) : il ne passe pas par les défis classiques (07).
// Sauvegarde : suivi.reconnuesDefi (espèces reconnues par un défi : leur étape 1 compte comme faite, voir especeFaite, 17),
//              suivi.defisExp[id] = { joues, reussi, meilleur, dernier: { bons, total } }.
const DEFI_PAR_ESPECE = 2;          // questions par espèce (choix d'Aubin du 16/11)
const DEFI_ERREURS_PERMISES = 2;    // réussi avec 2 erreurs au plus
const SUJETS_SANS_DEFI = ["larve", "chenille"];   // stades trop difficiles à reconnaître (note 6)
let defiExp = null;                 // le défi en cours

function especesReconnuesDefi() { return (suivi && suivi.reconnuesDefi) || []; }
function reconnueParDefi(e) { return especesReconnuesDefi().includes(e.nom_courant); }
function etatDefiExp(x) { return (suivi && suivi.defisExp && suivi.defisExp[x.id]) || null; }

// Les photos possibles d'une espèce pour le défi : la principale et les autres formes (pas larve ni chenille)
function photosDefi(e) { return photosJeu(e); }   // R234 : règle commune (02), têtards d'amphibiens « jeune » compris
// Le pool des pièges : les espèces du territoire de l'expédition (comme Coup d'œil), avec une photo
function poolDefi(x) { return ESPECES.filter(e => territoiresJeu(e).includes(x.territoire) && estRenseigne(e.photo)); }
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
function ordreDefi(x) {
  const tours = [];
  for (let k = 0; k < DEFI_PAR_ESPECE; k++) tours.push(...melanger(x.liste.slice()));
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

function lancerDefiExp(x) {
  if (!x) return;
  if (typeof estOuverte === "function" && !estOuverte(x)) { afficherBulle("Cette expédition s'ouvrira en avançant sur le chemin"); return; }
  suivi.derniereExpedition = suivi.derniereExpedition || {};
  suivi.derniereExpedition[x.territoire] = x.id;
  suivi.expLancees = suivi.expLancees || {};          // l'expédition compte comme commencée (ses empreintes en dépendent)
  suivi.expLancees[x.id] = true;
  if (x.chapitre) { suivi.chapitreCourant = suivi.chapitreCourant || {}; suivi.chapitreCourant[x.territoire] = x.chapitre; }
  sauvegarder();
  const pool = poolDefi(x);
  const vues = {};
  const questions = ordreDefi(x).map(e => {
    const deja = vues[e.nom_courant] || [];
    // 1re question : la photo principale ; 2e : une autre forme si l'espèce en a une, sinon une autre vue, sinon la même
    const ph = photosDefi(e);
    let photo = deja.length ? (ph.find(p => !deja.includes(p.src) && etiquetteForme(p.sujet)) || ph.find(p => !deja.includes(p.src)) || ph[0]) : ph[0];
    if (photo) vues[e.nom_courant] = [...deja, photo.src];
    const noms = melanger([e, ...piegesCoupDoeil(e, pool)]);
    return { espece: e, photo: photo || null, noms, choix: null, retires: [] };
  });
  defiExp = { x, questions, i: 0, aides: { retirer: true, silhouettes: true }, silhouettesVisibles: false,
              avantGain: gainExp(x), avantEtapes: empreintesExp(x), dejaReconnues: new Set(x.liste.filter(estReconnue).map(e => e.nom_courant)) };
  montrer("defiexp");
  afficherQuestionDefiExp();
}

// Le haut de l'écran : « Quitter », l'expédition, « 5 / 14 », puis la barre (une case par question)
function enteteDefiExp() {
  const d = defiExp;
  const cases = d.questions.map((q, k) => `<i class="${q.choix ? (q.choix === q.espece ? "ok" : "ko") : k === d.i ? "cur" : ""}"></i>`).join("");
  return `<div class="dfx-haut"><button class="cdo-quitter" id="dfx-quitter">Quitter</button>
      <span class="cdo-titre">Me tester · ${echapper(d.x.titre)}</span><span class="dfx-compte">${Math.min(d.i + 1, d.questions.length)} / ${d.questions.length}</span></div>
    <div class="dfx-barre" style="grid-template-columns:repeat(${d.questions.length},1fr)">${cases}</div>`;
}
function imageQuestionDefi(q) {
  if (q.photo) return imagePhoto(q.photo.src, "Photo à reconnaître", false);
  return celluleImage(q.espece, false);   // sans photo libre : la silhouette, « photo à venir »
}
function afficherQuestionDefiExp() {
  const d = defiExp, q = d.questions[d.i];
  const zone = document.getElementById("vue-defiexp");
  const etiquette = q.photo ? etiquetteForme(q.photo.sujet) : "";
  zone.innerHTML = `<div class="cdo dfx">${enteteDefiExp()}
      <div class="cdo-photo">${imageQuestionDefi(q)}${etiquette ? `<small class="cdo-forme">${echapper(etiquette.replace(/^(La|Le|L')\s?/, "").replace(/^./, c => c.toUpperCase()))}</small>` : ""}</div>
      <p class="cdo-q">Quelle est cette espèce ?</p>
      <div class="cdo-noms">${q.noms.map((e, k) => boutonNomDefi(e, k, q)).join("")}</div>
      <div class="cdo-retour" id="dfx-retour"></div>
      <div class="dfx-aides" id="dfx-aides"><small>Vos aides</small>
        <button class="cdo-second" id="dfx-retirer"${d.aides.retirer ? "" : " disabled"}>Retirer deux réponses</button>
        <button class="cdo-second" id="dfx-silh"${d.aides.silhouettes ? "" : " disabled"}>Voir les silhouettes</button></div>
    </div>`;
  zone.querySelectorAll(".cdo-nom").forEach(b => b.onclick = () => repondreDefiExp(q.noms[+b.dataset.k], b));
  document.getElementById("dfx-quitter").onclick = ouvrirQuitterDefiExp;
  document.getElementById("dfx-retirer").onclick = () => aideRetirer(q);
  document.getElementById("dfx-silh").onclick = () => aideSilhouettes();
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
  if (!d.aides.silhouettes || d.questions[d.i].choix) return;
  d.aides.silhouettes = false; d.silhouettesVisibles = true;
  afficherQuestionDefiExp();
}

function repondreDefiExp(choisie, bouton) {
  const d = defiExp, q = d.questions[d.i];
  if (!d || q.choix) return;
  q.choix = choisie;
  const juste = choisie === q.espece;
  const zone = document.getElementById("vue-defiexp");
  zone.querySelectorAll(".cdo-nom").forEach((b, k) => {
    b.disabled = true;
    if (q.noms[k] === q.espece) b.classList.add("bon");
    else if (b === bouton) b.classList.add("faux");
  });
  // Une espèce déjà reconnue avant le défi : la réponse compte pour elle, comme dans Coup d'œil (les autres attendent la fin)
  if (d.dejaReconnues.has(q.espece.nom_courant)) { if (juste) acquerir(q.espece, IDENTIFICATION); else noterEchec(q.espece, IDENTIFICATION); }
  else if (!juste && typeof noterEchec === "function") noterEchec(q.espece, IDENTIFICATION);   // pour la coriace des prochains défis
  sauvegarder();
  d.silhouettesVisibles = false;
  const aides = document.getElementById("dfx-aides");
  if (aides) aides.remove();
  const fin = d.i >= d.questions.length - 1;
  const suivant = `<button class="cdo-suivant" id="dfx-suivant">${fin ? "Voir le résultat" : "Question suivante"}</button>`;
  const retour = document.getElementById("dfx-retour");
  if (juste) retour.innerHTML = `<p class="cdo-bravo">${echapper(q.espece.nom_courant)}</p>${suivant}`;
  else retour.innerHTML = `${erreurCoteACote(q.espece, choisie, q.photo && q.photo.sujet)}${suivant}`;
  zone.querySelector(".dfx-barre").outerHTML = enteteDefiExp().match(/<div class="dfx-barre"[^>]*>.*<\/div>$/s)[0];
  document.getElementById("dfx-suivant").onclick = () => { if (fin) finDefiExp(); else { d.i++; afficherQuestionDefiExp(); } };
  const btn = document.getElementById("dfx-suivant"), r = btn.getBoundingClientRect();
  montrerSuiteJeu(btn, r);   // R234 (notes 15-16) : bouton fixé en bas sur téléphone, un seul défilement doux vers l'explication
  zone.querySelector(".cdo-photo").onclick = () => document.getElementById("dfx-suivant").click();
}

// L'erreur expliquée, côte à côte (choix d'Aubin 2A) : votre choix, la bonne réponse, puis ce qui les sépare
function erreurCoteACote(bonne, choisie, sujet) {
  const s = separeEntre(bonne, choisie, sujet);
  const ligne = (e, rp, cls) => `<li><i class="${cls}"></i><span><b>${echapper(majuscule(nomCourt(e)))} :</b> ${echapper(minusculeTexte(rp.texte))}</span></li>`;
  const bloc = s ? `<div class="dfx-separe"><small>${s.titre}</small>${s.critere ? `<p>${echapper(majuscule(s.critere))}</p>`
      : `<ul>${ligne(bonne, s.bonne, "ok")}${s.choisie ? ligne(choisie, s.choisie, "ko") : ""}</ul>`}</div>` : "";
  return `<div class="dfx-erreur"><small class="dfx-pas">Pas cette fois</small><b class="dfx-cetait">C'était ${echapper(nomAvecArticle(bonne))}</b>
      <div class="dfx-duo"><figure class="ko"><figcaption>Votre choix</figcaption>${celluleImage(choisie, true)}<span>${echapper(choisie.nom_courant)}</span></figure>`
    + `<figure class="ok"><figcaption>La bonne réponse</figcaption>${q2Image(bonne, sujet)}<span>${echapper(bonne.nom_courant)}</span></figure></div>${bloc}</div>`;
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
function separeEntre(bonne, choisie, sujet) {
  const rb = typeof reperesDe === "function" ? reperesDe(bonne) : null, rc = typeof reperesDe === "function" ? reperesDe(choisie) : null;
  const lb = rb ? reperesPourForme(rb, formePourPhoto(rb, sujet || "")) : [];
  const lc = rc ? reperesPourForme(rc, formePourPhoto(rc, "")) : [];
  const different = (a, b) => typeof reperesDifferent === "function" ? reperesDifferent(a.texte, b.texte) : a.texte !== b.texte;
  for (const x of lb) {
    if (!x.partie || x.partie === "NA") continue;
    const y = lc.find(z => z.partie === x.partie);
    if (y && different(x, y)) return { titre: "Ce qui les sépare", bonne: x, choisie: y };
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
  return d.x.liste.filter(e => reussi || (c.get(e).poses >= DEFI_PAR_ESPECE && c.get(e).bons === c.get(e).poses));
}

function finDefiExp() {
  const d = defiExp, x = d.x;
  const total = d.questions.length, bons = d.questions.filter(q => q.choix === q.espece).length;
  const reussi = total - bons <= DEFI_ERREURS_PERMISES;
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
        <p class="cdo-sous">${bons} bonnes réponses sur ${total}</p>
        <div class="dfx-ronds">${x.liste.map(vignette).join("")}</div>
        <ul class="dfx-lignes">
          <li>Les ${x.liste.length} espèces sont <b>reconnues</b>.</li>
          <li>${empreintes ? `+${empreintes} empreinte${empreintes > 1 ? "s" : ""} : celles de l'étape 1.` : "Vos empreintes de l'étape 1 étaient déjà gagnées."}</li>
          ${ensuite ? `<li>Pour les <b>comprendre</b> : l'étape Ensemble, comment elles vivent ici.</li>` : ""}
        </ul>
        ${ensuite ? `<button class="cdo-suivant" id="dfx-etape2">Étape 2 · Ensemble</button>` : ""}
        <button class="${ensuite ? "cdo-second" : "cdo-suivant"}" id="dfx-voir">Voir l'expédition</button>
      </div>`;
    const b2 = document.getElementById("dfx-etape2");
    if (b2) b2.onclick = () => { defiExp = null; lancerExpedition(x, 2); };
  } else {
    const gardees = x.liste.filter(e => faiteDans(x, e, 1));
    const repere = e => { const r = typeof reperesDe === "function" ? reperesDe(e) : null; const q = d.questions.find(z => z.espece === e && z.choix !== e);
      const l = r ? reperesPourForme(r, formePourPhoto(r, (q && q.photo && q.photo.sujet) || "")) : [];
      const forme = q && q.photo && etiquetteForme(q.photo.sujet);
      return l.length ? `${forme ? `${forme} : ` : ""}${forme ? minusculeTexte(l[0].texte) : l[0].texte}` : ""; };
    const n = aRevoir.length;
    zone.innerHTML = `<div class="cdo dfx dfx-fin">
        <h2>${total - bons <= DEFI_ERREURS_PERMISES + 2 ? "Presque" : "Pas encore"}</h2>
        <p class="cdo-sous">${bons} bonnes réponses sur ${total} · il en faut ${total - DEFI_ERREURS_PERMISES}</p>
        ${gardees.length ? `<div class="dfx-groupe ok"><small>Reconnues · gardées</small><div class="dfx-pastilles">${gardees.map(e => `<span>${vignette(e)}${echapper(e.nom_courant)}</span>`).join("")}</div></div>` : ""}
        ${n ? `<div class="dfx-groupe"><small>À revoir</small><ul class="dfx-revoir">${aRevoir.map(e => `<li>${vignette(e)}<span><b>${echapper(e.nom_courant)}</b>${repere(e) ? `<small>${echapper(repere(e))}</small>` : ""}</span></li>`).join("")}</ul></div>` : ""}
        <p class="dfx-deux">Deux façons de finir l'expédition :</p>
        <div class="dfx-boutons"><button class="cdo-second" id="dfx-decouvrir">Découvrir ${n > 1 ? `les ${n}` : "la dernière"}</button><button class="cdo-suivant" id="dfx-rejouer">Rejouer le défi</button></div>
        <button class="dfx-lien" id="dfx-voir">Plus tard · voir l'expédition</button>
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

// Quitter en cours de route (choix d'Aubin du 16/11 : changer de porte sans rien perdre) : ce qui est réussi 2 fois sur 2 est gardé
function ouvrirQuitterDefiExp() {
  const d = defiExp, x = d.x;
  const k = d.questions.findIndex(q => !q.choix);
  const fait = k < 0 ? d.questions.length : k;
  const gardees = especesGagneesDefi(d, false, fait);
  const deja = x.liste.filter(e => faiteDans(x, e, 1));
  const garde = [...new Set([...deja, ...gardees])];
  const reste = x.liste.length - garde.length;
  const voile = document.createElement("div");
  voile.className = "dfx-voile";
  voile.innerHTML = `<div class="dfx-feuille" role="dialog" aria-label="Quitter le défi"><h2>Quitter le défi ?</h2>
      ${garde.length ? `<p>Vous gardez ce que vous avez déjà réussi :</p><div class="dfx-pastilles">${garde.map(e => `<span><img src="${photoMini(photoEsp(e))}" alt="">${echapper(e.nom_courant)} · reconnue</span>`).join("")}</div>`
        : `<p>Rien n'est encore réussi 2 fois sur 2 dans ce défi.</p>`}
      <small>Un prochain défi repartira de la première question.</small>
      ${reste ? `<button class="cdo-suivant" id="dfx-q-decouvrir">Découvrir plutôt ${reste > 1 ? `les ${reste} autres` : "la dernière"}</button>` : ""}
      <button class="cdo-second" id="dfx-q-continuer">Continuer le défi</button>
      <button class="dfx-lien" id="dfx-q-exp">Revenir à l'expédition</button></div>`;
  document.body.appendChild(voile);
  const fermer = () => voile.remove();
  const garder = () => { if (gardees.length) reconnaitreParDefi(x, gardees); };
  voile.onclick = ev => { if (ev.target === voile) fermer(); };
  document.getElementById("dfx-q-continuer").onclick = fermer;
  document.getElementById("dfx-q-exp").onclick = () => { fermer(); garder(); defiExp = null; ouvrirExpedition(x); };
  const dec = document.getElementById("dfx-q-decouvrir");
  if (dec) dec.onclick = () => { fermer(); garder(); defiExp = null; lancerExpedition(x, 1); };
}

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
function minutesDefi(n) { return Math.max(3, Math.round(n * DEFI_PAR_ESPECE * 0.25)); }
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
  if (st && st.dernier && !st.reussi) {     // après un défi pas réussi
    return `<div class="dfx-portes"><div class="etiq-jeu">Étape 1 · Reconnaître</div>
        <p class="dfx-bandeau">Dernier défi : <b>${st.dernier.bons} sur ${st.dernier.total}</b>.${av.faites ? ` ${av.faites} espèce${av.faites > 1 ? "s sont" : " est"} déjà reconnue${av.faites > 1 ? "s" : ""} ;` : ""} il en reste ${reste}. Continuez comme vous préférez.</p>
        <div class="dfx-deux-portes">${porteDecouvrir("Découvrir", `Rencontrer ${reste > 1 ? `les ${reste} espèces` : "l'espèce"} à revoir.`, `Environ ${minutesRencontres(reste)} min`)}
          ${porteTester("Me tester", `Rejouer le défi sur les ${n} espèces.`, `Environ ${minutesDefi(n)} min`)}</div>${gain}</div>`;
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
        ${porteTester("Me tester", `${n * DEFI_PAR_ESPECE} questions, ${DEFI_ERREURS_PERMISES} erreurs permises. Chaque erreur est expliquée.`, `Environ ${minutesDefi(n)} min · 2 aides`)}</div>${gain}</div>`;
}
function brancherPortes(zone, x) {
  zone.querySelectorAll("[data-porte]").forEach(b => b.onclick = () => b.dataset.porte === "tester" ? lancerDefiExp(x) : lancerExpedition(x, 1));
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
