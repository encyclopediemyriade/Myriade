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
function afficherBulle(texte) {
  const bulle = document.getElementById("bulle");
  bulle.textContent = texte;
  bulle.classList.add("visible");
  clearTimeout(minuteurBulle);                              // annule l'ancien minuteur
  minuteurBulle = setTimeout(() => bulle.classList.remove("visible"), 2200); // disparaît après 2,2 s
}

// Deux notes très douces, fabriquées par le navigateur (pas de fichier son).
// Étape 142 : tous les sons du jeu sont des « recettes » (bibliothèque ci-dessous, la même que maquette_sons.html).
// Pour changer un son, il suffit de changer son nom ici (les noms possibles sont dans RECETTES_SONS).
// Étape 143 : sons choisis le 12/10 (goutte de bois, arpège de harpe, clochettes, grand arpège)
// Étape 170 (choix du 13/10, maquette_sons_erreur.html) : la mauvaise réponse a un son, le « hou-hou de chouette ».
//   Tous les jeux (le Duel aussi depuis l'étape 171). Pas de son pour « Je ne sais pas » ni pour « Presque ».
const SONS_CHOISIS = { bonne: "bonne_goutte", medaille: "medaille_harpe", badge: "badge_clochettes", rang: "rang_harpe",
                       mauvaise: "erreur_chouette", fin: "fin_carillon", parfaite: "fin_parfaite" };   // étape 196 : le son de fin de partie
// ---- Les sons du jeu, fabriqués par le navigateur (aucun fichier) ----
// Chaque son est une « recette » : des notes (en hertz) jouées l'une après l'autre avec un timbre.
//   timbres : "doux" (sinus), "cloche" (sinus + harmonique de cloche), "harpe" (triangle pincé),
//             "bois" (marimba : sinus court), "flute" (attaque lente, léger vibrato), "oiseau" (sifflement qui glisse),
//             "cor" (dent de scie adoucie, accord tenu)
const RECETTES_SONS = {
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

function jouerSon(moment = "bonne") {
  if (!sonActif || moment === null) return;   // étape 212 : null = pas de son (déjà joué)                 // le joueur a répondu qu'il n'a pas le son (étape 51)
  jouerRecette(SONS_CHOISIS[moment]);
  if (moment === "parfaite") setTimeout(() => jouerRecette("fin_parfaite_accord"), 700);   // étape 205
}

// ---- Étape 165 : la série du Duel, en sons et en images ----
// Une note qui monte à chaque bonne réponse d'affilée (gamme douce, sans fausse note possible), la même goutte de bois
// que la bonne réponse habituelle. Après 11 d'affilée, on reste sur la note la plus haute.
const GAMME_SERIE = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24];      // en demi-tons au-dessus de la première note
function jouerNoteSerie(n) {
  if (!sonActif) return;
  const f = 784 * Math.pow(2, GAMME_SERIE[Math.min(n, GAMME_SERIE.length) - 1] / 12);
  jouerRecette({ timbre: "bois", notes: [f, f * 1.5], ecart: 0.07, duree: 0.25, volume: 0.10 });
}
// Un palier de série : un petit arpège de harpe, plus long à chaque niveau (étape 167)
function jouerSonPalier(niveau) {
  if (!sonActif) return;
  const base = [523, 587, 659, 698, 784][Math.min(niveau, 5) - 1] || 523;
  const notes = [1, 1.25, 1.5, 2, 2.5, 3].slice(0, 2 + Math.min(niveau, 4)).map(x => base * x);
  jouerRecette({ timbre: "harpe", notes, ecart: 0.07, duree: 0.9, volume: 0.11 });
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
  fileFetes.push(f);
  if (!feteOuverte) programmerSuiteFetes(250);
}
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
  carte.innerHTML = `${f.visuel}<div class="etiquette">${f.etiquette}</div><div class="titre">${f.titre}</div>`
    + `<div class="detail">${f.detail || ""}</div>`
    + (f.souvenirs || []).map(htmlSouvenir).join("")   // R153
    + (f.jauge ? `<div class="jauge-fete"><i style="--de:${f.jauge.de}%;--a:${f.jauge.a}%"></i></div>` : "")
    + `<div class="continuer">Continuer</div>`;
  voile.classList.add("on");
  requestAnimationFrame(() => { if (feteOuverte && numero === numeroFete) carte.classList.add("on"); });
  setTimeout(() => envolEtoiles(window.innerWidth / 2, window.innerHeight * 0.46 - 40, 22), 250);
  jouerSon(f.son);
  carte.onclick = voile.onclick = fermerFete;
  clearTimeout(minuteurFete);
  minuteurFete = setTimeout(fermerFete, 3600);
}
function fermerFete() {
  clearTimeout(minuteurFete);
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
