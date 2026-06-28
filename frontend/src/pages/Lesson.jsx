import "./Lesson.css";
import { useState, useRef, useEffect } from "react";

function getUsername() {
  const token = localStorage.getItem("token");
  if (!token) return "guest";
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub || "guest";
  } catch {
    return "guest";
  }
}

function getKorisnikId() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.korisnik_id || null;
  } catch {
    return null;
  }
}

async function fetchKorisnikId(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const username = payload.sub;
    const res = await fetch(`http://localhost:8000/korisnik/pretraga/username?username=${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data.id;
  } catch {
    return null;
  }
}
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Code2,
  Terminal,
  HelpCircle,
  Trophy,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import uvod from "../lessons/uvod";
import petlje from "../lessons/petlje";
import promjenljive from "../lessons/promjenljive";
import liste from "../lessons/liste";
import stringovi from "../lessons/stringovi";
import uslovi from "../lessons/uslovi";
import funkcije from "../lessons/funkcije";
import rjecnici from "../lessons/rjecnici";
import skupoviTuple from "../lessons/skupovi_tuple";
import moduli from "../lessons/moduli";
import greske from "../lessons/greske";

const lessonsByRedoslijed = { 1: uvod, 2: promjenljive, 3: uslovi, 4: petlje, 5: liste, 6: stringovi, 7: funkcije, 8: skupoviTuple, 9: rjecnici, 10: moduli, 11: greske };

const PAIRS = { "(": ")", "[": "]", "{": "}", '"': '"', "'": "'" };
const CLOSING = new Set([")", "]", "}", '"', "'"]);

function editorKeyDown(e) {
  const el = e.target;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const code = el.value;

  // Skip over existing closing bracket instead of inserting a new one
  if (CLOSING.has(e.key) && start === end && code[start] === e.key) {
    // For quotes: only skip if the char right before is NOT already the same quote
    // (prevents skipping when you're opening a new string)
    if (e.key !== '"' && e.key !== "'") {
      e.preventDefault();
      el.selectionStart = start + 1;
      el.selectionEnd = start + 1;
      return;
    }
    // For quotes: skip if the immediately preceding non-space char opened a pair
    if (code[start - 1] === e.key) {
      e.preventDefault();
      el.selectionStart = start + 1;
      el.selectionEnd = start + 1;
      return;
    }
  }

  // Auto-close opening bracket / quote
  if (PAIRS[e.key]) {
    e.preventDefault();
    if (start !== end) {
      // Wrap selected text in brackets
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

  // Backspace: delete both brackets if cursor is between a pair
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
    // Delete 4-space indent block
    if (code.substring(start - 4, start) === "    ") {
      e.preventDefault();
      el.value = code.substring(0, start - 4) + code.substring(end);
      el.selectionStart = start - 4;
      el.selectionEnd = start - 4;
      return;
    }
  }

  // Tab: insert 4 spaces
  if (e.key === "Tab") {
    e.preventDefault();
    el.value = code.substring(0, start) + "    " + code.substring(end);
    el.selectionStart = start + 4;
    el.selectionEnd = start + 4;
    return;
  }

  // Enter: auto-indent + extra indent after ':'
  if (e.key === "Enter") {
    e.preventDefault();
    const currentLine = code.substring(0, start).split("\n").pop();
    const indent = currentLine.match(/^(\s*)/)[1];
    const extraIndent = currentLine.trimEnd().endsWith(":") ? "    " : "";
    if (code[start - 1] === "{" && code[start] === "}") {
      el.value = code.substring(0, start) + "\n" + indent + "    " + "\n" + indent + code.substring(end);
      const newPos = start + 1 + indent.length + 4;
      el.selectionStart = newPos;
      el.selectionEnd = newPos;
    } else {
      el.value = code.substring(0, start) + "\n" + indent + extraIndent + code.substring(end);
      const newPos = start + 1 + indent.length + extraIndent.length;
      el.selectionStart = newPos;
      el.selectionEnd = newPos;
    }
  }
}

function Lesson() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const lsPrefix = getUsername();

  const [redoslijed, setRedoslijed] = useState(null);
  const [dbLekcija, setDbLekcija] = useState(null);
  const [nextLessonId, setNextLessonId] = useState(null);
  const [prevLessonId, setPrevLessonId] = useState(null);
  const [maxRedoslijed, setMaxRedoslijed] = useState(null);
  const hardkodiranaLekcija = lessonsByRedoslijed[redoslijed];


let parsedSadrzaj = {
  oblasti: [],
  miniProvjere: [],
};

try {
  const parsed = dbLekcija?.sadrzaj ? JSON.parse(dbLekcija.sadrzaj) : null;

  if (Array.isArray(parsed)) {
    parsedSadrzaj = {
      oblasti: parsed,
      miniProvjere: [],
    };
  } else if (parsed) {
    parsedSadrzaj = {
      oblasti: parsed.oblasti || [],
      miniProvjere: parsed.miniProvjere || [],
    };
  }
} catch {
  parsedSadrzaj = {
    oblasti: [],
    miniProvjere: [],
  };
}

const adminTheoryBlocks = parsedSadrzaj.oblasti.map((oblast, index) => ({
  title: oblast.naziv || `Oblast ${index + 1}`,
  elementi: oblast.elementi || [],
}));

const adminQuestions = parsedSadrzaj.miniProvjere.map((p, index) => ({
  redoslijed: index + 1,
  question: p.pitanje || "",
  answers: [p.a, p.b, p.c, p.d].filter(Boolean),
  correct: Number(p.tacan),
}));

const lesson = hardkodiranaLekcija || (dbLekcija
  ? {
      badge: `Lekcija ${dbLekcija.redoslijed}`,
      title: dbLekcija.naziv,
      description: dbLekcija.opis || "",
      heroClass: "variables-hero",
      duration: dbLekcija.trajanje || "30 min",
      level: dbLekcija.nivo || "Početnik",

      goals: dbLekcija.ciljevi
        ? dbLekcija.ciljevi.split("\n").map((cilj, index) => ({
            tekst: cilj,
            blockIndex: index,
          }))
        : [],

      theoryBlocks: adminTheoryBlocks,
      questions: adminQuestions,
      codingTasks: [],
    }
  : null);


  const [activeTab, setActiveTab] = useState("lessons");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [adminSelectedAnswers, setAdminSelectedAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [taskCodes, setTaskCodes] = useState({});
  const [taskResults, setTaskResults] = useState({});
  const [taskOutputs, setTaskOutputs] = useState({});
  const [shownSolutions, setShownSolutions] = useState({});
  const [vjezbaKodovi, setVjezbaKodovi] = useState({});
  const [vjezbaRezultati, setVjezbaRezultati] = useState({});
  const [zadaciMapa, setZadaciMapa] = useState({});
  const [zadaciIzBaze, setZadaciIzBaze] = useState([]);
  const [uradjeniZadaci, setUradjeniZadaci] = useState(new Set());
  const [greskaRedoslijed, setGreskaRedoslijed] = useState(null);
  const [greskaIspravljena, setGreskaIspravljena] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [lessonAlreadyFinished, setLessonAlreadyFinished] = useState(false);

  // Praćenje grešaka unutar ove lekcije (za obaveznu "Ponovi greške" / kontrolnu provjeru)
  const [pogresnoUradjeni, setPogresnoUradjeni] = useState(new Set());
  const [showGreskeModal, setShowGreskeModal] = useState(false);
  const [greskeSnapshot, setGreskeSnapshot] = useState([]);
  // Greške iz prethodne lekcije (učitane za kontrolnu provjeru na parnim lekcijama)
  const [prevMistakeKeys, setPrevMistakeKeys] = useState([]);
  // Stanje odgovora unutar modala kontrolne provjere (ključ = jedinstveni id stavke)
  const [cpAnswers, setCpAnswers] = useState({});
  const [cpCodeResults, setCpCodeResults] = useState({});
  const [cpCodeOutputs, setCpCodeOutputs] = useState({});
  const [cpCodes, setCpCodes] = useState({}); // upisani kod u modalu (da preživi refresh)
  const cpCodeRefs = useRef({});

  const textareaRefs = useRef({});
  const cursorPos = useRef(null);
  const mainRef = useRef(null);

  useEffect(() => {
    setFinished(false);
    setLessonAlreadyFinished(false);
    const savedMax = parseInt(localStorage.getItem(`${lsPrefix}_lesson_progress_${id}`)) || 0;
    setMaxStep(savedMax);
    setCurrentStep(0);
    setTaskOutputs({});
    setVjezbaKodovi({});
    // Vrati zapamćene odgovore na mini pitanja (da poslije refresha stoje zaključani — i tačni i netačni)
    let savedQuiz = {};
    try {
      savedQuiz = JSON.parse(localStorage.getItem(`${lsPrefix}_lesson_quiz_${id}`)) || {};
    } catch {
      savedQuiz = {};
    }
    setSelectedAnswers(savedQuiz);
    // Vrati zapamćene kod zadatke (kod + rezultat) da poslije refresha ostanu kao mini provjere
    let savedKod = {};
    let savedKodRes = {};
    try {
      savedKod = JSON.parse(localStorage.getItem(`${lsPrefix}_lesson_kod_${id}`)) || {};
    } catch {
      savedKod = {};
    }
    try {
      savedKodRes = JSON.parse(localStorage.getItem(`${lsPrefix}_lesson_kodres_${id}`)) || {};
    } catch {
      savedKodRes = {};
    }
    setTaskCodes(savedKod);
    setTaskResults(savedKodRes);
    // Vrati zapamćene rezultate vježbi (da štrik/uzvičnik gore preživi refresh)
    let savedVjezbe = {};
    try {
      savedVjezbe = JSON.parse(localStorage.getItem(`${lsPrefix}_lesson_vjezbe_${id}`)) || {};
    } catch {
      savedVjezbe = {};
    }
    setVjezbaRezultati(savedVjezbe);
    // Pogrešne vježbe i pogrešni kod zadaci odmah ubaci u greške (da se pojave u prozoru i poslije refresha)
    const seedGreske = new Set();
    Object.entries(savedVjezbe).forEach(([bi, res]) => {
      if (res === "wrong") seedGreske.add(`vjezba-${bi}`);
    });
    Object.entries(savedKodRes).forEach(([ti, res]) => {
      if (res === "wrong") seedGreske.add(`code-${ti}`);
    });
    setPogresnoUradjeni(seedGreske);
    setShowGreskeModal(false);
    setGreskeSnapshot([]);
    setPrevMistakeKeys([]);
    setCpCodeOutputs({});
    cpCodeRefs.current = {};
    // Vrati zapamćeno stanje modala kontrolne provjere (odgovori, rezultati, upisani kod)
    let savedCpAns = {};
    let savedCpRes = {};
    let savedCpKod = {};
    try { savedCpAns = JSON.parse(localStorage.getItem(`${lsPrefix}_lesson_cp_ans_${id}`)) || {}; } catch { savedCpAns = {}; }
    try { savedCpRes = JSON.parse(localStorage.getItem(`${lsPrefix}_lesson_cp_res_${id}`)) || {}; } catch { savedCpRes = {}; }
    try { savedCpKod = JSON.parse(localStorage.getItem(`${lsPrefix}_lesson_cp_kod_${id}`)) || {}; } catch { savedCpKod = {}; }
    setCpAnswers(savedCpAns);
    setCpCodeResults(savedCpRes);
    setCpCodes(savedCpKod);

    const token = localStorage.getItem("token");

    fetch(`http://localhost:8000/lekcije/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : null)
      .then((lekcija) => {
        if (lekcija) {
          setDbLekcija(lekcija);
          setRedoslijed(lekcija.redoslijed);

          fetch(`http://localhost:8000/lekcije/`, {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((r) => r.ok ? r.json() : [])
            .then((sve) => {
              const sledeca = sve.find((l) => l.redoslijed === lekcija.redoslijed + 1);
              if (sledeca) setNextLessonId(sledeca.id);
              const prethodna = sve.find((l) => l.redoslijed === lekcija.redoslijed - 1);
              setPrevLessonId(prethodna ? prethodna.id : null);
              if (Array.isArray(sve) && sve.length > 0) {
                setMaxRedoslijed(Math.max(...sve.map((l) => l.redoslijed)));
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => {});

    fetch(`http://localhost:8000/zadaci/po-lekciji/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : [])
      .then((zadaci) => {
        setZadaciIzBaze(zadaci);

        const mapa = {};
        zadaci.forEach((z) => {
          if (z.redoslijed) mapa[z.redoslijed] = z.id;
        });
        setZadaciMapa(mapa);
      })
      .catch(() => {});

    fetchKorisnikId(token).then((korisnikId) => {
      if (!korisnikId) return;

      fetch(`http://localhost:8000/zadatak_korisnik/tacni/po-korisnik/${korisnikId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.ok ? res.json() : [])
        .then((data) => {
          setUradjeniZadaci(new Set(data.map((zk) => zk.zadatak_id)));
        })
        .catch(() => {});

      fetch(`http://localhost:8000/zavrsena_lekcija/po-korisnik-id/${korisnikId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.ok ? res.json() : [])
        .then((data) => {
          if (Array.isArray(data) && data.some((zl) => zl.lekcija_id === parseInt(id))) {
            setFinished(true);
            setLessonAlreadyFinished(true);
          }
        })
        .catch(() => {});
    });
  }, [id]);

  useEffect(() => {
    if (lessonAlreadyFinished && lesson) {
      const totalSteps = 1
        + (lesson.theoryBlocks?.length || 0)
        + 1
        + (lesson.codingTasks?.length > 0 ? 1 : 0)
        + 1;
      setMaxStep(totalSteps - 1);
      setFinished(true);
    }
  }, [lessonAlreadyFinished, lesson]);

  useEffect(() => {
    const gotoStep = location.state?.gotoStep;
    if (!lesson || !gotoStep) return;
    const theoryCount = lesson.theoryBlocks?.length || 0;
    const hasQuiz = (lesson.questions?.length || 0) > 0;
    const hasCoding = (lesson.codingTasks?.length || 0) > 0;
    let targetIndex = null;
    if (gotoStep === "quiz" && hasQuiz) {
      targetIndex = 1 + theoryCount;
      // Resetuj pogrešne odgovore da korisnik može popraviti
      setSelectedAnswers((prev) => {
        const fixed = { ...prev };
        lesson.questions.forEach((q, i) => {
          if (fixed[i] !== undefined && fixed[i] !== q.correct) delete fixed[i];
        });
        try { localStorage.setItem(`${lsPrefix}_lesson_quiz_${id}`, JSON.stringify(fixed)); } catch {}
        return fixed;
      });
    }
    if (gotoStep === "coding" && hasCoding) targetIndex = 1 + theoryCount + (hasQuiz ? 1 : 0);
    if (targetIndex !== null) {
      setCurrentStep(targetIndex);
      setMaxStep((prev) => Math.max(prev, targetIndex));

      const red = location.state?.zadatakRedoslijed;
      if (red != null) {
        setGreskaRedoslijed(red);
        setTimeout(() => {
          const el = document.getElementById(`zadatak-${red}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            el.classList.add("zadatak-highlight");
            setTimeout(() => el.classList.remove("zadatak-highlight"), 2500);
          }
        }, 400);
      }
    }
  }, [lesson, location.state]);

  // Checkpoint = svake 2 lekcije (parne) ILI zadnja lekcija u kursu
  // Checkpoint (kontrolna provjera prethodne lekcije) je samo na parnim lekcijama (parovi 1-2, 3-4, ...).
  // Zadnja lekcija stoji sama — prikazuje samo svoje greške, bez povlačenja prethodne.
  const jeCheckpointLekcija = redoslijed != null && redoslijed % 2 === 0;

  // Na checkpoint lekcijama učitaj greške iz prethodne lekcije za kontrolnu provjeru
  useEffect(() => {
    if (!jeCheckpointLekcija) {
      setPrevMistakeKeys([]);
      return;
    }
    try {
      const raw = localStorage.getItem(`${lsPrefix}_lesson_mistakes_${redoslijed - 1}`);
      setPrevMistakeKeys(raw ? JSON.parse(raw) : []);
    } catch {
      setPrevMistakeKeys([]);
    }
  }, [redoslijed, jeCheckpointLekcija]);

  // Poslije refresha vraćeni netačni odgovori na mini pitanja moraju opet u greške
  // (da se pojave u prozoru na kraju lekcije, kao da nije bilo refresha).
  useEffect(() => {
    if (!lesson || !lesson.questions || lesson.questions.length === 0) return;
    setPogresnoUradjeni((prev) => {
      let changed = false;
      const next = new Set(prev);
      lesson.questions.forEach((q, qi) => {
        const key = `quiz-${qi}`;
        if (selectedAnswers[qi] !== undefined && selectedAnswers[qi] !== q.correct && !next.has(key)) {
          next.add(key);
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [redoslijed, selectedAnswers]);

  // Stalno zapisuj sve greške ove lekcije (ne samo na klik "Završi"), da checkpoint
  // sljedeće lekcije uvijek povuče KOMPLETAN spisak — i ako pređeš dalje bez završetka.
  useEffect(() => {
    if (!redoslijed || finished) return;
    try {
      localStorage.setItem(`${lsPrefix}_lesson_mistakes_${redoslijed}`, JSON.stringify([...pogresnoUradjeni]));
    } catch {
      /* ignore */
    }
  }, [redoslijed, pogresnoUradjeni, finished]);

  const upisiZadatakKorisnik = async (redoslijed, tacno, tipGreske = null) => {
    const zadatakId = zadaciMapa[redoslijed];
    if (!zadatakId) return;
    const token = localStorage.getItem("token");
    const korisnikId = await fetchKorisnikId(token);
    if (!korisnikId) return;
    const body = { zadatak_id: zadatakId, korisnik_id: korisnikId, tacno };
    if (tipGreske) body.tip_greske = tipGreske;
    fetch("http://localhost:8000/zadatak_korisnik/", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    }).catch(() => {});
    if (tacno) {
      setUradjeniZadaci((prev) => new Set([...prev, zadatakId]));
    }
  };

  const obrisiNetacniZadatak = async (redoslijed) => {
    const zadatakId = zadaciMapa[redoslijed];
    if (!zadatakId) return;
    const token = localStorage.getItem("token");
    const korisnikId = await fetchKorisnikId(token);
    if (!korisnikId) return;
    fetch(`http://localhost:8000/zadatak_korisnik/netacni/${korisnikId}/${zadatakId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  };

  const greskaIspravljenaPovratak = (redoslijed) => {
    obrisiNetacniZadatak(redoslijed);
    setGreskaRedoslijed(null);
    setGreskaIspravljena(true);
    setTimeout(() => navigate("/?tab=errors"), 1500);
  };

  useEffect(() => {
    if (cursorPos.current !== null) {
      const { index, pos } = cursorPos.current;
      const el = textareaRefs.current[index];
      if (el) {
        el.selectionStart = pos;
        el.selectionEnd = pos;
      }
      cursorPos.current = null;
    }
  });

  const handleAnswer = (questionIndex, answerIndex) => {
    // Zaključano poslije prvog odgovora — prvi pokušaj je prava provjera, bez pogađanja.
    if (selectedAnswers[questionIndex] !== undefined) return;
    const tacno = answerIndex === lesson.questions[questionIndex].correct;
    setSelectedAnswers((prev) => {
      const next = { ...prev, [questionIndex]: answerIndex };
      try { localStorage.setItem(`${lsPrefix}_lesson_quiz_${id}`, JSON.stringify(next)); } catch {}
      return next;
    });
    if (!tacno) {
      setPogresnoUradjeni((prev) => new Set(prev).add(`quiz-${questionIndex}`));
    }
    const qRed = lesson.questions[questionIndex].redoslijed;
    upisiZadatakKorisnik(qRed, tacno);
    if (tacno && greskaRedoslijed === qRed) {
      greskaIspravljenaPovratak(qRed);
    }
  };

  const normalizeCode = (code) => {
    return code
      .replaceAll(" ", "")
      .replaceAll("\n", "")
      .replaceAll("\t", "")
      .replaceAll("'", '"')
      .toLowerCase();
  };

  // Osnovna provjera sintakse: zagrade i navodnici moraju biti uravnoteženi.
  // Hvata slučaj kad student makne zagradu ili navodnik, a tekst i dalje "sadrži"
  // tražene riječi pa bi inače pogrešno prošlo kao tačno.
  const osnovnaSintaksaOk = (raw) => {
    if (!raw || !raw.trim()) return false;
    const parovi = { ")": "(", "]": "[", "}": "{" };
    const otvoreni = ["(", "[", "{"];
    const stack = [];
    let uString = null; // navodnik unutar kojeg smo (" ili '), ili null
    for (const ch of raw) {
      if (uString) {
        if (ch === uString) uString = null;
        continue;
      }
      if (ch === '"' || ch === "'") {
        uString = ch;
      } else if (otvoreni.includes(ch)) {
        stack.push(ch);
      } else if (parovi[ch]) {
        if (stack.pop() !== parovi[ch]) return false;
      }
    }
    return stack.length === 0 && uString === null;
  };

  // Zapamti kod zadatke (kod + rezultat) da poslije refresha ostane kao što je bilo — kao mini provjere
  const sacuvajKodStanje = (codes, results) => {
    try { localStorage.setItem(`${lsPrefix}_lesson_kod_${id}`, JSON.stringify(codes)); } catch { /* ignore */ }
    try { localStorage.setItem(`${lsPrefix}_lesson_kodres_${id}`, JSON.stringify(results)); } catch { /* ignore */ }
  };

  const checkTaskCode = (taskIndex) => {
    const task = lesson.codingTasks[taskIndex];
    const userCode = textareaRefs.current[taskIndex]?.value || "";
    const normalizedCode = normalizeCode(userCode);
    const isCorrect = osnovnaSintaksaOk(userCode) && task.check(normalizedCode);
    const nextResults = { ...taskResults, [taskIndex]: isCorrect ? "correct" : "wrong" };
    const nextCodes = { ...taskCodes, [taskIndex]: userCode };
    setTaskResults(nextResults);
    setTaskCodes(nextCodes);
    sacuvajKodStanje(nextCodes, nextResults);
    setPogresnoUradjeni((prev) => {
      const next = new Set(prev);
      if (isCorrect) next.delete(`code-${taskIndex}`); // ispravljeno → makni iz grešaka
      else next.add(`code-${taskIndex}`);
      return next;
    });
    if (isCorrect) {
      upisiZadatakKorisnik(task.redoslijed, true);
      if (greskaRedoslijed === task.redoslijed) {
        obrisiNetacniZadatak(task.redoslijed);
        setGreskaRedoslijed(null);
      }
    }
  };

  const runTaskCode = async (taskIndex) => {
    const task = lesson.codingTasks[taskIndex];
    const userCode = textareaRefs.current[taskIndex]?.value || "";
    const normalizedCode = normalizeCode(userCode);
    const token = localStorage.getItem("token");

    if (!userCode.trim()) {
      setTaskOutputs({ ...taskOutputs, [taskIndex]: ">>> Predaj kod\nGreška: prvo upiši kod." });
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/kod/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ kod: userCode }),
      });
      const data = await res.json();

      if (data.greska) {
        setTaskOutputs({ ...taskOutputs, [taskIndex]: `>>> Predaj kod\n${data.greska.tip}: ${data.greska.poruka}` });
        const nextResults = { ...taskResults, [taskIndex]: "wrong" };
        const nextCodes = { ...taskCodes, [taskIndex]: userCode };
        setTaskResults(nextResults);
        setTaskCodes(nextCodes);
        sacuvajKodStanje(nextCodes, nextResults);
        setPogresnoUradjeni((prev) => new Set(prev).add(`code-${taskIndex}`));
        upisiZadatakKorisnik(task.redoslijed, false, data.greska.tip);
      } else {
        const output = data.output || "";
        setTaskOutputs({ ...taskOutputs, [taskIndex]: `>>> Predaj kod\n${output}` });

        const isCorrect = osnovnaSintaksaOk(userCode) && task.check(normalizedCode);
        const nextResults = { ...taskResults, [taskIndex]: isCorrect ? "correct" : "wrong" };
        const nextCodes = { ...taskCodes, [taskIndex]: userCode };
        setTaskResults(nextResults);
        setTaskCodes(nextCodes);
        sacuvajKodStanje(nextCodes, nextResults);
        setPogresnoUradjeni((prev) => {
          const next = new Set(prev);
          if (isCorrect) next.delete(`code-${taskIndex}`); // ispravljeno → makni iz grešaka
          else next.add(`code-${taskIndex}`);
          return next;
        });
        if (isCorrect) {
          upisiZadatakKorisnik(task.redoslijed, true);
          if (greskaRedoslijed === task.redoslijed) {
            greskaIspravljenaPovratak(task.redoslijed);
          }
        }
      }
    } catch {
      setTaskOutputs({ ...taskOutputs, [taskIndex]: ">>> Greška pri povezivanju sa serverom." });
    }
  };

  const checkVjezbu = (blockIndex) => {
    const block = lesson.theoryBlocks[blockIndex];
    const code = vjezbaKodovi[blockIndex] !== undefined ? vjezbaKodovi[blockIndex] : (block.vjezbaSintakse.initialCode || "");
    const normalized = normalizeCode(code);
    const isCorrect = osnovnaSintaksaOk(code) && block.vjezbaSintakse.check(normalized);
    setVjezbaRezultati((prev) => {
      const next = { ...prev, [blockIndex]: isCorrect ? "correct" : "wrong" };
      // Zapamti rezultate vježbi da preživi refresh (zeleni štrik / žuti uzvičnik gore)
      try {
        localStorage.setItem(`${lsPrefix}_lesson_vjezbe_${id}`, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
    // Pogrešna vježba ide u greške na kraju; ispravljena se makne
    setPogresnoUradjeni((prev) => {
      const ns = new Set(prev);
      if (isCorrect) ns.delete(`vjezba-${blockIndex}`);
      else ns.add(`vjezba-${blockIndex}`);
      return ns;
    });
  };

  // Zapamti stanje modala kontrolne provjere da preživi refresh
  const sacuvajCp = (kljuc, vrijednost) => {
    try { localStorage.setItem(`${lsPrefix}_lesson_cp_${kljuc}_${id}`, JSON.stringify(vrijednost)); } catch { /* ignore */ }
  };

  // --- Kontrolna provjera (modal): odgovor na kviz stavku ---
  const cpAnswerQuiz = (itemId, question, answerIndex) => {
    if (cpAnswers[itemId] === question.correct) return; // već riješeno
    setCpAnswers((prev) => {
      const next = { ...prev, [itemId]: answerIndex };
      sacuvajCp("ans", next);
      return next;
    });
    if (answerIndex === question.correct && question.redoslijed) {
      upisiZadatakKorisnik(question.redoslijed, true);
    }
  };

  // --- Kontrolna provjera (modal): provjera koda stavke ---
  const cpCheckCode = (itemId, task) => {
    const userCode = cpCodeRefs.current[itemId]?.value || "";
    const isCorrect = osnovnaSintaksaOk(userCode) && task.check(normalizeCode(userCode));
    setCpCodeResults((prev) => {
      const next = { ...prev, [itemId]: isCorrect ? "correct" : "wrong" };
      sacuvajCp("res", next);
      return next;
    });
    setCpCodes((prev) => {
      const next = { ...prev, [itemId]: userCode };
      sacuvajCp("kod", next);
      return next;
    });
    if (isCorrect && task.redoslijed) {
      upisiZadatakKorisnik(task.redoslijed, true);
    }
  };

  // --- Kontrolna provjera (modal): pokreni kod stavke (stvarno izvršavanje na serveru) ---
  const cpRunCode = async (itemId, task) => {
    const userCode = cpCodeRefs.current[itemId]?.value || "";
    const token = localStorage.getItem("token");

    if (!userCode.trim()) {
      setCpCodeOutputs((prev) => ({ ...prev, [itemId]: ">>> Pokreni kod\nGreška: prvo upiši kod." }));
      return;
    }

    setCpCodes((prev) => {
      const next = { ...prev, [itemId]: userCode };
      sacuvajCp("kod", next);
      return next;
    });

    try {
      const res = await fetch("http://localhost:8000/kod/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ kod: userCode }),
      });
      const data = await res.json();

      if (data.greska) {
        setCpCodeOutputs((prev) => ({ ...prev, [itemId]: `>>> Pokreni kod\n${data.greska.tip}: ${data.greska.poruka}` }));
        setCpCodeResults((prev) => {
          const next = { ...prev, [itemId]: "wrong" };
          sacuvajCp("res", next);
          return next;
        });
        if (task.redoslijed) upisiZadatakKorisnik(task.redoslijed, false, data.greska.tip);
      } else {
        const output = data.output || "";
        setCpCodeOutputs((prev) => ({ ...prev, [itemId]: `>>> Pokreni kod\n${output}` }));
        const isCorrect = task.check(normalizeCode(userCode));
        setCpCodeResults((prev) => {
          const next = { ...prev, [itemId]: isCorrect ? "correct" : "wrong" };
          sacuvajCp("res", next);
          return next;
        });
        if (isCorrect && task.redoslijed) upisiZadatakKorisnik(task.redoslijed, true);
      }
    } catch {
      setCpCodeOutputs((prev) => ({ ...prev, [itemId]: ">>> Greška pri povezivanju sa serverom." }));
    }
  };

  // Stvarno označavanje lekcije kao završene (poziva se tek kad nema neispravljenih grešaka)
  const zavrsiLekciju = async () => {
    const token = localStorage.getItem("token");
    const korisnikId = await fetchKorisnikId(token);
    if (!korisnikId) return;

    await fetch("http://localhost:8000/progres/", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ korisnik_id: korisnikId }),
    });

    await fetch("http://localhost:8000/zavrsena_lekcija/", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ lekcija_id: parseInt(id), korisnik_id: korisnikId }),
    });

    // Na checkpointu (parna lekcija) ispravljene su i greške prethodne lekcije iz para,
    // pa se i ona označava kao završena (npr. kad završiš lekciju 6, gotova je i lekcija 5).
    if (jeCheckpointLekcija && prevLessonId) {
      await fetch("http://localhost:8000/zavrsena_lekcija/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ lekcija_id: prevLessonId, korisnik_id: korisnikId }),
      });
    }

    // Lekcija je završena tek kad su SVE greške riješene (prozor ne dozvoljava drugačije),
    // pa očisti zapamćene greške da se ne ponavljaju na sljedećem checkpointu.
    if (redoslijed) {
      try {
        localStorage.setItem(`${lsPrefix}_lesson_mistakes_${redoslijed}`, JSON.stringify([]));
        // Na checkpointu (parna lekcija) riješene su i greške prethodne lekcije
        if (jeCheckpointLekcija) {
          localStorage.setItem(`${lsPrefix}_lesson_mistakes_${redoslijed - 1}`, JSON.stringify([]));
        }
      } catch {
        /* ignore */
      }
    }

    setFinished(true);
    setShowGreskeModal(false);
  };

  if (!lesson) {
    return <p>Učitavanje lekcije...</p>;
  }

  // Pitanje je već tačno riješeno (iz baze) ako je u uradjeniZadaci i nije ponovo odgovoreno u ovoj sesiji
  const pitanjeVecTacno = (q, index) =>
    selectedAnswers[index] === undefined && uradjeniZadaci.has(zadaciMapa[q.redoslijed]);

  const correctCount = lesson.questions.filter(
    (q, index) => selectedAnswers[index] === q.correct || pitanjeVecTacno(q, index)
  ).length;

  // "Odgovoreno" = odgovoreno u ovoj sesiji ILI već tačno u bazi (zelena kvačica)
  const answeredCount = lesson.questions.filter(
    (q, index) => selectedAnswers[index] !== undefined || uradjeniZadaci.has(zadaciMapa[q.redoslijed])
  ).length;
  const canFinishQuiz = answeredCount === lesson.questions.length;

  const codingTasksCount = lesson.codingTasks.length;
  const correctCodingTasksCount = Object.values(taskResults).filter(
    (result) => result === "correct"
  ).length;

  const hasCodingTasks = codingTasksCount > 0;
  // Varijanta B: dovoljno je predati (pokušati) sve zadatke; ispravka ide kroz "Ponovi greške" modal
  // Zadatak je "predat" ako je pokušan u ovoj sesiji ILI već tačno riješen u bazi
  const attemptedCodingTasksCount = lesson.codingTasks.filter(
    (t, i) =>
      taskResults[i] === "correct" ||
      taskResults[i] === "wrong" ||
      uradjeniZadaci.has(zadaciMapa[t.redoslijed])
  ).length;
  const canFinishCodingTasks =
    !hasCodingTasks || attemptedCodingTasksCount === codingTasksCount;

  const canCompleteLesson = canFinishQuiz && canFinishCodingTasks;

  if (!lesson) return <p>Učitavanje lekcije...</p>;

  // Build steps
  const steps = [
    { type: "goals", label: "Uvod" },
    ...lesson.theoryBlocks.map((b, i) => ({
      type: "theory",
      index: i,
      label: b.title,
    })),
    ...(lesson.questions.length > 0
      ? [{ type: "quiz", label: "Mini provjere" }]
      : []),
    ...(hasCodingTasks ? [{ type: "coding", label: "Kod zadaci" }] : []),
    { type: "finish", label: "Završi" },
  ];

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  // Da li je korak POTPUNO tačan (za zeleni štrik); u suprotnom ide žuto "Dovrši"
  const stepImaGresku = (s) => {
    if (s.type === "theory") return vjezbaRezultati[s.index] === "wrong";
    if (s.type === "quiz") {
      return lesson.questions.some(
        (q, i) => selectedAnswers[i] !== undefined && selectedAnswers[i] !== q.correct && !pitanjeVecTacno(q, i)
      );
    }
    if (s.type === "coding") return lesson.codingTasks.some((t, i) => taskResults[i] === "wrong");
    return false;
  };

  const stepPotpunoTacan = (s) => {
    if (finished) return true; // lekcija završena → sve zeleno
    if (s.type === "goals") return true;
    if (s.type === "finish") return finished;
    if (s.type === "theory") {
      const b = lesson.theoryBlocks[s.index];
      if (!b.vjezbaSintakse) return true;
      return vjezbaRezultati[s.index] === "correct";
    }
    if (s.type === "quiz") {
      return (
        lesson.questions.length > 0 &&
        lesson.questions.every(
          (q, i) => selectedAnswers[i] === q.correct || pitanjeVecTacno(q, i)
        )
      );
    }
    if (s.type === "coding") {
      return lesson.codingTasks.every(
        (t, i) =>
          taskResults[i] === "correct" ||
          (taskResults[i] !== "wrong" && uradjeniZadaci.has(zadaciMapa[t.redoslijed]))
      );
    }
    return true;
  };

  const canProceed = (() => {
    if (lessonAlreadyFinished) return true;
    if (currentStep < maxStep) return true;
    if (step.type === "goals") return true;
    if (step.type === "theory") {
      const block = lesson.theoryBlocks[step.index];
      if (!block.vjezbaSintakse) return true;
      return vjezbaRezultati[step.index] !== undefined; // dovoljno je pokušati (Varijanta B)
    }
    if (step.type === "quiz") return canFinishQuiz;
    if (step.type === "coding") return canFinishCodingTasks;
    return true;
  })();

  const goToStep = (i) => {
    if (i > maxStep) return;
    setCurrentStep(i);
    if (mainRef.current) mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nextStep = () => {
    if (isLastStep) return;
    const next = currentStep + 1;
    setCurrentStep(next);
    setMaxStep((m) => {
      const newMax = Math.max(m, next);
      localStorage.setItem(`${lsPrefix}_lesson_progress_${id}`, newMax);
      return newMax;
    });
    if (mainRef.current) mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="page-bg">
      <div className="dashboard-shell">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="dashboard-main lesson-main" ref={mainRef}>
          <Topbar />

          <button className="back-btn" onClick={() => navigate("/")}>
            <ArrowLeft size={18} /> Nazad na lekcije
          </button>

          {greskaIspravljena && (
            <div className="greska-ispravljena-banner">
              <CheckCircle2 size={20} /> Greška ispravljena! Vraćam te na listu grešaka...
            </div>
          )}

          <section className={`lesson-hero ${lesson.heroClass}`}>
            <div>
              <span className="lesson-pill">Lekcija {redoslijed}</span>
              <h1>{lesson.title}</h1>
              <p>{lesson.description}</p>

              <div className="lesson-meta">
                <span>Trajanje: {lesson.duration}</span>
                <span>Nivo: {lesson.level}</span>
                <span>
                  Mini provjere: {
                    lesson.questions.length +
                    zadaciIzBaze.filter((z) => z.tip === "quiz" && z.naziv && z.opis).length
                  }
                </span>
                {hasCodingTasks && <span>Kod zadaci: {codingTasksCount}</span>}
              </div>
            </div>

            <div className="lesson-score-card">
              <span>Rezultat</span>
              <h2>
                {correctCount}/{lesson.questions.length}
              </h2>

              <div className="lesson-progress-track">
                <div
                  className="lesson-progress-fill"
                  style={{
                    width: `${(answeredCount / lesson.questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </section>

          {/* Step navigation */}
          <nav className="lesson-steps-nav">
            {steps.map((s, i) => {
              let stanje;
              if (i === currentStep) stanje = "active";
              else if (i > maxStep) stanje = "locked";
              else if (stepPotpunoTacan(s)) stanje = "done";
              else if (stepImaGresku(s)) stanje = "warn";
              else stanje = "visited";

              return (
                <button
                  key={i}
                  className={`step-pill step-${stanje}`}
                  onClick={() => goToStep(i)}
                  disabled={i > maxStep}
                  title={s.label}
                >
                  {stanje === "done" ? (
                    <CheckCircle2 size={13} />
                  ) : stanje === "warn" ? (
                    <AlertTriangle size={13} />
                  ) : (
                    <span className="step-num">{i + 1}</span>
                  )}
                  <span className="step-label">{s.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Step content */}
          {step.type === "goals" && (
            <section className="lesson-panel step-content" style={{ marginBottom: "24px" }}>
              <h2>Šta učiš?</h2>
              <div className="goal-list">
                {lesson.goals.map((goal, index) => (
                  <div className="goal-item" key={index}>
                    <CheckCircle2 size={19} />
                    <span>{goal.tekst}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {step.type === "theory" && (
  <div className="theory-flow step-content">
    {(() => {
      const block = lesson.theoryBlocks[step.index];
      const blockIndex = step.index;

      return (
        <div className="theory-block lesson-panel">
          <div className="panel-title-row">
            <h2>{block.title}</h2>
            <Code2 size={22} />
          </div>

          {block.elementi ? (
            block.elementi.map((el, i) => (
              <div key={el.id || i} className="admin-content-block">
                  {el.tip === "teorija" && (
                    <>
                      {el.naslov && <h3>{el.naslov}</h3>}
                      <p>{el.tekst}</p>
                    </>
                  )}

                  {el.tip === "kod" && (
                    <>
                      <pre className="mini-code">{el.kod}</pre>

                      {el.objasnjenje && (
                        <div className="code-objasnjenje">
                          {(Array.isArray(el.objasnjenje)
                            ? el.objasnjenje
                            : (el.objasnjenje || "").split("\n")
                          )
                            .filter((red) => red.trim() !== "")
                            .map((red, i) => (
                              <div className="code-objasnjenje-red" key={i}>
                                <span className="code-objasnjenje-broj">{i + 1}</span>
                                <span>{red}</span>
                              </div>
                            ))}
                        </div>
                      )}
                    </>
                  )}

                  {el.tip === "vjezba" && (
                    <div className="vjezba-sintakse">
                      <h4>Vježba sintakse</h4>
                      <p>{el.tekst}</p>

                      <textarea
                        className="code-input"
                        placeholder="Ovdje upiši kod..."
                        value={vjezbaKodovi[el.id] || ""}
                        onChange={(e) =>
                          setVjezbaKodovi((prev) => ({
                            ...prev,
                            [el.id]: e.target.value,
                          }))
                        }
                        onKeyDown={editorKeyDown}
                      />

                      <div className="code-actions">
                        <button
                          className="check-code-btn"
                          onClick={() => {
                            const unos = (vjezbaKodovi[el.id] || "").trim();
                            const tacno = (el.rjesenje || "").trim();

                            setVjezbaRezultati((prev) => ({
                              ...prev,
                              [el.id]: unos === tacno ? "correct" : "wrong",
                            }));
                          }}
                        >
                          Provjeri
                        </button>
                      </div>

                      {vjezbaRezultati[el.id] === "correct" && (
                        <div className="code-result correct-result">
                          ✅ Tačno!
                        </div>
                      )}

                      {vjezbaRezultati[el.id] === "wrong" && (
                        <div className="code-result wrong-result">
                          Nije tačno.
                          {el.rjesenje && (
                            <> Treba ti: <strong>{el.rjesenje}</strong></>
                          )}
                        </div>
)}
                    </div>
                  )}

                  {el.tip === "quiz" && (
                    <article className="quiz-card">
                      <h3>{el.pitanje}</h3>

                      <div className="answer-list">
                        {[el.a, el.b, el.c, el.d].map((odg, index) => {
                          if (!odg) return null;

                          const key = el.id;
                          const selected = adminSelectedAnswers[key];
                          const isSelected = selected === index;
                          const isCorrect = Number(el.tacan) === index;

                          let buttonClass = "answer-btn";
                          if (selected !== undefined && isSelected && isCorrect) {
                            buttonClass += " correct";
                          }
                          if (selected !== undefined && isSelected && !isCorrect) {
                            buttonClass += " wrong";
                          }

                          return (
                            <button
                              key={index}
                              className={buttonClass}
                              onClick={() =>
                                setAdminSelectedAnswers({
                                  ...adminSelectedAnswers,
                                  [key]: index,
                                })
                              }
                            >
                              {odg}
                            </button>
                          );
                        })}
                      </div>

                      {adminSelectedAnswers[el.id] !== undefined && (
                        <p className="answer-feedback">
                          {adminSelectedAnswers[el.id] === Number(el.tacan)
                            ? "Tačno!"
                            : "Nije tačno. Pokušaj ponovo."}
                        </p>
                      )}
                    </article>
                  )}
                </div>
              ))
            ) : (
              <>
                <p>{block.text}</p>
                <pre className="mini-code">{block.code}</pre>

                {block.codeObjasnjenje && (
                  <div className="code-objasnjenje">
                    {block.codeObjasnjenje.map((linija, i) => (
                      <div key={i} className="code-objasnjenje-red">
                        <span className="code-objasnjenje-broj">{i + 1}</span>
                        <span>{linija}</span>
                      </div>
                    ))}
                  </div>
                )}

                {block.vjezbaSintakse && (
                  <div className="vjezba-sintakse">
                    <h4>Vježba sintakse</h4>
                    <p>{block.vjezbaSintakse.uputstvo}</p>

                    <textarea
                      className="code-input"
                      placeholder={block.vjezbaSintakse.placeholder}
                      value={
                        vjezbaKodovi[blockIndex] !== undefined
                          ? vjezbaKodovi[blockIndex]
                          : block.vjezbaSintakse.initialCode || ""
                      }
                      onChange={(e) => {
                        setVjezbaKodovi((prev) => ({
                          ...prev,
                          [blockIndex]: e.target.value,
                        }));
                      }}
                      onKeyDown={editorKeyDown}
                    />

                    <div className="code-actions">
                      <button
                        className="check-code-btn"
                        onClick={() => checkVjezbu(blockIndex)}
                      >
                        Provjeri
                      </button>
                    </div>

                    {vjezbaRezultati[blockIndex] === "correct" && (
                      <div className="code-result correct-result">
                        Tačno! Sintaksa je ispravna.
                      </div>
                    )}

                    {vjezbaRezultati[blockIndex] === "wrong" && (
                      <div className="code-result wrong-result">
                        Nije tačno. {block.vjezbaSintakse.hint}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        );
      })()}
    </div>
  )}

          {step.type === "quiz" && (
            <section className="quiz-section step-content">
              <div className="quiz-header">
                <HelpCircle size={26} />
                <div>
                  <h2>Mini provjere</h2>
                  <p>Odgovori na pitanja da provjeriš da li si razumio lekciju.</p>
                </div>
              </div>

              <div className="quiz-list">
                {lesson.questions.map((item, questionIndex) => {
                  const jeGreskaTask = greskaRedoslijed === item.redoslijed;
                  const quizDone = selectedAnswers[questionIndex] === item.correct || (uradjeniZadaci.has(zadaciMapa[item.redoslijed]) && selectedAnswers[questionIndex] === undefined);
                  const quizPrikazanKaoDone = quizDone && !jeGreskaTask;
                  return (
                  <article id={`zadatak-${item.redoslijed}`} className={`quiz-card ${quizPrikazanKaoDone ? "quiz-card-done" : ""}`} key={questionIndex}>
                    <h3>
                      {quizPrikazanKaoDone && <CheckCircle2 size={18} style={{ color: "#23a455", marginRight: "8px", display: "inline" }} />}
                      Pitanje {questionIndex + 1}: {item.question}
                    </h3>

                    <div className="answer-list">
                      {item.answers.map((answer, answerIndex) => {
                        const isSelected = selectedAnswers[questionIndex] === answerIndex;
                        const isCorrect = item.correct === answerIndex;
                        const isAnswered = selectedAnswers[questionIndex] !== undefined;
                        const isLocked = isAnswered;

                        let buttonClass = "answer-btn";
                        if (isAnswered && isSelected && isCorrect) buttonClass += " correct";
                        if (isAnswered && isSelected && !isCorrect) buttonClass += " wrong";
                        // Otkrij tačan odgovor kad je student pogriješio.
                        if (isAnswered && !isSelected && isCorrect) buttonClass += " correct-reveal";

                        return (
                          <button
                            key={answerIndex}
                            className={buttonClass}
                            disabled={isLocked}
                            onClick={() => handleAnswer(questionIndex, answerIndex)}
                          >
                            {answer}
                          </button>
                        );
                      })}
                    </div>

                    {selectedAnswers[questionIndex] !== undefined && (
                      <p className="answer-feedback">
                        {selectedAnswers[questionIndex] === item.correct
                          ? "Tačno!"
                          : `Nije tačno. Tačan odgovor: ${item.answers[item.correct]}. Ponovićeš ga na kraju lekcije.`}
                      </p>
                    )}
                  </article>
                  );
                })}
              </div>
            </section>
          )}

          {step.type === "coding" && hasCodingTasks && (
            <section className="final-task lesson-panel step-content">
              <div className="panel-title-row">
                <div>
                  <h2>Zadaci za pisanje koda</h2>
                  <p>
                    Upiši svoje rješenje ispod svakog zadatka. Klikni
                    <b> Provjeri kod</b> da vidiš da li je tačno ili
                    <b> Predaj kod</b> da dobiješ izlaz kao u konzoli.
                  </p>
                </div>
                <Terminal size={26} />
              </div>

              <div className="coding-task-list">
                {lesson.codingTasks.map((task, taskIndex) => {
                  const jeGreskaTask = greskaRedoslijed === task.redoslijed;
                  const taskDone = taskResults[taskIndex] === "correct" || (uradjeniZadaci.has(zadaciMapa[task.redoslijed]) && taskResults[taskIndex] !== "wrong");
                  const taskPrikazanKaoDone = taskDone && !jeGreskaTask;
                  return (
                  <div id={`zadatak-${task.redoslijed}`} className={`code-checker-box ${taskPrikazanKaoDone ? "code-checker-done" : ""}`} key={taskIndex}>
                    <h3>
                      {taskPrikazanKaoDone && <CheckCircle2 size={18} style={{ color: "#23a455", marginRight: "8px", display: "inline" }} />}
                      {task.title}
                    </h3>
                    <p style={{ whiteSpace: "pre-wrap" }}>{task.description}</p>

                    <textarea
                      className="code-input"
                      key={`code-${taskIndex}-${taskCodes[taskIndex] !== undefined ? "saved" : "empty"}`}
                      ref={(el) => (textareaRefs.current[taskIndex] = el)}
                      defaultValue={taskCodes[taskIndex] || ""}
                      onKeyDown={editorKeyDown}
                      placeholder="Ovdje upiši svoje rješenje..."
                    />

                    <div className="code-actions">
                      <button
                        className="check-code-btn"
                        onClick={() => checkTaskCode(taskIndex)}
                      >
                        Provjeri kod
                      </button>

                      <button
                        className="run-code-btn"
                        onClick={() => runTaskCode(taskIndex)}
                      >
                        Predaj kod
                      </button>
                    </div>

                    {taskResults[taskIndex] === "correct" && (
                      <div className="code-result correct-result">
                        Tačno! Ovaj zadatak je urađen kako treba.
                      </div>
                    )}

                    {taskResults[taskIndex] === "wrong" && (
                      <div className="code-result wrong-result">
                        Netačan kod, pokušaj ponovo. Pogledaj poruku u konzoli ispod.
                      </div>
                    )}

                    {taskOutputs[taskIndex] && (
                      <div className="output-box">
                        <p>Konzola:</p>
                        <pre>{taskOutputs[taskIndex]}</pre>
                      </div>
                    )}

                    <button
                      className="show-solution-btn"
                      onClick={() =>
                        setShownSolutions({
                          ...shownSolutions,
                          [taskIndex]: !shownSolutions[taskIndex],
                        })
                      }
                    >
                      {shownSolutions[taskIndex]
                        ? "Sakrij rješenje"
                        : "Prikaži rješenje"}
                    </button>

                    {shownSolutions[taskIndex] && (
                      <div className="solution-box">
                        <p>Jedno moguće rješenje:</p>
                        <pre className="mini-code">{task.solution}</pre>

                        <p>Izlaz programa:</p>
                        <pre className="mini-code">{task.expectedOutput}</pre>
                      </div>
                    )}
                  </div>
                  );
                })}

                {zadaciIzBaze
                  .filter((z) => z.tip === "prakticni" && z.naziv && z.opis)
                  .map((z) => (
                    <div className="code-checker-box" key={`admin-kod-${z.id}`}>
                      <h3>{z.naziv}</h3>
                      <p>{z.opis}</p>

                      <textarea
                        id={`admin-code-${z.id}`}
                        className="code-input"
                        placeholder="Ovdje upiši svoje rješenje..."
                      />

                      <div className="code-actions">
                        <button
                          className="check-code-btn"
                          onClick={() => {
                            const kod = document.getElementById(`admin-code-${z.id}`).value;

                            setTaskResults({
                              ...taskResults,
                              [`admin-${z.id}`]:
                                kod.trim() === z.rjesenje?.trim()
                                  ? "correct"
                                  : "wrong",
                            });
                          }}
                        >
                          Provjeri kod
                        </button>

                        <button
                          className="run-code-btn"
                          onClick={async () => {
                            const kod = document.getElementById(`admin-code-${z.id}`).value;
                            const token = localStorage.getItem("token");

                            const res = await fetch("http://localhost:8000/kod/execute", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                              },
                              body: JSON.stringify({ kod }),
                            });

                            const data = await res.json();

                            setTaskOutputs({
                              ...taskOutputs,
                              [`admin-${z.id}`]:
                                data.greska
                                  ? `${data.greska.tip}: ${data.greska.poruka}`
                                  : data.output || "Nema izlaza.",
                            });
                          }}
                        >
                          Pokreni kod
                        </button>
                      </div>

                      {taskResults[`admin-${z.id}`] === "correct" && (
                        <div className="code-result correct-result">
                          Tačno! Ovaj zadatak je urađen kako treba.
                        </div>
                      )}

                      {taskResults[`admin-${z.id}`] === "wrong" && (
                        <div className="code-result wrong-result">
                          Netačan kod, pokušaj ponovo.
                        </div>
                      )}

                      {taskOutputs[`admin-${z.id}`] && (
                        <div className="output-box">
                          <p>Konzola:</p>
                          <pre>{taskOutputs[`admin-${z.id}`]}</pre>
                        </div>
                      )}

                      <button
                        className="show-solution-btn"
                        onClick={() =>
                          setShownSolutions({
                            ...shownSolutions,
                            [`admin-${z.id}`]:
                              !shownSolutions[`admin-${z.id}`],
                          })
                        }
                      >
                        {shownSolutions[`admin-${z.id}`]
                          ? "Sakrij rješenje"
                          : "Prikaži rješenje"}
                      </button>

                      {shownSolutions[`admin-${z.id}`] && (
                        <div className="solution-box">
                          <p>Jedno moguće rješenje:</p>
                          <pre className="mini-code">{z.rjesenje}</pre>

                          <p>Izlaz programa:</p>
                          <pre className="mini-code">{z.ocekivani_izlaz}</pre>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {step.type === "finish" && (
            <section className="final-task lesson-panel step-content">
              <div className="panel-title-row">
                <div>
                  <h2>Završi lekciju</h2>
                  <p>
                    Lekciju možeš završiti kada odgovoriš na sva pitanja
                    {hasCodingTasks && " i predaš sve zadatke za kod"}. Ako si negdje pogriješio, prvo
                    moraš ispraviti sve greške
                    {jeCheckpointLekcija && " (uključujući kontrolnu provjeru iz prethodne lekcije)"}
                    {" "}— tek tada se lekcija označava kao završena.
                  </p>
                </div>
                <Trophy size={26} />
              </div>

              <button
                className={finished ? "done-btn completed" : "done-btn"}
                disabled={!canCompleteLesson || finished}
                onClick={async () => {
                  const snapshot = [...pogresnoUradjeni];
                  // Zapamti greške ove lekcije za buduću kontrolnu provjeru (svake 2 lekcije)
                  if (redoslijed) {
                    localStorage.setItem(
                      `${lsPrefix}_lesson_mistakes_${redoslijed}`,
                      JSON.stringify(snapshot)
                    );
                  }

                  const imaKontrolnu = jeCheckpointLekcija && prevMistakeKeys.length > 0;

                  if (snapshot.length === 0 && !imaKontrolnu) {
                    // Nema grešaka — odmah završi
                    await zavrsiLekciju();
                  } else {
                    // Ima grešaka / kontrolna provjera — obavezno ispraviti prije završetka
                    setGreskeSnapshot(snapshot);
                    setShowGreskeModal(true);
                  }
                }}
              >
                {finished
                  ? "Lekcija završena"
                  : !canFinishQuiz
                  ? "Odgovori na mini provjere"
                  : hasCodingTasks && !canFinishCodingTasks
                  ? "Predaj sve kod zadatke"
                  : "Označi kao završeno"}
              </button>

              {finished && (
                <>
                  <div className="success-box">
                    <Trophy size={22} />
                    <span>
                      Završio si lekciju. Mini provjere: {correctCount}/
                      {lesson.questions.length}
                      {hasCodingTasks &&
                        `, kod zadaci: ${correctCodingTasksCount}/${codingTasksCount}`}
                    </span>
                  </div>
                  {nextLessonId && (
                    <button className="next-lesson-btn" onClick={() => navigate(`/lekcije/${nextLessonId}`)}>
                      Sljedeća lekcija →
                    </button>
                  )}
                </>
              )}
            </section>
          )}

          {/* Next step button */}
          {!isLastStep && (
            <div className="step-nav-row">
              {!canProceed && (
                <span className="step-nav-hint">
                  {step.type === "theory" && "Klikni Provjeri na vježbi da nastaviš."}
                  {step.type === "quiz" && "Odgovori na sva pitanja da nastaviš."}
                  {step.type === "coding" && "Predaj sve kod zadatke da nastaviš."}
                </span>
              )}
              <button className="next-step-btn" onClick={nextStep} disabled={!canProceed}>
                Nastavi <ChevronRight size={18} />
              </button>
            </div>
          )}

          {showGreskeModal && (() => {
            const jeKontrolna = jeCheckpointLekcija;
            const prevLekcija = jeKontrolna ? lessonsByRedoslijed[redoslijed - 1] : null;

            // Objedinjena lista stavki: prvo greške prethodne lekcije (na parnim/checkpoint), pa greške ove lekcije
            // — redom kojim se gradivo učilo (npr. 5 pa 6), kao na pravim kursevima.
            const stavke = [];
            if (jeKontrolna && prevLekcija) {
              prevMistakeKeys.forEach((k) => {
                if (k.startsWith("quiz-")) {
                  const idx = parseInt(k.slice(5));
                  if (prevLekcija.questions?.[idx])
                    stavke.push({ id: `pq-${idx}`, kind: "quiz", q: prevLekcija.questions[idx], lek: redoslijed - 1 });
                } else if (k.startsWith("code-")) {
                  const idx = parseInt(k.slice(5));
                  if (prevLekcija.codingTasks?.[idx])
                    stavke.push({ id: `pc-${idx}`, kind: "code", t: prevLekcija.codingTasks[idx], lek: redoslijed - 1, runnable: true });
                } else if (k.startsWith("vjezba-")) {
                  const idx = parseInt(k.slice(7));
                  const b = prevLekcija.theoryBlocks?.[idx];
                  if (b && b.vjezbaSintakse)
                    stavke.push({
                      id: `pv-${idx}`,
                      kind: "code",
                      t: { title: b.title, description: b.vjezbaSintakse.uputstvo, check: b.vjezbaSintakse.check },
                      lek: redoslijed - 1,
                      initial: b.vjezbaSintakse.initialCode || "",
                      runnable: false,
                    });
                }
              });
            }
            greskeSnapshot.forEach((k) => {
              if (k.startsWith("quiz-")) {
                const idx = parseInt(k.slice(5));
                if (lesson.questions[idx])
                  stavke.push({ id: `tq-${idx}`, kind: "quiz", q: lesson.questions[idx], lek: redoslijed });
              } else if (k.startsWith("code-")) {
                const idx = parseInt(k.slice(5));
                if (lesson.codingTasks[idx])
                  stavke.push({ id: `tc-${idx}`, kind: "code", t: lesson.codingTasks[idx], lek: redoslijed, runnable: true });
              } else if (k.startsWith("vjezba-")) {
                const idx = parseInt(k.slice(7));
                const b = lesson.theoryBlocks[idx];
                if (b && b.vjezbaSintakse)
                  stavke.push({
                    id: `tv-${idx}`,
                    kind: "code",
                    t: { title: b.title, description: b.vjezbaSintakse.uputstvo, check: b.vjezbaSintakse.check },
                    lek: redoslijed,
                    initial: b.vjezbaSintakse.initialCode || "",
                    runnable: false,
                  });
              }
            });

            const jeRijesena = (it) =>
              it.kind === "quiz"
                ? cpAnswers[it.id] === it.q.correct
                : cpCodeResults[it.id] === "correct";

            const brojRijesenih = stavke.filter(jeRijesena).length;
            const sveRijeseno = stavke.length > 0 && brojRijesenih === stavke.length;

            return (
              <div className="greske-modal-overlay">
                <div className="greske-modal-box" onClick={(e) => e.stopPropagation()}>
                  <div className="greske-modal-head">
                    <div>
                      <h2>{jeKontrolna ? "Kontrolna provjera" : "Ponovi greške"}</h2>
                      <p>
                        {jeKontrolna
                          ? `Ovo su greške iz lekcija ${redoslijed - 1} i ${redoslijed}. Moraš ih sve riješiti tačno da bi nastavio.`
                          : "Ova pitanja si pogriješio u ovoj lekciji. Riješi ih tačno da bi završio lekciju."}
                      </p>
                    </div>
                    <span className="greske-modal-count">{brojRijesenih}/{stavke.length}</span>
                  </div>

                  <div className="greske-modal-body">
                    {stavke.map((it) => {
                      const rijeseno = jeRijesena(it);
                      if (it.kind === "quiz") {
                        const item = it.q;
                        return (
                          <article className={`quiz-card ${rijeseno ? "quiz-card-done" : ""}`} key={it.id}>
                            <h3>
                              {rijeseno && <CheckCircle2 size={18} style={{ color: "#23a455", marginRight: "8px", display: "inline" }} />}
                              <span className="greske-modal-tag">Lekcija {it.lek}</span> {item.question}
                            </h3>
                            <div className="answer-list">
                              {item.answers.map((answer, answerIndex) => {
                                const isSelected = cpAnswers[it.id] === answerIndex;
                                const isCorrect = item.correct === answerIndex;
                                const isLocked = cpAnswers[it.id] === item.correct;
                                let buttonClass = "answer-btn";
                                if (isSelected && isCorrect) buttonClass += " correct";
                                if (isSelected && !isCorrect) buttonClass += " wrong";
                                return (
                                  <button
                                    key={answerIndex}
                                    className={buttonClass}
                                    disabled={isLocked}
                                    onClick={() => cpAnswerQuiz(it.id, item, answerIndex)}
                                  >
                                    {answer}
                                  </button>
                                );
                              })}
                            </div>
                            {cpAnswers[it.id] !== undefined && (
                              <p className="answer-feedback">
                                {cpAnswers[it.id] === item.correct ? "Tačno!" : "Nije tačno. Pokušaj ponovo."}
                              </p>
                            )}
                          </article>
                        );
                      }
                      const task = it.t;
                      return (
                        <div className={`code-checker-box ${rijeseno ? "code-checker-done" : ""}`} key={it.id}>
                          <h3>
                            {rijeseno && <CheckCircle2 size={18} style={{ color: "#23a455", marginRight: "8px", display: "inline" }} />}
                            <span className="greske-modal-tag">Lekcija {it.lek}</span> {task.title}
                          </h3>
                          <p style={{ whiteSpace: "pre-wrap" }}>{task.description}</p>
                          <textarea
                            className="code-input"
                            key={`${it.id}-${cpCodes[it.id] !== undefined ? "saved" : "init"}`}
                            ref={(el) => (cpCodeRefs.current[it.id] = el)}
                            defaultValue={cpCodes[it.id] !== undefined ? cpCodes[it.id] : (it.initial || "")}
                            placeholder="Ovdje upiši svoje rješenje..."
                            onKeyDown={editorKeyDown}
                          />
                          <div className="code-actions">
                            <button className="check-code-btn" onClick={() => cpCheckCode(it.id, task)}>
                              Provjeri kod
                            </button>
                            {it.runnable && (
                              <button className="run-code-btn" onClick={() => cpRunCode(it.id, task)}>
                                Pokreni kod
                              </button>
                            )}
                          </div>
                          {cpCodeResults[it.id] === "correct" && (
                            <div className="code-result correct-result">Tačno! Sad je riješeno.</div>
                          )}
                          {cpCodeResults[it.id] === "wrong" && (
                            <div className="code-result wrong-result">Netačno, pokušaj ponovo.</div>
                          )}
                          {cpCodeOutputs[it.id] && (
                            <div className="output-box">
                              <p>Konzola:</p>
                              <pre>{cpCodeOutputs[it.id]}</pre>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="greske-modal-foot">
                    {sveRijeseno ? (
                      <span className="greske-modal-success">
                        <CheckCircle2 size={18} /> Sve greške ispravljene!
                      </span>
                    ) : (
                      <span className="greske-modal-hint">
                        Riješi sve greške da bi završio lekciju ({brojRijesenih}/{stavke.length}).
                      </span>
                    )}
                    <div className="greske-modal-actions">
                      <button
                        className="greske-modal-skip"
                        onClick={() => setShowGreskeModal(false)}
                      >
                        Nastavi kasnije
                      </button>
                      <button
                        className="greske-modal-close"
                        disabled={!sveRijeseno}
                        onClick={zavrsiLekciju}
                      >
                        Završi lekciju
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </main>
      </div>
    </div>
  );
}

export default Lesson;
