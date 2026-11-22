// 04_fetes.js — Les récompenses : bulles, sons, fêtes et carte d'identité des familles.
// Une partie du programme du jeu, chargée par jeu.html dans l'ordre des numéros.

// ==================================================================
// 8. RÉCOMPENSES DISCRÈTES : bulle + petit son
// ==================================================================

// ==================================================================
// Étape 127 : LA CARTE D'IDENTITÉ D'UNE FAMILLE
//   Le contenu vient de familles.js (FAMILLES_INFO, rempli depuis le tableur
//   familles_cartes_identite.xlsx) : une accroche, 3 signes pour la reconnaître, une note facultative.
// ==================================================================
// Les signes et la note, en HTML (servent à la fois à la fenêtre et au bandeau de l'Encyclopédie)
function htmlSignesFamille(cle) {
  const info = FAMILLES_INFO[cle];
  if (!info) return "";
  return `<ul class="liste-signes">${info.signes.map(t => `<li>${t}</li>`).join("")}</ul>`
       + (info.note ? `<p class="note-famille">${info.note}</p>` : "");
}

// ---- La fenêtre « Nouvelle famille » ----
// Elle s'ouvre quand le joueur identifie la PREMIÈRE espèce d'une famille, une seule fois par famille
// (la liste des familles déjà présentées est gardée dans la sauvegarde : suivi.famillesPresentees).
// Pendant une partie chronométrée, elle attend la fin de la partie pour ne pas gêner.
const famillesEnAttente = [];
function noterNouvelleFamille(espece) {
  const cle = espece.onglet;
  if (!FAMILLES_INFO[cle]) return;
  suivi.famillesPresentees = suivi.famillesPresentees || [];
  if (suivi.famillesPresentees.includes(cle)) return;               // déjà présentée
  // Une autre espèce de cette famille était déjà connue (ancienne sauvegarde) : on ne présente rien
  const autresConnues = ESPECES.some(e => e !== espece && e.onglet === cle && estReconnue(e));
  suivi.famillesPresentees.push(cle);
  if (autresConnues) return;
  famillesEnAttente.push(cle);
  setTimeout(presenterFamillesEnAttente, 1400);   // le temps de voir « Nouvelle espèce »
}
function presenterFamillesEnAttente() {
  const zone = document.getElementById("presentation-famille");
  if (zone.classList.contains("visible") || !famillesEnAttente.length) return;
  // Étape R270 (test du 19/11, n° 28 : « Nouvelle espèce » et « Nouvelle famille » empilées, deux « Continuer ») : la famille
  //   attend que la fête en cours (et celles qui suivent) soit fermée, au lieu d'arriver par-dessus au bout de 1,4 s.
  if (typeof feteOuverte !== "undefined" && (feteOuverte || fileFetes.length || document.getElementById("carte-fete").classList.contains("on"))) { setTimeout(presenterFamillesEnAttente, 400); return; }
  const cle = famillesEnAttente.shift();
  const info = FAMILLES_INFO[cle];
  zone.style.setProperty("--couleur-classe", CLASSES[cle].couleur);
  zone.innerHTML = `<div class="carte-id">
      <svg class="anneau-id" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="22"/>
        <g transform="translate(13.5 13.5) scale(0.52)">${SILHOUETTES[cle] || ""}</g></svg>
      <div class="etiquette">Nouvelle famille</div>
      <h2>${CLASSES[cle].nom}</h2>
      <p class="accroche">${info.accroche}</p>
      ${htmlSignesFamille(cle)}
      <button class="suivant" id="fermer-famille">Continuer</button>
    </div>`;
  zone.classList.add("visible");
  // On ferme d'un clic sur « Continuer », sur le voile autour, ou avec la touche Échap
  const fermer = () => {
    zone.classList.remove("visible");
    document.removeEventListener("keydown", echap);
    setTimeout(presenterFamillesEnAttente, 350);                  // une autre famille attend ? (rare)
  };
  const echap = ev => { if (ev.key === "Escape") fermer(); };
  document.getElementById("fermer-famille").onclick = fermer;
  zone.onclick = ev => { if (ev.target === zone) fermer(); };
  document.addEventListener("keydown", echap);
}

let minuteurBulle;
// Étape R271 (test du 19/11, n° 21 : sur ordinateur, « à récupérer sur l'accueil » renvoyait à l'onglet « Accueil », qui ouvre
//   « Vos territoires », alors que les défis sont sur la page du territoire) : le message dit le bon endroit selon l'appareil.
//   À simplifier en T4, quand « Accueil » ouvrira la page du territoire sur ordinateur aussi (choix 9A du 19/11).
function ouRecuperer() { return "sur l'accueil"; }   // R273 (9A) : sur ordinateur aussi, « Accueil » est la page où l'on récupère
function afficherBulle(texte, duree = 2200) {   // étape R258 : durée au choix
  const bulle = document.getElementById("bulle");
  bulle.textContent = texte;
  bulle.classList.add("visible");
  clearTimeout(minuteurBulle);                              // annule l'ancien minuteur
  minuteurBulle = setTimeout(() => bulle.classList.remove("visible"), duree); // disparaît après 2,2 s (par défaut)
}

