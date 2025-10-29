"use client"

import { useEffect, useState } from "react"
import { useUVData } from "../contexts/UVDataContext"
import { useLanguage } from "../contexts/LanguageContext"

export default function UVNotification() {
  const { getStats } = useUVData()
  const { t } = useLanguage()
  const [showNotification, setShowNotification] = useState(false)
  const [hasVibrated, setHasVibrated] = useState(false)
  const [hasPlayedSound, setHasPlayedSound] = useState(false) // Added sound state

  useEffect(() => {
    const stats = getStats()
    const currentUV = stats.currentReading

    if (currentUV !== null && currentUV >= 6) {
      setShowNotification(true)

      if (!hasPlayedSound) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        // Create a warning beep sound: 800Hz for 200ms
        oscillator.frequency.value = 800
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.2)

        setHasPlayedSound(true)
      }

      if (!hasVibrated && "vibrate" in navigator) {
        navigator.vibrate([200, 100, 200]) // Vibrate pattern: 200ms, pause 100ms, 200ms
        setHasVibrated(true)
      }
    } else {
      setShowNotification(false)
      setHasVibrated(false)
      setHasPlayedSound(false)
    }
  }, [getStats, hasVibrated, hasPlayedSound])

  if (!showNotification) return null

  const stats = getStats()
  const currentUV = stats.currentReading

  const getUVLevel = (uvi) => {
    if (uvi >= 11) return { level: "Extreme", color: "bg-purple-500", textColor: "text-purple-700" }
    if (uvi >= 8) return { level: "Very High", color: "bg-red-500", textColor: "text-red-700" }
    if (uvi >= 6) return { level: "High", color: "bg-orange-500", textColor: "text-orange-700" }
    return { level: "Moderate", color: "bg-yellow-500", textColor: "text-yellow-700" }
  }

  const uvInfo = getUVLevel(currentUV)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="w-11/12 max-w-md pointer-events-auto animate-bounce">
        <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-500 dark:border-red-600 rounded-xl shadow-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className={`w-12 h-12 ${uvInfo.color} rounded-full flex items-center justify-center animate-pulse`}>
                <span className="text-2xl">⚠️</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-red-800 dark:text-red-400 font-bold text-lg">
                {t("notification.highUVAlert") || "High UV Alert!"}
              </h3>
              <p className="text-red-700 dark:text-red-500 text-sm mt-1">
                {t("notification.currentUV") || "Current UV Index"}:{" "}
                <span className="font-bold">{currentUV.toFixed(1)}</span> ({uvInfo.level})
              </p>
              <p className="text-red-600 dark:text-red-400 text-xs mt-2">
                {t("notification.protectionAdvice") || "Wear sunscreen, protective clothing, and seek shade!"}
              </p>
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="flex-shrink-0 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
