import { useState } from "react";
import authService from "../services/index.services";
import { useNavigate } from "react-router-dom";

type BookCardProps = {
    coverUrl: string,
    genre: string,
    author: string,
    totalPages: number,
    currentPage: number,
    title: string,
    id: number,

}

function BookCard({coverUrl, genre, author, totalPages, currentPage, title, id} : BookCardProps) {
    const [ updatedCurrentPage, setUpdatedCurrentPage ] = useState<number>(currentPage)
    const navigate = useNavigate()

    const handleUpdatePageClick = async() => {
        try{
            await authService.patch(`/auth/user-books/${id}`, {currentPage: updatedCurrentPage + 1})
            setUpdatedCurrentPage(currentPage += 1)
        } catch(e) {
            console.log(e)
        }
    }

    const handleFinishBookClick = async() => {
        try{
            await authService.patch(`/auth/user-books/${id}`, {currentPage: totalPages, status: "FINISHED"})
            navigate("/allBooks")
        } catch(e) {
            console.log(e)
        }
    }

    const getProgress = () => {
        return updatedCurrentPage / 100 * totalPages
    }

    const getPagesLeft = () => {
        return totalPages - updatedCurrentPage
    }

  return (
    <div className="book-card">
      <div className="book-card-img">
        <img src={coverUrl} />
        <p> currently reading </p>
      </div>
      <div className="book-card-content">
        <div className="book-card-label">
            <p > {genre} </p>
            <i className="fa-solid fa-diamond"></i>
            <p> {totalPages} pages </p>
        </div>
        <div className="book-card-header">
            <h3> {title} </h3>
            <p> by {author} </p>
        </div>
        <div className="progress-bar-container">
          <div className="progress-label">
            <p>
              {" "}
              Page {updatedCurrentPage} of {totalPages}{" "}
            </p>
            <p> {getProgress()}%</p>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${getProgress()}%` }}
            />
          </div>
          <p> {getPagesLeft()} pages left </p>
        </div>
        <div className="buttons">
            <button onClick={handleUpdatePageClick} className="btn-secondary"> Update Progress </button>
            <button onClick={handleFinishBookClick} className="btn-primary"> Finish Book </button>
        </div>
      </div>
    </div>
  );
}

export default BookCard;
