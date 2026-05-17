import '../../../assets/styles/perfil/sobre.css';

export default function SobrePsicologo({ profileData }) {
    return (
        <>
            <div className="infos">
            <div className="card-info-container">
                <h4>Sobre mim:</h4>
                <div className="card-sobre-container">
                    <p>{profileData?.sobreMim || "Nenhuma informação adicionada."}</p>
                </div>
            </div>
            <div className="card-info-container">
                <h4>Especializações</h4>
                <div className="card-ficha-container-psi">
                    <p>{profileData?.especialidades?.join(", ") || "Nenhuma especialidade."}</p>
                </div>
            </div>
            <div className="container-horarios-psi">
                <h4>Horários de Atendimento</h4>

                {profileData?.horarios?.map((horario, index) => (
                    <div className="container-horario-atendimento-psi" key={index}>
                        <p>{horario.diaDaSemana}</p>
                        <p>{horario.horaInicio}</p>
                        <p>{horario.horaFim}</p>
                    </div>
                ))}

                {!profileData?.horarios?.length && (
                    <div className="container-horario-atendimento-psi">
                        <p>Segunda-feira</p>
                        <p>09:00</p>
                        <p>09:40</p>
                    </div>
                )}
            </div>
        </div>

        </>
    )
}


