import { useState } from "react";
import "./ProcjenaModal.css";
import { CheckCircle2, XCircle, ChevronRight, X, BookOpen, AlertTriangle } from "lucide-react";

import uvod from "../lessons/uvod";
import promjenljive from "../lessons/promjenljive";
import uslovi from "../lessons/uslovi";
import petlje from "../lessons/petlje";
import liste from "../lessons/liste";
import stringovi from "../lessons/stringovi";
import funkcije from "../lessons/funkcije";
import skupoviTuple from "../lessons/skupovi_tuple";
import rjecnici from "../lessons/rjecnici";
import moduli from "../lessons/moduli";
import greske from "../lessons/greske";

const LESSON_DATA = {
  1: uvod, 2: promjenljive, 3: uslovi, 4: petlje, 5: liste,
  6: stringovi, 7: funkcije, 8: skupoviTuple, 9: rjecnici, 10: moduli, 11: greske,
};

const MAX_QUIZ = 2;
const MAX_CODE = 1;

const PAIRS = { "(": ")", "[": "]", "{": "}", '"': '"', "'": "'" };
const CLOSING = new Set([")", "]", "}", '"', "'"]);

function editorKeyDown(e) {
  const el = e.target;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const code = el.value;

  if (CLOSING.has(e.key) && start === end && code[start] === e.key) {
    if (e.key !== '"' && e.key !== "'") {
      e.preventDefault();
      el.selectionStart = start + 1;
      el.selectionEnd = start + 1;
      return;
    }
    if (code[start - 1] === e.key) {
      e.preventDefault();
      el.selectionStart = start + 1;
      el.selectionEnd = start + 1;
      return;
    }
  }

  if (PAIRS[e.key]) {
    e.preventDefault();
    if (start !== end) {
      const selected = code.substring(start, end);
      el.value = code.substring(0, start) + e.key + selected + PAIRS[e.key] + code.substring(end);
      el.selectionStart = start + 1;
      el.selectionEnd = end + 1;
    } else {
      el.value = code.substring(0, start) + e.key + PAIRS[e.key] + code.substring(end);
      el.selectionStart = start + 1;
      el.selectionEnd = start + 1;
    }
    return;
  }

  if (e.key === "Backspace" && start === end && start > 0) {
    const prev = code[start - 1];
    const next = code[start];
    if (prev in PAIRS && PAIRS[prev] === next) {
      e.preventDefault();
      el.value = code.substring(0, start - 1) + code.substring(start + 1);
      el.selectionStart = start - 1;
      el.selectionEnd = start - 1;
      return;
    }
    if (code.substring(start - 4, start) === "    ") {
      e.preventDefault();
      el.value = code.substring(0, start - 4) + code.substring(end);
      el.selectionStart = start - 4;
      el.selectionEnd = start - 4;
      return;
    }
  }

  if (e.key === "Tab") {
    e.preventDefault();
    el.value = code.substring(0, start) + "    " + code.substring(end);
    el.selectionStart = start + 4;
    el.selectionEnd = start + 4;
    return;
  }
}

function normalizeCode(code) {
  return code.replaceAll(" ", "").replaceAll("\n", "").replaceAll("\t", "").replaceAll("'", '"').toLowerCase();
}

