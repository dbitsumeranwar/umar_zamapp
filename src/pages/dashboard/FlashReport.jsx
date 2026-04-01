import { Select } from "antd";
import jsPDF from "jspdf";
import "jspdf-autotable";
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
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { API_ENDPOINTS } from "../../apis/client/api-endpoints";
import { useGlobelApi } from "../../apis/useProduct/useCommon";
import CustomButton from "../../components/button/CustomButton";
import DynamicFilter from "../../components/form-elements/DynamicFilter";
import { getFromLocalStorage, saveToLocalStorage } from "../../config/crypto-file";
import withPermissionCheck from "../../config/withPermissionCheck";
import useDebounce from "../../hooks/useDebounce";
import { getMonthNumber } from "../../utils/helper.function";
import { useForm } from "react-hook-form";
import Loader from "../../components/Loader";
const FlashSalesReport = () => {
  const { mutate, isPending } = useGlobelApi(API_ENDPOINTS.GET_FLASH_REPORT);
  const { mutate: fetchDataForExcel, isPending: excelPending } = useGlobelApi(
    API_ENDPOINTS.GET_FLASH_REPORT
  );
  const {
    mutate: fiscalYearMonth,
    isPending: fiscalYearMonthLoading,
    data: fiscalYearMonthData,
  } = useGlobelApi(API_ENDPOINTS.GET_FLASH_REPORT);

  const { mutate: getFlashReport } = useGlobelApi(API_ENDPOINTS.GET_FLASH_REPORT);
  const { watch } = useForm();
  const rootFolder = import.meta.env.VITE_ROOT_FOLDER || "";

  const UserId = getFromLocalStorage("UserId");
  const [apiData, setApiData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [jhOption, setJhOption] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterWidth, setIsFilterWidth] = useState(false);
  const [jernalIds, setJernalIds] = useState([]);
  const [childData, setChildData] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [startMonthYear, setStartMonthYear] = useState(null);
  const [jlOption, setJLOption] = useState([]);
  const [endMonthYear, setEndMonthYear] = useState(null);
  const [dateFilter, setDateFilter] = useState("yesterday");
  const printRef = useRef();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);


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
    XLSX.writeFile(workbook, "flash-report.xlsx");
  };

  const exportToCSV = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvOutput], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "flash-report.csv";
    link.click();
  };
  const exportToJSON = (data) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "flash-report.json";
    link.click();
  };

  const exportToPDF = (data) => {
    const doc = new jsPDF();

    // Function to capitalize first letter of each word and remove underscores
    const formatHeader = (header) => {
      return header
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    };

    // Function to format numbers with two decimals and commas
    const formatNumber = (number) => {
      if (number === null || number === undefined || number === '' || isNaN(Number(number))) return '';
      return Number(number).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    };

    // Function to add headers and footers to each page
    const addHeaderAndFooter = (companyName, start, end) => {
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

    // Date Filter and fetch company name
    getFlashReport(
      {
        header: {
          date_filter: 'yesterday',
          custom_start: null,
          custom_end: null,
        },
      },
      {
        onSuccess: (response) => {
          const companyName = response?.data?.[0]?.company_name || '';

          const monthData = fiscalYearMonthData?.data?.map((item) => {
            return {
              value: item?.record_id,
              label: `${getMonthNumber(item.month_name)}-${item.month_year}`,
            };
          }) || [];

          const start = monthData.find(item => item.value == startMonthYear)?.label || 'N/A';
          const end = monthData.find(item => item.value == endMonthYear)?.label || 'N/A';

          if (!data || data.length === 0) {
            doc.text('No data available', 14, 20);
            doc.save('flash-report.pdf');
            return;
          }

          // Build columns so autoTable can keep raw row objects for styling
          const columns = Object.keys(data[0]).map((key) => ({ header: formatHeader(key), dataKey: key }));

          // Prepare body with formatted numeric fields
          const numericKeys = ['opening_balance', 'debit', 'credit', 'closing_balance', 'Rev', 'Cov', 'AvgSpd'];
          const body = data.map((item) => {
            const newItem = { ...item };
            numericKeys.forEach((k) => {
              if (k in newItem) newItem[k] = formatNumber(newItem[k]);
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

                if (row.section === 'Flash Sales Report' || row.label === 'Company:') {
                  dataCell.cell.styles.fillColor = [16, 52, 96];
                  dataCell.cell.styles.textColor = [255, 255, 255];
                  dataCell.cell.styles.fontStyle = 'bold';
                }
                else if (row.gl_code === 'Total') {
                  dataCell.cell.styles.fillColor = [255, 255, 255];
                  dataCell.cell.styles.textColor = [16, 52, 96];
                  dataCell.cell.styles.fontStyle = 'bold';
                }
                else if (boldLabels.includes(normalizedLabel)) {
                  dataCell.cell.styles.fillColor = [243, 244, 246];
                  dataCell.cell.styles.fontStyle = 'bold';
                }
                else {
                  if (dataCell.row.index % 2 === 0) {
                    dataCell.cell.styles.fillColor = [255, 255, 255];
                  } else {
                    dataCell.cell.styles.fillColor = [243, 244, 246];
                  }
                }
              }
            },
            didDrawPage: () => {
              addHeaderAndFooter(companyName, start, end);
            },
          });

          doc.save('flash-report.pdf');
        },
        onError: (error) => {
          console.error('Error fetching company name:', error);

          const monthData = fiscalYearMonthData?.data?.map((item) => {
            return {
              value: item?.record_id,
              label: `${getMonthNumber(item.month_name)}-${item.month_year}`,
            };
          }) || [];

          const start = monthData.find(item => item.value == startMonthYear)?.label || 'N/A';
          const end = monthData.find(item => item.value == endMonthYear)?.label || 'N/A';

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
              if (k in newItem) newItem[k] = formatNumber(newItem[k]);
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
                if (row.section === 'Flash Sales Report' || row.label === 'Company:') {
                  dataCell.cell.styles.fillColor = [16, 52, 96];
                  dataCell.cell.styles.textColor = [255, 255, 255];
                  dataCell.cell.styles.fontStyle = 'bold';
                } else if (row.gl_code === 'Total') {
                  dataCell.cell.styles.fillColor = [255, 255, 255];
                  dataCell.cell.styles.textColor = [16, 52, 96];
                  dataCell.cell.styles.fontStyle = 'bold';
                } else if (boldLabels.includes(normalizedLabel)) {
                  dataCell.cell.styles.fillColor = [243, 244, 246];
                  dataCell.cell.styles.fontStyle = 'bold';
                } else {
                  if (dataCell.row.index % 2 === 0) {
                    dataCell.cell.styles.fillColor = [255, 255, 255];
                  } else {
                    dataCell.cell.styles.fillColor = [243, 244, 246];
                  }
                }
              }
            },
            didDrawPage: () => {
              addHeaderAndFooter('Company Name', start, end);
            },
          });

          doc.save('flash-report.pdf');
        },
      }
    );
  };

  const handleApplyFilters = (filters) => {
    const dateFilterFromDynamic = filters.find(f => f.key === "date_filter");
    const finalDateFilter = dateFilterFromDynamic?.value1 || dateFilter;

    getFlashReport(
      {
        header: {
          date_filter: finalDateFilter,
          custom_start: null,
          custom_end: null,
        },
      },
      {
        onSuccess: (response) => {
          setApiData(response?.data || []);
        },
      }
    );
  };

  const handlefetchYear = async () => {
    fiscalYearMonth({
      filters: [
        { key: "c.id", value1: childData, value2: value },
      ],
      limit: 0,
      offset: 0,
      orderby: "fcm.month_year,fcm.start_date_month ASC",
    });
  };

  const handlePrint = () => {
    getFlashReport(
      {
        header: {
          date_filter: "yesterday",
          custom_start: null,
          custom_end: null,
        },
      },

      {
        onSuccess: (response) => {
          const companyName = response?.data?.[0]?.company_name || "";
          const monthData = fiscalYearMonthData?.data?.map((item) => {
            return {
              value: item?.record_id,
              label: `${getMonthNumber(item.month_name)}-${item.month_year}`,
            };
          }) || [];
          const start = monthData.find(item => item.value == startMonthYear)?.label || "N/A";
          const end = monthData.find(item => item.value == endMonthYear)?.label || "N/A";
          const content = printRef.current.innerHTML;

          const printWindow = window.open("", "_blank");
          if (!printWindow) return;

          printWindow.document.write(`
            <html>
              <head>
                <title>Print Data</title>
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
                    padding: 4px;
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
        },
      }
    );
  };
const HeaderFilterSection = () => {
  const dateOptions = [
   { value: "today", label: "Today" },
   { value: "yesterday", label: "Yesterday" },
   { value: "current week", label: "Current Week" },
   { value: "last week", label: "Last Week" },
   { value: "current month till to date", label: "Current Month Till Date" },
   { value: "previous month", label: "Previous Month" },
   { value: "last three months", label: "Last Three Months" },
  ];

  return (
   <div className="mt-1">
    <p>Date Filter</p>
    <div className="bg-white border rounded-md mb-2.5 mt-1">
     <Select
      style={{ width: "100%" }}
      className="custom-select"
      placeholder="Select Date Filter"
      value={dateFilter}
      options={dateOptions}
      onChange={(value) => setDateFilter(value)}
     />
    </div>

   </div>
  );
 };

  const handleFetchdataJh = (searchTerm) => {
    // Function to fetch data based on search term
    // Implementation as needed
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      handleFetchdataJh(debouncedSearchTerm);
    } else {
      setJhOption([]);
    }
  }, [debouncedSearchTerm]);
  useEffect(() => {
    handlefetchYear();
  }, [childData]);
  const sanitizeAndFormat = (num) => {
    if (num === "" || num === null || isNaN(num)) {
      return "";
    }
    return parseFloat(num).toFixed(3);
  };
  const formattedNumber = (number) => {
    return Math.floor(number); // Removes decimal part
  };

  const formatNumber = (number) => {
    if (!number) return "";
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ".00";
  };

  useEffect(() => {
    handleApplyFilters([]);
  }, []);
  console.log(appliedFilters, "appliedFilters");

  return (
    <>
      <div className="overflow-hidden">
        <h2 className="text-black text-lg font-semibold mb-2" style={{ fontWeight: "bold" }}>
          {" "}
          Flash Sales Report
        </h2>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setIsFilterWidth(!isFilterWidth)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 
             text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300"
          >
            {isFilterWidth ? (
              <>
                <MdFilterAlt size={18} />
                Show Filters
              </>
            ) : (
              <>
                <MdFilterAltOff size={18} />
                Hide Filters
              </>
            )}
          </button>
        </div>
        <div className="gap- lg:flex relative">
          <div
            className={`transform transition-all duration-300 ease-in-out 
        ${isFilterWidth
                ? "w-0 opacity-0 -translate-x-full"
                : " opacity-100 translate-x-0 w-96 shrink-0"
              } 
      sticky top-4 `}
          >
            <div className="h-full mb-2 md:pr-4">
                <DynamicFilter
                        fields={[]}
                        onApply={handleApplyFilters}
                        fieldGrid="grid-cols-1"
                        parentStateSet={setIsFilterWidth}
                        addpartentSectionAppend={HeaderFilterSection()}
                        watchName="company_name"
                        className="bg-white border border-gray-100 h-full p-4 rounded-radiusRegular shadow-lg"
                      />
            </div>
          </div>

          {/* Main Content Area */}
          <div
            className={`flex-1 transition-all duration-300 xs:mt-2 sm:mt-2 md:mt-2 lg:mt-0  ${isFilterWidth ? "" : ""
              }`}
          >
            {isPending ? <Loader /> : apiData && apiData.length >= 1 ? (
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
                  className="border border-gray-300 rounded-radiusRegular shadow-lg overflow-auto whitespace-nowrap"
                >
                  <table className="table-auto text-gray-700 text-left text-sm min-w-full border border-gray-300">
                    <thead
                      className="sticky top-0 z-10"
                      style={{ color: "black", backgroundColor: "white" }}
                    >
                      <tr>
                        <th className="px-4 py-2 border border-gray-300">Section</th>
                        <th className="px-4 py-2 border border-gray-300">Label</th>
                        <th className="px-4 py-2 border border-gray-300">Rev</th>
                        <th className="px-4 py-2 border border-gray-300">Cov</th>
                        <th className="px-4 py-2 border border-gray-300">Avg Spd</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apiData.map((row, index) => {
                        const isTotalRow = row.gl_code === "Total";
                        const isCompanyRow =
                          row.section === "Flash Sales Report" || row.label === "Company:";
                          const boldLabels = ["revenue by session", "session", "location"];
                          const normalizedLabel = row.section?.toLowerCase()?.trim().replace(/\s+/g, ' ') || "";
                            const isBoldRow = boldLabels.includes(normalizedLabel);

                        return (
                        <tr
                          key={index}
                          className={`${
                            isCompanyRow
                              ? "bg-[#103460] text-white font-bold company-row"
                              : isTotalRow
                              ? "bg-white text-customBlue border font-bold total-row"
                              : isBoldRow
                              ? "bg-gray-100 font-bold text-black bold-section"
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
                              {formatNumber(formattedNumber(row.Rev))}
                            </td>
                            <td className="px-4 py-2 border border-gray-300">
                              {formatNumber(formattedNumber(row.Cov))}
                            </td>
                            <td className="px-4 py-2 border border-gray-300">
                              {formatNumber(formattedNumber(row.AvgSpd))}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex flex-col bg-white justify-center p-4 rounded-radiusRegular items-center">
                <FaInbox size={40} className="text-color" />
                <p>
                  {" "}
                  No data available. Please apply a filter to see the results.
                </p>
              </div>
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

export default withPermissionCheck(FlashSalesReport, "trial-balance");
