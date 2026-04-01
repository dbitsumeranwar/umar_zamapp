import { Select } from "antd";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import React, { useEffect, useRef, useState } from "react";
import { BsFiletypeJson } from "react-icons/bs";
import {
  FaFileCsv,
  FaInbox,
  FaPrint,
  FaRegFileExcel,
  FaRegFilePdf,
} from "react-icons/fa6";

import { MdFilterAlt, MdFilterAltOff } from "react-icons/md";
import withPermissionCheck from "../../config/withPermissionCheck";
import { Link, useNavigate } from "react-router-dom";
import { getFromLocalStorage, saveToLocalStorage } from "../../config/crypto-file";
import { API_ENDPOINTS } from "../../apis/client/api-endpoints";

import { useGlobelApi } from "../../apis/useProduct/useCommon";
import CustomButton from "../../components/button/CustomButton";
import DynamicFilter from "../../components/form-elements/DynamicFilter";
import Loader from "../../components/Loader";
import CDashboard from "./CDashboard";
import Test from "./test";
import { MdDashboard } from "react-icons/md";
import { RiTableFill } from "react-icons/ri";
import { eq } from "lodash";





const CompareFlashReport = () => {
  const [apiData, setApiData] = useState([]);
  const [isFilterWidth, setIsFilterWidth] = useState(false);
  const [dateFilter, setDateFilter] = useState("YDAY_VS_LW");
  const UserId = getFromLocalStorage("UserId");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeView, setActiveView] = useState("table");  
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [company, setCompany] = useState();
  const [companyId, setCompanyId] = useState();
  const { mutate, isPending } = useGlobelApi(API_ENDPOINTS.COMPARE_FLASH_REPORT);
  const printRef = useRef(null);
  const { mutate: fetchDataForExcel, isPending: excelPending } = useGlobelApi(
      API_ENDPOINTS.COMPARE_FLASH_REPORT
    );
  


/// print handler

const handlePrint = () => {
  
    if (!printRef.current) return;
    const content = printRef.current.innerHTML;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

          printWindow.document.write(`
            <html>
              <head>
                <title>Compare Flash Report</title>
                <style>
                * {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    color-adjust: exact !important;
                }
                  .print-header {
                    width: 100%;
                    text-align: center;
                    font-weight: bold;
                    padding: 5px 0;
                  }
                  table {
                    border-collapse: collapse;
                    width: 100%;
                    margin: 20px 0;
                  }
                  table, th, td {
                    border: 1px solid black !important;
                  }
                  th, td {
                    padding: 8px;
                    text-align: left;
                  }
                 
                  tbody tr {
                    background-color: inherit !important;
                  }
                  tbody tr:nth-child(even) {
                    background-color: #f3f4f6 !important;
                  }
                  tbody tr:nth-child(odd) {
                    background-color: #ffffff !important;
                  } 
                  tbody tr.company-row td {
                    background-color: #103460 !important;
                    color: white !important;
                    font-weight: bold !important;
                  }
      
                  tbody tr.bold-section {
                    background-color: #f3f4f6 !important;
                    font-weight: bold !important;
                  }
                  tbody tr.total-row {
                    background-color: #ffffff !important;
                    color: #1e40af !important;
                    font-weight: bold !important;
                  }
                  tbody tr.total-row td {
                    background-color: #ffffff !important;
                  }
                  .company-name{
                    display:flex;
                    justify-content:end;
                  }
                  .text-red-600 {
                    color: #dc2626 !important;
                  }
                  .text-green-600 {
                    color: #16a34a !important;
                  }
                  .text-white {
                    color: white !important;
                  }
                  .text-customBlue {
                    color: #1e40af !important;
                  }
                  @media print {
                    * {
                      -webkit-print-color-adjust: exact !important;
                      print-color-adjust: exact !important;
                      color-adjust: exact !important;
                    }
                    body {
                      margin: 0;
                      padding: 10px;
                    }
                  }
                </style>
              </head>
              <body>
                <div>${content}</div>
                <script>
                  window.onload = function() {
                    window.print();
                    window.onafterprint = window.close;
                  }
                </script>
              </body>
            </html>
          `);

    printWindow.document.close();
  };
