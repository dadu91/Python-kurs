import { useNavigate } from "react-router-dom";

function LoginForm() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // provjera sa backendom

    navigate("/");
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <input type="text" placeholder="Korisničko ime" />
      <input type="password" placeholder="Lozinka" />
      <button type="submit">Prijavi se</button>
    </form>
  );
}

export default LoginForm;