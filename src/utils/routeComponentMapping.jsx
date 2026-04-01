import { ChartofAccounts } from "../pages/accounting/chartOfAccounts";
import DashboardPage from "../pages/DashboardPage";

import CompareFlashReport from "../pages/dashboard/CompareFlashReport";
import FlashSalesReport from "../pages/dashboard/FlashReport";

const rootFolder = import.meta.env.VITE_ROOT_FOLDER || "";
export const routeComponentMapping = {
  [rootFolder + "/dashboard"]: { component: DashboardPage, name: "Dashboard" },
   [rootFolder + "/flash-sales-report"]: { component: FlashSalesReport, name: "Flash Sales Report" },
   [rootFolder + "/compare-flash-report"]: { component: CompareFlashReport, name: "Compare Flash Report" },
  // [rootFolder + "/chartofaccounts"]: {
  //   component: ChartofAccounts,
  //   name: "Chart of Accounts",
  // },
  // [rootFolder + "/inter-company-jv"]: {
  //   component: InterCompantJV,
  //   name: "Inter Company JV",
  // },
  // [rootFolder + "/create-inter-company-jv"]: {
  //   component: CreateInterCompantJV,
  //   name: "Create Inter Company JV",
  // },
  // [rootFolder + "/chartofaccounts"]: {
  //   component: ChartofAccounts,
  //   name: "Chart of Accounts",
  // },
  // [rootFolder + "/user-list"]: { component: NewUserList, name: "User list" },
  // [rootFolder + "/updateUser"]: { component: UpdateUser, name: "Update User" },
  // [rootFolder + "/user-profile"]: {
  //   component: UserProfile,
  //   name: "User Profile",
  // },
  // [rootFolder + "/adduser"]: { component: AddUser, name: "Add User" },
  // [rootFolder + "/addcompany"]: {
  //   component: Createcompany,
  //   name: "Add Company",
  // },
  // [rootFolder + "/update-company"]: {
  //   component: UpdateCompany,
  //   name: "Update Company",
  // },
  // [rootFolder + "/companieslist"]: {
  //   component: CompanyList,
  //   name: "Company List",
  // },
  // [rootFolder + "/company-detail"]: {
  //   component: CompanyDetail,
  //   name: "Company Detail",
  // },
  // [rootFolder + "/add-department"]: {
  //   component: AddDepartment,
  //   name: "Add Department",
  // },
  // [rootFolder + "/department-list"]: {
  //   component: DepartmentList,
  //   name: "Department List",
  // },
  // [rootFolder + "/department-detail"]: {
  //   component: DepartmentDetail,
  //   name: "Department Detail",
  // },
  // [rootFolder + "/update-department"]: {
  //   component: UpdateDepartment,
  //   name: "Update Department",
  // },
  // [rootFolder + "/add-module"]: { component: AddModule, name: "Add Module" },
  // [rootFolder + "/update-module"]: {
  //   component: UpdateModule,
  //   name: "Update Module",
  // },
  // [rootFolder + "/module-list"]: { component: ModuleList, name: "Module List" },
  // [rootFolder + "/update-sub-module"]: {
  //   component: UpdateSubModule,
  //   name: "Update Sub Module",
  // },
  // [rootFolder + "/sub-module-list"]: {
  //   component: SubModuleList,
  //   name: "Sub Module List",
  // },
  // [rootFolder + "/add-main-head"]: {
  //   component: AddMainHead,
  //   name: "Add Main Head",
  // },
  // [rootFolder + "/main-head-list"]: {
  //   component: MainHeadList,
  //   name: "Main Head List",
  // },
  // [rootFolder + "/update-main-head"]: {
  //   component: UpdateMainHead,
  //   name: "Update Main Head",
  // },
  // [rootFolder + "/add-sub-head"]: {
  //   component: AddSubHead,
  //   name: "Add Sub Head",
  // },
  // [rootFolder + "/sub-head-list"]: {
  //   component: SubHeadList,
  //   name: "Sub Head List",
  // },
  // [rootFolder + "/sub-head-detail"]: {
  //   component: Detail,
  //   name: "Sub Head Detail",
  // },
  // [rootFolder + "/add-coa"]: { component: AddCoa, name: "Add CoA" },
  // [rootFolder + "/coa-list"]: { component: CoaList, name: "CoA List" },
  // [rootFolder + "/update-coa"]: { component: UpdateCoa, name: "Update CoA" },
  // [rootFolder + "/journal-voucher"]: {
  //   component: JournalVoucher,
  //   name: "Journal Voucher",
  // },
  // // [rootFolder + "/add-journal-voucher"]: {
  // //   component: EditCreateJournalVoucher,
  // //   name: "Add Journal Voucher",
  // // },
  // [rootFolder + "/add-journal-voucher"]: {
  //   component: CreateJournalVoucher,
  //   name: "Add Journal Voucher",
  // },
  // [rootFolder + "/edit-journal-voucher"]: {
  //   component: CreateJournalVoucher,
  //   name: "Edit Journal Voucher",
  // },
  // // [rootFolder + "/edit-journal-voucher"]: {
  // //   component: EditCreateJournalVoucher,
  // //   name: "Edit Journal Voucher",
  // // },
  // [rootFolder + "/add-fiscal-year"]: {
  //   component: AddFiscalYear,
  //   name: "Add Fiscal Year",
  // },
  // [rootFolder + "/fiscal-year"]: {
  //   component: FiscalYearList,
  //   name: "Fiscal Year List",
  // },
  // [rootFolder + "/fiscal-year-months-list"]: {
  //   component: FiscalYearMonth,
  //   name: "Fiscal Year Months List",
  // },
  // [rootFolder + "/add-tax"]: { component: AddTax, name: "Add Tax" },
  // [rootFolder + "/tax-list"]: { component: TaxList, name: "Tax List" },
  // [rootFolder + "/tax-detail"]: { component: TaxDetail, name: "Tax Detail" },
  // [rootFolder + "/create-supplier"]: {
  //   component: AddSuppliers,
  //   name: "Create Supplier",
  // },
  // [rootFolder + "/supplier-list"]: {
  //   component: SupplierList,
  //   name: "Supplier List",
  // },
  // [rootFolder + "/supplier-detail"]: {
  //   component: SupplierDetail,
  //   name: "Supplier Detail",
  // },
  // [rootFolder + "/supplier-Invoice"]: {
  //   component: SupplierInvoice,
  //   name: "Supplier Invoice",
  // },
  // [rootFolder + "/edit-supplier-Invoice"]: {
  //   component: CreateSupplierInvoice,
  //   name: "Edit Supplier Invoice",
  // },
  // [rootFolder + "/trial-balance"]: {
  //   component: TrailBalance,
  //   name: "Trial Balance",
  // },
  // [rootFolder + "/balance-sheet"]: {
  //   component: BalanceSheet,
  //   name: "Balance Sheet",
  // },
  // [rootFolder + "/journal-ledger"]: {
  //   component: JournalLedger,
  //   name: "Journal Ledger",
  // },
  // [rootFolder + "/supplier-ledger-report"]: {
  //   component: SupplierLedgerReport,
  //   name: "Supplier Ledger",
  // },
  //  [rootFolder + "/ageing-payables"]: {
  //   component: AgeingPayables,
  //   name: "Ageing Payables",
  // },
  // [rootFolder + "/add-unit-master"]: {
  //   component: AddUnitMaster,
  //   name: "Add Unit Master",
  // },
  // [rootFolder + "/unit-master"]: { component: UnitMaster, name: "Unit Master" },
  // [rootFolder + "/update-unit-master"]: {
  //   component: UpdateUnitMaster,
  //   name: "Update Unit Master",
  // },
  // [rootFolder + "/update-unit-list"]: {
  //   component: UpdateUnitList,
  //   name: "Update Unit List",
  // },
  // [rootFolder + "/unit-list"]: { component: UnitList, name: "Unit List" },



  // [rootFolder + "/add-unit-list"]: {
  //   component: AddUnitList,
  //   name: "Add Unit List",
  // },
  // [rootFolder + "/bank-list"]:
  //  { component: BankList,
  //    name: "Bank List" 
  //   },
  //  [rootFolder + "/update-bank-list"]: { 
  //   component: UpdateBankList, 
  //   name: "update Bank List"
  //  },
  //  [rootFolder + "/bank-detail"]: { 
  //   component: BankDetail, 
  //   name: "Bank Detail"
  //  },
  // [rootFolder + "/stock-location-list"]:
  //  { component: StockLocationList,
  //    name: "Stock Location List" 
  //   },
  //  [rootFolder + "/update-stock-location"]: { 
  //   component: UpdateStockLocation, 
  //   name: "Update Stock Location"
  //  },
  //  [rootFolder + "/stock-location-detail"]: { 
  //   component: StockLocationDetail, 
  //   name: "Stock Location Detail"
  //  },
  // [rootFolder + "/add-sub-module"]: {
  //   component: AddSubModule,
  //   name: "Add Sub Module",
  // },
  // [rootFolder + "/add-category"]: {
  //   component: AddCategory,
  //   name: "Add Category",
  // },
  // [rootFolder + "/update-category"]: {
  //   component: UpdateCategory,
  //   name: "Update Category",
  // },
  // [rootFolder + "/categories"]: {
  //   component: CategoryList,
  //   name: "Categories List",
  // },
  // [rootFolder + "/product-list"]: {
  //   component: ProductList,
  //   name: "Product List",
  // },
  // [rootFolder + "/add-recipe"]: {
  //   component: AddRecipe,
  //   name: "Add Recipe",
  // },
  // [rootFolder + "/dept-add-recipe"]: {
  //   component: DeptAddRecipe,
  //   name: "Add Recipe",
  // },
  // [rootFolder + "/recipe-list"]: {
  //   component: RecipeList,
  //   name: "Recipe",
  // },
  // [rootFolder + "/dept-recipe"]: {
  //   component: DeptRecipeList,
  //   name: "Recipe",
  // },
  // [rootFolder + "/payment-list"]: {
  //   component: PaymentList,
  //   name: "Payment",
  // },
  // [rootFolder + "/payment-details"]: {
  //   component: PaymentDetails,
  //   name: "Payment Details",
  // },
  // [rootFolder + "/add-payment"]: {
  //   component: AddPayment,
  //   name: "Add Payment",
  // },
  // [rootFolder + "/add-batch"]: {
  //   component: AddRecipe,
  //   name: "Add Batch",
  // },
  // [rootFolder + "/add-product"]: { component: AddProduct, name: "Add Product" },
  // [rootFolder + "/product-detail"]: {
  //   component: ProductDetail,
  //   name: "Product Detail",
  // },
  // [rootFolder + "/add-product-to-dept"]: {
  //   component: AddProductToDept,
  //   name: "Add Product To Dept",
  // },
  // [rootFolder + "/product-to-dept-detail"]: {
  //   component: Product_Dept_Detail,
  //   name: "Product To Department Detail",
  // },
  // [rootFolder + "/product-to-dept-list"]: {
  //   component: ProductToDeptList,
  //   name: "Product To Dept List",
  // },
  // [rootFolder + "/conversions"]: {
  //   component: ConversionsList,
  //   name: "Conversion List",
  // },
  // [rootFolder + "/add-conversions"]: {
  //   component: AddConversions,
  //   name: "Add Conversions",
  // },
  // [rootFolder + "/update-conversions"]: {
  //   component: UpdateConversions,
  //   name: "Update Conversion",
  // },

  // [rootFolder + "/purchase-order-list"]: {
  //   component: PurchaseOrderList,
  //   name: "Purchase Order",
  // },
  // [rootFolder + "/create-purchase-order"]: {
  //   component: CreatePurchaseOrder,
  //   name: "Create Purchase Order",
  // },
  // [rootFolder + "/update-purchase-order"]: {
  //   component: CreatePurchaseOrder,
  //   name: "Update Purchase Order",
  // },
  // // [rootFolder + "/stocks-overview"]: { component : StocksOverview, name: "Stock Overview" },

  // [rootFolder + "/dep-product-listing"]: {
  //   component: Dept_ProductListing,
  //   name: "Dep product List",
  // },
  // [rootFolder + "/items"]: { component: MasterItems, name: "Master items" },
  // [rootFolder + "/delete-items"]: {
  //   component: MasterDataDelete,
  //   name: "Delete sale items",
  // },
  // [rootFolder + "/sales-plu"]: {
  //   component: SalesPlu,
  //   name: "Sales Plu",
  // },
  // [rootFolder + "/payments"]: {
  //   component: MasterPayments,
  //   name: "Master Payments",
  // },
  // [rootFolder + "/main-product-to-dept-list"]: {
  //   component: MainProduct_DeptList,
  //   name: "Product Department List",
  // },
  // [rootFolder + "/purchase-report"]: {
  //   component: PurchaseReport,
  //   name: "Purchase Report",
  // },
  // [rootFolder + "/purchase-report-dept"]: {
  //   component: PurchaseReportDept,
  //   name: "Purchase Report",
  // },
  // [rootFolder + "/variance-report-dept"]: {
  //   component: VarianceReportDept,
  //   name: "Variance Report",
  // },
  // [rootFolder + "/variance-report"]: {
  //   component: VarianceReport,
  //   name: "Variance Report",
  // },
  // [rootFolder + "/cost-summary-dept"]: {
  //   component: DeptCostSummary,
  //   name: "Cost summary",
  // },
  // [rootFolder + "/cost-summary"]: {
  //   component: CostSummary,
  //   name: "Cost summary",
  // },
  // [rootFolder + "/itemledger"]: {
  //   component: CreateItemLegder,
  //   name: "Item Ledger",
  // },
  // [rootFolder + "/item-ledger-list"]: {
  //   component: ItemLedgerList,
  //   name: "Item Ledger List",
  // },
  // [rootFolder + "/assign-bank-list"]: {
  //   component: AssignBankList,
  //   name: "Assign Bank List",
  // },
  // [rootFolder + "/inventory-adjustment"]: {
  //   component: InventoryAdjustment,
  //   name: "Inventory Adjustment",
  // },
  // [rootFolder + "/inventory-adjustment-list"]: {
  //   component: InventoryAdjustmentList,
  //   name: "Inventory Adjustment List",
  // },
  // [rootFolder + "/create-closing-stock"]: {
  //   component: CreateClosingStock,
  //   name: "Closing Stock",
  // },
  // [rootFolder + "/closing-stock-list"]: {
  //   component: ClosingStockList,
  //   name: "Closing Stock List",
  // },
  // [rootFolder + "/dept-create-closing-stock"]: {
  //   component: DeptCreateClosingStock,
  //   name: "Dept Closing Stock",
  // },
  // [rootFolder + "/dept-closing-stock-list"]: {
  //   component: DeptClosingStockList,
  //   name: "Dept Closing Stock List",
  // },
  //   [rootFolder + "/item-cost-movemnt"]: {
  //   component: ItemCostMovemnt,
  //   name: "Item Cost Movement",
  // },
  //   [rootFolder + "/manual-sales-list"]: {
  //   component: ManualSalesList,
  //   name: "Manual Sales",
  // },
  //   [rootFolder + "/create-manual-sales"]: {
  //   component: CreateManualSales,
  //   name: "Create Manual Sales",
  // },
  // [rootFolder + "/stocks-overview/Update"]: { component : StocksOverview, name: "Stock Overview Update" },
};