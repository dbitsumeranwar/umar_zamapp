import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Cell, LabelList, Legend } from "recharts";

const StackedDateBarChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const formatValue = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value;
  };

  const chartData = data.map((item) => {
    const current = Number(item.current) || 0;
    const previous = Number(item.previous) || 0;
    const percent =
      previous === 0 ? 0 : ((current - previous) / previous) * 100;
    return {
      name: item.name,
      current,
      previous,
      percent: percent.toFixed(0),
      isNegative: percent < 0
    };
  });

  return (
    <>
    <div style={{ marginTop: 20, fontSize: 21, marginLeft: "1243px" }}>
    <span style={{ color: "#2b5c9e" }}>●</span> Current &nbsp;
  <span style={{ color: "#94a3b8" }}>●</span> Previous
</div>
    <div style={{ width: "100%", height: 250 }}>
      
     <ResponsiveContainer width="100%" height={250}>
  <BarChart data={chartData} barGap={-40} margin={{ top: 50, bottom: 20 }}>
    <XAxis hide />
    <YAxis hide />
    <Bar dataKey="previous" fill="#86b5eb" barSize={40} radius={[8, 8, 0, 0]} />
    <Bar dataKey="current" barSize={40} fill="#005dc7" radius={[8, 8, 0, 0]}>
      {chartData.map((entry, index) => (
        <Cell key={index} fill="#1e4f91" />
      ))}
      <LabelList
        dataKey="percent"
        content={(props) => {
          const { x, index, value } = props;
          const item = chartData[index];

          const rectWidth = 50;
          const rectHeight = 25;
          const topY = 10; 
          const rightShift = 14;

          return (
            <g>
              <rect
                x={x - rectWidth / 2 + rightShift}
                y={topY}
                width={rectWidth}
                height={rectHeight}
                rx={6}
                fill={item.isNegative ? "#ef4444" : "#16a34a"}
              />
              <text
                x={x + rightShift}
                y={topY + rectHeight / 2}
                fill="#fff"
                fontSize={10}
                fontWeight={600}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {item.isNegative ? "▼" : "▲"} {Math.abs(value)}%
              </text>
            </g>
          );
        }}
      />
    </Bar>
  </BarChart>
</ResponsiveContainer>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
        {chartData.map((item, i) => (
          <div key={i} style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>{formatValue(item.current)}</div>
            <div style={{ fontSize: 10, color: "#6b7280" }}>{formatValue(item.previous)}</div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default StackedDateBarChart;