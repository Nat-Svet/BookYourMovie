import React from 'react';
import Header from './Header';
import MovieCard from './MovieCard';
import SeatLegend from './SeatLegend';
import Button from './Button';
import Seat from './Seat';

import '../styles/Layout.css';  // стили с фоном

function Layout() {
  // Пример данных мест (замени на реальные)
  const seats = [
    { id: 1, type: 'free' },
    { id: 2, type: 'vip' },
    { id: 3, type: 'occupied' },
    { id: 4, type: 'selected' },
  ];

  return (
    <div className="layout">
      <div className="container py-4">
        <Header />

        <MovieCard />

        {/* Сетка для карты мест и легенды */}
        <div className="row">
          <div className="col-md-9">
            <div className="seat-map d-flex flex-wrap gap-2">
              {seats.map(seat => (
                <Seat key={seat.id} type={seat.type} />
              ))}
            </div>
          </div>
          <div className="col-md-3">
            <SeatLegend />
          </div>
        </div>

        <div className="text-center mt-4">
          <Button text="ЗАБРОНИРОВАТЬ" />
        </div>
      </div>
    </div>
  );
}

export default Layout;
