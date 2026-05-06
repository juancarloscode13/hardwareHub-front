// Componente skeleton: encapsula logica y presentacion de UI reutilizable.
// Nota: este archivo se documenta con comentarios cortos centrados en decisiones no obvias.
import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }



