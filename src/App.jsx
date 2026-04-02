import { useLocation, useNavigate } from "react-router-dom";
import "./App.scss";
import Layout from "./layouts/Layout";
import TabLayout from "./layouts/TabLayout";
import { LoginPage } from "./pages/authentication/LoginPage";
import { getFromLocalStorage } from "./config/crypto-file";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { ToastContainer } from "react-toastify";

function App() {
  const rootFolder = import.meta.env.VITE_ROOT_FOLDER || "";
  const navigate = useNavigate();
  const token = getFromLocalStorage("authToken");
  const [tokenExpired, setTokenExpired] = useState(false);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      const expiryTime = decoded.exp * 1000;
      const timeLeft = expiryTime - Date.now();
      if (timeLeft > 0) {
        let popupShown = false;
        const interval = setInterval(() => {
          const remaining = expiryTime - Date.now();
          if (remaining <= 5 * 60 * 1000 && !popupShown) {
            popupShown = true;
            Swal.fire({
              icon: "warning",
              text: "Your session is about to expire. Please re-login else you will be rerouted to login screen in 5 minutes. Thanks!",
              confirmButtonText: "Login",
              cancelButtonText: "Cancel",
              showCancelButton: true,
            }).then((res) => {
              if (res.isConfirmed) {
                setTokenExpired(true);
                localStorage.clear();
                navigate(`${rootFolder}/login`);
              }
            });
          }
          if (remaining <= 0) {
            clearInterval(interval);
            localStorage.clear();
            navigate(`${rootFolder}/login`);
            setTokenExpired(true);
          }
        }, 3000);
        return () => clearInterval(interval);
      } else {
        localStorage.clear();
        navigate(`${rootFolder}/login`);
        setTokenExpired(true);
      }
    }
  }, [token, navigate, rootFolder]);

  return (
    <>

      {token ? (
        <Layout>
          <TabLayout />
        </Layout>
      ) : (
        <LoginPage />
      )}
    </>
  );
}

export default App;
