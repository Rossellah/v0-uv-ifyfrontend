"use client"

import { createContext, useState, useEffect, useContext } from "react"

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

const getCookie = (name) => {
  if (typeof document === "undefined") return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(";").shift()
  return null
}

const setCookie = (name, value, days = 365) => {
  if (typeof document === "undefined") return
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
}

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = getCookie("uvify_theme")
    if (savedTheme === "dark") {
      setIsDarkMode(true)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    console.log("[v0] Theme changed to:", isDarkMode ? "dark" : "light")
    setCookie("uvify_theme", isDarkMode ? "dark" : "light")

    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode, mounted])

  const toggleTheme = () => {
    console.log("[v0] Toggle theme called, current:", isDarkMode)
    setIsDarkMode((prev) => !prev)
  }

  const value = {
    isDarkMode,
    toggleTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
