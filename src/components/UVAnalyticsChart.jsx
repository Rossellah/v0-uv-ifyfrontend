"use client";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useLanguage } from "../contexts/LanguageContext";
import { useState, useEffect } from "react";

export default function UVAnalyticsChart() {
  const { t } = useLanguage();
  const [historyData, setHistoryData] = useState([]);
  const [chartType, setChartType] = useState("line");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const fetchHistoryData = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ Prefer /analytics endpoint if available
      const response = await fetch("https://uvify-backend.onrender.com/analytics");
      const data = await response.json();

      // ✅ Ensure data is an array
      const records = Array.isArray(data) ? data : [data];

      // ✅ Format & clean
      const formattedData = records.map((item, index) => ({
        id: index,
        date: item.date || "N/A",
        time: item.time || "N/A",
        uvi: parseFloat(item.uvi) || 0,
        dateTime: item.date && item.time ? `${item.date} ${item.time}` : "Unknown",
        level: item.level || "",
      }));

      // ✅ Keep only last 20 records
      setHistoryData(formattedData.slice(-20));
    } catch (error) {
      console.error("Error fetching history for charts:", error);
      setError(t("analytics.errorFetching") || "Error fetching UV data");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Compute daily averages
  const getDailyAverages = () => {
    const dailyMap = {};
    historyData.forEach((item) => {
      if (!dailyMap[item.date]) {
        dailyMap[item.date] = { total: 0, count: 0, date: item.date };
      }
      dailyMap[item.date].total += item.uvi;
      dailyMap[item.date].count += 1;
    });
    return Object.values(dailyMap).map((day) => ({
      date: new Date(day.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      avgUVI: parseFloat((day.total / day.count).toFixed(2)),
    }));
  };

  // ✅ Short-term (hourly) data
  const getHourlyData = () =>
    historyData.slice(-10).map((item) => ({
      time: item.time?.substring(0, 5) || "N/A",
      uvi: item.uvi,
    }));

  // ✅ Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const record = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-orange-300 dark:border-orange-600 rounded-lg shadow-lg">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {record.date || record.time}
          </p>
          <p className="text-sm text-orange-600 dark:text-orange-400">
            UV Index: <span className="font-bold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // ✅ Loading & Error states
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        <p className="ml-3 text-gray-600 dark:text-gray-400">
          {t("analytics.loading") || "Loading analytics..."}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-300 dark:border-red-600">
        ⚠️ {error}
      </div>
    );
  }

  if (!historyData.length) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        {t("analytics.noData") || "No analytics data available yet."}
      </div>
    );
  }

  // ✅ Quick stats
  const highestUV = Math.max(...historyData.map((d) => d.uvi)).toFixed(1);
  const avgUV = (
    historyData.reduce((sum, d) => sum + d.uvi, 0) / historyData.length
  ).toFixed(1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-orange-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-orange-700 dark:text-orange-400">
            📊 {t("analytics.title") || "UV Analytics"}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t("analytics.subtitle") ||
              "Track UV radiation patterns and daily averages"}
          </p>
        </div>

        <div className="flex gap-2 mt-4 md:mt-0">
          {["line", "bar"].map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                chartType === type
                  ? "bg-orange-500 text-white"
                  : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50"
              }`}
            >
              {type === "line" ? "Line Chart" : "Bar Chart"}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="space-y-8">
        {chartType === "line" ? (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              {t("analytics.uvOverTime") || "UV Index Over Time"}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getHourlyData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="time" tick={{ fill: "#666" }} />
                <YAxis
                  tick={{ fill: "#666" }}
                  label={{
                    value: "UV Index",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#666",
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="uvi"
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={{ fill: "#f97316", r: 5 }}
                  activeDot={{ r: 8 }}
                  name="UV Index"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              {t("analytics.avgPerDay") || "Average UV Per Day"}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getDailyAverages()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="date" tick={{ fill: "#666" }} />
                <YAxis
                  tick={{ fill: "#666" }}
                  label={{
                    value: "Avg UV Index",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#666",
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="avgUVI"
                  fill="#f97316"
                  name="Average UV Index"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Highest UV</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {highestUV}
          </p>
        </div>
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Average UV</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {avgUV}
          </p>
        </div>
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Data Points</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {historyData.length}
          </p>
        </div>
      </div>
    </div>
  );
}
