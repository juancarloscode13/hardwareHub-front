import * as React from "react"
import { Eye, EyeOff } from "lucide-react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

function PasswordInput({ className, ...props }: Omit<React.ComponentProps<typeof Input>, "type">) {
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <div className="relative w-full">
      <Input
        {...props}
        type={showPassword ? "text" : "password"}
        className={cn(className, "hw-password-input")}
      />
      <button
        type="button"
        aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
        onClick={() => setShowPassword((prev) => !prev)}
        className="hw-password-toggle text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <span className="inline-flex items-center justify-center">
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </span>
      </button>
    </div>
  )
}

export { PasswordInput }
