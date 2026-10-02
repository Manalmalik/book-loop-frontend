import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import authService from "../services/index.services";
import { useAuth } from "../context/useAuth";
import { getApiError } from "../utils/getApiError";

type Book = {
  id: number;
  title: string;
  author: string;
  description: string | null;
  coverUrl: string | null;
  genre: string | null;
  totalPages: number | null;
  isbn: string | null;
  publishedYear: number | null;
};

type UserBook = {
  status: "WANT_TO_READ" | "READING" | "FINISHED";
  currentPage: number;
  rating: number | null;
  notes: string | null;
  startedAt: string | null;
  finishedAt: string | null;
};

type Challenge = {
  id: number;
  title: string | null;
  message: string | null;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "COMPLETED";
  deadline: string | null;
  challengerId: number;
  challengedUserId: number;
  challenger: { id: number; name: string };
  challengedUser: { id: number; name: string };
  book: { id: number };
};

const formatDate = (date: string | null) => (
  date ? new Date(date).toLocaleDateString() : "Not set"
);

function ViewBookDetailsPage() {
  const { bookId } = useParams();
  const { isLoggedIn, loggedUserId } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [userBook, setUserBook] = useState<UserBook | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isActive = true;

    const fetchBookDetails = async () => {
      setIsLoading(true);
      setErrorMessage("");
      setBook(null);
      setUserBook(null);
      setChallenges([]);

      try {
        const response = await authService.get<{ allBooks: Book[] }>("/books");
        const selectedBook = response.data.allBooks.find((item) => item.id === Number(bookId));

        if (!selectedBook) {
          if (isActive) setErrorMessage("We couldn't find that book.");
          return;
        }

        if (isActive) setBook(selectedBook);

        if (isLoggedIn) {
          const [userBooksResponse, challengesResponse] = await Promise.all([
            authService.get<{ userBooks: Array<UserBook & { bookId: number }> }>("/auth/user-books"),
            authService.get<{ challenges: Challenge[] }>("/challenges"),
          ]);

          if (isActive) {
            const shelfEntry = userBooksResponse.data.userBooks.find((item) => item.bookId === selectedBook.id);
            setUserBook(shelfEntry ?? null);
            setChallenges(challengesResponse.data.challenges.filter((item) => item.book.id === selectedBook.id));
          }
        }
      } catch (error) {
        if (isActive) setErrorMessage(getApiError(error).message);
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    fetchBookDetails();
    return () => {
      isActive = false;
    };
  }, [bookId, isLoggedIn]);

  const pageProgress = book?.totalPages && userBook
    ? Math.min(100, Math.round((userBook.currentPage / book.totalPages) * 100))
    : 0;

  return (
    <main className="container book-details-page">
      <Link to="/allBooks" className="book-details-back">← Back to discover</Link>

      {isLoading && <p className="book-details-feedback">Loading book details...</p>}
      {!isLoading && errorMessage && <p className="book-details-feedback" role="alert">{errorMessage}</p>}

      {!isLoading && book && (
        <>
          <section className="book-details-hero">
            <div className="book-details-cover-wrap">
              {book.coverUrl ? (
                <img className="book-details-cover" src={book.coverUrl} alt={`Cover of ${book.title}`} />
              ) : (
                <div className="book-details-cover-placeholder">No cover available</div>
              )}
            </div>

            <div className="book-details-main">
              <p className="book-details-eyebrow">Book details</p>
              {book.genre && <span className="card-caption">{book.genre}</span>}
              <h1>{book.title}</h1>
              <p className="book-details-author">by {book.author}</p>
              {book.description && <p className="book-details-description">{book.description}</p>}

              <dl className="book-facts">
                <div><dt>Published</dt><dd>{book.publishedYear ?? "Unknown"}</dd></div>
                <div><dt>Length</dt><dd>{book.totalPages ? `${book.totalPages} pages` : "Unknown"}</dd></div>
                <div><dt>ISBN</dt><dd>{book.isbn || "Not listed"}</dd></div>
              </dl>
            </div>
          </section>

          <section className="book-details-section">
            <div className="book-details-section-heading">
              <div>
                <p className="book-details-eyebrow">Your reading</p>
                <h2>Your shelf</h2>
              </div>
            </div>

            {!isLoggedIn && <p className="book-details-feedback">Log in to see your shelf details for this book.</p>}
            {isLoggedIn && !userBook && <p className="book-details-feedback">This book isn’t on your shelf yet.</p>}
            {userBook && (
              <div className="user-book-details">
                <div className="user-book-status">
                  <span className={`challenge-status challenge-status-${userBook.status.toLowerCase()}`}>
                    {userBook.status.replaceAll("_", " ")}
                  </span>
                  {userBook.status === "READING" && book.totalPages && (
                    <div className="user-book-progress">
                      <div className="user-book-progress-label">
                        <span>{userBook.currentPage} of {book.totalPages} pages</span>
                        <span>{pageProgress}%</span>
                      </div>
                      <div className="user-book-progress-track">
                        <span style={{ width: `${pageProgress}%` }} />
                      </div>
                    </div>
                  )}
                </div>
                <dl className="book-facts user-book-facts">
                  <div><dt>Rating</dt><dd>{userBook.rating ? `${userBook.rating} / 5` : "Not rated"}</dd></div>
                  <div><dt>Started</dt><dd>{formatDate(userBook.startedAt)}</dd></div>
                  <div><dt>Finished</dt><dd>{formatDate(userBook.finishedAt)}</dd></div>
                </dl>
                {userBook.notes && <p className="user-book-notes"><strong>Your notes</strong>{userBook.notes}</p>}
              </div>
            )}
          </section>

          <section className="book-details-section">
            <div className="book-details-section-heading">
              <div>
                <p className="book-details-eyebrow">Read together</p>
                <h2>Challenges</h2>
              </div>
              {isLoggedIn && <span className="challenge-count">{challenges.length}</span>}
            </div>

            {!isLoggedIn && <p className="book-details-feedback">Log in to see challenges involving this book.</p>}
            {isLoggedIn && challenges.length === 0 && (
              <p className="book-details-feedback">No challenges for this book yet.</p>
            )}
            {challenges.length > 0 && (
              <div className="book-challenge-list">
                {challenges.map((challenge) => {
                  const isChallenger = challenge.challengerId === loggedUserId;
                  const otherReader = isChallenger ? challenge.challengedUser : challenge.challenger;

                  return (
                    <article className="book-challenge-item" key={challenge.id}>
                      <div>
                        <span className={`challenge-status challenge-status-${challenge.status.toLowerCase()}`}>
                          {challenge.status.replaceAll("_", " ")}
                        </span>
                        <h3>{challenge.title || book.title}</h3>
                        <p>{isChallenger ? "You challenged" : "Challenge from"} <strong>{otherReader.name}</strong></p>
                        {challenge.message && <p className="challenge-item-message">“{challenge.message}”</p>}
                      </div>
                      <p className="challenge-item-deadline">Finish by {formatDate(challenge.deadline)}</p>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  )
}

export default ViewBookDetailsPage
