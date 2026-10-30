'use client'
import { useState } from 'react'
type Image = { image_url: string }
type Props = { images: Image[]; imagePrincipale: string | null; nomProduit: string }
export function GalerieProduit({ images, imagePrincipale, nomProduit }: Props) {
  const allImages = [imagePrincipale, ...images.map(i => i.image_url)].filter(Boolean) as string[]
  const [active, setActive] = useState(allImages[0] || '/placeholder.png')
  return (
    <div className="space-y-3">
      <div className="aspect-square overflow-hidden rounded-2xl bg-white shadow">
        <img src={active} alt={nomProduit} className="h-full w-full object-cover" />
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {allImages.map((img, i) => (
          <button key={i} onClick={() => setActive(img)} className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 ${active === img ? 'border-green-500' : 'border-transparent'}`}>
            <img src={img} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