// Deux notes très douces, fabriquées par le navigateur (pas de fichier son).
// Étape 142 : tous les sons du jeu sont des « recettes » (bibliothèque ci-dessous, la même que maquette_sons.html).
// Pour changer un son, il suffit de changer son nom ici (les noms possibles sont dans RECETTES_SONS).
// Étape 143 : sons choisis le 12/10 (goutte de bois, arpège de harpe, clochettes, grand arpège)
// Étape 170 (choix du 13/10, maquette_sons_erreur.html) : la mauvaise réponse a un son, le « hou-hou de chouette ».
//   Tous les jeux (le Duel aussi depuis l'étape 171). Pas de son pour « Je ne sais pas » ni pour « Presque ».
// Étape R245 (36.12, choix d'Aubin du 17/11) : famille « Bois doux » partout — une seule recette pour tout le jeu,
//   plus basse et plus douce que les cris (bonne : 2 notes de bois qui montent ; mauvaise : une note grave courte ;
//   fin : 4 notes). Le joueur peut couper ces petits sons dans Réglages (« Petits sons : oui / non ») ; les cris restent.
const SONS_CHOISIS = { carnet: "doux_carnet", bonne: "doux_bonne", medaille: "doux_medaille", badge: "doux_badge", rang: "doux_rang",
                       mauvaise: "doux_mauvaise", fin: "doux_fin", parfaite: "doux_parfaite" };
