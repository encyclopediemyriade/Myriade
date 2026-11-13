// ==================================================================
// 17. LES EXPÉDITIONS (étape 282, 25/10/2026) — la gamification revue (maquette E2)
//   « Je pars en expédition, je découvre les espèces d'un coin de nature et leurs liens,
//     je gagne des empreintes, elles font monter mon rang et ouvrent la suite. »
//   • Une expédition = 4 à 10 espèces d'un même milieu (Données\expeditions.xlsx → expeditions.js).
//   • 3 étapes : 1. les reconnaître (photo) ; 2. leur mode de vie ; 3. leurs liens (proies, prédateurs, plantes).
//     Une étape n'échoue jamais : elle est finie quand chaque espèce a atteint son but ; on rejoue et on reprend.
//   • Étape PR1 (01/11) : 1 empreinte par espèce faite + 2 en fin d'expédition + 1 par espèce approfondie ; 2 par défi du jour (suivi.empreintesBonus) ; 5 par finale.
//   • Les empreintes du territoire font monter son rang ; le total des empreintes ouvre les territoires.
//   • Un chemin : les expéditions s'ouvrent dans l'ordre, 3 nouvelles à la fois (finir l'étape 1 en ouvre une autre).
//   Rien n'est enregistré pour les étapes : tout se recalcule à partir du carnet (progression).
// ==================================================================
const RENCONTRE_COMPLETE = true;          // étape RF1 (voir plus bas) ; false = le jeu d'avant la refonte
const CHAMPS_MODE_DE_VIE = ["milieu_principal", "regime_alimentaire_type", "activite", "hibernation", "deplacement_saisonnier",
  "saison_observation", "saison_reproduction", "emplacement_nid", "chasse_principale", "defense_principale",
  "metamorphose", "naissance", "indice_presence", "toile", "pelage_hiver", "niveau_estran"];
const CHAMPS_LIENS = ["proies", "predateurs", "plantes_liees"];
// Étape R128 (05/11, choix de l'utilisateur : « toutes les mettre, tirées au hasard, sur la même durée ») :
//   des réserves plus grandes, dans lesquelles chaque étape pioche au hasard, sans poser plus de questions qu'avant.
//   • Étape 2 « Leur vie » : + la reproduction et les petits.
//   • Étape 3 « Approfondir » : + d'autres chiffres, le corps, le danger, les noms (petit, femelle, groupe…), le statut.
//   Le nombre de choses exigées ne change pas (QUOTA : le même qu'avant R128) ; ce qui reste au-delà se pose ailleurs
//   (R129 : dans les autres expéditions de l'espèce, depuis sa fiche, avec le défi du jour).
const CHAMPS_REPRODUCTION = ["gestation_jours", "incubation_jours", "nb_oeufs_ordre", "nb_petits_max", "soin_des_petits",
  "saison_frai", "vie_larve"];
const CHAMPS_APPROFONDIR_PLUS = ["vitesse_max_kmh", "altitude_max_m", "pinces", "cornes_ou_bois", "coquille", "regeneration",
  "venimeux", "danger_homme", "nom_petit", "nom_femelle", "nom_groupe", "nom_logis", "verbe_cri", "periode_reproduction_nom",
  "statut_conservation"];
// Étape 288 (25/10/2026, décisions de l'utilisateur) :
//   1. « Faire connaissance » : une Rencontre par espèce, une espèce par partie, sur ses caractéristiques
//      physiques — sa photo, ses traits d'allure les plus parlants (photo cachée, silhouette en aide),
//      son cri, son empreinte, et son sosie montré à côté (« À ne pas confondre »).
//   2. « Leur vie » : les espèces mélangées, 2 traits de vie par espèce (sans révision de photo).
//   3. « Leurs liens » : inchangée.
//   Après les empreintes de l'expédition (2 depuis l'étape 298) : « Approfondir » (facultatif, sans empreinte) — le reste des traits pertinents.
const ETAPES = [
  null,
  RENCONTRE_COMPLETE ? { titre: "Rencontres", texte: "Une espèce à la fois : la reconnaître, son allure, sa vie, un fait étonnant" }   // étape RF1
    : { titre: "Faire connaissance", texte: "Une espèce à la fois : sa photo, son allure, son cri, son empreinte" },
  RENCONTRE_COMPLETE ? { titre: "Leurs liens", texte: "Qui mange qui, qui vit avec qui : quelques questions, puis ce qui reste de leur vie" }   // étape RF3
    : { titre: "Leur vie", texte: "Où vivent-elles, que mangent-elles, quand les voir, comment naissent leurs petits ?" },   // étape R128
  { titre: "Leurs liens", texte: "Qui mange qui, quelles plantes, quels prédateurs" },   // étape 298 : plus jouée (les liens passent à la finale du lieu)
  { titre: "Approfondir", texte: "Ce qui ne se voit pas : leurs mesures, ce qu'elles mangent, qui les mange, leurs noms, leur statut… En plusieurs parties de 10 questions, à votre rythme (facultatif)" },   // étape R167 (choix d'Aubin, option 1 : des étapes par thème) ; R166 ; R124 : « en plusieurs parties » ; R128 : tirés au hasard ; R130 : sans médaille
];
// Étape 298 (26/10/2026, décision de l'utilisateur « option 2 ») : une expédition n'a plus que 2 étapes
// (Faire connaissance, Leur vie) ; « Leurs liens » quitte l'expédition : les liens entre espèces passent à la finale
// « Tout est lié » du lieu, et ce qu'une espèce mange ou qui la mange passe dans « Approfondir ».
const NB_ETAPES = 2;
const ETAPES_JOUEES = [1, 2];
// ---- Étape RF1 (11/11/2026, refonte des étapes, choix d'Aubin : « une vraie rencontre par espèce ») ----
//   La Rencontre de l'étape 1 devient complète : la photo, UN trait d'allure (le plus parlant ; Aubin : « le bec est évident
//   et n'apporte rien »), le cri et l'empreinte s'il y en a, puis SA VIE en vrai ou faux (2 choses, sujets qui tournent d'une
//   espèce à l'autre), puis un fait ÉTONNANT (deux affirmations, une vraie). L'étape 2 ne garde que ce qui reste
//   (une chose de vie manquée) ; elle deviendra « Leurs liens » (étape RF3).
//   false = le jeu d'avant (étape 1 = l'allure, étape 2 = la vie). Copie complète du jeu d'avant : jeu_1.6.5.html.
const VIE_PAR_RENCONTRE = 3;           // étape RF1 : les choses de sa vie posées dans la Rencontre (RF2 : 3 cartes « vrai ou faux » ; 2 restent exigées)
const NB_TRAITS_ALLURE = RENCONTRE_COMPLETE ? 1 : 2;   // étape 1 : les traits d'allure les plus parlants (ET1 : 2 au lieu de 4 ; RF1 : 1)
const NB_TRAITS_ALLURE_AVANT = 4;      // étape ET1 : les traits 3 et 4 passent dans Approfondir, posés mais pas exigés (rien ne recule)
const SEUIL_PERTINENCE = 0.3;          // note minimale d'un trait d'allure parlant (voir traitsAllure)
const TRAITS_PEU_PARLANTS = ["nb_dents", "paupieres"];   // jamais en expédition (difficiles à voir sur le terrain)
const CHIFFRES_APPROFONDIR = ["taille_max_cm", "envergure_max_cm", "poids_max_kg", "longevite_max_annees"];
const NOUVELLES_OUVERTES = 3;          // expéditions pas encore commencées, ouvertes en même temps (territoires sans chapitres)
// Étape 287 (25/10/2026) : le chemin en chapitres (un chapitre = un milieu ; onglet chapitres de expeditions.xlsx).
//   • Départ : le chapitre du carrefour 0 ; à chaque carrefour suivant, deux chapitres au choix (l'autre reste ouvert).
//   • Un carrefour s'ouvre quand FINIES_POUR_CARREFOUR expéditions d'un chapitre du carrefour d'avant sont terminées.
//   • Dans un chapitre : les expéditions lancées ou terminées, plus OUVERTES_PAR_CHAPITRE nouvelles, dans l'ordre.
//   • « En cours » seulement si le joueur a lancé l'expédition (suivi.expLancees) ; ce qu'il savait déjà compte en bonus.
//   • La finale « Qui vit avec qui ? » de chaque chapitre est annoncée ; son jeu viendra à l'étape suivante.
const OUVERTES_PAR_CHAPITRE = 2;
const FINIES_POUR_CARREFOUR = 2;
// Étape PR1 (01/11/2026, chantier « progression », choix de l'utilisateur : 1 empreinte par espèce) :
//   • +1 par espèce faite à l'étape 1 (ou revue par sa photo si déjà connue ailleurs) ;
//   • +2 quand l'étape 2 est finie (fin de l'expédition) ; +1 par espèce approfondie (étape 3, facultative) ;
//   • +5 par finale « Tout est lié » ; +2 par défi du jour (15_territoire.js).
//   Les empreintes d'une expédition sont recalculées d'après ce que le joueur a fait : rien ne se perd.
const GAIN_ESPECE = 1, GAIN_FIN_EXPEDITION = 2, GAIN_APPROFONDIR = 1;
const RANGS_EMPREINTES = [0, 15, 60, 200];   // Promeneur, Observateur, Pisteur, Naturaliste ; Gardien = le tour du site remarquable fait
const FACTEUR_SEUILS_LIEUX = 4;        // (plus utilisé depuis l'étape R133) ancienne règle : colonne seuil × 4, empreintes de tout le territoire
function seuilLieu(c) { return (c && c.seuil || 0) * FACTEUR_SEUILS_LIEUX; }
// Étape R133 (05/11/2026, choix de l'utilisateur) : les lieux s'ouvraient trop vite (1 à 2 expéditions par lieu).
//   LES MÉDAILLES DU LIEU (idée de l'utilisateur : « on passe les médailles des espèces aux lieux, argent = ouvre le prochain »).
//   Les empreintes gagnées DANS le lieu remplissent sa médaille (maquette B « le sentier des médailles ») :
//     • bronze = un quart des empreintes du lieu ; • argent = la moitié : le lieu suivant s'ouvre ;
//     • or = toutes les expéditions terminées + la finale du lieu (lieuTermine).
//   Empreintes du lieu = celles de ses expéditions (étapes 1-2, Approfondir compris) + sa finale ; total = étapes 1-2 + finale.
//   Un seul lieu ouvert au départ. Rien ne recule : un lieu commencé reste ouvert, et ceux ouverts par l'ancienne règle aussi.
const PART_BRONZE = 0.25, PART_ARGENT = 0.5;
const MEDAILLES_LIEU = [null, { nom: "bronze", titre: "Médaille de bronze", couleur: "#B07A45" },
  { nom: "argent", titre: "Médaille d'argent", couleur: "#9AA3A8" }, { nom: "or", titre: "Médaille d'or", couleur: "#C9A23A" }];
function finaleCompte(t, c) { return typeof finaleDisponible !== "function" || finaleDisponible(t, c); }
function empreintesMaxLieu(t, c) { return expeditionsDuChapitre(t, c.nom).reduce((s, x) => s + gainPrincipalMax(x), 0) + (finaleCompte(t, c) ? EMPREINTES_FINALE : 0); }
function empreintesDuLieu(t, c) { return expeditionsDuChapitre(t, c.nom).reduce((s, x) => s + gainExp(x), 0) + (finaleFaite(t, c.nom) ? EMPREINTES_FINALE : 0); }
function paliersLieu(t, c) { const m = empreintesMaxLieu(t, c); return [0, Math.round(m * PART_BRONZE), Math.round(m * PART_ARGENT), m]; }
function medailleLieu(t, c) {   // 0 = aucune, 1 = bronze, 2 = argent, 3 = or
  if (lieuTermine(t, c)) return 3;
  const n = empreintesDuLieu(t, c), p = paliersLieu(t, c);
  return n >= p[2] ? 2 : n >= p[1] ? 1 : 0;
}
function lieuPrecedent(t, c) { const l = lieuxDe(t), i = l.indexOf(c); return i > 0 ? l[i - 1] : null; }
function lieuSuivant(t, c) { const l = lieuxDe(t), i = l.indexOf(c); return i >= 0 && i < l.length - 1 ? l[i + 1] : null; }
function lieuCommence(t, c) { return expeditionsDuChapitre(t, c.nom).some(x => expLancee(x) || empreintesExp(x) > 0); }
function lieuGardeOuvert(t, c) { return !!(suivi && suivi.lieuxOuverts && (suivi.lieuxOuverts[t] || []).includes(c.nom)); }
function ouvertureLieu(t, c) {
  const l = lieuxDe(t);
  if (l[0] === c || lieuGardeOuvert(t, c) || lieuCommence(t, c)) return true;
  const p = lieuPrecedent(t, c);
  return !!p && medailleLieu(t, p) >= 2;
}
// Ce qui manque pour la prochaine médaille du lieu : { niveau, manque } (manque = empreintes ; null pour l'or s'il ne reste que des expéditions ou la finale)
function prochaineMedailleLieu(t, c) {
  const m = medailleLieu(t, c);
  if (m >= 3) return null;
  const n = empreintesDuLieu(t, c), p = paliersLieu(t, c);
  return { niveau: m + 1, manque: Math.max(0, p[m + 1] - n) };
}
function texteManqueLieu(t, c, court) {   // pour un lieu FERMÉ c : ce qui manque dans le lieu d'avant
  const p = lieuPrecedent(t, c);
  if (!p) return "";
  const manque = Math.max(0, paliersLieu(t, p)[2] - empreintesDuLieu(t, p));
  const e = `${manque} empreinte${manque > 1 ? "s" : ""}`;
  return court ? `Encore ${e}` : `encore ${e} à gagner ${dansLieu(p)}`;
}
function dansLieu(c) {   // « à Saint-Jean-Pied-de-Port », « dans la Vallée d'Aspe »… d'après « Vous êtes … » (R124)
  const v = vousEtesLieu(c.nom);
  return `${v.ligne.replace(/^Vous êtes\s*/, "")} ${v.titre}`;
}
function medailleSvg(niveau, pale) {
  const m = MEDAILLES_LIEU[niveau];
  return `<svg class="med-lieu${pale ? " pale" : ""}" viewBox="0 0 24 24" aria-hidden="true" style="color:${m.couleur}"><path d="M7 1h4l2 6H9zM13 1h4l-2 6h-4z" fill="#7a8a7d"/><circle cx="12" cy="15" r="7.5" fill="currentColor"/><circle cx="12" cy="15" r="5" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.2"/></svg>`;
}
// Le sentier des médailles (maquette B) : une barre d'empreintes, les 3 médailles posées à leur place, un pas « vous êtes ici ».
//   opts.avant : empreintes du lieu avant la partie (la part gagnée pendant la partie est en sable) ; opts.court : version carte.
function sentierLieu(t, c, opts = {}) {
  const p = paliersLieu(t, c), max = p[3] || 1, n = Math.min(max, empreintesDuLieu(t, c)), med = medailleLieu(t, c);
  const pc = v => (100 * Math.min(max, Math.max(0, v)) / max).toFixed(1);
  const avant = opts.avant === undefined ? n : Math.min(n, opts.avant);
  const jalons = [1, 2, 3].map(k => `<span class="sent-jalon${k === 3 ? " bout" : ""}" style="left:${pc(p[k])}%">${medailleSvg(k, med < k)}${opts.court ? "" : `<small>${opts.avant !== undefined && med >= k && medailleAvant(t, c, avant) < k ? MEDAILLES_LIEU[k].nom + " !" : p[k]}</small>`}</span>`).join("");
  return `<div class="sentier-lieu${opts.court ? " court" : ""}" title="${n} empreintes sur ${max} dans ce lieu">
      <span class="sent-rail"></span>${avant < n ? `<span class="sent-ajout" style="left:${pc(avant)}%;width:${(pc(n) - pc(avant)).toFixed(1)}%"></span>` : ""}
      <span class="sent-plein" style="width:${pc(avant)}%"></span>${opts.court ? "" : `<span class="sent-ici" style="left:${pc(n)}%">${PAS_SVG}</span>`}${jalons}</div>`;
}
// Fin de partie (étape R133) : le sentier du lieu, avec la part gagnée pendant la partie
function blocFinLieu(x, gagnees, sansGain) {   // R153 : sansGain → la fête a déjà dit « +N empreintes »
  const c = x && x.chapitre && chapitreParNom(x.territoire, x.chapitre);
  if (!c || !estLieu(c) || toutDebloque()) return "";
  const t = x.territoire, n = empreintesDuLieu(t, c), avant = Math.max(0, n - (gagnees || 0));
  return `<div class="medaille-lieu fin"><div class="etiq-jeu">${gagnees && !sansGain ? `+${gagnees} empreinte${gagnees > 1 ? "s" : ""} ${dansLieu(c)}` : `${echapper(c.nom)} · ${Math.min(n, empreintesMaxLieu(t, c))} / ${empreintesMaxLieu(t, c)}`}</div>
    ${sentierLieu(t, c, { avant })}<p>${phraseMedaille(t, c)}</p></div>`;
}
function medailleAvant(t, c, avant) { const p = paliersLieu(t, c); return avant >= p[2] ? 2 : avant >= p[1] ? 1 : 0; }
// La phrase sous le sentier : où l'on en est, et ce que la prochaine médaille apporte
// Étape R153 (08/11, maquette A choisie par Aubin) : une seule phrase — ce qui manque, puis ce que ça apporte
//   (avant : « 23 empreintes sur 74 · encore 14 pour l'argent : X s'ouvre », le compte étant déjà en tête de la jauge)
function phraseMedaille(t, c) {
  const pm = prochaineMedailleLieu(t, c), s = lieuSuivant(t, c);
  const enc = n => `Encore <b>${n} empreinte${n > 1 ? "s" : ""}</b>`;
  if (!pm) return `<b>Médaille d'or</b> : le lieu est terminé.`;
  if (pm.niveau === 1) return `${enc(pm.manque)} : médaille de bronze.`;
  if (pm.niveau === 2) return `${enc(pm.manque)} : médaille d'argent${s ? ` et <b>${echapper(s.nom)}</b> s'ouvre` : ""}.`;
  return `${pm.manque ? `${enc(pm.manque)}, puis ` : ""}${chapitreFini(t, c) ? "la finale du lieu" : "toutes ses expéditions et la finale"} : médaille d'or.`;
}
function phraseMedailleAvant(t, c) {   // (l'ancienne phrase, gardée pour mémoire, plus appelée depuis R153)
  const n = empreintesDuLieu(t, c), max = empreintesMaxLieu(t, c), m = medailleLieu(t, c), pm = prochaineMedailleLieu(t, c), s = lieuSuivant(t, c);
  const tete = `<b>${Math.min(n, max)} empreinte${n > 1 ? "s" : ""}</b> sur ${max}`;
  if (!pm) return `${tete} · <b>médaille d'or</b> : le lieu est terminé.`;
  const quoi = pm.niveau === 2 ? (s ? `${s.nom} s'ouvre` : "le lieu est à moitié exploré") : pm.niveau === 1 ? "première médaille du lieu" : "le lieu est terminé";
  if (pm.niveau === 3) return `${tete} · encore ${pm.manque ? `<b>${pm.manque}</b> empreinte${pm.manque > 1 ? "s" : ""} et ` : ""}${chapitreFini(t, c) ? "la finale du lieu" : "toutes ses expéditions et la finale"} pour l'or.`;
  return `${tete} · encore <b>${pm.manque}</b> pour ${pm.niveau === 1 ? "le bronze" : "l'argent"} : ${quoi}.`;
}
function blocMedailleLieu(t, c) {   // étape R153 : « Votre avancée ici · 23 / 74 », la jauge, une phrase
  const n = Math.min(empreintesDuLieu(t, c), empreintesMaxLieu(t, c));
  return `<div class="medaille-lieu"><div class="etiq-jeu ml-tete"><span>Votre avancée ici</span><b>${n} / ${empreintesMaxLieu(t, c)}</b></div>${sentierLieu(t, c)}<p>${phraseMedaille(t, c)}</p></div>`;
}
// Étape R153 : la carte d'identité du lieu, repliée sous « Le lieu en bref » (le milieu reste dit dans la ligne fermée)
function blocLieuEnBref(t, c) {
  const html = blocIdentiteLieu(c);
  if (!html) return "";
  const mil = (c.identite && c.identite.milieu_principal) || milieuxLieu(t, c).join(", ");
  return `<details class="lieu-bref"><summary><span class="lieu-bref-t">Le lieu en bref</span><small>${echapper(mil)} · pourquoi ici, ce qui le menace, ce qui marche</small></summary>${html}</details>`;
}
// Une fête quand une médaille de lieu est gagnée (suivi.medaillesLieux, jamais pour ce qui était déjà acquis)
function verifierMedaillesLieux(t) {
  if (!suivi || !aDesLieux(t) || toutDebloque()) return;
  suivi.medaillesLieux = suivi.medaillesLieux || {};
  for (const c of lieuxDe(t)) {
    const k = t + "|" + c.nom, m = medailleLieu(t, c), avant = suivi.medaillesLieux[k] || 0;
    if (m <= avant) continue;
    suivi.medaillesLieux[k] = m; sauvegarder();
    const s = lieuSuivant(t, c);
    setTimeout(() => feter({ etiquette: c.nom, titre: MEDAILLES_LIEU[m].titre, son: "badge",
            detail: m === 2 ? (s ? `${s.nom} s'ouvre : un nouveau lieu à explorer.` : "Le lieu est à moitié exploré.") : m === 1 ? `Encore ${Math.max(0, paliersLieu(t, c)[2] - empreintesDuLieu(t, c))} empreintes pour l'argent${s ? ` : ${s.nom} s'ouvrira` : ""}.` : "Le lieu est terminé.",
            visuel: `<div class="fete-visuel medaille-fete">${medailleSvg(m)}</div>` }), 900);   // après la fête de l’étape
  }
}
// Une fois, au chargement : les lieux ouverts par l'ancienne règle dans un territoire déjà joué restent ouverts.
function migrerLieuxR133() {
  if (!suivi || suivi.lieuxR133) return;
  suivi.lieuxOuverts = suivi.lieuxOuverts || {};
  for (const t of (typeof tousLesTerritoires === "function" ? tousLesTerritoires() : [])) {
    if (!aDesLieux(t) || empreintesTerritoire(t) <= 0) continue;
    const garder = lieuxDe(t).filter(c => empreintesTerritoire(t) >= seuilLieu(c)).map(c => c.nom);
    if (garder.length) suivi.lieuxOuverts[t] = garder;
  }
  suivi.medaillesLieux = suivi.medaillesLieux || {};      // les médailles déjà acquises ne font pas de fête
  for (const c of (typeof CHAPITRES !== "undefined" ? CHAPITRES : [])) if (estLieu(c)) {
    const m = medailleLieu(c.territoire, c); if (m) suivi.medaillesLieux[c.territoire + "|" + c.nom] = m; }
  suivi.lieuxR133 = true;
  sauvegarder();
}

let memoExp = null;
function toutesExpeditions() {
  if (memoExp) return memoExp;
  const parNom = new Map(ESPECES.map(e => [e.nom_courant, e]));
  memoExp = (typeof EXPEDITIONS !== "undefined" ? EXPEDITIONS : []).map(x => ({ ...x,
    liste: x.especes.map(n => parNom.get(n)).filter(Boolean) })).filter(x => x.liste.length);   // étape 293 : une espèce sans photo y reste (silhouette, « photo à venir »)
  return memoExp;
}
function expeditionsDe(t) { return toutesExpeditions().filter(x => x.territoire === t).sort((a, b) => a.ordre - b.ordre); }
function expeditionParId(id) { return toutesExpeditions().find(x => x.id === id) || null; }

// ---- Les étapes ----
function champsPossibles(e) { return questionsPossibles(e).map(q => q.champ); }
// Étape 288 : les champs possibles, cri compris même si le son n'a pas encore été demandé
function champsAvecCri(e) {
  const avant = avecCriQuandMeme; avecCriQuandMeme = true;
  const l = champsPossibles(e); avecCriQuandMeme = avant;
  return l;
}
// ---- Étape 288 : les traits d'allure PARLANTS d'une espèce ----
// Un trait est parlant s'il distingue l'espèce : part des espèces de sa famille (même onglet) qui ont une autre valeur,
// + 0,5 s'il la distingue d'un de ses sosies (« À ne pas confondre »). On garde ceux qui dépassent SEUIL_PERTINENCE,
// du plus parlant au moins parlant. (Un trait que toute la famille partage — 6 pattes pour un insecte — ne sort pas.)
const memoAllure = new Map();
// Le poids d'un trait : ce qui se voit d'abord sur le terrain (1), puis les détails (0,7), puis les petits détails (0,4)
const POIDS_TRAITS = {
  couleur_dominante: 1, robe: 1, bec_forme: 1, ornement_tete: 1, oreilles_forme: 1, oreilles_taille: 1, queue_forme: 1, cornes_bois_forme: 1,
  poil_longueur: 1, silhouette: 1, corps_forme: 1, antennes_forme: 1, ailes_repos: 1, bec_couleur: 1, coquille: 1,
  ventre_couleur: 0.7, pattes_type: 0.7, museau_forme: 0.7, queue_poisson: 0.7, nageoires_dos: 0.7, barbillons: 0.7,
  queue_adulte: 0.7, peau_texture: 0.7, pattes_arriere: 0.7, ailes_visibles: 0.7, pupille_forme: 0.7, ecailles_corps: 0.7,
  pattes_aspect: 0.4, yeux_couleur: 0.4, doigts_disposition: 0.4, bouche_type: 0.4, bouche_position: 0.4,
  difference_male_femelle: 0.4, tete_ecailles: 0.4, ecailles_taille: 0.4, pattes_nombre: 0.4,
};
// Deux traits sur la même partie du corps : on n'en garde qu'un à l'étape 1 (le plus parlant)
const PARTIES_DU_CORPS = { oreilles_forme: "oreilles", oreilles_taille: "oreilles", ailes_visibles: "ailes", ailes_repos: "ailes", queue_forme: "queue", queue_adulte: "queue", queue_poisson: "queue",
  bouche_type: "bouche", bouche_position: "bouche", ecailles_corps: "ecailles", ecailles_taille: "ecailles", tete_ecailles: "ecailles" };
