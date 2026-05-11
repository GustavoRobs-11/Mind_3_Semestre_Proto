import perfil from "../../assets/img/perfil-default.png";
import { Link } from "react-router-dom";
import { HiOutlineClipboardList } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";

export default function CardClientes({cliente}) {
    const { user } = useAuth();

    return (
        <>
            <div className="card-cliente">
                <div className="card-cliente-name">
                    <img
                        src={cliente.foto}
                        alt={`Foto de perfil: ${cliente.nome}`}
                        onError={(e) => {
                            e.target.src = perfil;
                        }}/>
                    <h3>{cliente.nome}</h3>
                </div>
                <p className={`status-tag status-${cliente.status.toLowerCase()}`}>{cliente.status}</p>
                <p>{cliente.email}</p>
                <p>{cliente.dataInicio}</p>
                <Link 
                    className="icon-edit button-prontuario" 
                    to={`/psicologo/perfil/clientes/prontuario/${cliente.idProntuario}`}>
                    <HiOutlineClipboardList />
                </Link>
            </div>
        </>
    )
}
