import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import api from '../../services/api';

import Point from '../../components/Point';

import logo from '../../assets/logo.svg';

import './styles.css';

interface Point {
  id: number;
  name: string;
  image_url: string;
  city: string;
  uf: string;
  items: string;
}

const Points = () => {
  const [ points, setPoints ] = useState<Point[]>([]);

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    api.get('points', {
      params: {
        city: searchParams.get('city'),
        uf: searchParams.get('uf'),
      }
    }).then(response => {
      setPoints(response.data);
    }).catch(error => console.log(error));
      
  }, [ location ]);

  return (
    <>
      <div id="container-page-points"></div>
      <div id="page-points">
        <header>
          <img src={ logo } alt="Ecoleta"/>
          <Link to="/">
            <FiArrowLeft />
            Voltar para home
          </Link>
        </header>

        <main>
          {points && points.length === 0 && <div className="without-information">
            Nenhum ponto de coleta encontrado.
          </div>}
          {points && points.length > 0 && <div>
            <strong>{ points.length } ponto{ points.length > 1 ? 's' : '' }</strong> encontrado{ points.length > 1 ? 's' : '' }
          </div>}
          <div className="points-container">
            { points.map(point => (
              <Point pointInfo={ point } key={ point.id } />
            )) }
          </div>
        </main>
      </div>
    </>
  );
}

export default Points;