// ---- Les sons du jeu, fabriqués par le navigateur (aucun fichier) ----
// Chaque son est une « recette » : des notes (en hertz) jouées l'une après l'autre avec un timbre.
//   timbres : "doux" (sinus), "cloche" (sinus + harmonique de cloche), "harpe" (triangle pincé),
//             "bois" (marimba : sinus court), "flute" (attaque lente, léger vibrato), "oiseau" (sifflement qui glisse),
//             "cor" (dent de scie adoucie, accord tenu)
const RECETTES_SONS = {
  // Étape R245 : la famille « Bois doux » (timbre boisdoux : sinus rond, attaque douce, extinction rapide, pas d'harmonique aiguë)
  doux_bonne:     { timbre: "boisdoux", notes: [392, 523], ecart: 0.09, duree: 0.28, volume: 0.07 },
  doux_mauvaise:  { timbre: "boisdoux", notes: [220], ecart: 0, duree: 0.22, volume: 0.075 },
  doux_fin:       { timbre: "boisdoux", notes: [392, 494, 587, 784], ecart: 0.13, duree: 0.45, volume: 0.07 },
  doux_parfaite:  { timbre: "boisdoux", notes: [392, 494, 587, 784, 988], ecart: 0.11, duree: 0.6, volume: 0.07 },
  doux_medaille:  { timbre: "boisdoux", notes: [440, 554, 659], ecart: 0.1, duree: 0.45, volume: 0.07 },
  doux_badge:     { timbre: "boisdoux", notes: [523, 659, 784], ecart: 0.1, duree: 0.45, volume: 0.07 },
  doux_rang:      { timbre: "boisdoux", notes: [392, 494, 587, 784, 988], ecart: 0.1, duree: 0.6, volume: 0.07 },
  // Étape R278 (37.01) : l'espèce se pose dans son carnet — un petit « toc » de bois, deux notes qui descendent
  doux_carnet:    { timbre: "boisdoux", notes: [587, 440], ecart: 0.07, duree: 0.26, volume: 0.065 },
  // Anciennes recettes (gardées pour mémoire, plus utilisées depuis R245)
  // Bonne réponse
  bonne_actuel:   { timbre: "doux",   notes: [660, 880], ecart: 0.12, duree: 0.35, volume: 0.06 },
  bonne_goutte:   { timbre: "bois",   notes: [880, 1320], ecart: 0.07, duree: 0.25, volume: 0.10 },
  bonne_clochette:{ timbre: "cloche", notes: [1568], ecart: 0, duree: 0.6, volume: 0.06 },
  bonne_oiseau:   { timbre: "oiseau", notes: [2200], ecart: 0, duree: 0.18, volume: 0.09 },
  bonne_harpe:    { timbre: "harpe",  notes: [784, 988], ecart: 0.06, duree: 0.4, volume: 0.08 },
  // Médaille d'une espèce
  medaille_actuel:   { timbre: "doux",   notes: [659, 784, 988], ecart: 0.11, duree: 0.9, volume: 0.15 },
  medaille_cloches:  { timbre: "cloche", notes: [988, 1319, 1568], ecart: 0.14, duree: 1.2, volume: 0.10 },
  medaille_harpe:    { timbre: "harpe",  notes: [523, 659, 784, 1047, 1319], ecart: 0.07, duree: 0.9, volume: 0.12 },
  medaille_marimba:  { timbre: "bois",   notes: [523, 784, 1047], ecart: 0.10, duree: 0.5, volume: 0.16 },
  medaille_flute:    { timbre: "flute",  notes: [784, 988, 1175], ecart: 0.16, duree: 0.7, volume: 0.15 },
  // Badge débloqué
  badge_actuel:   { timbre: "doux",   notes: [784, 988, 1175], ecart: 0.11, duree: 0.9, volume: 0.15 },
  badge_clochettes:{ timbre: "cloche", notes: [1568, 2093], ecart: 0.12, duree: 1.0, volume: 0.08 },
  badge_oiseau:   { timbre: "oiseau", notes: [2000, 2600, 2300], ecart: 0.16, duree: 0.16, volume: 0.13 },
  badge_harpe:    { timbre: "harpe",  notes: [659, 784, 988, 1319], ecart: 0.06, duree: 0.8, volume: 0.12 },
  badge_marimba:  { timbre: "bois",   notes: [659, 988], ecart: 0.12, duree: 0.45, volume: 0.16 },
  // Nouveau rang
  rang_actuel:    { timbre: "doux",   notes: [523, 659, 784, 1047], ecart: 0.11, duree: 0.9, volume: 0.15 },
  rang_cor:       { timbre: "cor",    notes: [392, 523, 659, 784], ecart: 0.18, duree: 1.0, volume: 0.16 },
  rang_cloches:   { timbre: "cloche", notes: [523, 784, 1047, 1568], ecart: 0.18, duree: 1.4, volume: 0.10 },
  rang_harpe:     { timbre: "harpe",  notes: [392, 494, 587, 784, 988, 1175, 1568], ecart: 0.06, duree: 1.0, volume: 0.11 },
  rang_flute:     { timbre: "flute",  notes: [587, 784, 988, 1175], ecart: 0.2, duree: 0.8, volume: 0.15 },
  // Mauvaise réponse (étape 170) : deux notes de flûte graves, comme une chouette
  erreur_chouette:{ timbre: "flute",  notes: [440, 349], ecart: 0.32, duree: 0.38, volume: 0.10 },
  // Fin de partie (étape 196) : un petit carillon qui se pose (sol, mi, sol, do aigu), doux et court
  fin_carillon:   { timbre: "cloche", notes: [784, 659, 784, 1047], ecart: 0.17, duree: 1.3, volume: 0.08 },
  // Étape 205 (18/10) : partie SANS FAUTE — un carillon qui monte (do, mi, sol, do, mi, sol aigus), puis un accord de harpe
  fin_parfaite:   { timbre: "cloche", notes: [523, 659, 784, 1047, 1319, 1568], ecart: 0.11, duree: 1.6, volume: 0.075 },
  fin_parfaite_accord: { timbre: "harpe", notes: [1047, 1319, 1568, 2093], ecart: 0.025, duree: 1.8, volume: 0.05 },
};
let contexteAudio = null;
function jouerRecette(nom) {
  const r = typeof nom === "string" ? RECETTES_SONS[nom] : nom;   // étape 165 : on peut aussi donner la recette elle-même
  if (!r) return;
  try {
    contexteAudio = contexteAudio || new (window.AudioContext || window.webkitAudioContext)();
    if (contexteAudio.state === "suspended" && contexteAudio.resume) contexteAudio.resume();   // R275 : préparé d'avance, il peut attendre un premier toucher
    const ctx = contexteAudio, t0 = ctx.currentTime + 0.02;
    r.notes.forEach((f, i) => {
      const t = t0 + i * r.ecart, fin = t + r.duree;
      const sortie = ctx.createGain();
      sortie.connect(ctx.destination);
      const enveloppe = (g, attaque) => {
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(r.volume, t + attaque);
        g.gain.exponentialRampToValueAtTime(0.0001, fin);
      };
      const osc = (type, freq, gainRel = 1) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = type; o.frequency.setValueAtTime(freq, t);
        g.gain.value = gainRel; o.connect(g); g.connect(sortie); o.start(t); o.stop(fin + 0.05);
        return o;
      };
      if (r.timbre === "boisdoux") { sortie.gain.setValueAtTime(0.0001, t); sortie.gain.linearRampToValueAtTime(r.volume, t + 0.012);
                                     sortie.gain.exponentialRampToValueAtTime(0.0001, fin);
                                     const filtre = ctx.createBiquadFilter(); filtre.type = "lowpass"; filtre.frequency.value = 1800; filtre.connect(sortie);
                                     const o1 = ctx.createOscillator(), g1 = ctx.createGain(); o1.type = "sine"; o1.frequency.value = f; g1.gain.value = 1;
                                     o1.connect(g1); g1.connect(filtre); o1.start(t); o1.stop(fin + 0.05);
                                     const o2 = ctx.createOscillator(), g2 = ctx.createGain(); o2.type = "sine"; o2.frequency.value = f * 2; g2.gain.value = 0.18;
                                     o2.connect(g2); g2.connect(filtre); o2.start(t); o2.stop(t + 0.08); }
      if (r.timbre === "doux")   { enveloppe(sortie, 0.02); osc("sine", f); }
      if (r.timbre === "cloche") { enveloppe(sortie, 0.005); osc("sine", f); osc("sine", f * 2.76, 0.35); osc("sine", f * 5.4, 0.12); }
      if (r.timbre === "harpe")  { enveloppe(sortie, 0.004); osc("triangle", f); osc("sine", f * 2, 0.25); }
      if (r.timbre === "bois")   { sortie.gain.setValueAtTime(0.0001, t); sortie.gain.linearRampToValueAtTime(r.volume, t + 0.004);
                                   sortie.gain.exponentialRampToValueAtTime(0.0001, t + Math.min(r.duree, 0.5));
                                   osc("sine", f); osc("sine", f * 4, 0.15); }
      if (r.timbre === "flute")  { enveloppe(sortie, 0.12); const o = osc("sine", f); osc("sine", f * 2, 0.08);
                                   const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 5.5; lg.gain.value = f * 0.006;
                                   lfo.connect(lg); lg.connect(o.frequency); lfo.start(t); lfo.stop(fin); }
      if (r.timbre === "oiseau") { enveloppe(sortie, 0.01); const o = osc("sine", f);
                                   o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 1.5, t + r.duree * 0.6);
                                   o.frequency.exponentialRampToValueAtTime(f * 1.15, fin); }
      if (r.timbre === "cor")    { enveloppe(sortie, 0.06); const filtre = ctx.createBiquadFilter(); filtre.type = "lowpass"; filtre.frequency.value = 1400;
                                   filtre.connect(sortie);
                                   const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = f; o.connect(filtre); o.start(t); o.stop(fin + 0.05); }
    });
  } catch (e) { /* pas de son possible : tant pis */ }
}

