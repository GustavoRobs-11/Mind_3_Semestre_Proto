import { useState } from "react";
import "../../../assets/styles/perfil/section.css";
import Info from './Info.jsx';
import Calendario from './CalendarioPaciente.jsx';
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
        { key: "dashboard", label: "Dashboard" },
        { key: "agenda", label: "Agenda" },
        { key: "financeiro", label: "Financeiro" },
    ];

    const renderTabContent = () => {
        if (activeTab === "agenda") {
            return <Calendario />;
        }

        if(activeTab === "dashboard"){
            return(
                <h1>Dashboard em construção</h1>
            )
        }

        if (activeTab === "financeiro") {
            return (
                <div className="card-perfil-content perfil-placeholder">
                    <h1>Financeiro</h1>
                    <h2>Aqui você poderá consultar suas loucuras e baboseiras, se divirta e seja feliz pois você EU TO MANDANDO VAI LOGO!</h2>
                    <h4>Brincadeiras à parte, essa seção é um desabafo de uma pessoa louca :)</h4>
                    <h3>Assinado: Gustavo</h3>
                    <p>Por enquanto, va para a página de configurações para revisar seus dados de faturamento.</p>
                    <Link to="/psicologo/perfil/configuracoes" className="button-confirm">
                        Ir para configurações
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
