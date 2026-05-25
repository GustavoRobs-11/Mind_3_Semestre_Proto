import { useState } from "react";
import "../../../assets/styles/perfil/section.css";
import InfoPsicologo from './InfoPsicologo.jsx';
import Calendario from './CalendarioPsicologo.jsx';
import SobrePsicologo from './SobrePsicologo.jsx';
import SideBarPsicologo from './SideBarPsicologo.jsx';
import ArtigosPerfil from '../ArtigosPerfil.jsx';
import SkipNavigation from "../../SkipNavigation.jsx";
import ProfileNavbar from '../ProfileNavbar.jsx';
import ListaClientes from '../../../pages/ListaClientes.jsx';
import { Link } from "react-router-dom";

export default function SectionPsicologo({ profileData }) {
    const [activeTab, setActiveTab] = useState("perfil");

    const tabs = [
        { key: "perfil", label: "Perfil" },
        { key: "clientes", label: "Clientes" },
        { key: "agenda", label: "Agenda" },
        { key: "financeiro", label: "Financeiro" },
    ];

    const renderTabContent = () => {
        if (activeTab === "clientes") {
            return <ListaClientes />;
        }

        if (activeTab === "agenda") {
            return <Calendario />;
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
                        <InfoPsicologo profileData={profileData} />
                        <SobrePsicologo profileData={profileData} />
                        <ArtigosPerfil id={profileData?.id} />
                    </div>
                    <div className="container-sidebar">
                        <aside className="perfil-sidebar">
                            <SideBarPsicologo profileData={profileData} />
                        </aside>
                    </div>
                </div>

            </>
        );
    };

    return (
        <>
            <SkipNavigation mainContent="cardPerfilPsicologo" />
            <div className="container-section-perfil">
                <ProfileNavbar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
                <div className="perfil-layout-grid">
                    <main className="perfil-main-content">{renderTabContent()}</main>
                </div>
            </div>
        </>
    );
}
