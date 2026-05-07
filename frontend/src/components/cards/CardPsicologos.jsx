import fotoPsi from '../../assets/img/perfil-default.png';


export default function CardPsicologos({
    perfis,
    setSelectedPerfil,
    setOpenPsi,
    classType
}) {
    const getVisibleTags = (tags) => {
        if (!tags) return { visible: [], hidden: [] };
        const MAX_CHARS = 36; // Limite aproximado para uma linha no card
        let currentChars = 0;
        const visible = [];
        const hidden = [];

        tags.forEach((tag) => {
            // Mostra a tag se ela couber no limite de caracteres da linha
            if (visible.length === 0 || (currentChars + tag.length <= MAX_CHARS)) {
                visible.push(tag);
                currentChars += tag.length + 4; // Soma caracteres + compensação de padding/gap
            } else {
                hidden.push(tag);
            }
        });
        return { visible, hidden };
    };

    return (
        <>
            {perfis.map((item, index) => (
                <div className={`card-psi ${classType}`} key={index}>
                    <div className={`psi-foto-perfil ${classType}`}>
                        <img className={`foto-psi ${classType}`} src={fotoPsi} alt="foto" />
                    </div>
                    <div className={`informacoes-gerais-psi-card ${classType}`}>
                        <div className={`infos-psi ${classType}`}>
                            <h1 className={`nome-psi ${classType}`}>{item.nome}</h1>
                            <div className={`local-info ${classType}`}>
                                <p>Local:</p>
                                <p className={`local-psi ${classType}`}>{item.local}</p>
                            </div>
                        </div>
                        <div className={`especialidades-psicologo ${classType}`}>
                            <p className={`title-conhecimentos ${classType}`}>Conhecimentos</p>

                            <div className={`tags-cards card-psi-body ${classType}`}>

                                {(() => {
                                    const { visible, hidden } = getVisibleTags(item.tags);
                                    return (
                                        <>
                                            {visible.map((tag, i) => (
                                                <a key={i} data-speciality={tag} className="tag-item">
                                                    {tag}
                                                </a>
                                            ))}
                                            {hidden.length > 0 && (
                                                <div className="tags-more">
                                                    <span className="tags-count">
                                                        +{hidden.length}
                                                    </span>
                                                    <div className="tags-tooltip">
                                                        {hidden.map((tag, i) => (
                                                            <span key={i}>{tag}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}

                            </div>
                        </div>
                    </div>
                    <div className={`container-btn-ver ${classType}`}>
                        <button
                            className={`button-ver-card-psi ${classType}`}
                            id="btn-abrir-pop-up"
                            onClick={() => {
                                if (setSelectedPerfil) setSelectedPerfil(item);
                                if (setOpenPsi) setOpenPsi(true);
                            }}
                        > Ver
                        </button>
                    </div>
                </div>
            ))}
        </>
    )
}
