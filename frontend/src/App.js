import logo from "./logo.svg";
import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import Wrapper from "./componenets/Wrapper";
import Folder from "./pages/Folder";
import Image from "./pages/Image";

function App() {
  const token = localStorage.getItem("token");

  const Component = (Comp) => (
    <Wrapper>
      <Comp />
    </Wrapper>
  );
  const routes = [
    { name: "/", auth: true, component: Component(Home) },
    { name: "/folder/:id", auth: true, component: Component(Folder) },
    { name: "/image/:id", auth: true, component: Component(Image) },
  ];

  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Routes>
        {token ? (
          <>
            {routes.map((rout) => (
              <Route path={rout.name} element={rout.component} />
            ))}
            <Route path="/*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/auth" element={<Auth />} />

            <Route path="/*" element={<Navigate to="/auth" />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
