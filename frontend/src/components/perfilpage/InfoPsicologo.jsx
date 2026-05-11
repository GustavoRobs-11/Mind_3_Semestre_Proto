import { useAuth } from "../../context/AuthContext";
import { HiOutlinePhone, HiOutlineMail } from "react-icons/hi";
import { getImageUrl, getDefaultAvatar } from "../../utils/imageHelper";
import "../../assets/styles/perfil/info.css";
import { Link } from "react-router-dom";

export default function InfoPsicologo({ profileData }) {
  const { user } = useAuth();

  if (!profileData) return <p>Carregando...</p>;

  return (
    <div className="card-perfil-content" id="cardPerfilPsicologo">
      <div className="foto-perfil">
        <div className="banner-perfil"></div>
        <img 
          id="perfilFoto" 
          src={getImageUrl(profileData.imgPerfil) || getDefaultAvatar()} 
          alt="Foto do Psicólogo"
          onError={(e) => {
            if (e.currentTarget.src !== getDefaultAvatar()) {
              e.currentTarget.src = getDefaultAvatar();
            }
          }}
        />
        <div className="info-perfil">
          <h3 id="perfilNome">{profileData.nome}</h3>

          <div className="container-info">
            <p id="perfilIdade">Idade:</p>
            <label>{profileData.idade || "idade teste"}</label>
          </div>

          <div className="container-info">
            <p id="perfilLocal">Local:</p>
            <label>{profileData.local || "Local - UF"}</label>
          </div>

          <div className="container-info">
            <p id="perfilLocal">CRP:</p>
            <label>{profileData.crp || ""}</label>
          </div>
        </div>
      </div>

      <div className="settings">
        <div className="container-contatos">
          <div className="contato">
            <button 
              type="button" 
              className="icon-btn icon-ui" 
              onClick={() => navigator.clipboard.writeText(profileData.telefone || "")}
            >
              <HiOutlinePhone />
            </button>
            <span>{profileData.telefone || "+55 11 9000-0000"}</span>
          </div>

          <div className="contato">
            <button 
              type="button" 
              className="icon-btn icon-ui" 
              onClick={() => navigator.clipboard.writeText(profileData.email || "")}
            >
              <HiOutlineMail />
            </button>
            <span>{profileData.email || "seuemail.com"}</span>
          </div>
        </div>

        <div className="container-config-artigos">
          <Link to={`/${user.tipo}/perfil/clientes`} className="button-confirm">
            Clientes
          </Link>
          <Link to="/adicionar-artigos" className="button-confirm">
            Criar Artigos
          </Link>
          <Link to={`/${user.tipo}/perfil/configuracoes`} className="button-confirm">
            Configurações
          </Link>
        </div>
      </div>
    </div>
  );
}
