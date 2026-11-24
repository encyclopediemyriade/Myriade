// ============================================================
// LES QUESTIONS COMPARÉES : DONNÉES RELUES — généré depuis Données\comparees_verifiees.xlsx (étape R301)
// Ne pas modifier à la main : on modifie l'Excel, puis on relance Code\Outils\gen_comparees_verifiees.py.
// mange / defense : espèces dont le sujet a été relu (seules montrées dans une comparée) ;
// exclusions : jamais montrée pour ce groupe ou cette défense (groupe vide = tout le sujet).
// ============================================================

const COMPAREES_VERIFIEES = {
 "mange": [
  "Alouette des champs",
  "Anguille européenne",
  "Anodonte des cygnes",
  "Bergeronnette grise",
  "Blaireau européen",
  "Bécassine des marais",
  "Canard colvert",
  "Castor d'Europe",
  "Chevalier guignette",
  "Couleuvre helvétique",
  "Foulque macroule",
  "Gardon",
  "Goéland leucophée",
  "Grand cormoran",
  "Grande aigrette",
  "Grèbe castagneux",
  "Grèbe huppé",
  "Hirondelle de fenêtre",
  "Hirondelle de rivage",
  "Hirondelle rustique",
  "Hérisson d'Europe",
  "Héron cendré",
  "Héron pourpré",
  "Lapin de garenne",
  "Limnée tronquée",
  "Lézard ocellé",
  "Martinet noir",
  "Mouette rieuse",
  "Mulot sylvestre",
  "Musaraigne musette",
  "Patelline des fleuves",
  "Perche commune",
  "Pic mar",
  "Pic noir",
  "Pipistrelle commune",
  "Pipit farlouse",
  "Ragondin",
  "Rat musqué",
  "Rousserolle effarvatte",
  "Sanglier",
  "Autour des palombes",
  "Belette",
  "Bouscarle de Cetti",
  "Bruant des roseaux",
  "Bécasse des bois",
  "Cerf élaphe",
  "Chevreuil",
  "Cisticole des joncs",
  "Cloporte commun",
  "Coucou gris",
  "Couleuvre verte et jaune",
  "Couleuvre vipérine",
  "Crapaud calamite",
  "Crossope aquatique",
  "Faucon crécerelle",
  "Faucon pèlerin",
  "Fuligule milouin",
  "Gallinule poule-d'eau",
  "Grande limnée",
  "Guêpier d'Europe",
  "Lièvre d'Europe",
  "Loutre d'Europe",
  "Lézard des murailles",
  "Lézard vert occidental",
  "Murin de Daubenton",
  "Orvet fragile",
  "Petit gravelot",
  "Pigeon biset",
  "Pipistrelle de Kuhl",
  "Putois d'Europe",
  "Rotengle",
  "Rougequeue noir",
  "Salamandre tachetée",
  "Scutigère véloce",
  "Souris grise",
  "Tarier des prés",
  "Taupe d'Europe",
  "Écrevisse américaine",
  "Écrevisse signal",
  "Étourneau sansonnet",
  "Alyte accoucheur",
  "Aselle",
  "Brochet",
  "Busard des roseaux",
  "Buse variable",
  "Caille des blés",
  "Campagnol des champs",
  "Campagnol roussâtre",
  "Carpe commune",
  "Choucas des tours",
  "Chouette hulotte",
  "Cincle plongeur",
  "Conocéphale gracieux",
  "Corneille noire",
  "Gloméris",
  "Grenouille agile",
  "Grenouille rieuse",
  "Grenouille rousse",
  "Grive draine",
  "Grèbe à cou noir",
  "Guifette moustac",
  "Hermine",
  "Lamproie de Planer",
  "Loche franche",
  "Loir gris",
  "Lombric commun",
  "Lérot",
  "Mante religieuse",
  "Martin-pêcheur d'Europe",
  "Milan noir",
  "Rat des moissons",
  "Renard roux",
  "Rossignol philomèle",
  "Sterne pierregarin",
  "Surmulot",
  "Tanche",
  "Tarier pâtre",
  "Truite fario",
  "Tégénaire des maisons",
  "Écureuil roux",
  "Ablette",
  "Bergeronnette des ruisseaux",
  "Bondrée apivore",
  "Busard Saint-Martin",
  "Campagnol agreste",
  "Campagnol amphibie",
  "Chevêche d'Athéna",
  "Coronelle lisse",
  "Couleuvre d'Esculape",
  "Courlis cendré",
  "Cygne tuberculé",
  "Effraie des clochers",
  "Escargot des haies",
  "Faucheux",
  "Faucon hobereau",
  "Fauvette à tête noire",
  "Gammare",
  "Gorgebleue à miroir",
  "Grillon champêtre",
  "Grimpereau des jardins",
  "Grue cendrée",
  "Hibou moyen-duc",
  "Héron garde-bœufs",
  "Lithobie à pinces",
  "Lézard vivipare",
  "Perche soleil",
  "Petit-duc scops",
  "Pie-grièche écorcheur",
  "Tique du mouton",
  "Torcol fourmilier",
  "Tortue de Floride",
  "Tourterelle des bois",
  "Tourterelle turque",
  "Vairon",
  "Vandoise",
  "Vipère aspic",
  "Zoropsis à pattes épineuses",
  "Écrevisse à pattes blanches",
  "Épervier d'Europe",
  "Œdipode turquoise",
  "Aigrette garzette",
  "Bruant proyer",
  "Butor étoilé",
  "Chabot",
  "Cigogne blanche",
  "Circaète Jean-le-Blanc",
  "Cloporte des murs",
  "Cormoran huppé",
  "Criquet des pâtures",
  "Dectique verrucivore",
  "Dolomède des marais",
  "Fou de Bassan",
  "Fouine",
  "Grand corbeau",
  "Grillon des bois",
  "Grive litorne",
  "Grosbec casse-noyaux",
  "Grémille",
  "Hirondelle de rochers",
  "Huppe fasciée",
  "Huîtrier pie",
  "Lamproie marine",
  "Lycose radiée",
  "Milan royal",
  "Mulot à collier",
  "Musaraigne pygmée",
  "Méduse d'eau douce",
  "Mésange à longue queue",
  "Nette rousse",
  "Perdrix grise",
  "Petit-gris",
  "Philoscie des mousses",
  "Rat noir",
  "Rémiz penduline",
  "Saltique chevronné",
  "Spirlin",
  "Tichodrome échelette",
  "Triton palmé",
  "Échasse blanche",
  "Épeire diadème",
  "Accenteur mouchet",
  "Aigle royal",
  "Alouette lulu",
  "Blongios nain",
  "Bouvière",
  "Brème commune",
  "Bécasseau sanderling",
  "Engoulevent d'Europe",
  "Escargot des jardins",
  "Fauvette grisette",
  "Gendarme",
  "Gobemouche noir",
  "Grande loche",
  "Grande sauterelle verte",
  "Grenouille verte",
  "Harle bièvre",
  "Loriot d'Europe",
  "Lézard des souches",
  "Mangore petite-bouteille",
  "Martinet à ventre blanc",
  "Moineau friquet",
  "Moule zébrée",
  "Musaraigne couronnée",
  "Muscardin",
  "Ombre commun",
  "Perdrix rouge",
  "Pigeon colombin",
  "Pigeon ramier",
  "Pipit des arbres",
  "Pouillot fitis",
  "Roitelet huppé",
  "Rougequeue à front blanc",
  "Sandre",
  "Saumon atlantique",
  "Sterne caugek",
  "Traquet motteux",
  "Vanneau huppé",
  "Vautour fauve",
  "Écrevisse de Louisiane",
  "Élanion blanc",
  "Avocette élégante",
  "Bernache cravant",
  "Bernard-l'ermite",
  "Blageon",
  "Bruant jaune",
  "Busard cendré",
  "Bécasseau variable",
  "Campagnol terrestre",
  "Chevesne",
  "Cigogne noire",
  "Cloporte rugueux",
  "Corbeau freux",
  "Crabier chevelu",
  "Crapaud commun",
  "Crapaud épineux",
  "Crave à bec rouge",
  "Escargot de Bourgogne",
  "Fauvette pitchou",
  "Goujon commun",
  "Goéland brun",
  "Grand-duc d'Europe",
  "Hotu",
  "Iule à pattes blanches",
  "Limace léopard",
  "Mésange noire",
  "Pic vert",
  "Pie bavarde",
  "Pipit spioncelle",
  "Punaise arlequin",
  "Rainette verte",
  "Roitelet à triple bandeau",
  "Rousserolle turdoïde",
  "Serin cini",
  "Silure glane",
  "Spatule blanche",
  "Sterne naine",
  "Triton alpestre",
  "Triton marbré",
  "Épeire des fissures",
  "Épinoche",
  "Accenteur alpin",
  "Barbeau fluviatile",
  "Barge à queue noire",
  "Bec-croisé des sapins",
  "Bihoreau gris",
  "Bouton commun",
  "Bruant fou",
  "Bruant zizi",
  "Chat forestier",
  "Cistude d'Europe",
  "Corbicule asiatique",
  "Criquet ensanglanté",
  "Empuse pennée",
  "Fauvette des jardins",
  "Geai des chênes",
  "Grand gravelot",
  "Grimpereau des bois",
  "Grive musicienne",
  "Lote",
  "Martre des pins",
  "Micrommate émeraude",
  "Mouette tridactyle",
  "Mésange bleue",
  "Mésange huppée",
  "Mésange nonnette",
  "Pic épeichette",
  "Pie-grièche grise",
  "Pinson des arbres",
  "Pipit rousseline",
  "Pouillot véloce",
  "Rollier d'Europe",
  "Rougegorge familier",
  "Soucoupe commune",
  "Spirographe",
  "Tournepierre à collier",
  "Ver du fumier",
  "Vison d'Amérique",
  "Vélelle",
  "Œdicnème criard",
  "Aigle botté",
  "Anémone verte",
  "Argiope frelon",
  "Bouvreuil pivoine",
  "Bruant ortolan",
  "Campagnol souterrain",
  "Chevêchette d'Europe",
  "Chocard à bec jaune",
  "Chouette de Tengmalm",
  "Clausilie commune",
  "Coronelle girondine",
  "Crabe marbré",
  "Decticelle cendrée",
  "Fauvette mélanocéphale",
  "Ibis falcinelle",
  "Merle noir",
  "Merle à plastron",
  "Moineau domestique",
  "Musaraigne des jardins",
  "Mésange charbonnière",
  "Oursin violet",
  "Pie-grièche à tête rousse",
  "Pouillot de Bonelli",
  "Pseudorasbora",
  "Pélodyte ponctué",
  "Seiche commune",
  "Sole commune",
  "Synème globuleux",
  "Tadorne de Belon",
  "Tarin des aulnes",
  "Vautour percnoptère",
  "Blennie fluviatile",
  "Chamois",
  "Congre",
  "Coque commune",
  "Courtilière",
  "Criquet égyptien",
  "Crocidure leucode",
  "Faucon d'Éléonore",
  "Fauvette babillarde",
  "Flamant rose",
  "Genette commune",
  "Goéland marin",
  "Grande alose",
  "Loup gris",
  "Monticole de roche",
  "Mulet porc",
  "Musaraigne carrelet",
  "Mésange boréale",
  "Ormeau",
  "Petit rhinolophe",
  "Pholque phalangide",
  "Pic cendré",
  "Pic épeiche",
  "Pouillot siffleur",
  "Poulpe commun",
  "Puffin de Scopoli",
  "Pélagie",
  "Rainette méridionale",
  "Sangsue médicinale",
  "Sittelle torchepot",
  "Sonneur à ventre jaune",
  "Triton crêté",
  "Triton ponctué",
  "Troglodyte mignon",
  "Bar commun",
  "Barbastelle d'Europe",
  "Barbeau méridional",
  "Bigorneau",
  "Chardonneret élégant",
  "Cigale rouge",
  "Corneille mantelée",
  "Fulmar boréal",
  "Gorgone rouge",
  "Goujon occitan",
  "Goéland argenté",
  "Grand murin",
  "Grand rhinolophe",
  "Gypaète barbu",
  "Gélinotte des bois",
  "Hippocampe moucheté",
  "Hélice des bois",
  "Lagopède alpin",
  "Linotte mélodieuse",
  "Loche de rivière",
  "Marsouin commun",
  "Monticole bleu",
  "Mouflon méditerranéen",
  "Moule commune",
  "Patelle commune",
  "Phoque gris",
  "Phoque veau-marin",
  "Pingouin torda",
  "Raie bouclée",
  "Sauterelle cymbalière",
  "Seps strié",
  "Talitre sauteur",
  "Tarente de Maurétanie",
  "Thomise variable",
  "Troque turbiné",
  "Éphippigère des vignes",
  "Œdipode stridulante",
  "Balbuzard pêcheur",
  "Baudroie commune",
  "Campagnol des Pyrénées",
  "Cigale grise",
  "Cigale plébéienne",
  "Concombre de mer",
  "Crabe bleu",
  "Crabe verruqueux",
  "Discoglosse sarde",
  "Gambusie",
  "Girelle commune",
  "Girelle paon",
  "Goéland d'Audouin",
  "Grand dauphin",
  "Guillemot de Troïl",
  "Limace cendrée",
  "Malmignatte",
  "Martinet pâle",
  "Mourgette",
  "Mulette perlière",
  "Murin à moustaches",
  "Méta des cavernes",
  "Niverolle alpine",
  "Océanite tempête",
  "Omble de fontaine",
  "Oursin noir",
  "Pachyure étrusque",
  "Petite roussette",
  "Psammodrome algire",
  "Pélobate cultripède",
  "Râle des genêts",
  "Scorpion noir à queue jaune",
  "Sérotine commune",
  "Tortue d'Hermann",
  "Vipère péliade",
  "Épinochette",
  "Aigle de Bonelli",
  "Brochet aquitain",
  "Cassenoix moucheté",
  "Coucou geai",
  "Couleuvre de Montpellier",
  "Crabe vert",
  "Crapaud vert",
  "Dauphin bleu et blanc",
  "Daurade royale",
  "Desman des Pyrénées",
  "Euprocte de Corse",
  "Faucon crécerellette",
  "Grande nacre",
  "Huître creuse",
  "Huître plate",
  "Hémidactyle verruqueux",
  "Lançon",
  "Lieu jaune",
  "Lynx boréal",
  "Lézard catalan",
  "Maquereau commun",
  "Miramelle alpestre",
  "Murin de Natterer",
  "Noctule commune",
  "Omble chevalier",
  "Oreillard gris",
  "Oreillard montagnard",
  "Phyllodactyle d'Europe",
  "Pie-grièche méridionale",
  "Raton laveur",
  "Tourteau",
  "Truxale",
  "Venturon montagnard",
  "Verdier d'Europe",
  "Vespère de Savi",
  "Étoile de mer rouge",
  "Apogon",
  "Apron du Rhône",
  "Calotriton des Pyrénées",
  "Campagnol des neiges",
  "Campagnol provençal",
  "Castagnole",
  "Corb",
  "Corégone",
  "Crossope de Miller",
  "Crénilabre paon",
  "Dauphin commun",
  "Discoglosse corse",
  "Esturgeon européen",
  "Grand hamster",
  "Lièvre de Corse",
  "Marmotte des Alpes",
  "Musaraigne alpine",
  "Mygale à chaussette",
  "Mérou brun",
  "Oblade",
  "Perdrix bartavelle",
  "Pic tridactyle",
  "Pipistrelle de Nathusius",
  "Psammodrome d'Edwards",
  "Rascasse brune",
  "Rouget de roche",
  "Saint-Pierre",
  "Sar commun",
  "Sar à tête noire",
  "Saupe",
  "Scorpion languedocien",
  "Serran chevrette",
  "Serran écriture",
  "Sizerin cabaret",
  "Sérotine de Nilsson",
  "Traquet oreillard",
  "Vautour moine",
  "Algyroïde de Fitzinger",
  "Arénicole",
  "Bouquetin des Alpes",
  "Bouquetin ibérique",
  "Cachalot",
  "Cigale de mer",
  "Corail rouge",
  "Couleuvre à échelons",
  "Crapaud vert des Baléares",
  "Crevette grise",
  "Dauphin de Risso",
  "Discoglosse peint",
  "Globicéphale noir",
  "Gobemouche à collier",
  "Grand tétras",
  "Isard",
  "Langouste rouge",
  "Lièvre variable",
  "Lycose de Narbonne",
  "Lézard sicilien",
  "Lézard tyrrhénien",
  "Magicienne dentelée",
  "Maigre",
  "Moineau cisalpin",
  "Murin à oreilles échancrées",
  "Murène",
  "Physalie",
  "Puffin des Anglais",
  "Rainette sarde",
  "Rorqual commun",
  "Salamandre noire",
  "Scolopendre ceinturée",
  "Sittelle corse",
  "Sérotine bicolore",
  "Tortue caouanne",
  "Vieille commune",
  "Vipère d'Orsini",
  "Fauvette de Moltoni",
  "Fauvette sarde",
  "Molosse de Cestoni",
  "Mulette épaisse",
  "Pastenague commune",
  "Pipistrelle pygmée",
  "Requin pèlerin",
  "Salamandre de Corse",
  "Tortue luth",
  "Tétras lyre",
  "Venturon corse",
  "Étourneau unicolore"
 ],
 "defense": [
  "Alouette des champs",
  "Anguille européenne",
  "Anodonte des cygnes",
  "Blaireau européen",
  "Bécassine des marais",
  "Canard colvert",
  "Castor d'Europe",
  "Chevalier guignette",
  "Couleuvre helvétique",
  "Gardon",
  "Goéland leucophée",
  "Grand cormoran",
  "Grande aigrette",
  "Grèbe castagneux",
  "Hirondelle de fenêtre",
  "Hirondelle de rivage",
  "Hirondelle rustique",
  "Héron cendré",
  "Lapin de garenne",
  "Limnée tronquée",
  "Lézard ocellé",
  "Mouette rieuse",
  "Mulot sylvestre",
  "Patelline des fleuves",
  "Perche commune",
  "Pic mar",
  "Pipistrelle commune",
  "Pipit farlouse",
  "Ragondin",
  "Rat musqué",
  "Rousserolle effarvatte",
  "Sanglier",
  "Autour des palombes",
  "Belette",
  "Bouscarle de Cetti",
  "Bécasse des bois",
  "Cerf élaphe",
  "Chevreuil",
  "Cisticole des joncs",
  "Cloporte commun",
  "Coucou gris",
  "Couleuvre verte et jaune",
  "Couleuvre vipérine",
  "Crapaud calamite",
  "Crossope aquatique",
  "Faucon crécerelle",
  "Faucon pèlerin",
  "Fuligule milouin",
  "Grande limnée",
  "Guêpier d'Europe",
  "Lièvre d'Europe",
  "Loutre d'Europe",
  "Lézard des murailles",
  "Lézard vert occidental",
  "Orvet fragile",
  "Petit gravelot",
  "Pigeon biset",
  "Pipistrelle de Kuhl",
  "Putois d'Europe",
  "Rotengle",
  "Rougequeue noir",
  "Salamandre tachetée",
  "Scutigère véloce",
  "Souris grise",
  "Taupe d'Europe",
  "Écrevisse américaine",
  "Écrevisse signal",
  "Étourneau sansonnet",
  "Alyte accoucheur",
  "Brochet",
  "Busard des roseaux",
  "Buse variable",
  "Caille des blés",
  "Campagnol des champs",
  "Campagnol roussâtre",
  "Carpe commune",
  "Choucas des tours",
  "Chouette hulotte",
  "Cincle plongeur",
  "Corneille noire",
  "Gloméris",
  "Grenouille agile",
  "Grenouille rieuse",
  "Grenouille rousse",
  "Grive draine",
  "Grèbe à cou noir",
  "Guifette moustac",
  "Hermine",
  "Lamproie de Planer",
  "Loche franche",
  "Loir gris",
  "Lombric commun",
  "Lérot",
  "Mante religieuse",
  "Martin-pêcheur d'Europe",
  "Rat des moissons",
  "Renard roux",
  "Rossignol philomèle",
  "Sterne pierregarin",
  "Surmulot",
  "Tarier pâtre",
  "Truite fario",
  "Tégénaire des maisons",
  "Écureuil roux",
  "Ablette",
  "Bondrée apivore",
  "Busard Saint-Martin",
  "Campagnol amphibie",
  "Chevêche d'Athéna",
  "Coronelle lisse",
  "Couleuvre d'Esculape",
  "Courlis cendré",
  "Cygne tuberculé",
  "Effraie des clochers",
  "Escargot des haies",
  "Faucheux",
  "Fauvette à tête noire",
  "Gorgebleue à miroir",
  "Grillon champêtre",
  "Grimpereau des jardins",
  "Hibou moyen-duc",
  "Lithobie à pinces",
  "Lézard vivipare",
  "Petit-duc scops",
  "Pie-grièche écorcheur",
  "Torcol fourmilier",
  "Vairon",
  "Vipère aspic",
  "Zoropsis à pattes épineuses",
  "Écrevisse à pattes blanches",
  "Œdipode turquoise",
  "Aigrette garzette",
  "Butor étoilé",
  "Chabot",
  "Cigogne blanche",
  "Cormoran huppé",
  "Criquet des pâtures",
  "Dectique verrucivore",
  "Dolomède des marais",
  "Fou de Bassan",
  "Fouine",
  "Grillon des bois",
  "Grive litorne",
  "Grosbec casse-noyaux",
  "Grémille",
  "Hirondelle de rochers",
  "Huppe fasciée",
  "Huîtrier pie",
  "Lamproie marine",
  "Lycose radiée",
  "Mulot à collier",
  "Méduse d'eau douce",
  "Mésange à longue queue",
  "Perdrix grise",
  "Petit-gris",
  "Philoscie des mousses",
  "Rat noir",
  "Spirlin",
  "Triton palmé",
  "Échasse blanche",
  "Accenteur mouchet",
  "Aigle royal",
  "Blongios nain",
  "Bécasseau sanderling",
  "Engoulevent d'Europe",
  "Escargot des jardins",
  "Gendarme",
  "Grande loche",
  "Grande sauterelle verte",
  "Grenouille verte",
  "Harle bièvre",
  "Lézard des souches",
  "Mangore petite-bouteille",
  "Muscardin",
  "Ombre commun",
  "Perdrix rouge",
  "Pigeon ramier",
  "Roitelet huppé",
  "Saumon atlantique",
  "Sterne caugek",
  "Vautour fauve",
  "Écrevisse de Louisiane",
  "Bernache cravant",
  "Bernard-l'ermite",
  "Blageon",
  "Bécasseau variable",
  "Campagnol terrestre",
  "Cigogne noire",
  "Cloporte rugueux",
  "Crabier chevelu",
  "Crapaud commun",
  "Crapaud épineux",
  "Escargot de Bourgogne",
  "Fauvette pitchou",
  "Goéland brun",
  "Grand-duc d'Europe",
  "Iule à pattes blanches",
  "Pic vert",
  "Pipit spioncelle",
  "Punaise arlequin",
  "Rainette verte",
  "Roitelet à triple bandeau",
  "Spatule blanche",
  "Sterne naine",
  "Triton alpestre",
  "Triton marbré",
  "Épeire des fissures",
  "Barge à queue noire",
  "Bruant zizi",
  "Chat forestier",
  "Cistude d'Europe",
  "Criquet ensanglanté",
  "Empuse pennée",
  "Geai des chênes",
  "Grimpereau des bois",
  "Grive musicienne",
  "Hanneton commun",
  "Lote",
  "Martre des pins",
  "Micrommate émeraude",
  "Mouette tridactyle",
  "Mésange bleue",
  "Pouillot véloce",
  "Rollier d'Europe",
  "Rougegorge familier",
  "Soucoupe commune",
  "Spirographe",
  "Ver du fumier",
  "Vison d'Amérique",
  "Vélelle",
  "Œdicnème criard",
  "Abeille charpentière",
  "Abeille mellifère",
  "Anémone verte",
  "Bourdon terrestre",
  "Carabe doré",
  "Chocard à bec jaune",
  "Cicindèle champêtre",
  "Coccinelle à sept points",
  "Coronelle girondine",
  "Crabe marbré",
  "Fauvette mélanocéphale",
  "Frelon asiatique",
  "Grand capricorne",
  "Merle noir",
  "Oursin violet",
  "Seiche commune",
  "Sole commune",
  "Vautour percnoptère",
  "Ver luisant",
  "Blennie fluviatile",
  "Chamois",
  "Coccinelle asiatique",
  "Congre",
  "Coque commune",
  "Criquet égyptien",
  "Fourmilion",
  "Frelon européen",
  "Genette commune",
  "Goéland marin",
  "Grande alose",
  "Géotrupe du fumier",
  "Loup gris",
  "Lucane cerf-volant",
  "Musaraigne carrelet",
  "Ormeau",
  "Pic cendré",
  "Pisaure admirable",
  "Poulpe commun",
  "Puffin de Scopoli",
  "Pélagie",
  "Rainette méridionale",
  "Sonneur à ventre jaune",
  "Triton crêté",
  "Ascalaphe soufré",
  "Bar commun",
  "Barbastelle d'Europe",
  "Bigorneau",
  "Chardonneret élégant",
  "Fourmi rousse des bois",
  "Fulmar boréal",
  "Gorgone rouge",
  "Goéland argenté",
  "Grand murin",
  "Grand rhinolophe",
  "Gypaète barbu",
  "Gélinotte des bois",
  "Géotrupe des bois",
  "Hippocampe moucheté",
  "Lagopède alpin",
  "Linotte mélodieuse",
  "Loche de rivière",
  "Marsouin commun",
  "Moule commune",
  "Patelle commune",
  "Phoque gris",
  "Phoque veau-marin",
  "Pingouin torda",
  "Raie bouclée",
  "Sauterelle cymbalière",
  "Seps strié",
  "Talitre sauteur",
  "Thomise variable",
  "Troque turbiné",
  "Œdipode stridulante",
  "Baudroie commune",
  "Bourdon des champs",
  "Campagnol des Pyrénées",
  "Carabe à reflets dorés",
  "Cigale grise",
  "Concombre de mer",
  "Crabe bleu",
  "Girelle commune",
  "Girelle paon",
  "Grand dauphin",
  "Guillemot de Troïl",
  "Hanneton foulon",
  "Malmignatte",
  "Mourgette",
  "Murin à moustaches",
  "Niverolle alpine",
  "Océanite tempête",
  "Omble de fontaine",
  "Oursin noir",
  "Pachyure étrusque",
  "Petite biche",
  "Psammodrome algire",
  "Pélobate cultripède",
  "Râle des genêts",
  "Scorpion noir à queue jaune",
  "Tortue d'Hermann",
  "Vipère péliade",
  "Aigle de Bonelli",
  "Anax empereur",
  "Brochet aquitain",
  "Coucou geai",
  "Crabe vert",
  "Crapaud vert",
  "Desman des Pyrénées",
  "Euprocte de Corse",
  "Grande nacre",
  "Lançon",
  "Lieu jaune",
  "Maquereau commun",
  "Murin de Natterer",
  "Omble chevalier",
  "Oreillard montagnard",
  "Phyllodactyle d'Europe",
  "Pie-grièche méridionale",
  "Rhagie inquisitrice",
  "Rosalie des Alpes",
  "Timarque",
  "Truxale",
  "Vespère de Savi",
  "Apogon",
  "Apron du Rhône",
  "Bourdon des pierres",
  "Calotriton des Pyrénées",
  "Campagnol des neiges",
  "Corb",
  "Corégone",
  "Crénilabre paon",
  "Grand hamster",
  "Libellule déprimée",
  "Marmotte des Alpes",
  "Mygale à chaussette",
  "Mérou brun",
  "Oblade",
  "Oreillard roux",
  "Perdrix bartavelle",
  "Psammodrome d'Edwards",
  "Rascasse brune",
  "Saint-Pierre",
  "Sar commun",
  "Saupe",
  "Scorpion languedocien",
  "Serran chevrette",
  "Serran écriture",
  "Arénicole",
  "Bouquetin des Alpes",
  "Bourdon des Alpes",
  "Bourdon des Pyrénées",
  "Cachalot",
  "Cigale de mer",
  "Cordulégastre bidenté",
  "Couleuvre à échelons",
  "Crevette grise",
  "Dauphin de Risso",
  "Globicéphale noir",
  "Langouste rouge",
  "Lièvre variable",
  "Magicienne dentelée",
  "Murène",
  "Physalie",
  "Puffin des Anglais",
  "Rorqual commun",
  "Salamandre noire",
  "Scolopendre ceinturée",
  "Vipère d'Orsini",
  "Aeschne bleue",
  "Agrion de Mercure",
  "Agrion hasté",
  "Caloptéryx vierge",
  "Fourmi moissonneuse",
  "Grenouille des Pyrénées",
  "Pastenague commune",
  "Rhinolophe euryale",
  "Salamandre de Corse",
  "Tortue luth"
 ],
 "exclusions": [
  {
   "espece": "Hérisson d'Europe",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : WP EN « Plant matter [...] negligible part », absent d'ADW"
  },
  {
   "espece": "Hérisson d'Europe",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : WP FR « parfois », WP EN « may also eat »"
  },
  {
   "espece": "Hérisson d'Europe",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP FR « parfois », WP EN « may also eat »"
  },
  {
   "espece": "Hérisson d'Europe",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : WP EN « carcasses may be foraged », absent de WP FR"
  },
  {
   "espece": "Grande aigrette",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : petits oiseaux cités par WP FR seul"
  },
  {
   "espece": "Grande aigrette",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "non tranché : « charognes » seulement dans le tableau d'oiseaux.net, absent des textes"
  },
  {
   "espece": "Foulque macroule",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : œufs d'autres oiseaux d'eau (WP EN, BirdLife), régime surtout végétal"
  },
  {
   "espece": "Foulque macroule",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : petits poissons « to a lesser extent » (Hydrobiologia 2018, BirdLife)"
  },
  {
   "espece": "Foulque macroule",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : cité par BirdLife seul"
  },
  {
   "espece": "Foulque macroule",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : crevettes citées par BirdLife seul"
  },
  {
   "espece": "Foulque macroule",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : larves d'amphibiens « to a lesser extent » (Hydrobiologia 2018, BirdLife)"
  },
  {
   "espece": "Musaraigne musette",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : WP FR « quelques fruits » ; WP EN et ADW : carnivore, invertébrés"
  },
  {
   "espece": "Musaraigne musette",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : WP EN « occasionally small rodents », ADW « may occasionally eat the young of small mammals »"
  },
  {
   "espece": "Musaraigne musette",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP EN « occasionally [...] lizards and small amphibians », ADW « small lizards »"
  },
  {
   "espece": "Sanglier",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP EN seul (abondant seulement Volga et Kazakhstan), absent de WP FR"
  },
  {
   "espece": "Blaireau européen",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : WP EN « Occasionally [...] clover and grass »"
  },
  {
   "espece": "Blaireau européen",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP EN « Occasionally [...] fish »"
  },
  {
   "espece": "Blaireau européen",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP FR « très rarement des œufs », WP EN « Occasionally », « only rarely »"
  },
  {
   "espece": "Blaireau européen",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP EN « Occasionally [...] amphibians [...] small reptiles » ; WP FR grenouilles surtout au frai"
  },
  {
   "espece": "Héron pourpré",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP FR « voire oisillons », oiseaux.net « le cas échéant »"
  },
  {
   "espece": "Héron pourpré",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "non tranché : « charognes » seulement dans le tableau d'oiseaux.net, absent des textes"
  },
  {
   "espece": "Lézard ocellé",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : WP FR < 1 %, WP EN « occasionally »"
  },
  {
   "espece": "Lézard ocellé",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP FR « À l'occasion [...] oisillons », < 1 %"
  },
  {
   "espece": "Lézard ocellé",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP FR < 1 %, WP EN « occasionally takes reptiles [...] frogs »"
  },
  {
   "espece": "Pic noir",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : WP FR « complète », oiseaux.net « À l'occasion »"
  },
  {
   "espece": "Pic noir",
   "sujet": "mange",
   "groupe": "Nectar, pollen et sève",
   "raison": "occasionnel : WP FR « et même de la sève », seule source"
  },
  {
   "espece": "Pic noir",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : oiseaux.net « À l'occasion [...] œufs ou des oisillons », seule source"
  },
  {
   "espece": "Pic mar",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : défense principale non établie (immobilité, ou fuite et loge, selon le prédateur)"
  },
  {
   "espece": "Canard colvert",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel (WP EN : « there are reports of it eating… fish »)"
  },
  {
   "espece": "Canard colvert",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel (WP EN : « reports of it eating frogs » ; têtards dans WP FR)"
  },
  {
   "espece": "Canard colvert",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel (oisillons chassés : deux observations, Roumanie 2017, Nouvelle-Zélande 2026)"
  },
  {
   "espece": "Canard colvert",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel (poissons morts, WP EN)"
  },
  {
   "espece": "Grèbe huppé",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel (oiseaux.net « à l'occasion », BirdLife « occasionally », WP FR « et même des grenouilles »)"
  },
  {
   "espece": "Grèbe huppé",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "occasionnel (oiseaux.net seul)"
  },
  {
   "espece": "Grèbe huppé",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel (oiseaux.net seul)"
  },
  {
   "espece": "Grèbe huppé",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "non tranché : petits oiseaux capturés seulement en observations isolées (Espagne, Chili 1925)"
  },
  {
   "espece": "Anguille européenne",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "occasionnel (WP EN ; zooplancton au stade larvaire, Larousse)"
  },
  {
   "espece": "Anguille européenne",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel (Larousse « à l'occasion »)"
  },
  {
   "espece": "Anguille européenne",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "non tranché : « toute la faune aquatique » (FishBase, Larousse), grenouilles non citées explicitement par une source lue"
  },
  {
   "espece": "Anguille européenne",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "non tranché : WP EN « carrions included » ambigu, Larousse dit proies vivantes ou fraîches"
  },
  {
   "espece": "Ragondin",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel (WP FR « Il peut parfois manger… des écrevisses » ; ADW : herbivore)"
  },
  {
   "espece": "Rousserolle effarvatte",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel (WP FR « plus rarement de fruits, de graines » ; WP EN « occasionally… berries »)"
  },
  {
   "espece": "Rousserolle effarvatte",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "non tranché : « fleurs » mangées rarement (WP FR), sans détail"
  },
  {
   "espece": "Rousserolle effarvatte",
   "sujet": "mange",
   "groupe": "Nectar, pollen et sève",
   "raison": "non tranché : « fleurs » mangées rarement (WP FR), sans détail"
  },
  {
   "espece": "Rousserolle effarvatte",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : camouflage non confirmé, les sources mettent en avant l'abri des roseaux"
  },
  {
   "espece": "Mouette rieuse",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel (Larousse : végétaux en complément)"
  },
  {
   "espece": "Mouette rieuse",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel (Larousse seul)"
  },
  {
   "espece": "Mouette rieuse",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "non tranché : rongeurs signalés à l'occasion par une source non lisible (All About Birds)"
  },
  {
   "espece": "Rat musqué",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel (WP EN : animaux environ 5 % du régime, grenouilles, petites tortues)"
  },
  {
   "espece": "Rat musqué",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel (WP EN : écrevisses dans les 5 % d'animaux)"
  },
  {
   "espece": "Rat musqué",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel (WP FR « À l'occasion… poissons laissés sur la rive » ; WP EN 5 %)"
  },
  {
   "espece": "Limnée tronquée",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "non tranché : plantes fraîches citées par WP EN seul ; Univ. Limoges ne cite que les algues"
  },
  {
   "espece": "Limnée tronquée",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : défense non décrite par deux sources"
  },
  {
   "espece": "Patelline des fleuves",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : camouflage non décrit par les sources"
  },
  {
   "espece": "Grand cormoran",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : « peut aussi » (WP FR), crustacés rares (ADW)"
  },
  {
   "espece": "Grand cormoran",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : « peut aussi » (WP FR), absent de WP EN et ADW"
  },
  {
   "espece": "Grand cormoran",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : petits oiseaux au nid, « peut aussi » (WP FR)"
  },
  {
   "espece": "Pipit farlouse",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : petits crustacés terrestres (cloportes) cités par une seule source"
  },
  {
   "espece": "Gardon",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "non tranché : invertébrés du fond et zooplancton (daphnies) sans détail, crustacés ni confirmés ni exclus"
  },
  {
   "espece": "Lapin de garenne",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : baies et graines en complément ou en période de disette"
  },
  {
   "espece": "Anodonte des cygnes",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "non tranché : les larves (glochidies) vivent en parasites sur les poissons et se nourrissent de leurs tissus, mauvaise réponse à moitié vraie"
  },
  {
   "espece": "Bécassine des marais",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : « parfois aussi graines et baies » (WP FR), « smaller amounts » (ADW)"
  },
  {
   "espece": "Bécassine des marais",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : « quelques petits crustacés » (oiseaux.net), absents de WP EN"
  },
  {
   "espece": "Bécassine des marais",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "non tranché : « some plant material » (WP EN, ADW) sans préciser graines ou feuilles"
  },
  {
   "espece": "Bergeronnette grise",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : cités dans une liste de petites proies par une seule source (WP EN)"
  },
  {
   "espece": "Bergeronnette grise",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : alevins « also been recorded » (WP EN)"
  },
  {
   "espece": "Couleuvre helvétique",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : « some » (WP EN), « rarement » (OFB), « occasionnellement » (karch)"
  },
  {
   "espece": "Couleuvre helvétique",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : oisillons (WP EN), « rarement » oiseaux (OFB)"
  },
  {
   "espece": "Couleuvre helvétique",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : « may occasionally take ants » (WP EN), une seule source"
  },
  {
   "espece": "Castor d'Europe",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : fruits « ajoutés » à un régime de feuilles et d'écorce (WP FR), cultures (ADW)"
  },
  {
   "espece": "Castor d'Europe",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "non tranché : ADW coche « cryptic », aucune autre source"
  },
  {
   "espece": "Goéland leucophée",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "sources en désaccord : « prédateur occasionnel » de rats (WP FR, WP EN « if necessary ») contre campagnols au régime (oiseaux.net)"
  },
  {
   "espece": "Goéland leucophée",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : olives cueillies à Gibraltar (WP EN), restes végétaux dans les pelotes"
  },
  {
   "espece": "Goéland leucophée",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : reptiles cités par une seule étude (Algérie)"
  },
  {
   "espece": "Perche commune",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "juvéniles seulement (zooplancton) : réponse à moitié vraie"
  },
  {
   "espece": "Héron cendré",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : « occasionally takes birds » (WP EN), « et même » (WP FR)"
  },
  {
   "espece": "Héron cendré",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : « et même de végétaux (bourgeons) » (WP FR), une seule source"
  },
  {
   "espece": "Mulot sylvestre",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "part non chiffrée : « grasses » (ADW), plantules (WP FR) ; traité comme occasionnel"
  },
  {
   "espece": "Mulot sylvestre",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : chauves-souris en hibernation, « still debatable » (WP EN)"
  },
  {
   "espece": "Chevalier guignette",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : « plus rarement » (oiseaux.net), « occasionally » (BirdLife)"
  },
  {
   "espece": "Chevalier guignette",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : « plus rarement » (oiseaux.net), « occasionally » (BirdLife)"
  },
  {
   "espece": "Chevalier guignette",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : graines « occasionnelle » (oiseaux.net), « some » (BirdLife)"
  },
  {
   "espece": "Chevalier guignette",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : camouflage de l'adulte non confirmé par les sources"
  },
  {
   "espece": "Lapin de garenne",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "relecture R301 : se fige dans l'herbe, pelage terne ; « non » pas sûr"
  },
  {
   "espece": "Goéland leucophée",
   "sujet": "defense",
   "groupe": "Régurgitation",
   "raison": "relecture R301 : les goélands régurgitent quand on les dérange ; « non » pas sûr"
  },
  {
   "espece": "Goéland leucophée",
   "sujet": "defense",
   "groupe": "Intimidation (se gonfle, siffle)",
   "raison": "relecture R301 : postures et cris de menace au nid ; « non » pas sûr"
  },
  {
   "espece": "Sanglier",
   "sujet": "defense",
   "groupe": "Intimidation (se gonfle, siffle)",
   "raison": "relecture R301 : soies dressées avant la charge ; « non » pas sûr"
  },
  {
   "espece": "Blaireau européen",
   "sujet": "defense",
   "groupe": "Intimidation (se gonfle, siffle)",
   "raison": "relecture R301 : poils hérissés, grognements ; « non » pas sûr"
  },
  {
   "espece": "Canard colvert",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "relecture R301 : plantes d'eau et lentilles, algues non tranchées ; « non » pas sûr"
  },
  {
   "espece": "Mulot sylvestre",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "relecture R301 : prédateur connu de nids au sol ; « non » pas sûr"
  },
  {
   "espece": "Cloporte commun",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : WP EN « living plant matter » ; ADW « Herbivory and carnivory have also been observed »"
  },
  {
   "espece": "Cloporte commun",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : WP EN « they have also been shown to consume seeds (granivory) » ; ADW « seeds are likely only eaten in absence of other [...] food »"
  },
  {
   "espece": "Cloporte commun",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : WP EN « dead animal remains, fungi and dung » ; ADW « during drought periods they adopt more scavenger-like tendencies »"
  },
  {
   "espece": "Cloporte commun",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : ADW « can even cannibalize weaker individuals from the same or different species » (une seule source)"
  },
  {
   "espece": "Cloporte commun",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "non confirmé par WP EN ni ADW ; cité seulement par Woodland Trust et un site de jardinage (« lichen and algae »)"
  },
  {
   "espece": "Étourneau sansonnet",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP EN « will also feed on earthworms, snails, small amphibians and lizards » ; ADW « Foods eaten include seeds, insects, vertebrates »"
  },
  {
   "espece": "Étourneau sansonnet",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP EN « The isolated Azores subspecies [...] eats the eggs of the endangered roseate tern » (une seule source)"
  },
  {
   "espece": "Étourneau sansonnet",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : ADW « carrion (liste des aliments) » ; WP EN « food waste if the opportunity arises »"
  },
  {
   "espece": "Étourneau sansonnet",
   "sujet": "mange",
   "groupe": "Nectar, pollen et sève",
   "raison": "occasionnel : WP EN « can also eat grains, seeds, fruits, nectar and food waste » (une seule source)"
  },
  {
   "espece": "Petit gravelot",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : Cahiers d'habitat Oiseaux (INPN) « voire même quelques graines complètent le régime » (une seule source)"
  },
  {
   "espece": "Scutigère véloce",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "rose : cloportes cités par l'Insectarium de Montréal seul ; WP EN et ADW disent « other arthropods »"
  },
  {
   "espece": "Grande limnée",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "mange des insectes morts (PMC6147449 « carrion, such as dead insects ») : à moitié vrai"
  },
  {
   "espece": "Grande limnée",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "mange des poissons morts (PMC6147449) : à moitié vrai"
  },
  {
   "espece": "Grande limnée",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "mange des écrevisses mortes (PMC6147449) ; préfère les gammares vivants en essai (étude 2016)"
  },
  {
   "espece": "Grande limnée",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "têtards morts (PMC6147449) et œufs d'amphibiens (Hydrobiologia 2016, résumé)"
  },
  {
   "espece": "Grande limnée",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : camouflage cité par WP FR seule"
  },
  {
   "espece": "Couleuvre vipérine",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "rose : cité par WP FR seule ; Koller 1996, LPO et WP EN détaillent sans eux"
  },
  {
   "espece": "Couleuvre vipérine",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "immobilité face au prédateur (PMC6280101) : non tranché"
  },
  {
   "espece": "Tarier des prés",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : WP EN « small amounts of fruit [...] primarily in autumn » ; oiseaux.net « quelques petits fruits »"
  },
  {
   "espece": "Salamandre tachetée",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP EN « also occasionally eat newts and young frogs » ; WP FR « consomment parfois d'autres amphibiens comme des tritons »"
  },
  {
   "espece": "Salamandre tachetée",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "rose : WP FR « organismes invertébrés comme des cloportes » (une seule source)"
  },
  {
   "espece": "Taupe d'Europe",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "rose : WP EN seule « mammals such as rodents » ; WP FR et ADW détaillent sans eux"
  },
  {
   "espece": "Écrevisse américaine",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "rose : WP FR « vers et invertébrés « vivants ou morts » » (une seule source)"
  },
  {
   "espece": "Écrevisse américaine",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "rose : GISD « benthic macro-invertebrates » sans détail ; aucune source lue ne nomme les larves d'insectes"
  },
  {
   "espece": "Écrevisse américaine",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "rose : régime opportuniste, aucune source détaillée"
  },
  {
   "espece": "Écrevisse américaine",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : aucune source propre à l'espèce ne décrit la défense (Ecosphere 2018 : réagit « offensively or defensively » sans détail)"
  },
  {
   "espece": "Faucon pèlerin",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : WP EN « shrews, mice, rats, voles [...] more seldom taken » ; ADW « Bats are the most common mammal prey »"
  },
  {
   "espece": "Faucon pèlerin",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : WP EN « make up a small proportion of the diet » ; WP FR « des insectes volants peuvent être aussi attrapés »"
  },
  {
   "espece": "Faucon pèlerin",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP EN « small snakes and lizards make up a small proportion » ; ADW « reptiles, amphibians (liste) »"
  },
  {
   "espece": "Faucon pèlerin",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP EN « salmonid fish have been taken » ; ADW « fish (liste) »"
  },
  {
   "espece": "Pigeon biset",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : WP EN « may sometimes consume [...] insect larvae » ; WP FR « plus rarement »"
  },
  {
   "espece": "Pipistrelle de Kuhl",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : WP EN « may also feed on small amounts of fruit » ; étude vallée du Nil (63 estomacs) « fruits ≈ 3 % du volume »"
  },
  {
   "espece": "Pipistrelle de Kuhl",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : aucune source lue ne décrit gîtes défensifs ni défense"
  },
  {
   "espece": "Écrevisse signal",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : fishipedia « cadavres d'animaux » (une seule source)"
  },
  {
   "espece": "Écrevisse signal",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "rose : périphyton source principale dans une étude italienne (résumé) ; revue 2015 « algae [...] minor role »"
  },
  {
   "espece": "Écrevisse signal",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "rose : thefishsite seul « des amphibiens » ; têtards par expérience indirecte"
  },
  {
   "espece": "Belette",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP EN « Frogs, fish, small birds and bird eggs are rarely eaten » ; ADW « small fish [...] when rodents are scarce »"
  },
  {
   "espece": "Belette",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : ADW « and invertebrates (quand les rongeurs manquent) » (une seule source)"
  },
  {
   "espece": "Belette",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : ADW « will not overlook an easy meal, such as carrion » (une seule source)"
  },
  {
   "espece": "Belette",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP EN « rarely eaten » ; ADW « when rodents are scarce »"
  },
  {
   "espece": "Belette",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP EN « rarely eaten » ; ADW « when rodents are scarce »"
  },
  {
   "espece": "Belette",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : aucune source ne met la fuite en avant"
  },
  {
   "espece": "Bruant des roseaux",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : WP FR « des crustacés de petite taille dans son estomac » (une seule source)"
  },
  {
   "espece": "Guêpier d'Europe",
   "sujet": "defense",
   "groupe": "Défense en groupe",
   "raison": "niche en colonies, alerte vocale (ADW) ; aucune défense collective décrite"
  },
  {
   "espece": "Loutre d'Europe",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP FR « Plus exceptionnellement, des oiseaux, des rongeurs » ; WP EN « occasionally hunts large waterbirds »"
  },
  {
   "espece": "Loutre d'Europe",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : WP FR « Plus exceptionnellement, des oiseaux, des rongeurs » ; WP EN « small mammals, including young European beavers »"
  },
  {
   "espece": "Loutre d'Europe",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : WP FR « voire des baies comme les myrtilles » ; ADW « a small amount of vegetation »"
  },
  {
   "espece": "Loutre d'Europe",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : ADW « a small amount of vegetation » (une seule source)"
  },
  {
   "espece": "Murin de Daubenton",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP FR « alevins parfois » ; ADW « occasionally [...] small jumping fish »"
  },
  {
   "espece": "Murin de Daubenton",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : WP FR seule « crustacés et alevins parfois »"
  },
  {
   "espece": "Cerf élaphe",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : Furness 1988 (J. Zool.) « cerfs de Rum mangeant des poussins de puffins » (une seule source)"
  },
  {
   "espece": "Cerf élaphe",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : Furness 1988 (J. Zool.) « os des poussins rongés (minéraux) » (une seule source)"
  },
  {
   "espece": "Cerf élaphe",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "faon seulement (Larousse « le faon se tapit »)"
  },
  {
   "espece": "Crossope aquatique",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : WP EN « small rodents are also eaten » ; GWCT « crayfish, amphibians, small rodents, fish »"
  },
  {
   "espece": "Crossope aquatique",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : wildlifeonline « Will feed on carcasses of larger animals given the opportunity » (une seule source)"
  },
  {
   "espece": "Lézard vert occidental",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : Naturalis « Sometimes they also eat nestlings of small birds or fruit » ; Chambre d'agriculture HdF (extrait) « éventuellement des micro-mammifères et des fruits »"
  },
  {
   "espece": "Lézard vert occidental",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : Naturalis « Sometimes they also eat nestlings of small birds or fruit » ; Chambre d'agriculture HdF (extrait) « œufs d'oiseaux »"
  },
  {
   "espece": "Lézard vert occidental",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : Chambre d'agriculture HdF (extrait) « éventuellement des micro-mammifères » (une seule source)"
  },
  {
   "espece": "Lézard vert occidental",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "rose : WP EN seule « isopods » (cloportes)"
  },
  {
   "espece": "Lézard vert occidental",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "rose : « petits lézards » dans la fiche HdF seule (extrait)"
  },
  {
   "espece": "Lézard vert occidental",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "livrée verte plausible, aucune source ne le cite ni ne l'écarte"
  },
  {
   "espece": "Fuligule milouin",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP EN seule « small fish » ; WP FR et oiseaux.net détaillent sans"
  },
  {
   "espece": "Fuligule milouin",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "rose : characées (Schmieder et al.) sans 2e source lue"
  },
  {
   "espece": "Fuligule milouin",
   "sujet": "defense",
   "groupe": "Défense en groupe",
   "raison": "grands groupes, jamais présentés comme défense"
  },
  {
   "espece": "Souris grise",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : ADW « carrion when it's available » ; TTU « meat when available »"
  },
  {
   "espece": "Souris grise",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "rose : prédation d'oiseaux de mer sur l'île de Gough (WP EN), cas insulaire"
  },
  {
   "espece": "Coucou gris",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP FR « occasionnellement des œufs et des poussins » ; WP EN « occasionally » ; l'œuf gobé à la ponte n'est pas un régime"
  },
  {
   "espece": "Coucou gris",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : aucune source ne cite la fuite"
  },
  {
   "espece": "Couleuvre verte et jaune",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : WP FR « proies variées : mammifères, oiseaux, reptiles et arthropodes » ; consoglobe « Les jeunes, plus petits, privilégieront les insectes »"
  },
  {
   "espece": "Gallinule poule-d'eau",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : oiseaux.net « parfois de petits poissons, de têtards et d'œufs d'oiseaux » ; ADW « animal foods include amphibians, fish, eggs, carrion »"
  },
  {
   "espece": "Gallinule poule-d'eau",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : oiseaux.net « parfois [...] d'œufs d'oiseaux » ; ADW « eggs »"
  },
  {
   "espece": "Gallinule poule-d'eau",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : ADW « carrion » (une seule source)"
  },
  {
   "espece": "Gallinule poule-d'eau",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "occasionnel : ADW « mosses, and algae » (une seule source)"
  },
  {
   "espece": "Gallinule poule-d'eau",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : oiseaux.net « parfois de petits poissons »"
  },
  {
   "espece": "Gallinule poule-d'eau",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "rose : aucune source ne nomme de crustacé (« petits animaux aquatiques »)"
  },
  {
   "espece": "Rotengle",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP EN « occasionally other small fish » ; WP FR « les œufs des autres poissons qu'il ingère »"
  },
  {
   "espece": "Rotengle",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "rose : zooplancton cité (daphnies, copépodes) sans crustacé nommé"
  },
  {
   "espece": "Crapaud calamite",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "occasionnel : animalcorner « tadpoles feed on algae and vegetation » (une seule source)"
  },
  {
   "espece": "Autour des palombes",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP EN « atypical prey including reptiles and amphibians, fish and insects » ; WP FR « des lézards et des insectes »"
  },
  {
   "espece": "Autour des palombes",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : WP EN « A few pellets have included remains of insects » ; WP FR « des lézards et des insectes »"
  },
  {
   "espece": "Autour des palombes",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : WP EN « more likely rare cases of scavenging on carrion » (une seule source)"
  },
  {
   "espece": "Autour des palombes",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP EN « Fish are similarly rare in the diet » (une seule source)"
  },
  {
   "espece": "Autour des palombes",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : aucune source ne décrit de défense contre un prédateur"
  },
  {
   "espece": "Cisticole des joncs",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : « reste immobile si elle se sent menacée », « répugne à jaillir du couvert » : Fuite ou Camouflage non tranché"
  },
  {
   "espece": "Rougequeue noir",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : seulement sur les côtes (WP FR « rivages côtiers », oiseaux.net « crustacés intertidaux »)"
  },
  {
   "espece": "Faucon crécerelle",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP FR « a déjà été vu en Grande-Bretagne attraper du poisson » (une seule source)"
  },
  {
   "espece": "Faucon crécerelle",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP EN « only on rare occasions » ; ADW « sometimes » ; (WP FR : parfois majoritaires dans le Sud)"
  },
  {
   "espece": "Faucon crécerelle",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : ADW « sometimes » ; oiseaux.net « Il lui arrive de chasser des oiseaux »"
  },
  {
   "espece": "Faucon crécerelle",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : aucune source ne décrit de défense contre un prédateur"
  },
  {
   "espece": "Putois d'Europe",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : WP EN « rarely scavenge ungulate carcasses as polecats do (indirect) » (une seule source)"
  },
  {
   "espece": "Putois d'Europe",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : WP EN « only rarely preyed upon » ; ADW « Should food become scarce »"
  },
  {
   "espece": "Putois d'Europe",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : ADW « insects and fruit » si disette ; futura-sciences « en automne »"
  },
  {
   "espece": "Tarier pâtre",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : oiseaux.net « quelques petites graines et quelques baies », part infime ; absent de WP FR"
  },
  {
   "espece": "Tarier pâtre",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : petit lézard « à l'occasion » (oiseaux.net seul)"
  },
  {
   "espece": "Choucas des tours",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : WP EN seul (roadkill)"
  },
  {
   "espece": "Choucas des tours",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : WP EN seul (small rodents, bats)"
  },
  {
   "espece": "Choucas des tours",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : grenouilles citées par WP FR seul"
  },
  {
   "espece": "Aselle",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : pousses de plantes aquatiques (WP EN seul) ; feuilles surtout mortes"
  },
  {
   "espece": "Aselle",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : « débris ... animaux » (WP FR seul)"
  },
  {
   "espece": "Lérot",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP FR « peut aussi », WP EN « have been known to »"
  },
  {
   "espece": "Lérot",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP FR « peut aussi », WP EN « have been known to »"
  },
  {
   "espece": "Lérot",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : WP EN seul, peut-être charognés ; cannibalisme (WP FR)"
  },
  {
   "espece": "Lérot",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : feuilles et fleurs au printemps (WP EN seul, crottes en Belgique)"
  },
  {
   "espece": "Loche franche",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : œufs de poissons seulement (DORIS, WP DE)"
  },
  {
   "espece": "Tégénaire des maisons",
   "sujet": "defense",
   "groupe": "Perte d'un membre",
   "raison": "rose : non citée par les sources lues, mais fréquente chez les araignées"
  },
  {
   "espece": "Renard roux",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : reptiles cités par WP EN seul"
  },
  {
   "espece": "Renard roux",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : herbes et laîches (WP EN seul)"
  },
  {
   "espece": "Renard roux",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP FR seul"
  },
  {
   "espece": "Écureuil roux",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP FR « très occasionnellement », WP EN 4 estomacs sur 600"
  },
  {
   "espece": "Écureuil roux",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : WP FR « parfois », WP EN « more rarely »"
  },
  {
   "espece": "Écureuil roux",
   "sujet": "mange",
   "groupe": "Nectar, pollen et sève",
   "raison": "occasionnel : sève citée par WP EN seul"
  },
  {
   "espece": "Grenouille agile",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "têtard seulement (WP EN « Tadpoles eat plant material ») : pas ajouté, l'adulte n'en mange pas"
  },
  {
   "espece": "Grenouille agile",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "têtard seulement (WP EN « Tadpoles eat plant material ») : pas ajouté"
  },
  {
   "espece": "Corneille noire",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : cas local (Léman, WP FR) ; cité dans la liste de WP EN"
  },
  {
   "espece": "Guifette moustac",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "une seule source (oiseaux.net « têtards et rainettes ») ; absent de WP FR"
  },
  {
   "espece": "Guifette moustac",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "une seule source (WP FR) ; absent d'oiseaux.net"
  },
  {
   "espece": "Guifette moustac",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : aucune source lue (WP FR, EN, DE, oiseaux.net) ne décrit de défense en groupe"
  },
  {
   "espece": "Lamproie de Planer",
   "sujet": "defense",
   "groupe": "Odeur ou goût repoussant",
   "raison": "rose : mucus toxique (DORIS), goût possible"
  },
  {
   "espece": "Rat des moissons",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : bourgeons et pousses au début du printemps (WP FR seul)"
  },
  {
   "espece": "Campagnol roussâtre",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP EN seul (« may take eggs »)"
  },
  {
   "espece": "Gloméris",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : WP DE « selten » ; WP EN feuilles mortes seulement"
  },
  {
   "espece": "Brochet",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP FR « peut aussi », WP EN attaques rares"
  },
  {
   "espece": "Brochet",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : WP FR « peut aussi »"
  },
  {
   "espece": "Brochet",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "jeunes seulement (zooplancton, daphnies)"
  },
  {
   "espece": "Brochet",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : camouflage décrit pour l'affût (WP FR « se camoufle dans les herbes », DORIS), pas comme défense"
  },
  {
   "espece": "Grenouille rieuse",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : vertébrés minoritaires (arthropodes 90 à 97 %, WP EN ; WP FR « parfois »)"
  },
  {
   "espece": "Grenouille rieuse",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP FR « parfois », WP EN « recorded »"
  },
  {
   "espece": "Grenouille rieuse",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : WP FR « parfois » (musaraignes)"
  },
  {
   "espece": "Grenouille rieuse",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP FR « parfois », vertébrés minoritaires"
  },
  {
   "espece": "Grenouille rieuse",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : WP DE seul"
  },
  {
   "espece": "Grenouille rieuse",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : 2,39 % du contenu (WP EN)"
  },
  {
   "espece": "Grenouille rieuse",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "têtard seulement (WP EN algues et détritus) : pas ajouté"
  },
  {
   "espece": "Cincle plongeur",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : oiseaux.net « rarement de petits poissons »"
  },
  {
   "espece": "Cincle plongeur",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP EN seul"
  },
  {
   "espece": "Grive draine",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : orvets (WP EN « has been known to »)"
  },
  {
   "espece": "Grive draine",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : jeunes d'autres grives (WP EN « has been known to »)"
  },
  {
   "espece": "Grive draine",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : WP EN « may eat »"
  },
  {
   "espece": "Grive draine",
   "sujet": "defense",
   "groupe": "Intimidation (se gonfle, siffle)",
   "raison": "rose : nid « fearlessly defended », attaque même l'homme (WP EN) ; type de défense ambigu"
  },
  {
   "espece": "Mante religieuse",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : un cas de lézard (WP DE)"
  },
  {
   "espece": "Mante religieuse",
   "sujet": "defense",
   "groupe": "Couleurs d'avertissement",
   "raison": "rose : ocelles montrés lors de la posture d'intimidation (WP FR, WP DE)"
  },
  {
   "espece": "Grenouille rousse",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "rose : dans la liste mais cité par aucune source lue (WP EN, WP DE, ADW)"
  },
  {
   "espece": "Grenouille rousse",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "têtard seulement : pas ajouté"
  },
  {
   "espece": "Grenouille rousse",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : camouflage non cité (WP DE fuite par sauts, ADW « hide in damp places »)"
  },
  {
   "espece": "Truite fario",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : grands cours d'eau et lacs seulement (WP DE)"
  },
  {
   "espece": "Truite fario",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "occasionnel : truites de lac seulement (WP EN), pas la truite de rivière : pas ajouté"
  },
  {
   "espece": "Alyte accoucheur",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : cloportes « peuvent compléter » (WP FR)"
  },
  {
   "espece": "Alyte accoucheur",
   "sujet": "defense",
   "groupe": "Venin, poison ou acide",
   "raison": "rose : sécrétions de la peau non décrites par les sources lues"
  },
  {
   "espece": "Alyte accoucheur",
   "sujet": "defense",
   "groupe": "Odeur ou goût repoussant",
   "raison": "rose : non décrit par les sources lues"
  },
  {
   "espece": "Hermine",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : « plus rarement » (WP FR, WP EN)"
  },
  {
   "espece": "Hermine",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : « plus rarement » (WP FR, WP EN)"
  },
  {
   "espece": "Loir gris",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP FR, WP DE « gelegentlich », ADW « uncommon »"
  },
  {
   "espece": "Sterne pierregarin",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "rose : seuls les œufs et le duvet des poussins sont camouflés (WP EN, oiseaux.net)"
  },
  {
   "espece": "Surmulot",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "ADW seul (liste) ; WP FR omnivore à tendance carnivore"
  },
  {
   "espece": "Surmulot",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "ADW seul"
  },
  {
   "espece": "Surmulot",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "ADW seul"
  },
  {
   "espece": "Surmulot",
   "sujet": "defense",
   "groupe": "Intimidation (se gonfle, siffle)",
   "raison": "rose : hérisse le poil et siffle entre rats (WP EN), pas face aux prédateurs"
  },
  {
   "espece": "Buse variable",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : WP EN « at times », oiseaux.net surtout par temps de neige"
  },
  {
   "espece": "Buse variable",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP EN « rarely »"
  },
  {
   "espece": "Carpe commune",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP FR « peuvent aussi » petits poissons, WP EN œufs et restes de poissons"
  },
  {
   "espece": "Tanche",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : FishBase seul ; WP FR « débris de végétaux »"
  },
  {
   "espece": "Lombric commun",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "rose : mange des feuilles mortes (WP EN, WP DE), pas des feuilles vivantes ; réponse ambiguë"
  },
  {
   "espece": "Lombric commun",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : insectes morts (WP EN), débris animaux (WP FR) : pas ajouté"
  },
  {
   "espece": "Lombric commun",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : insectes morts seulement (WP EN) : pas ajouté"
  },
  {
   "espece": "Busard des roseaux",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP FR seul ; oiseaux.net poissons morts seulement ; WP EN muet"
  },
  {
   "espece": "Busard des roseaux",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : oiseaux.net seul (« volontiers nécrophage »)"
  },
  {
   "espece": "Conocéphale gracieux",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "rose : dans la liste mais non cité ; orthoptera.ch « ernährt sich vorwiegend vegetarisch » ; WP FR, EN muets"
  },
  {
   "espece": "Conocéphale gracieux",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "rose : se nourrit de graminées en fleurs (orthoptera.ch), graines possibles, non tranché"
  },
  {
   "espece": "Cygne tuberculé",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP EN « small proportions of ... fish », absent de WP FR"
  },
  {
   "espece": "Cygne tuberculé",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP FR « dans une moindre proportion », WP EN « small proportions »"
  },
  {
   "espece": "Cygne tuberculé",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : WP FR « quelques invertébrés mangés avec les feuilles », WP EN « small proportions »"
  },
  {
   "espece": "Cygne tuberculé",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "non confirmé : aucune source ne cite de crustacés (WP FR « petits organismes aquatiques »)"
  },
  {
   "espece": "Fauvette à tête noire",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : cité par WP FR seul, absent de WP EN"
  },
  {
   "espece": "Fauvette à tête noire",
   "sujet": "mange",
   "groupe": "Nectar, pollen et sève",
   "raison": "occasionnel : WP EN « if there are insufficient insects » à l'arrivée"
  },
  {
   "espece": "Faucheux",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "rose : WP FR et EN ne citent que des animaux ; végétal connu chez les opilions, peu documenté pour l'espèce"
  },
  {
   "espece": "Faucheux",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "rose : fruits cités pour les opilions (genre voisin Opilio), pas confirmé pour l'espèce"
  },
  {
   "espece": "Tortue de Floride",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "occasionnel : ADW seul ; la tortue digère mal les macroalgues (étude Floride)"
  },
  {
   "espece": "Tortue de Floride",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : Futura seul"
  },
  {
   "espece": "Tortue de Floride",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : Futura seul (poussins)"
  },
  {
   "espece": "Gorgebleue à miroir",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : sources muettes sur la défense ; Camouflage principal douteux (mâle à gorge bleu vif)"
  },
  {
   "espece": "Bondrée apivore",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : WP FR « baies » seulement quand les guêpes manquent ; absent de WP EN"
  },
  {
   "espece": "Campagnol agreste",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : WP EN « occasionally » ; WP FR « pas dédaignés »"
  },
  {
   "espece": "Gammare",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : cannibalisme à forte densité ou en laboratoire"
  },
  {
   "espece": "Gammare",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "rose : mange des feuilles mortes en décomposition (WP EN), réponse à moitié vraie"
  },
  {
   "espece": "Gammare",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "rose : organismes fixés sur les débris (WP FR) ; algues du biofilm citées pour un Gammarus voisin"
  },
  {
   "espece": "Gammare",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "rose : « matière organique morte » (WP EN) sans préciser animale ou végétale"
  },
  {
   "espece": "Héron garde-bœufs",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : sur les îles à colonies d'oiseaux marins, ou en migration"
  },
  {
   "espece": "Héron garde-bœufs",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : « rare » (les deux WP)"
  },
  {
   "espece": "Héron garde-bœufs",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : une source, « occasionally »"
  },
  {
   "espece": "Tourterelle des bois",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "rose : WP FR « essentiellement de petites graines » ; Dunn 2018 : graines seulement, sans feuilles"
  },
  {
   "espece": "Vipère aspic",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP FR « parfois »"
  },
  {
   "espece": "Vipère aspic",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "rose : sources muettes ; robe cryptique, réponse « non » contestable"
  },
  {
   "espece": "Coronelle lisse",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP FR seul"
  },
  {
   "espece": "Coronelle lisse",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : une étude (12,5 %), surtout les jeunes"
  },
  {
   "espece": "Coronelle lisse",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : Camouflage principal non mis en avant par les sources ; venin de la glande à venin pour les proies (WP EN)"
  },
  {
   "espece": "Écrevisse à pattes blanches",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "rose : plancton et périphyton pour les larves seulement (WP FR)"
  },
  {
   "espece": "Faucon hobereau",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : chauves-souris « plutôt rare » (WP FR)"
  },
  {
   "espece": "Campagnol amphibie",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : WP FR « quelques organismes aquatiques », WP EN « rarely preyed on » ; Navarre : plantes seulement"
  },
  {
   "espece": "Campagnol amphibie",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : WP FR « quelques organismes aquatiques », WP EN « rarely preyed on » ; Navarre : plantes seulement"
  },
  {
   "espece": "Campagnol amphibie",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP FR « quelques organismes aquatiques », WP EN « rarely preyed on » ; Navarre : plantes seulement"
  },
  {
   "espece": "Campagnol amphibie",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP FR « quelques organismes aquatiques », WP EN « rarely preyed on » ; Navarre : plantes seulement"
  },
  {
   "espece": "Campagnol amphibie",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : WP FR « à l'occasion »"
  },
  {
   "espece": "Campagnol amphibie",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "rose : une base de données donne 20 % de fruits, contredite par l'étude des estomacs"
  },
  {
   "espece": "Courlis cendré",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : « occasionnellement » (WP FR, BirdForum)"
  },
  {
   "espece": "Courlis cendré",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : « occasionnellement » (WP FR, BirdForum)"
  },
  {
   "espece": "Courlis cendré",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : « occasionnellement » (WP FR, BirdForum)"
  },
  {
   "espece": "Courlis cendré",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : « occasionnellement » (WP FR, BirdForum)"
  },
  {
   "espece": "Vairon",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : alevins (WP FR) et œufs de poissons (Wildlife Trusts) ; absent de FishBase"
  },
  {
   "espece": "Épervier d'Europe",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : « sometimes »"
  },
  {
   "espece": "Épervier d'Europe",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : « very rarely »"
  },
  {
   "espece": "Épervier d'Europe",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : « parfois attrapés » (WP FR), « sometimes caught » (WP EN)"
  },
  {
   "espece": "Petit-duc scops",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : « à l'occasion »"
  },
  {
   "espece": "Petit-duc scops",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : « à l'occasion » petits batraciens (WP FR) ; lézards en petite part"
  },
  {
   "espece": "Petit-duc scops",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : « à l'occasion » campagnols ou musaraignes (WP FR)"
  },
  {
   "espece": "Pie-grièche écorcheur",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : LPO via WP FR seul"
  },
  {
   "espece": "Œdipode turquoise",
   "sujet": "defense",
   "groupe": "Couleurs d'avertissement",
   "raison": "rose : ailes bleues montrées en vol pour dérouter (éclair), pas un avertissement ; réponse ambiguë"
  },
  {
   "espece": "Effraie des clochers",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : « plus rarement » (WP FR) ; 2,4 % des proies en Europe"
  },
  {
   "espece": "Effraie des clochers",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : « plus rarement » (WP FR) ; reptiles 0,08 %"
  },
  {
   "espece": "Effraie des clochers",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : « plus rarement » gros insectes (WP FR)"
  },
  {
   "espece": "Effraie des clochers",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : 1 poisson sur 77 602 vertébrés"
  },
  {
   "espece": "Grillon champêtre",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "rose : sources de l'espèce « mainly grasses » ; insectes cités pour le genre Gryllus seulement"
  },
  {
   "espece": "Grillon champêtre",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "rose : graines citées pour le genre Gryllus seulement"
  },
  {
   "espece": "Ablette",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : quand le zooplancton manque ; WP « débris de végétaux »"
  },
  {
   "espece": "Busard Saint-Martin",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : une source"
  },
  {
   "espece": "Busard Saint-Martin",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : une source"
  },
  {
   "espece": "Busard Saint-Martin",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP EN « supplementing the diet occasionally are amphibians »"
  },
  {
   "espece": "Grue cendrée",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : BirdLife « occasionally »"
  },
  {
   "espece": "Torcol fourmilier",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : « très occasionnellement »"
  },
  {
   "espece": "Torcol fourmilier",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : « plus rarement » têtards"
  },
  {
   "espece": "Chevêche d'Athéna",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "rose : végétaux jusqu'à 5 % « sans doute avalés par accident » (WP EN)"
  },
  {
   "espece": "Chevêche d'Athéna",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "rose : végétaux jusqu'à 5 % « sans doute avalés par accident » (WP EN)"
  },
  {
   "espece": "Chevêche d'Athéna",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : Intimidation principale non citée par les sources ; seul le plumage cryptique est cité (WP EN)"
  },
  {
   "espece": "Perche soleil",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : « occasionally » (WP EN)"
  },
  {
   "espece": "Couleuvre d'Esculape",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : jeunes seulement (WP EN)"
  },
  {
   "espece": "Couleuvre d'Esculape",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : défense principale corrigée (Camouflage) d'après WP FR seul"
  },
  {
   "espece": "Tique du mouton",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "rose : suce le sang des rongeurs, oiseaux et lézards (ECDC) ; « mange » serait à moitié vrai"
  },
  {
   "espece": "Tique du mouton",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "rose : suce le sang des rongeurs, oiseaux et lézards (ECDC) ; « mange » serait à moitié vrai"
  },
  {
   "espece": "Tique du mouton",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "rose : suce le sang des rongeurs, oiseaux et lézards (ECDC) ; « mange » serait à moitié vrai"
  },
  {
   "espece": "Vandoise",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "occasionnel : une source (US FWS), absent des deux WP"
  },
  {
   "espece": "Vandoise",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : WP FR « plus rarement »"
  },
  {
   "espece": "Vandoise",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : une source"
  },
  {
   "espece": "Grimpereau des jardins",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : « parfois de petites graines, surtout en hiver » (WP FR, WP EN)"
  },
  {
   "espece": "Hibou moyen-duc",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP EN « infrequently » reptiles, « even fewer amphibians »"
  },
  {
   "espece": "Hibou moyen-duc",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : WP EN « less than 2% » en Europe"
  },
  {
   "espece": "Bergeronnette des ruisseaux",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : « occasionally small fish fry »"
  },
  {
   "espece": "Escargot des haies",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "occasionnel : une étude"
  },
  {
   "espece": "Escargot des haies",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : « animal remains », une étude"
  },
  {
   "espece": "Escargot des haies",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "rose : restes de petits insectes sans doute avalés avec les feuilles (ADW)"
  },
  {
   "espece": "Aigrette garzette",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP EN « also eaten » ; WP FR « de petits oiseaux » ; oiseaux.net n'en parle pas"
  },
  {
   "espece": "Aigrette garzette",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : WP EN seul « mammals and birds are also eaten »"
  },
  {
   "espece": "Aigrette garzette",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : WP EN « even scavenge »"
  },
  {
   "espece": "Aigrette garzette",
   "sujet": "defense",
   "groupe": "Intimidation (se gonfle, siffle)",
   "raison": "sources muettes sur la défense ; ni confirmé ni écarté"
  },
  {
   "espece": "Cormoran huppé",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "rose pour ce groupe : WP FR « invertébrés marins » sans détail ; WP EN et oiseaux.net muets"
  },
  {
   "espece": "Cormoran huppé",
   "sujet": "defense",
   "groupe": "Régurgitation",
   "raison": "plausible (oiseau marin colonial), sources muettes sur la défense"
  },
  {
   "espece": "Perdrix grise",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "rose pour ce groupe : WP FR « consommant aussi des végétaux » sans préciser feuilles ou pousses"
  },
  {
   "espece": "Perdrix grise",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "cité par une seule source (oiseaux.net)"
  },
  {
   "espece": "Circaète Jean-le-Blanc",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : WP EN « occasionally » / « rarely »"
  },
  {
   "espece": "Circaète Jean-le-Blanc",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP EN « occasionally » / « rarely »"
  },
  {
   "espece": "Circaète Jean-le-Blanc",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : WP EN « occasionally » / « rarely »"
  },
  {
   "espece": "Fouine",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : ADW « when food is scarce »"
  },
  {
   "espece": "Fouine",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : ADW seul (grenouilles)"
  },
  {
   "espece": "Fouine",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "rose pour ce groupe : ADW « vegetable matter is a major part of the summer diet » sans préciser fruits ou feuilles"
  },
  {
   "espece": "Fouine",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "cité par une seule source (ADW)"
  },
  {
   "espece": "Fouine",
   "sujet": "defense",
   "groupe": "Intimidation (se gonfle, siffle)",
   "raison": "plausible (ADW : agressive, posture défensive mal connue), non écartée"
  },
  {
   "espece": "Fouine",
   "sujet": "defense",
   "groupe": "Odeur ou goût repoussant",
   "raison": "plausible (glandes des mustélidés), non écartée"
  },
  {
   "espece": "Méduse d'eau douce",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "plausible : WP EN corps « transparent or translucent », non présenté comme défense"
  },
  {
   "espece": "Spirlin",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : WP EN et FishBase (même texte) « some crustaceans » ; WP FR ne les cite pas"
  },
  {
   "espece": "Spirlin",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : aucune source (WP FR, WP EN, FishBase) ne décrit de banc ni de défense"
  },
  {
   "espece": "Musaraigne pygmée",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : WP EN seul « seeds »"
  },
  {
   "espece": "Musaraigne pygmée",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : ADW seul « woodlice »"
  },
  {
   "espece": "Musaraigne pygmée",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "rose pour ce groupe : ADW « small amounts of plant material »"
  },
  {
   "espece": "Grand corbeau",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "rose pour ce groupe : bourgeons et « plant material » seulement"
  },
  {
   "espece": "Grand corbeau",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "plausible (très opportuniste, côtes), non cité et non écarté"
  },
  {
   "espece": "Grand corbeau",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "plausible (très opportuniste, poissons morts), non cité et non écarté"
  },
  {
   "espece": "Hirondelle de rochers",
   "sujet": "defense",
   "groupe": "Défense en groupe",
   "raison": "plausible : WP EN grégaire hors nidification, rôle défensif non décrit ni écarté"
  },
  {
   "espece": "Rémiz penduline",
   "sujet": "mange",
   "groupe": "Nectar, pollen et sève",
   "raison": "occasionnel : oiseaux.net seul « consomme également le nectar de certaines plantes »"
  },
  {
   "espece": "Triton palmé",
   "sujet": "defense",
   "groupe": "Venin, poison ou acide",
   "raison": "plausible (sécrétions de la peau des tritons), sources muettes"
  },
  {
   "espece": "Triton palmé",
   "sujet": "defense",
   "groupe": "Odeur ou goût repoussant",
   "raison": "plausible (sécrétions de la peau des tritons), sources muettes"
  },
  {
   "espece": "Échasse blanche",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : oiseaux.net seul (têtards)"
  },
  {
   "espece": "Échasse blanche",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : oiseaux.net seul « aussi de crustacés »"
  },
  {
   "espece": "Échasse blanche",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : aucune source ne décrit une défense en groupe (oiseaux.net : couple qui défend le nid, fausse aile cassée)"
  },
  {
   "espece": "Cigogne blanche",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : WP FR et WP EN « moins souvent »"
  },
  {
   "espece": "Cigogne blanche",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP FR et WP EN « moins souvent »"
  },
  {
   "espece": "Cigogne blanche",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP FR « Moins souvent [...] des œufs d'oiseaux »"
  },
  {
   "espece": "Cigogne blanche",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "rose pour ce groupe : ni WP FR, ni WP EN, ni ADW ne citent les charognes"
  },
  {
   "espece": "Cigogne blanche",
   "sujet": "defense",
   "groupe": "Régurgitation",
   "raison": "plausible, non écartée (sources : régurgitation pour nourrir les jeunes seulement)"
  },
  {
   "espece": "Fou de Bassan",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : WP EN seul (rejets de pêche)"
  },
  {
   "espece": "Fou de Bassan",
   "sujet": "defense",
   "groupe": "Régurgitation",
   "raison": "ambigu : WP EN, il régurgite sa prise quand les labbes l'attaquent"
  },
  {
   "espece": "Fou de Bassan",
   "sujet": "defense",
   "groupe": "Intimidation (se gonfle, siffle)",
   "raison": "plausible : parades de menace décrites entre fous, non écartée"
  },
  {
   "espece": "Mulot à collier",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : WP EN « sometimes small invertebrates » ; WP FR « aussi d'invertébrés »"
  },
  {
   "espece": "Mulot à collier",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "plausible (comme le mulot sylvestre du lot 1), non écarté"
  },
  {
   "espece": "Rat noir",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP EN seul"
  },
  {
   "espece": "Rat noir",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : ADW « will feed on insects or other invertebrates if necessary »"
  },
  {
   "espece": "Rat noir",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "rose pour ce groupe : WP EN « invertebrates and vertebrates » sans préciser"
  },
  {
   "espece": "Rat noir",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "plausible (rat omnivore), non cité et non écarté"
  },
  {
   "espece": "Rat noir",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "cité par une seule source (ADW « possible »)"
  },
  {
   "espece": "Rat noir",
   "sujet": "defense",
   "groupe": "Intimidation (se gonfle, siffle)",
   "raison": "cité par une seule source (ADW)"
  },
  {
   "espece": "Cloporte des murs",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "occasionnel : Puget Sound Museum (général aux cloportes)"
  },
  {
   "espece": "Cloporte des murs",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : UK Nature « They eat vegetables »"
  },
  {
   "espece": "Cloporte des murs",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "rose pour ce groupe : non cité, plausible (graines chez le cloporte commun, lot 2)"
  },
  {
   "espece": "Cloporte des murs",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "rose pour ce groupe : WP EN, il mange sa propre mue ; cannibalisme non décrit"
  },
  {
   "espece": "Dectique verrucivore",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "cité par une seule source (WP EN)"
  },
  {
   "espece": "Dectique verrucivore",
   "sujet": "defense",
   "groupe": "Morsure, cornes ou serres",
   "raison": "rose pour cette défense : la morsure n'est citée que pour l'usage ancien sur les verrues"
  },
  {
   "espece": "Dectique verrucivore",
   "sujet": "defense",
   "groupe": "Régurgitation",
   "raison": "plausible chez les sauterelles, non écartée"
  },
  {
   "espece": "Grosbec casse-noyaux",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : WP EN seul (pousses)"
  },
  {
   "espece": "Grosbec casse-noyaux",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : WP EN « occasionally » (chenilles, coléoptères) ; WP FR insectivore au printemps"
  },
  {
   "espece": "Mésange à longue queue",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : WP FR seul (bourgeons en hiver)"
  },
  {
   "espece": "Mésange à longue queue",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : WP EN « occasionally takes [...] seeds », WP FR « quelques graines »"
  },
  {
   "espece": "Mésange à longue queue",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : le camouflage décrit est celui du nid (lichens), pas de l'oiseau"
  },
  {
   "espece": "Philoscie des mousses",
   "sujet": "mange",
   "groupe": null,
   "raison": "rose : aucune source trouvée sur le régime (WP FR, WP EN, BMIG, NatureSpot)"
  },
  {
   "espece": "Philoscie des mousses",
   "sujet": "defense",
   "groupe": "Odeur ou goût repoussant",
   "raison": "plausible (glandes des cloportes), non écartée"
  },
  {
   "espece": "Philoscie des mousses",
   "sujet": "defense",
   "groupe": "Fait le mort",
   "raison": "plausible chez les cloportes, non écartée"
  },
  {
   "espece": "Philoscie des mousses",
   "sujet": "defense",
   "groupe": "Perte d'un membre",
   "raison": "plausible chez les cloportes, non écartée"
  },
  {
   "espece": "Butor étoilé",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : WP EN seul"
  },
  {
   "espece": "Butor étoilé",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP FR « Il peut parfois chasser des oiseaux »"
  },
  {
   "espece": "Butor étoilé",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : WP FR « parfois [...] de petits mammifères »"
  },
  {
   "espece": "Grillon des bois",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "rose pour ce groupe : il mange des feuilles mortes (litière), pas des feuilles vivantes"
  },
  {
   "espece": "Grive litorne",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : navets dans les champs"
  },
  {
   "espece": "Grive litorne",
   "sujet": "defense",
   "groupe": "Intimidation (se gonfle, siffle)",
   "raison": "plausible : WP EN, défense agressive du nid (fientes lâchées sur les prédateurs)"
  },
  {
   "espece": "Lycose radiée",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "rose pour ce groupe : WP FR « petits arthropodes » (cloportes possibles)"
  },
  {
   "espece": "Lycose radiée",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : aucune source ne décrit la défense"
  },
  {
   "espece": "Chabot",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP FR « parfois d'alevins »"
  },
  {
   "espece": "Huîtrier pie",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP FR « très rarement »"
  },
  {
   "espece": "Huîtrier pie",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : WP FR « très rarement »"
  },
  {
   "espece": "Huîtrier pie",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : WP FR « occasionnellement des crabes »"
  },
  {
   "espece": "Huîtrier pie",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "WP EN : œufs et poussins « highly cryptic », pas l'adulte"
  },
  {
   "espece": "Huîtrier pie",
   "sujet": "defense",
   "groupe": "Morsure, cornes ou serres",
   "raison": "WP FR : coups de bec contre le bétail près du nid"
  },
  {
   "espece": "Milan royal",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP EN « stranded fish », absent de WP FR"
  },
  {
   "espece": "Milan royal",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : oiseaux.net « moins porté sur la capture d'insectes »"
  },
  {
   "espece": "Milan royal",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP FR « plus rarement », WP EN « Occasionally »"
  },
  {
   "espece": "Nette rousse",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : oiseaux.net seul"
  },
  {
   "espece": "Nette rousse",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : oiseaux.net seul (têtards)"
  },
  {
   "espece": "Nette rousse",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP FR « dans une moindre mesure »"
  },
  {
   "espece": "Nette rousse",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : oiseaux.net (part animale secondaire)"
  },
  {
   "espece": "Nette rousse",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "rose pour ce groupe : seulement « PlantSeed » dans le tableau d'oiseaux.net"
  },
  {
   "espece": "Petit-gris",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : WP EN « occasionally », ACIA « ne dédaigne pas »"
  },
  {
   "espece": "Petit-gris",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "rose pour ce groupe : une seule source grand public (algues sur les murs)"
  },
  {
   "espece": "Petit-gris",
   "sujet": "defense",
   "groupe": "Odeur ou goût repoussant",
   "raison": "WP EN : mousse de mucus « that might repel some enemies »"
  },
  {
   "espece": "Épeire diadème",
   "sujet": "mange",
   "groupe": "Nectar, pollen et sève",
   "raison": "pollen surtout chez les jeunes ; WP FR et WP EN n'en parlent pas"
  },
  {
   "espece": "Criquet des pâtures",
   "sujet": "defense",
   "groupe": "Odeur ou goût repoussant",
   "raison": "le liquide rejeté peut être repoussant : ni confirmé ni écarté"
  },
  {
   "espece": "Criquet des pâtures",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "plausible (formes vertes et brunes), non présenté comme défense"
  },
  {
   "espece": "Huppe fasciée",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : WP EN seul"
  },
  {
   "espece": "Huppe fasciée",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP EN « sometimes taken », WP FR petits serpents"
  },
  {
   "espece": "Bruant proyer",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : WP FR seul"
  },
  {
   "espece": "Dolomède des marais",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP EN « occasionally [...] sticklebacks », WP FR « ou même de petits poissons »"
  },
  {
   "espece": "Dolomède des marais",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP EN « small frogs », WP FR « peut aussi capturer des têtards »"
  },
  {
   "espece": "Lamproie marine",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : aucune source ne décrit la défense"
  },
  {
   "espece": "Lézard des souches",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "non tranché : WP FR, WP EN et ADW sans régime ; une seule source détaillée (WP DE : insectes, araignées, vers de terre) ; un lézard peut manger de jeunes lézards"
  },
  {
   "espece": "Lézard des souches",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "non tranché : une seule source détaillée (WP DE), cloportes plausibles"
  },
  {
   "espece": "Lézard des souches",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "non tranché : une seule source détaillée (WP DE), fruits plausibles"
  },
  {
   "espece": "Lézard des souches",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "non tranché : défense non décrite par WP FR ; WP EN et WP DE ne citent ni camouflage ni fuite en détail"
  },
  {
   "espece": "Lézard des souches",
   "sujet": "defense",
   "groupe": "Intimidation (se gonfle, siffle)",
   "raison": "non tranché : WP DE ne cite ni zischen ni beißen défensif ; WP EN rien"
  },
  {
   "espece": "Saumon atlantique",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "habituel au stade pre-grilse en mer (WP EN « Plankton such as euphausiids are important food » ; ADW) mais plancton animal : ni bonne ni mauvaise réponse"
  },
  {
   "espece": "Saumon atlantique",
   "sujet": "defense",
   "groupe": "Défense en groupe",
   "raison": "banc cité (ADW « swim in schools » ; WP EN « school ») sans être présenté comme défense"
  },
  {
   "espece": "Bouvière",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "« oui » non confirmé : WP FR, WP EN et FishBase parlent de plantes, vers, crustacés, insectes, jamais d'algues ni de plancton"
  },
  {
   "espece": "Moule zébrée",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "non tranché : filtreuse qui avale du plancton (WP FR « se nourrit … de plancton ») ; zooplancton (copépodes) non exclu par les sources"
  },
  {
   "espece": "Blongios nain",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : oiseaux.net « cadavres de poissons » à l'occasion"
  },
  {
   "espece": "Blongios nain",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "« oui » non confirmé : ni WP FR, ni WP EN, ni oiseaux.net ne citent de crustacés"
  },
  {
   "espece": "Blongios nain",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "une seule source : oiseaux.net « il engloutit les œufs et les petits » (pillage des nids de rousserolles) ; WP FR et WP EN ne le citent pas"
  },
  {
   "espece": "Grenouille verte",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "non tranché : WP FR (invertébrés, larves d'amphibiens) et étude serbe (invertébrés) ; vertébrés non exclus"
  },
  {
   "espece": "Grenouille verte",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "non tranché : sources centrées sur les invertébrés"
  },
  {
   "espece": "Grenouille verte",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "non tranché : sources centrées sur les invertébrés"
  },
  {
   "espece": "Grenouille verte",
   "sujet": "defense",
   "groupe": null,
   "raison": "case rose : aucune source sur la défense (WP FR, WP EN, étude)"
  },
  {
   "espece": "Vanneau huppé",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "« oui » non confirmé : WP FR (insectes, araignées, vers de terre), oiseaux.net (« ni graines ni végétaux »), WP EN (invertébrés) ne citent ni graines ni fruits"
  },
  {
   "espece": "Écrevisse de Louisiane",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : ADW « eat the remains of dead animals »"
  },
  {
   "espece": "Écrevisse de Louisiane",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "non tranché : omnivore, algues plausibles, ni WP FR ni ADW ne les excluent"
  },
  {
   "espece": "Écrevisse de Louisiane",
   "sujet": "defense",
   "groupe": null,
   "raison": "case rose : Pinces non décrites comme défense (ADW : pinces « pour se nourrir ») ; WP FR : « Agressive et robuste »"
  },
  {
   "espece": "Mangore petite-bouteille",
   "sujet": "defense",
   "groupe": "Fait le mort",
   "raison": "non tranché : se laisse tomber de la toile (WP FR), immobilité au sol non décrite ni exclue"
  },
  {
   "espece": "Mangore petite-bouteille",
   "sujet": "defense",
   "groupe": "Venin, poison ou acide",
   "raison": "non tranché : araignée venimeuse (venin pour les proies), usage défensif non décrit"
  },
  {
   "espece": "Aigle royal",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : WP FR « en hiver … consomme aussi des charognes » ; WP EN « scan … for carrion »"
  },
  {
   "espece": "Aigle royal",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP FR « les reptiles sont rarement chassés » ; WP EN « in smaller numbers »"
  },
  {
   "espece": "Gobemouche noir",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : WP FR « il échantillonne aussi les autres arthropodes … petits crustacés »"
  },
  {
   "espece": "Gobemouche noir",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : WP FR et oiseaux.net « il lui arrive de consommer des végétaux » (baies mûres, fin de saison)"
  },
  {
   "espece": "Harle bièvre",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : WP EN « more rarely, small mammals and birds may be taken »"
  },
  {
   "espece": "Harle bièvre",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP EN « more rarely, small mammals and birds may be taken »"
  },
  {
   "espece": "Moineau friquet",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "non tranché : WP FR « des bourgeons » (graines et bourgeons au sol) ; groupe ni confirmé ni exclu"
  },
  {
   "espece": "Ombre commun",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "une seule source : WP EN « smaller fishes » ; Vivier 1958 : larves d'insectes, mollusques, vers"
  },
  {
   "espece": "Ombre commun",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "une seule source : WP EN « zooplankton »"
  },
  {
   "espece": "Ombre commun",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "une seule source : WP EN « vegetable matter »"
  },
  {
   "espece": "Ombre commun",
   "sujet": "defense",
   "groupe": "Défense en groupe",
   "raison": "WP FR « vit en banc » : pas présenté comme défense"
  },
  {
   "espece": "Grande loche",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : WP FR « mais aussi parfois de charognes » ; WP DE « gelegentlich … Aas »"
  },
  {
   "espece": "Grande loche",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "non tranché : WP EN seulement « omnivore » sans détail"
  },
  {
   "espece": "Grande loche",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "non tranché : « plantes fraîches » (WP FR, WP DE) sans détail ; omnivore (EN)"
  },
  {
   "espece": "Grande loche",
   "sujet": "defense",
   "groupe": "Intimidation (se gonfle, siffle)",
   "raison": "non tranché : WP EN « rocking motion » quand dérangée, pas de valeur dans la liste fermée"
  },
  {
   "espece": "Grande loche",
   "sujet": "defense",
   "groupe": "Odeur ou goût repoussant",
   "raison": "non tranché : mucus décrit (EN) sans goût"
  },
  {
   "espece": "Sandre",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "alevins seulement : WP FR « phytoplancton puis zooplancton » ; WP EN « zooplankton »"
  },
  {
   "espece": "Sandre",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "non tranché : WP FR « larves aquatiques » chez les jeunes, insectes non précisés"
  },
  {
   "espece": "Musaraigne couronnée",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "non tranché : WP FR, WP EN, ADW sans régime ; étude pyrénéenne : végétaux « négligeables » (1 proie)"
  },
  {
   "espece": "Musaraigne couronnée",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "non tranché : étude : végétaux négligeables"
  },
  {
   "espece": "Musaraigne couronnée",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "non tranché : étude : restes de vertébrés rares (0,2 %), nature non précisée"
  },
  {
   "espece": "Musaraigne couronnée",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "non tranché : étude : vertébrés rares, nature non précisée"
  },
  {
   "espece": "Musaraigne couronnée",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "non tranché : étude : vertébrés rares, nature non précisée"
  },
  {
   "espece": "Musaraigne couronnée",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "non tranché : non cité par l'étude ; musaraignes charognardes plausibles"
  },
  {
   "espece": "Bécasseau sanderling",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : oiseaux.net « occasionnellement … graines » ; WP FR « graines, jeunes pousses, mousses et algues »"
  },
  {
   "espece": "Bécasseau sanderling",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : oiseaux.net « jeunes pousses » ; WP FR « jeunes pousses »"
  },
  {
   "espece": "Bécasseau sanderling",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "occasionnel : oiseaux.net « algues et mousses » ; WP FR « algues »"
  },
  {
   "espece": "Bécasseau sanderling",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP FR poissons morts (laisse de mer)"
  },
  {
   "espece": "Bécasseau sanderling",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : WP FR poissons morts échoués"
  },
  {
   "espece": "Bécasseau sanderling",
   "sujet": "defense",
   "groupe": "Défense en groupe",
   "raison": "grégarisme cité (oiseaux.net, WP FR) sans être présenté comme défense"
  },
  {
   "espece": "Bécasseau sanderling",
   "sujet": "defense",
   "groupe": null,
   "raison": "case rose : Camouflage non décrit comme défense par les sources ; seul le grégarisme est cité"
  },
  {
   "espece": "Escargot des jardins",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "non tranché : WP FR « apprécie les feuilles d'arbres fruitiers » seul ; WP EN sans régime"
  },
  {
   "espece": "Escargot des jardins",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "non tranché : régime non décrit"
  },
  {
   "espece": "Escargot des jardins",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "non tranché : régime non décrit"
  },
  {
   "espece": "Escargot des jardins",
   "sujet": "defense",
   "groupe": "Odeur ou goût repoussant",
   "raison": "non tranché : WP FR, WP EN ne décrivent pas le mucus"
  },
  {
   "espece": "Sterne caugek",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "non tranché : WP FR « presque exclusivement de poissons » (98 %), 2 % non précisés (vers, mollusques cités)"
  },
  {
   "espece": "Sterne caugek",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "non tranché : même reste de 2 % non précisé"
  },
  {
   "espece": "Grande sauterelle verte",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : WP FR « ne dédaigne pas les végétaux » ; WP EN : régime « mostly … flies, caterpillars and larvae »"
  },
  {
   "espece": "Grande sauterelle verte",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "non tranché : « végétaux » (WP FR) sans précision"
  },
  {
   "espece": "Grande sauterelle verte",
   "sujet": "defense",
   "groupe": null,
   "raison": "case rose : Camouflage non décrit comme défense par les sources ; seule la morsure est citée (alternative : garder Camouflage « pour l'instant »)"
  },
  {
   "espece": "Muscardin",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP FR « en cas de disette » « quelques œufs d'oiseaux » ; WP EN ne le cite pas"
  },
  {
   "espece": "Muscardin",
   "sujet": "defense",
   "groupe": "Odeur ou goût repoussant",
   "raison": "non tranché : WP FR « légère odeur de musc » (origine du nom), usage défensif non précisé"
  },
  {
   "espece": "Roitelet huppé",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "désaccord : WP FR « graines visibles » ; oiseaux.net « insectivore exclusif »"
  },
  {
   "espece": "Roitelet huppé",
   "sujet": "defense",
   "groupe": null,
   "raison": "case rose : Camouflage non décrit comme défense (oiseaux.net : discret, vert)"
  },
  {
   "espece": "Pipit des arbres",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "non tranché : WP FR « bourgeons en hiver » (une source)"
  },
  {
   "espece": "Élanion blanc",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : tableau oiseaux.net seul"
  },
  {
   "espece": "Élanion blanc",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : tableau oiseaux.net seul"
  },
  {
   "espece": "Élanion blanc",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "une seule source, occasionnel : WP EN « small snakes » rarement, grenouilles rarement"
  },
  {
   "espece": "Élanion blanc",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "désaccord : oiseaux.net « petits passereaux » ; WP EN « injured birds » seulement"
  },
  {
   "espece": "Alouette lulu",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "part mineure : oiseaux.net « petites pousses » ; WP FR « végétaux »"
  },
  {
   "espece": "Gendarme",
   "sujet": "mange",
   "groupe": "Nectar, pollen et sève",
   "raison": "non tranché : punaise piqueuse-suceuse ; ni WP FR ni WP EN ne décrivent la sève"
  },
  {
   "espece": "Gendarme",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "non tranché : WP FR « polyphage »"
  },
  {
   "espece": "Traquet motteux",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : oiseaux.net « petites baies … occasionnellement » ; WP FR « en automne, des baies »"
  },
  {
   "espece": "Vautour fauve",
   "sujet": "defense",
   "groupe": null,
   "raison": "case rose : aucune source sur la défense (Odeur ou goût repoussant non appuyée)"
  },
  {
   "espece": "Pigeon ramier",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : WP FR « des invertébrés sont consommés occasionnellement » ; WP EN fourmis, larves « minor part »"
  },
  {
   "espece": "Pigeon ramier",
   "sujet": "mange",
   "groupe": "Nectar, pollen et sève",
   "raison": "non tranché : WP FR « fleurs » mangées, nectar non précisé"
  },
  {
   "espece": "Roitelet à triple bandeau",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : WP FR « y compris des graines » (une seule source)"
  },
  {
   "espece": "Roitelet à triple bandeau",
   "sujet": "mange",
   "groupe": "Nectar, pollen et sève",
   "raison": "occasionnel : WP EN « Occasionally takes pollen » (une seule source)"
  },
  {
   "espece": "Roitelet à triple bandeau",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : Fuite non décrite (WP FR rien ; WP EN seulement « quick evasive turns »)"
  },
  {
   "espece": "Silure glane",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP FR « Amphibiens : occasionnellement » ; WP EN « larger specimens: frogs, snakes »"
  },
  {
   "espece": "Silure glane",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : WP FR « jeunes ragondins… de façon occasionnelle » ; WP EN « larger specimens: rats, voles, coypu »"
  },
  {
   "espece": "Silure glane",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "non écarté : WP FR « quelques macrophytes non identifiés » dans des estomacs"
  },
  {
   "espece": "Serin cini",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : WP FR « un peu de verdure » ; WP EN « buds »"
  },
  {
   "espece": "Serin cini",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : WP FR « quelques chenilles consommées à l'occasion » ; WP EN « in the breeding season, insects »"
  },
  {
   "espece": "Crapaud commun",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : WP EN « even small mice » (une seule source)"
  },
  {
   "espece": "Crapaud commun",
   "sujet": "defense",
   "groupe": "Odeur ou goût repoussant",
   "raison": "cité par WP EN seule (« foul-tasting secretion »), même sécrétion que le venin"
  },
  {
   "espece": "Goujon commun",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "occasionnel : WP FR « zooplanctons » ; absent de FishBase et WP EN (une seule source)"
  },
  {
   "espece": "Pie bavarde",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP FR « lézards, occasionnellement » (< 1 %) ; WP EN ne cite ni reptiles ni amphibiens ; reste dans la liste"
  },
  {
   "espece": "Pie bavarde",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : WP FR « petits rongeurs, occasionnellement » (< 1 % des proies) ; WP EN « small mammals » ; reste dans la liste"
  },
  {
   "espece": "Pie bavarde",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "non écarté : WP EN « other vegetable substances » (vague)"
  },
  {
   "espece": "Sterne naine",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "non écarté : nid et œufs au sol dans le sable ou les galets, aucune source ne dit que les œufs sont camouflés ni que non"
  },
  {
   "espece": "Sterne naine",
   "sujet": "defense",
   "groupe": "Intimidation (se gonfle, siffle)",
   "raison": "non écarté : WP EN « will attack intruders » (attaque en piqué, pas de description)"
  },
  {
   "espece": "Sterne naine",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "non écarté : tableau oiseaux.net « vertébrés, poissons, charognes » (peu clair)"
  },
  {
   "espece": "Épinoche",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "occasionnel : WP EN « planktonic feeder » (formes de lac) ; WP FR ne le cite pas"
  },
  {
   "espece": "Crave à bec rouge",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : WP FR « charognes : chamois, lapins, moutons » (une seule source)"
  },
  {
   "espece": "Crave à bec rouge",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : WP FR « littoral : crustacés et mollusques » (une seule source)"
  },
  {
   "espece": "Goéland brun",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "occasionnel : oiseaux.net « parfois aussi d'algues » (une seule source)"
  },
  {
   "espece": "Goéland brun",
   "sujet": "defense",
   "groupe": "Intimidation (se gonfle, siffle)",
   "raison": "non écarté : goélands, comportement non décrit (comme goéland leucophée, lot 1)"
  },
  {
   "espece": "Goéland brun",
   "sujet": "defense",
   "groupe": "Régurgitation",
   "raison": "non écarté : goélands, comportement non décrit (comme goéland leucophée, lot 1) ; oiseaux.net ne parle que du poussin"
  },
  {
   "espece": "Goéland brun",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "non écarté : aucune des 3 sources ne cite le groupe, mais goéland omnivore opportuniste (même prudence que le goéland leucophée, lot 1)"
  },
  {
   "espece": "Fauvette pitchou",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : principale (Fuite) non décrite par WP FR, WP EN ni oiseaux.net ; Camouflage secondaire (WP EN) non tranché comme principale"
  },
  {
   "espece": "Pic vert",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : WP FR « fruits (occasionnels) ; baies et graines (occasionnelles, surtout en hiver) » ; WP EN : aucun fruit"
  },
  {
   "espece": "Pic vert",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP EN « small reptiles are also taken occasionally » (une seule source)"
  },
  {
   "espece": "Pic vert",
   "sujet": "defense",
   "groupe": "Intimidation (se gonfle, siffle)",
   "raison": "non écarté : WP FR « comportements stéréotypés » d'intimidation entre congénères (hocher la tête, ailes ouvertes)"
  },
  {
   "espece": "Pipit spioncelle",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "occasionnel : oiseaux.net « assez surprenant » ; WP EN une étude locale"
  },
  {
   "espece": "Pipit spioncelle",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "une seule source : oiseaux.net « petits crustacés », « gammares » ; WP FR et WP EN ne les citent pas"
  },
  {
   "espece": "Pipit spioncelle",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : oiseaux.net « quelques baies et quelques graines » ; WP FR « en hiver, des graines »"
  },
  {
   "espece": "Pipit spioncelle",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "non écarté : WP EN « Some plant material is taken »"
  },
  {
   "espece": "Pipit spioncelle",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "non écarté : nid « hidden in vegetation on the ground » (WP EN), « bien abrité par la végétation » (oiseaux.net)"
  },
  {
   "espece": "Rainette verte",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : Camouflage non confirmé (WP FR rien ; WP EN couleur variable sans fonction ; étude 2025 réservée)"
  },
  {
   "espece": "Épeire des fissures",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "cité sans le mot : WP FR « couleur sombre, teinte variant selon le lieu » ; WP EN « leaf-like markings »"
  },
  {
   "espece": "Épeire des fissures",
   "sujet": "defense",
   "groupe": "Fait le mort",
   "raison": "non écarté : araignée, comportement fréquent chez les araignées, non décrit dans WP FR ni EN"
  },
  {
   "espece": "Épeire des fissures",
   "sujet": "defense",
   "groupe": "Venin, poison ou acide",
   "raison": "non écarté : WP FR morsure douloureuse (venin seulement pour les proies)"
  },
  {
   "espece": "Escargot de Bourgogne",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "une seule source : ADW « fruits » ; WP FR « plantes fraîches », WP EN « nettle, plant litter » : aucun fruit"
  },
  {
   "espece": "Escargot de Bourgogne",
   "sujet": "mange",
   "groupe": "Nectar, pollen et sève",
   "raison": "une seule source : ADW « flowers, and sap »"
  },
  {
   "espece": "Rousserolle turdoïde",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP FR « un couple fut noté nourrissant ses jeunes de petits poissons » (cas ponctuel, Hongrie) ; WP EN « small fish »"
  },
  {
   "espece": "Rousserolle turdoïde",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "une seule source : WP EN « eat fruit during non-breeding seasons » ; WP FR ne cite aucun fruit"
  },
  {
   "espece": "Avocette élégante",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP EN « occasionally eats small fish » (WP FR traduit de WP EN ; oiseaux.net : aucun poisson)"
  },
  {
   "espece": "Avocette élégante",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : WP EN « occasionally eats … seeds, and small roots » (oiseaux.net : aucun végétal)"
  },
  {
   "espece": "Hotu",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : WP EN « aquatic plants » (WP FR et FishBase : diatomées et détritus seulement)"
  },
  {
   "espece": "Hotu",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "non écarté : adultes diatomées et détritus (WP FR, FishBase) mais larves et alevins « petits invertébrés » (WP FR, FishBase) et « invertebrates » (WP EN)"
  },
  {
   "espece": "Hotu",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "non écarté : mêmes « petits invertébrés » des larves et alevins, sans précision de groupe"
  },
  {
   "espece": "Cigogne noire",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : WP EN « It may feed on … mammals and birds » ; WP FR « mammifères » sans précision"
  },
  {
   "espece": "Cigogne noire",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP EN « It may feed on … birds » ; WP FR « oiseaux » sans précision"
  },
  {
   "espece": "Cigogne noire",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : WP EN « It may feed on … crabs » ; WP FR « crabes »"
  },
  {
   "espece": "Cloporte rugueux",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : WP EN « living plants » peu nutritives ; ADW « leaves »"
  },
  {
   "espece": "Cloporte rugueux",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : ADW « fruit » (une seule source)"
  },
  {
   "espece": "Cloporte rugueux",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : ADW « saprophagous (including carrion) » (une seule source)"
  },
  {
   "espece": "Cloporte rugueux",
   "sujet": "defense",
   "groupe": "Odeur ou goût repoussant",
   "raison": "non écarté : ADW « ammonia gas, which may deter predators »"
  },
  {
   "espece": "Triton marbré",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "non confirmé : WP FR, EN, DE, ES parlent seulement d'« invertébrés »"
  },
  {
   "espece": "Triton marbré",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "non confirmé : WP FR, EN, DE, ES parlent seulement d'« invertébrés »"
  },
  {
   "espece": "Triton marbré",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : aucune source ne décrit l'intimidation ni une autre défense"
  },
  {
   "espece": "Bruant jaune",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : WP FR « jeunes pousses vertes » ; WP EN « Grasses are also important »"
  },
  {
   "espece": "Iule à pattes blanches",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "une seule source : WP EN « feeds on encrusting algae » ; WP FR : « débris végétaux » seulement"
  },
  {
   "espece": "Iule à pattes blanches",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : WP EN « sometimes fruit such as raspberries » ; WP FR : aucun fruit"
  },
  {
   "espece": "Iule à pattes blanches",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "non écarté : WP FR « débris végétaux » (litière de feuilles)"
  },
  {
   "espece": "Spatule blanche",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "une seule source : WP EN « newts … frogs … tadpoles » ; WP FR ne les cite pas"
  },
  {
   "espece": "Spatule blanche",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "occasionnel : WP FR « avaler du plancton » ; WP EN « It may also take algae … possibly ingested accidentally »"
  },
  {
   "espece": "Spatule blanche",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "non écarté : WP EN « small fragments of aquatic plants … possibly ingested accidentally »"
  },
  {
   "espece": "Spatule blanche",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : aucune source ne décrit de défense"
  },
  {
   "espece": "Bécasseau variable",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : oiseaux.net « à l'occasion » (une seule source)"
  },
  {
   "espece": "Bécasseau variable",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : aucune source ne décrit de défense (groupe, fuite ou camouflage)"
  },
  {
   "espece": "Chevesne",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "retiré de la liste : aucune source (WP FR, WP EN, FishBase) ; non tranché"
  },
  {
   "espece": "Chevesne",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : WP EN « blackberries », « elderberry »"
  },
  {
   "espece": "Chevesne",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP EN « frogs » (une seule source)"
  },
  {
   "espece": "Chevesne",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : WP EN « voles » (une seule source)"
  },
  {
   "espece": "Chevesne",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP EN « young water birds » (une seule source)"
  },
  {
   "espece": "Corbeau freux",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP FR « de petits oiseaux et leur couvée, rarement » ; WP EN « eggs and young »"
  },
  {
   "espece": "Corbeau freux",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : WP FR « peut s'en nourrir en hiver mais ne peut s'en contenter » ; WP EN « occasionally carrion »"
  },
  {
   "espece": "Crapaud épineux",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "retiré de la liste : aucune source (WP EN et Alytes : invertébrés, une seule couleuvre)"
  },
  {
   "espece": "Crapaud épineux",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "retiré de la liste : aucune source (WP EN et Alytes : invertébrés, une seule couleuvre)"
  },
  {
   "espece": "Crapaud épineux",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : Alytes « le seul vertébré cité est une petite couleuvre » (exceptionnel) ; WP EN : aucun vertébré"
  },
  {
   "espece": "Crapaud épineux",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : aucune source ne décrit les défenses de l'espèce"
  },
  {
   "espece": "Bernache cravant",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "non écarté : WP FR « céréales d'hiver » (ressource récente), WP EN « winter-sown cereals »"
  },
  {
   "espece": "Bernache cravant",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : aucune source ne décrit la fuite ; Intimidation (agressivité, « defensive position » de WP EN) non écartée"
  },
  {
   "espece": "Blageon",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "non écarté : WP FR « d'œufs » (sans préciser)"
  },
  {
   "espece": "Blageon",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "non écarté : WP FR « petits invertébrés aquatiques », FishBase « invertebrates » (sans groupe)"
  },
  {
   "espece": "Blageon",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : aucune source ne décrit de défense (groupe, fuite, camouflage, pinces)"
  },
  {
   "espece": "Campagnol terrestre",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : WP FR « fruits en particulier » (vergers) ; WP EN sans régime"
  },
  {
   "espece": "Campagnol terrestre",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "une seule source : WP FR « parties souterraines des plantes (racines, bulbes, tubercules) » ; herbes et feuilles non citées ; pas de groupe « racines »"
  },
  {
   "espece": "Campagnol terrestre",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "non écarté : pelage brun roux (WP FR), aucune fonction décrite"
  },
  {
   "espece": "Campagnol terrestre",
   "sujet": "defense",
   "groupe": "Intimidation (se gonfle, siffle)",
   "raison": "non écarté : aucune source ne décrit la réaction à un danger"
  },
  {
   "espece": "Punaise arlequin",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "non écarté : punaise phytophage, seule la sève des graines d'ombellifères est citée (WP FR)"
  },
  {
   "espece": "Grand-duc d'Europe",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : WP EN « Secondary prey … large insects » ; WP FR « des scarabées aux faons »"
  },
  {
   "espece": "Grand-duc d'Europe",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : WP FR « crabes » (une seule source)"
  },
  {
   "espece": "Grand-duc d'Europe",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP EN « secondary prey … fish » ; WP FR « poissons »"
  },
  {
   "espece": "Triton alpestre",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "une seule source : WP EN « plankton » ; WP FR et Larousse : daphnies (crustacés)"
  },
  {
   "espece": "Triton alpestre",
   "sujet": "defense",
   "groupe": "Intimidation (se gonfle, siffle)",
   "raison": "non écarté : posture du ventre orange décrite comme dissuasive (Larousse), pas classée en Intimidation"
  },
  {
   "espece": "Bernard-l'ermite",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "non écarté : WP EN « small invertebrates » et « live animal tissues » (sans groupe) ; une seule source"
  },
  {
   "espece": "Bernard-l'ermite",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "non écarté : WP EN « dead and live animal tissues »"
  },
  {
   "espece": "Bernard-l'ermite",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "non écarté : WP EN « small invertebrates »"
  },
  {
   "espece": "Bernard-l'ermite",
   "sujet": "defense",
   "groupe": "Défense en groupe",
   "raison": "non écarté : INPN « ce pagure est grégaire », rôle défensif non précisé"
  },
  {
   "espece": "Crabier chevelu",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "non écarté : oiseaux.net, tableau « vertébrés, poissons, charognes » (générique)"
  },
  {
   "espece": "Crabier chevelu",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "non écarté : héron au nom de « crabier » ; aucune source (WP FR, WP EN, oiseaux.net) ne cite ni n'exclut les crustacés"
  },
  {
   "espece": "Crabier chevelu",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : aucune source ne décrit de défense ; Intimidation (cri « Karr ») non écartée"
  },
  {
   "espece": "Limace léopard",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "non écarté : WP EN « major agricultural pest » ; aucun fruit cité mais omnivore"
  },
  {
   "espece": "Limace léopard",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "non écarté : WP FR « carnivore à l'occasion » (limaces citées, pas de cadavres)"
  },
  {
   "espece": "Œdicnème criard",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP EN « occasionally small reptiles, frogs and rodents » ; WP FR « il attrape aussi des batraciens » ; oiseaux.net « voire petits oiseaux et mammifères »"
  },
  {
   "espece": "Œdicnème criard",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : WP EN « occasionally ... rodents » ; WP FR « aussi ... des rongeurs » ; oiseaux.net « voire ... mammifères »"
  },
  {
   "espece": "Œdicnème criard",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP FR « ou encore des œufs » (origine non précisée) ; oiseaux.net « voire petits oiseaux » ; WP EN : rien"
  },
  {
   "espece": "Bihoreau gris",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP FR œufs et petits d'autres nids « à l'occasion » ; oiseaux.net : non cité"
  },
  {
   "espece": "Bihoreau gris",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : WP EN « carrion » ; oiseaux.net seulement dans une fiche de données ; WP FR : non cité"
  },
  {
   "espece": "Bihoreau gris",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "non tranché : WP EN « plant material » sans précision ; WP FR et oiseaux.net : rien"
  },
  {
   "espece": "Criquet ensanglanté",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : aucune des 4 sources (WP FR, WP EN, orthoptera.ch, WP DE) ne décrit de défense de l'adulte ; fémurs rouges décrits sans rôle"
  },
  {
   "espece": "Micrommate émeraude",
   "sujet": "defense",
   "groupe": "Couleurs d'avertissement",
   "raison": "non écarté : mâle à bandes rouges et jaunes décrit sans rôle (WP FR, WP EN, WP DE)"
  },
  {
   "espece": "Micrommate émeraude",
   "sujet": "defense",
   "groupe": "Venin, poison ou acide",
   "raison": "non écarté : araignée venimeuse ; WP DE dit seulement « pas de danger pour l'homme » ; aucune source ne parle de venin défensif"
  },
  {
   "espece": "Soucoupe commune",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "retiré de la liste : seuls lichens (et cyanobactéries) cités ; exclu car les lichens contiennent des algues (réponse à moitié vraie)"
  },
  {
   "espece": "Soucoupe commune",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "non écarté : WP FR « herbivore » sans aliment précis ; WP EN et étude : lichens"
  },
  {
   "espece": "Soucoupe commune",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "non écarté : coquille gris-brun sur roche (WP EN) mais rôle non dit"
  },
  {
   "espece": "Pouillot véloce",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : WP FR « occasionnellement des graines et des baies » ; oiseaux.net « quelques baies et graines »"
  },
  {
   "espece": "Rougegorge familier",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP EN « small vertebrates (including fish and lizards) » seule source"
  },
  {
   "espece": "Rougegorge familier",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP EN « small vertebrates (including fish and lizards) » seule source"
  },
  {
   "espece": "Rougegorge familier",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : WP EN « and carrion » seule source"
  },
  {
   "espece": "Vélelle",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "non écarté : « plancton » sans détail (WP EN) ; copépodes plausibles dans le zooplancton"
  },
  {
   "espece": "Vélelle",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "non écarté : « plancton » sans détail (WP EN) ; œufs et larves de poissons plausibles dans le zooplancton"
  },
  {
   "espece": "Vélelle",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "non écarté : couleur bleue décrite (WP FR, WP EN) sans rôle défensif"
  },
  {
   "espece": "Fauvette des jardins",
   "sujet": "mange",
   "groupe": "Nectar, pollen et sève",
   "raison": "occasionnel : oiseaux.net « les pollens et les nectars » (sources ponctuelles) ; WP FR : rien"
  },
  {
   "espece": "Bruant fou",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "non écarté : WP FR « friand de céréales et de graminées » (graines, mais graminées citées)"
  },
  {
   "espece": "Lote",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "stade : zooplancton mangé seulement par larves et juvéniles (FishBase, WP EN)"
  },
  {
   "espece": "Lote",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP EN « have been known to eat frogs, snakes, and birds » ; FishBase : rien"
  },
  {
   "espece": "Lote",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "non écarté : robe jaune à brune marbrée (FishBase) sans rôle dit ; WP EN : camouflage non mentionné"
  },
  {
   "espece": "Ver du fumier",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "non écarté : « végétation en décomposition » (WP FR, WP EN « rotting vegetation ») contient des feuilles"
  },
  {
   "espece": "Ver du fumier",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "non écarté : déchets végétaux de compost possibles ; ni WP FR ni WP EN ne les citent"
  },
  {
   "espece": "Ver du fumier",
   "sujet": "defense",
   "groupe": "Couleurs d'avertissement",
   "raison": "non écarté : WP FR décrit la couleur rouge seulement comme caractère d'identification"
  },
  {
   "espece": "Barge à queue noire",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : WP FR grains de riz (rizières du Portugal) ; oiseaux.net : rien"
  },
  {
   "espece": "Barge à queue noire",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "une seule source : oiseaux.net « petits crustacés » ; WP FR : « invertébrés », pas de crustacés"
  },
  {
   "espece": "Barge à queue noire",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "retiré de la liste (aucune des 2 sources) ; exclu par prudence (régime végétal local possible)"
  },
  {
   "espece": "Barge à queue noire",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "non écarté : plumage brun beige et œufs tachetés décrits sans rôle (WP FR, oiseaux.net)"
  },
  {
   "espece": "Barge à queue noire",
   "sujet": "defense",
   "groupe": "Intimidation (se gonfle, siffle)",
   "raison": "non écarté : défense collective de la colonie, les oiseaux tournent autour du visiteur (oiseaux.net)"
  },
  {
   "espece": "Chat forestier",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP FR batraciens au frai ; OFB proies secondaires ; WP EN reptiles localement"
  },
  {
   "espece": "Chat forestier",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : zooplus seul (source grand public) ; WP FR, WP EN, OFB : rien"
  },
  {
   "espece": "Chat forestier",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : Province de Liège seule (source grand public) ; WP FR et EN : rien"
  },
  {
   "espece": "Chat forestier",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : WP FR « à l'occasion » ; faune-auvergne « cadavre »"
  },
  {
   "espece": "Chat forestier",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : Intimidation, Morsure, Refuge non décrits par WP FR, WP EN, OFB (seulement « extrêmement timides » et rochers comme gîtes)"
  },
  {
   "espece": "Pinson des arbres",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "non écarté : WP FR et oiseaux.net citent les bourgeons et les fleurs, pas les feuilles"
  },
  {
   "espece": "Pipit rousseline",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "une seule source : oiseaux.net « petites graines » ; WP FR « insectes » seulement ; WP EN « insectivorous »"
  },
  {
   "espece": "Grive musicienne",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "une seule source : oiseaux.net « crustacés terrestres » (cloportes) ; WP FR : rien"
  },
  {
   "espece": "Pic épeichette",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : oiseaux.net « peu porté vers les graines », quelques-unes aux mangeoires ; WP FR : rien"
  },
  {
   "espece": "Cistude d'Europe",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : WP FR « à l'occasion », INPN « occasionnellement poissons malades ou morts »"
  },
  {
   "espece": "Cistude d'Europe",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "selon l'âge : WP FR « avec l'âge ... de plus en plus de végétaux » ; INPN « presque exclusivement carnivore »"
  },
  {
   "espece": "Cistude d'Europe",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "non écarté : végétaux aquatiques plausibles (WP FR, WP EN : « plants » sans précision)"
  },
  {
   "espece": "Cistude d'Europe",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "non écarté : INPN cite « œufs » (origine non lisible), WP FR : rien"
  },
  {
   "espece": "Cistude d'Europe",
   "sujet": "defense",
   "groupe": "Se cache dans sa coquille",
   "raison": "non écarté : tortue ; WP FR et WP EN ne décrivent pas la rétraction"
  },
  {
   "espece": "Cistude d'Europe",
   "sujet": "defense",
   "groupe": "Odeur ou goût repoussant",
   "raison": "non écarté : musc possible chez les tortues ; WP FR et WP EN : rien"
  },
  {
   "espece": "Bouton commun",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : WP DE « seltener auch Aas (tote Insekten) » ; WP EN : rien"
  },
  {
   "espece": "Bouton commun",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "non écarté : WP DE cite des insectes morts (charogne) ; réponse à moitié vraie"
  },
  {
   "espece": "Bruant zizi",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : Fuite non cité par WP FR ni oiseaux.net ; seul indice : caché par le feuillage (oiseaux.net)"
  },
  {
   "espece": "Pie-grièche grise",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP FR « ne dédaigne pas ... les amphibiens » ; oiseaux.net lézards et petits amphibiens « quand l'occasion se présente »"
  },
  {
   "espece": "Pie-grièche grise",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "incertain : oiseaux.net tableau de données seulement"
  },
  {
   "espece": "Martre des pins",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP EN « frogs » dans la liste des dents ; WP FR : rien"
  },
  {
   "espece": "Martre des pins",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : WP FR « ne dédaigne pas les charognes » ; WP EN la cite dans la liste des dents"
  },
  {
   "espece": "Martre des pins",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : Fuite et Odeur non décrites par WP FR et WP EN (seul le refuge est cité)"
  },
  {
   "espece": "Hanneton commun",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : WP FR et WP EN ne décrivent aucune défense de l'adulte (ni de la larve)"
  },
  {
   "espece": "Mouette tridactyle",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "partiel : WP FR « il lui arrive de capturer du zooplancton » (hiver) ; oiseaux.net « crustacés planctoniques »"
  },
  {
   "espece": "Mouette tridactyle",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "non écarté : WP FR et oiseaux.net citent les déchets de poisson des bateaux de pêche"
  },
  {
   "espece": "Mouette tridactyle",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : WP FR graines et pommes de terre à la reproduction ; oiseaux.net : rien"
  },
  {
   "espece": "Mouette tridactyle",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : WP FR seule ; oiseaux.net : rien"
  },
  {
   "espece": "Mouette tridactyle",
   "sujet": "defense",
   "groupe": "Intimidation (se gonfle, siffle)",
   "raison": "non écarté : colonies denses ; ni WP FR ni oiseaux.net ne décrivent de comportement d'intimidation"
  },
  {
   "espece": "Mouette tridactyle",
   "sujet": "defense",
   "groupe": "Régurgitation",
   "raison": "non écarté : mouette ; WP FR ne cite la régurgitation que pour nourrir les poussins"
  },
  {
   "espece": "Grand gravelot",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "une seule source : oiseaux.net « crustacés (isopodes, amphipodes) » ; WP FR : rien"
  },
  {
   "espece": "Grand gravelot",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : WP FR « parfois des fragments de végétaux »"
  },
  {
   "espece": "Grand gravelot",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "non écarté : WP FR « fragments de végétaux » sans précision"
  },
  {
   "espece": "Rollier d'Europe",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "une seule source : oiseaux.net « jeunes passereaux » ; WP FR, WP EN : rien"
  },
  {
   "espece": "Tournepierre à collier",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : oiseaux.net insectes et larves occasionnels ; WP EN : surtout en reproduction"
  },
  {
   "espece": "Tournepierre à collier",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP EN « this behaviour is uncommon » ; WP FR et oiseaux.net : rien"
  },
  {
   "espece": "Tournepierre à collier",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "une seule source : WP EN (carrion, secondary) ; WP FR et oiseaux.net : rien"
  },
  {
   "espece": "Tournepierre à collier",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : oiseaux.net « il peut également se nourrir de graines » (toundra)"
  },
  {
   "espece": "Tournepierre à collier",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP EN « fish » secondaire ; WP FR et oiseaux.net : rien"
  },
  {
   "espece": "Tournepierre à collier",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "non écarté : WP EN « plant material » sans précision"
  },
  {
   "espece": "Mésange bleue",
   "sujet": "mange",
   "groupe": "Nectar, pollen et sève",
   "raison": "complément saisonnier : WP FR « complétées de ... nectar, voire de sève » ; oiseaux.net nectar et pollen au printemps"
  },
  {
   "espece": "Mésange bleue",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : Fuite non décrite ; WP FR décrit plutôt l'intimidation (« ailes pendantes et bec entr'ouvert en signe de menace ») et le refuge en cavité"
  },
  {
   "espece": "Spirographe",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "non écarté : WP EN « zooplankton » (copépodes plausibles) ; WP FR « organismes microscopiques »"
  },
  {
   "espece": "Grimpereau des bois",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "une seule source : WP FR « graines de conifères » aux mois froids ; oiseaux.net : rien"
  },
  {
   "espece": "Grimpereau des bois",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "une seule source : WP FR cite des cloportes ; oiseaux.net : rien"
  },
  {
   "espece": "Bec-croisé des sapins",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : WP FR « font aussi partie » ; oiseaux.net « quelques menus invertébrés »"
  },
  {
   "espece": "Bec-croisé des sapins",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "non tranché : WP FR et oiseaux.net citent les graines d'herbacées et les bourgeons, pas les feuilles ni les herbes"
  },
  {
   "espece": "Geai des chênes",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "une seule source : oiseaux.net « petits lézards et amphibiens » ; WP FR : rien"
  },
  {
   "espece": "Geai des chênes",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP FR « à l'occasion », « plus rarement » ; oiseaux.net « penchant occasionnel »"
  },
  {
   "espece": "Geai des chênes",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "non écarté : oiseaux.net « se faire discret » devant l'autour ; WP FR : rien"
  },
  {
   "espece": "Barbeau fluviatile",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "stade : WP EN diatomées « particularly important for young fish » ; WP FR : rien"
  },
  {
   "espece": "Barbeau fluviatile",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "une seule source : WP FR « de jeunes poissons ou œufs » ; WP EN : rien"
  },
  {
   "espece": "Pie-grièche à tête rousse",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : WP EN « very occasionally small mammals and small birds » ; WP FR les cite sans réserve (rongeurs) : désaccord, exclusion de prudence"
  },
  {
   "espece": "Pie-grièche à tête rousse",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP EN « very occasionally ... small birds » ; WP FR « petits passereaux » sans réserve : désaccord, exclusion de prudence"
  },
  {
   "espece": "Tarin des aulnes",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "bourgeons de résineux cités comme exceptionnels (WP FR « Plus exceptionnellement ... baies et bourgeons de résineux ») ; rattachement des bourgeons à Herbes et feuilles non tranché ; WP EN : graines d'herbacées seulement"
  },
  {
   "espece": "Ver luisant",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : aucune défense de l'adulte décrite : WP FR seulement « semblent peu appréciés des prédateurs » (sans mécanisme ni stade), WP EN : rien (l'adulte ne mange pas, ne fait que briller) ; stade non déterminable ; défense exclue en entier"
  },
  {
   "espece": "Merle noir",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : WP EN « on rare occasions » (petits mammifères)"
  },
  {
   "espece": "Merle noir",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP FR « Exceptionnellement ... têtards ... petits amphibiens adultes ou des lézards » ; WP EN « occasionally hunted »"
  },
  {
   "espece": "Merle noir",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : Fuite non décrite : WP FR = cris d'alarme et jeunes qui « vont se mettre à couvert », WP EN = cris d'alarme, aucun comportement de fuite ; Camouflage non cité non plus ; défense exclue en entier (principale Fuite discutable)"
  },
  {
   "espece": "Tadorne de Belon",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : Anigaido « amphibiens et têtards » ; WP FR et WP EN : rien"
  },
  {
   "espece": "Clausilie commune",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "plausible non écarté : escargots broutant les algues des écorces (FCPN, général) ; WP EN : lichens seulement ; WP FR vide"
  },
  {
   "espece": "Clausilie commune",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "plausible non écarté : matière végétale (général) ; WP EN : lichens seulement ; WP FR vide"
  },
  {
   "espece": "Ibis falcinelle",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP EN « occasional prey » (fish) ; FWS « snakes, fish »"
  },
  {
   "espece": "Ibis falcinelle",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP EN « nestling birds » ; FWS : rien"
  },
  {
   "espece": "Ibis falcinelle",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : FWS « grains and seeds » ; WP EN : rien"
  },
  {
   "espece": "Ibis falcinelle",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP EN « occasional prey: ... amphibians, lizards, small snakes »"
  },
  {
   "espece": "Ibis falcinelle",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "plausible non écarté : Universalis cite des rongeurs pour la famille des ibis ; rien pour l'espèce (WP EN, FWS)"
  },
  {
   "espece": "Crabe marbré",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "« oui » non confirmé : INPN et WP EN citent algues, patelles, moules, congénères ; aucune charogne"
  },
  {
   "espece": "Crabe marbré",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "plausible : Vikidia « petits poissons » (source faible) ; WP EN et INPN : rien"
  },
  {
   "espece": "Crabe marbré",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "plausible : carapace marbrée, mais WP EN ne lui donne aucun rôle défensif"
  },
  {
   "espece": "Crabe marbré",
   "sujet": "defense",
   "groupe": "Intimidation (se gonfle, siffle)",
   "raison": "plausible : crabe qui lève les pinces ; aucune source ne le décrit"
  },
  {
   "espece": "Aigle botté",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : WP FR « Il capture aussi des insectes, tout en marchant » ; WP EN : rien"
  },
  {
   "espece": "Campagnol souterrain",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "non confirmé : EltonTraits donne 20 % de graines, aucune autre source"
  },
  {
   "espece": "Frelon asiatique",
   "sujet": "defense",
   "groupe": "Couleurs d'avertissement",
   "raison": "plausible : livrée jaune et noire, mais les 2 sources la décrivent seulement pour l'identification"
  },
  {
   "espece": "Pélodyte ponctué",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP FR « Les têtards peuvent dévorer les pontes des Crapauds calamites » (stade têtard)"
  },
  {
   "espece": "Pélodyte ponctué",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "plausible : têtards « régime végétarien » (Arborium) ; adulte : rien"
  },
  {
   "espece": "Abeille charpentière",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "plausible : corps noir à reflets bleus pouvant la faire confondre avec un coléoptère (WP FR), rôle non dit"
  },
  {
   "espece": "Abeille charpentière",
   "sujet": "defense",
   "groupe": "Intimidation (se gonfle, siffle)",
   "raison": "plausible : vol « rapide et très bruyant » (WP FR), rôle non dit"
  },
  {
   "espece": "Carabe doré",
   "sujet": "defense",
   "groupe": "Venin, poison ou acide",
   "raison": "non écarté : liquide défensif « odorant et caustique » (Universalis, genre) ; l'espèce n'est pas décrite précisément"
  },
  {
   "espece": "Musaraigne des jardins",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP EN « newts » dans la liste ; WP FR « petits vertébrés » sans précision"
  },
  {
   "espece": "Musaraigne des jardins",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "WP EN : seulement sur les îles Scilly (« almost exclusively amphipods ») ; WP FR : rien"
  },
  {
   "espece": "Musaraigne des jardins",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : WP FR « aussi quelques fruits » ; WP EN : rien"
  },
  {
   "espece": "Musaraigne des jardins",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "plausible : WP FR « petits vertébrés » sans précision"
  },
  {
   "espece": "Bouvreuil pivoine",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "« oui » non confirmé : WP FR cite des herbes (armoise, orties...) sans dire si ce sont les graines ou les feuilles ; WP EN : graines et bourgeons seulement, aucune feuille"
  },
  {
   "espece": "Chocard à bec jaune",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : WP FR « charognes » dans la liste ; WP EN : rien"
  },
  {
   "espece": "Chocard à bec jaune",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP FR « œufs » dans la liste ; WP EN : rien"
  },
  {
   "espece": "Chocard à bec jaune",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "plausible : WP EN fleurs de crocus (pistils) en occasionnel ; non confirmé comme feuilles"
  },
  {
   "espece": "Pseudorasbora",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "non confirmé : une seule étude (graines presque exclusives dans un étang)"
  },
  {
   "espece": "Anémone verte",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "plausible : « opportunistic omnivorous suspension feeders » (Chintiroglou) ; les zooxanthelles sont symbiotes, pas des proies"
  },
  {
   "espece": "Anémone verte",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "plausible : « omnivorous » (Chintiroglou) ; rien de précis"
  },
  {
   "espece": "Anémone verte",
   "sujet": "defense",
   "groupe": "Piquants ou poils urticants",
   "raison": "à moitié vrai : « tentacules ... urticants » (WP FR) ; ce sont les cellules urticantes qui portent le venin"
  },
  {
   "espece": "Moineau domestique",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : WP FR « les lézards, les grenouilles ou les souris » ; WP EN : rien"
  },
  {
   "espece": "Moineau domestique",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP FR et WP EN « lizards and frogs »"
  },
  {
   "espece": "Moineau domestique",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : WP EN « where available » ; WP FR « mollusques et crustacés »"
  },
  {
   "espece": "Moineau domestique",
   "sujet": "mange",
   "groupe": "Nectar, pollen et sève",
   "raison": "occasionnel : nectar (Sophora/kowhai), fleurs déchirées au printemps"
  },
  {
   "espece": "Moineau domestique",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "« oui » non confirmé : WP FR « herbes folles » (graines d'adventices), WP EN : graines, bourgeons, fleurs, aucune feuille"
  },
  {
   "espece": "Chouette de Tengmalm",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP EN « small amphibians » ; WP FR : rien"
  },
  {
   "espece": "Chouette de Tengmalm",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : WP EN « insects (such as beetles) » ; WP FR : rien"
  },
  {
   "espece": "Decticelle cendrée",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "plausible : WP EN « plants such as bramble » (mûres possibles) ; WP FR « végétaux »"
  },
  {
   "espece": "Decticelle cendrée",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "plausible : « omnivores » (WP FR) ; rien de précis"
  },
  {
   "espece": "Grand capricorne",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "plausible : adulte brun sombre à noir sur l'écorce de chêne, rôle non dit"
  },
  {
   "espece": "Oursin violet",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : WP FR « animaux morts gisant sur les fonds » ; WP EN : rien"
  },
  {
   "espece": "Chevêchette d'Europe",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP FR « plus rarement de petits reptiles » ; WP EN « lizards »"
  },
  {
   "espece": "Chevêchette d'Europe",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : WP FR « plus rarement ... insectes » ; WP EN « insects »"
  },
  {
   "espece": "Chevêchette d'Europe",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP EN « fish » seule"
  },
  {
   "espece": "Cicindèle champêtre",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "plausible : adulte vert métallique ; rôle non dit"
  },
  {
   "espece": "Coronelle girondine",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : WP FR « parfois de petits mammifères ou d'autres petits serpents »"
  },
  {
   "espece": "Coronelle girondine",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "plausible : serpent discret ; aucune source"
  },
  {
   "espece": "Coronelle girondine",
   "sujet": "defense",
   "groupe": "Odeur ou goût repoussant",
   "raison": "plausible : les coronelles émettent un musc quand on les manipule ; aucune source lue"
  },
  {
   "espece": "Fauvette mélanocéphale",
   "sujet": "mange",
   "groupe": "Vers et mollusques",
   "raison": "occasionnel : WP FR « occasionnellement, de petits escargots »"
  },
  {
   "espece": "Merle à plastron",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP FR « lézards » ; WP EN « small amphibians and reptiles »"
  },
  {
   "espece": "Pouillot de Bonelli",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : WP FR « Il peut aussi se nourrir de fruits, comme les mûres » ; WP EN « insectivorous » seulement"
  },
  {
   "espece": "Vautour percnoptère",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP FR « occasionnellement » (insectes, lézards, amphibiens) ; WP EN « sometimes small animals »"
  },
  {
   "espece": "Vautour percnoptère",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : WP FR « occasionnellement » ; WP EN : insectes du fumier"
  },
  {
   "espece": "Vautour percnoptère",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : WP EN « vegetable matter » listé ; WP FR : rien"
  },
  {
   "espece": "Vautour percnoptère",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : WP EN « prey on small mammals, birds, and reptiles » ; WP FR : rien"
  },
  {
   "espece": "Vautour percnoptère",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : Fuite non décrite (WP FR : aucune défense ; WP EN : vol en thermiques sans lien avec une défense, « adults rarely drive off predators ») ; Refuge (nid en falaise) : habitat ; défense exclue en entier ; Odeur, Camouflage : non cités"
  },
  {
   "espece": "Mésange charbonnière",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : chauves-souris hibernantes (WP FR « manger leur cerveau » ; WP EN « eating the brains of roosting pipistrelle bats »)"
  },
  {
   "espece": "Mésange charbonnière",
   "sujet": "mange",
   "groupe": "Nectar, pollen et sève",
   "raison": "occasionnel : WP FR « nectar des fritillaires et des groseilliers, de pollen » ; WP EN : rien"
  },
  {
   "espece": "Mésange charbonnière",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : WP FR « la graisse ... sous la peau des carcasses » ; WP EN : rien"
  },
  {
   "espece": "Mésange charbonnière",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP FR cite des passereaux tués (sizerin, roitelet) ; WP EN : rien"
  },
  {
   "espece": "Mésange charbonnière",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : cloportes cités parmi de nombreux invertébrés (WP FR ; WP EN « woodlice »)"
  },
  {
   "espece": "Mésange charbonnière",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "plausible : WP FR « bourgeons » ; rien sur les feuilles"
  },
  {
   "espece": "Abeille mellifère",
   "sujet": "defense",
   "groupe": "Odeur ou goût repoussant",
   "raison": "plausible : phéromone d'alarme (WP FR, WP EN) ; pas un goût repoussant mais ambigu"
  },
  {
   "espece": "Coccinelle asiatique",
   "sujet": "defense",
   "groupe": "Couleurs d'avertissement",
   "raison": "une seule source (WP FR), limitée au jeune adulte jaune"
  },
  {
   "espece": "Coccinelle asiatique",
   "sujet": "defense",
   "groupe": "Fait le mort",
   "raison": "plausible chez les coccinelles, mais non cité (WP FR, WP EN) : non écarté"
  },
  {
   "espece": "Congre",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : WP FR « peut aussi se nourrir de cadavres » ; WP EN « are thought to scavenge »"
  },
  {
   "espece": "Congre",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "WP FR : la pigmentation suit le fond (rôle non dit) ; plausible, non écarté"
  },
  {
   "espece": "Fourmilion",
   "sujet": "defense",
   "groupe": null,
   "raison": "aucune défense décrite pour l'adulte ni la larve (WP FR, WP EN) : case rose"
  },
  {
   "espece": "Pic épeiche",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP FR oisillons de mésanges « il lui arrive » ; WP EN nids pillés"
  },
  {
   "espece": "Pic épeiche",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : WP EN seule « carrion may be eaten »"
  },
  {
   "espece": "Pouillot siffleur",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : WP FR « il mange occasionnellement des baies » (automne) ; WP EN : insectivore seulement"
  },
  {
   "espece": "Triton crêté",
   "sujet": "defense",
   "groupe": "Couleurs d'avertissement",
   "raison": "une seule source (WP EN)"
  },
  {
   "espece": "Triton crêté",
   "sujet": "defense",
   "groupe": "Intimidation (se gonfle, siffle)",
   "raison": "WP EN décrit le réflexe d'Unken (« roll up and secrete a milky substance ») : le rapprochement avec Intimidation n'est pas tranché"
  },
  {
   "espece": "Triton crêté",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "WP EN : dos brun foncé sans rôle dit ; plausible, non écarté"
  },
  {
   "espece": "Criquet égyptien",
   "sujet": "defense",
   "groupe": null,
   "raison": "aucune défense décrite (WP FR, WP EN) : case rose"
  },
  {
   "espece": "Flamant rose",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP FR « poissons et leurs œufs » ; WP EN « small fish »"
  },
  {
   "espece": "Grande alose",
   "sujet": "defense",
   "groupe": null,
   "raison": "principale non confirmée : bancs cités sans fonction défensive (INPN), WP FR et EN muettes"
  },
  {
   "espece": "Grande alose",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "seuls « les plus gros individus » sont piscivores (INPN) ; Bretagne Grands Migrateurs : les plus grands"
  },
  {
   "espece": "Grande alose",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "larves d'insectes aquatiques des alosons en eau douce seulement (INPN) ; l'adulte marin mange du zooplancton"
  },
  {
   "espece": "Mulet porc",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "alevins et larves seulement (zooplancton) ; adulte détritivore"
  },
  {
   "espece": "Mulet porc",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "chironomes adultes chez les alevins seulement"
  },
  {
   "espece": "Ormeau",
   "sujet": "defense",
   "groupe": null,
   "raison": "aucune défense décrite : case rose"
  },
  {
   "espece": "Sangsue médicinale",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "jeunes seulement (INPN)"
  },
  {
   "espece": "Sangsue médicinale",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "jeunes seulement (INPN) ; WP FR et EN : non cités"
  },
  {
   "espece": "Sangsue médicinale",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "sang de mammifères, taille de l'hôte non précisée (cheval, bétail…)"
  },
  {
   "espece": "Genette commune",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : WP FR seule (graminées, aide à la digestion)"
  },
  {
   "espece": "Genette commune",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : WP FR « fruits ou baies » occasionnels ; WP EN : figues, olives"
  },
  {
   "espece": "Genette commune",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "WP EN seule (lézards, amphibiens) ; WP FR : non cité"
  },
  {
   "espece": "Goéland marin",
   "sujet": "defense",
   "groupe": "Défense en groupe",
   "raison": "WP EN seule, « prone to mobbing » pour les goélands en général"
  },
  {
   "espece": "Goéland marin",
   "sujet": "defense",
   "groupe": "Régurgitation",
   "raison": "régurgitation défensive des goélands non citée (WP FR, WP EN) ; plausible, non écartée"
  },
  {
   "espece": "Goéland marin",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : WP EN « insects … when available »"
  },
  {
   "espece": "Goéland marin",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : WP FR baies ; WP EN « berries when available »"
  },
  {
   "espece": "Pic cendré",
   "sujet": "defense",
   "groupe": null,
   "raison": "aucune défense décrite (WP FR, WP EN)"
  },
  {
   "espece": "Faucon d'Éléonore",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "WP EN : seulement des chauves-souris, « occasionally » ; aucun rongeur cité"
  },
  {
   "espece": "Fauvette babillarde",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : WP FR « peut aussi consommer des baies » ; WP EN « will also take berries »"
  },
  {
   "espece": "Loup gris",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP EN « when other food is scarce » ; WP FR reptiles cités sans détail"
  },
  {
   "espece": "Loup gris",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : WP EN « in times of scarcity » ; WP FR cités dans la liste"
  },
  {
   "espece": "Loup gris",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : WP FR raisin ; WP EN pommes, baies : complément"
  },
  {
   "espece": "Loup gris",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : WP EN « they also eat grass » (surtout pour vomir) ; WP FR : non cité"
  },
  {
   "espece": "Loup gris",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : WP FR « quand les proies sont rares » ; WP EN sauterelles « known to »"
  },
  {
   "espece": "Loup gris",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP FR saumons en automne ; WP EN « in some areas »"
  },
  {
   "espece": "Loup gris",
   "sujet": "defense",
   "groupe": null,
   "raison": "principale non confirmée : sources parlent de défense en meute et de posture, pas de fuite"
  },
  {
   "espece": "Poulpe commun",
   "sujet": "defense",
   "groupe": "Venin, poison ou acide",
   "raison": "WP EN : venin pour la proie, pas comme défense ; non écarté (WP FR : « ne mord jamais »)"
  },
  {
   "espece": "Rainette méridionale",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "régime détaillé introuvable (WP FR, WP EN vides) ; cloportes plausibles"
  },
  {
   "espece": "Rainette méridionale",
   "sujet": "defense",
   "groupe": "Odeur ou goût repoussant",
   "raison": "WP FR, WP EN : rien ; sécrétions cutanées plausibles"
  },
  {
   "espece": "Sonneur à ventre jaune",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "WP FR et Futura « petits crustacés » ; INPN, fiche Marne, fiche Grand Est : vers et insectes seulement"
  },
  {
   "espece": "Troglodyte mignon",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "WP FR « petits crustacés » ; WP EN : aucun crustacé ; une seule source"
  },
  {
   "espece": "Troglodyte mignon",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : WP FR graines « occasionnellement », baies « de temps en temps » ; WP EN : quelques graines"
  },
  {
   "espece": "Géotrupe du fumier",
   "sujet": "defense",
   "groupe": null,
   "raison": "aucune défense décrite (WP FR, WP EN)"
  },
  {
   "espece": "Pisaure admirable",
   "sujet": "defense",
   "groupe": "Perte d'un membre",
   "raison": "autotomie plausible chez les araignées, non citée (WP FR, WP EN)"
  },
  {
   "espece": "Puffin de Scopoli",
   "sujet": "defense",
   "groupe": null,
   "raison": "défense non confirmée : terrier = nid, pas une défense dite"
  },
  {
   "espece": "Puffin de Scopoli",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "déchets de pêche rejetés (poissons morts) : rapprochement non tranché"
  },
  {
   "espece": "Frelon européen",
   "sujet": "defense",
   "groupe": "Intimidation (se gonfle, siffle)",
   "raison": "WP EN : danse d'alarme et attaques près du nid, assimilable à une menace ; non tranché"
  },
  {
   "espece": "Musaraigne carrelet",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "WP FR « parfois » graines oléagineuses"
  },
  {
   "espece": "Musaraigne carrelet",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "WP EN « small rodents » ; WP FR « petits vertébrés »"
  },
  {
   "espece": "Musaraigne carrelet",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "WP FR « petits vertébrés » non précisé"
  },
  {
   "espece": "Musaraigne carrelet",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "plausible chez les musaraignes, non cité"
  },
  {
   "espece": "Musaraigne carrelet",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "cloportes plausibles, non cités"
  },
  {
   "espece": "Musaraigne carrelet",
   "sujet": "defense",
   "groupe": null,
   "raison": "principale non confirmée : sources parlent de venin pour les proies"
  },
  {
   "espece": "Coque commune",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "non cité (WP FR, WP EN) ; plausible (coquille sableuse)"
  },
  {
   "espece": "Crocidure leucode",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : WP EN « occasionally on small vertebrates » ; WP FR « petits vertébrés »"
  },
  {
   "espece": "Crocidure leucode",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP EN « occasionally … small vertebrates » ; WP FR « petits vertébrés »"
  },
  {
   "espece": "Crocidure leucode",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : WP FR « quelques fruits » ; WP EN : non cité"
  },
  {
   "espece": "Crocidure leucode",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : « petits vertébrés » non précisé (WP FR, WP EN)"
  },
  {
   "espece": "Pélagie",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP FR « parfois de petits poissons » ; WP EN : œufs et larves seulement"
  },
  {
   "espece": "Pélagie",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "non cité (WP FR, WP EN) ; corps transparent plausible"
  },
  {
   "espece": "Pélagie",
   "sujet": "defense",
   "groupe": "Piquants ou poils urticants",
   "raison": "cnidocytes (cellules urticantes) : rapprochement non tranché avec « poils urticants »"
  },
  {
   "espece": "Chamois",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : WP FR « parfois » baies"
  },
  {
   "espece": "Chamois",
   "sujet": "defense",
   "groupe": "Morsure, cornes ou serres",
   "raison": "WP FR seule ; WP EN : cornes non présentées comme défense"
  },
  {
   "espece": "Chamois",
   "sujet": "defense",
   "groupe": "Refuge (terrier, eau, falaise)",
   "raison": "WP FR seule (falaises) ; WP EN : terrain décrit sans fonction"
  },
  {
   "espece": "Blennie fluviatile",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "une seule source grand public (fishipedia « petits poissons ») ; FishBase et Subaqua : non cités"
  },
  {
   "espece": "Blennie fluviatile",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "non cité ; blennie brun-vert plausible"
  },
  {
   "espece": "Blennie fluviatile",
   "sujet": "defense",
   "groupe": "Intimidation (se gonfle, siffle)",
   "raison": "FishBase, Subaqua : territorial, « défend farouchement son espace » : rapprochement non tranché"
  },
  {
   "espece": "Courtilière",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "omnivore (WP FR), graines non citées mais plausibles"
  },
  {
   "espece": "Courtilière",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "omnivore (WP FR), charognes non citées mais plausibles"
  },
  {
   "espece": "Mésange boréale",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "régime très brièvement décrit (WP FR : 3 mots ; WP EN : 1 phrase) ; bourgeons plausibles"
  },
  {
   "espece": "Triton ponctué",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "régime non détaillé (WP FR : une phrase) ; œufs/alevins plausibles"
  },
  {
   "espece": "Bar commun",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : Fuite non citée (WP FR : aucune défense ; WP EN : seulement jeunes en bancs ; FishBase : rien) ; défense exclue en entier"
  },
  {
   "espece": "Fourmi rousse des bois",
   "sujet": "defense",
   "groupe": "Intimidation (se gonfle, siffle)",
   "raison": "plausible : WP FR « agressive et territoriale », WP EN « aggressively territorial » ; non écartée"
  },
  {
   "espece": "Fourmi rousse des bois",
   "sujet": "defense",
   "groupe": "Odeur ou goût repoussant",
   "raison": "plausible : l'acide formique a une odeur forte ; les sources ne décrivent pas l'odeur comme défense"
  },
  {
   "espece": "Goéland argenté",
   "sujet": "defense",
   "groupe": "Régurgitation",
   "raison": "occasionnel : WP EN « sometimes spraying faeces or vomit » ; WP FR : régurgitation seulement pour nourrir les petits"
  },
  {
   "espece": "Géotrupe des bois",
   "sujet": "defense",
   "groupe": "Fait le mort",
   "raison": "plausible chez les géotrupes ; non écarté par les sources (qui ne décrivent que la stridulation)"
  },
  {
   "espece": "Seps strié",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "invertébrés « divers » (EN) : cloportes/crustacés terrestres non écartés par les 2 sources"
  },
  {
   "espece": "Hélice des bois",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "« dead animals » (WP EN) : peut inclure des insectes morts ; non écarté"
  },
  {
   "espece": "Hélice des bois",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "régime de généraliste (Hägele 2001) ; fruits non écartés par les sources"
  },
  {
   "espece": "Marsouin commun",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : Fuite non décrite (WP FR : vitesse et plongées, pas de fuite ; WP EN : rien) ; défense exclue en entier"
  },
  {
   "espece": "Phoque gris",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "prédation d'oiseaux marins possible, non écartée par les 2 sources (régime décrit brièvement)"
  },
  {
   "espece": "Phoque gris",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : Refuge non cité (WP FR : aucune défense ; WP EN : morsure par prudence, claquement de nageoires incertain) ; défense exclue en entier"
  },
  {
   "espece": "Phoque veau-marin",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP EN canards attaqués ; WP FR : non cité"
  },
  {
   "espece": "Phoque veau-marin",
   "sujet": "defense",
   "groupe": "Défense en groupe",
   "raison": "se rassemble au repos et à la reproduction (WP EN) ; rôle défensif non écarté"
  },
  {
   "espece": "Phoque veau-marin",
   "sujet": "defense",
   "groupe": "Intimidation (se gonfle, siffle)",
   "raison": "non cité pour l'espèce ; claquement de nageoires évoqué chez le phoque gris (WP EN) : non écarté"
  },
  {
   "espece": "Talitre sauteur",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "couleur sable/gris-brun (FR, EN) sans rôle dit ; non écarté"
  },
  {
   "espece": "Talitre sauteur",
   "sujet": "defense",
   "groupe": "Défense en groupe",
   "raison": "vit en colonies denses (FR) ; rôle non écarté"
  },
  {
   "espece": "Éphippigère des vignes",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "une seule source utile (WP FR : feuilles, ronces, pissenlits, insectes) ; raisins/graines non écartés"
  },
  {
   "espece": "Éphippigère des vignes",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "une seule source utile ; non écarté"
  },
  {
   "espece": "Éphippigère des vignes",
   "sujet": "mange",
   "groupe": "Nectar, pollen et sève",
   "raison": "une seule source utile ; non écarté"
  },
  {
   "espece": "Bigorneau",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : WP EN larves de balanes ; WP FR : non cité"
  },
  {
   "espece": "Bigorneau",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "WP EN : prend des algues sur la spartine (plante) ; non écarté"
  },
  {
   "espece": "Goujon occitan",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "WP FR (genre) : seulement « débris végétaux », pas de plantes ; « oui » non confirmé"
  },
  {
   "espece": "Goujon occitan",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "non écarté (œufs/alevins possibles chez les goujons) ; sources insuffisantes"
  },
  {
   "espece": "Mouflon méditerranéen",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "INPN « majorité des organes végétaux » (fruits non écartés)"
  },
  {
   "espece": "Moule commune",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "filtreur : zooplancton (larves de crustacés) non écarté"
  },
  {
   "espece": "Patelle commune",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : WP FR petits crustacés du film de la roche ; WP DE : non cité"
  },
  {
   "espece": "Tarente de Maurétanie",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP FR « parfois ... bébés lézards » ; EN : lézards seulement dans l'impact sur la faune locale"
  },
  {
   "espece": "Tarente de Maurétanie",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "DE : « arthropodes » dont cloportes possibles ; non écarté"
  },
  {
   "espece": "Tarente de Maurétanie",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : graines dans les estomacs (WP DE)"
  },
  {
   "espece": "Tarente de Maurétanie",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : débris de coquilles d'œufs dans les estomacs (WP DE)"
  },
  {
   "espece": "Ascalaphe soufré",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : Fuite non confirmée (WP FR, WP EN : rien ; WP DE : grande distance de fuite en chasse, seule) ; défense exclue en entier ; stade : adulte"
  },
  {
   "espece": "Barbastelle d'Europe",
   "sujet": "defense",
   "groupe": "Intimidation (se gonfle, siffle)",
   "raison": "plausible chez les chauves-souris ; aucune des 2 sources ne décrit de défense active"
  },
  {
   "espece": "Barbastelle d'Europe",
   "sujet": "defense",
   "groupe": "Morsure, cornes ou serres",
   "raison": "plausible (toute chauve-souris mord si on la saisit) ; non écarté"
  },
  {
   "espece": "Chardonneret élégant",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : Fuite non décrite par WP FR, WP EN, oiseaux.net ; seulement vol erratique, bandes hors reproduction, nid camouflé ; défense exclue en entier"
  },
  {
   "espece": "Fulmar boréal",
   "sujet": "defense",
   "groupe": "Défense en groupe",
   "raison": "vit en colonies de milliers (FR, EN) ; rôle défensif non écarté"
  },
  {
   "espece": "Grand rhinolophe",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : Fuite non décrite (WP FR : craint les grands rapaces, rien d'autre ; WP EN : rien) ; défense exclue en entier"
  },
  {
   "espece": "Lagopède alpin",
   "sujet": "defense",
   "groupe": "Défense en groupe",
   "raison": "troupes (FR), vigilance des mâles (oiseaux.net) ; rôle défensif non écarté"
  },
  {
   "espece": "Linotte mélodieuse",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "« oui » non confirmé : FR (graines, bourgeons), EN (graines), oiseaux.net (graines) ; ni feuilles ni herbes citées"
  },
  {
   "espece": "Linotte mélodieuse",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : Fuite non décrite ; FR met en avant le plumage mimétique (Camouflage possible), groupes hors reproduction sans rôle dit ; défense exclue en entier"
  },
  {
   "espece": "Raie bouclée",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "« toutes sortes d'animaux du fond » (FishBase) : charognes non écartées"
  },
  {
   "espece": "Raie bouclée",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : Camouflage non décrit (FishBase, WP EN : couleurs variables sans rôle ; épines mises en avant) ; défense exclue en entier"
  },
  {
   "espece": "Sauterelle cymbalière",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "végétaux non précisés (FR, EN) ; non écarté"
  },
  {
   "espece": "Sauterelle cymbalière",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "corps vert (FR, EN), rôle non dit ; non écarté"
  },
  {
   "espece": "Thomise variable",
   "sujet": "defense",
   "groupe": "Venin, poison ou acide",
   "raison": "le venin sert surtout aux proies (EN) ; ambigu comme défense"
  },
  {
   "espece": "Troque turbiné",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "aucune des sources ne décrit le régime en détail ; non écarté"
  },
  {
   "espece": "Troque turbiné",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : « Se cache dans sa coquille » non cité (WP FR : rien ; WP EN : coquille épaisse seulement) ; défense exclue en entier"
  },
  {
   "espece": "Œdipode stridulante",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : Camouflage non cité ; sources : dissuasion par le crépitement et les ailes rouges (proposition : Intimidation en principale) ; défense exclue en entier"
  },
  {
   "espece": "Corneille mantelée",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "« oui » non confirmé : WP FR, WP EN, oiseaux.net ne citent ni reptiles ni amphibiens"
  },
  {
   "espece": "Corneille mantelée",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : cadavres de poissons (WP FR) ; WP EN, oiseaux.net : non cité"
  },
  {
   "espece": "Gypaète barbu",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : tortues (FR, « marginal »), reptiles 1 % (EN)"
  },
  {
   "espece": "Gypaète barbu",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : perdrix et pigeons « occasionally » (EN)"
  },
  {
   "espece": "Gypaète barbu",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : lièvres, marmottes (EN), marmotte (oiseaux.net)"
  },
  {
   "espece": "Gypaète barbu",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : Fuite non décrite (WP FR, WP EN, oiseaux.net : aucune défense) ; défense exclue en entier"
  },
  {
   "espece": "Loche de rivière",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "particules organiques filtrées ; algues vertes citées chez la loche transalpine (INPN) ; non écarté"
  },
  {
   "espece": "Loche de rivière",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "« invertébrés benthiques » ; non écarté"
  },
  {
   "espece": "Hippocampe moucheté",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "régime décrit sommairement ; larves de poissons non écartées"
  },
  {
   "espece": "Hippocampe moucheté",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "FishBase : accepte des animaux morts en aquarium ; non écarté"
  },
  {
   "espece": "Pingouin torda",
   "sujet": "defense",
   "groupe": "Défense en groupe",
   "raison": "grégaire, colonies (FR, oiseaux.net) ; rôle défensif non écarté"
  },
  {
   "espece": "Barbeau méridional",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "« oui » non confirmé : FishBase = petits invertébrés seulement"
  },
  {
   "espece": "Barbeau méridional",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "« oui » non confirmé : aucune source ne cite des poissons"
  },
  {
   "espece": "Barbeau méridional",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : FishBase « rarely plants »"
  },
  {
   "espece": "Gorgone rouge",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "copépodes = crustacés mais proies microscopiques ; question trop subtile"
  },
  {
   "espece": "Gorgone rouge",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : « Odeur ou goût repoussant » non cité (WP FR : rien ; recherches web : rien) ; défense exclue en entier"
  },
  {
   "espece": "Gélinotte des bois",
   "sujet": "mange",
   "groupe": "Nectar, pollen et sève",
   "raison": "mange des fleurs (oiseaux.net) ; nectar/pollen non écartés"
  },
  {
   "espece": "Gélinotte des bois",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : Camouflage non décrit (WP FR : rien ; oiseaux.net : vol discret entre les arbres, cri de détournement) ; proposition : Fuite en principale ; défense exclue en entier"
  },
  {
   "espece": "Murin à moustaches",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : aucune des 3 sources ne décrit de défense (WP FR : seulement le choix des gîtes ; WP EN : rien ; ADW : « no specific defense »)"
  },
  {
   "espece": "Méta des cavernes",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "non écarté : cloportes et autres proies du sol plausibles pour une araignée de grotte ; WP EN : « smaller invertebrates » (myriapodes, limaces) sans liste complète"
  },
  {
   "espece": "Niverolle alpine",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "une seule source : WP FR « jeunes pousses » (même phrase : « surtout granivore », poussins nourris d'invertébrés) ; oiseaux.net : insectes, vers, escargots, graines seulement"
  },
  {
   "espece": "Niverolle alpine",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "non écarté : WP FR cite « restes alimentaires, déchets » des stations de ski et des terrasses, sans préciser leur nature"
  },
  {
   "espece": "Oursin noir",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "non écarté : Wangensteen et al. 2011 (Mar. Ecol. Prog. Ser.) : « omnivore tendant à la carnivorie » (δ15N), proies animales non précisées ; WP FR et WP EN : aucune proie animale"
  },
  {
   "espece": "Oursin noir",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "non écarté : Wangensteen et al. 2011 (Mar. Ecol. Prog. Ser.) : « omnivore tendant à la carnivorie » (δ15N), proies animales non précisées ; WP FR et WP EN : aucune proie animale"
  },
  {
   "espece": "Oursin noir",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "non écarté : Wangensteen et al. 2011 (Mar. Ecol. Prog. Ser.) : « omnivore tendant à la carnivorie » (δ15N), proies animales non précisées ; WP FR et WP EN : aucune proie animale"
  },
  {
   "espece": "Vipère péliade",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : insectes (orthoptères) mangés seulement par les juvéniles (WP FR, WP EN) ; ADW n'en cite pas"
  },
  {
   "espece": "Gambusie",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "WP EN seule : « zooplankton, invertebrates » sans citer de crustacés ; FishBase : insectes et larves de moustiques seulement"
  },
  {
   "espece": "Gambusie",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP EN « si besoin » seulement (larves d'amphibiens) ; FishBase n'en parle pas"
  },
  {
   "espece": "Gambusie",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP EN « si besoin » seulement (larves de poissons) ; FishBase n'en parle pas"
  },
  {
   "espece": "Gambusie",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "non écarté : WP EN « algues, détritus et animaux associés aux plantes » ; matière végétale non exclue, FishBase silencieux"
  },
  {
   "espece": "Grand dauphin",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : WP FR « les crustacés sont consommés occasionnellement » ; WP EN cite les crevettes dans la liste habituelle : désaccord, l'espèce est exclue pour ce groupe"
  },
  {
   "espece": "Océanite tempête",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : WP EN « whale carcasses are scavenged where available » ; WP FR et oiseaux.net n'en parlent pas"
  },
  {
   "espece": "Océanite tempête",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : WP EN « small quantities near colonies » ; WP FR, oiseaux.net : rien"
  },
  {
   "espece": "Océanite tempête",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : WP EN graines d'angiospermes dans l'estomac ; WP FR, oiseaux.net : rien"
  },
  {
   "espece": "Crabe verruqueux",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "non confirmé : aucune source ne cite de charognes (WP EN : bivalves, gastéropodes, bernard-l'ermite ; Pérez-Miguel 2017 : huître, moule, patelle, bernard-l'ermite, oursin)"
  },
  {
   "espece": "Crabe verruqueux",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "non écarté : crabe omnivore possible ; sources limitées aux proies animales"
  },
  {
   "espece": "Crabe verruqueux",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "non écarté : crabe opportuniste, poissons morts possibles ; aucune source ne tranche"
  },
  {
   "espece": "Psammodrome algire",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "non écarté : WP FR vide, WP EN et WP ES ne citent que des arthropodes ; matière végétale possible chez les lézards méditerranéens"
  },
  {
   "espece": "Psammodrome algire",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : Fuite non décrite ; WP ES ne cite que le camouflage ; WP EN et WP FR : aucune défense"
  },
  {
   "espece": "Râle des genêts",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP EN seule (« small frogs » en faible proportion) ; WP FR et oiseaux.net : aucun vertébré ; la fiche le donnait comme habituel"
  },
  {
   "espece": "Râle des genêts",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : WP EN seule (petits mammifères en faible proportion)"
  },
  {
   "espece": "Râle des genêts",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "rose : seule WP FR cite des « débris végétaux » ; oiseaux.net et WP EN : graines seulement"
  },
  {
   "espece": "Baudroie commune",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : FishBase « occasionally sea-birds » ; WP EN : un goéland dans un estomac ; WP FR : « essentiellement piscivore »"
  },
  {
   "espece": "Baudroie commune",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "une seule source : WP EN (langoustine, adultes en mer d'Irlande) ; WP FR et FishBase : aucun crustacé"
  },
  {
   "espece": "Guillemot de Troïl",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : oiseaux.net « occasionnellement » ; WP FR « mais aussi de crustacés » ; WP EN : amphipodes"
  },
  {
   "espece": "Guillemot de Troïl",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : tableau de données d'oiseaux.net (« charognes »), non repris dans le texte ; WP FR et WP EN : rien"
  },
  {
   "espece": "Guillemot de Troïl",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : aucune source ne présente la colonie dense comme une défense (oiseaux.net : « ne la présente pas comme une défense ») ; WP EN : apaisement social à forte densité"
  },
  {
   "espece": "Limace cendrée",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : WP DE « Auch tote Artgenossen werden gefressen » ; WP EN : rien"
  },
  {
   "espece": "Limace cendrée",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "non écarté : WP DE « zersetzende Pflanzenreste » (matière végétale en décomposition) ; feuilles vivantes non écartées ; WP FR sans régime"
  },
  {
   "espece": "Épinochette",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "une seule source : WP FR cite du zooplancton (copépodes, daphnies, lac d'Alaska) ; aucune source ne cite d'algues ; FishBase : petits invertébrés"
  },
  {
   "espece": "Épinochette",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "non écarté : FishBase « eggs and larvae of aquatic insects » seulement ; œufs et alevins de poissons possibles chez les épinoches"
  },
  {
   "espece": "Hanneton foulon",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "non écarté : adulte noir-brun à taches blanches « marbrées » décrites sans rôle (WP FR, WP EN, WP DE) ; camouflage sur pin possible"
  },
  {
   "espece": "Petite roussette",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "non écarté : WP EN « opportunistic » ; aucune des 3 sources ne cite de charognes ni de rejets de pêche comme nourriture"
  },
  {
   "espece": "Pélobate cultripède",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "non écarté : une seule source de régime (Futura, extrait tronqué) ; WP FR, WP EN, WP ES : aucun régime ; isopodes possibles"
  },
  {
   "espece": "Pélobate cultripède",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "non écarté : une seule source de régime (Futura) ; petits anoures possibles"
  },
  {
   "espece": "Pélobate cultripède",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "non écarté : robe jaune verdâtre tachée de brun décrite sans rôle (WP EN, Futura)"
  },
  {
   "espece": "Campagnol des Pyrénées",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : genre Campagnol (Universalis) seulement ; WP EN : feuilles et tiges"
  },
  {
   "espece": "Campagnol des Pyrénées",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : Universalis « toutes les espèces peuvent consommer des insectes » (genre) ; WP EN : rien"
  },
  {
   "espece": "Campagnol des Pyrénées",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : aucune source ne décrit de défense (WP FR vide ; WP EN : habitat plus ou moins souterrain, agressivité entre adultes)"
  },
  {
   "espece": "Concombre de mer",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "une seule source : WP EN « detritus, algae and plankton » ; WP FR : sédiment et particules organiques, plancton seulement pour les larves"
  },
  {
   "espece": "Concombre de mer",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : aucune source ne décrit d'odeur ni de perte d'un membre ; seul un mucus protecteur est décrit (aucune valeur de la liste ne lui correspond)"
  },
  {
   "espece": "Goéland d'Audouin",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : tableau d'oiseaux.net (« charognes ») ; WP EN « rarement » ; WP FR « n'est pas charognard »"
  },
  {
   "espece": "Goéland d'Audouin",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "non confirmé : aucune des 3 sources ne cite de crustacés (WP FR : poissons et céphalopodes ; WP EN : « specialist fish eater »)"
  },
  {
   "espece": "Goéland d'Audouin",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "non écarté : oiseaux.net cite des « vertébrés » sans les préciser"
  },
  {
   "espece": "Goéland d'Audouin",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "non écarté : goéland opportuniste ; WP FR « restes sur les plages » sans détail ; aucune source ne tranche"
  },
  {
   "espece": "Malmignatte",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP DE « parfois de petits vertébrés », rapports de lézards pris dans la toile ; WP FR et WP EN : aucun régime"
  },
  {
   "espece": "Pachyure étrusque",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP EN « young amphibians, lizards » ; WP FR : insectes, vers, escargots, araignées seulement"
  },
  {
   "espece": "Pachyure étrusque",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : WP EN « young rodents » ; WP FR : rien"
  },
  {
   "espece": "Tortue d'Hermann",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : WP EN « small quantities … occasionally » ; WP FR cite les fruits"
  },
  {
   "espece": "Tortue d'Hermann",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "non confirmé : ni WP FR (feuilles, fleurs, fruits, escargots, vers) ni WP EN ne citent d'insectes"
  },
  {
   "espece": "Discoglosse sarde",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP FR cannibalisme sur les jeunes ; WP EN : petits invertébrés"
  },
  {
   "espece": "Mourgette",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "non écarté : étude égyptienne : ravageur de nombreuses cultures ; sources limitées"
  },
  {
   "espece": "Mourgette",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "non écarté : coquille à motifs et vie « dans la végétation sèche » (WP EN) ; camouflage possible"
  },
  {
   "espece": "Omble de fontaine",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : WP EN (campagnols) et FishBase (« small mammals »), mais proportion faible"
  },
  {
   "espece": "Omble de fontaine",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "occasionnel : WP EN cite du zooplancton ; FishBase : restes végétaux seulement ; WP FR : rien"
  },
  {
   "espece": "Petite biche",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : aucune source (WP FR, WP EN) ne décrit de défense de l'adulte ; mandibules seulement décrites ; stade non déterminable"
  },
  {
   "espece": "Balbuzard pêcheur",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP EN « more occasionally » (rongeurs, serpents, grenouilles, oiseaux, crustacés ; charognes rarement) ; WP FR : 99 % de poissons"
  },
  {
   "espece": "Balbuzard pêcheur",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : WP EN « more occasionally » (rongeurs, serpents, grenouilles, oiseaux, crustacés ; charognes rarement) ; WP FR : 99 % de poissons"
  },
  {
   "espece": "Balbuzard pêcheur",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP EN « more occasionally » (rongeurs, serpents, grenouilles, oiseaux, crustacés ; charognes rarement) ; WP FR : 99 % de poissons"
  },
  {
   "espece": "Balbuzard pêcheur",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : WP EN « more occasionally » (rongeurs, serpents, grenouilles, oiseaux, crustacés ; charognes rarement) ; WP FR : 99 % de poissons"
  },
  {
   "espece": "Balbuzard pêcheur",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : WP EN « more occasionally » (rongeurs, serpents, grenouilles, oiseaux, crustacés ; charognes rarement) ; WP FR : 99 % de poissons"
  },
  {
   "espece": "Bourdon des champs",
   "sujet": "defense",
   "groupe": "Défense en groupe",
   "raison": "non écarté : la colonie défend son nid par la piqûre de ses ouvrières (WP EN Bumblebee) ; aucune source propre à l'espèce"
  },
  {
   "espece": "Carabe à reflets dorés",
   "sujet": "defense",
   "groupe": "Venin, poison ou acide",
   "raison": "non écarté : les carabes sécrètent un liquide irritant (acides) ; « Venin, poison ou acide » serait à moitié vrai (WP FR Carabidae)"
  },
  {
   "espece": "Crabe bleu",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "une seule source : ADW (« algivore ») ; WP EN : plantes (zostère), pas d'algues ; WP FR : aucun régime"
  },
  {
   "espece": "Desman des Pyrénées",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : « exceptionnellement » (WP FR), « rarely » (WP EN)"
  },
  {
   "espece": "Desman des Pyrénées",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : urodèles et grenouilles « exceptionnellement » (WP FR), « rarely » (WP EN)"
  },
  {
   "espece": "Tourteau",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "carcasses de poissons plausibles pour un nécrophage (WP FR : poissons seulement comme appât) ; non écarté"
  },
  {
   "espece": "Tourteau",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "les larves se nourrissent de plancton (WP FR) ; adultes : algues non citées mais non écartées"
  },
  {
   "espece": "Cassenoix moucheté",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : WP EN seule (petits oiseaux, œufs, poussins) ; WP FR : non cité"
  },
  {
   "espece": "Cassenoix moucheté",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : WP EN seule (petits rongeurs) ; WP FR : non cité"
  },
  {
   "espece": "Cassenoix moucheté",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : WP EN seule (charogne, animaux écrasés) ; WP FR : non cité"
  },
  {
   "espece": "Daurade royale",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP FR « peut aussi se nourrir de poissons » ; EN et FishBase : non cités"
  },
  {
   "espece": "Daurade royale",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "herbivore « accessoirement » (WP FR, FishBase) sans préciser algues ou herbiers ; non écarté"
  },
  {
   "espece": "Daurade royale",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "« some plant material » (WP EN) sans préciser lesquels ; non écarté"
  },
  {
   "espece": "Rhagie inquisitrice",
   "sujet": "defense",
   "groupe": "Intimidation (se gonfle, siffle)",
   "raison": "plausible chez les longicornes (stridulation) ; non écarté par les sources (WP FR : aucune défense ; WP EN : camouflage seul)"
  },
  {
   "espece": "Rosalie des Alpes",
   "sujet": "defense",
   "groupe": "Intimidation (se gonfle, siffle)",
   "raison": "stridulation de l'adulte (WP EN : « chirping sound ») dont le rôle n'est pas précisé ; non écartée"
  },
  {
   "espece": "Verdier d'Europe",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : bourgeons et fleurs (WP EN) ; WP FR : seulement les graines des herbacées"
  },
  {
   "espece": "Murin de Natterer",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : Fuite non décrite (WP FR : gîtes et chats domestiques cités, aucune réaction ; WP EN : rien) ; défense exclue en entier"
  },
  {
   "espece": "Omble chevalier",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : ichtyophagie des grands planctophages (WP FR « occasionnel »), « smaller fish » (WP EN)"
  },
  {
   "espece": "Omble chevalier",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : Fuite non citée (WP FR : lacs arctiques « endroit protégé » pour les jeunes ; WP EN : crypsis, détection des odeurs de prédateurs) ; défense exclue en entier"
  },
  {
   "espece": "Phyllodactyle d'Europe",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : cloportes cités par INPN seule ; WP FR : insectes seulement"
  },
  {
   "espece": "Truxale",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "sources vagues (« phytophage » seul) ; graines non écartées"
  },
  {
   "espece": "Truxale",
   "sujet": "mange",
   "groupe": "Nectar, pollen et sève",
   "raison": "sources vagues (« phytophage » seul) ; fleurs et sève non écartées"
  },
  {
   "espece": "Venturon montagnard",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : inflorescences picorées (WP FR), « herbivore » (oiseaux.net) ; feuilles et bourgeons non cités"
  },
  {
   "espece": "Vespère de Savi",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : Refuge non cité comme défense (WP FR et WP EN : gîtes dans des fentes, aucun prédateur ni réaction) ; Fuite non décrite ; défense exclue en entier"
  },
  {
   "espece": "Aigle de Bonelli",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : reptiles « proies plus secondaires », crapauds rarement (WP FR) ; « usually secondary prey » (WP EN)"
  },
  {
   "espece": "Aigle de Bonelli",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : « seldom comes to carrion » (WP EN), « il y recourt peu » (WP FR)"
  },
  {
   "espece": "Aigle de Bonelli",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "occasionnel : ingérés accessoirement via l'estomac des proies (WP FR + EN)"
  },
  {
   "espece": "Crabe vert",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : « à l'occasion charognard » (WP FR) ; WP EN : non cité"
  },
  {
   "espece": "Crabe vert",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "non confirmé : algues non citées par WP FR ni WP EN (seulement graines de zostère, EN) ; gardé dans la liste faute de preuve contraire"
  },
  {
   "espece": "Crabe vert",
   "sujet": "defense",
   "groupe": "Intimidation (se gonfle, siffle)",
   "raison": "le mâle lève ses pinces ouvertes (WP FR « crabe enragé », comportement agressif) ; rôle défensif non écarté"
  },
  {
   "espece": "Lançon",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : seulement « larvae of fish » (WP EN) ; FishBase : zooplancton et diatomées"
  },
  {
   "espece": "Lançon",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "coloration non liée à une fonction (WP EN) ; poisson souvent enfoui ; non écarté"
  },
  {
   "espece": "Maquereau commun",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : chasse de petits poissons surtout de mars à juillet (WP FR) ; WP EN : proies plus grosses non nommées"
  },
  {
   "espece": "Maquereau commun",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "coloration dos sombre / ventre argenté décrite sans fonction dite (WP FR + EN) ; non écartée"
  },
  {
   "espece": "Oreillard montagnard",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : Fuite non décrite (WP FR : seul prédateur cité = effraie, aucune réaction ; WP EN : rien) ; défense exclue en entier"
  },
  {
   "espece": "Pie-grièche méridionale",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : passereaux « proie occasionnelle » (oiseaux.net) ; WP FR et EN : petits oiseaux cités sans fréquence"
  },
  {
   "espece": "Pie-grièche méridionale",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : Fuite non citée (WP FR, WP EN, oiseaux.net : aucune défense ; empalement = garde-manger) ; défense exclue en entier"
  },
  {
   "espece": "Coucou geai",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : oiseaux.net seule ; WP FR et EN : non cités"
  },
  {
   "espece": "Coucou geai",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : poussins et œufs de pie dévorés en représailles (WP FR) ; pas un régime habituel"
  },
  {
   "espece": "Coucou geai",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : Odeur non confirmée pour l'adulte (WP EN : seuls les poussins sécrètent une odeur repoussante ; WP FR et oiseaux.net : rien) ; défense exclue en entier"
  },
  {
   "espece": "Grande nacre",
   "sujet": "defense",
   "groupe": "Piquants ou poils urticants",
   "raison": "épines en gouttières sur la coquille (DORIS), rôle non dit ; non écarté"
  },
  {
   "espece": "Grande nacre",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "non cité (WP FR + EN) mais coquille enterrée à moitié et souvent couverte d'épibiontes ; non écarté"
  },
  {
   "espece": "Lieu jaune",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "occasionnel : les jeunes mangent du plancton (WP DE) ; WP FR : non cité"
  },
  {
   "espece": "Lieu jaune",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : Fuite non citée (WP FR et WP EN : aucune défense ; WP DE et FishBase : bancs de jeunes, adultes isolés) ; défense exclue en entier"
  },
  {
   "espece": "Lynx boréal",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : « peu ou pas » le grand tétras (WP FR) ; WP EN : tétras et faisans cités sans fréquence"
  },
  {
   "espece": "Lynx boréal",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : quelques cas de nécrophagie (WP FR), « when available » (WP EN)"
  },
  {
   "espece": "Lynx boréal",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : restes de baies dans les excréments (WP FR seule)"
  },
  {
   "espece": "Lynx boréal",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "« végétaux » 7 % des fèces au Népal, nature non précisée (WP FR) ; non écarté"
  },
  {
   "espece": "Raton laveur",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : « only occasionally eat active or large prey, such as birds and mammals » (WP EN) ; WP FR : « aussi »"
  },
  {
   "espece": "Raton laveur",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : « il lui arrive » (WP FR seule)"
  },
  {
   "espece": "Anax empereur",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : Fuite non décrite (WP FR et WP EN : vol et territorialité sans lien avec les prédateurs, aucune défense de l'adulte ni de la larve) ; défense exclue en entier"
  },
  {
   "espece": "Couleuvre de Montpellier",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "non confirmé : aucune des sources (WP FR, ES, EN, ADW) ne cite d'insectes ; gardé dans la liste faute de preuve contraire"
  },
  {
   "espece": "Faucon crécerellette",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : reptiles et grenouilles dans « toutes sortes d'autres proies » (WP FR), « additional prey » (WP EN)"
  },
  {
   "espece": "Faucon crécerellette",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : « autres proies » (WP FR), « additional prey » (WP EN)"
  },
  {
   "espece": "Faucon crécerellette",
   "sujet": "mange",
   "groupe": "Vers et mollusques",
   "raison": "occasionnel : vers de terre (WP FR seule)"
  },
  {
   "espece": "Faucon crécerellette",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP FR seule"
  },
  {
   "espece": "Faucon crécerellette",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : crabes (WP FR seule)"
  },
  {
   "espece": "Hémidactyle verruqueux",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : isopodes cités par WP EN seule ; WP FR : insectivore"
  },
  {
   "espece": "Hémidactyle verruqueux",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : jeunes phyllodactyles mangés à Port-Cros (INPN seule)"
  },
  {
   "espece": "Timarque",
   "sujet": "defense",
   "groupe": "Couleurs d'avertissement",
   "raison": "liquide rouge-orangé vif émis en cas de danger (FR + EN), rôle d'avertissement non écarté"
  },
  {
   "espece": "Étoile de mer rouge",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : « voire nécrophage » (WP FR seule)"
  },
  {
   "espece": "Étoile de mer rouge",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "micro-organismes et particules organiques (DORIS), algues non écartées"
  },
  {
   "espece": "Étoile de mer rouge",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "nécrophage (WP FR) : crustacés morts non écartés"
  },
  {
   "espece": "Étoile de mer rouge",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "nécrophage (WP FR) : poissons morts non écartés"
  },
  {
   "espece": "Brochet aquitain",
   "sujet": "mange",
   "groupe": null,
   "raison": "rose : aucune proie citée (WP FR : rien ; WP EN : « predatory fish » ; FishBase : niveau trophique estimé d'après E. lucius) ; régime exclu en entier"
  },
  {
   "espece": "Brochet aquitain",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : Camouflage non cité (WP FR : « robe marbrée » sans fonction dite ; WP EN et FishBase : rien) ; défense exclue en entier"
  },
  {
   "espece": "Crapaud vert",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "les têtards mangent des algues ; aucune des sources ne traite du stade larvaire"
  },
  {
   "espece": "Crapaud vert",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "cloportes plausibles pour un crapaud ; WP EN et DE : « insectes et invertébrés » sans les écarter"
  },
  {
   "espece": "Crapaud vert",
   "sujet": "defense",
   "groupe": "Défense en groupe",
   "raison": "repos en groupes, jeunes très grégaires (WP DE), rôle défensif non écarté"
  },
  {
   "espece": "Dauphin bleu et blanc",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "krill (zooplancton) cité par WP EN ; non écarté"
  },
  {
   "espece": "Euprocte de Corse",
   "sujet": "defense",
   "groupe": "Odeur ou goût repoussant",
   "raison": "glandes parotoïdes distinctes, fonction non dite (WP EN) ; sécrétions cutanées plausibles chez un urodèle, non écartées"
  },
  {
   "espece": "Lézard catalan",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : cannibalisme « especialmente de huevos y juveniles » (Vertebrados Ibéricos seule)"
  },
  {
   "espece": "Lézard catalan",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : « materia vegetal » aux Columbretes (Vertebrados Ibéricos seule)"
  },
  {
   "espece": "Lézard catalan",
   "sujet": "mange",
   "groupe": "Nectar, pollen et sève",
   "raison": "non cité mais matière végétale possible ; non écarté"
  },
  {
   "espece": "Miramelle alpestre",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "préférence pour les éricacées (Vaccinium, WP FR + EN) : baies non écartées"
  },
  {
   "espece": "Saint-Pierre",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : camouflage non décrit (WP FR, WP EN, DORIS) ; défense exclue en entier"
  },
  {
   "espece": "Sizerin cabaret",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : bourgeons (WP FR seule), WP EN ne les cite pas"
  },
  {
   "espece": "Marmotte des Alpes",
   "sujet": "defense",
   "groupe": "Intimidation (se gonfle, siffle)",
   "raison": "une seule source (WP EN)"
  },
  {
   "espece": "Esturgeon européen",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "oui non confirmé : WP EN ne cite que vers et crustacés ; WP FR introuvable ; 2e source à trouver"
  },
  {
   "espece": "Mérou brun",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "occasionnel : juvéniles cryptiques (DORIS), non écarté"
  },
  {
   "espece": "Rouget de roche",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "oui non confirmé : DORIS = vers, crustacés, mollusques ; WP FR et EN sans régime"
  },
  {
   "espece": "Calotriton des Pyrénées",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : larves de salamandre (étude catalane, WP FR)"
  },
  {
   "espece": "Calotriton des Pyrénées",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "oui non confirmé : ni WP FR ni WP EN ; 2e source à trouver"
  },
  {
   "espece": "Campagnol des neiges",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "une seule source (WP FR : végétal seulement) ; WP EN = page d'homonymie ; 2e source à trouver"
  },
  {
   "espece": "Campagnol des neiges",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "non confirmé : WP FR muette, WP EN inutilisable"
  },
  {
   "espece": "Discoglosse corse",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "« petits invertébrés terrestres et aquatiques » (WP FR, EN) sans détail : non écarté ; 2e source à trouver"
  },
  {
   "espece": "Discoglosse corse",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "« petits invertébrés terrestres et aquatiques » (WP FR, EN) sans détail : non écarté ; 2e source à trouver"
  },
  {
   "espece": "Discoglosse corse",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "« petits invertébrés terrestres et aquatiques » (WP FR, EN) sans détail : non écarté ; 2e source à trouver"
  },
  {
   "espece": "Libellule déprimée",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : Fuite non décrite comme défense (WP FR, WP EN) ; défense exclue en entier"
  },
  {
   "espece": "Mygale à chaussette",
   "sujet": "defense",
   "groupe": "Venin, poison ou acide",
   "raison": "plausible (araignée) : non écarté par WP FR et WP EN"
  },
  {
   "espece": "Oreillard roux",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : Fuite non décrite (WP FR) ; vol lent (WP EN) ; défense exclue en entier"
  },
  {
   "espece": "Rascasse brune",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "ancienne affirmation d'algues rapportée par WP EN, non confirmée : non écarté"
  },
  {
   "espece": "Sar à tête noire",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "une seule source (WP FR : vers, crustacés, bivalves) ; 2e source à trouver"
  },
  {
   "espece": "Sar à tête noire",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "une seule source (WP FR : vers, crustacés, bivalves) ; 2e source à trouver"
  },
  {
   "espece": "Saupe",
   "sujet": "defense",
   "groupe": "Défense en groupe",
   "raison": "principale non décrite comme défense (WP FR : vit en groupes ; WP EN : rien)"
  },
  {
   "espece": "Saupe",
   "sujet": "defense",
   "groupe": "Venin, poison ou acide",
   "raison": "chair toxique selon la saison : passive, occasionnelle"
  },
  {
   "espece": "Saupe",
   "sujet": "defense",
   "groupe": "Odeur ou goût repoussant",
   "raison": "WP FR : goût fort qui peut rebuter : non écarté"
  },
  {
   "espece": "Vautour moine",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : charogne ou proie vivante rare (WP FR, WP EN)"
  },
  {
   "espece": "Vautour moine",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "occasionnel : charogne ou proie vivante rare (WP FR, WP EN)"
  },
  {
   "espece": "Vautour moine",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : charogne ou proie vivante rare (WP FR, WP EN)"
  },
  {
   "espece": "Vautour moine",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "cônes de pin dans les pelotes (WP EN) : non écarté"
  },
  {
   "espece": "Corégone",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : alevins (WP EN seule)"
  },
  {
   "espece": "Corégone",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "zooplancton non précisé (WP EN) ; WP FR sans régime ; 2e source à trouver"
  },
  {
   "espece": "Corégone",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : Défense en groupe non sourcée (WP EN, WP FR) ; défense exclue en entier"
  },
  {
   "espece": "Oblade",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "DORIS ne cite que des œufs de poissons ; WP FR et EN : « omnivore »"
  },
  {
   "espece": "Perdrix bartavelle",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : Camouflage non décrit (WP FR, WP EN) ; défense exclue en entier"
  },
  {
   "espece": "Sar commun",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : petits poissons (WP FR)"
  },
  {
   "espece": "Sar commun",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "Pline seulement (WP FR) ; algues seules selon WP EN"
  },
  {
   "espece": "Apogon",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "une seule source lue (WP EN) ; non écarté"
  },
  {
   "espece": "Corb",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "WP EN seule les cite ; DORIS : crustacés, vers, poissons ; non confirmé"
  },
  {
   "espece": "Pic tridactyle",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel (WP EN : « may also ») ; WP FR : résine"
  },
  {
   "espece": "Pic tridactyle",
   "sujet": "mange",
   "groupe": "Nectar, pollen et sève",
   "raison": "occasionnel (WP EN : « may also ») ; WP FR : résine"
  },
  {
   "espece": "Castagnole",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "DORIS : œufs de poissons seulement ; WP FR sans régime"
  },
  {
   "espece": "Lièvre de Corse",
   "sujet": "mange",
   "groupe": null,
   "raison": "rose : aucune source lue (WP EN sans régime, WP FR introuvable)"
  },
  {
   "espece": "Traquet oreillard",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "une seule source (WP FR : insectes) ; WP EN = homonymie"
  },
  {
   "espece": "Traquet oreillard",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "une seule source (WP FR : insectes) ; WP EN = homonymie"
  },
  {
   "espece": "Campagnol provençal",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "Fruits : « oui » non confirmé (WP EN : herbes, trèfle, racines) ; WP FR sans régime"
  },
  {
   "espece": "Campagnol provençal",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "Fruits : « oui » non confirmé (WP EN : herbes, trèfle, racines) ; WP FR sans régime"
  },
  {
   "espece": "Dauphin commun",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "une seule source (WP EN : poissons et calmars) ; WP FR = homonymie"
  },
  {
   "espece": "Scorpion languedocien",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "WP FR : araignées surtout ; WP EN sans régime : non confirmé"
  },
  {
   "espece": "Scorpion languedocien",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "WP FR : araignées surtout ; WP EN sans régime : non confirmé"
  },
  {
   "espece": "Serran chevrette",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : charognage (WP EN)"
  },
  {
   "espece": "Serran écriture",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : restes de repas du poulpe (WP EN)"
  },
  {
   "espece": "Apron du Rhône",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "WP FR sans régime ; WP EN : insectes, « vertébrés aquatiques »"
  },
  {
   "espece": "Apron du Rhône",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "WP FR sans régime ; WP EN : insectes, « vertébrés aquatiques »"
  },
  {
   "espece": "Grand hamster",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : grenouilles, campagnols (WP FR), cannibalisme (WP EN) ; animal = 10 à 13 %"
  },
  {
   "espece": "Grand hamster",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : grenouilles, campagnols (WP FR), cannibalisme (WP EN) ; animal = 10 à 13 %"
  },
  {
   "espece": "Musaraigne alpine",
   "sujet": "mange",
   "groupe": "Oiseaux et œufs",
   "raison": "WP FR : « petits vertébrés » non précisés"
  },
  {
   "espece": "Crossope de Miller",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "Insectes occasionnel (WP EN) ; Crustacés : WP EN muette, WP FR introuvable"
  },
  {
   "espece": "Crossope de Miller",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "Insectes occasionnel (WP EN) ; Crustacés : WP EN muette, WP FR introuvable"
  },
  {
   "espece": "Moineau cisalpin",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "prudence : une seule source (WP EN : graines et insectes) ; les moineaux grignotent aussi bourgeons et pousses"
  },
  {
   "espece": "Murène",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : WP FR « parfois de charognes » ; WP EN « also feeds on dead animals »"
  },
  {
   "espece": "Murène",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "occasionnel : WP FR « parfois ... d'algues » (WP FR seule)"
  },
  {
   "espece": "Arénicole",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "prudence : mange du sédiment avec sa microfaune (MarLIN : meiofauna), dont de petits crustacés possibles"
  },
  {
   "espece": "Dauphin de Risso",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "secondaire : WP FR et EN « essentiellement/almost exclusively squid » ; poissons seulement cités à côté (WP EN, UCSD)"
  },
  {
   "espece": "Dauphin de Risso",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : Duke et UCSD citent des crustacés, WP FR et EN non"
  },
  {
   "espece": "Dauphin de Risso",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : défense non décrite par les sources lues"
  },
  {
   "espece": "Globicéphale noir",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : WP EN seule (lecture résumée), WP FR non"
  },
  {
   "espece": "Globicéphale noir",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : défense non décrite par les sources lues"
  },
  {
   "espece": "Cordulégastre bidenté",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : défense de l'adulte non décrite par les sources lues"
  },
  {
   "espece": "Puffin des Anglais",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "ambiguïté : « débris alimentaires / surface offal » ramassés en surface (WP FR et EN) ressemblent à des charognes"
  },
  {
   "espece": "Puffin des Anglais",
   "sujet": "defense",
   "groupe": "Régurgitation",
   "raison": "non citée par WP FR ni WP EN, mais plausible chez un procellariiforme : exclue par prudence"
  },
  {
   "espece": "Rainette sarde",
   "sujet": "mange",
   "groupe": null,
   "raison": "rose : régime non décrit par les sources lues"
  },
  {
   "espece": "Scolopendre ceinturée",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP FR « parfois de petits vertébrés comme de jeunes lézards » ; WP EN « almost any animal... insects and small lizards »"
  },
  {
   "espece": "Cigale de mer",
   "sujet": "mange",
   "groupe": "Charognes et os",
   "raison": "occasionnel : WP FR « occasionnellement nécrophage » ; WP EN ne la cite pas"
  },
  {
   "espece": "Cigale de mer",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "WP FR : entre dans les nasses « pour dévorer les appâts et les poissons capturés » ; non écarté"
  },
  {
   "espece": "Langouste rouge",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP FR « rarement » des poissons"
  },
  {
   "espece": "Langouste rouge",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "une seule source (WP FR) ; WP EN : vers, crabes, animaux morts, pas d'algues"
  },
  {
   "espece": "Magicienne dentelée",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP EN « rarely small lizards » ; WP FR « tout ce qu'elle peut maîtriser »"
  },
  {
   "espece": "Magicienne dentelée",
   "sujet": "mange",
   "groupe": "Nectar, pollen et sève",
   "raison": "un cas de nymphe sur du nectar (WP EN), sinon strictement carnivore : exclu par prudence"
  },
  {
   "espece": "Tortue caouanne",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : un élément d'une longue liste (WP FR et EN), régime surtout fait d'invertébrés du fond"
  },
  {
   "espece": "Tortue caouanne",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "occasionnel : algues citées en fin de liste seulement (WP FR et EN)"
  },
  {
   "espece": "Vipère d'Orsini",
   "sujet": "mange",
   "groupe": "Petits mammifères",
   "raison": "occasionnel : WP FR « parfois de lézards et de rongeurs »"
  },
  {
   "espece": "Vipère d'Orsini",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : défense non décrite par les sources lues"
  },
  {
   "espece": "Isard",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "prudence : régime peu détaillé (WP EN seule lue) ; bourgeons et pousses cités, graines et baies non écartées"
  },
  {
   "espece": "Lycose de Narbonne",
   "sujet": "mange",
   "groupe": null,
   "raison": "rose : régime non décrit (pages sur Lycosa tarantula)"
  },
  {
   "espece": "Salamandre noire",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "prudence : une seule source (WP EN : coléoptères, escargots, mille-pattes, araignées) ; les cloportes ne sont pas écartés"
  },
  {
   "espece": "Vieille commune",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP FR « peut également se nourrir ... de poissons » ; WP EN ne les cite pas"
  },
  {
   "espece": "Crapaud vert des Baléares",
   "sujet": "mange",
   "groupe": null,
   "raison": "rose : régime non décrit par les sources lues"
  },
  {
   "espece": "Crevette grise",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP FR « les gros spécimens se nourrissent aussi de jeunes alevins ou de leurs cadavres »"
  },
  {
   "espece": "Crevette grise",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "non retrouvé dans l'extrait lu de WP FR (omnivore, carnivore, charognarde) ; WP EN muette"
  },
  {
   "espece": "Discoglosse peint",
   "sujet": "mange",
   "groupe": null,
   "raison": "rose : régime non décrit par les sources lues"
  },
  {
   "espece": "Grand tétras",
   "sujet": "mange",
   "groupe": "Insectes",
   "raison": "poussins seulement : WP FR « poussins essentiellement insectivores » ; adultes : herbivores (WP EN)"
  },
  {
   "espece": "Rorqual commun",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel en Méditerranée : WP FR « presque exclusivement Meganyctiphanes norvegica » (krill) ; WP EN : 96 % de krill seul en Atlantique nord"
  },
  {
   "espece": "Rorqual commun",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "ambiguïté : krill et copépodes sont du zooplancton, mais sont aussi des crustacés"
  },
  {
   "espece": "Rorqual commun",
   "sujet": "defense",
   "groupe": "Défense en groupe",
   "raison": "non citée, mais le rorqual vit parfois en petits groupes : exclue par prudence"
  },
  {
   "espece": "Bouquetin ibérique",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "non retrouvé : WP EN « mixed feeder between a browser and a grazer » sans détail, WP FR muette"
  },
  {
   "espece": "Corail rouge",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "prudence : WP FR cite « œufs, larves » du plancton sans dire de quelles espèces"
  },
  {
   "espece": "Lézard sicilien",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "occasionnel : la part végétale est « much greater » que chez les autres lézards mais non détaillée"
  },
  {
   "espece": "Lézard sicilien",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "non détaillé : « plant matter » seulement (WP EN) ; l'îlot Podmrčaru est un cas particulier"
  },
  {
   "espece": "Lézard sicilien",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "prudence : « invertébrés, surtout arthropodes » (WP EN) : cloportes non écartés"
  },
  {
   "espece": "Salamandre de Corse",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP FR « parfois d'autres amphibiens comme les tritons ou de petites grenouilles » (une seule source)"
  },
  {
   "espece": "Salamandre de Corse",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "camouflage décrit seulement pour les larves (WP EN : « camouflage blending into the pond's substrate »), rien pour l'adulte"
  },
  {
   "espece": "Tortue luth",
   "sujet": "mange",
   "groupe": "Algues et plancton",
   "raison": "occasionnel / ambiguïté : proies principales = méduses et salpes (plancton gélatineux) ; algues « surtout consommées par les jeunes » (WP FR)"
  },
  {
   "espece": "Tortue luth",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : WP FR « elle peut également se nourrir de salpes, de poissons, de crustacés » ; WP EN « believed to feed on small crustaceans »"
  },
  {
   "espece": "Tortue luth",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : mêmes citations (WP FR, Larousse) ; ajouté par cohérence, aucune question aujourd'hui"
  },
  {
   "espece": "Tortue luth",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : défense non décrite par les sources lues (adulte combatif selon WP EN, fuite seulement pour les nouveau-nés)"
  },
  {
   "espece": "Venturon corse",
   "sujet": "mange",
   "groupe": "Herbes et feuilles",
   "raison": "prudence : les sources parlent de « graines de plantes herbacées » et d'herbes (Poa, Briza) ; on ne peut pas écarter nettement des herbes"
  },
  {
   "espece": "Agrion hasté",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : défense non décrite par les sources lues"
  },
  {
   "espece": "Fauvette de Moltoni",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : oiseaux.net « before migrating, it also consumes berries » ; WP EN « will also eat berries »"
  },
  {
   "espece": "Fauvette sarde",
   "sujet": "mange",
   "groupe": "Fruits et graines",
   "raison": "occasionnel : Naturalis « Mainly invertebrates and berries » (une seule source)"
  },
  {
   "espece": "Fourmi moissonneuse",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : défense non décrite par les sources lues ; alarme par la glande à venin (Heredia & Detrain 2000)"
  },
  {
   "espece": "Grenouille des Pyrénées",
   "sujet": "defense",
   "groupe": "Camouflage",
   "raison": "coloration brune ou grise à taches floues (WP EN) ; camouflage plausible mais non décrit"
  },
  {
   "espece": "Requin pèlerin",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "copépodes = crustacés du plancton : vrai mais trompeur pour le joueur ; WP FR aussi crevettes pélagiques dans un estomac"
  },
  {
   "espece": "Requin pèlerin",
   "sujet": "mange",
   "groupe": "Poissons",
   "raison": "occasionnel : WP FR « ne se nourrit pas exclusivement de plancton et fait également sa proie des petits poissons grégaires » ; WP EN « very small fish »"
  },
  {
   "espece": "Rhinolophe euryale",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : défense non décrite par les sources lues"
  },
  {
   "espece": "Étourneau unicolore",
   "sujet": "mange",
   "groupe": "Amphibiens et reptiles",
   "raison": "occasionnel : WP FR « peut également consommer de petits amphibiens et lézards » (WP EN ne les cite pas)"
  },
  {
   "espece": "Agrion de Mercure",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : défense non décrite par les sources lues"
  },
  {
   "espece": "Caloptéryx vierge",
   "sujet": "defense",
   "groupe": null,
   "raison": "rose : défense non décrite par les sources lues (vol lent, peu farouche selon WP FR)"
  },
  {
   "espece": "Tanche",
   "sujet": "mange",
   "groupe": "Crustacés",
   "raison": "occasionnel : zoobenthos non détaillé (FishBase « benthic animals »), crustacés ni confirmés ni écartés (revue du 23/11, échantillon)"
  }
 ]
};
