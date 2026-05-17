import {
    HiChevronDown,
    HiOutlineTrash,
    HiPlus
} from "react-icons/hi";

import { useState } from "react";

import {
    criarHorario,
    deletarHorario
} from "../../services/horarioService";

import { useAuth } from "../../context/AuthContext";

export default function CardHorarios({
    horario,
    onSaved,
    onDeleted,
    onRemoveTemp
}) {

    const { user } = useAuth();

    const [isDropdownOpen, setDropdownOpen] = useState(true);

    const isExisting = !!horario?.id;

    const [diaDaSemana, setDiaDaSemana] = useState(
        horario?.diaDaSemana || "Segunda"
    );

    // LISTA DE HORÁRIOS
    const [horarios, setHorarios] = useState([
        {
            horaInicio: horario?.horaInicio || "",
            horaFim: horario?.horaFim || ""
        }
    ]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // CALCULAR +40MIN
    const calculateHour = (hour, index) => {

        const [hh, mm] = hour.split(":").map(Number);

        if (isNaN(hh) || isNaN(mm)) return;

        const data = new Date();

        data.setHours(hh, mm, 0, 0);
        data.setMinutes(data.getMinutes() + 40);

        const novoHorario = [...horarios];

        novoHorario[index] = {
            horaInicio: hour,
            horaFim: data.toTimeString().slice(0, 5)
        };

        setHorarios(novoHorario);
    };

    // ADICIONAR NOVO HORÁRIO
    const adicionarHorario = () => {

        setHorarios([
            ...horarios,
            {
                horaInicio: "",
                horaFim: ""
            }
        ]);
    };

    // REMOVER HORÁRIO
    const removerHorario = (index) => {

        const novaLista = horarios.filter((_, i) => i !== index);

        setHorarios(novaLista);
    };

    // SALVAR TODOS
    const handleConfirmar = async () => {

        setLoading(true);
        setError("");

        try {

            for (const item of horarios) {

                if (!item.horaInicio || !item.horaFim) continue;

                await criarHorario({
                    psicologoId: user.id,
                    diaDaSemana,
                    horaInicio: item.horaInicio,
                    horaFim: item.horaFim
                });
            }

            onSaved();

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);
        }
    };

    // DELETAR CARD
    const handleCancelarOuDeletar = async () => {

        if (!isExisting) {

            onRemoveTemp();

        } else {

            setLoading(true);

            try {

                await deletarHorario(horario.id);

                onDeleted();

            } catch (err) {

                setError(err.message);
                setLoading(false);
            }
        }
    };

    return (
        <div className="container-agendamento">

            {error && (
                <div
                    role="alert"
                    style={{
                        color: "red",
                        fontSize: "14px",
                        marginBottom: "5px"
                    }}
                >
                    {error}
                </div>
            )}

            {/* TOPO */}
            <div className="container-horario">

                <div className="inputs-horarios">

                    <select
                        value={diaDaSemana}
                        onChange={(e) => setDiaDaSemana(e.target.value)}
                        disabled={isExisting}
                    >
                        <option value="Domingo">Domingo</option>
                        <option value="Segunda">Segunda-feira</option>
                        <option value="Terca">Terça-feira</option>
                        <option value="Quarta">Quarta-feira</option>
                        <option value="Quinta">Quinta-feira</option>
                        <option value="Sexta">Sexta-feira</option>
                        <option value="Sabado">Sábado</option>
                    </select>

                </div>

                <div className="arrow-options">



                    {/* DROPDOWN */}
                    <button
                        type="button"
                        id="abrir-options-agendamento"
                        onClick={() => setDropdownOpen(!isDropdownOpen)}
                        className={isDropdownOpen ? "" : "active"}
                        aria-expanded={!isDropdownOpen}
                    >
                        <HiChevronDown />
                    </button>

                </div>

            </div>


            {/* LISTA DE HORÁRIOS */}
            <div
                className="container-confirmar"
                style={{
                    display: isDropdownOpen ? "none" : "flex"
                }}
            >
                <div className="container-add-horarios">
                    {/* BOTÃO + */}

                    <button
                        type="button"
                        className="btn-add-horario"
                        onClick={adicionarHorario}
                    >
                        <HiPlus />
                    </button>

                    <div className="lista-horarios">

                        {horarios.map((item, index) => (

                            <div
                                className="linha-horario"
                                key={index}
                            >

                                <input
                                    type="time"
                                    value={item.horaInicio}
                                    disabled={isExisting}
                                    onChange={(e) =>
                                        calculateHour(e.target.value, index)
                                    }
                                />

                                <input
                                    type="time"
                                    value={item.horaFim}
                                    disabled
                                />

                                {/* REMOVER LINHA */}
                                
                                    <button
                                        className="icon-attention"
                                        onClick={() => removerHorario(index)}
                                    >
                                        <HiOutlineTrash />
                                    </button>
                                

                            </div>
                        ))}

                    </div>
                </div>
            </div>

            {/* BOTÕES */}
            <div
                className="container-confirmar"
                style={{
                    display: isDropdownOpen ? "none" : "flex"
                }}
            >

                <button
                    className="cancelar-agendamento button-cancelar"
                    onClick={handleCancelarOuDeletar}
                    disabled={loading}
                >
                    {!isExisting
                        ? (loading ? "Deletando..." : "Deletar")
                        : (loading ? "Deletando..." : "Deletar")}
                </button>

                {!isExisting && (
                    <button
                        className="confirmar-agendamento button-confirm"
                        onClick={handleConfirmar}
                        disabled={loading}
                    >
                        {loading ? "Salvando..." : "Confirmar"}
                    </button>
                )}

            </div>

        </div>
    );
}