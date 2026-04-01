import React, { forwardRef, useRef } from "react";
import BarChartHasBackground from '../carts/BarChart';
import HorizontalBarChart from '../carts/HorizontalBarChart';
import StackedBarChart from '../carts/StackedBarChart';
import RevenueMixCategory from '../carts/MixChart';
import StackedBarChart_Horizontal from '../carts/StackedBarChart_Horizontal';
import StackedDateBarChart from '../carts/StackedDateBarChart';
import CustomButton from "../../components/button/CustomButton";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import {
  FaFileCsv,
  FaInbox,
  FaPrint,
  FaRegFileExcel,
  FaRegFilePdf,
} from "react-icons/fa6";

const Test = forwardRef(function Test({ apidata }) {
  const printRef = useRef(null);

  if (!apidata || !Array.isArray(apidata) || apidata.length === 0) {
    return (
      <div className="bg-[#F4F7FE] p-6">
        <div className="text-center text-gray-600">
          Please try again.
        </div>
      </div>
    );
  }

  const tables = [];
  let currentTable = null;

  for (let item of apidata) {
    if (item.section === "Flash Compare Report") {
      currentTable = {
        title: item.section,
        rows: []
      };
      continue;
    }
    if (currentTable) {
      currentTable.rows.push(item);
    }
    if (currentTable && item.section === "Total") {
      tables.push(currentTable);
      currentTable = null;
    }
  }

  const getRow = (table, sectionName) =>
    table.rows.find(r => r.section === sectionName);

  const cardConfig = [
    { title: "Revenue", section: "Revenue" },
    { title: "Covers", section: "Covers" },
    { title: "Avg Spend", section: "Avg Spend" },
  ];

  const formatNumber = (value) => {
    if (typeof value === 'string') {
      value = parseFloat(value.replace(/,/g, '')) || 0;
    }
    const absValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    if (absValue >= 1000000) return sign + (absValue / 1000000).toFixed(1) + "M";
    if (absValue >= 1000) return sign + (absValue / 1000).toFixed(0) + "K";
    return value.toString();
  };

  const getSectionRows = (data, sectionTitle) => {
    const startIndex = data.findIndex(r => r.section === sectionTitle);
    if (startIndex === -1) return [];

    const rows = [];
    for (let i = startIndex + 1; i < data.length; i++) {
      if (data[i].section === "" || data[i].section === " ") break;
      rows.push(data[i]);
    }
    return rows;
  };

  const RevenueSession = apidata.length > 0 ? (() => {
    const rows = getSectionRows(apidata, "Revenue By Session");
    return rows
      .filter(r => r.section !== "Total")
      .map(r => {
        const current = Number(r.current_value?.replace(/,/g, "")) || 0;
        const previous = Number(r.previous_value?.replace(/,/g, "")) || 0;
        const diff = current - previous;
        if (current === 0 && previous === 0) return null;
        return { name: r.section, current, previous, currentLabel: [current, diff], previousLabel: [previous, diff] };
      })
      .filter(item => item !== null);
  })() : [];

  const CoversSession = apidata.length > 0 ? (() => {
    const rows = getSectionRows(apidata, "Covers By Session");
    return rows
      .filter(r => r.section !== "Total")
      .map(r => {
        const current = Number(r.current_value?.replace(/,/g, "")) || 0;
        const previous = Number(r.previous_value?.replace(/,/g, "")) || 0;
        const diff = current - previous;
        if (current === 0 && previous === 0) return null;
        return { name: r.section, current, previous, currentLabel: [current, diff], previousLabel: [previous, diff] };
      })
      .filter(item => item !== null);
  })() : [];
  const AvgSession = apidata.length > 0 ? (() => {
    const rows = getSectionRows(apidata, "Avg Spend By Session");
    return rows
      .filter(r => r.section !== "Total")
      .map(r => {
        const current = Number(r.current_value?.replace(/,/g, "")) || 0;
        const previous = Number(r.previous_value?.replace(/,/g, "")) || 0;
        const diff = current - previous;
        if (current === 0 && previous === 0) return null;
        return { name: r.section, current, previous, currentLabel: [current, diff], previousLabel: [previous, diff] };
      })
      .filter(item => item !== null);
  })() : [];
  const RevenueLocation = apidata.length > 0 ? (() => {
    const rows = getSectionRows(apidata, "Revenue By Location");
    return rows
      .filter(r => r.section !== "Total")
      .map(r => {
        const current = Number(r.current_value?.replace(/,/g, "")) || 0;
        const previous = Number(r.previous_value?.replace(/,/g, "")) || 0;
        const diff = current - previous;
        if (current === 0 && previous === 0) return null;
        return { name: r.section, current, previous, currentLabel: [current, diff], previousLabel: [previous, diff] };
      })
      .filter(item => item !== null);
  })() : [];
  const CoversLocation = apidata.length > 0 ? (() => {
    const rows = getSectionRows(apidata, "Covers By Location");
    return rows
      .filter(r => r.section !== "Total")
      .map(r => {
        const current = Number(r.current_value?.replace(/,/g, "")) || 0;
        const previous = Number(r.previous_value?.replace(/,/g, "")) || 0;
        const diff = current - previous;
        if (current === 0 && previous === 0) return null;
        return { name: r.section, current, previous, currentLabel: [current, diff], previousLabel: [previous, diff] };
      })
      .filter(item => item !== null);
  })() : [];
  const AvgCoversLocation = apidata.length > 0 ? (() => {
    const rows = getSectionRows(apidata, "Avg Spend By Location");
    return rows
      .filter(r => r.section !== "Total")
      .map(r => {
        const current = Number(r.current_value?.replace(/,/g, "")) || 0;
        const previous = Number(r.previous_value?.replace(/,/g, "")) || 0;
        const diff = Number(r.diff_value?.replace(/,/g, "")) || 0;
        if (current === 0 && previous === 0) return null;
        return { name: r.section, current, previous, currentLabel: [current, diff], previousLabel: [previous, diff] };
      })
      .filter(item => item !== null);
  })() : [];

  const SaleDayAverage = apidata.length > 0 ? (() => {
    const rows = getSectionRows(apidata, "Sales by Day Average");
    return rows
      .filter(r => r.section !== "Total")
      .map(r => {
        const current = Number(r.current_value?.replace(/,/g, "")) || 0;
        const previous = Number(r.previous_value?.replace(/,/g, "")) || 0;
        const diff = current - previous;
        if (current === 0 && previous === 0) return null;
        return { name: r.section, current, previous, currentLabel: [current, diff], previousLabel: [previous, diff] };
      })
      .filter(item => item !== null);
  })() : [];

  const RevenueCategory = apidata.length > 0 ? (() => {
    const rows = getSectionRows(apidata, "Revenue By Category");
    const parsed = rows
      .filter(r => r.section && r.section !== "Total")
      .map(r => {
        const value = Number(r.current_value?.replace(/,/g, "")) || 0;
        return { name: r.section, value };
      });
    const total = parsed.reduce((sum, r) => sum + r.value, 0);
    return parsed.map(item => ({
      ...item,
      percent: total ? Math.round((item.value / total) * 100) : 0
    }));
  })() : [];
  const chartRevenue = tables.length > 0 ? (() => {
    const row = getRow(tables[0], "Revenue");
    const previous = row ? Number(row.previous_value?.replace(/,/g, "")) || 0 : 0;
    const current = row ? Number(row.current_value?.replace(/,/g, "")) || 0 : 0;
    const diff = current - previous;
    if (current === 0 && previous === 0) return null;
    return [{ name: "Revenue", previous, current, currentLabel: [current, diff], previousLabel: [previous, diff] }];
  })() : [];

  const chartAvgSpend = tables.length > 0 ? (() => {
    const row = getRow(tables[0], "Avg Spend");
    const previous = row ? Number(row.previous_value?.replace(/,/g, "")) || 0 : 0;
    const current = row ? Number(row.current_value?.replace(/,/g, "")) || 0 : 0;
    const diff = current - previous;
    if (current === 0 && previous === 0) return null;
    return [{ name: "Avg Spend", previous, current, currentLabel: [current, diff], previousLabel: [previous, diff] }];
  })() : [];


  // export to PDF function
  const exportToPDF = async () => {
    const element = printRef.current;
    if (!element) return;

    await new Promise(resolve => setTimeout(resolve, 700));

    const canvas = await html2canvas(element, {
      scale: 1.5,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.7);

    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "JPEG", 0, position, pageWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("Compare-Flash-Report.pdf");
  };


  const headerLabels = apidata.slice(0, 5).map(item => item.label).filter(Boolean);
  const title = apidata[0]?.label;
  const company = apidata[1]?.label;
  const Current = apidata[2]?.label;
  const Previous = apidata[3]?.label;


// export to Excel function
const exportToExcel = () => {
  const excelData = [];
  const pushSection = (title, dataArray) => {
    if (!dataArray || dataArray.length === 0) return;
    

    excelData.push({
      Section: title,
      Metric: "",
      Current: "",
      Previous: "",
      Difference: ""
    });

    excelData.push({
      Section: "",
      Metric: "Name",
      Current: "Current",
      Previous: "Previous",
      Difference: "Diff"
    });

    dataArray.forEach(item => {
      const diff = (item.current || 0) - (item.previous || 0);

      excelData.push({
        Section: "",
        Metric: item.name || "",
        Current: item.current || 0,
        Previous: item.previous || 0,
        Difference: diff
      });
    });

    excelData.push({});
  };
  pushSection("Revenue By Session", RevenueSession);
  pushSection("Covers By Session", CoversSession);
  pushSection("Avg Spend By Session", AvgSession);

  pushSection("Revenue By Location", RevenueLocation);
  pushSection("Covers By Location", CoversLocation);
  pushSection("Avg Spend By Location", AvgCoversLocation);

  pushSection("Sales By Day Average", SaleDayAverage);

  if (RevenueCategory && RevenueCategory.length > 0) {
    excelData.push({
      Section: "Revenue By Category",
      Metric: "",
      Current: "",
      Previous: "",
      Difference: ""
    });

    excelData.push({
      Section: "",
      Metric: "Category",
      Current: "Value",
      Previous: "",
      Difference: "Percent %"
    });

    RevenueCategory.forEach(item => {
      excelData.push({
        Section: "",
        Metric: item.name,
        Current: item.value,
        Previous: "",
        Difference: item.percent + "%"
      });
    });

    excelData.push({});
  }
  console.log(excelData);

  pushSection("Revenue Summary", chartRevenue);
  pushSection("Avg Spend Summary", chartAvgSpend);

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Compare Report");

  XLSX.writeFile(workbook, "compare-flash-report.xlsx");
};

  return (
    <>
      <div className="flex justify-end gap-2 mb-2">
        <CustomButton
          icon={"PDF"}
          btntext={<FaRegFilePdf />}
          handleClick={() => exportToPDF()}
        />
        <CustomButton
          icon={"Excel"}
          btntext={<FaRegFileExcel className="me-1" />}
          handleClick={() => exportToExcel()}
        />
      </div>
      <div
        className='bg-[#f1f2f3] p-6 space-y-8'
        ref={printRef}
        style={{ width: '100%', boxSizing: 'border-box' }}
      >
        <div>
          {headerLabels.length > 0 && (
            <div className="col-span-1 md:col-span-4 bg-[#1f4e8c] p-6 rounded-2xl shadow-sm flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-semibold text-white">Compare Flash Report</h1>
                <p className="text-lg text-white">{title}</p>
                <p className="text-blue-200 text-md mt-2">{Current} | {Previous}</p>
              </div>
              <div>
                <span className="bg-blue-500 text-white text-xs px-4 py-1 rounded-full">{company}</span>
              </div>
            </div>
          )}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {tables.map((table, tIndex) =>
              cardConfig.map((card, cIndex) => {
                const row = getRow(table, card.section);
                if (!row) return null;
                const current = row.current_value ? Number(row.current_value.toString().replace(/,/g, "")) : 0;
                const previous = row.previous_value ? Number(row.previous_value.toString().replace(/,/g, "")) : 0;
                const diff = current - previous;
                const diffPercent = previous === 0 ? 0 : ((diff / previous) * 100).toFixed(1);
                let arrow = "";
                let color = "text-blue-600 bg-blue-100";
                if (diffPercent > 0) { arrow = "▲"; color = "text-green-600 bg-green-100"; }
                else if (diffPercent < 0) { arrow = "▼"; color = "text-red-600 bg-red-100"; }

                return (
                  <div key={`${tIndex}-${cIndex}`} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{card.title}</p>
                    <div className="flex items-center justify-between mt-2">
                      <h2 className="text-2xl font-bold text-slate-800">{formatNumber(current)}</h2>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${color}`}>
                        {arrow} {Math.abs(diffPercent)}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Prior: {formatNumber(previous)}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
        <div>
          <h2 className='text-base font-bold text-slate-800 mb-4 flex items-center gap-2'>
            <span className='w-1 h-5 bg-blue-800 rounded-full'></span>Performance Summary
          </h2>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <h3 className='text-sm font-bold mb-4 text-gray-700'>Total Revenue Growth</h3>
              <div style={{ height: '260px', width: '100%' }}>
                <StackedBarChart data={chartRevenue} />
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <h3 className='text-sm font-bold mb-4 text-gray-700'>Average Spend Comparison</h3>
              <div style={{ height: '260px', width: '100%' }}>
                <StackedBarChart data={chartAvgSpend} />
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className='text-base font-bold text-slate-800 mb-4 flex items-center gap-2'>
            <span className='w-1 h-5 bg-blue-800 rounded-full'></span>Session Performance
          </h2>
          <div className='flex flex-col gap-6'>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <h3 className='text-sm font-bold mb-4 text-gray-700'>Revenue By Session</h3>
              <div style={{ height: '250px', width: '100%' }}>
                <StackedBarChart_Horizontal data={RevenueSession} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <h3 className='text-sm font-bold mb-4 text-gray-700'>Covers By Session</h3>
              <div style={{ height: '250px', width: '100%' }}>
                <StackedBarChart_Horizontal data={CoversSession} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <h3 className='text-sm font-bold mb-4 text-gray-700'>Average Spend Comparison</h3>
              <div style={{ height: '250px', width: '100%' }}>
                <StackedBarChart_Horizontal data={AvgSession} />
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className='text-base font-bold text-slate-800 mb-4 flex items-center gap-2'>
            <span className='w-1 h-5 bg-blue-800 rounded-full'></span>Location Breakdown
          </h2>
          <div className='flex flex-col gap-6'>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <h3 className='text-sm font-bold mb-4 text-gray-700'>Revenue By Location</h3>

              <div style={{ height: '500px', width: '100%' }}>
                <StackedBarChart_Horizontal data={RevenueLocation} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <h3 className='text-sm font-bold mb-4 text-gray-700'>Covers By Location</h3>
              <div style={{ height: '500px', width: '100%' }}>
                <StackedBarChart_Horizontal data={CoversLocation} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <h3 className='text-sm font-bold mb-4 text-gray-700'>Average Spend Location</h3>
              <div style={{ height: '500px', width: '100%' }}>
                <StackedBarChart_Horizontal data={AvgCoversLocation} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <h3 className='text-sm font-bold mb-4 text-gray-700'>Total Revenue Growth</h3>
              <div style={{ height: '320px', width: '100%' }}>
                <StackedDateBarChart data={SaleDayAverage} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <h3 className='text-sm font-bold mb-4 text-gray-700'>Total Revenue Growth</h3>
              <div style={{ height: '320px', width: '100%' }}>
                <RevenueMixCategory data={RevenueCategory} />
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
});

export default Test;