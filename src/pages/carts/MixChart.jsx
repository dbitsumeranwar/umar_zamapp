import React from "react";

const RevenueMixCategory = ({ data }) => {

  const colors = [
    "#343a96",
    "#4b00b5",
    "#5a63d8",
    "#6d88e5",
    "#89a3f0"
  ];

  return (
    <div>
      <div
        style={{
          width: "100%",
          height: "40px",
          background: "#eee",
          borderRadius: "10px",
          overflow: "hidden",
          display: "flex"
        }}
      >
        {data.map((item, i) => (
          <div
            key={i}
            style={{
              width: `${item.percent}%`,
              background: colors[i],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "12px",
              fontWeight: "600"
            }}
          >
            {item.percent > 10 ? `${item.percent}%` : ""}
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: "20px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px"
        }}
      >
        {data.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  background: colors[i],
                  display: "inline-block"
                }}
              ></span>
              {item.name}
            </div>

            <span>{item.value.toLocaleString()}</span>
          </div>
        ))}
      </div>

    </div>
  );
};
export default RevenueMixCategory;