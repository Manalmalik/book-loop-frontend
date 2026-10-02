import { useEffect, useState, type FormEvent } from "react";
import authService from "../services/index.services";
import { useAuth } from "../context/useAuth";
import { getApiError } from "../utils/getApiError";
import BookloopSpinner from "../components/BookLoopSpinner";

type Book = {
  id: number;
  title: string;
  author: string;
};

function AddChallengePage() {
  const { loggedUserId } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [challengedUserId, setChallengedUserId] = useState("");
  const [bookId, setBookId] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await authService.get<{ allBooks: Book[] }>("/books");
        setBooks(response.data.allBooks);
      } catch (error) {
        setErrorMessage(getApiError(error).message);
      } finally {
        setIsLoadingBooks(false);
      }
    };

    fetchBooks();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const recipientId = Number(challengedUserId);
    const selectedBookId = Number(bookId);

    if (recipientId === loggedUserId) {
      setErrorMessage("You cannot challenge yourself. Enter another reader's user ID.");
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.post("/challenges", {
        challengedUserId: recipientId,
        bookId: selectedBookId,
        title: title.trim() || null,
        message: message.trim() || null,
        deadline: deadline || null,
      });
      setSuccessMessage("Challenge sent.");
      setChallengedUserId("");
      setBookId("");
      setTitle("");
      setMessage("");
      setDeadline("");
    } catch (error) {
      setErrorMessage(getApiError(error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container challenge-page">
      <header className="challenge-heading">
        <p className="challenge-eyebrow">A little friendly motivation</p>
        <h1>Start a <span className="tile-primary">reading challenge</span></h1>
        <p>Pick a book, invite a reader, and give your next great read a deadline.</p>
      </header>

      <form className="challenge-form" onSubmit={handleSubmit}>
        <div className="challenge-form-intro">
          <span>01</span>
          <div>
            <h2>Set the challenge</h2>
            <p>Choose who you are challenging and what you will read.</p>
          </div>
        </div>

        <label className="challenge-field" htmlFor="challenged-user-id">
          <span>Reader user ID</span>
          <input
            id="challenged-user-id"
            name="challengedUserId"
            type="number"
            min="1"
            step="1"
            required
            value={challengedUserId}
            onChange={(event) => setChallengedUserId(event.target.value)}
            placeholder="For example, 12"
          />
          <small>Enter the ID of the person you want to challenge.</small>
        </label>

        <label className="challenge-field" htmlFor="challenge-book">
          <span>Book</span>
          <select
            id="challenge-book"
            name="bookId"
            required
            value={bookId}
            onChange={(event) => setBookId(event.target.value)}
            disabled={isLoadingBooks || books.length === 0}
          >
            <option value="">
              {isLoadingBooks ? "Loading books..." : books.length ? "Choose a book" : "No books available"}
            </option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title} · {book.author}
              </option>
            ))}
          </select>
          {isLoadingBooks && <BookloopSpinner label="Loading book choices" size="small" />}
        </label>

        <label className="challenge-field" htmlFor="challenge-title">
          <span>Challenge title <small>(optional)</small></span>
          <input
            id="challenge-title"
            name="title"
            type="text"
            maxLength={120}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="One book, one month"
          />
        </label>

        <div className="challenge-field-row">
          <label className="challenge-field" htmlFor="challenge-deadline">
            <span>Finish by <small>(optional)</small></span>
            <input
              id="challenge-deadline"
              name="deadline"
              type="date"
              value={deadline}
              onChange={(event) => setDeadline(event.target.value)}
            />
          </label>

          <label className="challenge-field" htmlFor="challenge-message">
            <span>Personal message <small>(optional)</small></span>
            <textarea
              id="challenge-message"
              name="message"
              rows={4}
              maxLength={500}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Add a note to your invitation..."
            />
          </label>
        </div>

        {errorMessage && <p className="challenge-feedback challenge-error" role="alert">{errorMessage}</p>}
        {successMessage && <p className="challenge-feedback challenge-success" role="status">{successMessage}</p>}
        {isSubmitting && <BookloopSpinner label="Sending challenge" size="small" />}

        <div className="challenge-form-footer">
          <p>Your challenge will be sent as soon as you submit.</p>
          <button className="btn-primary" type="submit" disabled={isSubmitting || isLoadingBooks || books.length === 0}>
            {isSubmitting ? "Sending..." : "Send challenge"}
          </button>
        </div>
      </form>
    </main>
  )
}

export default AddChallengePage
