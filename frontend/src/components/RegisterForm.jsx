import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";

function RegisterForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [greska, setGreska] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGreska("");

    try {
      const res = await fetch("http://localhost:8000/korisnik/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, mail, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setGreska(data.detail || "Greška pri registraciji.");
        return;
      }

      navigate("/login");
    } catch {
      setGreska("Greška pri povezivanju sa serverom.");
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Korisničko ime"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={mail}
        onChange={(e) => setMail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Lozinka"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {greska && <p style={{ color: "red", fontSize: "14px" }}>{greska}</p>}
      <button type="submit">Registruj se</button>
    </form>
  );
}

export default RegisterForm;
