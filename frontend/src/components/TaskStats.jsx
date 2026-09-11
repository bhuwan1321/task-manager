import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const TEAL = '#0F766E';
const AMBER = '#B45309';
const RED = '#B42318';
const LINE = '#E2E4E9';

function last7DaysLabel(date) {
  return date.toLocaleDateString(undefined, { weekday: 'short' });
}

export default function TaskStats({ tasks }) {
  const { completed, pending, overdue, completionRate, dailyData } = useMemo(() => {
    const now = new Date();
    const completedCount = tasks.filter((t) => t.completed).length;
    const pendingCount = tasks.length - completedCount;
    const overdueCount = tasks.filter(
      (t) => !t.completed && t.due_date && new Date(t.due_date) < now
    ).length;

    // Build a rolling 7-day window of how many tasks were completed each day,
    // based on updated_at for tasks currently marked completed.
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d);
    }
    const dayBuckets = days.map((d) => ({
      label: last7DaysLabel(d),
      key: d.toDateString(),
      completed: 0,
    }));

    tasks.forEach((t) => {
      if (!t.completed) return;
      const completedOn = new Date(t.updated_at).toDateString();
      const bucket = dayBuckets.find((b) => b.key === completedOn);
      if (bucket) bucket.completed += 1;
    });

    return {
      completed: completedCount,
      pending: pendingCount,
      overdue: overdueCount,
      completionRate: tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0,
      dailyData: dayBuckets,
    };
  }, [tasks]);

  const pieData = [
    { name: 'Completed', value: completed, color: TEAL },
    { name: 'Pending', value: pending, color: AMBER },
  ];

  if (tasks.length === 0) return null;

  return (
    <section className="stats-section">
      <div className="stats-cards">
        <div className="stat-card">
          <p className="stat-value">{tasks.length}</p>
          <p className="stat-label">Total tasks</p>
        </div>
        <div className="stat-card">
          <p className="stat-value" style={{ color: TEAL }}>{completed}</p>
          <p className="stat-label">Completed</p>
        </div>
        <div className="stat-card">
          <p className="stat-value" style={{ color: AMBER }}>{pending}</p>
          <p className="stat-label">Pending</p>
        </div>
        <div className="stat-card">
          <p className="stat-value" style={{ color: overdue ? RED : 'inherit' }}>{overdue}</p>
          <p className="stat-label">Overdue</p>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-box">
          <h3>Completion split</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={pending && completed ? 3 : 0}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="chart-caption">{completionRate}% complete</p>
        </div>

        <div className="chart-box">
          <h3>Completed per day (last 7 days)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={dailyData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={LINE} vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} axisLine={{ stroke: LINE }} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="completed" fill={TEAL} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}