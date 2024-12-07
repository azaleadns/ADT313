import { useEffect } from 'react';
import { useMovieContext } from '../../../../context/MovieContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function View() {
  const { movie, setMovie } = useMovieContext();

  const { movieId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (movieId !== undefined) {
      axios
        .get(`/movies/${movieId}`)
        .then((response) => {
          setMovie(response.data);
        })
        .catch((e) => {
          console.log(e);
          navigate('/');
        });
    }
    return () => {};
  }, [movieId]);

  return (
    <>
      {movie && (
        <>
          <div>
            <div className="banner">
              <h1>{movie.title}</h1>
            </div>
            <h3>{movie.overview}</h3>
            {JSON.stringify(movie)}
          </div>

          {/* Cast & Crew */}
          {movie.casts && movie.casts.length > 0 && (
            <div className="section">
              <h2>Cast & Crew</h2>
              <ul className="cast-list">
                {movie.casts.map((cast, index) => (
                  <li key={index}>{cast.name}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Videos */}
          {movie.videos && movie.videos.length > 0 && (
            <div className="section">
              <h2>Videos</h2>
              <div className="video-gallery">
                {movie.videos.map((video, index) => (
                  <video key={index} controls>
                    <source src={video.url} type="video/mp4" />
                  </video>
                ))}
              </div>
            </div>
          )}

         {/* Photos */}
{movie.photos && movie.photos.length > 0 && (
  <div className="section">
    <h2>Photos</h2>
    <div className="photo-gallery">
  {movie.photos.map((photo, index) => (
    <img
      className="img"
      key={index}
      src={photo.url}
      alt={`Movie Photo ${index + 1}`}
    />
  ))}
</div>

    </div>
)}

        </>
      )}
    </>
  );
}

export default View;