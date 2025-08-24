import React from "react";
import "../styles/MovieCard.css";

const MovieCard = ({ 
  title, 
  description, 
  durationCountry, 
  imageSrc, 
  halls,
  onTimeClick,
  selectedDate 
}) => {
  const handleTimeClick = (seanceId, time) => {
    if (onTimeClick) {
      onTimeClick(seanceId, time, selectedDate);
    }
  };

  return (
    <article className="mc">
      <div className="mc__top">
        <img className="mc__poster" src={imageSrc} alt={title} loading="lazy" />

        <div className="mc__info">
          <h3 className="mc__title">
            <span className="mc__title-accent" aria-hidden="true" />
            {title}
          </h3>

          <p className="mc__desc">{description}</p>
          <p className="mc__meta">{durationCountry}</p>
        </div>
      </div>

      {halls && halls.map(({ name, seances }) => (
        <section className="mc__hall" key={name} aria-labelledby={`hall-${name}`}>
          <h4 className="mc__hall-title" id={`hall-${name}`}>{name}</h4>
          <div className="mc__times" role="list">
            {seances && seances.map(({ time, id }) => (
              <button
                key={id}
                type="button"
                className="mc__time"
                role="listitem"
                aria-label={`Сеанс в ${time} в ${name}`}
                onClick={() => handleTimeClick(id, time)}
              >
                {time}
              </button>
            ))}
          </div>
        </section>
      ))}
    </article>
  );
};

export default MovieCard;