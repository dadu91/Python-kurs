import { Search, User } from "lucide-react";
function Topbar() {
  return (
    <div className="topbar">
      <div className="brand">
        <span className="brand-accent">Python</span>Kurs
      </div>

      <div className="topbar-right">
        <div className="search-box">
          <input type="text" placeholder="Pretraži" />
          <button><Search size={18}></Search></button>
        </div>

        <div className="user-box">
          <div className="avatar"><User></User></div>
          <div>
            <p className="user-name">user</p>
            <span className="user-handle">@user</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topbar;