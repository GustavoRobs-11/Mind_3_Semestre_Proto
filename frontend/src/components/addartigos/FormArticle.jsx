import { useRef } from "react";
import CardReferencias from "../cards/CardReferencias";
import "../../assets/styles/components/toggle-switch.css";

export default function FormArticle({
    imgWallpaperArtigo,
    articleData,
    handleSubmitArticle,
    handleChange,
    handleNewImage,

    handleReferenceChange,
    newCardReference,
    removeCardReference,
    salvando
}) {

    const inputRef = useRef(null);

  return (
    <>
        <form onSubmit={handleSubmitArticle} className="containers-articles">
            <h1>{articleData.id ? "Editar artigo" : "Novo artigo"}</h1>
            <div className="img-wallpaper-addartigo">
                <figure className="figcaption-artigo">
                    <figcaption>Definir Papel de parede</figcaption>
                    <img
                        src={imgWallpaperArtigo}
                        alt="Wallpaper do perfil"
                        className="img-wallpaper-artigo"
                    />
                </figure>
                <div>
                    <label className="sr-only" htmlFor="file-image-paciente" aria-hidden="true">Escolha uma imagem</label>
                    <input
                        ref={inputRef}
                        id="file-image-paciente"
                        type="file"
                        accept="image/*"
                        aria-hidden="true"
                        onChange={handleNewImage}
                    />
                    <button
                        type="button"
                        className="btns button-confirm btns-image"
                        onClick={() => inputRef.current.click()}>
                        Mudar foto
                    </button>
                </div>
            </div>
            <div className="containers-articles" id="formPageArticle">
                <label htmlFor="titulo">Titulo</label>
                <input 
                    id="titulo" 
                    name="titulo"
                    type="text" 
                    className="inputs-article"
                    value={articleData.titulo || ''}
                    onChange={handleChange}
                />
            </div>
            <div className="containers-articles">
                <label htmlFor="artigo_texto">Corpo do artigo</label>
                <span>Escreva o assunto que queira publicar conforme o título de seu artigo, insira links de artigos científicos e noticias sobre saúde mental confiáveis que queria compartilhar.</span>
                <textarea 
                  id="artigo_texto" 
                  type="text" 
                  rows="4" 
                  name="artigo_texto"
                  className="inputs-article"
                  onChange={handleChange}
                  value={articleData.artigo_texto || ''}
                ></textarea>
            </div>
            <div className="containers-articles" id="formPageReferences">
                <label htmlFor="referencesArticle">Referencias</label>
                <span id="add-referencias-btn">Compartilhe as referencias necessárias para o acesso da veracidade das informações passadas durante o artigo</span>
                <button
                  type="button"
                  className="btn-adicionar button-proceed btn-add-references"
                  aria-describedby="add-referencias-btn"
                  onClick={() => newCardReference()}>
                  + Adicionar referências</button>
                {articleData.referencias.map(card => (
                    <CardReferencias
                        key={card.id}
                        removeCard={() => removeCardReference(card.id)}
                        handleReferenceChange={handleReferenceChange}
                        articleData={card}
                    />
                ))}
            </div>
            <div className="containers-articles toggle-container">
                <p>Visibilidade do artigo</p>
                <div className="toggle-switch">
                    <button
                        type="button"
                        className={`toggle-btn ${articleData.publicado ? 'public' : 'private'}`}
                        onClick={(e) => {
                            e.preventDefault();
                            handleChange({
                                target: {
                                    id: 'publicado',
                                    value: !articleData.publicado,
                                    type: 'checkbox',
                                    checked: !articleData.publicado
                                }
                            });
                        }}
                    >
                        <span className="toggle-label">
                            {articleData.publicado ? 'Público' : 'Privado'}
                        </span>
                        <span className="toggle-circle"></span>
                    </button>
                </div>
            </div>
            <div className="container-atualizar-article">
                <button id="btnAtualizarPerfil" type="submit" className="btns button-confirm" disabled={salvando}>
                    {salvando ? 'Salvando...' : 'Criar/Atualizar'}
                </button> 
  
            </div>
            
        </form>
    </>
  )
}
