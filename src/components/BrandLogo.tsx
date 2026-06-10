interface BrandLogoProps {
  className?: string
}

export function BrandLogo({ className = 'mb-10' }: BrandLogoProps) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="from-brand-pink to-brand-blue h-12 w-12 rounded-full bg-linear-to-tr shadow-lg" />
      <span className="text-xs font-bold tracking-widest text-white/70 uppercase">
        HobbyLoop
      </span>
    </div>
  )
}