// Étape R275 (43.07, lenteurs) : le tout premier petit son de la partie mettait en route le son du navigateur au moment même
//   de la première réponse (40 ms sur ordinateur, jusqu'à 200 ms sur téléphone : la réponse semblait « accrocher »).
//   Il est maintenant mis en route d'avance, à un moment calme, après le premier toucher de l'écran.
function preparerSons() {
  if (contexteAudio || typeof sonActif === "undefined" || !sonActif || !petitsSonsActifs()) return;
  try { contexteAudio = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* pas de son possible : tant pis */ }
}
window.addEventListener("pointerup", () => (window.requestIdleCallback ? requestIdleCallback(preparerSons, { timeout: 1500 }) : setTimeout(preparerSons, 400)), { once: true, passive: true });
// Étape R245 : « Petits sons : oui / non » (Réglages) ; non = aucun petit son, les cris des animaux restent
function petitsSonsActifs() { return !(typeof suivi === "object" && suivi && suivi.petitsSons === false); }
function jouerSon(moment = "bonne") {
  if (!sonActif || moment === null || !petitsSonsActifs()) return;   // étape 212 : null = pas de son (déjà joué)                 // le joueur a répondu qu'il n'a pas le son (étape 51)
  jouerRecette(SONS_CHOISIS[moment]);
}

