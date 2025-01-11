
"use client"

import { useTheme } from "next-themes"
import { useEffect, useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  const switchTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light")
  }, [theme, setTheme])

  const toggleTheme = () => {
    const rootElement = document.documentElement;
    if (!document.startViewTransition) {
      rootElement.classList.add('theme-transition');
      switchTheme();
      setTimeout(() => {
        rootElement.classList.remove('theme-transition');
      }, 1000); // Duración de la animación en milisegundos
    } else {
      document.startViewTransition(switchTheme)
    }
  }

  useEffect(() => {
    if (theme) {
      setTheme(theme)
    } else {
      setTheme('light') 
    }
  }, [theme, setTheme])

  if (!mounted) {
    return null;
  }

  return (
    <Button variant={"outline"} onClick={toggleTheme} className="size-10 ">
      {theme === "light" ? <Moon /> : <Sun />}
    </Button>
  );
}