function lireTrait(q, e) {
  const v = q.lecture ? q.lecture(e) : e[q.champ];
  return Array.isArray(v) ? v.join(";") : String(v === undefined || v === null ? "" : v).toLowerCase().trim();
}
// Un trait parlant distingue l'espèce de ses proches : la part des espèces de son ORDRE (même onglet) qui ont une autre valeur,
// et celle de toute sa famille (l'onglet), à parts égales ; + 0,5 s'il la distingue d'un de ses sosies ; le tout × le poids du trait.
// « Aucune différence visible » entre mâle et femelle n'est jamais un trait parlant.
// Étape R156 (08/11, choix d'Aubin) : un coquillage dont la couleur varie (huîtres, coque, bigorneau, patelle…) n'a plus de
// question de couleur dans les expéditions (étape 1 ni Approfondir) : la réponse était presque toujours « Gris » ou « Brun »,
// face à des couleurs vives, trop facile et répétitif. Les limaces gardent la leur. La question reste possible hors expédition
// (Rencontre depuis la fiche), pour que rien ne recule sur la fiche.
function coquillageCouleurVariable(e) {
  return e.onglet === "Mollusques" && !/^(Limace|Grande loche)/.test(e.nom_courant) && couleurVariable(e);
}
function traitsAllure(e, limite = NB_TRAITS_ALLURE) {   // étape ET1 : limite = combien de premiers traits évitent deux fois la même partie du corps
  const cle = limite + "|" + e.nom_courant;
  if (memoAllure.has(cle)) return memoAllure.get(cle).slice();
  const portrait = new Set(QUESTIONS_PORTRAIT.map(q => q.champ));
  const famille = ESPECES.filter(o => o !== e && o.onglet === e.onglet);
  const proches = famille.filter(o => o.ordre && o.ordre === e.ordre);
  const sosies = sosiesDe(e);
  const part = (liste, q, v) => { const l = liste.filter(o => estRenseigne(q.valeur(o)) && q.valeur(o) !== "NA");
                                  return l.length ? l.filter(o => lireTrait(q, o) !== v).length / l.length : null; };
  const notes = champsPossibles(e).filter(c => portrait.has(c) && !TRAITS_PEU_PARLANTS.includes(c))
    .filter(c => !(c === "couleur_dominante" && coquillageCouleurVariable(e))).map(c => {   // étape R156
    const q = QUESTIONS.find(x => x.champ === c), v = lireTrait(q, e);
    if (c === "difference_male_femelle" && /aucune/.test(v)) return { c, note: 0 };
    const pf = part(famille, q, v) || 0, po = part(proches, q, v);
    const bonus = sosies.some(o => estRenseigne(q.valeur(o)) && q.valeur(o) !== "NA" && lireTrait(q, o) !== v) ? 0.5 : 0;
    return { c, note: ((po === null ? pf : (pf + po) / 2) + bonus) * (POIDS_TRAITS[c] || 0.7) };
  }).filter(x => x.note >= SEUIL_PERTINENCE).sort((a, b) => b.note - a.note);
  const pris = [], parties = new Set();
  for (const x of notes) {                         // une seule question par partie du corps dans les premiers traits
    const p = PARTIES_DU_CORPS[x.c];
    if (p && parties.has(p) && pris.length < limite) continue;
    if (p) parties.add(p);
    pris.push(x.c);
  }
  memoAllure.set(cle, pris);
  return pris.slice();
}
// ---- Étape RF6 (11/11, choix d'Aubin « A · Seulement un détail ») : la question d'allure de la Rencontre complète porte
//   sur UN DÉTAIL (œil, pattes, couleur du bec, queue, oreilles, ornement de tête, antennes, cornes…), jamais sur l'ensemble
//   qu'on voit d'un coup d'œil sur la photo (couleur dominante, aspect de la robe, forme du corps, forme du bec, silhouette).
//   L'ensemble est MONTRÉ en pictogrammes quand la photo est reconnue (choix « a », note d'Aubin : « on reprend l'ensemble
//   des pictos à ce moment-là »). Une espèce sans détail à poser n'a pas de question d'allure (choix « a »).
const TRAITS_ENSEMBLE = ["couleur_dominante", "robe", "corps_forme", "bec_forme", "silhouette"];
function traitDetail(e) { return traitsAllure(e).find(c => !TRAITS_ENSEMBLE.includes(c) && c !== "museau_forme") || null; }   // museau : un indice, pas une question (R181)
function traitsEtape1(e) {
  if (!RENCONTRE_COMPLETE) return traitsAllure(e).slice(0, NB_TRAITS_ALLURE);
  const d = traitDetail(e);
  return d ? [d] : [];
}
function champsEtape(e, k) {
  if (k === 1) {                                    // étape 288 : la Rencontre physique
    const possibles = champsAvecCri(e);
    const sens = ["cri_son", "empreinte_nom"].filter(c => possibles.includes(c));
    return [IDENTIFICATION, ...traitsEtape1(e), ...sens];   // RF6 : un détail, pas l'ensemble
  }
  const possibles = champsPossibles(e);
  const vie = possibles.filter(c => CHAMPS_MODE_DE_VIE.includes(c));
  const repro = possibles.filter(c => CHAMPS_REPRODUCTION.includes(c));          // étape R128
  if (k === 2) return [...vie, ...repro];
  if (k === 4) {
    // Étape R167 (08/11, Revoir 13, choix d'Aubin « option 1 ») : des étapes PAR THÈME. Étape 1 = l'allure, étape 2 = la vie,
    //   Approfondir = ce qui ne se voit pas : mesures, liens (ce qu'elle mange, qui la mange), noms, statut… Avant (R128),
    //   Approfondir reprenait aussi les traits d'allure et de vie que les étapes 1 et 2 n'avaient pas tirés : « on retrouve
    //   presque la même chose dans les trois ». Ces caractéristiques ne sont pas perdues : jeu « Compléter le carnet » (16),
    //   défi du jour « Découvrir N choses nouvelles », fiche de l'espèce, autres expéditions de l'espèce.
    //   Seule exception : un trait manqué à l'étape 1 revient ici (R146), posé mais pas exigé.
    return [...possibles.filter(c => CHIFFRES_APPROFONDIR.includes(c)), ...possibles.filter(c => CHAMPS_LIENS.includes(c)),
            ...possibles.filter(c => CHAMPS_APPROFONDIR_PLUS.includes(c)),
            ...champsRequis(e, 1).filter(c => c !== IDENTIFICATION && nbBonnes(e, c) === 0)];   // étape R132 : traits manqués à l'étape 1
  }
  const liens = possibles.filter(c => CHAMPS_LIENS.includes(c));
  return liens.length ? liens : vie;                 // une espèce sans liens connus : le reste de son mode de vie
}
// Étape 288 : ce qui compte pour finir l'étape 1 — la photo et les traits physiques, SANS le cri
// (le cri est posé quand le son est là, mais il ne bloque jamais : on peut jouer sans le son).
function champsRequis(e, k) {
  if (k === 1) return champsEtape(e, 1).filter(c => c !== "cri_son");
  if (k === 4) {                                    // étape R167 : les traits manqués à l'étape 1 sont posés, pas exigés
    const traits = traitsAllure(e);
    return champsEtape(e, 4).filter(c => !traits.includes(c));
  }
  return champsEtape(e, k);
}
// Étape R128 : le quota d'Approfondir = ce qu'Approfondir exigeait avant R128 (sans la réserve ajoutée) : la durée ne change pas.
// Les cases trouvées comptent dans toute la réserve : une espèce déjà « faite » le reste (rien ne recule).
const memoQuota = new Map();
// Étape R167 : le quota = les mesures et les liens (la réserve « plus » — noms, statut, vitesse… — se tire au hasard en
//   complément, comme depuis R128) ; au moins 2 choses s'il y en a.
function quotaApprofondir(e) {
  if (memoQuota.has(e.nom_courant)) return memoQuota.get(e.nom_courant);
  const requis = champsRequis(e, 4);
  const n = Math.max(requis.filter(c => !CHAMPS_APPROFONDIR_PLUS.includes(c)).length, Math.min(2, requis.length));
  memoQuota.set(e.nom_courant, n);
  return n;
}
// Étape R167 : rien ne recule — une espèce déjà « Familière » avec les règles d'avant (réserve R128) le reste.
//   La liste est calculée une fois, avec les règles d'avant, et gardée dans la sauvegarde (suivi.approfondiAvantR167).
function ancienRequisApprofondir(e) {
  const possibles = champsPossibles(e);
  const vie = possibles.filter(c => CHAMPS_MODE_DE_VIE.includes(c)), repro = possibles.filter(c => CHAMPS_REPRODUCTION.includes(c));
  const tous = [...traitsAllure(e).slice(NB_TRAITS_ALLURE), ...possibles.filter(c => CHIFFRES_APPROFONDIR.includes(c)),
                ...vie, ...repro, ...possibles.filter(c => CHAMPS_LIENS.includes(c)), ...possibles.filter(c => CHAMPS_APPROFONDIR_PLUS.includes(c))];
  const exigesAvant = traitsAllure(e, NB_TRAITS_ALLURE_AVANT).slice(NB_TRAITS_ALLURE_AVANT), traits = traitsAllure(e);
  const requis = tous.filter(c => !traits.includes(c) || exigesAvant.includes(c));
  const ajoutes = new Set([...CHAMPS_REPRODUCTION, ...CHAMPS_APPROFONDIR_PLUS]), etape1 = new Set(champsEtape(e, 1));
  return { requis, quota: requis.filter(c => !ajoutes.has(c) && !etape1.has(c)).length };
}
function approfondiesAvantR167() {
  if (!suivi) return new Set();
  if (!suivi.approfondiAvantR167) {
    suivi.approfondiAvantR167 = ESPECES.filter(e => estIdentifiee(e)).filter(e => {
      const a = ancienRequisApprofondir(e);
      return a.requis.length && a.requis.filter(c => nbBonnes(e, c) >= 1).length >= Math.min(a.requis.length, a.quota);
    }).map(e => e.nom_courant);
  }
  const c = approfondiesAvantR167.cache;
  if (!c || c.src !== suivi.approfondiAvantR167) { approfondiesAvantR167.cache = new Set(suivi.approfondiAvantR167); approfondiesAvantR167.cache.src = suivi.approfondiAvantR167; }
  return approfondiesAvantR167.cache;
}
function butEspece(e, k) {
  const champs = champsRequis(e, k);
  if (k === 1) return champs.length;                   // étape R132 : la photo et tous ses traits (avant : une erreur permise)
  if (k === 4) return Math.min(champs.length, quotaApprofondir(e));   // Approfondir : le quota (R128 ; avant : tout)
  if (k === 2) return Math.min(2, champs.length);    // étape 288 : 2 traits de vie (au lieu de 3)
  return CHAMPS_LIENS.some(c => champs.includes(c)) ? champs.length : Math.min(champs.length, 5);   // sans liens : 5 traits de vie
}
function trouvesEspece(e, k) { return champsRequis(e, k).filter(c => c === IDENTIFICATION ? estIdentifiee(e) : nbBonnes(e, c) >= 1).length; }
// Étape RF6 : rien ne recule — les espèces dont l'étape 1 était faite avec l'ancien trait (l'ensemble) le restent
function etape1AvantRF6() {
  if (!suivi) return new Set();
  if (!suivi.etape1RF6) {
    suivi.etape1RF6 = ESPECES.filter(e => estIdentifiee(e)).filter(e => {
      const possibles = champsAvecCri(e);
      const ancien = [...traitsAllure(e).slice(0, NB_TRAITS_ALLURE), ...["empreinte_nom"].filter(c => possibles.includes(c))];
      return ancien.every(c => nbBonnes(e, c) >= 1);
    }).map(e => e.nom_courant);
    sauvegarder();
  }
  if (!etape1AvantRF6.cache || etape1AvantRF6.cache.src !== suivi.etape1RF6) {
    etape1AvantRF6.cache = new Set(suivi.etape1RF6); etape1AvantRF6.cache.src = suivi.etape1RF6;
  }
  return etape1AvantRF6.cache;
}
function especeFaite(e, k) {
  if (k === 1 && RENCONTRE_COMPLETE && estIdentifiee(e) && etape1AvantRF6().has(e.nom_courant)) return true;   // étape RF6 : rien ne recule
  if (k === 1 && estIdentifiee(e) && etape1Acquises().has(e.nom_courant)) return true;   // étape R132 : rien ne recule
  if (k === 4 && approfondiesAvantR167().has(e.nom_courant)) return true;                // étape R167 : rien ne recule
  if (k === 1 && estIdentifiee(e) && suivi && suivi.etape1Passees && suivi.etape1Passees.includes(e.nom_courant)) return true;   // étape R146
  return (k !== 1 || estIdentifiee(e)) && trouvesEspece(e, k) >= butEspece(e, k);
}
// Étape R132 (05/11, choix de l'utilisateur « 2 bis ») : à l'étape 1, tout ce qui est demandé doit être trouvé (plus d'erreur
// permise). Un trait manqué (même après sa reprise) revient seul, à la fin de l'étape (« Revoir les traits manqués »),
// jamais toute la Rencontre. Les espèces déjà validées avec une erreur avant R132 le restent (liste gardée dans la sauvegarde) ;
// leur trait manqué revient dans Approfondir.
function etape1Acquises() {
  if (!suivi) return new Set();
  if (!suivi.etape1R132) {
    suivi.etape1R132 = ESPECES.filter(e => estIdentifiee(e)).filter(e => {
      const n = champsRequis(e, 1).length, t = trouvesEspece(e, 1);
      return t < n && t >= Math.max(1, n - 1);
    }).map(e => e.nom_courant);
  }
  if (!etape1Acquises.cache || etape1Acquises.cache.src !== suivi.etape1R132) {
    etape1Acquises.cache = new Set(suivi.etape1R132); etape1Acquises.cache.src = suivi.etape1R132;
  }
  return etape1Acquises.cache;
}
// Ce qui manque à une espèce pour l'étape 1 (la photo si elle n'est pas reconnue, les traits jamais trouvés)
function manquesEtape1(e) { return champsRequis(e, 1).filter(c => c === IDENTIFICATION ? !estIdentifiee(e) : nbBonnes(e, c) === 0); }
// Les espèces déjà rencontrées dans cette expédition à qui il manque encore quelque chose
function tentees(x) { return (suivi && suivi.expTentees && suivi.expTentees[x.id]) || []; }
function estTentee(x, e) { return tentees(x).includes(e.nom_courant); }
function marquerTentee(x, e) {
  if (!suivi) return;
  suivi.expTentees = suivi.expTentees || {};
  const l = suivi.expTentees[x.id] = suivi.expTentees[x.id] || [];
  if (!l.includes(e.nom_courant)) { l.push(e.nom_courant); sauvegarder(); }
}
// Étape R146 (07/11/2026, choix d'Aubin : « un joueur qui bloque peut enchaîner longtemps les Revoir la chose manquée ») :
// au plus 2 rattrapages par espèce et par expédition. Le 1er pose la question normale ; le 2e ne propose que 2 réponses
// (la bonne et un piège ; pas de ligne de rappel, choix d'Aubin). Si c'est encore raté, l'espèce compte pour avancer
// (l'étape 2 s'ouvre), mais le trait reste « à trouver » : sa case reste vide et il revient dans Approfondir (comme en R132).
// Sauvegarde : suivi.expRattrapages[id][espèce] = tours faits ; suivi.etape1Passees = espèces passées ainsi.
const RATTRAPAGES_MAX = 2;
function toursRattrapage(x, e) { return (suivi && suivi.expRattrapages && suivi.expRattrapages[x.id] && suivi.expRattrapages[x.id][e.nom_courant]) || 0; }
function questionAidee(e) {
  if (!defi || !defi.expedition || !defi.expedition.rattrapage) return false;
  const x = expeditionParId(defi.expedition.id);
  return !!x && toursRattrapage(x, e) >= RATTRAPAGES_MAX - 1;
}
// À la fin d'un tour de rattrapage : un tour de plus pour chaque espèce reposée ; au dernier, on avance
function compterRattrapage(x, especes) {
  if (!suivi) return [];
  suivi.expRattrapages = suivi.expRattrapages || {};
  const tours = suivi.expRattrapages[x.id] = suivi.expRattrapages[x.id] || {};
  const passees = [];
  for (const e of especes) {
    tours[e.nom_courant] = (tours[e.nom_courant] || 0) + 1;
    if (tours[e.nom_courant] >= RATTRAPAGES_MAX && estIdentifiee(e) && !especeFaite(e, 1) && manquesEtape1(e).length) {
      suivi.etape1Passees = suivi.etape1Passees || [];
      if (!suivi.etape1Passees.includes(e.nom_courant)) suivi.etape1Passees.push(e.nom_courant);
      passees.push(e);
    }
  }
  sauvegarder();
  return passees;
}
function aRattraper(x) { return x.liste.filter(e => !faiteDans(x, e, 1) && estTentee(x, e) && manquesEtape1(e).length); }
function texteARevoir(x) { const n = nbTraitsARevoir(x); return `${n === 1 ? "la chose manquée" : `les ${n} choses manquées`}`; }
function nbTraitsARevoir(x) { return aRattraper(x).reduce((n, e) => n + manquesEtape1(e).length, 0); }
// Étape 316 (27/10, choix de l'utilisateur « option 2 ») : ce qu'on sait d'une espèce compte dans tout le jeu, mais une
// expédition ne donne ses empreintes que si le joueur l'a parcourue. Une espèce déjà connue ailleurs (autre territoire,
// Rencontre depuis l'encyclopédie, Plus de jeux) doit être « revue » dans l'expédition : sa photo reconnue dans une courte
// révision (une question par espèce). Une espèce sans photo libre compte d'office. Sauvegarde : suivi.expRevues[id].
function revuesExp(x) {
  if (!suivi) return [];
  if (suivi.expRevuesV !== 316) {                     // une seule fois : les expéditions déjà lancées gardent leur acquis
    suivi.expRevuesV = 316; suivi.expRevues = suivi.expRevues || {};
    for (const y of EXPEDITIONS) if (suivi.expLancees && suivi.expLancees[y.id])
      suivi.expRevues[y.id] = [...new Set([...(suivi.expRevues[y.id] || []), ...y.especes.filter(n => { const e = ESPECES.find(z => z.nom_courant === n); return e && especeFaite(e, 1); })])];
    sauvegarder();
  }
  return (suivi.expRevues && suivi.expRevues[x.id]) || [];
}
function estRevue(x, e) { return !estRenseigne(e.photo) || revuesExp(x).includes(e.nom_courant); }
function marquerRevue(id, e) {
  if (!suivi) return;
  suivi.expRevues = suivi.expRevues || {};
  const l = suivi.expRevues[id] = suivi.expRevues[id] || [];
  if (!l.includes(e.nom_courant)) { l.push(e.nom_courant); sauvegarder(); }
}
function faiteDans(x, e, k) { return especeFaite(e, k) && (k !== 1 || estRevue(x, e)); }
function especesARevoirIci(x) { return x.liste.filter(e => especeFaite(e, 1) && !estRevue(x, e)); }
function avanceeEtape(x, k) { const faites = x.liste.filter(e => faiteDans(x, e, k)).length; return { faites, total: x.liste.length }; }
function etapeFinieSansLiens(x, k) { return k >= 1 && k <= NB_ETAPES && (k === 1 || etapeFinieSansLiens(x, k - 1)) && x.liste.every(e => faiteDans(x, e, k)); }
// Étape RF3 : avec la Rencontre complète, l'étape 2 « Leurs liens » est finie quand leur vie est connue ET que leurs liens ont été vus
//   (une expédition sans lien à poser : comme avant). Rien ne recule : une expédition finie avant RF3 le reste (liensOk).
function etapeFinie(x, k) {
  if (k === 2 && RENCONTRE_COMPLETE && typeof migrerLiensRF3 === "function") migrerLiensRF3();   // avant tout calcul (sinon une expédition finie ensuite serait prise pour ancienne)
  return etapeFinieSansLiens(x, k) && (k !== 2 || !RENCONTRE_COMPLETE || typeof liensOk !== "function" || liensOk(x));
}
function approfondie(x) { return x.liste.every(e => especeFaite(e, 4)); }   // étape 288
// Étape R131 (05/11, choix de l'utilisateur, option 1) : « Terminée » dit aussi ce qu'il reste dans Approfondir (facultatif),
// « Terminée · Approfondir 2/7 », puis « Terminée » tout court quand Approfondir est fini.
function libelleTerminee(x) {
  if (approfondie(x)) return "Terminée";
  return `Terminée · Approfondir ${x.liste.filter(e => especeFaite(e, 4)).length}/${x.liste.length}`;
}
function empreintesExp(x) { let n = 0; while (n < NB_ETAPES && etapeFinie(x, n + 1)) n++; return n; }   // le nombre d'ÉTAPES finies (0 à 2)
// Étape PR1 : les empreintes gagnées dans une expédition (la monnaie). Seulement si le joueur l'a lancée.
function gainEtape(x, k) { return k === 1 ? x.liste.length * GAIN_ESPECE : k === 2 ? GAIN_FIN_EXPEDITION : x.liste.length * GAIN_APPROFONDIR; }
function gainPrincipalMax(x) { return gainEtape(x, 1) + gainEtape(x, 2); }
function gainApprofondir(x) {
  if (!(expLancee(x) || empreintesExp(x) > 0)) return 0;
  return x.liste.filter(e => faiteDans(x, e, 1) && especeFaite(e, 4)).length * GAIN_APPROFONDIR;
}
function gainPrincipal(x) {
  if (!(expLancee(x) || empreintesExp(x) > 0)) return 0;
  return x.liste.filter(e => faiteDans(x, e, 1)).length * GAIN_ESPECE + (etapeFinie(x, 2) ? GAIN_FIN_EXPEDITION : 0);
}
function gainExp(x) { return gainPrincipal(x) + gainApprofondir(x); }
// Le petit compteur d'une carte d'expédition : « 🐾 5 / 9 » (+ ce qu'Approfondir a rapporté)
function dessinGain(x) {
  const g = gainPrincipal(x), a = gainApprofondir(x), max = gainPrincipalMax(x);
  return `<span class="pas pas-gain${g >= max ? " complet" : ""}" title="Empreintes gagnées dans cette expédition"><span class="${g ? "pris" : ""}">${PAS_SVG}</span><b>${g}</b><small>/ ${max}${a ? ` +${a}` : ""}</small></span>`;
}
function etapeEnCours(x) { const n = empreintesExp(x); return n < NB_ETAPES ? n + 1 : null; }
function expLancee(x) { return !!(suivi && suivi.expLancees && suivi.expLancees[x.id]); }
function expeditionCommencee(x) {
  if (x.chapitre) return expLancee(x);                                    // étape 287 : seulement si le joueur l'a lancée
  return empreintesExp(x) > 0 || x.liste.some(e => estIdentifiee(e));
}
function dejaConnues(x) { return x.liste.filter(e => estIdentifiee(e)).length; }

// ---- Étape 287 : les chapitres ----
function chapitresDe(t) {
  return (typeof CHAPITRES !== "undefined" ? CHAPITRES : []).filter(c => c.territoire === t)
    .sort((a, b) => a.carrefour - b.carrefour || a.rang - b.rang);
}
function aDesChapitres(t) { return chapitresDe(t).length > 0 && expeditionsDe(t).some(x => x.chapitre); }
function chapitreParNom(t, nom) { return chapitresDe(t).find(c => c.nom === nom) || null; }
function expeditionsDuChapitre(t, nom) { return expeditionsDe(t).filter(x => x.chapitre === nom); }
function finiesChapitre(t, nom) { return expeditionsDuChapitre(t, nom).filter(x => empreintesExp(x) >= NB_ETAPES).length; }
function carrefourOuvert(t, k) {
  if (k <= 0) return true;
  return chapitresDe(t).some(p => p.carrefour === k - 1 && carrefourOuvert(t, k - 1) && finiesChapitre(t, p.nom) >= FINIES_POUR_CARREFOUR);
}
// Revoir 7 (étape 332) : « Tout débloquer » (choix de la première visite, ou bouton de la page À propos) —
// territoires, lieux, expéditions, étapes et finales ouverts d'office ; les empreintes restent à gagner en jouant.
function toutDebloque() { return !!(typeof suivi !== "undefined" && suivi && suivi.toutDebloque); }
// Étape PR6 (03/11, décision de l'utilisateur : « Tout débloquer, c'est espèces comprises ») : toutes les espèces
//   sont aussi reconnues sur photo (dans le carnet). Leurs caractéristiques restent à trouver et les empreintes à gagner.
//   Les espèces ainsi ajoutées sont notées (suivi.especesDebloquees) : « Revenir au jeu pas à pas » les retire,
//   sauf celles que le joueur a reconnues lui-même entre-temps. Pendant ce mode, ni badge ni rang global ne sont gagnés
//   (ils ne se perdent jamais : on ne les donne pas pour des espèces offertes) ; ils se recalculent au retour.
function reglerToutDebloque(oui) {
  if (!suivi) return;
  oui = !!oui;
  if (oui) debloquerEspeces();
  else if (suivi.toutDebloque || suivi.especesDebloquees) rebloquerEspeces();
  suivi.toutDebloque = oui;
  if (oui) territoiresOuvertsListe = null;
  sauvegarder();
  if (typeof afficherStats === "function") afficherStats();
  if (!oui && typeof verifierBadges === "function") verifierBadges(false);
}
function debloquerEspeces() {
  const notees = suivi.especesDebloquees = suivi.especesDebloquees || {};
  for (const e of ESPECES) {
    const nom = e.nom_courant;
    if (!estRenseigne(e.photo)) {                            // sans photo : rien à reconnaître, il suffit de lui ouvrir sa fiche
      if (!progression[nom]) { progression[nom] = { acquis: {} }; notees[nom] = "vide"; }
      else if (progression[nom].cachee) { delete progression[nom].cachee; notees[nom] = "cachee"; }
      continue;
    }
    if (estIdentifiee(e)) continue;
    const p = progression[nom];
    if (!(nom in notees)) notees[nom] = !p ? "rien" : p.cachee ? "cachee" : "fiche";   // ce qu'il y avait avant
    if (!p) progression[nom] = { acquis: {} };
    delete progression[nom].cachee;
    progression[nom].acquis[IDENTIFICATION] = 1;
  }
}
function rebloquerEspeces() {
  const notees = suivi.especesDebloquees || {};
  for (const nom of Object.keys(notees)) {
    const p = progression[nom];
    if (!p || !p.acquis) continue;
    if (notees[nom] === "vide") { if (!Object.keys(p.acquis).length) delete progression[nom]; continue; }
    if ((p.acquis[IDENTIFICATION] || 0) > 1) continue;      // reconnue aussi en jouant : elle reste au carnet
    delete p.acquis[IDENTIFICATION];
    if (notees[nom] === "rien" && !Object.keys(p.acquis).length) delete progression[nom];
    else if (notees[nom] === "cachee") p.cachee = true;
  }
  delete suivi.especesDebloquees;
}
// Une partie déjà en « Tout débloquer » avant l'étape PR6 : ses espèces sont débloquées une fois, au chargement
function migrerToutDebloque() {
  if (suivi && suivi.toutDebloque && !suivi.especesDebloquees) { debloquerEspeces(); sauvegarder(); }
}
function chapitreOuvert(t, c) {
  if (!c) return false;
  if (toutDebloque()) return true;
  if (c.type === "remarquable") return lieuxDe(t).every(l => chapitreFini(t, l));   // étape 290 : la révision, à la fin du territoire
  if (estLieu(c)) return ouvertureLieu(t, c);                                   // étape R133 : les empreintes gagnées dans le lieu d'avant ouvrent le suivant
  return carrefourOuvert(t, c.carrefour);
}
function chapitreFini(t, c) { const l = expeditionsDuChapitre(t, c.nom); return l.length > 0 && l.every(x => empreintesExp(x) >= NB_ETAPES); }
function chapitreCourant(t) {
  const choisi = suivi && suivi.chapitreCourant && chapitreParNom(t, suivi.chapitreCourant[t]);
  if (choisi && chapitreOuvert(t, choisi)) return choisi;
  const x = expeditionAReprendre(t);
  return (x && chapitreParNom(t, x.chapitre)) || chapitresDe(t)[0] || null;
}
function choisirChapitre(t, nom) {
  if (!suivi) return;
  suivi.chapitreCourant = suivi.chapitreCourant || {};
  suivi.chapitreCourant[t] = nom;
  sauvegarder();
}

// ---- Étape 290 (25/10/2026) : les vrais lieux ----
// Un lieu réel = un chapitre (onglet chapitres, type « lieu ») qui réunit des expéditions de plusieurs milieux.
// Le joueur choisit librement parmi les lieux ouverts ; les empreintes du territoire ouvrent les suivants (colonne seuil).
// Le site remarquable (type « remarquable ») s'ouvre quand tous les lieux sont terminés : on y révise le territoire.
function estLieu(c) { return !!c && c.type === "lieu"; }
function lieuxDe(t) { return chapitresDe(t).filter(estLieu); }
function aDesLieux(t) { return lieuxDe(t).length > 0; }
function siteRemarquable(t) { return chapitresDe(t).find(c => c.type === "remarquable") || null; }
// Étape R149 (07/11, retour en jouant) : un lieu n'est « Terminé » qu'avec sa finale ; avant, il reste « en cours »
function finaleAJouer(t, c) { return !!c && chapitreFini(t, c) && finaleDisponible(t, c) && !finaleFaite(t, c.nom); }
function etatLieu(t, c) {
  if (!chapitreOuvert(t, c)) return "ferme";
  if (chapitreFini(t, c)) return finaleAJouer(t, c) ? "cours" : "fini";
  return expeditionsDuChapitre(t, c.nom).some(x => expLancee(x) || empreintesExp(x) > 0) ? "cours" : "ouvert";
}
function milieuxLieu(t, c) { return [...new Set(expeditionsDuChapitre(t, c.nom).map(x => x.milieu).filter(Boolean))]; }
function especesLieu(t, c) { return new Set(expeditionsDuChapitre(t, c.nom).flatMap(x => x.liste.map(e => e.nom_courant))).size; }
function vedetteLieu(t, c) {
  const toutes = expeditionsDuChapitre(t, c.nom).flatMap(x => x.liste);
  return (c.vedette && toutes.find(e => e.nom_courant === c.vedette)) || toutes[0] || null;
}
function pastilleMilieu(m) { return `<span class="lieu-milieu">${typeof dessinReponse === "function" ? dessinReponse("milieu_principal", m) : ""}${echapper(m)}</span>`; }
function expeditionDuLieu(t, c) {          // l'expédition à reprendre dans ce lieu (sinon la première ouverte)
  const ouvertes = expeditionsOuvertes(t), liste = expeditionsDuChapitre(t, c.nom).filter(x => ouvertes.has(x.id) && empreintesExp(x) < NB_ETAPES);
  const derniere = suivi && suivi.derniereExpedition && suivi.derniereExpedition[t];
  return liste.find(x => x.id === derniere) || liste.find(x => expeditionCommencee(x)) || liste[0] || null;
}
function bulleLieuFerme(t, c, sujet) {   // étape R133
  const p = lieuPrecedent(t, c);
  if (p && !chapitreOuvert(t, p)) return `${sujet} s'ouvrira plus tard : ouvrez d'abord ${p.nom}`;
  return `${sujet} s'ouvre avec ${texteManqueLieu(t, c)}`;
}
function prochainLieu(t) { return lieuxDe(t).find(c => !chapitreOuvert(t, c)) || null; }

// ---- Le chemin : quelles expéditions sont ouvertes ----
function expeditionsOuvertes(t) {
  if (toutDebloque()) return new Set(expeditionsDe(t).map(x => x.id));   // étape 332
  if (aDesChapitres(t)) {                                                   // étape 287
    const ouvertes = new Set();
    for (const c of chapitresDe(t)) {
      if (!chapitreOuvert(t, c)) continue;
      let nouvelles = 0;
      for (const x of expeditionsDuChapitre(t, c.nom)) {
        if (empreintesExp(x) >= NB_ETAPES || expLancee(x)) { ouvertes.add(x.id); continue; }
        if (nouvelles < OUVERTES_PAR_CHAPITRE) { ouvertes.add(x.id); nouvelles++; }
      }
    }
    return ouvertes;
  }
  const liste = expeditionsDe(t), ouvertes = new Set();
  let nouvelles = 0;
  for (const x of liste) {
    if (empreintesExp(x) >= 1 || expeditionCommencee(x)) { ouvertes.add(x.id); continue; }
    if (nouvelles < NOUVELLES_OUVERTES) { ouvertes.add(x.id); nouvelles++; }
  }
  return ouvertes;
}
function estOuverte(x) { return expeditionsOuvertes(x.territoire).has(x.id); }
function etatExpedition(x, ouvertes) {
  const n = empreintesExp(x);
  if (n >= NB_ETAPES) return "finie";
  if (!(ouvertes || expeditionsOuvertes(x.territoire)).has(x.id)) return "fermee";
  return expeditionCommencee(x) ? "encours" : "nouvelle";
}

// ---- Empreintes, rangs, ouverture des territoires ----
function empreintesBonus(t) {
  if (suivi && suivi.empreintesBonus && !suivi.bonusPR1) {   // étape PR1 : les défis déjà réussis valaient 1, ils valent 2 désormais
    for (const k in suivi.empreintesBonus) suivi.empreintesBonus[k] *= 2;
    suivi.bonusPR1 = true; sauvegarder();
  }
  return (suivi && suivi.empreintesBonus && suivi.empreintesBonus[t]) || 0;
}
function empreintesTerritoire(t) { return expeditionsDe(t).reduce((s, x) => s + gainExp(x), 0) + empreintesBonus(t) + empreintesFinales(t); }   // étape PR1 : gainExp   // étape 301 : + la finale de chaque lieu
function empreintesTotal() { return tousLesTerritoires().reduce((s, t) => s + empreintesTerritoire(t), 0); }
function ajouterEmpreinteBonus(t, n) {
  if (!suivi) return;
  suivi.empreintesBonus = suivi.empreintesBonus || {};
  if (!suivi.bonusPR1) { empreintesBonus(t); suivi.bonusPR1 = true; }
  suivi.empreintesBonus[t] = (suivi.empreintesBonus[t] || 0) + n;
  sauvegarder();
}
function rangEmpreintes(t) {
  const n = empreintesTerritoire(t);
  let i = 0;
  RANGS_EMPREINTES.forEach((s, j) => { if (n >= s) i = j; });
  // Étape PR1 : « Gardien » n'a plus qu'un sens — le territoire terminé (tour du site remarquable fait)
  if (estGardien(t)) return { i: RANGS_EMPREINTES.length, nom: nomRang(RANGS_EMPREINTES.length, t), empreintes: n, suivant: null };
  const s = RANGS_EMPREINTES[i + 1];
  if (s === undefined) {
    const lieux = typeof lieuxDe === "function" ? lieuxDe(t).filter(estLieu) : [];
    const finis = lieux.filter(c => chapitreFini(t, c)).length;
    return { i, nom: nomRang(i, t), empreintes: n,
             suivant: { nom: nomRang(i + 1, t), seuil: null, gardien: true, part: lieux.length ? finis / lieux.length : 0,
                        texte: `finissez les lieux (${finis} sur ${lieux.length}), puis le tour du site remarquable` } };
  }
  return { i, nom: nomRang(i, t), empreintes: n,
           suivant: { nom: nomRang(i + 1, t), seuil: s, part: (n - RANGS_EMPREINTES[i]) / (s - RANGS_EMPREINTES[i]) } };
}

// ---- L'expédition à reprendre (le gros bouton de la couverture) ----
function expeditionAReprendre(t) {
  const ouvertes = expeditionsOuvertes(t), liste = expeditionsDe(t).filter(x => ouvertes.has(x.id) && empreintesExp(x) < NB_ETAPES);
  const derniere = suivi && suivi.derniereExpedition && suivi.derniereExpedition[t];
  const d = liste.find(x => x.id === derniere);
  // étape 287 : dans le chapitre choisi d'abord (sans le recalculer : chapitreCourant appelle cette fonction)
  const nom = suivi && suivi.chapitreCourant && suivi.chapitreCourant[t];
  const ici = nom ? liste.filter(x => x.chapitre === nom) : [];
  if (ici.length) return (d && ici.includes(d) ? d : null) || ici.find(x => expeditionCommencee(x)) || ici[0];
  if (d) return d;
  return liste.find(x => expeditionCommencee(x)) || liste[0] || null;
}

