import "./App.css";
import { Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import TickBanner from "./components/TickBanner";
import BookShelfPage from "./pages/BookShelfPage";

function App() {
  return (
    <div>
      <TickBanner/>
      <div className="app">
      <Navbar />
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage/>} />
        <Route path="/bookshelf" element={<BookShelfPage/>}/>
      </Routes>
    </div>
    </div>
  );
}

export default App;
