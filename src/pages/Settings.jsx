"use client"

import { useState } from "react"
import { useLanguage } from "../contexts/LanguageContext"
import { useTheme } from "../contexts/ThemeContext"

export default function Settings() {
  const { t, language, changeLanguage } = useLanguage()
  const { isDarkMode, toggleTheme } = useTheme()
  const [alertsEnabled, setAlertsEnabled] = useState(true)

  const languages = [
    { code: "en", name: t("settings.english"), flag: "🇺🇸" },
    { code: "tl", name: t("settings.tagalog"), flag: "🇵🇭" },
    { code: "ilo", name: t("settings.ilocano"), flag: "🇵🇭" },
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-orange-700 dark:text-orange-400">⚙️ {t("settings.title")}</h1>

      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-orange-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-orange-100 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-orange-800 dark:text-orange-400">{t("settings.language")}</h2>
            <p className="text-orange-600 dark:text-orange-500 text-sm">{t("settings.selectLanguage")}</p>
          </div>
          <select
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="px-4 py-2 rounded-lg font-medium bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-orange-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-400 focus:outline-none transition-colors duration-200 cursor-pointer"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* 🌗 Theme Section */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-orange-100 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-orange-800 dark:text-orange-400">{t("settings.theme")}</h2>
            <p className="text-orange-600 dark:text-orange-500 text-sm">
              {isDarkMode ? t("settings.darkMode") : t("settings.lightMode")}
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              isDarkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
          >
            {isDarkMode ? "🌙 " + t("settings.darkMode") : "🌞 " + t("settings.lightMode")}
          </button>
        </div>

        {/* 🔔 Alert Settings */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-orange-100 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-orange-800 dark:text-orange-400">
              {t("settings.notifications")}
            </h2>
            <p className="text-orange-600 dark:text-orange-500 text-sm">{t("settings.alertDescription")}</p>
          </div>
          <button
            onClick={() => setAlertsEnabled(!alertsEnabled)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              alertsEnabled
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500"
            }`}
          >
            {alertsEnabled ? t("settings.on") : t("settings.off")}
          </button>
        </div>

        {/* Existing alert items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <span className="text-orange-700 dark:text-orange-400 font-medium">{t("settings.highUVWarning")}</span>
            <span className="text-green-600 dark:text-green-400 font-semibold">{t("settings.active")}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <span className="text-orange-700 dark:text-orange-400 font-medium">{t("settings.emailNotifications")}</span>
            <span className="text-green-600 dark:text-green-400 font-semibold">{t("settings.enabled")}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
