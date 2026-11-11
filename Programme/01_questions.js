// 01_questions.js — Les caractéristiques sur lesquelles on pose des questions (et les empreintes).
// Une partie du programme du jeu, chargée par jeu.html dans l'ordre des numéros.


// ==================================================================
// 0. ÉTAPE 182 : UNE CASE ROSE N'EST JAMAIS POSÉE
//    especes.js donne, pour chaque espèce, la liste "a_confirmer" de ses colonnes dont la
//    case est rose dans l'Excel (valeur pas encore confirmée par deux sources).
//    Avant, seul le portrait physique en tenait compte. Maintenant, dès le chargement,
//    on vide ces cases (null = « pas renseigné ») : aucune question, aucun piège ne s'en sert.
//    Les colonnes d'identité restent intactes (elles servent au classement, pas aux questions).
// ==================================================================
const COLONNES_IDENTITE = ["nom_courant", "nom_scientifique", "classe", "ordre", "sous_groupe",
                           "nom_affichage_groupe", "photo", "photo_source", "territoire"];
for (const espece of ESPECES) {
  for (const colonne of (espece.a_confirmer || [])) {
    if (!COLONNES_IDENTITE.includes(colonne)) espece[colonne] = null;
  }
}

// ==================================================================
// 1. LES CARACTÉRISTIQUES SUR LESQUELLES ON POSE DES QUESTIONS
//    Chaque bloc = UNE colonne de l'Excel ("champ"), avec les phrases
//    utilisées par les différents FORMATS de question (étape 9) :
//      question     → QCM classique (4 réponses écrites)
//      affirmation  → Vrai ou faux ("Son petit s'appelle : Faon.")
//      inverse      → Choix parmi 4 photos ("Lequel brame ?")
//      explication  → la phrase à retenir, affichée après la réponse
//    type "nombre" = caractéristique chiffrée → format "estimation".
//    "libelle" = le nom court affiché dans l'encyclopédie.
//    "pasDansLeNom" (étape 26) = on ne pose pas la question quand la réponse se
//                devine dans le nom de l'espèce (renard → renardeau, fourmi → fourmilière).
//    "pictos"  = true (étape 66) : en QCM, chaque réponse est illustrée par un dessin du
//                dossier Pictos, nommé d'après la colonne et la réponse
//                (regime_alimentaire_type__herbivore.svg). La photo reste affichée.
//    "niveau"  = 1, 2 ou 3 (étape 25). Pour changer une question de niveau,
//                il suffit de changer ce chiffre.
//                  1 = ce qui se voit ou se devine
//                  2 = le mode de vie
//                  3 = vocabulaire précis et chiffres
//    Pour lire la valeur d'une espèce, on passe toujours par la
//    fonction valeurDe(espece, q)  (partie 3).
// ==================================================================
// ---- Les empreintes (étape 28) -------------------------------------------
// Un dessin par espèce, rangé dans le dossier "Empreintes" sous le MÊME nom que la photo
// (Images/loup_gris.jpg → Empreintes/loup_gris.svg). Tous sont à la même échelle.
//   groupe : les empreintes qui se ressemblent ; elles servent de pièges les unes aux autres
//   texte  : ce qu'il faut retenir, affiché après la réponse
//   sosies : (facultatif, étape 185) empreintes quasi identiques, jamais pièges l'une pour l'autre
const EMPREINTES = {
  cerf_elaphe:         { groupe: "sabots",  texte: "deux grands sabots larges, aux bouts arrondis" },
  chevreuil:           { groupe: "sabots",  texte: "deux petits sabots étroits et pointus" },
  chamois:             { groupe: "sabots",  texte: "deux sabots étroits, nettement écartés", sosies: "chamois" },   // étape 192 : sosie de l'isard
  bouquetin_des_alpes: { groupe: "sabots",  texte: "deux sabots larges, aux bouts très arrondis", sosies: "bouquetins" },   // étape 192 : sosie du bouquetin ibérique
  loup_gris:           { groupe: "4 doigts", texte: "quatre doigts avec griffes, grande et ovale. Seule, elle ne se distingue pas de celle d'un grand chien" },
  renard_roux:         { groupe: "4 doigts", texte: "quatre doigts avec griffes fines, petite et étroite" },
  lynx_boreal:         { groupe: "4 doigts", texte: "quatre doigts sans griffes, ronde, doigts décalés" },
  blaireau_europeen:   { groupe: "5 doigts", texte: "cinq doigts alignés et de longues griffes" },
  loutre_d_europe:     { groupe: "5 doigts", texte: "cinq doigts en éventail, reliés par une palmure" },
  marmotte_des_alpes:  { groupe: "5 doigts", texte: "quatre doigts à l'avant, cinq à l'arrière" },
  ecureuil_roux:       { groupe: "5 doigts", texte: "quatre doigts fins à l'avant, cinq à l'arrière, avec des griffes" },
  martre_des_pins:     { groupe: "5 doigts", texte: "cinq doigts en arc de cercle, petite et arrondie" },
  hermine:             { groupe: "5 doigts", texte: "cinq doigts, minuscule, souvent par paires" },
  lagopede_alpin:      { groupe: "oiseaux",  texte: "trois doigts épais vers l'avant, élargis par les plumes" },
  grand_corbeau:       { groupe: "oiseaux",  texte: "trois longs doigts vers l'avant et un vers l'arrière", sosies: "corvides" },   // étape 283 : sosie (Massif central)
  // Lot 2 (10/10, étape 85) : dessins tracés par Claude ; validés par Claude le 17/10 (étape 194)
  sanglier:              { groupe: "sabots",   texte: "deux sabots arrondis et, en arrière, deux gardes bien marquées" },
  mouflon_mediterraneen: { groupe: "sabots",   texte: "deux sabots pointus, serrés l'un contre l'autre" },
  lievre_variable:       { groupe: "5 doigts", texte: "pattes arrière très grandes et velues, bien plus longues que les avant", sosies: "lievres" },
  fouine:                { groupe: "5 doigts", texte: "cinq doigts et des coussinets nets ; ceux de la martre, aux pieds velus, sont plus flous" },
  castor_d_europe:       { groupe: "5 doigts", texte: "pattes arrière immenses, cinq longs doigts reliés par une palmure", sosies: "palmes_rongeurs" },
  belette:               { groupe: "5 doigts", texte: "cinq doigts, minuscule, par paires ; encore plus petite que celle de l'hermine" },
  herisson_d_europe:     { groupe: "5 doigts", texte: "cinq doigts longs et écartés, comme une petite main" },
  tetras_lyre:           { groupe: "oiseaux",  texte: "trois gros doigts vers l'avant, bordés de petites franges en hiver", sosies: "tetras" },   // étape 192
  perdrix_bartavelle:    { groupe: "oiseaux",  texte: "trois doigts fins vers l'avant et un petit doigt vers l'arrière", sosies: "perdrix" },
  gelinotte_des_bois:    { groupe: "oiseaux",  texte: "trois doigts fins, petite, le doigt arrière à peine marqué" },
  // Lot 3 (10/10, étape 95) : dessins tracés par Claude ; validés par Claude le 17/10 (étape 194)
  chocard_a_bec_jaune:   { groupe: "oiseaux",    texte: "trois doigts vers l'avant et un vers l'arrière, comme un petit corbeau" },
  merle_a_plastron:      { groupe: "oiseaux",    texte: "trois doigts fins vers l'avant et un long doigt vers l'arrière, petite" },
  vautour_fauve:         { groupe: "oiseaux",    texte: "très grande, quatre gros doigts aux griffes émoussées", sosies: "vautours" },   // étape 283 : sosie (Massif central)
  aigle_royal:           { groupe: "oiseaux",    texte: "grande, quatre doigts puissants terminés par de longues serres" },
  grand_duc_d_europe:    { groupe: "oiseaux",    texte: "en forme de X, deux doigts devant et deux derrière ; très grande, doigts emplumés" },
  chouette_hulotte:      { groupe: "oiseaux",    texte: "en forme de X, deux doigts devant et deux derrière" },
  crapaud_commun:        { groupe: "amphibiens", texte: "quatre doigts courts à l'avant, tournés vers l'intérieur ; cinq à l'arrière", sosies: "crapauds" },
  grenouille_rousse:     { groupe: "amphibiens", texte: "doigts longs et fins ; à l'arrière, cinq doigts reliés par une palmure", sosies: "grenouilles" },
  // Massif armoricain (14/10, étape 185) : 27 dessins tracés par Claude ; validés par Claude le 17/10 (étape 194).
  //   sosies : empreintes presque identiques ; elles ne servent JAMAIS de piège l'une pour l'autre
  lievre_d_europe:    { groupe: "5 doigts", texte: "quatre doigts velus et flous ; l'arrière, long et étroit, bien plus grand que l'avant", sosies: "lievres" },
  lapin_de_garenne:   { groupe: "5 doigts", texte: "comme celle du lièvre, en plus petit : quatre doigts flous, l'arrière allongé", sosies: "lievres" },
  lievre_de_corse:    { groupe: "5 doigts", texte: "comme celle du lièvre d'Europe : quatre doigts velus et flous, l'arrière long et étroit", sosies: "lievres" },   // étape 299 : Corse (même dessin que le lièvre d'Europe)
  putois_d_europe:    { groupe: "5 doigts", texte: "cinq doigts griffus en arc au-dessus d'un large coussinet, plus large que longue", sosies: "visons" },
  genette_commune:    { groupe: "4 doigts", texte: "quatre doigts ronds sans griffes, comme un petit chat (3 cm)" },
  campagnol_amphibie: { groupe: "5 doigts", texte: "quatre doigts en étoile à l'avant, cinq à l'arrière, comme un petit rat", sosies: "rongeurs" },
  taupe_d_europe:     { groupe: "5 doigts", texte: "patte avant très large, en pelle, avec cinq fortes griffes tournées vers l'extérieur" },
  crossope_aquatique: { groupe: "5 doigts", texte: "minuscule (1 à 1,5 cm), cinq doigts fins bordés de poils raides", sosies: "musaraignes" },   // étape 283 : sosie (Massif central)
  phoque_veau_marin:  { groupe: "traces", texte: "une large traînée sur le sable, bordée des marques des nageoires avant" },
  crapaud_epineux:    { groupe: "amphibiens", texte: "quatre doigts courts à l'avant, tournés vers l'intérieur ; cinq à l'arrière, un peu palmés", sosies: "crapauds" },
  grenouille_agile:   { groupe: "amphibiens", texte: "doigts très longs et fins ; à l'arrière, une palmure qui ne va pas jusqu'au bout des doigts", sosies: "grenouilles" },
  grenouille_verte:   { groupe: "amphibiens", texte: "à l'arrière, une large palmure qui va presque jusqu'au bout des doigts", sosies: "grenouilles" },
  rainette_verte:     { groupe: "amphibiens", texte: "petite, chaque doigt terminé par une pastille ronde qui colle", sosies: "rainettes" },
  pelodyte_ponctue:   { groupe: "amphibiens", texte: "toute petite, doigts fins à peine palmés", sosies: "grenouilles" },
  triton_marbre:      { groupe: "amphibiens", texte: "quatre petits doigts devant, cinq derrière, et la trace ondulée de la queue", sosies: "tritons" },
  triton_crete:       { groupe: "amphibiens", texte: "petits doigts en étoile de chaque côté d'une longue trace de queue", sosies: "tritons" },
  goeland_argente:    { groupe: "oiseaux", texte: "trois doigts reliés par une palmure aux bords droits, petit doigt arrière à peine marqué", sosies: "palmipedes" },
  huitrier_pie:       { groupe: "oiseaux", texte: "trois doigts épais, une petite palmure à la base, pas de doigt arrière" },
  courlis_cendre:     { groupe: "oiseaux", texte: "trois longs doigts fins, un peu palmés à la base, et un court doigt arrière", sosies: "limicoles" },
  avocette_elegante:  { groupe: "oiseaux", texte: "trois doigts fins presque entièrement palmés, plus fine que celle d'un goéland", sosies: "palmipedes" },
  heron_cendre:       { groupe: "oiseaux", texte: "très grande (15 cm), trois longs doigts et un long doigt arrière bien droit", sosies: "herons" },
  aigrette_garzette:  { groupe: "oiseaux", texte: "longue (9 cm), trois doigts fins et un long doigt arrière, comme un petit héron", sosies: "herons" },
  spatule_blanche:    { groupe: "oiseaux", texte: "grande (11 cm), trois longs doigts à demi palmés et un doigt arrière" },
  canard_colvert:     { groupe: "oiseaux", texte: "trois doigts entièrement palmés, aux bords arrondis ; les doigts courbés vers l'intérieur", sosies: "palmipedes" },
  tadorne_de_belon:   { groupe: "oiseaux", texte: "palmée comme celle d'un canard, un peu plus grande (6 cm)", sosies: "palmipedes" },
  bernache_cravant:   { groupe: "oiseaux", texte: "grande patte palmée (7 cm), doigts droits et épais, comme celle d'une petite oie", sosies: "palmipedes" },
  becasse_des_bois:   { groupe: "oiseaux", texte: "trois doigts fins et un petit doigt arrière ; à côté, les petits trous du bec dans la boue", sosies: "becasses" },   // étape 283 : sosie (Massif central)
  pie_bavarde:        { groupe: "oiseaux", texte: "trois doigts devant et un long doigt arrière ; souvent par paires, car elle sautille" },
  // Bassin parisien et Val de Loire (15/10, étape 189) : 19 dessins tracés par Claude ; validés par Claude le 17/10 (étape 194)
  chat_forestier:     { groupe: "4 doigts", texte: "quatre doigts ronds sans griffes, bien ronde (4 à 5 cm), comme celle d'un gros chat" },
  ragondin:           { groupe: "5 doigts", texte: "très longue patte arrière (12 à 14 cm) : quatre doigts reliés par une palmure, le cinquième libre", sosies: "palmes_rongeurs" },
  campagnol_des_champs:{ groupe: "5 doigts", texte: "minuscule (à peine 1,5 cm) : quatre doigts en étoile à l'avant, cinq à l'arrière", sosies: "rongeurs" },
  mulot_sylvestre:    { groupe: "5 doigts", texte: "toute petite : quatre doigts à l'avant, cinq longs doigts fins à l'arrière ; il se déplace par bonds", sosies: "rongeurs" },
  vanneau_huppe:      { groupe: "oiseaux", texte: "trois doigts fins (4 cm) et un minuscule doigt arrière, à peine marqué" },
  oedicneme_criard:   { groupe: "oiseaux", texte: "trois doigts épais et courts (5 à 6 cm), pas de doigt arrière" },
  perdrix_grise:      { groupe: "oiseaux", texte: "trois doigts courts vers l'avant et un petit doigt vers l'arrière (4 cm)", sosies: "perdrix" },
  caille_des_bles:    { groupe: "oiseaux", texte: "comme celle de la perdrix, en tout petit (2,5 cm)", sosies: "perdrix" },
  foulque_macroule:   { groupe: "oiseaux", texte: "trois longs doigts bordés de lobes arrondis, comme des festons (pas une palmure)" },
  heron_pourpre:      { groupe: "oiseaux", texte: "très grande (13 cm), trois longs doigts fins et un long doigt arrière", sosies: "herons" },
  grande_aigrette:    { groupe: "oiseaux", texte: "très grande (14 cm), comme celle du héron cendré : trois longs doigts et un long doigt arrière", sosies: "herons" },
  cigogne_blanche:    { groupe: "oiseaux", texte: "très grande (15 cm), trois gros doigts un peu palmés à la base, petit doigt arrière", sosies: "cigognes" },   // étape 283 : sosie (Massif central)
  petit_gravelot:     { groupe: "oiseaux", texte: "minuscule (2,5 cm), trois doigts fins et pas de doigt arrière", sosies: "gravelots" },
  pigeon_ramier:      { groupe: "oiseaux", texte: "trois doigts vers l'avant, un peu tournés vers l'intérieur, et un doigt arrière (6 cm)", sosies: "pigeons" },
  tourterelle_turque: { groupe: "oiseaux", texte: "comme celle du pigeon, en plus petit (4,5 cm)", sosies: "pigeons" },
  triton_ponctue:     { groupe: "amphibiens", texte: "toute petite : quatre doigts devant, cinq derrière, et la trace ondulée de la queue", sosies: "tritons" },
  cistude_d_europe:   { groupe: "traces", texte: "deux rangées de petites pattes griffues de part et d'autre d'une traînée laissée par la carapace", sosies: "tortues" },
  couleuvre_viperine: { groupe: "traces", texte: "une trace ondulée en S, sans aucune patte", sosies: "serpents" },
  lezard_des_souches: { groupe: "traces", texte: "cinq doigts longs et fins, griffus, et la fine trace de la queue entre les pattes", sosies: "lezards" },
  // Méditerranée (17/10, étape 191) : 15 dessins tracés par Claude ; validés par Claude le 17/10 (étape 194)
  musaraigne_des_jardins:{ groupe: "5 doigts", texte: "minuscule (moins d'1 cm), cinq doigts fins en éventail à l'avant comme à l'arrière", sosies: "musaraignes" },
  pachyure_etrusque:  { groupe: "5 doigts", texte: "la plus petite de toutes (à peine 0,5 cm), cinq doigts fins en éventail", sosies: "musaraignes" },
  campagnol_provencal:{ groupe: "5 doigts", texte: "minuscule (1,5 cm) : quatre doigts en étoile à l'avant, cinq à l'arrière, comme celle du campagnol des champs", sosies: "rongeurs" },
  flamant_rose:       { groupe: "oiseaux", texte: "grande (10 cm), trois doigts reliés par une palmure creusée en arc, presque pas de doigt arrière", sosies: "palmipedes" },
  puffin_de_scopoli:  { groupe: "oiseaux", texte: "trois longs doigts entièrement palmés, étroite (6 cm), sans doigt arrière", sosies: "palmipedes" },
  crabier_chevelu:    { groupe: "oiseaux", texte: "trois doigts fins et un long doigt arrière, comme un tout petit héron (6 cm)", sosies: "herons" },
  outarde_canepetiere:{ groupe: "oiseaux", texte: "trois doigts courts et épais (5 cm), sans doigt arrière" },
  perdrix_rouge:      { groupe: "oiseaux", texte: "trois doigts courts vers l'avant et un petit doigt vers l'arrière (4,5 cm), comme celle de la perdrix grise", sosies: "perdrix" },
  tortue_d_hermann:   { groupe: "traces", texte: "deux rangées de pattes griffues, sans traînée de queue, de part et d'autre du sillon de la carapace", sosies: "tortues" },
  tortue_caouanne:    { groupe: "traces", texte: "sur la plage, une très large trace (70 à 90 cm) bordée de marques de nageoires en quinconce" },
  lezard_ocelle:      { groupe: "traces", texte: "grande (3 cm par patte), cinq doigts longs et griffus, avec une large trace de queue entre les pattes", sosies: "lezards" },
  couleuvre_de_montpellier:{ groupe: "traces", texte: "une large trace ondulée en S, sans aucune patte", sosies: "serpents" },
  rainette_meridionale:{ groupe: "amphibiens", texte: "petite, chaque doigt terminé par une pastille ronde qui colle, comme celle de la rainette verte", sosies: "rainettes" },
  pelobate_cultripede:{ groupe: "amphibiens", texte: "patte arrière bien palmée avec, à sa base, une grosse lame noire en forme de couteau (pour creuser)" },
  discoglosse_peint:  { groupe: "amphibiens", texte: "doigts fins et pointus ; à l'arrière, une palmure très courte, seulement à la base des doigts", sosies: "grenouilles" },
  // Pyrénées (17/10, étape 192) : 11 dessins tracés par Claude (empreintes_pyrenees.py) ; validés par Claude le 17/10 (étape 194) ;
  // isard et bouquetin ibérique reprennent les dessins du chamois et du bouquetin des Alpes (empreintes identiques)
  isard:              { groupe: "sabots", texte: "deux sabots étroits, nettement écartés, comme ceux du chamois", sosies: "chamois" },
  bouquetin_iberique: { groupe: "sabots", texte: "deux sabots larges, aux bouts très arrondis, comme ceux du bouquetin des Alpes", sosies: "bouquetins" },
  ours_brun:          { groupe: "5 doigts", texte: "énorme (jusqu'à 25 cm), cinq gros doigts alignés et griffus au-dessus d'une large sole, comme un pied humain" },
  desman_des_pyrenees:{ groupe: "5 doigts", texte: "petite (2 cm), cinq doigts griffus reliés par une palmure, au bord des torrents" },
  campagnol_roussatre:{ groupe: "5 doigts", texte: "minuscule (1,5 cm) : quatre doigts en étoile à l'avant, cinq à l'arrière", sosies: "rongeurs" },
  mulot_a_collier:    { groupe: "5 doigts", texte: "petite : quatre doigts à l'avant, cinq longs doigts à l'arrière, comme celle du mulot sylvestre", sosies: "rongeurs" },
  grand_tetras:       { groupe: "oiseaux", texte: "très grande (10 cm), trois gros doigts vers l'avant et un petit doigt arrière, comme une grosse poule", sosies: "tetras" },
  pic_a_dos_blanc:    { groupe: "oiseaux", texte: "deux doigts vers l'avant et deux vers l'arrière, en X, pour s'agripper aux troncs" },
  calotriton_des_pyrenees:{ groupe: "amphibiens", texte: "petits doigts en étoile de chaque côté de la trace de la queue, au fond des torrents", sosies: "tritons" },
  grenouille_des_pyrenees:{ groupe: "amphibiens", texte: "doigts fins ; à l'arrière, une palmure bien développée (grenouille des torrents)", sosies: "grenouilles" },
  lezard_de_bonnal:   { groupe: "traces", texte: "cinq doigts longs et fins, griffus, et la fine trace de la queue entre les pattes", sosies: "lezards" },
  vipere_de_seoane:   { groupe: "traces", texte: "une trace ondulée en S, sans aucune patte", sosies: "serpents" },
  coronelle_girondine:{ groupe: "traces", texte: "une trace ondulée en S, sans aucune patte", sosies: "serpents" },
  // Bassin aquitain (22/10, étape 235) : 14 empreintes (empreintes_bassin_aquitain.py), validées par Claude.
  //   visons = dessin du putois ; goéland leucophée, tourterelle des bois, gravelot à collier interrompu, tortue de Floride :
  //   dessins de leur sosie. Nouveaux groupes de sosies : visons (+ putois), gravelots (+ petit gravelot), limicoles (barge + courlis).
  vison_d_europe:       { groupe: "5 doigts", texte: "cinq doigts griffus en arc au-dessus d'un large coussinet, comme celle du putois ; au bord de l'eau", sosies: "visons" },
  vison_d_amerique:     { groupe: "5 doigts", texte: "cinq doigts griffus en arc au-dessus d'un large coussinet, comme celle du vison d'Europe ; au bord de l'eau", sosies: "visons" },
  rat_musque:           { groupe: "5 doigts", texte: "quatre doigts à l'avant ; à l'arrière, cinq longs doigts bordés de poils raides (6 à 7 cm), sans palmure" },
  grue_cendree:         { groupe: "oiseaux", texte: "très grande (11 cm), trois longs doigts droits et un minuscule doigt arrière" },
  heron_garde_boeufs:   { groupe: "oiseaux", texte: "moyenne (7 cm), trois doigts fins et un long doigt arrière, comme un petit héron", sosies: "herons" },
  echasse_blanche:      { groupe: "oiseaux", texte: "trois longs doigts très fins, une petite palmure à la base, pas de doigt arrière" },
  barge_a_queue_noire:  { groupe: "oiseaux", texte: "trois longs doigts fins (5 cm), à peine palmés à la base, et un petit doigt arrière", sosies: "limicoles" },
  ibis_falcinelle:      { groupe: "oiseaux", texte: "grande (7 cm), trois longs doigts un peu palmés à la base et un long doigt arrière" },
  goeland_leucophee:    { groupe: "oiseaux", texte: "trois doigts reliés par une palmure aux bords droits, comme celle du goéland argenté", sosies: "palmipedes" },
  tourterelle_des_bois: { groupe: "oiseaux", texte: "comme celle de la tourterelle turque : trois doigts vers l'avant et un doigt arrière (4 cm)", sosies: "pigeons" },
  gravelot_a_collier_interrompu:{ groupe: "oiseaux", texte: "minuscule (2,5 cm), trois doigts fins et pas de doigt arrière, comme celle du petit gravelot", sosies: "gravelots" },
  becasseau_sanderling: { groupe: "oiseaux", texte: "minuscule (3 cm), trois doigts fins et pas de doigt arrière, chose rare chez les bécasseaux", sosies: "gravelots" },
  tortue_de_floride:    { groupe: "traces", texte: "deux rangées de petites pattes griffues de part et d'autre d'une traînée, comme celle de la cistude", sosies: "tortues" },
  tortue_luth:          { groupe: "traces", texte: "sur la plage, une trace immense (1,5 à 2,3 m) avec des marques de nageoires face à face, des deux côtés en même temps" },
  // Étape 283 (25/10/2026) : Massif central (territoire pas encore actif)
  raton_laveur:         { groupe: "5 doigts", texte: "comme de petites mains : cinq longs doigts bien séparés ; l'arrière, plus long, pose tout le talon" },
  campagnol_terrestre:  { groupe: "5 doigts", texte: "quatre doigts en étoile à l'avant, cinq à l'arrière, comme celle du campagnol amphibie", sosies: "rongeurs" },
  campagnol_agreste:    { groupe: "5 doigts", texte: "minuscule : quatre doigts en étoile à l'avant, cinq à l'arrière, comme celle du campagnol des champs", sosies: "rongeurs" },
  campagnol_souterrain: { groupe: "5 doigts", texte: "minuscule : quatre doigts en étoile à l'avant, cinq à l'arrière ; on la voit rarement, il vit sous terre", sosies: "rongeurs" },
  souris_grise:         { groupe: "5 doigts", texte: "minuscule : quatre doigts à l'avant, cinq à l'arrière, comme celle du mulot en plus petit", sosies: "rongeurs" },
  rat_noir:             { groupe: "5 doigts", texte: "quatre doigts à l'avant, cinq longs doigts à l'arrière, comme celle du surmulot en un peu plus petit", sosies: "rongeurs" },
  surmulot:             { groupe: "5 doigts", texte: "quatre doigts à l'avant, cinq longs doigts à l'arrière, la plus grande des empreintes de rats et souris", sosies: "rongeurs" },
  musaraigne_musette:   { groupe: "5 doigts", texte: "minuscule (1 cm environ), cinq doigts fins en éventail à l'avant comme à l'arrière", sosies: "musaraignes" },
  musaraigne_pygmee:    { groupe: "5 doigts", texte: "minuscule, l'une des plus petites : cinq doigts fins en éventail", sosies: "musaraignes" },
  crocidure_leucode:    { groupe: "5 doigts", texte: "minuscule (1 cm environ), cinq doigts fins en éventail, comme celle de la musaraigne musette", sosies: "musaraignes" },
  crossope_de_miller:   { groupe: "5 doigts", texte: "minuscule, cinq doigts fins bordés de poils raides, comme celle de la crossope aquatique ; au bord de l'eau", sosies: "musaraignes" },
  corneille_noire:      { groupe: "oiseaux", texte: "trois doigts vers l'avant et un long doigt vers l'arrière, comme celle du grand corbeau en plus petit", sosies: "corvides" },
  cigogne_noire:        { groupe: "oiseaux", texte: "très grande, trois gros doigts un peu palmés à la base, comme celle de la cigogne blanche", sosies: "cigognes" },
  becassine_des_marais: { groupe: "oiseaux", texte: "trois longs doigts fins et un petit doigt arrière, dans la boue molle, comme celle de la bécasse", sosies: "becasses" },
  vautour_moine:        { groupe: "oiseaux", texte: "très grande, quatre gros doigts aux griffes émoussées, comme celle du vautour fauve", sosies: "vautours" },
  // Jura (26/10, étape 302) : même dessin que la musaraigne pygmée (même genre)
  musaraigne_carrelet:  { groupe: "5 doigts", texte: "minuscule (1 cm environ), cinq doigts fins en éventail, comme celle des autres musaraignes", sosies: "musaraignes" },
  musaraigne_alpine:    { groupe: "5 doigts", texte: "minuscule, cinq doigts fins en éventail ; souvent au bord des ruisseaux de montagne", sosies: "musaraignes" },
};
// Le nom de fichier d'une espèce, sans dossier ni extension : "Images/loup_gris.jpg" → "loup_gris"
function cleEmpreinte(espece) {
  if (!estRenseigne(espece.photo)) return nomDeFichier(espece.nom_courant);   // étape 299 : sans photo, le nom de l'espèce (comme la silhouette)
  return espece.photo.replace("Images/", "").replace(".jpg", "");
}
// Le dessin de son empreinte, ou "NA" si l'on n'en a pas (la question n'est alors pas posée)
function fichierEmpreinte(espece) {
  const cle = cleEmpreinte(espece);
  return EMPREINTES[cle] ? `Empreintes/${cle}.svg` : "NA";
}
function texteEmpreinte(espece) {
  return `Son empreinte : ${EMPREINTES[cleEmpreinte(espece)].texte}.`;
}

