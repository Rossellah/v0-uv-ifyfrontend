import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';

export default function UVAnalyticsChart() {
  const { t } = useLanguage();
  const [historyData, setHistoryData] = useState([]);
  const [chartType, setChartType] = useState('line');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const fetchHistoryData = async () => {
    try {
      const response = await fetch("https://uvify-backend.onrender.com/history");
      const data = await response.json();
      
      const last7Days = data.slice(-20);
      const formattedData = last7Days.map(item => ({
        date: item.date,
        time: item.time,
        uvi: parseFloat(item.uvi) || 0,
        dateTime: `${item.date} ${item.time}`,
        level: item.level
      }));
      
      setHistoryData(formattedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching history for charts:", error);
      setLoading(false);
    }
  };

  const getDailyAverages = () => {
    const dailyMap = {};
    
    historyData.forEach(item => {
      if (!dailyMap[item.date]) {
        dailyMap[item.date] = { total: 0, count: 0, date: item.date };
      }
      dailyMap[item.date].total += item.uvi;
      dailyMap[item.date].count += 1;
    });

    return Object.values(dailyMap).map(day => ({
      date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      avgUVI: parseFloat((day.total / day.count).toFixed(2)),
    }));
  };

  const getHourlyData = () => {
    return historyData.slice(-10).map(item => ({
      time: item.time.substring(0, 5),
      uvi: item.uvi,
    }));
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-orange-300 dark:border-orange-600 rounded-lg shadow-lg">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {payload[0].payload.date || payload[0].payload.time}
          </p>
          <p className="text-sm text-orange-600 dark:text-orange-400">
            UV Index: <span className="font-bold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-orange-200 dark:border-gray-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-orange-700 dark:text-orange-400">📊 UV Analytics</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Track UV radiation patterns over time</p>
        </div>
        
        <div className="flex gap-2 mt-4 md:mt-0">
          <button
            onClick={() => setChartType('line')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              chartType === 'line'
                ? 'bg-orange-500 text-white'
                : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50'
            }`}
          >
            Line Chart
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              chartType === 'bar'
                ? 'bg-orange-500 text-white'
                : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50'
            }`}
          >
            Bar Chart
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {chartType === 'line' ? (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">UV Index Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getHourlyData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="time" 
                  stroke="#666"
                  tick={{ fill: '#666' }}
                />
                <YAxis 
                  stroke="#666"
                  tick={{ fill: '#666' }}
                  label={{ value: 'UV Index', angle: -90, position: 'insideLeft', fill: '#666' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="uvi" 
                  stroke="#f97316" 
                  strokeWidth={3}
                  dot={{ fill: '#f97316', r: 5 }}
                  activeDot={{ r: 8 }}
                  name="UV Index"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Average UV Per Day</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getDailyAverages()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#666"
                  tick={{ fill: '#666' }}
                />
                <YAxis 
                  stroke="#666"
                  tick={{ fill: '#666' }}
                  label={{ value: 'Avg UV Index', angle: -90, position: 'insideLeft', fill: '#666' }}
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
            {Math.max(...historyData.map(d => d.uvi)).toFixed(1)}
          </p>
        </div>
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Average UV</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {(historyData.reduce((sum, d) => sum + d.uvi, 0) / historyData.length || 0).toFixed(1)}
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
