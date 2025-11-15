MonCosmetics — site de démonstration

Résumé
-------
Site statique de démonstration pour une boutique de cosmétiques. Contient une page d'accueil (`index.html`) avec catalogue, et une page produit (`product.html`). Les produits sont définis dans `products.js`.

Principales fonctionnalités
---------------------------
- Grid de produits dynamique (donnée dans `products.js`).
- Quick-view modal depuis la grille.
- Page produit détaillée avec galerie, onglets et panneau d'achat sticky.
- Client-side cart stocké dans `localStorage` (`cart.js`) avec mini-cart et toast.
- Recherche en direct dans le header (champ de recherche).

Comment lancer
--------------
1. Ouvrez le dossier du projet :

   ```powershell
   Set-Location 'C:\Users\zakar\OneDrive\Desktop\sites 2\mystore'
   ```

2. Ouvrez la page principale dans votre navigateur :

   ```powershell
   Start-Process .\index.html
   ```

3. Cliquez sur un produit pour voir la page produit, ou utilisez la fonction "Voir" sur la grille pour ouvrir `product.html?id=c1`, etc.

Notes techniques
----------------
- Les images sont stockées localement dans le dossier `images/` (fichiers `c1.jpg` … `c15.jpg`). Vérifiez les droits avant publication publique.
- `products.js` expose `window.PRODUCTS` (tableau d'objets product). Chaque produit contient :
  - `id`, `title`, `price`, `desc`, `tagline`, `benefits`, `category`, `tags`, `img`, `images`.
- `cart.js` expose les fonctions globales `addToCart(id, qty)`, `removeFromCart(id)`, `updateQty(id, qty)` et `getCart()`.

Accessibilité & améliorations possibles
--------------------------------------
- Le site inclut des améliorations ARIA pour les onglets et la navigation clavier. Pour un audit complet d'accessibilité, il est recommandé d'ajouter un focus-trap dans les modals, des tests de contraste et la prise en charge complète des lecteurs d'écran.
- Pour rapprocher davantage du rendu d'un site commerçant professionnel : ajouter des images multiples par produit (`images` déjà prévu), carrousels, micro-animations, optimisation des performances (lazy-loading + compression) et intégration d'un backend de paiement.

Contact
-------
Pour contact : via le site (section Contact)

Licence
-------
Ce projet est fourni tel quel pour usage local et test. Assurez-vous d'avoir les droits d'utilisation des images si vous publiez le site publiquement.
