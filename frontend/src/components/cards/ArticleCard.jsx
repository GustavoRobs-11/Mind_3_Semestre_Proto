import "../../assets/styles/artigos/article-card.css";
import { AiOutlineLike, AiOutlineEye } from "react-icons/ai";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultArticleImg from "../../assets/img/articles.png";
import { getImageUrl, getDefaultAvatar } from "../../utils/imageHelper";
import { curtirArtigo } from "../../services/artigoService";
import { toast } from "react-toastify";

export default function ArticleCard({ article, onArticleUpdate }) {
    const navigate = useNavigate();
    const [likes, setLikes] = useState(article.likes || 0);
    const [loadingLike, setLoadingLike] = useState(false);

    const articleImg = article.imagem 
        ? `http://localhost:8080/api/images/articles/${article.imagem}` 
        : DefaultArticleImg;

    const authorImg = getImageUrl(article.autorAvatar) || getDefaultAvatar();

    useEffect(() => {
        setLikes(article.likes || 0);
    }, [article.likes]);

    const handleLike = async () => {
        if (loadingLike) return;

        setLoadingLike(true);
        try {
            const updatedArticle = await curtirArtigo(article.id);
            setLikes(updatedArticle.likes || 0);
            onArticleUpdate?.(updatedArticle);
        } catch (error) {
            toast.error("Erro ao curtir artigo");
        } finally {
            setLoadingLike(false);
        }
    };

    const formattedDate = article.dataCriacao 
        ? new Date(article.dataCriacao).toLocaleDateString('pt-BR') 
        : "";

    return (
        <article className="article-card">
            <div className="article-image-container">
                <img
                    src={articleImg}
                    alt={article.titulo}
                    className="article-image"
                    onError={(e) => {
                        if (e.currentTarget.src !== DefaultArticleImg) {
                            e.currentTarget.src = DefaultArticleImg;
                        }
                    }}
                />
            </div>

            <div className="article-content">
                <h2 className="article-title">{article.titulo}</h2>
                <p className="article-description">
                    {article.corpo?.length > 240 
                        ? `${article.corpo.substring(0, 220)}...` 
                        : article.corpo}
                </p>

                <div className="article-footer">
                    <div className="article-meta">
                        <img 
                            src={authorImg} 
                            alt={article.autorNome} 
                            className="author-avatar"
                            onError={(e) => {
                                if (e.currentTarget.src !== getDefaultAvatar()) {
                                    e.currentTarget.src = getDefaultAvatar();
                                }
                            }}
                        />
                        <div className="author-info">
                            <span className="author-name">@{article.autorNome}</span>
                            <span className="article-date">{formattedDate}</span>
                        </div>
                    </div>
                </div>
                <div className="container-likes-view">
                    <div className="article-stats">
                        <button className="stat stat-button" type="button" onClick={handleLike} disabled={loadingLike} aria-label="Curtir artigo">
                            <AiOutlineLike className="stat-icon" id="IconLike" />
                            <span>{likes}</span>
                        </button>
                        <div className="stat">
                            <AiOutlineEye className="stat-icon" id="IconView"/>
                            <span>{article.views || 0}</span>
                        </div>
                    </div>

                    <button
                        className="btn-see-more"
                        onClick={() => navigate(`/artigo/${article.id}`)}
                    >
                        Ver
                    </button>
                </div>
            </div>
        </article>
    );
}
