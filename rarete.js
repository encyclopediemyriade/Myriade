// ============================================================
// LA RARETÉ — généré automatiquement depuis Données\rarete_contenu.xlsx (étape R288)
// Ne pas modifier à la main : on modifie l'Excel, puis on relance Code\Outils\gen_rarete.py.
// Les cases roses du classeur (incertaines) ne passent jamais ici.
// ============================================================

const TRESORS = [
 {
  "territoire": "Alpes",
  "lieu": "Lac d'Annecy",
  "nom": "Sonneur à ventre jaune",
  "ajoute": true,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Amas d'œufs gélatineux",
   "milieu": "Mares et étangs",
   "activite": "De jour comme de nuit",
   "hiver": "s'endort ou ralentit"
  }
 },
 {
  "territoire": "Alpes",
  "lieu": "Massif de la Chartreuse",
  "nom": "Lynx boréal",
  "ajoute": false,
  "piste": {
   "empreinte": true,
   "cri": true,
   "trace": "",
   "milieu": "Forêt",
   "activite": "Surtout la nuit",
   "hiver": "reste actif"
  }
 },
 {
  "territoire": "Alpes",
  "lieu": "Vercors",
  "nom": "Chat forestier",
  "ajoute": false,
  "piste": {
   "empreinte": true,
   "cri": false,
   "trace": "Griffades sur les troncs",
   "milieu": "Forêt",
   "activite": "Surtout la nuit",
   "hiver": "reste actif"
  }
 },
 {
  "territoire": "Alpes",
  "lieu": "Le Diois",
  "nom": "Gypaète barbu",
  "ajoute": true,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Os cassés au sol",
   "milieu": "Falaises et rochers"
  }
 },
 {
  "territoire": "Alpes",
  "lieu": "Lac de Serre-Ponçon",
  "nom": "Sonneur à ventre jaune",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Amas d'œufs gélatineux",
   "milieu": "Mares et étangs",
   "activite": "De jour comme de nuit",
   "hiver": "s'endort ou ralentit"
  }
 },
 {
  "territoire": "Alpes",
  "lieu": "Mont Ventoux",
  "nom": "Pie-grièche à tête rousse",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Proies parfois empalées",
   "milieu": "Campagne, haies et jardins",
   "activite": "Surtout le jour",
   "hiver": "part de la région"
  }
 },
 {
  "territoire": "Alpes",
  "lieu": "Gorges du Verdon",
  "nom": "Vautour moine",
  "ajoute": false,
  "piste": {
   "empreinte": true,
   "cri": false,
   "trace": "Grand nid de branches dans un arbre",
   "milieu": "Forêt",
   "hiver": "reste actif"
  }
 },
 {
  "territoire": "Alpes",
  "lieu": "Vallée de la Vésubie",
  "nom": "Oreillard montagnard",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": false,
   "trace": "Guano (crottes)",
   "milieu": "Falaises et rochers",
   "activite": "Surtout la nuit",
   "hiver": "s'endort ou ralentit"
  }
 },
 {
  "territoire": "Alpes",
  "lieu": "La Vallouise",
  "nom": "Gypaète barbu",
  "ajoute": true,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Os cassés au sol",
   "milieu": "Falaises et rochers"
  }
 },
 {
  "territoire": "Alpes",
  "lieu": "Pralognan-la-Vanoise",
  "nom": "Gypaète barbu",
  "ajoute": true,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Os cassés au sol",
   "milieu": "Falaises et rochers"
  }
 },
 {
  "territoire": "Bassin aquitain",
  "lieu": "Moissac, entre Tarn et Garonne",
  "nom": "Campagnol des Pyrénées",
  "ajoute": false,
  "piste": {
   "empreinte": true,
   "cri": false,
   "trace": "",
   "milieu": "Alpages et pelouses d'altitude"
  }
 },
 {
  "territoire": "Bassin aquitain",
  "lieu": "Coteaux du Gers",
  "nom": "Pachyure étrusque",
  "ajoute": false,
  "piste": {
   "empreinte": true,
   "cri": false,
   "trace": "",
   "milieu": "Garrigue et maquis",
   "activite": "Surtout la nuit"
  }
 },
 {
  "territoire": "Bassin aquitain",
  "lieu": "Marais poitevin",
  "nom": "Outarde canepetière",
  "ajoute": false,
  "piste": {
   "empreinte": true,
   "cri": true,
   "trace": "",
   "milieu": "Garrigue et maquis",
   "activite": "Surtout le jour"
  }
 },
 {
  "territoire": "Bassin aquitain",
  "lieu": "Vallée de la Dordogne",
  "nom": "Cigogne noire",
  "ajoute": false,
  "piste": {
   "empreinte": true,
   "cri": true,
   "trace": "",
   "milieu": "Forêt",
   "activite": "Surtout le jour",
   "hiver": "part de la région"
  }
 },
 {
  "territoire": "Bassin aquitain",
  "lieu": "Estuaire de la Charente",
  "nom": "Vison d'Europe",
  "ajoute": false,
  "piste": {
   "empreinte": true,
   "cri": false,
   "trace": "Laissées (crottes)",
   "milieu": "Rivières et torrents",
   "activite": "Surtout la nuit",
   "hiver": "reste actif"
  }
 },
 {
  "territoire": "Bassin aquitain",
  "lieu": "Lac de Cazaux-Sanguinet",
  "nom": "Balbuzard pêcheur",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Énorme nid de branches à la cime d'un arbre",
   "milieu": "Lacs",
   "activite": "Surtout le jour",
   "hiver": "en partie"
  }
 },
 {
  "territoire": "Bassin aquitain",
  "lieu": "Barthes de l'Adour",
  "nom": "Grande mulette",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": false,
   "trace": "Coquilles vides au bord de l'eau",
   "milieu": "Rivières et torrents"
  }
 },
 {
  "territoire": "Bassin aquitain",
  "lieu": "Île d'Oléron",
  "nom": "Pie-grièche à tête rousse",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Proies parfois empalées",
   "milieu": "Campagne, haies et jardins",
   "activite": "Surtout le jour",
   "hiver": "part de la région"
  }
 },
 {
  "territoire": "Bassin aquitain",
  "lieu": "Rocamadour et le causse",
  "nom": "Martre des pins",
  "ajoute": false,
  "piste": {
   "empreinte": true,
   "cri": false,
   "trace": "Laissées (crottes)",
   "milieu": "Forêt",
   "activite": "Surtout la nuit",
   "hiver": "reste actif"
  }
 },
 {
  "territoire": "Bassin aquitain",
  "lieu": "Dune du Pilat",
  "nom": "Gravelot à collier interrompu",
  "ajoute": false,
  "piste": {
   "empreinte": true,
   "cri": true,
   "trace": "",
   "milieu": "Dunes et plages",
   "activite": "De jour comme de nuit",
   "hiver": "en partie"
  },
  "ici": "Près de 2 millions de visiteurs par an fréquentent la dune : sur le haut de plage, les nids de gravelot risquent d'être piétinés ou dérangés."
 },
 {
  "territoire": "Bassin parisien et Val de Loire",
  "lieu": "Paris, ses bois et ses parcs",
  "nom": "Écrevisse à pattes blanches",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": false,
   "trace": "",
   "milieu": "Rivières et torrents",
   "activite": "Surtout la nuit",
   "hiver": "s'endort ou ralentit"
  }
 },
 {
  "territoire": "Bassin parisien et Val de Loire",
  "lieu": "Chinon et la Vienne",
  "nom": "Pie-grièche à tête rousse",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Proies parfois empalées",
   "milieu": "Campagne, haies et jardins",
   "activite": "Surtout le jour",
   "hiver": "part de la région"
  }
 },
 {
  "territoire": "Bassin parisien et Val de Loire",
  "lieu": "Chambord et la Loire",
  "nom": "Grande alose",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": false,
   "trace": "Remous bruyants en surface, les nuits de ponte",
   "milieu": "Rivières et torrents",
   "activite": "De jour comme de nuit",
   "hiver": "reste actif"
  }
 },
 {
  "territoire": "Bassin parisien et Val de Loire",
  "lieu": "Sologne",
  "nom": "Pic cendré",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "",
   "milieu": "Forêt",
   "activite": "Surtout le jour",
   "hiver": "reste actif"
  }
 },
 {
  "territoire": "Bassin parisien et Val de Loire",
  "lieu": "Forêt de Fontainebleau",
  "nom": "Lézard des souches",
  "ajoute": false,
  "piste": {
   "empreinte": true,
   "cri": false,
   "trace": "Nid creusé dans le sable",
   "milieu": "Landes et coteaux secs",
   "activite": "Surtout le jour",
   "hiver": "s'endort ou ralentit"
  }
 },
 {
  "territoire": "Bassin parisien et Val de Loire",
  "lieu": "Forêt de Compiègne",
  "nom": "Sizerin cabaret",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "",
   "milieu": "Forêt",
   "activite": "Surtout le jour",
   "hiver": "en partie"
  }
 },
 {
  "territoire": "Bassin parisien et Val de Loire",
  "lieu": "Lac du Der",
  "nom": "Cigogne noire",
  "ajoute": false,
  "piste": {
   "empreinte": true,
   "cri": true,
   "trace": "",
   "milieu": "Forêt",
   "activite": "Surtout le jour",
   "hiver": "part de la région"
  }
 },
 {
  "territoire": "Bassin parisien et Val de Loire",
  "lieu": "La Brenne",
  "nom": "Triton crêté",
  "ajoute": false,
  "piste": {
   "empreinte": true,
   "cri": false,
   "trace": "Œufs repliés dans une feuille",
   "milieu": "Mares et étangs",
   "activite": "Surtout la nuit",
   "hiver": "s'endort ou ralentit"
  }
 },
 {
  "territoire": "Bassin parisien et Val de Loire",
  "lieu": "Estuaire de la Seine",
  "nom": "Pie-grièche grise",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Restes de proies empalées",
   "milieu": "Campagne, haies et jardins",
   "activite": "Surtout le jour",
   "hiver": "reste actif"
  }
 },
 {
  "territoire": "Bassin parisien et Val de Loire",
  "lieu": "Falaises d'Étretat",
  "nom": "Saint-Pierre",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": false,
   "trace": "",
   "milieu": "Mer et océan",
   "activite": "Surtout le jour",
   "hiver": "reste actif"
  }
 },
 {
  "territoire": "Corse",
  "lieu": "Ajaccio et les îles Sanguinaires",
  "nom": "Tortue d'Hermann",
  "ajoute": true,
  "piste": {
   "empreinte": true,
   "cri": false,
   "trace": "",
   "milieu": "Garrigue et maquis",
   "activite": "Surtout le jour",
   "hiver": "s'endort ou ralentit"
  }
 },
 {
  "territoire": "Corse",
  "lieu": "Étang de Biguglia",
  "nom": "Gravelot à collier interrompu",
  "ajoute": false,
  "piste": {
   "empreinte": true,
   "cri": true,
   "trace": "",
   "milieu": "Dunes et plages",
   "activite": "De jour comme de nuit",
   "hiver": "en partie"
  }
 },
 {
  "territoire": "Corse",
  "lieu": "Corte et la vallée de la Restonica",
  "nom": "Gypaète barbu",
  "ajoute": true,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Os cassés au sol",
   "milieu": "Falaises et rochers"
  },
  "marche": "Site classé depuis 1966, la vallée est aussi depuis 2004 une zone protégée pour ses oiseaux, dont le gypaète barbu."
 },
 {
  "territoire": "Corse",
  "lieu": "Désert des Agriates",
  "nom": "Pie-grièche à tête rousse",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Proies parfois empalées",
   "milieu": "Campagne, haies et jardins",
   "activite": "Surtout le jour",
   "hiver": "part de la région"
  }
 },
 {
  "territoire": "Corse",
  "lieu": "Forêt d'Aïtone",
  "nom": "Gypaète barbu",
  "ajoute": true,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Os cassés au sol",
   "milieu": "Falaises et rochers"
  }
 },
 {
  "territoire": "Corse",
  "lieu": "Cap Corse",
  "nom": "Bruant ortolan",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "",
   "milieu": "Campagne, haies et jardins",
   "activite": "Surtout le jour",
   "hiver": "part de la région"
  }
 },
 {
  "territoire": "Corse",
  "lieu": "Plateau du Coscione",
  "nom": "Sittelle corse",
  "ajoute": true,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Loge creusée dans un pin mort",
   "milieu": "Forêt",
   "activite": "Surtout le jour",
   "hiver": "reste actif"
  }
 },
 {
  "territoire": "Corse",
  "lieu": "Bouches de Bonifacio",
  "nom": "Goéland d'Audouin",
  "ajoute": true,
  "piste": {
   "empreinte": true,
   "cri": true,
   "trace": "",
   "milieu": "Mer et océan"
  }
 },
 {
  "territoire": "Corse",
  "lieu": "Monte Cinto et le Niolo",
  "nom": "Gypaète barbu",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Os cassés au sol",
   "milieu": "Falaises et rochers"
  },
  "ici": "Le gypaète manque de nourriture : moins de brebis et de chèvres en estive, peu d'animaux sauvages. Il ne reste que quatre couples en Corse.",
  "marche": "Depuis 2016, de jeunes gypaètes nés en élevage sont relâchés dans le Niolo. En 2025, un couple issu de ces lâchers a élevé un poussin."
 },
 {
  "territoire": "Corse",
  "lieu": "Réserve naturelle de Scandola",
  "nom": "Balbuzard pêcheur",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Énorme nid de branches à la cime d'un arbre",
   "milieu": "Lacs",
   "activite": "Surtout le jour",
   "hiver": "en partie"
  },
  "ici": "Le va-et-vient des bateaux à moteur dérange les balbuzards : leur reproduction est devenue très faible depuis les années 2010, surtout dans la réserve.",
  "marche": "Réduit à 2 ou 3 couples en Corse en 1974, le balbuzard pêcheur en compte aujourd'hui une vingtaine, surtout sur la côte ouest."
 },
 {
  "territoire": "Jura",
  "lieu": "Pontarlier et le château de Joux",
  "nom": "Lynx boréal",
  "ajoute": true,
  "piste": {
   "empreinte": true,
   "cri": true,
   "trace": "",
   "milieu": "Forêt",
   "activite": "Surtout la nuit",
   "hiver": "reste actif"
  }
 },
 {
  "territoire": "Jura",
  "lieu": "Reculée de Baume-les-Messieurs",
  "nom": "Cigogne noire",
  "ajoute": false,
  "piste": {
   "empreinte": true,
   "cri": true,
   "trace": "",
   "milieu": "Forêt",
   "activite": "Surtout le jour",
   "hiver": "part de la région"
  }
 },
 {
  "territoire": "Jura",
  "lieu": "Lac de Nantua",
  "nom": "Sonneur à ventre jaune",
  "ajoute": true,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Amas d'œufs gélatineux",
   "milieu": "Mares et étangs",
   "activite": "De jour comme de nuit",
   "hiver": "s'endort ou ralentit"
  }
 },
 {
  "territoire": "Jura",
  "lieu": "Vallée de la Loue",
  "nom": "Pie-grièche grise",
  "ajoute": true,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Restes de proies empalées",
   "milieu": "Campagne, haies et jardins",
   "activite": "Surtout le jour",
   "hiver": "reste actif"
  }
 },
 {
  "territoire": "Jura",
  "lieu": "Lacs de Remoray et de Saint-Point",
  "nom": "Balbuzard pêcheur",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Énorme nid de branches à la cime d'un arbre",
   "milieu": "Lacs",
   "activite": "Surtout le jour",
   "hiver": "en partie"
  }
 },
 {
  "territoire": "Jura",
  "lieu": "Le Mont d'Or",
  "nom": "Loup gris",
  "ajoute": true,
  "piste": {
   "empreinte": true,
   "cri": true,
   "trace": "",
   "milieu": "Forêt",
   "activite": "Surtout la nuit",
   "hiver": "reste actif"
  }
 },
 {
  "territoire": "Jura",
  "lieu": "Saut du Doubs et lac de Chaillexon",
  "nom": "Lynx boréal",
  "ajoute": true,
  "piste": {
   "empreinte": true,
   "cri": true,
   "trace": "",
   "milieu": "Forêt",
   "activite": "Surtout la nuit",
   "hiver": "reste actif"
  }
 },
 {
  "territoire": "Jura",
  "lieu": "Tourbières de Frasne",
  "nom": "Pie-grièche grise",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Restes de proies empalées",
   "milieu": "Campagne, haies et jardins",
   "activite": "Surtout le jour",
   "hiver": "reste actif"
  }
 },
 {
  "territoire": "Jura",
  "lieu": "Forêt du Risoux et Les Rousses",
  "nom": "Grand tétras",
  "ajoute": false,
  "piste": {
   "empreinte": true,
   "cri": true,
   "trace": "",
   "milieu": "Forêt",
   "activite": "Surtout le jour",
   "hiver": "reste actif"
  },
  "ici": "L'hiver, le grand tétras ne mange que des aiguilles peu nourrissantes : chaque dérangement par skieurs, raquettistes ou randonneurs hors sentier l'épuise."
 },
 {
  "territoire": "Jura",
  "lieu": "Haute Chaîne du Jura",
  "nom": "Sonneur à ventre jaune",
  "ajoute": true,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Amas d'œufs gélatineux",
   "milieu": "Mares et étangs",
   "activite": "De jour comme de nuit",
   "hiver": "s'endort ou ralentit"
  }
 },
 {
  "territoire": "Massif armoricain",
  "lieu": "Golfe du Morbihan",
  "nom": "Gravelot à collier interrompu",
  "ajoute": true,
  "piste": {
   "empreinte": true,
   "cri": true,
   "trace": "",
   "milieu": "Dunes et plages",
   "activite": "De jour comme de nuit",
   "hiver": "en partie"
  }
 },
 {
  "territoire": "Massif armoricain",
  "lieu": "Marais de Brière",
  "nom": "Gravelot à collier interrompu",
  "ajoute": true,
  "piste": {
   "empreinte": true,
   "cri": true,
   "trace": "",
   "milieu": "Dunes et plages",
   "activite": "De jour comme de nuit",
   "hiver": "en partie"
  }
 },
 {
  "territoire": "Massif armoricain",
  "lieu": "Suisse normande",
  "nom": "Écrevisse à pattes blanches",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": false,
   "trace": "",
   "milieu": "Rivières et torrents",
   "activite": "Surtout la nuit",
   "hiver": "s'endort ou ralentit"
  }
 },
 {
  "territoire": "Massif armoricain",
  "lieu": "Lac de Grand-Lieu",
  "nom": "Ibis falcinelle",
  "ajoute": false,
  "piste": {
   "empreinte": true,
   "cri": true,
   "trace": "",
   "milieu": "Marais",
   "activite": "Surtout le jour",
   "hiver": "en partie"
  }
 },
 {
  "territoire": "Massif armoricain",
  "lieu": "Bocage vendéen",
  "nom": "Cigogne noire",
  "ajoute": false,
  "piste": {
   "empreinte": true,
   "cri": true,
   "trace": "",
   "milieu": "Forêt",
   "activite": "Surtout le jour",
   "hiver": "part de la région"
  }
 },
 {
  "territoire": "Massif armoricain",
  "lieu": "Forêt de Brocéliande",
  "nom": "Vipère péliade",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": false,
   "trace": "Mue (peau abandonnée)",
   "milieu": "Landes et coteaux secs",
   "activite": "Surtout le jour",
   "hiver": "s'endort ou ralentit"
  }
 },
 {
  "territoire": "Massif armoricain",
  "lieu": "Baie du Mont-Saint-Michel",
  "nom": "Gravelot à collier interrompu",
  "ajoute": true,
  "piste": {
   "empreinte": true,
   "cri": true,
   "trace": "",
   "milieu": "Dunes et plages",
   "activite": "De jour comme de nuit",
   "hiver": "en partie"
  }
 },
 {
  "territoire": "Massif armoricain",
  "lieu": "Monts d'Arrée",
  "nom": "Vipère péliade",
  "ajoute": true,
  "piste": {
   "empreinte": false,
   "cri": false,
   "trace": "Mue (peau abandonnée)",
   "milieu": "Landes et coteaux secs",
   "activite": "Surtout le jour",
   "hiver": "s'endort ou ralentit"
  }
 },
 {
  "territoire": "Massif armoricain",
  "lieu": "Presqu'île de Crozon",
  "nom": "Gravelot à collier interrompu",
  "ajoute": false,
  "piste": {
   "empreinte": true,
   "cri": true,
   "trace": "",
   "milieu": "Dunes et plages",
   "activite": "De jour comme de nuit",
   "hiver": "en partie"
  }
 },
 {
  "territoire": "Massif armoricain",
  "lieu": "Les Sept-Îles",
  "nom": "Macareux moine",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Terriers dans les pentes herbeuses",
   "milieu": "Falaises et rochers",
   "activite": "Surtout le jour",
   "hiver": "part de la région"
  }
 },
 {
  "territoire": "Massif central",
  "lieu": "Salers",
  "nom": "Pie-grièche grise",
  "ajoute": true,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Restes de proies empalées",
   "milieu": "Campagne, haies et jardins",
   "activite": "Surtout le jour",
   "hiver": "reste actif"
  }
 },
 {
  "territoire": "Massif central",
  "lieu": "Brioude et le val d'Allier",
  "nom": "Sonneur à ventre jaune",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Amas d'œufs gélatineux",
   "milieu": "Mares et étangs",
   "activite": "De jour comme de nuit",
   "hiver": "s'endort ou ralentit"
  }
 },
 {
  "territoire": "Massif central",
  "lieu": "Étangs du Forez",
  "nom": "Sonneur à ventre jaune",
  "ajoute": true,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Amas d'œufs gélatineux",
   "milieu": "Mares et étangs",
   "activite": "De jour comme de nuit",
   "hiver": "s'endort ou ralentit"
  }
 },
 {
  "territoire": "Massif central",
  "lieu": "Chaîne des Puys",
  "nom": "Pie-grièche grise",
  "ajoute": true,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Restes de proies empalées",
   "milieu": "Campagne, haies et jardins",
   "activite": "Surtout le jour",
   "hiver": "reste actif"
  }
 },
 {
  "territoire": "Massif central",
  "lieu": "Plateau de Millevaches",
  "nom": "Pie-grièche grise",
  "ajoute": true,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Restes de proies empalées",
   "milieu": "Campagne, haies et jardins",
   "activite": "Surtout le jour",
   "hiver": "reste actif"
  }
 },
 {
  "territoire": "Massif central",
  "lieu": "Aubrac",
  "nom": "Balbuzard pêcheur",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Énorme nid de branches à la cime d'un arbre",
   "milieu": "Lacs",
   "activite": "Surtout le jour",
   "hiver": "en partie"
  }
 },
 {
  "territoire": "Massif central",
  "lieu": "Mont Aigoual",
  "nom": "Gypaète barbu",
  "ajoute": true,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Os cassés au sol",
   "milieu": "Falaises et rochers"
  }
 },
 {
  "territoire": "Massif central",
  "lieu": "Gorges du Tarn et de la Jonte",
  "nom": "Gypaète barbu",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Os cassés au sol",
   "milieu": "Falaises et rochers"
  }
 },
 {
  "territoire": "Massif central",
  "lieu": "Causse Méjean",
  "nom": "Pie-grièche à tête rousse",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Proies parfois empalées",
   "milieu": "Campagne, haies et jardins",
   "activite": "Surtout le jour",
   "hiver": "part de la région"
  }
 },
 {
  "territoire": "Massif central",
  "lieu": "Puy Mary",
  "nom": "Loup gris",
  "ajoute": false,
  "piste": {
   "empreinte": true,
   "cri": true,
   "trace": "",
   "milieu": "Forêt",
   "activite": "Surtout la nuit",
   "hiver": "reste actif"
  }
 },
 {
  "territoire": "Méditerranée",
  "lieu": "Camargue",
  "nom": "Gravelot à collier interrompu",
  "ajoute": true,
  "piste": {
   "empreinte": true,
   "cri": true,
   "trace": "",
   "milieu": "Dunes et plages",
   "activite": "De jour comme de nuit",
   "hiver": "en partie"
  }
 },
 {
  "territoire": "Méditerranée",
  "lieu": "Étang de Thau",
  "nom": "Gravelot à collier interrompu",
  "ajoute": false,
  "piste": {
   "empreinte": true,
   "cri": true,
   "trace": "",
   "milieu": "Dunes et plages",
   "activite": "De jour comme de nuit",
   "hiver": "en partie"
  }
 },
 {
  "territoire": "Méditerranée",
  "lieu": "Gorges du Gardon",
  "nom": "Balbuzard pêcheur",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Énorme nid de branches à la cime d'un arbre",
   "milieu": "Lacs",
   "activite": "Surtout le jour",
   "hiver": "en partie"
  }
 },
 {
  "territoire": "Méditerranée",
  "lieu": "Les Alpilles",
  "nom": "Vautour moine",
  "ajoute": false,
  "piste": {
   "empreinte": true,
   "cri": false,
   "trace": "Grand nid de branches dans un arbre",
   "milieu": "Forêt",
   "hiver": "reste actif"
  }
 },
 {
  "territoire": "Méditerranée",
  "lieu": "La Crau",
  "nom": "Outarde canepetière",
  "ajoute": false,
  "piste": {
   "empreinte": true,
   "cri": true,
   "trace": "",
   "milieu": "Garrigue et maquis",
   "activite": "Surtout le jour"
  }
 },
 {
  "territoire": "Méditerranée",
  "lieu": "Lac du Salagou",
  "nom": "Outarde canepetière",
  "ajoute": true,
  "piste": {
   "empreinte": true,
   "cri": true,
   "trace": "",
   "milieu": "Garrigue et maquis",
   "activite": "Surtout le jour"
  }
 },
 {
  "territoire": "Méditerranée",
  "lieu": "Pic Saint-Loup",
  "nom": "Outarde canepetière",
  "ajoute": true,
  "piste": {
   "empreinte": true,
   "cri": true,
   "trace": "",
   "milieu": "Garrigue et maquis",
   "activite": "Surtout le jour"
  }
 },
 {
  "territoire": "Méditerranée",
  "lieu": "Gorges de l'Hérault",
  "nom": "Pélobate cultripède",
  "ajoute": false,
  "piste": {
   "empreinte": true,
   "cri": true,
   "trace": "",
   "milieu": "Dunes et plages",
   "activite": "Surtout la nuit"
  }
 },
 {
  "territoire": "Méditerranée",
  "lieu": "Massif des Maures",
  "nom": "Pie-grièche à tête rousse",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Proies parfois empalées",
   "milieu": "Campagne, haies et jardins",
   "activite": "Surtout le jour",
   "hiver": "part de la région"
  }
 },
 {
  "territoire": "Méditerranée",
  "lieu": "Les Calanques",
  "nom": "Puffin yelkouan",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Terriers dans les rochers des îlots",
   "milieu": "Mer et océan",
   "activite": "De jour comme de nuit"
  },
  "ici": "Des millions de visiteurs chaque année, à terre et en mer, dérangent la faune, notamment les puffins qui rejoignent leurs nids la nuit sur les îles."
 },
 {
  "territoire": "Plaines de l'Est et val de Saône",
  "lieu": "Strasbourg et le Rhin",
  "nom": "Sonneur à ventre jaune",
  "ajoute": true,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Amas d'œufs gélatineux",
   "milieu": "Mares et étangs",
   "activite": "De jour comme de nuit",
   "hiver": "s'endort ou ralentit"
  }
 },
 {
  "territoire": "Plaines de l'Est et val de Saône",
  "lieu": "Dijon et la Côte de Nuits",
  "nom": "Pic cendré",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "",
   "milieu": "Forêt",
   "activite": "Surtout le jour",
   "hiver": "reste actif"
  }
 },
 {
  "territoire": "Plaines de l'Est et val de Saône",
  "lieu": "Metz et la vallée de la Moselle",
  "nom": "Martre des pins",
  "ajoute": true,
  "piste": {
   "empreinte": true,
   "cri": false,
   "trace": "Laissées (crottes)",
   "milieu": "Forêt",
   "activite": "Surtout la nuit",
   "hiver": "reste actif"
  }
 },
 {
  "territoire": "Plaines de l'Est et val de Saône",
  "lieu": "Tournus et le val de Saône",
  "nom": "Sonneur à ventre jaune",
  "ajoute": true,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Amas d'œufs gélatineux",
   "milieu": "Mares et étangs",
   "activite": "De jour comme de nuit",
   "hiver": "s'endort ou ralentit"
  }
 },
 {
  "territoire": "Plaines de l'Est et val de Saône",
  "lieu": "Louhans et le bocage bressan",
  "nom": "Pie-grièche grise",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Restes de proies empalées",
   "milieu": "Campagne, haies et jardins",
   "activite": "Surtout le jour",
   "hiver": "reste actif"
  }
 },
 {
  "territoire": "Plaines de l'Est et val de Saône",
  "lieu": "L'étang de Lindre",
  "nom": "Sonneur à ventre jaune",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Amas d'œufs gélatineux",
   "milieu": "Mares et étangs",
   "activite": "De jour comme de nuit",
   "hiver": "s'endort ou ralentit"
  }
 },
 {
  "territoire": "Plaines de l'Est et val de Saône",
  "lieu": "Rhinau et la forêt du Rhin",
  "nom": "Sonneur à ventre jaune",
  "ajoute": true,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Amas d'œufs gélatineux",
   "milieu": "Mares et étangs",
   "activite": "De jour comme de nuit",
   "hiver": "s'endort ou ralentit"
  }
 },
 {
  "territoire": "Plaines de l'Est et val de Saône",
  "lieu": "Monthermé et la vallée de la Meuse",
  "nom": "Cigogne noire",
  "ajoute": false,
  "piste": {
   "empreinte": true,
   "cri": true,
   "trace": "",
   "milieu": "Forêt",
   "activite": "Surtout le jour",
   "hiver": "part de la région"
  },
  "ici": "Très sensible au dérangement, la cigogne noire peut déserter un secteur à cause de travaux forestiers ou d'éoliennes ; ses ruisseaux de pêche se raréfient.",
  "marche": "Installée en France depuis les années 1970, la cigogne noire niche aujourd'hui dans les forêts ardennaises, où ses nids sont protégés des travaux."
 },
 {
  "territoire": "Plaines de l'Est et val de Saône",
  "lieu": "L'Isle Crémieu",
  "nom": "Triton crêté",
  "ajoute": false,
  "piste": {
   "empreinte": true,
   "cri": false,
   "trace": "Œufs repliés dans une feuille",
   "milieu": "Mares et étangs",
   "activite": "Surtout la nuit",
   "hiver": "s'endort ou ralentit"
  }
 },
 {
  "territoire": "Plaines de l'Est et val de Saône",
  "lieu": "Langres et son plateau",
  "nom": "Chat forestier",
  "ajoute": false,
  "piste": {
   "empreinte": true,
   "cri": false,
   "trace": "Griffades sur les troncs",
   "milieu": "Forêt",
   "activite": "Surtout la nuit",
   "hiver": "reste actif"
  }
 },
 {
  "territoire": "Pyrénées",
  "lieu": "Saint-Jean-Pied-de-Port",
  "nom": "Pic à dos blanc",
  "ajoute": true,
  "piste": {
   "empreinte": true,
   "cri": true,
   "trace": "",
   "milieu": "Forêt",
   "activite": "Surtout le jour",
   "hiver": "reste actif"
  }
 },
 {
  "territoire": "Pyrénées",
  "lieu": "Villefranche-de-Conflent",
  "nom": "Grand tétras",
  "ajoute": true,
  "piste": {
   "empreinte": true,
   "cri": true,
   "trace": "",
   "milieu": "Forêt",
   "activite": "Surtout le jour",
   "hiver": "reste actif"
  }
 },
 {
  "territoire": "Pyrénées",
  "lieu": "Cerdagne",
  "nom": "Gypaète barbu",
  "ajoute": true,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Os cassés au sol",
   "milieu": "Falaises et rochers"
  }
 },
 {
  "territoire": "Pyrénées",
  "lieu": "Vallée de Baïgorry",
  "nom": "Vipère de Seoane",
  "ajoute": false,
  "piste": {
   "empreinte": true,
   "cri": false,
   "trace": "Mue (peau abandonnée)",
   "milieu": "Campagne, haies et jardins",
   "activite": "Surtout le jour"
  },
  "ici": "L'abandon du pâturage laisse les broussailles refermer prés et landes, des milieux ouverts dont dépend la vipère de Seoane.",
  "marche": "Strictement protégée en France depuis 2021, la vipère de Seoane bénéficie d'un plan national d'actions pour 2025-2030."
 },
 {
  "territoire": "Pyrénées",
  "lieu": "Vallée d'Ossau",
  "nom": "Vautour moine",
  "ajoute": false,
  "piste": {
   "empreinte": true,
   "cri": false,
   "trace": "Grand nid de branches dans un arbre",
   "milieu": "Forêt",
   "hiver": "reste actif"
  }
 },
 {
  "territoire": "Pyrénées",
  "lieu": "Forêt d'Iraty",
  "nom": "Pic à dos blanc",
  "ajoute": false,
  "piste": {
   "empreinte": true,
   "cri": true,
   "trace": "",
   "milieu": "Forêt",
   "activite": "Surtout le jour",
   "hiver": "reste actif"
  },
  "ici": "Le pic à dos blanc dépend des vieux hêtres et des arbres morts debout : les coupes de bois peuvent le priver de ses arbres à nid."
 },
 {
  "territoire": "Pyrénées",
  "lieu": "Vallée d'Aspe",
  "nom": "Ours brun",
  "ajoute": false,
  "piste": {
   "empreinte": true,
   "cri": false,
   "trace": "Griffades sur les troncs",
   "milieu": "Forêt",
   "activite": "Surtout la nuit",
   "hiver": "s'endort ou ralentit"
  },
  "ici": "Les ours des Pyrénées descendent de peu d'individus : leur consanguinité augmente, ce qui fragilise l'avenir de la population."
 },
 {
  "territoire": "Pyrénées",
  "lieu": "Tourbière de Bernadouze",
  "nom": "Grand tétras",
  "ajoute": false,
  "piste": {
   "empreinte": true,
   "cri": true,
   "trace": "",
   "milieu": "Forêt",
   "activite": "Surtout le jour",
   "hiver": "reste actif"
  }
 },
 {
  "territoire": "Pyrénées",
  "lieu": "Lac de Lourdes",
  "nom": "Gypaète barbu",
  "ajoute": true,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Os cassés au sol",
   "milieu": "Falaises et rochers"
  }
 },
 {
  "territoire": "Pyrénées",
  "lieu": "Cirque de Gavarnie",
  "nom": "Lézard de Bonnal",
  "ajoute": false,
  "piste": {
   "empreinte": true,
   "cri": false,
   "trace": "Mue (peau abandonnée)",
   "milieu": "Falaises et rochers",
   "activite": "Surtout le jour"
  }
 },
 {
  "territoire": "Vosges",
  "lieu": "Gérardmer et son lac",
  "nom": "Agrion hasté",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": false,
   "trace": "Peaux vides des larves, accrochées aux plantes",
   "milieu": "Marais",
   "activite": "Surtout le jour"
  }
 },
 {
  "territoire": "Vosges",
  "lieu": "Riquewihr et le vignoble",
  "nom": "Sonneur à ventre jaune",
  "ajoute": true,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Amas d'œufs gélatineux",
   "milieu": "Mares et étangs",
   "activite": "De jour comme de nuit",
   "hiver": "s'endort ou ralentit"
  }
 },
 {
  "territoire": "Vosges",
  "lieu": "Remiremont et la vallée de la Moselle",
  "nom": "Lote",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": false,
   "trace": "",
   "milieu": "Lacs",
   "activite": "Surtout la nuit",
   "hiver": "reste actif"
  }
 },
 {
  "territoire": "Vosges",
  "lieu": "Mont Sainte-Odile",
  "nom": "Sonneur à ventre jaune",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Amas d'œufs gélatineux",
   "milieu": "Mares et étangs",
   "activite": "De jour comme de nuit",
   "hiver": "s'endort ou ralentit"
  }
 },
 {
  "territoire": "Vosges",
  "lieu": "Vallée de Munster",
  "nom": "Pie-grièche grise",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Restes de proies empalées",
   "milieu": "Campagne, haies et jardins",
   "activite": "Surtout le jour",
   "hiver": "reste actif"
  }
 },
 {
  "territoire": "Vosges",
  "lieu": "Plateau des Mille Étangs",
  "nom": "Leucorrhine douteuse",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": false,
   "trace": "Peaux vides des larves, accrochées aux plantes",
   "milieu": "Landes et coteaux secs"
  }
 },
 {
  "territoire": "Vosges",
  "lieu": "Le Donon et la vallée de la Bruche",
  "nom": "Martre des pins",
  "ajoute": false,
  "piste": {
   "empreinte": true,
   "cri": false,
   "trace": "Laissées (crottes)",
   "milieu": "Forêt",
   "activite": "Surtout la nuit",
   "hiver": "reste actif"
  }
 },
 {
  "territoire": "Vosges",
  "lieu": "Château du Falkenstein et étang de Hanau",
  "nom": "Sonneur à ventre jaune",
  "ajoute": true,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "Amas d'œufs gélatineux",
   "milieu": "Mares et étangs",
   "activite": "De jour comme de nuit",
   "hiver": "s'endort ou ralentit"
  }
 },
 {
  "territoire": "Vosges",
  "lieu": "Ballon d'Alsace",
  "nom": "Sizerin cabaret",
  "ajoute": false,
  "piste": {
   "empreinte": false,
   "cri": true,
   "trace": "",
   "milieu": "Forêt",
   "activite": "Surtout le jour",
   "hiver": "en partie"
  }
 },
 {
  "territoire": "Vosges",
  "lieu": "Le Grand Ballon",
  "nom": "Cigogne noire",
  "ajoute": false,
  "piste": {
   "empreinte": true,
   "cri": true,
   "trace": "",
   "milieu": "Forêt",
   "activite": "Surtout le jour",
   "hiver": "part de la région"
  }
 }
];

