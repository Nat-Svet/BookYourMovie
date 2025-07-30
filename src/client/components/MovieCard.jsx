import React from 'react';
import '../styles/MovieCard.css';

const MovieCard = ({ title, description, durationCountry, imageSrc, halls }) => {
  return (
    <div className="movie-card">
      <div className="movie-card__container">
        <img className="movie-card__image" src={imageSrc} alt={title} />
        <div>
          <h5 className="movie-card__title">{title}</h5>
          <p className="movie-card__description">{description}</p>
          <small className="movie-card__duration">{durationCountry}</small>
        </div>
      </div>

      {halls.map(({ name, times }) => (
        <div key={name}>
          <div className="movie-card__hall">{name}</div>
          <div className="movie-card__times btn-group mb-2" role="group" aria-label={name}>
            {times.map(time => (
              <button key={time} type="button" className="btn btn-light btn-sm">
                {time}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieCard;
