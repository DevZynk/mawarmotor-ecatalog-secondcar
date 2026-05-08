import { Card } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'

type CarFeatureProps = {
  features : string[]
}

export default async function CarFeature({ features }: CarFeatureProps) {
    
  return (
    <Card className="p-5 w-full">
      <div>
        <h2 className="text-lg font-semibold">Keunggulan & Kondisi Mobil</h2>
        <p className="text-sm text-muted-foreground">Ringkasan fitur dan kondisi unit</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
        {features?.map((feature: string, index: number) => (
          <div
            key={index}
            className="flex items-start gap-2 rounded-lg p-2 hover:bg-muted/60 transition"
          >
            <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />

            <p className="text-sm text-muted-foreground leading-relaxed wrap-break-words whitespace-normal">
              {feature}
            </p>
          </div>
        ))}
      </div>
    </Card>
  )
}
