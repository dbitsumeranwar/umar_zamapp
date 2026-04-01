import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const StackedBarChart = ({ data }) => {

  if (!data || data.length === 0) return null;

  const current = data[0].current;
  const previous = data[0].previous;

  const formatValue = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  const diffPercent =
    previous === 0 ? 0 : (((current - previous) / previous) * 100).toFixed(1);

  const isNegative = diffPercent < 0;

  const chartData = [
    {
      name: data[0].name,
      current: current,
      previous: previous
    }
  ];

  return (
    <div style={{ width: "200px", margin: "auto", textAlign: "center" }}>
      <div style={{ fontSize: 12, color: "#6b7280", letterSpacing: 1 }}>
        {chartData[0].name}
      </div>
      <div
        style={{
          display: "inline-block",
          background: isNegative ? "#ef4444" : "#16a34a",
          color: "white",
          padding: "4px 8px",
          borderRadius: 6,
          fontSize: 12,
          marginTop: 6
        }}
      >
        {isNegative ? "▼" : "▲"} {Math.abs(diffPercent)}%
      </div>
      <div style={{ height: 120, marginTop: 10 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={-40} >

            <XAxis hide />
            <YAxis hide />

            <Bar
              dataKey="previous"
              fill="#bcd2ee"
              barSize={40}
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="current"
              fill="#1e4f91"
              barSize={40}
              radius={[8, 8, 0, 0]}
            />

          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
        <div>
          <div style={{ fontWeight: 600, color: "#1e4f91" }}>
            {formatValue(current)}
          </div>
          <div style={{ fontSize: 12 }}>
            <span style={{ color: "#1e4f91" }}>●</span> Curr
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 600, color: "#6b7280" }}>
            {formatValue(previous)}
          </div>
          <div style={{ fontSize: 12 }}>
            <span style={{ color: "#bcd2ee" }}>●</span> Prev
          </div>
        </div>
      </div>

    </div>
  );
};

export default StackedBarChart;