// ---- Étape 165 : la série du Duel, en sons et en images ----
// Une note qui monte à chaque bonne réponse d'affilée (gamme douce, sans fausse note possible), la même goutte de bois
// que la bonne réponse habituelle. Après 11 d'affilée, on reste sur la note la plus haute.
const GAMME_SERIE = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24];      // en demi-tons au-dessus de la première note
function jouerNoteSerie(n) {
  if (!sonActif || !petitsSonsActifs()) return;
  const f = 392 * Math.pow(2, GAMME_SERIE[Math.min(n, GAMME_SERIE.length) - 1] / 12);   // R245 : bois doux, plus bas
  jouerRecette({ timbre: "boisdoux", notes: [f, f * 4 / 3], ecart: 0.09, duree: 0.28, volume: 0.07 });
}
// Un palier de série : un petit arpège de harpe, plus long à chaque niveau (étape 167)
function jouerSonPalier(niveau) {
  if (!sonActif || !petitsSonsActifs()) return;
  const base = [392, 440, 494, 523, 587][Math.min(niveau, 5) - 1] || 392;   // R245 : bois doux
  const notes = [1, 1.25, 1.5, 2, 2.5, 3].slice(0, 2 + Math.min(niveau, 4)).map(x => base * x);
  jouerRecette({ timbre: "boisdoux", notes, ecart: 0.1, duree: 0.5, volume: 0.07 });
}
// Le bandeau d'un palier de série : « 10 d'affilée ! », quelques étoiles depuis le compteur (le jeu n'est pas coupé)
const COULEURS_NIVEAU = ["var(--texte-doux)", "var(--territoire)", "#3e7b55", "#b98b52", "#c9a227", "#c9a227"];
function annoncerPalier(n) {
  const niveau = niveauSerie(n);
  annoncerBandeau({ etiquette: "Série", titre: `${n} d'affilée !`, detail: MOTS_PALIER[n] || "Inarrêtable",
                    couleur: COULEURS_NIVEAU[niveau], etoiles: 4 + 4 * niveau, sonPalier: niveau });
}
// Étape 166 : le même bandeau sert aussi pour le record battu
function annoncerBandeau({ etiquette, titre, detail, couleur, etoiles, son, sonPalier }) {
  if (!defi) return;
  let b = document.getElementById("bandeau-palier");
  if (!b) { b = document.createElement("div"); b.id = "bandeau-palier"; document.body.appendChild(b); }
  b.style.setProperty("--palier", couleur);
  b.innerHTML = `<div class="etiquette">${etiquette}</div><div class="titre">${titre}</div><div class="detail">${detail}</div>`;
  b.classList.remove("on"); void b.offsetWidth; b.classList.add("on");
  const hud = document.getElementById("serie-defi").getBoundingClientRect();
  setTimeout(() => envolEtoiles(hud.left + hud.width / 2, hud.top + hud.height / 2, etoiles), 120);
  if (sonPalier) jouerSonPalier(sonPalier); else if (son) jouerSon(son);
  clearTimeout(annoncerBandeau.minuteur);
  annoncerBandeau.minuteur = setTimeout(() => b.classList.remove("on"), 2200);
}

// ---- Étape 142 : la fête des grands moments (style A) ----
//   f = { etiquette, titre, detail, visuel (HTML), son ("medaille", "badge" ou "rang"), jauge ({ de, a } en %), pop (la vignette de secours) }
// Les fêtes passent une par une (file d'attente). Pendant une partie chronométrée, on ne coupe pas le jeu :
// la petite vignette du coin (étape 40) les remplace.
const fileFetes = [];
let feteOuverte = false, minuteurFete = null;
const ETOILE_FETE = '<svg viewBox="0 0 24 24"><path d="M12 4 l2.4 5 5.4 .6 -4 3.7 1.1 5.3 -4.9 -2.8 -4.9 2.8 1.1 -5.3 -4 -3.7 5.4 -.6 Z"/></svg>';
// Étape R101 (Revoir 10, « Ça reste affiché, impossible de l'enlever ») : une fête pouvait rester à l'écran sans voile,
//   et un clic ne la fermait plus. Deux causes corrigées : (1) deux fêtes demandées coup sur coup lançaient deux fois
//   la suite (la 2e, sans fête à montrer, notait « plus rien d'ouvert » alors que la carte restait affichée) ;
//   (2) la carte pouvait réapparaître juste après sa fermeture (apparition programmée à l'image suivante).
//   Désormais : une seule suite programmée à la fois, et fermer retire TOUJOURS la carte et le voile.
let suiteProgrammee = false, numeroFete = 0;
function programmerSuiteFetes(delai) {
  if (suiteProgrammee) return;
  suiteProgrammee = true;
  setTimeout(() => { suiteProgrammee = false; suiteFetes(); }, delai);
}
let feteCourante = null;   // étape R153 : la fête à l'écran
const htmlSouvenir = s => `<div class="fete-souvenir"><span class="fs-dessin">${s.image}</span><span><small>Nouveau badge</small><b>${s.titre}</b></span></div>`;
function feter(f) {
  // Étape R153 : un souvenir qui arrive pendant la fête de fin d'étape s'y ajoute, au lieu d'une fête de plus
  if (f.souvenir && feteOuverte && feteCourante && feteCourante.fusion && document.getElementById("carte-fete").classList.contains("on")) {
    const cont = document.querySelector("#carte-fete .continuer");
    if (cont) cont.insertAdjacentHTML("beforebegin", htmlSouvenir(f.souvenir));
    clearTimeout(minuteurFete); minuteurFete = setTimeout(fermerFete, 3600);
    return;
  }
  if (TROIS_TAILLES && f.taille === "petite") { feterPetite(f); return; }   // R277 : un bandeau en haut, le jeu n'est pas coupé
  fileFetes.push(f);
  if (!feteOuverte) programmerSuiteFetes(250);
}

