import '../app.css'
import type { Page } from "../services/types";
import { ManageCarsPage } from "./ManageCarsPage";
import { ManageOwnersPage } from "./ManageOwnersPage";

interface MainBodyProps {
  currentPage: Page;
}

export function MainBody({ currentPage }: MainBodyProps) {
  return (
    <main className="main-body">
      {currentPage === "home" && <HomePage />}
      {currentPage === "cars" && <ManageCarsPage />}
      {currentPage === "owners" && <ManageOwnersPage />}
      {currentPage === "about" && <AboutPage />}
    </main>
  );
}

function HomePage() {
  return (
    <section>
      <h2>Home</h2>
      <p>Welcome to the Car Management App.</p>
    </section>
  );
}

function AboutPage() {
  return (
    <section>
      <h2>About</h2>
      <p>This app manages cars and owners.</p>
    </section>
  );
}