// exel handler
const handleFetchExcelData = async (filters) => {
    return apiData;
  };

  const handleExport = async (format) => {
    switch (format) {
      case "excel":
        const data = await handleFetchExcelData(appliedFilters || []);
        exportToExcel(data);
        break;
      case "csv":
        exportToCSV(apiData);
        break;
      case "json":
        exportToJSON(apiData);
        break;
      case "pdf":
        exportToPDF(apiData);
        break;
      default:
        console.log("Invalid format");
    }
  };
  const exportToExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "compare-flash-report.xlsx");
  };

    const exportToCSV = (data) => {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
      const blob = new Blob([csvOutput], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "compare-flash-report.csv";
      link.click();
    };

    const exportToJSON = (data) => {
      const jsonOutput = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonOutput], { type: "application/json;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "compare-flash-report.json";
      link.click();
    };
    const exportToPDF = (data) => {
      const doc = new jsPDF();
      const formatHeader = (header) => {
        return header
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      };
      const formatNumberPDF = (number) => {
        if (number === null || number === undefined || number === '' || isNaN(Number(number))) return '';
        return Number(number).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      };
      const addHeaderAndFooter = (companyName) => {
        const pageCount = doc.internal.getNumberOfPages();
        const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        if (companyName) {
          doc.text(companyName, 14, 12);
        }
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        const footer = `Page ${pageNumber} of ${pageCount}`;
        doc.text(footer, (doc.internal.pageSize.getWidth() - doc.getTextWidth(footer)) / 2, doc.internal.pageSize.getHeight() - 10);
      };

      const companyName = data && data.length > 0 ? data[0]?.company_name || 'Report' : 'Report';

      if (!data || data.length === 0) {
        doc.text('No data available', 14, 20);
        doc.save('flash-report.pdf');
        return;
      }
      const columns = Object.keys(data[0]).map((key) => ({ header: formatHeader(key), dataKey: key }));
      const numericKeys = ['opening_balance', 'debit', 'credit', 'closing_balance', 'Rev', 'Cov', 'AvgSpd'];
      const body = data.map((item) => {
        const newItem = { ...item };
        numericKeys.forEach((k) => {
          if (k in newItem) newItem[k] = formatNumberPDF(newItem[k]);
        });
        return newItem;
      });
  
      const boldLabels = ['revenue by session', 'session', 'location'];
  
      doc.autoTable({
        columns,
        body,
        startY: 28,
        theme: 'grid',
        headStyles: {
          fillColor: [16, 52, 96], 
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8,
        },
        styles: {
          cellPadding: 1.5,
          fontSize: 7,
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
        },
        didParseCell: (dataCell) => {
          if (dataCell.section === 'body') {
            const row = dataCell.row.raw || {};
            const normalizedLabel = (row.section || '').toLowerCase().trim().replace(/\s+/g, ' ');
  
            // Parse number helper function
            const parseNumber = (v) => {
              if (v === null || v === undefined) return null;
              let s = String(v).trim();
              if (s === "") return null;
              const isParen = /^\(.*\)$/.test(s);
              s = s.replace(/^[()\s]+|[()\s%]+$/g, "").replace(/,/g, "");
              if (s === "") return null;
              const n = Number(s);
              if (isNaN(n)) return null;
              return isParen ? -n : n;
            };

            const isTotalRow = row.gl_code === "Total";
            const isCompanyRow = row.section === "Flash Compare Report" || row.label === "Company:";
            const isSectionHeader = ["Revenue & Spend", "Avg Spend By Session", "Revenue By Session", "Covers By Session", 
              "Revenue By Category", "Revenue By Location", "Covers By Location", "Avg Spend By Location", "Sales by Day Average"].includes(row.section);
            const skipColoring = isCompanyRow || isTotalRow || isSectionHeader;
  
            if (isCompanyRow || row.section === 'Flash Compare Report') {
              dataCell.cell.styles.fillColor = [16, 52, 96];
              dataCell.cell.styles.textColor = [255, 255, 255];
              dataCell.cell.styles.fontStyle = 'bold';
            }
            else if (isTotalRow) {
              dataCell.cell.styles.fillColor = [255, 255, 255];
              dataCell.cell.styles.textColor = [16, 52, 96];
              dataCell.cell.styles.fontStyle = 'bold';
            }
            else if (isSectionHeader) {
              dataCell.cell.styles.fillColor = [16, 52, 96];
              dataCell.cell.styles.textColor = [255, 255, 255];
              dataCell.cell.styles.fontStyle = 'bold';
            }
            else {
              if (dataCell.row.index % 2 === 0) {
                dataCell.cell.styles.fillColor = [255, 255, 255];
              } else {
                dataCell.cell.styles.fillColor = [243, 244, 246];
              }
              const columnIndex = dataCell.column.index;
              const columnName = columns[columnIndex]?.dataKey;
              
              if (columnName === 'diff_value' || columnName === 'diff_pct') {
                const value = parseNumber(row[columnName]);
                if (value !== null && !skipColoring) {
                  if (value < 0) {
                    dataCell.cell.styles.textColor = [220, 38, 38]; 
                  } else if (value > 0) {
                    dataCell.cell.styles.textColor = [22, 163, 74]; 
                  }
                }
              }
            }
          }
        },
        didDrawPage: () => {
          addHeaderAndFooter(companyName);
        },
      });
  
      doc.save('flash-report.pdf');
    };



// apply filters handler
  const handleApplyFilters = (filters) => {
    setCompanyId(filters?.value1);
    const company_Id = filters?.[0].value1 || companyId;

    const filterName = (dateFilter).toLowerCase();

    console.log("Applied Filters:", dateFilter, company_Id);

    getFlashReport(filters);
  };
  const options = [
    { label: "Equal", value: "equal" },
    { label: "Contains", value: "contains" },
    { label: "Start with", value: "start_with" },
    { label: "End with", value: "end_with" }
  ];

  const fields = [
    {
      name: "company_name",
      label: "Company name",
      type: "textServer",
      aliases: "",

      endpoint: `${API_ENDPOINTS.USER_TO_COMPANY}`,
      responseWhich: "result",
      ValueKey: "company_id",
      filterQueryKey: "company_id",
      serverDefaultValue: company,
      baseFilters: [
        {
          key: "auc.user_id",
          operator: "equal",
          value1: UserId,
          logical: "",
        },
        {
          key: "auc.status",
          operator: "equal",
          value1: "1",
          logical: "",
        },
      ],
    },
  ];

  const getFlashReport = (filters) => {
    const company_id = filters?.[0].value1;
    setCompanyId(company_id);
    const header = {
      "filter_name": (dateFilter).toLowerCase(),
      "company_id": company_id || 11,
    }
    mutate({
      "header": header
    }, {
      onSuccess: (response) => {
        setApiData(response?.data || []);
        if (response?.onSuccess) {
          response.onSuccess(response);
          setApiData(response?.data || []);
        }
      },
      onError: (error) => {
        console.error("Error fetching flash report:", error);
      },
    });
  };

  const HeaderFilterSection = () => {
    const filterOptions = [
      { label: "Yesterday vs LW", value: "YDAY_VS_LW" },
      { label: "This Week vs Prev", value: "TW_VS_PW" },
      { label: "Prev Week vs Before", value: "PW_VS_WB" },
      { label: "MTD vs Prev MTD", value: "MTD_VS_PM" },
      { label: "MTD vs LY", value: "MTD_VS_LY" },
      { label: "Last Month vs LY", value: "LM_VS_LY" },
      { label: "YTD vs LY", value: "YTD_VS_LY" },
      { label: "Prev Year vs Before", value: "PY_VS_YB" },
    ];

    return (
      <div className="mt-1" >
        <p>Date Filter</p>
        <div className="bg-white border rounded-md mb-2.5 mt-1">
          <Select
            style={{ width: "100%" }}
            className="custom-select"
            placeholder="Select Date Filter"
            value={dateFilter}
            options={filterOptions}
            onChange={(value) => setDateFilter(value)}
          />
        </div>
      </div>
    );
  };
  useEffect(() => {
    if (apiData.length > 1) {
      setIsFilterWidth(true);
    }
  }, [apiData]);
  return (
    <>
      <h1 className="text-size text-color font-headingweight mb-2">
        Compare Flash Report
      </h1>
      <div className="flex bg-gray-100 p-1 rounded-lg">
        <button onClick={() => setActiveView("table")} className={`flex items-center gap-2 px-4 py-1.5 rounded-md transition-all ${activeView === "table" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`}>
          <RiTableFill /> Table
        </button>
        <button onClick={() => setActiveView("dashboard")} className={`flex items-center gap-2 px-4 py-1.5 rounded-md transition-all ${activeView === "dashboard" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`}>
          <MdDashboard /> Dashboard
        </button>
      </div>

      <div className="flex gap-2 items-center">
        <button
          className="flex bg-customBlue text-btnsize rounded-radiusRegular shadow-md text-white font-regularweight duration-300 gap-1 items-center mb-2 px-2 py-1 transition-all"
          onClick={() => setIsFilterWidth(!isFilterWidth)}
        >
          {isFilterWidth ? (
            <>
              <MdFilterAlt size={16} /> Filters
            </>
          ) : (
            <>
              <MdFilterAltOff size={16} /> Filters
            </>
          )}
        </button>
      </div>

      <div className="p-3 bg-menu-theme mt-2 shadow rounded-md overflow-hidden" style={{ height: "90%", overflowY: "auto" }}>
        <div className="gap- lg:flex relative">
          <div
            className={`transform transition-all duration-300 ease-in-out 
              ${isFilterWidth ? "w-0 opacity-0 -translate-x-full" : "opacity-100 translate-x-0 w-96 shrink-0"} sticky top-4`}
          >
            <div className="h-full mb-4 md:pr-4">
              <DynamicFilter
                fieldGrid={options}
                fields={fields}
                onApply={handleApplyFilters}
                parentStateSet={setIsFilterWidth}
                addpartentSectionAppend={HeaderFilterSection()}
                watchName="company_name"
                className="bg-white border border-gray-100 h-full p-4 rounded-radiusRegular shadow-lg"
              />
            </div>
          </div>

          <div className="flex-1 transition-all duration-300 xs:mt-2 sm:mt-2 md:mt-2 lg:mt-0">
            {activeView === "table" ? (
              isPending ? <Loader /> : apiData && apiData.length >= 1 ? (
                <div>
                  <div className="flex justify-content-end gap-2 mb-2" >
                    <CustomButton
                      icon={"Excel"}
                      btntext={<FaRegFileExcel className="me-1" />}
                      handleClick={() => handleExport("excel")}
                      isLoading={excelPending}
                    />
                  <CustomButton
                    icon={"CSV"}
                    btntext={<FaFileCsv className="me-1" />}
                    handleClick={() => handleExport("csv")}
                  />
                  <CustomButton
                    icon={"JSON"}
                    btntext={<BsFiletypeJson className="me-1" />}
                    handleClick={() => handleExport("json")}
                  />
                  <CustomButton
                    icon={"PDF"}
                    btntext={<FaRegFilePdf className="me-1" />}
                    handleClick={() => handleExport("pdf")}
                  />
                  <CustomButton
                    icon={"Print"}
                    btntext={<FaPrint className="me-1" />}
                    handleClick={handlePrint}
                  />
                </div>
                <div
                  ref={printRef}
                  className="border border-gray-300 rounded-radiusRegular shadow-lg overflow-hidden "
                >
                  <div className="print-scrollable" >
                    <table className="table-auto text-gray-700 text-left text-sm min-w-full border border-gray-300 ">

                      <tbody>
                        {apiData.map((row, index) => {
                          const isTotalRow = row.gl_code === "Total";
                          const isCompanyRow =
                            row.section === "Flash Compare Report" || row.label === "Company:";
                          const isSectionHeader = row.section === "Revenue & Spend" || row.section === "Avg Spend By Session" || row.section === "Revenue By Session" || row.section === "Covers By Session"
                            || row.section === "Revenue By Category" || row.section === "Revenue By Location" || row.section === "Covers By Location" || row.section === "Avg Spend By Location" || row.section === "Sales by Day Average";

                          const boldLabels = row.section === "Total"

                          const parseNumber = (v) => {
                            if (v === null || v === undefined) return null;
                            let s = String(v).trim();
                            if (s === "") return null;
                            const isParen = /^\(.*\)$/.test(s);
                            s = s.replace(/^[()\s]+|[()\s%]+$/g, "").replace(/,/g, "");
                            if (s === "") return null;
                            const n = Number(s);
                            if (isNaN(n)) return null;
                            return isParen ? -n : n;
                          };
                          const skipColoring = isCompanyRow || isTotalRow || isSectionHeader;
                          const parsedDiffValue = parseNumber(row.diff_value);
                          const parsedDiffPct = parseNumber(row.diff_pct);

                          const diffValueColor = !skipColoring && parsedDiffValue !== null
                            ? (parsedDiffValue < 0 ? 'text-red-600' : 'text-green-600')
                            : '';

                          const diffPctColor = !skipColoring && parsedDiffPct !== null
                            ? (parsedDiffPct < 0 ? 'text-red-600' : 'text-green-600')
                            : '';

                          return (
                            <tr
                              key={index}
                              className={`${isCompanyRow
                                  ? "bg-[#094998] text-white font-bold company-row"
                                  : isTotalRow
                                    ? "bg-white text-customBlue border font-bold total-row"
                                    : isSectionHeader
                                      ? "bg-[#094998] text-white font-bold company-row"
                                      : boldLabels
                                        ? "bg-gray-100 font-bold"
                                        : index % 2 === 0
                                          ? "bg-white"
                                          : "bg-gray-50"
                                }`}
                            >
                              <td className="px-4 py-2 border border-gray-300">
                                {row.section}
                              </td>
                              <td className="px-4 py-2 border border-gray-300">
                                {row.label}
                              </td>
                              <td className="px-4 py-2 border border-gray-300">
                                {row.previous_value}
                              </td>
                              <td className="px-4 py-2 border border-gray-300">
                                {row.current_value}
                              </td>
                              <td className={`px-4 py-2 border border-gray-300 ${diffValueColor}`}>
                                {row.diff_value}
                              </td>
                              <td className={`px-4 py-2 border border-gray-300 ${diffPctColor}`}>
                                {row.diff_pct}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                     
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col bg-white justify-center p-8 rounded border items-center">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="text-gray-300 mb-2" height="40" width="40" xmlns="http://www.w3.org/2000/svg">
                  <path d="M121 32C91.6 32 66 52 58.9 80.5L1.9 308.4C.6 313.5 0 318.7 0 323.9L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-92.1c0-5.2-.6-10.4-1.9-15.5l-57-227.9C446 52 420.4 32 391 32L121 32zm0 64l270 0 48 192-51.2 0c-12.1 0-23.2 6.8-28.6 17.7l-14.3 28.6c-5.4 10.8-16.5 17.7-28.6 17.7l-120.4 0c-12.1 0-23.2-6.8-28.6-17.7l-14.3-28.6c-5.4-10.8-16.5-17.7-28.6-17.7L73 288 121 96z"></path>
                </svg>
                <p>No data available. Please apply a filter to see the results.</p>
              </div>
            )
          ) : (
              <Test apidata={apiData} />
            )}
           
          </div>
        </div>
      </div>
      
      <style>
        {`
          .custom-select.ant-select {
            box-shadow: none !important;
          }

          .custom-select.ant-select-focused {
            box-shadow: none !important;
            border-color: transparent !important;
          }

          .custom-select .ant-select-selector {
            box-shadow: none !important;
            border-color: transparent !important;
          }

          .custom-select .ant-select-selection-placeholder {
            color: #9CA3AF !important;
          }


          .filterdata .operater {
            display: none !important;
          }

          .filterdata {
            overflow: visible !important;
          }

          .MuiAccordionDetails-root {
            overflow: visible !important;
          }

          .MuiAccordion-root {
            overflow: visible !important;
          }

          /* React select menu on top */
          .filterdata .css-1nmdiq5-menu,
          .filterdata .css-26l3qy-menu {
            z-index: 9999 !important;
          }
`}
      </style>

    </>

  );

};
export default withPermissionCheck(CompareFlashReport, "trial-balance");