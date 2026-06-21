import Sidebar from "../components/AdminSidebar";
import Topbar from "../components/Topbar";
import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import "./Admin.css";

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

//   const [zadaci, setZadaci] = useState([
//   {
//     id: 1,
//     naziv: "Prvi Python program",
//     lekcija: "Uvod u Python",
//     lekcija_id: 1,
//     tezina: "laka",
//     tip: "teorija",
//   },
//   {
//     id: 2,
//     naziv: "Promjenljive",
//     lekcija: "Osnove sintakse",
//     lekcija_id: 2,
//     tezina: "laka",
//     tip: "teorija",
//   },
// ]);

const [zadaci, setZadaci] = useState([]);

  const [dostignuca, setDostignuca] = useState([
    { id: 1, naziv: "Prva lekcija", opis: "Korisnik je završio prvu lekciju", uslov: "Završena 1 lekcija" },
    { id: 2, naziv: "Python početnik", opis: "Korisnik je uradio prvi zadatak", uslov: "Urađen 1 zadatak" },
  ]);

  const [noviKorisnik, setNoviKorisnik] = useState({ username: "", mail: "", uloga: "" });
  const [novaLekcija, setNovaLekcija] = useState({ naziv: "", redoslijed: "", opis: "" });
  const [noviZadatak, setNoviZadatak] = useState({naziv: "", opis: "", odgovor_a: "", odgovor_b: "", odgovor_c: "", odgovor_d: "", tacan_odgovor: "", rjesenje: "", ocekivani_izlaz: "",lekcija_id: "", tezina: "laka", tip: "teorija",});
  const [novoDostignuce, setNovoDostignuce] = useState({ naziv: "", opis: "", uslov: "" });

  const token = localStorage.getItem("token");

  const otvoriModal = (tekst, onConfirm) => {
  setConfirmModal({ open: true, tekst, onConfirm });

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
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
        if (!res.ok) throw new Error("Greška pri učitavanju korisnika");
        return res.json();
      })
      .then(setKorisnici)
      .catch((e) => setGreska(e.message));

    Promise.all([
  fetch("http://localhost:8000/lekcije/", {
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => res.json()),

  fetch("http://localhost:8000/zadaci/", {
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => res.json()),
])
  .then(([lekcijeData, zadaciData]) => {
    setLekcije(lekcijeData);

    setZadaci(
      zadaciData.map((z) => ({
        id: z.id,
        naziv: `Zadatak ${z.id}`,
        opis: z.opis || "",
        lekcija_id: z.lekcija_id,
        tezina: z.tezina,
        tip: z.tip,
        lekcija:
          lekcijeData.find((l) => l.id === z.lekcija_id)?.naziv ||
          `Lekcija ${z.lekcija_id}`,
      }))
    );
  })
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
                    setNovaLekcija({ naziv: "", redoslijed: "", opis: "" });
                  }}
                >
                  <PlusCircle size={18} />
                  Dodaj lekciju
                </button>
              </div>

              {showLessonForm && (
                <div className="add-form">
                  <h4 className="form-title">
                    {editLessonId ? "Izmjena lekcije" : "Nova lekcija"}
                  </h4>
                  <input
                    type="text"
                    placeholder="Naziv lekcije"
                    value={novaLekcija.naziv}
                    onChange={(e) => setNovaLekcija({ ...novaLekcija, naziv: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Redosljed"
                    value={novaLekcija.redoslijed}
                    onChange={(e) => setNovaLekcija({ ...novaLekcija, redoslijed: e.target.value })}
                  />
                  <textarea
                    type="text"
                    placeholder="Opis lekcije"
                    value={novaLekcija.opis}
                    onChange={(e) => setNovaLekcija({ ...novaLekcija, opis: e.target.value })}
                  />
                  <button
                    className="filter-btn"
                    onClick={async () => {
                      if (!novaLekcija.naziv || !novaLekcija.redoslijed || !novaLekcija.opis) {
                        alert("Popunite sva polja za lekciju.");
                        return;
                      }
                      const lekcijaZaSlanje = {
                        naziv: novaLekcija.naziv,
                        redoslijed: Number(novaLekcija.redoslijed),
                        opis: novaLekcija.opis,
                      };

                      if (editLessonId) {
                        const res = await fetch(`http://localhost:8000/lekcije/${editLessonId}`, {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify(lekcijaZaSlanje),
                        });

                        if (!res.ok) {
                          alert("Greška pri izmjeni lekcije.");
                          return;
                        }

                        const izmijenjenaLekcija = await res.json();

                        setLekcije((prev) =>
                          prev.map((l) => (l.id === editLessonId ? izmijenjenaLekcija : l))
                        );
                      } else {
                        const res = await fetch("http://localhost:8000/lekcije/", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify(lekcijaZaSlanje),
                        });

                        if (!res.ok) {
                          alert("Greška pri dodavanju lekcije.");
                          return;
                        }

                        const dodataLekcija = await res.json();

                        setLekcije((prev) => [...prev, dodataLekcija]);
                      }

                      setNovaLekcija({ naziv: "", redoslijed: "", opis: "" });
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
                      setNovaLekcija({ naziv: "", redoslijed: "", opis: "" });
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
                        <td>{l.redoslijed}</td>
                        <td>{l.opis}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="filter-btn"
                              onClick={() => {
                                setEditLessonId(l.id);
                                setNovaLekcija({ naziv: l.naziv, redoslijed: l.redoslijed, opis: l.opis });
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
                    setNoviZadatak({
                      naziv: "",
                      opis: "",
                      lekcija_id: "",
                      tezina: "laka",
                      tip: "teorija",
                    });
                  }}
                >
                  <PlusCircle size={18} />
                  Dodaj zadatak
                </button>
              </div>

              {showTaskForm && (
                <div className="add-form">
                  <h4 className="form-title">
                    {editTaskId ? "Izmjena zadatka" : "Novi zadatak"}
                  </h4>
                  <input
                    type="text"
                    placeholder="Naziv zadatka"
                    value={noviZadatak.naziv}
                    onChange={(e) =>
                      setNoviZadatak({
                        ...noviZadatak,
                        naziv: e.target.value,
                      })
                    }
                  />
                  <textarea
                    placeholder="Opis zadatka"
                    value={noviZadatak.opis}
                    onChange={(e) =>
                      setNoviZadatak({
                        ...noviZadatak,
                        opis: e.target.value,
                      })
                    }
                  />
                  <select
                    value={noviZadatak.lekcija_id}
                    onChange={(e) =>
                      setNoviZadatak({ ...noviZadatak, lekcija_id: e.target.value })
                    }
                  >
                    <option value="">Izaberi lekciju</option>
                    {lekcije.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.naziv}
                      </option>
                    ))}
                  </select>

                  <select
                    value={noviZadatak.tezina}
                    onChange={(e) =>
                      setNoviZadatak({ ...noviZadatak, tezina: e.target.value })
                    }
                  >
                    <option value="laka">Laka</option>
                    <option value="srednja">Srednja</option>
                    <option value="teska">Teška</option>
                  </select>

                  <select
                    value={noviZadatak.tip}
                    onChange={(e) =>
                      setNoviZadatak({ ...noviZadatak, tip: e.target.value })
                    }
                  >
                    <option value="teorija">Teorija</option>
                    <option value="prakticni">Praktični</option>
                    <option value="quiz">Quiz</option>
                  </select>

                  {noviZadatak.tip === "quiz" && (
                    <>
                      <input
                        type="text"
                        placeholder="Odgovor A"
                        value={noviZadatak.odgovor_a}
                        onChange={(e) =>
                          setNoviZadatak({ ...noviZadatak, odgovor_a: e.target.value })
                        }
                      />

                      <input
                        type="text"
                        placeholder="Odgovor B"
                        value={noviZadatak.odgovor_b}
                        onChange={(e) =>
                          setNoviZadatak({ ...noviZadatak, odgovor_b: e.target.value })
                        }
                      />

                      <input
                        type="text"
                        placeholder="Odgovor C"
                        value={noviZadatak.odgovor_c}
                        onChange={(e) =>
                          setNoviZadatak({ ...noviZadatak, odgovor_c: e.target.value })
                        }
                      />

                      <input
                        type="text"
                        placeholder="Odgovor D"
                        value={noviZadatak.odgovor_d}
                        onChange={(e) =>
                          setNoviZadatak({ ...noviZadatak, odgovor_d: e.target.value })
                        }
                      />

                      <select
                        value={noviZadatak.tacan_odgovor}
                        onChange={(e) =>
                          setNoviZadatak({
                            ...noviZadatak,
                            tacan_odgovor: e.target.value,
                          })
                        }
                      >
                        <option value="">Tačan odgovor</option>
                        <option value="0">A</option>
                        <option value="1">B</option>
                        <option value="2">C</option>
                        <option value="3">D</option>
                      </select>
                    </>
                  )}

                  {noviZadatak.tip === "prakticni" && (
                    <>
                      <textarea
                        placeholder="Rješenje zadatka"
                        value={noviZadatak.rjesenje}
                        onChange={(e) =>
                          setNoviZadatak({ ...noviZadatak, rjesenje: e.target.value })
                        }
                      />

                      <textarea
                        placeholder="Očekivani izlaz"
                        value={noviZadatak.ocekivani_izlaz}
                        onChange={(e) =>
                          setNoviZadatak({ ...noviZadatak, ocekivani_izlaz: e.target.value })
                        }
                      />
                    </>
                  )}
                  <button
                    className="filter-btn"
                    onClick={async () => {
                      if (!noviZadatak.naziv || !noviZadatak.lekcija_id) {
                        alert("Popunite naziv i izaberite lekciju.");
                        return;
                      }
                      const zadatakZaSlanje = {
                        lekcija_id: Number(noviZadatak.lekcija_id),
                        naziv: noviZadatak.naziv,
                        opis: noviZadatak.opis,
                        tezina: noviZadatak.tezina,
                        tip: noviZadatak.tip,

                        odgovor_a: noviZadatak.odgovor_a,
                        odgovor_b: noviZadatak.odgovor_b,
                        odgovor_c: noviZadatak.odgovor_c,
                        odgovor_d: noviZadatak.odgovor_d,
                        tacan_odgovor:
                          noviZadatak.tacan_odgovor === ""
                            ? null
                            : Number(noviZadatak.tacan_odgovor),
                        
                        rjesenje: noviZadatak.rjesenje,
                        ocekivani_izlaz: noviZadatak.ocekivani_izlaz,
                      };

                      const url = editTaskId
                        ? `http://localhost:8000/zadaci/${editTaskId}`
                        : "http://localhost:8000/zadaci/";

                      const res = await fetch(url, {
                        method: editTaskId ? "PUT" : "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(zadatakZaSlanje),
                      });

                      if (!res.ok) {
                        alert(editTaskId ? "Greška pri izmjeni zadatka." : "Greška pri dodavanju zadatka.");
                        return;
                      }

                      const sacuvaniZadatak = await res.json();

                      const zadatakZaTabelu = {
                        id: sacuvaniZadatak.id,
                        naziv: noviZadatak.naziv,
                        lekcija_id: Number(noviZadatak.lekcija_id),
                        opis: sacuvaniZadatak.opis || noviZadatak.opis,
                        tezina: noviZadatak.tezina,
                        tip: noviZadatak.tip,
                        lekcija:
                          lekcije.find((l) => l.id === Number(noviZadatak.lekcija_id))?.naziv || "",
                      };

                      if (editTaskId) {
                        setZadaci((prev) =>
                          prev.map((z) => (z.id === editTaskId ? zadatakZaTabelu : z))
                        );
                      } else {
                        setZadaci((prev) => [...prev, zadatakZaTabelu]);
                      }

                      setNoviZadatak({
                        naziv: "",
                        opis: "",
                        odgovor_a: "",
                        odgovor_b: "",
                        odgovor_c: "",
                        odgovor_d: "",
                        tacan_odgovor: "",
                        rjesenje: "",
                        ocekivani_izlaz: "",
                        lekcija_id: "",
                        tezina: "laka",
                        tip: "teorija",
                      });
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
                      setNoviZadatak({
                        naziv: "",
                        opis: "",
                        odgovor_a: "",
                        odgovor_b: "",
                        odgovor_c: "",
                        odgovor_d: "",
                        tacan_odgovor: "",
                        rjesenje: "",
                        ocekivani_izlaz: "",
                        lekcija_id: "",
                        tezina: "laka",
                        tip: "teorija",
                      });
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
                    <th>Opis</th>
                    <th>Težina</th>
                    <th>Tip</th>
                    <th>Akcija</th>
                  </tr>
                </thead>
                <tbody>
                  {zadaci.length === 0 ? (
                    <tr>
                      <td colSpan="7">Nema zadataka za prikaz.</td>
                    </tr>
                  ) : (
                    zadaci.map((z) => (
                      <tr key={z.id}>
                        <td>{z.id}</td>
                        <td>{z.naziv}</td>
                        <td>{z.lekcija}</td>
                        <td>{z.opis}</td>
                        <td>{z.tezina}</td>
                        <td>{z.tip}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="filter-btn"
                              onClick={() => {
                                setEditTaskId(z.id);
                                setNoviZadatak({
                                  naziv: z.naziv,
                                  opis: z.opis || "",

                                  odgovor_a: z.odgovor_a || "",
                                  odgovor_b: z.odgovor_b || "",
                                  odgovor_c: z.odgovor_c || "",
                                  odgovor_d: z.odgovor_d || "",
                                  tacan_odgovor:
                                    z.tacan_odgovor !== null && z.tacan_odgovor !== undefined
                                      ? String(z.tacan_odgovor)
                                      : "",
                                  rjesenje: z.rjesenje || "",
                                  ocekivani_izlaz: z.ocekivani_izlaz || "",
                                  lekcija_id: z.lekcija_id || "",
                                  tezina: z.tezina || "laka",
                                  tip: z.tip || "teorija",
                                });
                                setShowTaskForm(true);
                                window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                              });
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
