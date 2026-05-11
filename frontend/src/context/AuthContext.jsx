import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Recarrega usuário do localStorage no refresh da página
    useEffect(() => {
        const verifyUser = async () => {
            const token = authService.getToken();
            const savedUser = localStorage.getItem("user");
            const savedUsername = authService.getUsername();

            if (token && savedUser) {
                const parsedUser = JSON.parse(savedUser);
                const username = parsedUser.login || parsedUser.username || savedUsername;

                // Só tenta verificar se tiver um identificador válido
                if (username && username !== "undefined") {
                    try {
                        // Tenta buscar os dados básicos para ver se ainda existe no DB
                        await authService.getUserData(username, parsedUser.tipo);
                        setUser(parsedUser);
                    } catch (err) {
                        // SÓ desloga se for um erro explícito de "não encontrado" (404) ou "não autorizado" (401)
                        if (err.status === 404 || err.status === 401) {
                            console.error("Usuário não encontrado ou sessão inválida (DB reset?):", err);
                            authService.logout();
                            setUser(null);
                        } else {
                            console.warn("Servidor indisponível ou erro temporário, mantendo sessão local.");
                            setUser(parsedUser);
                        }
                    }
                } else {
                    // Se não tem username mas tem token/user, assume que a sessão local é válida (fallback)
                    setUser(parsedUser);
                }
            }
            setLoading(false);
        };

        verifyUser();
    }, []);

    // Login
    async function login(login, senha, tipo) {
        setLoading(true);
        setError("");
        try {
            // 1. Autentica e recebe token + refreshToken
            const authData = await authService.login(login, senha, tipo);

            // 2. Busca dados completos do usuário
            const userData = await authService.getUserData(authData.username, authData.tipo);
            
            // Garante que o login/username esteja no objeto para persistência
            const userWithLogin = { ...userData, login: authData.username };

            setUser(userWithLogin);
            localStorage.setItem("user", JSON.stringify(userWithLogin));
            return { success: true, user: userWithLogin };
        } catch (err) {
            const errorMessage = err.message || "Erro ao fazer login";
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }

    // Cadastro genérico (paciente, psicólogo ou voluntário)
    async function registerUser(userData) {
        setLoading(true);
        setError("");

        try {
            let newUser;
            const tipo = userData.tipo || userData.tipoUsuario;

            if (tipo === "paciente") {
                newUser = await authService.registerPaciente(userData);
            } else if (tipo === "psicologo") {
                newUser = await authService.registerPsicologo(userData);
            } else if (tipo === "voluntario") {
                newUser = await authService.registerVoluntario(userData);
            } else {
                throw new Error("Tipo de usuário inválido");
            }

            // Login automático após cadastro
            await login(userData.email, userData.senha, tipo);

            return { success: true, user: newUser };
        } catch (err) {
            const errorMessage = err.message || "Erro ao cadastrar usuário";
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }

    // Logout — invalida refresh token no backend
    async function logout() {
        await authService.logout();
        setUser(null);
    }

    // Atualizar usuário no estado e localStorage
    function updateUser(newData) {
        const updatedUser = { ...user, ...newData };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
    }

    const value = {
        user,
        loading,
        error,
        login,
        registerUser,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isPaciente: user?.tipo === "paciente",
        isPsicologo: user?.tipo === "psicologo",
        isVoluntario: user?.tipo === "voluntario",
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de AuthProvider");
    }
    return context;
}