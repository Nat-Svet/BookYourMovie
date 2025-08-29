import React from "react";
import "../styles/MovieCard.css";
import { useNavigate } from "react-router-dom";

const MovieCard = ({
  title,
  description,
  durationCountry,
  imageSrc,
  halls,
  selectedDate,
}) => {
  const navigate = useNavigate();

  const handleTimeClick = (seanceId, time, hallName, hallId) => {
    const seanceDateTime = `${selectedDate} ${time}`;

    navigate(`/booking/${seanceId}`, {
      state: {
        filmName: title,
        sessionTime: time,
        sessionDate: selectedDate,
        hallName,
        hallId, // ✅ передаём hallId
        seanceId,
        seanceDateTime,
      },
    });
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

      {halls &&
        halls.map(({ id: hallId, name, seances }) => {
          const sortedSeances = [...seances].sort((a, b) => {
            const [h1, m1] = a.time.split(":").map(Number);
            const [h2, m2] = b.time.split(":").map(Number);
            return h1 * 60 + m1 - (h2 * 60 + m2);
          });

          return (
            <section className="mc__hall" key={name} aria-labelledby={`hall-${name}`}>
              <h4 className="mc__hall-title" id={`hall-${name}`}>{name}</h4>
              <div className="mc__times" role="list">
                {sortedSeances.map(({ time, id }) => {
                  const now = new Date();
                  const [hours, minutes] = time.split(":").map(Number);
                  const seanceTime = new Date(selectedDate);
                  seanceTime.setHours(hours, minutes, 0, 0);

                  const isToday = selectedDate === new Date().toISOString().split("T")[0];
                  const isPast = isToday && seanceTime < now;

                  return (
                    <button
                      key={id}
                      type="button"
                      className={`mc__time${isPast ? " mc__time--disabled" : ""}`}
                      role="listitem"
                      aria-label={`Сеанс в ${time} в ${name}`}
                      onClick={!isPast ? () => handleTimeClick(id, time, name, hallId) : undefined}
                      disabled={isPast}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
    </article>
  );
};

export default MovieCard;
