import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProduit } from '@/lib/supabase/catalogue'
import { GalerieProduit } from '@/components/catalogue/galerie-produit'

type PageProduitProps = {
  params: Promise<{ id: string }>
}

export default async function PageProduit({ params }: PageProduitProps) {
  const { id } = await params
  const produit = await getProduit(id)

  if (!produit) {
    notFound()
  }

  const afficherPrixPromo = produit.prixPromo !== null && produit.prixPromo < produit.prix
  const prixAffiche = afficherPrixPromo ? produit.prixPromo! : produit.prix
  
  // DEBUG - on affiche tout
  const whatsappRaw = produit.boutique.whatsapp || 'VIDE'
  const whatsappClean = produit.boutique.whatsapp?.replace(/[^0-9]/g, '') || ''

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Link href="/" className="text-sm text-gray-600 hover:underline">← Retour</Link>
        
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <GalerieProduit images={produit.produit_images} imagePrincipale={produit.image_url} nomProduit={produit.nom} />
          
          <div className="rounded-2xl bg-white p-6 shadow">
            <h1 className="text-2xl font-bold">{produit.nom}</h1>
            <p className="mt-2 text-gray-600">{produit.boutique.nom}</p>
            
            <div className="mt-4">
              {afficherPrixPromo && <p className="line-through text-gray-400">{produit.prix} {produit.boutique.devise}</p>}
              <p className="text-3xl font-bold text-green-600">{prixAffiche} {produit.boutique.devise}</p>
            </div>

            {/* DEBUG BOX */}
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded text-sm">
              <p><b>DEBUG:</b></p>
              <p>Boutique: {produit.boutique.nom}</p>
              <p>WhatsApp brut: {whatsappRaw}</p>
              <p>WhatsApp clean: {whatsappClean || 'VIDE'}</p>
              <p>ID Boutique: {produit.boutique.id}</p>
            </div>

            {/* BOUTON WHATSAPP - TOUJOURS VISIBLE */}
            <div className="mt-6">
              {whatsappClean ? (
                <a
                  href={`https://wa.me/${whatsappClean}?text=Bonjour, je suis intéressé par ${encodeURIComponent(produit.nom)}`}
                  target="_blank"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-4 font-bold text-white hover:bg-[#20BD5A]"
                >
                  💬 Contacter sur WhatsApp: {produit.boutique.whatsapp}
                </a>
              ) : (
                <div className="rounded-xl bg-red-100 p-4 text-red-700 text-center">
                  ❌ Pas de numéro WhatsApp pour cette boutique.<br/>
                  Va sur Supabase → boutiques → ajoute un numéro dans la colonne whatsapp
                </div>
              )}
            </div>

            {produit.description && <p className="mt-6 text-gray-700">{produit.description}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
