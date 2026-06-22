import "./Settings.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useState, useEffect } from "react";
import { User, Lock, Bell, Check } from "lucide-react";

function getUsername() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub || null;
  } catch {
    return null;
  }
}

function Settings() {
  const [activeTab, setActiveTab] = useState("settings");
  const [korisnikId, setKorisnikId] = useState(null);

  const [accountForm, setAccountForm] = useState({ username: "", email: "" });
  const [passForm, setPassForm] = useState({ current: "", new: "", confirm: "" });
  const [notif, setNotif] = useState({ lekcije: true, dostignuca: true, sedmicni: false });

  const [accountMsg, setAccountMsg] = useState(null);
  const [passMsg, setPassMsg] = useState(null);
  const [savingAccount, setSavingAccount] = useState(false);
  const [savingPass, setSavingPass] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = getUsername();
    if (!username) return;

    fetch(`http://localhost:8000/korisnik/pretraga/username?username=${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((k) => {
        setKorisnikId(k.id);
        setAccountForm({ username: k.username, email: k.mail });
      })
      .catch(() => {});
  }, []);

  const saveAccount = async () => {
    if (!korisnikId) return;
    setSavingAccount(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8000/korisnik/${korisnikId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ username: accountForm.username, mail: accountForm.email }),
      });
      if (res.ok) {
        setAccountMsg({ type: "ok", text: "Podaci su uspješno sačuvani." });
      } else {
        setAccountMsg({ type: "err", text: "Greška pri čuvanju. Pokušaj ponovo." });
      }
    } catch {
      setAccountMsg({ type: "err", text: "Nema veze sa serverom." });
    }
    setSavingAccount(false);
    setTimeout(() => setAccountMsg(null), 3000);
  };

  const savePassword = async () => {
    if (passForm.new !== passForm.confirm) {
      setPassMsg({ type: "err", text: "Lozinke se ne podudaraju." });
      setTimeout(() => setPassMsg(null), 3000);
      return;
    }
    if (passForm.new.length < 4) {
      setPassMsg({ type: "err", text: "Lozinka mora imati najmanje 4 znaka." });
      setTimeout(() => setPassMsg(null), 3000);
      return;
    }
    if (!korisnikId) return;
    setSavingPass(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8000/korisnik/${korisnikId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ password: passForm.new }),
      });
      if (res.ok) {
        setPassMsg({ type: "ok", text: "Lozinka je promijenjena." });
        setPassForm({ current: "", new: "", confirm: "" });
      } else {
        setPassMsg({ type: "err", text: "Greška pri promjeni lozinke." });
      }
    } catch {
      setPassMsg({ type: "err", text: "Nema veze sa serverom." });
    }
    setSavingPass(false);
    setTimeout(() => setPassMsg(null), 3000);
  };

  return (
    <div className="page-bg">
      <div className="dashboard-shell">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="dashboard-main">
          <Topbar />
          <h1 className="page-title">Podešavanja</h1>

          {/* NALOG */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-icon-wrap blue">
                <User size={18} />
              </div>
              <div>
                <h2 className="settings-card-title">Informacije naloga</h2>
                <p className="settings-card-sub">Izmijeni korisničko ime i email adresu</p>
              </div>
            </div>

            <div className="settings-fields">
              <div className="settings-field">
                <label>Korisničko ime</label>
                <input
                  value={accountForm.username}
                  onChange={(e) => setAccountForm({ ...accountForm, username: e.target.value })}
                  placeholder="Korisničko ime"
                />
              </div>
              <div className="settings-field">
                <label>Email adresa</label>
                <input
                  type="email"
                  value={accountForm.email}
                  onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                  placeholder="Email"
                />
              </div>
            </div>

            {accountMsg && (
              <div className={`settings-msg ${accountMsg.type}`}>{accountMsg.text}</div>
            )}

            <button className="settings-save-btn" onClick={saveAccount} disabled={savingAccount}>
              {savingAccount ? "Čuvanje..." : "Sačuvaj izmjene"}
            </button>
          </div>

          {/* LOZINKA */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-icon-wrap orange">
                <Lock size={18} />
              </div>
              <div>
                <h2 className="settings-card-title">Promjena lozinke</h2>
                <p className="settings-card-sub">Postavi novu sigurnu lozinku za svoj nalog</p>
              </div>
            </div>

            <div className="settings-fields">
              <div className="settings-field">
                <label>Nova lozinka</label>
                <input
                  type="password"
                  value={passForm.new}
                  onChange={(e) => setPassForm({ ...passForm, new: e.target.value })}
                  placeholder="Unesi novu lozinku"
                />
              </div>
              <div className="settings-field">
                <label>Potvrdi novu lozinku</label>
                <input
                  type="password"
                  value={passForm.confirm}
                  onChange={(e) => setPassForm({ ...passForm, confirm: e.target.value })}
                  placeholder="Ponovi novu lozinku"
                />
              </div>
            </div>

            {passMsg && (
              <div className={`settings-msg ${passMsg.type}`}>{passMsg.text}</div>
            )}

            <button className="settings-save-btn orange" onClick={savePassword} disabled={savingPass}>
              {savingPass ? "Čuvanje..." : "Promijeni lozinku"}
            </button>
          </div>

          {/* NOTIFIKACIJE */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-icon-wrap purple">
                <Bell size={18} />
              </div>
              <div>
                <h2 className="settings-card-title">Notifikacije</h2>
                <p className="settings-card-sub">Upravljaj obavještenjima</p>
              </div>
            </div>

            <div className="settings-toggles">
              <div className="settings-toggle-row">
                <div>
                  <span className="toggle-label">Podsjetnici za lekcije</span>
                  <span className="toggle-sub">Obavijesti kad ima novih lekcija</span>
                </div>
                <button
                  className={`toggle-btn ${notif.lekcije ? "on" : ""}`}
                  onClick={() => setNotif({ ...notif, lekcije: !notif.lekcije })}
                >
                  {notif.lekcije && <Check size={13} />}
                </button>
              </div>

              <div className="settings-toggle-row">
                <div>
                  <span className="toggle-label">Dostignuća</span>
                  <span className="toggle-sub">Obavijesti kad osvoji novo dostignuće</span>
                </div>
                <button
                  className={`toggle-btn ${notif.dostignuca ? "on" : ""}`}
                  onClick={() => setNotif({ ...notif, dostignuca: !notif.dostignuca })}
                >
                  {notif.dostignuca && <Check size={13} />}
                </button>
              </div>

              <div className="settings-toggle-row">
                <div>
                  <span className="toggle-label">Sedmični izvještaj</span>
                  <span className="toggle-sub">Sažetak napretka svake nedjelje</span>
                </div>
                <button
                  className={`toggle-btn ${notif.sedmicni ? "on" : ""}`}
                  onClick={() => setNotif({ ...notif, sedmicni: !notif.sedmicni })}
                >
                  {notif.sedmicni && <Check size={13} />}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Settings;
