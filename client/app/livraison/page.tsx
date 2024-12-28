import React from 'react';

const Livraison = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Livraison</h1>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Expéditions et retours</h2>
        <p>
          Expédition de votre colis. Les colis sont généralement expédiés dans un délai de 2 jours après réception du paiement. Ils sont expédiés via UPS avec un numéro de suivi et remis sans signature. Les colis peuvent également être expédiés via UPS Extra et remis contre signature. Veuillez nous contacter avant de choisir ce mode de livraison, car il induit des frais supplémentaires. Quel que soit le mode de livraison choisi, nous vous envoyons un lien pour suivre votre colis en ligne.
        </p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Frais d&apos;expédition</h2>
        <p>
          Les frais d&apos;expédition incluent les frais de préparation et d&apos;emballage ainsi que les frais de port. Les frais de préparation sont fixes, tandis que les frais de transport varient selon le poids total du colis. Nous vous recommandons de regrouper tous vos articles dans une seule commande. Nous ne pouvons regrouper deux commandes placées séparément et des frais d&apos;expédition s&apos;appliquent à chacune d&apos;entre elles. Votre colis est expédié à vos propres risques, mais une attention particulière est portée aux objets fragiles.
        </p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Protection des articles</h2>
        <p>
          Les dimensions des boîtes sont appropriées et vos articles sont correctement protégés.
        </p>
      </section>
    </div>
  );
};

export default Livraison;
