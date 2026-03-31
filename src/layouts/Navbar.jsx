import { Link, useNavigate } from "react-router-dom";
import getGreetingMessage from "../utils/greetingHandler";
import { getFromLocalStorage } from "../config/crypto-file";
import { useDispatch } from "react-redux";
import { resetTabs } from "../store/tabSlice";
import { persistor } from "../store/store";

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const isHttps = window.location.protocol === "https:";
  const dispatch = useDispatch();

  const rootFolder = import.meta.env.VITE_ROOT_FOLDER || "";

  const handleLogout = () => {
    dispatch(resetTabs());
    persistor.purge();
    // localStorage.removeItem("authToken");
    // localStorage.removeItem("UserId");
    // localStorage.removeItem("userName");
    localStorage.clear();
    navigate(rootFolder + "/");
  };

  const userName = getFromLocalStorage("userName");
  return (
    <nav
      className="fixed-top pb-1 px-2 bg-menu-theme "
      style={{ maxHeight: '4.5rem' }}
      // className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
      id="layout-navbar"
    >

      <div></div>
      <div
        className="navbar-nav-right d-flex align-items-center px-2"
        id="navbar-collapse"
        style={{ width: "100%" }}
      >
        <div className="d-flex align-items-center gap-3 pt-1" >
          <button
            aria-label="Toggle sidebar"
            onClick={(e) => {
              e.preventDefault();
              toggleSidebar();
            }}
            className="
              d-flex align-items-center justify-content-center 
              p-2 rounded-sm border-0 
              bg-white 
              hover:bg-gray-100 
              focus:outline-none focus:ring-2 focus:ring-blue-400
            "
            style={{
              width: "40px",
              height: "40px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.15)", 
              transition: "background 0.2s ease, box-shadow 0.2s ease",
            }}
          >
            <i className="bx bx-menu bx-sm"></i>
          </button>
          <Link
            aria-label="Navigate to sneat homepage"
            to={rootFolder + "/dashboard"}
            className="app-brand-link"
          >
            <span className="app-brand-logo demo">
              <img
                src={`${isHttps ? rootFolder : ""}/assets/img/sneat.svg`}
                alt="sneat-logo"
                aria-label="Sneat logo image"
              />
            </span>
            <span className="demo menu-text fw-bold ms-2 fs-5"  >
              ZAM App
            </span>
          </Link>
        </div>
        <ul className="navbar-nav flex-row align-items-center ms-auto">
          <li className="nav-item navbar-dropdown dropdown-user dropdown">
            <a
              aria-label="dropdown profile avatar"
              className="nav-link dropdown-toggle hide-arrow p-0"
              href="#"
              data-bs-toggle="dropdown"
            >
              <div className="flex gap-2 items-center">
                <p className="text-black capitalize">{userName}</p>
                <div className="avatar avatar-online" style={{ height: "28px" }}>
                  <img
                    src={`${isHttps ? rootFolder : ""
                      }/assets/img/avatars/1.png`}
                    className="w-px-40 h-auto rounded-circle h-100"
                    alt="avatar-image"
                    aria-label="Avatar Image"
                  />
                </div>
              </div>
            </a>
            <ul className="dropdown-menu dropdown-menu-end !absolute">
              <li>
                <a
                  aria-label="go to profile"
                  className="dropdown-item"
                  href="#"
                >
                  <div className="d-flex items-center">
                    <div className="flex-shrink-0 me-3">
                      <div className="avatar avatar-online">
                        <img
                          src={`${isHttps ? rootFolder : ""
                            }/assets/img/avatars/1.png`}
                          className="w-px-40 h-auto rounded-circle"
                          alt="avatar-image"
                          aria-label="Avatar Image"
                        />
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <span className="fw-medium d-block capitalize">
                        {userName}
                      </span>
                    </div>
                  </div>
                </a>
              </li>
              {/* <li>
                <div className="dropdown-divider"></div>
              </li> */}

              {/* <li>
                <a
                  aria-label="go to setting"
                  className="dropdown-item"
                  href="#"
                >
                  <i className="bx bx-cog me-2"></i>
                  <span className="align-middle">Settings</span>
                </a>
              </li> */}
              {/* <li>
                <a
                  aria-label="go to billing"
                  className="dropdown-item"
                  href="#"
                >
                  <span className="d-flex align-items-center align-middle">
                    <i className="flex-shrink-0 bx bx-credit-card me-2"></i>
                    <span className="flex-grow-1 align-middle ms-1">
                      Billing
                    </span>
                    <span className="flex-shrink-0 badge badge-center rounded-pill bg-danger w-px-20 h-px-20">
                      4
                    </span>
                  </span>
                </a>
              </li> */}
              <li>
                <div className="dropdown-divider"></div>
              </li>
              <li onClick={handleLogout}>
                <a
                  aria-label="click to log out"
                  className="dropdown-item"
                  href="#"
                >
                  <i className="bx bx-power-off me-2"></i>
                  <span className="align-middle">Log Out</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
};
export default Navbar;

