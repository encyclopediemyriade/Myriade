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
function territoiresArcade() {
  const ouverts = territoiresOuverts();
  const libres = (suivi.territoiresLibres || []).filter(t => ouverts.includes(t));
  return libres.length ? libres : [territoireActif()];
}
function famillesArcade(T) {
  const presentes = famillesDe(T);
  const choisies = (suivi.famillesArcade || []).filter(f => presentes.includes(f));
  return choisies.length ? choisies : presentes;
}
// « Pyrénées · toutes les familles », « Pyrénées, Alpes · Oiseaux, Insectes »
function resumeArcade(T, F) {
  const toutes = F.length === famillesDe(T).length;
  return `${T.join(", ")} · ${toutes ? "toutes les familles" : F.map(f => CLASSES[f].nom).join(", ")}`;
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
    if (cle === "carnet" && etat.possible) { const n = resteCarnet(d.especes); meta = `encore ${nombre(n)} chose${n > 1 ? "s" : ""} à découvrir`; }
    return `<article class="arc-jeu${etat.possible ? "" : " ferme"}">
        <div class="arc-picto">${picto(cle)}</div>
        <h2>${JEUX[cle].nom}</h2>
        <p class="arc-regle">${REGLES_ARCADE[cle] || ""}</p>
        <p class="arc-regle-courte">${REGLES_COURTES[cle] || REGLES_ARCADE[cle] || ""}</p>
        <p class="arc-meta">${etat.possible ? `${JEUX[cle].detail} · ${meta}` : conditionJeu(cle, etat)}</p>
        <button class="arc-jouer" data-jeu="${cle}"${etat.possible ? "" : " disabled"}>Jouer <span aria-hidden="true">▶</span></button>
      </article>`;
  }).join("");
  zone.querySelectorAll(".arc-jouer").forEach(b => b.onclick = ev => { ev.stopPropagation(); lancerArcade(b.dataset.jeu); });
  // Étape R163 : sur téléphone, toute la ligne du jeu le lance (un seul geste)
  zone.querySelectorAll(".arc-jeu:not(.ferme)").forEach(a => a.onclick = () => { if (typeof surTelephone === "function" && surTelephone()) lancerArcade(a.querySelector(".arc-jouer").dataset.jeu); });

  // ---- Étape R191b : l'interrupteur « Toutes les espèces » de Coup d'œil ----
  let inter = document.getElementById("arc-toutes");
  if (!inter) { inter = document.createElement("label"); inter.id = "arc-toutes"; inter.className = "arc-toutes"; zone.after(inter); }
  inter.innerHTML = `<input type="checkbox" id="arc-toutes-case"${suivi.coupToutes ? " checked" : ""}>`
    + `<span><b>Coup d'œil avec toutes les espèces</b><small>Même celles pas encore rencontrées. Elles ne comptent pas comme rencontrées.</small></span>`;
  document.getElementById("arc-toutes-case").onchange = ev => { suivi.coupToutes = ev.target.checked; sauvegarder(); afficherArcade(); };

  // ---- Le volet « Avec quelles espèces ? » (replié) ----
  const volet = document.getElementById("arc-terrain");
  const ouvert = volet.open;
  const nbEsp = d ? d.especes.length : 0;
  volet.innerHTML = `<summary><span>Avec les espèces de :</span> <b>${resumeArcade(T, F)}</b> <small>(${nombre(nbEsp)} espèces)</small> <u>modifier</u></summary>
    <div class="arc-choix">
      <p>Territoires</p>
      <div class="arc-puces">${territoiresOuverts().map(t => `<button class="arc-puce${T.includes(t) ? " on" : ""}" data-t="${echapper(t)}"`
        + ` style="--c:${(TERRITOIRES[t] || {}).couleur || "#7a736a"}">${t}</button>`).join("")}</div>
      <p>Familles</p>
      <div class="arc-puces">${famillesDe(T).map(f => `<button class="arc-puce${F.includes(f) ? " on" : ""}" data-f="${f}"`
        + ` style="--c:${CLASSES[f].couleur}">${CLASSES[f].nom}</button>`).join("")}</div>
      <button class="arc-reset" id="arc-reset">Revenir au territoire où vous êtes (${territoireActif()})</button>
    </div>`;
  volet.open = ouvert;
  volet.querySelectorAll("[data-t]").forEach(b => b.onclick = () => {
    const t = b.dataset.t;
    let liste = T.includes(t) ? T.filter(x => x !== t) : T.concat(t);
    if (!liste.length) return;                              // au moins un territoire
    suivi.territoiresLibres = territoiresOuverts().filter(x => liste.includes(x));
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
