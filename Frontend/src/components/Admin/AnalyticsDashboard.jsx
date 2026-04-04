import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState({
    players: 0,
    tournaments: 0,
    results: 0,
    certificates: 0,
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // 🔥 Replace this with your backend API
    const fetchData = async () => {
      const data = {
        players: 120,
        tournaments: 15,
        results: 300,
        certificates: 95,
      };

      setStats(data);

      setChartData([
        { name: "Players", value: data.players },
        { name: "Tournaments", value: data.tournaments },
        { name: "Results", value: data.results },
        { name: "Certificates", value: data.certificates },
      ]);
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* 🔢 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="bg-white rounded-2xl shadow p-4">
            <h2 className="text-lg font-semibold capitalize">{key}</h2>
            <p className="text-2xl font-bold mt-2">{value}</p>
          </div>
        ))}
      </div>

      {/* 📊 Bar Chart */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🥧 Pie Chart */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;