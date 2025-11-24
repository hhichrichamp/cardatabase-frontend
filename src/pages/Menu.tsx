import type { Page } from "../services/types";
import '../app.css'

interface MenuProps {
  currentPage: Page;
  onChangePage: (page: Page) => void;
}

export function Menu({ currentPage, onChangePage }: MenuProps) {
  return (
    <nav className="menu">
      <ul>
        <li>
          <button
            className={currentPage === "home" ? "active" : ""}
            onClick={() => onChangePage("home")}
          >
            Home
          </button>
        </li>
        <li>
          <button
            className={currentPage === "cars" ? "active" : ""}
            onClick={() => onChangePage("cars")}
          >
            Manage Cars
          </button>
        </li>
        <li>
          <button
            className={currentPage === "owners" ? "active" : ""}
            onClick={() => onChangePage("owners")}
          >
            Manage Owners
          </button>
        </li>
        <li>
          <button
            className={currentPage === "about" ? "active" : ""}
            onClick={() => onChangePage("about")}
          >
            About
          </button>
        </li>
      </ul>
    </nav>
  );
}