// ---- Lancer une étape ----
// Revoir 7 (étape 332) : pendant une partie lancée depuis une expédition, un bandeau rappelle où l'on est
// (lieu · expédition · étape) et ramène à l'écran de l'expédition.
function majFilExpedition(x, k) {
  let fil = document.getElementById("fil-expedition");
  const vue = document.getElementById("vue-rencontre");
  if (!vue) return;
  const bandeAvant = document.getElementById("bande-expedition");
  if (!x) { if (fil) fil.remove(); if (bandeAvant) bandeAvant.remove(); fermerIntermede(); arreterCri();   // R176 : aucun son ne survit
    if (typeof fermerEcranForme === "function") { fermerEcranForme(); arreterFormeAudio(); }   // étapes R169-R172
    return; }
  if (!fil) { fil = document.createElement("div"); fil.id = "fil-expedition"; vue.prepend(fil); }
  const couleur = (TERRITOIRES[x.territoire] || {}).couleur || "#1F3A2E";
  const etape = k === 4 ? "Étape 3 · Approfondir" : `Étape ${k} · ${ETAPES[k].titre}`;
  fil.style.setProperty("--couleur-territoire", couleur);
  // Étape R91 (Revoir 9) : pendant le jeu, la bannière de l'expédition reste en haut, en réduit (même photo, même mise en page)
  const ph = photoExp(x);
  fil.className = "fil-banniere";
  fil.dataset.exp = x.id;   // étape R188 : « Quitter » et le retour du téléphone savent à quel lieu revenir
  fil.innerHTML = `<img class="fil-fond" src="${ph}" alt=""><img class="fil-photo" src="${ph}" alt="">
    <div class="fil-corps"><button type="button" class="fil-retour">← Expédition</button>
      <div class="fil-texte"><small>${echapper(x.chapitre ? `${x.chapitre} · ${x.territoire}` : x.territoire)}</small>
        <b>${echapper(x.titre)}</b><span>${etape}</span></div></div>`;
  majBandeExpedition(x, fil, k);
  fil.querySelector(".fil-retour").onclick = () => { session = null; majFilExpedition(null); ouvrirExpedition(x); };
}
// Étape R188 : l'expédition de la partie en cours (celle du bandeau), ou null hors expédition
function expeditionDuFil() {
  const fil = document.getElementById("fil-expedition");
  return fil && fil.dataset.exp ? expeditionParId(fil.dataset.exp) || null : null;
}
// Étape R94 (01/11, choix de l'utilisateur : photo nette, M1, E1) : sous la bannière, une bande discrète avec les espèces
//   de l'expédition : trouvées (✓ + nom au survol), celle en cours (cerclée d'ocre), celles qui restent (photo nette, JAMAIS le nom).
// Étape R102 (Revoir 10, choix B1) : aux étapes 2 et 3, la bande montre où en est chaque espèce de l'étape : un anneau
//   qui se remplit (0, 1, 2 sur 2), cerclé d'ocre pour l'espèce de la question en cours, ✓ quand l'espèce est faite.
function majBandeExpedition(x, fil, k) {
  fil = fil || document.getElementById("fil-expedition");
  if (!x || !fil) return;
  let b = document.getElementById("bande-expedition");
  if (!b) { b = document.createElement("div"); b.id = "bande-expedition"; }
  fil.after(b);
  k = k || Number(b.dataset.etape) || 1;
  b.dataset.etape = k;
  if (k !== 1) {
    const ici = defi && defi.expedition && enCours && !enCours.cacherEspece ? enCours.espece : null;   // étape QI3 : « Lequel de ces animaux… ? » ne montre pas la réponse
    const faites = x.liste.filter(e => especeFaite(e, k)).length;
    b.innerHTML = `<span class="be-lib">${k === 4 ? "Approfondir" : "Leur vie"}</span><span class="be-ronds">${x.liste.map(e => {
        const but = butEspece(e, k), part = but ? Math.min(100, Math.round(100 * trouvesEspece(e, k) / but)) : 100;
        const st = especeFaite(e, k) ? "trouve" : `prog${e === ici ? " ici" : ""}`;
        const titre = `${e.nom_courant}${st === "trouve" ? " : fait" : ` : ${Math.min(trouvesEspece(e, k), but)} sur ${but}`}`;
        return `<span class="be-rond ${st}${estRenseigne(e.photo) ? "" : " silh"}" style="--p:${part}" title="${echapper(titre)}"><img src="${photoEsp(e)}" alt=""></span>`; }).join("")}</span>
      <span class="be-texte">${faites < x.liste.length ? `${faites} espèce${faites > 1 ? "s" : ""} sur ${x.liste.length} : c'est fait` : "Toutes les espèces : c'est fait"}</span><span class="be-partie"></span>`;   // étape M19 : sur téléphone, « 4 / 11 » au bout de la ligne
    // Étape R125 (choix B) : à l'étape 3, la fiche de l'espèce de la question en cours, qui se remplit (ocre = gagné dans cette partie)
    majPartieBande();
    if ((k === 4 || k === 2) && ici) {   // étape R126 : aussi à l'étape 2
      const av = defi.expedition.avantTrouves || {};
      b.innerHTML += `<div class="be-fiche">${ligneFiche(ici, av[ici.nom_courant], k)}</div>`;
    }
    return;
  }
  const enCours1 = session && session.focus ? session.focus : null;
  const trouvees = x.liste.filter(e => faiteDans(x, e, 1)).length, reste = x.liste.length - trouvees;
  b.innerHTML = `<span class="be-lib">L'expédition</span><span class="be-ronds">${x.liste.map(e => {
      const st = faiteDans(x, e, 1) ? "trouve" : e === enCours1 ? "ici" : "reste";
      const titre = st === "trouve" ? e.nom_courant : st === "ici" ? "En cours" : "À découvrir";
      // Étape RF4 : l'espèce en cours, tant qu'elle n'est pas reconnue, garde sa silhouette (sa photo donnerait la réponse
      //   aux jumelles, au sosie et aux indices)
      const cachee = RENCONTRE_COMPLETE && st === "ici" && !estIdentifiee(e) && !(session && session.presentee);
      return `<span class="be-rond ${st}${estRenseigne(e.photo) && !cachee ? "" : " silh"}" title="${echapper(titre)}"><img src="${cachee ? fichierSilhouette(e) : photoEsp(e)}" alt=""></span>`; }).join("")}</span>
    <span class="be-texte">${reste ? `${trouvees} trouvée${trouvees > 1 ? "s" : ""} · encore ${reste} à découvrir` : "Toutes trouvées"}</span>`;
}
// Étape M19 (07/11, choix B « Une seule ligne ») : sur téléphone, aux étapes 2 et 3, un seul repère au-dessus de la question :
//   les ronds des espèces (l'anneau se remplit, ocre pour l'espèce de la question) et la question de la partie au bout de la ligne.
//   La phrase « N espèces sur 7 : c'est fait », la ligne de l'espèce et les points de la partie sont cachés (style.css, étape M19).
function majPartieBande() {
  const z = document.querySelector("#bande-expedition .be-partie");
  if (z) z.textContent = defi && defi.total ? `${Math.min(defi.faites + 1, defi.total)} / ${defi.total}` : "";
}
// Étape R102 : avant chaque question d'une étape 2 ou 3, la bande se met à jour ; après la réponse, si l'espèce vient
//   d'être faite (choix B3), une bulle le dit (sauf si une fête — la médaille — l'annonce déjà).
function avantQuestionExpedition(espece) {
  if (!defi || !defi.expedition || defi.expedition.etape === 1) return;
  const x = expeditionParId(defi.expedition.id), k = defi.expedition.etape;
  defi.faiteAvant = espece ? especeFaite(espece, k) : true;
  defi.trouvesAvantQ = espece && (k === 4 || k === 2) ? trouvesEspece(espece, k) : null;   // étapes R125, R126
  majBandeExpedition(x, null, k);
}
function apresReponseExpedition(espece) {
  if (!defi || !defi.expedition || defi.expedition.etape === 1 || !espece) return;
  const x = expeditionParId(defi.expedition.id), k = defi.expedition.etape;
  majBandeExpedition(x, null, k);
  const gagne = (k === 4 || k === 2) && defi.trouvesAvantQ !== null && trouvesEspece(espece, k) > defi.trouvesAvantQ;   // étapes R125, R126 : « +1 pour … »
  if (gagne) { defi.trouvesAvantQ = trouvesEspece(espece, k);
    if (defi.faiteAvant || !especeFaite(espece, k)) setTimeout(() => { if (!feteOuverte && !fileFetes.length) afficherBulle(`+1 pour ${nomAvecArticle(espece)}`); }, 500); }
  if (!defi.faiteAvant && especeFaite(espece, k)) {
    defi.faiteAvant = true;
    const texte = `✓ ${espece.nom_courant} : ${k === 4 ? "vous la connaissez par cœur" : "vous savez comment elle vit"}`;
    setTimeout(() => { if (!feteOuverte && !fileFetes.length) afficherBulle(texte); }, 700);
  }
}
// ---- Étape R102 (Revoir 10, choix A4) : « Laquelle des deux ? » — deux espèces de l'expédition, une seule a ce trait ----
// Étape R178 (retour d'Aubin du 09/11 : rat des moissons et campagnol des champs « ont la même défense ») : la défense et la
// chasse ne servent plus à « Laquelle des deux ? » ni à la planche. Les fiches n'en gardent qu'une « principale », alors que
// beaucoup d'espèces se cachent, fuient ou se camouflent tour à tour : l'autre espèce pouvait avoir, en vrai, la même réponse.
// (Les questions à 4 réponses sur la défense et la chasse restent.)
// Étape R184 (10/11, retour d'Aubin : « pelotes de réjection » vraies pour la chevêche ET le petit-duc) : même chose pour
// l'indice de présence — la fiche n'en garde qu'un (le principal), alors qu'une espèce en laisse souvent plusieurs
// (le petit-duc : des cris la nuit, mais aussi des pelotes). La question « Quel indice trahit sa présence ? » reste.
const CHAMPS_SANS_DUO = ["defense_principale", "chasse_principale", "indice_presence"];
function piegesDuo(espece, q, bonne) {
  // seulement le mode de vie (une valeur par case) : pas les listes de proies ou de prédateurs, souvent incomplètes
  if (!defi || !defi.expedition || !q || q.format || q.type === "nombre" || !estRenseigne(bonne) || !CHAMPS_MODE_DE_VIE.includes(q.champ)) return [];
  if (CHAMPS_SANS_DUO.includes(q.champ)) return [];   // étape R178
  // Étape R151 : deux espèces de la même famille (deux oiseaux, deux insectes…), et une paire une seule fois par partie
  const deja = defi.duos || [];
  const ici = defi.especes.filter(e => e !== espece && e.onglet === espece.onglet && estIdentifiee(e) && estRenseigne(e.photo)
    && !deja.includes([espece.nom_courant, e.nom_courant].sort().join("|")));
  if (!ici.length || !estRenseigne(espece.photo)) return [];
  const surs = new Set(especesPieges(espece, q, bonne));
  return ici.filter(e => surs.has(e));
}
const QUESTIONS_DUO = {
  regime_alimentaire_type: v => `Laquelle est ${({ filtreur: "filtreuse", "suceur de sang": "suceuse de sang" })[minuscule(v)] || minuscule(v)} ?`,   // étape R145 : « filtreuse », pas « filtreur »
  activite: v => /^(surtout|à|de jour|au)/i.test(v) ? `Laquelle est active ${minuscule(v)} ?` : null,
  hibernation: v => `Laquelle ${minuscule(v)} ?`,
  deplacement_saisonnier: v => `Laquelle ${minuscule(v)} ?`,
  naissance: v => `Laquelle ${minuscule(v)} ?`,
  pelage_hiver: v => `Laquelle ${minuscule(v)} en hiver ?`,
  milieu_principal: v => `Laquelle vit surtout ici : ${minuscule(v)} ?`,
};
function questionDuo(q, v, e) {
  if (q.champ === "saison_reproduction") return `Laquelle ${accouplementSeul(e) ? "s'accouple" : "se reproduit"} ${saisonEnPhrase(v)} ?`;   // étape R184
  const f = QUESTIONS_DUO[q.champ], t = f ? f(v) : null;
  return t || `${q.libelle} : ${minuscule(v).replace(" : ", ", ")}. Laquelle des deux ?`;   // étape R149 : « sans chrysalide, la larve… »
}
function poserDuo(espece, q, bonne) {
  const autre = auHasard(piegesDuo(espece, q, bonne));
  if (defi) { defi.duos = defi.duos || []; defi.duos.push([espece.nom_courant, autre.nom_courant].sort().join("|")); }   // étape R151
  enTete(espece, false, false, "Laquelle des deux ?");
  document.getElementById("question").textContent = questionDuo(q, bonne, espece);
  const zone = document.getElementById("reponses");
  zone.className = "grille-photos duo-exp";
  for (const e of melanger([espece, autre])) {
    const bouton = document.createElement("button");
    bouton.className = "reponse choix-photo";
    bouton.innerHTML = `<div class="photo">${celluleImage(e, true)}</div><div class="legende">${e.nom_courant}</div>`;
    if (e === espece) bouton.dataset.juste = "oui";
    bouton.onclick = () => repondre(bouton, e === espece);
    zone.appendChild(bouton);
  }
  enCours.explication = `C'était : ${espece.nom_courant}. ` + enCours.explication;
}
function lancerExpedition(x, k) {
  if (!x) return;
  if (!estOuverte(x)) { afficherBulle("Cette expédition s'ouvrira en avançant sur le chemin"); return; }
  k = k || etapeEnCours(x) || 1;
  if (k > NB_ETAPES && k !== 4) k = NB_ETAPES;          // étape 298 : plus d'étape « Leurs liens »
  if (k > 1 && k !== 4 && !etapeFinie(x, k - 1) && !toutDebloque()) k = etapeEnCours(x) || 1;   // étape 332 : tout débloqué
  suivi.derniereExpedition = suivi.derniereExpedition || {};
  suivi.derniereExpedition[x.territoire] = x.id;
  suivi.expLancees = suivi.expLancees || {};          // étape 287 : « en cours » seulement si lancée
  suivi.expLancees[x.id] = true;
  if (x.chapitre) { suivi.chapitreCourant = suivi.chapitreCourant || {}; suivi.chapitreCourant[x.territoire] = x.chapitre; }
  sauvegarder();
  depuisArcade = false; modeLibre = false;
  if (k === 1) { lancerRencontreExpedition(x); return; }   // étape 288 : une Rencontre physique, une espèce
  if (k === 2 && RENCONTRE_COMPLETE && typeof liensOk === "function" && !liensOk(x)) { ouvrirLiensExp(x); return; }   // étape RF3 : « Leurs liens »
  if (k === 2 && typeof planchePrete === "function" && planchePrete(x)) { ouvrirPlancheExp(x); return; }   // étape R171 : « La planche » (RF3 : après leurs liens)
  if (k === 2 && RENCONTRE_COMPLETE && etapeFinie(x, 2)) { ouvrirExpedition(x); return; }   // étape RF3 : plus rien à jouer dans l'étape 2
  document.getElementById("bouton-territoire-defi").textContent = "Retour au territoire";
  territoiresDefi = [x.territoire];
  territoiresChoisis = [x.territoire];
  jeuChoisi = "revision"; revisionsSeules = false; photosSeules = (k === 1); questionsClassique = QUESTIONS_REVISION;
  // Étape R101 : Approfondir pose seulement ce qui reste à découvrir (plus de questions déjà vues à l'étape 2)
  if (k === 4) { const n = nouveautesApprofondir(x); if (n > 0) questionsClassique = Math.min(QUESTIONS_REVISION, n); }
  // Étape R102 (choix A4) : l'étape 2 pose jusqu'à 3 choses nouvelles par espèce (2 restent exigées : rien ne recule)
  if (k === 2) questionsClassique = Math.max(QUESTIONS_REVISION, Math.min(TRAITS_VIE_POSES * x.liste.length, nouveautesEtape2(x)));
  // Étape M17 (07/11/2026, choix d'Aubin : « 2 parties d'environ 10 ») : sur téléphone, l'étape 2 se joue en parties
  // courtes, comme Approfondir — 11 questions, puis le reste (une dernière partie de 14 au plus n'est pas recoupée).
  // Rien n'est perdu entre deux parties : chaque bonne réponse est gardée. Sur ordinateur, rien ne change.
  // Étape M29 (07/11/2026, choix d'Aubin) : pareil sur ordinateur.
  if (k === 2 && questionsClassique > PARTIE_ETAPE2_MAX) questionsClassique = PARTIE_ETAPE2;
  const d = { cle: "exp|" + x.id, nom: x.titre, especes: x.liste.slice(), ouvert: true };
  lancementDirect = true;
  montrer("jouer");
  lancementDirect = false;
  const avantTrouves = (k === 4 || k === 2) ? Object.fromEntries(x.liste.map(e => [e.nom_courant, trouvesEspece(e, k)])) : null;   // étapes R125, R126
  demarrerDefi(d, { jouer: true, expedition: { id: x.id, etape: k, avant: empreintesExp(x), avantGain: gainExp(x), avantTerr: empreintesTerritoire(x.territoire), avantTrouves } });
  questionsClassique = QUESTIONS_REVISION;
  majFilExpedition(x, k);
}

const TRAITS_VIE_POSES = 3;            // étape R102 : à l'étape 2, jusqu'à 3 choses nouvelles posées par espèce (2 exigées)
const PARTIE_ETAPE2 = 11, PARTIE_ETAPE2_MAX = 14;   // étape M17 : l'étape 2 en parties d'environ 10 questions (M29 : aussi sur ordinateur)
function nouveautesEtape2(x) {
  return x.liste.filter(estIdentifiee).reduce((n, e) => n + Math.min(TRAITS_VIE_POSES, champsEtape(e, 2)
    .filter(c => QUESTIONS.some(q => q.champ === c) && nbBonnes(e, c) === 0).length), 0);
}
// Étape R101 : combien de questions encore jamais trouvées Approfondir peut poser dans cette expédition
function nouveautesApprofondir(x) {
  return x.liste.filter(estIdentifiee).reduce((n, e) => n + champsEtape(e, 4)
    .filter(c => QUESTIONS.some(q => q.champ === c) && nbBonnes(e, c) === 0).length, 0);
}
// Étape R124 (Revoir 11, choix de l'utilisateur « garder, mais mieux l'expliquer ») : l'avancée d'Approfondir en choses
// découvertes (pas seulement en espèces finies), et le nombre de parties qui restent, à 10 questions par partie.
function avanceeApprofondir(x) {
  let faites = 0, total = 0;
  for (const e of x.liste) { const but = butEspece(e, 4); total += but; faites += Math.min(but, trouvesEspece(e, 4)); }
  const reste = total - faites, parties = Math.ceil(reste / QUESTIONS_REVISION), esp = avanceeEtape(x, 4);
  return { faites, total, reste, parties, especes: esp.faites, nbEspeces: esp.total };
}
// Étape R125 (Revoir 11, choix de l'utilisateur : maquette B « les fiches qui se remplissent ») : à l'étape 3, chaque espèce
// a une ligne de petites cases, une par chose à découvrir ; vert = déjà trouvé, ocre = trouvé pendant cette partie.
// avant = ce que l'espèce avait trouvé au début de la partie (undefined : pas de cases ocre).
// Étape R126 (04/11, « on essaie ») : la même ligne pour l'étape en cours 1 ou 2 (k = 1, 2 ou 4).
function casesFiche(e, avant, k = 4) {
  const but = butEspece(e, k), trouves = Math.min(but, trouvesEspece(e, k));
  const neuf = avant === undefined ? 0 : Math.max(0, trouves - Math.min(but, avant)), ok = trouves - neuf;
  let h = "";
  for (let i = 0; i < but; i++) h += `<span class="${i < ok ? "ok" : i < trouves ? "neuf" : ""}"></span>`;
  return { html: h, trouves, but, neuf };
}
function ligneFiche(e, avant, k = 4, x = null) {
  const c = casesFiche(e, avant, k), finie = x ? faiteDans(x, e, k) : c.trouves >= c.but;
  const nom = k === 1 && !estIdentifiee(e) ? "À découvrir" : e.nom_courant;   // étape 1 : jamais le nom d'une espèce pas encore trouvée
  return `<div class="fiche-ligne${finie ? " finie" : ""}" title="${echapper(nom)}">
      <span class="be-rond${finie ? " trouve" : ""}${estRenseigne(e.photo) ? "" : " silh"}"><img src="${photoEsp(e)}" alt=""></span>
      <span class="fiche-nom${nom === e.nom_courant ? "" : " inconnue"}">${echapper(nom)}</span><span class="fiche-cases">${c.html}</span>
      <span class="fiche-compte">${k === 1 && x && !finie && c.but && c.trouves >= c.but ? "à revoir ici" : k === 1 && x && !finie && estTentee(x, e) ? `${c.trouves}/${c.but} · à revoir` : `${c.trouves}/${c.but}`}</span></div>`;   // R126 : connue ailleurs, à revoir dans l'expédition
}
function texteResteApprofondir(x) {   // étape R125 : sous les fiches, ce qui reste
  const a = avanceeApprofondir(x);
  // Étape R149 : le nombre de choses à découvrir, qui baisse à chaque partie (le nombre de parties, arrondi, bougeait peu)
  return a.reste <= 0 ? `Les ${a.nbEspeces} espèces connues par cœur`
    : `Encore ${a.reste} chose${a.reste > 1 ? "s" : ""} à découvrir, environ ${a.parties} partie${a.parties > 1 ? "s" : ""} de 10 questions`;
}
// Étape R149 : à l'étape 2, ce qui reste se compte sur les espèces pas encore faites (avant : toutes, d'où « 21 » au lieu de 11)
function texteResteEtape2(x) {
  const n = x.liste.filter(e => estIdentifiee(e) && !faiteDans(x, e, 2)).reduce((s, e) => s + Math.min(TRAITS_VIE_POSES, champsEtape(e, 2)
    .filter(c => QUESTIONS.some(q => q.champ === c) && nbBonnes(e, c) === 0).length), 0);
  const parties = Math.max(1, Math.ceil(n / PARTIE_ETAPE2_MAX));
  return `Encore ${parties > 1 ? `environ ${parties} parties` : "une partie"}`;
}
// Étape R125 (choix B) : le bilan d'une partie de l'étape 3 — combien de choses découvertes, et les fiches qui ont avancé
function bilanApprofondir(x, info, gagnees) { return bilanEtape(x, info, gagnees, 4); }
function lignesGagnees(x, info, k) {   // étape R126 : les espèces qui ont avancé pendant la partie, et combien de cases
  const av = (info && info.avantTrouves) || {};
  const lignes = x.liste.filter(e => av[e.nom_courant] !== undefined && Math.min(butEspece(e, k), trouvesEspece(e, k)) > Math.min(butEspece(e, k), av[e.nom_courant]));
  return { av, lignes, n: lignes.reduce((t, e) => t + casesFiche(e, av[e.nom_courant], k).neuf, 0) };
}
function bilanEtape(x, info, gagnees, k) {
  const { av, lignes, n } = lignesGagnees(x, info, k);
  if (k !== 4) return `<b>+${n} chose${n > 1 ? "s" : ""} découverte${n > 1 ? "s" : ""}</b> <span class="fiche-aide">en ocre : ce que vous venez de trouver</span>${gagnees ? ` +${gagnees} empreinte${gagnees > 1 ? "s" : ""}` : ""}
    ${lignes.length ? `<div class="fiches-exp">${lignes.map(e => ligneFiche(e, av[e.nom_courant], k, x)).join("")}</div>` : ""}
    <small>${avanceeEtape(x, k).faites} espèce${avanceeEtape(x, k).faites > 1 ? "s" : ""} sur ${x.liste.length} : c'est fait.</small>`;
  const tete = n ? `<b>+${n} chose${n > 1 ? "s" : ""} découverte${n > 1 ? "s" : ""}</b> <span class="fiche-aide">en ocre : ce que vous venez de trouver</span>`
                 : `<b>Approfondir</b> : rien de nouveau cette fois, les questions manquées reviendront.`;
  return `${tete}${gagnees ? ` +${gagnees} empreinte${gagnees > 1 ? "s" : ""}` : ""}
    ${lignes.length ? `<div class="fiches-exp">${lignes.map(e => ligneFiche(e, av[e.nom_courant])).join("")}</div>` : ""}
    <small>${texteResteApprofondir(x)}.</small>`;
}
// ---- Étape 288 : l'étape 1, une Rencontre physique sur UNE espèce de l'expédition ----
// L'espèce : la première de la liste dont la fiche physique n'est pas encore faite (photo + traits d'allure + cri + empreinte).
// Étape R132 : une espèce déjà rencontrée ici, à qui il manque un trait, ne repasse pas en Rencontre : ses traits manqués
// reviennent seuls, à la fin de l'étape (lancerRattrapage).
// ---- Étape RF1 : sa vie dans la Rencontre (vrai ou faux), sujets qui tournent d'une espèce à l'autre ----
const sujetsVusExp = {};               // en mémoire : les sujets de vie de l'espèce précédente, par expédition (règle S1)
function vieEnVraiFaux(e, c) {
  const q = QUESTIONS.find(x => x.champ === c);
  if (!q || !q.affirmation || q.type === "nombre" || q.format || (q.formats && !q.formats.includes("vraifaux"))) return false;
  const v = q.tirer ? q.tirer(e) : valeurDe(e, q);
  return estRenseigne(v) && autresValeurs(q, v, e).length >= 1;
}
function vieRencontre(x, e) {
  if (!RENCONTRE_COMPLETE || !x || especeFaite(e, 2)) return [];
  const deja = champsEtape(e, 2).filter(c => nbBonnes(e, c) >= 1).length;   // ce qu'on sait déjà de sa vie compte (RF2 : 3 cartes au plus)
  const n = Math.max(0, VIE_PAR_RENCONTRE - deja);
  if (!n) return [];
  const vus = sujetsVusExp[x.id] || [];
  const possibles = melanger(champsEtape(e, 2).filter(c => nbBonnes(e, c) === 0 && vieEnVraiFaux(e, c)
    && !(c === "milieu_principal" && x.milieu && e.milieu_principal === x.milieu)));   // « Au bord du lac » : « vit dans les lacs » se devine
  const choix = [...possibles.filter(c => !vus.includes(c)), ...possibles.filter(c => vus.includes(c))].slice(0, n);
  sujetsVusExp[x.id] = choix;
  return choix;
}
// Étape RF6 : quand la photo est reconnue, l'ensemble en pictogrammes (ce qu'on ne demande plus : couleur, robe, corps, bec)
function pictosEnsemble(e) {
  const lignes = TRAITS_ENSEMBLE.map(c => QUESTIONS.find(q => q.champ === c)).filter(q => q && (!q.pour || q.pour(e))).map(q => {
    let v; try { v = valeurDe(e, q); } catch (err) { return ""; }
    if (!estRenseigne(v) || v === "NA" || String(v).startsWith("NA")) return "";
    const texte = q.affichageFiche ? q.affichageFiche(e, v) : majuscule(String(v));
    const dessin = q.sansImage || q.format !== "picto" ? "" : dessinReponse(q.colonnePicto, v);
    return `<span class="pe-ensemble-item">${dessin ? `<span class="picto">${dessin}</span>` : ""}<span><small>${echapper(q.libelle || "")}</small>${texte}</span></span>`;
  }).filter(Boolean).slice(0, 3);
  return lignes.length ? `<span class="pe-ensemble">${lignes.join("")}</span>` : "";
}
// ---- Étape RF2 (choix d'Aubin : « apprendre à chaque question ») : « Bravo ! … Et aussi : … » ----
//   Après un trait d'allure trouvé, un détail physique de sa fiche (colonne adaptations_physiques) : de préférence
//   sur la même partie du corps, sinon un autre détail pas encore montré dans cette Rencontre.
const PARTIES_ADAPTATIONS = { bec_forme: /bec/, bec_couleur: /bec/, ornement_tete: /huppe|crête|crete|tête|tete|corne|bois/,
  queue_forme: /queue/, queue_vol: /queue/, queue_poisson: /queue|nageoire/, queue_adulte: /queue/, oreilles_forme: /oreille/, oreilles_taille: /oreille/,
  pattes_aspect: /patte|doigt|serre/, pattes_type: /patte|doigt|serre/, doigts_disposition: /doigt|patte/, corps_forme: /corps|forme/,
  nageoires_dos: /nageoire|épine|epine/, barbillons: /barbillon/, antennes_forme: /antenne/, ailes_repos: /aile/, ailes_visibles: /aile/,
  couleur_dominante: /plumage|pelage|robe|couleur|tache|bande|miroir|rayure/, robe: /plumage|pelage|robe|tache|bande|rayure|point/,
  coquille: /coquille/, peau_texture: /peau|pustule|glande/, pupille_forme: /pupille|œil|oeil|yeux/, yeux_couleur: /œil|oeil|yeux/ };
function detailPhysique(e, champ) {
  if (!estRenseigne(e.adaptations_physiques) || String(e.adaptations_physiques).startsWith("NA")) return "";
  const clauses = String(e.adaptations_physiques).split(";").map(t => t.trim()).filter(Boolean);
  const vus = (session && session.detailsVus) || [];
  const libres = clauses.filter(c => !vus.includes(c));
  if (!libres.length) return "";
  const motif = PARTIES_ADAPTATIONS[champ];
  const c = (motif && libres.find(t => motif.test(t.toLowerCase()))) || libres[0];
  if (session) session.detailsVus = [...vus, c];
  return c.charAt(0).toUpperCase() + c.slice(1);
}
// Étape RF1 : « Qui rencontrer ensuite ? » — le joueur choisit ; chaque silhouette a un mot de terrain (jamais le nom)
const MOTS_TERRAIN = {
  "Falaises et rochers": "Sur les rochers", "Alpages et pelouses d'altitude": "Dans l'alpage", "Forêt": "Sous les arbres",
  "Campagne, haies et jardins": "Le long de la haie", "Rivières et torrents": "Au bord de la rivière", "Landes et coteaux secs": "Sur le coteau sec",
  "Mares et étangs": "Au bord de l'étang", "Lacs": "Dans le lac", "Marais": "Dans le marais", "Mer et océan": "Près de la mer",
  "Estuaires et lagunes": "Dans la lagune", "Dunes et plages": "Sur la dune", "Garrigue et maquis": "Dans la garrigue" };
