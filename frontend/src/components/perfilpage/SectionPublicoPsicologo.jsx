import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { usePsicologos } from "../../context/Psicologos";
import InfoPublicoPsicologo from "./InfoPublicoPsicologo.jsx";
import Calendario from "./Calendario.jsx";
import SobrePsicologo from "./SobrePsicologo.jsx";
import VerPsi from "../popups/Verpsi.jsx";
import SkipNavigation from "../SkipNavigation.jsx";

export default function PerfilPublicoPsicologo() {
  const { id } = useParams();
  const location = useLocation();
  const { psicologos } = usePsicologos();
  const [perfil, setPerfil] = useState(null);
  const [openPsi, setOpenPsi] = useState(false);

  useEffect(() => {
    // Se veio o perfil pelo navigate (state), usa ele direto
    if (location.state?.perfil) {
      setPerfil(location.state.perfil);
      return;
    }

    // Se não veio, tenta buscar pelo contexto
    if (psicologos?.length > 0) {
      const encontrado = psicologos.find(p => String(p.id) === String(id));
      if (encontrado) {
        console.log("Perfil encontrado no contexto:", encontrado);
        setPerfil(encontrado);
      }
    }
  }, [id, psicologos, location.state]);

  if (!perfil) return <div>Carregando perfil...</div>;

  return (
    <>
    < SkipNavigation mainContent="cardPerfilPsicologoPublico" />
    <div className="container-section-perfil">
      <div className="sobre-notif-container">
        <InfoPublicoPsicologo />
        <SobrePsicologo profileData={psicologos}/>
      </div>

      <div className="perfil-container">
        <Calendario  />
         {openPsi && perfil && (
          <VerPsi
            open={openPsi}
            close={() => setOpenPsi(false)}
            perfil={perfil}
            modo="marcar"
          />
         )}
      </div>
    </div>
    </>
  );
}
