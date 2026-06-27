import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./LessonForm.css";
import { CheckCircle2 } from "lucide-react";

const noviElement = (tip) => ({
  id: Date.now() + Math.random(),
  tip,
  naslov: "",
  tekst: "",
  kod: "",
  objasnjenje: [""],
  pitanje: "",
  a: "",
  b: "",
  c: "",
  d: "",
  tacan: "",
  rjesenje: "",
  izlaz: "",
});

function LessonForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const token = localStorage.getItem("token");

  const [lekcija, setLekcija] = useState({
    naziv: "",
    redoslijed: "",
    opis: "",
    trajanje: "",
    nivo: "",
    ciljevi: [""],
  });

  const [oblasti, setOblasti] = useState([
    { id: Date.now(), naziv: "", elementi: [] },
  ]);
  
  const [miniProvjere, setMiniProvjere] = useState([]);

  const dodajOblast = () => {
    setOblasti([
      ...oblasti,
      { id: Date.now() + Math.random(), naziv: "", elementi: [] },
    ]);
  };

  const dodajElement = (oblastIndex, tip) => {
    const kopija = [...oblasti];
    kopija[oblastIndex].elementi.push(noviElement(tip));
    setOblasti(kopija);
  };

  const updateElement = (oblastIndex, elementIndex, field, value) => {
    const kopija = [...oblasti];
    kopija[oblastIndex].elementi[elementIndex][field] = value;
    setOblasti(kopija);
  };

  const obrisiElement = (oblastIndex, elementIndex) => {
    const kopija = [...oblasti];
    kopija[oblastIndex].elementi = kopija[oblastIndex].elementi.filter(
      (_, i) => i !== elementIndex
    );
    setOblasti(kopija);
  };

  useEffect(() => {
  if (!isEdit) return;

  fetch(`http://localhost:8000/lekcije/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (!data) return;

      setLekcija({
        naziv: data.naziv || "",
        redoslijed: data.redoslijed || "",
        opis: data.opis || "",
        trajanje: data.trajanje || "",
        nivo: data.nivo || "",
        ciljevi: data.ciljevi ? data.ciljevi.split("\n") : [""],
      });

      try {
        const parsed = data.sadrzaj ? JSON.parse(data.sadrzaj) : null;

        if (Array.isArray(parsed)) {
          setOblasti(parsed);
          setMiniProvjere([]);
        } else if (parsed) {
          setOblasti(parsed.oblasti || [{ id: Date.now(), naziv: "", elementi: [] }]);
          setMiniProvjere(parsed.miniProvjere || []);
        } else {
          setOblasti([{ id: Date.now(), naziv: "", elementi: [] }]);
          setMiniProvjere([]);
        }
      } catch {
        setOblasti([{ id: Date.now(), naziv: "", elementi: [] }]);
        setMiniProvjere([]);
      }
    });
}, [id, isEdit, token]);

  const sacuvajLekciju = async () => {
    const prviKod = oblasti
      .flatMap((o) => o.elementi)
      .find((e) => e.tip === "kod");

    const lekcijaZaSlanje = {
      naziv: lekcija.naziv,
      redoslijed: Number(lekcija.redoslijed),
      opis: lekcija.opis,
      trajanje: String(lekcija.trajanje || ""),
      nivo: lekcija.nivo,
      ciljevi: lekcija.ciljevi.filter((c) => c.trim()).join("\n"),
      primjer_koda: prviKod?.kod || "",
      objasnjenje_koda: Array.isArray(prviKod?.objasnjenje)
        ? prviKod.objasnjenje.filter((o) => o.trim()).join("\n")
        : prviKod?.objasnjenje || "",
      sadrzaj: JSON.stringify({
        oblasti,
        miniProvjere,
}),
    };

    const url = isEdit
      ? `http://localhost:8000/lekcije/${id}`
      : "http://localhost:8000/lekcije/";

    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(lekcijaZaSlanje),
    });

    if (!res.ok) {
      const error = await res.json();
      alert(error.detail || "Greška pri čuvanju lekcije.");
      return;
    }

    const sacuvanaLekcija = await res.json();
    const lekcijaId = sacuvanaLekcija.id;

    navigate("/admin?tab=lessons", { replace: true });
    return;

    if (isEdit) {
      navigate("/admin?tab=lessons");
      return;
    }

    const elementi = oblasti.flatMap((oblast) => oblast.elementi);

    for (let i = 0; i < elementi.length; i++) {
      const el = elementi[i];

      if (el.tip === "quiz") {
        const zadatakRes = await fetch("http://localhost:8000/zadaci/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            lekcija_id: lekcijaId,
            redoslijed: i + 1,
            naziv: el.pitanje,
            opis: el.pitanje,
            odgovor_a: el.a,
            odgovor_b: el.b,
            odgovor_c: el.c,
            odgovor_d: el.d,
            tacan_odgovor: Number(el.tacan),
            tezina: "laka",
            tip: "quiz",
          }),
        });

        if (!zadatakRes.ok) {
          console.log(await zadatakRes.json());
        }
      }

      if (el.tip === "vjezba") {
        await fetch("http://localhost:8000/zadaci/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            lekcija_id: lekcijaId,
            redoslijed: i + 1,
            naziv: "Vježba sintakse",
            opis: el.tekst,
            rjesenje: el.rjesenje,
            ocekivani_izlaz: el.izlaz,
            tezina: "laka",
            tip: "prakticni",
          }),
        });
      }
    }

    navigate("/admin?tab=lessons");
  };

  return (
    <div className="lesson-form-page">
      <div className="lesson-builder-layout">
        <div className="lesson-form">
          <h1>Nova lekcija</h1>

          <section className="lesson-card">
            <h3>Osnovni podaci</h3>

            <input
              placeholder="Naziv lekcije"
              value={lekcija.naziv}
              onChange={(e) => setLekcija({ ...lekcija, naziv: e.target.value })}
            />

            <input
              type="number"
              placeholder="Redosljed"
              value={lekcija.redoslijed}
              onChange={(e) =>
                setLekcija({ ...lekcija, redoslijed: e.target.value })
              }
            />

            <input
              placeholder="Trajanje npr. 30"
              value={lekcija.trajanje}
              onChange={(e) =>
                setLekcija({ ...lekcija, trajanje: e.target.value })
              }
            />

            <select
              value={lekcija.nivo}
              onChange={(e) => setLekcija({ ...lekcija, nivo: e.target.value })}
            >
              <option value="">Odaberi nivo</option>
              <option value="Početnik">Početnik</option>
              <option value="Srednji">Srednji</option>
              <option value="Napredni">Napredni</option>
            </select>

            <textarea
              placeholder="Opis lekcije"
              value={lekcija.opis}
              onChange={(e) => setLekcija({ ...lekcija, opis: e.target.value })}
            />

            <h4>Ciljevi</h4>

            {lekcija.ciljevi.map((cilj, index) => (
              <div className="goal-input-row" key={index}>
                <div className="goal-check-icon">
                  <CheckCircle2 size={20} />
                </div>
                <input
                  placeholder={`Cilj ${index + 1}`}
                  value={cilj}
                  onChange={(e) => {
                    const novi = [...lekcija.ciljevi];
                    novi[index] = e.target.value;
                    setLekcija({ ...lekcija, ciljevi: novi });
                  }}
                />
                <button
                  type="button"
                  className="remove-mini-btn"
                  onClick={() =>
                    setLekcija({
                      ...lekcija,
                      ciljevi: lekcija.ciljevi.filter((_, i) => i !== index),
                    })
                  }
                >
                  ×
                </button>
              </div>
            ))}

            <button
              type="button"
              className="add-mini-btn"
              onClick={() =>
                setLekcija({ ...lekcija, ciljevi: [...lekcija.ciljevi, ""] })
              }
            >
              + Dodaj cilj
            </button>
          </section>

          {oblasti.map((oblast, oblastIndex) => (
            <section className="lesson-card" key={oblast.id}>
              <h3>Oblast {oblastIndex + 1}</h3>

              <input
                placeholder="Naziv oblasti"
                value={oblast.naziv}
                onChange={(e) => {
                  const kopija = [...oblasti];
                  kopija[oblastIndex].naziv = e.target.value;
                  setOblasti(kopija);
                }}
              />

              <div className="area-buttons">
                <button onClick={() => dodajElement(oblastIndex, "teorija")}>
                  + Teorija
                </button>
                <button onClick={() => dodajElement(oblastIndex, "kod")}>
                  + Primjer koda
                </button>
                <button onClick={() => dodajElement(oblastIndex, "vjezba")}>
                  + Vježba
                </button>
              </div>

              {oblast.elementi.map((el, elementIndex) => (
                <div className="content-card" key={el.id}>
                  <div className="content-card-header">
                    <strong>{el.tip.toUpperCase()}</strong>
                    <button
                      type="button"
                      onClick={() => obrisiElement(oblastIndex, elementIndex)}
                    >
                      Obriši
                    </button>
                  </div>

                  {el.tip === "teorija" && (
                    <>
                      <input
                        placeholder="Naslov teorije"
                        value={el.naslov}
                        onChange={(e) =>
                          updateElement(
                            oblastIndex,
                            elementIndex,
                            "naslov",
                            e.target.value
                          )
                        }
                      />
                      <textarea
                        placeholder="Tekst teorije"
                        value={el.tekst}
                        onChange={(e) =>
                          updateElement(
                            oblastIndex,
                            elementIndex,
                            "tekst",
                            e.target.value
                          )
                        }
                      />
                    </>
                  )}

                  {el.tip === "kod" && (
                    <>
                      <textarea
                        placeholder="Primjer koda"
                        value={el.kod}
                        onChange={(e) =>
                          updateElement(
                            oblastIndex,
                            elementIndex,
                            "kod",
                            e.target.value
                          )
                        }
                      />
                      <div className="goals-builder">
                        <h4>Objašnjenja koda</h4>

                        {(Array.isArray(el.objasnjenje) ? el.objasnjenje : [el.objasnjenje || ""]).map(
                          (objasnjenje, objIndex) => (
                            <div className="goal-input-row" key={objIndex}>
                              <span>{objIndex + 1}</span>

                              <textarea
                                placeholder={`Objašnjenje ${objIndex + 1}`}
                                value={objasnjenje}
                                onChange={(e) => {
                                  const novaObjasnjenja = Array.isArray(el.objasnjenje)
                                    ? [...el.objasnjenje]
                                    : [el.objasnjenje || ""];

                                  novaObjasnjenja[objIndex] = e.target.value;

                                  updateElement(
                                    oblastIndex,
                                    elementIndex,
                                    "objasnjenje",
                                    novaObjasnjenja
                                  );
                                }}
                              />

                              <button
                                type="button"
                                className="remove-mini-btn"
                                onClick={() => {
                                  const novaObjasnjenja = Array.isArray(el.objasnjenje)
                                    ? el.objasnjenje.filter((_, i) => i !== objIndex)
                                    : [""];

                                  updateElement(
                                    oblastIndex,
                                    elementIndex,
                                    "objasnjenje",
                                    novaObjasnjenja.length ? novaObjasnjenja : [""]
                                  );
                                }}
                              >
                                ×
                              </button>
                            </div>
                          )
                        )}

                        <button
                          type="button"
                          className="add-mini-btn"
                          onClick={() => {
                            const novaObjasnjenja = Array.isArray(el.objasnjenje)
                              ? [...el.objasnjenje, ""]
                              : [el.objasnjenje || "", ""];

                            updateElement(
                              oblastIndex,
                              elementIndex,
                              "objasnjenje",
                              novaObjasnjenja
                            );
                          }}
                        >
                          + Dodaj objašnjenje
                        </button>
                      </div>
                    </>
                  )}

                  {el.tip === "vjezba" && (
                    <>
                      <textarea
                        placeholder="Opis vježbe"
                        value={el.tekst}
                        onChange={(e) =>
                          updateElement(
                            oblastIndex,
                            elementIndex,
                            "tekst",
                            e.target.value
                          )
                        }
                      />
                      <textarea
                        placeholder="Rješenje"
                        value={el.rjesenje}
                        onChange={(e) =>
                          updateElement(
                            oblastIndex,
                            elementIndex,
                            "rjesenje",
                            e.target.value
                          )
                        }
                      />
                      <input
                        placeholder="Očekivani izlaz"
                        value={el.izlaz}
                        onChange={(e) =>
                          updateElement(
                            oblastIndex,
                            elementIndex,
                            "izlaz",
                            e.target.value
                          )
                        }
                      />
                    </>
                  )}

                  {el.tip === "quiz" && (
                    <>
                      <input
                        placeholder="Pitanje"
                        value={el.pitanje}
                        onChange={(e) =>
                          updateElement(
                            oblastIndex,
                            elementIndex,
                            "pitanje",
                            e.target.value
                          )
                        }
                      />
                      <input placeholder="Odgovor A" onChange={(e) => updateElement(oblastIndex, elementIndex, "a", e.target.value)} />
                      <input placeholder="Odgovor B" onChange={(e) => updateElement(oblastIndex, elementIndex, "b", e.target.value)} />
                      <input placeholder="Odgovor C" onChange={(e) => updateElement(oblastIndex, elementIndex, "c", e.target.value)} />
                      <input placeholder="Odgovor D" onChange={(e) => updateElement(oblastIndex, elementIndex, "d", e.target.value)} />
                      <select
                        value={el.tacan}
                        onChange={(e) =>
                          updateElement(
                            oblastIndex,
                            elementIndex,
                            "tacan",
                            e.target.value
                          )
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
                </div>
              ))}
            </section>
          ))}

          <button type="button" className="add-area-btn" onClick={dodajOblast}>
            + Dodaj novu oblast
          </button>

          <section className="lesson-card">
            <h3>Mini provjere</h3>

            {miniProvjere.map((p, index) => (
              <div className="content-card" key={p.id}>
                <div className="content-card-header">
                  <strong>Pitanje {index + 1}</strong>
                  <button
                    type="button"
                    onClick={() =>
                      setMiniProvjere(miniProvjere.filter((_, i) => i !== index))
                    }
                  >
                    Obriši
                  </button>
                </div>

                <input
                  placeholder="Pitanje"
                  value={p.pitanje}
                  onChange={(e) => {
                    const kopija = [...miniProvjere];
                    kopija[index].pitanje = e.target.value;
                    setMiniProvjere(kopija);
                  }}
                />

                <input placeholder="Odgovor A" value={p.a} onChange={(e) => {
                  const kopija = [...miniProvjere];
                  kopija[index].a = e.target.value;
                  setMiniProvjere(kopija);
                }} />

                <input placeholder="Odgovor B" value={p.b} onChange={(e) => {
                  const kopija = [...miniProvjere];
                  kopija[index].b = e.target.value;
                  setMiniProvjere(kopija);
                }} />

                <input placeholder="Odgovor C" value={p.c} onChange={(e) => {
                  const kopija = [...miniProvjere];
                  kopija[index].c = e.target.value;
                  setMiniProvjere(kopija);
                }} />

                <input placeholder="Odgovor D" value={p.d} onChange={(e) => {
                  const kopija = [...miniProvjere];
                  kopija[index].d = e.target.value;
                  setMiniProvjere(kopija);
                }} />

                <select
                  value={p.tacan}
                  onChange={(e) => {
                    const kopija = [...miniProvjere];
                    kopija[index].tacan = e.target.value;
                    setMiniProvjere(kopija);
                  }}
                >
                  <option value="">Tačan odgovor</option>
                  <option value="0">A</option>
                  <option value="1">B</option>
                  <option value="2">C</option>
                  <option value="3">D</option>
                </select>
              </div>
            ))}

            <button
              type="button"
              className="add-mini-btn"
              onClick={() =>
                setMiniProvjere([
                  ...miniProvjere,
                  noviElement("quiz"),
                ])
              }
            >
              + Dodaj pitanje
            </button>
          </section>

          <div className="lesson-form-actions">
            <button className="filter-btn" onClick={sacuvajLekciju}>
              Sačuvaj
            </button>
            <button
              className="filter-btn"
              onClick={() => navigate("/admin?tab=lessons")}
            >
              Odustani
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LessonForm;