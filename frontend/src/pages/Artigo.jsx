import { HiOutlineReply } from "react-icons/hi";
import { FaThumbsUp, FaEye } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useRef } from "react";
import { toast } from "react-toastify";
import { buscarPorId, curtirArtigo, registrarVisualizacao } from "../services/artigoService";
import "../assets/styles/artigos/artigo.css";
import "../assets/styles/artigos/cards-artigos.css";
import DefaultImg from "../assets/img/articles.png";
import SkipNavigation from "../components/SkipNavigation";

export default function Artigo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artigo, setArtigo] = useState(null);
  const [loading, setLoading] = useState(true);
  const visualizacaoRegistrada = useRef(false);

  useEffect(() => {
    const fetchArtigo = async () => {
      try {
        const data = await buscarPorId(id);
        setArtigo(data);
        if (!visualizacaoRegistrada.current) {
          visualizacaoRegistrada.current = true;
          const atualizado = await registrarVisualizacao(id);
          setArtigo(atualizado);
        }
      } catch (error) {
        toast.error("Artigo não encontrado ou sem permissão");
        navigate("/artigos");
        console.log(error)
      } finally {
        setLoading(false);
      }
    };
    fetchArtigo();
  }, [id, navigate]);

  if (loading) return <div className="loading">Carregando artigo...</div>;
  if (!artigo) return null;

  const articleImg = artigo.imagem 
    ? `http://localhost:8080/api/images/articles/${artigo.imagem}` 
    : DefaultImg;

  const handleLike = async () => {
    try {
      const atualizado = await curtirArtigo(id);
      setArtigo(atualizado);
    } catch (error) {
      toast.error("Erro ao curtir artigo");
    }
  };

  const formattedDate = artigo.dataCriacao 
    ? new Date(artigo.dataCriacao).toLocaleDateString('pt-BR') 
    : "";

  return (
    <>
    < SkipNavigation mainContent="articleRead" />
    <main className="article-page">
      <div className="article-page-wrapper" id="articleRead">
          <img
            src={articleImg}
            alt="banner do artigo"
            className="article-banner"
            onError={(e) => {
              if (e.currentTarget.src !== DefaultImg) {
                e.currentTarget.src = DefaultImg;
              }
            }}
          />

          <h1>{artigo.titulo}</h1>
          <div className="article-author">
            <p>
              <span>{artigo.autorNome}</span>
              <span>•</span>
              <span>{formattedDate}</span>
            </p>
          </div>
          <hr />

          <div className="article-stats">
            <button type="button" className="article-stat-button" onClick={handleLike}>
              <FaThumbsUp /> {artigo.likes || 0}
            </button>
            <span><FaEye /> {artigo.views || 0}</span>
          </div>
          <hr />

          <div className="article-content">
             <div dangerouslySetInnerHTML={{ __html: artigo.corpo?.replace(/\n/g, '<br/>') }} />
          </div>

          {artigo.referencias && artigo.referencias.length > 0 && (
            <>
              <h2>Referências</h2>
              <ul>
                {artigo.referencias.map((ref, i) => (
                  <li key={i}>
                    <a href={ref.link} target="_blank" rel="noopener noreferrer">
                      {ref.nome_referencia || ref.link}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}

          <button
            className="button-proceed"
            onClick={() => navigate("/artigos")}>
            <HiOutlineReply /> Voltar
          </button>

      </div>
    </main>
    </>
  );
}