// 16_arcade.js — Étape 262 (24/10/2026, retours « Revoir 3 ») : l'Arcade, dans l'onglet « Plus de jeux ».
// Une partie du programme du jeu, chargée par jeu.html dans l'ordre (avant 13_demarrage.js).
//
// • Un espace à part, bien séparé du reste du jeu (fond sombre « salle de jeux ») : seulement les jeux alternatifs,
//   Duel, Espèce mystère et Portrait-robot. Rencontre et « Jouer » n'y sont plus (ils sont sur la page du territoire).
// • Un jeu = une grande carte avec sa règle en une phrase, son record et un bouton « Jouer » : un seul clic pour lancer.
// • Les espèces utilisées : par défaut le territoire où l'on est, toutes ses familles. On peut changer, dans un
//   volet replié sous les jeux (plusieurs territoires, certaines familles). Le choix est gardé à part
//   (suivi.territoiresLibres, suivi.famillesArcade) : il ne change ni le territoire où l'on est, ni « Jouer ».
// • En fin de partie, le bouton du bas ramène à l'Arcade (depuisArcade).
// Pour ajouter un jeu plus tard : ajouter sa clé dans JEUX_ARCADE et sa phrase dans REGLES_ARCADE.

const JEUX_ARCADE = ["carnet", "plus", "indices", "portrait"];   // étape R167 : + « Compléter le carnet », en tête
const REGLES_ARCADE = {
  carnet: "Dix questions sur ce que vous ne savez pas encore des espèces déjà rencontrées : leur allure, leur vie, leurs mesures… Les moins connues d'abord.",   // étape R167
  plus: `Deux espèces, une question : laquelle vit le plus longtemps, laquelle est la plus lourde ? ${VIES_DUEL} vies pour aller le plus loin possible.`,
  indices: "Une espèce se cache parmi des photos : utilisez les indices pour écarter les autres et la retrouver.",
  portrait: "Une espèce sans sa photo : retrouvez son portrait, trait par trait, parmi les dessins proposés.",
};
// Étape R163 (08/11, choix d'Aubin : maquette A « liste compacte ») : sur téléphone, une phrase courte par jeu
const REGLES_COURTES = {
  carnet: "Découvrez ce que vous ne savez pas encore de vos espèces.",   // étape R167
  plus: "Laquelle vit le plus longtemps, pèse le plus ?",   // les vies sont déjà dans la ligne du dessous
  indices: "Retrouvez l'espèce cachée grâce aux indices.",
  portrait: "Recomposez le portrait d'une espèce, trait par trait.",
};
var depuisArcade = false;                 // la partie en cours a-t-elle été lancée depuis l'Arcade ?

// Étape 274 (« Revoir 4 ») : dans « Plus de jeux », toutes les espèces sont jouables, même celles pas encore découvertes
// (avant : Espèce mystère et Portrait-robot ne prenaient que les espèces identifiées). Vrai sur l'écran des jeux
// et pendant une partie lancée depuis lui.
function accesTout() {
  const vue = document.getElementById("vue-arcade");
  return depuisArcade || !!(vue && !vue.classList.contains("cache"));
}
// Étape E2-6 (15/11, demande d'Aubin) : le « Mode Caddie » de la page Jeux : tous les jeux de la page avec toutes les espèces,
//   de tous les territoires (même pas encore ouverts), et Coup d'œil avec les espèces pas encore rencontrées.
//   Elles ne comptent pas comme rencontrées. Remplace l'interrupteur « Coup d'œil avec toutes les espèces » (R191b).
function modeCaddie() { return !!(suivi && (suivi.modeCaddie || suivi.coupToutes)); }
function territoiresJeux() {
  if (!modeCaddie()) return territoiresOuverts();
  return Object.keys(TERRITOIRES).filter(t => especesDe(t).length);
}
function territoiresArcade() {
  const ouverts = territoiresJeux();
  const libres = (suivi.territoiresLibres || []).filter(t => ouverts.includes(t));
  return libres.length ? libres : modeCaddie() ? ouverts : [territoireActif()];
}
function famillesArcade(T) {
  const presentes = famillesDe(T);
  const choisies = (suivi.famillesArcade || []).filter(f => presentes.includes(f));
  return choisies.length ? choisies : presentes;
}
// « Pyrénées · toutes les familles », « Pyrénées, Alpes · Oiseaux, Insectes »
function resumeArcade(T, F) {
  const toutes = F.length === famillesDe(T).length;
  const tousT = T.length > 1 && T.length === territoiresJeux().length;   // étape E2-6 : en Mode Caddie, « Tous les territoires »
  return `${tousT ? "Tous les territoires" : T.join(", ")} · ${toutes ? "toutes les familles" : F.map(f => CLASSES[f].nom).join(", ")}`;
}

