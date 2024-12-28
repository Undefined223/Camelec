import React from 'react';

const Page = () => {
    return (
        <div className="p-6 bg-gray-100 text-gray-900">
            <div className="max-w-3xl mx-auto space-y-8">
                <section>
                    <h2 className="text-2xl font-bold mb-4">Article 1 - Prix</h2>
                    <p className="mb-2">1.1 - Les prix de nos produits sont indiqués en Dinars toutes taxes (TVA et autres taxes) comprises hors participation aux frais de port et sont valables tant qu&apos;ils sont présents à l&apos;écran.</p>
                    <p className="mb-2">1.2 - Toutes les commandes sont payables en Dinars Tunisiens.</p>
                    <p className="mb-2">1.3 - InfoPlus se réserve le droit de modifier ses prix à tout moment mais les produits seront facturés au tarif en vigueur au moment de la création de commande.</p>
                    <p className="mb-2">1.4 - Les produits demeurent la propriété de InfoPlus jusqu&apos;au complet encaissement du prix.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">Article 2 - Commande</h2>
                    <p className="mb-2">Les commandes sont à passer sur le site Internet : <a href="https://infoplus-store.com" className="text-blue-500 underline">infoplus-store.com</a> ou par téléphone au 31 31 00 00 ou par email sur contact (à) InfoPlus.com.tn ou à notre siège à Tunis.</p>
                    <p className="mb-2">Les informations contractuelles sont présentées en langue française et feront l&apos;objet d&apos;une confirmation par messagerie électronique reprenant ces informations contractuelles une fois votre commande validée.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">Article 3 - Validation</h2>
                    <p className="mb-2">Quand vous cliquez sur le bouton &quot;Valider&quot; après le processus de commande, vous déclarez avoir pris connaissance et accepter les présentes Conditions Générales de Vente pleinement et sans réserve.</p>
                    <p className="mb-2">InfoPlus se réserve le droit de demander pièce d&apos;identité ou un justificatif de domicile pour les commandes passées par carte bancaire ou par chèque bancaire ou postal. La validation de la commande sera repoussée par InfoPlus jusqu&apos;à la réception et/ou la vérification de ces éléments.</p>
                    <p className="mb-2">En l&apos;absence de réception de ces pièces dans un délai de 30 jours, la commande sera réputée annulée de plein droit.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">Article 4 - Disponibilité</h2>
                    <p className="mb-2">Nos offres de produits sont valables tant qu&apos;elles sont visibles à l&apos;écran, dans la limite des stocks disponibles hors opérations promotionnelles mentionnées sur les sites.</p>
                    <p className="mb-2">En cas d&apos;indisponibilité de produit après passation de votre commande, nous vous informerons par mail dans les meilleurs délais.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">Article 5 - Paiement</h2>
                    <p className="mb-2">Le règlement de vos achats peut s&apos;effectuer par espèces lors de la livraison, par chèque, virement ou avec les cartes bancaires suivantes émises en Tunisie : Visa, Mastercard, Cartes CIB.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">Article 6 - Sécurisation</h2>
                    <p className="mb-2">Notre site fait l&apos;objet d&apos;un système de sécurisation. Nous avons adopté le procédé de cryptage SSL géré par Monétique Tunisie.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">Article 7 - Livraison</h2>
                    <p className="mb-2">Les produits achetés sur InfoPlus.com.tn peuvent être livrés par transporteur uniquement en Tunisie.</p>
                    <p className="mb-2">En cas de retard d&apos;expédition, un mail vous sera envoyé pour vous informer.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">Article 8 - Accompagnement par nos équipes</h2>
                    <p className="mb-2">Appelez notre Service Commercial au 31 31 00 00 pour toute assistance.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">Article 9 - Propriété Intellectuelle</h2>
                    <p className="mb-2">Tous les textes, commentaires, ouvrages, illustrations et images reproduits sur le site InfoPlus.com.tn sont protégés par le droit d&apos;auteur.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">Article 10 - Responsabilité</h2>
                    <p className="mb-2">Les produits proposés sont conformes à la législation Tunisienne en vigueur et aux normes applicables en Tunisie.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">Article 11 - Garantie</h2>
                    <p className="mb-2">Les produits achetés chez InfoPlus donnent droit à une garantie minimale d&apos;un an.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">Article 12 - Droit Applicable - Litiges</h2>
                    <p className="mb-2">Le présent contrat est soumis à la loi Tunisienne.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">Article 13 - Mentions Légales</h2>
                    <p className="mb-2">Le site infoplus-store.com est publié par InfoPlus Grombelia, Grombalia 8030 Nabeul Tunisie.</p>
                </section>
            </div>
        </div>
    );
}

export default Page;
