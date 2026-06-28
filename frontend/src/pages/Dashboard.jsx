import "./Dashboard.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import CourseCard from "../components/CourseCard";
import LearningPath from "../components/LearningPath";
import ProcjenaModal from "../components/ProcjenaModal";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { BookOpen, Star, TrendingUp, Play, ArrowRight, AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, XCircle } from "lucide-react";

// 1=uvod(teal), 2=promjenljive(ljubičasta), 3=liste(plava/teal2), 4=petlje(naranžasta)
const colorByRedoslijed = { 1: "intro", 2: "purple", 3: "blue", 4: "orange" };

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

function Dashboard() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "lessons");
  const navigate = useNavigate();

  const [lekcije, setLekcije] = useState([]);
  const [stats, setStats] = useState({
    bodovi: 0,
    zavrseneLekcije: 0,
    nivo: 1,
  });
  const [trenutnaLekcija, setTrenutnaLekcija] = useState(null);
  const [zavrseneLekcije, setZavrseneLekcije] = useState([]);
  const [brojNetacnih, setBrojNetacnih] = useState(0);
  const [karouselIndex, setKarouselIndex] = useState(0);
  const CARDS_PER_PAGE = 4;
  const [netacniPoLekcijama, setNetacniPoLekcijama] = useState([]);
  const [netacniDetalji, setNetacniDetalji] = useState([]);
  const [korisnikId, setKorisnikId] = useState(null);
  const [showProcjena, setShowProcjena] = useState(false);
  const [procjenaRez, setProcjenaRez] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = getUsername();

    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:8000/lekcije/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setLekcije([...data].sort((a, b) => a.redoslijed - b.redoslijed)))
      .catch(() => {});

    if (!username) return;

    fetch(`http://localhost:8000/korisnik/pretraga/username?username=${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((korisnik) => {
        setKorisnikId(korisnik.id);
        const procjenaDone = localStorage.getItem(`${username}_procjena_done`);
        if (!procjenaDone) setShowProcjena(true);

        fetch(`http://localhost:8000/progres/po-korisniku/${korisnik.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => (res.ok ? res.json() : null))
          .then((progres) => {
            if (progres) {
              setStats((prev) => ({
                ...prev,
                bodovi: progres.bodovi,
                nivo: progres.nivo,
              }));
            }
          })
          .catch(() => {});

        fetch(`http://localhost:8000/zavrsena_lekcija/po-korisnik-id/${korisnik.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data && Array.isArray(data)) {
              setStats((prev) => ({
                ...prev,
                zavrseneLekcije: data.length,
              }));
              setZavrseneLekcije(data);
              if (data.length > 0) {
                setTrenutnaLekcija(data[data.length - 1]);
              }
            }
          })
          .catch(() => {});

        fetch(`http://localhost:8000/zadatak_korisnik/netacni/po-korisnik/${korisnik.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => (res.ok ? res.json() : []))
          .then((data) => setBrojNetacnih(Array.isArray(data) ? data.length : 0))
          .catch(() => {});

        fetch(`http://localhost:8000/zadatak_korisnik/netacni/po-lekcijama/${korisnik.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => (res.ok ? res.json() : []))
          .then((data) => setNetacniPoLekcijama(Array.isArray(data) ? data : []))
          .catch(() => {});

        fetch(`http://localhost:8000/zadatak_korisnik/netacni/detalji/${korisnik.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => (res.ok ? res.json() : []))
          .then((data) => setNetacniDetalji(Array.isArray(data) ? data : []))
          .catch(() => {});
      })
      .catch(() => {});
  }, [navigate]);

  const username = getUsername();

  const trenutnaLekcijaNaziv = trenutnaLekcija
    ? lekcije.find((l) => l.id === trenutnaLekcija.lekcija_id)?.naziv || "Trenutna lekcija"
    : "Još nema započete lekcije";

  const otvoriTrenutnuLekciju = () => {
    if (trenutnaLekcija?.lekcija_id) {
      navigate(`/lekcije/${trenutnaLekcija.lekcija_id}`);
      return;
    }

    if (lekcije[0]?.id) {
      navigate(`/lekcije/${lekcije[0].id}`);
    }
  };

  return (
    <div className="page-bg">
      <div className="dashboard-shell">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="dashboard-main">
          <Topbar />

          <section className="dashboard-hero">
            <div className="hero-content">
              <span className="hero-label">Python kurs</span>
              <h1>Zdravo{username ? `, ${username}` : ""}</h1>
              <p>Prati lekcije, bodove i trenutni nivo na jednom mjestu.</p>

              <div className="hero-chips">
                <span className="hero-chip"><Star size={14} /> {stats.bodovi} bodova</span>
                <span className="hero-chip"><TrendingUp size={14} /> Nivo {stats.nivo}</span>
                <span className="hero-chip"><BookOpen size={14} /> {stats.zavrseneLekcije} lekcija</span>
              </div>
            </div>

            <div className="hero-side">
              <button onClick={otvoriTrenutnuLekciju}>
                <Play size={16} /> Nastavi učenje
              </button>
            </div>

            <span className="hero-glow" />
          </section>

          {procjenaRez && (() => {
            const ukupno = Object.keys(procjenaRez).length;
            const tacnih = Object.values(procjenaRez).filter(Boolean).length;
            const netacnih = ukupno - tacnih;
            const loseLekcije = Object.entries(procjenaRez)
              .filter(([, t]) => !t)
              .map(([red]) => lekcije.find(l => l.redoslijed === parseInt(red))?.naziv || `Lekcija ${red}`);

            let naslov, tekst, tip;
            if (tacnih === ukupno) {
              tip = "uspjeh";
              naslov = "Sve lekcije su ti priznate!";
              tekst = "Odradio si test bez greške. Možeš nastaviti od sljedeće teme.";
            } else if (tacnih === 0) {
              tip = "savjet";
              naslov = "Preporučujemo da počneš od lekcije 1";
              tekst = "Nisi prošao nijednu lekciju bez greške — ne brini, to je normalno! Gradivo se gradi korak po korak i biće ti lakše ako kreneš od početka.";
            } else {
              tip = "mijesano";
              naslov = `${tacnih} od ${ukupno} oblasti prizate`;
              tekst = `Lekcije koje treba da prođeš: ${loseLekcije.join(", ")}. Gradivo se nadovezuje, pa preporučujemo da ih ipak prođeš kroz kurs.`;
            }

            const boje = {
              uspjeh: { card: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)", btn: "#fff", btnText: "#15803d" },
              savjet: "procjena-cta-preporuka",
              mijesano: { card: "linear-gradient(135deg, #d97706 0%, #b45309 100%)", btn: "#fff", btnText: "#b45309" },
            };

            const isPreporuka = tip === "savjet";

            return (
              <div className={`procjena-cta-card${isPreporuka ? " procjena-cta-preporuka" : ""}`}
                style={!isPreporuka ? { background: boje[tip].card } : {}}>
                <div className="procjena-cta-text">
                  <h3>{naslov}</h3>
                  <p>{tekst}</p>
                </div>
                <button
                  className="procjena-cta-btn"
                  onClick={() => setProcjenaRez(null)}
                >
                  Razumio sam ✓
                </button>
              </div>
            );
          })()}

          {(showProcjena === true || showProcjena === "modal") && (
            <div className="procjena-cta-card">
              <div className="procjena-cta-text">
                <h3>Brza procjena nivoa</h3>
                <p>Poznaješ neke oblasti? Uradi mini test i preskoči lekcije koje već znaš — 3–5 min.</p>
              </div>
              <button
                className="procjena-cta-btn"
                onClick={() => setShowProcjena("modal")}
              >
                Počni procjenu
              </button>
            </div>
          )}

          {showProcjena === "preporuka" && (
            <div className="procjena-cta-card procjena-cta-preporuka">
              <div className="procjena-cta-text">
                <h3>Preporučujemo da počneš od lekcije 1</h3>
                <p>Na osnovu procjene, savjetujemo da prođeš kroz kurs od početka — srećno!</p>
              </div>
              <button
                className="procjena-cta-btn"
                onClick={() => {
                  try { localStorage.setItem(`${username}_procjena_done`, "true"); } catch {}
                  setShowProcjena(false);
                }}
              >
                Razumio sam ✓
              </button>
            </div>
          )}

          {showProcjena === "modal" && (
            <ProcjenaModal
              lekcije={lekcije}
              korisnikId={korisnikId}
              token={localStorage.getItem("token")}
              lsPrefix={username}
              onClose={() => setShowProcjena(true)}
              onZavrseno={(rez) => {
                setShowProcjena(false);
                setProcjenaRez(rez);
                const token = localStorage.getItem("token");
                if (korisnikId && token) {
                  fetch(`http://localhost:8000/zavrsena_lekcija/po-korisnik-id/${korisnikId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  }).then(r => r.ok ? r.json() : null).then(data => {
                    if (data && Array.isArray(data)) {
                      setStats(prev => ({ ...prev, zavrseneLekcije: data.length }));
                      setZavrseneLekcije(data);
                      if (data.length > 0) setTrenutnaLekcija(data[data.length - 1]);
                    }
                  }).catch(() => {});
                  fetch(`http://localhost:8000/progres/po-korisniku/${korisnikId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  }).then(r => r.ok ? r.json() : null).then(progres => {
                    if (progres) setStats(prev => ({ ...prev, bodovi: progres.bodovi, nivo: progres.nivo }));
                  }).catch(() => {});
                }
              }}
              onPreporuka={() => setShowProcjena("preporuka")}
            />
          )}

          {activeTab === "lessons" && (
            <>
              <div className="section-header">
                <h2>Odaberi lekciju</h2>
                <span>{lekcije.length} ukupno</span>
              </div>

              {lekcije.length > 0 ? (
                <div className="karusel-wrap">
                  <button
                    className="karusel-arrow left"
                    onClick={() => setKarouselIndex((i) => Math.max(i - 1, 0))}
                    disabled={karouselIndex === 0}
                  >
                    <ChevronLeft size={22} />
                  </button>

                  <div className="karusel-track">
                    {lekcije.slice(karouselIndex * CARDS_PER_PAGE, karouselIndex * CARDS_PER_PAGE + CARDS_PER_PAGE).map((l) => {
                      const zavrsena = zavrseneLekcije.some((z) => z.lekcija_id === l.id);
                      return (
                        <CourseCard
                          key={l.id}
                          id={l.id}
                          badge={`Lekcija ${l.redoslijed}`}
                          title={l.naziv}
                          progress={zavrsena ? "1/1" : "0/1"}
                          zavrsena={zavrsena}
                          type={colorByRedoslijed[l.redoslijed] || "intro"}
                        />
                      );
                    })}
                  </div>

                  <button
                    className="karusel-arrow right"
                    onClick={() => setKarouselIndex((i) => Math.min(i + 1, Math.ceil(lekcije.length / CARDS_PER_PAGE) - 1))}
                    disabled={karouselIndex >= Math.ceil(lekcije.length / CARDS_PER_PAGE) - 1}
                  >
                    <ChevronRight size={22} />
                  </button>
                </div>
              ) : (
                <div className="empty-card">Lekcije trenutno nisu učitane.</div>
              )}

              <div className="lessons-section">
                <h2>Sve lekcije</h2>
                <LearningPath lekcije={lekcije} />
              </div>
            </>
          )}

          {activeTab === "current" && (
            <div className="current-card">
              <div className="current-card-left">
                <div className="current-icon-circle">
                  <BookOpen size={30} />
                </div>
              </div>
              <div className="current-card-right">
                <span className="current-label">Trenutna lekcija</span>
                <h2 className="current-title">{trenutnaLekcijaNaziv}</h2>
                {trenutnaLekcija ? (
                  <>
                    <p className="current-desc">Nastavi gdje si stao i završi lekciju.</p>
                    <button className="current-btn" onClick={otvoriTrenutnuLekciju}>
                      <Play size={14} /> Nastavi lekciju <ArrowRight size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <p className="current-desc">Kada započneš lekciju, prikazaće se ovdje.</p>
                    <button className="current-btn" onClick={otvoriTrenutnuLekciju}>
                      <Play size={14} /> Počni prvu lekciju <ArrowRight size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === "errors" && (
            <div className="errors-wrap">
              <div className="errors-summary">
                <div className="err-sum-card red">
                  <div className="err-sum-icon"><AlertTriangle size={20} /></div>
                  <div>
                    <span className="err-sum-label">Ukupno grešaka</span>
                    <h2 className="err-sum-value">{brojNetacnih}</h2>
                  </div>
                </div>
                <div className="err-sum-card dark-red">
                  <div className="err-sum-icon"><XCircle size={20} /></div>
                  <div>
                    <span className="err-sum-label">Lekcija s najviše grešaka</span>
                    <h2 className="err-sum-value" style={{ fontSize: "18px", marginTop: "4px" }}>
                      {netacniPoLekcijama[0]?.lekcija_naziv || "—"}
                    </h2>
                  </div>
                </div>
              </div>

              {netacniDetalji.length === 0 ? (
                <div className="errors-empty">
                  <div className="errors-empty-icon"><CheckCircle2 size={36} /></div>
                  <h3>Nema zabilježenih grešaka</h3>
                  <p>Odlično! Riješi zadatke u lekcijama — ako pogriješiš, ovdje ćeš vidjeti šta da ponoviš.</p>
                </div>
              ) : (
                <>
                  <div className="section-header" style={{ marginTop: 22 }}>
                    <h2>Sve greške</h2>
                    <span>{netacniDetalji.length} ukupno</span>
                  </div>
                  <div className="errors-grid">
                    {netacniDetalji.map((g) => (
                      <div
                        className="error-card"
                        key={g.id}
                        onClick={() => navigate(`/lekcije/${g.lekcija_id}`, {
                          state: {
                            gotoStep: g.zadatak_tip === "quiz" ? "quiz" : "coding",
                            zadatakRedoslijed: g.zadatak_redoslijed,
                          }
                        })}
                      >
                        <div className="error-card-head">
                          <div className="error-icon-box"><AlertTriangle size={18} /></div>
                          <span className="error-type">
                            {g.zadatak_tip === "quiz" ? "Mini kviz" : "Kod zadatak"}
                          </span>
                          {g.datum && <span className="error-date">{g.datum}</span>}
                        </div>
                        <p className="error-task-name">{g.zadatak_naziv || "Zadatak"}</p>
                        <span className="error-lekcija">{g.lekcija_naziv}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default Dashboard;