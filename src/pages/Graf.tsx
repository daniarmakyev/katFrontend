import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { getСomplaintsList } from "../store/action/complaints.action";
import { decodeSpecialization } from "../store/slice/complaints.slice";
import ComplaintsMap from "../kit/components/ComplaintsMap";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28CF6",
  "#F67280",
  "#6C5B7B",
  "#355C7D",
  "#C06C84",
];

type CategoryKey = "NOISE" | "GARBAGE" | "REPAIR" | "PARKING" | "OTHER";

const categoryLabels: Record<CategoryKey, string> = {
  NOISE: "Шум",
  GARBAGE: "Мусор",
  REPAIR: "Ремонт",
  PARKING: "Парковка",
  OTHER: "Другое",
};

type DateRange = "today" | "week" | "month" | "year" | "all" | "custom";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { complaints, loading } = useAppSelector((state) => state.complaint);
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [customRange, setCustomRange] = useState({
    start: "",
    end: "",
  });

  useEffect(() => {
    dispatch(getСomplaintsList());
  }, [dispatch]);
  const getFilteredComplaints = () => {
    const now = new Date();
    const startDate = new Date();

    switch (dateRange) {
      case "today":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case "custom":
        return complaints.filter((complaint) => {
          if (!complaint.createdAt) return false;
          const date = new Date(complaint.createdAt);
          return (
            date >= new Date(customRange.start) &&
            date <= new Date(customRange.end)
          );
        });
      case "all":
      default:
        return complaints;
    }
    return complaints.filter(
      (complaint) =>
        complaint.createdAt && new Date(complaint.createdAt) >= startDate
    );
  };
  const filteredComplaints = getFilteredComplaints();
  const categoryData = Object.entries(
    filteredComplaints.reduce((acc: { [key: string]: number }, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([key, value]) => ({
    name: categoryLabels[key as CategoryKey] || key,
    value,
    category: key,
  }));
  const yearlyData = Object.entries(
    complaints.reduce((acc: { [key: string]: number }, curr) => {
      if (!curr.createdAt) return acc;
      const year = new Date(curr.createdAt).getFullYear();
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => Number(a.year) - Number(b.year));

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-t-transparent border-purple border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Выберите период
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setDateRange("today")}
              className={`px-4 py-2 rounded ${
                dateRange === "today"
                  ? "bg-purple text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Сегодня
            </button>
            <button
              onClick={() => setDateRange("week")}
              className={`px-4 py-2 rounded ${
                dateRange === "week"
                  ? "bg-purple text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Последняя неделя
            </button>
            <button
              onClick={() => setDateRange("month")}
              className={`px-4 py-2 rounded ${
                dateRange === "month"
                  ? "bg-purple text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Последний месяц
            </button>
            <button
              onClick={() => setDateRange("year")}
              className={`px-4 py-2 rounded ${
                dateRange === "year"
                  ? "bg-purple text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Последний год
            </button>
            <button
              onClick={() => setDateRange("all")}
              className={`px-4 py-2 rounded ${
                dateRange === "all"
                  ? "bg-purple text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              За всё время
            </button>
            <button
              onClick={() => setDateRange("custom")}
              className={`px-4 py-2 rounded ${
                dateRange === "custom"
                  ? "bg-purple text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Выбрать период
            </button>

            {dateRange === "custom" && (
              <div className="flex gap-4 w-full mt-4">
                <input
                  type="date"
                  value={customRange.start}
                  onChange={(e) =>
                    setCustomRange((prev) => ({
                      ...prev,
                      start: e.target.value,
                    }))
                  }
                  className="border rounded px-3 py-2"
                />
                <input
                  type="date"
                  value={customRange.end}
                  onChange={(e) =>
                    setCustomRange((prev) => ({
                      ...prev,
                      end: e.target.value,
                    }))
                  }
                  className="border rounded px-3 py-2"
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Распределение по категориям
            </h2>
            <ResponsiveContainer
              width="100%"
              height={400}
              className={"overflow-scroll"}
            >
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${decodeSpecialization(name)} (${(percent * 100).toFixed(
                      0
                    )}%)`
                  }
                >
                  {categoryData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Количество жалоб по годам
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={yearlyData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="year"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#666" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#666" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    border: "none",
                    borderRadius: "4px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#8884d8"
                  strokeWidth={2}
                  fill="url(#colorCount)"
                  name="Количество жалоб"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <ComplaintsMap />
      </div>
    </div>
  );
};

export default Dashboard;
