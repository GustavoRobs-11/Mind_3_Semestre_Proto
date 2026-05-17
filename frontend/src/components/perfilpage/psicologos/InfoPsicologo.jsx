import { useAuth } from "../../../context/AuthContext";
import { HiOutlinePhone, HiOutlineMail } from "react-icons/hi";
import { getImageUrl, getDefaultAvatar } from "../../../utils/imageHelper";
import "../../../assets/styles/perfil/info.css";
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
        <div className="container-info-icons">
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
          <div className="container-contatos">
            <div className="contato">
              <button
                type="button"
                className="icon-btn icon-ui"
                onClick={() => navigator.clipboard.writeText(profileData.telefone || "")}
              >
                <HiOutlinePhone />
              </button>
            </div>
            <div className="contato">
              <button
                type="button"
                className="icon-btn icon-ui"
                onClick={() => navigator.clipboard.writeText(profileData.email || "")}
              >
                <HiOutlineMail />
              </button>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}
