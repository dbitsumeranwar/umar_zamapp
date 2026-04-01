import { brown } from "@mui/material/colors";
import React, { memo, useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip
} from "recharts";

const CustomTooltip = ({ active, payload, customDescription }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-2 shadow-md rounded border border-gray-300">
                {customDescription?.map((item, index) => (
                    <p key={index} className="text-xs text-blue-500">
                        {item?.name}: {payload[0]?.payload[item?.key]}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const DashboardPieChart = ({
    data = [],
    colors = [],
    dataKey,
    nameKey,
    height = 700,
    outerRadius,
    customDescription = [],
    showLabels = true,
    labelColor = "#9370DB",
    title
}) => {
    const [chartWidth, setChartWidth] = useState(0);

    useEffect(() => {
        const updateDimensions = () => {
            const containerWidth = document.getElementById('pie-chart-container')?.clientWidth || 0;
            setChartWidth(Math.max(300, containerWidth));
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, value }) => {
        const RADIAN = Math.PI / 180;
        const radius = outerRadius + 30;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill={labelColor}
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize={12}
            >
                {value}
            </text>
        );
    };

    return (
        <div id="pie-chart-container" className="flex flex-col w-full rounded-lg p-2">
  {/* ✅ Chart Title */}
  {title && (
    <h4 className="text-lg font-semibold mb-3">
      {title}
    </h4>
  )}

  {/* ✅ Chart + Legends Row */}
  <div className="flex flex-row items-center gap-3">
    {/* Pie Chart Container */}
    <div style={{ flex: 2, height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={outerRadius}
            dataKey={dataKey}
            nameKey={nameKey}
            label={showLabels ? renderCustomizedLabel : null}
          >
            {data?.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip customDescription={customDescription} />} />
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* ✅ Legends on the Right Side */}
    <div
      className="flex flex-col items-start gap-2 font-bold p-2"
      style={{ flex: 1, height: "300px", overflowY: "scroll", overflowX: "hidden" }}
    >
      {Array.isArray(data) && data.length > 0 ? (
        data.map((entry, index) =>
          entry ? (
            <div key={index} className="flex items-center text-sm">
              <span
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: colors?.[index] || "#000" }}
              ></span>
              <span
                data-bs-toggle="tooltip"
                data-bs-placement="left"
                title={entry?.[nameKey] ?? "Unknown"}
                style={{
                  maxWidth: "85px",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                {entry?.[nameKey] ?? "Unknown"}
              </span>
            </div>
          ) : null
        )
      ) : (
        <p className="text-gray-500">No data available</p>
      )}
    </div>
  </div>
</div>

    );
};

export default memo(DashboardPieChart);
