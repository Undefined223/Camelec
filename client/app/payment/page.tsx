import React from 'react';

const PaiementSecurise = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Paiement Sécurisé</h1>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Notre Paiement Sécurisé</h2>
        <p>
          Tous nos paiements sont sécurisés grâce au protocole SSL, garantissant la confidentialité de vos informations bancaires et personnelles.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Méthodes de Paiement</h2>
        <p>
          Nous acceptons les paiements via Visa, Mastercard, D17 et Konnect. Vous pouvez choisir la méthode qui vous convient le mieux au moment du paiement.
        </p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">À Propos de ce Service</h2>
        <p>
          Nos partenaires de paiement assurent une protection maximale de vos transactions en ligne. Si vous avez des questions ou des préoccupations concernant la sécurité de vos paiements, n&apos;hésitez pas à nous contacter.
        </p>
      </section>
    </div>
  );
};

export default PaiementSecurise;
