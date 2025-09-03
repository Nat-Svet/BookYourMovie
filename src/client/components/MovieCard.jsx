import React from "react";
import "../styles/MovieCard.css";
import { useNavigate } from "react-router-dom"; // Импортируем хук для перехода между страницами //

const MovieCard = ({
  title,
  description,
  durationCountry,
  imageSrc,
  halls,
  selectedDate,
}) => {
  // Хук для программного перехода на другую страницу //
  const navigate = useNavigate();

  // Функция вызывается при клике на время сеанса //
  const handleTimeClick = (seanceId, time, hallName, hallId) => {
    // Собираем полную дату и время сеанса //
    const seanceDateTime = `${selectedDate} ${time}`;

    // Переходим на страницу бронирования и передаём все нужные данные //
    navigate(`/booking/${seanceId}`, {
      state: {
        filmName: title,
        sessionTime: time,
        sessionDate: selectedDate,
        hallName,
        hallId, // передаём id зала !!! //
        seanceId,
        seanceDateTime,
      },
    });
  };

  return (
    // Основной контейнер карточки фильма //
    <article className="mc">
      <div className="mc__top">
        {/* Постер фильма */}
        <img className="mc__poster" src={imageSrc} alt={title} loading="lazy" />
        {/* Блок с информацией о фильме */}
        <div className="mc__info">
          <h3 className="mc__title">
            <span className="mc__title-accent" aria-hidden="true" />
            {title}
          </h3>
          <p className="mc__desc">{description}</p>
          <p className="mc__meta">{durationCountry}</p>
        </div>
      </div>

      {/* Если есть залы — выводим по каждому список сеансов */}
      {halls &&
        halls.map(({ id: hallId, name, seances }) => {
          // Сортируем сеансы по времени (часы и минуты) //
          const sortedSeances = [...seances].sort((a, b) => {
            const [h1, m1] = a.time.split(":").map(Number);
            const [h2, m2] = b.time.split(":").map(Number);
            return h1 * 60 + m1 - (h2 * 60 + m2);
          });

          return (
            // Разметка для одного зала //
            <section className="mc__hall" key={name} aria-labelledby={`hall-${name}`}>
              <h4 className="mc__hall-title" id={`hall-${name}`}>{name}</h4>
              {/* Список кнопок-времён сеансов */}
              <div className="mc__times" role="list">
                {sortedSeances.map(({ time, id }) => {
                  // Получаем текущее время //
                  const now = new Date();
                  // Разбиваем время сеанса на часы и минуты //
                  const [hours, minutes] = time.split(":").map(Number);
                  // Создаём объект даты/времени для сеанса //
                  const seanceTime = new Date(selectedDate);
                  seanceTime.setHours(hours, minutes, 0, 0);

                  // Проверяем: сеанс сегодня? //
                  const isToday = selectedDate === new Date().toISOString().split("T")[0];
                  // Проверяем: время сеанса уже прошло? //
                  const isPast = isToday && seanceTime < now;

                  return (
                    // Кнопка времени сеанса //
                    <button
                      key={id}
                      type="button"
                      className={`mc__time${isPast ? " mc__time--disabled" : ""}`}
                      role="listitem"
                      aria-label={`Сеанс в ${time} в ${name}`}
                      onClick={!isPast ? () => handleTimeClick(id, time, name, hallId) : undefined}
                      disabled={isPast} // отключаем кнопку, если сеанс уже прошёл //
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
