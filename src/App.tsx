import "./App.css";
import { Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import TickBanner from "./components/TickBanner";
import BookShelfPage from "./pages/BookShelfPage";
import ViewAllBooksPage from "./pages/ViewAllBooksPage";
import PrivateWrapper from "./components/PrivateWrapper";
import AddChallengePage from "./pages/AddChallengePage";
import ViewBookDetailsPage from "./pages/ViewBookDetailsPage";

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
        <Route path="/bookshelf" element={<PrivateWrapper> <BookShelfPage/> </PrivateWrapper>}/>
        <Route path="/allBooks" element={<ViewAllBooksPage/>}/>
        <Route path="/books/:bookId" element={<ViewBookDetailsPage/>}/>
        <Route path="/createChallenge" element={<PrivateWrapper> <AddChallengePage/> </PrivateWrapper>}/>

      </Routes>
    </div>
    </div>
  );
}

export default App;
