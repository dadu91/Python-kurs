import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";

function LoginForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [greska, setGreska] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGreska("");

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        setGreska("Pogrešno korisničko ime ili lozinka.");
        return;
      }

      const data = await res.json();
      const token = data.access_token;
      localStorage.setItem("token", token);
      localStorage.setItem("loginTime", Date.now());
      // Očisti staru sliku da novi korisnik ne vidi sliku prethodnog
      localStorage.removeItem("profileImage");

      // Dohvati ulogu korisnika
      const korisnikRes = await fetch(`http://localhost:8000/korisnik/pretraga/username?username=${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const korisnik = await korisnikRes.json();
      localStorage.setItem("uloga", korisnik.uloga || "korisnik");

      if (korisnik.uloga === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
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
        type="password"
        placeholder="Lozinka"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {greska && <p style={{ color: "red", fontSize: "14px" }}>{greska}</p>}
      <button type="submit">Prijavi se</button>
    </form>
  );
}

export default LoginForm;