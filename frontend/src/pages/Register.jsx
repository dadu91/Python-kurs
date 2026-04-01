import { Link } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";

function Register() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Registracija</h1>
        <p>Napravi novi nalog</p>

        <RegisterForm />

        <p className="auth-switch">
          Već imaš nalog? <Link to="/login">Prijavi se</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;