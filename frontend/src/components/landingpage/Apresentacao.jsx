import { Link } from "react-router"
import apresentacao from "../../assets/img/home_img_3.svg"
import '../../assets/styles/landingpage/hero-apresentacao.css';

export default function Apresentacao() {
  return (
    <>
      <section id="apresentacao">

        <div className="sessoes-online-box">
          <div className="block-left">
            <div className="block-text">
              <h4>Sessões <span className="destaque">online</span></h4>
              <p>Aqui nossa missão é tornar o cuidado psicológico acessível a <br/>todos , oferecendo uma plataforma intuitiva que conecta você a<br/> psicólogos qualificados, de forma simples e segura.</p>
            </div>
            <div className="block-text">
              <h4>Horários flexiveis</h4>
              <p>Aqui você tem flexibilidade: a plataforma funciona o tempo todo<br/> e você pode marcar seu atendimento no horário que fizer mais<br/> sentido para você</p>
            </div>
            
          </div>

        </div>

        <article className="block-right">

          <img className="apres-img" src={apresentacao} alt="ilustração - simulando video chamada" />
          <div className="btn-article">
              <Link to="/sobrenos">
                <button className="conhecer-btn button-confirm">Conhecer!</button>
              </Link>
            </div>
        </article>

      </section>
    </>
  )
}
