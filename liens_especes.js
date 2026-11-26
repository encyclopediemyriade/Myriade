// ============================================================
// LES LIENS ENTRE ESPÈCES — généré automatiquement depuis Données\liens_especes.xlsx (étape R299)
// Ne pas modifier à la main : on modifie l'Excel, puis on relance Code\Outils\gen_liens_especes.py.
// a = le mangeur (ou celui qui pond, niche, loge) ; b = la cible (la proie, l'hôte) ; typique : posé ; sinon rare : jamais posé,
//   jamais proposé comme mauvaise réponse à une question sur l'autre espèce.
// ============================================================

const LIENS_ESPECES_DONNEES = [
 {
  "id": "LE001",
  "a": "Effraie des clochers",
  "b": "Campagnol des champs",
  "role": "mange",
  "typique": true,
  "groupe": "campagnols",
  "phrase": "L'effraie mange surtout les campagnols.",
  "statut": "doublon_classeur",
  "sources": [
   "Wikipédia FR (Effraie des clochers)",
   "oiseaux.net (Effraie des clochers)"
  ]
 },
 {
  "id": "LE002",
  "a": "Effraie des clochers",
  "b": "Campagnol agreste",
  "role": "mange",
  "typique": true,
  "groupe": "campagnols",
  "phrase": "L'effraie mange surtout les campagnols.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Effraie des clochers)",
   "oiseaux.net (Effraie des clochers)"
  ]
 },
 {
  "id": "LE003",
  "a": "Effraie des clochers",
  "b": "Campagnol roussâtre",
  "role": "mange",
  "typique": true,
  "groupe": "campagnols",
  "phrase": "L'effraie mange surtout les campagnols.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Effraie des clochers)",
   "oiseaux.net (Effraie des clochers)"
  ]
 },
 {
  "id": "LE004",
  "a": "Effraie des clochers",
  "b": "Musaraigne couronnée",
  "role": "mange",
  "typique": true,
  "groupe": "musaraignes",
  "phrase": "Les musaraignes comptent pour un tiers des proies de l'effraie.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Effraie des clochers)",
   "oiseaux.net (Effraie des clochers)"
  ]
 },
 {
  "id": "LE005",
  "a": "Effraie des clochers",
  "b": "Musaraigne musette",
  "role": "mange",
  "typique": true,
  "groupe": "musaraignes",
  "phrase": "Les musaraignes comptent pour un tiers des proies de l'effraie.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Effraie des clochers)",
   "oiseaux.net (Effraie des clochers)"
  ]
 },
 {
  "id": "LE006",
  "a": "Effraie des clochers",
  "b": "Musaraigne des jardins",
  "role": "mange",
  "typique": true,
  "groupe": "musaraignes",
  "phrase": "Les musaraignes comptent pour un tiers des proies de l'effraie.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Effraie des clochers)",
   "oiseaux.net (Effraie des clochers)"
  ]
 },
 {
  "id": "LE007",
  "a": "Effraie des clochers",
  "b": "Crocidure leucode",
  "role": "mange",
  "typique": true,
  "groupe": "musaraignes",
  "phrase": "Les musaraignes comptent pour un tiers des proies de l'effraie.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Effraie des clochers)",
   "oiseaux.net (Effraie des clochers)"
  ]
 },
 {
  "id": "LE008",
  "a": "Effraie des clochers",
  "b": "Pachyure étrusque",
  "role": "mange",
  "typique": true,
  "groupe": "musaraignes",
  "phrase": "Les musaraignes comptent pour un tiers des proies de l'effraie.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Effraie des clochers)",
   "oiseaux.net (Effraie des clochers)"
  ]
 },
 {
  "id": "LE009",
  "a": "Effraie des clochers",
  "b": "Belette",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "L'effraie capture rarement une belette.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Effraie des clochers)"
  ]
 },
 {
  "id": "LE010",
  "a": "Effraie des clochers",
  "b": "Lapin de garenne",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "L'effraie capture rarement un jeune lapin.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Effraie des clochers)"
  ]
 },
 {
  "id": "LE011",
  "a": "Autour des palombes",
  "b": "Pigeon ramier",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "Le pigeon ramier est une proie habituelle de l'autour.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Autour des palombes)",
   "oiseaux.net (Autour des palombes)"
  ]
 },
 {
  "id": "LE012",
  "a": "Autour des palombes",
  "b": "Geai des chênes",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "Le geai est l'oiseau le plus souvent pris par l'autour.",
  "statut": "doublon_classeur",
  "sources": [
   "Wikipédia FR (Autour des palombes)",
   "oiseaux.net (Autour des palombes)"
  ]
 },
 {
  "id": "LE013",
  "a": "Autour des palombes",
  "b": "Corneille noire",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "La corneille figure parmi les proies habituelles de l'autour.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Autour des palombes)",
   "oiseaux.net (Autour des palombes)"
  ]
 },
 {
  "id": "LE014",
  "a": "Autour des palombes",
  "b": "Grive musicienne",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "La grive musicienne compte parmi les proies de l'autour.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Autour des palombes)",
   "oiseaux.net (Autour des palombes)"
  ]
 },
 {
  "id": "LE015",
  "a": "Autour des palombes",
  "b": "Écureuil roux",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "L'autour capture aussi des écureuils.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Autour des palombes)"
  ]
 },
 {
  "id": "LE016",
  "a": "Autour des palombes",
  "b": "Épervier d'Europe",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "L'autour capture parfois un épervier.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Autour des palombes)"
  ]
 },
 {
  "id": "LE017",
  "a": "Autour des palombes",
  "b": "Buse variable",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "L'autour capture parfois une buse.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Autour des palombes)"
  ]
 },
 {
  "id": "LE018",
  "a": "Autour des palombes",
  "b": "Hibou moyen-duc",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "L'autour capture parfois un hibou moyen-duc.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Autour des palombes)"
  ]
 },
 {
  "id": "LE019",
  "a": "Autour des palombes",
  "b": "Chouette hulotte",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "L'autour capture parfois une chouette hulotte.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Autour des palombes)"
  ]
 },
 {
  "id": "LE020",
  "a": "Autour des palombes",
  "b": "Corneille noire",
  "role": "niche_dans_le_vieux_nid_de",
  "typique": false,
  "groupe": "corvidés",
  "phrase": "L'autour reprend parfois un ancien nid de corvidé.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Autour des palombes)",
   "oiseaux.net (Autour des palombes)"
  ]
 },
 {
  "id": "LE021",
  "a": "Épervier d'Europe",
  "b": "Grive musicienne",
  "role": "mange",
  "typique": true,
  "groupe": "turdidés",
  "phrase": "Les grives comptent parmi les proies favorites de l'épervier.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Épervier d'Europe)",
   "oiseaux.net (Épervier d'Europe)"
  ]
 },
 {
  "id": "LE022",
  "a": "Épervier d'Europe",
  "b": "Grive draine",
  "role": "mange",
  "typique": true,
  "groupe": "turdidés",
  "phrase": "Les grives comptent parmi les proies favorites de l'épervier.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Épervier d'Europe)",
   "oiseaux.net (Épervier d'Europe)"
  ]
 },
 {
  "id": "LE023",
  "a": "Épervier d'Europe",
  "b": "Mésange charbonnière",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "La mésange charbonnière est une proie courante de l'épervier.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Épervier d'Europe)",
   "oiseaux.net (Épervier d'Europe)"
  ]
 },
 {
  "id": "LE024",
  "a": "Épervier d'Europe",
  "b": "Pinson des arbres",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "Le pinson des arbres est une proie courante de l'épervier.",
  "statut": "en_jeu",
  "sources": [
   "oiseaux.net (Épervier d'Europe)",
   "Wikipédia EN (Eurasian sparrowhawk)"
  ]
 },
 {
  "id": "LE025",
  "a": "Buse variable",
  "b": "Campagnol des champs",
  "role": "mange",
  "typique": true,
  "groupe": "campagnols",
  "phrase": "Les campagnols sont la base du repas de la buse.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Buse variable)",
   "oiseaux.net (Buse variable)"
  ]
 },
 {
  "id": "LE026",
  "a": "Buse variable",
  "b": "Lapin de garenne",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "Là où il abonde, la buse mange souvent le lapin.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Buse variable)",
   "Wikipédia EN (Common buzzard)"
  ]
 },
 {
  "id": "LE027",
  "a": "Buse variable",
  "b": "Taupe d'Europe",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "La buse capture volontiers des taupes.",
  "statut": "rare",
  "sources": [
   "Wikipédia EN (Common buzzard)"
  ]
 },
 {
  "id": "LE028",
  "a": "Buse variable",
  "b": "Lièvre d'Europe",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "Sans lapins, la buse se rabat sur les jeunes lièvres.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Buse variable)",
   "Wikipédia EN (Common buzzard)"
  ]
 },
 {
  "id": "LE029",
  "a": "Faucon crécerelle",
  "b": "Campagnol des champs",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "Le campagnol des champs est la proie favorite du crécerelle.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Faucon crécerelle)",
   "oiseaux.net (Faucon crécerelle)"
  ]
 },
 {
  "id": "LE030",
  "a": "Faucon crécerelle",
  "b": "Corneille noire",
  "role": "niche_dans_le_vieux_nid_de",
  "typique": true,
  "groupe": null,
  "phrase": "Le crécerelle pond souvent dans un vieux nid de corneille.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Faucon crécerelle)",
   "oiseaux.net (Faucon crécerelle)"
  ]
 },
 {
  "id": "LE031",
  "a": "Faucon crécerelle",
  "b": "Pie bavarde",
  "role": "niche_dans_le_vieux_nid_de",
  "typique": true,
  "groupe": null,
  "phrase": "Le crécerelle reprend aussi d'anciens nids de pie.",
  "statut": "doublon_classeur",
  "sources": [
   "Wikipédia FR (Faucon crécerelle)",
   "oiseaux.net (Faucon crécerelle)"
  ]
 },
 {
  "id": "LE032",
  "a": "Faucon crécerelle",
  "b": "Belette",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "Le crécerelle capture rarement une belette.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Faucon crécerelle)"
  ]
 },
 {
  "id": "LE033",
  "a": "Faucon crécerelle",
  "b": "Martinet noir",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "Certains crécerelles se spécialisent dans la chasse aux martinets.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Faucon crécerelle)"
  ]
 },
 {
  "id": "LE034",
  "a": "Faucon hobereau",
  "b": "Hirondelle rustique",
  "role": "mange",
  "typique": true,
  "groupe": "hirondelles",
  "phrase": "Les hirondelles sont les proies favorites du hobereau.",
  "statut": "en_jeu",
  "sources": [
   "oiseaux.net (Faucon hobereau)",
   "Wikipédia EN (Eurasian hobby)"
  ]
 },
 {
  "id": "LE035",
  "a": "Faucon hobereau",
  "b": "Hirondelle de fenêtre",
  "role": "mange",
  "typique": true,
  "groupe": "hirondelles",
  "phrase": "Les hirondelles sont les proies favorites du hobereau.",
  "statut": "doublon_classeur",
  "sources": [
   "oiseaux.net (Faucon hobereau)",
   "Wikipédia EN (Eurasian hobby)"
  ]
 },
 {
  "id": "LE036",
  "a": "Faucon hobereau",
  "b": "Martinet noir",
  "role": "mange",
  "typique": true,
  "groupe": "martinets",
  "phrase": "Le hobereau attrape même les martinets en plein vol.",
  "statut": "en_jeu",
  "sources": [
   "oiseaux.net (Faucon hobereau)",
   "Wikipédia EN (Eurasian hobby)"
  ]
 },
 {
  "id": "LE037",
  "a": "Faucon hobereau",
  "b": "Corneille noire",
  "role": "niche_dans_le_vieux_nid_de",
  "typique": true,
  "groupe": null,
  "phrase": "Le hobereau pond souvent dans un vieux nid de corneille.",
  "statut": "doublon_classeur",
  "sources": [
   "oiseaux.net (Faucon hobereau)",
   "Wikipédia FR (Faucon hobereau)"
  ]
 },
 {
  "id": "LE038",
  "a": "Faucon hobereau",
  "b": "Pie bavarde",
  "role": "niche_dans_le_vieux_nid_de",
  "typique": false,
  "groupe": "corvidés",
  "phrase": "Le hobereau peut reprendre un ancien nid de pie.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Faucon hobereau)"
  ]
 },
 {
  "id": "LE039",
  "a": "Bondrée apivore",
  "b": "Buse variable",
  "role": "niche_dans_le_vieux_nid_de",
  "typique": false,
  "groupe": null,
  "phrase": "La bondrée reprend parfois un vieux nid de buse.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Bondrée apivore)",
   "oiseaux.net (Bondrée apivore)"
  ]
 },
 {
  "id": "LE040",
  "a": "Bondrée apivore",
  "b": "Grenouille rieuse",
  "role": "mange",
  "typique": false,
  "groupe": "grenouilles",
  "phrase": "Faute de guêpes, la bondrée prend parfois des grenouilles.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Bondrée apivore)",
   "oiseaux.net (Bondrée apivore)"
  ]
 },
 {
  "id": "LE041",
  "a": "Hibou moyen-duc",
  "b": "Campagnol des champs",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "Le campagnol des champs est la proie principale du moyen-duc.",
  "statut": "doublon_classeur",
  "sources": [
   "Wikipédia FR (Hibou moyen-duc)",
   "oiseaux.net (Hibou moyen-duc)"
  ]
 },
 {
  "id": "LE042",
  "a": "Hibou moyen-duc",
  "b": "Campagnol agreste",
  "role": "mange",
  "typique": true,
  "groupe": "campagnols",
  "phrase": "Le moyen-duc mange surtout les petits campagnols.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Hibou moyen-duc)",
   "oiseaux.net (Hibou moyen-duc)"
  ]
 },
 {
  "id": "LE043",
  "a": "Hibou moyen-duc",
  "b": "Campagnol souterrain",
  "role": "mange",
  "typique": true,
  "groupe": "campagnols",
  "phrase": "Le moyen-duc mange surtout les petits campagnols.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Hibou moyen-duc)",
   "oiseaux.net (Hibou moyen-duc)"
  ]
 },
 {
  "id": "LE044",
  "a": "Hibou moyen-duc",
  "b": "Mulot à collier",
  "role": "mange",
  "typique": false,
  "groupe": "mulots",
  "phrase": "Le moyen-duc capture aussi des mulots.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Hibou moyen-duc)"
  ]
 },
 {
  "id": "LE045",
  "a": "Hibou moyen-duc",
  "b": "Pinson des arbres",
  "role": "mange",
  "typique": false,
  "groupe": "passereaux",
  "phrase": "En hiver, le moyen-duc prend parfois des pinsons.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Hibou moyen-duc)",
   "oiseaux.net (Hibou moyen-duc)"
  ]
 },
 {
  "id": "LE046",
  "a": "Hibou moyen-duc",
  "b": "Corneille noire",
  "role": "niche_dans_le_vieux_nid_de",
  "typique": true,
  "groupe": null,
  "phrase": "Le moyen-duc pond souvent dans un vieux nid de corneille.",
  "statut": "sans_lieu_commun",
  "sources": [
   "Wikipédia FR (Hibou moyen-duc)",
   "oiseaux.net (Hibou moyen-duc)"
  ]
 },
 {
  "id": "LE047",
  "a": "Hibou moyen-duc",
  "b": "Pie bavarde",
  "role": "niche_dans_le_vieux_nid_de",
  "typique": true,
  "groupe": null,
  "phrase": "Le moyen-duc pond souvent dans un vieux nid de pie.",
  "statut": "sans_lieu_commun",
  "sources": [
   "Wikipédia FR (Hibou moyen-duc)",
   "oiseaux.net (Hibou moyen-duc)"
  ]
 },
 {
  "id": "LE048",
  "a": "Hibou moyen-duc",
  "b": "Écureuil roux",
  "role": "niche_dans_le_vieux_nid_de",
  "typique": false,
  "groupe": null,
  "phrase": "Le moyen-duc s'installe parfois dans un nid d'écureuil.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Hibou moyen-duc)"
  ]
 },
 {
  "id": "LE049",
  "a": "Faucon pèlerin",
  "b": "Pigeon biset",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "En ville, le pèlerin chasse surtout le pigeon biset.",
  "statut": "doublon_classeur",
  "sources": [
   "Wikipédia FR (Faucon pèlerin)",
   "Wikipédia EN (Peregrine falcon)"
  ]
 },
 {
  "id": "LE050",
  "a": "Faucon pèlerin",
  "b": "Pigeon ramier",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "Le pigeon ramier compte parmi les proies du pèlerin.",
  "statut": "sans_lieu_commun",
  "sources": [
   "Wikipédia FR (Faucon pèlerin)",
   "Wikipédia EN (Peregrine falcon)"
  ]
 },
 {
  "id": "LE051",
  "a": "Faucon pèlerin",
  "b": "Grive litorne",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "Le pèlerin chasse parfois les grives litornes en migration.",
  "statut": "rare",
  "sources": [
   "Wikipédia EN (Peregrine falcon)"
  ]
 },
 {
  "id": "LE052",
  "a": "Faucon pèlerin",
  "b": "Grand corbeau",
  "role": "niche_dans_le_vieux_nid_de",
  "typique": true,
  "groupe": null,
  "phrase": "Le pèlerin reprend souvent un vieux nid de grand corbeau.",
  "statut": "en_jeu",
  "sources": [
   "oiseaux.net (Faucon pèlerin)",
   "Wikipédia FR (Faucon pèlerin)"
  ]
 },
 {
  "id": "LE053",
  "a": "Chouette hulotte",
  "b": "Mulot sylvestre",
  "role": "mange",
  "typique": true,
  "groupe": "mulots",
  "phrase": "La hulotte mange beaucoup de mulots.",
  "statut": "doublon_classeur",
  "sources": [
   "oiseaux.net (Chouette hulotte)",
   "Wikipédia EN (Tawny owl)"
  ]
 },
 {
  "id": "LE054",
  "a": "Chouette hulotte",
  "b": "Mulot à collier",
  "role": "mange",
  "typique": true,
  "groupe": "mulots",
  "phrase": "La hulotte mange beaucoup de mulots.",
  "statut": "en_jeu",
  "sources": [
   "oiseaux.net (Chouette hulotte)",
   "Wikipédia EN (Tawny owl)"
  ]
 },
 {
  "id": "LE055",
  "a": "Chouette hulotte",
  "b": "Lapin de garenne",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "La hulotte capture parfois un jeune lapin.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Chouette hulotte)",
   "Wikipédia EN (Tawny owl)"
  ]
 },
 {
  "id": "LE056",
  "a": "Chouette hulotte",
  "b": "Buse variable",
  "role": "niche_dans_le_vieux_nid_de",
  "typique": false,
  "groupe": null,
  "phrase": "La hulotte niche parfois dans un vieux nid de buse.",
  "statut": "rare",
  "sources": [
   "oiseaux.net (Chouette hulotte)",
   "Wikipédia FR (Chouette hulotte)"
  ]
 },
 {
  "id": "LE057",
  "a": "Chevêche d'Athéna",
  "b": "Campagnol des champs",
  "role": "mange",
  "typique": true,
  "groupe": "campagnols",
  "phrase": "La nuit, la chevêche chasse surtout les campagnols.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Chevêche d'Athéna)",
   "oiseaux.net (Chevêche d'Athéna)"
  ]
 },
 {
  "id": "LE058",
  "a": "Chevêche d'Athéna",
  "b": "Campagnol agreste",
  "role": "mange",
  "typique": true,
  "groupe": "campagnols",
  "phrase": "La nuit, la chevêche chasse surtout les campagnols.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Chevêche d'Athéna)",
   "oiseaux.net (Chevêche d'Athéna)"
  ]
 },
 {
  "id": "LE059",
  "a": "Busard Saint-Martin",
  "b": "Campagnol des champs",
  "role": "mange",
  "typique": true,
  "groupe": "campagnols",
  "phrase": "Les campagnols viennent en tête des proies du busard Saint-Martin.",
  "statut": "en_jeu",
  "sources": [
   "oiseaux.net (Busard Saint-Martin)",
   "Wikipédia DE (Kornweihe)"
  ]
 },
 {
  "id": "LE060",
  "a": "Busard Saint-Martin",
  "b": "Campagnol agreste",
  "role": "mange",
  "typique": true,
  "groupe": "campagnols",
  "phrase": "Les campagnols viennent en tête des proies du busard Saint-Martin.",
  "statut": "en_jeu",
  "sources": [
   "oiseaux.net (Busard Saint-Martin)",
   "Wikipédia DE (Kornweihe)"
  ]
 },
 {
  "id": "LE061",
  "a": "Busard Saint-Martin",
  "b": "Alouette des champs",
  "role": "mange",
  "typique": true,
  "groupe": "alouettes",
  "phrase": "Le busard Saint-Martin surprend les alouettes au sol.",
  "statut": "en_jeu",
  "sources": [
   "oiseaux.net (Busard Saint-Martin)",
   "Wikipédia EN (Hen harrier)"
  ]
 },
 {
  "id": "LE062",
  "a": "Busard Saint-Martin",
  "b": "Alouette lulu",
  "role": "mange",
  "typique": true,
  "groupe": "alouettes",
  "phrase": "Le busard Saint-Martin surprend les alouettes au sol.",
  "statut": "en_jeu",
  "sources": [
   "oiseaux.net (Busard Saint-Martin)",
   "Wikipédia EN (Hen harrier)"
  ]
 },
 {
  "id": "LE063",
  "a": "Busard Saint-Martin",
  "b": "Pipit farlouse",
  "role": "mange",
  "typique": true,
  "groupe": "pipits",
  "phrase": "Le busard Saint-Martin surprend les pipits au sol.",
  "statut": "en_jeu",
  "sources": [
   "oiseaux.net (Busard Saint-Martin)",
   "Wikipédia EN (Hen harrier)"
  ]
 },
 {
  "id": "LE064",
  "a": "Busard Saint-Martin",
  "b": "Pipit des arbres",
  "role": "mange",
  "typique": true,
  "groupe": "pipits",
  "phrase": "Le busard Saint-Martin surprend les pipits au sol.",
  "statut": "en_jeu",
  "sources": [
   "oiseaux.net (Busard Saint-Martin)",
   "Wikipédia EN (Hen harrier)"
  ]
 },
 {
  "id": "LE065",
  "a": "Busard Saint-Martin",
  "b": "Pipit rousseline",
  "role": "mange",
  "typique": true,
  "groupe": "pipits",
  "phrase": "Le busard Saint-Martin surprend les pipits au sol.",
  "statut": "en_jeu",
  "sources": [
   "oiseaux.net (Busard Saint-Martin)",
   "Wikipédia EN (Hen harrier)"
  ]
 },
 {
  "id": "LE066",
  "a": "Milan royal",
  "b": "Étourneau sansonnet",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "Le milan royal capture volontiers de jeunes étourneaux.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Milan royal)",
   "Wikipédia EN (Red kite)"
  ]
 },
 {
  "id": "LE067",
  "a": "Milan royal",
  "b": "Grive draine",
  "role": "mange",
  "typique": true,
  "groupe": "turdidés",
  "phrase": "Le milan royal capture volontiers de jeunes grives.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Milan royal)",
   "Wikipédia EN (Red kite)"
  ]
 },
 {
  "id": "LE068",
  "a": "Milan royal",
  "b": "Grive litorne",
  "role": "mange",
  "typique": true,
  "groupe": "turdidés",
  "phrase": "Le milan royal capture volontiers de jeunes grives.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Milan royal)",
   "Wikipédia EN (Red kite)"
  ]
 },
 {
  "id": "LE069",
  "a": "Milan royal",
  "b": "Merle noir",
  "role": "mange",
  "typique": true,
  "groupe": "turdidés",
  "phrase": "Le milan royal capture volontiers de jeunes merles.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Milan royal)",
   "Wikipédia EN (Red kite)"
  ]
 },
 {
  "id": "LE070",
  "a": "Milan royal",
  "b": "Corneille noire",
  "role": "mange",
  "typique": true,
  "groupe": "corvidés",
  "phrase": "Le milan royal capture volontiers de jeunes corneilles.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Milan royal)",
   "Wikipédia EN (Red kite)"
  ]
 },
 {
  "id": "LE071",
  "a": "Milan royal",
  "b": "Lapin de garenne",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "Le milan royal chasse aussi les jeunes lapins.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Milan royal)",
   "Wikipédia EN (Red kite)"
  ]
 },
 {
  "id": "LE072",
  "a": "Milan royal",
  "b": "Campagnol des champs",
  "role": "mange",
  "typique": true,
  "groupe": "campagnols",
  "phrase": "En hiver, le milan royal mange beaucoup de campagnols.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Milan royal)",
   "Wikipédia EN (Red kite)"
  ]
 },
 {
  "id": "LE073",
  "a": "Milan royal",
  "b": "Campagnol agreste",
  "role": "mange",
  "typique": true,
  "groupe": "campagnols",
  "phrase": "En hiver, le milan royal mange beaucoup de campagnols.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Milan royal)",
   "Wikipédia EN (Red kite)"
  ]
 },
 {
  "id": "LE074",
  "a": "Milan royal",
  "b": "Campagnol terrestre",
  "role": "mange",
  "typique": true,
  "groupe": "campagnols",
  "phrase": "En hiver, le milan royal mange beaucoup de campagnols.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Milan royal)",
   "Wikipédia EN (Red kite)"
  ]
 },
 {
  "id": "LE075",
  "a": "Milan royal",
  "b": "Taupe d'Europe",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "Le milan royal prend aussi des taupes.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Milan royal)"
  ]
 },
 {
  "id": "LE076",
  "a": "Milan royal",
  "b": "Lièvre d'Europe",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "Le milan royal prend parfois de jeunes lièvres.",
  "statut": "rare",
  "sources": [
   "Wikipédia EN (Red kite)"
  ]
 },
 {
  "id": "LE077",
  "a": "Circaète Jean-le-Blanc",
  "b": "Couleuvre verte et jaune",
  "role": "mange",
  "typique": true,
  "groupe": "couleuvres",
  "phrase": "Le circaète se nourrit surtout de couleuvres.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Circaète Jean-le-Blanc)",
   "oiseaux.net (Circaète Jean-le-Blanc)"
  ]
 },
 {
  "id": "LE078",
  "a": "Circaète Jean-le-Blanc",
  "b": "Couleuvre d'Esculape",
  "role": "mange",
  "typique": true,
  "groupe": "couleuvres",
  "phrase": "Le circaète se nourrit surtout de couleuvres.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Circaète Jean-le-Blanc)",
   "oiseaux.net (Circaète Jean-le-Blanc)"
  ]
 },
 {
  "id": "LE079",
  "a": "Circaète Jean-le-Blanc",
  "b": "Couleuvre de Montpellier",
  "role": "mange",
  "typique": true,
  "groupe": "couleuvres",
  "phrase": "Le circaète se nourrit surtout de couleuvres.",
  "statut": "doublon_classeur",
  "sources": [
   "Wikipédia FR (Circaète Jean-le-Blanc)",
   "oiseaux.net (Circaète Jean-le-Blanc)"
  ]
 },
 {
  "id": "LE080",
  "a": "Circaète Jean-le-Blanc",
  "b": "Couleuvre vipérine",
  "role": "mange",
  "typique": true,
  "groupe": "couleuvres",
  "phrase": "Le circaète se nourrit surtout de couleuvres.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Circaète Jean-le-Blanc)",
   "oiseaux.net (Circaète Jean-le-Blanc)"
  ]
 },
 {
  "id": "LE081",
  "a": "Circaète Jean-le-Blanc",
  "b": "Coronelle lisse",
  "role": "mange",
  "typique": true,
  "groupe": "serpents",
  "phrase": "Le circaète se nourrit surtout de serpents.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Circaète Jean-le-Blanc)",
   "Wikipédia EN (Short-toed snake eagle)"
  ]
 },
 {
  "id": "LE082",
  "a": "Circaète Jean-le-Blanc",
  "b": "Coronelle girondine",
  "role": "mange",
  "typique": true,
  "groupe": "serpents",
  "phrase": "Le circaète se nourrit surtout de serpents.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Circaète Jean-le-Blanc)",
   "Wikipédia EN (Short-toed snake eagle)"
  ]
 },
 {
  "id": "LE083",
  "a": "Circaète Jean-le-Blanc",
  "b": "Vipère aspic",
  "role": "mange",
  "typique": true,
  "groupe": "serpents",
  "phrase": "Le circaète se nourrit surtout de serpents.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Circaète Jean-le-Blanc)",
   "Wikipédia EN (Short-toed snake eagle)"
  ]
 },
 {
  "id": "LE084",
  "a": "Circaète Jean-le-Blanc",
  "b": "Vipère péliade",
  "role": "mange",
  "typique": true,
  "groupe": "serpents",
  "phrase": "Le circaète se nourrit surtout de serpents.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Circaète Jean-le-Blanc)",
   "Wikipédia EN (Short-toed snake eagle)"
  ]
 },
 {
  "id": "LE085",
  "a": "Circaète Jean-le-Blanc",
  "b": "Vipère d'Orsini",
  "role": "mange",
  "typique": true,
  "groupe": "serpents",
  "phrase": "Le circaète se nourrit surtout de serpents.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Circaète Jean-le-Blanc)",
   "Wikipédia EN (Short-toed snake eagle)"
  ]
 },
 {
  "id": "LE086",
  "a": "Busard des roseaux",
  "b": "Foulque macroule",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "Le busard des roseaux mange souvent les jeunes foulques.",
  "statut": "en_jeu",
  "sources": [
   "oiseaux.net (Busard des roseaux)",
   "Wikipédia DE (Rohrweihe)"
  ]
 },
 {
  "id": "LE087",
  "a": "Busard des roseaux",
  "b": "Canard colvert",
  "role": "mange",
  "typique": true,
  "groupe": "jeunes canards",
  "phrase": "Les canetons sont des proies classiques du busard des roseaux.",
  "statut": "en_jeu",
  "sources": [
   "oiseaux.net (Busard des roseaux)",
   "Wikipédia DE (Rohrweihe)"
  ]
 },
 {
  "id": "LE088",
  "a": "Busard des roseaux",
  "b": "Campagnol des champs",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "Le busard des roseaux chasse aussi le campagnol des champs.",
  "statut": "sans_lieu_commun",
  "sources": [
   "oiseaux.net (Busard des roseaux)",
   "Wikipédia DE (Rohrweihe)"
  ]
 },
 {
  "id": "LE089",
  "a": "Busard des roseaux",
  "b": "Rat musqué",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "Le busard des roseaux capture de jeunes rats musqués.",
  "statut": "en_jeu",
  "sources": [
   "oiseaux.net (Busard des roseaux)",
   "Wikipédia DE (Rohrweihe)"
  ]
 },
 {
  "id": "LE090",
  "a": "Busard des roseaux",
  "b": "Gallinule poule-d'eau",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "Le busard des roseaux prend aussi de jeunes poules d'eau.",
  "statut": "rare",
  "sources": [
   "Wikipédia DE (Rohrweihe)"
  ]
 },
 {
  "id": "LE091",
  "a": "Busard des roseaux",
  "b": "Alouette des champs",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "Le busard des roseaux surprend parfois une alouette.",
  "statut": "rare",
  "sources": [
   "oiseaux.net (Busard des roseaux)"
  ]
 },
 {
  "id": "LE092",
  "a": "Petit-duc scops",
  "b": "Musaraigne musette",
  "role": "mange",
  "typique": false,
  "groupe": "musaraignes",
  "phrase": "Le petit-duc prend à l'occasion une musaraigne.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Petit-duc scops)",
   "oiseaux.net (Petit-duc scops)"
  ]
 },
 {
  "id": "LE093",
  "a": "Petit-duc scops",
  "b": "Musaraigne des jardins",
  "role": "mange",
  "typique": false,
  "groupe": "musaraignes",
  "phrase": "Le petit-duc prend à l'occasion une musaraigne.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Petit-duc scops)",
   "oiseaux.net (Petit-duc scops)"
  ]
 },
 {
  "id": "LE094",
  "a": "Petit-duc scops",
  "b": "Mulot sylvestre",
  "role": "mange",
  "typique": false,
  "groupe": "mulots",
  "phrase": "Le petit-duc prend à l'occasion un mulot.",
  "statut": "rare",
  "sources": [
   "oiseaux.net (Petit-duc scops)"
  ]
 },
 {
  "id": "LE095",
  "a": "Grand-duc d'Europe",
  "b": "Lièvre d'Europe",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "Le lièvre est une proie de choix du grand-duc.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Grand-duc d'Europe)",
   "oiseaux.net (Grand-duc d'Europe)"
  ]
 },
 {
  "id": "LE096",
  "a": "Grand-duc d'Europe",
  "b": "Campagnol terrestre",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "Le campagnol terrestre tient une bonne place chez le grand-duc.",
  "statut": "doublon_classeur",
  "sources": [
   "oiseaux.net (Grand-duc d'Europe)",
   "Wikipédia FR (Grand-duc d'Europe)"
  ]
 },
 {
  "id": "LE097",
  "a": "Grand-duc d'Europe",
  "b": "Pigeon biset",
  "role": "mange",
  "typique": false,
  "groupe": "pigeons",
  "phrase": "Le grand-duc capture aussi des pigeons.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Grand-duc d'Europe)"
  ]
 },
 {
  "id": "LE098",
  "a": "Grand-duc d'Europe",
  "b": "Pigeon ramier",
  "role": "mange",
  "typique": false,
  "groupe": "pigeons",
  "phrase": "Le grand-duc capture aussi des pigeons.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Grand-duc d'Europe)"
  ]
 },
 {
  "id": "LE099",
  "a": "Busard cendré",
  "b": "Campagnol agreste",
  "role": "mange",
  "typique": true,
  "groupe": "campagnols",
  "phrase": "Les campagnols sont la proie principale du busard cendré.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Busard cendré)",
   "oiseaux.net (Busard cendré)"
  ]
 },
 {
  "id": "LE100",
  "a": "Busard cendré",
  "b": "Campagnol provençal",
  "role": "mange",
  "typique": true,
  "groupe": "campagnols",
  "phrase": "Les campagnols sont la proie principale du busard cendré.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Busard cendré)",
   "oiseaux.net (Busard cendré)"
  ]
 },
 {
  "id": "LE101",
  "a": "Busard cendré",
  "b": "Alouette des champs",
  "role": "mange",
  "typique": true,
  "groupe": "alouettes",
  "phrase": "Le busard cendré surprend les alouettes et pille leurs nids.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Busard cendré)",
   "oiseaux.net (Busard cendré)"
  ]
 },
 {
  "id": "LE102",
  "a": "Busard cendré",
  "b": "Alouette lulu",
  "role": "mange",
  "typique": true,
  "groupe": "alouettes",
  "phrase": "Le busard cendré surprend les alouettes et pille leurs nids.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Busard cendré)",
   "oiseaux.net (Busard cendré)"
  ]
 },
 {
  "id": "LE103",
  "a": "Busard cendré",
  "b": "Lézard des murailles",
  "role": "mange",
  "typique": true,
  "groupe": "lézards",
  "phrase": "Le busard cendré capture aussi de petits lézards.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Busard cendré)",
   "oiseaux.net (Busard cendré)"
  ]
 },
 {
  "id": "LE104",
  "a": "Busard cendré",
  "b": "Perdrix grise",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "Le busard cendré s'attaque rarement à une perdrix.",
  "statut": "rare",
  "sources": [
   "oiseaux.net (Busard cendré)"
  ]
 },
 {
  "id": "LE105",
  "a": "Busard cendré",
  "b": "Lapin de garenne",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "Le busard cendré s'attaque rarement à un lapin.",
  "statut": "rare",
  "sources": [
   "oiseaux.net (Busard cendré)"
  ]
 },
 {
  "id": "LE106",
  "a": "Élanion blanc",
  "b": "Campagnol des champs",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "Le campagnol des champs forme l'essentiel des repas de l'élanion.",
  "statut": "rare",
  "sources": [
   "oiseaux.net (Élanion blanc)"
  ]
 },
 {
  "id": "LE107",
  "a": "Aigle royal",
  "b": "Chamois",
  "role": "mange",
  "typique": false,
  "groupe": "petits d'ongulés",
  "phrase": "L'aigle royal capture parfois un jeune chamois.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Aigle royal)"
  ]
 },
 {
  "id": "LE108",
  "a": "Aigle royal",
  "b": "Mouflon méditerranéen",
  "role": "mange",
  "typique": false,
  "groupe": "petits d'ongulés",
  "phrase": "L'aigle royal capture parfois un jeune mouflon.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Aigle royal)"
  ]
 },
 {
  "id": "LE109",
  "a": "Chouette de Tengmalm",
  "b": "Campagnol roussâtre",
  "role": "mange",
  "typique": true,
  "groupe": "petits campagnols",
  "phrase": "La chouette de Tengmalm mange surtout les petits campagnols.",
  "statut": "doublon_classeur",
  "sources": [
   "Wikipédia FR (Chouette de Tengmalm)",
   "oiseaux.net (Chouette de Tengmalm)"
  ]
 },
 {
  "id": "LE110",
  "a": "Chouette de Tengmalm",
  "b": "Campagnol des champs",
  "role": "mange",
  "typique": true,
  "groupe": "petits campagnols",
  "phrase": "La chouette de Tengmalm mange surtout les petits campagnols.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Chouette de Tengmalm)",
   "oiseaux.net (Chouette de Tengmalm)"
  ]
 },
 {
  "id": "LE111",
  "a": "Chouette de Tengmalm",
  "b": "Musaraigne carrelet",
  "role": "mange",
  "typique": true,
  "groupe": "musaraignes",
  "phrase": "La chouette de Tengmalm capture aussi des musaraignes.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Chouette de Tengmalm)",
   "oiseaux.net (Chouette de Tengmalm)"
  ]
 },
 {
  "id": "LE112",
  "a": "Chouette de Tengmalm",
  "b": "Musaraigne couronnée",
  "role": "mange",
  "typique": true,
  "groupe": "musaraignes",
  "phrase": "La chouette de Tengmalm capture aussi des musaraignes.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Chouette de Tengmalm)",
   "oiseaux.net (Chouette de Tengmalm)"
  ]
 },
 {
  "id": "LE113",
  "a": "Chouette de Tengmalm",
  "b": "Musaraigne pygmée",
  "role": "mange",
  "typique": true,
  "groupe": "musaraignes",
  "phrase": "La chouette de Tengmalm capture aussi des musaraignes.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Chouette de Tengmalm)",
   "oiseaux.net (Chouette de Tengmalm)"
  ]
 },
 {
  "id": "LE114",
  "a": "Chouette de Tengmalm",
  "b": "Musaraigne alpine",
  "role": "mange",
  "typique": true,
  "groupe": "musaraignes",
  "phrase": "La chouette de Tengmalm capture aussi des musaraignes.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Chouette de Tengmalm)",
   "oiseaux.net (Chouette de Tengmalm)"
  ]
 },
 {
  "id": "LE115",
  "a": "Chouette de Tengmalm",
  "b": "Mulot à collier",
  "role": "mange",
  "typique": false,
  "groupe": "mulots",
  "phrase": "La chouette de Tengmalm prend aussi des mulots.",
  "statut": "rare",
  "sources": [
   "oiseaux.net (Chouette de Tengmalm)"
  ]
 },
 {
  "id": "LE116",
  "a": "Chouette de Tengmalm",
  "b": "Pic noir",
  "role": "niche_dans_le_vieux_nid_de",
  "typique": true,
  "groupe": null,
  "phrase": "La chouette de Tengmalm reprend les loges du pic noir.",
  "statut": "doublon_classeur",
  "sources": [
   "Wikipédia FR (Chouette de Tengmalm)",
   "oiseaux.net (Chouette de Tengmalm)"
  ]
 },
 {
  "id": "LE117",
  "a": "Chevêchette d'Europe",
  "b": "Campagnol roussâtre",
  "role": "mange",
  "typique": true,
  "groupe": "campagnols",
  "phrase": "Les campagnols forment l'essentiel des repas de la chevêchette.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Chevêchette d'Europe)",
   "oiseaux.net (Chevêchette d'Europe)"
  ]
 },
 {
  "id": "LE118",
  "a": "Chevêchette d'Europe",
  "b": "Campagnol agreste",
  "role": "mange",
  "typique": true,
  "groupe": "campagnols",
  "phrase": "Les campagnols forment l'essentiel des repas de la chevêchette.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Chevêchette d'Europe)",
   "oiseaux.net (Chevêchette d'Europe)"
  ]
 },
 {
  "id": "LE119",
  "a": "Chevêchette d'Europe",
  "b": "Mésange boréale",
  "role": "mange",
  "typique": true,
  "groupe": "mésanges",
  "phrase": "La chevêchette attrape souvent des mésanges.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Chevêchette d'Europe)",
   "oiseaux.net (Chevêchette d'Europe)"
  ]
 },
 {
  "id": "LE120",
  "a": "Chevêchette d'Europe",
  "b": "Mésange nonnette",
  "role": "mange",
  "typique": true,
  "groupe": "mésanges",
  "phrase": "La chevêchette attrape souvent des mésanges.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Chevêchette d'Europe)",
   "oiseaux.net (Chevêchette d'Europe)"
  ]
 },
 {
  "id": "LE121",
  "a": "Chevêchette d'Europe",
  "b": "Roitelet à triple bandeau",
  "role": "mange",
  "typique": false,
  "groupe": "roitelets",
  "phrase": "La chevêchette attrape aussi des roitelets.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Chevêchette d'Europe)"
  ]
 },
 {
  "id": "LE122",
  "a": "Chevêchette d'Europe",
  "b": "Pic épeiche",
  "role": "niche_dans_le_vieux_nid_de",
  "typique": true,
  "groupe": null,
  "phrase": "La chevêchette niche surtout dans d'anciennes loges de pic épeiche.",
  "statut": "doublon_classeur",
  "sources": [
   "Wikipédia FR (Chevêchette d'Europe)",
   "oiseaux.net (Chevêchette d'Europe)"
  ]
 },
 {
  "id": "LE123",
  "a": "Chevêchette d'Europe",
  "b": "Pic tridactyle",
  "role": "niche_dans_le_vieux_nid_de",
  "typique": false,
  "groupe": null,
  "phrase": "La chevêchette niche parfois dans une loge de pic tridactyle.",
  "statut": "rare",
  "sources": [
   "oiseaux.net (Chevêchette d'Europe)"
  ]
 },
 {
  "id": "LE124",
  "a": "Aigle de Bonelli",
  "b": "Choucas des tours",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "L'aigle de Bonelli mange souvent le choucas.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Aigle de Bonelli)",
   "Wikipédia EN (Bonelli's eagle)"
  ]
 },
 {
  "id": "LE125",
  "a": "Aigle de Bonelli",
  "b": "Pie bavarde",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "En Provence, l'aigle de Bonelli mange souvent la pie.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia EN (Bonelli's eagle)",
   "oiseaux.net (Aigle de Bonelli)"
  ]
 },
 {
  "id": "LE126",
  "a": "Aigle de Bonelli",
  "b": "Lézard ocellé",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "L'aigle de Bonelli mange souvent le lézard ocellé.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Aigle de Bonelli)",
   "oiseaux.net (Aigle de Bonelli)"
  ]
 },
 {
  "id": "LE127",
  "a": "Grèbe huppé",
  "b": "Gardon",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "Le gardon compte parmi les poissons favoris du grèbe huppé.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Grèbe huppé)",
   "oiseaux.net (Grèbe huppé)"
  ]
 },
 {
  "id": "LE128",
  "a": "Grèbe huppé",
  "b": "Ablette",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "L'ablette compte parmi les poissons favoris du grèbe huppé.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Grèbe huppé)",
   "oiseaux.net (Grèbe huppé)"
  ]
 },
 {
  "id": "LE129",
  "a": "Grèbe huppé",
  "b": "Brème commune",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "Le grèbe huppé mange aussi les jeunes brèmes.",
  "statut": "en_jeu",
  "sources": [
   "oiseaux.net (Grèbe huppé)",
   "Wikipédia FR (Grèbe huppé)"
  ]
 },
 {
  "id": "LE130",
  "a": "Grèbe huppé",
  "b": "Perche commune",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "Le grèbe huppé prend aussi de jeunes perches.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Grèbe huppé)"
  ]
 },
 {
  "id": "LE131",
  "a": "Grèbe huppé",
  "b": "Grenouille verte",
  "role": "mange",
  "typique": false,
  "groupe": "grenouilles",
  "phrase": "Le grèbe huppé prend parfois une petite grenouille.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Grèbe huppé)",
   "oiseaux.net (Grèbe huppé)"
  ]
 },
 {
  "id": "LE132",
  "a": "Grèbe huppé",
  "b": "Grenouille rieuse",
  "role": "mange",
  "typique": false,
  "groupe": "grenouilles",
  "phrase": "Le grèbe huppé prend parfois une petite grenouille.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Grèbe huppé)",
   "oiseaux.net (Grèbe huppé)"
  ]
 },
 {
  "id": "LE133",
  "a": "Grèbe huppé",
  "b": "Grenouille rousse",
  "role": "mange",
  "typique": false,
  "groupe": "grenouilles",
  "phrase": "Le grèbe huppé prend parfois une petite grenouille.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Grèbe huppé)",
   "oiseaux.net (Grèbe huppé)"
  ]
 },
 {
  "id": "LE134",
  "a": "Grande aigrette",
  "b": "Rat musqué",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "La grande aigrette capture parfois de jeunes rats musqués.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Grande Aigrette)"
  ]
 },
 {
  "id": "LE135",
  "a": "Grande aigrette",
  "b": "Musaraigne musette",
  "role": "mange",
  "typique": false,
  "groupe": "musaraignes",
  "phrase": "La grande aigrette capture aussi des musaraignes.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Grande Aigrette)"
  ]
 },
 {
  "id": "LE136",
  "a": "Mésange charbonnière",
  "b": "Pipistrelle commune",
  "role": "mange",
  "typique": false,
  "groupe": "chauves-souris",
  "phrase": "En hiver, la mésange charbonnière surprend parfois une pipistrelle endormie.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Mésange charbonnière)",
   "Wikipédia EN (Great tit)"
  ]
 },
 {
  "id": "LE137",
  "a": "Pie-grièche écorcheur",
  "b": "Campagnol des champs",
  "role": "mange",
  "typique": false,
  "groupe": "campagnols",
  "phrase": "La pie-grièche écorcheur prend parfois un jeune campagnol.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Pie-grièche écorcheur)",
   "oiseaux.net (Pie-grièche écorcheur)"
  ]
 },
 {
  "id": "LE138",
  "a": "Pie-grièche écorcheur",
  "b": "Campagnol agreste",
  "role": "mange",
  "typique": false,
  "groupe": "campagnols",
  "phrase": "La pie-grièche écorcheur prend parfois un jeune campagnol.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Pie-grièche écorcheur)",
   "oiseaux.net (Pie-grièche écorcheur)"
  ]
 },
 {
  "id": "LE139",
  "a": "Pie-grièche écorcheur",
  "b": "Lézard des murailles",
  "role": "mange",
  "typique": false,
  "groupe": "lézards",
  "phrase": "La pie-grièche écorcheur prend parfois un petit lézard.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Pie-grièche écorcheur)",
   "oiseaux.net (Pie-grièche écorcheur)"
  ]
 },
 {
  "id": "LE140",
  "a": "Coucou gris",
  "b": "Rousserolle effarvatte",
  "role": "pond_dans_le_nid_de",
  "typique": true,
  "groupe": null,
  "phrase": "Le coucou pond souvent chez la rousserolle effarvatte.",
  "statut": "doublon_classeur",
  "sources": [
   "oiseaux.net (Coucou gris)",
   "INPN (Cahiers d'habitat, Coucou gris)"
  ]
 },
 {
  "id": "LE141",
  "a": "Coucou gris",
  "b": "Rougegorge familier",
  "role": "pond_dans_le_nid_de",
  "typique": true,
  "groupe": null,
  "phrase": "Le coucou pond souvent dans le nid du rougegorge.",
  "statut": "en_jeu",
  "sources": [
   "oiseaux.net (Coucou gris)",
   "INPN (Cahiers d'habitat, Coucou gris)"
  ]
 },
 {
  "id": "LE142",
  "a": "Coucou gris",
  "b": "Accenteur mouchet",
  "role": "pond_dans_le_nid_de",
  "typique": true,
  "groupe": null,
  "phrase": "Le coucou pond souvent dans le nid de l'accenteur mouchet.",
  "statut": "en_jeu",
  "sources": [
   "INPN (Cahiers d'habitat, Coucou gris)",
   "Wikipédia EN (Common cuckoo)"
  ]
 },
 {
  "id": "LE143",
  "a": "Coucou gris",
  "b": "Bergeronnette grise",
  "role": "pond_dans_le_nid_de",
  "typique": true,
  "groupe": "bergeronnettes",
  "phrase": "Le coucou pond souvent chez la bergeronnette grise.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Coucou gris)",
   "Wikipédia EN (Common cuckoo)"
  ]
 },
 {
  "id": "LE144",
  "a": "Coucou gris",
  "b": "Rousserolle turdoïde",
  "role": "pond_dans_le_nid_de",
  "typique": true,
  "groupe": null,
  "phrase": "Le coucou pond aussi chez la rousserolle turdoïde.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Coucou gris)",
   "Wikipédia EN (Common cuckoo)"
  ]
 },
 {
  "id": "LE145",
  "a": "Coucou gris",
  "b": "Bergeronnette des ruisseaux",
  "role": "pond_dans_le_nid_de",
  "typique": false,
  "groupe": "bergeronnettes",
  "phrase": "Le coucou pond parfois chez la bergeronnette des ruisseaux.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Coucou gris)",
   "Wikipédia EN (Common cuckoo)"
  ]
 },
 {
  "id": "LE146",
  "a": "Coucou gris",
  "b": "Rougequeue noir",
  "role": "pond_dans_le_nid_de",
  "typique": false,
  "groupe": null,
  "phrase": "Le coucou pond parfois dans le nid du rougequeue noir.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Coucou gris)"
  ]
 },
 {
  "id": "LE147",
  "a": "Coucou gris",
  "b": "Rougequeue à front blanc",
  "role": "pond_dans_le_nid_de",
  "typique": false,
  "groupe": null,
  "phrase": "Au nord, le coucou parasite le rougequeue à front blanc.",
  "statut": "rare",
  "sources": [
   "Wikipédia EN (Common cuckoo)"
  ]
 },
 {
  "id": "LE148",
  "a": "Coucou gris",
  "b": "Fauvette des jardins",
  "role": "pond_dans_le_nid_de",
  "typique": false,
  "groupe": null,
  "phrase": "Le coucou pond parfois chez la fauvette des jardins.",
  "statut": "rare",
  "sources": [
   "Wikipédia EN (Common cuckoo)"
  ]
 },
 {
  "id": "LE149",
  "a": "Coucou gris",
  "b": "Pie-grièche écorcheur",
  "role": "pond_dans_le_nid_de",
  "typique": false,
  "groupe": null,
  "phrase": "Le coucou pond rarement chez la pie-grièche écorcheur.",
  "statut": "rare",
  "sources": [
   "Wikipédia EN (Common cuckoo)"
  ]
 },
 {
  "id": "LE150",
  "a": "Coucou gris",
  "b": "Linotte mélodieuse",
  "role": "pond_dans_le_nid_de",
  "typique": false,
  "groupe": null,
  "phrase": "Chez la linotte, le jeune coucou ne survit pas.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Coucou gris)"
  ]
 },
 {
  "id": "LE151",
  "a": "Martin-pêcheur d'Europe",
  "b": "Vairon",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "Le vairon est une proie typique du martin-pêcheur.",
  "statut": "doublon_classeur",
  "sources": [
   "oiseaux.net (Martin-pêcheur d'Europe)",
   "Wikipédia EN (Common kingfisher)"
  ]
 },
 {
  "id": "LE152",
  "a": "Martin-pêcheur d'Europe",
  "b": "Gardon",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "Les petits gardons sont des proies typiques du martin-pêcheur.",
  "statut": "en_jeu",
  "sources": [
   "oiseaux.net (Martin-pêcheur d'Europe)",
   "Wikipédia EN (Common kingfisher)"
  ]
 },
 {
  "id": "LE153",
  "a": "Martin-pêcheur d'Europe",
  "b": "Truite fario",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "Les jeunes truites sont des proies typiques du martin-pêcheur.",
  "statut": "en_jeu",
  "sources": [
   "oiseaux.net (Martin-pêcheur d'Europe)",
   "Wikipédia EN (Common kingfisher)"
  ]
 },
 {
  "id": "LE154",
  "a": "Martin-pêcheur d'Europe",
  "b": "Épinochette",
  "role": "mange",
  "typique": false,
  "groupe": "épinoches",
  "phrase": "Le martin-pêcheur attrape aussi des épinoches.",
  "statut": "rare",
  "sources": [
   "Wikipédia EN (Common kingfisher)"
  ]
 },
 {
  "id": "LE155",
  "a": "Martin-pêcheur d'Europe",
  "b": "Vandoise",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "Le martin-pêcheur attrape aussi des vandoises.",
  "statut": "rare",
  "sources": [
   "oiseaux.net (Martin-pêcheur d'Europe)"
  ]
 },
 {
  "id": "LE156",
  "a": "Martin-pêcheur d'Europe",
  "b": "Rotengle",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "Le martin-pêcheur attrape aussi de petits rotengles.",
  "statut": "rare",
  "sources": [
   "oiseaux.net (Martin-pêcheur d'Europe)"
  ]
 },
 {
  "id": "LE157",
  "a": "Martin-pêcheur d'Europe",
  "b": "Lamproie de Planer",
  "role": "mange",
  "typique": false,
  "groupe": "lamproies",
  "phrase": "Le martin-pêcheur a été vu attraper des lamproies.",
  "statut": "rare",
  "sources": [
   "Wikipédia EN (Common kingfisher)"
  ]
 },
 {
  "id": "LE158",
  "a": "Héron cendré",
  "b": "Grenouille verte",
  "role": "mange",
  "typique": false,
  "groupe": "grenouilles",
  "phrase": "Les grenouilles font partie des repas habituels du héron cendré.",
  "statut": "rare",
  "sources": [
   "oiseaux.net (Héron cendré)",
   "Universalis (article Héron)"
  ]
 },
 {
  "id": "LE159",
  "a": "Héron cendré",
  "b": "Grenouille rousse",
  "role": "mange",
  "typique": false,
  "groupe": "grenouilles",
  "phrase": "Les grenouilles font partie des repas habituels du héron cendré.",
  "statut": "rare",
  "sources": [
   "oiseaux.net (Héron cendré)",
   "Universalis (article Héron)"
  ]
 },
 {
  "id": "LE160",
  "a": "Héron cendré",
  "b": "Crossope aquatique",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "Le héron cendré capture parfois une musaraigne aquatique.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Héron cendré)",
   "oiseaux.net (Héron cendré)"
  ]
 },
 {
  "id": "LE161",
  "a": "Héron cendré",
  "b": "Couleuvre helvétique",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "Le héron cendré capture parfois une couleuvre helvétique.",
  "statut": "rare",
  "sources": [
   "oiseaux.net (Héron cendré)"
  ]
 },
 {
  "id": "LE162",
  "a": "Héron cendré",
  "b": "Anguille européenne",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "Le héron cendré avale parfois de grandes anguilles.",
  "statut": "rare",
  "sources": [
   "Wikipédia EN (Grey heron)"
  ]
 },
 {
  "id": "LE163",
  "a": "Héron cendré",
  "b": "Canard colvert",
  "role": "mange",
  "typique": false,
  "groupe": "canetons",
  "phrase": "Le héron cendré capture parfois un caneton.",
  "statut": "rare",
  "sources": [
   "Wikipédia EN (Grey heron)"
  ]
 },
 {
  "id": "LE164",
  "a": "Héron cendré",
  "b": "Triton crêté",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "Le héron cendré attrape aussi des tritons.",
  "statut": "rare",
  "sources": [
   "Wikipédia EN (Grey heron)"
  ]
 },
 {
  "id": "LE165",
  "a": "Héron cendré",
  "b": "Triton ponctué",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "Le héron cendré attrape aussi des tritons.",
  "statut": "rare",
  "sources": [
   "Wikipédia EN (Grey heron)"
  ]
 },
 {
  "id": "LE166",
  "a": "Grèbe castagneux",
  "b": "Gardon",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "Le grèbe castagneux pêche de tout petits gardons.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Grèbe castagneux)"
  ]
 },
 {
  "id": "LE167",
  "a": "Grèbe castagneux",
  "b": "Ablette",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "Le grèbe castagneux pêche de toutes petites ablettes.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Grèbe castagneux)"
  ]
 },
 {
  "id": "LE168",
  "a": "Grèbe castagneux",
  "b": "Épinoche",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "Le grèbe castagneux pêche aussi des épinoches.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Grèbe castagneux)"
  ]
 },
 {
  "id": "LE169",
  "a": "Grèbe castagneux",
  "b": "Perche commune",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "Le grèbe castagneux pêche de toutes jeunes perches.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Grèbe castagneux)"
  ]
 },
 {
  "id": "LE170",
  "a": "Grèbe castagneux",
  "b": "Carpe commune",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "Le grèbe castagneux pêche de toutes jeunes carpes.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Grèbe castagneux)"
  ]
 },
 {
  "id": "LE171",
  "a": "Huppe fasciée",
  "b": "Pic vert",
  "role": "niche_dans_le_vieux_nid_de",
  "typique": true,
  "groupe": null,
  "phrase": "La huppe reprend souvent une vieille loge de pic vert.",
  "statut": "en_jeu",
  "sources": [
   "oiseaux.net (Huppe fasciée)",
   "Wikipédia FR (Huppe fasciée)"
  ]
 },
 {
  "id": "LE172",
  "a": "Geai des chênes",
  "b": "Fauvette à tête noire",
  "role": "mange",
  "typique": false,
  "groupe": "fauvettes",
  "phrase": "Au printemps, le geai pille parfois les nids de fauvettes.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Geai des chênes)"
  ]
 },
 {
  "id": "LE173",
  "a": "Geai des chênes",
  "b": "Fauvette des jardins",
  "role": "mange",
  "typique": false,
  "groupe": "fauvettes",
  "phrase": "Au printemps, le geai pille parfois les nids de fauvettes.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Geai des chênes)"
  ]
 },
 {
  "id": "LE174",
  "a": "Corneille noire",
  "b": "Foulque macroule",
  "role": "mange",
  "typique": true,
  "groupe": "œufs de foulque",
  "phrase": "Au printemps, la corneille pille souvent les œufs de foulque.",
  "statut": "sans_lieu_commun",
  "sources": [
   "oiseaux.net (Corneille noire)",
   "Wikipédia FR (Corneille noire)"
  ]
 },
 {
  "id": "LE175",
  "a": "Corneille noire",
  "b": "Canard colvert",
  "role": "mange",
  "typique": false,
  "groupe": "œufs de canard",
  "phrase": "La corneille pille parfois les nichées de canards.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Corneille noire)"
  ]
 },
 {
  "id": "LE176",
  "a": "Corneille noire",
  "b": "Perdrix grise",
  "role": "mange",
  "typique": false,
  "groupe": "œufs de perdrix",
  "phrase": "La corneille pille parfois les nichées de perdrix.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Corneille noire)"
  ]
 },
 {
  "id": "LE177",
  "a": "Corneille noire",
  "b": "Campagnol agreste",
  "role": "mange",
  "typique": false,
  "groupe": "campagnols",
  "phrase": "La corneille suit les charrues et attrape parfois des campagnols.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Corneille noire)"
  ]
 },
 {
  "id": "LE178",
  "a": "Corneille noire",
  "b": "Alouette des champs",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "La corneille capture parfois une alouette.",
  "statut": "rare",
  "sources": [
   "oiseaux.net (Corneille noire)"
  ]
 },
 {
  "id": "LE179",
  "a": "Héron garde-bœufs",
  "b": "Mulot sylvestre",
  "role": "mange",
  "typique": true,
  "groupe": "mulots",
  "phrase": "En hiver, le héron garde-bœufs chasse aussi les mulots.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Héron garde-bœufs)",
   "oiseaux.net (Héron garde-bœufs)"
  ]
 },
 {
  "id": "LE180",
  "a": "Héron garde-bœufs",
  "b": "Campagnol des champs",
  "role": "mange",
  "typique": false,
  "groupe": "campagnols",
  "phrase": "En hiver, le héron garde-bœufs prend aussi des campagnols.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Héron garde-bœufs)"
  ]
 },
 {
  "id": "LE181",
  "a": "Héron garde-bœufs",
  "b": "Campagnol agreste",
  "role": "mange",
  "typique": false,
  "groupe": "campagnols",
  "phrase": "En hiver, le héron garde-bœufs prend aussi des campagnols.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Héron garde-bœufs)"
  ]
 },
 {
  "id": "LE182",
  "a": "Héron garde-bœufs",
  "b": "Musaraigne musette",
  "role": "mange",
  "typique": false,
  "groupe": "musaraignes",
  "phrase": "Le héron garde-bœufs prend aussi des musaraignes.",
  "statut": "rare",
  "sources": [
   "oiseaux.net (Héron garde-bœufs)"
  ]
 },
 {
  "id": "LE183",
  "a": "Héron garde-bœufs",
  "b": "Grenouille verte",
  "role": "mange",
  "typique": false,
  "groupe": "grenouilles",
  "phrase": "Le héron garde-bœufs attrape aussi des grenouilles.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Héron garde-bœufs)"
  ]
 },
 {
  "id": "LE184",
  "a": "Grand corbeau",
  "b": "Mouette tridactyle",
  "role": "mange",
  "typique": false,
  "groupe": "œufs et poussins",
  "phrase": "Le grand corbeau pille parfois les nids des mouettes tridactyles.",
  "statut": "rare",
  "sources": [
   "oiseaux.net (Grand corbeau)"
  ]
 },
 {
  "id": "LE185",
  "a": "Goéland leucophée",
  "b": "Pigeon biset",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "Le goéland leucophée capture parfois un pigeon biset.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Goéland leucophée)"
  ]
 },
 {
  "id": "LE186",
  "a": "Goéland leucophée",
  "b": "Martinet noir",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "Le goéland leucophée capture parfois un martinet noir.",
  "statut": "sans_lieu_commun",
  "sources": [
   "Wikipédia FR (Goéland leucophée)"
  ]
 },
 {
  "id": "LE187",
  "a": "Goéland leucophée",
  "b": "Surmulot",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "Le goéland leucophée capture parfois un rat surmulot.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Goéland leucophée)"
  ]
 },
 {
  "id": "LE188",
  "a": "Goéland leucophée",
  "b": "Sterne pierregarin",
  "role": "mange",
  "typique": false,
  "groupe": "sternes",
  "phrase": "Le goéland leucophée pille parfois les colonies de sternes.",
  "statut": "rare",
  "sources": [
   "oiseaux.net (Goéland leucophée)"
  ]
 },
 {
  "id": "LE189",
  "a": "Goéland leucophée",
  "b": "Campagnol amphibie",
  "role": "mange",
  "typique": false,
  "groupe": "campagnols",
  "phrase": "Le goéland leucophée prend parfois des campagnols.",
  "statut": "rare",
  "sources": [
   "oiseaux.net (Goéland leucophée)"
  ]
 },
 {
  "id": "LE190",
  "a": "Grèbe à cou noir",
  "b": "Mouette rieuse",
  "role": "autre",
  "typique": true,
  "groupe": null,
  "phrase": "Le grèbe à cou noir niche parmi les mouettes rieuses.",
  "statut": "en_jeu",
  "sources": [
   "oiseaux.net (Grèbe à cou noir)",
   "Wikipédia FR (Grèbe à cou noir)"
  ]
 },
 {
  "id": "LE191",
  "a": "Grèbe à cou noir",
  "b": "Guifette moustac",
  "role": "autre",
  "typique": true,
  "groupe": null,
  "phrase": "Le grèbe à cou noir niche parmi les guifettes moustacs.",
  "statut": "en_jeu",
  "sources": [
   "oiseaux.net (Grèbe à cou noir)",
   "Wikipédia FR (Grèbe à cou noir)"
  ]
 },
 {
  "id": "LE192",
  "a": "Cigogne blanche",
  "b": "Campagnol terrestre",
  "role": "mange",
  "typique": true,
  "groupe": "campagnols",
  "phrase": "Les campagnols comptent parmi les proies favorites de la cigogne.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Cigogne blanche)",
   "Wikipédia EN (White stork)"
  ]
 },
 {
  "id": "LE193",
  "a": "Cigogne blanche",
  "b": "Campagnol amphibie",
  "role": "mange",
  "typique": true,
  "groupe": "campagnols",
  "phrase": "Les campagnols comptent parmi les proies favorites de la cigogne.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Cigogne blanche)",
   "Wikipédia EN (White stork)"
  ]
 },
 {
  "id": "LE194",
  "a": "Cigogne blanche",
  "b": "Grenouille verte",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "La grenouille verte est une proie classique de la cigogne.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia EN (White stork)",
   "Wikipédia FR (Cigogne blanche)"
  ]
 },
 {
  "id": "LE195",
  "a": "Cigogne blanche",
  "b": "Grenouille rousse",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "La grenouille rousse figure aussi au menu de la cigogne.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Cigogne blanche)",
   "Wikipédia EN (White stork)"
  ]
 },
 {
  "id": "LE196",
  "a": "Moineau friquet",
  "b": "Cigogne blanche",
  "role": "loge_chez",
  "typique": true,
  "groupe": null,
  "phrase": "Le moineau friquet niche souvent dans le nid de cigogne.",
  "statut": "doublon_classeur",
  "sources": [
   "Wikipédia FR (Cigogne blanche)",
   "Wikipédia EN (White stork)"
  ]
 },
 {
  "id": "LE197",
  "a": "Moineau domestique",
  "b": "Cigogne blanche",
  "role": "loge_chez",
  "typique": true,
  "groupe": null,
  "phrase": "Le moineau domestique niche souvent dans le nid de cigogne.",
  "statut": "sans_lieu_commun",
  "sources": [
   "Wikipédia FR (Cigogne blanche)",
   "Wikipédia EN (White stork)"
  ]
 },
 {
  "id": "LE198",
  "a": "Étourneau sansonnet",
  "b": "Cigogne blanche",
  "role": "loge_chez",
  "typique": true,
  "groupe": null,
  "phrase": "L'étourneau niche souvent dans le grand nid de la cigogne.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Cigogne blanche)",
   "Wikipédia EN (White stork)"
  ]
 },
 {
  "id": "LE199",
  "a": "Faucon crécerelle",
  "b": "Cigogne blanche",
  "role": "loge_chez",
  "typique": false,
  "groupe": null,
  "phrase": "Le crécerelle niche parfois dans le nid d'une cigogne.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Cigogne blanche)"
  ]
 },
 {
  "id": "LE200",
  "a": "Chevêche d'Athéna",
  "b": "Cigogne blanche",
  "role": "loge_chez",
  "typique": false,
  "groupe": null,
  "phrase": "La chevêche niche parfois dans le nid d'une cigogne.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Cigogne blanche)"
  ]
 },
 {
  "id": "LE201",
  "a": "Corbeau freux",
  "b": "Campagnol des champs",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "Le corbeau freux prend parfois un campagnol des champs.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Corbeau freux)"
  ]
 },
 {
  "id": "LE202",
  "a": "Corbeau freux",
  "b": "Alouette des champs",
  "role": "mange",
  "typique": false,
  "groupe": "oisillons au sol",
  "phrase": "Le corbeau freux prend parfois les oisillons d'alouette au nid.",
  "statut": "rare",
  "sources": [
   "oiseaux.net (Corbeau freux)",
   "Wikipédia FR (Corbeau freux)"
  ]
 },
 {
  "id": "LE203",
  "a": "Harle bièvre",
  "b": "Perche commune",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "Le harle bièvre pêche aussi des perches.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Harle bièvre)"
  ]
 },
 {
  "id": "LE204",
  "a": "Harle bièvre",
  "b": "Brochet",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "Le harle bièvre pêche aussi de jeunes brochets.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Harle bièvre)"
  ]
 },
 {
  "id": "LE205",
  "a": "Harle bièvre",
  "b": "Carpe commune",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "Le harle bièvre pêche aussi de jeunes carpes.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Harle bièvre)"
  ]
 },
 {
  "id": "LE206",
  "a": "Pie-grièche grise",
  "b": "Campagnol agreste",
  "role": "mange",
  "typique": true,
  "groupe": "campagnols",
  "phrase": "Les campagnols sont la proie principale de la pie-grièche grise.",
  "statut": "en_jeu",
  "sources": [
   "oiseaux.net (Pie-grièche grise)",
   "Wikipédia FR (Pie-grièche grise)"
  ]
 },
 {
  "id": "LE207",
  "a": "Pie-grièche grise",
  "b": "Campagnol provençal",
  "role": "mange",
  "typique": true,
  "groupe": "campagnols",
  "phrase": "Les campagnols sont la proie principale de la pie-grièche grise.",
  "statut": "en_jeu",
  "sources": [
   "oiseaux.net (Pie-grièche grise)",
   "Wikipédia FR (Pie-grièche grise)"
  ]
 },
 {
  "id": "LE208",
  "a": "Pie-grièche grise",
  "b": "Lézard des souches",
  "role": "mange",
  "typique": false,
  "groupe": "lézards",
  "phrase": "Quand l'occasion se présente, la pie-grièche grise prend un lézard.",
  "statut": "rare",
  "sources": [
   "oiseaux.net (Pie-grièche grise)"
  ]
 },
 {
  "id": "LE209",
  "a": "Crabier chevelu",
  "b": "Grenouille verte",
  "role": "mange",
  "typique": true,
  "groupe": "grenouilles",
  "phrase": "Les grenouilles sont les proies favorites du crabier chevelu.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Crabier chevelu)",
   "Wikipédia EN (Squacco heron)"
  ]
 },
 {
  "id": "LE210",
  "a": "Crabier chevelu",
  "b": "Grenouille rieuse",
  "role": "mange",
  "typique": true,
  "groupe": "grenouilles",
  "phrase": "Les grenouilles sont les proies favorites du crabier chevelu.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Crabier chevelu)",
   "Wikipédia EN (Squacco heron)"
  ]
 },
 {
  "id": "LE211",
  "a": "Crabier chevelu",
  "b": "Grenouille rousse",
  "role": "mange",
  "typique": true,
  "groupe": "grenouilles",
  "phrase": "Les grenouilles sont les proies favorites du crabier chevelu.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Crabier chevelu)",
   "Wikipédia EN (Squacco heron)"
  ]
 },
 {
  "id": "LE212",
  "a": "Ibis falcinelle",
  "b": "Grenouille verte",
  "role": "mange",
  "typique": false,
  "groupe": "grenouilles",
  "phrase": "Sur les berges, l'ibis falcinelle attrape aussi des grenouilles.",
  "statut": "rare",
  "sources": [
   "oiseaux.net (Ibis falcinelle)"
  ]
 },
 {
  "id": "LE213",
  "a": "Fou de Bassan",
  "b": "Maquereau commun",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "Le maquereau est une proie principale du fou de Bassan.",
  "statut": "doublon_classeur",
  "sources": [
   "Wikipédia FR (Fou de Bassan)",
   "oiseaux.net (Fou de Bassan)"
  ]
 },
 {
  "id": "LE214",
  "a": "Sterne caugek",
  "b": "Lançon",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "Le lançon compte parmi les proies de la sterne caugek.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Sterne caugek)"
  ]
 },
 {
  "id": "LE215",
  "a": "Cigogne noire",
  "b": "Grenouille rousse",
  "role": "mange",
  "typique": false,
  "groupe": "grenouilles",
  "phrase": "La cigogne noire se nourrit beaucoup de grenouilles.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Cigogne noire)"
  ]
 },
 {
  "id": "LE216",
  "a": "Cigogne noire",
  "b": "Grenouille verte",
  "role": "mange",
  "typique": false,
  "groupe": "grenouilles",
  "phrase": "La cigogne noire se nourrit beaucoup de grenouilles.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Cigogne noire)"
  ]
 },
 {
  "id": "LE217",
  "a": "Cigogne noire",
  "b": "Brochet",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "La cigogne noire pêche aussi de jeunes brochets.",
  "statut": "rare",
  "sources": [
   "Wikipédia EN (Black stork)"
  ]
 },
 {
  "id": "LE218",
  "a": "Cigogne noire",
  "b": "Anguille européenne",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "La cigogne noire pêche aussi des anguilles.",
  "statut": "rare",
  "sources": [
   "Wikipédia EN (Black stork)"
  ]
 },
 {
  "id": "LE219",
  "a": "Cigogne noire",
  "b": "Perche commune",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "La cigogne noire pêche aussi des perches.",
  "statut": "rare",
  "sources": [
   "Wikipédia EN (Black stork)"
  ]
 },
 {
  "id": "LE220",
  "a": "Monticole bleu",
  "b": "Lézard des murailles",
  "role": "mange",
  "typique": false,
  "groupe": "petits lézards",
  "phrase": "Le monticole bleu attrape aussi de petits lézards.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Monticole bleu)",
   "oiseaux.net (Monticole bleu)"
  ]
 },
 {
  "id": "LE221",
  "a": "Monticole bleu",
  "b": "Lézard catalan",
  "role": "mange",
  "typique": false,
  "groupe": "petits lézards",
  "phrase": "Le monticole bleu attrape aussi de petits lézards.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Monticole bleu)",
   "oiseaux.net (Monticole bleu)"
  ]
 },
 {
  "id": "LE222",
  "a": "Rollier d'Europe",
  "b": "Lézard vert occidental",
  "role": "mange",
  "typique": true,
  "groupe": "lézards",
  "phrase": "Le rollier capture souvent des lézards au sol.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Rollier d'Europe)",
   "oiseaux.net (Rollier d'Europe)"
  ]
 },
 {
  "id": "LE223",
  "a": "Rollier d'Europe",
  "b": "Pic vert",
  "role": "niche_dans_le_vieux_nid_de",
  "typique": false,
  "groupe": "pics",
  "phrase": "Le rollier niche souvent dans une ancienne loge de pic.",
  "statut": "sans_lieu_commun",
  "sources": [
   "Wikipédia FR (Rollier d'Europe)"
  ]
 },
 {
  "id": "LE224",
  "a": "Goéland marin",
  "b": "Puffin des Anglais",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "Le goéland marin chasse souvent les puffins au sol.",
  "statut": "en_jeu",
  "sources": [
   "oiseaux.net (Goéland marin)",
   "Wikipédia EN (Great black-backed gull)"
  ]
 },
 {
  "id": "LE225",
  "a": "Goéland marin",
  "b": "Océanite tempête",
  "role": "mange",
  "typique": false,
  "groupe": "océanites",
  "phrase": "Le goéland marin ravage parfois les colonies d'océanites.",
  "statut": "rare",
  "sources": [
   "oiseaux.net (Goéland marin)"
  ]
 },
 {
  "id": "LE226",
  "a": "Goéland argenté",
  "b": "Sterne caugek",
  "role": "mange",
  "typique": true,
  "groupe": "sternes",
  "phrase": "Le goéland argenté pille souvent œufs et poussins de sternes.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Goéland argenté)",
   "oiseaux.net (Goéland argenté)"
  ]
 },
 {
  "id": "LE227",
  "a": "Goéland argenté",
  "b": "Guillemot de Troïl",
  "role": "mange",
  "typique": false,
  "groupe": "guillemots",
  "phrase": "Le goéland argenté pille parfois les colonies de guillemots.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Goéland argenté)"
  ]
 },
 {
  "id": "LE228",
  "a": "Mouette tridactyle",
  "b": "Lançon",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "Le lançon est la proie favorite de la mouette tridactyle.",
  "statut": "doublon_classeur",
  "sources": [
   "Wikipédia FR (Mouette tridactyle)",
   "Wikipédia EN (Black-legged kittiwake)"
  ]
 },
 {
  "id": "LE229",
  "a": "Coucou geai",
  "b": "Pie bavarde",
  "role": "pond_dans_le_nid_de",
  "typique": true,
  "groupe": null,
  "phrase": "Le coucou geai pond presque toujours chez la pie.",
  "statut": "sans_lieu_commun",
  "sources": [
   "INPN (Cahiers d'habitat, Coucou geai)",
   "oiseaux.net (Coucou geai)"
  ]
 },
 {
  "id": "LE230",
  "a": "Coucou geai",
  "b": "Corneille noire",
  "role": "pond_dans_le_nid_de",
  "typique": false,
  "groupe": null,
  "phrase": "Le coucou geai pond rarement dans le nid d'une corneille.",
  "statut": "sans_lieu_commun",
  "sources": [
   "INPN (Cahiers d'habitat, Coucou geai)",
   "Wikipédia FR (Coucou geai)"
  ]
 },
 {
  "id": "LE231",
  "a": "Pie-grièche méridionale",
  "b": "Psammodrome d'Edwards",
  "role": "mange",
  "typique": false,
  "groupe": "lézards",
  "phrase": "Les petits lézards comptent beaucoup pour la pie-grièche méridionale.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Pie-grièche méridionale)",
   "oiseaux.net (Pie-grièche méridionale)"
  ]
 },
 {
  "id": "LE232",
  "a": "Pie-grièche méridionale",
  "b": "Lézard catalan",
  "role": "mange",
  "typique": false,
  "groupe": "lézards",
  "phrase": "Les petits lézards comptent beaucoup pour la pie-grièche méridionale.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Pie-grièche méridionale)",
   "oiseaux.net (Pie-grièche méridionale)"
  ]
 },
 {
  "id": "LE233",
  "a": "Couleuvre helvétique",
  "b": "Crapaud commun",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "La couleuvre helvétique mange souvent le crapaud commun.",
  "statut": "doublon_classeur",
  "sources": [
   "https://en.wikipedia.org/wiki/Natrix_helvetica",
   "https://fr.wikipedia.org/wiki/Natrix_natrix"
  ]
 },
 {
  "id": "LE234",
  "a": "Couleuvre helvétique",
  "b": "Grenouille rousse",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "La couleuvre helvétique mange souvent la grenouille rousse.",
  "statut": "en_jeu",
  "sources": [
   "https://en.wikipedia.org/wiki/Natrix_helvetica",
   "https://fr.wikipedia.org/wiki/Natrix_natrix"
  ]
 },
 {
  "id": "LE235",
  "a": "Belette",
  "b": "Campagnol agreste",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "La belette mange surtout les campagnols.",
  "statut": "en_jeu",
  "sources": [
   "https://fr.wikipedia.org/wiki/Mustela_nivalis",
   "https://en.wikipedia.org/wiki/Least_weasel"
  ]
 },
 {
  "id": "LE236",
  "a": "Couleuvre verte et jaune",
  "b": "Lézard des murailles",
  "role": "mange",
  "typique": true,
  "groupe": "lézards",
  "phrase": "La couleuvre verte et jaune mange surtout les lézards.",
  "statut": "en_jeu",
  "sources": [
   "https://fr.wikipedia.org/wiki/Hierophis_viridiflavus",
   "https://www.zobodat.at/pdf/HER_9_3_4_0111-0119.pdf"
  ]
 },
 {
  "id": "LE237",
  "a": "Couleuvre verte et jaune",
  "b": "Lézard vert occidental",
  "role": "mange",
  "typique": true,
  "groupe": "lézards",
  "phrase": "La couleuvre verte et jaune mange surtout les lézards.",
  "statut": "en_jeu",
  "sources": [
   "https://fr.wikipedia.org/wiki/Hierophis_viridiflavus",
   "https://en.wikipedia.org/wiki/Green_whip_snake"
  ]
 },
 {
  "id": "LE238",
  "a": "Couleuvre verte et jaune",
  "b": "Mulot sylvestre",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "La couleuvre verte et jaune mange aussi le mulot sylvestre.",
  "statut": "en_jeu",
  "sources": [
   "https://en.wikipedia.org/wiki/Green_whip_snake",
   "https://www.zobodat.at/pdf/HER_9_3_4_0111-0119.pdf"
  ]
 },
 {
  "id": "LE239",
  "a": "Couleuvre verte et jaune",
  "b": "Couleuvre helvétique",
  "role": "mange",
  "typique": false,
  "groupe": "couleuvres",
  "phrase": "La couleuvre verte et jaune mange parfois la couleuvre helvétique.",
  "statut": "rare",
  "sources": [
   "https://fr.wikipedia.org/wiki/Hierophis_viridiflavus",
   "https://lashf.org/wp-content/uploads/2023/04/BSHF182_NOT3_Routtier-et-Boissinot.pdf"
  ]
 },
 {
  "id": "LE240",
  "a": "Renard roux",
  "b": "Campagnol agreste",
  "role": "mange",
  "typique": true,
  "groupe": "campagnols",
  "phrase": "Le renard mange souvent les campagnols.",
  "statut": "en_jeu",
  "sources": [
   "https://fr.wikipedia.org/wiki/Vulpes_vulpes",
   "https://en.wikipedia.org/wiki/Red_fox"
  ]
 },
 {
  "id": "LE241",
  "a": "Renard roux",
  "b": "Campagnol terrestre",
  "role": "mange",
  "typique": true,
  "groupe": "campagnols",
  "phrase": "Le renard mange souvent les campagnols.",
  "statut": "doublon_classeur",
  "sources": [
   "https://fr.wikipedia.org/wiki/Vulpes_vulpes",
   "https://en.wikipedia.org/wiki/Red_fox"
  ]
 },
 {
  "id": "LE242",
  "a": "Renard roux",
  "b": "Lapin de garenne",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "Le renard mange souvent le lapin de garenne.",
  "statut": "en_jeu",
  "sources": [
   "https://fr.wikipedia.org/wiki/Vulpes_vulpes",
   "https://en.wikipedia.org/wiki/Red_fox"
  ]
 },
 {
  "id": "LE243",
  "a": "Renard roux",
  "b": "Perdrix grise",
  "role": "mange",
  "typique": true,
  "groupe": "perdrix",
  "phrase": "Au printemps, le renard mange souvent les perdrix au nid.",
  "statut": "doublon_classeur",
  "sources": [
   "https://fr.wikipedia.org/wiki/Vulpes_vulpes",
   "https://en.wikipedia.org/wiki/Red_fox"
  ]
 },
 {
  "id": "LE244",
  "a": "Renard roux",
  "b": "Perdrix rouge",
  "role": "mange",
  "typique": true,
  "groupe": "perdrix",
  "phrase": "Au printemps, le renard mange souvent les perdrix au nid.",
  "statut": "en_jeu",
  "sources": [
   "https://fr.wikipedia.org/wiki/Vulpes_vulpes",
   "https://en.wikipedia.org/wiki/Red_fox"
  ]
 },
 {
  "id": "LE245",
  "a": "Renard roux",
  "b": "Canard colvert",
  "role": "mange",
  "typique": false,
  "groupe": "canes",
  "phrase": "Au printemps, le renard mange souvent les canes au nid.",
  "statut": "rare",
  "sources": [
   "https://fr.wikipedia.org/wiki/Vulpes_vulpes",
   "https://en.wikipedia.org/wiki/Red_fox"
  ]
 },
 {
  "id": "LE246",
  "a": "Renard roux",
  "b": "Blaireau européen",
  "role": "loge_chez",
  "typique": true,
  "groupe": null,
  "phrase": "Le renard s'installe souvent dans un terrier de blaireau.",
  "statut": "en_jeu",
  "sources": [
   "https://fr.wikipedia.org/wiki/Vulpes_vulpes",
   "https://en.wikipedia.org/wiki/Red_fox"
  ]
 },
 {
  "id": "LE247",
  "a": "Putois d'Europe",
  "b": "Grenouille rousse",
  "role": "mange",
  "typique": true,
  "groupe": "grenouilles",
  "phrase": "Le putois mange surtout les grenouilles.",
  "statut": "en_jeu",
  "sources": [
   "https://fr.wikipedia.org/wiki/Mustela_putorius",
   "https://en.wikipedia.org/wiki/European_polecat"
  ]
 },
 {
  "id": "LE248",
  "a": "Putois d'Europe",
  "b": "Campagnol amphibie",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "Le putois mange souvent le campagnol amphibie.",
  "statut": "en_jeu",
  "sources": [
   "https://fr.wikipedia.org/wiki/Mustela_putorius",
   "https://en.wikipedia.org/wiki/European_polecat"
  ]
 },
 {
  "id": "LE249",
  "a": "Putois d'Europe",
  "b": "Lapin de garenne",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "Le putois mange souvent le lapin de garenne en été.",
  "statut": "doublon_classeur",
  "sources": [
   "https://fr.wikipedia.org/wiki/Mustela_putorius",
   "https://en.wikipedia.org/wiki/European_polecat"
  ]
 },
 {
  "id": "LE250",
  "a": "Fouine",
  "b": "Surmulot",
  "role": "mange",
  "typique": true,
  "groupe": "rats",
  "phrase": "La fouine mange souvent les rats.",
  "statut": "en_jeu",
  "sources": [
   "https://fr.wikipedia.org/wiki/Martes_foina",
   "https://en.wikipedia.org/wiki/Beech_marten"
  ]
 },
 {
  "id": "LE251",
  "a": "Fouine",
  "b": "Rat noir",
  "role": "mange",
  "typique": true,
  "groupe": "rats",
  "phrase": "La fouine mange souvent les rats.",
  "statut": "en_jeu",
  "sources": [
   "https://fr.wikipedia.org/wiki/Martes_foina",
   "https://en.wikipedia.org/wiki/Beech_marten"
  ]
 },
 {
  "id": "LE252",
  "a": "Fouine",
  "b": "Souris grise",
  "role": "mange",
  "typique": true,
  "groupe": "souris",
  "phrase": "La fouine mange souvent la souris grise.",
  "statut": "en_jeu",
  "sources": [
   "https://fr.wikipedia.org/wiki/Martes_foina",
   "https://en.wikipedia.org/wiki/Beech_marten"
  ]
 },
 {
  "id": "LE253",
  "a": "Blaireau européen",
  "b": "Lapin de garenne",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "Le blaireau mange souvent les jeunes lapins.",
  "statut": "en_jeu",
  "sources": [
   "https://fr.wikipedia.org/wiki/Meles_meles",
   "https://en.wikipedia.org/wiki/European_badger"
  ]
 },
 {
  "id": "LE254",
  "a": "Blaireau européen",
  "b": "Campagnol terrestre",
  "role": "mange",
  "typique": true,
  "groupe": "campagnols",
  "phrase": "Le blaireau mange aussi les campagnols.",
  "statut": "en_jeu",
  "sources": [
   "https://fr.wikipedia.org/wiki/Meles_meles",
   "https://en.wikipedia.org/wiki/European_badger"
  ]
 },
 {
  "id": "LE255",
  "a": "Blaireau européen",
  "b": "Lapin de garenne",
  "role": "autre",
  "typique": false,
  "groupe": null,
  "phrase": "Le lapin loge parfois dans le terrier du blaireau.",
  "statut": "rare",
  "sources": [
   "https://fr.wikipedia.org/wiki/Meles_meles",
   "https://en.wikipedia.org/wiki/European_badger"
  ]
 },
 {
  "id": "LE256",
  "a": "Crossope aquatique",
  "b": "Grenouille rousse",
  "role": "mange",
  "typique": true,
  "groupe": "grenouilles",
  "phrase": "La crossope aquatique mange aussi les grenouilles.",
  "statut": "en_jeu",
  "sources": [
   "https://fr.wikipedia.org/wiki/Neomys_fodiens",
   "https://en.wikipedia.org/wiki/Eurasian_water_shrew"
  ]
 },
 {
  "id": "LE257",
  "a": "Vipère aspic",
  "b": "Mulot sylvestre",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "La vipère aspic mange souvent le mulot sylvestre.",
  "statut": "en_jeu",
  "sources": [
   "https://fr.wikipedia.org/wiki/Vipera_aspis",
   "https://www.zobodat.at/pdf/HER_9_3_4_0111-0119.pdf"
  ]
 },
 {
  "id": "LE258",
  "a": "Couleuvre d'Esculape",
  "b": "Mulot sylvestre",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "La couleuvre d'Esculape mange souvent le mulot sylvestre.",
  "statut": "en_jeu",
  "sources": [
   "https://fr.wikipedia.org/wiki/Zamenis_longissimus",
   "https://www.zobodat.at/pdf/HER_9_3_4_0111-0119.pdf"
  ]
 },
 {
  "id": "LE259",
  "a": "Couleuvre vipérine",
  "b": "Grenouille rieuse",
  "role": "mange",
  "typique": true,
  "groupe": "grenouilles vertes",
  "phrase": "La couleuvre vipérine mange souvent les grenouilles vertes.",
  "statut": "en_jeu",
  "sources": [
   "https://fr.wikipedia.org/wiki/Natrix_maura",
   "https://en.wikipedia.org/wiki/Viperine_water_snake"
  ]
 },
 {
  "id": "LE260",
  "a": "Couleuvre vipérine",
  "b": "Grenouille verte",
  "role": "mange",
  "typique": true,
  "groupe": "grenouilles vertes",
  "phrase": "La couleuvre vipérine mange souvent les grenouilles vertes.",
  "statut": "en_jeu",
  "sources": [
   "https://fr.wikipedia.org/wiki/Natrix_maura",
   "https://en.wikipedia.org/wiki/Viperine_water_snake"
  ]
 },
 {
  "id": "LE261",
  "a": "Coronelle lisse",
  "b": "Lézard des murailles",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "La coronelle lisse mange surtout le lézard des murailles.",
  "statut": "en_jeu",
  "sources": [
   "https://fr.wikipedia.org/wiki/Coronella_austriaca",
   "https://core.ac.uk/download/199281822.pdf"
  ]
 },
 {
  "id": "LE262",
  "a": "Hermine",
  "b": "Campagnol terrestre",
  "role": "mange",
  "typique": true,
  "groupe": "campagnols",
  "phrase": "L'hermine mange surtout les campagnols.",
  "statut": "en_jeu",
  "sources": [
   "https://fr.wikipedia.org/wiki/Mustela_erminea",
   "https://en.wikipedia.org/wiki/Stoat"
  ]
 },
 {
  "id": "LE263",
  "a": "Hermine",
  "b": "Lapin de garenne",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "L'hermine mange souvent le lapin de garenne.",
  "statut": "en_jeu",
  "sources": [
   "https://fr.wikipedia.org/wiki/Mustela_erminea",
   "https://en.wikipedia.org/wiki/Stoat"
  ]
 },
 {
  "id": "LE264",
  "a": "Loutre d'Europe",
  "b": "Anguille européenne",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "La loutre mange souvent l'anguille.",
  "statut": "doublon_classeur",
  "sources": [
   "https://fr.wikipedia.org/wiki/Lutra_lutra",
   "https://hal.sorbonne-universite.fr/hal-03033896/document"
  ]
 },
 {
  "id": "LE265",
  "a": "Loutre d'Europe",
  "b": "Truite fario",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "La loutre mange souvent la truite.",
  "statut": "en_jeu",
  "sources": [
   "https://fr.wikipedia.org/wiki/Lutra_lutra",
   "https://hal.sorbonne-universite.fr/hal-03103485/document"
  ]
 },
 {
  "id": "LE266",
  "a": "Loutre d'Europe",
  "b": "Épinoche",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "La loutre mange souvent l'épinoche.",
  "statut": "en_jeu",
  "sources": [
   "https://fr.wikipedia.org/wiki/Lutra_lutra",
   "https://hal.sorbonne-universite.fr/hal-03103485/document"
  ]
 },
 {
  "id": "LE267",
  "a": "Grenouille rieuse",
  "b": "Grenouille verte",
  "role": "mange",
  "typique": false,
  "groupe": "grenouilles plus petites",
  "phrase": "La grenouille rieuse mange parfois des grenouilles plus petites.",
  "statut": "rare",
  "sources": [
   "https://fr.wikipedia.org/wiki/Pelophylax_ridibundus",
   "https://en.wikipedia.org/wiki/Marsh_frog"
  ]
 },
 {
  "id": "LE268",
  "a": "Grenouille rieuse",
  "b": "Triton palmé",
  "role": "mange",
  "typique": false,
  "groupe": "tritons",
  "phrase": "La grenouille rieuse mange parfois le triton palmé.",
  "statut": "rare",
  "sources": [
   "https://fr.wikipedia.org/wiki/Pelophylax_ridibundus",
   "https://en.wikipedia.org/wiki/Marsh_frog"
  ]
 },
 {
  "id": "LE269",
  "a": "Martre des pins",
  "b": "Campagnol agreste",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "La martre mange souvent le campagnol agreste.",
  "statut": "en_jeu",
  "sources": [
   "https://fr.wikipedia.org/wiki/Martes_martes",
   "https://agris.fao.org/search/fr/records/6748c14f7625988a37208db7"
  ]
 },
 {
  "id": "LE270",
  "a": "Genette commune",
  "b": "Mulot sylvestre",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "La genette mange surtout le mulot sylvestre.",
  "statut": "doublon_classeur",
  "sources": [
   "https://fr.wikipedia.org/wiki/Genetta_genetta",
   "https://en.wikipedia.org/wiki/Common_genet"
  ]
 },
 {
  "id": "LE271",
  "a": "Chat forestier",
  "b": "Mulot sylvestre",
  "role": "mange",
  "typique": true,
  "groupe": "mulots",
  "phrase": "Le chat forestier mange souvent les mulots.",
  "statut": "en_jeu",
  "sources": [
   "https://fr.wikipedia.org/wiki/Chat_forestier",
   "https://en.wikipedia.org/wiki/European_wildcat"
  ]
 },
 {
  "id": "LE272",
  "a": "Chat forestier",
  "b": "Mulot à collier",
  "role": "mange",
  "typique": true,
  "groupe": "mulots",
  "phrase": "Le chat forestier mange souvent les mulots.",
  "statut": "en_jeu",
  "sources": [
   "https://fr.wikipedia.org/wiki/Chat_forestier",
   "https://en.wikipedia.org/wiki/European_wildcat"
  ]
 },
 {
  "id": "LE273",
  "a": "Chat forestier",
  "b": "Campagnol agreste",
  "role": "mange",
  "typique": true,
  "groupe": "campagnols",
  "phrase": "Le chat forestier mange souvent les campagnols.",
  "statut": "en_jeu",
  "sources": [
   "https://fr.wikipedia.org/wiki/Chat_forestier",
   "https://en.wikipedia.org/wiki/European_wildcat"
  ]
 },
 {
  "id": "LE274",
  "a": "Chat forestier",
  "b": "Lapin de garenne",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "Le chat forestier mange souvent le lapin de garenne.",
  "statut": "en_jeu",
  "sources": [
   "https://fr.wikipedia.org/wiki/Chat_forestier",
   "https://en.wikipedia.org/wiki/European_wildcat"
  ]
 },
 {
  "id": "LE275",
  "a": "Grand dauphin",
  "b": "Maquereau commun",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "Le grand dauphin mange souvent le maquereau.",
  "statut": "en_jeu",
  "sources": [
   "https://fr.wikipedia.org/wiki/Tursiops_truncatus",
   "https://en.wikipedia.org/wiki/Common_bottlenose_dolphin"
  ]
 },
 {
  "id": "LE276",
  "a": "Vipère péliade",
  "b": "Campagnol agreste",
  "role": "mange",
  "typique": true,
  "groupe": "campagnols",
  "phrase": "La vipère péliade mange souvent les campagnols.",
  "statut": "en_jeu",
  "sources": [
   "https://fr.wikipedia.org/wiki/Vipera_berus",
   "https://en.wikipedia.org/wiki/Vipera_berus"
  ]
 },
 {
  "id": "LE277",
  "a": "Vipère péliade",
  "b": "Lézard vivipare",
  "role": "mange",
  "typique": false,
  "groupe": "lézards",
  "phrase": "La vipère péliade mange parfois des lézards.",
  "statut": "rare",
  "sources": [
   "https://fr.wikipedia.org/wiki/Vipera_berus",
   "https://en.wikipedia.org/wiki/Vipera_berus"
  ]
 },
 {
  "id": "LE278",
  "a": "Vipère péliade",
  "b": "Grenouille rousse",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "La vipère péliade mange parfois la grenouille rousse.",
  "statut": "sans_lieu_commun",
  "sources": [
   "https://fr.wikipedia.org/wiki/Vipera_berus",
   "https://en.wikipedia.org/wiki/Vipera_berus"
  ]
 },
 {
  "id": "LE279",
  "a": "Lynx boréal",
  "b": "Chamois",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "Le lynx mange souvent le chamois.",
  "statut": "doublon_classeur",
  "sources": [
   "https://fr.wikipedia.org/wiki/Lynx_bor%C3%A9al",
   "https://en.wikipedia.org/wiki/Eurasian_lynx"
  ]
 },
 {
  "id": "LE280",
  "a": "Perche commune",
  "b": "Gardon",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "La perche mange souvent les gardons.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Perche commune)",
   "Wikipédia EN (European perch)"
  ]
 },
 {
  "id": "LE281",
  "a": "Truite fario",
  "b": "Vairon",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "La truite mange souvent les vairons.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Truite fario)",
   "Atlas SHNA-OFAB Bourgogne (Truite fario)"
  ]
 },
 {
  "id": "LE282",
  "a": "Silure glane",
  "b": "Anguille européenne",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "L'anguille fait partie des repas du silure.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Silure glane)",
   "Wikipédia EN (Wels catfish)"
  ]
 },
 {
  "id": "LE283",
  "a": "Silure glane",
  "b": "Pigeon biset",
  "role": "mange",
  "typique": false,
  "groupe": "pigeons",
  "phrase": "Au bord de l'eau, des silures attrapent des pigeons.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Silure glane)",
   "Wikipédia EN (Wels catfish)"
  ]
 },
 {
  "id": "LE284",
  "a": "Grémille",
  "b": "Corégone",
  "role": "mange",
  "typique": false,
  "groupe": null,
  "phrase": "La grémille mange parfois des œufs de corégone.",
  "statut": "sans_lieu_commun",
  "sources": [
   "Wikipédia FR (Grémille)",
   "Wikipédia EN (Eurasian ruffe)"
  ]
 },
 {
  "id": "LE285",
  "a": "Sandre",
  "b": "Gardon",
  "role": "mange",
  "typique": true,
  "groupe": null,
  "phrase": "Le sandre mange souvent les jeunes gardons.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Sandre)",
   "Wikipédia EN (Zander)"
  ]
 },
 {
  "id": "LE286",
  "a": "Maigre",
  "b": "Mulet porc",
  "role": "mange",
  "typique": true,
  "groupe": "mulets",
  "phrase": "Le maigre mange souvent les mulets.",
  "statut": "en_jeu",
  "sources": [
   "Wikipédia FR (Argyrosomus regius)",
   "DORIS (Maigre commun)"
  ]
 },
 {
  "id": "LE287",
  "a": "Baudroie commune",
  "b": "Goéland argenté",
  "role": "mange",
  "typique": false,
  "groupe": "goélands",
  "phrase": "La baudroie attrape parfois un goéland posé sur l'eau.",
  "statut": "rare",
  "sources": [
   "DORIS (Baudroie)",
   "Wikipédia EN (Lophius piscatorius)"
  ]
 },
 {
  "id": "LE288",
  "a": "Scolopendre ceinturée",
  "b": "Lézard des murailles",
  "role": "mange",
  "typique": false,
  "groupe": "lézards",
  "phrase": "La scolopendre mange parfois de jeunes lézards.",
  "statut": "rare",
  "sources": [
   "Wikipédia FR (Scolopendra cingulata)",
   "Wikipédia EN (Scolopendra cingulata)"
  ]
 }
];
