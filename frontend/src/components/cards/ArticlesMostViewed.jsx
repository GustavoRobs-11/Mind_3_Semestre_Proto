  import "../../assets/styles/artigos/articles-sidebar.css";
  import { AiOutlineEye } from "react-icons/ai";
  import DefaultProfileImg from "../../assets/img/perfil-default.png";
  import { Link } from "react-router-dom";
  import { getImageUrl, getDefaultAvatar } from "../../utils/imageHelper";

  export default function ArticlesMostViewed({ articles }) {
    const topViewed = articles
      .slice()
      .sort((a, b) => b.views - a.views)
      .slice(0, 4);

    return (
      <aside className="sidebar-box">
        <div className="sidebar-header">
          <AiOutlineEye className="sidebar-icon" />
          <h3>ARTIGOS MAIS VISTOS</h3>
        </div>

        <div className="sidebar-articles">
          {topViewed.map((article) => {
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
                  <span className="view-count">
                    <AiOutlineEye /> {article.views}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </aside>
    );
  }
