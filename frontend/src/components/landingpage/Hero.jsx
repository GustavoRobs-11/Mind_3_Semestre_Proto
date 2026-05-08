import '../../assets/styles/landingpage/hero-apresentacao.css';

import logomarca from '../../assets/img/logomarca.svg'
import logo from '../../assets/img/logo.svg'
import bg2 from "../../assets/img/imagem-home.png"

import { useAuth } from '../../context/AuthContext';

import { Link } from 'react-router'

export default function Hero() {
  const { user, isAuthenticated, logout } = useAuth();
  return (
    <>
      <main className="main">

        <span>
          <img className="bg2" src={bg2} alt="Imagem inicial do site" />
          <div className="heading-hero">
            <img src={logo} alt="logo do site" />
            <div className="heading-1">
              <img src={logomarca} alt="logomarca ou nome do sistema mind estilizado" />
              <h1>... your mind</h1>
            </div>
          </div>
          <p>A plataforma que tem cuidado com a sua saúde mental diária</p>
          <div className="buttons-hero">
            <Link
              to="/"
              onClick={(e) => {
                if (window.location.pathname === "/") {
                  e.preventDefault();
                  document.getElementById('planos')?.scrollIntoView({
                    behavior: 'smooth'
                  });
                }
              }}>
              <button className="button-confirm" >Ver planos</button>
            </Link>
            {!isAuthenticated ? (<Link
              to="/login=0"
            >
              <button className="btn-hero-section" >Começar</button>
            </Link>) : (<></>)}


          </div>
        </span>


      </main>
    </>
  )
}
