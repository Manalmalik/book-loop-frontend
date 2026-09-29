import Card from "../components/Card"

function BookShelfPage() {
  return (
    <div className='container'>
      <div className='header-container'>
        <div className="page-header">
            <h1> Your </h1>
            <h1 className="tile-primary"> BookShelf </h1>
        </div>
        <div className="search-bar">
            <input placeholder="search book"/>
        </div>
      </div>
      <div className="bookshelf-container">
        <p> # stories on the shelf </p>
        <hr className="hr-secondary"/>
        <div className="cards">
            <Card/>
        </div>

      </div>
    </div>
  )
}

export default BookShelfPage
