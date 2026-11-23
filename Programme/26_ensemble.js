// ==================================================================
// E2 · L'ÉTAPE 2 « ENSEMBLE, DANS CE LIEU » (14/11, cahier des charges : Claude\Reference\reprise_etape2_ensemble.md)
//   Critère A : l'étape 2 apprend comment les espèces de l'expédition vivent ensemble ici. Chaque question met en jeu
//   au moins deux espèces, ou une espèce et le lieu ; 6 questions au plus, dans l'ordre des 8 types ci-dessous ;
//   jamais de remplissage. Elle remplace « Leurs liens », la planche et « ce qui reste de leur vie ».
//   Ce fichier FABRIQUE les questions (questionsEnsemble, E2-2) et les AFFICHE (étape E2-3, 15/11 : ouvrirEnsembleExp).
//   Réglage : ETAPE2_ENSEMBLE = false → l'ancienne étape 2 (Leurs liens + la planche), pour comparer.
//   Il marche avec les colonnes actuelles ; les colonnes nouvelles (hiver, venue_de, cause_declin) sont lues
//   quand elles sont remplies (étape E2-1).
// ==================================================================
const ETAPE2_ENSEMBLE = true;          // étape E2-2 (false = l'ancienne étape 2)
// Étape R298 (22/11, Notion 48.20, « Leurs liens » plus riche ; critère d'Aubin : « Chaque expédition a une étape Leurs liens
//   de 5 questions dès que ce lieu en offre autant, et jamais moins de 3. Chacune apprend une chose vraie sur la vie de ces
//   espèces dans ce lieu, aucune ne se devine sans rien savoir, et aucune n'est là pour faire nombre. ») :
//   6 questions visées, 8 au plus, étape seulement à partir de 3 (1 ou 2 : posées à la fin des Rencontres) ; pièges selon le
//   rôle du lien ; 3 liens entre elles ; « les plus fragiles » dans chaque expédition ; nouveau type « Les voisins » ;
//   « Sa place » jusqu'à 2, avec l'élément en photo quand c'est sûr ; questions comparées (derrière COMPAREES_EN_LIGNE).
//   ENSEMBLE_R298 = false → l'étape d'avant (R297 : 6 au plus, étape dès 2 questions, 2 liens, fragiles une fois par lieu).
const ENSEMBLE_R298 = true;
let R298 = ENSEMBLE_R298;              // (mis à false un instant pour compter les questions d'avant : etape2AvantR298)
// Les questions comparées (« Lesquelles de ces espèces mangent des graines ou des fruits ? », « … comptent d'abord sur le
//   camouflage ? ») passent en ligne seulement après la relecture des données (Notion 48.21). test_jeu.py les essaie à true.
let COMPAREES_EN_LIGNE = true;
const ENSEMBLE_VISE = 6;               // R298 : 6 questions visées (on retire d'abord les doublons d'un même type)…
const ENSEMBLE_MAX = ENSEMBLE_R298 ? 8 : 6;   // … 8 au plus (R297 : 6 au plus)
const ENSEMBLE_MIN_ETAPE = ENSEMBLE_R298 ? 3 : 2;   // une étape à partir de 3 questions (R297 : 2)
const LIENS_ENSEMBLE_MAX = ENSEMBLE_R298 ? 3 : 2;   // type 1 : 3 questions au plus (R297 : 2), sur des paires différentes
const VOISINS_MAX = 3, PLACE_MAX = 2, COMPAREES_MAX = 2;
const PERIODE_HIVER = "De novembre à février";
// Si une expédition offre plus de 6 questions, on retire d'abord celles-ci (dans cet ordre) ; « Et si… ? » reste toujours, en dernier.
const ENSEMBLE_RETIRER_D_ABORD = ["liens2", "jour_nuit", "calendrier", "place", "chasseur", "liens1"];   // (R297)
// R298 : au-dessus de 6, on retire d'abord les doublons d'un même type (la 3e, puis la 2e question d'un type) ;
//   au-dessus de 8, des types entiers, dans cet ordre. « Et si… ? » reste toujours, en dernier.
const ENSEMBLE_RETIRER_AU_DELA_DE_6 = ["liens3", "voisins3", "comparee2", "place2", "voisins2", "liens2"];
const ENSEMBLE_RETIRER_AU_DELA_DE_8 = ["jour_nuit", "calendrier", "comparee1", "place1", "chasseur", "nouveaux", "voisins1", "liens1"];

// ---- Outils communs ----
const NOMBRES_MOTS = ["zéro", "une", "deux", "trois", "quatre", "cinq", "six", "sept"];
function feminin(e) { return e && e.genre_nom === "féminin"; }
function accordE(e, mot) { return feminin(e) ? mot + "e" : mot; }               // « venu » / « venue »
function leNom(e) { return nomAvecArticle(e); }                                  // « la scutigère véloce »
function LeNom(e) { return majuscule(nomAvecArticle(e)); }
function deNom(e) { return typeof deLEspece === "function" ? deLEspece(e) : "de " + leNom(e); }
function listeEt(t) { return t.length <= 1 ? (t[0] || "") : t.slice(0, -1).join(", ") + " et " + t[t.length - 1]; }
function confirme(e, col) { return !(e.a_confirmer || []).includes(col) && estRenseigne(e[col]) && String(e[col]).trim() !== ""; }
// R299 : renommée (avant : dansTerritoire, un nom déjà pris par 12 et 25, chargés après ; c'est leur version qui servait :
//   un texte « dans le Jura », toujours vrai. « Le même chasseur » prenait donc ses pièges dans toute la France : fulmar boréal
//   et goéland marin pour les petits mammifères du sous-bois du Jura)
function especeDuTerritoire(e, t) { return String(e.territoire || "").split(";").map(s => s.trim()).includes(t); }
function itemsDe(e, col) { return confirme(e, col + "_items") ? itemsListe(e, col) : []; }
function choixEspece(e, bonne) { return { texte: e.nom_courant, espece: e.nom_courant, bonne: !!bonne }; }

