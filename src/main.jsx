import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { persistor, store } from "./store/store.js";
import { PersistGate } from "redux-persist/integration/react";
// import { Toaster } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {/* <Toaster position="top-right" reverseOrder={false} /> */}
          <App />
          {/* <ToastContainer
                    className="toast-text"
                  /> */}
                        
                        <ToastContainer
                          className="toast-text"
                          position="top-right"
                          autoClose={3000}
                          hideProgressBar={false}
                          newestOnTop
                          closeOnClick
                          pauseOnHover
                          draggable
                          theme="colored"
                        />
                  
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  </BrowserRouter>
);
