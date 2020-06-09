import React, { useState, useEffect, ChangeEvent } from 'react';
import { FiLogIn, FiSearch, FiArrowLeft } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

import './styles.css';

import logo from '../../assets/logo.svg';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home = () => {
  const [ ufs, setUfs ] = useState<string[]>([]);
  const [ cities, setCities ] = useState<string[]>([]);

  const [ showSearch, setShowSearch ] = useState<boolean>(false);

  const [ selectedUf, setSelectedUf ] = useState('0');
  const [ selectedCity, setSelectedCity ] = useState('0');

  const history = useHistory();

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then((response) => {
        const ufInitials = response.data.map(uf => uf.sigla);
        setUfs(ufInitials);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (selectedUf === '0') return;

    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then((response) => {
        const cityNames = response.data.map(city => city.nome);
        setCities(cityNames);
      })
      .catch((error) => console.log(error));
  }, [ selectedUf ]);

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;
    setSelectedUf(uf);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;
    setSelectedCity(city);
  }

  function handleShowSearch() {
    setShowSearch(!showSearch);
  }

  function handleSubmit() {
    const searchParams = new URLSearchParams();
    searchParams.set('city', selectedCity); 
    searchParams.set('uf', selectedUf);

    history.push({
      pathname: '/points',
      search: searchParams.toString(),
    }); 
  }

  return (
    <div id="page-home">
      <div className="content">
        <header>
          <img src={ logo } alt="Ecoleta"/>
          <Link to="/create-point">
            <FiLogIn />
            Cadastre um ponto de coleta
          </Link>
        </header>

        <main>
          <h1>Seu marketplace de coleta de resíduos.</h1>
          <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</p>
          <div className="search" onClick={ handleShowSearch }>
            <span>
              <FiSearch />
            </span>
            <strong>Pesquisar pontos de coleta</strong>
          </div>
        </main>
      </div>
      <div className="modal" style={ showSearch ? { display: 'block' } : { display: 'none' } }>
        <div className="content">
          <header>
            <div className="close-modal" onClick={ handleShowSearch }>
              <FiArrowLeft />
              Voltar para home
            </div>
          </header>

          <main>
            <h1>Pontos de coleta</h1>
            <form onSubmit={ handleSubmit }>
              <fieldset>
                <div className="field">
                  <select 
                    name="uf" 
                    id="uf" 
                    value={ selectedUf } 
                    onChange={ handleSelectUf }
                  >
                    <option value="0">Selecione uma UF</option>
                    { ufs.map(uf => {
                      return (
                        <option key={ uf } value={ uf }>{ uf }</option>
                      );
                    })}
                  </select>
                </div>

                <div className="field">
                  <select 
                    name="city" 
                    id="city"
                    value={ selectedCity }
                    onChange= { handleSelectCity }
                    disabled={ selectedUf === "0" || cities.length === 0 }
                  >
                    <option value="0">Selecione uma cidade</option>
                    { cities.map(city => {
                      return (
                        <option key={ city } value={ city }>{ city }</option>
                      );
                    })}
                  </select>
                </div>
              </fieldset>

              <button type="submit">Buscar</button>
            </form>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Home;