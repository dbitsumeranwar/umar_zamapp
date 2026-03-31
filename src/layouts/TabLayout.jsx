import { Suspense, useEffect, useState, useRef } from 'react';
import { MdCancel, MdClose, MdMoreVert } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import { addTab, removeTab, setActiveTab } from '../store/tabSlice';
import { routeComponentMapping } from '../utils/routeComponentMapping';
import ErrorBoundary from '../utils/ErrorBoundary';
import ErrorNotFoundPage from '../pages/ErrorNotFoundPage';

const TabLayout = () => {
  const { tabs, activeTabId } = useSelector((state) => state.tabs);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const rootFolder = import.meta.env.VITE_ROOT_FOLDER || '';
  const tabsRef = useRef({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  useEffect(() => {
    dispatch(
      addTab({
        id: `${rootFolder}/dashboard`,
        title: 'Dashboard',
      })
    );
  }, [dispatch, rootFolder]);

  useEffect(() => {
    const currentPath = location.pathname;
    const matchedRoute = Object.keys(routeComponentMapping).find(
      (path) => path === currentPath
    );
    if (matchedRoute) {
      dispatch(
        addTab({
          id: currentPath,
          title: routeComponentMapping[matchedRoute].name,
          initialState: { someKey: 'somevalue' },
        })
      );
    } else {
      const pathName = currentPath.split('/').pop() || 'Unknown';
      dispatch(
        addTab({
          id: currentPath,
          title: pathName,
          isNotFound: true,
        })
      );
      dispatch(setActiveTab(currentPath));
    }
  }, [location, dispatch, navigate, rootFolder]);


  const handleTabClick = (id) => {
    dispatch(setActiveTab(id));
    navigate(id);
  };

  const handleRemoveTab = (e, id) => {
    e.stopPropagation();
    dispatch(removeTab(id));
    if (id === activeTabId) {
      const tabIndex = tabs.findIndex((tab) => tab.id === id);
      if (tabs.length > 0) {
        const newActiveTab = tabs[Math.max(0, tabIndex - 1)];
        if (newActiveTab) {
          navigate(newActiveTab.id);
        }
      }
    }
  };

  const handleCloseAll = () => {
    tabs.forEach((tab) => {
      if (tab.id !== `${rootFolder}/dashboard`) {
        dispatch(removeTab(tab.id));
      }
    });
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    if (activeTabId && tabsRef.current[activeTabId]) {
      tabsRef.current[activeTabId].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeTabId]);

  return (
    <div className="ps-5 ps-md-5 ps-sm-5 ps-xl-0">
      <div className="bg-white shadow sticky top-12 z-20">
        <div className="flex items-center justify-between px-3">
          <div className="flex overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track gap-2">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                ref={(el) => (tabsRef.current[tab.id] = el)}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center px-2 py-2 transition-all duration-300 cursor-pointer ${activeTabId === tab.id
                    ? "bg-gray-100 text-gray-700 font-medium"
                    : " text-gray-700 font-regularweight"
                  }`}
              >
                <span className="truncate text-sm">
                  {activeTabId === tab.id ? tab.title : tab?.title?.slice(0, 10) + '...'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveTab(e, tab.id);
                  }}
                  className={`ml-2 flex items-center justify-center w-5 h-5 rounded-sm ${activeTabId === tab.id ? 'text-customBlue' : 'text-color'
                    } hover:text-gray-600 focus:outline-none`}
                >
                  <MdCancel className="w-4 h-4" size={16} />
                </button>
              </div>
            ))}
          </div>
          <div className="relative ml-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen((prev) => !prev);
              }}
              className="flex items-center justify-center w-9 h-9"
            >
              <MdMoreVert size={22} />
            </button>
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-12 bg-white border border-gray-200 shadow-xl w-72 z-50 animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center px-4 py-2 border-b bg-customBlue ">
                  <span className="font-semibold text-md text-white">Open Tabs</span>
                  <button
                    onClick={handleCloseAll}
                    className="text-md text-white  font-medium transition"
                  >
                    Close All
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {tabs.map((tab) => (
                    <div
                      key={tab.id}
                      className={`flex justify-between items-center px-4 py-2 text-sm transition-all duration-150 cursor-pointer ${activeTabId === tab.id ? "bg-gray-100 text-gray-700" : "text-gray-700"
                        }`}
                      onClick={() => {
                        handleTabClick(tab.id);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <span className="truncate">{tab.title}</span>
                      {tab.id !== `${rootFolder}/dashboard` && (
                        <MdClose
                          size={16}
                          className="text-gray-400 "
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveTab(e, tab.id);
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className="p-3 bg-menu-theme mt-2 shadow rounded-md"
        style={{ height: '90%', overflowY: 'auto' }}
      >
        {tabs.map((tab) => {
          const Component = routeComponentMapping[tab?.id]?.component || (() => <ErrorNotFoundPage path="/dashboard" />);
          return (
            <div key={tab.id} style={{ display: activeTabId === tab.id ? 'block' : 'none' }}>
              <ErrorBoundary>
                <Suspense>
                  <Component />
                </Suspense>
              </ErrorBoundary>
            </div>
          );
        })}
      </div>
    </div>
  );
};


export default TabLayout;