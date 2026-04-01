export const formatChartData = (graphData = []) => {
  return graphData.map((item) => ({
    ...item,
    Current: Number(item.current_value?.replace(/,/g, "") || 0),
    Previous: Number(item.previous_value?.replace(/,/g, "") || 0),
    CurrentLabel: [
      Number(item.current_value?.replace(/,/g, "") || 0),
      Number(item.diff_value?.replace(/,/g, "") || 0)
    ],
    PreviousLabel: [
      Number(item.previous_value?.replace(/,/g, "") || 0),
      Number(item.diff_value?.replace(/,/g, "") || 0)
    ]
  }));
};