import { useEffect, useState } from "react";
import Card from "../components/Card";
import authService from "../services/index.services";
import BookCard from "../components/BookCard";

type ReadingStatus = "WANT_TO_READ" | "READING" | "FINISHED";

type UserBook = {
  id: number;
  status: ReadingStatus;
  currentPage: number;
  rating: number | null;
  notes: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  userId: number;
  bookId: number;
  createdAt: string;
  updatedAt: string;
  book: Book;
};

type Book = {
  id: number;
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  genre: string;
  totalPages: number;
  isbn?: string | null;
  publishedYear?: number | null;
};

function BookShelfPage() {
  const [userBookData, setUserBooksData] = useState<UserBook[]>([]);

  const fetchUserBooksData = async () => {
    const response = await authService.get("/auth/user-books");
    setUserBooksData(response.data.userBooks);
  };

  useEffect(() => {
    fetchUserBooksData();
  }, []);

  const handleBookmarkClick = async (bookId: number) => {
    try {
      const response = await authService.post(`/auth/user-books/${bookId}`, {
        status: "WANT_TO_READ",
      });
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  const handleStartBtnClick = async (bookId: number) => {
    try {
      const response = await authService.post(`/auth/user-books/${bookId}`, {
        status: "READING",
      });
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  const getTotalBooksOnShelf = () => {
    return userBookData.filter((book) => book.status === "WANT_TO_READ").length
  }

  return (
    <div className="container">
      <div className="header-container">
        <div className="page-header">
          <h1> Your </h1>
          <h1 className="tile-primary"> BookShelf </h1>
        </div>
        <div className="search-bar">
          <input placeholder="search book" />
        </div>
      </div>
      <div className="reading-section">
        <div className="reading-section-caption" >
          <i className="fa-solid fa-book"></i>
          <p> Back to the page </p>
        </div>
        <div className="reading-secton-header">
          <span className="heading"> <p> in the </p> <p className="heading-pink"> loop. </p> </span>
          <p> pick up right where you left </p>
        </div>
        {userBookData?.map((data) => {
          return (
            data.status === "READING" && (
              <BookCard
                key={data.bookId}
                coverUrl={data.book.coverUrl}
                genre={data.book.genre}
                totalPages={data.book.totalPages}
                currentPage={data.currentPage}
                author={data.book.author}
                title={data.book.title}
                id={data.bookId}
              />
            )
          );
        })}
      </div>
      <div className="bookshelf-container">
        <p> {getTotalBooksOnShelf()} stories on the shelf </p>
        <hr className="hr-secondary" />
        <div className="cards">
          {userBookData?.map((data) => {
            return data.status === "WANT_TO_READ" && (
              <Card
                key={data.bookId}
                title={data.book.title}
                author={data.book.author}
                coverUrl={data.book.coverUrl}
                genre={data.book.genre}
                handleBookmarkClick={() => handleBookmarkClick(data.book.id)}
                handleStartBtnClick={() => handleStartBtnClick(data.book.id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default BookShelfPage;
