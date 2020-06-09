import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import api from '../../services/api';

import logo from '../../assets/logo.svg';

import './styles.css';

interface Point {
  id: number;
  name: string;
  image_url: string;
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
        items: '1,2,3,4,5,6'
      }
    }).then(response => {
      setPoints(response.data);
    }).catch(error => console.log(error));
      
  }, [ location ]);

  return (
    <div id="page-points">
        <header>
          <img src={ logo } alt="Ecoleta"/>
          <Link to="/">
            <FiArrowLeft />
            Voltar para home
          </Link>
        </header>

        <main>
          <div>
            <strong>2 pontos</strong> encontrados
          </div>
          <div>
            {points.map(point => (
              <div key={ point.id }>{ point.name }</div>
            ))}
          </div>
        </main>
    </div>
  );
}

export default Points;