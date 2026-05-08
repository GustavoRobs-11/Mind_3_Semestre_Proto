import "../../assets/styles/artigos/articles-sidebar.css";
import { AiOutlineLike } from "react-icons/ai";
import DefaultProfileImg from "../../assets/img/perfil-default.png";
import { Link } from "react-router-dom";
import { getImageUrl, getDefaultAvatar } from "../../utils/imageHelper";

export default function ArticlesMostLiked({ articles }) {
  const topLiked = articles
    .slice()
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 4);

  return (
    <aside className="sidebar-box">
      <div className="sidebar-header">
        <AiOutlineLike className="sidebar-icon" />
        <h3>ARTIGOS MAIS CURTIDOS</h3>
      </div>

      <div className="sidebar-articles">
        {topLiked.map((article) => {
          const authorImg = getImageUrl(article.autorAvatar) || DefaultProfileImg;

          return (
            <Link
              key={article.id}
              to={`/artigo/${article.id}`}
              className="sidebar-article-card"
            >
              <img
                src={authorImg}
                alt={article.autorNome}
                className="avatar"
                onError={(e) => {
                  if (e.currentTarget.src !== getDefaultAvatar()) {
                    e.currentTarget.src = getDefaultAvatar();
                  }
                }}
              />
              
              <div className="sidebar-article-info">
                <h4>{article.titulo}</h4>
                <span className="like-count">
                  <AiOutlineLike /> {article.likes}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}