function motTerrain(e) { return MOTS_TERRAIN[e.milieu_principal] || "Quelque part ici"; }
const prochaineChoisie = {};           // en mémoire : l'espèce choisie pour la rencontre suivante, par expédition
function blocQuiEnsuite(x) {
  const restent = x.liste.filter(e => !faiteDans(x, e, 1) && !(estTentee(x, e) && manquesEtape1(e).length) && !especeFaite(e, 1));
  if (restent.length < 2) return "";
  const cartes = restent.map(e => `<button class="qui-ensuite-carte" data-nom="${echapper(e.nom_courant)}">
      <span class="qui-ensuite-silh">${imgMini(fichierSilhouette(e), "")}</span>
      <span class="qui-ensuite-texte"><b>${motTerrain(e)}</b><small>${echapper(e.nom_affichage_groupe || "")}</small></span></button>`).join("");
  return `<div class="qui-ensuite"><h3>Qui rencontrer ensuite ?</h3><div class="qui-ensuite-liste">${cartes}</div></div>`;
}
function brancherQuiEnsuite(x, zone) {
  for (const b of zone.querySelectorAll(".qui-ensuite-carte")) b.onclick = () => {
    prochaineChoisie[x.id] = b.dataset.nom;
    if (intermedePret(x)) ouvrirIntermede(x, "Continuer ▶"); else lancerExpedition(x, 1);
  };
}
function especeAConnaitre(x) {
  const ok = e => !faiteDans(x, e, 1) && !(estTentee(x, e) && manquesEtape1(e).length);
  const choisie = prochaineChoisie[x.id] && x.liste.find(e => e.nom_courant === prochaineChoisie[x.id]);   // étape RF1
  if (choisie && ok(choisie) && !especeFaite(choisie, 1)) return choisie;
  return x.liste.find(ok) || null;
}
function lancerRencontreExpedition(x) {
  const e = especeAConnaitre(x);
  if (!e) { if (aRattraper(x).length) lancerRattrapage(x); else lancerExpedition(x, 2); return; }
  if (especeFaite(e, 1)) { lancerRevueExpedition(x); return; }   // étape 316 : déjà connue ailleurs → la courte révision
  rencontreDuJour = null;
  session = null;
  modeLibre = false; depuisArcade = false;
  jeuChoisi = "rencontre";
  lancementDirect = true;
  montrer("jouer");
  lancementDirect = false;
  demarrerFocus(e, { expedition: { id: x.id, etape: 1, avant: empreintesExp(x), avantGain: gainExp(x), avantTerr: empreintesTerritoire(x.territoire),
                                    faitesAvant: avanceeEtape(x, 1).faites } });
  majFilExpedition(x, 1);
  window.scrollTo(0, 0);
}
// Étape 316 : la courte révision des espèces déjà connues ailleurs — une photo à reconnaître par espèce
// Étape R184 (10/11, demande d'Aubin) : une espèce ratée revient À LA FIN de la même révision, avec « Vous arrivez à la
// reconnaître maintenant ? ». Ratée une 2e fois, elle compte quand même ici (comme le rattrapage, R146) et sa photo
// revient dans les prochaines parties (« Déjà croisée… ») : la même question ne tourne plus en boucle à chaque ouverture.
// reprise : les espèces confondues dans la révision groupée, reposées tout de suite (toutes leurs questions sont des reprises).
function lancerRevueExpedition(x, reprise) {
  if (!reprise && typeof revueGroupeePossible === "function" && revueGroupeePossible(x)) { ouvrirRevueGroupee(x); return; }   // étape R173 : la révision groupée
  const liste = reprise ? reprise.filter(e => especesARevoirIci(x).includes(e)) : especesARevoirIci(x);
  if (!liste.length) { lancerExpedition(x, etapeEnCours(x) || 2); return; }
  document.getElementById("bouton-territoire-defi").textContent = "Retour au territoire";
  territoiresDefi = [x.territoire];
  territoiresChoisis = [x.territoire];
  jeuChoisi = "revision"; revisionsSeules = true; photosSeules = true; questionsClassique = liste.length;
  const d = { cle: "exp|" + x.id, nom: x.titre, especes: x.liste.slice(), ouvert: true };
  lancementDirect = true;
  montrer("jouer");
  lancementDirect = false;
  demarrerDefi(d, { jouer: true, expedition: { id: x.id, etape: 1, revue: true, toutEnReprise: !!reprise, especesRevue: liste.map(e => e.nom_courant),
                                               avant: empreintesExp(x), avantGain: gainExp(x), avantTerr: empreintesTerritoire(x.territoire) } });
  questionsClassique = QUESTIONS_REVISION;
  majFilExpedition(x, 1);
}
// Étape R184 : la photo ratée dans la révision revient une fois, à la fin (une question de plus)
function revueARepreendre(e) {
  const info = defi && defi.expedition;
  if (!info || !info.revue || info.toutEnReprise || defi.questionReprise) return false;
  defi.reprisesFin = defi.reprisesFin || [];
  if (defi.reprisesFin.includes(e.nom_courant)) return false;
  defi.reprisesFin.push(e.nom_courant);
  defi.total = defi.total + 1;
  return true;
}
// Étape R184 : ratée à la reprise → elle compte ici quand même ; elle reviendra dans les prochaines parties
function revuePassee(e) {
  const info = defi && defi.expedition;
  if (!info || !info.revue || !defi.questionReprise) return false;
  marquerRevue(info.id, e);
  defi.revuesPassees = (defi.revuesPassees || 0) + 1;
  if (defi.manquees) defi.manquees = defi.manquees.filter(m => m.espece !== e);   // déjà reposée : pas de « Essayer à nouveau » en plus
  return true;
}
// Étape R132 : les traits manqués à l'étape 1, reposés seuls (une question par trait manqué)
function lancerRattrapage(x) {
  const n = nbTraitsARevoir(x);
  if (!n) { lancerExpedition(x, etapeEnCours(x) || 2); return; }
  document.getElementById("bouton-territoire-defi").textContent = "Retour au territoire";
  territoiresDefi = [x.territoire];
  territoiresChoisis = [x.territoire];
  jeuChoisi = "revision"; revisionsSeules = false; photosSeules = false; questionsClassique = n;
  const d = { cle: "exp|" + x.id, nom: x.titre, especes: aRattraper(x), ouvert: true };
  lancementDirect = true;
  montrer("jouer");
  lancementDirect = false;
  demarrerDefi(d, { jouer: true, expedition: { id: x.id, etape: 1, rattrapage: true, avant: empreintesExp(x), avantGain: gainExp(x), avantTerr: empreintesTerritoire(x.territoire) } });
  questionsClassique = QUESTIONS_REVISION;
  majFilExpedition(x, 1);
}
// La fin d'une Rencontre d'expédition (appelé à la fin de terminerSession) : le bloc de l'expédition et la suite
function finRencontreExpedition(s) {
  const info = s.expedition, x = expeditionParId(info.id);
  const zone = document.getElementById("exp-fin-session");
  if (!x || !zone) return;
  if (prochaineChoisie[x.id] === s.focus.nom_courant) delete prochaineChoisie[x.id];   // étape RF1
  if (especeFaite(s.focus, 1)) marquerRevue(x.id, s.focus);   // étape 316 : rencontrée ici, elle compte pour cette expédition
  else marquerTentee(x, s.focus);                             // étape R132 : ses traits manqués reviendront à la fin de l'étape
  majBandeExpedition(x);                                      // étape R94 : la bande des espèces se met à jour
  const e = s.focus, apres = empreintesExp(x), av = avanceeEtape(x, 1), faite = especeFaite(e, 1);
  const gagnees = Math.max(0, gainExp(x) - (info.avantGain || 0)), etapeGagnee = apres > info.avant, suite = especeAConnaitre(x);   // étape PR1
  document.getElementById("titre-fin-session").textContent = `${x.titre} · ${RENCONTRE_COMPLETE ? "rencontre" : "faire connaissance"}`;
  zone.classList.remove("cache");
  // Étape RF1 : la Rencontre complète peut finir toute l'expédition (sa vie était dans la Rencontre)
  if (RENCONTRE_COMPLETE && etapeFinie(x, 2) && info.avant < NB_ETAPES) { finExpeditionParRencontre(x, s, gagnees, zone); return; }
  const quiEnsuite = RENCONTRE_COMPLETE && !etapeFinie(x, 1) && faite ? blocQuiEnsuite(x) : "";
  zone.innerHTML = `<div class="exp-fin">
      <div class="exp-fin-pas">${dessinGain(x)}</div>
      <div class="exp-fin-texte">${etapeFinie(x, 1) ? `<b>Étape 1 réussie !</b> Vous avez fait connaissance avec les ${av.total} espèces.${gagnees ? ` +${gagnees} empreinte${gagnees > 1 ? "s" : ""}` : ""}`
        : `<b>${faite ? `${e.nom_courant} : fait !` : `${e.nom_courant} : ${manquesEtape1(e).length} ${manquesEtape1(e).length > 1 ? "choses" : "chose"} à revoir`}</b>${gagnees ? ` +${gagnees} empreinte${gagnees > 1 ? "s" : ""}` : ""} · ${av.faites} espèce${av.faites > 1 ? "s" : ""} sur ${av.total} connue${av.faites > 1 ? "s" : ""}.${faite ? "" : " Seul ce qui manque reviendra, à la fin de l'étape."}`}</div>
      <button class="ac-bouton" id="exp-fin-ecran-r">Voir l'expédition</button></div>${quiEnsuite}${blocFinLieu(x, gagnees)}`;
  document.getElementById("exp-fin-ecran-r").onclick = () => { session = null; ouvrirExpedition(x); };
  if (quiEnsuite) brancherQuiEnsuite(x, zone);
  const principal = document.getElementById("bouton-rejouer");
  if (etapeFinie(x, 1)) {                              // étape R182 (10/11, demande d'Aubin) : une étape finie ramène à l'expédition,
    principal.textContent = "Voir l'expédition";       // sans proposer l'étape suivante
    principal.onclick = () => { session = null; ouvrirExpedition(x); };
    document.getElementById("exp-fin-ecran-r").classList.add("cache");
  } else {
  principal.textContent = etapeFinie(x, 1) ? "Étape 2 ▶" : suite && suite !== e ? (especeFaite(suite, 1) ? "Revoir les espèces déjà rencontrées ▶" : estIdentifiee(suite) ? `Espèce suivante : ${suite.nom_courant} ▶` : "Espèce suivante ▶")
    : aRattraper(x).length ? `Revoir ${texteARevoir(x)} ▶` : `Reprendre ${e.nom_courant} ▶`;   // étape R132
  principal.onclick = () => { if (!etapeFinie(x, 1) && intermedePret(x)) ouvrirIntermede(x, principal.textContent); else lancerExpedition(x, etapeFinie(x, 1) ? 2 : 1); };   // étape ET1
  }
  document.getElementById("bouton-fin-accueil").classList.add("cache");
  if (etapeGagnee) {                                   // étape PR1 : la fête pour l'étape ; une simple bulle pour chaque espèce
    feter({ etiquette: `Expédition · ${x.titre}`, titre: "Étape 1 réussie", detail: `Prochaine étape : ${RENCONTRE_COMPLETE ? "leurs liens" : "leur vie"} (+${GAIN_FIN_EXPEDITION} empreintes à la clé).`,
            son: "badge", visuel: `<div class="fete-visuel rang exp-fete">${PAS_SVG}</div>` });
  } else if (gagnees) setTimeout(() => afficherBulle(`+${gagnees} empreinte${gagnees > 1 ? "s" : ""} · ${e.nom_courant}`), 600);
  if (gagnees) verifierOuverture();
}
// Étape RF1 : la dernière Rencontre finit toute l'expédition (sa vie était posée dans la Rencontre) : la fête de fin
function finExpeditionParRencontre(x, s, gagnees, zone) {
  zone.innerHTML = `<div class="exp-fin"><div class="exp-fin-pas">${dessinGain(x)}</div>
      <div class="exp-fin-texte"><b>Expédition terminée !</b> Vous avez rencontré les ${x.liste.length} espèces.${gagnees ? ` +${gagnees} empreinte${gagnees > 1 ? "s" : ""}` : ""}</div></div>${blocFinLieu(x, gagnees, true)}`;
  const principal = document.getElementById("bouton-rejouer");
  principal.textContent = "Voir l'expédition";
  principal.onclick = () => { session = null; ouvrirExpedition(x); };
  document.getElementById("bouton-fin-accueil").classList.add("cache");
  feter({ etiquette: `Expédition · ${x.titre}`, titre: "Expédition terminée !", detail: gagnees ? `+${gagnees} empreinte${gagnees > 1 ? "s" : ""}` : "",
          son: "badge", visuel: `<div class="fete-visuel rang exp-fete">${PAS_SVG}</div>` });
  if (gagnees) verifierOuverture();
}
// ---- Étape ET1 (03/11, choix de l'utilisateur : idées 1 et 2) : un intermède pendant l'étape 1 ----
// Toutes les INTERMEDE_ESPECES espèces trouvées, avant d'enchaîner sur la suivante : « Qui est qui ? » (remettre les noms
// sur les photos des espèces qu'on vient de rencontrer), puis « À qui est ce cri ? » si l'une d'elles a un cri.
// Rien n'est enregistré, rien ne se perd : c'est une respiration pour retenir. On peut toujours passer.
// Seules les espèces déjà trouvées dans l'expédition apparaissent : jamais le nom d'une espèce à découvrir.
const INTERMEDE_ESPECES = 3;           // un intermède toutes les 3 espèces trouvées (2 = plus souvent)
const INTERMEDE_PHOTOS = 4;            // au plus 4 photos dans « Qui est qui ? » (les nouvelles d'abord, puis les plus anciennes)
const intermedesVus = {};              // en mémoire : les espèces déjà passées dans un intermède, par expédition
function avecPhoto(e) { return estRenseigne(e.photo); }
function intermedePret(x) {
  const vus = intermedesVus[x.id] || [];
  const trouvees = x.liste.filter(e => faiteDans(x, e, 1) && avecPhoto(e));
  return trouvees.length >= 2 && trouvees.filter(e => !vus.includes(e.nom_courant)).length >= INTERMEDE_ESPECES;
}
let intermede = null;
function fermerIntermede() {
  const z = document.getElementById("intermede-exp");
  if (z) z.remove();
  if (intermede && intermede.son) intermede.son.pause();
  intermede = null;
}
function ouvrirIntermede(x, libelleSuite) {
  const vus = intermedesVus[x.id] = intermedesVus[x.id] || [];
  const trouvees = x.liste.filter(e => faiteDans(x, e, 1) && avecPhoto(e));
  const nouvelles = trouvees.filter(e => !vus.includes(e.nom_courant));
  const anciennes = melanger(trouvees.filter(e => vus.includes(e.nom_courant)));
  const choisies = [...nouvelles.slice(-INTERMEDE_PHOTOS), ...anciennes].slice(0, INTERMEDE_PHOTOS);
  for (const e of trouvees) if (!vus.includes(e.nom_courant)) vus.push(e.nom_courant);
  const avecCri = melanger(choisies.filter(e => fichierSon(e) !== "NA"));
  intermede = { x, suite: libelleSuite, especes: choisies, cri: (typeof formeEtape1 === "function" && formeEtape1(x) === "cri") ? null : (avecCri[0] || null), choix: null, reste: choisies.length, erreurs: 0 };   // R169 : pas de cri en double dans « Par le cri »
  document.getElementById("fin-session").classList.add("cache");
  let z = document.getElementById("intermede-exp");
  if (!z) { z = document.createElement("div"); z.id = "intermede-exp"; document.getElementById("vue-rencontre").appendChild(z); }
  dessinerQuiEstQui();
  window.scrollTo(0, 0);
}
function suiteIntermede() { const x = intermede.x; fermerIntermede(); lancerExpedition(x, 1); }
function enteteIntermede(titre, consigne) {
  return `<div class="im-tete"><span class="im-lib">Petite pause</span><h2>${titre}</h2><p>${consigne}</p></div>`;
}
function piedIntermede(fini) {
  return `<div class="im-pied">${fini ? `<button class="bouton-accueil principal" id="im-suite">${echapper(intermede.suite)}</button>`
    : `<button class="im-passer" id="im-passer">Passer ▶</button>`}</div>`;
}
function brancherPied() {
  const s = document.getElementById("im-suite"); if (s) s.onclick = suiteIntermede;
  const p = document.getElementById("im-passer"); if (p) p.onclick = suiteIntermede;
}
// Étape R101 (Revoir 10) : on peut associer dans les deux sens — un nom puis sa photo, ou une photo puis son nom.
function dessinerQuiEstQui() {
  const z = document.getElementById("intermede-exp"), im = intermede;
  const photos = melanger(im.especes.slice()), noms = melanger(im.especes.slice());
  im.choix = null;                                   // { sorte: "nom" | "photo", i }
  z.innerHTML = `<div class="im-carte">${enteteIntermede("Qui est qui ?", "Sélectionnez un nom puis sa photo, ou une photo puis son nom.")}
    <div class="im-photos">${photos.map((e, i) => `<button type="button" class="im-photo" data-i="${im.especes.indexOf(e)}">
        <img src="${photoMini(e.photo)}" alt=""><span class="im-etiquette"></span></button>`).join("")}</div>
    <div class="im-noms">${noms.map(e => `<button type="button" class="im-nom" data-i="${im.especes.indexOf(e)}">${echapper(e.nom_courant)}</button>`).join("")}</div>
    <p class="im-retour" id="im-retour"></p>${piedIntermede(false)}</div>`;
  const retour = document.getElementById("im-retour");
  const marquer = () => {
    z.querySelectorAll(".im-nom").forEach(o => o.classList.toggle("choisi", !!im.choix && im.choix.sorte === "nom" && Number(o.dataset.i) === im.choix.i));
    z.querySelectorAll(".im-photo").forEach(o => o.classList.toggle("choisi", !!im.choix && im.choix.sorte === "photo" && Number(o.dataset.i) === im.choix.i));
  };
  // Associer le nom n° iNom et la photo n° iPhoto
  const associer = (iNom, iPhoto) => {
    const ph = z.querySelector(`.im-photo[data-i="${iPhoto}"]`), e = im.especes[iNom];
    im.choix = null; marquer();
    if (iNom === iPhoto) {
      ph.classList.add("juste"); ph.querySelector(".im-etiquette").textContent = e.nom_courant;
      const b = z.querySelector(`.im-nom[data-i="${iNom}"]`); b.disabled = true; b.classList.add("place");
      im.reste--; retour.textContent = "";
      jouerSon("bonne");
      if (im.reste === 0) setTimeout(() => { if (intermede !== im) return;   // étape R149 : l'intermède a été passé entre-temps
        (im.cri ? dessinerCriIntermede() : dessinerBravoIntermede());
        const c = document.querySelector("#intermede-exp .im-carte"); if (c) c.scrollIntoView({ block: "nearest" }); }, 700);
    } else {
      im.erreurs++;
      ph.classList.remove("non"); void ph.offsetWidth; ph.classList.add("non");
      retour.textContent = `Ce n'est pas la bonne paire : « ${e.nom_courant} » va avec une autre photo.`;
    }
  };
  z.querySelectorAll(".im-nom").forEach(b => b.onclick = () => {
    if (b.disabled) return;
    const i = Number(b.dataset.i);
    retour.textContent = "";
    if (im.choix && im.choix.sorte === "photo") { associer(i, im.choix.i); return; }
    im.choix = im.choix && im.choix.sorte === "nom" && im.choix.i === i ? null : { sorte: "nom", i };   // toucher à nouveau = désélectionner
    marquer();
  });
  z.querySelectorAll(".im-photo").forEach(ph => ph.onclick = () => {
    if (ph.classList.contains("juste")) return;
    const i = Number(ph.dataset.i);
    retour.textContent = "";
    if (im.choix && im.choix.sorte === "nom") { associer(im.choix.i, i); return; }
    im.choix = im.choix && im.choix.sorte === "photo" && im.choix.i === i ? null : { sorte: "photo", i };
    marquer();
  });
  brancherPied();
}
function dessinerCriIntermede() {
  const z = document.getElementById("intermede-exp"), im = intermede, cible = im && im.cri;
  if (!z || !cible) return;
  const choix = melanger(im.especes.slice());
  z.innerHTML = `<div class="im-carte">${enteteIntermede("À qui est ce cri ?", "Écoutez, puis sélectionnez la bonne photo.")}
    <div class="im-ecoute"><button type="button" class="im-ecouter" id="im-ecouter" aria-label="Écouter le cri">▶ Écouter</button></div>
    <div class="im-photos">${choix.map(e => `<button type="button" class="im-photo" data-i="${im.especes.indexOf(e)}">
        <img src="${photoMini(e.photo)}" alt=""><span class="im-etiquette">${echapper(e.nom_courant)}</span></button>`).join("")}</div>
    <p class="im-retour" id="im-retour"></p>${piedIntermede(false)}</div>`;
  im.son = new Audio(fichierSon(cible));
  const bouton = document.getElementById("im-ecouter");
  im.son.onended = () => { bouton.textContent = "▶ Réécouter"; };
  bouton.onclick = () => {
    if (!im.son.paused) { im.son.pause(); bouton.textContent = "▶ Réécouter"; return; }
    im.son.currentTime = 0; im.son.play().catch(() => { bouton.textContent = "Son introuvable"; }); bouton.textContent = "■ Arrêter";
  };
  let repondu = false;
  z.querySelectorAll(".im-photo").forEach(ph => ph.onclick = () => {
    if (repondu) return;
    repondu = true;
    const e = im.especes[Number(ph.dataset.i)], juste = e === cible;
    const bonne = z.querySelector(`.im-photo[data-i="${im.especes.indexOf(cible)}"]`);
    bonne.classList.add("juste");
    if (!juste) ph.classList.add("non");
    const texte = SONS[cleEmpreinte(cible)] ? SONS[cleEmpreinte(cible)].texte : "";
    document.getElementById("im-retour").innerHTML = juste ? `<b>Bien entendu !</b> ${texte ? `On entendait ${echapper(texte)}.` : ""}`
      : `C'était ${echapper(nomAvecArticle(cible))}${texte ? ` : on entendait ${echapper(texte)}` : ""}.`;
    if (juste) jouerSon("bonne");
    z.querySelector(".im-pied").outerHTML = piedIntermede(true);
    brancherPied();
    document.getElementById("im-suite").scrollIntoView({ block: "nearest", behavior: "smooth" });   // téléphone : la suite reste visible
  });
  brancherPied();
}
function dessinerBravoIntermede() {
  const z = document.getElementById("intermede-exp"), im = intermede;
  if (!z) return;
  z.innerHTML = `<div class="im-carte">${enteteIntermede(im.erreurs ? "Bien retenu !" : "Sans faute !", "")}
    <div class="im-photos petit">${im.especes.map(e => `<span class="im-photo juste"><img src="${photoMini(e.photo)}" alt=""><span class="im-etiquette">${echapper(e.nom_courant)}</span></span>`).join("")}</div>
    ${piedIntermede(true)}</div>`;
  brancherPied();
}

// Une Rencontre ordinaire : la fin de Rencontre retrouve ses boutons
// Étape R187 (11/11, choix d'Aubin, n° 6 et 8) : après la Rencontre de l'espèce du jour, on s'arrête là (une seule espèce par jour) :
// la phrase « Rencontrée aujourd'hui… » et un seul bouton, « Retour à l'accueil » (plus d'« Autre rencontre aléatoire »).
const PHRASE_FIN_DU_JOUR = "Rencontrée aujourd'hui. Une autre espèce vous attend demain.";
function finRencontreOrdinaire(s) {
  const zone = document.getElementById("exp-fin-session");
  if (zone) { zone.classList.add("cache"); zone.innerHTML = ""; }
  const t = document.getElementById("titre-fin-session"); if (t) t.textContent = "Rencontre terminée";
  const principal = document.getElementById("bouton-rejouer"), accueil = document.getElementById("bouton-fin-accueil");
  document.querySelectorAll("#fin-session .fin-du-jour").forEach(p => p.remove());
  if (s && s.duJour) {
    principal.insertAdjacentHTML("afterend", `<p class="fin-du-jour">${PHRASE_FIN_DU_JOUR}</p>`);   // juste sous le bouton
    principal.textContent = "Retour à l'accueil";
    principal.onclick = () => accueil.click();
    accueil.classList.add("cache");
    return;
  }
  principal.textContent = "Autre rencontre aléatoire";
  principal.onclick = () => rencontreAleatoire();
  accueil.classList.remove("cache");
}

// ---- Les questions d'une étape (appelé par choisirQuestionDefi) ----
function choisirQuestionExpedition() {
  const k = defi.expedition.etape;
  defi.posees = defi.posees || [];
  const dejaPosee = (e, c) => defi.posees.includes(e.nom_courant + "|" + c);
  const garder = (e, c) => { defi.posees.push(e.nom_courant + "|" + c); return { espece: e, champ: c, estRevision: false }; };
  if (defi.expedition.rattrapage) {                  // étape R132 : les traits manqués de l'étape 1, un par un
    for (const e of defi.especes) for (const c of manquesEtape1(e)) if (!dejaPosee(e, c)) return garder(e, c);
    return null;
  }
  if (defi.expedition.revue) {                       // étape 316 : une photo par espèce déjà connue ailleurs
    const x = expeditionParId(defi.expedition.id);
    const prevues = defi.expedition.especesRevue || [];  // étape R184 : seulement les espèces prévues au départ (le compte reste juste)
    defi.questionReprise = !!defi.expedition.toutEnReprise;
    const e = x && especesARevoirIci(x).find(e => prevues.includes(e.nom_courant) && !dejaPosee(e, IDENTIFICATION));
    if (e) return garder(e, IDENTIFICATION);
    // étape R184 : puis, à la fin, les photos ratées (une fois chacune)
    defi.reprisesFaites = defi.reprisesFaites || [];
    const r = x && especesARevoirIci(x).find(e => (defi.reprisesFin || []).includes(e.nom_courant) && !defi.reprisesFaites.includes(e.nom_courant));
    if (!r) return null;
    defi.reprisesFaites.push(r.nom_courant); defi.questionReprise = true;
    return { espece: r, champ: IDENTIFICATION, estRevision: false };
  }
  if (k === 1) {
    // les espèces pas encore reconnues d'abord (toutes avant la fin), puis des révisions des photos
    defi.nouvelles = defi.especes.filter(e => !estIdentifiee(e));
    return choisirQuestionPhoto();
  }
  // une espèce pas encore reconnue (rare : on a pu la manquer) : sa photo d'abord
  const inconnue = defi.especes.find(e => !estIdentifiee(e) && !dejaPosee(e, IDENTIFICATION));
  if (inconnue) return garder(inconnue, IDENTIFICATION);
  // Étape QI3 (09/11, choix d'Aubin) : de temps en temps, une question insolite à la place d'une question ordinaire (21_insolites.js)
  if (typeof choisirInsolite === "function") { const qi = choisirInsolite(k); if (qi) return qi; }
  const cases = [];
  for (const e of defi.especes) {
    if (!estIdentifiee(e)) continue;
    for (const c of champsEtape(e, k)) {
      if (dejaPosee(e, c) || !QUESTIONS.find(q => q.champ === c)) continue;
      if (alimentApresRegime(e, c, x => dejaPosee(e, x))) continue;
      cases.push({ espece: e, champ: c, neuf: nbBonnes(e, c) === 0, utile: !especeFaite(e, k) });
    }
  }
  // d'abord ce qui fait avancer l'étape (une caractéristique jamais trouvée d'une espèce pas encore faite),
  // puis les autres nouveautés, puis la révision de ce qui est déjà trouvé
  // Étape R101 (Revoir 10, « on retrouve parfois les mêmes questions entre la deux et la trois ») : Approfondir ne
  // repose plus ce qui est déjà trouvé (à l'étape 2 ou ailleurs) ; seules l'étape 2 complète avec de la révision.
  const filtres = k === 4 ? [c => c.neuf && c.utile, c => c.neuf] : [c => c.neuf && c.utile, c => c.neuf, c => true];
  // Étape R151 (07/11, choix d'Aubin) : dans une partie, un même sujet (œufs, incubation, régime…) 2 fois au plus,
  // jamais deux fois de suite. Avant, les espèces d'une expédition partageant les mêmes sujets, « Combien d'œufs ? »
  // revenait 3 fois en 11 questions. S'il n'y a pas d'autre choix, la règle cède (rien ne bloque).
  const champsPartie = defi.posees.map(p => p.split("|")[1]);
  const fois = c => champsPartie.filter(x => x === c).length, dernierSujet = champsPartie[champsPartie.length - 1];
  const sujetsVaries = liste => {
    for (const ok of [c => fois(c.champ) === 0, c => fois(c.champ) < 2 && c.champ !== dernierSujet, c => c.champ !== dernierSujet]) {
      const l = liste.filter(ok); if (l.length) return l;
    }
    return liste;
  };
  for (const filtre of filtres) {
    let choix = sujetsVaries(cases.filter(filtre));
    if (!choix.length) continue;
    const reste = e => butEspece(e, k) - trouvesEspece(e, k);
    // Étape R147 (07/11/2026, choix d'Aubin « A ») : Approfondir mélange toutes les espèces de l'expédition.
    // L'espèce suivante = la moins posée dans cette partie ; à égalité, celle qui a le plus à découvrir ;
    // jamais deux fois de suite la même (s'il y en a une autre). Avant : les 2 espèces les plus proches de leur but.
    if (k === 4) {
      const posees = e => defi.posees.filter(p => p.startsWith(e.nom_courant + "|")).length;
      const derniere = defi.posees.length ? defi.posees[defi.posees.length - 1].split("|")[0] : null;
      let especes = [...new Set(choix.map(c => c.espece))];
      if (especes.length > 1) especes = especes.filter(e => e.nom_courant !== derniere);
      const moins = Math.min(...especes.map(posees));
      especes = especes.filter(e => posees(e) === moins);
      const plus = Math.max(...especes.map(reste));
      const espece = auHasard(especes.filter(e => reste(e) === plus));
      const c = auHasard(choix.filter(x => x.espece === espece));
      return garder(c.espece, c.champ);
    }
    // (étape 2) on finit les espèces une à une : d'abord les 2 espèces les plus proches de leur but (la jauge avance vraiment)
    const proches = [...new Set(choix.map(c => c.espece))].sort((a, b) => reste(a) - reste(b)).slice(0, 2);
    choix = varier(choix.filter(c => proches.includes(c.espece)));
    const espece = auHasard([...new Set(choix.map(c => c.espece))]);
    let duChoix = choix.filter(x => x.espece === espece);
    if (typeof preferenceSaison === "function") duChoix = preferenceSaison(duChoix);   // étape QI6 : l'hiver d'abord, d'octobre à mars
    const c = auHasard(duChoix);
    return garder(c.espece, c.champ);
  }
  return null;
}

