import { useNavigate } from 'react-router-dom';
import './Lists.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Lists = () => {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);

  const fetchMovies = async () => {
    try {
      const response = await axios.get('/movies');
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleRemove = async (id) => {
    const confirmDeletion = window.confirm(
      'Are you sure you want to remove this movie?'
    );
    if (confirmDeletion) {
      try {
        await axios.delete(`/movies/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        // Update state to remove the deleted movie
        setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== id));
      } catch (error) {
        console.error('Error removing movie:', error);
      }
    }
  };

  return (
    <div className="movie-list-container">
      <div className="header">
        <h1>Your Movie Collection</h1>
        <button
          className="btn-add-movie"
          onClick={() => navigate('/main/movies/form')}
        >
          + Add New Movie
        </button>
      </div>
      <div className="movie-table-container">
        {movies.length > 0 ? (
          <table className="movie-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie.id}>
                  <td>{movie.id}</td>
                  <td>{movie.title}</td>
                  <td>
                    <button
                      className="btn-edit-movie"
                      onClick={() => navigate('/main/movies/form/' + movie.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-remove-movie"
                      onClick={() => handleRemove(movie.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-movies-message">
            No movies found. Add your first movie!
          </div>
        )}
      </div>
    </div>
  );
};

export default Lists;
