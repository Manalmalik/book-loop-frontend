import { useEffect, useState } from "react";
import Card from "../components/Card";
import authService from "../services/index.services";
import BookCard from "../components/BookCard";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { getApiError } from "../utils/getApiError";
import BookloopSpinner from "../components/BookLoopSpinner";

type ReadingStatus = "WANT_TO_READ" | "READING" | "FINISHED";
type ChallengeStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "COMPLETED";

type Challenge = {
  id: number;
  title: string | null;
  message: string | null;
  status: ChallengeStatus;
  deadline: string | null;
  challengerId: number;
  challengedUserId: number;
  challenger: { id: number; name: string };
  challengedUser: { id: number; name: string };
  book: { id: number; title: string; author: string; coverUrl: string | null };
};

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
  const [isLoadingUserBooks, setIsLoadingUserBooks] = useState(true);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [areChallengesLoading, setAreChallengesLoading] = useState(true);
  const [challengeError, setChallengeError] = useState("");
  const [respondingToChallengeId, setRespondingToChallengeId] = useState<number | null>(null);
  const { loggedUserId } = useAuth();

  const fetchUserBooksData = async () => {
    try {
      const response = await authService.get("/auth/user-books");
      setUserBooksData(response.data.userBooks);
    } finally {
      setIsLoadingUserBooks(false);
    }
  };

  useEffect(() => {
    fetchUserBooksData();
  }, []);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await authService.get<{ challenges: Challenge[] }>("/challenges");
        setChallenges(response.data.challenges);
      } catch (error) {
        setChallengeError(getApiError(error).message);
      } finally {
        setAreChallengesLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const handleChallengeResponse = async (challengeId: number, status: "ACCEPTED" | "DECLINED") => {
    setChallengeError("");
    setRespondingToChallengeId(challengeId);

    try {
      await authService.patch(`/challenges/${challengeId}`, { status });
      setChallenges((currentChallenges) => currentChallenges.map((challenge) => (
        challenge.id === challengeId ? { ...challenge, status } : challenge
      )));
    } catch (error) {
      setChallengeError(getApiError(error).message);
    } finally {
      setRespondingToChallengeId(null);
    }
  };

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

  const getFinishedBooks = () => {
     return userBookData.filter((book) => book.status === "FINISHED").length
  }

  const getReadingBooks = () => {
    return userBookData.filter((book) => book.status === "READING").length
  }

  return (
    <div className="container">
      <div className="header-container">
        <div className="page-header">
          <h1> Your </h1>
          <h1 className="tile-primary"> BookShelf </h1>
        </div>
        {isLoadingUserBooks && <BookloopSpinner label="Loading your bookshelf" />}
        <div className="stats-bar">
          {/* <input placeholder="search book" /> */}
          <span className="stats-bar-content">
            <h3 className="stats-content-header"> {getReadingBooks()}</h3>
            <p className="stats-content-label"> in the loop </p>
          </span>
          <span className="stats-bar-content">
            <h3 className="stats-content-header"> {getTotalBooksOnShelf()} </h3>
            <p className="stats-content-label"> next for loop </p>
          </span>
          <span className="stats-bar-content">
            <h3 className="stats-content-header"> {getFinishedBooks()} </h3>
            <p className="stats-content-label"> out of loop</p>
          </span>
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
        <div>
          <div className="challenge-list-heading">
            <div>
              <h3>Reading challenges</h3>
              <p>Keep each other turning pages.</p>
            </div>
            <NavLink to="/createChallenge" className="btn-default">Add a challenge</NavLink>
          </div>
          {challengeError && <p className="challenge-list-feedback" role="alert">{challengeError}</p>}
          {areChallengesLoading && <BookloopSpinner label="Loading challenges" size="small" />}
          {!areChallengesLoading && !challengeError && challenges.length === 0 && (
            <p className="challenge-list-feedback">No challenges yet. Start one with another reader.</p>
          )}
          {challenges.length > 0 && (
            <div className="challenge-list">
              {challenges.map((challenge) => {
                const isChallengeSent = challenge.challengerId === loggedUserId;
                const otherReader = isChallengeSent ? challenge.challengedUser : challenge.challenger;

                return (
                  <article className="challenge-item" key={challenge.id}>
                    <div className="challenge-item-book">
                      {challenge.book.coverUrl && <img src={challenge.book.coverUrl} alt="" />}
                      <div>
                        <span className={`challenge-status challenge-status-${challenge.status.toLowerCase()}`}>
                          {challenge.status.replaceAll("_", " ")}
                        </span>
                        <h4>{challenge.title || challenge.book.title}</h4>
                        <p>{challenge.book.author}</p>
                      </div>
                    </div>
                    <div className="challenge-item-details">
                      <p>{isChallengeSent ? "You challenged" : "Challenge from"} <strong>{otherReader.name}</strong></p>
                      {challenge.message && <p className="challenge-item-message">“{challenge.message}”</p>}
                      {challenge.deadline && (
                        <p className="challenge-item-deadline">
                          Finish by {new Date(challenge.deadline).toLocaleDateString()}
                        </p>
                      )}
                      {!isChallengeSent && challenge.status === "PENDING" && (
                        <div className="challenge-response-actions">
                          <button
                            className="btn-secondary"
                            type="button"
                            disabled={respondingToChallengeId === challenge.id}
                            onClick={() => handleChallengeResponse(challenge.id, "ACCEPTED")}
                          >
                            {respondingToChallengeId === challenge.id ? "Updating..." : "Accept"}
                          </button>
                          <button
                            className="btn-default"
                            type="button"
                            disabled={respondingToChallengeId === challenge.id}
                            onClick={() => handleChallengeResponse(challenge.id, "DECLINED")}
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="bookshelf-container">
       <div className="reading-secton-header">
          <span className="heading"> <p> Next for </p> <p className="heading-pink"> loop. </p> </span>
           <p> {getTotalBooksOnShelf()} stories on the shelf </p>
        </div>
        <hr className="hr-secondary" />
        {userBookData.length === 0 && <NavLink to='/allBooks' className="btn-default"> Find A Book </NavLink>}
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
          <div className="bookshelf-container">
         <div className="reading-secton-header">
          <span className="heading"> <p> out of</p> <p className="heading-pink"> loop. </p> </span>
           <p> {getTotalBooksOnShelf()} stories on the shelf </p>
        </div>
        <hr className="hr-secondary" />
        <div className="cards">
          {userBookData?.map((data) => {
            return data.status === "FINISHED" && (
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
