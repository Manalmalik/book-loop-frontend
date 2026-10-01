type CardProps = {
  title: string,
  coverUrl: string,
  author: string,
  genre: string,
}

function Card({title, coverUrl, author, genre} : CardProps ) {
  const handleBookmarkClick = () => {
   console.log("added to favorite")
  }

  const handleStartBtnClick = () => {
    console.log("added to Reading")
  }

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
          <button onClick={handleStartBtnClick} className="btn-default"> Start Reading </button>
        </div>
    </div>
  )
}

export default Card
