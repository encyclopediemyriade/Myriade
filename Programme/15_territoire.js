// 15_territoire.js — Étape 252 (24/10/2026) : un territoire à la fois, et sa carte d'identité en tête de l'accueil.
// Une partie du programme du jeu, chargée par jeu.html dans l'ordre des numéros.
//
// • Le joueur est toujours DANS un territoire (suivi.territoireActif). Les jeux (« Jouer », Plus de jeux,
//   Rencontre, espèce du jour) ne posent que des espèces de ce territoire. L'encyclopédie et le profil
//   gardent tout ; le filtre de l'encyclopédie est simplement réglé, au départ, sur ce territoire.
// • « Partir ailleurs » ouvre l'écran de choix du terrain : un clic sur la carte = un seul territoire.
// • La couverture (direction B « magazine », choisie le 24/10) : grande photo d'un vrai paysage du territoire,
//   « Vous êtes dans les Pyrénées », une phrase, la légende du lieu ; une bande de chiffres ; les 8 emblèmes ;
//   l'enjeu « À la une » avec ses 3 récits et ses sources. Le contenu vient de identite.js
//   (Données\identite_territoires.xlsx → gen_identite.py). Un territoire sans carte d'identité garde une
//   couverture simple : une photo de paysage de ce territoire (PAYSAGES), son nom et ses chiffres.

var filtreTerritoireChoisi = false;      // le joueur a-t-il changé lui-même le filtre de l'encyclopédie ?

// « dans les Alpes », « en Méditerranée »… (quand le classeur ne le dit pas)
const ARTICLES_TERRITOIRES = { "Alpes": "les", "Pyrénées": "les", "Méditerranée": "en", "Massif armoricain": "le",
  "Bassin parisien et Val de Loire": "le", "Bassin aquitain": "le", "Massif central": "le", "Corse": "en",
  "Plaines de l'Est et val de Saône": "les", "Vosges": "les", "Jura": "le" };   // étape GE4 : « dans les Plaines de l'Est et val de Saône »

// Le territoire où l'on est : celui gardé dans la sauvegarde, sinon le territoire de départ, sinon le premier ouvert
function territoireActif() {
  const ouverts = territoiresOuverts();
  let t = suivi.territoireActif;
  if (!t || !ouverts.includes(t)) {
    t = (territoiresChoisis || []).find(x => ouverts.includes(x))
      || (profil && profil.territoires || []).find(x => ouverts.includes(x))
      || ouverts[0];
    suivi.territoireActif = t;
  }
  return t;
}
function changerTerritoire(t) {
  if (!t) return;
  suivi.territoireActif = t;
  territoiresDefi = [t];
  territoiresChoisis = [t];
  if (!filtreTerritoireChoisi) filtreTerritoire = t;
  sauvegarder();
}

