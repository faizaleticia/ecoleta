import React from 'react';

import './styles.css';

interface Props {
  pointInfo: {
    id: number;
    image_url: string;
    name: string;
    city: string;
    uf: string;
    items: string;
  };
}

const Point: React.FC<Props> = ({ pointInfo }) => {
  return (
    <div id="point-info">
      <img src={ pointInfo.image_url } alt={ pointInfo.name }/>
      <div className="point-info-container">
        <h2>{ pointInfo.name }</h2>
        <div className="items-point">{ pointInfo.items }</div>
        <div className="address-point">{ pointInfo.city }, { pointInfo.uf }</div>
      </div>
    </div>
  );
}

export default Point;