// ---- La fin d'une étape (appelé à la fin de terminerDefi) ----
function finExpedition(d) {
  const info = d.expedition, x = expeditionParId(info.id);
  if (!x) return;
  // Étape R146 : un tour de rattrapage de plus ; au 2e, les espèces encore incomplètes comptent pour avancer
  const passees = info.rattrapage && !info.compte ? compterRattrapage(x, d.especes || []) : [];
  if (info.rattrapage) info.compte = true;
  const resteApprofondir = passees.reduce((n, e) => n + manquesEtape1(e).length, 0);
  const k = info.etape, apres = empreintesExp(x), av = avanceeEtape(x, k);
  document.getElementById("nom-fin-defi").textContent = `${x.titre} · étape ${k}`;
  const zone = document.getElementById("passerelle-fin-defi");
  const finie = etapeFinie(x, k), gagnees = Math.max(0, gainExp(x) - (info.avantGain || 0)), etapeGagnee = apres > info.avant;   // étape PR1
  const suite = etapeEnCours(x);
  zone.classList.remove("cache");
  zone.innerHTML = `<div class="exp-fin">
      <div class="exp-fin-pas">${dessinGain(x)}</div>
      <div class="exp-fin-texte">${finie ? `${k < NB_ETAPES && apres >= NB_ETAPES ? `<b>Expédition terminée !</b> Vous connaissiez déjà leur vie.` : resteApprofondir ? `<b>Étape ${k} terminée !</b>` : `<b>Étape ${k} réussie !</b>`} ${gagnees && !(etapeGagnee && apres >= NB_ETAPES) ? `+${gagnees} empreinte${gagnees > 1 ? "s" : ""}` : ""}${resteApprofondir ? ` ${resteApprofondir === 1 ? "La chose qui vous a échappé reviendra" : `Les ${resteApprofondir} choses qui vous ont échappé reviendront`} dans Approfondir.` : ""}`   // étape R146
        : k === 4 ? bilanApprofondir(x, info, gagnees)
        : info.rattrapage ? (nbTraitsARevoir(x) ? `<b>Encore ${nbTraitsARevoir(x)} chose${nbTraitsARevoir(x) > 1 ? "s" : ""} à revoir</b> · ${av.faites} espèce${av.faites > 1 ? "s" : ""} sur ${av.total} connue${av.faites > 1 ? "s" : ""}. La prochaine fois, 2 réponses seulement.`
          : resteApprofondir ? `<b>Étape 1 terminée !</b> ${av.faites} espèce${av.faites > 1 ? "s" : ""} sur ${av.total} connue${av.faites > 1 ? "s" : ""}. ${resteApprofondir === 1 ? "La chose qui vous a échappé reviendra" : `Les ${resteApprofondir} choses qui vous ont échappé reviendront`} dans Approfondir.${gagnees ? ` +${gagnees} empreinte${gagnees > 1 ? "s" : ""}` : ""}`   // étape R146
          : `<b>Tout est rattrapé !</b> ${av.faites} espèce${av.faites > 1 ? "s" : ""} sur ${av.total} connue${av.faites > 1 ? "s" : ""}.${gagnees ? ` +${gagnees} empreinte${gagnees > 1 ? "s" : ""}` : ""}`)   // étape R132
        : info.revue ? `<b>Révision</b> : vous connaissiez déjà ${(info.especesRevue || []).length > 1 ? "ces espèces" : "cette espèce"} ailleurs. ${av.faites} sur ${av.total} reconnue${av.faites > 1 ? "s" : ""} ici.${gagnees ? ` +${gagnees} empreinte${gagnees > 1 ? "s" : ""}.` : ""}${d.revuesPassees ? ` ${d.revuesPassees > 1 ? "Celles qui vous ont échappé comptent quand même ici ; leur photo reviendra" : "Celle qui vous a échappé compte quand même ici ; sa photo reviendra"} dans vos prochaines parties.` : ""}`   // étape R184
        : k === 2 ? bilanEtape(x, info, gagnees, 2)   // étape R126
        : `<b>Étape ${k} · ${ETAPES[k].titre}</b> : ${av.faites} espèce${av.faites > 1 ? "s" : ""} sur ${av.total}.`}</div>
      <button class="ac-bouton" id="exp-fin-ecran">Voir l'expédition</button></div>${blocFinLieu(x, gagnees, etapeGagnee && apres >= NB_ETAPES)}`;   // R153
  document.getElementById("exp-fin-ecran").onclick = () => ouvrirExpedition(x);
  const rejouer = document.getElementById("bouton-rejouer-defi");
  if (k === 4 ? approfondie(x) : finie && suite !== k) {   // étape R182 (10/11, demande d'Aubin) : une étape finie ramène à
    rejouer.textContent = "Voir l'expédition";               // l'expédition, sans proposer l'étape suivante
    rejouer.onclick = () => ouvrirExpedition(x);
    document.getElementById("exp-fin-ecran").classList.add("cache");
  } else if (k === 4) {                                 // étape 288 : Approfondir
    rejouer.textContent = approfondie(x) ? "Rejouer l'expédition" : "Continuer à approfondir";
    rejouer.onclick = () => lancerExpedition(x, approfondie(x) ? NB_ETAPES : 4);
  } else {
    rejouer.textContent = suite ? (suite === k ? (k === 1 && !especeAConnaitre(x) && aRattraper(x).length ? `Revoir ${texteARevoir(x)}` : `Continuer l'étape ${k}`) : `Étape ${suite} ▶`) : "Étape 3 · Approfondir ▶";   // R132
    rejouer.onclick = () => lancerExpedition(x, suite || 4);
  }
  if (gagnees && !etapeGagnee) setTimeout(() => afficherBulle(`+${gagnees} empreinte${gagnees > 1 ? "s" : ""}`), 600);   // étape PR1
  if (etapeGagnee) {
    const t = x.territoire, nouvellesOuvertes = expeditionsDe(t).filter(y => !y.liste.some(estIdentifiee) && empreintesExp(y) === 0);
    // Étape R153 (maquette A) : LA fête de la fin d'étape — elle dit « +N empreintes » (l'écran de fin ne le redit plus)
    //   et accueille les souvenirs (badges) gagnés au même moment (fusion: true, voir suiteFetes, 04_fetes.js)
    const plus = gagnees && apres >= NB_ETAPES ? `<b>+${gagnees} empreinte${gagnees > 1 ? "s" : ""}</b>` : "";   // (fin d'étape 1 : le gain est sur l'écran)
    feter({ etiquette: `Expédition · ${x.titre}`, titre: apres >= NB_ETAPES ? "Expédition terminée !" : `Étape ${k} réussie`, fusion: true,
            detail: apres >= NB_ETAPES ? `${plus}${plus ? ". " : ""}La suite : la finale du lieu, quand toutes ses expéditions sont terminées.`
              : `${plus}${plus && ETAPES[k + 1] && k + 1 <= NB_ETAPES ? " · " : ""}${ETAPES[k + 1] && k + 1 <= NB_ETAPES ? `Prochaine étape : ${ETAPES[k + 1].titre.toLowerCase()}.` : ""}`,
            son: "badge", visuel: `<div class="fete-visuel rang exp-fete">${PAS_SVG}</div>` });
    if (x.chapitre) {                                     // étape 287 : un carrefour s'ouvre-t-il ?
      const c = chapitreParNom(t, x.chapitre);
      const suivants = chapitresDe(t).filter(p => p.carrefour === c.carrefour + 1);
      const dejaOuvert = chapitresDe(t).some(p => p.carrefour === c.carrefour && p.nom !== c.nom && finiesChapitre(t, p.nom) >= FINIES_POUR_CARREFOUR);
      if (apres >= NB_ETAPES && info.avant < NB_ETAPES && suivants.length && !dejaOuvert && finiesChapitre(t, c.nom) === FINIES_POUR_CARREFOUR)
        setTimeout(() => afficherBulle(`Un carrefour s'ouvre : ${suivants.map(p => p.nom.toLowerCase()).join(" ou ")} ?`), 1400);
    } else if (k === 1 && nouvellesOuvertes.length) setTimeout(() => afficherBulle("Une nouvelle expédition s'ouvre sur votre chemin"), 1400);
  }
  if (gagnees) verifierOuverture();
  if (typeof proposerFinInsolite === "function") proposerFinInsolite(x, k, info, apres);   // étape QI5 : « Reliez » puis « Et si… ? », après le lien du lieu
  if (typeof proposerLienDuLieu === "function") proposerLienDuLieu(x, k, info, apres);   // étape R172 : « Un lien du lieu » d'abord
  resumeFinTelephone({ x, d, k, gagnees, avantEmp: info.avant, apres });   // étape M15 : sur téléphone, la fin tient sur un écran
}

