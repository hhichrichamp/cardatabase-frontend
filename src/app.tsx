import React, { useState } from "react";
import {Header} from "./pages/Header";
import { Menu } from "./pages/Menu";
import  {Footer } from "./pages/Footer";
import { MainBody } from "./pages/MainBody";

import type { Page } from "./services/types";

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  return (
    <div className="container">
      <Header />
      <Menu currentPage={currentPage} onChangePage={setCurrentPage} />
      <MainBody currentPage={currentPage} />
      <Footer />
    </div>
  );
}