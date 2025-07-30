import React from 'react';
import ClientHeader from '../components/ClientHeader';
import MovieCard from '../components/MovieCard';
import Button from '../components/Button';
import Layout from '../components/Layout';
import DatesNav from '../components/DatesNav';
import '../styles/MovieList.css';

import poster1 from '../../assets/images/poster1.jpg.png';
import poster2 from '../../assets/images/poster2.jpg.png';



const movies = [
  {
    title: 'Звёздные войны XXIII: Атака клонированных клонов',
    description: 'Две сотни лет назад малороссийские хутора разоряла шайка нехристь-ляхов во главе с могущественным колдуном.',
    durationCountry: '130 минут США',
    imageSrc: poster1,
    halls: [
      { name: 'Зал 1', times: ['10:20', '14:10', '18:40', '22:00'] },
      { name: 'Зал 2', times: ['11:15', '14:40', '16:00', '18:30', '21:00', '23:30'] },
    ],
  },
  {
    title: 'Альфа',
    description: '20 тысяч лет назад Земля была холодным и неуютным местом, в котором смерть подстерегала человека на каждом шагу.',
    durationCountry: '96 минут Франция',
    imageSrc: poster2,
    halls: [
      { name: 'Зал 1', times: ['10:20', '14:10', '18:40', '22:00'] },
      { name: 'Зал 2', times: ['11:15', '14:40', '16:00', '18:30', '21:00', '23:30'] },
    ],
  },
  {
    title: 'Хищник',
    description: 'Самые опасные хищники Вселенной, прибыв из глубин космоса, высаживаются на улицах маленького городка...',
    durationCountry: '101 минута Канада, США',
    imageSrc: poster2,
    halls: [
      { name: 'Зал 1', times: ['09:00', '10:10', '12:55', '14:15', '14:50', '16:30', '18:00', '18:50', '19:50', '20:55', '22:00'] },
    ],
  },
];

const MovieList = () => {
  return (
    <Layout>
      <div className="movie-list-container">
        <div className="movie-list-header">
          <ClientHeader />
          <Button>Войти</Button>
        </div>

        <DatesNav />


        <div className="movie-list-movies">
          {movies.map(movie => (
            <MovieCard
              key={movie.title}
              title={movie.title}
              description={movie.description}
              durationCountry={movie.durationCountry}
              imageSrc={movie.imageSrc}
              halls={movie.halls}
            />
            
          ))}
        
        </div>
        </div>
        
      
    </Layout>
  );
};


export default MovieList;
