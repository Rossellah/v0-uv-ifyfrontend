"use client"

import { useUVData } from "../contexts/UVDataContext"
import { useLanguage } from "../contexts/LanguageContext"

export default function UVAccumulationAnalytics() {
  const { getStats } = useUVData()
  const { t } = useLanguage()

  const calculateAccumulation = () => {
    const stats = getStats()
    const now = new Date()
    const todayStr = now.toISOString().split("T")[0]

    // Get last 7 days
    const lastWeek = new Date(now)
    lastWeek.setDate(now.getDate() - 7)

    // Get last 30 days
    const lastMonth = new Date(now)
    lastMonth.setDate(now.getDate() - 30)

    // Calculate accumulated UV for today
    const todayAccumulated = stats.todaysReadings.reduce((sum, item) => sum + Number.parseFloat(item.uvi || 0), 0)

    // Calculate accumulated UV for week
    const weekAccumulated = stats.weekReadings.reduce((sum, item) => sum + Number.parseFloat(item.uvi || 0), 0)

    // Calculate accumulated UV for month
    const monthReadings =
      stats.history?.filter((item) => {
        const itemDate = new Date(item.date)
        return itemDate >= lastMonth && itemDate <= now
      }) || []

    const monthAccumulated = monthReadings.reduce((sum, item) => sum + Number.parseFloat(item.uvi || 0), 0)

    return {
      todayAccumulated: todayAccumulated.toFixed(1),
      weekAccumulated: weekAccumulated.toFixed(1),
      monthAccumulated: monthAccumulated.toFixed(1),
      todayReadings: stats.todaysReadings.length,
      weekReadings: stats.weekReadings.length,
      monthReadings: monthReadings.length,
    }
  }

  const accumulation = calculateAccumulation()

  // Helper function to get risk level based on accumulated UV
  const getAccumulationLevel = (accumulated) => {
    const value = Number.parseFloat(accumulated)
    if (value <= 10) return { level: "Low", color: "green", icon: "✅" }
    if (value <= 30) return { level: "Moderate", color: "yellow", icon: "⚠️" }
    if (value <= 60) return { level: "High", color: "orange", icon: "⚠️" }
    return { level: "Very High", color: "red", icon: "🚨" }
  }

  const todayLevel = getAccumulationLevel(accumulation.todayAccumulated)
  const weekLevel = getAccumulationLevel(accumulation.weekAccumulated)
  const monthLevel = getAccumulationLevel(accumulation.monthAccumulated)

  const getColorClasses = (color) => {
    const colors = {
      green:
        "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-700 dark:text-green-400",
      yellow:
        "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700 text-yellow-700 dark:text-yellow-400",
      orange:
        "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-400",
      red: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-700 dark:text-red-400",
    }
    return colors[color] || colors.green
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-orange-200 dark:border-gray-700 mt-6">
      <h2 className="text-xl font-semibold mb-6 text-orange-700 dark:text-orange-400">
        📈 {t("analytics.uvAccumulation") || "UV Accumulation Analytics"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Today's Accumulation */}
        <div className={`p-4 rounded-lg border-2 ${getColorClasses(todayLevel.color)}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">{todayLevel.icon} Today</h3>
            <span className="text-xs font-medium px-2 py-1 bg-white dark:bg-gray-700 rounded">
              {accumulation.todayReadings} readings
            </span>
          </div>
          <p className="text-3xl font-bold mb-1">{accumulation.todayAccumulated}</p>
          <p className="text-xs opacity-75">Accumulated UV Index</p>
          <p className="text-xs mt-2 font-medium">{todayLevel.level} Exposure</p>
        </div>

        {/* Week's Accumulation */}
        <div className={`p-4 rounded-lg border-2 ${getColorClasses(weekLevel.color)}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">{weekLevel.icon} This Week</h3>
            <span className="text-xs font-medium px-2 py-1 bg-white dark:bg-gray-700 rounded">
              {accumulation.weekReadings} readings
            </span>
          </div>
          <p className="text-3xl font-bold mb-1">{accumulation.weekAccumulated}</p>
          <p className="text-xs opacity-75">Accumulated UV Index</p>
          <p className="text-xs mt-2 font-medium">{weekLevel.level} Exposure</p>
        </div>

        {/* Month's Accumulation */}
        <div className={`p-4 rounded-lg border-2 ${getColorClasses(monthLevel.color)}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">{monthLevel.icon} This Month</h3>
            <span className="text-xs font-medium px-2 py-1 bg-white dark:bg-gray-700 rounded">
              {accumulation.monthReadings} readings
            </span>
          </div>
          <p className="text-3xl font-bold mb-1">{accumulation.monthAccumulated}</p>
          <p className="text-xs opacity-75">Accumulated UV Index</p>
          <p className="text-xs mt-2 font-medium">{monthLevel.level} Exposure</p>
        </div>
      </div>

      {/* Information Box */}
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <span className="font-semibold">💡 Tip:</span> Accumulated UV Index shows the total UV exposure over time.
          Higher values indicate greater cumulative sun exposure and increased risk of skin damage.
        </p>
      </div>
    </div>
  )
}
