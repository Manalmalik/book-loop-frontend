import { NavLink } from "react-router-dom";

type CardProps = {
  bookId?: number,
  title: string,
  coverUrl: string,
  author: string,
  genre: string,
  handleBookmarkClick?: () => {},
  handleStartBtnClick?: () => {},
}

function Card({bookId, title, coverUrl, author, genre, handleBookmarkClick, handleStartBtnClick} : CardProps ) {

  return (
     <div className='card'>
        <span onClick={handleBookmarkClick}>
          <i className="fa-regular fa-bookmark"></i>
        </span>
        <p className="card-caption"> {genre} </p>
        <img src={coverUrl} alt='Book cover'/>
        <p className="card-title"> {title} </p>
        <p className="card-desc"> by {author} </p>
        <div className="card-buttons">
          {/* {bookId !== undefined && <NavLink className="btn-primary" to={`/books/${bookId}`}>View details</NavLink>} */}
          <button onClick={handleStartBtnClick} className="btn-default"> Start Reading </button>
        </div>
    </div>
  )
}

export default Card
