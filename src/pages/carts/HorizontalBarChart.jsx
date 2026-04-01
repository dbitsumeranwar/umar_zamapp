import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  LabelList
} from "recharts";
import { formatChartData } from "./chartFormatter";

const CustomLabel = (props) => {
  const { x, y, width, value } = props;

  let arrow = "";
  let color = "blue";

  if (value[1] > 0) {
    arrow = "▲";
    color = "green";
  } else if (value[1] < 0) {
    arrow = "▼";
    color = "red";
  }

  return (
    <g>
      <text
        x={x + (width + 4)}
        y={y + 10}
        textAnchor="start"
        fill={color}
        fontSize="10"
      >
        {arrow}{new Intl.NumberFormat("en-US").format(value[0])}
      </text>
    </g>
  );
};
const HorizontalBarChart = ({ data }) => {
  const chartData = formatChartData(data);
    if (!chartData || chartData.length === 0) {
      return (
        <div style={{ height: "260px", width: "100%" }}>
          <div style={{ textAlign: "center", paddingTop: 80, color: "#6b7280" }}>
            No data available
          </div>
        </div>
      );
    }

  const formatNumber = (value) => {
    if (value >= 1000000) return (value / 1000000).toFixed(1) + "M";
    if (value >= 1000) return (value / 1000).toFixed(0) + "K";
    return value;
  };

  return (
    <div style={{ height: "260px", width: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={chartData}
          barSize={18}
          margin={{ top: 20, right: 40, left: 40, bottom: 5 }}
        >
          <Legend
            verticalAlign="top"
            align="right"
            layout="horizontal"
            iconType="circle"
          />

          <XAxis
            type="number"
            tickFormatter={formatNumber}
            tick={false}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            type="category"
            dataKey="name"
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            cursor={false}
            formatter={(value) =>
              new Intl.NumberFormat("en-US").format(value)
            }
          />

          <Bar dataKey="current" fill="#005dc7" radius={[0, 4, 4, 0]}>
            <LabelList
              dataKey="currentLabel"
              position="right"
              content={<CustomLabel />}
            />
          </Bar>

          <Bar dataKey="previous" fill="#86b5eb" radius={[0, 4, 4, 0]}>
             <LabelList
              dataKey="previousLabel"
              position="right"
              content={<CustomLabel />}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HorizontalBarChart;