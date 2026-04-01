import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const StackedBarChart_Horizontal = ({ data }) => {
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num;
  };
  const totalCurrent = data.reduce((sum, item) => sum + item.current, 0);
  const totalPrevious = data.reduce((sum, item) => sum + item.previous, 0);

  return (
    <div style={{ padding: 20 }}>
      {data.map((item, i) => {
        const diff = item.current - item.previous;
        const diffPercent =
          item.previous === 0
            ? 0
            : ((diff / item.previous) * 100).toFixed(1);

        const widthPercent =
  item.previous === 0
    ? 0
    : Math.max(0, Math.min((item.current / item.previous) * 100, 100));

        return (
          <div key={i} style={{ marginBottom: 25 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

              <span
                style={{
                  background: "#f8d7da",
                  color: "#dc2626",
                  padding: "3px 6px",
                  borderRadius: 4,
                  fontSize: 12
                }}
              >
                ▼ {formatNumber(Math.abs(diff))}
              </span>

              <span
                style={{
                  background: "#ef4444",
                  color: "white",
                  padding: "3px 6px",
                  borderRadius: 4,
                  fontSize: 12
                }}
              >
                ▼ {Math.abs(diffPercent)}%
              </span>
            </div>

            <div
              style={{
                marginTop: 8,
                display: "flex",
                alignItems: "center",
                gap: 10
              }}
            >
              <div
                style={{
                  flex: 1,
                  background: "#cbd5e1",
                  height: 39,
                  borderRadius: 6,
                  position: "relative"
                }}
              >
                <div
                  style={{
                    width: `${widthPercent}%`,
                    background: "#2b5c9e",
                    height: "100%",
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingRight: 6,
                    color: "white",
                    fontSize: 12,
                    fontWeight: 500
                  }}
                >
                  {formatNumber(item.current)}
                </div>
              </div>

              <div style={{ fontSize: 12, color: "#64748b" }}>
                {formatNumber(item.previous)}
              </div>
            </div>
          </div>
        );
      })}
      <div style={{ marginTop: 20, fontSize: 21, marginLeft: "563px" }}>
    <span style={{ color: "#2b5c9e" }}>●</span> {formatNumber(totalCurrent)} Current &nbsp;
  <span style={{ color: "#94a3b8" }}>●</span> {formatNumber(totalPrevious)} Previous
</div>
    </div>
  );
};

export default  StackedBarChart_Horizontal;