const PAS_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="15.5" rx="5" ry="6" fill="currentColor"/><circle cx="5.8" cy="7.5" r="2.3" fill="currentColor"/><circle cx="9.8" cy="4.6" r="2.3" fill="currentColor"/><circle cx="14.3" cy="4.6" r="2.3" fill="currentColor"/><circle cx="18.3" cy="7.5" r="2.3" fill="currentColor"/></svg>`;
function dessinPas(n, total = NB_ETAPES) { return `<span class="pas">${Array.from({ length: total }, (_, i) => `<span class="${i < n ? "pris" : ""}">${PAS_SVG}</span>`).join("")}</span>`; }

// ---- La page du territoire : « Vos expéditions » (6 cartes, ou toutes) ----
let toutesLesExpeditionsVisibles = false;
function choisirCartes(t) {
  const liste = expeditionsDe(t), ouvertes = expeditionsOuvertes(t);
  const etat = x => etatExpedition(x, ouvertes);
  const enCours = liste.filter(x => etat(x) === "encours"), nouvelles = liste.filter(x => etat(x) === "nouvelle");
  const finies = liste.filter(x => etat(x) === "finie").reverse(), fermees = liste.filter(x => etat(x) === "fermee");
  return [...enCours, ...nouvelles, ...finies, ...fermees].slice(0, 6);
}
function carteExpedition(x, etat) {
  const etiquettes = { finie: [libelleTerminee(x), "fin"], encours: ["En cours", "cours"], nouvelle: ["Nouvelle !", "nouv"], fermee: ["À ouvrir", "ferm"] };   // R131
  const [lib, cl] = etiquettes[etat];
  return `<button class="exp-carte ${etat}" data-id="${x.id}">
      <span class="exp-ph"><img src="${photoExp(x)}" alt="" loading="lazy"></span>
      <span class="exp-corps"><b>${x.titre}</b>${dessinGain(x)}
        <span class="exp-tag ${cl}">${etat === "fermee" ? "🔒 " : ""}${lib}</span><small>${x.liste.length} espèces</small></span></button>`;
}
function dessinerExpeditions(t) {
  const zone = document.getElementById("ac-expeditions");
  if (!zone) return;
  const liste = expeditionsDe(t);
  if (!liste.length) { zone.classList.add("cache"); return; }
  zone.classList.remove("cache");
  if (aDesLieux(t)) { dessinerAlbum(t, zone); return; }       // étape 290 : l'album des lieux (maquette A)
  if (aDesChapitres(t)) { dessinerChemin(t, zone); return; }   // étape 287 : maquette A « le carnet de chapitres »
  zone.classList.remove("chemin");
  const ouvertes = expeditionsOuvertes(t);
  const cartes = toutesLesExpeditionsVisibles ? liste : choisirCartes(t);
  const finies = liste.filter(x => empreintesExp(x) >= NB_ETAPES).length, enCours = liste.filter(x => etatExpedition(x, ouvertes) === "encours").length;
  zone.innerHTML = `<div class="exp-tete"><h2>Vos expéditions</h2>
      <small>${finies} terminée${finies > 1 ? "s" : ""} · ${enCours} en cours · ${liste.length} au total ·
      <button class="duo-autres" id="exp-toutes">${toutesLesExpeditionsVisibles ? "Voir moins" : `Voir les ${liste.length}`}</button></small></div>
    <div class="exp-grille">${cartes.map(x => carteExpedition(x, etatExpedition(x, ouvertes))).join("")}</div>`;
  zone.querySelectorAll(".exp-carte").forEach(b => b.onclick = () => {
    const x = expeditionParId(b.dataset.id);
    if (b.classList.contains("fermee")) afficherBulle("S'ouvre en finissant l'étape 1 d'une expédition en cours");
    else ouvrirExpedition(x);
  });
  document.getElementById("exp-toutes").onclick = () => { toutesLesExpeditionsVisibles = !toutesLesExpeditionsVisibles; dessinerExpeditions(t); };
}

// ---- Étape 287 : la page du territoire en chapitres (maquette A « le carnet de chapitres », choisie le 25/10) ----
//   1. le chapitre en cours : ses expéditions en cartes (photo de l'espèce vedette) + la finale « Qui vit avec qui ? » ;
//   2. « Où partez-vous ensuite ? » : les deux chapitres du carrefour suivant ;
//   3. « Le chemin » : les autres chapitres (terminés, ouverts ou plus tard).
function photoMini(src) {
  if (!src) return "";
  return src.includes("Images/Paysages/") ? src.replace("Images/Paysages/", "Images/Paysages/mini/") : src.replace("Images/", "Images/mini/");
}
function imgMini(src, alt, classe) {
  return src ? `<img${classe ? ` class="${classe}"` : ""} src="${photoMini(src)}" alt="${echapper(alt || "")}" loading="lazy" onerror="if (this.src.includes('/mini/')) this.src='${src}';">` : "";
}
function vedetteDe(x) { return (x.vedette && x.liste.find(e => e.nom_courant === x.vedette)) || x.liste.find(e => estRenseigne(e.photo)) || x.liste[0]; }
// Étape 293 : la photo d'une espèce, ou sa silhouette quand la photo est « à venir » ; la photo d'une expédition
function photoEsp(e) { return estRenseigne(e.photo) ? e.photo : fichierSilhouette(e); }
function photoExp(x) { return x.photo || photoEsp(vedetteDe(x)); }
function carteChapitre(x, etat) {
  const etiquettes = { finie: [libelleTerminee(x), "fin"], encours: [`En cours · étape ${etapeEnCours(x) || 1}`, "cours"], nouvelle: ["Nouvelle", "nouv"], fermee: ["Bientôt", "ferm"] };   // R131
  const [lib, cl] = etiquettes[etat];
  const v = vedetteDe(x), connues = dejaConnues(x);
  const detail = etat === "nouvelle" && connues ? `déjà ${connues} sur ${x.liste.length} connues` : `${x.liste.length} espèces`;
  return `<button class="exp-carte chap ${etat}" data-id="${x.id}">
      <span class="exp-ph">${imgMini(x.photo || photoEsp(v), v.nom_courant)}</span>
      <span class="exp-corps"><b>${x.titre}</b>${dessinGain(x)}
        <span class="exp-ligne"><span class="exp-tag ${cl}">${lib}</span><small>${detail}</small></span></span></button>`;
}
// Étape 294 : « du lac de Lourdes », « de la vallée d'Aspe », « de Saint-Jean-Pied-de-Port »
function deLieu(nom) {
  // Étape R149 : d'abord la table de « Vous êtes … » (R124), qui connaît les 121 lieux
  const prep = typeof VOUS_ETES_LIEU !== "undefined" && VOUS_ETES_LIEU[nom];
  if (prep) {
    const m = nom.match(/^(Le |La |Les |L')(.+)$/), reste = m ? m[2] : nom;
    const commun = !m && /^(Lacs?|Golfe|Marais|Forêt|Vallée|Baie|Gorges|Monts?|Plateau|Cirque|Col|Pic|Puy|Cap|Causse|Étangs?|Tourbières?|Réserve|Plaine|Côte|Dune|Estuaire|Barthes|Coteaux|Falaises|Bouches|Désert|Presqu'île|Chaîne|Reculée|Saut|Château|Ballon|Massif|Bocage|Île) /.test(nom);
    const n = commun ? nom.charAt(0).toLowerCase() + nom.slice(1) : reste;
    const de = { "dans le": "du ", "au": "du ", "sur le": "du ", "dans la": "de la ", "à la": "de la ", "sur la": "de la ",
                 "dans les": "des ", "aux": "des ", "sur les": "des ", "dans l'": "de l'", "à l'": "de l'", "sur l'": "de l'" }[prep];
    if (de) return de + n;
    if (m) return { "Le ": "du ", "La ": "de la ", "Les ": "des ", "L'": "de l'" }[m[1]] + reste;   // « en » : de la Brenne
    if (nom === "Suisse normande") return "de la Suisse normande";
    return (/^[AEIOUÉÈÎ]/i.test(nom) ? "d'" : "de ") + nom;   // « à », « en » : de Sologne, d'Ajaccio…
  }
  const art = nom.match(/^(Le |La |Les |L')(.+)$/);   // étape R149 : « du Hohneck… », « des étangs de la Dombes »
  if (art) return { "Le ": "du ", "La ": "de la ", "Les ": "des ", "L'": "de l'" }[art[1]] + art[2];
  const bas = nom.charAt(0).toLowerCase() + nom.slice(1);
  if (/^(Calanques|Cascades|Gorges|Étangs|Lacs|Monts) /.test(nom)) return "des " + bas;
  if (/^(Lac|Cirque|Col|Pic|Mont|Bois|Marais|Plateau|Val|Cap|Parc|Puy) /.test(nom)) return "du " + bas;
  if (/^(Vallée|Forêt|Tourbière|Réserve|Plaine|Baie|Côte|Montagne) /.test(nom)) return "de la " + bas;
  return (/^[AEIOUÉÈ]/i.test(nom) ? "d'" : "de ") + nom;
}
// Étape 333 (30/10) : la carte de la finale a un vrai visuel — une mosaïque des photos des espèces reliées dans le lieu
//   (4 photos au plus, les espèces des liens, dans l'ordre des liens). Sans lien : l'ancien picto reste.
// Étape R92 (Revoir 9, choix A2) : « la toile » — un rond au centre relié à cinq autres (un lieu et ses espèces)
const PICTO_LIENS = `<svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="24" cy="24" r="4.5"/><circle cx="24" cy="7" r="3.2"/><circle cx="40" cy="19" r="3.2"/><circle cx="34" cy="39" r="3.2"/><circle cx="14" cy="39" r="3.2"/><circle cx="8" cy="19" r="3.2"/><path d="M24 19.5V10.2 M28.3 22.7 37 20 M26.7 27.6 32.2 36.4 M21.3 27.6 15.8 36.4 M19.7 22.7 11 20"/></svg>`;
function especesDesLiens(t, nom, n = 4) {
  const vues = [], liste = [];
  for (const k of liensDuLieu(t, nom)) for (const x of [k.a, k.nature_b === "element" ? null : k.b]) {
    const e = x && especeParNom(x);
    if (e && estRenseigne(e.photo) && !vues.includes(e.nom_courant)) { vues.push(e.nom_courant); liste.push(e); }
  }
  return liste.slice(0, n);
}
function mosaiqueFinale(t, c) {
  const esp = especesDesLiens(t, c.nom);
  const etiquette = `<small class="finale-etiq">${PICTO_LIENS}${estLieu(c) ? "Finale du lieu" : "Finale du chapitre"}</small>`;
  if (esp.length < 2) return `<span class="exp-ph finale-ph">${PICTO_LIENS}<small>${estLieu(c) ? "Finale du lieu" : "Finale du chapitre"}</small></span>`;
  return `<span class="exp-ph finale-mosaique n${esp.length}">${esp.map(e => imgMini(e.photo, e.nom_courant)).join("")}${etiquette}</span>`;
}
function carteFinale(t, c) {
  const fini = chapitreFini(t, c), dispo = finaleDisponible(t, c), ouverte = finaleOuverte(t, c), faite = finaleFaite(t, c.nom);   // étape 301
  const [lib, cl] = faite ? ["Terminée", "fin"] : ouverte ? ["Ouverte", "nouv"] : (fini && !dispo) ? ["Bientôt disponible", "ferm"] : [estLieu(c) ? "Fin du lieu" : "Fin du chapitre", "ferm"];
  return `<button class="exp-carte chap finale${ouverte || faite ? "" : " fermee"}" id="exp-finale" type="button">
      ${mosaiqueFinale(t, c)}
      <span class="exp-corps"><b>La finale du lieu</b>${dessinPas(faite ? EMPREINTES_FINALE : 0, EMPREINTES_FINALE)}
        <span class="exp-ligne"><span class="exp-tag ${cl}">${lib}</span><small>${faite ? "Revoir la planche du lieu" : `les liens entre les espèces ${estLieu(c) ? echapper(deLieu(c.nom)) : "du chapitre"}`}</small></span></span></button>`;
}
function carteMilieu(t, c, ouvert, reste) {
  const liste = expeditionsDuChapitre(t, c.nom), nb = new Set(liste.flatMap(x => x.liste.map(e => e.nom_courant))).size;
  const vedettes = liste.slice(0, 4).map(vedetteDe);
  return `<article class="chap-choix${ouvert ? "" : " ferme"}">
      ${imgMini(c.photo, "", "chap-paysage")}
      <div class="chap-choix-corps">
        <div class="chap-choix-tete"><h3>${c.nom}</h3><small>${liste.length} expéditions · ${nb} espèces</small></div>
        <div class="chap-vedettes">${vedettes.map(e => imgMini(photoEsp(e), e.nom_courant)).join("")}</div>
        ${ouvert ? `<button class="couv-go petit" data-chap="${echapper(c.nom)}" type="button">Partir ici ▶</button>`
                 : `<small class="exp-verrou">🔒 ${reste}</small>`}
      </div></article>`;
}
function dessinerChemin(t, zone) {
  zone.classList.add("chemin");
  const ouvertes = expeditionsOuvertes(t), c = chapitreCourant(t);
  if (!c) return;
  const tous = chapitresDe(t), liste = expeditionsDuChapitre(t, c.nom);
  const finies = finiesChapitre(t, c.nom), num = c.carrefour + 1;
  const suivants = tous.filter(p => p.carrefour === c.carrefour + 1);
  const ouvertSuite = carrefourOuvert(t, c.carrefour + 1);
  const manque = Math.max(0, FINIES_POUR_CARREFOUR - finies);
  const reste = `encore ${manque} expédition${manque > 1 ? "s" : ""} à terminer ici`;
  const autres = tous.filter(p => p !== c && !suivants.includes(p));
  const etatChap = p => chapitreFini(t, p) ? "Terminé" : chapitreOuvert(t, p) ? (finiesChapitre(t, p.nom) ? `${finiesChapitre(t, p.nom)} terminée${finiesChapitre(t, p.nom) > 1 ? "s" : ""}` : "Ouvert") : `Chapitre ${p.carrefour + 1} · plus tard`;
  zone.innerHTML = `
    <div class="chap-tete">
      ${imgMini(c.photo, "", "chap-tete-ph")}
      <div class="chap-tete-texte"><div class="etiq-jeu">Chapitre ${num}</div><h2>${c.nom}</h2></div>
      <small><b>${finies}</b> expédition${finies > 1 ? "s" : ""} terminée${finies > 1 ? "s" : ""} sur ${liste.length}</small>
    </div>
    <div class="exp-grille chap-grille">${liste.map(x => carteChapitre(x, etatExpedition(x, ouvertes))).join("")}${carteFinale(t, c)}</div>
    ${suivants.length ? `<div class="chap-suite">
      <div class="etiq-jeu">Chapitre ${num + 1} · à vous de choisir</div>
      <h2>Où partez-vous ensuite ?</h2>
      <p class="jeu-sous">${ouvertSuite ? "Les deux milieux sont ouverts. Celui que vous ne choisissez pas vous attend pour plus tard."
        : `Ils s'ouvrent quand ${FINIES_POUR_CARREFOUR} expéditions de ce chapitre sont terminées : ${reste}.`}</p>
      <div class="chap-choix-grille">${suivants.map(p => carteMilieu(t, p, ouvertSuite, reste)).join("")}</div></div>` : ""}
    ${autres.length ? `<div class="chap-loin"><h3>Le chemin</h3><div class="chap-loin-grille">${autres.map(p => {
      const ouv = chapitreOuvert(t, p);
      return `<${ouv ? "button" : "div"} class="chap-loin-item${ouv ? " ouvert" : ""}"${ouv ? ` data-chap="${echapper(p.nom)}" type="button"` : ""}>
        ${imgMini(p.photo, "")}<span><b>${p.nom}</b><small>${etatChap(p)}</small></span></${ouv ? "button" : "div"}>`;
    }).join("")}</div></div>` : ""}`;
  zone.querySelectorAll(".exp-carte[data-id], .chemin-arret[data-id]").forEach(b => b.onclick = () => {
    const x = expeditionParId(b.dataset.id);
    if (b.classList.contains("fermee")) afficherBulle("Elle s'ouvrira quand vous aurez commencé une des expéditions proposées");
    else ouvrirExpedition(x);
  });
  document.getElementById("exp-finale").onclick = () => afficherBulle(chapitreFini(t, c)
    ? "La finale de ce lieu arrive bientôt dans le jeu"
    : "La finale s'ouvre quand toutes les expéditions du chapitre sont terminées");
  zone.querySelectorAll("[data-chap]").forEach(b => b.onclick = () => {
    choisirChapitre(t, b.dataset.chap);
    if (typeof dessinerCouverture === "function") dessinerCouverture(); else dessinerExpeditions(t);
    zone.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

// ---- Étape 333 (30/10) : le bandeau qui reste en haut ----
// Quand la grande photo (page d'un lieu, écran d'une expédition) sort de l'écran, un bandeau réduit
// glisse en haut : petite photo, titre, et le bouton principal. On garde ainsi « sous le nez » où l'on est.
let observateurBandeau = null;
function bandeauCollant(zone, hero, o) {
  if (observateurBandeau) { observateurBandeau.disconnect(); observateurBandeau = null; }
  const vieux = zone.querySelector(".bandeau-collant"); if (vieux) vieux.remove();
  if (!hero) return;
  const b = document.createElement("div");
  b.className = "bandeau-collant" + (o.sombre ? " sombre" : "");
  b.setAttribute("aria-hidden", "true");
  b.innerHTML = `<button class="bc-retour" type="button" title="${echapper(o.retourTexte || "Retour")}">←</button>
    <span class="bc-ph">${o.photo ? `<img src="${photoMini(o.photo)}" alt="" onerror="this.src='${o.photo}'">` : ""}</span>
    <span class="bc-texte"><small>${o.sur || ""}</small><b>${echapper(o.titre)}</b></span>
    ${o.infos ? `<span class="bc-infos">${o.infos}</span>` : ""}
    ${o.bouton ? `<button class="couv-go petit bc-go" type="button">${o.bouton} <span aria-hidden="true">▶</span></button>` : ""}`;
  zone.appendChild(b);
  b.querySelector(".bc-retour").onclick = o.retour;
  const go = b.querySelector(".bc-go"); if (go && o.action) go.onclick = o.action;
  if (typeof IntersectionObserver !== "function") return;
  observateurBandeau = new IntersectionObserver(([en]) => {
    const voir = !en.isIntersecting && en.boundingClientRect.bottom < 0;
    b.classList.toggle("visible", voir); b.setAttribute("aria-hidden", voir ? "false" : "true");
  }, { threshold: 0 });
  observateurBandeau.observe(hero);
}

// ---- L'écran d'une expédition (vue-expedition) ----
let expeditionAffichee = null;
function ouvrirExpedition(x) { expeditionAffichee = x; montrer("expedition"); dessinerEcranExpedition(); window.scrollTo(0, 0); }
function dessinerEcranExpedition() {
  const zone = document.getElementById("vue-expedition"), x = expeditionAffichee;
  if (!zone || !x) return;
  const n = empreintesExp(x), cours = etapeEnCours(x);
  const couleur = (TERRITOIRES[x.territoire] || {}).couleur || "#1F3A2E";
  const etapes = ETAPES_JOUEES.map(k => {
    const finie = etapeFinie(x, k), ouverte = k === 1 || etapeFinie(x, k - 1) || toutDebloque(), av = avanceeEtape(x, k), active = k === cours;
    return `<div class="exp-etape${finie ? " finie" : ""}${active ? " active" : ""}${ouverte ? "" : " fermee"}">
        <span class="exp-num">${finie ? "✓" : k}</span>
        <span class="exp-etape-texte"><b>Étape ${k} · ${ETAPES[k].titre}</b><small>${ETAPES[k].texte}</small>
          ${active ? `<i class="jauge-jeu"><b style="width:${Math.round(100 * av.faites / av.total)}%"></b></i><small>${av.faites} espèce${av.faites > 1 ? "s" : ""} sur ${av.total}${k === 1 && especeAConnaitre(x) ? ` · ${especeFaite(especeAConnaitre(x), 1) ? `à revoir : ${especesARevoirIci(x).length} espèce${especesARevoirIci(x).length > 1 ? "s" : ""} déjà rencontrée${especesARevoirIci(x).length > 1 ? "s" : ""} ailleurs (une photo chacune)` : `prochaine rencontre : ${estIdentifiee(especeAConnaitre(x)) ? especeAConnaitre(x).nom_courant : "une espèce inconnue"}`}` : ""}</small>` : ""}</span>
        <span class="exp-etape-gain ${finie ? "pris" : ""}" title="Empreintes de cette étape">+${gainEtape(x, k)}${k === 1 ? `<small>(1 par espèce)</small>` : ""}<span>${PAS_SVG}</span></span>
        ${ouverte ? `<button class="${active ? "couv-go petit" : "duo-autres"}" data-k="${k}">${active ? "Jouer ▶" : finie ? "Rejouer" : "Jouer"}</button>`
                  : `<small class="exp-verrou">🔒 après l'étape ${k - 1}</small>`}
      </div>`;
  }).join("");
  // Étape 288 : la ligne « Approfondir », facultative, après les empreintes ; et l'espèce de la prochaine Rencontre
  const fini3 = n >= NB_ETAPES || toutDebloque();   // étape 332 ; R125 : les fiches viennent de ligneFiche
  const approf = `<div class="exp-etape approfondir${fini3 ? "" : " fermee"}${approfondie(x) ? " finie" : ""}">
      <span class="exp-num">${approfondie(x) ? "✓" : "3"}</span>
      <span class="exp-etape-texte"><b>Étape 3 · ${ETAPES[4].titre}</b><small>${ETAPES[4].texte}</small>
        ${fini3 && !approfondie(x) ? `<i class="jauge-jeu"><b style="width:${Math.round(100 * avanceeApprofondir(x).faites / Math.max(1, avanceeApprofondir(x).total))}%"></b></i><small>${avanceeApprofondir(x).especes} espèce${avanceeApprofondir(x).especes > 1 ? "s" : ""} sur ${x.liste.length} connue${avanceeApprofondir(x).especes > 1 ? "s" : ""} par cœur · ${texteResteApprofondir(x).charAt(0).toLowerCase()}${texteResteApprofondir(x).slice(1)}</small>` : ""}</span>
      <span class="exp-etape-gain ${approfondie(x) ? "pris" : ""}" title="Empreintes de cette étape facultative">+${gainEtape(x, 4)}<small>(1 par espèce)</small><span>${PAS_SVG}</span></span>
      ${fini3 ? `<button class="duo-autres" data-k="4">${approfondie(x) ? "Rejouer" : "Jouer"}</button>` : `<small class="exp-verrou">🔒 après l'étape ${NB_ETAPES}</small>`}
    </div>`;   // étape R127 : l'avancée par espèce est dans le cadre « Les espèces » (à droite)
  const prochaine = cours === 1 ? especeAConnaitre(x) : null;
  // Étape R127 (05/11, choix de l'utilisateur, artefact « Myriade · Cadre de l'étape en cours ») : le cadre « Les espèces »
  // montre l'avancée de l'étape en cours sous chaque photo — étapes 1 et 2 : petites cases + « 1/2 » ; étape 3 : petite barre
  // + « 9/14 » ; tout fini : les 3 médailles (bronze, argent, or) — R130 : « ✓ connue » à la place. Les lignes de cases ne sont plus dans les cartes des étapes.
  const kCadre = !etapeFinie(x, 1) ? 1 : !etapeFinie(x, 2) ? 2 : !approfondie(x) ? 4 : 0;
  const especes = x.liste.map(e => {
    const id = estIdentifiee(e), deja = especeFaite(e, 1) && !estRevue(x, e);   // étape 317
    let marque, fait;
    if (kCadre) {
      const c = casesFiche(e, undefined, kCadre);
      fait = faiteDans(x, e, kCadre);
      const compte = kCadre === 1 && !fait && c.but && c.trouves >= c.but ? "à revoir ici"
        : kCadre === 1 && !fait && estTentee(x, e) ? `${c.trouves}/${c.but} · à revoir` : `${fait ? "✓ " : ""}${c.trouves}/${c.but}`;   // étape R132
      marque = (kCadre === 4 ? `<span class="exp-mini-barre"><i style="width:${Math.round(100 * c.trouves / Math.max(1, c.but))}%"></i></span>`
                             : `<span class="fiche-cases">${c.html}</span>`) + `<em class="exp-compte${fait ? " fait" : ""}">${compte}</em>`;
    } else {
      fait = especeFaite(e, 4);
      marque = `<em class="exp-compte fait">✓ connue</em>`;   // étape R130 : plus de médailles dans l'expédition (pour l'instant)
    }
    return `<button class="exp-esp${id ? "" : " inconnue"}${fait ? " bien" : ""}${deja && kCadre === 1 ? " deja" : ""}" data-nom="${echapper(e.nom_courant)}" ${id ? "" : "disabled"}>
        <span class="exp-rond${estRenseigne(e.photo) ? "" : " silh"}"><img src="${photoEsp(e)}" alt="" loading="lazy"></span><small>${id ? e.nom_courant : "À découvrir"}</small>${marque}</button>`;
  }).join("");
  const titreCadre = kCadre ? `Étape ${kCadre === 4 ? 3 : kCadre} · ${ETAPES[kCadre].titre}` : "Expédition terminée";   // R131 : sans « Les espèces · » (demande de l'utilisateur)
  const aideCadre = kCadre === 1 ? `Leur nom se découvre à cette étape. Sélectionnez une espèce découverte pour ouvrir sa fiche.${especesARevoirIci(x).length ? " « À revoir ici » : vous la connaissez déjà d'ailleurs, une photo suffit." : ""}`
    : kCadre === 2 ? "Deux choses à découvrir par espèce : où elle vit, ce qu'elle mange, quand la voir… Sélectionnez une espèce pour ouvrir sa fiche."
    : kCadre === 4 ? "Tout savoir de chaque espèce, en plusieurs parties de 10 questions. Sélectionnez une espèce pour ouvrir sa fiche."
    : "Les trois étapes sont faites. Touchez une espèce pour ouvrir sa fiche : il reste peut-être des choses à y découvrir.";   // étape R130
  const lieuDeX = x.chapitre ? chapitreParNom(x.territoire, x.chapitre) : null;   // étape 290
  zone.innerHTML = `<div class="exp-ecran" style="--couleur-territoire:${couleur}">
    <button class="duo-autres" id="exp-retour">← ${lieuDeX ? `Retour à ${echapper(lieuDeX.nom)}` : "Retour au territoire"}</button>
    ${carnetExpedition(x, lieuDeX)}
    <div class="exp-banniere"><img class="exp-ban-fond" src="${photoExp(x)}" alt=""><img class="exp-ban-photo" src="${photoExp(x)}" alt="">
      <div class="exp-ban-texte"><div class="couv-vous">${x.chapitre ? `${x.chapitre} · ${x.territoire}` : `Expédition · ${x.territoire}`}</div><h1>${x.titre}</h1>
        <p>${x.liste.length} espèces à découvrir, puis à connaître.</p></div>
      <div class="exp-ban-pas">${dessinGain(x)}<small>empreintes gagnées ici</small></div></div>
    <div class="exp-corps-ecran"><div class="exp-etapes">${etapes}${approf}</div>
      <div class="jeu-encart"><div class="etiq-jeu">${titreCadre}</div><p class="jeu-sous">${aideCadre}</p>
        <div class="exp-especes">${especes}</div></div></div></div>`;
  document.getElementById("exp-retour").onclick = () => estLieu(lieuDeX) ? ouvrirLieu(x.territoire, lieuDeX.nom) : montrer("accueil");
  const retourM = document.getElementById("exp-retour-m");   // étape M8 : la pastille du lieu (téléphone)
  if (retourM) retourM.onclick = () => { if (estLieu(lieuDeX)) ouvrirLieu(x.territoire, lieuDeX.nom); else montrer("accueil"); window.scrollTo(0, 0); };
  const kJouer = cours && (cours === 1 || etapeFinie(x, cours - 1) || toutDebloque()) ? cours : 0;   // étape 333 : le bandeau qui reste en haut
  const surTel = matchMedia("(max-width: 760px)").matches;   // étape M8 : sur téléphone, le bandeau suit la page de carnet
  bandeauCollant(zone, zone.querySelector(surTel ? ".rep-carnet" : ".exp-banniere"), { photo: photoExp(x), sur: echapper(x.chapitre || x.territoire), titre: x.titre,
    infos: `${dessinPas(n)}<small>${n} / ${NB_ETAPES}</small>`, retourTexte: lieuDeX ? `Retour à ${lieuDeX.nom}` : "Retour au territoire",
    retour: () => estLieu(lieuDeX) ? ouvrirLieu(x.territoire, lieuDeX.nom) : montrer("accueil"),
    bouton: kJouer ? `Étape ${kJouer}` : "", action: () => lancerExpedition(x, kJouer) });
  zone.querySelectorAll(".exp-etape button[data-k]").forEach(b => b.onclick = () => lancerExpedition(x, Number(b.dataset.k)));
  zone.querySelectorAll(".exp-esp:not(.inconnue)").forEach(b => b.onclick = () => ouvrirPageEspece(ESPECES.find(e => e.nom_courant === b.dataset.nom)));
}


// ==================================================================
// Étape 290 (25/10/2026) : l'album des lieux et la page d'un lieu
// Maquettes retenues par l'utilisateur : A « l'album des lieux » (cartes postales) + une page par lieu,
// D « entrer dans le lieu » (le territoire reste clair ; la page du lieu s'ouvre sur sa photo, puis passe en vert très sombre).
// ==================================================================
// Étape R91 (Revoir 9) : plus d'étiquette « Ouvert » quand le bouton « Partir ici » est là
function carteLieu(t, c) {
  const etat = etatLieu(t, c), liste = expeditionsDuChapitre(t, c.nom);
  const finies = liste.filter(x => empreintesExp(x) >= NB_ETAPES).length, v = vedetteLieu(t, c);
  const tags = { cours: [finaleAJouer(t, c) ? "Finale à jouer" : `En cours · ${finies} sur ${liste.length}`, "cours"], ouvert: ["Ouvert", "nouv"], fini: ["Terminé", "fin"],
                 ferme: [etat === "ferme" && prochainLieu(t) === c ? "Le prochain lieu" : "Plus tard", "ferm"] };   // étape R133 ; R160 : le chiffre passe en bas de la carte
  const [lib, cl] = tags[etat];
  const pro = etat === "ferme" && prochainLieu(t) === c && lieuPrecedent(t, c);   // étape R160
  const action = etat === "ferme" ? `<span class="exp-verrou">${PAS_SVG}<span>${pro ? texteManqueLieu(t, c, true) : "Plus tard"}</span></span>`
    : `<span class="lieu-aller">${finaleAJouer(t, c) ? "Jouer la finale" : etat === "cours" ? "Continuer" : etat === "fini" ? "Revoir" : "Partir ici"} ▶</span>`;   // étape R149
  return `<button class="lieu-carte ${etat}" data-lieu="${echapper(c.nom)}" type="button">
      <span class="lieu-ph">${imgMini(c.photo, "")}${v ? imgMini(photoEsp(v), v.nom_courant, "lieu-vedette") : ""}${etat === "ouvert" ? "" : `<span class="exp-tag ${cl}">${lib}</span>`}</span>
      <span class="lieu-corps"><small class="lieu-pays">${echapper(c.pays || "")}</small><b>${echapper(c.nom)}</b>
        <span class="lieu-milieux">${milieuxLieu(t, c).map(pastilleMilieu).join("")}</span>
        ${etat !== "ferme" && medailleLieu(t, c) >= 1 ? `<span class="lieu-med">${medailleSvg(medailleLieu(t, c))}<small>${MEDAILLES_LIEU[medailleLieu(t, c)].titre}</small></span>` : ""}
        <span class="lieu-pied">${pro ? `<small class="lieu-ouvre">S'ouvre à l'argent ${echapper(deLieu(lieuPrecedent(t, c).nom))}</small>` : `<small>${liste.length} expéditions · ${especesLieu(t, c)} espèces</small>`}${action}</span></span></button>`;   // étape R160 : le lieu suivant dit ce qui l'ouvre   // étape R133 ; R137 : seulement la médaille acquise, plus de barre
}
function carteRemarquable(t, r) {
  const ouvert = chapitreOuvert(t, r);
  return `<button class="lieu-carte remarquable${ouvert ? "" : " ferme"}" id="lieu-remarquable" type="button">
      <span class="lieu-ph">${imgMini(r.photo, "")}${ouvert ? "" : `<span class="exp-tag ferm">À la fin du territoire</span>`}</span>
      <span class="lieu-corps"><small class="lieu-pays">Le site remarquable · ${echapper(r.pays || "")}</small><b>${echapper(r.nom)}</b>
        <span class="lieu-phrase">${echapper(r.phrase || "")}</span>
        <span class="lieu-pied"><small>${estGardien(t) ? `Gardien · ${bienSues(t)} espèces bien sues` : "Révision de tout le territoire"}</small>${ouvert ? `<span class="lieu-aller">${estGardien(t) ? "La sortie du jour" : tourDuSite(t, false) ? "Continuer le tour" : "Réviser"} ▶</span>` : ""}</span></span></button>`;
}
function dessinerAlbum(t, zone) {
  zone.classList.remove("chemin"); zone.classList.add("album");
  const lieux = lieuxDe(t), ouverts = lieux.filter(c => chapitreOuvert(t, c)).length, r = siteRemarquable(t);
  zone.innerHTML = `
    <div class="exp-tete"><div><h2>Vos lieux</h2><p class="jeu-sous">Partez où vous voulez parmi les lieux ouverts. Vos empreintes remplissent la médaille du lieu : l'argent ouvre le lieu suivant.</p></div>
      <small><b>${ouverts}</b> lieu${ouverts > 1 ? "x" : ""} ouvert${ouverts > 1 ? "s" : ""} sur ${lieux.length}</small></div>
    <div class="lieu-carrousel">
      <button class="lieu-fleche prec" type="button" aria-label="Lieux précédents">‹</button>
      <div class="lieu-piste">${lieux.map(c => carteLieu(t, c)).join("")}${r ? carteRemarquable(t, r) : ""}</div>
      <button class="lieu-fleche suiv" type="button" aria-label="Lieux suivants">›</button></div>`;
  activerCarrousel(zone.querySelector(".lieu-carrousel"), lieuDernierJoue(t));   // étape 300
  zone.querySelectorAll(".lieu-carte[data-lieu]").forEach(b => b.onclick = () => {
    const c = chapitreParNom(t, b.dataset.lieu);
    if (!chapitreOuvert(t, c)) { afficherBulle(bulleLieuFerme(t, c, "Ce lieu")); return; }
    ouvrirLieu(t, c.nom);
  });
  const rb = document.getElementById("lieu-remarquable");
  if (rb) rb.onclick = () => chapitreOuvert(t, r) ? ouvrirSite(t)
    : afficherBulle("Le site remarquable s'ouvre quand tous les lieux du territoire sont terminés : vous y réviserez toutes leurs espèces");
}

// Étape 335 (30/10, Revoir 8 — choix D1) : la carte du territoire au-dessus du carrousel, avec ses lieux à leur vraie place
//   (LIEUX_CARTE, généré par gen_lieux_carte.py) et leur état : terminé, en cours, ouvert, plus tard, site remarquable.
//   Un clic sur un point ouvre le lieu. Le nom s'affiche pour les lieux en cours et au survol.
// Étape 336 (30/10, deuxième série, choix D3 « la carte dans la couverture ») : la carte quitte le bloc au-dessus du carrousel
//   et se loge dans la couverture du territoire, à gauche du titre (fond sombre), avec la petite France en coin.
//   Un point qui palpite montre le lieu en cours. Un clic sur un point ouvre le lieu (brancherCarteLieux).
function carteCouverture(t) {
  const c = carteDesLieux(t, { largeur: 236, hauteur: 132, sombre: true, point: 0.5 });
  return c ? `<div class="couv-carte">${c}${miniFrance(t)}</div>` : miniFrance(t);
}
function brancherCarteLieux(racine, t) {
  racine.querySelectorAll(".carte-lieux [data-lieu]").forEach(g => {
    const ouvrir = () => {
      const c = chapitresDe(t).find(k => k.nom === g.dataset.lieu);
      if (!c) return;
      if (c.type === "remarquable") { if (chapitreOuvert(t, c)) ouvrirSite(t); else afficherBulle("Le site remarquable s'ouvre quand tous les lieux du territoire sont terminés"); return; }
      if (!chapitreOuvert(t, c)) { afficherBulle(bulleLieuFerme(t, c, c.nom)); return; }
      ouvrirLieu(t, c.nom);
    };
    g.addEventListener("click", ouvrir);
    g.addEventListener("keydown", ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); ouvrir(); } });
  });
}
function carteDesLieux(t, o = {}) {
  if (typeof LIEUX_CARTE === "undefined" || typeof CARTE_TERRITOIRES === "undefined") return "";
  const cadre = LIEUX_CARTE.cadres[t], forme = CARTE_TERRITOIRES.find(k => k.nom === t);
  if (!cadre || !forme) return "";
  const couleur = (TERRITOIRES[t] || {}).couleur || "#1F3A2E";
  const ppu = Math.min((o.largeur || 970) / cadre[2], (o.hauteur || 330) / cadre[3]);   // pixels par km, à peu près
  const echelle = (o.point || 0.9) / ppu;                             // des points et des noms de même taille à l'écran, quel que soit le territoire
  const voisins = o.sombre ? "" : CARTE_TERRITOIRES.filter(k => k.nom !== t).map(k => `<path d="${k.contour}" class="cl-voisin"/>`).join("");
  const enCours = lieuDernierJoue(t);
  const pts = chapitresDe(t).map(c => {
    const p = LIEUX_CARTE.points[t + "|" + c.nom];
    if (!p) return "";
    // Étape 339 : seul le lieu de la dernière expédition jouée est en orange (« vous êtes ici ») ; les autres lieux commencés sont « ouverts »
    const site = c.type === "remarquable", base = site ? (chapitreOuvert(t, c) ? "ouvert" : "ferme") : etatLieu(t, c);
    const etat = !site && enCours && enCours.nom === c.nom ? "cours" : base === "cours" ? "ouvert" : base;
    const r = (etat === "cours" ? 12 : 9) * echelle, [x, y] = p;   // étape 339 : le lieu de la dernière expédition, un peu plus gros
    const dessin = site
      ? `<path d="M${x} ${y - 13 * echelle} l${3.9 * echelle} ${8.6 * echelle} ${9.3 * echelle} ${0.8 * echelle} -${7 * echelle} ${6.1 * echelle} ${2.1 * echelle} ${9.2 * echelle} -${8.3 * echelle} -${4.9 * echelle} -${8.3 * echelle} ${4.9 * echelle} ${2.1 * echelle} -${9.2 * echelle} -${7 * echelle} -${6.1 * echelle} ${9.3 * echelle} -${0.8 * echelle}z" class="cl-site ${etat}"/>`
      : `<circle cx="${x}" cy="${y}" r="${r}" class="cl-pt ${etat}"/>${etat === "fini" ? `<path d="M${x - 4 * echelle} ${y} l${3 * echelle} ${3.2 * echelle} ${5.5 * echelle} -${6.5 * echelle}" class="cl-coche" style="stroke-width:${2.2 * echelle}"/>` : ""}`;
    const nomVisible = etat === "cours";
    // Étape R188 : le nom reste dans le cadre (avant, il sortait à droite, coupé). À droite du point s'il tient, sinon à gauche ;
    //   s'il ne tient d'aucun côté, centré sous le point (au-dessus en bas de carte), décalé pour rester dans le cadre,
    //   et raccourci par « … » s'il est plus large que la carte. Largeur estimée : 0,58 × la taille de la lettre par caractère.
    const fs = 14 * echelle, parCar = fs * 0.58, gauche = cadre[0], droite = cadre[0] + cadre[2];
    let texte = c.nom, largeurNom = texte.length * parCar;
    let tx, ty = y + 4.5 * echelle, ancre = "start";
    if (x + 14 * echelle + largeurNom <= droite) tx = x + 14 * echelle;
    else if (x - 14 * echelle - largeurNom >= gauche) { tx = x - 14 * echelle; ancre = "end"; }
    else {
      const maxCar = Math.max(4, Math.floor(cadre[2] / parCar));
      if (texte.length > maxCar) { texte = texte.slice(0, maxCar - 1).trim() + "…"; largeurNom = texte.length * parCar; }
      ancre = "middle";
      tx = Math.min(Math.max(x, gauche + largeurNom / 2), droite - largeurNom / 2);
      ty = y > cadre[1] + cadre[3] * 0.75 ? y - 16 * echelle : y + 24 * echelle;
    }
    const nom = `<text x="${tx}" y="${ty}"${ancre !== "start" ? ` text-anchor="${ancre}"` : ""} class="cl-nom${nomVisible ? "" : " survol"}" style="font-size:${fs}px;stroke-width:${4 * echelle}px">${echapper(texte)}</text>`;
    return `<g class="cl-lieu" data-lieu="${echapper(c.nom)}" tabindex="0" role="button" aria-label="${echapper(c.nom)}"><title>${echapper(c.nom)}</title>${dessin}${nom}</g>`;
  }).sort((a, b) => (a.includes('class="cl-nom"') ? 1 : 0) - (b.includes('class="cl-nom"') ? 1 : 0)).join("");   // étape R188 : le lieu dont le nom est écrit passe par-dessus les autres points
  // Étape R188 (11/11, demande d'Aubin, n° 18b) : le cadre est élargi de la taille d'un point (grossi 1,6 fois quand il est
  //   sélectionné, + le trait) : plus aucun point coupé au bord, même le lieu en cours ou un lieu tout au bord du territoire.
  const pad = 12 * echelle * 1.6 + 3 * echelle;
  const vue = [cadre[0] - pad, cadre[1] - pad, cadre[2] + 2 * pad, cadre[3] + 2 * pad].map(v => Math.round(v * 10) / 10);
  return `<div class="carte-lieux${o.sombre ? " sombre" : ""}" style="--couleur-t:${couleur}">
      <svg viewBox="${vue.join(" ")}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Les lieux du territoire sur la carte">${voisins}<path d="${forme.contour}" class="cl-terr-trait"/><path d="${forme.contour}" class="cl-terr"/>${pts}</svg>
      ${o.sombre ? "" : `<div class="cl-legende"><span><i class="fini"></i>terminé</span><span><i class="cours"></i>en cours</span><span><i class="ouvert"></i>ouvert</span><span><i class="ferme"></i>plus tard</span><span><i class="site"></i>site remarquable</span></div>`}</div>`;
}
// Étape 335 (choix D1) : la petite France de la couverture, le territoire en couleur
function miniFrance(t) {
  if (typeof CARTE_TERRITOIRES === "undefined") return "";
  const couleur = (TERRITOIRES[t] || {}).couleur || "#1F3A2E";
  // Étape 341 : la France d'un seul gris, sans les limites intérieures (elles mangeaient le territoire) ; le territoire par-dessus,
  // en couleur pleine, cerné d'un trait de la même couleur pour boucher les petits jours entre ses morceaux
  const autres = CARTE_TERRITOIRES.filter(k => k.nom !== t).map(k => `<path d="${k.contour}" class="mf-autre"/>`).join("");
  const lui = CARTE_TERRITOIRES.filter(k => k.nom === t).map(k => `<path d="${k.contour}" class="mf-terr" style="fill:${couleur};stroke:${couleur}"/>`).join("");
  return `<span class="mini-france" title="${echapper(t)} en France"><svg viewBox="${CARTE_CADRE}" aria-hidden="true">${autres}${lui}</svg></span>`;
}

// Étape 300 (26/10/2026) : les lieux en carrousel (une seule ligne, flèches), ouvert sur le dernier lieu joué
function lieuDernierJoue(t) {
  const lieux = lieuxDe(t);
  const derniere = suivi && suivi.derniereExpedition && expeditionParId(suivi.derniereExpedition[t]);
  const nom = (derniere && derniere.chapitre) || (suivi && suivi.chapitreCourant && suivi.chapitreCourant[t]);
  const dernier = lieux.find(c => c.nom === nom && chapitreOuvert(t, c));
  if (dernier && etatLieu(t, dernier) !== "fini") return dernier;
  // Étape R149 : le lieu joué en dernier est terminé (finale comprise) → le lieu en cours, sinon le premier lieu ouvert pas encore commencé
  return lieux.find(c => etatLieu(t, c) === "cours") || lieux.find(c => etatLieu(t, c) === "ouvert") || dernier || null;
}
function activerCarrousel(bloc, cible) {
  if (!bloc) return;
  const piste = bloc.querySelector(".lieu-piste"), prec = bloc.querySelector(".prec"), suiv = bloc.querySelector(".suiv");
  const majFleches = () => {
    const max = piste.scrollWidth - piste.clientWidth;
    prec.disabled = piste.scrollLeft <= 2; suiv.disabled = piste.scrollLeft >= max - 2;
    bloc.classList.toggle("sans-fleches", max <= 2);
  };
  prec.onclick = () => piste.scrollBy({ left: -piste.clientWidth, behavior: "smooth" });
  suiv.onclick = () => piste.scrollBy({ left: piste.clientWidth, behavior: "smooth" });
  piste.addEventListener("scroll", majFleches, { passive: true });
  // se placer sur le dernier lieu joué, dès que le carrousel a une largeur (il peut être dessiné caché)
  const carte = cible ? [...piste.querySelectorAll(".lieu-carte[data-lieu]")].find(b => b.dataset.lieu === cible.nom) : null;
  let place = false;
  const placer = () => {
    if (!piste.clientWidth) return false;
    if (!place && carte) { piste.scrollLeft = carte.offsetLeft - piste.firstElementChild.offsetLeft; }
    place = true; majFleches(); return true;
  };
  if (!placer() && typeof ResizeObserver === "function") {
    const ro = new ResizeObserver(() => { if (placer()) ro.disconnect(); });
    ro.observe(piste);
  }
  window.addEventListener("resize", majFleches, { passive: true });
}

// Étape 335 (30/10, Revoir 8 — choix de l'utilisateur B1 « un chemin dans le lieu » et A3 « la finale au bout du chemin ») :
//   les expéditions du lieu deviennent les arrêts d'un sentier, dans l'ordre du classeur (ordre conseillé) ;
//   le milieu est écrit sous chaque arrêt ; la prochaine (celle de « Continuer ») est mise en avant ;
//   les autres restent cliquables (le joueur reste libre). La finale « Tout est lié » est le dernier arrêt, plus grand.
const ETATS_CHEMIN = { finie: "Terminée", encours: "En cours", nouvelle: "Ouverte", fermee: "Plus tard" };
function cheminDuLieu(t, c, liste, ouvertes, x0) {
  const finies = liste.filter(x => empreintesExp(x) >= NB_ETAPES).length;
  const arrets = liste.map((x, i) => {
    const etat = etatExpedition(x, ouvertes), v = vedetteDe(x), prochaine = x0 && x.id === x0.id && etat !== "finie";
    const lib = etat === "encours" ? `En cours · étape ${etapeEnCours(x) || 1}` : etat === "finie" ? libelleTerminee(x) : ETATS_CHEMIN[etat];   // R131
    return `<button class="chemin-arret ${etat}${prochaine ? " prochaine" : ""}${etat === "fermee" ? " fermee" : ""}" data-id="${x.id}" type="button">
        <span class="chemin-num">${etat === "finie" ? "✓" : i + 1}</span>
        <span class="chemin-rond${estRenseigne(v.photo) ? "" : " silh"}">${imgMini(x.photo || photoEsp(v), v.nom_courant)}</span>
        <span class="chemin-info"><b>${echapper(x.titre)}</b>
          <small>${pastilleMilieu(x.milieu)}<span>${x.liste.length} espèces</span></small>${typeof libelleForme === "function" ? `<small class="chemin-formes">${libelleForme(x)}</small>` : ""}</span>
        <span class="chemin-droite">${dessinGain(x)}<span class="exp-tag ${prochaine ? "cours" : ({ finie: "fin", encours: "cours", nouvelle: "nouv", fermee: "ferm" })[etat]}">${prochaine && etat === "nouvelle" ? "À suivre" : lib}</span></span></button>`;   // étape R92 (choix C2) : le bouton reste seulement sur la photo
  }).join("");
  const fini = chapitreFini(t, c), dispo = finaleDisponible(t, c), ouverte = finaleOuverte(t, c), faite = finaleFaite(t, c.nom);
  const n = liensDuLieu(t, c.nom).length, esp = especesDesLiens(t, c.nom, 6);
  const etatF = faite ? "Terminée · revoir la planche" : ouverte ? "Toutes les expéditions sont terminées" : (fini && !dispo) ? "Bientôt disponible" : `S'ouvre à la fin du lieu · ${finies} expédition${finies > 1 ? "s" : ""} sur ${liste.length}`;
  const finale = `<button class="chemin-finale${ouverte || faite ? "" : " fermee"}${faite ? " faite" : ""}" id="exp-finale" type="button">
      <span class="chemin-finale-ph">${esp.length >= 2 ? `<span class="finale-mosaique n${Math.min(esp.length, 6) >= 6 ? 6 : Math.min(esp.length, 4)}">${esp.slice(0, esp.length >= 6 ? 6 : 4).map(e => imgMini(e.photo, e.nom_courant)).join("")}</span>` : `<span class="finale-ph">${PICTO_LIENS}</span>`}</span>
      <span class="chemin-finale-corps"><small class="chemin-finale-etiq">${PICTO_LIENS}Au bout du chemin</small>
        <b>La finale du lieu</b>
        <span>${dispo ? `${n} liens à découvrir entre les espèces ${echapper(deLieu(c.nom))}` : "Les liens de ce lieu arrivent bientôt"} · ${dessinPas(faite ? EMPREINTES_FINALE : 0, EMPREINTES_FINALE)}</span>
        <i class="jauge-jeu"><b style="width:${Math.round(100 * finies / Math.max(1, liste.length))}%"></b></i>
        <small>${etatF}</small></span>
      ${ouverte && !faite ? `<span class="couv-go">Jouer la finale ▶</span>` : ""}</button>`;
  return `<div class="chemin-lieu"><div class="chemin-tete"><h3>Le chemin du lieu</h3><small>${finies} expédition${finies > 1 ? "s" : ""} terminée${finies > 1 ? "s" : ""} sur ${liste.length} · vous pouvez les faire dans l'ordre que vous voulez</small></div>
    <div class="chemin-arrets">${arrets}${finale}</div></div>`;
}

// Étape R92 (01/11, Revoir 9, choix de l'utilisateur B1 + B2) : chaque lieu plus unique.
//   B1 — la page du lieu prend une teinte tirée de sa photo (fond, cartes, traits, boutons) ; données LIEUX_IDENTITE
//        (lieux_identite.js, généré par Outils\gen_lieux_identite.py). Sans données : les couleurs habituelles.
//   B2 — « Ici plus qu'ailleurs » : jusqu'à 3 espèces du lieu observées ici plus qu'autour de tout autre lieu du territoire
//        (GBIF, 15 km). Une espèce pas encore découverte reste floue, avec sa famille : on ne dévoile pas la réponse.
function identiteLieu(t, c) { return (typeof LIEUX_IDENTITE !== "undefined" && LIEUX_IDENTITE[`${t}|${c.nom}`]) || {}; }
function teinterLieu(zone, t, c) {
  const k = identiteLieu(t, c).couleur;
  zone.classList.toggle("teinte", !!k);
  for (const v of ["fond", "carte", "trait", "clair", "doux"]) {
    if (k) zone.style.setProperty(`--lieu-${v}`, k[v]); else zone.style.removeProperty(`--lieu-${v}`);
  }
}
function iciPlusQuAilleurs(t, c) {
  const sig = (identiteLieu(t, c).signature || []).map(s => especeParNom(s.nom)).filter(Boolean);
  if (!sig.length) return "";
  const dans = typeof dansTerritoire === "function" ? dansTerritoire(t) : `dans ${t}`;
  return `<div class="ici-plus"><div class="ici-tete"><b>Ici plus qu'ailleurs</b>
      <small>${sig.length > 1 ? "les espèces" : "l'espèce"} de ce lieu qu'on observe ici plus que partout ailleurs ${echapper(dans)}</small></div>
    <div class="ici-liste">${sig.map(e => { const connue = estReconnue(e);
      return `<button class="ici-esp${connue ? "" : " floue"}" type="button" data-nom="${echapper(e.nom_courant)}">
        <span class="ici-ph">${estRenseigne(e.photo) ? imgMini(e.photo, connue ? e.nom_courant : "") : imgMini(photoEsp(e), "")}</span>
        <span class="ici-txt"><b>${connue ? echapper(e.nom_courant) : "À découvrir"}</b><small>${echapper(FAMILLE_SINGULIER[e.onglet] || "")}</small></span></button>`; }).join("")}</div></div>`;
}

// Étape R104 (03/11, chantier « Rendre chaque lieu unique », choix de l'utilisateur A1 + B1 + C2 + D2) :
//   sous la photo du lieu, 4 cases (Milieu · Protection · Taille · Le chiffre), puis « Pourquoi ici ? »,
//   « Ce qui menace ce lieu » (visible tout de suite) et « Ce qui marche ». Données : c.identite (onglet chapitres,
//   colonnes milieu_principal… ce_qui_marche ; 2 sources par texte dans sources_identite). Sans donnée : rien ne s'affiche.
//   Quand « Pourquoi ici ? » existe, l'ancienne phrase du lieu n'est plus affichée sur la photo (elle répétait les mêmes chiffres).
const PICTO_IDENTITE = {
  milieu: '<path d="M2 11c2-2 4-2 6 0s4 2 6 0"/><path d="M2 7c2-2 4-2 6 0s4 2 6 0"/>',
  protection: '<path d="M8 2 3 4v4c0 3 2 5 5 6 3-1 5-3 5-6V4z"/><path d="M6 8l1.5 1.5L10.5 6.5"/>',
  taille: '<path d="M2 8h12M2 5v6M14 5v6M5 7v2M8 7v2M11 7v2"/>',
  chiffre: '<path d="M4 3v10M4 13h9"/><path d="M6 10l2.5-3 2 2L13 5"/>'
};
function pictoIdentite(k) {
  return `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PICTO_IDENTITE[k]}</svg>`;
}
function blocIdentiteLieu(c) {
  const d = (c && c.identite) || {};
  const cases = [
    ["milieu", "Milieu", d.milieu_principal, ""],
    ["protection", "Protection", d.protection, d.protection_detail],
    ["taille", "Taille", d.taille_valeur, d.taille_legende],
    ["chiffre", "Le chiffre", d.chiffre_valeur, d.chiffre_legende]
  ].filter(k => k[2]);
  const encart = (classe, titre, texte) => texte ? `<div class="lieu-encart ${classe}"><span class="lieu-encart-t">${titre}</span><p>${echapper(texte)}</p></div>` : "";
  const html = (cases.length ? `<div class="lieu-cases">${cases.map(([k, lab, v, p]) => `<div class="lieu-case">
        <span class="lieu-case-lab">${pictoIdentite(k)}${lab}</span><span class="lieu-case-val">${echapper(v)}${p ? `<small>${echapper(p)}</small>` : ""}</span></div>`).join("")}</div>` : "")
    + (d.pourquoi_ici ? `<div class="lieu-pourquoi"><h2>Pourquoi ici ?</h2><p>${echapper(d.pourquoi_ici)}</p></div>` : "")
    + encart("menace", "Ce qui menace ce lieu", d.menace) + encart("marche", "Ce qui marche", d.ce_qui_marche);
  return html ? `<div class="lieu-identite">${html}</div>` : "";
}

let lieuAffiche = null;
function ouvrirLieu(t, nom) {
  lieuAffiche = { t, nom };
  choisirChapitre(t, nom);
  montrer("lieu"); dessinerPageLieu(); window.scrollTo(0, 0);
}
// Étape R124 (Revoir 11) : « Vous êtes au / à la / dans les / en… » selon le lieu, au lieu de « Vous êtes à » partout.
// Quand le nom commence par un article (Le Diois, Les Alpilles, L'étang de Lindre), l'article passe dans la petite ligne
// et le grand titre garde le reste du nom (« Vous êtes dans le » / « Diois »).
const VOUS_ETES_LIEU = {
  "Gorges du Verdon": "dans les",
  "La Vallouise": "dans la",
  "Lac d'Annecy": "au",
  "Lac de Serre-Ponçon": "au",
  "Le Diois": "dans le",
  "Massif de la Chartreuse": "dans le",
  "Mont Ventoux": "sur le",
  "Pralognan-la-Vanoise": "à",
  "Vallée de la Vésubie": "dans la",
  "Vercors": "dans le",
  "Barthes de l'Adour": "dans les",
  "Coteaux du Gers": "sur les",
  "Dune du Pilat": "sur la",
  "Estuaire de la Charente": "dans l'",
  "Lac de Cazaux-Sanguinet": "au",
  "Marais poitevin": "dans le",
  "Moissac, entre Tarn et Garonne": "à",
  "Rocamadour et le causse": "à",
  "Vallée de la Dordogne": "dans la",
  "Île d'Oléron": "sur l'",
  "Chambord et la Loire": "à",
  "Chinon et la Vienne": "à",
  "Estuaire de la Seine": "dans l'",
  "Falaises d'Étretat": "sur les",
  "Forêt de Compiègne": "dans la",
  "Forêt de Fontainebleau": "dans la",
  "La Brenne": "en",
  "Lac du Der": "au",
  "Paris, ses bois et ses parcs": "à",
  "Sologne": "en",
  "Ajaccio et les îles Sanguinaires": "à",
  "Bouches de Bonifacio": "aux",
  "Cap Corse": "au",
  "Corte et la vallée de la Restonica": "à",
  "Désert des Agriates": "dans le",
  "Forêt d'Aïtone": "dans la",
  "Monte Cinto et le Niolo": "au",
  "Plateau du Coscione": "sur le",
  "Réserve naturelle de Scandola": "dans la",
  "Étang de Biguglia": "à l'",
  "Forêt du Risoux et Les Rousses": "dans la",
  "Haute Chaîne du Jura": "sur la",
  "Lac de Nantua": "au",
  "Lacs de Remoray et de Saint-Point": "aux",
  "Le Mont d'Or": "sur le",
  "Pontarlier et le château de Joux": "à",
  "Reculée de Baume-les-Messieurs": "dans la",
  "Saut du Doubs et lac de Chaillexon": "au",
  "Tourbières de Frasne": "dans les",
  "Vallée de la Loue": "dans la",
  "Baie du Mont-Saint-Michel": "dans la",
  "Bocage vendéen": "dans le",
  "Forêt de Brocéliande": "dans la",
  "Golfe du Morbihan": "dans le",
  "Lac de Grand-Lieu": "au",
  "Les Sept-Îles": "aux",
  "Marais de Brière": "dans le",
  "Monts d'Arrée": "dans les",
  "Presqu'île de Crozon": "sur la",
  "Suisse normande": "en",
  "Aubrac": "sur l'",
  "Brioude et le val d'Allier": "à",
  "Causse Méjean": "sur le",
  "Chaîne des Puys": "dans la",
  "Gorges du Tarn et de la Jonte": "dans les",
  "Mont Aigoual": "sur le",
  "Plateau de Millevaches": "sur le",
  "Puy Mary": "au",
  "Salers": "à",
  "Étangs du Forez": "aux",
  "Camargue": "en",
  "Gorges de l'Hérault": "dans les",
  "Gorges du Gardon": "dans les",
  "La Crau": "dans la",
  "Lac du Salagou": "au",
  "Les Alpilles": "dans les",
  "Les Calanques": "dans les",
  "Massif des Maures": "dans le",
  "Pic Saint-Loup": "au",
  "Étang de Thau": "à l'",
  "Dijon et la Côte de Nuits": "à",
  "L'Isle Crémieu": "dans l'",
  "L'étang de Lindre": "à l'",
  "Langres et son plateau": "à",
  "Louhans et le bocage bressan": "à",
  "Metz et la vallée de la Moselle": "à",
  "Monthermé et la vallée de la Meuse": "à",
  "Rhinau et la forêt du Rhin": "à",
  "Strasbourg et le Rhin": "à",
  "Tournus et le val de Saône": "à",
  "Cerdagne": "en",
  "Cirque de Gavarnie": "dans le",
  "Forêt d'Iraty": "dans la",
  "Lac de Lourdes": "au",
  "Saint-Jean-Pied-de-Port": "à",
  "Tourbière de Bernadouze": "à la",
  "Vallée d'Aspe": "dans la",
  "Vallée d'Ossau": "dans la",
  "Vallée de Baïgorry": "dans la",
  "Villefranche-de-Conflent": "à",
  "Ballon d'Alsace": "au",
  "Château du Falkenstein et étang de Hanau": "au",
  "Gérardmer et son lac": "à",
  "Le Donon et la vallée de la Bruche": "au",
  "Le Grand Ballon": "au",
  "Mont Sainte-Odile": "au",
  "Plateau des Mille Étangs": "au",
  "Remiremont et la vallée de la Moselle": "à",
  "Riquewihr et le vignoble": "à",
  "Vallée de Munster": "dans la",
};
function vousEtesLieu(nom) {
  nom = String(nom || "");
  let prep = VOUS_ETES_LIEU[nom], titre = nom;
  const m = nom.match(/^(Le |La |Les |L')(.+)$/);
  if (m) titre = m[2].charAt(0).toUpperCase() + m[2].slice(1);
  if (!prep) {   // lieu absent de la table (nouveau lieu) : règle simple d'après l'article ou le premier mot
    const a = m ? m[1] : "";
    if (a === "Le ") prep = "au"; else if (a === "La ") prep = "à la"; else if (a === "Les ") prep = "aux"; else if (a === "L'") prep = "à l'";
    else if (/^(Lac|Mont|Plateau|Col|Puy|Pic|Cap|Ballon) /.test(nom)) prep = "au";
    else if (/^(Lacs|Étangs) /.test(nom)) prep = "aux";
    else if (/^(Forêt|Vallée|Baie|Réserve|Presqu'île|Dune|Côte) /.test(nom)) prep = "dans la";
    else if (/^(Gorges|Monts) /.test(nom)) prep = "dans les";
    else prep = "à";
  }
  return { ligne: "Vous êtes " + prep, titre };
}

function dessinerPageLieu() {
  const zone = document.getElementById("vue-lieu");
  if (!zone || !lieuAffiche) return;
  zone.classList.remove("teinte");                          // étape R92 : la teinte n'est mise que sur la page d'un lieu
  if (lieuAffiche.site) { dessinerPageSite(); return; }   // étape 292
  if (lieuAffiche.finale) { dessinerFinale(); return; }   // étape 301 : la finale « Tout est lié »
  const { t, nom } = lieuAffiche, c = chapitreParNom(t, nom);
  if (!c) return;
  const liste = expeditionsDuChapitre(t, c.nom), ouvertes = expeditionsOuvertes(t);
  const finies = liste.filter(x => empreintesExp(x) >= NB_ETAPES).length, x0 = expeditionDuLieu(t, c);
  const finaleIci = !x0 && finaleOuverte(t, c) && !finaleFaite(t, c.nom);   // étape R149 : le bouton de la photo lance la finale
  const milieux = milieuxLieu(t, c);
  const art = typeof articleTerritoire === "function" ? articleTerritoire(t) : "";
  const vers = art === "en" ? `en ${t}` : `vers ${art ? art + " " : ""}${t}`;
  const groupes = cheminDuLieu(t, c, liste, ouvertes, x0) + blocLieuEnBref(t, c) + iciPlusQuAilleurs(t, c);   // R153 : le lieu en bref, replié, après le chemin   // étape 335 : le chemin du lieu ; R93 : « Ici plus qu'ailleurs » en bas, discret
  const vousEtes = vousEtesLieu(c.nom);   // étape R124
  teinterLieu(zone, t, c);   // étape R92 (choix B1) : la couleur du lieu
  zone.innerHTML = `<div class="lieu-page">
    <div class="lieu-hero"><img src="${c.photo}" alt="${echapper(c.nom)}">
      <button class="lieu-sortir" id="lieu-sortir" type="button">← Sortir ${echapper(vers)}</button>
      ${typeof pastilleNiveau === "function" ? pastilleNiveau("territoire", t, "lieu-sortir-m", (TERRITOIRES[t] || {}).couleur) : ""}
      <div class="lieu-hero-texte"><div class="rep-etiq rep-mobile">${typeof iconeNiveau === "function" ? iconeNiveau("lieu") : ""}Lieu réel</div><div class="couv-vous">${echapper(vousEtes.ligne)}</div><h1>${echapper(vousEtes.titre)}</h1>
        <p class="lieu-hero-pays">${echapper(c.pays || "")}</p>${c.phrase && !(c.identite && c.identite.pourquoi_ici) ? `<p class="lieu-hero-phrase">${echapper(c.phrase)}</p>` : ""}
        <div class="lieu-milieux sombre">${milieux.map(pastilleMilieu).join("")}</div></div>
      <div class="lieu-hero-jouer"><small>${finies} expédition${finies > 1 ? "s" : ""} terminée${finies > 1 ? "s" : ""} sur ${liste.length}${finaleIci ? " · la finale vous attend" : ""}</small>
        ${x0 ? `<button class="couv-go" id="lieu-go" type="button">${expeditionCommencee(x0) ? "Continuer l'expédition" : "Commencer l'expédition"} <span aria-hidden="true">▶</span></button>`
          : finaleIci ? `<button class="couv-go" id="lieu-go" type="button">Jouer la finale <span aria-hidden="true">▶</span></button>` : ""}</div>
    </div>
    <div class="lieu-sombre">${blocMedailleLieu(t, c)}${groupes}</div></div>`;   // étape R153 (avant : la carte d'identité en tête)   // étape R133 : la médaille du lieu   // étape R104 : la carte d'identité du lieu en tête
  document.getElementById("lieu-sortir").onclick = () => montrer("accueil");
  const sortirM = document.getElementById("lieu-sortir-m"); if (sortirM) sortirM.onclick = () => { montrer("accueil"); window.scrollTo(0, 0); };   // étape M8
  const go = document.getElementById("lieu-go"); if (go) go.onclick = () => { if (x0) lancerExpedition(x0); else lancerFinale(t, c.nom); };
  bandeauCollant(zone, zone.querySelector(".lieu-hero"), { sombre: true, photo: c.photo, sur: echapper(c.pays || t), titre: c.nom,
    infos: `${finies} sur ${liste.length} expéditions`, retourTexte: `Sortir ${vers}`, retour: () => montrer("accueil"),
    bouton: x0 ? (expeditionCommencee(x0) ? "Continuer" : "Commencer") : finaleIci ? "La finale" : "", action: () => { if (x0) lancerExpedition(x0); else lancerFinale(t, c.nom); } });   // étape 333 ; R149
  zone.querySelectorAll(".exp-carte[data-id], .chemin-arret[data-id]").forEach(b => b.onclick = () => {
    const x = expeditionParId(b.dataset.id);
    if (b.classList.contains("fermee")) afficherBulle("Elle s'ouvrira quand vous aurez commencé une des expéditions proposées");
    else ouvrirExpedition(x);
  });
  zone.querySelectorAll(".ici-esp").forEach(b => b.onclick = () => {   // étape R92 : une espèce connue ouvre sa fiche
    const e = especeParNom(b.dataset.nom);
    if (e && estReconnue(e)) ouvrirPageEspece(e);
    else afficherBulle("Vous la découvrirez dans une des expéditions de ce lieu");
  });
  const fin = document.getElementById("exp-finale");
  if (fin) fin.onclick = () => {                           // étape 301
    if (finaleFaite(t, c.nom)) { ouvrirPlanche(t, c.nom); return; }
    if (finaleOuverte(t, c)) { lancerFinale(t, c.nom); return; }
    afficherBulle(chapitreFini(t, c) ? "Les liens de ce lieu arrivent bientôt dans le jeu"
      : "La finale s'ouvre quand toutes les expéditions du lieu sont terminées");
  };
}


// ==================================================================
// Étape 292 (26/10/2026) : le site remarquable en révision — maquettes RevA, RevB, RevC retenues (A + D)
//   1. Le tour du lac : 5 haltes (de vrais lieux du site, colonne « haltes » du classeur), 8 espèces chacune,
//      en commençant par celles que le joueur connaît le moins bien, mêlées entre les lieux du territoire.
//   2. La fête « Gardien des <territoire> » à la fin du tour.
//   3. Ensuite, la sortie du jour : 10 espèces choisies chaque jour par un rappel espacé (2, 5, 12, 30 jours ;
//      une erreur fait revenir l'espèce le lendemain, sans rien retirer). Pas de série à tenir.
// Gardé dans la sauvegarde : suivi.tourSite[t], suivi.gardien[t], suivi.rappels[nom], suivi.sortieDuJour[t].
// ==================================================================
const ESPECES_PAR_HALTE = 8;
const QUESTIONS_HALTE = 10;
const ESPECES_SORTIE = 10;
const INTERVALLES_RAPPEL = [1, 2, 5, 12, 30];     // jours avant de revoir une espèce, selon son palier (0 = après une erreur)

function jourPlus(n) {
  const d = new Date(); d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function joursDepuis(jour) {
  if (!jour) return null;
  const [a, m, j] = jour.split("-").map(Number), [a2, m2, j2] = aujourdhui().split("-").map(Number);
  return Math.round((Date.UTC(a2, m2 - 1, j2) - Date.UTC(a, m - 1, j)) / 86400000);
}
// Les espèces du territoire, et le lieu de chacune (celui de sa première expédition)
function lieuDesEspeces(t) {
  const m = new Map();
  for (const c of lieuxDe(t)) for (const x of expeditionsDuChapitre(t, c.nom)) for (const e of x.liste) if (!m.has(e.nom_courant)) m.set(e.nom_courant, c.nom);
  return m;
}
function especesDuSite(t) {
  const noms = lieuDesEspeces(t);
  return ESPECES.filter(e => noms.has(e.nom_courant));
}
// Moins bien connue = plus de choses « à revoir », plus d'échecs, plus de caractéristiques jamais trouvées
function faiblesse(e) {
  const nom = e.nom_courant;
  const enAttente = aRevoir.filter(r => r.nom === nom).length;
  const echecs = Object.entries((suivi && suivi.echecs) || {}).reduce((s, [k, n]) => s + (k.startsWith(nom + "|") ? n : 0), 0);
  const jamais = champsPossibles(e).filter(c => c !== IDENTIFICATION && nbBonnes(e, c) === 0).length;
  return 3 * enAttente + echecs + 0.5 * jamais + Math.random() * 0.4;
}
function haltesDuSite(r) { return (r && r.haltes && r.haltes.length) ? r.haltes : ["Première halte", "Deuxième halte", "Troisième halte", "Quatrième halte", "Cinquième halte"]; }
function tourDuSite(t, creer = true) {
  suivi.tourSite = suivi.tourSite || {};
  if (!suivi.tourSite[t] && creer) creerTour(t);
  return suivi.tourSite[t] || null;
}
function creerTour(t) {
  const r = siteRemarquable(t), n = haltesDuSite(r).length;
  const liste = especesDuSite(t).filter(estIdentifiee).map(e => ({ e, f: faiblesse(e) })).sort((a, b) => b.f - a.f).map(o => o.e.nom_courant);
  const haltes = Array.from({ length: n }, (_, i) => liste.slice(i * ESPECES_PAR_HALTE, (i + 1) * ESPECES_PAR_HALTE)).filter(h => h.length);
  suivi.tourSite = suivi.tourSite || {};
  suivi.tourSite[t] = { haltes, faites: haltes.map(() => false), fini: false };
  sauvegarder();
}
function estGardien(t) { return !!(suivi && suivi.gardien && suivi.gardien[t]); }
function halteEnCours(tour) { const i = tour.faites.indexOf(false); return i < 0 ? null : i; }
// Une espèce « bien sue » : identifiée, rien en attente « à revoir », et pas d'erreur à sa dernière révision
function bienSue(e) {
  const rap = suivi.rappels && suivi.rappels[e.nom_courant];
  return estIdentifiee(e) && !aRevoir.some(r => r.nom === e.nom_courant) && (!rap || rap.palier >= 1);
}
function bienSues(t) { return especesDuSite(t).filter(bienSue).length; }

// ---- La sortie du jour : les espèces dont le rappel est arrivé, puis les moins bien connues ----
function sortieDuJour(t) {
  suivi.sortieDuJour = suivi.sortieDuJour || {};
  const deja = suivi.sortieDuJour[t];
  if (deja && deja.jour === aujourdhui()) return deja;
  const rap = suivi.rappels || {}, auj = aujourdhui();
  const toutes = especesDuSite(t).filter(estIdentifiee);
  const dues = toutes.filter(e => rap[e.nom_courant] && rap[e.nom_courant].jour <= auj).sort((a, b) => rap[a.nom_courant].jour.localeCompare(rap[b.nom_courant].jour));
  const jamais = toutes.filter(e => !rap[e.nom_courant]).map(e => ({ e, f: faiblesse(e) })).sort((a, b) => b.f - a.f).map(o => o.e);
  let choix = [...dues, ...jamais].slice(0, ESPECES_SORTIE);
  if (choix.length < ESPECES_SORTIE) {                // tout est à jour : les plus anciennes révisions
    const autres = toutes.filter(e => !choix.includes(e)).sort((a, b) => (rap[a.nom_courant] || {}).jour.localeCompare((rap[b.nom_courant] || {}).jour));
    choix = choix.concat(autres.slice(0, ESPECES_SORTIE - choix.length));
  }
  suivi.sortieDuJour[t] = { jour: auj, noms: choix.map(e => e.nom_courant), faite: false };
  sauvegarder();
  return suivi.sortieDuJour[t];
}
function raisonSortie(e) {
  const rap = suivi.rappels && suivi.rappels[e.nom_courant];
  if (aRevoir.some(r => r.nom === e.nom_courant)) return "une réponse à revoir";
  if (rap && rap.palier === 0) return "à reprendre";
  if (rap && rap.vu) { const n = joursDepuis(rap.vu); return n <= 0 ? "revue aujourd'hui" : `revue il y a ${n} jour${n > 1 ? "s" : ""}`; }
  return "pas encore revue ici";
}
// Après une partie : chaque espèce interrogée avance d'un palier, ou revient demain après une erreur
function noterRappels(d) {
  suivi.rappels = suivi.rappels || {};
  const posees = new Set((d.posees || []).map(p => p.split("|")[0]));
  const ratees = new Set((d.rates || []).map(r => r.nom));
  for (const nom of posees) {
    const r = suivi.rappels[nom] || { palier: 0 };
    const palier = ratees.has(nom) ? 0 : Math.min(INTERVALLES_RAPPEL.length - 1, (suivi.rappels[nom] ? r.palier : 0) + 1);
    suivi.rappels[nom] = { palier, vu: aujourdhui(), jour: jourPlus(INTERVALLES_RAPPEL[palier]) };
  }
}

// ---- Lancer une halte, ou la sortie du jour ----
function lancerSite(t, quoi) {               // quoi : un numéro de halte, ou "sortie"
  const r = siteRemarquable(t);
  if (!r) return;
  let noms, titre;
  if (quoi === "sortie") { noms = sortieDuJour(t).noms; titre = `${r.nom} · la sortie du jour`; }
  else { const tour = tourDuSite(t); noms = tour.haltes[quoi]; titre = `${r.nom} · ${haltesDuSite(r)[quoi]}`; }
  const especes = noms.map(n => ESPECES.find(e => e.nom_courant === n)).filter(Boolean);
  if (!especes.length) { afficherBulle("Rien à revoir pour l'instant"); return; }
  depuisArcade = false; modeLibre = false;
  document.getElementById("bouton-territoire-defi").textContent = "Retour au territoire";
  territoiresDefi = [t]; territoiresChoisis = [t];
  jeuChoisi = "revision"; revisionsSeules = true; photosSeules = false; questionsClassique = QUESTIONS_HALTE;
  const d = { cle: "site|" + t + "|" + quoi, nom: titre, especes, ouvert: true };
  lancementDirect = true;
  montrer("jouer");
  lancementDirect = false;
  demarrerDefi(d, { site: { t, halte: quoi === "sortie" ? null : quoi } });
}

// ---- La fin d'une halte ou de la sortie (appelé à la fin de terminerDefi) ----
function finSite(d) {
  const { t, halte } = d.site, r = siteRemarquable(t);
  if (!r) return;
  noterRappels(d);
  const zone = document.getElementById("passerelle-fin-defi"), rejouer = document.getElementById("bouton-rejouer-defi");
  const nbEsp = new Set((d.posees || []).map(p => p.split("|")[0])).size;
  let texte, fete = null;
  if (halte === null) {
    suivi.sortieDuJour = suivi.sortieDuJour || {};
    if (suivi.sortieDuJour[t]) suivi.sortieDuJour[t].faite = true;
    texte = `<b>Sortie du jour faite.</b> ${nbEsp} espèce${nbEsp > 1 ? "s" : ""} revue${nbEsp > 1 ? "s" : ""} · ${bienSues(t)} sur ${especesDuSite(t).length} bien sues. Revenez quand vous voulez.`;
    rejouer.textContent = "Retour au site";
    rejouer.onclick = () => ouvrirSite(t);
  } else {
    const tour = tourDuSite(t), noms = haltesDuSite(r);
    tour.faites[halte] = true;
    const suite = halteEnCours(tour);
    if (suite === null && !tour.fini) {
      tour.fini = true;
      const premier = !estGardien(t);
      suivi.gardien = suivi.gardien || {}; suivi.gardien[t] = true;
      if (premier) fete = t;
    }
    texte = suite === null ? `<b>Le tour est terminé !</b> Les ${tour.haltes.length} haltes sont faites.`
      : `<b>${noms[halte]} : halte faite.</b> ${nbEsp} espèce${nbEsp > 1 ? "s" : ""} revue${nbEsp > 1 ? "s" : ""}. Prochaine halte : ${noms[suite]}.`;
    rejouer.textContent = suite === null ? "Voir la sortie du jour ▶" : `Halte suivante : ${noms[suite]} ▶`;
    rejouer.onclick = () => suite === null ? ouvrirSite(t) : lancerSite(t, suite);
  }
  sauvegarder();
  zone.classList.remove("cache");
  zone.innerHTML = `<div class="exp-fin"><div class="exp-fin-texte">${texte}</div>
      <button class="ac-bouton" id="site-fin-ecran">Voir le site</button></div>`;
  document.getElementById("site-fin-ecran").onclick = () => ouvrirSite(t);
  document.getElementById("nom-fin-defi").textContent = d.nom;
  if (fete) {
    const n = especesDuSite(t).length, premierLieu = (lieuxDe(t)[0] || {}).nom || "";
    feter({ etiquette: "Le tour du site est terminé", titre: `Gardien ${typeof deTerritoire === "function" ? deTerritoire(t) : "des " + t}`,
            detail: `${premierLieu ? `De ${premierLieu} à ${r.nom}, v` : "V"}ous avez rencontré les ${n} espèces du territoire et revu celles qui vous résistaient.`,
            son: "badge", visuel: `<div class="fete-visuel rang exp-fete">${PAS_SVG.repeat(3)}</div>` });
  }
}

// ---- La page du site (dans vue-lieu, en mode site) ----
function ouvrirSite(t) {
  const r = siteRemarquable(t);
  if (!r) return;
  lieuAffiche = { t, nom: r.nom, site: true };
  montrer("lieu"); dessinerPageLieu(); window.scrollTo(0, 0);
}
function medaillon(e) { return e ? `<span class="site-med${estRenseigne(e.photo) ? "" : " silh"}">${imgMini(photoEsp(e), e.nom_courant)}</span>` : ""; }
function dessinerPageSite() {
  const zone = document.getElementById("vue-lieu"), { t } = lieuAffiche, r = siteRemarquable(t);
  if (!zone || !r) return;
  const tour = tourDuSite(t), noms = haltesDuSite(r), gardien = estGardien(t);
  const lieuDe = lieuDesEspeces(t), esp = n => ESPECES.find(e => e.nom_courant === n);
  const art = typeof articleTerritoire === "function" ? articleTerritoire(t) : "";
  const vers = art === "en" ? `en ${t}` : `vers ${art ? art + " " : ""}${t}`;
  const deT = typeof deTerritoire === "function" ? deTerritoire(t) : `des ${t}`;
  const cours = halteEnCours(tour), total = especesDuSite(t).length;
  // le sentier et les cartes des haltes
  const sentier = tour.haltes.map((h, i) => `<span class="site-pas ${tour.faites[i] ? "fait" : i === cours ? "cours" : ""}">${tour.faites[i] ? "✓" : i + 1}</span>`).join('<span class="site-trait"></span>');
  const cartes = tour.haltes.map((h, i) => {
    const etat = tour.faites[i] ? "fait" : i === cours ? "cours" : "ferme";
    const lieux = [...new Set(h.map(n => lieuDe.get(n)).filter(Boolean))];
    const court = lieux.slice(0, 3).join(", ") + (lieux.length > 3 ? "…" : "");
    const bouton = etat === "fait" ? `<button class="duo-autres" data-halte="${i}" type="button">Refaire</button>`
      : etat === "cours" ? `<button class="couv-go petit" data-halte="${i}" type="button">Partir ▶</button>`
      : `<small class="exp-verrou">après la halte précédente</small>`;
    return `<div class="site-halte ${etat}"><div class="site-halte-tete"><small>Halte ${i + 1}</small><b>${echapper(noms[i] || "")}</b></div>
      <div class="site-meds">${h.slice(0, 3).map(n => medaillon(esp(n))).join("")}</div>
      <small>${h.length} espèces ${etat === "fait" ? "revues" : "à revoir"} · de ${lieux.length} lieu${lieux.length > 1 ? "x" : ""}</small>
      <small class="site-lieux">${echapper(court)}</small>${bouton}</div>`;
  }).join("");
  const blocTour = `<div class="site-bloc"><div class="site-bloc-tete"><h2>Le tour du site</h2>
      <small>${tour.fini ? `Terminé · ${tour.haltes.length} haltes sur ${tour.haltes.length}` : `${tour.haltes.length} haltes · on commence par ce que vous connaissez le moins bien`}</small></div>
      <div class="site-sentier">${sentier}</div><div class="site-haltes">${cartes}</div>
      ${tour.fini ? `<button class="duo-autres" id="site-refaire" type="button">Refaire le tour</button>` : ""}</div>`;
  // la sortie du jour
  let blocSortie;
  if (gardien) {
    const s = sortieDuJour(t), date = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
    const liste = s.noms.map(esp).filter(Boolean).map(e => `<span class="site-sortie-esp">${medaillon(e)}<span><b>${echapper(e.nom_courant)}</b><small>${raisonSortie(e)}</small></span></span>`).join("");
    blocSortie = `<div class="site-bloc sortie"><div class="site-date">${date.charAt(0).toUpperCase() + date.slice(1)}</div>
      <div class="site-bloc-tete"><h2>La sortie du jour</h2>
        <small>${s.faite ? "Faite aujourd'hui. Vous pouvez la refaire, ou revenir demain pour une nouvelle sortie." : `${s.noms.length} espèces à entretenir aujourd'hui, choisies parmi celles que vous risquez d'oublier.`}</small></div>
      <div class="site-sortie">${liste}</div>
      <button class="couv-go" id="site-sortie" type="button">${s.faite ? "Refaire la sortie" : "Partir"} <span aria-hidden="true">▶</span></button>
      <div class="site-infos"><div><b>Comment c'est choisi</b><small>Une espèce bien sue revient de moins en moins souvent : après 2 jours, puis 5, puis 12… Une erreur la fait revenir plus tôt, sans rien vous retirer.</small></div>
        <div><b>Pas de série à tenir</b><small>Sauter un jour ne fait rien perdre. La sortie attend simplement votre retour.</small></div></div></div>`;
  } else {
    blocSortie = `<div class="site-bloc ensuite"><b>☀ Ensuite : la sortie du jour</b><small>Une fois le tour terminé, revenez quand vous voulez : ${ESPECES_SORTIE} espèces à entretenir, choisies pour vous chaque jour.</small></div>`;
  }
  const jouer = gardien
    ? `<small><b>${bienSues(t)}</b> sur ${total} espèces bien sues</small>`
    : `<small>Halte ${Math.min((cours === null ? tour.haltes.length : cours + 1), tour.haltes.length)} sur ${tour.haltes.length}</small>
       ${cours !== null ? `<button class="couv-go" id="site-go" type="button">${tour.faites.some(Boolean) ? "Continuer le tour" : "Commencer le tour"} <span aria-hidden="true">▶</span></button>` : ""}`;
  zone.innerHTML = `<div class="lieu-page site-page">
    <div class="lieu-hero"><img src="${r.photo}" alt="${echapper(r.nom)}">
      <button class="lieu-sortir" id="lieu-sortir" type="button">← Sortir ${echapper(vers)}</button>
      <div class="lieu-hero-texte"><div class="couv-vous">Le site remarquable ${echapper(deT)}${gardien ? ` · Gardien ${echapper(deT)}` : ""}</div><h1>${echapper(r.nom)}</h1>
        <p class="lieu-hero-pays">${echapper(r.pays || "")}</p>
        <p class="lieu-hero-phrase">${gardien ? "Le tour du site est fait. Revenez quand vous voulez pour entretenir ce que vous savez."
          : `Vous avez parcouru les ${lieuxDe(t).length} lieux du territoire. Le site remarquable vous attend pour revoir ce que vous avez appris.`}</p></div>
      <div class="lieu-hero-jouer">${jouer}</div>
    </div>
    <div class="lieu-sombre">${blocIdentiteLieu(r)}${gardien ? blocSortie + blocTour : blocTour + blocSortie}</div></div>`;   // étape R104
  document.getElementById("lieu-sortir").onclick = () => montrer("accueil");
  const sortirM = document.getElementById("lieu-sortir-m"); if (sortirM) sortirM.onclick = () => { montrer("accueil"); window.scrollTo(0, 0); };   // étape M8
  const go = document.getElementById("site-go"); if (go) go.onclick = () => lancerSite(t, cours);
  const so = document.getElementById("site-sortie"); if (so) so.onclick = () => lancerSite(t, "sortie");
  const re = document.getElementById("site-refaire"); if (re) re.onclick = () => { creerTour(t); dessinerPageSite(); };
  zone.querySelectorAll("[data-halte]").forEach(b => b.onclick = () => lancerSite(t, Number(b.dataset.halte)));
}


// ==================================================================
// Étape 301 (26/10/2026) : la finale « Tout est lié » d'un lieu.
// Choix de l'utilisateur (canvas « Myriade – Finale « Tout est lié » », maquettes 4 + 6) :
//   - le cadre de « la planche » : une page de revue nature, grande photo à gauche, question à droite, aucun dessin ;
//   - un lien entre deux espèces → question « duo » : deux photos, « Quel est leur lien ? », 3 phrases (1 vraie, 2 fausses) ;
//   - un lien entre un animal et un élément du lieu → question « planche » : 3 réponses en photos d'éléments du lieu ;
//   - à la fin, la planche des liens du lieu, qu'on peut revoir depuis la page du lieu.
// Une erreur n'enlève rien : le lien est expliqué ; après le tour (6 à 10 liens selon le lieu), le joueur peut reprendre ceux qu'il a manqués
// (choix de l'utilisateur, étape 303 : le compteur reste sur 6). La finale ne s'échoue jamais.
// Données : LIENS et ELEMENTS (Données\expeditions.xlsx, onglets liens et elements → gen_expeditions.py).
// Gardé dans la sauvegarde : suivi.finales["<territoire>|<lieu>"] = true (la finale rapporte EMPREINTES_FINALE empreintes, une fois).
// Pour essayer sans rien enregistrer : dans la console (F12), essayerFinale("Sologne").
// ==================================================================
const LIENS_MIN_FINALE = 6;               // étape 304 : nombre variable selon le lieu (choix de l'utilisateur)
const LIENS_MAX_FINALE = 10;
const EMPREINTES_FINALE = 5;   // étape PR1 (2 avant)
const FINALE_TOUJOURS_OUVERTE = false;   // réglage de test : true = la finale s'ouvre sans finir les expéditions du lieu

function tousLesLiens() { return typeof LIENS !== "undefined" ? LIENS : []; }
function liensDuLieu(t, nom) {
  const l = tousLesLiens().filter(k => k.territoire === t && k.lieu === nom && especeParNom(k.a) && (k.nature_b === "element" || especeParNom(k.b)));
  return [...l.filter(k => k.nature_b !== "element"), ...l.filter(k => k.nature_b === "element")].slice(0, LIENS_MAX_FINALE);
}
function finaleDisponible(t, c) { return !!c && liensDuLieu(t, c.nom).length >= LIENS_MIN_FINALE; }
function finaleOuverte(t, c) { return finaleDisponible(t, c) && (FINALE_TOUJOURS_OUVERTE || toutDebloque() || chapitreFini(t, c)); }
function finaleFaite(t, nom) { return !!(suivi && suivi.finales && suivi.finales[t + "|" + nom]); }
function empreintesFinales(t) {
  if (!suivi || !suivi.finales) return 0;
  return Object.keys(suivi.finales).filter(k => suivi.finales[k] && k.startsWith(t + "|")).length * EMPREINTES_FINALE;
}
function photoElement(nom) { const el = (typeof ELEMENTS !== "undefined" && ELEMENTS[nom]) || {}; return el.photo || ""; }

let finale = null;
// Étape R149 : un lien trouvé reste trouvé si l'on quitte la finale ; en revenant, seuls les autres sont posés
function cleLien(k) { return k.a + "|" + k.b; }
function liensTrouvesFinale(t, nom) { return (suivi && suivi.finalesTrouves && suivi.finalesTrouves[t + "|" + nom]) || []; }
function lancerFinale(t, nom, essai = false) {
  const liens = melanger(liensDuLieu(t, nom));
  if (liens.length < LIENS_MIN_FINALE) return;
  const dejaTrouves = essai || finaleFaite(t, nom) ? [] : liensTrouvesFinale(t, nom);
  const file = liens.map((_, i) => i).filter(i => !dejaTrouves.includes(cleLien(liens[i])));
  finale = { t, nom, essai, liens, file: file.length ? file : liens.map((_, i) => i), pos: 0, rates: [], reprise: file.length > 0 && file.length < liens.length,
             bilan: false, choisi: null, fin: false, gagne: false, choix: null };
  preparerQuestionFinale();
  lieuAffiche = { t, nom, finale: true };
  montrer("lieu"); dessinerPageLieu(); window.scrollTo(0, 0);
}
function ouvrirPlanche(t, nom, depuis) {   // étape 331 : depuis = "encyclopedie" quand on l'ouvre de l'encyclopédie
  finale = { t, nom, essai: false, liens: liensDuLieu(t, nom), fin: true, gagne: false, revoir: true, depuis: depuis || "" };
  lieuAffiche = { t, nom, finale: true };
  montrer("lieu"); dessinerPageLieu(); window.scrollTo(0, 0);
}
function essayerFinale(nom) {                // commande de test (console) : rien n'est enregistré
  const c = CHAPITRES.find(k => k.nom === nom || simplifier(k.nom) === simplifier(nom));
  if (!c) return `Lieu introuvable : « ${nom} ».`;
  if (!finaleDisponible(c.territoire, c)) return `La finale de « ${c.nom} » n'a pas encore ses ${LIENS_MIN_FINALE} liens complets.`;
  lancerFinale(c.territoire, c.nom, true);
  return `Finale de « ${c.nom} » en essai (rien n'est enregistré).`;
}
function lienCourant() { return finale.liens[finale.file[finale.pos]]; }
function preparerQuestionFinale() {
  const k = lienCourant();
  const bonne = k.nature_b === "element" ? k.b : k.phrase;
  finale.choix = melanger([bonne, ...k.pieges]).map(v => ({ v, bon: v === bonne }));
  finale.choisi = null;
}
function repondreFinale(i) {
  if (!finale || finale.choisi !== null) return;
  finale.choisi = i;
  const n = finale.file[finale.pos];
  if (!finale.choix[i].bon) finale.rates.push(n);   // étape 303 : proposé en reprise à la fin du tour
  else if (!finale.essai && suivi && !finaleFaite(finale.t, finale.nom)) {   // étape R149 : gardé, même si l'on sort
    const cle = finale.t + "|" + finale.nom, k = cleLien(finale.liens[n]);
    suivi.finalesTrouves = suivi.finalesTrouves || {};
    const l = suivi.finalesTrouves[cle] = suivi.finalesTrouves[cle] || [];
    if (!l.includes(k)) { l.push(k); sauvegarder(); }
  }
  if (typeof jouerSon === "function") { try { jouerSon(finale.choix[i].bon ? "bonne" : "mauvaise"); } catch (e) {} }
  dessinerFinale();
}
function suiteFinale() {
  finale.pos++;
  if (finale.pos < finale.file.length) { preparerQuestionFinale(); dessinerFinale(); window.scrollTo(0, 0); return; }
  if (finale.rates.length) { finale.bilan = true; dessinerFinale(); window.scrollTo(0, 0); return; }   // étape 303 : proposer la reprise
  terminerFinale();
}
function reprendreErreurs() {                // étape 303 : un tour avec seulement les liens manqués
  finale.file = finale.rates; finale.rates = []; finale.pos = 0; finale.reprise = true; finale.bilan = false;
  preparerQuestionFinale(); dessinerFinale(); window.scrollTo(0, 0);
}
function terminerFinale() {
  finale.bilan = false; finale.fin = true;
  const { t, nom } = finale;
  if (!finale.essai && suivi && !finaleFaite(t, nom)) {
    suivi.finales = suivi.finales || {};
    suivi.finales[t + "|" + nom] = true;
    if (suivi.finalesTrouves) delete suivi.finalesTrouves[t + "|" + nom];   // étape R149
    finale.gagne = true;
    sauvegarder();
    if (typeof afficherStats === "function") afficherStats();               // étape R149 : le compteur du haut tout de suite
    if (typeof lieuSelTerr !== "undefined") lieuSelTerr = null;              // étape R149 : la page du territoire montre le lieu suivant
    setTimeout(() => { if (typeof verifierOuverture === "function") verifierOuverture(); }, 2500);   // étape PR4 : un lieu terminé peut ouvrir un territoire
    feter({ etiquette: "La finale du lieu", titre: `+${EMPREINTES_FINALE} empreintes`, son: "badge",
            detail: `Vous avez découvert les ${finale.liens.length} liens ${echapper(deLieu(nom))}. Leur planche reste sur la page du lieu.`,
            visuel: `<div class="fete-visuel rang exp-fete">${PAS_SVG}</div>` });
  }
  dessinerFinale(); window.scrollTo(0, 0);
}
function figureEspece(e, classe = "") {
  return `<figure class="finale-fig ${classe}"><span class="finale-img${estRenseigne(e.photo) ? "" : " silh"}"><img src="${photoEsp(e)}" alt="${echapper(e.nom_courant)}"></span>
    <figcaption>${echapper(e.nom_courant)}${estRenseigne(e.photo) ? "" : "<small>photo à venir</small>"}</figcaption></figure>`;
}
function tuileElement(nom) {
  const p = photoElement(nom);
  return p ? `<span class="finale-img"><img src="${p}" alt="${echapper(nom)}"></span>` : `<span class="finale-img vide"><small>photo à venir</small></span>`;
}
function dessinerFinale() {
  const zone = document.getElementById("vue-lieu");
  if (!zone || !finale) return;
  if (finale.fin) { dessinerPlancheFinale(zone); return; }
  if (finale.bilan) { dessinerBilanFinale(zone); return; }
  const { t, nom } = finale, k = lienCourant(), a = especeParNom(k.a), b = k.nature_b === "element" ? null : especeParNom(k.b);
  const n = finale.pos + 1, total = finale.file.length, rep = finale.choisi !== null;
  const photos = b ? figureEspece(a, "moitie") + figureEspece(b, "moitie") : figureEspece(a, "pleine");
  const reponses = b
    ? `<div class="finale-phrases">${finale.choix.map((c, i) => `<button class="finale-phrase${rep ? (c.bon ? " bon" : i === finale.choisi ? " faux" : " eteint") : ""}" data-i="${i}" type="button"${rep ? " disabled" : ""}>${echapper(c.v)}</button>`).join("")}</div>`
    : `<div class="finale-elements">${finale.choix.map((c, i) => `<button class="finale-element${rep ? (c.bon ? " bon" : i === finale.choisi ? " faux" : " eteint") : ""}" data-i="${i}" type="button"${rep ? " disabled" : ""}>${tuileElement(c.v)}<b>${echapper(c.v)}</b></button>`).join("")}</div>`;
  const bon = rep && finale.choix[finale.choisi].bon;
  const retour = rep ? `<div class="finale-retour ${bon ? "bon" : "faux"}">
      <small>${bon ? "C'est bien leur lien" : "Pas tout à fait : voici leur lien"} · ${echapper(k.role)}</small>
      <p>${echapper(k.phrase)}</p>
      <button class="couv-go" id="finale-suite" type="button">${finale.pos + 1 < finale.file.length ? "Lien suivant" : (finale.rates.length ? "Terminer" : "Voir la planche du lieu")} <span aria-hidden="true">▶</span></button>
      ${bon ? "" : `<small class="finale-revient">Vous pourrez reprendre ce lien à la fin.</small>`}</div>` : "";
  zone.innerHTML = `<div class="finale-page"><div class="finale-planche">
    <div class="finale-photos${b ? " duo" : ""}">${photos}</div>
    <div class="finale-corps">
      <div class="finale-haut"><button class="finale-sortir" id="finale-sortir" type="button">← ${echapper(nom)}</button>
        <small><span class="fh-long">La finale du lieu</span><span class="fh-court">La finale</span>${finale.essai ? " · essai" : ""}${finale.reprise ? " · reprise" : ""} · <b>${Math.min(n, total)} / ${total}</b></small></div>
      <div class="finale-barre"><span style="width:${Math.round(100 * (finale.pos + (rep ? 1 : 0)) / total)}%"></span></div>
      <h1>${echapper(b ? k.question : k.question)}</h1>
      ${reponses}${retour}
    </div></div></div>`;
  document.getElementById("finale-sortir").onclick = () => { const e = finale.essai; finale = null; if (e && !chapitreOuvert(t, chapitreParNom(t, nom))) montrer("accueil"); else ouvrirLieu(t, nom); };
  zone.querySelectorAll("[data-i]").forEach(bt => bt.onclick = () => repondreFinale(Number(bt.dataset.i)));
  const s = document.getElementById("finale-suite"); if (s) { s.onclick = suiteFinale; s.focus(); }
}
function dessinerPlancheFinale(zone) {
  const { t, nom } = finale;
  const cases = finale.liens.map(k => {
    const a = especeParNom(k.a), b = k.nature_b === "element" ? null : especeParNom(k.b);
    const droite = b ? `<span class="finale-img${estRenseigne(b.photo) ? "" : " silh"}"><img src="${photoMini(photoEsp(b))}" alt="${echapper(b.nom_courant)}" onerror="this.src='${photoEsp(b)}'"></span>` : tuileElement(k.b);
    return `<figure class="planche-case"><div class="planche-photos"><span class="finale-img${estRenseigne(a.photo) ? "" : " silh"}"><img src="${photoMini(photoEsp(a))}" alt="${echapper(a.nom_courant)}" onerror="this.src='${photoEsp(a)}'"></span>${droite}</div>
      <figcaption><small>${echapper(k.role)}</small><span class="planche-noms">${echapper(k.a)} · ${echapper(k.b)}</span>${echapper(k.phrase)}</figcaption></figure>`;
  }).join("");
  const pied = finale.revoir ? "La planche de ce lieu" : finale.essai ? "Essai : rien n'a été enregistré" : finale.gagne ? `${EMPREINTES_FINALE} empreintes gagnées` : "Déjà gagnée : pas de nouvelle empreinte";
  zone.innerHTML = `<div class="finale-page"><div class="finale-planche planche-fin">
    <div class="planche-tete"><div><small class="finale-kicker">La finale du lieu</small><h1>${echapper(nom)}, ${({ 6: "six", 7: "sept", 8: "huit", 9: "neuf", 10: "dix" })[finale.liens.length] || finale.liens.length} liens</h1></div>
      <small>${pied}</small></div>
    <div class="planche-grille">${cases}</div>
    <div class="planche-boutons"><button class="couv-go" id="planche-retour" type="button">${finale.depuis === "encyclopedie" ? "Retour à l'encyclopédie" : "Retour au lieu"}</button>
      <button class="duo-autres" id="planche-rejouer" type="button">Rejouer la finale</button></div>
  </div></div>`;
  document.getElementById("planche-retour").onclick = () => {
    const e = finale.essai, d = finale.depuis; finale = null;
    if (d === "encyclopedie") { montrer("encyclopedie"); afficherEncyclopedie(); window.scrollTo(0, 0); return; }   // étape 331
    if (e && !chapitreOuvert(t, chapitreParNom(t, nom))) montrer("accueil"); else ouvrirLieu(t, nom); };
  document.getElementById("planche-rejouer").onclick = () => lancerFinale(t, nom, finale.essai);
}

// Étape 303 : le bilan du tour, quand des liens ont été manqués — reprendre ces liens, ou voir la planche (sans rien perdre)
function dessinerBilanFinale(zone) {
  const { t, nom } = finale, nb = finale.rates.length, trouves = finale.file.length - nb;
  const manques = finale.rates.map(i => finale.liens[i]).map(k => `<li>${echapper(k.a)} · ${echapper(k.b)}</li>`).join("");
  zone.innerHTML = `<div class="finale-page"><div class="finale-planche planche-fin finale-bilan">
    <div class="planche-tete"><div><small class="finale-kicker">La finale du lieu${finale.essai ? " · essai" : ""}</small>
      <h1>${finale.reprise ? `Reprise : ${trouves} sur ${finale.file.length}` : `${trouves} lien${trouves > 1 ? "s" : ""} sur ${finale.file.length}`}</h1></div></div>
    <p>${nb > 1 ? `${nb} liens vous ont échappé` : "Un lien vous a échappé"}. Vous pouvez ${nb > 1 ? "les" : "le"} reprendre maintenant, ou passer à la planche du lieu : vous ne perdez rien.</p>
    <ul class="bilan-liste">${manques}</ul>
    <div class="planche-boutons"><button class="couv-go" id="bilan-reprendre" type="button">Reprendre ${nb > 1 ? `les ${nb} liens` : "ce lien"} <span aria-hidden="true">▶</span></button>
      <button class="duo-autres" id="bilan-planche" type="button">Voir la planche du lieu</button></div>
  </div></div>`;
  document.getElementById("bilan-reprendre").onclick = reprendreErreurs;
  document.getElementById("bilan-planche").onclick = () => { terminerFinale(); };
}

// Étape M3 (06/11) : sur un écran tactile (pas de survol), toucher une espèce de la bande affiche ce que dit son survol
document.addEventListener("click", ev => {
  const rond = ev.target && ev.target.closest ? ev.target.closest("#bande-expedition .be-rond[title]") : null;
  if (rond && rond.title && window.matchMedia && window.matchMedia("(hover: none)").matches) afficherBulle(rond.title);
});


// Étape M8 (07/11/2026, maquette B « Trois visages ») : sur téléphone, l'en-tête de l'expédition est une page de carnet
// (pas de photo de paysage, réservée au lieu) : la pastille du lieu pour revenir, le symbole des jumelles, le titre
// et les ronds de ses espèces (photo seulement, comme dans le cadre des espèces : le nom reste caché tant qu'elle n'est pas découverte).
function carnetExpedition(x, lieu) {
  const ic = k => typeof iconeNiveau === "function" ? iconeNiveau(k) : "";
  const retour = typeof pastilleNiveau === "function"
    ? (estLieu(lieu) ? pastilleNiveau("lieu", lieu.nom, "exp-retour-m") : pastilleNiveau("territoire", x.territoire, "exp-retour-m", (TERRITOIRES[x.territoire] || {}).couleur)) : "";
  const ronds = x.liste.map(e => `<span class="rep-rond${estRenseigne(e.photo) ? "" : " silh"}${especeFaite(e, 1) ? " fait" : ""}"><img src="${photoMini(photoEsp(e))}" alt="${estIdentifiee(e) ? echapper(e.nom_courant) : "À découvrir"}" loading="lazy" onerror="this.onerror=null;this.src='${photoEsp(e)}'"></span>`).join("");
  return `<div class="rep-carnet">${retour}
      <div class="rep-etiq">${ic("expedition")}Expédition</div>
      <h1>${echapper(x.titre)}</h1>
      <div class="rep-ronds">${ronds}</div>
      <div class="rep-carnet-bas"><small>${x.liste.length} espèces à rencontrer</small>${dessinGain(x)}</div></div>`;
}


// ==================================================================
// Étape M15 (07/11/2026, choix d'Aubin : maquette A « Le bilan d'abord », artefact
// « Myriade · Après la réponse et fin de partie sur téléphone ») — sur téléphone, la fin d'une étape
// d'expédition tient sur un écran : le résultat, les espèces, les empreintes, puis UN bouton pour la suite
// et « Revoir les N questions manquées ». Tout le reste (carnet, familles, défis, médaille du lieu) se replie
// dans « Voir le détail ». Sur ordinateur, rien ne change.
// Étape M16 (07/11/2026, demande d'Aubin) : le même résumé à la fin d'une Rencontre (dont chaque espèce de
// l'étape 1) et à la fin des petits jeux et du site remarquable (construireResume, commun aux trois).
// ==================================================================
let dernierResumeFin = null, dernierResumeSession = null, dernierResumeJeu = null;
function surPetitEcran() { return !!(window.matchMedia && window.matchMedia("(max-width: 760px)").matches); }
function retirerResumeFin(id = "fin-defi") {
  const fin = document.getElementById(id);
  if (!fin) return;
  fin.querySelectorAll(":scope > .resume-fin-tel").forEach(z => z.remove());
  fin.classList.remove("fin-courte", "detail-ouvert");
  if (id === "fin-defi") { dernierResumeFin = null; dernierResumeJeu = null; } else dernierResumeSession = null;
}
function nbManqueesAffichees(carnetId) {   // les questions à revoir, d'après la liste « À revoir » du carnet
  const spans = [...document.querySelectorAll(`#${carnetId} .liste-a-revoir span`)];
  return spans.reduce((n, sp) => { const m = sp.textContent.match(/^… et (\d+)/); return n + (m ? Number(m[1]) : 1); }, 0);
}
// Les ronds des espèces d'une expédition (✓ = fait à l'étape k ; jamais le nom d'une espèce pas encore trouvée)
function rondsResume(x, k, arrive) {   // étape RF2 : arrive = l'espèce qui vient d'être rencontrée (sa photo rejoint la bande)
  return `<div class="rft-ronds">${x.liste.map(e => {
    const fait = faiteDans(x, e, k), connu = estIdentifiee(e);
    return `<span class="rft-rond${fait ? " fait" : ""}${e === arrive && fait ? " arrive" : ""}"><img src="${photoMini(photoEsp(e))}" alt="${connu ? echapper(e.nom_courant) : ""}" onerror="this.onerror=null;this.src='${photoEsp(e)}'">${fait ? `<i aria-hidden="true">✓</i>` : ""}</span>`;
  }).join("")}</div>`;
}
function empreintesResume(x, gagnees) {
  const c = x && x.chapitre && chapitreParNom(x.territoire, x.chapitre);
  const lieuTxt = c && estLieu(c) && !toutDebloque() ? `${echapper(c.nom)} : <span class="rft-insec">${Math.min(empreintesDuLieu(x.territoire, c), empreintesMaxLieu(x.territoire, c))} sur ${empreintesMaxLieu(x.territoire, c)}</span>` : "";
  return gagnees || lieuTxt ? `<div class="rft-emp">${PAS_SVG}<span>${gagnees ? `<b>+${gagnees} empreinte${gagnees > 1 ? "s" : ""}</b>` : ""}${gagnees && lieuTxt ? " · " : ""}${lieuTxt}</span></div>` : "";
}
// Le résumé commun. o = { fin, carnet, etiq, titre, tete (photo + nom, facultatif), score, corps, principal (id du bouton
// de la suite), aide, retour: { texte, action } }
function construireResume(o) {
  const fin = document.getElementById(o.fin);
  if (!fin) return;
  fin.querySelectorAll(":scope > .resume-fin-tel").forEach(z => z.remove());
  if (!surPetitEcran()) { fin.classList.remove("fin-courte", "detail-ouvert"); return; }
  // Étape M18b : on mesure le bouton de la suite AVANT de replier l'écran. Sinon, à la 2e fin de suite (écran déjà replié
  // par le résumé précédent), le bouton paraissait caché et le résumé n'avait plus de bouton « Espèce suivante ».
  fin.classList.remove("fin-courte", "detail-ouvert");
  const principal = document.getElementById(o.principal);
  const avecPrincipal = principal && principal.getClientRects().length && !principal.closest(".cache");
  const nManquees = document.querySelector(`#${o.carnet} #reprendre-manquees`) ? nbManqueesAffichees(o.carnet) : 0;
  const z = document.createElement("div");
  z.className = "resume-fin-tel";
  if (o.fin === "fin-defi") z.id = "resume-fin-tel";
  z.innerHTML = `<div class="rft-carte">
      <div class="rft-etiq">${echapper(o.etiq || "")}</div>
      ${o.tete || ""}
      ${o.titre ? `<h2 class="rft-titre">${o.titre}</h2>` : ""}
      ${o.score ? `<div class="rft-score">${o.score}</div>` : ""}
      ${o.corps || ""}
    </div>
    <div class="rft-actions">
      ${avecPrincipal ? `<button type="button" class="rft-principal">${echapper(principal.textContent)}</button>` : ""}
      ${o.aide ? `<div class="rft-aide">${o.aide}</div>` : ""}
      ${nManquees ? `<button type="button" class="rft-second">Revoir ${nManquees > 1 ? `les ${nManquees} questions manquées` : "la question manquée"}</button>` : ""}
      <div class="rft-liens">${o.retour ? `<button type="button" class="rft-lien rft-retour">${echapper(o.retour.texte)}</button>` : "<span></span>"}
        <button type="button" class="rft-lien rft-detail" aria-expanded="false">Voir le détail ▾</button></div>
    </div>`;
  fin.prepend(z);
  fin.classList.add("fin-courte");
  fin.classList.remove("detail-ouvert");
  const p = z.querySelector(".rft-principal");
  if (p) p.onclick = () => { const b = document.getElementById(o.principal); if (b) b.click(); };
  const m = z.querySelector(".rft-second");
  if (m) m.onclick = () => { const b = document.querySelector(`#${o.carnet} #reprendre-manquees`); if (b) b.click(); };
  const r = z.querySelector(".rft-retour");
  if (r) r.onclick = o.retour.action;
  z.querySelector(".rft-detail").onclick = ev => {
    const ouvert = fin.classList.toggle("detail-ouvert");
    ev.currentTarget.textContent = ouvert ? "Replier le détail ▴" : "Voir le détail ▾";
    ev.currentTarget.setAttribute("aria-expanded", ouvert ? "true" : "false");
    // Étape R188 (11/11, note n° 17 d'Aubin) : le détail s'ouvre plus bas, hors de l'écran ; la page y descend toute seule
    if (ouvert) requestAnimationFrame(() => {
      let cible = z.nextElementSibling;
      while (cible && !(cible.getClientRects().length && cible.offsetHeight > 0)) cible = cible.nextElementSibling;
      if (!cible) return;
      const haut = cible.getBoundingClientRect().top + window.scrollY - 12;
      const doux = !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
      window.scrollTo({ top: Math.max(0, haut), behavior: doux ? "smooth" : "auto" });
    });
  };
  window.scrollTo(0, 0);
}
// 1) La fin d'une étape d'expédition (M15)
function resumeFinTelephone(ctx) {
  dernierResumeFin = ctx;
  if (!ctx || !ctx.x) { retirerResumeFin("fin-defi"); return; }
  const { x, d, k, gagnees, avantEmp, apres } = ctx;
  const finie = etapeFinie(x, k), av = avanceeEtape(x, Math.min(k, NB_ETAPES));
  const titre = apres >= NB_ETAPES && avantEmp < NB_ETAPES ? "Expédition terminée"
    : finie ? `Étape ${k} réussie`
    : d.expedition && d.expedition.rattrapage ? (nbTraitsARevoir(x) ? "À revoir" : "Tout est rattrapé")
    : k === 4 ? "Approfondir" : `Étape ${k} · ${ETAPES[k].titre}`;
  const phrase = k === 4 ? texteResteApprofondir(x)
    : finie && k === 2 ? `Vous savez comment vivent ces ${av.total} espèces.`
    : finie && k === 1 ? `Vous avez fait connaissance avec les ${av.total} espèces.`
    : `${av.faites} espèce${av.faites > 1 ? "s" : ""} sur ${av.total} : c'est fait.`;
  const principal = document.getElementById("bouton-rejouer-defi");
  const c = x.chapitre && chapitreParNom(x.territoire, x.chapitre), dansUnLieu = c && estLieu(c);
  construireResume({ fin: "fin-defi", carnet: "carnet-fin-defi", etiq: x.titre, titre,   // étape R189 (note n° 9) : « Étape 2 » n'est plus écrit dans le bandeau
   
    score: d.faites ? `<b>${d.bonnes}</b> bonne${d.bonnes > 1 ? "s" : ""} réponse${d.bonnes > 1 ? "s" : ""} sur ${d.faites}` : "",
    corps: `${rondsResume(x, k)}<div class="rft-phrase">${phrase}</div>${empreintesResume(x, apres >= NB_ETAPES && avantEmp < NB_ETAPES ? 0 : gagnees)}`,   // R153 : la fête a dit « +N »
    principal: "bouton-rejouer-defi",
    aide: principal && /Approfondir/.test(principal.textContent) ? `Facultatif · ${minuscule(texteResteApprofondir(x))}`
      : k === 2 && !finie && principal && /Continuer/.test(principal.textContent) ? texteResteEtape2(x) : "",   // étape M17 ; R149
    retour: { texte: `← ${dansUnLieu ? "Retour au lieu" : "Retour au territoire"}`,
      action: () => { if (dansUnLieu) { ouvrirLieu(x.territoire, c.nom); window.scrollTo(0, 0); } else document.getElementById("bouton-territoire-defi").click(); } } });
}
// 2) La fin d'une Rencontre (M16) : l'espèce, ce qui est fait, son fait insolite, et la suite
function resumeSessionTelephone(s) {
  dernierResumeSession = s;
  if (!s) { retirerResumeFin("fin-session"); return; }
  const e = s.focus, x = s.expedition && expeditionParId(s.expedition.id);
  const connu = e && (estIdentifiee(e) || !!x);   // étape R149 : dans une expédition, la Rencontre a déjà montré son nom

  let titre = connu ? echapper(e.nom_courant) : "Cette espèce", corps = "", retour, etat = "";
  if (x) {
    const faite = especeFaite(e, 1), manques = faite ? 0 : manquesEtape1(e).length, av = avanceeEtape(x, 1);
    const gagnees = Math.max(0, gainExp(x) - (s.expedition.avantGain || 0));
    etat = RENCONTRE_COMPLETE && etapeFinie(x, 2) ? "Expédition terminée !" : etapeFinie(x, 1) ? "Étape 1 réussie !" : faite ? "Fait !" : `${manques} chose${manques > 1 ? "s" : ""} à revoir`;   // RF1
    corps = (!faite && !etapeFinie(x, 1) ? `<div class="rft-phrase">${manques > 1 ? "Elles reviendront" : "Elle reviendra"} à la fin de l'étape.</div>` : "")
      + rondsResume(x, 1, RENCONTRE_COMPLETE ? e : null) + empreintesResume(x, gagnees);
    retour = { texte: "← Expédition", action: () => { session = null; ouvrirExpedition(x); } };
    var quiEnsuiteTel = RENCONTRE_COMPLETE && faite && !etapeFinie(x, 1) ? blocQuiEnsuite(x) : "";   // étape RF1
  } else if (s.duJour) {
    corps = `<div class="rft-phrase">${PHRASE_FIN_DU_JOUR}</div>`;   // étape R187 : le bouton principal ramène déjà à l'accueil
  } else {
    retour = { texte: "← Accueil", action: () => document.getElementById("bouton-fin-accueil").click() };
  }
  const fait = document.querySelector("#fiche-session .fait-insolite");
  if (fait) corps += `<div class="rft-fait">${fait.innerHTML}</div>`;
  // En tête, sur une ligne : la photo de l'espèce, son nom, ce qui est fait et le score
  const score = document.getElementById("score-session");
  let tete = `<div class="rft-espece">${e ? `<img src="${photoMini(photoEsp(e))}" alt="" onerror="this.onerror=null;this.src='${photoEsp(e)}'">` : ""}
      <div><h2 class="rft-titre">${titre}</h2>${etat ? `<b class="rft-etat">${etat}</b>` : ""}${score && score.textContent.trim() ? `<div class="rft-score">${score.innerHTML}</div>` : ""}</div></div>`;
  // Étape RF2 (maquette 7B, choix d'Aubin) : fin d'une Rencontre d'expédition — sa grande photo, son nom, ce qui est acquis ;
  //   dessous, la bande des espèces où sa photo vient de prendre sa place (sobre : un léger mouvement, pas de fête)
  if (x && e && RENCONTRE_COMPLETE && estRenseigne(e.photo)) {
    const acquis = especeFaite(e, 1) ? (especeFaite(e, 2) ? "Croisée · Comprise" : "Croisée") : etat;
    tete = `<div class="rft-grande"><img src="${e.photo}" alt="${echapper(e.nom_courant)}"><div class="rft-grande-bas">
        <h2 class="rft-titre">${titre}</h2><span class="rft-acquis">${echapper(acquis)}</span></div></div>
        ${score && score.textContent.trim() ? `<div class="rft-score">${score.innerHTML}</div>` : ""}`;
  }
  construireResume({ fin: "fin-session", carnet: "carnet-fin-session",
    etiq: x ? `${x.titre} · ${RENCONTRE_COMPLETE ? "rencontre" : "faire connaissance"}` : "Rencontre terminée", tete, titre: "", corps, principal: "bouton-rejouer", retour });
  if (x && quiEnsuiteTel) {                            // étape RF1 : « Qui rencontrer ensuite ? », sous le bouton de la suite
    const z = document.querySelector("#fin-session > .resume-fin-tel .rft-actions");
    if (z) { z.insertAdjacentHTML("afterbegin", quiEnsuiteTel); brancherQuiEnsuite(x, z);
             const p = z.querySelector(".rft-principal"); if (p) p.remove(); }   // le choix remplace « Espèce suivante »
  }
}
// 3) La fin d'un petit jeu ou d'une halte du site remarquable (M16)
function resumeJeuTelephone(d) {
  if (!d || d.expedition || d.reprise) return;
  dernierResumeJeu = d;
  const texte = document.querySelector("#passerelle-fin-defi:not(.cache) .exp-fin-texte");
  const b = texte && texte.querySelector("b");
  const score = document.querySelector("#carnet-fin-defi .score-fin3");
  const reste = texte ? texte.innerHTML.replace(b ? b.outerHTML : "", "").trim() : "";
  const retourBouton = document.getElementById("bouton-territoire-defi");
  construireResume({ fin: "fin-defi", carnet: "carnet-fin-defi", etiq: document.getElementById("nom-fin-defi").textContent,
    titre: b ? b.textContent.replace(/[.!]+$/, "") : "Partie terminée", score: score ? score.innerHTML : "",
    corps: reste ? `<div class="rft-phrase">${reste}</div>` : "", principal: "bouton-rejouer-defi",
    retour: { texte: `← ${retourBouton.textContent}`, action: () => retourBouton.click() } });
}
