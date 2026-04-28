import { usePsicologos } from "../../context/Psicologos";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { HiOutlineMail } from "react-icons/hi";
import { agendar } from "../../services/agendaService.js";
import { toast } from "react-toastify";
import fotoPsi from '../../assets/img/perfil-default.png';
import VerPsi from "../popups/Verpsi"; // Importa o pop-up
import "../../assets/styles/perfil/info.css";

export default function InfoPublicoPsicologo() {
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

    const handleAgendamento = async (dados) => {
        try{
            await agendar({
            ...dados,
            psicologoId: perfil.id
            });

        } catch (err) {
            toast.error(err.message || "Erro ao realizar agendamento")
        }
    }

    if (!perfil) return <p>Carregando...</p>;

    return (
        <>
            <div className="card-perfil-content" id="cardPerfilPsicologoPublico">
                <div className="foto-perfil">
                    <div className="banner-perfil"></div>
                    <img id="perfilFoto" src={fotoPsi} alt="Foto do Psicólogo" />
                    <div className="info-perfil">
                        <h3 id="perfilNome">{perfil.nome}</h3>

                        <div className="container-info">
                            <p>Idade:</p>
                            <label>{perfil.idade || "—"}</label>
                        </div>

                        <div className="container-info">
                            <p>Local:</p>
                            <label>{perfil.local || "—"}</label>
                        </div>

                        <div className="container-info">
                            <p>CRP:</p>
                            <label>{perfil.crp || "—"}</label>
                        </div>
                    </div>
                </div>

                <div className="settings">
                    <div className="container-contatos">
                        <div className="contato">
                            <button
                                type="button"
                                className="icon-btn icon-ui"
                                onClick={() => navigator.clipboard.writeText(perfil.email || "")}
                            >
                                <HiOutlineMail />
                            </button>
                            <span>{perfil.email || "email@exemplo.com"}</span>
                        </div>
                    </div>

                    <div className="container-config-artigos">
                        <button
                            className="button-ver-card-psi"
                            id="btn-abrir-pop-up"
                            onClick={() => setOpenPsi(true)}
                        >
                            Agendar
                        </button>
                    </div>
                </div>
            </div>

            {/* Renderiza o pop-up VerPsi */}
            <VerPsi
                open={openPsi}
                close={() => setOpenPsi(false)}
                perfil={perfil}
                modo="marcar"
                onConfirm={handleAgendamento}
            />
        </>
    );
}