// ---- Les cris à écouter (étape 29) ----------------------------------------
// Un enregistrement par espèce, rangé dans le dossier "Sons" sous le MÊME nom que la photo
// (Images/loup_gris.jpg → Sons/loup_gris.mp3).
//   ext   : le format du fichier (mp3 ou ogg)
//   texte : ce qu'on entend, affiché après la réponse ("On entendait son brame.")
const SONS = {
  cerf_elaphe:            { ext: "ogg", texte: "son brame" },
  loup_gris:              { ext: "mp3", texte: "son hurlement" },
  marmotte_des_alpes:     { ext: "ogg", texte: "son sifflement d'alerte" },
  renard_roux:            { ext: "ogg", texte: "son glapissement" },
  chevreuil:              { ext: "mp3", texte: "son aboiement" },
  chouette_hulotte:       { ext: "ogg", texte: "son hululement" },
  grand_corbeau:          { ext: "ogg", texte: "son croassement grave" },
  pic_noir:               { ext: "ogg", texte: "son cri de printemps" },
  chocard_a_bec_jaune:    { ext: "mp3", texte: "ses sifflements" },
  aigle_royal:            { ext: "ogg", texte: "son glatissement" },
  faucon_pelerin:         { ext: "mp3", texte: "ses cris près du nid" },
  lagopede_alpin:         { ext: "ogg", texte: "son cri rauque" },
  tichodrome_echelette:   { ext: "mp3", texte: "son sifflement" },
  vautour_fauve:          { ext: "mp3", texte: "ses cris" },
  crapaud_commun:         { ext: "mp3", texte: "son coassement" },
  grenouille_rousse:      { ext: "mp3", texte: "son chant" },
  sonneur_a_ventre_jaune: { ext: "mp3", texte: "son chant flûté" },
  // Lot 2 (étape 93) : 30 cris de xeno-canto et Wikimedia Commons, découpés (5 à 10 s), volume égalisé
  tetras_lyre:            { ext: "mp3", texte: "son chant roulé" },
  perdrix_bartavelle:     { ext: "mp3", texte: "son chant" },
  gelinotte_des_bois:     { ext: "mp3", texte: "son sifflement aigu" },
  niverolle_alpine:       { ext: "mp3", texte: "son chant" },
  accenteur_alpin:        { ext: "mp3", texte: "son chant" },
  cincle_plongeur:        { ext: "mp3", texte: "son chant" },
  cassenoix_mouchete:     { ext: "mp3", texte: "son cri rauque" },
  crave_a_bec_rouge:      { ext: "mp3", texte: "ses cris" },
  grand_duc_d_europe:     { ext: "mp3", texte: "son hululement grave" },
  chevechette_d_europe:   { ext: "mp3", texte: "son chant flûté" },
  buse_variable:          { ext: "mp3", texte: "son miaulement" },
  faucon_crecerelle:      { ext: "mp3", texte: "ses cris répétés" },
  circaete_jean_le_blanc: { ext: "mp3", texte: "son cri" },
  merle_a_plastron:       { ext: "mp3", texte: "son chant" },
  bec_croise_des_sapins:  { ext: "mp3", texte: "ses cris" },
  pic_epeiche:            { ext: "mp3", texte: "son cri « kik »" },
  choucas_des_tours:      { ext: "mp3", texte: "ses cris" },
  alyte_accoucheur:       { ext: "mp3", texte: "son chant flûté" },
  crapaud_calamite:       { ext: "mp3", texte: "son chant" },
  gypaete_barbu:          { ext: "mp3", texte: "son sifflement" },
  chamois:                { ext: "mp3", texte: "son sifflement d'alerte" },
  bouquetin_des_alpes:    { ext: "mp3", texte: "son cri d'alerte" },
  ecureuil_roux:          { ext: "mp3", texte: "ses cris d'alarme" },
  lynx_boreal:            { ext: "mp3", texte: "ses cris" },
  blaireau_europeen:      { ext: "mp3", texte: "ses grognements" },
  sanglier:               { ext: "mp3", texte: "ses grognements" },
  loir_gris:              { ext: "mp3", texte: "ses cris" },
  // herisson_d_europe : plus de cri (R181, choix d'Aubin du 09/11 : on n'entendait que son souffle ; xeno-canto n'a que des souffles et des cris de détresse)
  grande_sauterelle_verte:{ ext: "mp3", texte: "sa stridulation" },
  oedipode_stridulante:   { ext: "mp3", texte: "son crépitement en vol" },
  // Massif armoricain (14/10, étape 186) : premier lot de 10 cris, xeno-canto (crédits dans credits_photos_sons.xlsx)
  merle_noir:             { ext: "mp3", texte: "son chant flûté" },
  rougegorge_familier:    { ext: "mp3", texte: "son chant en cascade" },
  mesange_bleue:          { ext: "mp3", texte: "son chant aigu et roulé" },
  pinson_des_arbres:      { ext: "mp3", texte: "son chant qui finit par une fioriture" },
  coucou_gris:            { ext: "mp3", texte: "son « cou-cou »" },
  pic_vert:               { ext: "mp3", texte: "son cri qui ressemble à un rire" },
  goeland_argente:        { ext: "mp3", texte: "son long cri sonore, répété" },
  effraie_des_clochers:   { ext: "mp3", texte: "son cri chuinté" },
  rainette_verte:         { ext: "mp3", texte: "son chant rapide et sonore, en chœur" },
  grenouille_verte:       { ext: "mp3", texte: "son coassement" },
  // Massif armoricain (15/10, étape 187) : 46 cris de plus (xeno-canto ; bourdon et abeille : Wikimedia Commons)
  macareux_moine:         { ext: "mp3", texte: "son grognement sourd" },   // étape 230 : nouvel enregistrement (British Library)
  fou_de_bassan:          { ext: "mp3", texte: "les cris rauques de sa colonie" },   // étape 230 : nouvel enregistrement (British Library), moins bruité
  pingouin_torda:         { ext: "mp3", texte: "son grognement grave" },   // étape 230 : nouvel enregistrement (British Library), sans voix humaines
  guillemot_de_troil:     { ext: "mp3", texte: "les grognements de sa colonie" },
  fulmar_boreal:          { ext: "mp3", texte: "son caquètement rauque" },
  puffin_des_anglais:     { ext: "mp3", texte: "ses cris de nuit, comme des gémissements" },
  oceanite_tempete:       { ext: "mp3", texte: "son cri de nuit, en vol" },
  mouette_tridactyle:     { ext: "mp3", texte: "son cri « kitti-wake »" },
  goeland_marin:          { ext: "mp3", texte: "son cri grave et rauque" },
  goeland_brun:           { ext: "mp3", texte: "ses cris rauques" },
  mouette_rieuse:         { ext: "mp3", texte: "ses cris grinçants" },
  sterne_caugek:          { ext: "mp3", texte: "son cri grinçant « kirrik »" },
  sterne_pierregarin:     { ext: "mp3", texte: "son cri aigu « kriii-ah »" },
  grand_cormoran:         { ext: "mp3", texte: "ses croassements graves" },
  cormoran_huppe:         { ext: "mp3", texte: "ses grognements" },
  huitrier_pie:           { ext: "mp3", texte: "ses cris aigus « klip »" },
  courlis_cendre:         { ext: "mp3", texte: "son cri « cour-li »" },
  becasseau_variable:     { ext: "mp3", texte: "son chant de parade, un long trille" },   // étape 230 : nouvel enregistrement (British Library), moins bruité
  grand_gravelot:         { ext: "mp3", texte: "son cri doux « touip »" },
  tournepierre_a_collier: { ext: "mp3", texte: "son cri en cliquetis" },
  aigrette_garzette:      { ext: "mp3", texte: "son cri rauque" },
  heron_cendre:           { ext: "mp3", texte: "son cri rauque « kraank »" },
  spatule_blanche:        { ext: "mp3", texte: "les cris des jeunes qui réclament à manger" },
  bernache_cravant:       { ext: "mp3", texte: "ses cris roulés « rronk »" },
  tadorne_de_belon:       { ext: "mp3", texte: "ses cris" },
  avocette_elegante:      { ext: "mp3", texte: "son cri flûté « kloup »" },
  gorgebleue_a_miroir:    { ext: "mp3", texte: "son chant varié" },
  busard_des_roseaux:     { ext: "mp3", texte: "son cri aigu" },
  martin_pecheur_d_europe:{ ext: "mp3", texte: "son cri perçant" },
  canard_colvert:         { ext: "mp3", texte: "son cancanement" },
  busard_saint_martin:    { ext: "mp3", texte: "son cri d'alarme" },
  engoulevent_d_europe:   { ext: "mp3", texte: "son cri et ses claquements d'ailes" },
  fauvette_pitchou:       { ext: "mp3", texte: "son chant grinçant" },
  tarier_patre:           { ext: "mp3", texte: "son chant" },
  linotte_melodieuse:     { ext: "mp3", texte: "son chant gazouillé" },
  geai_des_chenes:        { ext: "mp3", texte: "son cri rauque" },
  pie_bavarde:            { ext: "mp3", texte: "son jacassement" },
  hirondelle_rustique:    { ext: "mp3", texte: "son gazouillis" },
  bruant_zizi:            { ext: "mp3", texte: "son chant en trille" },
  becasse_des_bois:       { ext: "mp3", texte: "son chant en vol, au crépuscule" },
  grenouille_agile:       { ext: "mp3", texte: "son chant discret et rapide" },
  crapaud_epineux:        { ext: "mp3", texte: "son chant" },
  pelodyte_ponctue:       { ext: "mp3", texte: "son chant grinçant" },
  criquet_ensanglante:    { ext: "mp3", texte: "ses claquements secs" },
  bourdon_terrestre:      { ext: "mp3", texte: "son bourdonnement" },
  abeille_mellifere:      { ext: "mp3", texte: "le bourdonnement d'une ruche" },
  // Bassin parisien et Val de Loire (15/10, étape 188) : 32 cris (31 oiseaux + grillon champêtre ; butor retiré : chant trop grave), xeno-canto ;
  // préparés par Code/Outils/preparer_sons_bassin_parisien.py (montage automatique des cris espacés, bruit réduit)
  oedicneme_criard:       { ext: "mp3", texte: "son cri nocturne, sifflé et plaintif" },
  busard_cendre:          { ext: "mp3", texte: "ses cris près du nid" },
  perdrix_grise:          { ext: "mp3", texte: "son cri grinçant « kirr-ik »" },
  alouette_des_champs:    { ext: "mp3", texte: "son chant continu, en vol" },
  caille_des_bles:        { ext: "mp3", texte: "son chant « paye-tes-dettes »" },
  vanneau_huppe:          { ext: "mp3", texte: "son cri « pi-ouit »" },
  cheveche_d_athena:      { ext: "mp3", texte: "son chant miaulé « kiou »" },
  sterne_naine:           { ext: "mp3", texte: "ses cris aigus et rapides" },
  guepier_d_europe:       { ext: "mp3", texte: "son cri roulé « prruip »" },
  hirondelle_de_rivage:   { ext: "mp3", texte: "ses gazouillis grinçants" },
  petit_gravelot:         { ext: "mp3", texte: "son cri sifflé « piou »" },
  balbuzard_pecheur:      { ext: "mp3", texte: "ses sifflements plaintifs" },
  bihoreau_gris:          { ext: "mp3", texte: "son cri rauque « kwak »" },
  guifette_moustac:       { ext: "mp3", texte: "ses cris grinçants en vol" },
  grebe_huppe:            { ext: "mp3", texte: "ses cris de parade" },
  heron_pourpre:          { ext: "mp3", texte: "son cri rauque" },
  grande_aigrette:        { ext: "mp3", texte: "son cri rauque et grinçant" },
  foulque_macroule:       { ext: "mp3", texte: "ses cris secs « kt »" },
  pic_mar:                { ext: "mp3", texte: "son cri rapide en série" },
  loriot_d_europe:        { ext: "mp3", texte: "son chant flûté « dudlio »" },
  sittelle_torchepot:     { ext: "mp3", texte: "ses sifflements sonores" },
  rossignol_philomele:    { ext: "mp3", texte: "son chant puissant et varié" },
  pigeon_ramier:          { ext: "mp3", texte: "son roucoulement en cinq notes" },
  martinet_noir:          { ext: "mp3", texte: "ses cris stridents en vol" },
  moineau_domestique:     { ext: "mp3", texte: "ses pépiements" },
  mesange_charbonniere:   { ext: "mp3", texte: "son chant « ti-tu ti-tu »" },
  etourneau_sansonnet:    { ext: "mp3", texte: "son chant plein d'imitations" },
  tourterelle_turque:     { ext: "mp3", texte: "son roucoulement en trois notes" },
  cigogne_blanche:        { ext: "mp3", texte: "son claquement de bec" },
  huppe_fasciee:          { ext: "mp3", texte: "son chant « oup-oup-oup »" },
  pie_grieche_ecorcheur:  { ext: "mp3", texte: "ses cris d'alarme" },
  grillon_champetre:      { ext: "mp3", texte: "sa stridulation devant son terrier" },
  // Méditerranée (17/10, étape 191) : 19 cris (16 xeno-canto, 3 iNaturalist) ; préparés par Code/Outils/preparer_sons_mediterranee.py
  flamant_rose:           { ext: "mp3", texte: "ses cris nasillards, comme ceux d'une oie" },
  puffin_de_scopoli:      { ext: "mp3", texte: "ses cris plaintifs, la nuit, près de la colonie" },
  crabier_chevelu:        { ext: "mp3", texte: "son cri rauque en vol" },
  outarde_canepetiere:    { ext: "mp3", texte: "le « prrt » sec du mâle" },
  faucon_crecerellette:   { ext: "mp3", texte: "ses cris aigus en colonie" },
  aigle_de_bonelli:       { ext: "mp3", texte: "ses cris en vol" },
  petit_duc_scops:        { ext: "mp3", texte: "son chant « tiou » flûté, répété la nuit" },
  rollier_d_europe:       { ext: "mp3", texte: "ses cris rauques « rak-rak »" },
  coucou_geai:            { ext: "mp3", texte: "ses cris crépitants" },
  pie_grieche_meridionale:{ ext: "mp3", texte: "son chant grinçant" },
  fauvette_melanocephale: { ext: "mp3", texte: "son chant crépitant et pressé" },
  traquet_oreillard:      { ext: "mp3", texte: "son chant grinçant" },   // étape 195 : nouvel enregistrement (Fitou, Aude), moins bruité
  remiz_penduline:        { ext: "mp3", texte: "son cri fin et étiré « tsiiou »" },
  perdrix_rouge:          { ext: "mp3", texte: "son chant « tchouk-tchouk-tchoukar »" },
  rainette_meridionale:   { ext: "mp3", texte: "son chant « crac… crac » lent et grave" },
  // molosse_de_cestoni retiré (étape 195) : cris au-dessus de 10 kHz, inaudibles sur de petits haut-parleurs
  cigale_plebeienne:      { ext: "mp3", texte: "sa cymbalisation puissante" },
  cigale_grise:           { ext: "mp3", texte: "son chant grinçant" },
  pelobate_cultripede:    { ext: "mp3", texte: "son chant sourd, sous l'eau" },
  // Pyrénées (17/10, étape 195) : 15 cris xeno-canto, préparés par Code/Outils/preparer_sons_pyrenees.py ; dectique sans cri (inaudible, au-dessus de 10 kHz)
  grand_tetras:           { ext: "mp3", texte: "son chant de parade, fait de claquements secs" },
  pic_a_dos_blanc:        { ext: "mp3", texte: "son long tambourinage, qui accélère à la fin" },
  milan_royal:            { ext: "mp3", texte: "son cri sifflé et chevrotant" },
  bondree_apivore:        { ext: "mp3", texte: "son cri sifflé et plaintif" },
  aigle_botte:            { ext: "mp3", texte: "ses cris aigus et répétés" },
  rougequeue_noir:        { ext: "mp3", texte: "son chant grinçant, comme du papier froissé" },
  monticole_de_roche:     { ext: "mp3", texte: "son chant flûté" },
  hirondelle_de_rochers:  { ext: "mp3", texte: "ses petits cris secs" },
  martinet_a_ventre_blanc:{ ext: "mp3", texte: "ses trilles sonores en vol" },
  pipit_spioncelle:       { ext: "mp3", texte: "son chant, une série de notes répétées" },
  venturon_montagnard:    { ext: "mp3", texte: "son chant gazouillé" },
  bouvreuil_pivoine:      { ext: "mp3", texte: "son chant doux et sifflé" },
  mesange_noire:          { ext: "mp3", texte: "son chant rapide à deux notes" },
  roitelet_huppe:         { ext: "mp3", texte: "son chant très aigu" },
  grimpereau_des_bois:    { ext: "mp3", texte: "son chant aigu qui descend" },  // Massif armoricain (21/10, étape 229) : 2 cris iNaturalist (CC BY-NC), préparés à la main (ffmpeg) ; crédits dans credits_photos_sons.xlsx.
  // Phoque veau-marin et grand dauphin restent sans cri (aucun enregistrement libre et sûr en Europe).
  phoque_gris:            { ext: "mp3", texte: "ses longs gémissements" },
  loutre_d_europe:        { ext: "mp3", texte: "ses sifflements d'appel" },
  // Bassin aquitain (22/10, étape 236) : 16 cris xeno-canto + cigale rouge (iNaturalist, CC BY-NC), préparés par Code/Outils/preparer_sons_bassin_aquitain.py ;
  // héron garde-bœufs sans cri (5 enregistrements essayés, cris faibles et noyés dans le bruit).
  grue_cendree:           { ext: "mp3", texte: "ses cris roulés « krrrou »" },
  elanion_blanc:          { ext: "mp3", texte: "ses petits cris sifflés" },
  echasse_blanche:        { ext: "mp3", texte: "ses cris « kjück » répétés" },
  barge_a_queue_noire:    { ext: "mp3", texte: "les cris répétés d'un groupe" },
  bruant_ortolan:         { ext: "mp3", texte: "son chant, des notes répétées qui descendent" },
  milan_noir:             { ext: "mp3", texte: "son sifflement tremblé, comme un hennissement" },
  goeland_leucophee:      { ext: "mp3", texte: "ses cris nasaux" },
  bouscarle_de_cetti:     { ext: "mp3", texte: "son chant court et explosif" },
  cisticole_des_joncs:    { ext: "mp3", texte: "son « tsip » monotone et répété" },
  tourterelle_des_bois:   { ext: "mp3", texte: "son roucoulement grave « tourrr tourrr »" },
  ibis_falcinelle:        { ext: "mp3", texte: "ses croassements rauques" },
  rousserolle_effarvatte: { ext: "mp3", texte: "son babil scandé, un peu bredouillé" },
  alouette_lulu:          { ext: "mp3", texte: "son chant mélodieux qui descend" },
  gravelot_a_collier_interrompu:{ ext: "mp3", texte: "ses petits cris « bip »" },
  becasseau_sanderling:   { ext: "mp3", texte: "ses cris brefs « plitt »" },
  pie_grieche_a_tete_rousse:{ ext: "mp3", texte: "son chant fait de gazouillis et d'imitations" },
  cigale_rouge:           { ext: "mp3", texte: "sa cymbalisation stridente et continue" },
  // Étape 283 (25/10/2026) : Massif central (territoire pas encore actif)
  cigogne_noire:          { ext: "mp3", texte: "ses cris en vol, à deux" },
  autour_des_palombes:    { ext: "mp3", texte: "ses cris « kiak kiak » près du nid" },
  epervier_d_europe:      { ext: "mp3", texte: "ses cris « kiou kiou »" },
  faucon_hobereau:        { ext: "mp3", texte: "ses cris aigus « kikiki »" },
  chouette_de_tengmalm:   { ext: "mp3", texte: "son chant, une série de « hou » courts" },
  hibou_moyen_duc:        { ext: "mp3", texte: "son chant, des « hou » graves et espacés" },
  becassine_des_marais:   { ext: "mp3", texte: "son cri rauque à l'envol" },
  pie_grieche_grise:      { ext: "mp3", texte: "son chant sifflé" },
  tarier_des_pres:        { ext: "mp3", texte: "son chant" },
  traquet_motteux:        { ext: "mp3", texte: "son chant sifflé et crépitant" },
  pipit_farlouse:         { ext: "mp3", texte: "son chant" },
  pipit_des_arbres:       { ext: "mp3", texte: "son chant" },
  bruant_jaune:           { ext: "mp3", texte: "son chant terminé par une note traînante" },
  bruant_fou:             { ext: "mp3", texte: "son chant aigu" },
  bergeronnette_des_ruisseaux:{ ext: "mp3", texte: "ses cris métalliques « tjip »" },
  bergeronnette_grise:    { ext: "mp3", texte: "ses cris « tsli-vitt »" },
  grive_draine:           { ext: "mp3", texte: "son chant flûté" },
  pic_epeichette:         { ext: "mp3", texte: "ses cris « kikiki » et son tambourinage" },
  torcol_fourmilier:      { ext: "mp3", texte: "son chant nasal « ty-ty-ty »" },
  rougequeue_a_front_blanc:{ ext: "mp3", texte: "son chant" },
  mesange_huppee:         { ext: "mp3", texte: "son trille roulant" },
  mesange_boreale:        { ext: "mp3", texte: "son chant de notes sifflées" },
  mesange_nonnette:       { ext: "mp3", texte: "son chant « piu piu piu »" },
  pouillot_de_bonelli:    { ext: "mp3", texte: "son trille rapide" },
  pouillot_veloce:        { ext: "mp3", texte: "son chant « chiff-chaff »" },
  accenteur_mouchet:      { ext: "mp3", texte: "son chant rapide et grinçant" },
  fauvette_a_tete_noire:  { ext: "mp3", texte: "son chant flûté" },
  corneille_noire:        { ext: "mp3", texte: "son croassement « kraa »" },
  chardonneret_elegant:   { ext: "mp3", texte: "son gazouillis" },
  verdier_d_europe:       { ext: "mp3", texte: "son chant et son « djjiii » vibrant" },
  moineau_friquet:        { ext: "mp3", texte: "ses cris « tett tett »" },
  ephippigere_des_vignes: { ext: "mp3", texte: "sa stridulation" },
  // Étape 299 (26/10/2026) : Corse (xeno-canto, enregistrements corses en priorité)
  corneille_mantelee:     { ext: "mp3", texte: "ses croassements « kraa »" },   // étape 332 : nouvel enregistrement (Sari-Solenzara)
  moineau_cisalpin:       { ext: "mp3", texte: "son pépiement « tchirp »" },
  etourneau_unicolore:    { ext: "mp3", texte: "son chant sifflé" },
  venturon_corse:         { ext: "mp3", texte: "son chant" },
  sittelle_corse:         { ext: "mp3", texte: "son chant, une série de « pu » sifflés" },
  hirondelle_de_fenetre:  { ext: "mp3", texte: "son gazouillis" },
  serin_cini:             { ext: "mp3", texte: "son chant grésillant" },
  mesange_a_longue_queue: { ext: "mp3", texte: "ses cris aigus" },
  pigeon_biset:           { ext: "mp3", texte: "son roucoulement" },
  chevalier_guignette:    { ext: "mp3", texte: "ses cris « hididi »" },
  roitelet_a_triple_bandeau:{ ext: "mp3", texte: "ses petits cris aigus" },
  fauvette_sarde:         { ext: "mp3", texte: "son chant crépitant" },
  gallinule_poule_d_eau:  { ext: "mp3", texte: "ses cris brefs" },
  grebe_castagneux:       { ext: "mp3", texte: "son trille hennissant" },
  fauvette_de_moltoni:    { ext: "mp3", texte: "son chant et ses cris « trrr »" },
  bruant_proyer:          { ext: "mp3", texte: "son chant, comme un trousseau de clés" },
  troglodyte_mignon:      { ext: "mp3", texte: "son chant puissant en trilles" },
  goeland_d_audouin:      { ext: "mp3", texte: "ses cris" },
  grive_musicienne:       { ext: "mp3", texte: "son chant aux phrases répétées" },
  monticole_bleu:         { ext: "mp3", texte: "son chant flûté" },
  martinet_pale:          { ext: "mp3", texte: "ses cris en vol" },
  puffin_yelkouan:        { ext: "mp3", texte: "ses caquètements rauques, la nuit" },
  faucon_d_eleonore:      { ext: "mp3", texte: "ses cris « kek-kek »" },
  pipit_rousseline:       { ext: "mp3", texte: "son chant « zirluih »" },
};
// L'enregistrement de son cri, ou "NA" si l'on n'en a pas (la question n'est alors pas posée)
function fichierSon(espece) {
  const cle = cleEmpreinte(espece);          // même outil que pour les empreintes : le nom de la photo
  return SONS[cle] ? `Sons/${cle}.${SONS[cle].ext}` : "NA";
}

