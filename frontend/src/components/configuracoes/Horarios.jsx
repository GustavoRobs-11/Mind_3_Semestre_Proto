import "../../assets/styles/configuracoes/horarios-atendimento.css"
import CardHorarios from "../cards/CardHorarios"
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { listarTodosDoPsicologo } from "../../services/horarioService";

export default function Horarios() {
  const { user } = useAuth();
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHorarios = async () => {
      try {
          if (user?.id) {
              const data = await listarTodosDoPsicologo(user.id);
              
              const diasOrdem = {
                  "Domingo": 0,
                  "Segunda": 1,
                  "Terca": 2,
                  "Terça": 2,
                  "Quarta": 3,
                  "Quinta": 4,
                  "Sexta": 5,
                  "Sabado": 6,
                  "Sábado": 6
              };

              data.sort((a, b) => {
                  const diaA = diasOrdem[a.diaDaSemana] ?? 7;
                  const diaB = diasOrdem[b.diaDaSemana] ?? 7;

                  if (diaA !== diaB) {
                      return diaA - diaB;
                  }

                  const horaA = a.horaInicio || "23:59";
                  const horaB = b.horaInicio || "23:59";

                  return horaA.localeCompare(horaB);
              });

              setHorarios(data);
          }
      } catch (err) {
          setError(err.message);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchHorarios();
  }, [user]);

  const newCardHorario = () => {
    const tempId = `temp-${Date.now()}`;
    const newHorarioItem = { tempId: tempId, isNew: true };
    setHorarios([...horarios, newHorarioItem]);
  };

  const removeTempCard = (tempId) => {
      setHorarios(horarios.filter(h => h.tempId !== tempId));
  };

  return (
    <>
        <section className="container-perfil" id="container-horario-atendimento" aria-labelledby="titulo-horarios">
            <h1 id="titulo-horarios">Horário de atendimento</h1>
            <span id="descricao-horarios">Escolha seus horários de atendimento por dia. Lembre-se que o periodo máximo padrão da
                plataforma para atendimento psicologico é de 40 min.</span>
            
            {error && <div role="alert" className="error-message" style={{color: "red"}}>{error}</div>}

            <button 
              type="button"
              className=" button-proceed btn-add-dia"
              onClick={() => newCardHorario()}
              aria-describedby="descricao-horarios">
              + Adicionar dia</button>

            {loading ? (
                <p>Carregando horários...</p>
            ) : (
                <ul className="cards-horarios">
                {horarios.map((horario) => (
                    <li key={horario.id || horario.tempId}>
                    <CardHorarios 
                        horario={horario}
                        onSaved={fetchHorarios}
                        onDeleted={fetchHorarios}
                        onRemoveTemp={() => removeTempCard(horario.tempId)}/>
                    </li>
                  ))}
                </ul> 
            )}
        </section>
    </>
  )
}
