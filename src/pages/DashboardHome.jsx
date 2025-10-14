"use client"

import { useLanguage } from "../contexts/LanguageContext"
import { useUVData } from "../contexts/UVDataContext"

export default function DashboardHome() {
  const { t } = useLanguage()
  const { isConnected, getStats, lastUpdate } = useUVData()
  const stats = getStats()

  const quickStats = [
    {
      title: t("dashboard.todaysPeak"),
      value: stats.todaysPeak !== null ? stats.todaysPeak.toFixed(1) : "--",
      unit: "UV Index",
      icon: "📈",
      color: "from-orange-400 to-red-500",
      textColor: "text-orange-700 dark:text-orange-400",
    },
    {
      title: t("dashboard.currentReading"),
      value: stats.currentReading !== null ? stats.currentReading.toFixed(1) : "--",
      unit: "UV Index",
      icon: "☀️",
      color: "from-yellow-400 to-orange-500",
      textColor: "text-yellow-700 dark:text-yellow-400",
    },
    {
      title: t("dashboard.avgThisWeek"),
      value: stats.avgThisWeek !== null ? stats.avgThisWeek : "--",
      unit: "UV Index",
      icon: "📊",
      color: "from-blue-400 to-cyan-500",
      textColor: "text-blue-700 dark:text-blue-400",
    },
    {
      title: t("dashboard.totalReadings"),
      value: stats.totalReadings > 0 ? stats.totalReadings.toLocaleString() : "--",
      unit: t("dashboard.readings"),
      icon: "🔢",
      color: "from-purple-400 to-pink-500",
      textColor: "text-purple-700 dark:text-purple-400",
    },
  ]

  const uvAnalytics = [
    {
      range: "1-2",
      level: "Low",
      risk: "Minimal",
      burnTime: "60 minutes",
      color: "bg-green-500",
      borderColor: "border-green-500",
      bgLight: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-700 dark:text-green-400",
      recommendations: [
        "Use sunscreen of at least SPF 30",
        "Still take precautions when outdoors",
        "Minimal risk but protection recommended",
      ],
    },
    {
      range: "3-5",
      level: "Moderate",
      risk: "Moderate",
      burnTime: "45 minutes",
      color: "bg-yellow-500",
      borderColor: "border-yellow-500",
      bgLight: "bg-yellow-50 dark:bg-yellow-900/20",
      textColor: "text-yellow-700 dark:text-yellow-400",
      recommendations: [
        "Reapply sunscreen every two hours",
        "Wear sunglasses for eye protection",
        "Limit time outside between 10 AM - 4 PM",
      ],
    },
    {
      range: "6-7",
      level: "High",
      risk: "High",
      burnTime: "30 minutes",
      color: "bg-orange-500",
      borderColor: "border-orange-500",
      bgLight: "bg-orange-50 dark:bg-orange-900/20",
      textColor: "text-orange-700 dark:text-orange-400",
      recommendations: [
        "Wear sun-protective clothing (long sleeves, pants)",
        "Wear a hat with a wide brim",
        "Apply broad-spectrum sunscreen, reapply every 2 hours",
        "Seek shade during peak sun hours",
      ],
    },
    {
      range: "8-10",
      level: "Very High",
      risk: "Very High",
      burnTime: "15-25 minutes",
      color: "bg-red-500",
      borderColor: "border-red-500",
      bgLight: "bg-red-50 dark:bg-red-900/20",
      textColor: "text-red-700 dark:text-red-400",
      recommendations: [
        "Use sunscreen of at least SPF 50",
        "Limit time outdoors as much as possible",
        "Wear sun-protective clothing covering arms and legs",
        "Seek shade, especially 10 AM - 4 PM",
      ],
    },
    {
      range: "11+",
      level: "Extreme",
      risk: "Extreme",
      burnTime: "< 10 minutes",
      color: "bg-purple-500",
      borderColor: "border-purple-500",
      bgLight: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-700 dark:text-purple-400",
      recommendations: [
        "Avoid direct sunlight as much as possible",
        "Apply SPF 50+ sunscreen frequently",
        "Wear clothing covering arms and legs",
        "High risk of skin cancer with chronic exposure",
      ],
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-orange-700 dark:text-orange-400">
            {t("dashboard.welcome")}
          </h1>
          <p className="text-orange-600 dark:text-orange-500 mt-1">{t("dashboard.monitorUVLevels")}</p>
          {lastUpdate && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              isConnected
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-yellow-500"}`}
            ></div>
            <span className="text-sm font-medium">
              {isConnected ? t("dashboard.connected") : t("dashboard.waitingForDevice")}
            </span>
          </div>
        </div>
      </div>

      {/* Connection Alert */}
      {!isConnected && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 rounded-lg">
          <div className="flex items-start">
            <span className="text-2xl mr-3">⚠️</span>
            <div>
              <h3 className="text-yellow-800 dark:text-yellow-400 font-semibold">
                {t("dashboard.deviceNotConnected")}
              </h3>
              <p className="text-yellow-700 dark:text-yellow-500 text-sm mt-1">{t("dashboard.connectDeviceMessage")}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-orange-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">{stat.icon}</span>
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${stat.color} opacity-20`}></div>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{stat.title}</h3>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</span>
              <span className="text-gray-500 dark:text-gray-500 text-sm">{stat.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-orange-700 dark:text-orange-400 mb-4 flex items-center gap-2">
          <span>📊</span>
          {t("dashboard.uvAnalytics") || "UV Index Analytics"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {uvAnalytics.map((item, index) => (
            <div
              key={index}
              className={`${item.bgLight} rounded-xl p-5 border-2 ${item.borderColor} shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className={`text-xl font-bold ${item.textColor}`}>{item.level}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    UV Index: <span className="font-semibold">{item.range}</span>
                  </p>
                </div>
                <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center shadow-md`}>
                  <span className="text-white text-xl font-bold">{item.range.split("-")[0]}</span>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Risk Level:</span>
                  <span className={`text-sm font-bold ${item.textColor}`}>{item.risk}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Burn Time:</span>
                  <span className={`text-sm font-bold ${item.textColor}`}>{item.burnTime}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Recommendations:</p>
                <ul className="space-y-1">
                  {item.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* UV Safety Tips */}
      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
        <h2 className="text-2xl font-bold text-orange-700 dark:text-orange-400 mb-4 flex items-center gap-2">
          <span>💡</span>
          {t("dashboard.uvSafetyTips")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🧴</span>
            <div>
              <h3 className="font-semibold text-orange-800 dark:text-orange-400">{t("dashboard.useSunscreen")}</h3>
              <p className="text-orange-700 dark:text-orange-500 text-sm">{t("dashboard.sunscreenTip")}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🕶️</span>
            <div>
              <h3 className="font-semibold text-orange-800 dark:text-orange-400">{t("dashboard.wearProtection")}</h3>
              <p className="text-orange-700 dark:text-orange-500 text-sm">{t("dashboard.protectionTip")}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">⏰</span>
            <div>
              <h3 className="font-semibold text-orange-800 dark:text-orange-400">{t("dashboard.avoidPeakHours")}</h3>
              <p className="text-orange-700 dark:text-orange-500 text-sm">{t("dashboard.peakHoursTip")}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🌳</span>
            <div>
              <h3 className="font-semibold text-orange-800 dark:text-orange-400">{t("dashboard.seekShade")}</h3>
              <p className="text-orange-700 dark:text-orange-500 text-sm">{t("dashboard.shadeTip")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