// ---- Ce que mesure la "taille" (étape 30) ----------------------------------
// Le tableur n'a qu'une colonne taille, mais elle ne mesure pas la même chose selon
// l'animal. On le dit donc en toutes lettres, dans la question, l'explication et la fiche.
//   question    : la phrase posée au joueur
//   explication : la phrase affichée après la réponse (v = le nombre déjà écrit à la française)
//   fiche       : le petit complément affiché dans l'encyclopédie, après "150 cm"
const MESURES_TAILLE = {
  garrot:  { question: "Quelle hauteur au garrot peut-il atteindre ?",
             explication: v => `Il peut mesurer jusqu'à ${v} cm de haut au garrot.`,
             fiche: "au garrot" },
  corps:   { question: "Quelle longueur peut-il atteindre, sans la queue ?",
             explication: v => `Son corps peut mesurer jusqu'à ${v} cm de long, sans la queue.`,
             fiche: "de long, sans la queue" },
  oiseau:  { question: "Quelle longueur peut-il atteindre, du bec au bout de la queue ?",
             explication: v => `Il peut mesurer jusqu'à ${v} cm, du bec au bout de la queue.`,
             fiche: "du bec à la queue" },
  totale:  { question: "Quelle longueur totale peut-il atteindre ?",
             explication: v => `Il peut mesurer jusqu'à ${v} cm de long.`,
             fiche: "de long" },
  insecte: { question: "Quelle longueur son corps peut-il atteindre ?",
             explication: v => `Son corps peut mesurer jusqu'à ${v} cm de long.`,
             fiche: "de long" },
  // Étape 121 : escargots et coquillages, la taille mesurée est celle de la coquille
  coquille: { question: "Quelle taille sa coquille peut-elle atteindre ?",
              explication: v => `Sa coquille peut mesurer jusqu'à ${v} cm.`,
              fiche: "(coquille)" },
};
// Quelle mesure pour quelle espèce ? Une règle par famille, et des exceptions par espèce :
// chez le cerf et le chevreuil, le chiffre du tableur est une hauteur au garrot.
const MESURE_PAR_FAMILLE = { Mammiferes: "corps", Oiseaux: "oiseau", Reptiles: "totale",
                             Amphibiens: "totale", Poissons: "totale", Insectes: "insecte",
                             Araignees_mille_pattes: "insecte", Crustaces: "insecte", Mollusques: "coquille",
                             Vers_meduses_compagnie: "totale" };
// Les limaces n'ont pas de coquille visible : on mesure leur corps (étape 121)
const MESURE_PAR_ESPECE  = { "Cerf élaphe": "garrot", "Chevreuil": "garrot",
                             "Limace léopard": "totale", "Grande loche": "totale" };
function mesureTaille(espece) {
  const cle = MESURE_PAR_ESPECE[espece.nom_courant] || MESURE_PAR_FAMILLE[espece.onglet] || "totale";
  return MESURES_TAILLE[cle];
}

// Les milieux proposés pour un poisson (étape 31) : les trois milieux d'eau douce du tableur,
// et trois milieux où aucun poisson du jeu ne vit, qui servent uniquement de mauvaises réponses.
const EAUX_DOUCES = ["Lacs", "Rivières et torrents", "Mares et étangs"];
const MILIEUX_AQUATIQUES = [...EAUX_DOUCES, "Mer et océan", "Estuaires et lagunes", "Eaux souterraines"];
// Étape 77 : les milieux VOISINS, qui se touchent dans la nature. Un animal des falaises passe souvent
// sur les alpages, un animal du bocage en lisière de forêt… Proposer le voisin comme mauvaise réponse
// rendait la question ambiguë (le choucas : jardins et campagne, ou alpages ?). On ne le propose plus.
const MILIEUX_VOISINS = {
  // Étape 242 (22/10) : « Bocage et lisières » + « Jardins et campagne » = « Campagne, haies et jardins » ;
  // « Landes et tourbières » + « Coteaux secs et murets » = « Landes et coteaux secs » (catégories trop proches).
  "Alpages et pelouses d'altitude": ["Falaises et rochers", "Landes et coteaux secs"],
  "Falaises et rochers":            ["Alpages et pelouses d'altitude", "Landes et coteaux secs", "Garrigue et maquis"],
  "Landes et coteaux secs":         ["Falaises et rochers", "Alpages et pelouses d'altitude", "Campagne, haies et jardins", "Garrigue et maquis", "Mares et étangs"],
  "Campagne, haies et jardins":     ["Forêt", "Landes et coteaux secs"],
  "Forêt":                          ["Campagne, haies et jardins"],
  "Mares et étangs":                ["Lacs", "Landes et coteaux secs", "Marais"],
  "Lacs":                           ["Mares et étangs", "Marais"],
  // Étape 247 (22/10, retour sur l'aeschne bleue) : marais ↔ mares, lacs, estuaires ; et les milieux du bord de mer entre eux
  "Marais":                         ["Mares et étangs", "Lacs", "Estuaires et lagunes"],
  "Estuaires et lagunes":           ["Marais", "Mer et océan", "Dunes et plages"],
  "Mer et océan":                   ["Estuaires et lagunes"],
  "Dunes et plages":                ["Estuaires et lagunes"],
  // étape 191 : la garrigue touche les coteaux secs, les rochers, la campagne et les bois de chênes verts
  "Garrigue et maquis":             ["Landes et coteaux secs", "Falaises et rochers", "Campagne, haies et jardins", "Forêt"],
};
const ALTITUDE_ALPAGES = 1800;     // une espèce qui monte jusque-là peut se trouver en alpage : jamais proposé comme piège
// Les milieux à ne jamais proposer comme mauvaise réponse pour cette espèce :
// les siens (principal et secondaires), leurs voisins, et les alpages si elle monte assez haut.
function milieuxATeviter(e) {
  const siens = [e.milieu_principal, ...String(e.milieux_secondaires || "").split(" ; ")];
  const aEviter = new Set(siens);
  for (const m of siens) for (const v of (MILIEUX_VOISINS[m] || [])) aEviter.add(v);
  if (typeof e.altitude_max_m === "number" && e.altitude_max_m >= ALTITUDE_ALPAGES) aEviter.add("Alpages et pelouses d'altitude");
  return [...aEviter];
}

// ---- Étape 246 (22/10) : les photos de paysages des milieux ----------------------------------------------------
// PAYSAGES (especes.js, depuis Données\paysages.xlsx) : une photo = un milieu + les territoires où elle s'affiche
// (la forêt de montagne pour les Alpes et les Pyrénées, la pinède pour le Bassin aquitain…). Plusieurs photos par
// milieu : on varie (décision du 22/10). Règle : un paysage n'est montré pour une espèce qu'une fois son milieu
// trouvé par le joueur (sinon il soufflerait la réponse à « Où vit-il le plus souvent ? »).
function paysagesDuMilieu(milieu, territoires) {
  const tous = (typeof PAYSAGES !== "undefined" ? PAYSAGES : []).filter(p => p.milieu === milieu);
  const ici = (territoires || []).length ? tous.filter(p => p.territoires.some(t => territoires.includes(t))) : [];
  return ici.length ? ici : tous;
}
// Les territoires qui comptent pour choisir la photo : ceux de l'espèce, de préférence ceux du terrain du joueur
function territoiresPaysage(espece) {
  const siens = espece ? territoiresJeu(espece) : [];
  const terrain = (typeof territoiresChoisis !== "undefined" && territoiresChoisis) || [];
  const communs = siens.filter(t => terrain.includes(t));
  return communs.length ? communs : siens;
}
// Une photo au hasard (questions) ; ou la même toute la journée pour une espèce (fiche, fêtes : pas de clignotement)
function paysageAuHasard(milieu, espece) {
  const l = paysagesDuMilieu(milieu, territoiresPaysage(espece));
  return l.length ? l[Math.floor(Math.random() * l.length)] : null;
}
function paysageDuJour(espece) {
  const l = paysagesDuMilieu(espece.milieu_principal, territoiresPaysage(espece));
  if (!l.length) return null;
  let h = 0; for (const c of espece.nom_courant + aujourdhui()) h = (h * 31 + c.charCodeAt(0)) % 100003;
  return l[h % l.length];
}
// Étape 249 (22/10) : l'utilisateur préfère les pictogrammes pour « Où vit-il ? » et dans la fiche de l'encyclopédie.
// Les photos restent dans le dossier et dans PAYSAGES, pour plus tard : il suffit de remettre ces réglages à true.
const PAYSAGES_DANS_LA_QUESTION = false;
const PAYSAGES_DANS_LA_FICHE = false;
function milieuConnu(espece) { return !!espece && estRenseigne(espece.milieu_principal) && nbBonnes(espece, "milieu_principal") >= 1; }
function miniPaysage(p) { return p ? p.fichier.replace("Images/Paysages/", "Images/Paysages/mini/") : ""; }

// ---- Le portrait physique (étape 64) ---------------------------------------
// Les colonnes ajoutées à la fin de chaque onglet de l'Excel (tableur V24 et suivants)
// décrivent l'aspect de l'animal : pelage, bec, queue, nageoires… La réponse se VOIT sur
// la photo : pendant ces questions, la photo est donc cachée, et chaque réponse est
// illustrée par un petit dessin (dossier "Pictos") ou par une pastille de couleur.
//
// Deux règles décidées avec le tableur V27 :
//   • "a_confirmer" : dans especes.js, chaque espèce porte la liste de ses colonnes dont
//     la case est ROSE dans l'Excel (valeur pas encore confirmée par une source).
//     Pas de question dessus tant que ce n'est pas confirmé.
//   • COLONNES_DE_COTE : deux colonnes mises de côté en entier, faute de source.
const COLONNES_DE_COTE = { Oiseaux: ["queue_vol"], Mammiferes: ["pupille_forme"] };

