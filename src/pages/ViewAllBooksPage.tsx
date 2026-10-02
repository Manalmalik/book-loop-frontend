import { useEffect, useState } from "react"
import Card from "../components/Card"
import axios from "axios"
import authService from "../services/index.services";
import { useAuth } from "../context/useAuth";

type Book = {
  id: number,
  title: string,
  author: string,
  description: string,
  coverUrl: string,
  genre: string,
  totalPages: number,
  isbn?: string | null,
  publishedYear?: number | null,
};

const GENRE_OPTIONS = [
    {value: "fiction" , label:"fiction"},
    {value: "romance", label: "romance"},
    {value: "fantasy romance", label: "fantasy romance"}
]

function ViewAllBooksPage() {
    const [ allBooks, setAllBooks ] = useState<Book[]>([])
    const [ searchTerm, setSearchTerm ] = useState<string>("")
    const [ selectedGenre, setSelectedGenre ] = useState<string>("")
    const { loggedUserId } = useAuth()

    const fetchAllBooks = async() => {
        try{
            const response = await axios.get( `${import.meta.env.VITE_SERVER_URL}/api/books`);
            console.log(response.data)
            setAllBooks(response.data.allBooks)
        } catch(e) {
            console.log(e)
        }
        
    }

    useEffect(()=> {
        fetchAllBooks()
    }, [])

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)

    }

    const handleInputSelect = (genre: string) => {
        setSelectedGenre(genre)
    }

    const normalizedSearchTerm = searchTerm.trim().toLowerCase()
    const filteredBooks = allBooks.filter((book) => {
        const matchesSearch = book.title.toLowerCase().includes(normalizedSearchTerm)
        const matchesGenre = !selectedGenre || book.genre.trim().toLowerCase() === selectedGenre.toLowerCase()
        return matchesSearch && matchesGenre
    })

    const handleBookmarkClick = async(bookId: number,) => {
        try {
            const response = await authService.post(`/auth/user-books/${bookId}`, {status: "WANT_TO_READ"})
            console.log(response)
        }catch(e) {
            console.log(e)
        }
    }

     const handleStartBtnClick = async(bookId: number) => {
        try {
            const response = await authService.post(`/auth/user-books/${bookId}`, {status: "READING"})
            console.log(response)
        }catch(e) {
            console.log(e)
        }
    }

  return (
   <div className='container'>
      <div className='header-container'>
        <div className="page-header">
            <h1> Discover </h1>
            <h1 className="tile-primary"> Books </h1>
        </div>
        <div className="search-bar">
            <input type="text" placeholder="search book" name="searchTerm" value={searchTerm} onChange={handleSearchInput}/>
        </div>
        <div className="filter-bar">
            <select
                aria-label="Filter by genre"
                value={selectedGenre}
                onChange={(e) => handleInputSelect(e.target.value)}
            >
                <option value="">All Genres </option>
                {GENRE_OPTIONS.map((genre) => (
                <option key={genre.value} value={genre.value}>{genre.label}</option>
                ))}
          </select>
        </div>
      </div>
      {allBooks.length === 0 && <p> is Loading...</p>}
      <div className="bookshelf-container">
        <h3> {filteredBooks.length} Books to choose from </h3>
        <p> Your next adventure awaits </p>
        <hr className="hr-secondary"/>
        <div className="cards">
            {filteredBooks?.map((book) => {
                return <Card key={book.id} title={book.title} author={book.author} coverUrl={book.coverUrl} genre={book.genre} handleBookmarkClick={()=> handleBookmarkClick(book.id)} handleStartBtnClick={() => handleStartBtnClick(book.id)}/>
            })}
        </div>

      </div>
    </div>
  )
}

export default ViewAllBooksPage
