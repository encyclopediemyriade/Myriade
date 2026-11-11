// ============================================================
// 22_typographie.js — Étape R187 (11/11/2026, liste du jour n° 1)
// L'espace insécable du français devant « ? », « ! », « : », « ; » et « » », et après « « ».
// Retour d'Aubin du 10/11 : le « ? » partait seul à la ligne (« Dans lesquels de ces milieux vit-elle » / « ? »).
//
// Les textes du jeu viennent de partout (le programme, les classeurs, les fiches, les questions insolites) :
// plutôt que de les corriger un par un, on corrige ce qui s'affiche, au moment où ça s'affiche.
// Une espace ordinaire devant ces signes devient insécable : le signe reste collé au mot qui le précède.
// Rien n'est changé dans les données ni dans les sauvegardes.
// ============================================================
(function () {
  const INSECABLE = " ";
  const A_CORRIGER = /[ \t]+(?=[?!:;»])|«[ \t]+/;                     // un test rapide avant de corriger
  const MOTIF = /[ \t]+([?!:;»])|«[ \t]+/g;
  const IGNORER = new Set(["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "CODE", "PRE", "NOSCRIPT"]);

  function corrigerTexte(t) {
    return t.replace(MOTIF, (tout, signe) => signe ? INSECABLE + signe : "«" + INSECABLE);
  }
  function corrigerNoeud(n) {
    if (n.nodeType === 3) {                                            // un morceau de texte
      const parent = n.parentNode;
      if (!parent || IGNORER.has(parent.nodeName)) return;
      const avant = n.nodeValue;
      if (!A_CORRIGER.test(avant)) return;
      const apres = corrigerTexte(avant);
      if (apres !== avant) n.nodeValue = apres;                       // seulement si ça change : pas de boucle sans fin
    } else if (n.nodeType === 1 && !IGNORER.has(n.nodeName)) {         // un bloc : tout ce qu'il contient
      const parcours = document.createTreeWalker(n, NodeFilter.SHOW_TEXT);
      const textes = [];
      while (parcours.nextNode()) textes.push(parcours.currentNode);
      textes.forEach(corrigerNoeud);
    }
  }
  function demarrer() {
    corrigerNoeud(document.body);
    new MutationObserver(changements => {
      for (const c of changements) {
        if (c.type === "characterData") corrigerNoeud(c.target);
        else c.addedNodes.forEach(corrigerNoeud);
      }
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
    if (document.title && A_CORRIGER.test(document.title)) document.title = corrigerTexte(document.title);
  }
  if (document.body) demarrer(); else document.addEventListener("DOMContentLoaded", demarrer);
  window.corrigerTypographie = corrigerTexte;                          // pour les essais (console, test_jeu.py)
})();
