import { useEffect, useState } from "react";
import storageHelpers from "../lib/storage";

import { Card, CardContent } from "../components/Card";
import { Activity, Moon, Smile, Download } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import jsPDF from "jspdf";        
import autoTable from "jspdf-autotable";  

export default function Dashboard() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const loadEntries = () => {
      const data = storageHelpers.getEntries();
      setEntries(data);
    };
    loadEntries();
    const interval = setInterval(loadEntries, 1000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Helper function for clean date
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return "'" + d.toISOString().split("T")[0]; 
  };

  // ✅ CSV Export function
  const handleExportCSV = () => {
    const headers = ["Date", "Steps", "Sleep Hours", "Mood", "Notes"];
    const rows = entries.map((entry) => [
      `"${formatDate(entry.date)}"`,
      `"${entry.steps}"`,
      `"${entry.sleepHours}"`,
      `"${entry.mood}"`,
      `"${entry.notes || ""}"`,
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", `wellness-data-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // ✅ PDF Export
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Wellness Tracker Data", 14, 16);

    const tableColumn = ["Date", "Steps", "Sleep Hours", "Mood", "Notes"];
    const tableRows = entries.map((entry) => [
      entry.date,
      entry.steps,
      entry.sleepHours,
      entry.mood,
      entry.notes || "",
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
    });

    doc.save(`wellness-data-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  // 👇 Mood mapping add karein (string -> number)
  const moodScale = {
    happy: 10,
    good: 8,
    neutral: 5,
    sad: 3,
    angry: 1,
  };

  // 👇 Data transform karein
  const chartData = entries.map((entry) => ({
    date: entry.date,
    steps: entry.steps,
    sleepHours: entry.sleepHours,
    mood: typeof entry.mood === "number" ? entry.mood : moodScale[entry.mood] || 0,
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Wellness Dashboard
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={handleExportCSV}
            className="btn-secondary flex items-center px-4 py-2"
          >
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="btn-secondary flex items-center px-4 py-2"
          >
            <Download className="h-4 w-4 mr-2" /> Export PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Steps */}
        <Card className="rounded-2xl shadow-md bg-white dark:bg-gray-800 border-0">
          <CardContent className="flex items-center p-6 space-x-4">
            <Activity className="w-10 h-10 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Steps</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {entries.length > 0 ? entries[entries.length - 1].steps : 0}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sleep */}
        <Card className="rounded-2xl shadow-md bg-white dark:bg-gray-800 border-0">
          <CardContent className="flex items-center p-6 space-x-4">
            <Moon className="w-10 h-10 text-purple-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Sleep</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {entries.length > 0 ? entries[entries.length - 1].sleepHours : 0} hrs
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Mood */}
        <Card className="rounded-2xl shadow-md bg-white dark:bg-gray-800 border-0">
          <CardContent className="flex items-center p-6 space-x-4">
            <Smile className="w-10 h-10 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Mood</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {entries.length > 0 ? entries[entries.length - 1].mood : "—"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ✅ Combined Chart */}
      <Card className="bg-white dark:bg-gray-800 shadow-md rounded-2xl border-0">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Wellness Trends Over Time
          </h2>
          <div className="h-[400px] text-gray-900 dark:text-gray-100">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="date" stroke="currentColor" />
                <YAxis
                  yAxisId="left"
                  label={{ value: "Steps", angle: -90, position: "insideLeft" }}
                  stroke="currentColor"
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{ value: "Sleep (hrs) / Mood", angle: -90, position: "insideRight" }}
                  stroke="currentColor"
                />
                <Tooltip />
                <Legend />

                {/* Steps */}
                <Line yAxisId="left" type="monotone" dataKey="steps" stroke="#3b82f6" strokeWidth={2} dot name="Steps" />

                {/* Sleep */}
                <Line yAxisId="right" type="monotone" dataKey="sleepHours" stroke="#22c55e" strokeWidth={2} dot name="Sleep" />

                {/* Mood */}
                <Line yAxisId="right" type="monotone" dataKey="mood" stroke="#eab308" strokeWidth={2} dot name="Mood" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Recent Entries
        </h2>
        <div className="space-y-4">
          {entries.length > 0 ? (
            entries
              .slice()
              .reverse()
              .map((entry, index) => (
                <Card
                  key={index}
                  className="rounded-2xl shadow-sm hover:shadow-md transition bg-white dark:bg-gray-800 border-0"
                >
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {entry.date}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Steps: {entry.steps}, Sleep: {entry.sleepHours} hrs, Mood:{" "}
                        {entry.mood}
                      </p>
                      {entry.notes && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Notes: {entry.notes}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No entries yet. Start tracking your wellness!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
