import "../../assets/styles/perfil/logout.css";
import { useAuth } from '../../context/AuthContext';
import { HiOutlineLogout } from "react-icons/hi";

import { useNavigate } from 'react-router-dom';

export default function Logout({ setDropdownOpen }) {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate("/landing");
    };

    return (
        <>{isAuthenticated ? (
                <button
                    type="button"
                    className='container-sair button-proceed'
                    onClick={() => {
                        handleLogout();
                        if (setDropdownOpen) setDropdownOpen(false);
                    }}>

                    <HiOutlineLogout className="container-sair-icon"/>
                    <h3>Log out</h3>

                </button>
            ) : (
                <>
                </>
            )}
        </>
    );
}