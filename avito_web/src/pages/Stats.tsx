import { useLoaderData } from "react-router-dom";
import { Tabs } from "antd";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  statsInterface,
  activityDataInterface,
  decisionsInterface,
  moderatorInterface,
} from "../interface/interface";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

interface StatsLoaderData {
  summary: statsInterface;
  activity: activityDataInterface[];
  decisions: decisionsInterface;
  categories: Record<string, number>;
  moderator: moderatorInterface;
}

export default function Stats() {
  const { summary, activity, decisions, categories, moderator } =
    useLoaderData() as StatsLoaderData;
  const navigate = useNavigate();

  const colors = ["#4a90e2", "#7b8ea3", "#a3b1c6"];

  const activityData = {
    labels: activity.map((a) => a.date),
    datasets: [
      {
        label: "Одобрено",
        data: activity.map((a) => a.approved),
        backgroundColor: colors[0],
      },
      {
        label: "Отклонено",
        data: activity.map((a) => a.rejected),
        backgroundColor: colors[1],
      },
      {
        label: "На доработку",
        data: activity.map((a) => a.requestChanges),
        backgroundColor: colors[2],
      },
    ],
  };

  const decisionsData = {
    labels: ["Одобрено", "Отклонено", "На доработку"],
    datasets: [
      {
        data: [
          Math.round(decisions.approved),
          Math.round(decisions.rejected),
          Math.round(decisions.requestChanges),
        ],
        backgroundColor: colors,
      },
    ],
  };

  const categoriesData = {
    labels: Object.keys(categories),
    datasets: [
      {
        label: "Объявления по категориям",
        data: Object.values(categories),
        backgroundColor: Object.keys(categories).map(
          (el, ind) => colors[ind % colors.length]
        ),
      },
    ],
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <div className="">
          <h1 className="text-2xl font-semibold mb-2">Статистика модератора</h1>
          <p className="text-gray-700">
            <b>{moderator.name}</b> - {moderator.role}
          </p>
          <p className="text-gray-500 text-sm">{moderator.email}</p>
        </div>


        <button
          onClick={() => navigate("/list")}
          className="btn-nav cursor-pointer h-fit px-3 py-1 border rounded-md bg-white hover:bg-gray-100 text-base"
        >
          ← Назад
        </button>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border shadow-sm max-w-lg mb-4">
        <p className="font-medium">{moderator.name}</p>
        <p className="text-sm text-gray-500">Email: {moderator.email}</p>
        <p className="text-sm text-gray-500">Роль: {moderator.role}</p>

        <div className="mt-3 text-sm text-gray-700 space-y-1">
          <p>Всего проверено: {moderator.statistics.totalReviewed}</p>
          <p>
            Сегодня: {moderator.statistics.todayReviewed}, Неделя:{" "}
            {moderator.statistics.thisWeekReviewed}, Месяц:{" "}
            {moderator.statistics.thisMonthReviewed}
          </p>
          <p>
            Среднее время проверки:{" "}
            {Math.round(moderator.statistics.averageReviewTime / 60)} мин
          </p>
          <p>
            Процент одобрения: {Math.round(moderator.statistics.approvalRate)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <p className="text-gray-500 text-sm">Всего проверено</p>
          <p className="text-xl font-semibold">{summary.totalReviewed}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <p className="text-gray-500 text-sm">Сегодня</p>
          <p className="text-xl font-semibold">{summary.totalReviewedToday}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <p className="text-gray-500 text-sm">Неделя</p>
          <p className="text-xl font-semibold">
            {summary.totalReviewedThisWeek}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <p className="text-gray-500 text-sm">Месяц</p>
          <p className="text-xl font-semibold">
            {summary.totalReviewedThisMonth}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <p className="text-gray-500 text-sm">Одобрено</p>
          <p className="text-xl font-semibold">
            {Math.round(summary.approvedPercentage)}%
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <p className="text-gray-500 text-sm">Отклонено</p>
          <p className="text-xl font-semibold">
            {Math.round(summary.rejectedPercentage)}%
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <p className="text-gray-500 text-sm">На доработку</p>
          <p className="text-xl font-semibold">
            {Math.round(summary.requestChangesPercentage)}%
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <p className="text-gray-500 text-sm">Среднее время</p>
          <p className="text-xl font-semibold">
            {Math.round(summary.averageReviewTime / 60)} мин
          </p>
        </div>
      </div>

      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Активность" key="1">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="mx-auto max-w-[800px] h-[420px]">
              <Bar data={activityData} />
            </div>
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Решения" key="2">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="mx-auto max-w-[800px] h-[420px] flex justify-center items-center">
              <Pie data={decisionsData} />
            </div>
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Категории" key="3">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="mx-auto max-w-[800px] h-[420px]">
              <Bar data={categoriesData} />
            </div>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}
