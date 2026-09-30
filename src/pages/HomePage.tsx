import { NavLink } from 'react-router-dom'

function HomePage() {
    return (
        <div className='container'>
            <div className='homepage-header'>
                <div className='header-left-content'>
                    <div className='tilted-tile'>
                        <i className="fa-solid fa-star"/>
                        <p>  your reading life on your own terms </p>
                    </div>
                    <div className='heading'>
                        <h1> Make <br/> Room For </h1>
                        <h1 className='tile-primary'> One More </h1>
                        <h1 className='tilted-tile-primary'> Chapter. </h1>
                    </div>
                    <p> A bookish little corner to track your pace, find your next favorite and make reading a part of your everyday life again. </p>
                    <div className='buttons'>
                        <NavLink to="/" className="btn-primary"> Keep Reading </NavLink>
                        <NavLink to="/" className="btn-default"> + Add to shelf </NavLink>
                    </div>
                </div>
                <div className='header-right-content'>
                    <div className='header-stats'>
                    </div>
                    <div className='tilted-tiles'>
                        <p className='tilted-tile-secondary'> currently reading </p>
                        <p className='tilted-tile'> 3 pages this week </p>
                        <p className='tilted-tile-default'> 65% through </p>
                    </div>
                    <div className='tilted-cards'>
                        <div className='tilted-card tilted-card-left'>
                            <img src='https://m.media-amazon.com/images/I/81k3bgJ2EhL._SY522_.jpg' alt='Book cover'/>
                            <p> image </p>
                        </div>
                        <div className='tilted-card tilted-card-right'>
                            <img src='https://m.media-amazon.com/images/I/81k3bgJ2EhL._SY522_.jpg' alt='Book cover'/>
                            <p> image </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage
