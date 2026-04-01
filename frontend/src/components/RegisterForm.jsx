import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // slanje podataka na backend

    navigate("/login");
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <input type="text" placeholder="Korisničko ime" />
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Lozinka" />
      <button type="submit">Registruj se</button>
    </form>
  );
}

export default RegisterForm;