import React, { useState, useTransition } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Companies from "./detail/Companies";
import UpdateCompany from "./UpdateCompany";
import moment from "moment";
import Department from "./detail/Department";
import { FaAngleLeft } from "react-icons/fa6";
import CustomBreadcrumb from "../../components/CustomBreadcrumb";
import { getFromSessionStorage } from "../../config/crypto-file";
import InterCompanyGl from "./inter-company-gl/InterCompanyGl";

const CompanyDetail = () => {
  const location = useLocation();
  const CompanyData = getFromSessionStorage("CompanyData");
  console.log("🚀 ~ CompanyDetail ~ CompanyData:", CompanyData);
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState("General Data");
  const [isPending, startTransition] = useTransition();
  const handleTabClick = (tab) => {
    startTransition(() => {
      setCurrentTab(tab);
    });
  };
  const tabs = ["General Data", "Users", "Department","InterCompanyGl"];

  const breadcrumbItems = [
    { title: "Company", link: "companieslist" },
    { title: "Company Detail" },
  ];
  return (
    <div>
      <CustomBreadcrumb items={breadcrumbItems} />
      <h1 className="mb-1 text-size text-color font-headingweight">Company Detail</h1>

      <div className=" flex gap-1 items-center">
        <p className="text-color font-regularweight">
          Name:{" "}
        </p>
        <span className="text-color">
          {CompanyData?.company_name}
        </span>
      </div>
      <ul className="user_profile-tabs ps-2">
        {tabs.map((tab) => (
          <li className="" key={tab}>
            <button
              className={`relative text-base  ${
                currentTab === tab ? "active font-bold" : " "
              } `}
              onClick={() => handleTabClick(tab)}
              disabled={isPending} // Disable button during transition
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>
      <div className="tab-content border p-3 bg-light relative">
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
            <div className="text-customBlue">Loading...</div>
          </div>
        )}
        <div style={{ display: currentTab === "General Data" ? "block" : "none" }}>
          <UpdateCompany CompanyData={CompanyData} />
        </div>
        <div style={{ display: currentTab === "Users" ? "block" : "none" }}>
          <Companies CompanyData={CompanyData} />
        </div>
        <div style={{ display: currentTab === "Department" ? "block" : "none" }}>
          <Department CompanyData={CompanyData} />
        </div>
        <div style={{ display: currentTab === "InterCompanyGl" ? "block" : "none" }}>
          <InterCompanyGl CompanyData={CompanyData} />
        </div>
      </div>
      {currentTab === "General Data" && (
        <div className="mt-3">
          <h2 className="capitalize text-size text-color font-headingweight">
            other information
          </h2>
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
            <div className="flex gap-2">
              <dt className="text-color font-regularweight">Created At :</dt>
              <dd className="text-color ">
  {CompanyData?.created_at ? moment(CompanyData.created_at).format("DD-MM-YYYY") : "N/A"}
</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-color font-regularweight">Updated At :</dt>
              <dd className="text-color ">{CompanyData?.updated_at ? moment(CompanyData.updated_at).format("DD-MM-YYYY") : "N/A"}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-color font-regularweight">Created By :</dt>
              <dd className="text-color ">{CompanyData?.user_name}</dd>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDetail;