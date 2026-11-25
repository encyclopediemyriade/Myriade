// 34_regles.js — La page « Les règles du jeu » (étape CL4, 25/11/2026 ; textes validés par Aubin). Chargé par jeu.html avant 13_demarrage.js.
//   Une seule page, ouverte depuis le Profil, À propos et « Vos lieux ». Tous les chiffres viennent des réglages du code :
//   rien n'est à corriger ici quand un réglage change.
const PART_EN_LETTRES = { 0.25: "un quart", 0.5: "la moitié", 0.75: "les trois quarts" };
// Le lien d'une ligne vers la page (un seul écouteur, plus bas)
function lienRegles() { return `<button type="button" class="lien-regles" data-regles>Les règles du jeu <span aria-hidden="true">›</span></button>`; }
function especesParExpedition() {
  const n = toutesExpeditions().map(x => x.liste.length).filter(Boolean);
  return [Math.min(...n), Math.max(...n)];
}
function partiesRegles() {
  const trait = d => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
  const part = p => PART_EN_LETTRES[p] || `${Math.round(p * 100)} %`;
  const cles = n => clesTexte(n).replace(" ", "\u00a0");   // « 1 clé » ne se coupe pas en fin de ligne
  const plus = n => `<b>+${n}</b>`;
  const rg = i => `${RANGS_TERRITOIRE[i].nom}${RANGS_EMPREINTES[i] ? ` (${RANGS_EMPREINTES[i]}${i === 1 ? " empreintes" : ""})` : ""}`;
  const [mini, maxi] = especesParExpedition(), seuils = RANGS_NATURALISTE.map((r, i) => seuilRang(i)).slice(1), tout = seuils.pop();
  const premier = PREMIER_VOYAGE === 1 ? "au premier lieu terminé" : `après ${PREMIER_VOYAGE} lieux terminés`;
  return [
    ["boussole", trait('<circle cx="12" cy="12" r="8.5"/><path d="M15.2 8.8 L13.2 13.2 L8.8 15.2 L10.8 10.8 Z"/>'), "Les expéditions", [
      `Une expédition réunit ${mini === maxi ? mini : `${mini} à ${maxi}`} espèces d'un vrai lieu. Les Rencontres se font de deux façons : Découvrir ou Me tester.`,
      "Vient ensuite Leurs liens, quand l'expédition en propose. Approfondir est facultatif."]],
    ["pas", PAS_SVG, "Les empreintes", [
      `${plus(GAIN_ESPECE)} par espèce rencontrée en expédition, ${plus(GAIN_FIN_EXPEDITION)} à la fin de l'expédition, ${plus(GAIN_APPROFONDIR)} par espèce approfondie, ${plus(EMPREINTES_FINALE)} pour la finale du lieu.`,
      `${plus(POINTS_DEFI)} par défi du moment réussi et ${plus(GAIN_ESPECE_DU_JOUR)} pour l'espèce du jour. Elles ne baissent jamais.`]],
    ["medaille", medailleSvg(2), "La médaille du lieu", [
      `Les empreintes gagnées dans un lieu remplissent sa médaille. Bronze : ${part(PART_BRONZE)}. Argent : ${part(PART_ARGENT)}, et le lieu suivant s'ouvre.`,
      "Or : toutes les expéditions et la finale sont terminées."]],
    ["cle", PICTO_CLE, "Les clés", [
      `Une clé toutes les ${EMPREINTES_PAR_CLE} empreintes, gagnées dans tous les territoires. ${cles(PRIX_LIEU)} ouvre un lieu en avance, ${cles(PRIX_TERRITOIRE)} un territoire.`,
      "Le compteur vert en haut les compte ; l'avancée vers la prochaine est dans le Profil."]],
    ["territoire", trait('<path d="M3.5 6.5 L9 4 L15 6.5 L20.5 4 V17.5 L15 20 L9 17.5 L3.5 20 Z M9 4 V17.5 M15 6.5 V20"/>'), "Les territoires", [
      `Le deuxième s'ouvre ${premier}, puis un nouveau tous les ${LIEUX_PAR_TERRITOIRE} lieux : toujours le plus différent des vôtres.`,
      `Ou tout de suite, celui que vous voulez, avec ${cles(PRIX_TERRITOIRE)}.`]],
    ["rang", picto("naturaliste"), "Les rangs", [
      `Dans chaque territoire : ${RANGS_EMPREINTES.map((s, i) => rg(i)).join(", ")}, puis ${RANGS_TERRITOIRE[RANGS_EMPREINTES.length].nom}, une fois le tour du site remarquable fait.`,
      `Le rang du carnet suit vos espèces : ${seuils.join(", ")}, puis toutes (${tout}).`,
      "Une médaille, un rang ou une espèce du carnet ne se perd jamais."]],
  ];
}
function afficherRegles() {
  const vue = document.getElementById("vue-regles");
  if (!vue) return;
  vue.innerHTML = `<article class="regles">
    <div class="rg-tete"><button type="button" class="at-retour" id="regles-retour" aria-label="Retour">←</button><h1>Les règles du jeu</h1></div>
    <div class="rg-liste">${partiesRegles().map(([cle, dessin, titre, phrases]) => `<section class="rg-partie"><span class="ej-picto ej-${cle}">${dessin}</span><div><h2>${titre}</h2>${phrases.map(p => `<p>${p}</p>`).join("")}</div></section>`).join("")}</div>
  </article>`;
  document.getElementById("regles-retour").onclick = () => { if (!revenirPagePrecedente()) montrer("progression"); };
}
document.addEventListener("click", ev => {
  const b = ev.target.closest && ev.target.closest("[data-regles]");
  if (b) { ev.preventDefault(); montrer("regles"); }
});