// Étape R148 (07/11/2026, choix d'Aubin « A ») : les pronoms suivent le genre du nom de l'espèce (colonne genre_nom
// des classeurs : « masculin » / « féminin »). Les textes du jeu sont écrits au masculin (« Où vit-il ? ») ; pour une espèce
// au nom féminin, ils passent au féminin (« Où vit-elle ? » pour l'huître). La question sur le nombre de petits, écrite
// au féminin, passe au masculin pour une espèce au nom masculin (« Combien d'œufs peut-il pondre ? » pour le bigorneau).
// Protégés : les « il » et « elle » qui ne désignent pas l'espèce (son corps, sa coquille, « il y a », la femelle…).
const PRONOMS_PROTEGES = [/son corps peut-il/g, /sa coquille peut-elle/g, /y a-t-il/g, /\b[Ii]l (?:y|n'y) a\b/g, /\b[Ii]l faut\b/g,
  /Le son est-il/g, /la femelle/g, /\bElle (?:enferme|garde|porte|pond)\b/g];
const ACCORDS_FEMININ = [[/Est-elle venimeux/g, "Est-elle venimeuse"], [/Est-elle dangereux/g, "Est-elle dangereuse"],
  [/est-elle le plus actif/g, "est-elle la plus active"], [/Elle est actif/g, "Elle est active"],
  [/peut-on le croiser/g, "peut-on la croiser"], [/On peut le croiser/g, "On peut la croiser"], [/On le croise/g, "On la croise"]];
function accordGenre(texte, e) {
  if (!texte || !e || (e.genre_nom !== "féminin" && e.genre_nom !== "masculin")) return texte;
  const gardes = [];
  let t = String(texte);
  for (const r of PRONOMS_PROTEGES) t = t.replace(r, m => { gardes.push(m); return `\u0001${gardes.length - 1}\u0002`; });
  if (e.genre_nom === "féminin") {
    t = t.replace(/-t-il\b/g, "-t-elle").replace(/-il\b/g, "-elle").replace(/\bIl\b/g, "Elle").replace(/\bil\b/g, "elle");
    for (const [r, v] of ACCORDS_FEMININ) t = t.replace(r, v);
  } else {
    t = t.replace(/peut-elle (mettre au monde|pondre)/g, "peut-il $1");
  }
  return t.replace(/\u0001(\d+)\u0002/g, (m, i) => gardes[+i]);
}

// La valeur d'une colonne du portrait, ou "NA" quand il ne faut pas poser la question.
function valeurPortrait(espece, colonne) {
  if ((COLONNES_DE_COTE[espece.onglet] || []).includes(colonne)) return "NA";
  if ((espece.a_confirmer || []).includes(colonne)) return "NA";
  if (!(colonne in espece)) return "NA";              // cette famille n'a pas cette colonne
  return espece[colonne];
}

// La réponse est-elle soufflée par le nom ? ("Jaune" pour le chocard à bec jaune, "Noir" pour le
// pic noir, "Croisé" pour le bec-croisé…). Même idée que seDevineDuNom (partie 3), mais sur les
// 4 premières lettres, pour rapprocher "vert" et "verte", "noir" et "noire".
function souffleParLeNom(espece, valeur) {
  const debuts = texte => String(texte).toLowerCase().split(/[^a-zàâäçéèêëîïôöùûüœ]+/)
                            .filter(mot => mot.length >= 4).map(mot => mot.slice(0, 4));
  const banals = MOTS_BANALS.map(mot => mot.slice(0, 4));
  // "rousse" et "roux" : le même mot, écrit autrement
  const motsDuNom = debuts(espece.nom_courant.replace(/rousse/gi, "roux")).filter(mot => !banals.includes(mot));
  return debuts(valeur).some(mot => motsDuNom.includes(mot));
}

// Le nom de fichier d'une réponse : "À pinceaux" → "a_pinceaux". Le dessin de la réponse
// "Crochu" de la colonne bec_forme est donc : Pictos/bec_forme__crochu.svg
function nomDeFichier(texte) {
  return String(texte).normalize("NFD").replace(/[̀-ͯ]/g, "")     // on retire les accents
                      .toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

// Les réponses qui sont des couleurs n'ont pas de dessin : une simple pastille.
const PASTILLES = {
  Beige: "#d8c3a0", Blanc: "#fbfaf5", Bleu: "#4f7cac", Brun: "#7a5536", Gris: "#8d8d8d", Jaune: "#e3c33b",
  Noir: "#25231f", Orange: "#dd7f2e", Rouge: "#b5442e", Roux: "#b5622b", Vert: "#5d8a4a", Ivoire: "#efe6cf",
  Rouges: "#b5442e", Jaunes: "#e3c33b", Grises: "#8d8d8d", Noires: "#25231f", Roses: "#e3a6a0", Brunes: "#7a5536",
  "Gris clair": "#c9c9c9",
  // étape 184 : couleurs du Massif armoricain
  Argenté: "linear-gradient(135deg,#eef1f3,#aab3ba 55%,#e3e7ea)", Oranges: "#dd7f2e",
  Multicolore: "linear-gradient(90deg,#b5442e 0 33%,#e3c33b 33% 66%,#4f7cac 66%)",
  // étape 189 : pattes vertes (butor, foulque)
  Vertes: "#5d8a4a",
  // étape 191 : couleurs de la Méditerranée (flamant, pélagie, corail…)
  Rose: "#e3a6a0", Violet: "#7d5a8c",
};
// Le dessin d'une réponse : la pastille si c'est une couleur, sinon le pictogramme.
// onerror = si le fichier manque, on retire l'image : il reste le mot écrit dessous.
function dessinReponse(colonne, valeur) {
  if (PASTILLES[valeur]) return `<span class="pastille" style="background:${PASTILLES[valeur]}"></span>`;
  return `<img src="Pictos/${colonne}__${nomDeFichier(valeur)}.svg" alt="" onerror="this.remove()">`;
}

// Les mauvaises réponses : les AUTRES valeurs de la même colonne, prises dans la même
// famille (un bec d'oiseau parmi des becs d'oiseaux). "proches" = les réponses trop voisines
// de la bonne pour être proposées (roux pour un animal brun…). S'il en reste moins de trois
// dans la famille, on complète avec les valeurs des autres familles.
// Étape 135 : "exclues" = d'autres réponses à écarter pour cette espèce (ex : les couleurs citées dans sa description)
function piegesPortrait(espece, bonne, lire, proches, exclues = []) {
  const interdites = [bonne, ...((proches || {})[bonne] || []), ...exclues];
  const valeursParmi = especes => [...new Set(especes.map(lire).filter(estRenseigne))].filter(v => !interdites.includes(v));
  const famille = valeursParmi(ESPECES.filter(e => e.onglet === espece.onglet));
  if (famille.length >= 3 || !proches) return famille;
  return [...new Set([...famille, ...valeursParmi(ESPECES)])];
}

// -- Le pelage, le plumage, la peau : UNE seule question pour deux colonnes --
// aspect_robe dit "Uni", "Bicolore" ou "À motif" ; dans ce dernier cas, la réponse est le
// motif lui-même (colonne motif_robe : taches, rayures, masque…).
function lireRobe(espece) {
  return espece.aspect_robe === "À motif" ? espece.motif_robe : espece.aspect_robe;
}
function valeurRobe(espece) {
  const aspect = valeurPortrait(espece, "aspect_robe");
  return aspect === "À motif" ? valeurPortrait(espece, "motif_robe") : aspect;
}
const NOM_ROBE = { Mammiferes: "son pelage", Oiseaux: "son plumage", Amphibiens: "sa peau",
                   Reptiles: "sa peau", Poissons: "sa robe", Insectes: "son corps",
                   Araignees_mille_pattes: "son corps", Crustaces: "sa carapace", Mollusques: "sa coquille",
                   Vers_meduses_compagnie: "son corps" };
// Comment le dire dans une phrase : "Taches" → "à taches", "Uni" → "uni" ou "unie"
const PHRASE_ROBE = { Uni: "uni", Bicolore: "bicolore", Taches: "à taches", Points: "à points", Rayures: "à rayures",
                      Barres: "à barres", Zigzag: "en zigzag", Marbrures: "à marbrures", Masque: "avec un masque",
                      Bavette: "avec une bavette", Plastron: "avec un plastron" };
// Étape R101 (Revoir 10, « À barres ? Sur les ailes oui ») : chez ces oiseaux, les barres ne sont que sur les ailes
// (barres alaires) : on le dit dans la fiche et dans l'explication (pas sur le bouton : la bonne réponse ne doit pas se distinguer des pièges).
const BARRES_SUR_LES_AILES = { "Pinson des arbres": "sur les ailes", "Pigeon colombin": "sur les ailes", "Avocette élégante": "sur les ailes",
  "Venturon montagnard": "sur les ailes", "Roitelet huppé": "sur les ailes", "Geai des chênes": "sur les ailes",
  "Huppe fasciée": "sur les ailes et la queue" };
function barresOuSontElles(espece, valeur) { return valeur === "Barres" ? BARRES_SUR_LES_AILES[espece.nom_courant] || "" : ""; }
function direRobe(espece, valeur) {
  const feminin = NOM_ROBE[espece.onglet].startsWith("sa ");
  const ou = barresOuSontElles(espece, valeur);
  if (ou) return `avec des barres ${ou}`;
  if (valeur === "Bicolore" && espece.onglet === "Mammiferes") return "ventre plus clair que le dos";   // étape R178
  return valeur === "Uni" && feminin ? "unie" : (PHRASE_ROBE[valeur] || minuscule(valeur));
}
const ROBES_PROCHES = { Taches: ["Points", "Marbrures"], Points: ["Taches"], Marbrures: ["Taches"],
                        Barres: ["Rayures", "Zigzag"], Rayures: ["Barres"], Zigzag: ["Barres"],
                        Bicolore: ["Masque", "Bavette", "Plastron"], Masque: ["Bicolore", "Bavette"],
                        Bavette: ["Bicolore", "Plastron", "Masque"], Plastron: ["Bicolore", "Bavette"] };
// Étape R102 (Revoir 10, choix C1) : une bavette noire déborde souvent sur la face (moineau) : « bavette » et « masque »
// ne sont plus proposés ensemble. Et chez les oiseaux, un plumage « rayé » ou « strié » écarte aussi « taches » (voir robesAussiVraies).
// Étape 88 : certaines robes ont plusieurs aspects à la fois (le faucon pèlerin est gris dessus, blanc barré
// dessous : à la fois bicolore et à barres). On lit la description de la couleur (colonne "couleur") et on
// n'utilise jamais comme mauvaise réponse un aspect que cette description rend vrai aussi.
// Chaque ligne : l'aspect, puis les mots qui le trahissent dans la description (en expression régulière).
const ROBES_DANS_LA_DESCRIPTION = {
  Uni: /\buni|uniforme/i,
  Bicolore: /dessus|dessous|ventre|\bdos\b|selle|t[êe]te|gorge|poitrine|calotte|camail|nuque|\bet (blanc|noir)|noir et|plus clair|plus sombre|ailes/i,
  Taches: /\btach|\bmacule|ocelle/i,          // \b = début de mot (« moustache » ne compte pas)
  Points: /\bpoints?\b|pointill|mouchet|ocelle/i,   // (« à pointe noire » ne compte pas)
  Barres: /barr|bande/i,
  Rayures: /\bray|\bstri|bande|anneau|annel/i,
  Marbrures: /marbr/i,
  Zigzag: /zigzag|ondul/i,
  Masque: /masque|autour de l'[œo]il/i,
  Bavette: /bavette|gorge/i,
  Plastron: /plastron|poitrine|croissant|blanc[^,;]*dessous|dessous blanc/i,
};
// Étape 172 (13/10, retour sur l'escargot de Bourgogne) : un aspect « Uni » alors que la description cite un motif
// (« bande brune floue », « tache claire à la croupe »…) est ambigu : on ne pose pas la question.
// Les morceaux de description qui parlent des jeunes (« jeunes rayés ») ne comptent pas.
function robeUniAmbigue(espece) {
  if (lireRobe(espece) !== "Uni") return false;
  const texte = String(espece.couleur || "").split(/[;,]/).filter(m => !/jeune/i.test(m)).join(" ; ");
  return ["Taches", "Points", "Marbrures", "Barres", "Rayures", "Zigzag"].some(v => ROBES_DANS_LA_DESCRIPTION[v].test(texte));
}
// Étape R119 (04/11) : colonnes motif_robe_autres (autres motifs bien visibles chez l'adulte, vérifiés à l'aveugle)
// et motif_robe_absents (motifs sûrement absents : les seuls pièges permis dans « Plusieurs réponses à cocher »).
function listeRobeAutres(espece, colonne = "motif_robe_autres") {
  const v = espece[colonne];
  if (!estRenseigne(v) || String(v).startsWith("NA")) return [];
  return String(v).split(" ; ").map(x => x.trim()).filter(Boolean);
}
function robesAussiVraies(espece) {
  const texte = String(espece.couleur || "");
  const vues = Object.keys(ROBES_DANS_LA_DESCRIPTION).filter(v => ROBES_DANS_LA_DESCRIPTION[v].test(texte));
  // et leurs voisins : un plumage « barré » écarte aussi « rayures » et « zigzag » (mêmes voisins que ROBES_PROCHES)
  // (seulement pour les motifs : « bicolore » repéré n'écarte pas pour autant masque, bavette ou plastron)
  const motifs = ["Taches", "Points", "Marbrures", "Barres", "Rayures", "Zigzag"];
  if (espece.onglet === "Oiseaux" && /\bray|\bstri/i.test(texte)) vues.push("Taches", "Rayures");   // étape R102 (C1)
  // Étape R119 : les autres motifs vérifiés de l'espèce (colonne motif_robe_autres) ne sont jamais des pièges
  vues.push(...listeRobeAutres(espece));
  return [...new Set([...vues, ...vues.filter(v => motifs.includes(v)).flatMap(v => ROBES_PROCHES[v])])];
}
// Étape 75 : gris et noir (et gris et blanc) se distinguent mal sur une photo : ils ne sont plus proposés ensemble.
const COULEURS_PROCHES = { Brun: ["Roux", "Beige", "Noir"], Roux: ["Brun", "Orange", "Beige"], Beige: ["Brun", "Roux", "Gris", "Blanc"],
                           Gris: ["Beige", "Noir", "Blanc"], Noir: ["Gris", "Brun"], Orange: ["Roux", "Rouge", "Jaune"], Rouge: ["Orange", "Roux"],
                           Jaune: ["Orange", "Beige"], Blanc: ["Beige", "Gris", "Argenté"],
                           Argenté: ["Gris", "Blanc"], Rose: ["Rouge", "Orange"] };   // étape 204 : argenté et rose
COULEURS_PROCHES.Gris.push("Argenté"); COULEURS_PROCHES.Rouge.push("Rose"); COULEURS_PROCHES.Orange.push("Rose");
// Étape 135 : une couleur CITÉE dans la description de l'espèce (colonne "couleur") n'est jamais
// proposée comme mauvaise réponse. Ex. : le pic épeiche est noir, mais il a aussi du rouge ;
// proposer « rouge » serait à moitié vrai. Chaque ligne : la couleur, puis les mots qui la trahissent.
const COULEURS_DANS_LA_DESCRIPTION = {
  // Étape 275 (« Revoir 5 ») : + les teintes entre deux couleurs — « rouge vineux » (fauvette pitchou) n'a plus « brun »
  // ni « roux » en mauvaise réponse ; idem cannelle, cuivré, bronze, bordeaux, chamois.
  Brun: /brun|marron|chocolat|fauve|ch[âa]taign|vineu|cannelle|bronz/i, Roux: /\broux|rousse|rouss[âa]tre|rouille|vineu|cannelle|cuivr|bordeaux/i,
  Beige: /beige|cr[èe]me|sable|ocre|chamois/i, Gris: /gris/i, Noir: /noir/i, Blanc: /blanc|blanch/i,
  Orange: /orang|cuivr/i, Rouge: /rouge|vineu|bordeaux|cuivr/i, Jaune: /jaun|dor[ée]/i, Vert: /vert|olive/i, Bleu: /bleu/i,
  Ivoire: /ivoire/i, Rose: /\brose/i, Argenté: /argent/i, Violet: /violet|pourpre/i,   // étape 204
};
// Étape R135 (05/11) : les couleurs bien visibles du plumage (colonne couleurs_plumage, oiseaux) et les couleurs
// sûrement absentes (couleurs_plumage_absentes, les seuls pièges permis en « Plusieurs réponses possibles »).
function listeCouleursPlumage(espece, colonne = "couleurs_plumage") {
  const v = espece[colonne];
  return estRenseigne(v) && !String(v).startsWith("NA") ? String(v).split(";").map(x => x.trim()).filter(Boolean) : [];
}
function couleursCitees(espece) {
  const texte = String(espece.couleur || "");
  return Object.keys(COULEURS_DANS_LA_DESCRIPTION).filter(c => COULEURS_DANS_LA_DESCRIPTION[c].test(texte));
}
// Les espèces dont la couleur change d'un individu à l'autre (« gris, beige ou brun », « gris à brun »,
// « selon la fleur ») : on ne demande pas LA couleur dominante, mais une couleur qu'elle PEUT avoir.
const MOT_COULEUR = "(brun|gris|roux|noir|beige|jaun|orang|vert|blanc|rouge|olive|ocre)";
const COULEUR_VARIABLE = new RegExp(`\\bou\\b|selon|variable|${MOT_COULEUR}[a-zâé-]*\\s+à\\s+${MOT_COULEUR}`, "i");
function couleurVariable(espece) { return COULEUR_VARIABLE.test(String(espece.couleur || "")); }

// Les couleurs de bec trop proches pour être proposées ensemble (étape 75) : un bec noir n'aura plus "gris" comme piège
const BECS_PROCHES = { Noir: ["Gris"], Gris: ["Noir", "Ivoire"], Ivoire: ["Gris", "Jaune"], Jaune: ["Ivoire"] };

// ---- À ne pas confondre (étape 70) -------------------------------------------
// Les groupes d'espèces proches, validés dans le tableur de propositions du 09/10.
//   especes : les noms exacts de la colonne nom_courant
//   critere : la phrase qui dit comment les distinguer
// L'ordre compte : pour une espèce présente dans deux groupes, c'est le PREMIER qui donne la phrase.
const VIPERES = ["Vipère aspic", "Vipère péliade", "Vipère d'Orsini"];
const CONFUSIONS = [
  { especes: ["Martre des pins", "Fouine"], critere: "bavette jaune orangé et arrondie pour la martre ; blanche, et qui descend sur les pattes avant, pour la fouine" },
  { especes: ["Hermine", "Belette"], critere: "bout de la queue noir pour l'hermine ; queue courte, sans noir, pour la belette" },
  { especes: ["Cerf élaphe", "Chevreuil"], critere: "le cerf est bien plus grand ; le chevreuil a une queue presque invisible et une tache blanche à l'arrière" },
  { especes: ["Bouquetin des Alpes", "Chamois", "Mouflon méditerranéen"], critere: "cornes recourbées pour le bouquetin, en crochet pour le chamois, en spirale pour le mouflon" },
  { especes: ["Loir gris", "Lérot"], critere: "queue touffue et pas de masque pour le loir ; masque noir, grandes oreilles et pinceau au bout de la queue pour le lérot" },
  { especes: ["Grand rhinolophe", "Oreillard montagnard"], critere: "nez en fer à cheval pour le rhinolophe ; oreilles presque aussi longues que le corps pour l'oreillard" },
  { especes: ["Chocard à bec jaune", "Crave à bec rouge", "Choucas des tours"], critere: "bec jaune et court pour le chocard ; rouge, long et courbé pour le crave ; noir, avec la nuque grise et l'œil clair, pour le choucas" },
  { especes: ["Grand corbeau", "Choucas des tours"], critere: "le grand corbeau est très grand et tout noir ; le choucas est petit, avec la nuque grise et l'œil clair" },
  { especes: ["Gypaète barbu", "Vautour fauve"], critere: "une barbe pour le gypaète ; une collerette pour le vautour" },
  { especes: ["Aigle royal", "Buse variable"], critere: "l'aigle est très grand et uni ; la buse est plus petite, avec un croissant clair sur la poitrine" },
  { especes: ["Faucon pèlerin", "Faucon crécerelle"], critere: "le pèlerin est gris, barré dessous ; la crécerelle est rousse, tachetée, et vole sur place" },
  { especes: ["Grand-duc d'Europe", "Chouette hulotte", "Chevêchette d'Europe"], critere: "aigrettes et yeux orange pour le grand-duc ; yeux noirs, sans aigrettes, pour la hulotte ; toute petite, aux yeux jaunes, pour la chevêchette" },
  { especes: ["Tétras lyre", "Gélinotte des bois", "Lagopède alpin", "Perdrix bartavelle"], critere: "queue en lyre pour le tétras ; huppe pour la gélinotte ; pattes emplumées, blanc l'hiver, pour le lagopède ; bec et pattes rouges pour la bartavelle" },
  { especes: ["Pic noir", "Pic épeiche"], critere: "tout noir, avec une calotte rouge, pour le pic noir ; noir et blanc, avec du rouge sous la queue, pour l'épeiche" },
  { especes: ["Triton alpestre", "Triton palmé"], critere: "ventre orange vif pour l'alpestre ; ventre orange clair, gorge couleur chair et pattes arrière palmées pour le palmé" },
  { especes: ["Salamandre noire", "Salamandre tachetée"], critere: "noire unie pour la première ; noire à taches jaunes pour la seconde" },
  { especes: ["Crapaud commun", "Crapaud calamite", "Alyte accoucheur"], critere: "pupille horizontale et dos uni pour le crapaud commun ; ligne jaune sur le dos pour le calamite ; pupille verticale pour l'alyte" },
  { especes: ["Grenouille rousse", "Crapaud commun"], critere: "peau lisse pour la grenouille ; verruqueuse pour le crapaud" },
  { especes: VIPERES, critere: "museau retroussé et petites écailles sur la tête pour l'aspic ; grandes plaques sur la tête pour la péliade ; la vipère d'Orsini est la plus petite des trois" },
  { especes: ["Coronelle lisse", ...VIPERES], critere: "la coronelle a la pupille ronde et des écailles lisses ; une vipère a la pupille en fente verticale" },
  { especes: ["Couleuvre verte et jaune", "Couleuvre helvétique", "Couleuvre d'Esculape", ...VIPERES], critere: "pupille ronde pour une couleuvre ; pupille en fente verticale pour une vipère" },
  { especes: ["Orvet fragile", "Coronelle lisse", "Couleuvre d'Esculape", "Couleuvre helvétique"], critere: "l'orvet cligne des yeux : c'est un lézard sans pattes, pas un serpent" },
  { especes: ["Lézard des murailles", "Lézard vivipare"], critere: "museau pointu pour le lézard des murailles ; museau arrondi pour le vivipare" },
  { especes: ["Truite fario", "Omble chevalier"], critere: "points noirs et rouges sur fond brun pour la truite ; points clairs et nageoires bordées de blanc pour l'omble" },
  { especes: ["Ombre commun", "Corégone"], critere: "grande nageoire du dos, en voile, pour l'ombre ; museau court, dont la mâchoire du haut dépasse, pour le corégone" },
  { especes: ["Chabot", "Loche franche", "Lote"], critere: "aucun barbillon et une tête large pour le chabot ; six barbillons pour la loche ; un seul pour la lote" },
  { especes: ["Grande sauterelle verte", "Miramelle alpestre", "Œdipode stridulante"], critere: "antennes longues et fines pour la sauterelle ; antennes courtes pour les deux criquets" },
  { especes: ["Apollon", "Machaon", "Petite tortue"], critere: "blanc pour l'apollon, jaune pour le machaon, orange pour la petite tortue" },
  { especes: ["Aeschne bleue", "Cordulégastre annelé"], critere: "brune à taches vertes et bleues pour l'aeschne ; noir à anneaux jaunes pour le cordulégastre" },
  { especes: ["Abeille mellifère", "Bourdon des Alpes"], critere: "l'abeille est fine et brune ; le bourdon est trapu, très velu, noir et orange" },
  { especes: ["Cétoine dorée", "Carabe doré"], critere: "antennes en éventail pour la cétoine, qui vole ; antennes longues et fines pour le carabe, qui ne vole pas" },
  // Pyrénées (17/10, étape 192) : groupes proposés par Claude ; relus et corrigés par Claude le 17/10 (étape 194)
  { especes: ["Isard", "Chamois"], critere: "l'isard est le chamois des Pyrénées : un peu plus petit, plus roux en été, avec des taches claires plus nettes sur la tête et le cou ; le chamois vit dans les Alpes" },
  { especes: ["Bouquetin ibérique", "Bouquetin des Alpes"], critere: "cornes en lyre, qui s'écartent puis se rapprochent vers la pointe, pour l'ibérique ; cornes en arc, épaisses et noueuses, pour celui des Alpes" },
  { especes: ["Desman des Pyrénées", "Crossope aquatique"], critere: "long nez mobile en trompe et grandes pattes arrière palmées pour le desman ; museau pointu ordinaire, dos noir et ventre clair pour la crossope" },
  { especes: ["Campagnol roussâtre", "Campagnol des champs"], critere: "dos roux et queue plus longue pour le roussâtre ; gris-brun, avec une queue très courte, pour le campagnol des champs" },
  { especes: ["Mulot à collier", "Mulot sylvestre"], critere: "une bande jaune en travers de la poitrine, d'une patte avant à l'autre, pour le mulot à collier ; une simple petite tache jaune, ou rien, pour le mulot sylvestre" },
  { especes: ["Musaraigne couronnée", "Musaraigne des jardins"], critere: "dents à pointe rouge et dos sombre pour la couronnée ; dents toutes blanches et pelage gris-brun pour celle des jardins" },
  { especes: ["Oreillard roux", "Oreillard montagnard"], critere: "très difficiles à distinguer : l'oreillard roux est plus brun-roux, le montagnard plus gris" },
  { especes: ["Grand tétras", "Tétras lyre"], critere: "très grand, queue ronde en éventail et bec clair pour le grand tétras ; plus petit, queue en lyre pour le tétras lyre" },
  { especes: ["Pic à dos blanc", "Pic épeiche"], critere: "bas du dos blanc, ailes barrées de blanc et flancs rayés pour le pic à dos blanc ; deux grandes taches blanches sur les épaules et ventre uni pour l'épeiche" },
  { especes: ["Milan royal", "Bondrée apivore", "Aigle botté", "Buse variable"], critere: "queue rousse et profondément fourchue pour le milan royal ; petite tête de pigeon et longue queue barrée pour la bondrée ; deux taches blanches à la base des ailes, comme des phares, pour l'aigle botté ; queue courte et arrondie, croissant clair sur la poitrine, pour la buse" },
  { especes: ["Hirondelle de rochers", "Hirondelle rustique", "Hirondelle de rivage"], critere: "toute brune, sans rouge ni collier, avec des taches blanches sur la queue étalée, pour l'hirondelle de rochers ; gorge rouge et longs filets pour la rustique ; collier brun sur la poitrine blanche pour celle de rivage" },
  { especes: ["Martinet à ventre blanc", "Martinet noir"], critere: "ventre et gorge blancs, et bien plus grand, pour le martinet à ventre blanc ; tout sombre, avec seulement la gorge claire, pour le martinet noir" },
  // Revoir 7 (étape 332) : la mésange bleue ressemble plus à la charbonnière que la mésange noire (la noire reste avec la nonnette et la boréale)
  { especes: ["Mésange bleue", "Mésange charbonnière"], critere: "plus petite, calotte bleue et joues blanches cerclées de noir pour la mésange bleue ; tête noire aux joues blanches et cravate noire sur le ventre jaune pour la charbonnière" },
  { especes: ["Calotriton des Pyrénées", "Triton alpestre", "Triton palmé"], critere: "peau rugueuse, sans crête, dans les torrents froids pour le calotriton ; ventre orange vif pour l'alpestre ; pattes arrière palmées chez le mâle pour le palmé" },
  { especes: ["Grenouille des Pyrénées", "Grenouille rousse"], critere: "petite et fine, de couleur claire, sans masque bien marqué, dans les torrents pour la grenouille des Pyrénées ; masque brun derrière l'œil pour la rousse" },
  { especes: ["Lézard de Bonnal", "Lézard des murailles", "Lézard vivipare"], critere: "tête aplatie, dans les éboulis au-dessus de 1 700 m pour le lézard de Bonnal ; museau pointu pour celui des murailles ; museau arrondi pour le vivipare" },
  { especes: ["Vipère de Seoane", "Vipère péliade", "Vipère aspic"], critere: "la vipère de Seoane ressemble beaucoup à la péliade ; on la reconnaît surtout à l'endroit où on la trouve : à l'ouest des Pyrénées, au Pays basque" },
  { especes: ["Coronelle girondine", "Coronelle lisse"], critere: "ventre en damier noir et jaune ou rouge pour la girondine ; ventre sombre ou orangé, sans damier, pour la lisse" },
  { especes: ["Chabot des Pyrénées", "Chabot"], critere: "presque identiques : le chabot des Pyrénées ne vit que dans le haut bassin de la Garonne, au pied des Pyrénées" },
  { especes: ["Omble de fontaine", "Omble chevalier", "Truite fario"], critere: "dos marbré de vert et nageoires orange bordées de blanc puis de noir pour l'omble de fontaine ; ventre rouge orangé sans marbrures pour l'omble chevalier ; points noirs et rouges pour la truite" },
  { especes: ["Lamproie de Planer", "Lamproie marine"], critere: "petite (15 cm), elle passe toute sa vie dans la même rivière pour la lamproie de Planer ; grande (jusqu'à 1 m), marbrée, elle vit en mer et remonte les rivières pour pondre, pour la lamproie marine" },
  { especes: ["Goujon occitan", "Barbeau fluviatile"], critere: "petit (12 cm), avec deux barbillons, pour le goujon ; grand, avec quatre barbillons, pour le barbeau" },
  { especes: ["Semi-Apollon", "Apollon", "Gazé"], critere: "ailes blanches transparentes avec deux taches noires, sans rouge, pour le semi-Apollon ; taches rouges cerclées de noir pour l'apollon ; ailes blanches veinées de noir, sans taches, pour le gazé" },
  { especes: ["Cordulégastre bidenté", "Cordulégastre annelé"], critere: "derrière les yeux, une tache noire pour le bidenté ; jaune pour l'annelé" },
  { especes: ["Bourdon des Pyrénées", "Bourdon terrestre"], critere: "trois bandes jaune-gris (collier, arrière du thorax, début de l'abdomen) pour le bourdon des Pyrénées ; deux bandes jaune vif et le bout de l'abdomen blanc pour le bourdon terrestre" },
  { especes: ["Abeille charpentière", "Bourdon terrestre", "Abeille mellifère"], critere: "toute noire aux reflets bleus, ailes violettes pour l'abeille charpentière ; rayé jaune et noir, au bout blanc, pour le bourdon ; fine et brune pour l'abeille mellifère" },
  { especes: ["Dectique verrucivore", "Grande sauterelle verte"], critere: "trapu, ailes à peine plus longues que le corps et souvent taché de brun pour le dectique ; plus fine, toute verte, ailes bien plus longues que le corps pour la grande sauterelle" },
  { especes: ["Miramelle pyrénéenne", "Miramelle alpestre"], critere: "presque identiques : la miramelle pyrénéenne ne vit que dans les Pyrénées, l'alpestre dans les Alpes" },
  { especes: ["Carabe splendide", "Carabe doré"], critere: "vert vif métallique aux reflets cuivrés, élytres lisses pour le splendide ; doré, avec des côtes en relief sur les élytres, pour le doré" },
  { especes: ["Dolomède des marais", "Pisaure admirable"], critere: "grosse, brun foncé avec une large bande claire sur chaque flanc, elle chasse à la surface de l'eau pour la dolomède ; plus fine, avec une ligne claire au milieu du dos, dans les herbes, pour la pisaure" },
  { especes: ["Iule à pattes blanches", "Gloméris"], critere: "long et fin, noir brillant à pattes blanches, il s'enroule en spirale pour l'iule ; court et large, il se roule en boule pour le gloméris" },
  { especes: ["Hélice des bois", "Escargot des haies"], critere: "coquille brune mouchetée de jaune, avec une seule fine bande brune, pour l'hélice des bois ; coquille jaune ou rose, souvent à plusieurs bandes noires, avec le bord de l'ouverture noir, pour l'escargot des haies" },
  { especes: ["Limnée tronquée", "Grande limnée"], critere: "petite (1 cm), tours bien séparés en escalier pour la limnée tronquée ; grande (5 cm), coquille très pointue pour la grande limnée" },
  // Bassin aquitain (22/10, étape 237) : groupes proposés et relus par Claude
  { especes: ["Vison d'Europe", "Vison d'Amérique", "Putois d'Europe"], critere: "lèvre du haut et menton blancs pour le vison d'Europe ; seulement le menton blanc pour le vison d'Amérique ; un masque clair autour des yeux pour le putois" },
  { especes: ["Rat musqué", "Ragondin"], critere: "plus petit, queue aplatie sur les côtés pour le rat musqué ; grand, queue ronde et grandes incisives orange pour le ragondin" },
  { especes: ["Héron garde-bœufs", "Aigrette garzette"], critere: "trapu, cou court et bec jaune pour le garde-bœufs ; élancée, bec noir et pattes noires aux doigts jaunes pour l'aigrette" },
  { especes: ["Milan noir", "Milan royal"], critere: "brun sombre, queue à peine échancrée pour le milan noir ; roux, queue profondément fourchue pour le milan royal" },
  { especes: ["Goéland leucophée", "Goéland argenté", "Goéland brun"], critere: "dos gris moyen et pattes jaunes pour le leucophée ; dos gris clair et pattes roses pour l'argenté ; dos gris très foncé et pattes jaunes pour le brun" },
  { especes: ["Tourterelle des bois", "Tourterelle turque"], critere: "dos écaillé de roux et de noir, rayures noires et blanches sur le cou pour la tourterelle des bois ; beige uni, avec un demi-collier noir, pour la turque" },
  { especes: ["Gravelot à collier interrompu", "Grand gravelot", "Petit gravelot"], critere: "collier noir interrompu et pattes sombres pour le gravelot à collier interrompu ; collier complet et pattes orange pour le grand gravelot ; collier complet, pattes jaunâtres et cercle jaune autour de l'œil pour le petit gravelot" },
  { especes: ["Bécasseau sanderling", "Bécasseau variable"], critere: "très pâle, presque blanc en hiver, il court au bord des vagues, bec court et droit, pour le sanderling ; plus brun, bec plus long et un peu courbé, pour le variable" },
  { especes: ["Tortue de Floride", "Cistude d'Europe"], critere: "tache rouge ou jaune derrière l'œil et rayures jaunes sur la tête pour la tortue de Floride ; carapace sombre semée de petits points jaunes, sans tache derrière l'œil, pour la cistude" },
  { especes: ["Brochet aquitain", "Brochet"], critere: "presque identiques : le brochet aquitain ne vit que dans les rivières du Sud-Ouest, de la Charente à l'Adour ; on le distingue surtout à ses écailles, moins nombreuses le long du corps" },
  { especes: ["Huître creuse", "Huître plate"], critere: "coquille allongée et creuse, aux bords en vagues, pour l'huître creuse ; ronde et plate pour l'huître plate" },
  { especes: ["Tourteau", "Crabe vert"], critere: "grand, carapace ovale brun-rouge et pinces aux pointes noires pour le tourteau ; plus petit, verdâtre, avec des dents pointues au bord de la carapace, pour le crabe vert" },
  { especes: ["Cigale rouge", "Cigale plébéienne", "Cigale grise"], critere: "nervures et corps rouge orangé pour la cigale rouge ; très grande, sombre, ailes transparentes pour la plébéienne ; plus petite, grise, ailes tachées de brun pour la grise" },
  { especes: ["Œdipode turquoise", "Œdipode stridulante"], critere: "ailes de derrière bleues bordées de noir pour l'œdipode turquoise ; rouges pour la stridulante" },
  // Massif central (25/10, étape 284) : groupes proposés et relus par Claude (territoire pas encore actif :
  // tant qu'une espèce d'un groupe manque dans ESPECES, le groupe ne donne pas de phrase, voir confusionDe)
  { especes: ["Petit rhinolophe", "Rhinolophe euryale", "Grand rhinolophe"], critere: "tous les trois ont le nez en fer à cheval ; on les distingue surtout à la taille : moins de 10 g pour le petit rhinolophe, autour de 10 à 15 g pour l'euryale, plus de 17 g pour le grand rhinolophe" },
  { especes: ["Sérotine commune", "Sérotine de Nilsson", "Noctule commune"], critere: "grande, brun sombre uni, face et oreilles noires pour la sérotine commune ; plus petite, dos sombre aux poils pointés d'or, comme saupoudré, pour la sérotine de Nilsson ; pelage roux doré et oreilles courtes et rondes pour la noctule" },
  { especes: ["Murin de Bechstein", "Oreillard roux"], critere: "longues oreilles, bien séparées l'une de l'autre, pour le murin de Bechstein ; oreilles immenses, presque aussi longues que le corps et réunies à la base, pour l'oreillard" },
  { especes: ["Raton laveur", "Blaireau européen"], critere: "masque noir autour des yeux et queue touffue rayée d'anneaux sombres pour le raton laveur ; deux bandes noires du museau aux oreilles et queue courte pour le blaireau" },
  { especes: ["Campagnol terrestre", "Campagnol amphibie"], critere: "presque identiques : le campagnol terrestre vit dans les prairies, où il creuse des galeries et pousse des taupinières ; le campagnol amphibie, un peu plus grand et plus sombre, vit au bord de l'eau" },
  { especes: ["Campagnol agreste", "Campagnol des champs"], critere: "pelage plus long, ébouriffé et plus sombre, dans les herbes hautes et humides, pour le campagnol agreste ; pelage court, gris-brun clair, dans les prairies rases, pour le campagnol des champs" },
  { especes: ["Campagnol souterrain", "Campagnol provençal", "Campagnol des champs"], critere: "yeux minuscules et oreilles cachées dans un pelage velouté pour les deux campagnols qui vivent sous terre : le souterrain, et le provençal, qui ne vit que dans le Midi ; yeux et oreilles bien visibles pour le campagnol des champs" },
  { especes: ["Souris grise", "Mulot sylvestre"], critere: "grise unie, le ventre à peine plus clair, pour la souris grise ; dos brun roux bien séparé d'un ventre blanc, gros yeux et grandes oreilles pour le mulot" },
  { especes: ["Rat noir", "Surmulot"], critere: "fin, museau pointu, grandes oreilles et queue plus longue que le corps pour le rat noir ; massif, petites oreilles et queue plus courte que le corps pour le surmulot" },
  { especes: ["Crocidure leucode", "Musaraigne musette", "Musaraigne des jardins"], critere: "dos sombre nettement séparé d'un ventre blanc pour la crocidure leucode ; gris-brun, le ventre à peine plus clair, pour la musette ; même allure en plus petit pour la musaraigne des jardins" },
  { especes: ["Musaraigne pygmée", "Musaraigne couronnée", "Pachyure étrusque"], critere: "dents à pointe rouge et queue épaisse, presque aussi longue que le corps, pour la pygmée ; plus grande, dos brun foncé et flancs plus clairs pour la couronnée ; dents blanches et grandes oreilles, encore plus petit, pour le pachyure" },
  { especes: ["Crossope de Miller", "Crossope aquatique"], critere: "presque identiques : la crossope de Miller est un peu plus petite, avec moins de poils raides sous la queue et sur les pattes, et s'éloigne davantage de l'eau" },
  { especes: ["Vautour moine", "Vautour fauve"], critere: "tout brun très sombre, tête couverte d'un duvet sombre, pour le vautour moine ; brun clair à roux, tête et cou blanchâtres et collerette blanche pour le vautour fauve" },
  { especes: ["Cigogne noire", "Cigogne blanche"], critere: "tête, cou et dos noirs aux reflets verts, seul le ventre blanc, pour la cigogne noire ; toute blanche avec le bout des ailes noir pour la cigogne blanche" },
  { especes: ["Autour des palombes", "Épervier d'Europe"], critere: "grand comme une buse, sourcil blanc très marqué et queue arrondie pour l'autour ; pas plus grand qu'un pigeon, longue queue au bout droit pour l'épervier" },
  { especes: ["Faucon hobereau", "Faucon pèlerin", "Faucon crécerelle"], critere: "culotte rousse sous le ventre et poitrine rayée en long pour le hobereau ; plus massif, poitrine barrée en travers pour le pèlerin ; dos roux tacheté de noir, il vole sur place, pour la crécerelle" },
  { especes: ["Chouette de Tengmalm", "Chevêche d'Athéna", "Chevêchette d'Europe"], critere: "grosse tête ronde, face blanche cerclée de noir et air étonné pour la Tengmalm ; tête plate et sourcils blancs froncés, dans les campagnes, pour la chevêche ; à peine plus grosse qu'un moineau pour la chevêchette" },
  { especes: ["Hibou moyen-duc", "Grand-duc d'Europe", "Petit-duc scops"], critere: "aigrettes et yeux orange, de la taille d'un pigeon, pour le moyen-duc ; énorme, bien plus grand, pour le grand-duc ; tout petit, gris, aux yeux jaunes, pour le petit-duc" },
  { especes: ["Bécassine des marais", "Bécasse des bois"], critere: "plus fine, bandes claires dans la longueur du dos et de la tête, dans les marais, pour la bécassine ; plus trapue, bandes sombres en travers de la tête, en forêt, pour la bécasse" },
  { especes: ["Pie-grièche grise", "Pie-grièche méridionale", "Pie-grièche écorcheur"], critere: "dos gris clair, ventre blanc pur et masque noir pour la grise ; dos gris plus sombre, ventre rosé et sourcil blanc bien net pour la méridionale ; dos roux pour le mâle écorcheur" },
  { especes: ["Tarier des prés", "Tarier pâtre"], critere: "large sourcil blanc au-dessus d'une joue sombre pour le tarier des prés ; tête noire sans sourcil et demi-collier blanc pour le mâle du tarier pâtre" },
  { especes: ["Traquet motteux", "Traquet oreillard"], critere: "dos gris et masque noir chez le mâle du traquet motteux ; dos crème, tranchant sur des ailes noires, pour l'oreillard, qui vit dans le Midi" },
  { especes: ["Pipit des arbres", "Pipit farlouse", "Pipit spioncelle"], critere: "presque identiques : le pipit des arbres chante en se laissant tomber depuis la cime d'un arbre ; le farlouse vit dans les prairies humides sans arbres ; le spioncelle vit en haute montagne, poitrine presque sans taches en été" },
  { especes: ["Bruant jaune", "Bruant zizi", "Bruant fou", "Bruant ortolan"], critere: "tête jaune vif pour le bruant jaune ; gorge noire et bandes noires sur la tête jaune pour le mâle zizi ; tête grise rayée de noir et ventre roux pour le fou ; tête gris-vert, gorge jaune pâle et cercle clair autour de l'œil pour l'ortolan" },
  { especes: ["Bergeronnette des ruisseaux", "Bergeronnette grise"], critere: "dessous jaune et dos gris pour la bergeronnette des ruisseaux ; toute en noir, blanc et gris, sans jaune, pour la grise" },
  { especes: ["Pic épeichette", "Pic épeiche", "Pic mar"], critere: "tout petit, gros comme un moineau, dos rayé de barres blanches et sans rouge sous la queue pour l'épeichette ; grandes taches blanches sur les épaules et rouge sous la queue pour l'épeiche ; calotte toute rouge et flancs rayés pour le mar" },
  { especes: ["Rougequeue à front blanc", "Rougequeue noir"], critere: "front blanc, gorge noire et poitrine orange pour le mâle à front blanc ; gris sombre à noir, sans orange sur la poitrine, pour le rougequeue noir ; tous les deux ont la queue rousse" },
  { especes: ["Mésange nonnette", "Mésange boréale", "Mésange noire"], critere: "calotte noire brillante, petite bavette et ailes unies pour la nonnette ; calotte noire mate, bavette plus grande et une bande claire sur l'aile pour la boréale ; tache blanche sur la nuque et deux barres blanches sur l'aile pour la mésange noire" },
  { especes: ["Pouillot de Bonelli", "Pouillot véloce"], critere: "ventre blanc pur, tête grisâtre et croupion jaune-vert pour le pouillot de Bonelli ; plus terne, olive-brun, pattes sombres, il répète « tsip-tsap » pour le véloce" },
  { especes: ["Accenteur mouchet", "Moineau domestique", "Accenteur alpin"], critere: "bec fin et pointu, tête et poitrine gris ardoise pour l'accenteur mouchet ; bec épais de mangeur de graines pour le moineau ; plus gros, gorge mouchetée de noir et flancs roux, en montagne, pour l'accenteur alpin" },
  { especes: ["Fauvette à tête noire", "Fauvette mélanocéphale"], critere: "seulement une calotte noire (rousse chez la femelle) pour la fauvette à tête noire ; toute la tête noire jusque sous l'œil et un cercle rouge autour de l'œil pour la mélanocéphale" },
  { especes: ["Corneille noire", "Grand corbeau", "Choucas des tours"], critere: "taille moyenne, bec assez fin et queue arrondie pour la corneille ; bien plus grand, gros bec et queue en pointe de losange pour le grand corbeau ; petit, nuque grise et œil clair pour le choucas" },
  { especes: ["Verdier d'Europe", "Venturon montagnard"], critere: "plus gros, bec épais et clair, bande jaune vif au bord de l'aile pour le verdier ; plus petit, nuque et côtés du cou gris, en montagne, pour le venturon" },
  { especes: ["Moineau friquet", "Moineau domestique"], critere: "calotte brun chocolat et tache noire sur la joue blanche pour le friquet ; calotte grise et joue sans tache pour le mâle du moineau domestique" },
  { especes: ["Vandoise", "Chevesne", "Gardon"], critere: "corps fin, petite tête et nageoire sous la queue au bord creusé pour la vandoise ; tête large et nageoire sous la queue au bord arrondi pour le chevesne ; œil rouge et corps plus haut pour le gardon" },
  { especes: ["Hotu", "Barbeau fluviatile"], critere: "museau en nez avancé au-dessus d'une bouche droite et coupante, sans barbillons, pour le hotu ; quatre barbillons autour de la bouche pour le barbeau" },
  { especes: ["Spirlin", "Ablette", "Vairon"], critere: "ligne pointillée de noir en double le long du flanc pour le spirlin ; toute argentée, fine, la bouche tournée vers le haut pour l'ablette ; flancs marbrés de taches sombres pour le vairon" },
  { especes: ["Blageon", "Vairon"], critere: "une large bande sombre bleutée le long du flanc, soulignée d'une ligne orangée, pour le blageon ; flancs marbrés de taches sombres pour le vairon" },
  { especes: ["Brème commune", "Carpe commune", "Gardon"], critere: "corps très haut et aplati, sans barbillons, pour la brème ; quatre barbillons et grosses écailles pour la carpe ; corps moins haut et œil rouge pour le gardon" },
  { especes: ["Cuivré de la bistorte", "Cuivré des marais"], critere: "petit, ailes orange marquées de taches noires et de reflets violets chez le mâle pour le cuivré de la bistorte ; plus grand, orange vif presque sans taches chez le mâle pour le cuivré des marais" },
  { especes: ["Azuré des mouillères", "Azuré du serpolet"], critere: "dessus bleu sans taches noires pour le mâle de l'azuré des mouillères, dans les prairies humides ; dessus bleu marqué de taches noires pour l'azuré du serpolet, sur les pelouses sèches" },
  { especes: ["Nacré de la canneberge", "Tabac d'Espagne", "Damier de la succise"], critere: "petit, orange à taches noires, avec des taches de nacre sous les ailes, dans les tourbières, pour le nacré ; grand, ailes pointues, dessous verdâtre zébré de bandes argentées pour le tabac d'Espagne ; ailes en damier orange, jaune et brun, sans nacre, pour le damier" },
  { especes: ["Petit paon de nuit", "Grand paon de nuit"], critere: "petit (6 à 7 cm), le mâle a les ailes de derrière orange et vole en plein jour, pour le petit paon de nuit ; très grand (jusqu'à 15 cm), brun, il vole la nuit, pour le grand paon de nuit" },
  { especes: ["Leucorrhine douteuse", "Sympétrum noir"], critere: "face toute blanche et dessins rouges sur le corps noir pour le mâle de la leucorrhine ; mâle presque tout noir, face sombre, pour le sympétrum noir" },
  { especes: ["Libellule déprimée", "Anax empereur"], critere: "abdomen très large et aplati, taches brunes à la base des quatre ailes pour la libellule déprimée ; abdomen long et fin, bleu ciel avec une ligne noire, pour l'anax" },
  { especes: ["Caloptéryx éclatant", "Caloptéryx vierge"], critere: "une bande bleu foncé au milieu des ailes seulement, le reste transparent, pour le mâle éclatant ; ailes entièrement foncées pour le mâle vierge" },
  { especes: ["Ascalaphe soufré", "Fourmilion"], critere: "ailes jaune soufre et noires, très longues antennes terminées par une boule pour l'ascalaphe ; ailes transparentes et antennes courtes pour le fourmilion" },
  { especes: ["Éphippigère des vignes", "Dectique verrucivore", "Grande sauterelle verte"], critere: "pas d'ailes visibles, seulement un dos relevé en selle de cheval, pour l'éphippigère ; trapu, ailes de la longueur du corps pour le dectique ; ailes bien plus longues que le corps pour la grande sauterelle" },
  { especes: ["Bourdon des pierres", "Bourdon des Alpes", "Bourdon terrestre"], critere: "tout noir velouté, seul le bout de l'abdomen rouge orangé, pour le bourdon des pierres ; orange sur plus de la moitié de l'abdomen, en haute montagne, pour le bourdon des Alpes ; rayé de jaune, au bout blanc, pour le terrestre" },
  { especes: ["Punaise arlequin", "Gendarme"], critere: "rayures rouges et noires dans la longueur du corps pour la punaise arlequin ; rouge avec des taches noires, dont deux gros points ronds, pour le gendarme" },
  { especes: ["Argyronète", "Dolomède des marais"], critere: "elle vit sous l'eau, dans une bulle d'air qui la fait briller comme de l'argent, pour l'argyronète ; grosse, à bandes claires sur les flancs, elle court à la surface pour la dolomède" },
  { especes: ["Mygale à chaussette", "Lycose de Narbonne"], critere: "noire et luisante, énormes crochets pointés vers l'avant, cachée dans un tube de soie, pour la mygale à chaussette ; brune et velue, dessous orange et noir, dans un terrier ouvert, pour la lycose" },
  { especes: ["Mulette perlière", "Grande mulette", "Anodonte des cygnes"], critere: "coquille noire, épaisse, en forme de rein, dans les ruisseaux froids pour la mulette perlière ; plus grande encore, dans quelques grands fleuves pour la grande mulette ; coquille mince et fragile, verdâtre, dans les étangs pour l'anodonte" },

  // Corse (26/10, étape 299) : groupes proposés et relus par Claude
  { especes: ["Discoglosse corse", "Discoglosse sarde"], critere: "presque identiques : le discoglosse corse ne vit qu'en Corse, surtout dans les ruisseaux de moyenne montagne ; le sarde vit aussi en Sardaigne et sur quelques îles, plus souvent près des côtes" },
  { especes: ["Lézard tyrrhénien", "Lézard sicilien"], critere: "presque identiques : le lézard tyrrhénien ne vit qu'en Corse et en Sardaigne ; le lézard sicilien, venu d'Italie, vit surtout près des côtes, des villes et des ports" },
  { especes: ["Lézard de Bedriaga", "Lézard tyrrhénien"], critere: "tête aplatie et dos couvert d'un réseau de taches sombres, dans les rochers de montagne, pour le lézard de Bedriaga ; plus petit, plus commun, à basse altitude, pour le tyrrhénien" },
  { especes: ["Phyllodactyle d'Europe", "Tarente de Maurétanie"], critere: "minuscule (moins de 8 cm) et lisse pour le phyllodactyle ; grande et couverte de petites bosses pour la tarente" },
  { especes: ["Salamandre de Corse", "Salamandre tachetée"], critere: "presque identiques : la salamandre de Corse a une tête plus large et un museau plus arrondi ; elle ne vit qu'en Corse" },
  { especes: ["Rainette sarde", "Rainette méridionale"], critere: "plus petite, souvent tachetée de sombre, pour la rainette sarde ; verte unie, avec une bande sombre seulement de l'œil à l'épaule, pour la méridionale" },
  { especes: ["Crapaud vert des Baléares", "Crapaud calamite"], critere: "grandes taches vertes bien dessinées sur fond clair pour le crapaud vert ; une ligne jaune au milieu du dos pour le calamite" },
  { especes: ["Lièvre de Corse", "Lièvre d'Europe"], critere: "presque identiques : le lièvre de Corse est plus petit et plus fin, avec de plus longues oreilles et une nuque grise" },
  { especes: ["Pipistrelle pygmée", "Pipistrelle commune"], critere: "presque identiques : on les distingue surtout à leurs cris d'écholocation, plus aigus chez la pygmée" },
  { especes: ["Oreillard gris", "Oreillard roux"], critere: "pelage gris et face sombre pour l'oreillard gris ; plus brun-roux, face claire, pour le roux" },
  { especes: ["Noctule de Leisler", "Noctule commune"], critere: "plus petite, poils foncés à la base et plus clairs au bout, pour la noctule de Leisler ; plus grande, d'un roux doré uni, pour la noctule commune" },
  { especes: ["Murin du Maghreb", "Grand murin"], critere: "presque identiques : le murin du Maghreb vit en Corse et en Sardaigne, le grand murin sur le continent" },
  { especes: ["Sittelle corse", "Sittelle torchepot"], critere: "petite, calotte noire chez le mâle, sourcil blanc et ventre blanchâtre pour la sittelle corse ; ventre orangé, sans calotte noire, pour le torchepot" },
  { especes: ["Venturon corse", "Venturon montagnard"], critere: "dos brun rayé de sombre pour le venturon corse ; dos vert uni, sans rayures, pour le venturon montagnard" },
  { especes: ["Corneille mantelée", "Corneille noire"], critere: "corps gris cendré, tête, ailes et queue noires pour la mantelée ; toute noire pour la corneille noire" },
  { especes: ["Étourneau unicolore", "Étourneau sansonnet"], critere: "noir uni, presque sans points blancs au printemps, pour l'unicolore ; reflets verts et violets, tacheté de blanc, pour le sansonnet" },
  { especes: ["Moineau cisalpin", "Moineau domestique"], critere: "calotte marron et joues blanches chez le mâle du moineau cisalpin ; calotte grise chez le domestique" },
  { especes: ["Roitelet à triple bandeau", "Roitelet huppé"], critere: "large sourcil blanc et trait noir à travers l'œil pour le triple bandeau ; pas de sourcil, l'œil noir au milieu d'une face unie, pour le huppé" },
  { especes: ["Fauvette sarde", "Fauvette pitchou"], critere: "toute grise, sans couleur rouge vineux sur le ventre, pour la fauvette sarde ; dessous rouge vineux pour la pitchou" },
  { especes: ["Fauvette de Moltoni", "Fauvette mélanocéphale"], critere: "tête grise et gorge saumonée chez le mâle de la fauvette de Moltoni ; tête noire et gorge blanche pour la mélanocéphale" },
  { especes: ["Hirondelle de fenêtre", "Hirondelle rustique"], critere: "croupion blanc et dessous tout blanc pour l'hirondelle de fenêtre ; gorge rouge et longs filets à la queue pour la rustique" },
  { especes: ["Martinet pâle", "Martinet noir"], critere: "plus clair et brun, avec une grande gorge blanche, pour le martinet pâle ; presque noir pour le martinet noir" },
  { especes: ["Grive musicienne", "Grive draine"], critere: "plus petite, dos brun chaud et petits points en V pour la musicienne ; plus grande, plus grise, gros points ronds pour la draine" },
  { especes: ["Serin cini", "Verdier d'Europe"], critere: "petit, jaune vif rayé de brun, bec minuscule pour le serin ; plus gros, vert olive, gros bec clair pour le verdier" },
  { especes: ["Pipit rousseline", "Pipit farlouse"], critere: "pâle, couleur de sable, poitrine presque sans rayures pour le rousseline ; poitrine bien rayée pour la farlouse" },
  { especes: ["Monticole bleu", "Monticole de roche"], critere: "tout bleu ardoise chez le mâle du monticole bleu ; tête bleue et ventre orange pour le monticole de roche" },
  { especes: ["Bruant proyer", "Alouette des champs"], critere: "plus trapu, gros bec de bruant, sans huppe pour le proyer ; huppe courte et bec fin pour l'alouette" },
  { especes: ["Pigeon biset", "Pigeon ramier"], critere: "plus petit, deux barres noires sur l'aile et croupion blanc pour le biset ; tache blanche sur le cou et bande blanche sur l'aile pour le ramier" },
  { especes: ["Gallinule poule-d'eau", "Foulque macroule"], critere: "bec rouge à bout jaune et ligne blanche sur le flanc pour la gallinule ; bec et plaque blancs sur le front pour la foulque" },
  { especes: ["Grèbe castagneux", "Grèbe huppé"], critere: "petit et rond, joues et cou roux en été pour le castagneux ; grand, long cou, huppe et collerette pour le huppé" },
  { especes: ["Goéland d'Audouin", "Goéland leucophée"], critere: "bec rouge sombre et pattes gris-vert pour le goéland d'Audouin ; bec jaune à tache rouge et pattes jaunes pour le leucophée" },
  { especes: ["Puffin yelkouan", "Puffin de Scopoli", "Puffin des Anglais"], critere: "grand, dos brun-gris et bec jaune pour le puffin de Scopoli ; plus petits, dessus sombre et dessous blanc pour le yelkouan, en Méditerranée, et le puffin des Anglais, dans l'Atlantique" },
  { especes: ["Faucon d'Éléonore", "Faucon hobereau"], critere: "plus grand, à longue queue, parfois tout sombre, nichant en colonies sur les falaises au bord de la mer pour le faucon d'Éléonore ; culotte rousse pour le hobereau" },
  { especes: ["Girelle paon", "Girelle commune"], critere: "corps vert à bandes bleues et tête orangée striée de bleu pour la girelle paon ; bande orange en zigzag sur le flanc du mâle pour la girelle commune" },
  { especes: ["Crénilabre paon", "Vieille commune"], critere: "plus fin, taches et lignes bleues sur la tête pour le crénilabre paon ; grand, massif et marbré pour la vieille" },
  { especes: ["Sar à tête noire", "Sar commun"], critere: "une bande noire sur la nuque et une avant la queue pour le sar à tête noire ; fines bandes sombres et une seule tache noire avant la queue pour le sar commun" },
  { especes: ["Oblade", "Saupe"], critere: "grosse tache noire bordée de blanc avant la queue pour l'oblade ; lignes dorées en long sur le flanc pour la saupe" },
  { especes: ["Serran chevrette", "Serran écriture"], critere: "bandes sombres en travers et lignes en long sur le flanc pour la chevrette ; dessins bleus comme une écriture sur la tête pour le serran écriture" },
  { especes: ["Citron de Provence", "Citron"], critere: "mâle jaune avec une grande tache orange sur les ailes de devant pour le citron de Provence ; tout jaune pour le citron" },
  { especes: ["Souci", "Citron"], critere: "orange vif bordé de noir pour le souci ; jaune citron, sans bordure noire, pour le citron" },
  { especes: ["Belle-Dame", "Vulcain"], critere: "orange saumon taché de noir, bouts des ailes noirs tachés de blanc pour la belle-dame ; noir à bandes rouges pour le vulcain" },
  { especes: ["Porte-queue de Corse", "Machaon"], critere: "presque identiques : le porte-queue de Corse a des queues plus courtes et des bandes noires plus larges ; il ne vit qu'en Corse et en Sardaigne" },
  { especes: ["Cardinal", "Tabac d'Espagne"], critere: "dessous des ailes de devant rose-rouge pour le cardinal ; dessous des ailes de derrière vert, rayé d'argent, pour le tabac d'Espagne" },
  { especes: ["Tircis", "Mégère tyrrhénienne"], critere: "taches crème sur fond brun foncé pour le tircis ; orange quadrillé de brun pour la mégère" },
  { especes: ["Azuré de la bugrane", "Azuré du serpolet"], critere: "bleu sans taches noires sur le dessus chez le mâle de l'azuré de la bugrane ; taches noires sur le dessus pour celui du serpolet" },
  { especes: ["Cuivré commun", "Cuivré des marais"], critere: "ailes de devant orange cuivré bordées de brun, ailes de derrière brunes pour le cuivré commun ; tout orange vif chez le mâle du cuivré des marais" },
  { especes: ["Caloptéryx hémorroïdal", "Caloptéryx éclatant", "Caloptéryx vierge"], critere: "ailes sombres et bout de l'abdomen rouge chez le mâle de l'hémorroïdal ; une large bande sombre au milieu des ailes pour l'éclatant ; ailes entièrement bleu sombre pour le vierge" },
  { especes: ["Synème globuleux", "Thomise variable"], critere: "abdomen rond à dessin noir sur fond rouge, jaune ou blanc pour le synème ; abdomen blanc, jaune ou vert, souvent sans dessin net, pour la thomise" },
  { especes: ["Lycose radiée", "Lycose de Narbonne"], critere: "plus petite, avec des bandes claires sur le dos pour la lycose radiée ; grande et velue, ventre noir pour la lycose de Narbonne" },
  { especes: ["Langouste rouge", "Cigale de mer"], critere: "longues antennes épineuses pour la langouste ; antennes en palettes plates pour la cigale de mer" },
  { especes: ["Crabe bleu", "Crabe vert"], critere: "pattes bleues et dernière paire de pattes en palettes pour nager pour le crabe bleu ; verdâtre, sans palettes, pour le crabe vert" },
  { especes: ["Crabe verruqueux", "Crabe marbré"], critere: "trapu, carapace bombée et grosses pinces aux pointes noires pour le crabe verruqueux ; carapace plate et carrée, marbrée de lignes, pour le crabe marbré" },
  { especes: ["Ormeau", "Patelle commune"], critere: "coquille en oreille, percée d'une rangée de trous, pour l'ormeau ; en chapeau pointu, sans trous, pour la patelle" },
  { especes: ["Troque turbiné", "Bigorneau"], critere: "coquille en toupie, tachetée en damier, pour le troque ; ronde, lisse et sombre pour le bigorneau" },
  { especes: ["Oursin noir", "Oursin violet"], critere: "tout noir, sans débris accrochés, pour l'oursin noir ; violet, brun ou verdâtre, souvent couvert de débris, pour l'oursin violet" },
  { especes: ["Gorgone rouge", "Corail rouge"], critere: "grandes branches souples en éventail, rouges aux bouts jaunes, pour la gorgone ; petites branches dures et rouges, à l'ombre des grottes, pour le corail rouge" },
  // Jura (26/10, étape 302) : groupes proposés et relus par Claude
  { especes: ["Musaraigne carrelet", "Musaraigne couronnée"], critere: "presque identiques : on ne les distingue sûrement qu'au crâne ou aux chromosomes ; la couronnée vit surtout à l'ouest de l'Europe, la carrelet surtout plus à l'est" },
  { especes: ["Musaraigne alpine", "Musaraigne carrelet"], critere: "gris ardoise uni et queue très longue, presque comme le corps, pour la musaraigne alpine ; pelage en trois tons (dos brun sombre, flancs plus clairs, ventre gris) pour la carrelet" },
  { especes: ["Murin à moustaches", "Murin de Daubenton"], critere: "petit, pelage sombre et face presque noire pour le murin à moustaches ; ventre blanchâtre bien séparé du dos et grands pieds, au ras de l'eau, pour le Daubenton" },
  { especes: ["Murin de Natterer", "Murin à moustaches"], critere: "ventre blanc pur et frange de poils raides au bord de la membrane de la queue pour le murin de Natterer ; plus petit, face sombre, pour le murin à moustaches" },
  { especes: ["Pipistrelle de Nathusius", "Pipistrelle commune"], critere: "presque identiques : la pipistrelle de Nathusius est un peu plus grande, au pelage plus long ; c'est une grande voyageuse, qui migre sur des centaines de kilomètres" },
  { especes: ["Sérotine bicolore", "Sérotine commune"], critere: "dos sombre aux poils pointés d'argent, comme givré, et gorge blanche pour la sérotine bicolore ; plus grande, brun sombre uni, pour la sérotine commune" },
  { especes: ["Grive litorne", "Grive draine"], critere: "tête et croupion gris, dos brun-roux pour la litorne ; dos gris-brun uni, sans gris sur la tête, pour la draine" },
  { especes: ["Pic tridactyle", "Pic épeiche"], critere: "calotte jaune chez le mâle et aucune trace de rouge pour le pic tridactyle ; rouge sous la queue, et sur la nuque chez le mâle, pour l'épeiche" },
  { especes: ["Pic cendré", "Pic vert"], critere: "tête grise, fine moustache noire et un peu de rouge au front chez le mâle seulement pour le pic cendré ; grande calotte rouge et masque noir pour le pic vert" },
  { especes: ["Sizerin cabaret", "Linotte mélodieuse"], critere: "front rouge et petite tache noire au menton pour le sizerin ; front gris, poitrine rouge chez le mâle et pas de noir au menton pour la linotte" },
  { especes: ["Pouillot siffleur", "Pouillot véloce"], critere: "large sourcil jaune, gorge jaune vif et ventre blanc pur pour le pouillot siffleur ; plus terne, gris-vert, pattes sombres pour le véloce" },
  { especes: ["Fauvette babillarde", "Fauvette à tête noire"], critere: "tête grise, joue plus sombre comme un masque et gorge blanche pour la babillarde ; calotte noire (rousse chez la femelle), sans masque, pour la fauvette à tête noire" },
  { especes: ["Tarin des aulnes", "Serin cini"], critere: "calotte et menton noirs chez le mâle, barres jaunes sur l'aile noire pour le tarin ; plus petit, bec minuscule, sans noir sur la tête pour le serin" },
  { especes: ["Grosbec casse-noyaux", "Bouvreuil pivoine"], critere: "énorme bec conique, tête brun-orangé et nuque grise pour le grosbec ; calotte noire et poitrine rose-rouge chez le mâle pour le bouvreuil" },
  { especes: ["Râle des genêts", "Caille des blés"], critere: "plus grand, ailes rousses bien visibles en vol, chant « crex-crex » répété la nuit pour le râle ; petite et ronde, chant « paye-tes-dettes » pour la caille" },
  { especes: ["Pigeon colombin", "Pigeon ramier"], critere: "plus petit, sans blanc sur le cou ni sur l'aile, cou à reflets verts pour le colombin ; tache blanche sur le cou et bande blanche sur l'aile pour le ramier" },
  { especes: ["Pigeon colombin", "Pigeon biset"], critere: "croupion gris et deux courtes barres noires sur l'aile pour le colombin ; croupion blanc et deux longues barres noires pour le biset" },
  { especes: ["Grenouille rieuse", "Grenouille verte"], critere: "presque identiques : la rieuse est plus grande, plus olive ou brune, avec des sacs vocaux gris foncé ; la verte a des sacs vocaux blancs" },
  { especes: ["Goujon commun", "Goujon occitan"], critere: "presque identiques : on les distingue surtout à l'endroit où ils vivent, le goujon commun dans le nord et l'est de la France et le bassin du Rhône, le goujon occitan dans le bassin de la Garonne et les rivières du Languedoc et du Roussillon" },
  { especes: ["Rotengle", "Gardon"], critere: "nageoire du dos placée en arrière de celles du ventre et nageoires rouge vif pour le rotengle ; nageoire du dos juste au-dessus de celles du ventre et œil rouge pour le gardon" },
  { especes: ["Perche soleil", "Perche commune"], critere: "corps rond et plat, tache noire et rouge au bord de l'ouïe pour la perche soleil ; corps allongé, bandes sombres en travers et nageoires rouges pour la perche commune" },
  { especes: ["Apron du Rhône", "Chabot"], critere: "corps fin et allongé, deux nageoires du dos bien séparées et bandes sombres en travers pour l'apron ; grosse tête large et aplatie pour le chabot" },
  { especes: ["Solitaire", "Souci"], critere: "jaune citron (blanc verdâtre chez la femelle) bordé de noir, dans les tourbières, pour le solitaire ; orange vif bordé de noir pour le souci" },
  { especes: ["Fadet des tourbières", "Fadet des laîches"], critere: "dessous clair aux ocelles petits ou absents, dans les tourbières, pour le fadet des tourbières ; une rangée de gros ocelles cerclés de jaune sous l'aile pour le fadet des laîches" },
  { especes: ["Moiré franconien", "Moiré blanc-fascié"], critere: "petits ocelles dans une bande orange, sans blanc, pour le moiré franconien ; une fine bande blanche sous l'aile de derrière pour le moiré blanc-fascié" },
  { especes: ["Grand Sylvain", "Sylvain azuré"], critere: "très grand, avec une bande orange au bord des ailes, pour le grand sylvain ; plus petit, noir aux reflets bleus barré de blanc pour le sylvain azuré" },
  { especes: ["Petit Mars changeant", "Grand Mars changeant"], critere: "un ocelle sur l'aile de devant pour le petit mars ; pas d'ocelle sur l'aile de devant pour le grand mars" },
  { especes: ["Nacré de la sanguisorbe", "Nacré de la canneberge"], critere: "dessous de l'aile de derrière jaune et violacé, sans taches argentées, près de la reine-des-prés, pour le nacré de la sanguisorbe ; dans les tourbières, avec des taches claires nacrées, pour le nacré de la canneberge" },
  { especes: ["Cuivré de la verge-d'or", "Cuivré des marais"], critere: "dessous jaune-orangé avec de petits points blancs pour le cuivré de la verge-d'or ; dessous de l'aile de derrière gris-bleu à points noirs pour le cuivré des marais" },
  { especes: ["Robert-le-diable", "Petite tortue"], critere: "bords des ailes très découpés et un petit « C » blanc sous l'aile pour le robert-le-diable ; bords réguliers, taches noires et jaunes et bordure de points bleus pour la petite tortue" },
  { especes: ["Cordulie arctique", "Cordulie à corps fin"], critere: "corps vert bronze sombre, sans taches jaunes, dans les tourbières de montagne, pour la cordulie arctique ; taches jaunes sur le dessus de l'abdomen pour la cordulie à corps fin" },
  { especes: ["Leucorrhine à gros thorax", "Leucorrhine douteuse"], critere: "une tache jaune vif vers le bout de l'abdomen chez le mâle de la leucorrhine à gros thorax ; taches rouges chez le mâle de la douteuse" },
  { especes: ["Agrion hasté", "Agrion de Mercure"], critere: "un dessin noir en fer de lance en haut de l'abdomen du mâle pour l'agrion hasté ; un dessin en forme de tête de taureau (le symbole de Mercure) pour l'agrion de Mercure" },
  { especes: ["Sauterelle cymbalière", "Grande sauterelle verte"], critere: "ailes courtes, qui ne dépassent pas le bout de l'abdomen, pour la cymbalière ; ailes bien plus longues que l'abdomen pour la grande sauterelle verte" },
  { especes: ["Écrevisse américaine", "Écrevisse à pattes blanches", "Écrevisse signal"], critere: "bandes rouge-brun en travers du dos et pinces aux bouts orange pour l'américaine ; plus petite, brune, dessous des pinces clair pour celle à pattes blanches ; une tache blanche à l'articulation des pinces pour la signal" },
  { especes: ["Escargot des jardins", "Escargot des haies"], critere: "bord de l'ouverture de la coquille blanc pour l'escargot des jardins ; brun foncé pour l'escargot des haies" },
  { especes: ["Soucoupe commune", "Hélice des bois"], critere: "coquille très plate, à bord tranchant, comme une soucoupe, pour la soucoupe ; coquille ronde et brune pour l'hélice des bois" },
  { especes: ["Méta des cavernes", "Épeire diadème"], critere: "dans le noir des grottes et des caves, abdomen brun luisant sans croix pour la méta ; une croix blanche sur l'abdomen pour l'épeire" },
  // Vosges (étape VG1, 31/10/2026) : muets tant que les Vosges ne sont pas actives
  { especes: ["Grimpereau des jardins", "Grimpereau des bois"], critere: "flancs brunâtres et sourcil peu marqué pour le grimpereau des jardins ; ventre et flancs blanc pur et sourcil blanc net pour le grimpereau des bois ; le plus sûr reste le chant" },
  { especes: ["Pouillot fitis", "Pouillot véloce"], critere: "pattes claires, sourcil jaunâtre net et chant en cascade descendante pour le fitis ; pattes sombres et chant « tchif-tchaf » pour le véloce" },
  { especes: ["Fauvette des jardins", "Fauvette à tête noire"], critere: "toute brun-gris, sans calotte, l'air très uni, pour la fauvette des jardins ; une calotte noire (mâle) ou rousse (femelle) pour la fauvette à tête noire" },
  { especes: ["Fauvette grisette", "Fauvette babillarde"], critere: "ailes bordées de roux, dos brun et gorge blanche pour la grisette ; dos gris, joues sombres comme un masque, sans roux, pour la babillarde" },
  { especes: ["Corbeau freux", "Corneille noire"], critere: "base du bec nue et grisâtre chez l'adulte, plumes des cuisses en « culotte » pour le freux ; bec tout noir, emplumé à la base, pour la corneille" },
  { especes: ["Moiré de la canche", "Moiré franconien"], critere: "petit, avec des points noirs sans centre blanc dans des taches orange, sur les hautes chaumes, pour le moiré de la canche ; ocelles plus grands, au centre blanc, pour le moiré franconien" },
  { especes: ["Tristan", "Myrtil"], critere: "dessus brun sombre uni, dessous à ocelles cerclés de jaune sur les deux ailes pour le tristan ; une plage orange et un seul ocelle sur l'aile de devant pour le myrtil" },
  { especes: ["Fadet commun", "Fadet des tourbières"], critere: "petit, orange ocre, un petit ocelle au bout de l'aile de devant, dans les prés, pour le fadet commun ; plus grand, dessous plus gris, dans les tourbières, pour le fadet des tourbières" },
  { especes: ["Aeschne subarctique", "Aeschne bleue"], critere: "bandes du thorax jaunes très fines et petites taches bleues, dans les tourbières à sphaignes, pour l'aeschne subarctique ; larges bandes vert pomme sur le thorax pour l'aeschne bleue" },
  { especes: ["Libellule à quatre taches", "Libellule déprimée"], critere: "une petite tache sombre au milieu du bord de chaque aile et abdomen brun qui s'affine pour la libellule à quatre taches ; abdomen très large et aplati, bleu chez le mâle, pour la déprimée" },
  { especes: ["Grillon des bois", "Grillon champêtre"], critere: "petit (environ 1 cm), brun, dans les feuilles mortes des bois pour le grillon des bois ; gros, noir luisant à grosse tête, devant son terrier dans les prés, pour le grillon champêtre" },
  { especes: ["Carabe à reflets dorés", "Carabe doré"], critere: "côtes noires sur des élytres dorés à reflets cuivrés, dans les forêts de montagne, pour le carabe à reflets dorés ; côtes vertes comme le reste des élytres et pattes rousses, dans les champs et jardins, pour le carabe doré" },
  { especes: ["Géotrupe des bois", "Géotrupe du fumier"], critere: "élytres presque lisses, dessous bleu-violet métallique, dans les forêts, pour le géotrupe des bois ; élytres creusés de sillons profonds pour le géotrupe du fumier" },
  { especes: ["Bourdon des champs", "Bourdon terrestre"], critere: "thorax roux fauve et pas de bout blanc pour le bourdon des champs ; noir à bandes jaunes et bout de l'abdomen blanc pour le bourdon terrestre" },
  { especes: ["Pholque phalangide", "Faucheux"], critere: "une vraie araignée en deux parties, très longues pattes fines, qui tisse une toile dans les coins des maisons, pour le pholque ; corps rond d'un seul bloc, sans toile, pour le faucheux" },
  { especes: ["Épeire des fissures", "Épeire diadème"], critere: "abdomen plat brun sombre à dessin en feuille, cachée le jour dans les fentes d'écorce, pour l'épeire des fissures ; une croix blanche sur l'abdomen pour l'épeire diadème" },
  { especes: ["Cloporte rugueux", "Cloporte des murs"], critere: "dos gris mat couvert de petits grains rugueux pour le cloporte rugueux ; dos lisse et luisant à taches jaunâtres en rangées pour le cloporte des murs" },
  { especes: ["Limace cendrée", "Limace léopard"], critere: "très grande, souvent gris-noir uni, avec une bande claire au milieu de la sole, dans les forêts, pour la limace cendrée ; tachetée comme un léopard, sole toute claire, pour la limace léopard" },
  // Grand Est (étape GE2, 31/10/2026) : muets tant que le Grand Est n'est pas actif
  { especes: ["Piéride de la rave", "Piéride du chou"], critere: "plus petite, avec une tache noire au bout de l'aile de devant qui ne descend pas le long du bord pour la piéride de la rave ; plus grande, avec un bout d'aile noir qui descend en croissant le long du bord pour la piéride du chou" },
  { especes: ["Petit Sylvain", "Sylvain azuré"], critere: "dessus noir sans reflet et deux rangées de points noirs sous l'aile de derrière pour le petit sylvain ; dessus à reflets bleutés et une seule rangée de points pour le sylvain azuré" },
  { especes: ["Grande Tortue", "Petite tortue"], critere: "plus grande, orange terne, sans tache blanche au bout de l'aile de devant pour la grande tortue ; plus petite, orange vif, avec une petite tache blanche près du bout de l'aile de devant pour la petite tortue" },
  { especes: ["Gobemouche à collier", "Gobemouche noir"], critere: "au printemps, le mâle porte un collier blanc qui fait tout le tour du cou pour le gobemouche à collier ; pas de collier pour le gobemouche noir" },
  { especes: ["Rousserolle turdoïde", "Rousserolle effarvatte"], critere: "grande comme une grive, gros bec, sourcil clair et chant puissant et rauque pour la turdoïde ; petite comme un moineau, chant plus régulier pour l'effarvatte" },
  { especes: ["Grèbe à cou noir", "Grèbe castagneux"], critere: "au printemps, cou noir, œil rouge et touffes dorées en éventail derrière l'œil pour le grèbe à cou noir ; joues et cou roux, sans touffes, pour le castagneux" },
  { especes: ["Fuligule milouin", "Nette rousse"], critere: "mâle à tête rousse, bec gris et noir et dos gris clair pour le fuligule ; mâle à tête orange vif, bec rouge et flancs blancs pour la nette" },
  { especes: ["Crapaud vert", "Crapaud vert des Baléares"], critere: "presque identiques, avec des taches vertes sur fond clair ; on les distingue surtout au lieu : le nord-est de la France pour le crapaud vert, la Corse pour celui des Baléares" },
  { especes: ["Grémille", "Perche commune"], critere: "sans bandes noires en travers du corps, les deux nageoires du dos soudées en une seule, pour la grémille ; bandes sombres verticales et nageoires du ventre rouges pour la perche" },
  { especes: ["Loche de rivière", "Loche franche"], critere: "corps aplati sur les côtés, rangées de taches sombres et petite épine sous l'œil pour la loche de rivière ; corps arrondi et marbré, sans épine, pour la loche franche" },
  { especes: ["Épinochette", "Épinoche"], critere: "une rangée de 7 à 12 petites épines sur le dos pour l'épinochette ; seulement 3 grandes épines pour l'épinoche" },
  { especes: ["Pseudorasbora", "Goujon commun"], critere: "bouche tournée vers le haut, sans barbillons, et une bande sombre le long du flanc pour le pseudorasbora ; bouche en dessous avec deux barbillons pour le goujon" },
  { especes: ["Petite biche", "Lucane cerf-volant"], critere: "toute noire et mate, tête presque aussi large que le corselet, pour la petite biche ; élytres brun-rouge luisants et, chez le mâle, grandes mâchoires en bois de cerf pour le lucane" },
  { especes: ["Coccinelle asiatique", "Coccinelle à sept points"], critere: "couleurs et nombre de points très variables, souvent un dessin noir en M sur un corselet blanc pour l'asiatique ; toujours rouge à 7 points noirs, corselet noir à deux taches blanches pour celle à sept points" },
  { especes: ["Zoropsis à pattes épineuses", "Tégénaire des maisons"], critere: "pattes épaisses garnies d'épines et dessins bruns sur le dos, sans toile (elle chasse à l'affût) pour la zoropsis ; longues pattes fines et toile en nappe dans un coin pour la tégénaire" },
  { especes: ["Philoscie des mousses", "Cloporte des murs"], critere: "petite (environ 1 cm), brun luisant marbré, tête foncée, très rapide pour la philoscie ; plus grande, grise avec des taches jaunâtres en rangées pour le cloporte des murs" },
  { especes: ["Mulette épaisse", "Anodonte des cygnes"], critere: "coquille épaisse et petite, avec des dents à la charnière, pour la mulette ; très grande coquille mince et fragile, sans dents, pour l'anodonte" },
  { especes: ["Corbicule asiatique", "Moule zébrée"], critere: "coquille ronde et épaisse, à grosses stries régulières, enfouie dans le sable pour la corbicule ; coquille triangulaire rayée, fixée en grappes sur les pierres pour la moule zébrée" },
];
// Le groupe qui donne la phrase d'une espèce (le premier où elle figure), ou rien
// Étape 284 : un groupe ne compte que si toutes ses espèces sont dans le jeu (territoire pas encore actif = groupe muet)
function groupeComplet(groupe) { return groupe.especes.every(nom => ESPECES.some(e => e.nom_courant === nom)); }
function confusionDe(espece) {
  return CONFUSIONS.find(groupe => groupe.especes.includes(espece.nom_courant) && groupeComplet(groupe)) || null;
}
// Tous ses sosies, dans tous les groupes où elle figure : ils serviront de mauvaises réponses
function sosiesDe(espece) {
  const noms = CONFUSIONS.filter(groupe => groupe.especes.includes(espece.nom_courant)).flatMap(groupe => groupe.especes);
  return ESPECES.filter(e => e !== espece && noms.includes(e.nom_courant));
}
// "Fouine", "Chamois et Mouflon méditerranéen", "A, B et C"
function listeDeNoms(noms) {
  return noms.length <= 1 ? noms.join("") : noms.slice(0, -1).join(", ") + " et " + noms[noms.length - 1];
}
// La phrase affichée après avoir reconnu l'espèce sur sa photo
function phraseConfusion(espece) {
  const groupe = confusionDe(espece);
  if (!groupe) return "";
  const autres = groupe.especes.filter(nom => nom !== espece.nom_courant);
  return ` À ne pas confondre avec : ${listeDeNoms(autres)}. Le repère : ${groupe.critere}.`;
}

// Les mauvaises réponses de « mâle et femelle » (étape 69) : seulement ce qui est plausible.
//   • uniquement les réponses de la même famille (pas de « mâle plus coloré » pour un mammifère)
//   • les bois ne sont proposés que pour une espèce qui porte des bois, les cornes que pour
//     une espèce qui porte des cornes (colonne cornes_bois_forme)
//   • jamais une réponse à moitié vraie : chez le cerf, le mâle est AUSSI plus grand
const SEXES_PROCHES = { "Bois chez le mâle": ["Taille"], "Cornes plus grandes": ["Taille", "Cornes chez le mâle"],
                        "Cornes chez le mâle": ["Taille", "Cornes plus grandes"],
                        "Mâle plus coloré": ["Plumage différent"], "Plumage différent": ["Mâle plus coloré"] };
function piegesSexes(espece) {
  const bonne = espece.difference_male_femelle;
  const ornement = String(espece.cornes_bois_forme || "");          // "Bois ramifiés", "Cornes en crochet", ou rien
  const interdites = [bonne, ...(SEXES_PROCHES[bonne] || [])];
  const famille = [...new Set(ESPECES.filter(e => e.onglet === espece.onglet).map(e => e.difference_male_femelle).filter(estRenseigne))];
  return famille.filter(v => !interdites.includes(v))
                .filter(v => !v.startsWith("Bois") || ornement.startsWith("Bois"))
                .filter(v => !v.startsWith("Cornes") || ornement.startsWith("Cornes"));
}

// Fabrique UNE question du portrait. Tout ce qui est commun est écrit ici une seule fois :
//   champ    : le nom de la case dans le carnet du joueur (et, sauf "colonne", la colonne de l'Excel)
//   onglets  : les familles concernées (une même colonne peut exister dans deux onglets)
//   lire, valeur, proches : seulement pour les cas particuliers (le pelage, la couleur)
//   sansImage : réponses écrites, sans dessin (la photo reste cachée)
//   niveau    : 1 si rien n'est dit ; 2 ou 3 pour les détails moins visibles (étape 68)
//   avecPhoto : la photo reste affichée, quand elle ne donne pas la réponse (pupille, écailles…)
// Étape 241 (22/10) : l'aide « silhouette » ne s'affiche que pour les questions de FORME, où elle aide vraiment.
// Pas pour les couleurs, l'aspect de la robe, la peau, le poil, les yeux… (la silhouette est d'une seule couleur).
// Pas non plus quand elle donnerait la réponse toute faite (« Quelle est sa silhouette ? », forme du corps d'un poisson).
const SILHOUETTE_UTILE = new Set([
  "cornes_bois_forme", "pattes_type", "queue_forme", "oreilles_forme", "oreilles_taille",   // mammifères (R181 : + la taille des oreilles)
  "poil_longueur",                // étape 274 (« Revoir 4 ») : la silhouette situe l'animal, sans donner la longueur du poil
  "bec_forme", "ornement_tete", "pattes_aspect",                                // oiseaux
  "queue_adulte",                                                               // amphibiens
  "pattes_nombre", "museau_forme",                                              // reptiles
  "nageoires_dos", "queue_poisson", "bouche_position",                          // poissons
  "ailes_visibles", "antennes_forme", "ailes_repos",                            // insectes
]);
function poilDeuxLongueurs(v) { return v === "Mi-long" ? "Long" : v; }   // étape 274
// (étape 274 : pas pour le poil du hérisson, dont la silhouette hérissée donnerait « Piquants »)
function silhouetteUtile(q, espece) {
  if (!q || !SILHOUETTE_UTILE.has(q.champ)) return false;
  if (q.champ === "poil_longueur" && espece && espece.poil_longueur === "Piquants") return false;
  return true;
}

function questionPortrait({ champ, colonne, onglets, libelle, question, explication, lire, valeur, proches, sansImage, affichageFiche, niveau, avecPhoto, pieges }) {
  const col = colonne || champ;
  const lecture = lire || (e => e[col]);
  const brute = valeur || (e => valeurPortrait(e, col));
  return {
    champ, niveau: niveau || 1, libelle, format: "picto", colonnePicto: col, sansImage, affichageFiche, avecPhoto,
    onglets, lecture, proches,           // gardés pour le défi « Qui est-ce ? » (étape 70, voir vraiAussiPour)
    valeur: e => {
      if (onglets && !onglets.includes(e.onglet)) return "NA";
      const v = brute(e);
      return estRenseigne(v) && souffleParLeNom(e, v) ? "NA" : v;      // réponse soufflée par le nom : pas de question
    },
    question,
    // "pieges" : une question peut fournir elle-même ses mauvaises réponses (étape 69)
    pieges: pieges || (e => piegesPortrait(e, lecture(e), lecture, proches)),
    explication,
  };
}

// Étape R134 : couleurs d'yeux trop proches pour être proposées ensemble (un iris jaune pâle paraît blanchâtre)
const YEUX_PROCHES = { Jaune: ["Orange", "Blanc"], Orange: ["Jaune", "Rouge"], Rouge: ["Orange"], Blanc: ["Gris clair", "Jaune"],
                       "Gris clair": ["Blanc"], Noir: ["Brun"] };

const QUESTIONS_PORTRAIT = [
  // -- Toutes les familles --
  // Étape R178 (retour d'Aubin du 09/11, en attendant la décision sur l'aspect des mammifères) : un pelage « bicolore »
  // (ventre plus clair que le dos : lapin, souris grise…) ne se voit pas sur la photo, où l'animal paraît uni.
  // Pour les mammifères, la question n'est plus posée quand la réponse est « Bicolore », et « Bicolore » n'est plus un piège.
  questionPortrait({ champ: "robe", colonne: "motif_robe", libelle: "Aspect",
    lire: lireRobe, valeur: e => (e.onglet === "Mammiferes" && valeurRobe(e) === "Bicolore") ? "NA" : valeurRobe(e), proches: ROBES_PROCHES,
    pieges: e => piegesPortrait(e, lireRobe(e), lireRobe, ROBES_PROCHES).filter(v => !robesAussiVraies(e).includes(v) && !(e.onglet === "Mammiferes" && v === "Bicolore")),
    question: e => `Quel est l'aspect de ${NOM_ROBE[e.onglet]} ?`,
    affichageFiche: (e, v) => majuscule(direRobe(e, v)),
    explication: (e, v) => `${majuscule(NOM_ROBE[e.onglet])} : ${direRobe(e, v)}.` }),
  // Étape 135 : ni couleur voisine, ni couleur citée dans sa description parmi les mauvaises réponses
  // Étape 204 (18/10) : plus de question de couleur pour les poissons (sous l'eau, la lumière et les reflets
  // changent trop la couleur sur la photo : brun, gris et argenté se confondent)
  questionPortrait({ champ: "couleur_dominante", libelle: "Couleur", proches: COULEURS_PROCHES,
    onglets: ["Mammiferes", "Oiseaux", "Amphibiens", "Reptiles", "Insectes", "Araignees_mille_pattes", "Crustaces", "Mollusques", "Vers_meduses_compagnie"],
    pieges: e => piegesPortrait(e, e.couleur_dominante, x => x.couleur_dominante, COULEURS_PROCHES, [...couleursCitees(e), ...listeCouleursPlumage(e)]),   // R135 : ni ses couleurs bien visibles
    question: e => couleurVariable(e) ? "Quelle couleur peut-il avoir ?" : "Quelle est sa couleur dominante ?",
    explication: (e, v) => couleurVariable(e) ? `Sa couleur varie d'un individu à l'autre : ${minuscule(v)}, entre autres.`
                                              : `Sa couleur dominante : ${minuscule(v)}.` }),

  // -- Mammifères --
  questionPortrait({ champ: "cornes_bois_forme", onglets: ["Mammiferes"], libelle: "Forme des cornes",
    question: "Quelle forme ont ses cornes ou ses bois ?",
    explication: (e, v) => `Il porte des ${minuscule(v)}.` }),
  questionPortrait({ champ: "pattes_type", onglets: ["Mammiferes"], libelle: "Pattes",
    question: "Comment se terminent ses pattes ?",
    explication: (e, v) => ({ "Sabots": "Ses pattes se terminent par des sabots.", "Griffes": "Ses pattes se terminent par des griffes.",
                              "Pattes palmées": "Ses pattes sont palmées.", "Ailes de peau": "Ses pattes avant sont des ailes de peau." })[v] || `Ses pattes : ${minuscule(v)}.` }),
  // Étape R178 (retour d'Aubin du 09/11) : la queue et les oreilles se jugent toujours « par rapport à son corps »
  // (une queue « longue » de souris n'est pas celle d'un écureuil) : la question et l'explication le disent.
  questionPortrait({ champ: "queue_forme", onglets: ["Mammiferes"], libelle: "Queue",
    question: "Comment est sa queue, par rapport à son corps ?",
    explication: (e, v) => `Sa queue : ${minuscule(v)}${/^(Courte|Longue)$/.test(v) ? ", par rapport à son corps" : ""}.` }),
  // Étape R181 (retour d'Aubin du 09/11 : « séparer la forme et la taille des oreilles ») : deux questions.
  // La forme : pointues, rondes, à pinceaux, absentes. La taille, toujours « par rapport à son corps » : petites, moyennes,
  // grandes — deux tailles voisines ne sont jamais proposées ensemble (« moyennes » n'a donc jamais de piège : pas posée).
  questionPortrait({ champ: "oreilles_forme", onglets: ["Mammiferes"], libelle: "Oreilles",
    question: "Quelle forme ont ses oreilles ?",
    explication: (e, v) => `Ses oreilles : ${minuscule(v)}.` }),
  questionPortrait({ champ: "oreilles_taille", onglets: ["Mammiferes"], libelle: "Taille des oreilles",
    proches: { Petites: ["Moyennes"], Moyennes: ["Petites", "Grandes"], Grandes: ["Moyennes"] },
    question: "Comment sont ses oreilles, par rapport à son corps ?",
    affichageFiche: (e, v) => `${majuscule(v)}, par rapport à son corps`,
    explication: (e, v) => `Ses oreilles : ${minuscule(v)}, par rapport à son corps.` }),

  // -- Oiseaux --
  questionPortrait({ champ: "bec_forme", onglets: ["Oiseaux"], libelle: "Bec",   // étape 311 : « Fin et droit » fusionné dans « Droit et pointu » (décision de l'utilisateur, 27/10)
    question: "Quelle est la forme de son bec ?",
    explication: (e, v) => `Son bec : ${minuscule(v)}.` }),
  questionPortrait({ champ: "bec_couleur", onglets: ["Oiseaux"], libelle: "Couleur du bec", proches: BECS_PROCHES,
    question: "De quelle couleur est son bec ?",
    explication: (e, v) => `Son bec : ${minuscule(v)}.` }),
  questionPortrait({ champ: "ornement_tete", onglets: ["Oiseaux"], libelle: "Sur la tête",
    question: "Que porte-t-il sur la tête ?",
    explication: (e, v) => `Sur la tête, il porte ${({ "Barbe": "une barbe", "Sourcils rouges": "des sourcils rouges", "Collerette": "une collerette",
                                                     "Calotte rouge": "une calotte rouge", "Huppe": "une huppe", "Aigrettes": "des aigrettes",
                                                     "Calotte noire": "une calotte noire", "Calotte jaune": "une calotte jaune", "Sourcil blanc": "un sourcil blanc",
                                                     "Sourcil jaune": "un sourcil jaune", "Masque noir": "un masque noir", "Front blanc": "un front blanc",
                                                     "Bosse noire sur le bec": "une bosse noire sur le bec" })[v] || minuscule(v)}.` }),   // étape R149 : l'article partout
  questionPortrait({ champ: "pattes_aspect", onglets: ["Oiseaux"], libelle: "Pattes",
    question: "Comment sont ses pattes ?",
    explication: (e, v) => `Ses pattes : ${minuscule(v)}.` }),

  // -- Amphibiens --
  questionPortrait({ champ: "peau_texture", onglets: ["Amphibiens"], libelle: "Texture de la peau",
    question: "Quelle est la texture de sa peau ?",
    explication: (e, v) => `Sa peau : ${minuscule(v)}.` }),
  // Oui / Non dans l'Excel : on en fait deux réponses écrites, sans dessin.
  questionPortrait({ champ: "queue_adulte", onglets: ["Amphibiens"], libelle: "Queue de l'adulte", sansImage: true,
    lire: e => !estRenseigne(e.queue_adulte) ? e.queue_adulte : e.queue_adulte === "Oui" ? "garde sa queue" : "n'a plus de queue",
    valeur: e => { const v = valeurPortrait(e, "queue_adulte"); return !estRenseigne(v) ? v : v === "Oui" ? "garde sa queue" : "n'a plus de queue"; },
    question: "Une fois adulte, garde-t-il sa queue ?",
    explication: (e, v) => `Une fois adulte, il ${v}.` }),
  questionPortrait({ champ: "ventre_couleur", onglets: ["Amphibiens"], libelle: "Ventre",
    question: "De quelle couleur est son ventre ?",
    explication: (e, v) => `Son ventre : ${minuscule(v)}.` }),

  // -- Reptiles --
  questionPortrait({ champ: "pattes_nombre", onglets: ["Reptiles"], libelle: "Pattes",
    question: "Combien a-t-il de pattes ?",
    explication: (e, v) => v === "Aucune" ? "Il n'a pas de pattes." : `Il a ${minuscule(v)} pattes.` }),
  questionPortrait({ champ: "silhouette", onglets: ["Reptiles"], libelle: "Silhouette",
    question: "Quelle est sa silhouette ?",
    explication: (e, v) => `Sa silhouette : ${minuscule(v)}.` }),

  // -- Poissons --
  questionPortrait({ champ: "corps_forme", onglets: ["Poissons"], libelle: "Corps",
    question: "Quelle est la forme de son corps ?",
    explication: (e, v) => `Son corps : ${minuscule(v)}.` }),
  questionPortrait({ champ: "nageoires_dos", onglets: ["Poissons"], libelle: "Nageoires du dos",
    question: "Combien a-t-il de nageoires sur le dos ?",
    explication: (e, v) => ({ "Une": "Il a une seule nageoire sur le dos.", "Deux": "Il a deux nageoires sur le dos.",
                              "Une et une grasse": "Il a une nageoire sur le dos, et une petite nageoire grasse près de la queue." })[v] || `Sur le dos : ${minuscule(v)}.` }),
  questionPortrait({ champ: "barbillons", onglets: ["Poissons"], libelle: "Barbillons",
    question: "Combien a-t-il de barbillons ?",
    explication: (e, v) => v === "Un" ? "Il a un seul barbillon." : `Il a ${minuscule(v)} barbillons.` }),

  // -- Insectes --
  questionPortrait({ champ: "ailes_visibles", onglets: ["Insectes"], libelle: "Ailes",
    question: "Que voit-on de ses ailes ?",
    explication: (e, v) => ({ "Quatre": "On voit ses quatre ailes.", "Très courtes": "Ses ailes sont très courtes.",
                              "Aucune": "On ne lui voit pas d'ailes.", "Sous une carapace": "Ses ailes sont cachées sous une carapace." })[v] || `Ses ailes : ${minuscule(v)}.` }),
  questionPortrait({ champ: "antennes_forme", onglets: ["Insectes"], libelle: "Antennes",
    question: "Comment sont ses antennes ?",
    explication: (e, v) => `Ses antennes : ${minuscule(v)}.` }),
  questionPortrait({ champ: "ailes_repos", onglets: ["Insectes"], libelle: "Ailes au repos",
    question: "Comment tient-il ses ailes au repos ?",
    explication: (e, v) => `Au repos, ses ailes sont ${minuscule(v)}.` }),

  // ================= Niveaux 2 et 3 (étape 68) =================
  // -- Mammifères --
  // Étape 274 (« Revoir 4 » : court / mi-long / long, pas évident) : deux longueurs seulement dans le jeu, « Court » et « Long » ;
  // la valeur « Mi-long » des classeurs est lue « Long » (les classeurs ne changent pas). « Piquants » reste pour le hérisson.
  questionPortrait({ champ: "poil_longueur", onglets: ["Mammiferes"], niveau: 2, libelle: "Poil",
    lire: e => poilDeuxLongueurs(e.poil_longueur),
    valeur: e => poilDeuxLongueurs(valeurPortrait(e, "poil_longueur")),
    question: "Comment est son poil ?",
    explication: (e, v) => v === "Piquants" ? "Son poil forme des piquants." : `Son poil : ${minuscule(v)}.` }),
  // -- Mammifères et oiseaux : la même question, les mauvaises réponses restent dans la famille --
  questionPortrait({ champ: "difference_male_femelle", onglets: ["Mammiferes", "Oiseaux"], niveau: 2, avecPhoto: true, libelle: "Mâle et femelle",
    pieges: piegesSexes,
    question: "Comment distinguer le mâle de la femelle ?",
    explication: (e, v) => ({ "Aucune visible": "Le mâle et la femelle se ressemblent.", "Taille": "Le mâle est plus grand que la femelle.",
                              "Bois chez le mâle": "Seul le mâle porte des bois.", "Cornes plus grandes": "Le mâle a des cornes plus grandes que la femelle.",
                              "Cornes chez le mâle": "Seul le mâle porte des cornes.", "Femelle plus grande": "La femelle est plus grande que le mâle.",
                              "Mâle plus coloré": "Le mâle est plus coloré que la femelle.", "Plumage différent": "Le mâle et la femelle n'ont pas le même plumage." })[v] || `Mâle et femelle : ${minuscule(v)}.` }),
  // -- Oiseaux --
  // Les yeux : 19 oiseaux sur 27 ont les yeux bruns. On ne pose la question que pour les autres.
  questionPortrait({ champ: "yeux_couleur", onglets: ["Oiseaux"], niveau: 2, avecPhoto: true, libelle: "Yeux",
    valeur: e => { const v = valeurPortrait(e, "yeux_couleur"); return v === "Brun" ? "NA" : v; },
    proches: YEUX_PROCHES,
    // Étape R134 (05/11, pigeon ramier : « Jaune et noir ») : toute pupille est noire, donc pour un œil clair,
    // « Noir » (et « Brun », trop proche sur une photo) serait une mauvaise réponse à moitié vraie : jamais en piège.
    // La question précise qu'on parle du cercle autour de la pupille (même texte pour tous les oiseaux).
    pieges: e => piegesPortrait(e, e.yeux_couleur, x => x.yeux_couleur,
      YEUX_PROCHES,
      e.yeux_couleur === "Noir" ? [] : ["Noir", "Brun"]),
    question: "De quelle couleur sont ses yeux (le cercle autour de la pupille) ?",
    explication: (e, v) => v === "Noir" ? "Ses yeux paraissent tout noirs." : `Ses yeux : ${minuscule(v)}, autour d'une pupille noire.` }),
  // Les doigts : presque tous les oiseaux en ont 3 devant et 1 derrière. Question seulement pour les autres.
  questionPortrait({ champ: "doigts_disposition", onglets: ["Oiseaux"], niveau: 3, avecPhoto: true, libelle: "Doigts",
    valeur: e => { const v = valeurPortrait(e, "doigts_disposition"); return v === "3 devant, 1 derrière" ? "NA" : v; },
    question: "Comment sont disposés ses doigts ?",
    explication: (e, v) => `Ses doigts : ${minuscule(v)}.` }),
  // -- Amphibiens --
  questionPortrait({ champ: "pattes_arriere", onglets: ["Amphibiens"], niveau: 2, libelle: "Pattes arrière",
    question: "Ses pattes arrière sont-elles palmées ?",
    explication: (e, v) => v === "Palmées" ? "Ses pattes arrière sont palmées." : "Ses pattes arrière ne sont pas palmées." }),
  // -- Amphibiens et reptiles --
  questionPortrait({ champ: "pupille_forme", onglets: ["Amphibiens", "Reptiles"], niveau: 2, avecPhoto: true, libelle: "Pupille",
    question: "Quelle est la forme de sa pupille ?",
    explication: (e, v) => `Sa pupille : ${({ "Ronde": "ronde", "Horizontale": "horizontale", "En cœur": "en forme de cœur", "Fente verticale": "en fente verticale" })[v] || minuscule(v)}.` }),
  // -- Reptiles --
  questionPortrait({ champ: "museau_forme", onglets: ["Reptiles"], niveau: 2, libelle: "Museau",
    question: "Comment est son museau ?",
    explication: (e, v) => `Son museau : ${minuscule(v)}.` }),
  questionPortrait({ champ: "paupieres", onglets: ["Reptiles"], niveau: 2, avecPhoto: true, libelle: "Paupières",
    question: "Comment sont ses paupières ?",
    explication: (e, v) => v === "Absentes" ? "Il n'a pas de paupières : il ne cligne jamais des yeux." : "Il a des paupières : il peut cligner des yeux." }),
  questionPortrait({ champ: "tete_ecailles", onglets: ["Reptiles"], niveau: 3, avecPhoto: true, libelle: "Écailles de la tête",
    question: "Comment est le dessus de sa tête ?",
    explication: (e, v) => `Sur la tête, il a de ${minuscule(v)}.` }),
  questionPortrait({ champ: "ecailles_corps", onglets: ["Reptiles"], niveau: 3, avecPhoto: true, libelle: "Écailles",
    question: "Comment sont les écailles de son corps ?",
    explication: (e, v) => v === "Lisses" ? "Ses écailles sont lisses." : "Ses écailles portent une arête au milieu." }),
  // -- Poissons --
  // "champ" et "colonne" diffèrent : la colonne queue_forme existe aussi chez les mammifères.
  questionPortrait({ champ: "queue_poisson", colonne: "queue_forme", onglets: ["Poissons"], niveau: 2, libelle: "Queue",
    question: "Quelle forme a sa queue ?",
    explication: (e, v) => `Sa queue : ${minuscule(v)}.` }),
  questionPortrait({ champ: "bouche_position", onglets: ["Poissons"], niveau: 2, libelle: "Bouche",
    question: "Où s'ouvre sa bouche ?",
    explication: (e, v) => v === "Au bout" ? "Sa bouche s'ouvre au bout du museau." : "Sa bouche s'ouvre vers le bas." }),
  questionPortrait({ champ: "ecailles_taille", onglets: ["Poissons"], niveau: 3, avecPhoto: true, libelle: "Écailles",
    question: "Comment sont ses écailles ?",
    explication: (e, v) => ({ "Petites": "Ses écailles sont petites.", "Grandes": "Ses écailles sont grandes.", "Invisibles": "Ses écailles ne se voient pas." })[v] || `Ses écailles : ${minuscule(v)}.` }),
  // -- Insectes --
  questionPortrait({ champ: "bouche_type", onglets: ["Insectes"], niveau: 2, libelle: "Bouche",
    question: "Avec quoi se nourrit-il ?",
    explication: (e, v) => ({ "Trompe": "Il aspire sa nourriture avec une trompe.", "Mandibules": "Il broie sa nourriture avec des mandibules.",
                              "Langue": "Il lèche sa nourriture avec une langue.", "Aucune": "Une fois adulte, il ne se nourrit plus." })[v] || `Sa bouche : ${minuscule(v)}.` }),
  // -- Une question chiffrée, sans dessin : elle suit le format "estimation" des autres nombres --
  { champ: "nb_dents", niveau: 3, libelle: "Dents", type: "nombre", pas: 2, plafond: 50,
    valeur: e => e.onglet === "Mammiferes" ? valeurPortrait(e, "nb_dents") : "NA",
    question: "Combien de dents a-t-il ?",
    affichage: v => `${nombre(v)} dents`,
    explication: (e, v) => `Il a ${nombre(v)} dents.` },
];

// Étape 227 : vrai le temps d'un seul calcul au chargement, pour noter les médailles déjà gagnées avec les
// règles d'avant (voir charger(), partie 2 bis) : ainsi aucune médaille ne recule.
let REGLES_AVANT_227 = false;

// ---- Étape R166 (Revoir 13) : les saisons et les noms de groupe ----
// Les saisons couvertes par une réponse : « Du printemps à l'automne » = printemps, été, automne ; « Fin d'hiver et printemps »
// = hiver, printemps… Une saison en commun = la mauvaise réponse serait à moitié vraie : jamais proposée.
const ORDRE_SAISONS = ["hiver", "printemps", "été", "automne"];
function saisonsCouvertes(v) {
  v = String(v || "").toLowerCase().replace(/fin d'hiver/g, "hiver").replace(/^(en|au) /, "");
  if (v === "toute l'année") return ORDRE_SAISONS.slice();
  const m = v.match(/^de (?:l'|la |le )?(hiver|printemps|été|automne) (?:à l'|au |à la )?(hiver|printemps|été|automne)$/)
         || v.match(/^du (hiver|printemps|été|automne) (?:à l'|au )(hiver|printemps|été|automne)$/);
  if (m) { const l = []; let i = ORDRE_SAISONS.indexOf(m[1]); for (;;) { l.push(ORDRE_SAISONS[i]); if (ORDRE_SAISONS[i] === m[2]) break; i = (i + 1) % 4; } return l; }
  return v.split(/ et |, /).map(x => x.trim()).filter(x => ORDRE_SAISONS.includes(x));
}
function sansSaisonCommune(e, colonne) {
  const siennes = saisonsCouvertes(e[colonne]);
  return autresDeLaListe(e, colonne).filter(v => v !== "NA" && !saisonsCouvertes(v).some(x => siennes.includes(x)));
}
// « Printemps et été » → « au printemps et en été » ; « Fin d'hiver et printemps » → « à la fin de l'hiver et au printemps »
// Étape R184 : chez les mammifères, la saison de reproduction de la fiche est celle des accouplements
function accouplementSeul(e) { return !!e && e.onglet === "Mammiferes"; }
function saisonEnPhrase(v) {
  const t = minuscule(v);
  if (/^(toute|du |de |en |au )/.test(t)) return t;
  const une = s => s === "printemps" ? "au printemps" : s === "fin d'hiver" ? "à la fin de l'hiver" : ORDRE_SAISONS.includes(s) ? "en " + s : s;
  return t.split(" et ").map(s => une(s.trim())).join(" et ");
}
// Les noms de groupe propres à peu d'espèces (les autres se disent de beaucoup d'animaux)
const GROUPES_GENERIQUES = ["bande", "troupe", "colonie", "banc", "volée", "groupe", "récif", "troupeau"];
function groupePrecis(v) { return estRenseigne(v) && !String(v).startsWith("NA") && !GROUPES_GENERIQUES.includes(String(v).trim().toLowerCase()); }

const QUESTIONS = [
  { champ: "regime_alimentaire_type", pictos: true, niveau: 1, libelle: "Régime",
    question: "Quel est son régime alimentaire ?",
    affirmation: v => `Son régime alimentaire : ${v}.`,
    inverse: v => `Lequel est ${v} ?`,
    explication: e => `Son régime : ${e.regime_alimentaire_type}.` },

  // Étape R166 (Revoir 13) : comme pour le petit, la question n'est posée que si le groupe a un nom propre à peu d'espèces
  // (harde, compagnie, meute, clan). « Bande », « troupe », « colonie », « banc », « volée » se disent de beaucoup d'animaux :
  // « Lequel vit en groupe appelé bande ? » avait plusieurs bonnes réponses (mésange, mais aussi pigeon ramier…).
  { champ: "nom_groupe", niveau: 3, libelle: "Groupe", accepter: v => groupePrecis(v),
    question: "Comment appelle-t-on un groupe de cette espèce ?",
    affirmation: v => `Un groupe de cette espèce s'appelle : ${v.toLowerCase()}.`,
    inverse: v => `Lequel vit en groupe appelé « ${v.toLowerCase()} » ?`,
    explication: e => `Un groupe s'appelle : ${e.nom_groupe.toLowerCase()}.` },

  // Étape 227 (20/10) : la question n'est posée que si le petit a un nom propre à l'espèce (marcassin, levraut,
  // aiglon…). « Poussin », « oisillon », « têtard » ou « larve » se disent de presque tous : sans intérêt (retour du 20/10).
  // Ces noms génériques ne servent pas non plus de mauvaise réponse.
  { champ: "nom_petit", pasDansLeNom: true, niveau: 1, libelle: "Petit",
    accepter: v => REGLES_AVANT_227 || !/^(poussin|oisillon|têtard|larve)\b/i.test(String(v).trim()),
    question: "Comment s'appelle son petit ?",
    affirmation: v => `Son petit s'appelle : ${v.toLowerCase()}.`,
    inverse: v => `Lequel a pour petit : « ${v.toLowerCase()} » ?`,
    explication: e => `Son petit s'appelle : ${e.nom_petit.toLowerCase()}.` },

  // Étape 275 (« Revoir 5 ») : plus de vrai / faux (« Pour son cri, on dit qu'il crie » : bancal) ; « crie » n'est ni
  // une réponse ni une mauvaise réponse (il se dit de tous) ; « siffle » n'est plus une mauvaise réponse (JAMAIS_PIEGES).
  { champ: "verbe_cri", pasDansLeNom: true, niveau: 1, libelle: "Cri", formats: ["qcm", "photos"],
    accepter: v => String(v).trim().toLowerCase() !== "crie",
    question: "Quel est son cri ? On dit qu'il…",
    affirmation: v => `Pour son cri, on dit qu'il ${v.toLowerCase()}.`,
    inverse: v => `Lequel ${v.toLowerCase()} ?`,
    explication: e => `On dit qu'il ${e.verbe_cri.toLowerCase()}.` },

  { champ: "longevite_max_annees", niveau: 3, libelle: "Longévité", type: "nombre",
    question: "Jusqu'à quel âge peut-il vivre ?",
    affichage: v => `${nombre(v)} an${v > 1 ? "s" : ""}`,
    explication: (e, v) => `Il peut vivre jusqu'à ${nombre(v)} an${v > 1 ? "s" : ""}.` },

  // ---- Ajoutées à l'étape 10 ------------------------------------
  // Étape 148 : les listes d'aliments et de prédateurs du tableur ne citent que les principaux. Dans la nature,
  // presque tous les insectes sont mangés par des oiseaux, presque tous les herbivores broutent des graminées…
  // « Lequel a pour prédateurs… ? » (4 photos) ou un vrai / faux demandaient une réponse exclusive : souvent
  // plusieurs étaient vraies. On ne garde que le QCM « Que mange-t-il ? / Qui sont ses prédateurs ? » :
  // on y choisit la liste qui lui correspond le mieux.
  // Étape 227 (20/10, retour « réponses trop longues ») : quand la case proies_items (ou predateurs_items) est remplie,
  // on demande UN aliment (« Lequel de ces aliments mange-t-il ? ») ou UN prédateur, avec des réponses courtes.
  // Les mauvaises réponses restent dans son monde (même milieu, même genre de nourriture) sans jamais être à moitié
  // vraies : voir piegesAliment et piegesPredateur (partie 3 bis). Sinon, l'ancienne question sur la liste entière.
  // La fiche et « Votre fiche » montrent toujours la liste complète ; l'explication aussi.
  { champ: "proies", niveau: 2, libelle: "Alimentation", formats: ["qcm"],   // étape 148 : ni « Lequel… ? » ni vrai / faux (voir plus bas)
    question: e => modeItems(e, "proies") ? "Lequel de ces aliments mange-t-il ?" : "Que mange-t-il ?",
    tirer: e => modeItems(e, "proies") ? itemAuHasard(e, "proies") : e.proies,
    affichageFiche: e => majuscule(e.proies),
    affirmation: v => `Il se nourrit de : ${minuscule(v)}.`,
    inverse: v => `Lequel se nourrit de : ${minuscule(v)} ?`,
    explication: (e, v) => `Il se nourrit de : ${minuscule(e.proies)}.` },

  { champ: "predateurs", niveau: 2, libelle: "Prédateurs", formats: ["qcm"],   // étape 148 : ni « Lequel… ? » ni vrai / faux (voir plus bas)
    question: e => modeItems(e, "predateurs") ? "Lequel de ces animaux est un de ses prédateurs ?" : "Qui sont ses prédateurs ?",
    tirer: e => modeItems(e, "predateurs") ? itemAuHasard(e, "predateurs") : e.predateurs,
    affichageFiche: e => majuscule(e.predateurs),
    affirmation: v => `Ses prédateurs : ${minuscule(v)}.`,
    inverse: v => `Lequel a pour prédateurs : ${minuscule(v)} ?`,
    explication: (e, v) => `Ses prédateurs : ${minuscule(e.predateurs)}.` },

  // Le milieu de vie (étape 21). La bonne réponse est la colonne milieu_principal.
  // "pieges" : au lieu de piocher chez les autres espèces, on fournit soi-même les
  // mauvaises réponses possibles = tous les milieux de la liste, SAUF ceux où
  // l'espèce vit (le principal et les secondaires). Aucun piège n'est donc "un peu vrai".
  { champ: "milieu_principal", pictos: true, niveau: 1, libelle: "Milieu", formats: ["qcm", "vraifaux"],
    question: "Où vit-il le plus souvent ?",
    affirmation: v => `Il vit le plus souvent ici : ${minuscule(v)}.`,
    pieges: e => {
      const lesSiens = milieuxATeviter(e);              // les siens ET leurs voisins (étape 77)
      // Poissons (étape 31) : proposer une forêt ou un alpage n'a aucun sens. Les mauvaises
      // réponses sont donc toutes des milieux AQUATIQUES (liste MILIEUX_AQUATIQUES, juste au-dessus).
      if (e.onglet === "Poissons") return MILIEUX_AQUATIQUES.filter(milieu => !lesSiens.includes(milieu)
        && !(milieu === "Eaux souterraines" && ["Mer et océan", "Estuaires et lagunes"].includes(e.milieu_principal)));   // étape R151
      const tous = [...new Set(ESPECES.map(autre => autre.milieu_principal).filter(estRenseigne))];
      // Étape R151 : un animal de la mer ou des estuaires (sauf les oiseaux, qui volent d'un milieu à l'autre) a des pièges
      // dans l'eau, pas dans la campagne (avant : « Il vit le plus souvent ici : campagne, haies et jardins » pour la patelle)
      if (["Mer et océan", "Estuaires et lagunes"].includes(e.milieu_principal) && e.onglet !== "Oiseaux")
        return MILIEUX_AQUATIQUES.filter(milieu => milieu !== "Eaux souterraines" && !lesSiens.includes(milieu));
      const vitDansLEau = EAUX_DOUCES.includes(e.milieu_principal);
      // Animal TERRESTRE (étape 32) : jamais de rivière ni de lac parmi les mauvaises réponses,
      // seulement d'autres milieux terrestres ("un renard dans un torrent" se devinait trop bien).
      if (!vitDansLEau) return tous.filter(milieu => !EAUX_DOUCES.includes(milieu) && !lesSiens.includes(milieu));
      // Mammifère qui vit dans l'eau (la loutre) : seulement d'autres milieux aquatiques.
      // On écarte les estuaires, où la loutre peut réellement vivre.
      if (e.onglet === "Mammiferes") return MILIEUX_AQUATIQUES.filter(milieu => milieu !== "Estuaires et lagunes" && !lesSiens.includes(milieu));
      // Amphibiens et libellule : ils vivent à la fois dans l'eau et sur terre, on garde tous les milieux.
      return tous.filter(milieu => !lesSiens.includes(milieu));
    },
    explication: (e, v) => `Il vit le plus souvent ici : ${minuscule(v)}.` },

  // Les particularités (étape 22). Dans l'Excel, la case en contient plusieurs,
  // séparées par " ; " et écrites avec leur article ("des pattes emplumées").
  //   "separateur" : indique que la case est une liste, et comment la découper
  //   "tirer"      : on n'interroge que sur UNE particularité, tirée au hasard,
  //                  de préférence une qui est propre à l'espèce
  //   "pieges"     : les mauvaises réponses = des particularités propres à
  //                  d'autres espèces, et qui ne ressemblent à aucune des siennes
  //   "affichage"  : dans l'encyclopédie, on montre toute la liste, avec des virgules
  // (Étape 119 : la question sur les particularités — colonne adaptations_physiques — est retirée :
  //  le portrait physique, en listes fermées, la remplace. La colonne reste dans le tableur.)

  // "accepter" : on ne pose la question que si la valeur passe ce test.
  // Ici : pas de question quand le mot est générique (terrier, nid, gîte…),
  // seulement quand il est propre à l'espèce (catiche, taissonnière, hotte, aire…).
  { champ: "nom_logis", pasDansLeNom: true, niveau: 3, libelle: "Abri",
    accepter: v => !/^(terrier|nid|gîte|tanière|sous pierres|abri|fissure)/i.test(v),
    question: "Comment s'appelle son abri ?",
    affirmation: v => `Son abri s'appelle : ${minuscule(v)}.`,
    inverse: v => `Lequel a pour abri : ${minuscule(v)} ?`,
    explication: (e, v) => `Son abri : ${minuscule(v)}.` },

  // "ignorer" : valeurs sur lesquelles on ne pose pas de question.
  // "formats" : limite les formats autorisés. Ici, seulement le QCM
  // (pas de vrai/faux ni de choix parmi 4 photos pour le risque d'extinction).
  { champ: "statut_conservation", pictos: true, niveau: 2, libelle: "Niveau d'extinction",
    ignorer: ["Non évalué", "Données insuffisantes", "Non applicable", "NA"], formats: ["qcm"],   // étape 193 : « Données insuffisantes » n'est pas un niveau de menace
    question: "Quel est son niveau d'extinction ?",
    explication: (e, v) => `Son niveau d'extinction : ${minuscule(v)}.` },

  // Étape 135 : "fourchette" = du plus petit au plus grand chiffre connu pour l'espèce (mâles et femelles
  // compris). Les mauvaises réponses sont choisies EN DEHORS de cette fourchette : proposer « 175 kg »
  // pour un cerf qui pèse « jusqu'à 250 kg » serait injuste, beaucoup de cerfs pèsent 175 kg.
  // "valeur" : quand l'information n'est pas dans une seule colonne.
  // La taille est dans taille_max_cm_male (mammifères) ou taille_max_cm (les autres).
  { champ: "taille_max_cm", niveau: 1, libelle: "Taille", type: "nombre",
    valeur: e => estRenseigne(e.taille_max_cm_male) ? e.taille_max_cm_male : e.taille_max_cm,
    fourchette: e => fourchetteDe(e, ["taille_min_cm_male", "taille_min_cm_femelle", "taille_min_cm"], ["taille_max_cm_male", "taille_max_cm_femelle", "taille_max_cm"]),
    // Étape 30 : la question, l'explication et la fiche précisent TOUJOURS ce qui est mesuré
    // (hauteur au garrot, longueur sans la queue…) : voir MESURES_TAILLE juste au-dessus.
    question: e => mesureTaille(e).question,
    affichage: v => `${nombre(v)} cm`,
    affichageFiche: (e, v) => `${nombre(v)} cm ${mesureTaille(e).fiche}`,
    explication: (e, v) => mesureTaille(e).explication(nombre(v)) },

  // ---- Ajoutées à l'étape 23 ------------------------------------
  // Rappels utiles pour lire ce qui suit :
  //   "valeur"   : où lire l'information quand ce n'est pas simplement la colonne "champ" ;
  //                si elle rend "NA", la question n'est pas posée pour cette espèce
  //   "question" : peut être une phrase fixe, ou une formule e => … qui choisit la phrase selon l'espèce
  //   "pas" / "plafond" (questions chiffrées) : les mauvaises réponses sont arrondies
  //                à un multiple de "pas" et ne dépassent jamais "plafond"

  // Le poids : colonne poids_max_kg_male (mammifères, oiseaux) ou poids_max_kg (les autres).
  // En dessous de 1 kg, on l'affiche en grammes.
  { champ: "poids_max_kg", niveau: 2, libelle: "Poids", type: "nombre",
    valeur: e => estRenseigne(e.poids_max_kg_male) ? e.poids_max_kg_male : e.poids_max_kg,
    fourchette: e => fourchetteDe(e, ["poids_min_kg_male", "poids_min_kg_femelle", "poids_min_kg"], ["poids_max_kg_male", "poids_max_kg_femelle", "poids_max_kg"]),
    question: "Quel poids peut-il atteindre ?",
    affichage: v => v < 1 ? `${nombre(Math.round(v * 10000) / 10)} g` : `${nombre(v)} kg`,
    explication: (e, v) => `Il peut peser jusqu'à ${v < 1 ? nombre(Math.round(v * 10000) / 10) + " g" : nombre(v) + " kg"}.` },

  // Le nombre de petits : seulement pour les mammifères (petits par portée) et les
  // oiseaux (œufs par couvée). Pour les autres familles, les chiffres de l'Excel
  // ne sont pas encore homogènes (œufs par ponte, par kilo…).
  { champ: "nb_petits_max", niveau: 3, libelle: "Petits ou œufs", type: "nombre",
    valeur: e => e.onglet === "Mammiferes" || e.onglet === "Oiseaux" ? e.nb_petits_max : "NA",
    fourchette: e => fourchetteDe(e, ["nb_petits_min"], ["nb_petits_max"]),
    question: e => e.onglet === "Oiseaux" ? "Combien d'œufs y a-t-il dans une couvée, au maximum ?"
                                          : "Combien de petits naissent par portée, au maximum ?",
    affichage: v => nombre(v),
    explication: (e, v) => e.onglet === "Oiseaux" ? `Une couvée compte jusqu'à ${nombre(v)} œuf${v > 1 ? "s" : ""}.`
                                                  : `Une portée compte jusqu'à ${nombre(v)} petit${v > 1 ? "s" : ""}.` },

  { champ: "gestation_jours", niveau: 3, libelle: "Gestation", type: "nombre", plafond: 700,
    question: "Combien de temps dure la gestation ?",
    affichage: v => `${nombre(v)} jours`,
    explication: (e, v) => `La gestation dure environ ${nombre(v)} jours.` },

  { champ: "incubation_jours", niveau: 3, libelle: "Incubation", type: "nombre", plafond: 120,
    question: "Combien de temps les œufs mettent-ils à éclore ?",
    affichage: v => `${nombre(v)} jours`,
    explication: (e, v) => `Les œufs éclosent au bout d'environ ${nombre(v)} jours.` },

  { champ: "envergure_max_cm", niveau: 3, libelle: "Envergure", type: "nombre", plafond: 450,
    fourchette: e => fourchetteDe(e, ["envergure_min_cm"], ["envergure_max_cm"]),
    question: "Quelle envergure peut-il atteindre, ailes déployées ?",
    affichage: v => `${nombre(v)} cm`,
    explication: (e, v) => `Ailes déployées, il peut mesurer jusqu'à ${nombre(v)} cm.` },

  // Étape 119 : la vitesse maximale (tableur V36). Seulement les mammifères (à la course) et les oiseaux
  // (en vol normal, sans le piqué) : les autres familles n'ont pas de chiffre fiable.
  { champ: "vitesse_max_kmh", niveau: 3, libelle: "Vitesse", type: "nombre", pas: 5, plafond: 150,
    valeur: e => e.onglet === "Mammiferes" || e.onglet === "Oiseaux" ? e.vitesse_max_kmh : "NA",
    question: e => e.onglet === "Oiseaux" ? "À quelle vitesse peut-il voler, au maximum ?" : "À quelle vitesse peut-il courir, au maximum ?",
    affichage: v => `${nombre(v)} km/h`,
    explication: (e, v) => e.onglet === "Oiseaux" ? `En vol, il peut atteindre ${nombre(v)} km/h.` : `À la course, il peut atteindre ${nombre(v)} km/h.` },

  // L'altitude : on l'arrondit à la centaine, pour que la bonne réponse ne se repère pas à ses chiffres.
  { champ: "altitude_max_m", niveau: 3, libelle: "Altitude", type: "nombre", pas: 100, plafond: 4800,
    valeur: e => typeof e.altitude_max_m === "number" ? Math.round(e.altitude_max_m / 100) * 100 : e.altitude_max_m,
    fourchette: e => fourchetteDe(e, ["altitude_min_m"], ["altitude_max_m"]),
    question: "À quelle altitude maximale peut-on l'observer ?",
    affichage: v => `${nombre(v)} m`,
    explication: (e, v) => `On peut l'observer jusqu'à environ ${nombre(v)} m d'altitude.` },

  // Deux questions à deux réponses possibles : on fournit l'autre réponse comme piège.
  // Seulement en QCM : en vrai / faux, une phrase négative ("il n'hiberne pas : vrai ou faux ?") embrouille.
  { champ: "venimeux", pictos: true, niveau: 1, libelle: "Venin", formats: ["qcm"],
    valeur: e => !estRenseigne(e.venimeux) ? e.venimeux : String(e.venimeux).startsWith("Oui") ? "venimeux" : "sans venin",
    question: "Est-il venimeux ?",
    pieges: e => [String(e.venimeux).startsWith("Oui") ? "sans venin" : "venimeux"],
    explication: (e, v) => `Ce reptile est ${v}.` },

  { champ: "hibernation", pictos: true, niveau: 1, libelle: "Hiver", formats: ["qcm"],
    valeur: e => !estRenseigne(e.hibernation) ? e.hibernation : String(e.hibernation).startsWith("Oui") ? "hiberne" : "n'hiberne pas",
    question: "Hiberne-t-il en hiver ?",
    pieges: e => [String(e.hibernation).startsWith("Oui") ? "n'hiberne pas" : "hiberne"],
    explication: (e, v) => `En hiver, il ${v}.` },

  // Le nom de la femelle : seulement quand c'est un vrai mot à connaître (étagne, chèvre,
  // biche, chevrette). On écarte "Marmotte (femelle)" et les noms qui se devinent
  // tout seuls à partir du nom de l'espèce (renarde, louve, blairelle).
  { champ: "nom_femelle", niveau: 3, libelle: "Femelle", formats: ["qcm", "vraifaux"],
    accepter: v => !/femelle|renarde|louve|blairelle/i.test(v),
    question: "Comment appelle-t-on la femelle ?",
    affirmation: v => `La femelle s'appelle : ${v.toLowerCase()}.`,
    explication: (e, v) => `La femelle s'appelle : ${v.toLowerCase()}.` },

  // ---- Ajoutées à l'étape 24 (colonnes à liste fermée du tableur V16) ----
  // Pour toutes ces questions, les mauvaises réponses sont simplement les AUTRES
  // valeurs de la même colonne : c'est l'outil autresDeLaListe (partie 3) qui les fournit.
  // Quand une colonne "secondaires" existe, ses valeurs ne sont jamais proposées comme piège.
  // La défense : on ne pose la question que si elle est remarquable. "Fuite" concernait
  // 16 espèces sur 44 : la question devenait répétitive. Elle n'est donc ni interrogée
  // ("accepter") ni proposée parmi les mauvaises réponses.
  { champ: "defense_principale", pictos: true, niveau: 2, libelle: "Défense", formats: ["qcm", "vraifaux"],
    accepter: v => v !== "Fuite",
    question: "Quelle est sa principale défense ?",
    affirmation: v => `Sa principale défense : ${minuscule(v)}.`,
    pieges: e => autresDeLaListe(e, "defense_principale", "defenses_secondaires").filter(v => v !== "Fuite"),
    explication: (e, v) => `Sa principale défense : ${minuscule(v)}.` },

  { champ: "chasse_principale", pictos: true, niveau: 2, libelle: "Chasse", formats: ["qcm", "vraifaux"],
    question: "Comment chasse-t-il le plus souvent ?",
    affirmation: v => `Sa façon de chasser : ${minuscule(v)}.`,
    pieges: e => autresDeLaListe(e, "chasse_principale", "chasses_secondaires"),
    explication: (e, v) => `Sa façon de chasser : ${minuscule(v)}.` },

  // L'indice de présence : les pièges viennent d'espèces d'une AUTRE famille
  // (un indice de reptile pour un oiseau…), pour qu'aucun ne soit "un peu vrai".
  { champ: "indice_presence", pictos: true, niveau: 2, libelle: "Indice", formats: ["qcm", "vraifaux"],
    question: "Quel indice trahit sa présence ?",
    affirmation: v => `Un indice de sa présence : ${minuscule(v)}.`,
    pieges: e => [...new Set(ESPECES.filter(a => a.onglet !== e.onglet && estRenseigne(a.indice_presence)).map(a => a.indice_presence))]
                   .filter(v => v !== e.indice_presence),
    explication: (e, v) => `Un indice de sa présence : ${minuscule(v)}.` },

  // (La question sur les empreintes a été retirée : elle sera recréée plus tard à partir
  //  d'une banque d'images. La colonne "empreinte" du tableur n'est donc plus interrogée.)

  // Étape 71 : "Toute l'année" n'apprend rien (54 espèces sur 100). La question n'est donc posée
  // que pour les autres ("ignorer"), et "Toute l'année" n'est jamais proposée comme mauvaise réponse.
  { champ: "saison_observation", pictos: true, niveau: 2, libelle: "Période de l'année", formats: ["qcm", "vraifaux"],
    ignorer: ["Toute l'année"],
    question: "À quelle période de l'année peut-on le croiser ?",
    affirmation: v => `On peut le croiser ${minuscule(v)}.`,                          // étape R166 (avant : « croiser : en été »)
    // Étape R166 : vrai / faux, « Laquelle des deux ? » et photos — jamais une période qui a une saison en commun
    // (« On peut le croiser en été » n'est plus « faux » pour le hérisson, qu'on croise du printemps à l'automne).
    pieges: e => sansSaisonCommune(e, "saison_observation").filter(v => v !== "Toute l'année"),
    // QCM (« À quelle période… ? », la bonne période est parmi les réponses) : une période qui annonce au moins une saison
    // où on ne le croise pas (« Toute l'année » pour le hérisson) ; jamais une partie de la bonne (« En été »).
    piegesQcm: e => { const siennes = saisonsCouvertes(e.saison_observation);
      return autresDeLaListe(e, "saison_observation").filter(v => v !== "NA" && saisonsCouvertes(v).some(x => !siennes.includes(x))); },
    explication: (e, v) => `On peut le croiser ${minuscule(v)}.` },

  // La période de la journée. Deux réponses rares existent ("De jour comme de nuit", "À l'aube et
  // au crépuscule") : elles ne servent jamais de mauvaise réponse, car elles seraient à moitié vraies.
  { champ: "activite", pictos: true, niveau: 1, libelle: "Période de la journée", formats: ["qcm"],
    question: "À quel moment de la journée est-il le plus actif ?",
    pieges: e => ["Surtout la nuit", "Surtout le jour"].filter(v => v !== e.activite),
    explication: (e, v) => `Il est actif ${minuscule(v)}.` },

  // (Étape 71 : la question sur le revêtement — plumes, poils, écailles… — est retirée : la réponse
  //  était la même pour toute une famille. Le portrait physique dit mieux à quoi ressemble l'animal.)

  { champ: "emplacement_nid", pictos: true, niveau: 2, libelle: "Nid", formats: ["qcm", "vraifaux"],
    question: "Où fait-il son nid ?",
    affirmation: v => `Il fait son nid ici : ${minuscule(v)}.`,
    pieges: e => autresDeLaListe(e, "emplacement_nid"),
    explication: (e, v) => `Il fait son nid ici : ${minuscule(v)}.` },

  { champ: "naissance", pictos: true, niveau: 1, libelle: "Naissance", formats: ["qcm"],
    question: "Que fait la femelle pour se reproduire ?",
    pieges: e => autresDeLaListe(e, "naissance"),
    explication: (e, v) => `La femelle ${minuscule(v)}.` },

  { champ: "cornes_ou_bois", pictos: true, niveau: 1, libelle: "Cornes ou bois", formats: ["qcm"],
    question: "Que porte-t-il sur la tête ?",
    pieges: e => autresDeLaListe(e, "cornes_ou_bois"),
    explication: (e, v) => `Il porte ${minuscule(v)}.` },

  { champ: "pelage_hiver", pictos: true, niveau: 2, libelle: "Pelage d'hiver", formats: ["qcm"],
    question: "Que fait son pelage en hiver ?",
    pieges: e => autresDeLaListe(e, "pelage_hiver"),
    explication: (e, v) => `En hiver, son pelage ${minuscule(v)}.` },

  { champ: "deplacement_saisonnier", pictos: true, niveau: 2, libelle: "Déplacements", formats: ["qcm"],
    question: "Que fait-il au fil des saisons ?",
    pieges: e => autresDeLaListe(e, "deplacement_saisonnier"),
    explication: (e, v) => `Il ${minuscule(v)}.` },   // étape R149 (avant : « Au fil des saisons, il migre selon la saison »)

  { champ: "saison_frai", pictos: true, niveau: 3, libelle: "Frai", formats: ["qcm", "vraifaux"],
    question: "À quelle saison pond-il ses œufs ?",
    affirmation: v => `Il pond ses œufs ${saisonEnPhrase(v)}.`,                     // étape R166 (avant : « à cette saison : … »)
    pieges: e => sansSaisonCommune(e, "saison_frai"),                               // étape R166 : jamais une saison en commun
    explication: (e, v) => `Il pond ses œufs ${saisonEnPhrase(v)}.` },

  // ---- Ajoutées à l'étape 120 (tableur V36) : œufs, métamorphose, plantes, vie de têtard ----
  // Le nombre d'œufs (ou de petits) des poissons, amphibiens, reptiles et insectes : les chiffres vont
  // de 2 à plus de 3 millions, on demande donc un ORDRE DE GRANDEUR, tiré de nb_petits_max.
  { champ: "nb_oeufs_ordre", niveau: 3, libelle: "Œufs ou petits", formats: ["qcm"],
    valeur: e => ["Poissons", "Amphibiens", "Reptiles", "Insectes", "Araignees_mille_pattes", "Crustaces", "Mollusques",
                  "Vers_meduses_compagnie"].includes(e.onglet) && typeof e.nb_petits_max === "number"
                 ? ordreDeGrandeur(e.nb_petits_max) : "NA",
    question: e => metAuMonde(e) ? "Combien de petits peut-elle mettre au monde, à chaque fois ?" : "Combien d'œufs peut-elle pondre, à chaque ponte ?",
    pieges: e => ORDRES_GRANDEUR.filter(v => v !== ordreDeGrandeur(e.nb_petits_max)),
    explication: (e, v) => `Jusqu'à ${nombre(e.nb_petits_max)} ${metAuMonde(e) ? "petits" : "œufs"} : ${minuscule(v)}.` },

  // La métamorphose des insectes : avec une étape immobile (chrysalide, nymphe) ou non, d'après cycle_vie.
  { champ: "metamorphose", niveau: 2, libelle: "Métamorphose", formats: ["qcm"],
    valeur: e => e.onglet === "Insectes" && estRenseigne(e.cycle_vie)
                 ? (/chrysalide|nymphe/i.test(e.cycle_vie) ? METAMORPHOSES[0] : METAMORPHOSES[1]) : "NA",
    question: "Comment devient-il adulte ?",
    pieges: e => METAMORPHOSES.filter(v => v !== valeurDe(e, QUESTIONS.find(q => q.champ === "metamorphose"))),
    explication: (e, v) => `Il devient adulte ${minuscule(v)}.` },

  // Les plantes dont dépend un insecte (plante_hote) : on garde les deux premières, pour une réponse courte.
  { champ: "plantes_liees", niveau: 3, libelle: "Plantes", formats: ["qcm"],
    valeur: e => e.onglet === "Insectes" && estRenseigne(e.plante_hote) ? deuxPremieres(e.plante_hote) : "NA",
    question: "De quelles plantes dépend-il ?",
    pieges: e => [...new Set(ESPECES.filter(a => a !== e && a.onglet === "Insectes" && estRenseigne(a.plante_hote)).map(a => deuxPremieres(a.plante_hote)))],
    explication: (e, v) => `Il dépend de ces plantes : ${minuscule(v)}.` },

  // La durée de la vie de têtard (grenouilles, crapauds) ou de larve (tritons, salamandres), d'après
  // duree_developpement_max_annees. La salamandre noire n'a pas de larve libre : pas de question.
  { champ: "vie_larve", niveau: 3, libelle: "Vie de têtard ou de larve", formats: ["qcm"],
    valeur: e => e.onglet === "Amphibiens" && typeof e.duree_developpement_max_annees === "number" && !metAuMonde(e)
                 ? dureeLarve(e.duree_developpement_max_annees) : "NA",
    question: e => `Combien de temps peut durer sa vie de ${motLarve(e)} ?`,
    pieges: e => DUREES_LARVE.filter(v => v !== dureeLarve(e.duree_developpement_max_annees)),
    explication: (e, v) => `Sa vie de ${motLarve(e)} peut durer jusqu'à ${Math.round(e.duree_developpement_max_annees * 12)} mois.` },

  // Le brame EST le rut du cerf : "Rut" ne doit donc pas être proposé comme piège pour lui.
  // Étape 71 : le NOM n'est demandé que s'il est particulier (brame, essaimage). "Rut", "Frai" et
  // "Parade nuptiale" valent pour toute une famille : ils restent seulement de mauvaises réponses.
  // ---- Étape 121 : les questions des 4 familles d'invertébrés (tableur V43) ----
  // Étape 123 : chaque réponse a son dessin dans le dossier Pictos (même style que les autres).
  // Ces colonnes sont en fin de tableur : on passe par valeurPortrait, qui écarte les cases roses
  // (valeur pas encore confirmée) et les familles qui n'ont pas la colonne.
  // Le nombre de pattes : les insectes en ont six, ce qui donne de bons pièges (« l'araignée en a huit »).
  // Étape 127 : la famille de l'animal. La réponse est le nom de sa famille (Mammifères, Crustacés…),
  // dessinée avec la silhouette de la famille (Pictos/famille_animale__<famille>.svg).
  // L'explication reprend l'accroche de la carte d'identité de la famille (familles.js).
  // Étape 157 (12/10) : question RETIRÉE. La photo est toujours là quand on la pose, et la famille s'y voit
  // (un oiseau parmi des amphibiens, des crustacés et des mammifères) : elle n'apprenait rien.
  // La définition reste ici, au cas où (« retiree » la fait sauter partout : questions, fiches, jeux).
  { champ: "famille_animale", retiree: true, pictos: true, niveau: 1, libelle: "Famille", formats: ["qcm"],
    valeur: e => CLASSES[e.onglet] ? CLASSES[e.onglet].nom : "NA",
    question: "À quelle famille appartient-il ?",
    pieges: e => Object.keys(CLASSES).filter(c => c !== e.onglet).map(c => CLASSES[c].nom),
    explication: (e, v) => `${v} : ${minuscule((FAMILLES_INFO[e.onglet] || {}).accroche || "")}` },

  { champ: "nombre_pattes", pictos: true, niveau: 1, libelle: "Pattes", formats: ["qcm", "vraifaux"],
    valeur: e => valeurPortrait(e, "nombre_pattes"),
    question: "Combien de pattes a-t-il ?",
    affirmation: v => `Nombre de pattes : ${minuscule(v)}.`,
    pieges: e => autresDeLaListe(e, "nombre_pattes"),
    explication: (e, v) => v === "Aucune" ? "Il n'a aucune patte." : `Il a ${minuscule(v)} pattes.` },

  { champ: "danger_homme", pictos: true, niveau: 1, libelle: "Danger", formats: ["qcm"],
    valeur: e => valeurPortrait(e, "danger_homme"),
    question: "Est-il dangereux pour l'homme ?",
    pieges: e => autresDeLaListe(e, "danger_homme"),
    explication: (e, v) => `Pour l'homme : ${minuscule(v)}.` },

  { champ: "toile", pictos: true, niveau: 2, libelle: "Toile", formats: ["qcm"],
    valeur: e => valeurPortrait(e, "toile"),
    question: "Comment attrape-t-il ses proies ?",
    pieges: e => autresDeLaListe(e, "toile"),
    explication: (e, v) => ({ "Toile ronde": "Il tisse une toile ronde, comme une roue.",
                              "Toile en nappe ou en entonnoir": "Il tisse une toile en nappe, avec un entonnoir où il se cache.",
                              "Fils irréguliers": "Il tend des fils en désordre.",
                              "Pas de toile, chasse à l'affût": "Il ne tisse pas de toile : il attend ses proies, immobile.",
                              "Pas de toile, chasse à la course": "Il ne tisse pas de toile : il poursuit ses proies en courant." })[v]
                            || `Pour chasser : ${minuscule(v)}.` },

  { champ: "pinces", pictos: true, niveau: 1, libelle: "Pinces", formats: ["qcm"],
    valeur: e => valeurPortrait(e, "pinces"),
    question: "A-t-il des pinces ?",
    pieges: e => autresDeLaListe(e, "pinces"),
    explication: (e, v) => v === "Pas de pinces" ? "Il n'a pas de pinces." : `Il a ${minuscule(v)}.` },

  { champ: "coquille", pictos: true, niveau: 1, libelle: "Coquille", formats: ["qcm"],
    valeur: e => valeurPortrait(e, "coquille"),
    question: "À quoi ressemble sa coquille ?",
    pieges: e => autresDeLaListe(e, "coquille"),
    explication: (e, v) => v === "Pas de coquille" ? "Il n'a pas de coquille."
                         : v === "Cachée dans le corps" ? "Sa coquille, toute petite, est cachée dans son corps."
                         : `Sa coquille : ${minuscule(v)}.` },

  // Deux réponses possibles, comme « venimeux » : on fournit l'autre comme piège.
  { champ: "regeneration", pictos: true, niveau: 2, libelle: "Repousse", formats: ["qcm"],
    valeur: e => { const v = valeurPortrait(e, "regeneration");
                   return !estRenseigne(v) ? v : v === "Oui" ? "peut repousser" : "ne repousse pas"; },
    question: "S'il perd une patte ou un morceau de son corps, que se passe-t-il ?",
    pieges: e => [valeurPortrait(e, "regeneration") === "Oui" ? "ne repousse pas" : "peut repousser"],
    explication: (e, v) => v === "peut repousser" ? "Le morceau perdu peut repousser." : "Le morceau perdu ne repousse pas." },

  { champ: "sexes", pictos: true, niveau: 3, libelle: "Mâle et femelle", formats: ["qcm"],
    valeur: e => valeurPortrait(e, "sexes"),
    question: "Chez cette espèce, comment sont les mâles et les femelles ?",
    pieges: e => autresDeLaListe(e, "sexes"),
    explication: (e, v) => v === "Les deux à la fois" ? "Chaque individu est à la fois mâle et femelle."
                         : v === "Change de sexe au cours de sa vie" ? "Il change de sexe au cours de sa vie."
                         : "Il y a des mâles et des femelles." },

  // Étape 237 (22/10) : le niveau sur l'estran (Bassin aquitain), deux réponses seulement (décision de l'utilisateur) ;
  // les espèces qui vivent sur tout l'estran n'ont pas la question (NA).
  { champ: "niveau_estran", pictos: true, niveau: 2, libelle: "Sur l'estran", formats: ["qcm"],
    valeur: e => valeurPortrait(e, "niveau_estran"),
    question: "Où vit-il sur l'estran, la partie de la plage que la mer couvre et découvre ?",
    pieges: e => [valeurPortrait(e, "niveau_estran") === "Haut de l'estran" ? "Bas de l'estran" : "Haut de l'estran"],
    explication: (e, v) => v === "Haut de l'estran" ? "Il vit en haut de l'estran, là où la mer ne monte qu'à marée haute."
                                                     : "Il vit en bas de l'estran, découvert seulement aux plus basses mers." },

  { champ: "soin_des_petits", pictos: true, niveau: 3, libelle: "Soin des œufs", formats: ["qcm"],
    valeur: e => valeurPortrait(e, "soin_des_petits"),
    question: "Que fait la femelle de ses œufs ?",
    pieges: e => autresDeLaListe(e, "soin_des_petits"),
    explication: (e, v) => ({ "Cocon abandonné": "Elle enferme ses œufs dans un cocon, puis l'abandonne.",
                              "Cocon gardé ou transporté": "Elle garde son cocon d'œufs, ou le transporte avec elle.",
                              "Petits portés sur le dos": "Elle porte ses petits sur son dos.",
                              "Œufs pondus dans le sol": "Elle pond ses œufs dans le sol et les laisse." })[v]
                            || `Ses œufs : ${minuscule(v)}.` },

  { champ: "periode_reproduction_nom", niveau: 3, libelle: "Nom de la reproduction", formats: ["qcm", "vraifaux"],
    accepter: v => ["Brame", "Essaimage"].includes(v),
    question: "Comment appelle-t-on sa période de reproduction ?",
    affirmation: v => `Sa période de reproduction s'appelle : ${minuscule(v)}.`,
    pieges: e => autresDeLaListe(e, "periode_reproduction_nom").filter(v => !(e.periode_reproduction_nom === "Brame" && v === "Rut")),
    explication: (e, v) => `Sa période de reproduction s'appelle : ${minuscule(v)}.` },

  // ---- Ajoutée à l'étape 71 : la saison de reproduction ---------------
  // Colonne saison_reproduction du tableur V28 : "Printemps", "Automne et hiver"…
  // Mauvaises réponses : seulement celles qui n'ont AUCUNE saison en commun avec la bonne
  // ("Printemps" n'est pas proposé quand la réponse est "Printemps et été").
  // Les poissons ont "NA" : leur saison est déjà demandée par la question sur le frai.
  // Étape R184 (10/11, retour d'Aubin : « se reproduit en automne », pipistrelle) : pour les mammifères, la colonne donne la
  // saison des ACCOUPLEMENTS (chauves-souris en automne, petits au début de l'été ; fouine en été, petits au printemps) :
  // le texte dit « s'accouple » (seMultiplie). Les autres familles gardent « se reproduit » (ponte, nid, frai).
  { champ: "saison_reproduction", pictos: true, niveau: 2, libelle: "Saison de reproduction", formats: ["qcm", "vraifaux"],
    question: e => accouplementSeul(e) ? "À quelle saison s'accouple-t-il ?" : "À quelle saison se reproduit-il ?",
    affirmation: (v, e) => `Il ${accouplementSeul(e) ? "s'accouple" : "se reproduit"} ${saisonEnPhrase(v)}.`,   // étape R166 (avant : « à cette saison : … »)
    // Étape R149 : « Toute l'année » et « Du printemps à l'automne » couvrent plusieurs saisons ; R166 : règle commune (sansSaisonCommune)
    pieges: e => sansSaisonCommune(e, "saison_reproduction"),
    explication: (e, v) => accouplementSeul(e) ? `Il s'accouple ${saisonEnPhrase(v)}.` : `Sa saison de reproduction : ${minuscule(v)}.` },

  // ---- Ajoutées à l'étape 28 : les empreintes -------------------------
  // "format" impose un format de question à part (partie 6f) :
  //   empreinte-nom   → on montre l'empreinte, 4 noms d'espèces au choix
  //   empreinte-choix → on montre l'espèce, 4 empreintes au choix
  // Ce sont deux cases distinctes de la fiche, toutes deux au niveau 3.
  // Étape 172 (13/10) : « toujoursOuverte » = la question peut sortir dès que l'espèce est identifiée,
  // sans attendre que les niveaux d'avant soient terminés (sinon elle n'arrivait presque jamais).
  // Son niveau ne change pas : les médailles restent calculées comme avant.
  { champ: "empreinte_nom", niveau: 3, toujoursOuverte: true, libelle: "Empreinte", format: "empreinte-nom",
    valeur: e => fichierEmpreinte(e),
    affichage: v => `<img class="mini-empreinte" src="${v}" alt="son empreinte">`,
    explication: e => texteEmpreinte(e) },

  // Étape 172 (13/10) : retirée — « À qui appartient cette empreinte ? » suffit.
  { champ: "empreinte_choix", retiree: true, niveau: 3, libelle: "Empreinte parmi quatre", format: "empreinte-choix",
    valeur: e => fichierEmpreinte(e),
    affichage: v => "Retrouvée",
    explication: e => texteEmpreinte(e) },

  // ---- Ajoutée à l'étape 29 : le cri à reconnaître à l'oreille ---------
  // Format à part (partie 6g) : un bouton "Écouter", puis 4 noms d'espèces au choix.
  { champ: "cri_son", niveau: 2, toujoursOuverte: true, libelle: "Cri à l'oreille", format: "son-nom",   // étape 172 : toujours ouverte
    valeur: e => fichierSon(e),
    affichage: v => "Reconnu",
    explication: e => `On entendait ${SONS[cleEmpreinte(e)].texte}.` },

  // ---- Ajoutées à l'étape 64 : le portrait physique ---------------------
  // 21 questions de niveau 1 et 15 de niveaux 2 et 3 (étape 68), fabriquées juste au-dessus (QUESTIONS_PORTRAIT).
  // Les trois points "..." recopient ici chaque question de cette liste.
  ...QUESTIONS_PORTRAIT,
];

// La toute première question sur une espèce : la reconnaître sur sa photo.
// On la note dans le carnet sous ce nom de champ spécial.
const IDENTIFICATION = "identification";
