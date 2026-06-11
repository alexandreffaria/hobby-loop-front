import type { ButtonHTMLAttributes } from 'react'

// The brand pink→blue primary action button. Margins/positioning come from
// the caller via className.
export function GradientButton({
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`from-brand-pink to-brand-blue w-full rounded-xl bg-linear-to-r py-4 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    />
  )
}
