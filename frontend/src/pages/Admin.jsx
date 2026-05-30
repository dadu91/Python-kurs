import Sidebar from "../components/AdminSidebar";
import Topbar from "../components/Topbar";
import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";

function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [korisnici, setKorisnici] = useState([]);
  const [lekcije, setLekcije] = useState([]);
  const [greska, setGreska] = useState("");
  const [confirmModal, setConfirmModal] = useState({ open: false, onConfirm: null, tekst: "" });

  const [showLessonForm, setShowLessonForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showAchievementForm, setShowAchievementForm] = useState(false);

  const [editUserId, setEditUserId] = useState(null);
  const [editLessonId, setEditLessonId] = useState(null);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editAchievementId, setEditAchievementId] = useState(null);

  const [zadaci, setZadaci] = useState([
    { id: 1, naziv: "Prvi Python program", lekcija: "Uvod u Python" },
    { id: 2, naziv: "Promjenljive", lekcija: "Osnove sintakse" },
  ]);

  const [dostignuca, setDostignuca] = useState([
    { id: 1, naziv: "Prva lekcija", opis: "Korisnik je završio prvu lekciju", uslov: "Završena 1 lekcija" },
    { id: 2, naziv: "Python početnik", opis: "Korisnik je uradio prvi zadatak", uslov: "Urađen 1 zadatak" },
  ]);

  const [noviKorisnik, setNoviKorisnik] = useState({ username: "", mail: "", uloga: "" });
  const [novaLekcija, setNovaLekcija] = useState({ naziv: "", redosljed: "", opis: "" });
  const [noviZadatak, setNoviZadatak] = useState({ naziv: "", lekcija: "" });
  const [novoDostignuce, setNovoDostignuce] = useState({ naziv: "", opis: "", uslov: "" });

  const token = localStorage.getItem("token");

  const otvoriModal = (tekst, onConfirm) => {
    setConfirmModal({ open: true, tekst, onConfirm });
  };

  const zatvoriModal = () => {
    setConfirmModal({ open: false, onConfirm: null, tekst: "" });
  };

  useEffect(() => {
    fetch("http://localhost:8000/admin/korisnici", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 403) throw new Error("Nemaš admin pristup");
        return res.json();
      })
      .then(setKorisnici)
      .catch((e) => setGreska(e.message));

    fetch("http://localhost:8000/lekcije/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setLekcije)
      .catch(() => {});
  }, [token]);

  const obrisiKorisnika = async (id) => {
    await fetch(`http://localhost:8000/admin/korisnici/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setKorisnici((prev) => prev.filter((k) => k.id !== id));
  };

  const obrisiLekciju = async (id) => {
    await fetch(`http://localhost:8000/lekcije/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setLekcije((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <div className="page-bg">
      <div className="dashboard-shell">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="dashboard-main">
          <Topbar />
          <h1 className="page-title">Admin Panel</h1>

          {greska && <p style={{ color: "red" }}>{greska}</p>}

          {/* MODAL */}
          {confirmModal.open && (
            <div className="modal-overlay">
              <div className="modal-box">
                <h3>Da li ste sigurni?</h3>
                <p>{confirmModal.tekst}</p>
                <div className="modal-buttons">
                  <button className="modal-cancel" onClick={zatvoriModal}>
                    Odustani
                  </button>
                  <button className="modal-confirm" onClick={() => {
                    confirmModal.onConfirm();
                    zatvoriModal();
                  }}>
                    Obriši
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="stats-box">
              <h3>Dashboard</h3>
              <div className="stats-grid">
                <div className="stat-card blue big">
                  <span className="stat-top">Ukupno korisnika</span>
                  <h2>{korisnici.length}</h2>
                </div>
                <div className="stat-card orange">
                  <p>Ukupno lekcija</p>
                  <h2>{lekcije.length}</h2>
                </div>
              </div>
            </div>
          )}

          {/* KORISNICI */}
          {activeTab === "users" && (
            <div className="stats-box">
              <h3>Svi korisnici</h3>

              {editUserId && (
                <div className="add-form">
                  <input
                    type="text"
                    placeholder="Username"
                    value={noviKorisnik.username}
                    onChange={(e) => setNoviKorisnik({ ...noviKorisnik, username: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Mail"
                    value={noviKorisnik.mail}
                    onChange={(e) => setNoviKorisnik({ ...noviKorisnik, mail: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Uloga"
                    value={noviKorisnik.uloga}
                    onChange={(e) => setNoviKorisnik({ ...noviKorisnik, uloga: e.target.value })}
                  />
                  <button
                    className="filter-btn"
                    onClick={() => {
                      setKorisnici((prev) =>
                        prev.map((k) =>
                          k.id === editUserId
                            ? { ...k, username: noviKorisnik.username, mail: noviKorisnik.mail, uloga: noviKorisnik.uloga }
                            : k
                        )
                      );
                      setNoviKorisnik({ username: "", mail: "", uloga: "" });
                      setEditUserId(null);
                    }}
                  >
                    Sačuvaj izmjene
                  </button>
                  <button
                    className="filter-btn"
                    onClick={() => {
                      setEditUserId(null);
                      setNoviKorisnik({ username: "", mail: "", uloga: "" });
                    }}
                  >
                    Odustani
                  </button>
                </div>
              )}

              <table width="100%" cellPadding="10">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Mail</th>
                    <th>Uloga</th>
                    <th>Akcija</th>
                  </tr>
                </thead>
                <tbody>
                  {korisnici.length === 0 ? (
                    <tr>
                      <td colSpan="5">Nema korisnika za prikaz.</td>
                    </tr>
                  ) : (
                    korisnici.map((k) => (
                      <tr key={k.id}>
                        <td>{k.id}</td>
                        <td>{k.username}</td>
                        <td>{k.mail}</td>
                        <td>{k.uloga}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="filter-btn"
                              onClick={() => {
                                setEditUserId(k.id);
                                setNoviKorisnik({ username: k.username, mail: k.mail, uloga: k.uloga });
                              }}
                            >
                              Izmijeni
                            </button>
                            <button className="filter-btn" onClick={() =>
                              otvoriModal(`Obrisati korisnika "${k.username}"?`, () => obrisiKorisnika(k.id))
                            }>
                              Obriši
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* LEKCIJE */}
          {activeTab === "lessons" && (
            <div className="stats-box">
              <div className="table-header">
                <h3>Sve lekcije</h3>
                <button
                  className="add-btn"
                  onClick={() => {
                    setShowLessonForm(!showLessonForm);
                    setEditLessonId(null);
                    setNovaLekcija({ naziv: "", redosljed: "", opis: "" });
                  }}
                >
                  <PlusCircle size={18} />
                  Dodaj lekciju
                </button>
              </div>

              {showLessonForm && (
                <div className="add-form">
                  <input
                    type="text"
                    placeholder="Naziv lekcije"
                    value={novaLekcija.naziv}
                    onChange={(e) => setNovaLekcija({ ...novaLekcija, naziv: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Redosljed"
                    value={novaLekcija.redosljed}
                    onChange={(e) => setNovaLekcija({ ...novaLekcija, redosljed: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Opis"
                    value={novaLekcija.opis}
                    onChange={(e) => setNovaLekcija({ ...novaLekcija, opis: e.target.value })}
                  />
                  <button
                    className="filter-btn"
                    onClick={() => {
                      if (!novaLekcija.naziv || !novaLekcija.redosljed || !novaLekcija.opis) {
                        alert("Popunite sva polja za lekciju.");
                        return;
                      }
                      if (editLessonId) {
                        setLekcije((prev) =>
                          prev.map((l) =>
                            l.id === editLessonId
                              ? { ...l, naziv: novaLekcija.naziv, redosljed: novaLekcija.redosljed, opis: novaLekcija.opis }
                              : l
                          )
                        );
                      } else {
                        setLekcije((prev) => [
                          ...prev,
                          { id: prev.length + 1, naziv: novaLekcija.naziv, redosljed: novaLekcija.redosljed, opis: novaLekcija.opis },
                        ]);
                      }
                      setNovaLekcija({ naziv: "", redosljed: "", opis: "" });
                      setEditLessonId(null);
                      setShowLessonForm(false);
                    }}
                  >
                    {editLessonId ? "Sačuvaj izmjene" : "Sačuvaj"}
                  </button>
                  <button
                    className="filter-btn"
                    onClick={() => {
                      setShowLessonForm(false);
                      setEditLessonId(null);
                      setNovaLekcija({ naziv: "", redosljed: "", opis: "" });
                    }}
                  >
                    Odustani
                  </button>
                </div>
              )}

              <table width="100%" cellPadding="10">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Naziv</th>
                    <th>Redosljed</th>
                    <th>Opis</th>
                    <th>Akcija</th>
                  </tr>
                </thead>
                <tbody>
                  {lekcije.length === 0 ? (
                    <tr>
                      <td colSpan="5">Nema lekcija za prikaz.</td>
                    </tr>
                  ) : (
                    lekcije.map((l) => (
                      <tr key={l.id}>
                        <td>{l.id}</td>
                        <td>{l.naziv}</td>
                        <td>{l.redosljed}</td>
                        <td>{l.opis}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="filter-btn"
                              onClick={() => {
                                setEditLessonId(l.id);
                                setNovaLekcija({ naziv: l.naziv, redosljed: l.redosljed, opis: l.opis });
                                setShowLessonForm(true);
                              }}
                            >
                              Izmijeni
                            </button>
                            <button className="filter-btn" onClick={() =>
                              otvoriModal(`Obrisati lekciju "${l.naziv}"?`, () => obrisiLekciju(l.id))
                            }>
                              Obriši
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ZADACI */}
          {activeTab === "tasks" && (
            <div className="stats-box">
              <div className="table-header">
                <h3>Svi zadaci</h3>
                <button
                  className="add-btn"
                  onClick={() => {
                    setShowTaskForm(!showTaskForm);
                    setEditTaskId(null);
                    setNoviZadatak({ naziv: "", lekcija: "" });
                  }}
                >
                  <PlusCircle size={18} />
                  Dodaj zadatak
                </button>
              </div>

              {showTaskForm && (
                <div className="add-form">
                  <input
                    type="text"
                    placeholder="Naziv zadatka"
                    value={noviZadatak.naziv}
                    onChange={(e) => setNoviZadatak({ ...noviZadatak, naziv: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Lekcija"
                    value={noviZadatak.lekcija}
                    onChange={(e) => setNoviZadatak({ ...noviZadatak, lekcija: e.target.value })}
                  />
                  <button
                    className="filter-btn"
                    onClick={() => {
                      if (!noviZadatak.naziv || !noviZadatak.lekcija) {
                        alert("Popunite sva polja za zadatak.");
                        return;
                      }
                      if (editTaskId) {
                        setZadaci((prev) =>
                          prev.map((z) =>
                            z.id === editTaskId
                              ? { ...z, naziv: noviZadatak.naziv, lekcija: noviZadatak.lekcija }
                              : z
                          )
                        );
                      } else {
                        setZadaci((prev) => [
                          ...prev,
                          { id: prev.length + 1, naziv: noviZadatak.naziv, lekcija: noviZadatak.lekcija },
                        ]);
                      }
                      setNoviZadatak({ naziv: "", lekcija: "" });
                      setEditTaskId(null);
                      setShowTaskForm(false);
                    }}
                  >
                    {editTaskId ? "Sačuvaj izmjene" : "Sačuvaj"}
                  </button>
                  <button
                    className="filter-btn"
                    onClick={() => {
                      setShowTaskForm(false);
                      setEditTaskId(null);
                      setNoviZadatak({ naziv: "", lekcija: "" });
                    }}
                  >
                    Odustani
                  </button>
                </div>
              )}

              <table width="100%" cellPadding="10">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Naziv</th>
                    <th>Lekcija</th>
                    <th>Akcija</th>
                  </tr>
                </thead>
                <tbody>
                  {zadaci.length === 0 ? (
                    <tr>
                      <td colSpan="4">Nema zadataka za prikaz.</td>
                    </tr>
                  ) : (
                    zadaci.map((z) => (
                      <tr key={z.id}>
                        <td>{z.id}</td>
                        <td>{z.naziv}</td>
                        <td>{z.lekcija}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="filter-btn"
                              onClick={() => {
                                setEditTaskId(z.id);
                                setNoviZadatak({ naziv: z.naziv, lekcija: z.lekcija });
                                setShowTaskForm(true);
                              }}
                            >
                              Izmijeni
                            </button>
                            <button className="filter-btn" onClick={() =>
                              otvoriModal(`Obrisati zadatak "${z.naziv}"?`, () => setZadaci((prev) => prev.filter((x) => x.id !== z.id)))
                            }>
                              Obriši
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* DOSTIGNUCA */}
          {activeTab === "achievements" && (
            <div className="stats-box">
              <div className="table-header">
                <h3>Dostignuća</h3>
                <button
                  className="add-btn"
                  onClick={() => {
                    setShowAchievementForm(!showAchievementForm);
                    setEditAchievementId(null);
                    setNovoDostignuce({ naziv: "", opis: "", uslov: "" });
                  }}
                >
                  <PlusCircle size={18} />
                  Dodaj dostignuće
                </button>
              </div>

              {showAchievementForm && (
                <div className="add-form">
                  <input
                    type="text"
                    placeholder="Naziv dostignuća"
                    value={novoDostignuce.naziv}
                    onChange={(e) => setNovoDostignuce({ ...novoDostignuce, naziv: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Opis"
                    value={novoDostignuce.opis}
                    onChange={(e) => setNovoDostignuce({ ...novoDostignuce, opis: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Uslov"
                    value={novoDostignuce.uslov}
                    onChange={(e) => setNovoDostignuce({ ...novoDostignuce, uslov: e.target.value })}
                  />
                  <button
                    className="filter-btn"
                    onClick={() => {
                      if (!novoDostignuce.naziv || !novoDostignuce.opis || !novoDostignuce.uslov) {
                        alert("Popunite sva polja za dostignuće.");
                        return;
                      }
                      if (editAchievementId) {
                        setDostignuca((prev) =>
                          prev.map((d) =>
                            d.id === editAchievementId
                              ? { ...d, naziv: novoDostignuce.naziv, opis: novoDostignuce.opis, uslov: novoDostignuce.uslov }
                              : d
                          )
                        );
                      } else {
                        setDostignuca((prev) => [
                          ...prev,
                          { id: prev.length + 1, naziv: novoDostignuce.naziv, opis: novoDostignuce.opis, uslov: novoDostignuce.uslov },
                        ]);
                      }
                      setNovoDostignuce({ naziv: "", opis: "", uslov: "" });
                      setEditAchievementId(null);
                      setShowAchievementForm(false);
                    }}
                  >
                    {editAchievementId ? "Sačuvaj izmjene" : "Sačuvaj"}
                  </button>
                  <button
                    className="filter-btn"
                    onClick={() => {
                      setShowAchievementForm(false);
                      setEditAchievementId(null);
                      setNovoDostignuce({ naziv: "", opis: "", uslov: "" });
                    }}
                  >
                    Odustani
                  </button>
                </div>
              )}

              <table width="100%" cellPadding="10">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Naziv</th>
                    <th>Opis</th>
                    <th>Uslov</th>
                    <th>Akcija</th>
                  </tr>
                </thead>
                <tbody>
                  {dostignuca.length === 0 ? (
                    <tr>
                      <td colSpan="5">Nema dostignuća za prikaz.</td>
                    </tr>
                  ) : (
                    dostignuca.map((d) => (
                      <tr key={d.id}>
                        <td>{d.id}</td>
                        <td>{d.naziv}</td>
                        <td>{d.opis}</td>
                        <td>{d.uslov}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="filter-btn"
                              onClick={() => {
                                setEditAchievementId(d.id);
                                setNovoDostignuce({ naziv: d.naziv, opis: d.opis, uslov: d.uslov });
                                setShowAchievementForm(true);
                              }}
                            >
                              Izmijeni
                            </button>
                            <button className="filter-btn" onClick={() =>
                              otvoriModal(`Obrisati dostignuće "${d.naziv}"?`, () => setDostignuca((prev) => prev.filter((x) => x.id !== d.id)))
                            }>
                              Obriši
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* STATISTIKA */}
          {activeTab === "statistics" && (
            <div className="stats-box">
              <h3>Statistika</h3>
              <div className="stats-grid">
                <div className="stat-card blue big">
                  <span className="stat-top">Ukupno korisnika</span>
                  <h2>{korisnici.length}</h2>
                </div>
                <div className="stat-card orange">
                  <p>Ukupno lekcija</p>
                  <h2>{lekcije.length}</h2>
                </div>
                <div className="stat-card purple">
                  <p>Ukupno zadataka</p>
                  <h2>{zadaci.length}</h2>
                </div>
              </div>
            </div>
          )}

          {/* PODESAVANJA */}
          {activeTab === "settings" && (
            <div className="stats-box">
              <h3>Podešavanja</h3>
              <p>Ovdje kasnije idu podešavanja admin panela.</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default Admin;