// ==================================================================
// Étape R277 (20/11, Notion 37.02 ; choix 3A d'Aubin) : DES FÊTES DE TROIS TAILLES
//   « Un grand moment ne ressemble pas à un petit. »
//   • petite (f.taille = "petite") : un bandeau en haut de l'écran, 2 secondes, sans voile : le jeu n'est pas coupé
//       → nouveau badge, rang de famille, palier d'une espèce hors expédition ;
//   • moyenne (rien à écrire, c'est la taille par défaut) : la carte au centre, comme avant
//       → étape ou expédition terminée, expédition complète, médaille de bronze ou d'argent, finale du lieu, rang dans le territoire… ;
//   • grande (f.taille = "grande" + f.photo) : plein écran sur la photo du lieu ou du territoire, peu d'étoiles, on la ferme soi-même
//       → médaille d'or, nouveau territoire, rang du carnet, Gardien.
//   TROIS_TAILLES = false : tout redevient la carte au centre, comme avant R277.
// ==================================================================
const TROIS_TAILLES = true;
const DUREE_PETITE_FETE = 2000;                        // 2 secondes
const filePetites = [];
let petiteProgrammee = false, minuteurPetite = null;
function feterPetite(f) {
  filePetites.push(f);
  if (!petiteProgrammee) { petiteProgrammee = true; setTimeout(suitePetites, 300); }   // (le temps qu'une fête de fin d'étape arrive : le badge s'y range)
}
function suitePetites() {
  petiteProgrammee = false;
  if (!filePetites.length) return;
  const carteOn = document.getElementById("carte-fete").classList.contains("on");
  // Un badge gagné en même temps qu'une fin d'étape se range dans sa fête (étape R153), au lieu d'un bandeau de plus
  const exp = feteOuverte && feteCourante && feteCourante.fusion && carteOn ? feteCourante : fileFetes.find(g => g.fusion);
  if (exp) for (let i = filePetites.length - 1; i >= 0; i--) {
    const g = filePetites[i];
    if (!g.souvenir) continue;
    filePetites.splice(i, 1);
    if (exp === feteCourante && carteOn) {
      const cont = document.querySelector("#carte-fete .continuer");
      if (cont) cont.insertAdjacentHTML("beforebegin", htmlSouvenir(g.souvenir));
      clearTimeout(minuteurFete); minuteurFete = setTimeout(fermerFete, 3600);
    } else exp.souvenirs = (exp.souvenirs || []).concat([g.souvenir]);
  }
  if (!filePetites.length) return;
  // Une carte de fête est à l'écran (ou va venir) : le bandeau attend qu'elle soit fermée
  if (feteOuverte || fileFetes.length || carteOn) { petiteProgrammee = true; setTimeout(suitePetites, 400); return; }
  const f = filePetites.shift(), p = f.pop || {};
  let b = document.getElementById("bandeau-fete");
  if (!b) { b = document.createElement("div"); b.id = "bandeau-fete"; b.setAttribute("role", "status"); b.setAttribute("aria-live", "polite"); document.body.appendChild(b); }
  b.style.setProperty("--bf-couleur", p.couleur || "var(--territoire)");
  b.innerHTML = `<span class="bf-rond" aria-hidden="true">${p.image || ""}</span>`
    + `<span class="bf-texte"><small>${f.etiquetteCourte || p.etiquette || f.etiquette || ""}</small><b>${f.titreCourt || p.titre || f.titre || ""}</b></span>`;
  b.classList.remove("on"); void b.offsetWidth; b.classList.add("on");
  jouerSon(f.son);
  clearTimeout(minuteurPetite);
  minuteurPetite = setTimeout(() => {
    b.classList.remove("on");
    if (filePetites.length && !petiteProgrammee) { petiteProgrammee = true; setTimeout(suitePetites, 350); }
  }, DUREE_PETITE_FETE);
}

