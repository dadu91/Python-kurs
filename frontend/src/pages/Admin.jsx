import Sidebar from "../components/AdminSidebar";
import Topbar from "../components/Topbar";
import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import "./Admin.css";
import { useNavigate, useSearchParams } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") === "lessons" ? "lessons" : "dashboard"
  );
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
  const [novaLekcija, setNovaLekcija] = useState({ naziv: "", redoslijed: "", opis: "", ciljevi: "", primjer_koda: "", objasnjenje_koda: "", trajanje: "", nivo: ""});
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

      fetch("http://localhost:8000/lekcije/", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
  setLekcije(data);

  const zadaciIzLekcija = data.flatMap((lekcija) => {
    let oblasti = [];
let miniProvjere = [];

try {
  const parsed = lekcija.sadrzaj ? JSON.parse(lekcija.sadrzaj) : null;

  if (Array.isArray(parsed)) {
    oblasti = parsed;
  } else if (parsed) {
    oblasti = parsed.oblasti || [];
    miniProvjere = parsed.miniProvjere || [];
  }
} catch {
  oblasti = [];
  miniProvjere = [];
}

const zadaciIzOblasti = oblasti.flatMap((oblast) =>
  (oblast.elementi || [])
    .filter((el) => el.tip === "vjezba")
    .map((el) => ({
      id: `vjezba-${lekcija.id}-${el.id}`,
      naziv: "Vježba sintakse",
      opis: el.tekst,
      lekcija_id: lekcija.id,
      lekcija: lekcija.naziv,
      tezina: "laka",
      tip: "prakticni",
    }))
);

const pitanjaIzMiniProvjera = miniProvjere.map((p) => ({
  id: `quiz-${lekcija.id}-${p.id}`,
  naziv: p.pitanje,
  opis: p.pitanje,
  lekcija_id: lekcija.id,
  lekcija: lekcija.naziv,
  tezina: "laka",
  tip: "quiz",
}));

return [...zadaciIzOblasti, ...pitanjaIzMiniProvjera];

    return oblasti.flatMap((oblast) =>
      (oblast.elementi || [])
        .filter((el) => el.tip === "quiz" || el.tip === "vjezba")
        .map((el) => ({
          id: el.id,
          naziv: el.tip === "quiz" ? el.pitanje : "Vježba sintakse",
          opis: el.tip === "quiz" ? el.pitanje : el.tekst,
          lekcija_id: lekcija.id,
          lekcija: lekcija.naziv,
          tezina: "laka",
          tip: el.tip === "vjezba" ? "prakticni" : "quiz",
        }))
    );
  });

  setZadaci(zadaciIzLekcija);
})
        
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

  const resetLekcijaForm = () => ({
  naziv: "",
  redoslijed: "",
  opis: "",
  ciljevi: "",
  primjer_koda: "",
  objasnjenje_koda: "",
  trajanje: "",
  nivo: "",
});

const odustaniOdLekcije = () => {
  setShowLessonForm(false);
  setEditLessonId(null);
  setNovaLekcija(resetLekcijaForm());
};

const sacuvajLekciju = async () => {
  if (!novaLekcija.naziv || !novaLekcija.redoslijed || !novaLekcija.opis) {
    alert("Popunite naziv, redoslijed i opis lekcije.");
    return;
  }

  const lekcijaZaSlanje = {
    naziv: novaLekcija.naziv,
    redoslijed: Number(novaLekcija.redoslijed),
    opis: novaLekcija.opis,
    ciljevi: novaLekcija.ciljevi,
    primjer_koda: novaLekcija.primjer_koda,
    objasnjenje_koda: novaLekcija.objasnjenje_koda,
    trajanje: novaLekcija.trajanje,
    nivo: novaLekcija.nivo,
  };

  const url = editLessonId
    ? `http://localhost:8000/lekcije/${editLessonId}`
    : "http://localhost:8000/lekcije/";

  const res = await fetch(url, {
    method: editLessonId ? "PUT" : "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(lekcijaZaSlanje),
  });

  if (!res.ok) {
    alert(editLessonId ? "Greška pri izmjeni lekcije." : "Greška pri dodavanju lekcije.");
    return;
  }

  const sacuvanaLekcija = await res.json();

  if (editLessonId) {
    setLekcije((prev) =>
      prev.map((l) => (l.id === editLessonId ? sacuvanaLekcija : l))
    );
  } else {
    setLekcije((prev) => [...prev, sacuvanaLekcija]);
  }

  setNovaLekcija(resetLekcijaForm());
  setEditLessonId(null);
  setShowLessonForm(false);
};

  const formatVrijeme = (sekunde) => {
    if (!sekunde) return "0 s";

    const h = Math.floor(sekunde / 3600);
    const m = Math.floor((sekunde % 3600) / 60);
    const s = sekunde % 60;

    if (h > 0) return `${h} h ${m} min`;
    if (m > 0) return `${m} min ${s} s`;
  return `${s} s`;
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
                    <th>Datum registracije</th>
                    <th>Posljednji login</th>
                    <th>Vrijeme u aplikaciji</th>
                    <th>Akcija</th>
                  </tr>
                </thead>
                <tbody>
                  {korisnici.length === 0 ? (
                    <tr>
                      <td colSpan="8">Nema korisnika za prikaz.</td>
                    </tr>
                  ) : (
                    korisnici.map((k) => (
                      <tr key={k.id}>
                        <td>{k.id}</td>
                        <td>{k.username}</td>
                        <td>{k.mail}</td>
                        <td>{k.uloga}</td>
                        <td>
                          {k.datum_reg
                            ? new Date(k.datum_reg).toLocaleDateString("sr-Latn-ME")
                            : "-"}
                        </td>
                        <td>
                          {k.last_login_at
                            ? new Date(k.last_login_at).toLocaleString("sr-Latn-ME")
                            : "Nikad"}
                        </td>
                        <td>{formatVrijeme(k.ukupno_vrijeme)}</td>
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
                    onClick={() => navigate("/admin/lekcije/nova")}
                  >
                    <PlusCircle size={18} />
                    Dodaj lekciju
                  </button>
                </div>

                <table width="100%" cellPadding="10">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Naziv</th>
                      <th>Redoslijed</th>
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

                                  setNovaLekcija({
                                    naziv: l.naziv,
                                    redoslijed: l.redoslijed,
                                    opis: l.opis || "",
                                    ciljevi: l.ciljevi || "",
                                    primjer_koda: l.primjer_koda || "",
                                    objasnjenje_koda: l.objasnjenje_koda || "",
                                    trajanje: l.trajanje || "",
                                    nivo: l.nivo || "",
                                    sadrzaj: l.sadrzaj || "",
                                  });

                                  navigate(`/admin/lekcije/${l.id}/izmjena`);
                                }}
                              >
                                Izmijeni
                              </button>

                              <button
                                className="filter-btn"
                                onClick={() =>
                                  otvoriModal(
                                    `Obrisati lekciju "${l.naziv}"?`,
                                    () => obrisiLekciju(l.id)
                                  )
                                }
                              >
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
              </div>
              <table width="100%" cellPadding="10">
                <thead>
                  <tr>
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
                      <td colSpan="6">Nema zadataka za prikaz.</td>
                    </tr>
                  ) : (
                    zadaci.map((z) => (
                      <tr key={z.id}>
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
