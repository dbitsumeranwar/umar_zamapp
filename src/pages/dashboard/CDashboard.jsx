import React, { useRef } from "react";
import BarChartHasBackground from '../carts/BarChart';
import HorizontalBarChart from '../carts/HorizontalBarChart';
import RevenueMixCategory from '../carts/MixChart';
import CustomButton from "../../components/button/CustomButton";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Test from "./test";
import {
  FaFileCsv,
  FaInbox,
  FaPrint,
  FaRegFileExcel,
  FaRegFilePdf,
} from "react-icons/fa6";

function CDashboard({ apidata }) {
  const printRef = useRef(null);

  if (!apidata || !Array.isArray(apidata) || apidata.length === 0) {
    return (
      <div className="bg-[#F4F7FE] p-6">
        <div className="text-center text-gray-600">
          Please try again or contact support if the issue persists.
        </div>
      </div>
    );
  }

  const tables = [];
  let currentTable = null;

  for (let item of apidata) {
    if (item.section === "Revenue & Spend") {
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
    { title: "Top Session", section: "Dinner" },
  ];

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

  // Revenue By Session
  const RevenueSession = apidata.length > 0 ? (() => {
    const rows = getSectionRows(apidata, "Revenue By Session");
    return rows
      .filter(r => r.section !== "Total")
      .map(r => {
        const current = Number(r.current_value?.replace(/,/g, "")) || 0;
        const previous = Number(r.previous_value?.replace(/,/g, "")) || 0;
        const diff = current - previous;
        return { name: r.section, current, previous, currentLabel: [current, diff], previousLabel: [previous, diff] };
      });
  })() : [];

  // Covers By Session
  const CoversSession = apidata.length > 0 ? (() => {
    const rows = getSectionRows(apidata, "Covers By Session");
    return rows
      .filter(r => r.section !== "Total")
      .map(r => {
        const current = Number(r.current_value?.replace(/,/g, "")) || 0;
        const previous = Number(r.previous_value?.replace(/,/g, "")) || 0;
        const diff = current - previous;
        return { name: r.section, current, previous, currentLabel: [current, diff], previousLabel: [previous, diff] };
      });
  })() : [];

  // Avg Spend By Session
  const AvgSession = apidata.length > 0 ? (() => {
    const rows = getSectionRows(apidata, "Avg Spend By Session");
    return rows
      .filter(r => r.section !== "Total")
      .map(r => {
        const current = Number(r.current_value?.replace(/,/g, "")) || 0;
        const previous = Number(r.previous_value?.replace(/,/g, "")) || 0;
        const diff = current - previous;
        return { name: r.section, current, previous, currentLabel: [current, diff], previousLabel: [previous, diff] };
      });
  })() : [];

  // Revenue By Location
  const RevenueLocation = apidata.length > 0 ? (() => {
    const rows = getSectionRows(apidata, "Revenue By Location");
    return rows
      .filter(r => r.section !== "Total")
      .map(r => {
        const current = Number(r.current_value?.replace(/,/g, "")) || 0;
        const previous = Number(r.previous_value?.replace(/,/g, "")) || 0;
        const diff = current - previous;
        return { name: r.section, current, previous, currentLabel: [current, diff], previousLabel: [previous, diff] };
      });
  })() : [];

  // Covers By Location
  const CoversLocation = apidata.length > 0 ? (() => {
    const rows = getSectionRows(apidata, "Covers By Location");
    return rows
      .filter(r => r.section !== "Total")
      .map(r => {
        const current = Number(r.current_value?.replace(/,/g, "")) || 0;
        const previous = Number(r.previous_value?.replace(/,/g, "")) || 0;
        const diff = current - previous;
        return { name: r.section, current, previous, currentLabel: [current, diff], previousLabel: [previous, diff] };
      });
  })() : [];

  // Avg Spend By Location
  const AvgCoversLocation = apidata.length > 0 ? (() => {
    const rows = getSectionRows(apidata, "Avg Spend By Location");
    return rows
      .filter(r => r.section !== "Total")
      .map(r => {
        const current = Number(r.current_value?.replace(/,/g, "")) || 0;
        const previous = Number(r.previous_value?.replace(/,/g, "")) || 0;
        const diff = Number(r.diff_value?.replace(/,/g, "")) || 0;
        return { name: r.section, current, previous, currentLabel: [current, diff], previousLabel: [previous, diff] };
      });
  })() : [];

  // Sales by Day Average
  const SaleDayAverage = apidata.length > 0 ? (() => {
    const rows = getSectionRows(apidata, "Sales by Day Average");
    return rows
      .filter(r => r.section !== "Total")
      .map(r => {
        const current = Number(r.current_value?.replace(/,/g, "")) || 0;
        const previous = Number(r.previous_value?.replace(/,/g, "")) || 0;
        const diff = current - previous;
        return { name: r.section, current, previous, currentLabel: [current, diff], previousLabel: [previous, diff] };
      });
  })() : [];

  // Revenue By Category (Mix)
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

  // Chart data — Revenue & Avg Spend
  const chartRevenue = tables.length > 0 ? (() => {
    const row = getRow(tables[0], "Revenue");
    const previous = row ? Number(row.previous_value?.replace(/,/g, "")) || 0 : 0;
    const current = row ? Number(row.current_value?.replace(/,/g, "")) || 0 : 0;
    const diff = current - previous;
    return [{ name: "Revenue", previous, current, currentLabel: [current, diff], previousLabel: [previous, diff] }];
  })() : [];

  const chartAvgSpend = tables.length > 0 ? (() => {
    const row = getRow(tables[0], "Avg Spend");
    const previous = row ? Number(row.previous_value?.replace(/,/g, "")) || 0 : 0;
    const current = row ? Number(row.current_value?.replace(/,/g, "")) || 0 : 0;
    const diff = current - previous;
    return [{ name: "Avg Spend", previous, current, currentLabel: [current, diff], previousLabel: [previous, diff] }];
  })() : [];
// export to PDF function

const exportToPDF = async () => {
  const element = printRef.current;
  if (!element) return;

  try {

    await new Promise(resolve => setTimeout(resolve, 500));

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      scrollX: 0,
      scrollY: -window.scrollY,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      logging: false,
      onclone: (clonedDoc) => {
        const clonedEl = clonedDoc.querySelector('[data-print]'); 
        if (clonedEl) {
          clonedEl.style.overflow = 'visible';
          clonedEl.style.height = 'auto';
        }
      }
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.92);
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgHeightMM = (canvas.height * pageWidth) / canvas.width;

    let yOffset = 0;
    while (yOffset < imgHeightMM) {
      if (yOffset > 0) pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, -yOffset, pageWidth, imgHeightMM, undefined, "FAST");
      yOffset += pageHeight;
    }

    pdf.save("Compare-Flash-Report.pdf");
  } catch (error) {
    console.error("PDF export error:", error);
  }
};
  return (
    <>
      <div className='bg-[#F4F7FE] p-6 space-y-8 overflow-y-auto'>
        <div className="flex justify-end gap-2 mb-2">
          <CustomButton
            icon={"PDF"}
            btntext={<FaRegFilePdf />}
            handleClick={() => exportToPDF()}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {tables.map((table, tIndex) =>
            cardConfig.map((card, cIndex) => {
              const row = getRow(table, card.section);
              if (!row) return null;
              return (
                <div
                  key={`${tIndex}-${cIndex}`}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 transition-transform hover:scale-[1.02]"
                >
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {card.title}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <h2 className="text-2xl font-bold text-slate-800">
                      {row.current_value}
                    </h2>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${
                        row.diff_value?.includes("-")
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {row.diff_value}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Prior: {row.previous_value}
                  </p>
                </div>
              );
            })
          )}
        </div>
        <div>
          <h2 className='text-base font-bold text-slate-800 mb-4 flex items-center gap-2'>
            <span className='w-1 h-5 bg-blue-800 rounded-full'></span>Performance Summary
          </h2>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col h-full">
              <h3 className='text-sm font-bold mb-4 text-gray-700'>Total Revenue Growth</h3>
              <div style={{ height: '220px', width: '100%' }}>
                <BarChartHasBackground data={chartRevenue} />
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col h-full">
              <h3 className='text-sm font-bold mb-4 text-gray-700'>Average Spend Comparison</h3>
              <div style={{ height: '220px', width: '100%' }}>
                <BarChartHasBackground data={chartAvgSpend} />
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className='text-base font-bold text-slate-800 mb-4 flex items-center gap-2'>
            <span className='w-1 h-5 bg-blue-800 rounded-full'></span>Session Performance
          </h2>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col h-full">
              <h3 className='text-sm font-bold mb-4 text-gray-700'>Revenue By Session</h3>
              <div style={{ height: "260px", width: "100%" }}>
                <HorizontalBarChart data={RevenueSession} />
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col h-full">
              <h3 className='text-sm font-bold mb-4 text-gray-700'>Covers By Session</h3>
              <div style={{ height: "260px", width: "100%" }}>
                <HorizontalBarChart data={CoversSession} />
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col h-full">
              <h3 className='text-sm font-bold mb-4 text-gray-700'>Average Spend Comparison</h3>
              <div style={{ height: "260px", width: "100%" }}>
                <HorizontalBarChart data={AvgSession} />
              </div>
            </div>
          </div>
          <h2 className='text-base font-bold text-slate-800 mb-4 mt-6 flex items-center gap-2'>
            <span className='w-1 h-5 bg-blue-800 rounded-full'></span>Location Breakdown
          </h2>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col h-full">
              <h3 className='text-sm font-bold mb-4 text-gray-700'>Revenue By Location</h3>
              <div style={{ height: "260px", width: "100%" }}>
                <HorizontalBarChart data={RevenueLocation} />
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col h-full">
              <h3 className='text-sm font-bold mb-4 text-gray-700'>Covers By Location</h3>
              <div style={{ height: "260px", width: "100%" }}>
                <HorizontalBarChart data={CoversLocation} />
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col h-full">
              <h3 className='text-sm font-bold mb-4 text-gray-700'>Average Spend Location</h3>
              <div style={{ height: "260px", width: "100%" }}>
                <HorizontalBarChart data={AvgCoversLocation} />
              </div>
            </div>
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6'>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col h-full">
              <h3 className='text-sm font-bold mb-4 text-gray-700'>Sales by Day Average</h3>
              <div style={{ height: '320px', width: '100%' }}>
                <BarChartHasBackground data={SaleDayAverage} />
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col h-full">
              <h3 className='text-sm font-bold mb-4 text-gray-700'>Revenue Mix (Category)</h3>
              <div style={{ height: '320px', width: '100%' }}>
                <RevenueMixCategory data={RevenueCategory} />
              </div>
            </div>
          </div>
        </div>
        <div style={{ position: 'fixed', top: 0, left: '-9999px', width: '1200px', zIndex: -1, pointerEvents: 'none', opacity: 0 }}>
          <Test apidata={apidata} />
        </div>
      </div>
    </>
  );
}

export default CDashboard;