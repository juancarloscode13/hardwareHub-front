import * as React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
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

export default function MagnetizeButton({
  className,
  particleCount = 12,
  particleSpread = 180,
  label = "Hover me",
  attractedLabel = "Attracting",
  ...props
}: MagnetizeButtonProps) {
  const [isAttracting, setIsAttracting] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const particlesControl = useAnimation()
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * particleSpread * 2,
      y: (Math.random() - 0.5) * particleSpread * 2,
      size: Math.random() * 3 + 1.5,
    }))
    particlesRef.current = newParticles
    setParticles(newParticles)
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
    const ref = particlesRef.current
    await particlesControl.start((i) => ({
      x: ref[i]?.x ?? 0,
      y: ref[i]?.y ?? 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 14,
      },
    }))
  }, [particlesControl])

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