// Étape 263 : renommée (avant : articleDe, qui écrasait la fonction du même nom de 09_rencontre.js pour les espèces)
function articleTerritoire(t) {
  const id = typeof IDENTITE !== "undefined" ? IDENTITE[t] : null;
  return (id && id.article) || ARTICLES_TERRITOIRES[t] || "le";
}
// « Vous êtes dans les » / « Vous êtes en »
function texteVousEtes(t) {
  const a = articleTerritoire(t);
  return a === "en" ? "Vous êtes en" : `Vous êtes dans ${a}`;
}
function especeParNom(nom) { return ESPECES.find(e => e.nom_courant === nom); }
function echapper(txt) { return String(txt || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

// Les chiffres : un calculé par le jeu (espèces du territoire, écrit sous le nom depuis l'étape 264),
// puis ceux du classeur — 4 au plus
function chiffresTerritoire(t, id) {
  const ici = especesDe(t);
  // Étape 275 (« Revoir 5 ») : plus le chiffre « qu'on ne croise dans aucun autre territoire du jeu » (peu d'intérêt)
  const liste = [{ valeur: nombre(ici.length), texte: "espèces à rencontrer" }];
  return liste.concat(id ? id.chiffres : []).slice(0, 4);
}
// Étape 278 : les photos de la couverture (onglet photos_territoire) ; la première (ordre 0) reste la photo
// « officielle » du territoire (carte, cartes postales) ; la couverture en tire une au hasard à chaque visite.
function photosTerritoire(t, id) {
  if (id && id.photos && id.photos.length)
    return id.photos.map(p => ({ fichier: p.photo, legende: p.legende, lieu: p.lieu, credit: p.credit }));
  return [photoTerritoire(t, id)];
}
// La photo de la couverture et son crédit (pris dans PAYSAGES quand il y est)
function photoTerritoire(t, id) {
  if (id && id.photos && id.photos.length) {
    const p = id.photos[0];
    return { fichier: p.photo, legende: p.legende, lieu: p.lieu, credit: p.credit };
  }
  const P = typeof PAYSAGES !== "undefined" ? PAYSAGES : [];
  if (id && id.photo) {
    const p = P.find(x => x.fichier === id.photo);
    return { fichier: id.photo, legende: id.legende_photo, lieu: id.lieu_photo, credit: p ? `${p.auteur}, ${p.licence}` : "" };
  }
  // pas de photo choisie dans le classeur : une photo de paysage propre à ce seul territoire, sinon les étourneaux
  const p = P.find(x => (x.territoires || []).length === 1 && x.territoires[0] === t) || null;
  return p ? { fichier: p.fichier, legende: p.lieu, lieu: "", credit: `${p.auteur}, ${p.licence}` }
           : { fichier: "Images/bandeau_etourneaux.jpg", legende: "", lieu: "", credit: "" };
}

function legendeCouv(p, enLigne) { return echapper(p.legende || "") + (p.lieu ? `${enLigne ? ", " : "<br>"}${echapper(p.lieu)}` : ""); }
const AFFICHER_CHIFFRES = false;   // étape 281 : la bande des 2 chiffres du territoire est gardée pour plus tard

function dessinerCouverture() {
  const zone = document.getElementById("ac-couverture");
  if (!zone) return;
  const t = territoireActif();
  const id = typeof IDENTITE !== "undefined" ? IDENTITE[t] : null;
  const couleur = (TERRITOIRES[t] || {}).couleur || "#1F3A2E";
  const photos = photosTerritoire(t, id);
  let n = Math.floor(Math.random() * photos.length);   // étape 278 : une photo au hasard
  const photo = photos[n];
  // Étape 264 : le nombre d'espèces passe, discret, sous le nom du territoire ; la bande de chiffres ne garde que les autres
  // (et disparaît s'il n'y en a pas, comme pour les territoires sans carte d'identité)
  const chiffresBande = chiffresTerritoire(t, id).slice(1);
  const bandeau = document.querySelector("#vue-accueil .ac-bandeau");
  if (bandeau) bandeau.classList.add("cache");
  zone.classList.remove("cache");
  zone.style.setProperty("--couleur-territoire", couleur);
  // Étape 281 (maquette A3 + A2, 25/10) : le jeu d'abord. Sur la photo : le nom, la phrase et le gros bouton
  // « Jouer une Sortie nature » ; la légende de la photo en petit en haut à gauche. La bande de chiffres est
  // gardée pour plus tard (AFFICHER_CHIFFRES).
  zone.innerHTML = `
    <div class="couv-photo">
      <img src="${photo.fichier}" alt="${echapper(photo.legende)}">
      <div class="couv-legende-haut"><span class="couv-leg-texte">${legendeCouv(photo, true)}</span>
        ${photos.length > 1 ? `<button class="couv-autre" id="couv-autre" type="button">Autre photo ↻</button>` : ""}</div>
      ${typeof carteCouverture === "function" ? carteCouverture(t) : ""}
      <div class="couv-bande">
        <div class="couv-titre">
          <div class="couv-vous">${texteVousEtes(t)}</div>
          <h1 class="${t.length > 14 ? "long" : ""}">${t}</h1>
          ${id && id.phrase ? `<p class="couv-phrase">${echapper(id.phrase)}</p>` : ""}
          <p class="couv-nb">${nombre(especesDe(t).length)} espèces à rencontrer</p>
        </div>
        <div class="couv-jouer">${(x => x ? `<div class="couv-reprise">${x.chapitre ? imgMini(vedetteDe(x).photo, vedetteDe(x).nom_courant, "couv-vedette") : ""}<small>${expeditionCommencee(x) ? "Reprendre" : "Première étape"}${x.chapitre && typeof estLieu === "function" && estLieu(chapitreParNom(t, x.chapitre)) ? ` · ${echapper(x.chapitre)}` : ""} · ${echapper(x.titre)}, étape ${etapeEnCours(x) || 1}</small></div>
          <button class="couv-go" id="couv-go" type="button">${expeditionCommencee(x) ? "Continuer l'expédition" : "Commencer l'expédition"} <span aria-hidden="true">▶</span></button>`
          : `<button class="couv-go" id="couv-go" type="button">Jouer <span aria-hidden="true">▶</span></button>`)(expeditionAReprendre(t))}</div>
      </div>
    </div>
    ${AFFICHER_CHIFFRES && chiffresBande.length ? `<div class="couv-chiffres">${chiffresBande.map(c =>
      `<div><b>${echapper(c.valeur)}</b><span>${echapper(c.texte)}</span></div>`).join("")}</div>` : ""}`;
  document.getElementById("couv-go").onclick = () => { const x = expeditionAReprendre(t); if (x) lancerExpedition(x); else lancerJouer(); };   // étape 282
  if (typeof brancherCarteLieux === "function") brancherCarteLieux(zone, t);   // étape 336 : la carte des lieux dans la couverture
  // Étape 278 : « Autre photo » passe à la suivante, en fondu (une photo absente est sautée)
  const img = zone.querySelector(".couv-photo > img");
  const sauter = () => { if (photos.length > 1) { photos.splice(n, 1); n %= photos.length; montrerPhoto(); } else img.remove(); };
  img.onerror = sauter;
  const montrerPhoto = () => {
    img.classList.add("fondu");
    setTimeout(() => {
      const p = photos[n];
      img.onload = () => img.classList.remove("fondu");
      img.src = p.fichier; img.alt = p.legende || "";
      zone.querySelector(".couv-leg-texte").innerHTML = legendeCouv(p, true);
      // étape 338 : le crédit de la photo n'est plus sur la couverture (il est dans À propos)
      const b = document.getElementById("couv-autre"); if (b && photos.length < 2) b.remove();
    }, 250);
  };
  const autre = document.getElementById("couv-autre");
  if (autre) autre.onclick = () => { n = (n + 1) % photos.length; montrerPhoto(); };   // étape 255 : retour à la page carte
  // « Jouer dans les Pyrénées »
  const sous = document.getElementById("sous-jouer");
  if (sous) sous.textContent = `10 questions ${articleTerritoire(t) === "en" ? "en" : "dans " + articleTerritoire(t)} ${t} : quelques espèces nouvelles croisées en chemin, et des révisions de celles que vous connaissez.`;   // étape 263
  dessinerProgressionTerritoire(t, couleur);   // étape 262
  dessinerExpeditions(t);                        // étape 282 : « Vos expéditions » (la Rencontre de l'accueil est fondue dedans)
  dessinerDefis(t);                              // étape 281 : défis du jour + prochaines récompenses
  dessinerEmblemes(t, id);
  dessinerEnjeu(t, id);
  dessinerAccueilMobile(t);                      // étape M4 : l'accueil du téléphone (caché sur ordinateur)
}

// ---- Étape 262 (« Revoir 3 ») : la progression dans le territoire, mise en avant sous la couverture ----
// Le grand pourcentage = la nature du territoire connue (comme sur la page carte). Puis deux jauges séparées,
// les deux façons d'avancer : les espèces rencontrées (reconnues sur photo, surtout en Rencontre)
// et les médailles (gagnées en répondant aux questions sur leurs caractéristiques).
// En dessous : ce qu'il manque pour ouvrir le territoire suivant (chaque espèce et chaque médaille compte 1 point).
function dessinerProgressionTerritoire(t, couleur) {
  // Étapes 281-282 : une barre sous la photo — les empreintes du territoire, le rang, et le prochain rang (ou territoire).
  const zone = document.getElementById("ac-progression");
  if (!zone) return;
  const r = rangTerritoire(t), rec = recompensePrincipale(t);
  verifierMonteeRang(t, r);
  zone.classList.remove("cache");
  zone.style.setProperty("--couleur-territoire", couleur);
  zone.innerHTML = `
    <div class="rang-empreintes">${PAS_SVG}<b>${r.empreintes}</b><small>empreinte${r.empreintes > 1 ? "s" : ""}</small></div>
    <div class="rang-nom"><div class="etiq-jeu">Votre rang</div><b>${r.nom}</b></div>
    <div class="rang-recompense">${rec ? `<div class="rang-ligne"><span>${rec.cle === "rang" ? "Prochain rang" : "Prochaine récompense"} : <b>${rec.cle === "rang" ? rec.titre.replace(/^Rang /, "") : rec.titre}</b></span><small>${rec.reste}</small></div>
      <i class="jauge-jeu"><b style="width:${Math.round(100 * rec.part)}%"></b></i>${rec.cle === "rang" ? ligneProchainTerritoire() : ""}` : `<span>Toutes les récompenses de ce territoire sont gagnées. Bravo !</span>`}</div>`;
}
// Étape R160 (08/11, choix d'Aubin : maquette C2) : le bloc « Prochaines récompenses » est retiré ; le territoire suivant
// tient en une ligne sous le rang (ordinateur) ou sous la bannière (téléphone). Le lieu suivant se lit sur sa carte.
function ligneProchainTerritoire(cl) {
  const m = avantProchainTerritoire();
  if (m === null) return "";
  const t2 = prochainTerritoire(), c2 = TERRITOIRES[t2] ? TERRITOIRES[t2].couleur : "";
  return `<div class="prochain-terr${cl ? " " + cl : ""}"><span class="rec-pastille"${c2 ? ` style="background:${c2}"` : ""}></span><span>Prochain territoire : <b>${echapper(t2)}</b>, ${m ? "encore " + texteManque(m) : "c'est pour maintenant !"}</span></div>`;
}

// ---- Les emblèmes : 8 vignettes ; inconnues = photo floutée (le nom reste : on apprend qui fait le territoire) ----
function dessinerEmblemes(t, id) {
  const zone = document.getElementById("ac-emblemes");
  if (!zone) return;
  const liste = id ? id.emblemes.map(especeParNom).filter(Boolean) : [];
  if (!liste.length) { zone.classList.add("cache"); return; }
  zone.classList.remove("cache");
  const connues = liste.filter(estReconnue).length;
  zone.innerHTML = `<div class="emb-tete"><h2>Ils font ${articleTerritoire(t) === "en" ? "la " : articleTerritoire(t) + " "}${t}</h2>`
    + `<span>${connues} sur ${liste.length} dans votre carnet</span></div>`
    + `<div class="emb-grille">${liste.map((e, i) => {
      const connue = estReconnue(e);
      return `<button class="emb${connue ? "" : " inconnue"}" data-i="${i}" title="${connue ? "Voir sa fiche" : "La rencontrer"}">`
        + `<span class="emb-ph">${e.photo ? `<img src="${e.photo}" alt="${connue ? echapper(e.nom_courant) : ""}">` : ""}</span>`
        + `<span class="emb-nom">${e.nom_courant}</span><small>${connue ? "Dans votre carnet" : "À rencontrer"}</small></button>`;
    }).join("")}</div>`;
  zone.querySelectorAll(".emb").forEach(b => b.onclick = () => {
    const e = liste[Number(b.dataset.i)];
    if (estReconnue(e)) ouvrirPageEspece(e); else lancerRencontreAvec(e);
  });
}

// ---- L'enjeu « À la une » : titre, introduction, 3 récits numérotés, une grande photo, les sources ----
// Étape 279 (25/10) : l'enjeu « À la une » n'est plus affiché (gardé sous le coude pour une V2).
// Les textes restent dans le classeur (onglets enjeu, recits, sources) et dans identite.js :
// pour le faire revenir, il suffit de remettre ce réglage à true.
const AFFICHER_ENJEU = false;
function dessinerEnjeu(t, id) {
  const zone = document.getElementById("ac-enjeu");
  if (!zone) return;
  if (!AFFICHER_ENJEU || !id || !id.enjeu) { zone.classList.add("cache"); return; }
  zone.classList.remove("cache");
  const ej = id.enjeu, ph = especeParNom(ej.photo_espece);
  zone.innerHTML = `<div class="enj-texte">
      <div class="enj-etiquette">À la une · l'enjeu du territoire</div>
      <h2>${echapper(ej.titre)}</h2>
      <p class="enj-intro">${echapper(ej.intro)}</p>
      <ol class="enj-recits">${id.recits.map((r, i) =>
        `<li><span class="enj-num">${i + 1}</span><span><b>${echapper(r.titre)}.</b> ${echapper(r.texte)}</span></li>`).join("")}</ol>
      ${id.sources.length ? `<details class="enj-sources"><summary>Sources</summary><ul>${id.sources.map(s =>
        `<li>${s.url ? `<a href="${echapper(s.url)}" target="_blank" rel="noopener">${echapper(s.source)}</a>` : echapper(s.source)}</li>`).join("")}</ul></details>` : ""}
    </div>
    ${ph && ph.photo ? `<figure class="enj-photo"><img src="${ph.photo}" alt="${echapper(ph.nom_courant)}">`
      + `${ej.legende_photo ? `<figcaption>${echapper(ej.legende_photo)}</figcaption>` : ""}</figure>` : ""}`;
}

// ---- Étape 255 (24/10) : la page carte (l'accueil général) ----
// Le bandeau Myriade, la carte (un clic sur un territoire ouvert = y partir), la nature connue de toute la France
// (ou du territoire survolé), les anneaux des familles, les dernières découvertes.
function afficherPageCarte() {
  territoireAccueil = null;              // toute la France, tant qu'aucun territoire n'est survolé
  afficherCarte();
  afficherListeTerritoires();
  afficherProgression();
  // (étape 270 : l'encadré « Reprendre votre exploration » est remplacé par la grande carte du territoire, dans le bandeau)
  document.getElementById("carte-reprendre").classList.add("cache");
  dessinerTerritoiresAccueil();          // étape 266
  dessinerEspeceDuJour();                // étape 265 : l'espèce du jour, seulement sur cette page
  afficherDefile();
  afficherStats();
  if (avantProchainTerritoire() === 0) setTimeout(verifierOuverture, 300);
}


// =====================================================================================================
// Étape 263 (24/10) : deux façons de jouer, côte à côte sur la page du territoire (maquette « B + D » validée)
//   • Sortie nature (ex-« Jouer ») : le jeu choisit — 10 questions, quelques espèces nouvelles, des révisions.
//   • Rencontre : le joueur choisit — 3 espèces encore inconnues du territoire, photo floutée, leur famille
//     et un indice tiré de leur fiche (milieu ; la nuit, ou le régime). « Voir d'autres espèces » en propose 3 autres.
//     Les deux traits donnés en indice ne sont pas redemandés dans cette Rencontre (la réponse serait évidente) :
//     ils reviendront plus tard (Sortie nature ou autre Rencontre).
//     Quand il n'y a plus d'espèce inconnue : 3 espèces connues mais pas encore maîtrisées, avec leur nom (« À approfondir »).
//   • Passerelles : en fin de Sortie nature, « Le rencontrer pour de bon ? » pour une espèce croisée pour la première fois ;
//     en fin de Rencontre, « Continuer par une Sortie nature » ou « Choisir une autre Rencontre ».
// =====================================================================================================
const FAMILLE_SINGULIER = { Mammiferes: "Mammifère", Oiseaux: "Oiseau", Amphibiens: "Amphibien", Reptiles: "Reptile",
  Poissons: "Poisson", Insectes: "Insecte", Araignees_mille_pattes: "Araignée ou mille-pattes", Crustaces: "Crustacé",
  Mollusques: "Mollusque", Vers_meduses_compagnie: "Ver, méduse et compagnie" };
// Depuis la fin d'une Rencontre : retour à la page du territoire, sur le choix des Rencontres
function allerAuxRencontres() {
  session = null;
  montrer("accueil");
  const duo = document.getElementById("ac-duo");
  if (duo) setTimeout(() => duo.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
}
// En fin de Sortie nature : les espèces croisées pour la première fois → « Le rencontrer pour mieux le connaître ? »
// Étape 274 (« Revoir 4 ») : une ligne pour CHAQUE espèce croisée pour la première fois (avant : seulement la première).
function dessinerPasserelle(d) {
  const zone = document.getElementById("passerelle-fin-defi");
  if (!zone) return;
  const nouvelles = d && d.jouer ? [...new Set((d.bilan || []).filter(l => l.liste === "decouvert").map(l => l.nom))]
    .map(especeParNom).filter(Boolean) : [];
  if (!nouvelles.length) { zone.classList.add("cache"); zone.innerHTML = ""; return; }
  zone.classList.remove("cache");
  zone.innerHTML = nouvelles.map((e, i) => `<div class="pass-ligne">
    <span class="pass-ph">${e.photo ? `<img src="${e.photo}" alt="">` : ""}</span>
    <span class="pass-texte">Vous avez croisé <b>${nomAvecArticle(e)}</b> pour la première fois.<small>Le rencontrer pour mieux le connaître ?</small></span>
    <button class="pass-bouton" data-i="${i}">Rencontre <span aria-hidden="true">▶</span></button></div>`).join("");
  zone.querySelectorAll(".pass-bouton").forEach(b => b.onclick = () => lancerRencontreAvec(nouvelles[Number(b.dataset.i)]));
}
// Étape 274 (« Revoir 4 ») : en fin de Rencontre, « Autre rencontre aléatoire » — une espèce du territoire tirée au hasard :
// d'abord parmi celles encore inconnues (avec photo), sinon parmi celles pas encore maîtrisées, sinon n'importe laquelle.
function rencontreAleatoire() {
  const ici = especesDe(territoireActif()).filter(e => estRenseigne(e.photo));
  const derniere = session && session.focus ? session.focus : (typeof derniereEspece !== "undefined" ? derniereEspece : null);
  const sauf = l => { const x = l.filter(e => e !== derniere); return x.length ? x : l; };
  const inconnues = sauf(ici.filter(e => !estReconnue(e)));
  const aApprofondir = sauf(ici.filter(e => statut(e) !== "maîtrisée"));
  const pool = inconnues.length ? inconnues : aApprofondir.length ? aApprofondir : ici;
  if (!pool.length) { allerAuxRencontres(); return; }
  lancerRencontreAvec(auHasard(pool));
}

// ---- Étape 266 (24/10) : « Vos territoires » sur la page d'accueil, en cartes postales (maquettes B + C retenues) ----
// Une rangée : les territoires ouverts (en couleur, avec leur % ; clic = y partir), puis le PROCHAIN territoire à ouvrir,
// plus grand (photo, « encore N points », la barre, la règle des points), puis celui d'APRÈS (gris, cadenas).
// Les autres territoires fermés ne sont pas montrés. Un lien discret garde le « jamais bloquant » : tout ouvrir d'un coup.
function territoireApres(suivant) {
  if (!suivant) return null;
  const ouverts = territoiresOuverts().concat(suivant).map(centreTerritoire).filter(Boolean);
  const dist = t => { const c = centreTerritoire(t); return c && ouverts.length ? Math.min(...ouverts.map(o => Math.hypot(o[0] - c[0], o[1] - c[1]))) : 0; };
  return territoiresFermes().filter(t => t !== suivant).sort((a, b) => dist(a) - dist(b))[0] || null;
}
// Étape 267, revue à l'étape 268 (maquette A de la série 3, retenue par l'utilisateur) :
//   sur un fond beige, la carte de France à gauche (le prochain territoire cerné de pointillés ocre),
//   et à droite un bandeau de cartes postales qui défile : les territoires ouverts, le prochain (« S'ouvre dans N points »
//   + barre), puis les suivants (« Plus tard »), du plus proche au plus lointain. La carte coupée au bord s'efface en fondu ;
//   une flèche ronde fait défiler (› à droite, ‹ à gauche quand on a avancé).
function territoiresSuivants(suivant) {
  const reste = [];
  for (let t = territoireApres(suivant), deja = [suivant]; t; ) {
    reste.push(t); deja.push(t);
    const ouv = territoiresOuverts().concat(deja).map(centreTerritoire).filter(Boolean);
    const dist = x => { const c = centreTerritoire(x); return c ? Math.min(...ouv.map(o => Math.hypot(o[0] - c[0], o[1] - c[1]))) : 0; };
    t = territoiresFermes().filter(x => !deja.includes(x)).sort((a, b) => dist(a) - dist(b))[0] || null;
  }
  return reste;
}
// Étape 269 : sous le nom, le nombre d'espèces qu'il reste à découvrir dans ce territoire
function aDecouvrir(t) {
  const n = especesDe(t).filter(e => !estReconnue(e)).length;
  return n ? `${nombre(n)} espèce${n > 1 ? "s" : ""} à découvrir` : "Toutes découvertes";
}
function dessinerTerritoiresAccueil() {
  const tete = document.getElementById("terr-tete"), zone = document.getElementById("terr-car");
  if (!zone) return;
  const ouverts = territoiresOuverts(), ici = territoireActif();
  const suivant = territoiresFermes().length ? prochainTerritoire() : null;
  const reste = suivant ? territoiresSuivants(suivant) : [];
  const manque = avantProchainTerritoire(), palier = palierOuverture();
  const fait = manque === null ? 0 : Math.max(0, Math.min(palier, palier - manque));
  const couleur = t => (TERRITOIRES[t] || {}).couleur || "#7a736a";
  const photo = t => photoTerritoire(t, typeof IDENTITE !== "undefined" ? IDENTITE[t] : null).fichier;
  const carte = (t, classe, ligne, barre, titre) => `<${classe.includes("ouvert") ? "button" : "div"} class="pc ${classe}" data-t="${echapper(t)}"`
    + ` style="--c:${couleur(t)}"${titre ? ` title="${echapper(titre)}"` : ""}>
      <span class="pc-ph"><img src="${photo(t)}" alt="" onerror="this.remove()">${classe.includes("ouvert") ? "" : `<span class="pc-cad" aria-hidden="true">🔒</span>`}</span>
      <span class="pc-bas"><b>${t}</b><span class="pc-reste">${aDecouvrir(t)}</span><small>${ligne}</small><i><em style="width:${barre}%"></em></i></span></${classe.includes("ouvert") ? "button" : "div"}>`;
  // Étape 270 : la carte du territoire où l'on est remplace l'encadré « Reprendre votre exploration » : plus large, en tête,
  // avec l'étiquette, les espèces à découvrir, la nature connue et le bouton « Accéder au territoire »
  const carnetIci = carnetDe(especesDe(ici)), pctIci = carnetIci.pct;
  let h = `<div class="pc ouvert ici large" data-t="${echapper(ici)}" style="--c:${couleur(ici)}">
      <span class="pc-ph"><img src="${photo(ici)}" alt="" onerror="this.remove()"></span>
      <span class="pc-bas"><span class="pc-et">Reprendre votre exploration</span><b>${ici}</b>
        <span class="pc-reste">${aDecouvrir(ici)} · ${carnetIci.pctTexte} % de sa nature connue</span>
        <i><em style="width:${pctIci}%"></em></i>
        <button class="pc-acceder">Accéder au territoire <span aria-hidden="true">→</span></button></span></div>`;
  h += ouverts.filter(t => t !== ici).map(t => { const c = carnetDe(especesDe(t));
    return carte(t, "ouvert", `${c.pctTexte} %`, c.pct); }).join("");
  if (suivant) h += carte(suivant, "suivant", manque ? `Encore ${texteManque(manque)}` : "S'ouvre !",
    Math.round(100 * fait / palier), PHRASE_OUVERTURE);   // étape R91 : des lieux terminés, plus des « points » (règle de l'étape PR4)
  h += reste.map(t => carte(t, "ferme", "Plus tard", 0)).join("");
  const nbTous = tousLesTerritoires().length;
  tete.innerHTML = `<h2>Vos territoires</h2><span>${ouverts.length} ouvert${ouverts.length > 1 ? "s" : ""} sur ${nbTous} · ${carnetDe(ESPECES).pctTexte} % de la nature de France connue</span>`
    ;   // étape R91 : plus de lien « ouvrir tous les territoires » ici (Tout débloquer est dans À propos)
  zone.innerHTML = `<div class="terr-piste" id="terr-piste">${h}</div>
    <button class="terr-fl gauche" id="terr-gauche" aria-label="Revenir">‹</button>
    <button class="terr-fl droite" id="terr-droite" aria-label="Voir les territoires suivants">›</button>`;
  zone.querySelectorAll(".pc.ouvert").forEach(b => b.onclick = () => { changerTerritoire(b.dataset.t); montrer("accueil"); window.scrollTo(0, 0); });
  // le prochain territoire, cerné sur la carte
  document.querySelectorAll("#carte-territoires path.prochain").forEach(p => p.classList.remove("prochain"));
  if (suivant) document.querySelectorAll("#carte-territoires path[data-nom]").forEach(p => { if (p.dataset.nom === suivant) p.classList.add("prochain"); });
  // le défilement : deux cartes à la fois ; les flèches et le fondu n'apparaissent que s'il y a quelque chose de ce côté
  const piste = document.getElementById("terr-piste");
  const maj = () => {
    const finD = piste.scrollLeft + piste.clientWidth >= piste.scrollWidth - 4, finG = piste.scrollLeft <= 4;
    zone.classList.toggle("plus-droite", !finD); zone.classList.toggle("plus-gauche", !finG);
  };
  const pas = () => 2 * ((piste.querySelector(".pc") || {}).offsetWidth + 12 || 300);
  document.getElementById("terr-droite").onclick = () => piste.scrollBy({ left: pas(), behavior: "smooth" });
  document.getElementById("terr-gauche").onclick = () => piste.scrollBy({ left: -pas(), behavior: "smooth" });
  piste.onscroll = maj;
  const tout = document.getElementById("pc-tout");
  if (tout) tout.onclick = () => { territoiresOuvertsListe = null; sauvegarder(); afficherPageCarte(); };
  requestAnimationFrame(maj);
}


// ==================================================================
// Étapes 281-282 (25/10) : LA PAGE DU TERRITOIRE MET LE JEU EN AVANT
//   • le rang dans le territoire, d'après ses EMPREINTES (étape 282, 17_expeditions.js) : Promeneur → … → Gardien ;
//   • les défis du jour : 3 par territoire et par jour, sans pénalité ; chacun réussi = 1 empreinte (suivi.empreintesBonus) ;
//   • les prochaines récompenses : rang suivant, territoire suivant, prochaine expédition.
// ==================================================================
const RANGS_TERRITOIRE = [{ nom: "Promeneur" }, { nom: "Observateur" }, { nom: "Pisteur" }, { nom: "Naturaliste" }, { nom: "Gardien" }];
function nomRang(i, t) { return i === RANGS_TERRITOIRE.length - 1 ? `Gardien ${deTerritoire(t)}` : RANGS_TERRITOIRE[i].nom; }
function rangTerritoire(t) { return rangEmpreintes(t); }
// Une fête quand on monte de rang (jamais au premier passage : on note seulement où l'on en est)
function verifierMonteeRang(t, r) {
  if (!suivi) return;
  suivi.rangsTerritoire = suivi.rangsTerritoire || {};
  const avant = suivi.rangsTerritoire[t];
  suivi.rangsTerritoire[t] = r.i;
  if (avant === undefined || r.i <= avant) { if (avant === undefined) sauvegarder(); return; }
  sauvegarder();
  if (r.i >= RANGS_EMPREINTES.length) return;          // étape PR1 : Gardien = la fête du site remarquable, déjà faite
  const couleur = TERRITOIRES[t] ? TERRITOIRES[t].couleur : "#1F3A2E";
  feter({ etiquette: `Nouveau rang ${deTerritoire(t)}`, titre: r.nom, son: "badge",
          detail: r.suivant ? (r.suivant.gardien ? `Prochain rang : ${r.suivant.nom} — ${r.suivant.texte}.` : `Prochain rang : ${r.suivant.nom}, à ${r.suivant.seuil} empreintes.`) : "Le plus haut rang du territoire !",
          visuel: `<div class="fete-visuel rang exp-fete" style="color:${couleur}">${PAS_SVG}</div>` });
}

// ---- Les prochaines récompenses ----
function recompenseTerritoire() {
  const m = avantProchainTerritoire();
  if (m === null) return null;
  const palier = palierOuverture(), t = prochainTerritoire();
  return { cle: "territoire", titre: `${t} s'ouvre`, reste: m ? `encore ${texteManque(m)}` : "c'est pour maintenant !",   // étape PR4 : en lieux terminés
           part: Math.max(0, Math.min(1, (palier - Math.min(m, palier)) / palier)), couleur: TERRITOIRES[t] ? TERRITOIRES[t].couleur : "" };
}
function recompenseRang(t) {
  const r = rangTerritoire(t);
  if (!r.suivant) return null;
  if (r.suivant.gardien) return { cle: "rang", titre: `Rang ${r.suivant.nom}`, reste: r.suivant.texte, part: Math.max(0, Math.min(1, r.suivant.part)) };   // étape PR1
  return { cle: "rang", titre: `Rang ${r.suivant.nom}`, reste: `${r.empreintes} / ${r.suivant.seuil} empreintes`, part: Math.max(0, Math.min(1, r.suivant.part)) };
}
function recompenseExpedition(t) {
  if (typeof aDesLieux === "function" && aDesLieux(t)) {   // étape 290 : la prochaine récompense = le prochain lieu
    const c = prochainLieu(t);
    if (!c) return null;
    const p = lieuPrecedent(t, c), s = p ? paliersLieu(t, p)[2] : 0, n = p ? empreintesDuLieu(t, p) : 0;   // étape R133 : l'argent du lieu d'avant
    return { cle: "expedition", titre: `${c.nom} s'ouvre`, reste: texteManqueLieu(t, c), part: s ? Math.min(1, n / s) : 1 };
  }
  if (aDesChapitres(t)) {                         // étape 287 : la prochaine récompense du chemin = le carrefour suivant
    const c = chapitreCourant(t), suivants = c ? chapitresDe(t).filter(p => p.carrefour === c.carrefour + 1) : [];
    if (!suivants.length || carrefourOuvert(t, c.carrefour + 1)) return null;
    const f = finiesChapitre(t, c.nom), m = FINIES_POUR_CARREFOUR - f;
    return { cle: "expedition", titre: `Carrefour : ${suivants.map(p => p.nom.toLowerCase()).join(" ou ")}`,
             reste: `encore ${m} expédition${m > 1 ? "s" : ""} à terminer`, part: f / FINIES_POUR_CARREFOUR };
  }
  const ouvertes = expeditionsOuvertes(t), fermee = expeditionsDe(t).find(x => !ouvertes.has(x.id));
  if (!fermee) return null;
  const nouvelles = expeditionsDe(t).filter(x => etatExpedition(x, ouvertes) === "nouvelle").length;
  const enCours = expeditionsDe(t).filter(x => ouvertes.has(x.id) && empreintesExp(x) === 0 && expeditionCommencee(x));
  const meilleure = enCours.map(x => avanceeEtape(x, 1)).sort((a, b) => b.faites / b.total - a.faites / a.total)[0];
  return { cle: "expedition", titre: `Expédition « ${fermee.titre} »`,
           reste: nouvelles ? "commencez une expédition" : "finissez une étape 1",
           part: meilleure ? meilleure.faites / meilleure.total : 0 };
}
function recompensePrincipale(t) { return recompenseRang(t) || recompenseTerritoire(); }

// ---- Les défis du jour (par territoire) ----
const POINTS_DEFI = 2;   // étape PR1 : 2 empreintes par défi réussi (1 avant)
function expAuHasard(t, filtre) { const l = expeditionsDe(t).filter(filtre); return l.length ? l[Math.floor(Math.random() * l.length)] : null; }
const SORTES_DEFI = {
  etape:     { texte: d => `Finir l'étape ${d.etape} de « ${(expeditionParId(d.exp) || {}).titre || "?"} »`,
               creer: t => { const ouv = expeditionsOuvertes(t); const x = expAuHasard(t, y => ouv.has(y.id) && expeditionCommencee(y) && etapeEnCours(y));
                             return x ? { exp: x.id, etape: etapeEnCours(x), but: 1, depart: 0 } : null; },
               mesure: (t, d) => { const x = expeditionParId(d.exp); return x && etapeFinie(x, d.etape) ? 1 : 0; } },
  commencer: { texte: d => `Commencer « ${(expeditionParId(d.exp) || {}).titre || "?"} »`,
               creer: t => { const ouv = expeditionsOuvertes(t), pref = expeditionAReprendre(t);   // étape R149 : d'abord celle que le lieu propose
                             const x = pref && !expeditionCommencee(pref) ? pref : expAuHasard(t, y => ouv.has(y.id) && !expeditionCommencee(y));
                             return x ? { exp: x.id, but: 1, depart: x.liste.filter(estIdentifiee).length } : null; },
               mesure: (t, d) => { const x = expeditionParId(d.exp); return x ? x.liste.filter(estIdentifiee).length - d.depart : 0; } },
  decouvrir: { texte: d => `Découvrir ${d.but} espèce${d.but > 1 ? "s" : ""} nouvelle${d.but > 1 ? "s" : ""}`,
               creer: t => { const n = especesDe(t).filter(e => estRenseigne(e.photo) && !estReconnue(e)).length;
                             return n ? { but: Math.min(3, n), depart: especesDe(t).filter(estReconnue).length } : null; },
               mesure: (t, d) => especesDe(t).filter(estReconnue).length - d.depart },
  // Étape R129 (05/11, choix de l'utilisateur) : à la place de « Gagner N médailles » (les médailles quittent l'expédition,
  // R130), découvrir des choses nouvelles sur des espèces déjà dans le carnet — ce que les expéditions n'ont pas tiré.
  inedites:  { texte: d => `Découvrir ${d.but} chose${d.but > 1 ? "s" : ""} nouvelle${d.but > 1 ? "s" : ""} sur vos espèces`,
               creer: t => { const n = especesDe(t).filter(e => estIdentifiee(e)).reduce((s, e) => s + champsReste(e).length, 0);
                             return n ? { but: Math.min(5, n), depart: casesTrouveesTerritoire(t) } : null; },
               mesure: (t, d) => casesTrouveesTerritoire(t) - d.depart },
};
function casesTrouveesTerritoire(t) {   // étape R129 : les cases trouvées sur les espèces du territoire
  return especesDe(t).filter(estIdentifiee).reduce((s, e) => s + questionsPossibles(e).filter(q => nbBonnes(e, q.champ) >= 1).length, 0);
}
// Étape R129 : l'espèce du territoire, déjà dans le carnet, qui a le plus de choses à découvrir (pour le défi « inédites »)
function especeAvecReste(t) {
  const l = especesDe(t).filter(e => estIdentifiee(e) && estRenseigne(e.photo)).map(e => ({ e, n: champsReste(e).length })).filter(x => x.n);
  if (!l.length) return null;
  const max = Math.max(...l.map(x => x.n));
  return auHasard(l.filter(x => x.n >= max - 2)).e;
}
function nouveauxDefis(t) {
  const liste = [];
  for (const sorte of ["etape", "commencer", ...melanger(["decouvrir", "inedites"])]) {
    if (liste.length >= 3) break;
    const d = SORTES_DEFI[sorte].creer(t);
    if (d) liste.push({ sorte, ...d, reussi: false });
  }
  return liste;
}
function avanceeDefi(t, d) { const s = SORTES_DEFI[d.sorte]; return s ? Math.max(0, Math.min(d.but, s.mesure(t, d))) : 0; }
// Met à jour les défis du territoire : nouveaux chaque jour ; marque ceux qui viennent d'être réussis (rendus)
function verifierDefis(t) {
  if (!suivi || !t) return [];
  suivi.defis = suivi.defis || {};
  let d = suivi.defis[t];
  if (!d || d.jour !== aujourdhui() || d.liste.some(x => !SORTES_DEFI[x.sorte])) { d = suivi.defis[t] = { jour: aujourdhui(), liste: nouveauxDefis(t) }; sauvegarder(); }
  const reussis = d.liste.filter(x => !x.reussi && avanceeDefi(t, x) >= x.but);
  if (reussis.length) {
    reussis.forEach(x => x.reussi = true);
    suivi.defisReussis = (suivi.defisReussis || 0) + reussis.length;
    ajouterEmpreinteBonus(t, POINTS_DEFI * reussis.length);
    if (typeof verifierOuverture === "function") verifierOuverture();
  }
  return reussis;
}
function texteDefi(d) { return SORTES_DEFI[d.sorte].texte(d); }
function dessinerDefis(t) {
  const zone = document.getElementById("ac-defis");
  if (!zone) return;
  verifierDefis(t);
  const liste = (suivi && suivi.defis && suivi.defis[t]) ? suivi.defis[t].liste : [];
  zone.classList.remove("cache");
  zone.innerHTML = `
    <div class="jeu-encart">
      <div class="etiq-jeu">Défis du jour</div><p class="jeu-sous">Chaque défi réussi = ${POINTS_DEFI} empreintes · nouveaux défis demain, aucun malus</p>
      ${liste.length ? `<div class="defis">${liste.map((d, i) => {
        const fait = avanceeDefi(t, d), ok = d.reussi || fait >= d.but;
        return `<div class="defi${ok ? " ok" : ""}${(d.exp || d.sorte === "inedites") && !ok ? " cliquable" : ""}" data-i="${i}"><span class="defi-case" aria-hidden="true">${ok ? "✓" : ""}</span>
          <span class="defi-texte">${texteDefi(d)}${d.but > 1 && !ok ? `<small>${fait} sur ${d.but}</small>` : ""}</span>
          <span class="defi-gain">${ok ? "réussi" : "+" + POINTS_DEFI} ${PAS_SVG}</span></div>`;
      }).join("")}</div>` : `<p class="jeu-sous">Tout est déjà découvert ici : bravo !</p>`}
    </div>
    <details class="jeu-encart regles-empreintes"><summary>Comment gagner des empreintes ?</summary>
      <p class="jeu-sous petit">1 empreinte par espèce découverte en expédition, +${GAIN_FIN_EXPEDITION} à la fin de l'expédition, +${EMPREINTES_FINALE} par finale, +${POINTS_DEFI} par défi. Elles remplissent la médaille du lieu : l'argent ouvre le lieu suivant. Un nouveau territoire dès le premier lieu terminé, puis tous les ${LIEUX_PAR_TERRITOIRE} lieux.</p>
    </details>`;
  zone.querySelectorAll(".defi.cliquable").forEach(b => b.onclick = () => {
    const d = liste[Number(b.dataset.i)];
    if (d.sorte === "inedites") { lancerCarnet(false); return; }   // étape R167 (avant, R129 : la Rencontre d'une seule espèce)
    const x = expeditionParId(d.exp); if (x) ouvrirExpedition(x); });
}
// En fin de partie : les défis du jour (remplace « Vos objectifs » depuis l'étape 281)
function blocDefisFin() {
  const t = territoireActif();
  if (!suivi || !t) return "";
  const reussis = verifierDefis(t);
  if (reussis.length) setTimeout(() => afficherBulle(`✓ Défi du jour réussi${reussis.length > 1 ? ` (${reussis.length})` : ""} · +${POINTS_DEFI * reussis.length} empreinte${POINTS_DEFI * reussis.length > 1 ? "s" : ""}`), 900);
  const liste = suivi.defis && suivi.defis[t] ? suivi.defis[t].liste : [];
  if (!liste.length) return "";
  const lignes = liste.map(d => {
    const fait = avanceeDefi(t, d), ok = d.reussi;
    return `<span class="obj-fin${ok ? " atteint" : ""}">${ok ? "✓ " : ""}${texteDefi(d)}${ok ? "" : ` · ${fait} / ${d.but}`}</span>`;
  });
  return `<div class="objectifs-fin"><div class="quoi">Défis du jour</div><div class="liste-objectifs-fin">${lignes.join("")}</div>`
    + (reussis.length ? `<small>+${POINTS_DEFI * reussis.length} empreinte${POINTS_DEFI * reussis.length > 1 ? "s" : ""}.</small>` : "") + `</div>`;
}

// =====================================================================================================
// Étape M4 (06/11/2026, choix de l'utilisateur : maquette A « Reprendre » + l'espèce du jour sous le lien de la carte)
// Sur téléphone, l'accueil = la page du territoire, sans le grand bandeau photo : en tête, une carte « Reprendre »
// (photo du lieu, expédition, étape, espèces, bouton), puis le territoire et son rang, les lieux, les défis,
// le lien vers la carte de France et l'espèce du jour. Ces deux blocs sont cachés sur ordinateur (style.css, étape M4).
// =====================================================================================================
function dessinerAccueilMobile(t) {
  const vue = document.getElementById("vue-accueil");
  if (!vue) return;
  let haut = document.getElementById("ac-mobile"), bas = document.getElementById("ac-mobile-bas");
  if (!haut) { haut = document.createElement("section"); haut.id = "ac-mobile"; vue.insertBefore(haut, document.getElementById("ac-couverture")); }
  if (!bas) { bas = document.createElement("section"); bas.id = "ac-mobile-bas"; const d = document.getElementById("ac-defis"); d.parentNode.insertBefore(bas, d.nextSibling); }
  const couleur = (TERRITOIRES[t] || {}).couleur || "#1F3A2E";
  haut.style.setProperty("--couleur-territoire", couleur);
  // Étape M7 (06/11, demande de l'utilisateur : « reprendre depuis le lieu et non l'expédition ») : la carte « Reprendre »
  // présente le lieu en cours et ouvre sa page ; l'expédition à suivre y est seulement rappelée.
  const x = typeof expeditionAReprendre === "function" ? expeditionAReprendre(t) : null;
  const lieu = (typeof lieuDernierJoue === "function" && lieuDernierJoue(t)) || (x && x.chapitre ? chapitreParNom(t, x.chapitre) : null);
  let carte;
  if (lieu) {
    const liste = expeditionsDuChapitre(t, lieu.nom);
    const finies = liste.filter(y => empreintesExp(y) >= NB_ETAPES).length;
    const ici = x && x.chapitre === lieu.nom ? x : null;
    const commence = liste.some(y => expeditionCommencee(y));
    carte = `<div class="acm-photo"><img src="${lieu.photo}" alt="${echapper(lieu.nom)}">
        <div class="acm-titre"><small>${iconeNiveau("lieu")}${commence ? "Reprendre le lieu" : "Votre premier lieu"}</small><b>${echapper(lieu.nom)}</b></div></div>
      <div class="acm-corps"><p><b>${finies} expédition${finies > 1 ? "s" : ""} terminée${finies > 1 ? "s" : ""} sur ${liste.length}</b>${ici ? ` · à suivre : ${echapper(ici.titre)}` : ""}</p>
        <i class="acm-jauge"><b style="width:${Math.round(100 * finies / Math.max(1, liste.length))}%"></b></i>
        <button class="couv-go" id="acm-go" type="button">${commence ? "Continuer" : "Entrer dans le lieu"} <span aria-hidden="true">▶</span></button></div>`;
  } else if (x) {
    carte = `<div class="acm-corps"><p>${echapper(x.titre)}</p>
      <button class="couv-go" id="acm-go" type="button">Continuer l'expédition <span aria-hidden="true">▶</span></button></div>`;
  } else {
    carte = `<div class="acm-corps"><p>Toutes les expéditions ouvertes de ce territoire sont terminées.</p>
      <button class="couv-go" id="acm-go" type="button">Jouer <span aria-hidden="true">▶</span></button></div>`;
  }
  // Étape M8 (07/11, choix B « Trois visages ») : le territoire a sa couleur et sa carte, en tête de l'accueil
  const nbLieux = typeof lieuxDe === "function" ? lieuxDe(t).length : 0;
  haut.innerHTML = `<div class="acm-bande" style="--couleur-territoire:${couleur}">
      <div class="acm-bande-texte"><div class="rep-etiq">${iconeNiveau("territoire")}Territoire</div><h2>${t}</h2>
        <small>${nbLieux ? `${nbLieux} lieux · ` : ""}${nombre(especesDe(t).length)} espèces</small></div>
      ${miniCarteTerritoire(t)}</div>
    <div class="acm-carte">${carte}</div>
    <section class="terr-m" id="terr-m"></section>`;   // étape M25 : la page du territoire du téléphone (carte + lieux)
  dessinerTerrMobile(t);
  document.getElementById("acm-go").onclick = () => {
    if (lieu) { ouvrirLieu(t, lieu.nom); return; }                       // étape M7 : on entre dans le lieu
    const y = expeditionAReprendre(t); if (y) lancerExpedition(y); else lancerJouer();
  };
  // Étape M9 : l'espèce du jour est passée dans la page d'accueil (« maison ») ; ici, seulement le lien vers la carte de France
  bas.innerHTML = `<button class="acm-lien-carte" id="acm-carte" type="button">Voir la carte de France <span aria-hidden="true">→</span></button>`;
  document.getElementById("acm-carte").onclick = () => { montrer("carte"); window.scrollTo(0, 0); };
}


// =====================================================================================================
// Étape M25 (07/11/2026, choix d'Aubin : maquette A5 « la photo, la carte et la liste, sans numéros, avec sélection »)
// Sur téléphone, en tête de la page du territoire : la photo du site remarquable avec, à gauche, la petite France, le nom
// et le rang ; à droite, la carte des lieux à leur vraie place. Dessous, la liste des lieux : un seul est « sélectionné »
// (au départ, le lieu en cours) : son point s'allume en ocre sur la carte et sa carte s'ouvre (Continuer / Entrer, ou
// ce qui manque pour l'ouvrir). Toucher un lieu ou un point de la carte le sélectionne. Quand on descend, la bannière
// se réduit et reste en haut (« Sur la carte : … »). Remplace sur téléphone la bande, le rang et le carrousel des lieux.
// =====================================================================================================
let lieuSelTerr = null;   // { t, nom } : le lieu sélectionné sur la page du territoire (téléphone)
function dessinerTerrMobile(t) {
  const zone = document.getElementById("terr-m");
  if (!zone || typeof lieuxDe !== "function") return;
  const lieux = lieuxDe(t), site = siteRemarquable(t);
  if (!lieux.length) { zone.innerHTML = ""; return; }
  if (!lieuSelTerr || lieuSelTerr.t !== t || !lieux.some(c => c.nom === lieuSelTerr.nom) && !(site && site.nom === lieuSelTerr.nom)) {
    const c0 = lieuDernierJoue(t) || lieux.find(c => chapitreOuvert(t, c)) || lieux[0];
    lieuSelTerr = { t, nom: c0.nom };
  }
  const r = rangTerritoire(t), ouverts = lieux.filter(c => chapitreOuvert(t, c)).length;
  const photo = (site && site.photo) || lieux[0].photo;
  const carte = typeof carteDesLieux === "function" ? carteDesLieux(t, { largeur: 150, hauteur: 150, point: 0.75 }) : "";
  zone.innerHTML = `<div class="tm-ban">
      <img class="tm-fond" src="${photo}" alt="">
      <div class="tm-gauche">
        <div class="tm-plein"><div class="tm-etiq">${typeof miniFrance === "function" ? miniFrance(t) : ""}<span>Territoire</span></div>
          <h2>${echapper(t)}</h2><small>${lieux.length} lieux · ${nombre(especesDe(t).length)} espèces</small>
          <div class="tm-rang"><b>${echapper(r.nom)}</b>${r.suivant ? ` · ${echapper(r.suivant.nom)} à ${nombre(r.suivant.seuil)}` : ""}</div>
          <i class="tm-jauge"><b style="width:${Math.round(100 * (r.suivant ? r.suivant.part : 1))}%"></b></i></div>
        <div class="tm-reduit"><div class="tm-etiq"><span>Sur la carte</span></div><h2 class="tm-sel-nom"></h2><small>${echapper(t)}</small></div>
      </div>
      <div class="tm-carte">${carte}</div></div>
    ${ligneProchainTerritoire("tm-prochain-terr")}
    <div class="tm-tete"><h2>Vos lieux</h2><small>${ouverts} ouvert${ouverts > 1 ? "s" : ""} sur ${lieux.length}</small></div>
    <div class="tm-liste"></div>`;
  majTerrMobile(t);
  zone.querySelectorAll(".tm-carte .cl-lieu[data-lieu]").forEach(g => {
    g.onclick = ev => { ev.stopPropagation(); selectionnerLieuTerr(t, g.dataset.lieu, true); };
    g.onkeydown = ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); selectionnerLieuTerr(t, g.dataset.lieu, true); } };
  });
  if (!window.__terrMScroll) { window.__terrMScroll = true; window.addEventListener("scroll", majBanniereTerr, { passive: true }); }
  majBanniereTerr();
}
function selectionnerLieuTerr(t, nom, defiler) {
  lieuSelTerr = { t, nom };
  majTerrMobile(t);
  if (defiler) {
    const el = document.querySelector(`#terr-m .tm-lieu.sel`);
    if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
}
function majTerrMobile(t) {
  const zone = document.getElementById("terr-m");
  if (!zone) return;
  const lieux = lieuxDe(t), site = siteRemarquable(t), sel = lieuSelTerr && lieuSelTerr.nom, prochain = prochainLieu(t);
  const x = typeof expeditionAReprendre === "function" ? expeditionAReprendre(t) : null;
  const ligne = (c, estSite) => {
    const ouvert = chapitreOuvert(t, c), etat = estSite ? (ouvert ? "ouvert" : "ferme") : etatLieu(t, c);
    const pro = !estSite && !ouvert && c === prochain;
    const liste = estSite ? [] : expeditionsDuChapitre(t, c.nom), finies = liste.filter(y => empreintesExp(y) >= NB_ETAPES).length;
    const n = estSite ? 0 : especesLieu(t, c);
    const quoi = estSite ? (ouvert ? "Le site remarquable · révision du territoire" : "Le site remarquable · à la fin du territoire")
      : etat === "cours" ? (finaleAJouer(t, c) ? "Finale à jouer" : `En cours · ${finies} sur ${liste.length}`) : etat === "fini" ? "Terminé"
      : etat === "ouvert" ? (c.pays ? `${c.pays} · à découvrir` : "À découvrir")   // étape R149 : le département reste visible
      : pro ? (lieuPrecedent(t, c) ? `S'ouvre à l'argent ${echapper(deLieu(lieuPrecedent(t, c).nom))} · ${minuscule(texteManqueLieu(t, c, true))}` : "Le prochain lieu") : (c.pays || "Plus tard");   // étape R160 (C2)
    if (c.nom !== sel) {
      return `<button type="button" class="tm-lieu ${etat}${pro ? " prochain" : ""}${estSite ? " site" : ""}" data-lieu="${echapper(c.nom)}">
          <span class="tm-ph">${imgMini(c.photo, "")}</span><i class="tm-pt" aria-hidden="true"></i>
          <span class="tm-txt"><b>${echapper(c.nom)}</b><small>${quoi}</small></span>${ouvert ? "" : `<span class="tm-cadenas" aria-hidden="true"></span>`}</button>`;
    }
    const finaleIci = !estSite && finaleAJouer(t, c);   // étape R149
    const tag = estSite ? "Le site remarquable" : finaleIci ? "Finale à jouer" : etat === "cours" ? `En cours · ${finies} sur ${liste.length}` : etat === "fini" ? "Terminé" : etat === "ouvert" ? "À découvrir" : pro ? "Le prochain lieu" : "Plus tard";   // R149 : plus « Ouvert » à côté du bouton
    const suite = !estSite && etat === "cours" && x && x.chapitre === c.nom ? `<span class="tm-suite">À suivre : ${echapper(x.titre)}</span>` : "";
    const pied = ouvert
      ? `<button type="button" class="tm-aller">${estSite ? "Réviser le territoire" : finaleIci ? "Jouer la finale" : etat === "cours" ? "Continuer" : etat === "fini" ? "Revoir le lieu" : "Entrer dans le lieu"} ▶</button>`
      : `<div class="tm-ferme"><span class="tm-cadenas" aria-hidden="true"></span>${estSite ? "S'ouvre quand tous les lieux sont terminés" : pro ? `S'ouvre : ${minuscule(texteManqueLieu(t, c))}` : bulleLieuFerme(t, c, "Ce lieu")}</div>`;
    return `<div class="tm-lieu sel ${etat}${pro ? " prochain" : ""}${estSite ? " site" : ""}" data-lieu="${echapper(c.nom)}">
        <div class="tm-photo">${imgMini(c.photo, "")}<span class="tm-tag">${tag}</span>
          <div class="tm-photo-txt"><b>${echapper(c.nom)}</b><small>${echapper(c.pays || "")}${n ? `${c.pays ? " · " : ""}${n} espèces · ${liste.length} expéditions` : ""}</small>${suite}</div></div>
        ${pied}</div>`;
  };
  zone.querySelector(".tm-liste").innerHTML = lieux.map(c => ligne(c, false)).join("") + (site ? ligne(site, true) : "");
  zone.querySelector(".tm-sel-nom").textContent = sel || "";
  // la carte : le lieu sélectionné en ocre
  zone.querySelectorAll(".tm-carte .cl-lieu").forEach(g => g.classList.toggle("sel", g.dataset.lieu === sel));
  zone.querySelectorAll(".tm-liste button.tm-lieu").forEach(b => b.onclick = () => selectionnerLieuTerr(t, b.dataset.lieu, false));
  const aller = zone.querySelector(".tm-aller");
  if (aller) aller.onclick = () => {
    if (site && sel === site.nom) { ouvrirSite(t); return; }
    const cs = chapitreParNom(t, sel);
    if (cs && finaleAJouer(t, cs) && finaleOuverte(t, cs)) { lancerFinale(t, sel); return; }   // étape R149 : le bouton dit « Jouer la finale »
    ouvrirLieu(t, sel);
  };
}
// Quand on descend : la bannière se réduit et reste en haut ; la place gagnée est rendue au-dessus (pas de saut)
function majBanniereTerr() {
  const zone = document.getElementById("terr-m");
  if (!zone || !zone.getClientRects().length) return;
  const reduit = zone.getBoundingClientRect().top < -70;
  if (zone.classList.contains("reduit") !== reduit) zone.classList.toggle("reduit", reduit);
}

// =====================================================================================================
// Étape M8 (07/11/2026, choix de l'utilisateur : maquette B « Trois visages ») — sur téléphone, chaque niveau a son allure :
// le territoire = sa couleur et sa carte ; le lieu = sa photo de paysage (lui seul) ; l'expédition = une page de carnet
// avec ses espèces. Un symbole fixe par niveau (carte, épingle, jumelles) et une pastille en haut pour remonter d'un niveau.
// Les blocs ajoutés sont cachés sur ordinateur (style.css, étape M8).
// =====================================================================================================
const ICONES_NIVEAU = {
  territoire: '<path d="M3 6.5 9 4l6 2.5 6-2.5v13.5L15 20l-6-2.5L3 20z"/><path d="M9 4v13.5M15 6.5V20"/>',
  lieu: '<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
  expedition: '<circle cx="7" cy="15" r="4"/><circle cx="17" cy="15" r="4"/><path d="M7 11V6.5a1.5 1.5 0 0 1 3 0V11M14 11V6.5a1.5 1.5 0 0 1 3 0V11M10 13.5h4"/>'
};
function iconeNiveau(k) {
  return `<svg class="rep-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONES_NIVEAU[k] || ""}</svg>`;
}
// La France en pâle, le territoire en clair : pour la bande de couleur du territoire
function miniCarteTerritoire(t) {
  if (typeof CARTE_TERRITOIRES === "undefined" || typeof CARTE_CADRE === "undefined") return "";
  return `<svg class="acm-minicarte" viewBox="${CARTE_CADRE}" aria-hidden="true">` + CARTE_TERRITOIRES.map(c =>
    `<path d="${c.contour}" fill="${c.nom === t ? "#FBF8F1" : "rgba(255,255,255,.22)"}" stroke="rgba(0,0,0,.12)" stroke-width="3"/>`).join("") + `</svg>`;
}
// Étape R183b (R183d : plus claire, demande d'Aubin) : la France claire pour la carte « Reprendre » sur fond vert : les autres territoires en crème transparent,
// le territoire à sa couleur avec un contour clair, et un point doré à la vraie place du lieu en cours (LIEUX_CARTE)
function miniCarteLieu(t, lieu) {
  if (typeof CARTE_TERRITOIRES === "undefined" || typeof CARTE_CADRE === "undefined") return "";
  const couleur = (TERRITOIRES[t] || {}).couleur || "#8b3a4a";
  const pt = lieu && typeof LIEUX_CARTE !== "undefined" && LIEUX_CARTE.points ? LIEUX_CARTE.points[`${t}|${lieu.nom}`] : null;
  return `<svg viewBox="${CARTE_CADRE}" role="img" aria-label="${echapper(t)} en France">`
    + CARTE_TERRITOIRES.filter(c => c.nom !== t).map(c => `<path d="${c.contour}" fill="rgba(251,248,241,.74)" stroke="rgba(31,58,46,.28)" stroke-width="4"/>`).join("")
    + CARTE_TERRITOIRES.filter(c => c.nom === t).map(c => `<path d="${c.contour}" fill="${couleur}" stroke="#FBF8F1" stroke-width="9"/>`).join("")
    + (pt ? `<circle cx="${pt[0]}" cy="${pt[1]}" r="38" fill="#E9C9A0" stroke="#1F3A2E" stroke-width="10"/>` : "") + `</svg>`;
}
// La pastille « remonter d'un niveau » (vers le territoire ou vers le lieu)
function pastilleNiveau(k, texte, id, couleur) {
  return `<button class="rep-pastille ${k}" id="${id}" type="button"${couleur ? ` style="--couleur-territoire:${couleur}"` : ""} title="Revenir ${k === "territoire" ? "au territoire" : "au lieu"}">`
    + `<span aria-hidden="true">←</span>${iconeNiveau(k)}<span class="rep-p-texte">${echapper(texte)}</span></button>`;
}


// =====================================================================================================
// Étape M9 (07/11/2026, choix de l'utilisateur sur la page « La vraie page d'accueil » de l'artefact Design :
// « B avec Bonjour Nom et date (pas territoire) de A et espèce du jour de A ») — sur téléphone, l'onglet Accueil
// ouvre une vraie page d'accueil : Bonjour + prénom et date ; le carnet (espèces, rang, dernières découvertes) ;
// « Reprendre le lieu » ; les défis du jour ; l'espèce du jour ; liens vers le territoire et la carte de France.
// =====================================================================================================
function dessinerMaison() {
  const zone = document.getElementById("vue-maison");
  if (!zone) return;
  const t = territoireActif();
  const p = typeof prenomJoueur === "function" ? prenomJoueur() : "";
  const date = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  // Étape M23 (07/11, idée d'Aubin : « reprendre le territoire plutôt que le lieu, on passe trop rarement sur la page du territoire ») :
  //   la carte mène à la page du territoire (rang, lieux, récompenses) ; le lieu en cours y est rappelé en petit.
  const x = typeof expeditionAReprendre === "function" ? expeditionAReprendre(t) : null;
  const lieu = (typeof lieuDernierJoue === "function" && lieuDernierJoue(t)) || (x && x.chapitre ? chapitreParNom(t, x.chapitre) : null);
  const couleurT = (TERRITOIRES[t] || {}).couleur || "#1F3A2E";
  let ligneLieu = "", commence = false;
  if (lieu) {
    const liste = expeditionsDuChapitre(t, lieu.nom), finies = liste.filter(y => empreintesExp(y) >= NB_ETAPES).length;
    commence = liste.some(y => expeditionCommencee(y));
    // Étape R149 : la finale qui attend, et le lieu suivant quand un lieu est terminé
    const unFini = lieuxDe(t).some(c => etatLieu(t, c) === "fini");
    ligneLieu = finaleAJouer(t, lieu) ? `${echapper(lieu.nom)} · la finale vous attend`
      : commence ? `Lieu en cours : ${echapper(lieu.nom)} · ${finies} expédition${finies > 1 ? "s" : ""} sur ${liste.length}`
      : `${unFini ? "Nouveau lieu" : "Premier lieu"} : ${echapper(lieu.nom)}`;
    commence = commence || unFini;
  }
  // Étape R183b (10/11, choix d'Aubin : maquette E « la carte et la photo côte à côte », sur fond vert ; la carte de France reste
  //   pour que le joueur se situe) : à gauche la France (le territoire à sa couleur, un point au lieu en cours), à droite la photo du lieu.
  const photoLieu = lieu && estRenseigne(lieu.photo) ? lieu.photo : "";
  const finiesL = lieu ? expeditionsDuChapitre(t, lieu.nom).filter(y => empreintesExp(y) >= NB_ETAPES).length : 0;
  const totalL = lieu ? expeditionsDuChapitre(t, lieu.nom).length : 0;
  const reprendre = `<button type="button" class="mai-reprendre mai-rep-e" id="mai-reprendre" style="--couleur-territoire:${couleurT}">
        <span class="mai-e-haut"><span class="mai-e-carte">${miniCarteLieu(t, lieu)}</span>
          <span class="mai-e-photo">${photoLieu ? `<img src="${photoMini(photoLieu)}" alt="" onerror="this.onerror=null;this.src='${photoLieu}'">` : ""}</span></span>
        <span class="mai-e-bas"><span class="mai-e-texte"><small>${commence ? "Reprendre" : "Votre territoire"} · ${echapper(t)}</small>
          <b>${lieu ? echapper(lieu.nom) : echapper(t)}</b>${lieu ? `<em>${finaleAJouer(t, lieu) ? "La finale vous attend" : finiesL || expeditionsDuChapitre(t, lieu.nom).some(y => expeditionCommencee(y)) ? `${finiesL} expédition${finiesL > 1 ? "s" : ""} sur ${totalL}` : lieuxDe(t).some(c => etatLieu(t, c) === "fini") ? "Nouveau lieu" : "Premier lieu"}</em>` : ""}
          ${lieu && totalL ? `<i class="mai-e-jauge"><b style="width:${Math.round(100 * finiesL / totalL)}%"></b></i>` : ""}</span>
          <span class="mai-r-go" aria-hidden="true">▶</span></span></button>`;
  // Étape R183b (choix d'Aubin) : plus de carnet sur l'accueil (il est dans le Profil et l'Encyclopédie) ; l'espèce du jour
  //   et les défis du jour remontent juste sous la carte, pour ancrer le jeu dans le quotidien.
  zone.innerHTML = `<div class="mai-page">
      <div class="mai-bonjour"><h1>Bonjour${p ? ` ${echapper(p)}` : ""}</h1><p>${date.charAt(0).toUpperCase() + date.slice(1)}</p></div>
      ${reprendre}
      <div class="ac-jour" id="mai-jour"></div>
      <section class="mai-defis" id="mai-defis"></section>
      <div class="mai-liens">
        <button type="button" class="mai-lien" id="mai-carte">${iconeNiveau("territoire")}<span>Tous les territoires<b>La carte des territoires</b></span><span aria-hidden="true">→</span></button>
      </div></div>`;
  zone.querySelectorAll(".mai-rond").forEach(b => b.onclick = () => { const e = especeParNom(b.dataset.nom); if (e) ouvrirPageEspece(e); });
  document.getElementById("mai-reprendre").onclick = () => { montrer("accueil"); if (typeof dessinerCouverture === "function") dessinerCouverture(); window.scrollTo(0, 0); };   // étape M23 : vers la page du territoire
  document.getElementById("mai-carte").onclick = () => { montrer("carte"); window.scrollTo(0, 0); };
  dessinerDefisMaison(t);
  if (typeof dessinerEspeceDuJour === "function") dessinerEspeceDuJour("mai-jour");
  if (avantProchainTerritoire() === 0) setTimeout(verifierOuverture, 300);   // étape R152 : palier atteint (par ex. règle du premier voyage) → le territoire s'ouvre, avec sa fête
}
// Les défis du jour du territoire, en liste courte (mêmes défis que la page du territoire)
function dessinerDefisMaison(t) {
  const zone = document.getElementById("mai-defis");
  if (!zone) return;
  verifierDefis(t);
  const liste = (suivi && suivi.defis && suivi.defis[t]) ? suivi.defis[t].liste : [];
  if (!liste.length) { zone.classList.add("cache"); return; }
  zone.innerHTML = `<div class="mai-d-haut"><span>Défis du jour</span><small>+${POINTS_DEFI} ${PAS_SVG} chacun · nouveaux demain</small></div>`
    + liste.map((d, i) => {
      const fait = avanceeDefi(t, d), ok = d.reussi || fait >= d.but, clic = (d.exp || d.sorte === "inedites") && !ok;
      return `<${clic ? "button type=\"button\"" : "div"} class="mai-defi${ok ? " ok" : ""}" data-i="${i}"><span class="mai-d-case" aria-hidden="true">${ok ? "✓" : ""}</span>
        <span class="mai-d-texte">${texteDefi(d)}</span><small>${ok ? "réussi" : `${fait}/${d.but}`}</small></${clic ? "button" : "div"}>`;
    }).join("");
  zone.querySelectorAll("button.mai-defi").forEach(b => b.onclick = () => {
    const d = liste[Number(b.dataset.i)];
    if (d.sorte === "inedites") { lancerCarnet(false); return; }   // étape R167
    const x = expeditionParId(d.exp); if (x) ouvrirExpedition(x);
  });
}
