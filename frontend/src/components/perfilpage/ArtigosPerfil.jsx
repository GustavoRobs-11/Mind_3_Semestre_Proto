import { useState, useEffect } from "react";
import { FaEye, FaThumbsUp } from "react-icons/fa";
import { HiOutlinePencilAlt, HiOutlineTrash, HiOutlineSearch } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import Deletar from "../popups/Deletar";
import { listarMeusArtigos, deletarArtigo, alternarPublicacao } from "../../services/artigoService";
import { toast } from "react-toastify";
import "../../assets/styles/perfil/artigos-perfil.css";
import "../../assets/styles/ui/icons.css";

export default function ArtigosPerfil({ id }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [artigoSelecionado, setArtigoSelecionado] = useState(null);
  const [deletando, setDeletando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [artigos, setArtigos] = useState([]);

  useEffect(() => {
    fetchArtigos();
  }, []);

  const fetchArtigos = async () => {
    try {
      const data = await listarMeusArtigos();
      setArtigos(data);
    } catch (error) {
      toast.error("Erro ao carregar seus artigos");
    } finally {
      setLoading(false);
    }
  };

  const removePublishedArticle = async (id) => {
    setDeletando(true);
    try {
      await deletarArtigo(id);
      setArtigos(artigos.filter((artigo) => artigo.id !== id));
      toast.success("Artigo removido com sucesso");
      setIsOpen(false);
    } catch (error) {
      toast.error("Erro ao remover artigo");
    } finally {
      setDeletando(false);
    }
  }

  const togglePublicacao = async (id) => {
    try {
      const updated = await alternarPublicacao(id);
      setArtigos(artigos.map(a => a.id === id ? { ...a, publicado: updated.publicado } : a));
      toast.success(updated.publicado ? "Artigo publicado!" : "Artigo privado!");
    } catch (error) {
      toast.error("Erro ao alterar status do artigo");
    }
  }

  const artigosFiltrados = artigos.filter((artigo) =>
    artigo.titulo?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="artigos-container">

      <div className="artigos-header">
        <h2>Artigos Publicados</h2>

        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar artigo..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <HiOutlineSearch />
        </div>
      </div>

      <div className="artigos-lista">
        {artigosFiltrados.map((artigo) => (
          <div className="artigo-card" key={artigo.id}>

            <div className="artigo-info">
              <h3>
                {artigo.titulo}
                <span className={`status-badge ${artigo.publicado ? 'status-published' : 'status-private'}`}>
                  {artigo.publicado ? 'Publicado' : 'Privado'}
                </span>
              </h3>

              <p>
                {artigo.corpo?.length > 100
                  ? `${artigo.corpo.substring(0, 100)}...`
                  : artigo.corpo}
              </p>

              <div className="artigo-info-footer">
                <div className="artigo-stats">
                  <span>
                    <FaThumbsUp /> {artigo.likes || 0}
                  </span>
                  <span>
                    <FaEye /> {artigo.views || 0}
                  </span>
                </div>

                <div className="btns-articles-edit">

                  <div className="container-edit-excluir">
                    <button className="icon-attention"
                      onClick={() => {
                        setIsOpen(true);
                        setArtigoSelecionado(artigo.id)
                      }}
                      disabled={deletando}><HiOutlineTrash />
                    </button>

                    <button
                      className="icon-edit"
                      onClick={() => navigate(`/adicionar-artigos/${artigo.id}`)}>
                      <HiOutlinePencilAlt />
                    </button>
                  </div>

                  {/* <button 
                    className={`button-confirm button-ver-artigo ${artigo.publicado ? 'btn-unpublish' : 'btn-publish'}`}
                    onClick={() => togglePublicacao(artigo.id)}>
                      {artigo.publicado ? 'Tornar Privado' : 'Publicar'}
                  </button>
                    */}

                  <button
                    className="button-confirm button-ver-artigo"
                    onClick={() => navigate(`/artigo/${artigo.id}`)}>
                    Ver
                  </button>
                </div>
              </div>
            </div>

            <Deletar
              open={isOpen && artigoSelecionado === artigo.id}
              close={() => {
                setIsOpen(false);
                setArtigoSelecionado(null);
              }}
              onConfirm={() => removePublishedArticle(artigo.id)}
              loading={deletando}
              title="Deletar artigo"
              message="Você tem certeza que deseja deletar este artigo? Esta ação não pode ser desfeita e o artigo será removido permanentemente da plataforma."
              confirmText="Deletar artigo"
            />
          </div>
        ))}
      </div>
    </div>
  );
}