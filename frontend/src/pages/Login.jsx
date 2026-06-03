import "./Auth.css";
import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";

function Login() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Prijava</h1>
        <p>Prijavi se na svoj nalog</p>

        <LoginForm />

        <p className="auth-switch">
          Nemaš nalog? <Link to="/register">Registruj se</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;