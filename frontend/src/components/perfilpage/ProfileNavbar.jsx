export default function ProfileNavbar({ tabs, activeTab, onTabChange }) {
  return (
    <nav className="perfil-navbar">
      <ul className="perfil-navbar-list">
        {tabs.map((tab) => (
          <li
            key={tab.key}
            className={`perfil-navbar-item ${activeTab === tab.key ? "active" : ""}`}
          >
            <button type="button" onClick={() => onTabChange(tab.key)}>
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
