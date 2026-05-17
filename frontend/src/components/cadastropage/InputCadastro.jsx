import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import background from "../../assets/img/background_input.png";
import "../../assets/styles/logincadastro/input_cadastro.css";
import OptionsCadastro from "./OptionsCadastro";
import { useAuth } from "../../context/AuthContext";
import { HiChevronLeft } from "react-icons/hi";
import { toast } from "react-toastify";
import InputField from "../common/InputField";

export default function InputCadastro() {
    const location = useLocation();
    const navigate = useNavigate();
    const { registerUser, loading, error } = useAuth();

    const [loadingCep, setLoadingCep] = useState(false);
    const [errors, setErrors] = useState({});
    const [tipoUsuario, setTipoUsuario] = useState("paciente");
    const [animar, setAnimar] = useState(false);

    const [form, setForm] = useState({
        nome: "",
        dataNascimento: "",
        email: "",
        localidade: "",
        cpf: "",
        sobrenome: "",
        cep: "",
        uf: "",
        cidade: "",
        rua: "",
        numeroResidencia: "",
        telefone: "",
        genero: "",
        crp: "",
        ra: "",
        token: "",
        senha: "",
        confirmarSenha: ""
    });

    async function buscarCep(cep) {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        if (!response.ok) throw new Error();

        const data = await response.json();
        if (data.erro) throw new Error();

        return data;
    }

    async function handleBuscarCep(cep) {
        try {
            setLoadingCep(true);

            const data = await buscarCep(cep);

            setForm((prev) => ({
                ...prev,
                rua: data.logradouro || "",
                cidade: data.localidade || "",
                uf: data.uf || ""
            }));
        } catch {
            toast.error("CEP não encontrado");
        } finally {
            setLoadingCep(false);
        }
    }

    const validate = () => {
        let newErrors = {};

        if (!form.nome) newErrors.nome = "Nome é obrigatório";

        if (!form.dataNascimento) {
            newErrors.dataNascimento = "Data de nascimento é obrigatória";
        } else {
            const data = new Date(form.dataNascimento);
            const hoje = new Date();

            const idade = hoje.getFullYear() - data.getFullYear();
            const fezAniversario =
                hoje.getMonth() > data.getMonth() ||
                (hoje.getMonth() === data.getMonth() && hoje.getDate() >= data.getDate());

            const idadeFinal = fezAniversario ? idade : idade - 1;

            if (data > hoje) newErrors.dataNascimento = "Data não pode ser no futuro";
            else if (idadeFinal < 18) newErrors.dataNascimento = "Você deve ter pelo menos 18 anos";
            else if (idadeFinal > 100) newErrors.dataNascimento = "Idade inválida";
        }

        if (!form.cpf) newErrors.cpf = "CPF é obrigatório";

        if (!form.email) newErrors.email = "Email é obrigatório";
        else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email inválido";

        if (!form.cep) newErrors.cep = "CEP obrigatório";
        if (!form.rua) newErrors.rua = "Rua obrigatória";
        if (!form.uf) newErrors.uf = "UF obrigatória";
        if (!form.cidade) newErrors.cidade = "Cidade obrigatória";
        if (!form.numeroResidencia) newErrors.numeroResidencia = "Número obrigatório";

        if (!form.senha) newErrors.senha = "Senha obrigatória";
        else if (form.senha.length < 6) newErrors.senha = "Mínimo 6 caracteres";

        if (form.senha !== form.confirmarSenha) {
            newErrors.confirmarSenha = "Senhas não coincidem";
        }

        if (tipoUsuario === "paciente") {
            if (!form.telefone) newErrors.telefone = "Telefone obrigatório";
            if (!form.genero) newErrors.genero = "Gênero obrigatório";
        }

        if (tipoUsuario === "psicologo") {
            if (!form.crp) newErrors.crp = "CRP obrigatório";
        }

        if (tipoUsuario === "voluntario") {
            if (!form.ra) newErrors.ra = "RA obrigatório";
            if (!form.token) newErrors.token = "Token obrigatório";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        const path = location.pathname;

        if (path === "/cadastro=0" || path === "/cadastro") setTipoUsuario("paciente");
        else if (path === "/cadastro=1") setTipoUsuario("psicologo");
        else if (path === "/cadastro=2") setTipoUsuario("voluntario");

        setAnimar(false);
        const timeout = setTimeout(() => setAnimar(true), 50);

        return () => clearTimeout(timeout);
    }, [location.pathname]);

    const handleCepBlur = (e) => {
        const relatedName = e.relatedTarget?.name;
        if (["rua", "cidade", "uf", "numeroResidencia"].includes(relatedName)) return;

        const cepLimpo = form.cep.replace(/\D/g, "");
        if (cepLimpo.length === 8) handleBuscarCep(cepLimpo);
    };

    const handleEnderecoBlur = async (e) => {
        const relatedName = e.relatedTarget?.name;
        if (["cep", "rua", "cidade", "uf", "numeroResidencia"].includes(relatedName)) return;

        const cepLimpo = form.cep?.replace(/\D/g, "");

        if (!cepLimpo && form.uf?.length === 2 && form.cidade?.length >= 3 && form.rua?.length >= 3) {
            try {
                setLoadingCep(true);

                const response = await fetch(`https://viacep.com.br/ws/${form.uf}/${form.cidade}/${form.rua}/json/`);
                const data = await response.json();

                if (data && data.length > 0) {
                    setForm((prev) => ({
                        ...prev,
                        cep: data[0].cep
                    }));
                    toast.success("CEP encontrado e preenchido automaticamente!");
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingCep(false);
            }
        }
    };

    function handleChange(e) {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            const firstError = Object.keys(errors)[0];
            document.querySelector(`[name="${firstError}"]`)?.focus();
            return;
        }

        const userData = {
            nome: form.nome,
            sobrenome: form.sobrenome,
            email: form.email,
            senha: form.senha,
            dtNascimento: form.dataNascimento,
            genero: form.genero,
            telefone: form.telefone,
            cep: form.cep,
            numeroResidencia: form.numeroResidencia,
            cpf: form.cpf,
            tipoUsuario
        };

        if (tipoUsuario === "psicologo") {
            userData.crp = form.crp;
        } else if (tipoUsuario === "voluntario") {
            userData.ra = form.ra;
            userData.token = form.token;
        }

        const result = await registerUser(userData);

        if (result?.success) {
            toast.success("Cadastro realizado", {
                position: "top-center",
                theme: "light",
                draggable: true
            });
            navigate("/login=0");
        } else {
            toast.error(error || "Erro ao cadastrar");
        }
    };

    const hoje = new Date();
    const isCepValid = (form.cep || "").replace(/\D/g, "").length === 8;

    const maxDate = new Date(
        hoje.getFullYear() - 18,
        hoje.getMonth(),
        hoje.getDate()
    ).toISOString().split("T")[0];

    const minDate = new Date(
        hoje.getFullYear() - 100,
        hoje.getMonth(),
        hoje.getDate()
    ).toISOString().split("T")[0];

    return (
        <section className="login-inputs">
            <div className="background-img-logincadastro">
                <img className="background" src={background} alt="Imagem de fundo" />
            </div>

            <div className="container-input-login">
                <div className="container-icon-return-login">
                    <Link to="/login=0" className="icon-btn icon-return-login">
                        <HiChevronLeft />
                    </Link>

                </div>

                <h1 id="signinPageForm">Cadastro</h1>
                <OptionsCadastro />

                <form className="inputs" onSubmit={handleSubmit} noValidate>
                    <div className={`cadastro-input ${animar ? "animar" : ""}`}>
                        <InputField label="Nome" name="nome" value={form.nome} onChange={handleChange} placeholder="Seu nome" autoComplete="given-name" error={errors.nome} required />
                        <InputField label="Sobrenome" name="sobrenome" value={form.sobrenome} onChange={handleChange} placeholder="Seu sobrenome" autoComplete="family-name" error={errors.sobrenome} />
                        <InputField label="Data de Nascimento" name="dataNascimento" type="date" value={form.dataNascimento} onChange={handleChange} min={minDate} max={maxDate} error={errors.dataNascimento} required />
                        <InputField label="CPF" name="cpf" value={form.cpf} onChange={handleChange} placeholder="000.000.000-00" error={errors.cpf} required />
                        <InputField label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="seuemail@gmail.com" autoComplete="email" error={errors.email} required />
                        <InputField label="CEP" name="cep" value={form.cep} onChange={handleChange} placeholder="00000-000" autoComplete="postal-code" error={errors.cep} onBlur={handleCepBlur} required extraContent={loadingCep && <span className="loading-cep">Buscando...</span>} />
                        <InputField label="UF" name="uf" value={form.uf} onChange={handleChange} placeholder="SP" error={errors.uf} onBlur={handleEnderecoBlur} readOnly={isCepValid} required />
                        <InputField label="Cidade" name="cidade" value={form.cidade} onChange={handleChange} placeholder="Diadema" error={errors.cidade} onBlur={handleEnderecoBlur} readOnly={isCepValid} required />
                        <InputField label="Rua" name="rua" value={form.rua} onChange={handleChange} placeholder="Centro" error={errors.rua} onBlur={handleEnderecoBlur} readOnly={isCepValid} required />
                        <InputField label="Número da residência" name="numeroResidencia" value={form.numeroResidencia} onChange={handleChange} placeholder="123" error={errors.numeroResidencia} required />

                        {tipoUsuario === "paciente" && (
                            <>
                                <InputField label="Telefone" name="telefone" type="tel" value={form.telefone} onChange={handleChange} placeholder="11 94002-8922" autoComplete="tel" error={errors.telefone} required />
                                <InputField label="Gênero" name="genero" value={form.genero} onChange={handleChange} placeholder="Masculino / Feminino" error={errors.genero} required />
                            </>
                        )}

                        {tipoUsuario === "psicologo" && (
                            <>
                                <InputField label="CRP" name="crp" value={form.crp} onChange={handleChange} placeholder="06/12345" error={errors.crp} required />
                            </>
                        )}

                        {tipoUsuario === "voluntario" && (
                            <>
                                <InputField label="R.A" name="ra" value={form.ra} onChange={handleChange} placeholder="123456" error={errors.ra} required />
                                <InputField label="Token" name="token" value={form.token} onChange={handleChange} placeholder="Token de autorização" error={errors.token} required />
                            </>
                        )}

                        <InputField label="Senha" name="senha" type="password" value={form.senha} onChange={handleChange}
                            placeholder="*******" autoComplete="new-password" error={errors.senha} required />
                        <InputField label="Confirmar Senha" name="confirmarSenha" type="password" value={form.confirmarSenha} onChange={handleChange} placeholder="*******" autoComplete="new-password" error={errors.confirmarSenha} required />
                    </div>

                    <div className="container-cadastrar-entrar">
                        <div className="container-termos">
                            <input
                                type="checkbox"
                                id="checkbox"
                                className="checkbox"
                            />

                            <label htmlFor="checkbox">
                                Aceito os{" "}
                                <Link
                                    to="/termos-e-condicoes"
                                    className="link-cadastro"
                                >
                                    Termos e Condições
                                </Link>
                            </label>
                        </div>

                        <button type="submit" className="button-confirm" disabled={loading}>
                            {loading ? "Cadastrando..." : "Cadastrar"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}