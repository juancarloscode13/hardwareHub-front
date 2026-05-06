// Hook personalizado que detecta si la ventana tiene ancho de móvil
import * as React from "react"

// Punto de corte en px para considerar vista móvil
const MOBILE_BREAKPOINT = 768

/** Devuelve true si el ancho de la ventana es menor que 768 px */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT) // valor inicial
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
