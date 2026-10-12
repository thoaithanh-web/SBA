import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import "./App.css";
import App from "./App";
import OrchidDetail from "./OrchidDetail";
import EditOrchid from "./components/EditOrchid";
import NavBar from "./components/NavBar";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/orchids/new"
          element={<EditOrchid key="create" createMode />}
        />
        <Route path="/orchids/:id/edit" element={<EditOrchid key="edit" />} />
        <Route path="/orchids/:id" element={<OrchidDetail />} />
        <Route
          path="*"
          element={
            <main className="page-shell empty-state">
              <h1>Không tìm thấy trang</h1>
              <Link to="/">Quay lại bộ sưu tập</Link>
            </main>
          }
        />
      </Routes>
      <footer className="page-shell footer">
        <span>ORCHID / STUDIO</span>
        <span>Lâm Thoại Thanh · CE190169 · SE1910</span>
        <span>SBA301 / LAB 05</span>
      </footer>
    </BrowserRouter>
  </StrictMode>,
);
