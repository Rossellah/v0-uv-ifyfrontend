"use client"

// src/pages/Latest.jsx
import { useEffect, useState } from "react"
import UVGauge from "../components/UVGauge"
import UVAnalyticsChart from "../components/UVAnalyticsChart"
import { useLanguage } from "../contexts/LanguageContext"
import { getUVInfo } from "../utils/uvInfo"

export default function Latest() {
  const { t } = useLanguage()
  const [latest, setLatest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isConnected, setIsConnected] = useState(true)

  // 🌞 Added: States for popup and alert sound
  const [showReminder, setShowReminder] = useState(false)
  const [hasPlayedAlert, setHasPlayedAlert] = useState(false)

  const fetchLatestData = async () => {
    try {
      setError(null)
      const response = await fetch("https://uvify-backend-4sjy.onrender.com/latest")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()

      if (data.message === "No data yet") {
        setLatest(null)
        setIsConnected(false)
      } else {
        setLatest(data)
        setIsConnected(true)
      }
      setLastUpdated(new Date())
    } catch (err) {
      console.error("Error fetching latest data:", err)
      setError(t("latest.errorFetching"))
      setIsConnected(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLatestData()
    const interval = setInterval(fetchLatestData, 5000)
    return () => clearInterval(interval)
  }, [])

  // Safe UV value parsing
  const getSafeUVValue = () => {
    if (!latest || !latest.uvi) return 0
    const uvValue = Number.parseFloat(latest.uvi)
    return isNaN(uvValue) ? 0 : Math.max(0, uvValue)
  }

  // Get UV level description
  const getUVLevel = (uvi) => {
    if (uvi <= 2)
      return {
        level: t("latest.low"),
        color: "green",
        bgColor: "bg-green-50 dark:bg-green-900/20",
        textColor: "text-green-600 dark:text-green-400",
        borderColor: "border-green-600 dark:border-green-500",
      }
    if (uvi <= 5)
      return {
        level: t("latest.moderate"),
        color: "yellow",
        bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
        textColor: "text-yellow-600 dark:text-yellow-400",
        borderColor: "border-yellow-600 dark:border-yellow-500",
      }
    if (uvi <= 7)
      return {
        level: t("latest.high"),
        color: "orange",
        bgColor: "bg-orange-50 dark:bg-orange-900/20",
        textColor: "text-orange-600 dark:text-orange-400",
        borderColor: "border-orange-600 dark:border-orange-500",
      }
    if (uvi <= 10)
      return {
        level: t("latest.veryHigh"),
        color: "red",
        bgColor: "bg-red-50 dark:bg-red-900/20",
        textColor: "text-red-600 dark:text-red-400",
        borderColor: "border-red-600 dark:border-red-500",
      }
    return {
      level: t("latest.extreme"),
      color: "purple",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400",
      borderColor: "border-purple-600 dark:border-purple-500",
    }
  }

  const uvValue = getSafeUVValue()
  const uvLevelInfo = getUVLevel(uvValue)
  const detailedUVInfo = getUVInfo(uvValue)

  // 🌞 Added: Trigger popup and sound when UV index is high or above
  useEffect(() => {
    if (latest && Number.parseFloat(latest.uvi) >= 6) {
      setShowReminder(true)
      if (!hasPlayedAlert) {
        const alertSound = new Audio("/alert.mp3")
        alertSound.play().catch((err) => console.warn("Audio play blocked:", err))
        setHasPlayedAlert(true)
      }
    } else {
      setShowReminder(false)
      setHasPlayedAlert(false)
    }
  }, [latest])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">{t("latest.loadingUVData")}</p>
      </div>
    )
  }

  if (error && !latest) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg max-w-md">
          <strong className="font-bold">{t("common.error")}: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <button
          onClick={fetchLatestData}
          className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {t("common.retry")}
        </button>
      </div>
    )
  }

  if (!latest) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-orange-800 dark:text-orange-400">
          🌞 {t("latest.title")}
        </h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4">{t("latest.subtitle")}</p>

        {/* Connectivity Status Banner */}
        <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-400 dark:border-yellow-600 text-yellow-700 dark:text-yellow-400 px-4 py-3 rounded-lg mb-6 max-w-md w-full text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse mr-2"></div>
            <span className="font-semibold">⚠️ {t("latest.uviNotConnected") || "UVI Device Not Connected"}</span>
          </div>
          <p className="text-sm">{t("latest.waitingForReadings") || "Waiting for readings..."}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-4xl w-full">
          {/* UV Gauge - showing 0 */}
          <div className="flex justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-orange-200 dark:border-gray-700 transition-colors duration-300 opacity-50">
              <UVGauge value={0} size={220} />
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                {t("latest.noDataAvailable") || "No data available"}
              </p>
            </div>
          </div>

          {/* Latest Data Details - placeholder */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-orange-200 dark:border-gray-700 opacity-50">
            <h2 className="text-xl font-semibold mb-4 text-orange-700 dark:text-orange-400">
              📊 {t("latest.readingDetails")}
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <span className="font-medium text-gray-700 dark:text-gray-300">📅 {t("latest.date")}:</span>
                <span className="font-semibold text-gray-400 dark:text-gray-500">--/--/----</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <span className="font-medium text-gray-700 dark:text-gray-300">⏰ {t("latest.time")}:</span>
                <span className="font-semibold text-gray-400 dark:text-gray-500">--:--:--</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <span className="font-medium text-gray-700 dark:text-gray-300">📈 {t("latest.uvIndex")}:</span>
                <span className="font-semibold text-lg text-gray-400 dark:text-gray-500">--</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="font-medium text-gray-700 dark:text-gray-300">⚠️ {t("latest.level")}:</span>
                <span className="font-semibold text-gray-400 dark:text-gray-500">--</span>
              </div>
            </div>

            {/* Last Updated */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                {t("latest.waitingForFirstReading") || "Waiting for first reading..."}
              </p>
              <div className="flex items-center justify-center mt-2">
                <div className="w-2 h-2 rounded-full animate-pulse mr-2 bg-yellow-500"></div>
                <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                  {t("latest.deviceDisconnected") || "Device disconnected"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* UV Index Scale Reference */}
        <div className="mt-8 bg-gradient-to-r from-green-50 via-yellow-50 to-red-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 max-w-4xl w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">📏 {t("latest.uvIndexScale")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs">
            <div className="text-center p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <div className="font-bold text-green-700 dark:text-green-400">0-2</div>
              <div className="text-green-600 dark:text-green-500">{t("latest.low")}</div>
            </div>
            <div className="text-center p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <div className="font-bold text-yellow-700 dark:text-yellow-400">3-5</div>
              <div className="text-yellow-600 dark:text-yellow-500">{t("latest.moderate")}</div>
            </div>
            <div className="text-center p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <div className="font-bold text-orange-700 dark:text-orange-400">6-7</div>
              <div className="text-orange-600 dark:text-orange-500">{t("latest.high")}</div>
            </div>
            <div className="text-center p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <div className="font-bold text-red-700 dark:text-red-400">8-10</div>
              <div className="text-red-600 dark:text-red-500">{t("latest.veryHigh")}</div>
            </div>
            <div className="text-center p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <div className="font-bold text-purple-700 dark:text-purple-400">11+</div>
              <div className="text-purple-600 dark:text-purple-500">{t("latest.extreme")}</div>
            </div>
          </div>
        </div>

        {/* Safety Information */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl p-6 max-w-4xl w-full">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-400 mb-3">
            🛡️ {t("latest.uvProtectionGuide")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
            <div className="flex items-start">
              <span className="text-lg mr-2">☀️</span>
              <span>{t("latest.wearSunscreen")}</span>
            </div>
            <div className="flex items-start">
              <span className="text-lg mr-2">👒</span>
              <span>{t("latest.wearHat")}</span>
            </div>
            <div className="flex items-start">
              <span className="text-lg mr-2">🕶️</span>
              <span>{t("latest.wearSunglasses")}</span>
            </div>
            <div className="flex items-start">
              <span className="text-lg mr-2">⏰</span>
              <span>{t("latest.avoidPeakHours")}</span>
            </div>
            <div className="flex items-start">
              <span className="text-lg mr-2">🌳</span>
              <span>{t("latest.seekShade")}</span>
            </div>
            <div className="flex items-start">
              <span className="text-lg mr-2">👕</span>
              <span>{t("latest.wearProtectiveClothing")}</span>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-6">
          <button
            onClick={fetchLatestData}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
          >
            <span className="mr-2">🔄</span>
            {t("common.refresh")}
          </button>
        </div>

        {/* UV Analytics Chart */}
        <div className="mt-8 w-full max-w-4xl opacity-50">
          <UVAnalyticsChart />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 text-orange-800 dark:text-orange-400">
        🌞 {t("latest.title")}
      </h1>
      <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4">{t("latest.subtitle")}</p>

      {/* Connectivity Status Banner */}
      {!isConnected && latest && (
        <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-400 dark:border-yellow-600 text-yellow-700 dark:text-yellow-400 px-4 py-2 rounded-lg mb-6 max-w-md w-full text-center">
          ⚠️ {t("latest.espDisconnected")}
        </div>
      )}

      {isConnected && latest && (
        <div className="bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-400 px-4 py-2 rounded-lg mb-6 max-w-md w-full text-center">
          ✅ {t("latest.espConnected")}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-4xl w-full">
        {/* UV Gauge */}
        <div className="flex justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-orange-200 dark:border-gray-700 transition-colors duration-300">
            <UVGauge value={uvValue} size={220} />
          </div>
        </div>

        {/* Latest Data Details */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-orange-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-orange-700 dark:text-orange-400">
            📊 {t("latest.readingDetails")}
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <span className="font-medium text-gray-700 dark:text-gray-300">📅 {t("latest.date")}:</span>
              <span className="font-semibold dark:text-gray-200">{latest.date || "N/A"}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <span className="font-medium text-gray-700 dark:text-gray-300">⏰ {t("latest.time")}:</span>
              <span className="font-semibold dark:text-gray-200">{latest.time || "N/A"}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <span className="font-medium text-gray-700 dark:text-gray-300">📈 {t("latest.uvIndex")}:</span>
              <span className="font-semibold text-lg dark:text-gray-200">{latest.uvi}</span>
            </div>

            <div className={`flex items-center justify-between p-3 rounded-lg ${uvLevelInfo.bgColor}`}>
              <span className="font-medium text-gray-700 dark:text-gray-300">⚠️ {t("latest.level")}:</span>
              <span className={`font-semibold ${uvLevelInfo.textColor}`}>{uvLevelInfo.level}</span>
            </div>
          </div>

          {/* Last Updated */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              {t("latest.lastUpdated")}: {lastUpdated.toLocaleTimeString()}
            </p>
            <div className="flex items-center justify-center mt-2">
              <div
                className={`w-2 h-2 rounded-full animate-pulse mr-2 ${isConnected ? "bg-green-500" : "bg-yellow-500"}`}
              ></div>
              <span
                className={`text-xs font-medium ${
                  isConnected ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"
                }`}
              >
                {isConnected ? t("latest.liveUpdating") : t("latest.showingCachedData")}
              </span>
            </div>
          </div>
        </div>

        {latest && (
          <div className="mt-6 w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-lg border border-orange-200 dark:border-gray-700">
            <h3 className="text-lg md:text-xl font-semibold text-orange-700 dark:text-orange-400 mb-4">
              📋 {t("latest.detailedAnalysis") || "Detailed UV Analysis"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Risk Level Card */}
              <div className={`p-4 rounded-lg ${detailedUVInfo.bgColor} border-l-4 ${detailedUVInfo.borderColor}`}>
                <h4 className="font-semibold text-sm mb-2 dark:text-gray-200">⚠️ Risk Level</h4>
                <p className={`text-2xl font-bold ${detailedUVInfo.textColor}`}>{detailedUVInfo.level}</p>
                <p className="text-sm mt-2 dark:text-gray-300">{detailedUVInfo.risk}</p>
              </div>

              {/* Burn Time Card */}
              <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500">
                <h4 className="font-semibold text-sm mb-2 dark:text-gray-200">⏱️ Burn Time</h4>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{detailedUVInfo.burnTime}</p>
                <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">Time to skin damage without protection</p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <h4 className="font-semibold text-sm mb-3 text-blue-800 dark:text-blue-400">🛡️ Safety Recommendations</h4>
              <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                {detailedUVInfo.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* UV Index Scale Reference */}
      <div className="mt-8 bg-gradient-to-r from-green-50 via-yellow-50 to-red-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 max-w-4xl w-full">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">📏 {t("latest.uvIndexScale")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs">
          <div className="text-center p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <div className="font-bold text-green-700 dark:text-green-400">0-2</div>
            <div className="text-green-600 dark:text-green-500">{t("latest.low")}</div>
          </div>
          <div className="text-center p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
            <div className="font-bold text-yellow-700 dark:text-yellow-400">3-5</div>
            <div className="text-yellow-600 dark:text-yellow-500">{t("latest.moderate")}</div>
          </div>
          <div className="text-center p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
            <div className="font-bold text-orange-700 dark:text-orange-400">6-7</div>
            <div className="text-orange-600 dark:text-orange-500">{t("latest.high")}</div>
          </div>
          <div className="text-center p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <div className="font-bold text-red-700 dark:text-red-400">8-10</div>
            <div className="text-red-600 dark:text-red-500">{t("latest.veryHigh")}</div>
          </div>
          <div className="text-center p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <div className="font-bold text-purple-700 dark:text-purple-400">11+</div>
            <div className="text-purple-600 dark:text-purple-500">{t("latest.extreme")}</div>
          </div>
        </div>
      </div>

      {/* Safety Information */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl p-6 max-w-4xl w-full">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-400 mb-3">
          🛡️ {t("latest.uvProtectionGuide")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
          <div className="flex items-start">
            <span className="text-lg mr-2">☀️</span>
            <span>{t("latest.wearSunscreen")}</span>
          </div>
          <div className="flex items-start">
            <span className="text-lg mr-2">👒</span>
            <span>{t("latest.wearHat")}</span>
          </div>
          <div className="flex items-start">
            <span className="text-lg mr-2">🕶️</span>
            <span>{t("latest.wearSunglasses")}</span>
          </div>
          <div className="flex items-start">
            <span className="text-lg mr-2">⏰</span>
            <span>{t("latest.avoidPeakHours")}</span>
          </div>
          <div className="flex items-start">
            <span className="text-lg mr-2">🌳</span>
            <span>{t("latest.seekShade")}</span>
          </div>
          <div className="flex items-start">
            <span className="text-lg mr-2">👕</span>
            <span>{t("latest.wearProtectiveClothing")}</span>
          </div>
        </div>

        {/* Current UV Level Specific Advice */}
        <div className={`mt-4 p-3 rounded-lg ${uvLevelInfo.bgColor} border-l-4 ${uvLevelInfo.borderColor}`}>
          <h4 className="font-semibold mb-1 dark:text-gray-200">{t("latest.currentRecommendation")}</h4>
          <p className="text-sm dark:text-gray-300">
            {uvValue <= 2
              ? t("latest.lowAdvice")
              : uvValue <= 5
                ? t("latest.moderateAdvice")
                : uvValue <= 7
                  ? t("latest.highAdvice")
                  : uvValue <= 10
                    ? t("latest.veryHighAdvice")
                    : t("latest.extremeAdvice")}
          </p>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="mt-6">
        <button
          onClick={fetchLatestData}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
        >
          <span className="mr-2">🔄</span>
          {t("common.refresh")}
        </button>
      </div>

      {/* UV Analytics Chart */}
      <div className="mt-8 w-full max-w-4xl">
        <UVAnalyticsChart />
      </div>

      {/* 🌞 Added: Popup Reminder with Fade Animation */}
      {showReminder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl border border-orange-300 dark:border-orange-600 text-center max-w-sm w-full transform transition-all scale-100 hover:scale-105">
            <h3 className="text-xl font-bold text-orange-700 dark:text-orange-400 mb-2 animate-bounce">
              ⚠️ {t("latest.highUVAlert")}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t("latest.uvIndexCurrently")} <strong>{latest.uvi}</strong> — {uvLevelInfo.level}.
              <br />
              {t("latest.protectYourself")}
            </p>
            <button
              onClick={() => setShowReminder(false)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition"
            >
              {t("latest.gotIt")}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