const POURQUOI_RARE = {
 "Lynx boréal": "Peu nombreux, il meurt souvent sur les routes.",
 "Martre des pins": "Discrète, surtout la nuit, en forêt dense.",
 "Loutre d'Europe": "Elle revient lentement et ne sort guère que la nuit.",
 "Castor d'Europe": "Réintroduit, il travaille surtout la nuit, au bord de l'eau.",
 "Oreillard montagnard": "Il ne vit qu'en haute montagne et sort la nuit.",
 "Gypaète barbu": "Il a failli disparaître : câbles et plomb le tuent.",
 "Lagopède alpin": "Il ne vit que tout en haut des montagnes.",
 "Tichodrome échelette": "Il ne vit que sur les hautes parois rocheuses.",
 "Tétras lyre": "Il ne vit que dans les forêts claires d'altitude.",
 "Perdrix bartavelle": "Elle ne vit que sur les pentes rocheuses des Alpes.",
 "Gélinotte des bois": "Elle se cache dans les sous-bois denses.",
 "Crave à bec rouge": "Ses populations sont petites et dispersées.",
 "Grand-duc d'Europe": "Il ne chasse que la nuit, dans des lieux escarpés.",
 "Chevêchette d'Europe": "Minuscule, elle ne vit que dans les vieilles forêts d'épicéas.",
 "Salamandre noire": "En France, elle ne vit que dans les Alpes.",
 "Sonneur à ventre jaune": "Ses petites mares et ornières disparaissent.",
 "Crapaud calamite": "Il ne sort que la nuit, sur des sols sableux.",
 "Vipère péliade": "Ses landes et tourbières reculent devant l'agriculture.",
 "Couleuvre d'Esculape": "Discrète, elle passe beaucoup de temps dans les arbres.",
 "Vipère d'Orsini": "Ses pelouses d'altitude s'embroussaillent depuis le recul des troupeaux.",
 "Omble chevalier": "Il ne vit que dans les lacs froids et profonds.",
 "Lote": "Ses frayères disparaissent et les eaux se réchauffent.",
 "Apollon": "Il ne vit que sur les pelouses de montagne.",
 "Bourdon des Alpes": "Il ne vit que très haut, près des glaciers.",
 "Rosalie des Alpes": "Elle a besoin de vieux hêtres morts au soleil.",
 "Isabelle de France": "Elle vole la nuit, dans quelques forêts de pins.",
 "Écrevisse à pattes blanches": "Les écrevisses américaines lui transmettent une maladie mortelle.",
 "Méduse d'eau douce": "Elle n'apparaît que certains étés chauds, puis disparaît.",
 "Vison d'Europe": "Le vison d'Amérique, échappé des élevages, le remplace.",
 "Bruant ortolan": "L'agriculture a changé et il a longtemps été chassé.",
 "Ibis falcinelle": "Il ne niche en France que depuis 2006, en Camargue.",
 "Gravelot à collier interrompu": "Il pond sur des plages trop fréquentées.",
 "Pie-grièche à tête rousse": "Les pesticides lui retirent ses gros insectes.",
 "Tortue luth": "Elle vit au large et approche rarement des côtes.",
 "Esturgeon européen": "Surpêché et bloqué par les barrages, il a presque disparu.",
 "Brochet aquitain": "Il se mélange avec le brochet commun introduit.",
 "Gomphe de Graslin": "Il ne vit que sur quelques rivières calmes du Sud-Ouest.",
 "Huître plate": "Une maladie et la surpêche ont vidé ses bancs.",
 "Grande mulette": "Ses rivières sont polluées et l'esturgeon a disparu.",
 "Chat forestier": "Discret et nocturne, il évite les lieux habités.",
 "Balbuzard pêcheur": "Persécuté puis empoisonné par les pesticides, il revient lentement.",
 "Butor étoilé": "Ses grandes roselières disparaissent.",
 "Héron pourpré": "Il se cache au fond des roselières.",
 "Cistude d'Europe": "Craintive, elle plonge au moindre bruit.",
 "Lézard des souches": "Ses landes et talus ensoleillés se raréfient.",
 "Murin du Maghreb": "En France, il ne vit qu'en Corse.",
 "Lièvre de Corse": "En France, il ne vit qu'en Corse.",
 "Goéland d'Audouin": "Il ne niche que sur quelques îlots de Méditerranée.",
 "Monticole bleu": "Il ne vit que sur les falaises du Sud.",
 "Puffin yelkouan": "Chats et rats introduits mangent ses œufs sur les îles.",
 "Faucon d'Éléonore": "Il niche ailleurs en Méditerranée et ne fait que passer.",
 "Discoglosse corse": "Il ne vit qu'en Corse, dans les ruisseaux.",
 "Grand hamster": "Le maïs et les villes ont remplacé ses champs.",
 "Blongios nain": "Les zones humides où il niche se dégradent.",
 "Crapaud vert": "En France, il ne vit que dans l'Est.",
 "Pipistrelle de Nathusius": "Migratrice, elle ne passe chez nous qu'une partie de l'année.",
 "Sérotine bicolore": "Elle vit très haut et ne sort que la nuit.",
 "Musaraigne alpine": "En France, elle ne vit qu'en montagne, près des ruisseaux.",
 "Pic tridactyle": "Il lui faut des forêts d'épicéas riches en bois mort.",
 "Pic cendré": "Ses forêts de feuillus reculent ou sont trop exploitées.",
 "Râle des genêts": "La fauche précoce détruit ses nids dans les prés.",
 "Solitaire": "Il ne vit que dans quelques tourbières de montagne.",
 "Fadet des tourbières": "Les tourbières où il vit sont détruites.",
 "Bacchante": "Il lui faut des bois clairs et des lisières, qui se raréfient.",
 "Grand Sylvain": "Il vole haut dans les arbres et descend rarement.",
 "Cuivré de la verge-d'or": "Il ne vit que sur les prairies de montagne.",
 "Genette commune": "Discrète, elle ne sort que la nuit.",
 "Muscardin": "Minuscule, il ne sort que la nuit, dans les haies.",
 "Phoque veau-marin": "Il ne vit que dans quelques baies de la Manche.",
 "Macareux moine": "Il manque de petits poissons pour nourrir ses poussins.",
 "Océanite tempête": "Il ne niche que sur quelques îlots sans prédateurs.",
 "Pélodyte ponctué": "Il ne sort que la nuit, près des mares temporaires.",
 "Triton crêté": "Ses grandes mares de bocage disparaissent.",
 "Lamproie marine": "Les barrages lui barrent la route de ses frayères.",
 "Grande alose": "Les barrages bloquent sa remontée des fleuves.",
 "Saint-Pierre": "Il vit près du fond, loin des côtes.",
 "Sérotine de Nilsson": "Chez nous, elle ne vit qu'en montagne et sort la nuit.",
 "Murin de Bechstein": "Il lui faut de vieilles forêts riches en arbres creux.",
 "Raton laveur": "Venu d'Amérique, il ne vit que dans quelques régions.",
 "Crossope de Miller": "Minuscule et discrète, elle vit au bord de l'eau.",
 "Rat noir": "Le surmulot l'a chassé de presque partout.",
 "Vautour moine": "Disparu de France, il a été réintroduit dans les Causses.",
 "Cigogne noire": "Farouche, elle niche cachée au fond des grandes forêts.",
 "Chouette de Tengmalm": "Elle vit dans les forêts de montagne et chasse la nuit.",
 "Pie-grièche grise": "Les haies et les prés disparaissent.",
 "Cuivré de la bistorte": "Il ne vit que dans les prés humides à bistorte.",
 "Nacré de la canneberge": "Il ne vit que dans les tourbières à canneberge.",
 "Mulette perlière": "La vase et la pollution étouffent ses rivières.",
 "Pachyure étrusque": "Minuscule, elle se cache sous les pierres et les murets.",
 "Rhinolophe euryale": "Il ne vit que dans quelques grottes du Sud.",
 "Globicéphale noir": "Il vit au large, dans les eaux profondes.",
 "Cachalot": "Il vit au large et plonge très profond.",
 "Outarde canepetière": "L'agriculture intensive a fait disparaître ses plaines.",
 "Aigle de Bonelli": "Les lignes électriques l'électrocutent.",
 "Vautour percnoptère": "Il est empoisonné ou électrocuté sur les lignes.",
 "Coucou geai": "En France, il ne vit que dans le Midi.",
 "Pie-grièche méridionale": "Les villes grignotent peu à peu ses garrigues.",
 "Traquet oreillard": "Ses garrigues basses et rocailleuses se referment.",
 "Pélobate cultripède": "Il est souvent écrasé sur les routes.",
 "Tortue d'Hermann": "Son milieu de vie disparaît.",
 "Hémidactyle verruqueux": "Il ne sort que la nuit, sur les vieux murs.",
 "Malmignatte": "Elle se cache sous les pierres et sort la nuit.",
 "Cigale de mer": "Elle se cache dans les grottes sous-marines.",
 "Grande nacre": "Une maladie a tué presque toutes les grandes nacres.",
 "Ours brun": "Chassé et détruit par l'homme, il a presque disparu.",
 "Bouquetin ibérique": "Disparu des Pyrénées, il y a été réintroduit.",
 "Desman des Pyrénées": "Les aménagements des torrents et le vison d'Amérique le menacent.",
 "Campagnol des Pyrénées": "Il ne vit que dans les montagnes du Sud-Ouest.",
 "Grand tétras": "Les loisirs le dérangent et ses forêts se morcellent.",
 "Pic à dos blanc": "Il lui faut de vieilles hêtraies pleines de bois mort.",
 "Grenouille des Pyrénées": "Elle ne vit que dans quelques torrents de l'ouest pyrénéen.",
 "Lézard de Bonnal": "Il ne vit que très haut, dans les Pyrénées centrales.",
 "Vipère de Seoane": "En France, elle ne vit qu'au Pays basque.",
 "Coronelle girondine": "Discrète, elle chasse surtout la nuit.",
 "Chabot des Pyrénées": "Il ne vit que dans la haute la Garonne.",
 "Lamproie de Planer": "Elle passe des années cachée dans la vase.",
 "Moiré de Lefèbvre": "Il ne vit que dans les éboulis des Pyrénées.",
 "Cordulégastre bidenté": "Il ne vit qu'au bord des sources forestières.",
 "Hélice des bois": "Elle se cache dans les forêts fraîches et humides.",
 "Moiré de la canche": "Il ne vit que dans les prairies humides de montagne.",
 "Sittelle corse": "Elle ne vit qu'en Corse, dans les vieilles forêts de pins laricio."
};
