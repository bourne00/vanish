'use client'

import { useCallback, KeyboardEvent } from 'react'
import { hapticFeedback } from '@/lib/utils'

interface CodeInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  placeholder?: string
  disabled?: boolean
}

export function CodeInput({
  value,
  onChange,
  onSubmit,
  placeholder = 'ENTER CODE',
  disabled = false,
}: CodeInputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)
      onChange(newValue)
      if (newValue.length === 6) {
        hapticFeedback('light')
      }
    },
    [onChange]
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && value.length === 6) {
        hapticFeedback('medium')
        onSubmit()
      }
    },
    [value, onSubmit]
  )

  return (
    <div className="w-full max-w-xs">
      <label className="block text-xs text-vanish-green-dim mb-2 tracking-widest uppercase text-center">
        Peer Code
      </label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={6}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="characters"
        spellCheck={false}
        className="w-full text-center text-2xl sm:text-3xl font-bold tracking-[0.3em] px-6 py-4 border border-vanish-green bg-vanish-black placeholder:text-vanish-green-dark placeholder:tracking-[0.2em] placeholder:text-lg focus:glow-border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <div className="flex justify-center mt-2">
        <span className="text-xs text-vanish-green-dim">
          {value.length}/6
        </span>
      </div>
    </div>
  )
}

