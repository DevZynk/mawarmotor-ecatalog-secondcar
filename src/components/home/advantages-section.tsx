import { Icon } from '../shared/icon'
import { getPayloadClient } from '@/lib/payload'

export default async function AdvantagesSection() {
  const payload = await getPayloadClient()

  const advantages = await payload.findGlobal({
    slug: 'advantage',
  })

  return (
    <section id="advantageSection" className="space-y-6">
      {/* HEADER */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-foreground">{advantages.title}</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">{advantages.subTitle}</p>
      </div>

      {/* GRID SSR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {advantages.advantages.map((item) => (
          <div
            key={item.title}
            className="group flex gap-4 rounded-xl border bg-card p-5 hover:border-primary/40 hover:shadow-sm transition-all"
          >
            <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Icon name={item.icon} size={20} weight="fill" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
