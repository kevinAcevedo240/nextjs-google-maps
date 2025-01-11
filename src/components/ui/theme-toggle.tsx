import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (!document.startViewTransition) switchTheme()
      document.startViewTransition(switchTheme);
  }
  
  const switchTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <Button variant="outline" onClick={toggleTheme} >
      {theme === "light" ? <Moon /> : <Sun />}
    </Button>
  )
}
