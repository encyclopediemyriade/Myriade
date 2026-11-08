// 18_cadrage.js — Étape R159 (08/11/2026, choix d'Aubin : « que la tête de l'espèce apparaisse toujours »)
// Chaque photo d'espèce se cale sur la tête de l'animal, partout dans le jeu (Rencontre, accueil, encyclopédie, bannières…).
// La position de la tête (en % de la largeur et de la hauteur de la photo) vient de cadrage.js,
// généré depuis Données\cadrage_photos.xlsx par Outils\gen_cadrage.py. Une photo absente de la liste garde le cadrage habituel.
// Comment : « object-position: x% y% » aligne le point (x %, y %) de la photo sur le point (x %, y %) du cadre :
// ce point reste donc toujours dans le cadre, quelle que soit sa forme.
(function () {
  if (typeof CADRAGE === "undefined") return;
  const RE = /(?:^|\/)Images\/(?:mini\/)?([^\/?#]+)$/;
  function cadrer(img) {
    if (!img || img.tagName !== "IMG") return;
    const m = RE.exec(decodeURIComponent(String(img.getAttribute("src") || "").split("?")[0]));
    const c = m && CADRAGE[m[1]];
    if (!c) { if (img.dataset.cadre) { img.style.objectPosition = ""; delete img.dataset.cadre; } return; }
    img.style.objectPosition = c[0] + "% " + c[1] + "%";
    img.dataset.cadre = "1";
  }
  function parcourir(n) {
    if (!n || n.nodeType !== 1) return;
    if (n.tagName === "IMG") cadrer(n); else n.querySelectorAll("img").forEach(cadrer);
  }
  new MutationObserver(liste => {
    for (const m of liste) {
      if (m.type === "attributes") cadrer(m.target);
      else m.addedNodes.forEach(parcourir);
    }
  }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["src"] });
  parcourir(document.body);
})();
