import { TranslationModel } from "../types/config.types"

export const getSpeedBadge = (speed: TranslationModel["speed"]) => {
  const styles = {
    fast: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    slow: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  }
  const labels = { fast: "Fast", medium: "Medium", slow: "Slow" }
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${styles[speed]}`
    }>
      {labels[speed]}
    </span>
  )
}

export const getQualityDots = (quality: TranslationModel["quality"]) => {
  const count = { good: 1, great: 2, best: 3 }[quality]
  return (
    <div className="flex gap-0.5" >
      {
        [1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full ${i <= count ? "bg-primary" : "bg-muted-foreground/20"
              }`}
          />
        ))}
    </div>
  )
}


