"use client"

// src/pages/Latest.jsx
import { useEffect, useState } from "react"
import UVGauge from "../components/UVGauge"
import UVAnalyticsChart from "../components/UVAnalyticsChart"
import UVAccumulationAnalytics from "../components/UVAccumulationAnalytics"
import { useLanguage } from "../contexts/LanguageContext"

export default function Latest() {
  const { t } = useLanguage()
  const [latest, setLatest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isConnected, setIsConnected] = useState(true)

  const fetchLatestData = async () => {
    try {
      setError(null)
      const response = await fetch("https://uvify-backend.onrender.com/latest")
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

  const getSafeUVValue = () => {
    if (!latest || !latest.uvi) return 0
    const uvValue = Number.parseFloat(latest.uvi)
    return isNaN(uvValue) ? 0 : Math.max(0, uvValue)
  }

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
      </div>

      {/* UV Analytics Chart */}
      <div className="mt-8 w-full max-w-4xl">
        <UVAnalyticsChart />
      </div>

      {/* UV Accumulation Analytics */}
      <div className="mt-8 w-full max-w-4xl">
        <UVAccumulationAnalytics />
      </div>
    </div>
  )
}