function ProcjenaModal({ lekcije, korisnikId, token, lsPrefix, onClose, onZavrseno, onPreporuka }) {
  const [korak, setKorak] = useState(0);
  const [odabraneLekcije, setOdabraneLekcije] = useState(new Set());
  const [quizAnswers, setQuizAnswers] = useState({});
  const [codeInputs, setCodeInputs] = useState({});
  const [codeResults, setCodeResults] = useState({});
  const [saving, setSaving] = useState(false);

  const idjiNaPreporuku = () => {
    setKorak("preporuka");
  };

  const testStavke = () => {
    return [...odabraneLekcije]
      .sort((a, b) => a - b)
      .map((red) => {
        const ld = LESSON_DATA[red];
        if (!ld) return null;
        const lekInfo = lekcije.find((l) => l.redoslijed === red);
        const naziv = lekInfo?.naziv || `Lekcija ${red}`;
        const items = [
          ...(ld.questions || []).slice(0, MAX_QUIZ).map((q, qi) => ({ type: "quiz", q, qi, red })),
          ...(ld.codingTasks || []).slice(0, MAX_CODE).map((t, ti) => ({ type: "coding", t, ti, red })),
        ];
        return items.length ? { red, naziv, items, lekId: lekInfo?.id } : null;
      })
      .filter(Boolean);
  };

  const toggleLekcija = (red) => {
    setOdabraneLekcije((prev) => {
      const next = new Set(prev);
      next.has(red) ? next.delete(red) : next.add(red);
      return next;
    });
  };

  const handleQuizAnswer = (red, qi, ai) => {
    const key = `${red}-${qi}`;
    if (quizAnswers[key] !== undefined) return;
    setQuizAnswers((prev) => ({ ...prev, [key]: ai }));
  };

  const handleCodeCheck = (red, ti, task) => {
    const key = `${red}-${ti}`;
    const code = codeInputs[key] || "";
    const ok = task.check(normalizeCode(code));
    setCodeResults((prev) => ({ ...prev, [key]: ok ? "correct" : "wrong" }));
  };

  const sveOdgovoreno = () => {
    for (const lek of testStavke()) {
      for (const item of lek.items) {
        const key = `${item.red}-${item.type === "quiz" ? item.qi : item.ti}`;
        if (item.type === "quiz" && quizAnswers[key] === undefined) return false;
        if (item.type === "coding" && !codeResults[key]) return false;
      }
    }
    return true;
  };

  const zavrsiTest = async () => {
    setSaving(true);
    const stavke = testStavke();
    const rez = {};

    for (const lek of stavke) {
      let sveTacno = true;
      for (const item of lek.items) {
        const key = `${item.red}-${item.type === "quiz" ? item.qi : item.ti}`;
        const tacno = item.type === "quiz"
          ? quizAnswers[key] === item.q.correct
          : codeResults[key] === "correct";
        if (!tacno) sveTacno = false;
      }
      rez[lek.red] = sveTacno;

      if (sveTacno && korisnikId && lek.lekId) {
        await Promise.all([
          fetch("http://localhost:8000/progres/", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ korisnik_id: korisnikId }),
          }).catch(() => {}),
          fetch("http://localhost:8000/zavrsena_lekcija/", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ lekcija_id: lek.lekId, korisnik_id: korisnikId }),
          }).catch(() => {}),
        ]);
      }
    }

    try { localStorage.setItem(`${lsPrefix}_procjena_done`, "true"); } catch {}
    setSaving(false);
    onZavrseno?.(rez);
  };

  // Test
  if (korak === 4) {
    const stavke = testStavke();
    const sve = sveOdgovoreno();
    return (
      <div className="procjena-overlay">
        <div className="procjena-modal procjena-modal-wide procjena-modal-scroll">
          <button className="procjena-close" onClick={onClose}><X size={20} /></button>
          <div className="procjena-header">
            <h2>Mini test</h2>
            <p>Greške se ne bilježe — odgovori iskreno.</p>
          </div>

          {stavke.map((lek) => (
            <div key={lek.red} className="procjena-lek-sekcija">
              <h3 className="procjena-lek-naziv"><BookOpen size={16} /> {lek.naziv}</h3>
              {lek.items.map((item, idx) => {
                if (item.type === "quiz") {
                  const key = `${item.red}-${item.qi}`;
                  const answered = quizAnswers[key] !== undefined;
                  const correct = quizAnswers[key] === item.q.correct;
                  return (
                    <div key={idx} className={`procjena-quiz-card ${answered ? (correct ? "p-correct" : "p-wrong") : ""}`}>
                      <p className="procjena-question">{item.q.question}</p>
                      <div className="procjena-answers">
                        {item.q.answers.map((ans, ai) => {
                          let cls = "procjena-answer-btn";
                          if (answered) {
                            if (ai === item.q.correct) cls += " correct";
                            else if (ai === quizAnswers[key]) cls += " selected-wrong";
                          }
                          return (
                            <button key={ai} className={cls} disabled={answered}
                              onClick={() => handleQuizAnswer(item.red, item.qi, ai)}>
                              {ans}
                            </button>
                          );
                        })}
                      </div>
                      {answered && (
                        <p className={`procjena-feedback ${correct ? "correct" : "wrong"}`}>
                          {correct ? "✓ Tačno!" : `✗ Tačan odgovor: ${item.q.answers[item.q.correct]}`}
                        </p>
                      )}
                    </div>
                  );
                }
                // coding
                const key = `${item.red}-${item.ti}`;
                const result = codeResults[key];
                return (
                  <div key={idx} className={`procjena-code-card ${result ? (result === "correct" ? "p-correct" : "p-wrong") : ""}`}>
                    <p className="procjena-task-title">{item.t.title}</p>
                    <p className="procjena-task-desc" style={{ whiteSpace: "pre-wrap" }}>{item.t.description}</p>
                    <textarea
                      className="procjena-code-input"
                      value={codeInputs[key] || ""}
                      onChange={(e) => setCodeInputs((prev) => ({ ...prev, [key]: e.target.value }))}
                      onKeyDown={editorKeyDown}
                      placeholder="Upiši rješenje..."
                      disabled={!!result}
                    />
                    {!result && (
                      <button className="procjena-check-btn" onClick={() => handleCodeCheck(item.red, item.ti, item.t)}>
                        Provjeri
                      </button>
                    )}
                    {result && (
                      <p className={`procjena-feedback ${result === "correct" ? "correct" : "wrong"}`}>
                        {result === "correct" ? "✓ Tačno!" : "✗ Nije tačno."}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          <div className="procjena-footer">
            <button className="procjena-start-btn" disabled={!sve || saving} onClick={zavrsiTest}>
              {saving ? "Čuvam rezultate..." : "Završi test"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Odabir lekcija (korak 3)
  if (korak === 3) {
    return (
      <div className="procjena-overlay">
        <div className="procjena-modal procjena-modal-wide">
          <button className="procjena-close" onClick={onClose}><X size={20} /></button>
          <div className="procjena-header">
            <h2>Odaberi oblasti koje poznaješ</h2>
            <p>Odaberi lekcije za koje misliš da ih znaš — testiraćemo te kratkim kvizom.</p>
          </div>
          <div className="procjena-lekcije-grid">
            {lekcije
              .filter((l) => !!LESSON_DATA[l.redoslijed])
              .sort((a, b) => a.redoslijed - b.redoslijed)
              .map((l) => (
                <button
                  key={l.id}
                  className={`procjena-lekcija-btn ${odabraneLekcije.has(l.redoslijed) ? "odabrana" : ""}`}
                  onClick={() => toggleLekcija(l.redoslijed)}
                >
                  <BookOpen size={15} />
                  {l.naziv}
                  {odabraneLekcije.has(l.redoslijed) && <CheckCircle2 size={15} className="p-check-icon" />}
                </button>
              ))}
          </div>
          <div className="procjena-footer">
            {odabraneLekcije.size === 0 && (
              <p className="procjena-hint">Odaberi barem jednu oblast da nastaviš.</p>
            )}
            <button
              className="procjena-start-btn"
              disabled={odabraneLekcije.size === 0}
              onClick={() => setKorak(4)}
            >
              Počni test ({odabraneLekcije.size} oblast{odabraneLekcije.size === 1 ? "" : "i"}) <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pitanje 3
  if (korak === 2) {
    return (
      <div className="procjena-overlay">
        <div className="procjena-modal">
          <button className="procjena-close" onClick={onClose}><X size={20} /></button>
          <div className="procjena-header">
            <h2>Brza procjena nivoa</h2>
            <div className="procjena-stepper"><span className="p-step done" /><span className="p-step done" /><span className="p-step active" /></div>
          </div>
          <div className="procjena-pitanje">
            <h3>Da li ste upoznati sa nekim oblastima u Pythonu?</h3>
            <div className="procjena-btnovi">
              <button className="procjena-btn-da" onClick={() => setKorak(3)}>
                Da — odaberi oblasti <ChevronRight size={16} />
              </button>
              <button className="procjena-btn-ne" onClick={idjiNaPreporuku}>
                Ne — kreni od početka <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Preporuka korak
  if (korak === "preporuka") {
    return (
      <div className="procjena-overlay">
        <div className="procjena-modal">
          <div className="procjena-header">
            <h2>Naša preporuka</h2>
          </div>
          <div className="procjena-pitanje">
            <p style={{ fontSize: "15px", color: "#374151", lineHeight: "1.6" }}>
              Preporučujemo da prođeš kroz kurs <strong>od lekcije 1</strong>. Gradivo se gradi
              postepeno i svaka lekcija priprema tebe za sljedeću — biće mnogo lakše!
            </p>
          </div>
          <div className="procjena-footer" style={{ alignItems: "stretch" }}>
            <button className="procjena-start-btn" style={{ justifyContent: "center" }} onClick={onPreporuka}>
              Razumijem, krećem od početka
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pitanje 2
  if (korak === 1) {
    return (
      <div className="procjena-overlay">
        <div className="procjena-modal">
          <button className="procjena-close" onClick={onClose}><X size={20} /></button>
          <div className="procjena-header">
            <h2>Brza procjena nivoa</h2>
            <div className="procjena-stepper"><span className="p-step done" /><span className="p-step active" /><span className="p-step" /></div>
          </div>
          <div className="procjena-pitanje">
            <h3>Da li ste programirali u nekom drugom jeziku?</h3>
            <div className="procjena-btnovi">
              <button className="procjena-btn-da" onClick={() => setKorak(2)}>
                Da <ChevronRight size={16} />
              </button>
              <button className="procjena-btn-ne" onClick={idjiNaPreporuku}>
                Ne — kreni od početka <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pitanje 1 (korak 0)
  return (
    <div className="procjena-overlay">
      <div className="procjena-modal">
        <button className="procjena-close" onClick={onClose}><X size={20} /></button>
        <div className="procjena-header">
          <h2>Brza procjena nivoa</h2>
          <p>3–5 minuta · Greške se ne uzimaju za zlo</p>
          <div className="procjena-stepper"><span className="p-step active" /><span className="p-step" /><span className="p-step" /></div>
        </div>
        <div className="procjena-pitanje">
          <h3>Da li ste ikada koristili programski jezik Python?</h3>
          <div className="procjena-btnovi">
            <button className="procjena-btn-da" onClick={() => setKorak(3)}>
              Da — preskočio bih osnove <ChevronRight size={16} />
            </button>
            <button className="procjena-btn-ne" onClick={() => setKorak(1)}>
              Ne — nisam koristio Python <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProcjenaModal;