// ---- Étape R277 (Notion 37.03, choix 4C, première moitié) : la planche des espèces entrées au carnet pendant l'expédition ----
//   Au premier lancement d'une expédition, le jeu note lesquelles de ses espèces sont DÉJÀ au carnet (suivi.departExp, dans la
//   sauvegarde). À la fête « Expédition terminée », les autres espèces du carnet sont celles qui y sont entrées pendant l'expédition.
//   Une expédition déjà commencée avant R277 est notée à sa prochaine ouverture : sa planche ne montre que ce qui entre ensuite
//   (jamais une espèce de trop). Pas de note = pas de planche, la fête est celle d'avant.
function noterDepartExp(x) {
  if (!x || typeof suivi !== "object" || !suivi || !Array.isArray(x.liste)) return;
  suivi.departExp = suivi.departExp || {};
  if (suivi.departExp[x.id] !== undefined) return;
  if (typeof empreintesExp === "function" && empreintesExp(x) >= NB_ETAPES) return;   // expédition déjà terminée : rien à noter
  suivi.departExp[x.id] = x.liste.map((e, i) => estIdentifiee(e) ? i : -1).filter(i => i >= 0).join(",");
  sauvegarder();
}
function especesEntreesExp(x) {
  if (!x || typeof suivi !== "object" || !suivi || !suivi.departExp || suivi.departExp[x.id] === undefined) return [];
  const deja = new Set(String(suivi.departExp[x.id]).split(",").filter(Boolean).map(Number));
  return x.liste.filter((e, i) => !deja.has(i) && estIdentifiee(e));
}
function htmlPlancheFete(especes) {
  const n = especes.length;
  if (!n) return "";
  const colonnes = n <= 5 ? n : Math.ceil(n / 2);     // 6 ou 7 espèces : deux rangées
  return `<div class="fete-planche"><div class="fp-titre">${n} espèce${n > 1 ? "s" : ""} de plus dans votre carnet</div>`
    + `<div class="fp-grille" style="--fp-n:${Math.max(colonnes, 3)}">${especes.map(e =>
        `<figure><img src="${photoMini(photoEsp(e))}" alt="" onerror="this.onerror=null;this.src='${photoEsp(e)}'"><figcaption>${echapper(e.nom_courant)}</figcaption></figure>`).join("")}</div></div>`;
}
// La planche d'une fête : seulement pour « Expédition terminée » (f.exp = l'expédition), une seule fois
function plancheDeLaFete(f) {
  if (!TROIS_TAILLES || !f.exp || !/^Expédition terminée/.test(f.titre || "")) return "";
  const especes = especesEntreesExp(f.exp);
  if (suivi && suivi.departExp && suivi.departExp[f.exp.id] !== undefined) { delete suivi.departExp[f.exp.id]; sauvegarder(); }
  return htmlPlancheFete(especes);
}
// La photo d'un territoire pour la grande fête (la photo « officielle » du territoire, celle de la carte)
function photoFeteTerritoire(t) {
  try { const p = typeof photoTerritoire === "function" ? photoTerritoire(t, typeof IDENTITE !== "undefined" ? IDENTITE[t] : null) : null;
        return p && p.fichier ? p.fichier : ""; } catch (e) { return ""; }
}
function animationsReduites() { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }
function suiteFetes() {
  if (feteOuverte && document.getElementById("carte-fete").classList.contains("on")) return;   // une fête est déjà à l'écran
  let f = fileFetes.shift();
  if (!f) { feteOuverte = false; return; }
  // Étape R153 (08/11, maquette A) : en fin d'étape, une seule fête — les souvenirs (badges) en attente rejoignent celle de l'expédition
  if (f.fusion || f.souvenir) {
    const exp = f.fusion ? f : fileFetes.find(g => g.fusion);
    if (exp) {
      const lot = [f, ...fileFetes].filter(g => g !== exp && g.souvenir);
      for (const g of lot) { const i = fileFetes.indexOf(g); if (i >= 0) fileFetes.splice(i, 1); }
      const i = fileFetes.indexOf(exp); if (i >= 0) fileFetes.splice(i, 1);
      exp.souvenirs = (exp.souvenirs || []).concat(lot.map(g => g.souvenir));
      f = exp;
    }
  }
  feteOuverte = true; feteCourante = f;   // R153
  const numero = ++numeroFete;
  document.getElementById("carte-pop").classList.remove("visible");
  document.getElementById("bulle").classList.remove("visible");
  const carte = document.getElementById("carte-fete"), voile = document.getElementById("voile-fete");
  // Étape R277 : la grande fête (plein écran sur une photo) et la planche des espèces entrées au carnet
  const grande = TROIS_TAILLES && f.taille === "grande" && !!f.photo;
  const planche = grande ? "" : plancheDeLaFete(f);
  // Étape R288 (rareté, 2C) : la fin d'un lieu complète la fête « Expédition terminée » de sa dernière expédition (pas de fête en plus)
  const finLieu = !grande && typeof blocFeteFinLieu === "function" ? blocFeteFinLieu(f) : "";
  const corps = `<div class="etiquette">${f.etiquette}</div><div class="titre">${f.titre}</div>`
    + `<div class="detail">${f.detail || ""}</div>`
    + planche + finLieu
    + (f.souvenirs || []).map(htmlSouvenir).join("")   // R153
    + (f.jauge ? `<div class="jauge-fete"><i style="--de:${f.jauge.de}%;--a:${f.jauge.a}%"></i></div>` : "");
  carte.classList.toggle("grande", grande); voile.classList.toggle("grande", grande);
  carte.classList.toggle("avec-planche", !!planche || !!finLieu);
  // R288 : une classe en plus (f.classe : la carte « article » d'une rare, la « couverture » du trésor) ; f.garder : on la ferme soi-même
  for (const k of [...carte.classList]) if (k.startsWith("fete-r288")) carte.classList.remove(k);
  if (f.classe) carte.classList.add(...String(f.classe).split(" "));
  const garder = !!(planche || finLieu || f.garder);
  carte.innerHTML = grande
    ? `<img class="fg-photo" src="${f.photo}" alt="" onerror="this.remove()"><div class="fg-ombre" aria-hidden="true"></div>`
      + `<div class="fg-bas">${f.visuel || ""}${corps}<button type="button" class="continuer">Continuer</button></div>`
    : `${f.visuel || ""}${corps}` + (garder ? `<button type="button" class="continuer">Continuer</button>` : `<div class="continuer">Continuer</div>`);
  if (finLieu && typeof brancherFeteFinLieu === "function") brancherFeteFinLieu(carte);   // R288 : « Suivre la piste du trésor »
  voile.classList.add("on");
  requestAnimationFrame(() => { if (feteOuverte && numero === numeroFete) carte.classList.add("on"); });
  // Peu d'étoiles sur la grande fête (la photo fait la fête), aucune si « réduire les animations »
  if (grande) { if (!animationsReduites()) setTimeout(() => { const r = carte.querySelector(".fete-visuel"), c = r ? r.getBoundingClientRect() : null;
                  if (c && feteOuverte && numero === numeroFete) envolEtoiles(c.left + c.width / 2, c.top + c.height / 2, 6); }, 500); }
  else setTimeout(() => envolEtoiles(window.innerWidth / 2, window.innerHeight * 0.46 - 40, 22), 250);
  jouerSon(f.son);
  carte.onclick = voile.onclick = fermerFete;
  clearTimeout(minuteurFete);
  // Rien ne presse : la grande fête et la fête à planche restent jusqu'à ce que le joueur les ferme (toucher, « Continuer », Échap)
  if (grande || garder) document.addEventListener("keydown", echapFete);
  else minuteurFete = setTimeout(fermerFete, 3600);
}
function echapFete(ev) { if (ev.key === "Escape" || ev.key === "Enter") { ev.preventDefault(); fermerFete(); } }
function fermerFete() {
  clearTimeout(minuteurFete);
  document.removeEventListener("keydown", echapFete);                // R277
  document.getElementById("carte-fete").classList.remove("on");   // étape R101 : toujours, même si le jeu croyait la fête fermée
  document.getElementById("voile-fete").classList.remove("on");
  numeroFete++;                                                    // une apparition encore en attente est annulée
  feteOuverte = false;
  if (fileFetes.length) { feteOuverte = true; programmerSuiteFetes(450); }
}
// Les étoiles qui s'envolent depuis un point de l'écran
function envolEtoiles(x, y, n) {
  for (let i = 0; i < n; i++) {
    const e = document.createElement("div");
    e.className = "etoile-fete";
    e.innerHTML = ETOILE_FETE;
    const angle = Math.random() * Math.PI * 2, dist = 90 + Math.random() * 160;
    e.style.left = x + "px"; e.style.top = y + "px";
    e.style.setProperty("--dx", Math.cos(angle) * dist + "px");
    e.style.setProperty("--dy", Math.sin(angle) * dist - 40 + "px");
    e.style.setProperty("--s", (0.6 + Math.random() * 0.9).toFixed(2));
    e.style.setProperty("--r", (Math.random() * 360 - 180) + "deg");
    e.style.animation = `envol-fete ${(0.9 + Math.random() * 0.6).toFixed(2)}s ease-out ${(Math.random() * 0.2).toFixed(2)}s forwards`;
    document.body.appendChild(e);
    setTimeout(() => e.remove(), 1900);
  }
}
const METAUX = { bronze: "#b98b52", argent: "#a9afb5", or: "#d4af37",
                 croisee: "#8FAE8A", comprise: "#3E7B55", familiere: "#1F3A2E" };   // étape R144 : paliers des espèces
function visuelEspece(espece, metal, medaille) {
  const visuel = `<div class="fete-visuel" style="--metal:${METAUX[metal] || metal || METAUX.or}"><div class="photo-fete">${celluleImage(espece, true)}</div>`
    + `<div class="eclat"></div>${medaille ? `<div class="medaille-coin">${medaille}</div>` : ""}</div>`;
  // Étape 246 : l'espèce sur fond de son paysage, si le joueur connaît déjà son milieu
  const p = milieuConnu(espece) ? paysageDuJour(espece) : null;
  return p ? `<div class="fete-fond" style="background-image:url('${miniPaysage(p)}')">${visuel}</div>` : visuel;
}
