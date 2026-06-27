import "./Auth.css";
import { Link, useSearchParams } from "react-router-dom";
import LoginForm from "../components/LoginForm";

function Login() {
  const [searchParams] = useSearchParams();
  const isteklo = searchParams.get("isteklo") === "1";

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Prijava</h1>
        <p>Prijavi se na svoj nalog</p>

        {isteklo && (
          <p className="auth-info">
            Tvoja sesija je istekla. Prijavi se ponovo da nastaviš.
          </p>
        )}

        <LoginForm />

        <p className="auth-switch">
          Nemaš nalog? <Link to="/register">Registruj se</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;