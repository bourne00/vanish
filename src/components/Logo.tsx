'use client'

export function Logo() {
  return (
    <div className="flex flex-col items-center select-none">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-wider glow-text mb-2">
        VANISH
      </h1>
      <p className="text-sm sm:text-base text-vanish-green-dim tracking-widest uppercase">
        A message, a secret.
      </p>
    </div>
  )
}