// Étape R248 (36.01, choix 1A) : les records quittent le Profil et viennent sous chaque jeu (rien à zéro n'est écrit)
function recordsDuJeu(cle) {
  const st = (statsJeux[cle] || {}), r = [];
  if (cle === "plus") {
    if (suivi.recordSerieDuel) r.push(`<b>${nombre(suivi.recordSerieDuel)}</b> à la suite`);
    if (suivi.recordPartieDuel) r.push(`<b>${nombre(suivi.recordPartieDuel)}</b> sur une partie`);
  }
  if (cle === "indices" && st.decouvertes) r.push(`<b>${nombre(st.decouvertes)}</b> espèce${st.decouvertes > 1 ? "s" : ""} découverte${st.decouvertes > 1 ? "s" : ""}`);
  if (cle === "portrait" && suivi.portraits) r.push(`<b>${nombre(suivi.portraits)}</b> portrait${suivi.portraits > 1 ? "s" : ""} sans erreur`);
  if (cle === "oreille") { const n = nbEspeces(e => nbBonnes(e, "cri_son") >= 1); if (n) r.push(`<b>${nombre(n)}</b> cri${n > 1 ? "s" : ""} reconnu${n > 1 ? "s" : ""}`); }
  if (cle === "coupdoeil" && suivi.coupsDoeil) r.push(`<b>${nombre(suivi.coupsDoeil)}</b> photo${suivi.coupsDoeil > 1 ? "s" : ""} reconnue${suivi.coupsDoeil > 1 ? "s" : ""} du premier coup`);
  if (st.parties) r.push(`${nombre(st.parties)} partie${st.parties > 1 ? "s" : ""}`);
  return r.length ? `<p class="arc-records"><span>Vos records</span> ${r.join(" · ")}</p>` : "";
}
function afficherArcade() {
  const T = territoiresArcade(), F = famillesArcade(T);
  const d = construireDefi(T, F);
  // ---- Étape 335 (Revoir 8) : le compteur à part du mode arcade (parties jouées, records) ----
  const tete = document.querySelector("#vue-arcade .arc-tete");
  if (tete) {
    let cpt = document.getElementById("arc-compteur");
    if (!cpt) { cpt = document.createElement("div"); cpt.id = "arc-compteur"; cpt.className = "arc-compteur"; tete.appendChild(cpt); }
    const parties = JEUX_ARCADE.reduce((n, c) => n + ((statsJeux[c] || {}).parties || 0), 0);
    const recs = Object.keys(records).filter(k => JEUX_ARCADE.some(c => k.startsWith(c + ":") || k.includes(":" + c + ":"))).length;
    // Étape R163 : pas de compteur à zéro (avant une première partie, il ne s'affiche pas)
    cpt.classList.toggle("cache", !parties);
    cpt.innerHTML = parties ? `<span><b>${nombre(parties)}</b> partie${parties > 1 ? "s" : ""} jouée${parties > 1 ? "s" : ""}</span>${recs ? `<span><b>${nombre(recs)}</b> record${recs > 1 ? "s" : ""} à battre</span>` : ""}` : "";
  }
  // ---- Les jeux ----
  const zone = document.getElementById("arc-jeux");
  zone.innerHTML = JEUX_ARCADE.filter(c => JEUX[c]).map(cle => {
    const etat = d ? possibiliteJeu(cle, d) : { possible: false, raison: "aucune espèce avec ce choix" };
    const record = d ? records[cleRecord(cle, d.cle, false)] : null;
    const st = statsJeux[cle] || { parties: 0 };
    let meta = record ? `Record : <b>${nombre(record.score)}</b> ${dessinEtoiles(record.etoiles)}`
               : st.parties ? `${st.parties} partie${st.parties > 1 ? "s" : ""} jouée${st.parties > 1 ? "s" : ""}` : "Pas encore joué";
    // Étape R167 : pour « Compléter le carnet », ce qu'il reste à découvrir (pas de record)
    if (cle === "coupdoeil" && typeof metaCoupDoeil === "function") meta = metaCoupDoeil();   // étape R191
    if (cle === "oreille" && typeof metaOreille === "function") meta = metaOreille();          // étape E2-11
    if (cle === "carnet" && etat.possible) { const n = resteCarnet(d.especes); meta = `encore ${nombre(n)} chose${n > 1 ? "s" : ""} à découvrir`; }
    return `<article class="arc-jeu${etat.possible ? "" : " ferme"}">
        <div class="arc-picto">${picto(cle)}</div>
        <h2>${JEUX[cle].nom}</h2>
        <p class="arc-regle">${REGLES_ARCADE[cle] || ""}</p>
        <p class="arc-regle-courte">${REGLES_COURTES[cle] || REGLES_ARCADE[cle] || ""}</p>
        <p class="arc-meta">${etat.possible ? `${JEUX[cle].detail} · ${meta}` : conditionJeu(cle, etat)}</p>
        ${recordsDuJeu(cle)}
        <button class="arc-jouer" data-jeu="${cle}"${etat.possible ? "" : " disabled"}>Jouer <span aria-hidden="true">▶</span></button>
      </article>`;
  }).join("");
  zone.querySelectorAll(".arc-jouer").forEach(b => b.onclick = ev => { ev.stopPropagation(); lancerArcade(b.dataset.jeu); });
  // Étape R163 : sur téléphone, toute la ligne du jeu le lance (un seul geste)
  zone.querySelectorAll(".arc-jeu:not(.ferme)").forEach(a => a.onclick = () => { if (typeof surTelephone === "function" && surTelephone()) lancerArcade(a.querySelector(".arc-jouer").dataset.jeu); });

  // ---- Étape E2-6 : le bouton « Mode Caddie » (à la place de l'interrupteur de Coup d'œil, R191b) ----
  let inter = document.getElementById("arc-toutes");
  if (!inter) { inter = document.createElement("div"); inter.id = "arc-toutes"; inter.className = "arc-toutes arc-caddie"; zone.after(inter); }
  const caddie = modeCaddie();
  inter.innerHTML = `<button type="button" class="arc-caddie-bouton${caddie ? " on" : ""}" id="arc-caddie" aria-pressed="${caddie}">`
    + `<span class="arc-caddie-etat" aria-hidden="true">${caddie ? "✓" : ""}</span>Mode Caddie${caddie ? " · activé" : ""}</button>`
    + `<small>${caddie ? "Tous les jeux de cette page prennent toutes les espèces, de tous les territoires. Elles ne comptent pas comme rencontrées."
                        : "Pour jouer avec toutes les espèces, de tous les territoires, dans tous les jeux de cette page."}</small>`;
  document.getElementById("arc-caddie").onclick = () => {
    suivi.modeCaddie = !caddie; suivi.coupToutes = false;   // l'ancien interrupteur ne compte plus à part
    suivi.territoiresLibres = null;                        // en Mode Caddie : tous les territoires ; sinon : celui où l'on est
    sauvegarder(); afficherArcade();
  };

  // ---- Le volet « Avec quelles espèces ? » (replié) ----
  const volet = document.getElementById("arc-terrain");
  const ouvert = volet.open;
  const nbEsp = d ? d.especes.length : 0;
  volet.innerHTML = `<summary><span>Avec les espèces de :</span> <b>${resumeArcade(T, F)}</b> <small>(${nombre(nbEsp)} espèces)</small> <u>modifier</u></summary>
    <div class="arc-choix">
      <p>Territoires</p>
      <div class="arc-puces">${territoiresJeux().map(t => `<button class="arc-puce${T.includes(t) ? " on" : ""}" data-t="${echapper(t)}"`
        + ` style="--c:${(TERRITOIRES[t] || {}).couleur || "#7a736a"}">${t}</button>`).join("")}</div>
      <p>Familles</p>
      <div class="arc-puces">${famillesDe(T).map(f => `<button class="arc-puce${F.includes(f) ? " on" : ""}" data-f="${f}"`
        + ` style="--c:${CLASSES[f].couleur}">${CLASSES[f].nom}</button>`).join("")}</div>
      <button class="arc-reset" id="arc-reset">${modeCaddie() ? "Revenir à tous les territoires" : `Revenir au territoire où vous êtes (${territoireActif()})`}</button>
    </div>`;
  volet.open = ouvert;
  volet.querySelectorAll("[data-t]").forEach(b => b.onclick = () => {
    const t = b.dataset.t;
    let liste = T.includes(t) ? T.filter(x => x !== t) : T.concat(t);
    if (!liste.length) return;                              // au moins un territoire
    suivi.territoiresLibres = territoiresJeux().filter(x => liste.includes(x));
    sauvegarder(); afficherArcade();
  });
  volet.querySelectorAll("[data-f]").forEach(b => b.onclick = () => {
    const f = b.dataset.f;
    let liste = F.includes(f) ? F.filter(x => x !== f) : F.concat(f);
    if (!liste.length) return;                              // au moins une famille
    suivi.famillesArcade = liste.length === famillesDe(T).length ? null : liste;
    sauvegarder(); afficherArcade();
  });
  document.getElementById("arc-reset").onclick = () => {
    suivi.territoiresLibres = null; suivi.famillesArcade = null; sauvegarder(); afficherArcade();
  };
}

function lancerArcade(cle) {
  if (cle === "carnet") { lancerCarnet(true); return; }    // étape R167
  if (cle === "coupdoeil") { lancerCoupDoeil(); return; }   // étape R191
  if (cle === "oreille") { lancerOreille(); return; }       // étape E2-11
  const T = territoiresArcade(), F = famillesArcade(T);
  const d = construireDefi(T, F);
  if (!d) { afficherBulle("Aucune espèce avec ce choix"); return; }
  const etat = possibiliteJeu(cle, d);
  if (!etat.possible) { afficherBulle(conditionJeu(cle, etat)); return; }
  jeuChoisi = cle;
  territoiresDefi = T.slice();
  famillesDefi = F.slice();
  depuisArcade = true;
  modeLibre = true;                                         // l'onglet « Plus de jeux » reste allumé pendant la partie
  lancementDirect = true;
  montrer("jouer");
  lancementDirect = false;
  document.getElementById("bouton-territoire-defi").textContent = "Retour aux jeux";   // étape 274 (avant : « Retour à l'Arcade »)
  demarrerDefi(d);
}

// ---- Étape R167 (08/11, choix d'Aubin) : « Compléter le carnet » ----
// depuisJeux = true : lancé depuis la page Jeux (territoires et familles choisis là) ; false : depuis le défi du jour
// « Découvrir N choses nouvelles » (le territoire où l'on est). Le moteur est celui de « Jouer » (clé "revision").
function lancerCarnet(depuisJeux) {
  const T = depuisJeux ? territoiresArcade() : [territoireActif()];
  const F = depuisJeux ? famillesArcade(T) : famillesDe(T);
  const d = construireDefi(T, F);
  if (!d) { afficherBulle("Aucune espèce avec ce choix"); return; }
  const etat = possibiliteJeu("carnet", d);
  if (!etat.possible) { afficherBulle(conditionJeu("carnet", etat)); return; }
  jeuChoisi = "revision"; revisionsSeules = false; photosSeules = false; questionsClassique = QUESTIONS_REVISION;
  territoiresDefi = T.slice(); famillesDefi = F.slice();
  depuisArcade = !!depuisJeux; modeLibre = !!depuisJeux;
  lancementDirect = true;
  montrer("jouer");
  lancementDirect = false;
  document.getElementById("bouton-territoire-defi").textContent = depuisJeux ? "Retour aux jeux" : "Retour au territoire";
  demarrerDefi(d, { jouer: true, carnet: true });
  if (defi) defi.depuisJeux = !!depuisJeux;
}
