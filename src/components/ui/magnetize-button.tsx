// Componente magnetize-button: encapsula logica y presentacion de UI reutilizable.
// Nota: este archivo se documenta con comentarios cortos centrados en decisiones no obvias.
import * as React from "react"
import { useCallback, useMemo, useState } from "react"
import { motion, useAnimation } from "motion/react"

import { cn } from "@/lib/utils.ts"
import { Button } from "@/components/ui/button"

interface MagnetizeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  particleCount?: number
  particleSpread?: number
  label?: string
  attractedLabel?: string
}

interface Particle {
  id: number
  x: number
  y: number
  size: number
}

const pseudoRandom = (seed: number): number => {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

export default function MagnetizeButton({
  className,
  particleCount = 12,
  particleSpread = 180,
  label = "Hover me",
  attractedLabel = "Attracting",
  ...props
}: MagnetizeButtonProps) {
  const [isAttracting, setIsAttracting] = useState(false)
  const particlesControl = useAnimation()

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: particleCount }, (_, i) => {
      const angle = pseudoRandom(i + particleCount) * Math.PI * 2
      const distance = Math.sqrt(pseudoRandom(i + particleSpread)) * particleSpread

      return {
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        size: 1.5 + pseudoRandom(i + particleCount * 3) * 2.4,
      }
    })
  }, [particleCount, particleSpread])

  const handleInteractionStart = useCallback(async () => {
    setIsAttracting(true)
    await particlesControl.start({
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 40,
        damping: 12,
      },
    })
  }, [particlesControl])

  const handleInteractionEnd = useCallback(async () => {
    setIsAttracting(false)
    await particlesControl.start((i) => ({
      x: particles[i]?.x ?? 0,
      y: particles[i]?.y ?? 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 14,
      },
    }))
  }, [particles, particlesControl])

  return (
    <Button
      className={cn(
        "relative min-w-40 touch-none overflow-visible",
        "cursor-pointer transition-all duration-300",
        className
      )}
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      {...props}
    >
      {particles.map((p, index) => (
        <motion.div
          key={p.id}
          custom={index}
          initial={{ x: p.x, y: p.y }}
          animate={particlesControl}
          style={{ width: p.size, height: p.size }}
          className={cn(
            "absolute rounded-full pointer-events-none",
            "bg-hw-accent",
            "transition-opacity duration-500",
            isAttracting ? "opacity-90" : "opacity-30"
          )}
        />
      ))}
      <span className="relative z-10 flex w-full items-center justify-center">
        {isAttracting ? attractedLabel : label}
      </span>
    </Button>
  )
}



