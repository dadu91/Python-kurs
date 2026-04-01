import {
  LayoutDashboard,
  BookOpen,
  ListChecks,
  BarChart3,
  AlertCircle,
  User,
  Settings,
  LogOut
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <LayoutDashboard size={22} />
      </div>

      <nav className="sidebar-nav">
        <button className="side-icon active">
          <LayoutDashboard size={20} />
        </button>

        <button className="side-icon">
          <BookOpen size={20} />
        </button>

        <button className="side-icon">
          <ListChecks size={20} />
        </button>

        <button className="side-icon">
          <BarChart3 size={20} />
        </button>

        <button className="side-icon">
          <AlertCircle size={20} />
        </button>

        <button className="side-icon">
          <User size={20} />
        </button>

        <button className="side-icon">
          <Settings size={20} />
        </button>
      </nav>

      <div className="sidebar-bottom">
        <LogOut size={20} />
      </div>
    </aside>
  );
}

export default Sidebar;