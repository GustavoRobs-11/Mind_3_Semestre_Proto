import { useState, useEffect } from "react";
import "../assets/styles/artigos/artigos.css";
import ArticleCard from "../components/cards/ArticleCard";
import ArticlesMostLiked from "../components/cards/ArticlesMostLiked";
import ArticlesMostViewed from "../components/cards/ArticlesMostViewed";
import SkipNavigation from "../components/SkipNavigation";
import { HiOutlineSearch } from "react-icons/hi";
import { listarPublicados } from "../services/artigoService";
import { toast } from "react-toastify";

export default function Artigos() {
  const [searchText, setSearchText] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await listarPublicados();
        setArticles(data);
      } catch (error) {
        toast.error("Erro ao carregar artigos");
        console.log(error)
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const filteredArticles = articles.filter((article) =>
    article.titulo?.toLowerCase().includes(searchText.toLowerCase()) ||
    article.autorNome?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <>
    < SkipNavigation mainContent="articlesContainerLeft" />
    <main className="container-artigos">
      {/* SEARCH */}
      <div className="search-section">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Pesquisar por nome, autor..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="search-input"
            
          />
          <button type="submit" className="search-button">
            <HiOutlineSearch className="search-icon" />
          </button>
        </form>
      </div>

      {/* CONTEÚDO */}
      <div className="articles-container" id="articlesContainerLeft">
        {/* SEÇÃO ESQUERDA - ARTIGOS PRINCIPAIS */}
        <div className="articles-main">
          <div className="articles-list">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))
            ) : (
              <div className="no-results">
                <p>Nenhum artigo encontrado</p>
              </div>
            )}
          </div>
        </div>

        {/* SEÇÃO DIREITA - SIDEBARS */}
        <aside className="articles-sidebar">
          <ArticlesMostLiked articles={articles} />
          <ArticlesMostViewed articles={articles} />
        </aside>
      </div>
    </main>
    </>
  );
}