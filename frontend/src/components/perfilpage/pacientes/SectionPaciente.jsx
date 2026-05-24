import { useState } from "react";
import "../../../assets/styles/perfil/section.css";
import Info from './Info.jsx';
import Calendario from '../Calendario.jsx';
import Sobre from './Sobre.jsx';
import Logout from '../Logout.jsx';
import SkipNavigation from "../../SkipNavigation.jsx";
import ProfileNavbar from '../ProfileNavbar.jsx';
import SideBarPaciente from './SideBarPaciente.jsx';
import { Link } from "react-router-dom";

export default function SectionPaciente({ profileData }) {
    const [activeTab, setActiveTab] = useState("perfil");

    const tabs = [
        { key: "perfil", label: "Perfil" },
        { key: "agenda", label: "Agenda" },
        { key: "configuracoes", label: "Configurações" },
    ];

    const renderTabContent = () => {
        if (activeTab === "agenda") {
            return <Calendario />;
        }

        if (activeTab === "configuracoes") {
            return (
                <div className="card-perfil-content perfil-placeholder">
                    <h2>Configurações</h2>
                    <p>Aqui você pode revisar seus dados, ajustar notificações e atualizar informações pessoais.</p>
                    <Link to="/paciente/perfil/configuracoes" className="button-confirm">
                        Abrir configurações
                    </Link>
                </div>
            );
        }

        return (
            <>
                <div className="container-perfil-sidebar">
                    <div className="container-perfil">
                        <Info profileData={profileData} />
                        <Sobre profileData={profileData} />
                    </div>
                    <div className="container-sidebar">
                        <div className="perfil-sidebar">
                            <SideBarPaciente profileData={profileData} />
                        </div>
                    </div>
                </div>

            </>
        );
    };

    return (
        <>
            <SkipNavigation mainContent="cardPerfilPaciente" />
            <div className="container-section-perfil">
                <ProfileNavbar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
                <div className="perfil-layout-grid">
                    <main className="perfil-main-content">{renderTabContent()}</main>
                </div>
            </div>
        </>
    );
}
