import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCards from '../../../../components/MovieCards/MovieCards';
import { useMovieContext } from '../../../../context/MovieContext';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [featuredMovieIndex, setFeaturedMovieIndex] = useState(0);
  const { movieList, setMovieList, setMovie } = useMovieContext();

 
  const getMovies = async () => {
    try {
      const response = await axios.get('/movies');
      setMovieList(response.data);
      if (response.data.length) {
        setFeaturedMovieIndex(Math.floor(Math.random() * response.data.length)); 
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  useEffect(() => {
    if (movieList.length) {
      const interval = setInterval(() => {
        setFeaturedMovieIndex((prevIndex) => (prevIndex + 1) % movieList.length); 
      }, 5000); 

      return () => clearInterval(interval);
    }
  }, [movieList]);

  return (
    <div className="home-container">
      <h1 className="page-title">Client Movie</h1>

      <div className="featured-movie-section">
        {movieList.length ? (
          <div
            className="featured-movie"
            style={{
              backgroundImage: `url(${
                movieList[featuredMovieIndex].backdropPath !== 'https://image.tmdb.org/t/p/original/undefined'
                  ? movieList[featuredMovieIndex].backdropPath
                  : movieList[featuredMovieIndex].posterPath
              })`,
            }}
          >
            <div className="overlay">
              <h2 className="featured-title">{movieList[featuredMovieIndex].title}</h2>
            </div>
          </div>
        ) : (
          <div className="loading-spinner">Loading...</div>
        )}
      </div>

     
      <div className="movie-list">
        {movieList.length ? (
          movieList.map((movie) => (
            <MovieCards
              key={movie.id}
              movie={movie}
              onClick={() => {
                navigate(`/view/${movie.id}`);
                setMovie(movie);
              }}
            />
          ))
        ) : (
          <div className="loading-spinner">Loading Movies...</div>
        )}
      </div>
    </div>
  );
};

export default Home;