// ---- Un nom de fiche désigne-t-il une espèce précise, ou un groupe vague ? ----
// « Renard » → Renard roux ; « Chats » → le chat domestique (pas dans le jeu) ; « Rapaces », « Corneilles » → groupe vague.
const CHAT = { nom_courant: "Chat domestique", hors_jeu: true, classe: "Mammifère", genre_nom: "masculin" };
const memoNommes = new Map();
function especeNommee(item) {
  const k = (R298 ? "1|" : "0|") + item;
  if (memoNommes.has(k)) return memoNommes.get(k);
  const i = sansAccent(item);
  let r = null;
  if (i === "chat" || i === "chat domestique") r = CHAT;
  else { const m = especesDuNom(item, ESPECES); if (m.length === 1) r = m[0]; }
  // R298 : un pluriel (« Punaises », « Faucons ») est un groupe, pas le nom d'une espèce, même s'il n'y en a qu'une dans le jeu
  //   (avant : « Punaises » chez la coccinelle désignait la punaise arlequin, qui ne mange que de la sève et des graines)
  if (R298 && r && r !== CHAT && estPluriel(item) && normal(item) !== normal(r.nom_courant)) r = null;
  memoNommes.set(k, r);
  return r;
}
// Sans accents ni majuscules, mais avec les « s » (sansAccent, 20, les retire)
function normal(t) { return String(t || "").toLowerCase().replace(/œ/g, "oe").normalize("NFD").replace(/[̀-ͯ]/g, "").trim(); }
const memoPremiersMots = { s: null };
function estPluriel(item) {
  const m = normal(item).replace(/^autres?\s+/, "").split(/[\s,']+/)[0] || "";
  if (!memoPremiersMots.s) memoPremiersMots.s = new Set(ESPECES.map(e => normal(e.nom_courant).split(/[\s']+/)[0]));
  return /[sx]$/.test(m) && m.length > 3 && !memoPremiersMots.s.has(m);   // « souris » : un nom d'espèce, pas un pluriel
}
// Un groupe vague (« Rapaces », « Araignées », « Belettes et martres ») peut-il comprendre cette espèce ?
// Un groupe qui ne nomme ni une famille d'animaux connue ni un mot du nom de l'espèce (« Graines », « Fruits et baies ») ne la comprend pas.
const GROUPES_LARGES = [
  [/oiseau|passereau|oisillon/, e => e.classe === "Oiseau"],
  [/rapace|oiseaux de proie/, e => /Accipitri|Falconi|Strigi/.test(e.ordre || "")],
  [/hibou|chouette|rapaces nocturne/, e => /Strigi/.test(e.ordre || "")],
  [/mammifere|carnivore|predateur|rongeur|mustelide/, e => e.classe === "Mammifère"],
  [/poisson/, e => e.classe === "Poisson"],
  [/serpent|couleuvre|reptile|lezard/, e => e.classe === "Reptile"],
  [/amphibien|grenouille|crapaud|triton/, e => e.classe === "Amphibien"],
  [/insecte|guepe|mouche|coleoptere|fourmi|libellule|papillon|chenille|punaise/, e => e.classe === "Insecte"],
  [/araignee/, e => e.classe === "Arachnide"],
  [/crustace|crabe|ecrevisse|crevette/, e => e.classe === "Crustacé"],
  [/escargot|limace|mollusque|coquillage/, e => ["Gastéropode", "Bivalve", "Céphalopode"].includes(e.classe)],
  [/^vers?|lombric|sangsue/, e => e.classe === "Annélide"],
];
function groupeComprend(item, e) {
  if (!e || e.hors_jeu) return false;
  const i = sansAccent(item);
  const n = sansAccent(e.nom_courant);
  // un mot du groupe dans le nom de l'espèce (« Belettes et martres » → la martre des pins)
  if (i.split(/[\s,'-]+/).some(w => w.length >= 4 && w !== "petit" && w !== "grand" && n.split(/[\s'-]+/).includes(w))) return true;
  const larges = GROUPES_LARGES.filter(([r]) => r.test(i));
  return larges.some(([, f]) => f(e));
}
// La fiche de « e » cite-t-elle « o » dans sa colonne (proies ou predateurs), par son nom ou par un groupe ?
function citeParNom(e, col, o) { return itemsDe(e, col).some(it => especeNommee(it) === o); }
function citeOuGroupe(e, col, o) {
  return itemsDe(e, col).some(it => { const n = especeNommee(it); return n ? n === o : groupeComprend(it, o); });
}
// Deux espèces ont-elles un lien quelconque (lien de finale, proie ou prédateur, par nom ou par groupe, dans un sens ou l'autre) ?
function ontUnLien(a, b) {
  if (tousLesLiens().some(l => l.nature_b === "espece" && ((l.a === a.nom_courant && l.b === b.nom_courant) || (l.a === b.nom_courant && l.b === a.nom_courant)))) return true;
  if (lienBloque(a, b, null)) return true;   // R299 : un lien typique ou rare de liens_especes.js
  return citeOuGroupe(a, "proies", b) || citeOuGroupe(a, "predateurs", b) || citeOuGroupe(b, "proies", a) || citeOuGroupe(b, "predateurs", a);
}

// ---- R298 · Les noms de groupe (remarque d'Aubin, 22/11, 22 h 05 : « On peut ajouter le nom des groupes quand c'est pertinent
//   et unique ou presque ») : un item de fiche au pluriel (« Faucons », « Corneilles et corbeaux », « Hiboux ») désigne les espèces
//   DU LIEU dont le nom commence par ce mot. Il compte comme lien s'il en désigne 1, ou 2 au plus. Jamais les groupes larges.
const GROUPES_TROP_LARGES = new Set(["oiseau", "insecte", "rapace", "poisson", "rongeur", "mammifere", "passereau", "carnivore", "predateur",
  "reptile", "amphibien", "mustelide", "araignee", "serpent", "chenille", "larve", "ver", "mollusque", "crustace", "coleoptere", "papillon",
  "oisillon", "oeuf", "chauve-souri", "chauves-souri", "limicole", "echassier", "gibier", "proie", "invertebre", "escargot", "limace",
  "mouche", "moustique", "puceron", "plancton", "graine", "fruit", "baie", "herbe", "feuille", "plante", "algue", "charogne", "cadavre", "animal", "animaux"]);
function singulier(m) { return m === "hiboux" ? "hibou" : m === "animaux" ? "animaux" : m.replace(/eaux$/, "eau").replace(/[sx]$/, ""); }
// Les têtes d'un item de groupe : « Corneilles et corbeaux » → ["corneille", "corbeau"] ; « Buse variable » → [] (un nom, pas un groupe)
const memoTetes = new Map();
function tetesDuGroupe(item) {
  if (!memoTetes.has(item)) memoTetes.set(item, calculerTetes(item));
  return memoTetes.get(item);
}
function calculerTetes(item) {
  const i = normal(item).replace(/^autres?\s+/, "").replace(/\(.*?\)/g, "").trim();
  const t = [];
  for (const p of i.split(/\s*(?:,|\bet\b|\bou\b)\s*/).map(s => s.trim()).filter(Boolean)) {
    const mots = p.split(/\s+/);
    // un seul mot au pluriel : « Faucons », « Corneilles et corbeaux » ; jamais « Petits mammifères » (« petit » n'est pas un nom :
    //   c'était lu comme « les espèces qui commencent par Petit », le petit rhinolophe…), ni « Buse variable »
    if (mots.length > 1 || !/[sx]$/.test(mots[0])) return [];
    const tete = singulier(mots[0]);
    if (GROUPES_TROP_LARGES.has(tete) || GROUPES_TROP_LARGES.has(mots[0]) || tete.length < 3) return [];
    t.push(tete);
  }
  return t;
}
const memoPremierMot = new Map();
function premierMot(e) { if (!memoPremierMot.has(e)) memoPremierMot.set(e, normal(e.nom_courant).split(/[\s']+/)[0]); return memoPremierMot.get(e); }
// Les espèces du lieu (toutes ses expéditions), une fois par expédition
const memoLieu = new Map();
function especesDuLieu(x) {
  const k = x.territoire + "|" + x.chapitre;
  if (!memoLieu.has(k)) {
    const s = new Set();
    for (const y of (x.chapitre ? expeditionsDe(x.territoire) : [x])) if (y.chapitre === x.chapitre) for (const e of y.liste) s.add(e);
    for (const e of x.liste) s.add(e);
    memoLieu.set(k, [...s]);
  }
  return memoLieu.get(k);
}
// Les espèces du lieu qu'un item de groupe désigne (vide si l'item n'est pas un groupe étroit)
const memoMembres = new Map();
function membresDuGroupe(item, x) {
  const tetes = tetesDuGroupe(item);
  if (!tetes.length || especeNommee(item)) return [];
  const k = item + "|" + x.territoire + "|" + x.chapitre;
  if (!memoMembres.has(k)) memoMembres.set(k, especesDuLieu(x).filter(e => tetes.includes(premierMot(e))));
  return memoMembres.get(k);
}
// L'item de la colonne de « e » qui désigne « o » : { item, groupe: [membres] | null } (par son nom, ou par un groupe de 1 ou 2 espèces du lieu)
// Un groupe ne vaut que pour une espèce qui mange vraiment ce type d'animal (« Hiboux » chez le hérisson : le moyen-duc doit manger
//   de petits mammifères)
//   et d'une taille qu'il peut prendre (la pie-grièche et « les lézards » : pas le lézard ocellé, deux fois plus grand qu'elle)
function groupeVraisemblable(mangeur, proie) {
  if (!typesAnimal(proie).some(v => listeGroupes(mangeur.proies_groupes).includes(v))) return false;
  const tm = tailleNombre(mangeur), tp = tailleNombre(proie);
  return !tm || !tp || tp <= tm * 1.5;
}
function itemQuiCite(e, col, o, x) {
  // R299 : un lien typique (liens_especes.js) compte comme une citation par nom, avec sa phrase
  const le = col === "proies" ? lienTypique(e, o, "mange", x) : col === "predateurs" ? lienTypique(o, e, "mange", x) : null;
  if (le) return { item: null, groupe: null, lien: le };
  for (const it of itemsDe(e, col)) if (especeNommee(it) === o) return { item: it, groupe: null };
  if (!R298 || !x) return null;
  for (const it of itemsDe(e, col)) {
    const m = membresDuGroupe(it, x).filter(g => g !== e && (col === "predateurs" ? groupeVraisemblable(g, e) : groupeVraisemblable(e, g)));   // jamais elle-même
    if (m.length && m.length <= 2 && m.includes(o)) return { item: it, groupe: m };
  }
  return null;
}
// Pour écarter un piège : l'item pourrait-il le comprendre, même par un groupe de 3 espèces ou plus ?
function citeLarge(e, col, o, x) {
  if (citeOuGroupe(e, col, o)) return true;
  if (!R298) return false;
  // R299 : un lien typique ou rare (e mange o ; o mange e pour la colonne des prédateurs)
  if (leOn() && (col === "proies" ? liensEspecesDe(e, o) : col === "predateurs" ? liensEspecesDe(o, e) : []).some(l => l.role === "mange")) return true;
  return itemsDe(e, col).some(it => { const t = tetesDuGroupe(it); return t.length && t.includes(premierMot(o)); })
      || (x ? !!itemQuiCite(e, col, o, x) : false);
}
// La phrase d'un groupe : « La fiche du moineau domestique cite les faucons : ici, le faucon crécerelle et le faucon hobereau. »
function phraseGroupe(e, c, col) {
  const g = minuscule(String(c.item).replace(/^autres?\s+/i, "").replace(/\s*\(.*?\)/g, ""));
  const ou = col === "predateurs" ? " parmi ses prédateurs" : col === "proies" ? " parmi ce qu'elle mange".replace("elle", feminin(e) ? "elle" : "il") : "";
  return `La fiche ${deNom(e)} cite les ${g}${ou} : ici, ${listeEt(c.groupe.map(leNom))}.`;
}
// Les groupes d'aliments (proies_groupes) qui pourraient comprendre cette espèce — large exprès : sert à ÉCARTER des pièges
function typesAnimal(o) {
  const t = tailleNombre(o);
  switch (o.classe) {
    case "Oiseau": return ["Oiseaux et œufs"];
    case "Mammifère": return t && t <= 40 ? ["Petits mammifères"] : t && t >= 80 ? ["Grands mammifères"] : ["Petits mammifères", "Grands mammifères"];
    case "Poisson": return ["Poissons"];
    case "Amphibien": case "Reptile": return ["Amphibiens et reptiles"];
    case "Insecte": return ["Insectes", "Araignées et petites bêtes"];
    case "Arachnide": case "Myriapode": return ["Araignées et petites bêtes", "Insectes"];
    case "Crustacé": return ["Crustacés", "Araignées et petites bêtes"];
    case "Gastéropode": case "Bivalve": case "Annélide": case "Céphalopode": return ["Vers et mollusques"];
    default: return ["Vers et mollusques", "Araignées et petites bêtes", "Crustacés", "Algues et plancton"];
  }
}
const VERTEBRES = ["Oiseau", "Mammifère", "Poisson", "Amphibien", "Reptile"];
// « m » pourrait-il manger « o » ? (prudent : dans le doute, oui)
function pourraitManger(m, o, x) {
  if (citeLarge(m, "proies", o, x) || citeLarge(o, "predateurs", m, x)) return true;
  if (leOn() && rapacePeutPrendre(m, o)) return true;   // R299
  if (tousLesLiens().some(l => l.role === "Garde-manger" && l.nature_b === "espece" && [l.a, l.b].includes(m.nom_courant) && [l.a, l.b].includes(o.nom_courant))) return true;
  const g = listeGroupes(m.proies_groupes);
  if (!g.length || (m.a_confirmer || []).includes("proies_groupes")) return true;
  if (g.includes("Charognes et os") && VERTEBRES.includes(o.classe)) return true;
  return typesAnimal(o).some(v => g.includes(v));
}
// R299 : un rapace peut prendre un oiseau ou une chauve-souris pas plus grand que lui, même si sa fiche ne le dit pas
//   (bilan du lot 1 : ces proies « rares » de grands groupes, petits oiseaux et chauves-souris, ne sont pas écrites espèce par
//   espèce ; ces rapaces ne doivent pas servir de piège pour elles : la buse pour « Laquelle mange parfois le merle noir ? »)
function rapacePeutPrendre(m, o) {
  if (!m || !o || m.hors_jeu || !/Accipitri|Falconi|Strigi/.test(m.ordre || "")) return false;
  if (o.classe !== "Oiseau" && !/Chiropt/.test(o.ordre || "")) return false;
  const tm = tailleNombre(m), to = tailleNombre(o);
  return !tm || !to || to <= tm * 1.2;
}
// R298 : s'il mange une bonne réponse, il peut manger un autre animal du même type (un autre oiseau, un autre poisson) :
//   un tel piège serait à moitié vrai. Sauf un animal bien plus grand que toutes les bonnes réponses (le sanglier quand
//   le grand-duc mange un campagnol), jamais parmi les grands mammifères (le renard mange aussi faons et marcassins).
function memeTypeQuUneBonne(o, bonnes) {
  const communs = bonnes.flatMap(b => typesAnimal(b).filter(v => typesAnimal(o).includes(v)));
  if (!communs.length) return false;
  if (communs.includes("Grands mammifères")) return true;
  const t = tailleNombre(o), tmax = Math.max(...bonnes.map(b => tailleNombre(b) || 0));
  return !(t && tmax && t > tmax * 1.5);
}
// Mange-t-il des animaux ? (pour les pièges de « Qui mange … ? »)
function mangeDesAnimaux(o) { return listeGroupes(o.proies_groupes).some(v => GROUPES_ANIMAUX.includes(v) && v !== "Charognes et os"); }
// Un lien du classeur de ce rôle entre deux espèces (dans n'importe quel lieu)
function lienDeRole(role, a, b) {
  return tousLesLiens().some(l => l.nature_b === "espece" && (l.role === role || (role === "Compagnons" && l.role === "Voisins"))
    && ((l.a === a.nom_courant && l.b === b.nom_courant) || (l.a === b.nom_courant && l.b === a.nom_courant)));
}
// R298 (choix F) : le lien du coucou est une ponte dans le nid d'un autre oiseau ; le reste des « passagers » se fixe sur l'autre
//   (tique, lamproie, larves de l'anodonte). Une autre phrase (« ils se transmettent une maladie », « la mouette dérobe les vers »)
//   ne donne pas de question.
function sortePassager(k) {
  const p = sansAccent(k.phrase || "");
  if (/rejett|rejet|reconnai/.test(p)) return null;
  if (/\bnid\b|\boeuf|\bœuf|eleve.*petit|couv/.test(p)) { const A = especeParNom(k.a); return A && /Cuculi/.test(A.ordre || "") ? "nid" : null; }   // seul le coucou pond chez un autre
  if (/fixe|accroch|sang|tique|porte/.test(p)) return "fixe";
  return null;
}
// R298 (choix F) : un piège ne doit pas pouvoir tenir le même rôle (hors « Garde-manger », vu par pourraitManger)
//   - un logis (Locataire) : ni un autre creuseur de loges (pic) ou un oiseau qui niche en cavité pour un trou ; ni un oiseau
//     au nid d'arbre de taille voisine pour un vieux nid ; ni un animal à terrier pour un terrier ; ni un coquillage pour une coquille ;
//   - le nid du coucou : jamais un passereau (il en parasite beaucoup) ;
//   - un passager qui se fixe : jamais un animal de la même classe que la bonne réponse ;
//   - des compagnons : jamais une espèce du même ordre que l'un des deux (ni un pic pour une bande de mésanges).
function memeRolePossible(r, o) {
  const p = sansAccent(String(r.explication || "")), b = r.reponse, s = r.sujet;
  if (lienDeRole(r.role, s, o)) return true;
  if (r.role === "Locataire") {
    if (/trou|loge|cavit/.test(p)) return /Pici/.test(o.ordre || "");   // seuls les pics creusent un trou que d'autres reprennent
    if (/terrier|galerie/.test(p)) return nidsPossibles(o).includes("Terrier") || (estRenseigne(o.type_terrier) && o.type_terrier !== "NA")
      || /terrier|galerie|souterr|trou/i.test(String(o.nom_logis || "")) || (o.classe === "Mammifère" && (tailleNombre(o) || 0) <= 40 && !/Chiropt/.test(o.ordre || ""));
    if (/coquille/.test(p)) return ["Gastéropode", "Bivalve"].includes(o.classe);
    if (/nid/.test(p)) {
      if (o.classe !== "Oiseau") return false;
      const to = tailleNombre(o), tb = tailleNombre(b);
      return nidsPossibles(o).some(v => nidsPossibles(b).includes(v)) && (!to || !tb || to >= tb * 0.6);
    }
    return o.classe === b.classe;
  }
  if (r.role === "Passager") return r.sorte === "nid" ? (o.classe !== "Oiseau" || /Passéri/.test(o.ordre || "")) : o.classe === b.classe;
  if (r.role === "Compagnons") return o.classe !== s.classe || [s.ordre, b.ordre].includes(o.ordre) || (/Passéri/.test(s.ordre || "") && /Pici/.test(o.ordre || ""));
  if (r.role === "Nid") return !piegeNidSur(r.sorte, [b], s, o);   // R299 : vieux nid, loge de pic, grand nid, terrier, colonies
  return false;
}

// ---- R299 · Les liens typiques entre espèces (23/11, Notion 48.23 ; Données\liens_especes.xlsx → liens_especes.js) ----
//   Typiques : ils comptent exactement comme une citation par nom dans une fiche (« Les liens entre elles », « Les voisins »,
//   « Le même chasseur »), mêmes pièges, mêmes plafonds, avec leur phrase en explication ; jamais avec le trésor du lieu ;
//   jamais pour la finale (elle ne lit que LIENS). Rares : jamais posés, mais ils BLOQUENT : une espèce liée (en rare ou en
//   typique) au sujet, dans la même famille de rôles, n'est jamais proposée comme mauvaise réponse (l'effraie mange parfois
//   une belette : la belette n'est pas un piège de « Laquelle nourrit l'effraie ? »).
//   Rôles de nid : « Dans le nid de laquelle… pond-il ? » (coucous, règles de R298), « Dans le vieux nid de laquelle… »,
//   « Dans la vieille loge de laquelle… » (loges de pics), « Dans le grand nid de laquelle… », « Dans le terrier de laquelle… »,
//   « Au milieu des colonies de laquelle… ». Toujours dans ce sens (décision 4 de R298) : jamais « qui s'installe chez… ? ».
//   LIENS_ESPECES = false → l'étape de R298.
const LIENS_ESPECES = true;
let LE_ACTIFS = LIENS_ESPECES;         // (mis à false un instant par test_jeu.py pour comparer avec R298)
function leOn() { return LE_ACTIFS && R298; }
const ROLES_NID = ["pond_dans_le_nid_de", "niche_dans_le_vieux_nid_de", "loge_chez", "autre"];
const memoLE = { src: null, paires: null, versB: null };
function indexLiensEspeces() {
  const src = leOn() && typeof LIENS_ESPECES_DONNEES !== "undefined" ? LIENS_ESPECES_DONNEES : [];
  if (memoLE.src !== src) {
    const p = new Map(), v = new Map();
    for (const l of src) { const k = l.a + "|" + l.b; if (!p.has(k)) p.set(k, []); p.get(k).push(l); if (!v.has(l.b)) v.set(l.b, []); v.get(l.b).push(l); }
    memoLE.src = src; memoLE.paires = p; memoLE.versB = v;
  }
  return memoLE;
}
function liensEspecesDe(a, b) { return (a && b && indexLiensEspeces().paires.get(a.nom_courant + "|" + b.nom_courant)) || []; }
function familleRole(role) { return role === "mange" ? "mange" : "nid"; }
function tresorDe(x) { return x && x.chapitre && typeof tresorDuLieu === "function" ? tresorDuLieu(x.territoire, x.chapitre) : null; }
// Un lien typique posable a → b dans ce rôle (jamais avec le trésor du lieu)
function lienTypique(a, b, role, x) {
  if (!leOn()) return null;
  const l = liensEspecesDe(a, b).find(z => z.typique && z.role === role && (z.statut === "en_jeu" || z.statut === "doublon_classeur"));
  if (!l) return null;
  const T = tresorDe(x);
  return T && (T.nom === a.nom_courant || T.nom === b.nom_courant) ? null : l;
}
// Pour écarter un piège : un lien quelconque (typique ou rare), dans un sens ou dans l'autre ; famille « mange », « nid », ou les deux (null)
function lienBloque(s, o, famille) {
  if (!leOn()) return false;
  return [...liensEspecesDe(s, o), ...liensEspecesDe(o, s)].some(l => !famille || familleRole(l.role) === famille);
}
// La forme d'un lien de nid : qui pond, niche ou loge chez qui (a = l'occupant, hote = b)
function formeNid(l, hote, occupant) {
  if (l.role === "pond_dans_le_nid_de") return /Cuculi/.test(occupant.ordre || "") ? { role: "Passager", sorte: "nid", forme: "Passager-nid" } : null;   // seul un coucou pond chez un autre
  if (l.role === "niche_dans_le_vieux_nid_de") return hote.classe !== "Oiseau" ? null : /Pici/.test(hote.ordre || "") ? { role: "Nid", sorte: "loge", forme: "Loge" } : { role: "Nid", sorte: "vieux_nid", forme: "VieuxNid" };
  if (l.role === "loge_chez") return hote.classe === "Oiseau" ? { role: "Nid", sorte: "grand_nid", forme: "GrandNid" } : hote.classe === "Mammifère" ? { role: "Nid", sorte: "terrier", forme: "Terrier" } : null;
  if (l.role === "autre") return hote.classe === "Oiseau" && occupant.classe === "Oiseau" && /colonie|parmi|milieu/.test(sansAccent(l.phrase || "")) ? { role: "Nid", sorte: "colonies", forme: "Colonies" } : null;
  return null;
}
// Les pièges d'une question de nid : des espèces qui ne font pas un nid (ou un terrier) de ce genre que le sujet pourrait reprendre
const ORDRES_GRANDS_NIDS = /Accipitri|Falconi|Strigi|Ciconi|Pélécani/;
const CORVIDES = /^(corneille|corbeau|grand corbeau|pie bavarde|geai|choucas|crave|chocard|cassenoix)\b/;
function estCorvide(e) { return CORVIDES.test(normal(e.nom_courant)); }
function piegeNidSur(sorte, hotes, sujet, o) {
  if (!o || o === sujet || hotes.includes(o) || o.hors_jeu) return false;
  if (lienBloque(sujet, o, "nid")) return false;
  if (tousLesLiens().some(l => l.nature_b === "espece" && ["Locataire", "Passager", "Voisins", "Compagnons"].includes(l.role)
      && [l.a, l.b].includes(sujet.nom_courant) && [l.a, l.b].includes(o.nom_courant))) return false;
  const t = tailleNombre(o), th = Math.min(...hotes.map(h => tailleNombre(h) || 999));
  const nid = confirme(o, "emplacement_nid") ? String(o.emplacement_nid).trim() : "";
  const ordre = o.ordre || "";
  switch (sorte) {
    // un vieux nid de branches : un oiseau qui niche d'abord dans un arbre ou un buisson (jamais au sol, en trou, dans un bâtiment),
    //   mais dont le nid est trop petit pour le sujet ; jamais un rapace, un héron, une cigogne, un corvidé (grands nids repris)
    case "vieux_nid": return o.classe === "Oiseau" && nid === "Arbre ou buisson" && !ORDRES_GRANDS_NIDS.test(ordre) && !/Pici|Cuculi/.test(ordre)
      && !estCorvide(o) && !!t && t < th * 0.6;
    // une loge de pic : jamais un autre pic ; ni un oiseau qui niche en trou (il s'installe lui aussi dans les vieilles loges)
    case "loge": return o.classe === "Oiseau" && !!nid && !/Pici|Cuculi/.test(ordre) && !nidsPossibles(o).includes("Cavité d'arbre");
    // un grand nid : un oiseau sans grand nid (petit, ni rapace, ni héron, ni cigogne, ni corvidé)
    case "grand_nid": return o.classe === "Oiseau" && !!nid && !ORDRES_GRANDS_NIDS.test(ordre) && !estCorvide(o) && !/Cuculi/.test(ordre) && !!t && t < 40 && t < th * 0.5;
    // un terrier : un grand mammifère sans terrier (cerf, chevreuil, sanglier…) ; jamais un carnivore, un rongeur, un lapin,
    //   une musaraigne ou une chauve-souris (beaucoup creusent ou reprennent un trou)
    case "terrier": return o.classe === "Mammifère" && !/Carniv|Rongeur|Lagomorph|Eulipot|Insectivor|Chiropt/.test(ordre)
      && !(estRenseigne(o.type_terrier) && o.type_terrier !== "NA") && !nidsPossibles(o).includes("Terrier") && !/terrier|galerie|souterr|trou/i.test(String(o.nom_logis || ""))
      && !!t && t > 40;
    // des colonies sur l'eau : un oiseau qui ne niche pas en colonie sur l'eau (ni limicole, mouette ou sterne, ni grèbe, héron,
    //   flamant, cigogne, canard, cormoran, foulque ; ni un nid sur l'eau ou dans les roseaux)
    case "colonies": return o.classe === "Oiseau" && !!nid && !/Charadri|Podicip|Pélécani|Phoenicopt|Ciconi|Ansérif|Suliform|Procellari|Gruiform/.test(ordre)
      && !nidsPossibles(o).some(v => ["Sur l'eau (nid flottant)", "Roselière ou végétation dense"].includes(v));
  }
  return false;
}

// ---- Type 1 · Les liens entre elles ----
// Le sens de chaque rôle : qui est le sujet de la question (nommé), qui est la bonne réponse (une espèce de l'expédition).
// Pas de verbe violent : la prédation est tournée côté ressource (« nourrit »).
const FORMES_LIENS = {
  "Garde-manger": (sujet) => `Laquelle de ces espèces nourrit ${leNom(sujet)} ?`,
  "Concurrents": (sujet) => `Laquelle de ces espèces est en concurrence avec ${leNom(sujet)} ?`,
  "Locataire": (sujet) => `Laquelle de ces espèces fournit un logis ${aNomAvecArticle(sujet)} ?`,
  "Passager": (sujet) => accordGenre(`Sur laquelle de ces espèces ${leNom(sujet)} se fixe-t-il ?`, sujet),
  "Compagnons": (sujet) => accordGenre(`Avec laquelle de ces espèces ${leNom(sujet)} se regroupe-t-il souvent ?`, sujet),
  // R298 : le coucou ne « se fixe » pas sur l'accenteur : il pond dans son nid
  "Passager-nid": (sujet) => accordGenre(`Dans le nid de laquelle de ces espèces ${leNom(sujet)} pond-il ?`, sujet),
  // R299 : les liens de nid de liens_especes.js (toujours « chez qui ? », jamais « qui s'installe chez… ? »)
  "VieuxNid": (sujet) => accordGenre(`Dans le vieux nid de laquelle de ces espèces ${leNom(sujet)} pond-il souvent ?`, sujet),
  "Loge": (sujet) => accordGenre(`Dans la vieille loge de laquelle de ces espèces ${leNom(sujet)} niche-t-il souvent ?`, sujet),
  "GrandNid": (sujet) => accordGenre(`Dans le grand nid de laquelle de ces espèces ${leNom(sujet)} niche-t-il souvent ?`, sujet),
  "Terrier": (sujet) => accordGenre(`Dans le terrier de laquelle de ces espèces ${leNom(sujet)} s'installe-t-il souvent ?`, sujet),
  "Colonies": (sujet) => accordGenre(`Au milieu des colonies de laquelle de ces espèces ${leNom(sujet)} niche-t-il souvent ?`, sujet),
};
// « Les gardons nourrissent le brochet » : le mangeur est celui qui est nommé APRÈS « nourri » (le sens des liens varie).
function motsDuNom(e) { return sansAccent(e.nom_courant).split(/[\s'-]+/).filter(w => w.length >= 4 && !["commun", "commune", "europe", "grand", "petit"].includes(w)); }
function nommeDans(phrase, e) { const p = sansAccent(phrase); return motsDuNom(e).some(w => new RegExp("\\b" + w).test(p)) ? p.search(new RegExp("\\b" + motsDuNom(e).find(w => new RegExp("\\b" + w).test(p)))) : -1; }
function sensGardeManger(k, A, B) {
  const p = sansAccent(k.phrase), j = p.search(/\bnourri/);
  if (j < 0) return null;
  const ia = nommeDans(k.phrase, A), ib = nommeDans(k.phrase, B);
  if (ia > j && !(ib > j)) return { mangeur: A, ressource: B };
  if (ib > j && !(ia > j)) return { mangeur: B, ressource: A };
  if (ia >= 0 && ia < j && ib < 0) return { mangeur: B, ressource: A };
  if (ib >= 0 && ib < j && ia < 0) return { mangeur: A, ressource: B };
  return null;
}
// Étape R271 : cette espèce pourrait-elle, elle aussi, être en concurrence avec le sujet pour la même chose ?
//   - les trous et les nichoirs : elle niche en cavité (nid principal, autres nids de la fiche, pièges interdits) ou d'abord
//     dans les bâtiments ; une autre place pour nicher (îlots, roselières…) : elle niche au même endroit que l'une des deux ;
//   - la nourriture (« proies », « plantes », « campagnols »…) : elle partage un groupe d'aliments avec les deux ;
//   - le reste (une place, un territoire) : elle est du même ordre que le sujet (deux lézards, deux rongeurs).
function nidsPossibles(e) {
  const n = estRenseigne(e.emplacement_nid) && e.emplacement_nid !== "NA" ? [String(e.emplacement_nid).trim()] : [];
  return [...n, ...nidsAussi(e)];
}
function concurrentPossible(r, o) {
  const phrase = sansAccent(String(r.explication || ""));
  if (/trou|nichoir|cavite/.test(phrase))   // les trous et les nichoirs : tout oiseau qui niche en cavité, ou d'abord dans les bâtiments
    return nidsPossibles(o).includes("Cavité d'arbre") || nidsPossibles(o)[0] === "Bâtiment";
  if (/nich|\bnid|ilot|colonie|roseli|roseau/.test(phrase)) {   // une autre place pour nicher : le même endroit que l'une des deux
    const lieux = [nidsPossibles(r.sujet)[0], nidsPossibles(r.reponse)[0]].filter(Boolean);
    return nidsPossibles(o).some(v => lieux.includes(v));
  }
  if (/proie|nourriture|plante|campagnol|rongeur|poisson|mange|chass/.test(phrase)) {
    const g = k => listeGroupes(k.proies_groupes);
    const communs = g(r.sujet).filter(v => g(r.reponse).includes(v));
    return communs.length ? g(o).some(v => communs.includes(v)) : (!!o.regime_alimentaire_type && o.regime_alimentaire_type === r.sujet.regime_alimentaire_type);
  }
  return !!o.ordre && o.ordre === r.sujet.ordre;   // une place, un territoire : deux lézards, deux rats, deux libellules
}
function candidatsLiensEnsemble(x) {
  const res = [], noms = new Set(x.liste.map(e => e.nom_courant)), vus = new Set();
  const cle = (a, b) => [a.nom_courant, b.nom_courant].sort().join("|");
  const c = x.chapitre && chapitreParNom(x.territoire, x.chapitre);
  for (const k of (c ? liensDuLieu(x.territoire, c.nom) : [])) {
    if (k.nature_b !== "espece" || !noms.has(k.a) || !noms.has(k.b) || !FORMES_LIENS[k.role]) continue;
    const A = especeParNom(k.a), B = especeParNom(k.b);
    let sujet, reponse;
    if (k.role === "Garde-manger") { const s = sensGardeManger(k, A, B); if (!s) continue; sujet = s.mangeur; reponse = s.ressource; }
    else if (k.role === "Concurrents" || k.role === "Compagnons") { [sujet, reponse] = Math.random() < 0.5 ? [A, B] : [B, A]; }
    else { sujet = A; reponse = B; }                    // Locataire, Passager : a loge chez b, a se fixe sur b
    // R298 : le coucou (« fait couver son œuf par l'accenteur ») pond dans un nid ; une autre sorte de « passager » est écartée
    let role = k.role, sorte = null;
    if (R298 && (role === "Passager" || (role === "Locataire" && /Cuculi/.test(A.ordre || "") && /couv|eleve.*petit/.test(sansAccent(k.phrase || ""))))) {
      sorte = sortePassager(k); if (!sorte) continue; role = "Passager";
    }
    if (vus.has(cle(A, B))) continue;
    vus.add(cle(A, B));
    res.push({ role, sorte, sujet, reponse, explication: k.phrase, forme: sorte === "nid" ? "Passager-nid" : role });
  }
  // R299 : les liens de nid typiques de liens_especes.js (a pond, niche ou loge chez b), après ceux du classeur
  if (leOn()) for (const a of x.liste) for (const b of x.liste) {
    if (a === b || vus.has(cle(a, b))) continue;
    const l = ROLES_NID.map(r => lienTypique(a, b, r, x)).find(Boolean);
    const f = l && formeNid(l, b, a);
    if (!f) continue;
    vus.add(cle(a, b));
    res.push({ role: f.role, sorte: f.sorte, sujet: a, reponse: b, explication: l.phrase, forme: f.forme, lienEspece: l.id });
  }
  // les fiches : A cite B parmi ses proies, ou B cite A parmi ses prédateurs (par son nom, pas par un groupe)
  // R299 : ou un lien typique « mange » de liens_especes.js (itemQuiCite), avec sa phrase
  for (const a of x.liste) for (const b of x.liste) {
    if (a === b || vus.has(cle(a, b))) continue;
    // R298 : aussi par un nom de groupe qui ne désigne qu'une ou deux espèces du lieu (« Mésanges » → la mésange bleue)
    const parProie = R298 ? itemQuiCite(a, "proies", b, x) : (citeParNom(a, "proies", b) ? { groupe: null } : null);
    const parPred = R298 ? itemQuiCite(b, "predateurs", a, x) : (citeParNom(b, "predateurs", a) ? { groupe: null } : null);
    const mange = parProie || parPred;
    const inverse = R298 ? (itemQuiCite(b, "proies", a, x) || itemQuiCite(a, "predateurs", b, x)) : (citeParNom(b, "proies", a) || citeParNom(a, "predateurs", b));
    if (!mange || inverse) continue;
    vus.add(cle(a, b));
    const parNom = (parProie && !parProie.groupe) || (parPred && !parPred.groupe);
    const lienE = (parProie && parProie.lien) || (parPred && parPred.lien);
    const explication = lienE ? lienE.phrase : parNom ? `${LeNom(a)} se nourrit notamment ${deNom(b)}.`
      : parProie ? phraseGroupe(a, parProie, "proies") : phraseGroupe(b, parPred, "predateurs");
    res.push({ role: "Garde-manger", sujet: a, reponse: b, explication, groupe: !parNom, lienEspece: lienE ? lienE.id : null });
  }
  // les pièges : espèces de l'expédition sans aucun lien avec le sujet
  // Étape R271 (test du 19/11, n° 7 : le moineau domestique compté faux pour « en concurrence avec la mésange charbonnière »,
  //   alors qu'il dispute aussi les nichoirs) : pour une concurrence, un piège ne doit pas pouvoir disputer la même chose.
  // Étape R298 (choix F) : selon le rôle du lien, plus « aucun lien du tout » : pour « Laquelle nourrit… ? », un piège est écarté
  //   seulement si le sujet pourrait le manger ; pour un logis, un nid, un passager, des compagnons, seul compte ce rôle
  //   (le coucou « mange des œufs d'oiseaux » ne bloque plus « dans quel nid pond-il ? ») ; « Concurrents » comme avant.
  for (const r of res) r.pieges = x.liste.filter(o => o !== r.sujet && o !== r.reponse && (!R298 || r.role === "Concurrents"
      ? !ontUnLien(r.sujet, o) && !(r.role === "Concurrents" && concurrentPossible(r, o))
      : r.role === "Garde-manger" ? !pourraitManger(r.sujet, o, x) && !memeTypeQuUneBonne(o, [r.reponse]) : !memeRolePossible(r, o))
      // R299 : jamais une espèce liée au sujet (en rare ou en typique) dans la même famille de rôles
      && !lienBloque(r.sujet, o, r.role === "Garde-manger" ? "mange" : r.role === "Concurrents" || r.role === "Compagnons" ? null : "nid"));
  return res.filter(r => r.pieges.length >= 2);
}
function questionLien(r) {
  const choix = melanger([choixEspece(r.reponse, true), ...melanger(r.pieges.slice()).slice(0, 2).map(o => choixEspece(o))]);
  return { type: "liens", role: r.role, sorte: r.sorte || null, lienEspece: r.lienEspece || null, question: FORMES_LIENS[r.forme || r.role](r.sujet), montrees: [r.sujet.nom_courant], choix, plusieurs: false,
           explication: String(r.explication).trim().replace(/([^.!?])$/, "$1."), especes: [r.sujet.nom_courant, r.reponse.nom_courant] };
}

// ---- Type R298 · Les voisins (choix B2 du 22/11) ----
// Un voisin = une espèce du même lieu, d'une autre expédition, jouable (avec photo, R284), jamais le trésor du lieu.
// Il est montré en haut (même s'il n'est pas encore rencontré : exception assumée, comme l'aperçu des territoires) ;
// les réponses sont les espèces de l'expédition, une ou plusieurs selon la vérité. 3 au plus par expédition, jamais deux fois
// le même voisin ; ne compte pas pour la finale. Liens retenus : le classeur (rôles ci-dessous ; jamais Cousins ni Voisins :
// le nom donne souvent la réponse, ou c'est trop vague) et les fiches (proies_items / predateurs_items qui nomment l'autre,
// ou son groupe s'il ne désigne qu'une ou deux espèces du lieu).
const ROLES_VOISINS = ["Garde-manger", "Locataire", "Passager", "Concurrents", "Compagnons", "Nouveau venu"];
function voisinsDe(x) {
  const T = typeof tresorDuLieu === "function" && x.chapitre ? tresorDuLieu(x.territoire, x.chapitre) : null;
  return especesDuLieu(x).filter(e => !x.liste.includes(e) && estRenseigne(e.photo) && !(T && T.nom === e.nom_courant));
}
// « de ces espèces du village » (d'après le titre de l'expédition : « Les oiseaux du village »)
function lieuDuTitre(x) {
  const m = String(x.titre || "").match(/\s(du|de la|de l'|des|d')\s?([^,(]+)$/i);
  if (!m) return "";
  return (" " + m[1].toLowerCase() + (/'$/.test(m[1]) ? "" : " ") + m[2].trim()).replace(/\s+/g, " ");
}
function titreExpDe(e, x) { const y = expeditionsDe(x.territoire).find(z => z.chapitre === x.chapitre && z.id !== x.id && z.liste.includes(e)); return y ? y.titre : ""; }
function aLe(V) { return V.replace(/^le /, "au ").replace(/^les /, "aux ").replace(/^la /, "à la ").replace(/^l'/, "à l'"); }
function deLe(V) { return V.replace(/^le /, "du ").replace(/^les /, "des ").replace(/^la /, "de la ").replace(/^l'/, "de l'"); }
// Les formes : n = nombre de bonnes réponses ; V = le nom du voisin (« le faucon crécerelle », « les faucons ») ; l = « du village »
const FORMES_VOISINS = {
  V_mange:  (V, n, l) => n > 1 ? `Lesquelles de ces espèces${l} nourrissent ${V} ?` : `Laquelle de ces espèces${l} nourrit ${V} ?`,
  mange_V:  (V, n, l) => n > 1 ? `Lesquelles de ces espèces${l} mangent parfois ${V} ?` : `Laquelle de ces espèces${l} mange parfois ${V} ?`,
  Concurrents: (V, n, l) => n > 1 ? `Lesquelles de ces espèces${l} sont en concurrence avec ${V} ?` : `Laquelle de ces espèces${l} est en concurrence avec ${V} ?`,
  Compagnons: (V, n, l, e) => accordGenre(n > 1 ? `Avec lesquelles de ces espèces${l} ${V} se regroupe-t-il souvent ?` : `Avec laquelle de ces espèces${l} ${V} se regroupe-t-il souvent ?`, e),
  V_loge_chez: (V, n, l) => n > 1 ? `Lesquelles de ces espèces${l} fournissent un logis ${aLe(V)} ?` : `Laquelle de ces espèces${l} fournit un logis ${aLe(V)} ?`,
  V_pond_chez: (V, n, l, e) => accordGenre(n > 1 ? `Dans le nid desquelles de ces espèces${l} ${V} pond-il ?` : `Dans le nid de laquelle de ces espèces${l} ${V} pond-il ?`, e),
  pond_chez_V: (V, n, l) => `Laquelle de ces espèces${l} pond dans le nid ${deLe(V)} ?`,
  V_se_fixe_sur: (V, n, l, e) => accordGenre(n > 1 ? `Sur lesquelles de ces espèces${l} ${V} se fixe-t-il ?` : `Sur laquelle de ces espèces${l} ${V} se fixe-t-il ?`, e),
  se_fixe_sur_V: (V, n, l) => `Laquelle de ces espèces${l} se fixe sur ${V} ?`,
  // R299 : les liens de nid de liens_especes.js ; le voisin est toujours celui qui pond, niche ou loge (décision 4 de R298)
  V_vieux_nid: (V, n, l, e) => accordGenre(n > 1 ? `Dans le vieux nid de quelles espèces${l} ${V} pond-il souvent ?` : `Dans le vieux nid de laquelle de ces espèces${l} ${V} pond-il souvent ?`, e),
  V_loge: (V, n, l, e) => accordGenre(n > 1 ? `Dans la vieille loge de quelles espèces${l} ${V} niche-t-il souvent ?` : `Dans la vieille loge de laquelle de ces espèces${l} ${V} niche-t-il souvent ?`, e),
  V_grand_nid: (V, n, l, e) => accordGenre(n > 1 ? `Dans le grand nid de quelles espèces${l} ${V} niche-t-il souvent ?` : `Dans le grand nid de laquelle de ces espèces${l} ${V} niche-t-il souvent ?`, e),
  V_terrier: (V, n, l, e) => accordGenre(n > 1 ? `Dans le terrier de quelles espèces${l} ${V} s'installe-t-il souvent ?` : `Dans le terrier de laquelle de ces espèces${l} ${V} s'installe-t-il souvent ?`, e),
  V_colonies: (V, n, l, e) => accordGenre(n > 1 ? `Au milieu des colonies de quelles espèces${l} ${V} niche-t-il souvent ?` : `Au milieu des colonies de laquelle de ces espèces${l} ${V} niche-t-il souvent ?`, e),
};
// Toutes les relations voisin ↔ espèce de l'expédition : { membres: [V…], groupe, sens, S, explication, classeur }
function relationsVoisins(x) {
  const voisins = new Set(voisinsDe(x)), dansX = new Set(x.liste), rel = [];
  if (!voisins.size) return rel;
  const c = x.chapitre && chapitreParNom(x.territoire, x.chapitre);
  for (const k of (c ? tousLesLiens().filter(l => l.territoire === x.territoire && l.lieu === c.nom) : [])) {
    if (k.nature_b !== "espece" || !ROLES_VOISINS.includes(k.role)) continue;
    const A = especeParNom(k.a), B = especeParNom(k.b);
    if (!A || !B) continue;
    const V = voisins.has(A) && dansX.has(B) ? A : voisins.has(B) && dansX.has(A) ? B : null;
    if (!V) continue;
    const S = V === A ? B : A, p = sansAccent(k.phrase || "");
    let sens = null, role = k.role;
    if (role === "Nouveau venu") role = /nourri/.test(p) ? "Garde-manger" : /disput|concurren|place|recul|remplac/.test(p) ? "Concurrents" : null;
    const coucou = /Cuculi/.test(A.ordre || "") && /couv|eleve.*petit|\bnid\b|pond/.test(p);
    if (role === "Garde-manger") { const g = sensGardeManger(k, A, B); if (g) sens = g.mangeur === V ? "V_mange" : "mange_V"; }
    else if (role === "Concurrents" || role === "Compagnons") sens = role;
    else if (role === "Locataire" && !coucou) sens = V === A ? "V_loge_chez" : null;   // l'autre sens : trop d'espèces pourraient s'y loger
    else if (role === "Locataire" || role === "Passager") {
      const so = sortePassager(k);
      if (so === "nid") sens = V === A ? "V_pond_chez" : "pond_chez_V";
      else if (so === "fixe") sens = V === A ? "V_se_fixe_sur" : "se_fixe_sur_V";
    }
    if (sens) rel.push({ membres: [V], groupe: null, sens, S, explication: String(k.phrase).trim().replace(/([^.!?])$/, "$1."), classeur: true });
  }
  // R299 : les liens de nid typiques de liens_especes.js. Le voisin pond, niche ou loge chez une espèce de l'expédition ;
  //   pour le coucou seulement, aussi l'autre sens (« Laquelle de ces espèces pond dans le nid de la bergeronnette ? »), comme en R298.
  if (leOn()) for (const V of voisins) for (const S of x.liste) {
    const l = ROLES_NID.map(r => lienTypique(V, S, r, x)).find(Boolean), f = l && formeNid(l, S, V);
    if (f) rel.push({ membres: [V], groupe: null, sens: f.sorte === "nid" ? "V_pond_chez" : "V_" + f.sorte, S, explication: l.phrase, classeur: false, lienEspece: l.id });
    const l2 = lienTypique(S, V, "pond_dans_le_nid_de", x), f2 = l2 && formeNid(l2, V, S);
    if (f2) rel.push({ membres: [V], groupe: null, sens: "pond_chez_V", S, explication: l2.phrase, classeur: false, lienEspece: l2.id });
  }
  for (const V of voisins) for (const S of x.liste) {
    // S mange V (fiche de S : proies ; fiche de V : prédateurs) ; ou V mange S
    // S mange V : la fiche de S (proies) ou celle de V (prédateurs) ; V mange S : la fiche de V (proies) ou celle de S (prédateurs)
    const svP = itemQuiCite(S, "proies", V, x), svR = svP ? null : itemQuiCite(V, "predateurs", S, x);
    const vsP = itemQuiCite(V, "proies", S, x), vsR = vsP ? null : itemQuiCite(S, "predateurs", V, x);
    if ((svP || svR) && (vsP || vsR)) continue;                       // ils se mangent l'un l'autre : trop flou
    const r = svP || svR || vsP || vsR;
    if (!r) continue;
    const sens = svP || svR ? "mange_V" : "V_mange";
    const mangeur = sens === "mange_V" ? S : V, proie = sens === "mange_V" ? V : S;
    const parProies = !!(svP || vsP);
    const membres = r.groupe ? r.groupe.filter(g => voisins.has(g)) : [V];
    if (!membres.includes(V)) continue;
    // l'explication dit d'où vient le lien : « Le hérisson se nourrit notamment de l'escargot. » (fiche du mangeur) ;
    //   « La fiche de l'épervier cite la chouette hulotte parmi ses prédateurs. » (fiche de la proie, avec sa précision : « (œufs) »)
    // R299 : un lien typique de liens_especes.js donne sa phrase
    const explication = r.lien ? r.lien.phrase : r.groupe ? phraseGroupe(parProies ? mangeur : proie, r, parProies ? "proies" : "predateurs")
      : parProies ? `${LeNom(mangeur)} se nourrit notamment ${deNom(proie)}.`
      : `La fiche ${deNom(proie)} cite ${leNom(mangeur)} parmi ses prédateurs${precisionPredateur(proie, r.item)}.`;
    rel.push({ membres, groupe: r.groupe ? r.item : null, sens, S, explication, classeur: false, lienEspece: r.lien ? r.lien.id : null });
  }
  return rel;
}
// La précision de la fiche entre parenthèses (« Corneilles et corbeaux (œufs) » → « (œufs) »), dans la colonne libre predateurs
function precisionPredateur(e, item) {
  const t = String(e.predateurs || ""), mot = normal(item).split(/\s+/)[0].replace(/[sx]$/, "");
  const morceau = t.split(/[;,]/).find(m => normal(m).includes(mot));
  const p = morceau && morceau.match(/\(([^)]+)\)/);
  return p ? ` (${p[1].trim()})` : "";
}
// Les pièges « du même monde », selon le rôle
function piegesVoisin(u, x) {
  const bonnes = u.bonnes, M = u.membres, texte = u.explications.join(" ");
  return x.liste.filter(o => {
    if (bonnes.includes(o)) return false;
    // aucun lien du classeur entre le voisin et le piège (hors « Cousins »)
    if (M.some(V => tousLesLiens().some(l => l.nature_b === "espece" && l.role !== "Cousins" && [l.a, l.b].includes(V.nom_courant) && [l.a, l.b].includes(o.nom_courant)))) return false;
    // R299 : ni un lien typique ou rare de liens_especes.js entre le voisin et le piège, dans la même famille de rôles
    if (M.some(V => lienBloque(V, o, /mange/.test(u.sens) ? "mange" : /^(Concurrents|Compagnons)$/.test(u.sens) ? null : "nid"))) return false;
    switch (u.sens) {
      case "V_vieux_nid": case "V_loge": case "V_grand_nid": case "V_terrier": case "V_colonies": return piegeNidSur(u.sens.slice(2), bonnes, M[0], o);
      case "V_mange": { // le voisin mange l'espèce : un piège est d'un type d'animal absent de ce qu'il mange
        if (M.some(V => pourraitManger(V, o, x)) || M.some(V => citeLarge(o, "proies", V, x))) return false;
        // et jamais du même type qu'une bonne réponse (s'il mange un oiseau, un autre oiseau pourrait le nourrir aussi),
        //   sauf un animal bien plus grand que toutes les bonnes réponses (le sanglier, quand le grand-duc mange un jeune blaireau)
        const t = tailleNombre(o), tmax = Math.max(...bonnes.map(b => tailleNombre(b) || 0));
        // jamais un piège qu'on écarte d'un coup d'œil : pas plus de 3 fois la taille du voisin (deux phoques pour « qui nourrit les faucons ? »)
        const tv = Math.max(...M.map(V => tailleNombre(V) || 0));
        if (t && tv && (t > tv * 3 || t < tv / 10)) return false;   // ni trois papillons pour « qui nourrit l'aigle royal ? »
        return !memeTypeQuUneBonne(o, bonnes);
      }
      case "mange_V": { // l'espèce mange le voisin : un piège mange des animaux, mais pas ce type d'animal ; de taille comparable
        if (!mangeDesAnimaux(o) || M.some(V => pourraitManger(o, V, x) || citeLarge(V, "proies", o, x))) return false;
        const t = tailleNombre(o);
        return !!t && bonnes.some(b => { const tb = tailleNombre(b); return tb && Math.max(t, tb) / Math.min(t, tb) <= 2.5; });
      }
      case "Concurrents": {
        const V = M[0];
        // pour un nid ou un trou disputé : jamais une espèce qui niche aussi dans un trou, un bâtiment ou une falaise
        const nid = /nid|nich|trou|nichoir/.test(sansAccent(texte)) && [V, bonnes[0]].some(e => nidsPossibles(e).some(v => NIDS_BATI.includes(v)));
        return o.classe === V.classe && !ontUnLien(V, o) && !concurrentPossible({ explication: texte, sujet: V, reponse: bonnes[0] }, o)
          && !(nid && nidsPossibles(o).some(v => NIDS_BATI.includes(v)));
      }
      case "Compagnons": return !memeRolePossible({ role: "Compagnons", sujet: M[0], reponse: bonnes[0], explication: "" }, o);
      case "V_loge_chez": return !memeRolePossible({ role: "Locataire", sujet: M[0], reponse: bonnes[0], explication: texte }, o) && o.classe === bonnes[0].classe;
      case "V_pond_chez": return o.classe === "Oiseau" && !/Passéri|Cuculi/.test(o.ordre || "");
      case "pond_chez_V": return o.classe === "Oiseau" && !/Cuculi/.test(o.ordre || "");
      case "V_se_fixe_sur": return o.classe !== bonnes[0].classe && !(M[0].classe === "Arachnide" && VERTEBRES.includes(o.classe)) && !(M[0].classe === "Poisson" && o.classe === "Poisson");
      case "se_fixe_sur_V": return !["Arachnide", "Annélide"].includes(o.classe) && o.ordre !== bonnes[0].ordre && !/lamproie|sangsue|tique/i.test(o.nom_courant);
    }
    return false;
  });
}
function questionsVoisins(x) {
  if (!R298) return [];
  const rel = relationsVoisins(x);
  // les unités (un voisin, ou un groupe de deux) et leurs bonnes réponses, pour chaque sens
  const unites = new Map();
  for (const r of rel) {
    const k = r.membres.map(e => e.nom_courant).sort().join("+") + "|" + r.sens;
    if (!unites.has(k)) unites.set(k, { membres: r.membres, groupe: r.groupe, sens: r.sens, bonnes: [], explications: [], classeur: false });
    const u = unites.get(k);
    if (!u.bonnes.includes(r.S)) u.bonnes.push(r.S);
    // une phrase par bonne réponse : celle du classeur d'abord (relue), sinon celle des fiches
    u.parS = u.parS || new Map();
    if (!u.parS.has(r.S) || (r.classeur && !u.parS.get(r.S).classeur)) u.parS.set(r.S, r);
    u.explications = [...new Set([...u.parS.values()].map(z => z.explication))];
    u.classeur = u.classeur || r.classeur;
    if (r.groupe && !u.groupe) u.groupe = r.groupe;
  }
  // une espèce « bonne » dans l'autre sens pour le même voisin n'est jamais un piège (piegesVoisin : par le lien, ou ici)
  const bonnesDe = new Map();
  for (const u of unites.values()) for (const V of u.membres) bonnesDe.set(V, [...(bonnesDe.get(V) || []), ...u.bonnes]);
  const possibles = [];
  for (const u of unites.values()) {
    if (u.bonnes.length > 3) continue;                                // plus de 3 bonnes réponses : trop large pour une question
    u.pieges = piegesVoisin(u, x).filter(o => !u.membres.some(V => (bonnesDe.get(V) || []).includes(o)));
    if (u.pieges.length < 2) continue;
    possibles.push(u);
  }
  // le classeur d'abord (ses phrases sont relues), puis les fiches ; des voisins différents ; des sens variés
  const pris = [], vus = new Set(), sensPris = [];
  for (const passe of [0, 1]) for (const u of melanger(possibles.slice()).sort((a, b) => b.classeur - a.classeur)) {
    if (pris.length >= VOISINS_MAX || pris.includes(u) || u.membres.some(e => vus.has(e))) continue;
    if (passe === 0 && sensPris.includes(u.sens)) continue;
    // R299 : jamais deux voisins dont la seule bonne réponse est la même espèce (la seconde serait retirée plus loin)
    if (leOn() && u.bonnes.length === 1 && pris.some(p => p.bonnes.length === 1 && p.bonnes[0] === u.bonnes[0])) continue;
    pris.push(u); u.membres.forEach(e => vus.add(e)); sensPris.push(u.sens);
  }
  return pris.map((u, i) => {
    const V = u.membres.length > 1 ? `les ${minuscule(String(u.groupe).replace(/^autres?\s+/i, "").replace(/\s*\(.*?\)/g, "")).replace(/ et /g, " et les ").replace(/, /g, ", les ")}` : leNom(u.membres[0]);
    const n = u.bonnes.length;
    const pieges = melanger(u.pieges.slice()).slice(0, Math.max(2, 4 - n));
    const choix = melanger([...u.bonnes.map(e => choixEspece(e, true)), ...pieges.map(o => choixEspece(o))]);
    return { type: "voisins", cle: "voisins" + (i + 1), sens: u.sens, question: FORMES_VOISINS[u.sens](V, n, lieuDuTitre(x), u.membres[0]), montrees: [],
             voisin: { noms: u.membres.map(e => e.nom_courant), lieu: x.chapitre, titres: u.membres.map(e => titreExpDe(e, x)) },
             choix, plusieurs: n > 1, explication: u.explications.join(" "),
             liensEspeces: [...new Set([...u.parS.values()].map(z => z.lienEspece).filter(Boolean))],   // R299 (pour les comptes du test)
             especes: [...u.membres, ...u.bonnes].map(e => e.nom_courant) };
  });
}

// ---- Type 2 · Le même chasseur ----
// R298 : aussi un nom de groupe qui ne désigne qu'une espèce du lieu (« Faucons » → le faucon crécerelle, seul faucon du lieu)
function chasseursDe(e, x) {
  const s = new Set();
  for (const it of itemsDe(e, "predateurs")) {
    const n = especeNommee(it); if (n) { s.add(n); continue; }
    if (R298 && x) { const m = membresDuGroupe(it, x); if (m.length === 1 && groupeVraisemblable(m[0], e)) { s.add(m[0]); (chasseursDe.groupes = chasseursDe.groupes || new Map()).set(e.nom_courant + "|" + m[0].nom_courant, it); } }
  }
  // R299 : un mangeur typique de liens_especes.js, s'il vit dans ce lieu (jamais le trésor)
  if (leOn() && x) for (const l of indexLiensEspeces().versB.get(e.nom_courant) || []) {
    const h = especeParNom(l.a);
    if (!h || s.has(h) || !especesDuLieu(x).includes(h) || !lienTypique(h, e, "mange", x)) continue;
    s.add(h); (chasseursDe.liens = chasseursDe.liens || new Map()).set(e.nom_courant + "|" + h.nom_courant, l);
  }
  return s;
}
const RE_CHASSEUR = /carniv|piscivo|insectivo|omniv/i;
function candidatChasseur(x, sansChat) {
  const compte = new Map();
  for (const e of x.liste) for (const h of chasseursDe(e, x)) if (!x.liste.includes(h)) compte.set(h, [...(compte.get(h) || []), e]);
  const min = Math.max(3, Math.ceil(x.liste.length / 2));
  const bons = [...compte].filter(([h, l]) => l.length >= min && !(sansChat && h === CHAT));
  if (!bons.length) return null;
  bons.sort((p, q) => q[1].length - p[1].length || (p[0] === CHAT) - (q[0] === CHAT));
  const [h, proies] = bons[0];
  // les pièges : des chasseurs du territoire, de la même classe, qu'aucune espèce montrée ne cite (ni par nom ni par groupe)
  // et dont la fiche ne cite aucune d'elles parmi ses proies
  // « chasseurs du même milieu » : même régime que le vrai chasseur (un carnivore → des carnivores), le même ordre d'abord
  // (un rapace → des rapaces), puis le même milieu
  const milieu = h.hors_jeu ? null : h.milieu_principal, regime = h.hors_jeu ? "carnivore" : String(h.regime_alimentaire_type || "");
  const base = ESPECES.filter(p => p !== h && !x.liste.includes(p) && especeDuTerritoire(p, x.territoire) && p.classe === h.classe
      && !proies.some(e => lienBloque(e, p, "mange"))   // R299 : jamais un mangeur (typique ou rare) d'une espèce montrée…
      && !(leOn() && proies.some(e => pourraitManger(p, e, x)))   // … ni un chasseur qui pourrait en prendre une (la cigogne et les oisillons)
      && RE_CHASSEUR.test(String(p.regime_alimentaire_type || "")) && (!/carniv|piscivo/.test(regime) || /carniv|piscivo/.test(String(p.regime_alimentaire_type || "")))
      && !proies.some(e => citeOuGroupe(e, "predateurs", p) || citeOuGroupe(p, "proies", e) || (R298 && (citeLarge(e, "predateurs", p, x) || citeLarge(p, "proies", e, x)))));
  // Étape R295 (51.03) : avant, le même ordre comptait plus que le milieu (aigle royal, vautour moine, balbuzard pour l'épervier,
  //   chasseur des oiseaux du jardin). Maintenant : jamais un mangeur de charognes ni un pêcheur quand les proies ne vivent pas
  //   dans l'eau ; d'abord le même milieu (celui du chasseur ou de ses proies), puis le même ordre, puis une taille voisine.
  const proiesAquatiques = proies.some(e => grandMilieu(e) !== "terre");
  const texteProies = p => [p.type_proie_detaille, p.proies].map(v => Array.isArray(v) ? v.join(", ") : String(v || "").trim()).filter(Boolean).join(" ; ");
  const charognard = p => /^(charogn|os de|poissons morts|cadavres)/i.test(texteProies(p));
  const milieuxProies = new Set(proies.map(e => e.milieu_principal));
  const grandsMilieuxProies = new Set(proies.map(grandMilieu));   // le chat du jardin : jamais un dauphin (avant : dauphins, cachalot)
  const th = h.hors_jeu ? null : tailleNombre(h);
  const proche = p => { const tp = tailleNombre(p); return th && tp ? Math.max(th, tp) / Math.min(th, tp) <= 2 : false; };
  const dansSonMonde = base.filter(p => !charognard(p) && grandsMilieuxProies.has(grandMilieu(p))
    && (proiesAquatiques || !/piscivo/i.test(String(p.regime_alimentaire_type || ""))));
  const pieges = (dansSonMonde.length >= 2 ? dansSonMonde : base)
    .map(p => [p, (p.milieu_principal === milieu || milieuxProies.has(p.milieu_principal) ? 3 : 0)
                  + (!h.hors_jeu && p.ordre === h.ordre ? 2 : 0) + (proche(p) ? 1 : 0) + Math.random() * 0.5])
    .sort((a, b) => b[1] - a[1]).map(a => a[0]);
  if (pieges.length < 2) return null;
  return { chasseur: h, proies, pieges: pieges.slice(0, 3) };
}
// Le chat : une fois par lieu au plus (la première expédition du lieu, dans l'ordre, où il serait le chasseur)
function chatPermis(x) {
  const autres = expeditionsDe(x.territoire).filter(y => y.chapitre === x.chapitre && y.ordre < x.ordre);
  return !autres.some(y => { const c = candidatChasseur(y, false); return c && c.chasseur === CHAT; });
}
function questionChasseur(x) {
  let c = candidatChasseur(x, false);
  if (c && c.chasseur === CHAT && !chatPermis(x)) c = candidatChasseur(x, true);
  if (!c) return null;
  const h = c.chasseur, n = c.proies.length;
  const choix = melanger([h.hors_jeu ? { texte: h.nom_courant, bonne: true } : choixEspece(h, true), ...c.pieges.map(p => choixEspece(p))]);
  const lignes = [`${LeNomOuChat(h)} compte parmi les chasseurs ${listeEt(c.proies.map(deNom))}.`];
  // R298 : quand une fiche le cite par son groupe, l'explication le dit (« La fiche du campagnol cite les faucons : ici, le faucon crécerelle. »)
  const parGroupe = new Map();
  for (const e of c.proies) { const it = chasseursDe.groupes && chasseursDe.groupes.get(e.nom_courant + "|" + h.nom_courant);
    if (it && !itemsDe(e, "predateurs").some(i => especeNommee(i) === h)) { const g = minuscule(it.replace(/\s*\(.*?\)/g, "")); parGroupe.set(g, [...(parGroupe.get(g) || []), e]); } }
  for (const [g, l] of parGroupe) lignes.push(l.length > 1
    ? `Les fiches ${listeEt(l.map(deNom))} citent les ${g} parmi leurs prédateurs : ici, ${leNom(h)}.`
    : `La fiche ${deNom(l[0])} cite les ${g} parmi ses prédateurs : ici, ${leNom(h)}.`);
  // R299 : les phrases des liens typiques (deux au plus)
  const liensE = c.proies.map(e => chasseursDe.liens && chasseursDe.liens.get(e.nom_courant + "|" + h.nom_courant)).filter(Boolean)
    .filter(l => !itemsDe(l.b && especeParNom(l.b), "predateurs").some(i => especeNommee(i) === h));
  for (const ph of [...new Set(liensE.map(l => l.phrase))].slice(0, 2)) lignes.push(ph);
  for (const p of c.pieges) { const m = itemsDe(p, "proies"); if (m.length) lignes.push(`Ce que mange ${leNom(p)} : ${m.join(", ").toLowerCase()}.`); }
  return { type: "chasseur", question: `Ces ${NOMBRES_MOTS[n] || n} espèces ont un même chasseur. Lequel ?`, montrees: c.proies.map(e => e.nom_courant),
           choix, plusieurs: false, explication: lignes.join(" "), especes: c.proies.map(e => e.nom_courant), liensEspeces: [...new Set(liensE.map(l => l.id))] };
}
function LeNomOuChat(h) { return h === CHAT ? "Le chat domestique" : LeNom(h); }

// ---- Type 3 · Le jour et la nuit ----
function activiteNette(e) { if (!confirme(e, "activite")) return null; const v = String(e.activite).trim(); return v === "Surtout le jour" ? "jour" : v === "Surtout la nuit" ? "nuit" : null; }
function questionJourNuit(x) {
  const l = x.liste.filter(activiteNette), nuit = l.filter(e => activiteNette(e) === "nuit"), jour = l.filter(e => activiteNette(e) === "jour");
  if (l.length < 3 || !nuit.length || !jour.length) return null;
  let question, bonnes;
  if (nuit.length === 1) { question = "Une seule de ces espèces est active surtout la nuit. Laquelle ?"; bonnes = nuit; }
  else if (jour.length === 1) { question = "Une seule de ces espèces est active surtout le jour. Laquelle ?"; bonnes = jour; }
  else { question = "Lesquelles de ces espèces sont actives surtout la nuit ?"; bonnes = nuit; }
  const explication = `Surtout la nuit : ${listeEt(nuit.map(leNom))}. Surtout le jour : ${listeEt(jour.map(leNom))}.`;
  return { type: "jour_nuit", question, montrees: [], choix: melanger(l.map(e => choixEspece(e, bonnes.includes(e)))),
           plusieurs: bonnes.length > 1 || (nuit.length > 1 && jour.length > 1), explication, especes: l.map(e => e.nom_courant) };
}

// ---- Type 4 · Le calendrier du lieu (l'hiver seulement) ----
// La colonne hiver d'abord (étape E2-1), quand elle est remplie ; sinon migrateur_resident (valeurs nettes) et hibernation.
const HIVER_VALEURS = { "part de la région": "part", "reste actif": "actif", "s'endort ou ralentit": "endormi", "en partie": null };
const MIGRATEUR_DOUTEUX = /partiel|\bou\b|irrupt|errati|quelques|hivernant|disperse|descend|invasion|selon/i;
function etatHiver(e) {
  if (confirme(e, "hiver")) { const v = String(e.hiver).trim().toLowerCase().replace(/’/g, "'"); return v in HIVER_VALEURS ? HIVER_VALEURS[v] : null; }
  if (confirme(e, "migrateur_resident")) {
    const v = String(e.migrateur_resident).trim();
    if (MIGRATEUR_DOUTEUX.test(v.replace(/\(sédentaire\)/i, ""))) return null;
    if (/^migrat(eur|rice)/i.test(v)) return "part";
    if (/^(sédentaire|résident)/i.test(v) && !/migrat/i.test(v.replace(/^résident \(sédentaire\)/i, ""))) return "actif";
    return null;
  }
  if (confirme(e, "hibernation")) {
    const v = String(e.hibernation).trim(), d = String(e.hibernation_detail || "");
    if (v === "Oui") return "endormi";
    if (v === "Non" && !/léthargi|torpeur|dormance|ralenti/i.test(d)) return "actif";
  }
  return null;
}
function ouHiverne(e) {
  const m = String(e.migrateur_resident || "").match(/hiverne (surtout |au large |sur les côtes )?(en|au|aux|dans|sur)\b([^;),]*)/i);
  return m ? `passe l'hiver ${m[0].replace(/^hiverne\s*/i, "").trim()}` : null;
}
function questionCalendrier(x, dejaMontrees) {
  const l = x.liste.filter(etatHiver);
  if (l.length < 3) return null;
  const part = l.filter(e => etatHiver(e) === "part"), dort = l.filter(e => etatHiver(e) === "endormi");
  if (dejaMontrees && dejaMontrees.length === l.length && l.every(e => dejaMontrees.includes(e.nom_courant))) return null;   // pas les mêmes espèces que « jour et nuit »
  let question, bonnes, sujet;
  if (part.length && part.length < l.length) {
    sujet = "part"; bonnes = part;
    if (part.length === 1) question = `${PERIODE_HIVER}, une seule de ces espèces quitte la région. Laquelle ?`;
    else if (l.length - part.length === 1) { question = `${PERIODE_HIVER}, une seule de ces espèces reste dans la région. Laquelle ?`; bonnes = l.filter(e => !part.includes(e)); }
    else question = `${PERIODE_HIVER}, lesquelles de ces espèces quittent la région ?`;
  } else if (dort.length && dort.length < l.length) {
    sujet = "endormi"; bonnes = dort;
    if (dort.length === 1) question = `${PERIODE_HIVER}, une seule de ces espèces passe l'hiver endormie ou au ralenti. Laquelle ?`;
    else if (l.length - dort.length === 1) { question = `${PERIODE_HIVER}, une seule de ces espèces reste active. Laquelle ?`; bonnes = l.filter(e => !dort.includes(e)); }
    else question = `${PERIODE_HIVER}, lesquelles de ces espèces passent l'hiver endormies ou au ralenti ?`;
  } else return null;
  // l'explication : une phrase par espèce qui part ou s'endort, une seule ligne pour celles qui restent actives
  const lignes = [];
  for (const e of l) {
    const s = etatHiver(e), d = String(e.hibernation_detail || "").trim();
    if (s === "part") lignes.push(`${LeNom(e)} ${ouHiverne(e) || "quitte la région en hiver"}.`);
    if (s === "endormi") lignes.push(`${LeNom(e)} passe l'hiver ${accordE(e, "endormi")}${estRenseigne(e.hibernation_detail) && d ? " : " + d.charAt(0).toLowerCase() + d.slice(1) : ""}.`);
  }
  const actives = l.filter(e => etatHiver(e) === "actif");
  if (actives.length) lignes.push(`${actives.length > 1 ? "Restent actives dans la région" : `Reste ${feminin(actives[0]) ? "active" : "actif"} dans la région`} : ${listeEt(actives.map(leNom))}.`);
  return { type: "calendrier", question, montrees: [], choix: melanger(l.map(e => choixEspece(e, bonnes.includes(e)))),
           plusieurs: !/une seule/.test(question), explication: lignes.join(" "), especes: l.map(e => e.nom_courant), sujet };
}

// ---- Type 5 · Sa place dans le lieu ----
// Les éléments du lieu dits de façon générale (« dans les berges d'un étang », pas « de l'étang »).
const ELEMENTS_GENERAUX = {
  "La roselière": "Dans une roselière", "Les gros arbres": "Dans de gros arbres", "Les toits des maisons": "Sous le toit d'une maison",
  "Les prairies humides": "Dans une prairie humide", "Les plantes flottantes de l'étang": "Parmi les plantes flottantes d'un étang",
  "Les sables nus": "Dans le sable nu", "Les vieilles souches": "Dans une vieille souche", "Les vieux murs": "Dans un vieux mur",
  "La lande": "Dans une lande", "Les berges de l'étang": "Dans les berges d'un étang", "La falaise": "Sur une falaise",
  "Les petits ruisseaux": "Dans un petit ruisseau", "Les arbres morts": "Dans un arbre mort", "Les haies d'épineux": "Dans une haie d'épineux",
  "Les berges abruptes": "Dans une berge abrupte", "Les grèves de sable": "Sur une grève de sable", "Les pins": "Dans les pins",
  "Les champs cultivés": "Dans un champ cultivé", "Les vieux ponts": "Sous un vieux pont", "Les fourmilières": "Dans une fourmilière",
  "Les vasières": "Dans une vasière", "Les fonds de sable": "Sur un fond de sable", "Les saules": "Sur les saules",
  "Les herbiers marins": "Dans un herbier marin", "Les éboulis": "Dans un éboulis", "La neige": "Dans la neige", "Le gui": "Sur le gui",
  "Les vieilles granges": "Dans une vieille grange", "Les galets de la steppe": "Parmi les galets d'une steppe", "Les orties": "Sur les orties",
  "Les arbousiers": "Sur les arbousiers", "Les grottes sous-marines": "Dans une grotte sous-marine", "Les marais salants": "Dans un marais salant",
  "Les laisses de mer": "Dans une laisse de mer", "Les férules": "Sur les férules", "Les sphaignes": "Dans les sphaignes",
  "Les ornières": "Dans une ornière", "Les oseilles": "Sur les oseilles", "Les chardons": "Sur les chardons", "Les ormes": "Sur les ormes",
  "Le chèvrefeuille": "Sur le chèvrefeuille", "Les violettes": "Sur les violettes", "Les patiences": "Sur les patiences", "Les orpins": "Sur les orpins",
};
// R302 (Notion 48.22) : les liens d'élément neufs (Données\liens_elements.xlsx → liens_elements.js) s'ajoutent à ceux du lieu pour
//   « Sa place » (les deux formes), pour écarter les pièges et pour « Et si… ? » ; jamais pour la finale du lieu.
//   LIENS_ELEMENTS = false → l'étape de R301.
const LIENS_ELEMENTS = true;
let LEL_ACTIFS = LIENS_ELEMENTS;      // (mis à false un instant par test_jeu.py pour mesurer)
function liensElementsEnPlus() { return LEL_ACTIFS && typeof LIENS_ELEMENTS_DONNEES !== "undefined" ? LIENS_ELEMENTS_DONNEES : []; }
function liensElementsDuLieu(t, nom) {
  return [...liensDuLieu(t, nom).filter(k => k.nature_b === "element"), ...liensElementsEnPlus().filter(k => k.territoire === t && k.lieu === nom && especeParNom(k.a))];
}
function elementsDe(nom) { return new Set([...tousLesLiens(), ...liensElementsEnPlus()].filter(l => l.nature_b === "element" && l.a === nom).map(l => l.b)); }
function candidatsPlace(x) {
  const noms = new Set(x.liste.map(e => e.nom_courant));
  const c = x.chapitre && chapitreParNom(x.territoire, x.chapitre);
  return (c ? liensElementsDuLieu(x.territoire, c.nom) : []).filter(k => noms.has(k.a) && ELEMENTS_GENERAUX[k.b]
    && (k.pieges || []).filter(p => ELEMENTS_GENERAUX[p] && !elementsDe(k.a).has(p)).length >= 2);
}
function questionPlace(x, eviter) {
  const l = candidatsPlace(x);
  if (!l.length) return null;
  const k = melanger(l.slice()).sort((p, q) => eviter.includes(p.a) - eviter.includes(q.a))[0];
  const pieges = k.pieges.filter(p => ELEMENTS_GENERAUX[p] && !elementsDe(k.a).has(p)).slice(0, 2);
  return { type: "place", question: k.question, montrees: [k.a],
           choix: melanger([{ texte: ELEMENTS_GENERAUX[k.b], bonne: true }, ...pieges.map(p => ({ texte: ELEMENTS_GENERAUX[p], bonne: false }))]),
           plusieurs: false, explication: String(k.phrase).trim().replace(/([^.!?])$/, "$1."), especes: [k.a] };
}

// R298 (choix « A mixte ») : jusqu'à 2 questions « Sa place » par expédition (2 espèces différentes). Forme « élément en photo »
//   quand c'est sûr : l'élément montré (photo d'ELEMENTS, nom dit de façon générale), « Laquelle / Lesquelles de ces espèces y
//   installent leur nid ? », réponses = espèces de l'expédition. Sûr = au moins 2 pièges dont le nid (emplacement_nid et
//   emplacement_nid_autres) ne peut pas être dans cet élément, et aucun lien vers cet élément. Sinon, la forme d'avant
//   (l'espèce montrée, des éléments en réponse). Les liens qui nomment une plante (orties, saules, gui…) restent tels quels.
const NIDS_BATI = ["Bâtiment", "Cavité d'arbre", "Falaise ou paroi rocheuse"], NIDS_ARBRE = ["Cavité d'arbre", "Arbre ou buisson"];
const ELEMENTS_EN_PHOTO = {
  "Les toits des maisons": { dit: "Le toit d'une maison", nids: NIDS_BATI }, "Les vieilles granges": { dit: "Une vieille grange", nids: NIDS_BATI },
  "Les vieux murs": { dit: "Un vieux mur", nids: NIDS_BATI }, "Les vieux ponts": { dit: "Un vieux pont", nids: NIDS_BATI },
  "Les gros arbres": { dit: "De gros arbres", nids: NIDS_ARBRE }, "Les arbres morts": { dit: "Un arbre mort", nids: NIDS_ARBRE },
  "Les vieilles souches": { dit: "Une vieille souche", nids: NIDS_ARBRE },
  "Les haies d'épineux": { dit: "Une haie d'épineux", nids: ["Arbre ou buisson", "Au sol"] },
  "La roselière": { dit: "Une roselière", nids: ["Roselière ou végétation dense", "Sur l'eau (nid flottant)", "Au sol"] },
  "La falaise": { dit: "Une falaise", nids: ["Falaise ou paroi rocheuse", "Terrier"] },
  "Les berges abruptes": { dit: "Une berge abrupte", nids: ["Falaise ou paroi rocheuse", "Terrier"] },
};
const PHRASE_DE_NID = /nich|\bnid|pond|couv|eleve ses petits|creuse son terrier/;   // (le martin-pêcheur creuse son terrier-nid dans une berge abrupte)
function candidatsPlaceEnPhoto(x) {
  const c = x.chapitre && chapitreParNom(x.territoire, x.chapitre);
  if (!c) return [];
  const liens = [...tousLesLiens(), ...liensElementsEnPlus()].filter(k => k.territoire === x.territoire && k.lieu === c.nom && k.nature_b === "element");
  const res = [];
  for (const el of Object.keys(ELEMENTS_EN_PHOTO)) {
    if (!photoElement(el)) continue;
    const ici = liens.filter(k => k.b === el && x.liste.some(e => e.nom_courant === k.a));
    const bonnesL = ici.filter(k => PHRASE_DE_NID.test(sansAccent(k.phrase || "")) && nidNet(especeParNom(k.a)));
    if (!bonnesL.length) continue;
    const bonnes = [...new Set(bonnesL.map(k => especeParNom(k.a)))];
    const lies = new Set(ici.map(k => k.a));
    const pieges = x.liste.filter(o => !lies.has(o.nom_courant) && !elementsDe(o.nom_courant).has(el) && nidNet(o)
      && !nidsPossibles(o).some(v => ELEMENTS_EN_PHOTO[el].nids.includes(v)));
    if (pieges.length < 2 || bonnes.length > 3) continue;
    const phrases = [...new Set(bonnesL.map(k => String(k.phrase).trim().replace(/([^.!?])$/, "$1.")))];
    res.push({ element: el, bonnes, pieges, phrases });
  }
  return res;
}
function questionPlaceEnPhoto(x, p) {
  const n = p.bonnes.length, info = ELEMENTS_EN_PHOTO[p.element];
  const pieges = melanger(p.pieges.slice()).slice(0, Math.max(2, 4 - n));
  return { type: "place", forme: "element", question: n > 1 ? "Lesquelles de ces espèces y installent leur nid ?" : "Laquelle de ces espèces y installe son nid ?",
           montrees: [], element: { nom: p.element, dit: info.dit, photo: photoElement(p.element) },
           choix: melanger([...p.bonnes.map(e => choixEspece(e, true)), ...pieges.map(o => choixEspece(o))]), plusieurs: n > 1,
           explication: p.phrases.join(" "), especes: [...p.bonnes, ...pieges].map(e => e.nom_courant), sujets: p.bonnes.map(e => e.nom_courant) };
}
function questionsPlace(x, eviter) {
  if (!R298) { const q = questionPlace(x, eviter); return q ? [q] : []; }
  const res = [], pris = new Set();
  for (const p of melanger(candidatsPlaceEnPhoto(x))) {
    if (res.length >= PLACE_MAX || p.bonnes.some(e => pris.has(e.nom_courant))) continue;
    const q = questionPlaceEnPhoto(x, p); res.push(q); q.sujets.forEach(n => pris.add(n));
  }
  const classiques = melanger(candidatsPlace(x).slice()).sort((p, q) => eviter.includes(p.a) - eviter.includes(q.a));
  for (const k of classiques) {
    if (res.length >= PLACE_MAX || pris.has(k.a)) continue;
    const pieges = k.pieges.filter(p => ELEMENTS_GENERAUX[p] && !elementsDe(k.a).has(p)).slice(0, 2);
    res.push({ type: "place", question: k.question, montrees: [k.a],
               choix: melanger([{ texte: ELEMENTS_GENERAUX[k.b], bonne: true }, ...pieges.map(p => ({ texte: ELEMENTS_GENERAUX[p], bonne: false }))]),
               plusieurs: false, explication: String(k.phrase).trim().replace(/([^.!?])$/, "$1."), especes: [k.a] });
    pris.add(k.a);
  }
  return res;
}

// ---- Type 6 · Les nouveaux venus ----
// Jamais les introductions très anciennes ou discutées ; jamais en piège une espèce réintroduite ou introduite ici (« venue d'ailleurs » serait à moitié vrai).
const NOUVEAUX_VENUS_EXCLUS = ["Carpe commune", "Genette commune", "Rat noir", "Surmulot", "Souris grise"];
const ORIGINE_DISCUTEE = ["Bouquetin des Alpes", "Bouquetin ibérique", "Castor d'Europe", "Vautour fauve", "Vautour moine", "Gypaète barbu",
  "Ours brun", "Lynx boréal", "Marmotte des Alpes", "Cigogne blanche", "Faisan de Colchide", "Lapin de garenne", "Daim", "Mouflon de Corse",
  "Perdrix rouge", "Truite arc-en-ciel", "Vautour percnoptère", "Grand tétras"];
function estIntroduite(e) { return confirme(e, "origine") && e.origine === "Introduite" && !NOUVEAUX_VENUS_EXCLUS.includes(e.nom_courant); }
function estDIci(e) { return confirme(e, "origine") && e.origine === "Indigène" && !ORIGINE_DISCUTEE.includes(e.nom_courant); }
function dateArrivee(d) {
  const t = String(d || "").trim();
  if (!estRenseigne(d) || !t) return "";
  if (/^\d/.test(t)) return "en " + t;
  if (/^années/i.test(t)) return "dans les " + t.toLowerCase();
  if (/^moyen/i.test(t)) return "au " + t;
  return t.charAt(0).toLowerCase() + t.slice(1);
}
function questionNouveauxVenus(x) {
  const intro = x.liste.filter(estIntroduite), ici = x.liste.filter(estDIci);
  if (!intro.length || ici.length < 2) return null;
  const e = melanger(intro.slice())[0];
  const lignes = [];
  const quand = dateArrivee(e.introduction_date);
  lignes.push(`${LeNom(e)} est ${accordE(e, "arrivé")} en France${quand ? " " + quand : ""}${confirme(e, "venue_de") ? `, ${accordE(e, "venu")} ${String(e.venue_de).trim()}` : ""}.`);
  const effet = tousLesLiens().find(l => l.role === "Nouveau venu" && l.a === e.nom_courant && l.territoire === x.territoire)
             || tousLesLiens().find(l => l.role === "Nouveau venu" && l.a === e.nom_courant);
  if (effet) lignes.push(effet.phrase.replace(/\.?$/, "."));
  const montrees = melanger(ici.slice()).slice(0, 3);
  return { type: "nouveaux", question: "Laquelle de ces espèces est venue d'ailleurs ?", montrees: [],
           choix: melanger([choixEspece(e, true), ...montrees.map(o => choixEspece(o))]), plusieurs: false,
           explication: lignes.join(" "), especes: [e.nom_courant, ...montrees.map(o => o.nom_courant)] };
}

// ---- Type 7 · Les plus fragiles (une fois par lieu au plus) ----
const STATUTS_MENACES = ["Vulnérable", "En danger", "En danger critique"];
function statutNet(e) { if (!confirme(e, "statut_conservation_france")) return null; const v = String(e.statut_conservation_france).trim(); return STATUTS_MENACES.includes(v) ? "menacee" : v === "Préoccupation mineure" ? "non" : null; }
function fragilesPossible(x) { const l = x.liste.filter(statutNet); return l.length >= 3 && l.some(e => statutNet(e) === "menacee") && l.some(e => statutNet(e) === "non"); }
function fragilesPermis(x) {   // la première expédition du lieu (dans l'ordre) où la question est possible
  // R268 : dans l'ordre d'origine (ordre), pas celui du chemin (rang) : le tirage de l'étape 2 reste le même
  const premiere = expeditionsDe(x.territoire).filter(y => y.chapitre === x.chapitre).sort((a, b) => a.ordre - b.ordre).find(fragilesPossible);
  return !!premiere && premiere.id === x.id;
}
function questionFragiles(x) {
  // R298 : dans chaque expédition où la question est possible (la règle « une fois par lieu » du 14/11 est remplacée)
  if (!fragilesPossible(x) || (!R298 && !fragilesPermis(x))) return null;
  const l = x.liste.filter(statutNet), men = l.filter(e => statutNet(e) === "menacee"), non = l.filter(e => statutNet(e) === "non");
  let question, bonnes;
  if (non.length === 1) { question = "À ce jour, une seule de ces espèces n'est pas menacée en France. Laquelle ?"; bonnes = non; }
  else if (men.length === 1) { question = "À ce jour, une seule de ces espèces est menacée en France. Laquelle ?"; bonnes = men; }
  else { question = "À ce jour, lesquelles de ces espèces sont menacées en France ?"; bonnes = men; }
  const lignes = men.map(e => `${LeNom(e)} : ${String(e.statut_conservation_france).toLowerCase()} sur la liste rouge de France${confirme(e, "cause_declin") ? " (" + String(e.cause_declin).trim().replace(/\.$/, "") + ")" : ""}.`);
  lignes.push(`Pas menacée${non.length > 1 ? "s" : ""} à ce jour : ${listeEt(non.map(leNom))}.`);
  return { type: "fragiles", question, montrees: [], choix: melanger(l.map(e => choixEspece(e, bonnes.includes(e)))),
           plusieurs: !/une seule/.test(question), explication: lignes.join(" "), especes: l.map(e => e.nom_courant) };
}

// ---- Type R298 · Les questions comparées (choix V1), derrière COMPAREES_EN_LIGNE ----
// « Ce qu'elles mangent » (proies_groupes, groupes parlants seulement ; jamais regime_alimentaire_type ; jamais « surtout » :
//   l'ordre de la liste ne dit pas l'importance) et « Comment elles se défendent » (défense principale = oui ; ni principale ni
//   secondaire = non ; une espèce qui l'a en secondaire n'est pas montrée ; jamais « Fuite » ni « Refuge »).
// Forme « une seule » quand une espèce diffère. 2 au plus par expédition. Insectes : pour « ce qu'elles mangent », seulement
//   criquets, sauterelles, punaises et mantes (R297 : chez les autres, la larve ne mange pas comme l'adulte) ; pour la défense,
//   jamais un papillon (la défense notée peut être celle de la chenille tant que le stade n'est pas noté).
// Une comparée réussie note « trouvé » le sujet d'Approfondir « Ce qu'elle mange » (proies) des espèces montrées.
//   La défense n'est pas un sujet d'Approfondir (elle est dans « Sa vie ») : rien n'est noté pour elle.
const GROUPES_PARLANTS = { "Insectes": "des insectes", "Fruits et graines": "des graines ou des fruits", "Herbes et feuilles": "des herbes ou des feuilles",
  "Nectar, pollen et sève": "du nectar, du pollen ou de la sève", "Poissons": "des poissons", "Petits mammifères": "de petits mammifères",
  "Oiseaux et œufs": "des oiseaux ou leurs œufs", "Charognes et os": "des charognes", "Algues et plancton": "des algues ou du plancton",
  "Crustacés": "des crustacés", "Amphibiens et reptiles": "des amphibiens ou des reptiles" };
const DEFENSES_DITES = { "Camouflage": "le camouflage", "Défense en groupe": "la défense en groupe", "Venin, poison ou acide": "un venin, un poison ou un acide",
  "Odeur ou goût repoussant": "une odeur ou un goût repoussant", "Intimidation (se gonfle, siffle)": "l'intimidation (se gonfler, siffler)",
  "Morsure, cornes ou serres": "la morsure, les cornes ou les serres", "Se cache dans sa coquille": "sa coquille", "Couleurs d'avertissement": "des couleurs d'avertissement",
  "Perte de la queue": "la perte de la queue", "Pinces": "ses pinces", "Se met en boule": "se mettre en boule", "Piquants ou poils urticants": "des piquants ou des poils urticants",
  "Régurgitation": "la régurgitation", "Fait le mort": "faire le mort", "Perte d'un membre": "la perte d'un membre" };
const GROUPES_NEGATIFS = { "Insectes": "d'insectes", "Fruits et graines": "de graines ni de fruits", "Herbes et feuilles": "d'herbes ni de feuilles",
  "Nectar, pollen et sève": "de nectar, de pollen ni de sève", "Poissons": "de poissons", "Petits mammifères": "de petits mammifères",
  "Oiseaux et œufs": "d'oiseaux ni d'œufs", "Charognes et os": "de charognes", "Algues et plancton": "d'algues ni de plancton",
  "Crustacés": "de crustacés", "Amphibiens et reptiles": "d'amphibiens ni de reptiles" };
// Les défenses « du corps » (coquille, pinces, piquants, morsure) : comparées seulement entre animaux de classes différentes
//   (la coque a une coquille même si sa défense notée est la fuite ; le renard mord même si sa défense notée est la fuite)
const DEFENSES_DU_CORPS = ["Se cache dans sa coquille", "Pinces", "Piquants ou poils urticants", "Morsure, cornes ou serres"];
const ORDRES_QUI_MORDENT = /Carniv|Accipitri|Falconi|Strigi|Squamat|Serpent|Crocod|Rongeur/;
const ORDRES_MANGENT_COMME_ADULTE = ["Orthoptères", "Hémiptères", "Mantoptères"];
function groupesComparables(e) {
  if (!confirme(e, "proies_groupes")) return null;
  if (e.classe === "Insecte" && !ORDRES_MANGENT_COMME_ADULTE.includes(e.ordre)) return null;
  return listeGroupes(e.proies_groupes);
}
function defensesDe(e) {
  if (!confirme(e, "defense_principale") || (e.classe === "Insecte" && e.ordre === "Lépidoptères")) return null;
  const p = String(e.defense_principale).trim();
  if (!estRenseigne(p) || p === "NA") return null;
  const sec = confirme(e, "defenses_secondaires") ? String(e.defenses_secondaires).split(";").map(v => v.trim()).filter(v => v && v !== "NA") : [];
  return { principale: p, toutes: [p, ...sec] };
}
// Une question comparée : bonnes / non, ou une seule qui diffère
function formeComparee(oui, non, dit) {
  if (oui.length === 1) return { question: dit.une, bonnes: oui, oui };
  if (non.length === 1) return { question: dit.uneNon, bonnes: non, oui };
  return { question: dit.plusieurs, bonnes: oui, oui };
}
// R301 (Notion 48.21) : le garde-fou des données relues. Une espèce n'est montrée dans une comparée que si son sujet a été
//   relu (Données\comparees_verifiees.xlsx, onglet verifiees → comparees_verifiees.js), et jamais si elle est exclue pour ce
//   groupe ou cette défense (onglet exclusions : un groupe seulement « occasionnel », une case rose). COMPAREES_GARDE = false
//   seulement dans test_jeu.py, pour compter toutes les questions possibles.
let COMPAREES_GARDE = true;
function compareeAdmise(e, sorte, sujet) {
  if (!COMPAREES_GARDE) return true;
  const v = typeof COMPAREES_VERIFIEES === "undefined" ? null : COMPAREES_VERIFIEES;
  if (!v || !(v[sorte] || []).includes(e.nom_courant)) return false;
  return !(v.exclusions || []).some(x => x.espece === e.nom_courant && x.sujet === sorte && (!x.groupe || x.groupe === sujet));
}
function candidatsComparees(x) {
  const res = [];
  for (const [g, mots] of Object.entries(GROUPES_PARLANTS)) {
    const l = x.liste.filter(groupesComparables).filter(e => compareeAdmise(e, "mange", g));
    const oui = l.filter(e => groupesComparables(e).includes(g)), non = l.filter(e => !groupesComparables(e).includes(g));
    if (l.length < 3 || !oui.length || !non.length) continue;
    const f = formeComparee(oui, non, { une: `Une seule de ces espèces mange ${mots}. Laquelle ?`, uneNon: `Une seule de ces espèces ne mange pas ${GROUPES_NEGATIFS[g]}. Laquelle ?`,
                                        plusieurs: `Lesquelles de ces espèces mangent ${mots} ?` });
    const explication = `${oui.length > 1 ? "Mangent" : "Mange"} ${mots} : ${listeEt(oui.map(leNom))}. ${non.length > 1 ? "N'en mangent pas" : "N'en mange pas"} : ${listeEt(non.map(leNom))}.`;
    res.push({ sorte: "mange", sujet: g, l, ...f, explication, noter: "proies", ecart: Math.min(oui.length, non.length) });
  }
  for (const [d, mots] of Object.entries(DEFENSES_DITES)) {
    const avec = x.liste.filter(defensesDe).filter(e => compareeAdmise(e, "defense", d));
    const oui = avec.filter(e => defensesDe(e).principale === d);
    let non = avec.filter(e => !defensesDe(e).toutes.includes(d));
    if (DEFENSES_DU_CORPS.includes(d)) non = non.filter(e => !oui.some(o => o.classe === e.classe) && !(d.startsWith("Morsure") && ORDRES_QUI_MORDENT.test(e.ordre || "")));
    const l = [...oui, ...non];
    if (l.length < 3 || !oui.length || !non.length) continue;
    const f = formeComparee(oui, non, { une: `Une seule de ces espèces compte d'abord sur ${mots} pour se défendre. Laquelle ?`,
                                        uneNon: `Une seule de ces espèces ne se défend pas par ${mots}. Laquelle ?`,
                                        plusieurs: `Lesquelles de ces espèces comptent d'abord sur ${mots} pour se défendre ?` });
    const explication = `D'abord ${mots} : ${listeEt(oui.map(leNom))}. Pas ${mots} : ${listeEt(non.map(leNom))}.`;
    res.push({ sorte: "defense", sujet: d, l: x.liste.filter(e => l.includes(e)), ...f, explication, noter: null, ecart: Math.min(oui.length, non.length) });
  }
  return res;
}
function questionsComparees(x) {
  if (!R298 || !COMPAREES_EN_LIGNE) return [];
  const c = melanger(candidatsComparees(x)).sort((a, b) => (a.bonnes.length === 1 ? 0 : 1) - (b.bonnes.length === 1 ? 0 : 1));
  const pris = [];
  for (const passe of [0, 1]) for (const k of c) {   // une sur la nourriture et une sur la défense d'abord
    if (pris.length >= COMPAREES_MAX || pris.includes(k) || (passe === 0 && pris.some(p => p.sorte === k.sorte))) continue;
    pris.push(k);
  }
  return pris.map((k, i) => ({ type: "comparee", cle: "comparee" + (i + 1), sorte: k.sorte, sujet: k.sujet, negative: k.bonnes !== k.oui, question: k.question, montrees: [],
    choix: melanger(k.l.map(e => choixEspece(e, k.bonnes.includes(e)))), plusieurs: !/^Une seule/.test(k.question),
    explication: k.explication, especes: k.l.map(e => e.nom_courant), noter: k.noter }));
}
// Une comparée réussie : le sujet d'Approfondir est noté « trouvé » pour chaque espèce montrée (s'il existe pour elle)
function noterComparee(q) {
  if (!q || q.type !== "comparee" || !q.noter || typeof progression === "undefined") return;
  for (const n of q.especes || []) {
    const e = especeParNom(n);
    if (!e || typeof sujetsApprof !== "function" || !sujetsApprof(e).includes(q.noter) || nbBonnes(e, q.noter) > 0) continue;
    marquerVue(e);
    progression[e.nom_courant].acquis[q.noter] = 1;
    if (typeof noterRevue === "function") noterRevue(e, q.noter);
  }
}

// ---- Type 8 · Et si… ? (toujours la dernière) ----
// Une phrase fixe par lieu de nid (à vérifier une fois, 2 sources, avant la mise en ligne). « exclus » : lieux de nid trop proches
// pour être montrés comme « non » (un nid de bâtiment est souvent dans une cavité…). « milieu » : la bonne réponse doit vivre là.
const ET_SI = {
// Étape R236 (note 17 du 15/11) : « profite à » était à moitié vrai (le rougegorge, qui niche au sol, profite aussi des haies :
//   abri, nourriture). La question dit maintenant ce qu'elle juge : le lieu du nid. Et un nid au sol n'est plus montré comme « non »
//   pour les haies (souvent au pied d'une haie ou d'un buisson).
  "Cavité d'arbre": { question: "Garder les vieux arbres creux offre un lieu de nid auxquelles de ces espèces ?", exclus: ["Arbre ou buisson", "Bâtiment"] },
  "Bâtiment": { question: "Laisser des accès sous les toits et dans les vieux bâtiments offre un lieu de nid auxquelles de ces espèces ?", exclus: ["Cavité d'arbre"] },
  "Arbre ou buisson": { question: "Garder les haies, les buissons et les arbres offre un lieu de nid auxquelles de ces espèces ?", exclus: ["Cavité d'arbre", "Au sol", "Roselière ou végétation dense"] },
  "Roselière ou végétation dense": { question: "Garder les roselières offre un lieu de nid auxquelles de ces espèces ?", exclus: ["Au sol", "Sur l'eau (nid flottant)"],
    milieu: e => /Marais|Mares|Lacs|Estuaires/.test(e.milieu_principal || "") || /rosea|roseli|marais/i.test(String(e.habitat || "")) },
  // Étape R251 (12.6, choix d'Aubin du 17/11) : « avant l'été » était à moitié vrai (une fauche fin juin détruit encore des nichées ;
  //   LPO Isère, mesures agricoles du râle des genêts) : « avant la mi-juillet ». Les 4 autres phrases sont confirmées à 2 sources (LPO, OFB).
  // Étape R271 (test du 19/11, n° 18) : (a) « desquelles », « auxquelles » (avant : « de lesquelles », « à lesquelles ») ;
  //   (c) le rougegorge niche au sol, mais pas dans un pré de fauche (talus, pied de haie, sous-bois) : il était montré comme
  //   bonne réponse parce que son milieu est « Campagne, haies et jardins ». Maintenant, seule une espèce dont la fiche cite
  //   les prairies ou les prés (hors « prés salés », et hors mention d'hiver ou de nuit : la grue, la bécasse) est une bonne
  //   réponse ; les autres oiseaux qui nichent au sol ne sont montrés ni comme « oui » ni comme « non ».
  "Au sol": { question: "Ne pas faucher les prés avant la mi‑juillet protège le nid desquelles de ces espèces ?", exclus: ["Roselière ou végétation dense"],
    milieu: e => nicheDansLesPres(e) },
};
// Les trois oiseaux des prés dont la case « habitat » est vide (râle des genêts : LPO, mesures de fauche tardive ; tarier des prés
// et bruant proyer : nid au sol dans les prairies de fauche et les friches herbeuses). À retirer quand la case sera remplie.
const NICHE_DANS_LES_PRES = ["Râle des genêts", "Tarier des prés", "Bruant proyer"];
function nicheDansLesPres(e) {
  if (NICHE_DANS_LES_PRES.includes(e.nom_courant)) return true;
  return String(e.habitat || "").split(/[;,]/).some(m => /prairi|\bprés?\b/i.test(m) && !/prés? salés?|hiver|nuit/i.test(m));
}
// (b) une seule bonne réponse : la question le dit (« à laquelle », « de laquelle ») et l'étiquette « Plusieurs réponses » disparaît
function questionEtSiAuNombre(question, n) {
  return n > 1 ? question : question.replace("auxquelles de ces espèces", "à laquelle de ces espèces").replace("desquelles de ces espèces", "de laquelle de ces espèces");
}
const NIDS_NETS = ["Cavité d'arbre", "Bâtiment", "Arbre ou buisson", "Roselière ou végétation dense", "Au sol", "Falaise ou paroi rocheuse", "Terrier", "Sur l'eau (nid flottant)"];
// R297 (notes 4-5 du 22/11 au soir) : « Bâtiment » = « le plus souvent dans ou sur un bâtiment » (« dans un bâtiment » était trop absolu)
const NIDS_DITS = { "Cavité d'arbre": "dans un arbre creux", "Bâtiment": "le plus souvent dans ou sur un bâtiment", "Arbre ou buisson": "dans un arbre ou un buisson",
  "Roselière ou végétation dense": "dans une roselière ou une végétation dense", "Au sol": "au sol", "Falaise ou paroi rocheuse": "dans une falaise",
  "Terrier": "dans un terrier", "Sur l'eau (nid flottant)": "sur l'eau, dans un nid flottant" };
function nidNet(e) { return confirme(e, "emplacement_nid") && NIDS_NETS.includes(String(e.emplacement_nid).trim()) ? String(e.emplacement_nid).trim() : null; }
// Étape R237 : les autres endroits où une espèce niche aussi (2 sources : colonne « autres » ; 1 source : Pieges_interdits)
function nidsAussi(e) {
  const interdits = (typeof PIEGES_INTERDITS === "undefined" ? [] : PIEGES_INTERDITS)
    .filter(p => p.nom_courant === e.nom_courant && p.colonne === "emplacement_nid").map(p => String(p.reponse_interdite));
  return [...valeursAutres(e, "emplacement_nid"), ...interdits];
}
function questionEtSi(x) {
  // une espèce dont le lieu dit déjà où elle niche (lien « Sa maison » : le balbuzard sur la falaise de Scandola) n'est pas montrée :
  // sa fiche (« arbre ou buisson ») pourrait contredire ce lieu
  const c = x.chapitre && chapitreParNom(x.territoire, x.chapitre);
  const logees = new Set((c ? liensElementsDuLieu(x.territoire, c.nom) : []).filter(k => k.role === "Sa maison").map(k => k.a));
  let mieux = null;
  for (const [cas, r] of Object.entries(ET_SI)) {
    // Étape R237 : une espèce montrée comme « non » ne niche nulle part près de ce cas, même en second (colonne
    // emplacement_nid_autres, ou onglet Pieges_interdits : le rougegorge dans les haies, le moineau dans les arbres)
    const l = x.liste.filter(e => { const n = nidNet(e); return n && !logees.has(e.nom_courant) && !r.exclus.includes(n) && (n !== cas || !r.milieu || r.milieu(e))
      && (n === cas || !nidsAussi(e).some(v => v === cas || r.exclus.includes(v))); });
    const bonnes = l.filter(e => nidNet(e) === cas);
    if (l.length < 3 || !bonnes.length || bonnes.length === l.length) continue;
    if (!mieux || bonnes.length > mieux.bonnes.length) mieux = { cas, r, l, bonnes };
  }
  if (!mieux) return null;
  const { r, l, bonnes } = mieux;
  // Étape R236 (note 17) : l'explication regroupe les espèces par lieu de nid (avant : « Le … niche … » répété pour chacune)
  const groupes = new Map([[mieux.cas, []]]);
  for (const e of l) { const n = nidNet(e); if (!groupes.has(n)) groupes.set(n, []); groupes.get(n).push(e); }
  const explication = majuscule([...groupes].filter(([, g]) => g.length)
    .map(([n, g]) => `${listeEt(g.map(leNom))} ${g.length > 1 ? "nichent" : "niche"} ${NIDS_DITS[n]}`).join(" ; ")) + ".";
  return { type: "etsi", question: questionEtSiAuNombre(r.question, bonnes.length), montrees: [], choix: melanger(l.map(e => choixEspece(e, bonnes.includes(e)))),
           plusieurs: bonnes.length > 1, explication, especes: l.map(e => e.nom_courant) };   // R271 (n° 18 b)
}

// ---- L'assemblage ----
// Toutes les questions possibles, dans l'ordre des types ; 6 au plus ; « Et si… ? » toujours en dernier.
// Jamais deux questions de suite à une seule bonne réponse qui porte sur la même espèce.
function questionsEnsemble(x) {
  const q = [];
  const liens = melanger(candidatsLiensEnsemble(x));
  const pris = [];
  for (const passe of [0, 1]) for (const r of liens) {        // 2 paires différentes, des espèces différentes si possible
    if (pris.length >= (R298 ? LIENS_ENSEMBLE_MAX : 2) || pris.includes(r)) continue;
    if (pris.some(p => p.sujet === r.sujet && p.reponse === r.reponse || p.sujet === r.reponse && p.reponse === r.sujet)) continue;
    if (passe === 0 && pris.some(p => [p.sujet, p.reponse].some(e => e === r.sujet || e === r.reponse))) continue;
    pris.push(r);
  }
  pris.forEach((r, i) => q.push({ ...questionLien(r), cle: "liens" + (i + 1) }));
  // R298 : l'ordre — liens entre elles, voisins, chasseur, jour et nuit, calendrier, sa place, nouveaux venus, plus fragiles,
  //   comparées, « Et si… ? » toujours en dernier
  if (R298) for (const v of questionsVoisins(x)) q.push(v);
  const ch = questionChasseur(x); if (ch) q.push({ ...ch, cle: "chasseur" });
  const jn = questionJourNuit(x); if (jn) q.push({ ...jn, cle: "jour_nuit" });
  const ca = questionCalendrier(x, jn ? jn.especes : null); if (ca) q.push({ ...ca, cle: "calendrier" });
  questionsPlace(x, pris.map(r => r.sujet.nom_courant)).forEach((pl, i) => q.push({ ...pl, cle: R298 ? "place" + (i + 1) : "place" }));
  const nv = questionNouveauxVenus(x); if (nv) q.push({ ...nv, cle: "nouveaux" });
  const fr = questionFragiles(x); if (fr) q.push({ ...fr, cle: "fragiles" });
  for (const c of questionsComparees(x)) q.push(c);
  const es = questionEtSi(x); if (es) q.push({ ...es, cle: "etsi" });
  if (R298) {
    // 6 visées : au-dessus, on retire d'abord les doublons d'un même type ; 8 au plus : au-dessus, des types entiers.
    //   Jamais de question ajoutée pour atteindre 6.
    for (const cle of ENSEMBLE_RETIRER_AU_DELA_DE_6) { if (q.length <= ENSEMBLE_VISE) break; const i = q.findIndex(z => z.cle === cle); if (i >= 0) q.splice(i, 1); }
    for (const cle of ENSEMBLE_RETIRER_AU_DELA_DE_8) { if (q.length <= ENSEMBLE_MAX) break; const i = q.findIndex(z => z.cle === cle); if (i >= 0) q.splice(i, 1); }
  } else for (const cle of ENSEMBLE_RETIRER_D_ABORD) { if (q.length <= 6) break; const i = q.findIndex(z => z.cle === cle); if (i >= 0) q.splice(i, 1); }
  while (q.length > (R298 ? ENSEMBLE_MAX : 6)) q.splice(q.length - 2, 1);
  // deux questions de suite à une seule réponse sur la même espèce : on retire la seconde (sauf « Et si… ? »)
  const uneBonne = z => !z.plusieurs ? (z.choix.find(c => c.bonne) || {}).espece : null;
  const sansDoublonDeSuite = l => { for (let i = 1; i < l.length; i++) if (uneBonne(l[i]) && uneBonne(l[i]) === uneBonne(l[i - 1])) { l.splice(l[i].cle === "etsi" ? i - 1 : i, 1); i--; } return l; };
  // R299 : d'abord remettre dans l'ordre (varierEnsemble sépare déjà deux questions sur la même espèce), ensuite seulement
  //   retirer ce qui reste collé (avant, on retirait dans l'ordre des types : des questions perdues pour rien)
  if (leOn()) return sansDoublonDeSuite(varierEnsemble(q));
  return varierEnsemble(sansDoublonDeSuite(q));
}
// Étape R264 (40.15, choix 8B : « même règle aux étapes 1 et 2 ») : jamais deux questions du même genre à la suite. Les deux
//   questions de liens (« Laquelle est mangée par… ? ») et celle du chasseur commun parlent toutes de « qui mange qui » :
//   elles sont séparées par une autre question quand il y en a une (l'ordre des 8 types est gardé pour le reste ;
//   « Et si… ? » reste la dernière).
// R298 : une question de voisin sur « qui mange qui » est du même genre ; les autres voisins sont un genre à part
function genreEnsemble(z) { return z.type === "liens" || z.type === "chasseur" || (z.type === "voisins" && /mange/.test(z.sens || "")) ? "manger" : z.type; }
function varierEnsemble(q) {
  const fin = q.length && q[q.length - 1].cle === "etsi" ? [q[q.length - 1]] : [];
  const reste = q.slice(0, q.length - fin.length), suite = [];
  while (reste.length) {
    const prec = suite[suite.length - 1];
    const bonneUnique = z => !z.plusieurs ? (z.choix.find(c => c.bonne) || {}).espece : null;
    const memeEspece = z => prec && bonneUnique(z) && bonneUnique(z) === bonneUnique(prec);   // (règle d'avant, gardée)
    let i = reste.findIndex(z => !prec || (genreEnsemble(z) !== genreEnsemble(prec) && !memeEspece(z)));
    if (i < 0) i = reste.findIndex(z => !memeEspece(z));
    if (i < 0) i = 0;
    suite.push(reste.splice(i, 1)[0]);
  }
  return [...suite, ...fin];
}


// ==================================================================
// E2-3 · L'AFFICHAGE DE L'ÉTAPE 2 (15/11/2026)
//   - Une expédition avec au moins une question : l'étape 2 = ces questions, une par écran ; une seule réponse (un toucher)
//     ou plusieurs (on coche, puis « Valider »). Une erreur est expliquée tout de suite ; la question revient UNE fois à la fin,
//     puis compte quand même. Jamais d'échec.
//   - Une expédition avec une seule question, ou aucune : pas d'étape 2 (elle se termine avec les Rencontres) ; la question
//     unique est proposée juste après la dernière Rencontre (« Une dernière question »).
//   - Étape 2 finie = les espèces de l'expédition deviennent « comprises » (suivi.comprises). Empreintes inchangées
//     (+ GAIN_FIN_EXPEDITION à la fin, comme avant).
//   - Rien ne recule : une expédition dont l'étape 2 était finie avant E2-3 le reste (suivi.etape2AvantE2).
//   - Les questions d'une expédition restent les mêmes pendant toute la session (pas de nouveau tirage à chaque visite).
// ==================================================================
if (ETAPE2_ENSEMBLE && typeof ETAPES !== "undefined")
  ETAPES[2] = { titre: "Leurs liens", texte: "Comment ces espèces vivent ensemble ici : qui chasse qui, le jour et la nuit, l'hiver, ce qui les aide" };
const memoEnsemble = new Map();
// Étape R245 (point 1 du 17/11) : tirage FIXE par expédition. Le choix des questions se fait avec un hasard « à graine »
//   tiré du numéro de l'expédition : la même expédition donne toujours les mêmes questions (elle a toujours, ou jamais,
//   son étape 2). Seul l'ordre des réponses à l'écran est ensuite mélangé au vrai hasard.
function hasardFixe(graine) {
  let h = 2166136261;
  for (const c of String(graine)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  return () => { h = (h + 0x6D2B79F5) | 0; let t = Math.imul(h ^ (h >>> 15), 1 | h); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function questionsEnsembleFixes(x) {
  const vrai = Math.random;
  let q = [];
  try { Math.random = hasardFixe("ensemble|" + x.id); q = questionsEnsemble(x); }
  catch (err) { q = []; }
  finally { Math.random = vrai; }
  return q.map(z => ({ ...z, choix: melanger(z.choix.slice()) }));
}
function questionsEnsembleExp(x) {
  if (!memoEnsemble.has(x.id)) { let q = []; try { q = questionsEnsembleFixes(x); } catch (err) { q = []; } memoEnsemble.set(x.id, q); }
  return memoEnsemble.get(x.id);
}
function ensembleFait(x) { return !!(suivi && suivi.ensembleFait && suivi.ensembleFait[x.id]); }
function comprisesEnsemble() {
  const l = (suivi && suivi.comprises) || [];
  if (!comprisesEnsemble.cache || comprisesEnsemble.cache.src !== l || comprisesEnsemble.cache.n !== l.length) {
    comprisesEnsemble.cache = new Set(l); comprisesEnsemble.cache.src = l; comprisesEnsemble.cache.n = l.length;
  }
  return comprisesEnsemble.cache;
}
function especeComprise(e) { return ETAPE2_ENSEMBLE && !!suivi && comprisesEnsemble().has(e.nom_courant); }
// Une seule fois : les expéditions dont l'étape 2 était déjà finie (ancienne règle) le restent
function etape2AvantE2() {
  if (!suivi) return new Set();
  if (!suivi.etape2AvantE2) {
    suivi.etape2AvantE2 = EXPEDITIONS.map(y => expeditionParId(y.id)).filter(x => x && etapeFinieAncienne(x, 2)).map(x => x.id);
    sauvegarder();
  }
  if (!etape2AvantE2.cache || etape2AvantE2.cache.src !== suivi.etape2AvantE2) { etape2AvantE2.cache = new Set(suivi.etape2AvantE2); etape2AvantE2.cache.src = suivi.etape2AvantE2; }
  return etape2AvantE2.cache;
}
// Étape R298 · rien ne recule. Une étape 2 finie le reste, même si la nouvelle règle lui donne 3 questions ou plus :
//   - une fois, avant tout calcul (etape2AvantR298) : les expéditions dont l'étape 2 était finie avec les règles de R297
//     (Rencontres finies, et 0 ou 1 question à l'époque) sont notées dans suivi.etape2Sans ;
//   - ensuite, chaque expédition dont l'étape 2 se trouve finie faute de questions (Rencontres finies, moins de 3) y est notée
//     aussi (elle ne se rouvrira pas si, plus tard, les questions comparées passent en ligne et lui en donnent 3).
//   Une étape commencée et pas finie n'est pas sauvegardée (les questions sont tirées à l'ouverture) : rien n'est perdu.
function etape2Sans(x) { return !!(suivi && suivi.etape2Sans && suivi.etape2Sans[x.id]); }
function noterEtape2Sans(id) {
  suivi.etape2Sans = suivi.etape2Sans || {};
  if (suivi.etape2Sans[id]) return;
  suivi.etape2Sans[id] = true;
  clearTimeout(noterEtape2Sans.t); noterEtape2Sans.t = setTimeout(() => { try { sauvegarder(); } catch (err) {} }, 0);
}
function etape2AvantR298() {
  // une fois toute la page chargée (les Rencontres finies se comptent avec tous les fichiers du jeu), avant tout geste du joueur
  if (!suivi || suivi.etape2R298 || !R298 || document.readyState === "loading") return;
  suivi.etape2R298 = true;
  const vrai = { R298, COMPAREES_EN_LIGNE };
  try {
    for (const y of EXPEDITIONS) {
      const x = expeditionParId(y.id);
      if (!x || ensembleFait(x) || etape2AvantE2().has(x.id) || !etapeFinie(x, 1)) continue;
      R298 = false; COMPAREES_EN_LIGNE = false;
      let n = 0; try { n = questionsEnsembleFixes(x).length; } catch (err) { n = 0; }
      R298 = vrai.R298; COMPAREES_EN_LIGNE = vrai.COMPAREES_EN_LIGNE;
      if (n <= 1) { suivi.etape2Sans = suivi.etape2Sans || {}; suivi.etape2Sans[x.id] = true; }
    }
  } finally { R298 = vrai.R298; COMPAREES_EN_LIGNE = vrai.COMPAREES_EN_LIGNE; memoLieu.clear(); }
  sauvegarder();
}
document.addEventListener("DOMContentLoaded", () => { try { etape2AvantR298(); } catch (err) { /* rien */ } });
function minEtape2() { return R298 ? ENSEMBLE_MIN_ETAPE : 2; }
// L'étape 2 est-elle finie ? (appelé par etapeFinie, 17_expeditions.js, une fois l'étape 1 finie)
function etape2EnsembleFinie(x) {
  etape2AvantR298();
  if (ensembleFait(x) || etape2AvantE2().has(x.id) || etape2Sans(x)) return true;
  const sans = questionsEnsembleExp(x).length < minEtape2();
  if (sans && R298 && suivi && suivi.etape2R298) noterEtape2Sans(x.id);      // R298 : elle le reste (voir plus haut)
  return sans;
}
// Une expédition a-t-elle une étape 2 à jouer ? (3 questions au moins depuis R298 ; 2 avant)
function aUneEtape2(x) {
  if (!ETAPE2_ENSEMBLE || etape2AvantE2().has(x.id)) return true;
  if (etape2Sans(x) && !ensembleFait(x)) return false;
  return questionsEnsembleExp(x).length >= minEtape2();
}
// Une expédition à une ou deux questions (R298 ; une seule avant) : elles sont proposées après la dernière Rencontre,
//   tant qu'elles n'ont pas été vues
function questionFinaleExp(x) {
  if (!ETAPE2_ENSEMBLE || ensembleFait(x)) return false;
  const n = questionsEnsembleExp(x).length;
  return n >= 1 && (n < minEtape2() || (etape2Sans(x) && n <= 2));
}
// Le bouton : « Une dernière question ▶ » / « Deux dernières questions ▶ »
function texteQuestionFinale(x) { const n = questionsEnsembleExp(x).length; return n > 1 ? `${NOMBRES_EN_LETTRES[n] || n} dernières questions ▶` : "Une dernière question ▶"; }

let ensemble = null;
function ouvrirEnsembleExp(x) {
  etape2AvantE2();   // la liste « rien ne recule » est faite avant toute nouvelle espèce comprise
  const qs = questionsEnsembleExp(x);
  if (!qs.length) { marquerEnsemble(x); ouvrirExpedition(x); return; }
  ecranForme(x, 2);
  // R298 : une étape (3 questions ou plus) a son écran d'entrée ; 1 ou 2 questions sont « les dernières questions » des Rencontres
  const finale = !aUneEtape2(x);
  ensemble = { x, file: qs.map(q => ({ q, reprise: false })), i: 0, total: qs.length, premierCoup: 0, avantGain: gainExp(x), avant: empreintesExp(x), finale };
  if (ENTREE_LEURS_LIENS && !finale && qs.length >= 2) entreeEnsemble(); else dessinerEnsemble();
}
// Étape R297 (note 6a du 22/11 au soir : « Leurs liens » passait inaperçu, Aubin n'avait pas vu qu'il était dans l'étape) :
//   un court écran d'entrée — les deux cercles dans la couleur bleue de l'étape, « Leurs liens », ce qu'on va faire,
//   le nombre de questions, « Commencer ▶ ». Seulement pour une vraie étape (2 questions ou plus ; la question unique
//   « Une dernière question » s'enchaîne comme avant). false = plus d'écran d'entrée.
const ENTREE_LEURS_LIENS = true;
function entreeEnsemble() {
  const z = document.getElementById("forme-ecran"), E = ensemble;
  if (!z || !E) return;
  const n = E.total;
  z.innerHTML = `<div class="fp-carte en-carte en-annonce en-entree">
    <div class="en-entree-corps">
      <span class="en-entree-picto">${PICTO_LIENS}</span>
      <span class="en-entree-etiq">${echapper(E.x.titre)}</span>
      <h2 class="en-entree-titre">${titreEtape(2)}</h2>
      <p class="en-entree-texte">Comment ces espèces vivent ensemble ici</p>
      <p class="en-entree-nombre">${NOMBRES_EN_LETTRES[n] || n} question${n > 1 ? "s" : ""}</p></div>
    <div class="fp-pied en-annonce-pied"><button type="button" class="bouton-accueil principal" id="en-commencer">Commencer <span aria-hidden="true">▶</span></button></div></div>`;
  document.getElementById("en-commencer").onclick = () => { dessinerEnsemble(); window.scrollTo(0, 0); };
  window.scrollTo(0, 0);
  document.getElementById("en-commencer").focus({ preventScroll: true });
}
function marquerEnsemble(x) {
  if (!suivi) return;
  suivi.ensembleFait = suivi.ensembleFait || {};
  suivi.ensembleFait[x.id] = true;
  suivi.comprises = suivi.comprises || [];
  for (const e of x.liste) if (!suivi.comprises.includes(e.nom_courant)) suivi.comprises.push(e.nom_courant);
  sauvegarder();
}
function figureEnsemble(nom) {
  const e = especeParNom(nom);
  if (!e) return "";
  return `<figure><img src="${photoMini(photoEsp(e))}" alt=""><figcaption>${echapper(e.nom_courant)}</figcaption></figure>`;
}
// R298 : le voisin en haut (photo, nom, « Vit aussi à Salers · « Les rapaces du village » ») ; l'élément en photo (« Une vieille grange »)
function blocVoisin(q) {
  if (!q.voisin) return "";
  const v = q.voisin, titres = [...new Set(v.titres.filter(Boolean))];
  return `<div class="en-voisin"><div class="en-montrees">${v.noms.map(figureEnsemble).join("")}</div>
    <p class="en-voisin-ou">${v.noms.length > 1 ? "Vivent" : "Vit"} aussi à ${echapper(v.lieu || "")}${titres.length ? " · " + titres.map(t => `« ${echapper(t)} »`).join(", ") : ""}</p></div>`;
}
function blocElement(q) {
  if (!q.element) return "";
  return `<figure class="en-element"><img src="${q.element.photo}" alt=""><figcaption>${echapper(q.element.dit)}</figcaption></figure>`;
}
function boutonChoixEnsemble(c, i, plusieurs) {
  const e = c.espece ? especeParNom(c.espece) : null;
  const image = e ? `<img src="${photoMini(photoEsp(e))}" alt="">` : "";
  return `<button type="button" class="fl-rep en-rep${e ? " en-avec-photo" : ""}" data-i="${i}" aria-pressed="${plusieurs ? "false" : ""}">
      ${image}<span class="en-texte">${echapper(c.texte)}</span></button>`;
}
// Étape R279 (test du 20/11, n° 2b) : sur ordinateur, les réponses (puis le bouton de la suite) restent dans l'écran ;
//   la page descend juste assez, sans faire sortir la question par le haut. Rien ne change sur téléphone.
function garderEnVueOrdinateur(haut, bas) {
  if (!haut || !bas || !(window.matchMedia && window.matchMedia("(min-width: 761px)").matches)) return;
  const placer = () => {
    if (!bas.isConnected || !bas.getClientRects().length) return;
    const h = haut.getBoundingClientRect(), b = bas.getBoundingClientRect();
    const voulu = Math.min(b.bottom + 16 - window.innerHeight, h.top - 12);
    if (voulu > 4) window.scrollTo({ top: window.scrollY + voulu, behavior: animationsReduites() ? "auto" : "smooth" });
  };
  requestAnimationFrame(() => setTimeout(placer, 60));
}
function dessinerEnsemble() {
  const z = document.getElementById("forme-ecran"), E = ensemble;
  if (!z || !E) return;
  const { q, reprise } = E.file[E.i];
  const n = E.file.filter(f => !f.reprise).length, rang = E.file.slice(0, E.i + 1).filter(f => !f.reprise).length;
  const montrees = (q.montrees || []).map(figureEnsemble).filter(Boolean);
  // Étape R246 (36.11, choix 11B du 17/11) : le compteur du haut en cases (vert = juste du premier coup, ocre = ratée,
  //   foncé = la question en cours) ; une question reposée porte l'étiquette « ↻ À revoir » et une ligne douce.
  E.resultats = E.resultats || {};
  const enCoursI = reprise ? E.file[E.i].de : E.i;
  const cases = n > 1 ? `<span class="en-cases" aria-hidden="true">${E.file.slice(0, n).map((f, i) =>
      `<i class="${E.resultats[i] === "rate" ? "rate" : E.resultats[i] === "ok" ? "ok" : ""}${i === enCoursI ? " encours" : ""}"></i>`).join("")}</span>` : "";
  const compte = reprise ? "" : n === 1 ? "Une dernière question" : `${rang} / ${n}`;   // R298 : 2 questions de fin = « 1 / 2 » (le bouton disait « Deux dernières questions »)
  z.innerHTML = `<div class="fp-carte fl-carte en-carte${reprise ? " en-reprise" : ""}">
    <div class="fp-tete"><span class="fp-lib">${PICTO_LIENS}${titreEtape(2)}</span><span class="fp-compte">${cases}${compte ? `<span class="en-compte-txt">${compte}</span>` : ""}</span></div>
    ${reprise ? `<p class="en-a-revoir"><span class="etiq-a-revoir">↻ À revoir</span><span>Vous l'aviez manquée tout à l'heure : la voici une seconde fois.</span></p>` : ""}
    ${montrees.length ? `<div class="en-montrees${montrees.length > 2 ? " nombreuses" : ""}">${montrees.join("")}</div>` : ""}
    ${blocVoisin(q)}${blocElement(q)}
    <h3 class="fl-question">${echapper(q.question)}</h3>
    ${q.plusieurs ? `<p class="en-consigne"><span class="etiq-plusieurs">Plusieurs réponses</span></p>` : ""}
    <div class="fl-choix en-choix${typeof classeNombreChoix === "function" ? classeNombreChoix(q.choix.length) : ""}">${q.choix.map((c, i) => boutonChoixEnsemble(c, i, q.plusieurs)).join("")}</div>
    <p class="fp-retour" id="en-retour"></p>
    <div class="fp-pied">${q.plusieurs ? `<button type="button" class="bouton-accueil principal" id="en-valider" disabled>Valider</button>` : ""}
      <button type="button" class="bouton-accueil principal cache" id="en-suite">${E.i + 1 < E.file.length ? "Question suivante" : "Continuer"}</button></div></div>`;
  const boutons = [...z.querySelectorAll(".en-rep")];
  garderEnVueOrdinateur(z.querySelector(".fl-question"), (q.plusieurs && document.getElementById("en-valider")) || z.querySelector(".en-choix"));   // R279
  const corriger = choisis => {
    const bonnes = q.choix.map((c, i) => c.bonne ? i : -1).filter(i => i >= 0);
    // Étape R236 (note 17, décision d'Aubin du 15/11) : à plusieurs réponses, la question est validée si le joueur trouve au moins
    //   les 2/3 des bonnes réponses (2 sur 3, 2 sur 2, 3 sur 4…) sans cocher de fausse réponse ; les oubliées restent montrées.
    const trouvees = choisis.filter(i => bonnes.includes(i)).length, fausses = choisis.filter(i => !bonnes.includes(i)).length;
    const juste = fausses === 0 && trouvees >= (q.plusieurs ? Math.ceil(bonnes.length * 2 / 3) : bonnes.length);
    const partiel = juste && trouvees < bonnes.length;
    boutons.forEach(b => {
      const i = Number(b.dataset.i); b.disabled = true; b.classList.remove("coche");
      if (bonnes.includes(i)) b.classList.add(choisis.includes(i) || !q.plusieurs ? "juste" : "juste", ...(q.plusieurs && !choisis.includes(i) ? ["oubliee"] : []));
      else if (choisis.includes(i)) b.classList.add("fausse");
    });
    try { jouerSon(juste ? "bonne" : "mauvaise"); } catch (err) {}
    if (juste && !reprise) E.premierCoup++;
    if (juste) { noterComparee(q); if (q.type === "comparee") sauvegarder(); }   // R298 : le sujet d'Approfondir « Ce qu'elle mange » trouvé
    if (!reprise) { E.resultats = E.resultats || {}; E.resultats[E.i] = juste ? "ok" : "rate"; }   // R246 : la case du compteur
    if (!juste && !reprise) E.file.push({ q: { ...q, choix: melanger(q.choix.slice()) }, reprise: true, de: E.i });   // revient une fois, à la fin
    if (q.type === "liens" && typeof noterLienConnu === "function") noterLienConnu("ens|" + (q.especes || []).join("|"));   // badge « Leurs liens »
    const v = document.getElementById("en-valider"); if (v) v.classList.add("cache");
    const oubli = q.plusieurs && !juste && bonnes.some(i => !choisis.includes(i)) ? " Les bonnes réponses sont encadrées en vert." : "";
    const debut = partiel ? `Validé : ${trouvees} sur ${bonnes.length}. ` : juste ? "Bravo ! " : "";
    // Étape R265 (40.12, 6A) : « Oui » / « C'était l'autre » / « Pas cette fois » (« Validé · 2 sur 3 »), puis l'explication
    const ligneEns = typeof verdictHtml === "function"
      ? verdictHtml({ juste, deux: q.choix.length === 2, mot: partiel ? `Validé · ${trouvees} sur ${bonnes.length}` : "", phrase: q.explication || "" })
      : `${debut}${echapper(q.explication || "")}`;
    document.getElementById("en-retour").innerHTML = `${ligneEns}${partiel ? `<br><small>${bonnes.length - trouvees > 1 ? "Les autres sont encadrées" : "L'autre est encadrée"} en vert.</small>` : ""}${!juste ? `<br><small>${reprise ? "Elle compte quand même." : "Cette question reviendra une fois à la fin."}${oubli}</small>` : ""}`;
    const caseI = z.querySelectorAll(".en-cases i")[reprise ? E.file[E.i].de : E.i];   // R246 : la case prend sa couleur tout de suite
    if (caseI && !reprise) caseI.classList.add(juste ? "ok" : "rate");
    const s = document.getElementById("en-suite");
    s.textContent = E.i + 1 < E.file.length ? "Question suivante" : "Continuer";
    s.classList.remove("cache"); s.focus({ preventScroll: true });
    garderEnVueOrdinateur(document.getElementById("en-retour"), s);   // R279 : le verdict et la suite à l'écran
    s.onclick = () => {
      if (E.i + 1 >= E.file.length) { finirEnsemble(); return; }
      // Étape R265 (40.05, choix 3A) : avant les questions à revoir, une page courte, avec « Non merci » pour ne pas les imposer
      if (PAGE_A_REVOIR && E.file[E.i + 1].reprise && !E.file[E.i].reprise) { annonceARevoirEnsemble(E); return; }
      E.i++; dessinerEnsemble(); window.scrollTo(0, 0);
    };
  };
  if (q.plusieurs) {
    const v = document.getElementById("en-valider");
    boutons.forEach(b => b.onclick = () => {
      const on = b.getAttribute("aria-pressed") !== "true";
      b.setAttribute("aria-pressed", on ? "true" : "false"); b.classList.toggle("coche", on);
      v.disabled = !boutons.some(o => o.getAttribute("aria-pressed") === "true");
    });
    v.onclick = () => corriger(boutons.filter(b => b.getAttribute("aria-pressed") === "true").map(b => Number(b.dataset.i)));
  } else boutons.forEach(b => b.onclick = () => corriger([Number(b.dataset.i)]));
  window.scrollTo(0, 0);
  // Étape R265 (40.03, 2A) : sur téléphone, la ligne de retour au-dessus des réponses, les réponses calées en bas, le bouton fixé
  if (typeof calerSousPouce === "function" && SOUS_LE_POUCE && surTelephone()) {
    const choixZ = z.querySelector(".en-choix"), ret = document.getElementById("en-retour");
    if (choixZ && ret) { choixZ.before(ret); calerSousPouce(ret, choixZ, RESERVE_POUCE.rencontre); }
  }
}
// Étape R265 (40.05, choix 3A du 19/11, + remarque d'Aubin : « il faut mettre une option "Non merci" ou autre chose pour ne pas
//   l'imposer au joueur ») : « Deux questions à reprendre, maintenant que vous en savez plus. » — « Les reprendre ▶ » ou
//   « Non merci, terminer » : l'étape se termine alors comme si elles avaient été reprises (elles comptent, rien n'est perdu).
const PAGE_A_REVOIR = true;
const NOMBRES_EN_LETTRES = ["Aucune", "Une", "Deux", "Trois", "Quatre", "Cinq", "Six", "Sept", "Huit"];
function annonceARevoirEnsemble(E) {
  const z = document.getElementById("forme-ecran");
  const n = E.file.length - E.i - 1, une = n === 1;
  z.innerHTML = `<div class="fp-carte fl-carte en-carte en-annonce">
    <div class="fp-tete"><span class="fp-lib">${PICTO_LIENS}${titreEtape(2)}</span></div>
    <div class="en-annonce-corps"><span class="etiq-a-revoir">↻ À revoir</span>
      <h3 class="fl-question">${NOMBRES_EN_LETTRES[n] || n} question${une ? "" : "s"} à reprendre, maintenant que vous en savez plus.</h3></div>
    <div class="fp-pied en-annonce-pied"><button type="button" class="bouton-accueil principal" id="en-reprendre">${une ? "La reprendre" : "Les reprendre"} ▶</button>
      <button type="button" class="en-non-merci" id="en-non-merci">Non merci, terminer</button></div></div>`;
  document.getElementById("en-reprendre").onclick = () => { E.i++; dessinerEnsemble(); window.scrollTo(0, 0); };
  document.getElementById("en-non-merci").onclick = () => finirEnsemble();
  window.scrollTo(0, 0);
  document.getElementById("en-reprendre").focus();
}
function finirEnsemble() {
  const E = ensemble, x = E.x;
  marquerEnsemble(x);
  fermerEcranForme(); ensemble = null;
  const gagnees = Math.max(0, gainExp(x) - E.avantGain);
  session = null;
  ouvrirExpedition(x);
  if (E.avant < NB_ETAPES && etapeFinie(x, 2)) {
    feter({ exp: x, etiquette: `Expédition · ${x.titre}`, titre: "Expédition terminée !",
            detail: `${E.premierCoup} question${E.premierCoup > 1 ? "s" : ""} sur ${E.total} réussie${E.premierCoup > 1 ? "s" : ""} du premier coup${gagnees ? ` · +${gagnees} empreintes` : ""}`,
            son: "badge", visuel: `<div class="fete-visuel rang exp-fete">${PAS_SVG}</div>` });
    if (gagnees) verifierOuverture();
  }
}
