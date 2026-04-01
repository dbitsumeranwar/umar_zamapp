import { BarChart, Bar,XAxis,YAxis,ResponsiveContainer,Tooltip,Legend,LabelList} from "recharts";
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


const BarChartHasBackground = ({ data }) => {
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
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + "M";
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(0) + "K";
  }
  return value;
};
  return (
    
<ResponsiveContainer width= "100%" height= "100%" min-width= "0px">
  <BarChart
    barSize={35}
    data={chartData}
    margin={{ top: 30, right: 20, left: 20, bottom: 5 }}
  >
    <Legend verticalAlign="top" align="right" layout="horizontal" wrapperStyle={{ top: 0 }} iconType="circle" />

    <Bar dataKey="current" fill="#005dc7" radius={[4, 4, 0, 0]}>
      <LabelList
        dataKey="currentLabel"
        position="middle"
        content={<CustomLabel />}
      />
    </Bar>

    <Bar dataKey="previous" fill="#86b5eb" radius={[4, 4, 0, 0]}>
      <LabelList
        dataKey="previousLabel"
        position="middle"
        content={<CustomLabel />}
    
      />
    </Bar>

    <XAxis
      dataKey="name"
      tickLine={false}
      axisLine={false}   
    />

    <YAxis
      width={70}
      tickFormatter={formatNumber}  
      axisLine={false}              
      tickLine={false}
    />

    <Tooltip
  cursor={false}
  formatter={(value) =>
    new Intl.NumberFormat("en-US").format(value)
  }
/>
  </BarChart>
</ResponsiveContainer>
  );
};

export default BarChartHasBackground;