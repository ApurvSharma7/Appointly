import { useCallback, useRef, useContext } from "react"
import { flushSync } from "react-dom"
import { Moon, Sun } from "lucide-react"
import { AppContext } from "@/context/AppContext"
import { cn } from "@/lib/utils"

export const AnimatedThemeToggler = ({
  className,
  duration = 550,
  ...props
}) => {
  const { theme, setTheme } = useContext(AppContext)
  const isNight = theme === 'night'
  const buttonRef = useRef(null)

  const toggleWithAnimation = useCallback(() => {
    const button = buttonRef.current
    if (!button) return

    const { top, left, width, height } = button.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    const newTheme = theme === "day" ? "night" : "day"

    // ── No view-transition support ─────────────────────────────────────────
    if (!document.startViewTransition) {
      document.documentElement.className = newTheme
      localStorage.setItem("theme", newTheme)
      flushSync(() => setTheme(newTheme))
      return
    }

    // ── startViewTransition ────────────────────────────────────────────────
    // On hero page:  images are CSS-class driven → instant, no React cost
    // On other pages: React components use `isNight` Tailwind classes →
    //   MUST flushSync so the "after" snapshot has the correct classes.
    //   We also set the className directly because useEffect fires async.
    const transition = document.startViewTransition(() => {
      flushSync(() => setTheme(newTheme))
      document.documentElement.className = newTheme
      localStorage.setItem("theme", newTheme)
    })

    // Expanding circle ripple — aggressive spring easing so the
    // ripple front-loads its expansion, masking the React re-render cost.
    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${maxRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration,
            // Fast initial burst → smooth settle: hides any re-render jank
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        )
      })
      .catch(() => {})

  }, [theme, duration, setTheme])

  return (
    <button
      type="button"
      ref={buttonRef}
      onClick={toggleWithAnimation}
      className={cn(
        "rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] p-2.5 text-[var(--text-main)] hover:bg-[var(--bg-primary)] shadow-sm transition-all active:scale-95 flex items-center justify-center",
        className
      )}
      title={isNight ? 'Switch to Day' : 'Switch to Night'}
      {...props}
    >
      {isNight
        ? <Sun className="w-4 h-4 fill-current" />
        : <Moon className="w-4 h-4 fill-current" />
      }
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
