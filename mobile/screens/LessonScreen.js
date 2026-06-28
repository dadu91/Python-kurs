import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import CodeEditor from "../components/CodeEditor";
import { MONO, CARD_COLORS } from "../theme";
import { LESSON_DATA, normalizeCode } from "../utils/lessonData";
import { request } from "../utils/api";

function buildSteps(ld) {
  const steps = [];
  steps.push({ type: "intro" });
  (ld?.theoryBlocks || []).forEach((block, i) =>
    steps.push({ type: "theory", index: i, block })
  );
  (ld?.questions || []).forEach((q, i) =>
    steps.push({ type: "quiz", index: i, q })
  );
  (ld?.codingTasks || []).forEach((task, i) =>
    steps.push({ type: "coding", index: i, task })
  );
  steps.push({ type: "done" });
  return steps;
}

const SECTION_DEFS = [
  { key: "intro",  label: "Uvod" },
  { key: "theory", label: "Teorija" },
  { key: "quiz",   label: "Kviz" },
  { key: "coding", label: "Zadaci" },
  { key: "done",   label: "Kraj" },
];

function SectionBar({ steps, stepIndex, color }) {
  const step = steps[stepIndex];
  const currentKey = step.type;
  const present = new Set(steps.map((s) => s.type));
  const sections = SECTION_DEFS.filter((sec) => present.has(sec.key));
  const currentSecIdx = sections.findIndex((sec) => sec.key === currentKey);
  const sectionSteps = steps.filter((s) => s.type === currentKey);
  const posInSection = sectionSteps.findIndex(
    (s) => s.index === step.index || s.type === "intro" || s.type === "done"
  );
  const showSub = sectionSteps.length > 1;
  return (
    <View style={sb.bar}>
      {sections.map((sec, i) => {
        const isActive = sec.key === currentKey;
        const isDone = i < currentSecIdx;
        return (
          <View key={sec.key} style={sb.itemWrap}>
            <View style={[sb.pill, isActive && { backgroundColor: color }, isDone && sb.pillDone]}>
              <Text style={[sb.pillText, (isActive || isDone) && { color: "#fff" }]}>
                {isDone ? "✓ " : ""}{sec.label}
                {isActive && showSub ? ` ${posInSection + 1}/${sectionSteps.length}` : ""}
              </Text>
            </View>
            {i < sections.length - 1 && (
              <View style={[sb.line, isDone && { backgroundColor: color }]} />
            )}
          </View>
        );
      })}
    </View>
  );
}

const sb = StyleSheet.create({
  bar: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
    paddingHorizontal: 12, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: "#e5e7eb", overflow: "hidden",
  },
  itemWrap: { flexDirection: "row", alignItems: "center", flex: 1 },
  pill: { backgroundColor: "#f3f4f6", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4, alignItems: "center" },
  pillDone: { backgroundColor: "#86efac" },
  pillText: { fontSize: 11, fontWeight: "800", color: "#9ca3af" },
  line: { flex: 1, height: 2, backgroundColor: "#e5e7eb", marginHorizontal: 2 },
});

// ── Greške modal ─────────────────────────────────────────────────────────────
function GreskeModal({ items, modalAnswers, modalFixed, onAnswer, onGoTo, onClose, onFinish, saving, color }) {
  const fixed = modalFixed.size;
  const total = items.length;
  const canFinish = fixed >= total;
  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
      <View style={gm.overlay}>
        <View style={gm.box}>
          <View style={gm.head}>
            <Text style={gm.title}>Ponovi greške</Text>
            <View style={[gm.badge, { backgroundColor: color }]}>
              <Text style={gm.badgeText}>{fixed}/{total}</Text>
            </View>
          </View>
          <Text style={gm.sub}>
            Ispravi sve greške da bi završio lekciju. Coding zadatke možeš ispraviti direktno u lekciji.
          </Text>

          <ScrollView style={gm.body} keyboardShouldPersistTaps="handled">
            {items.map((item) => {
              const isFixed = modalFixed.has(item.key);
              if (item.type === "quiz") {
                const sel = modalAnswers[item.key];
                return (
                  <View key={item.key} style={[gm.item, isFixed && gm.itemDone]}>
                    <Text style={gm.itemLabel}>Kviz</Text>
                    <Text style={gm.itemQ}>{item.q.question}</Text>
                    {item.q.answers.map((ans, ai) => {
                      let st = gm.ansBtn;
                      if (isFixed && ai === item.q.correct) st = gm.ansBtnGreen;
                      else if (!isFixed && sel === ai) st = gm.ansBtnRed;
                      return (
                        <Pressable
                          key={ai}
                          style={st}
                          disabled={isFixed}
                          onPress={() => onAnswer(item, ai)}
                        >
                          <Text style={isFixed && ai === item.q.correct ? gm.ansTxtGreen
                                      : (!isFixed && sel === ai)         ? gm.ansTxtRed
                                      : gm.ansTxt}>
                            {ans}
                          </Text>
                        </Pressable>
                      );
                    })}
                    {isFixed && <Text style={gm.ok}>✓ Tačno!</Text>}
                    {!isFixed && sel !== undefined && <Text style={gm.err}>✗ Netačno. Pokušaj ponovo.</Text>}
                  </View>
                );
              }
              // coding item
              return (
                <View key={item.key} style={[gm.item, isFixed && gm.itemDone]}>
                  <Text style={gm.itemLabel}>Kod zadatak</Text>
                  <Text style={gm.itemQ}>{item.task.title}</Text>
                  <Text style={gm.itemDesc} numberOfLines={2}>{item.task.description}</Text>
                  {isFixed
                    ? <Text style={gm.ok}>✓ Ispravljeno!</Text>
                    : (
                      <Pressable style={[gm.goBtn, { borderColor: color }]} onPress={() => onGoTo(item)}>
                        <Text style={[gm.goBtnText, { color }]}>Idi na zadatak →</Text>
                      </Pressable>
                    )
                  }
                </View>
              );
            })}
          </ScrollView>

          <View style={gm.foot}>
            <Pressable style={gm.skipBtn} onPress={onClose}>
              <Text style={gm.skipTxt}>Nastavi kasnije</Text>
            </Pressable>
            <Pressable
              style={[gm.finishBtn, canFinish && { backgroundColor: color }]}
              disabled={!canFinish || saving}
              onPress={onFinish}
            >
              {saving
                ? <ActivityIndicator color="#fff" size="small" />
                : <Text style={[gm.finishTxt, !canFinish && { color: "#9ca3af" }]}>
                    Završi lekciju
                  </Text>
              }
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const gm = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "flex-end" },
  box: { backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: "88%", paddingBottom: 32 },
  head: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  title: { fontSize: 20, fontWeight: "900", color: "#111827" },
  badge: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5 },
  badgeText: { color: "#fff", fontWeight: "900", fontSize: 13 },
  sub: { color: "#6b7280", fontSize: 13, lineHeight: 20, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 4 },
  body: { paddingHorizontal: 16 },
  item: { backgroundColor: "#f9fafb", borderRadius: 14, borderWidth: 1.5, borderColor: "#e5e7eb", padding: 14, marginVertical: 6 },
  itemDone: { borderColor: "#86efac", backgroundColor: "#f0fdf4" },
  itemLabel: { fontSize: 10, fontWeight: "900", color: "#9ca3af", textTransform: "uppercase", marginBottom: 4 },
  itemQ: { fontSize: 15, fontWeight: "700", color: "#111827", lineHeight: 22, marginBottom: 10 },
  itemDesc: { fontSize: 13, color: "#6b7280", lineHeight: 19, marginBottom: 10 },
  ansBtn: { backgroundColor: "#f3f4f6", borderColor: "#e5e7eb", borderWidth: 1.5, borderRadius: 10, padding: 11, marginBottom: 6 },
  ansBtnGreen: { backgroundColor: "#dcfce7", borderColor: "#22c55e", borderWidth: 1.5, borderRadius: 10, padding: 11, marginBottom: 6 },
  ansBtnRed:   { backgroundColor: "#fee2e2", borderColor: "#ef4444", borderWidth: 1.5, borderRadius: 10, padding: 11, marginBottom: 6 },
  ansTxt:      { color: "#374151", fontSize: 13, fontWeight: "600" },
  ansTxtGreen: { color: "#166534", fontSize: 13, fontWeight: "700" },
  ansTxtRed:   { color: "#991b1b", fontSize: 13, fontWeight: "700" },
  ok:  { color: "#166534", fontSize: 13, fontWeight: "700", marginTop: 6 },
  err: { color: "#991b1b", fontSize: 13, fontWeight: "600", marginTop: 6 },
  goBtn: { alignSelf: "flex-start", borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, marginTop: 4 },
  goBtnText: { fontWeight: "700", fontSize: 13 },
  foot: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: "#e5e7eb", marginTop: 8 },
  skipBtn: { padding: 12 },
  skipTxt: { color: "#6b7280", fontWeight: "700", fontSize: 14 },
  finishBtn: { backgroundColor: "#e5e7eb", borderRadius: 12, paddingHorizontal: 20, paddingVertical: 12 },
  finishTxt: { color: "#fff", fontWeight: "900", fontSize: 14 },
});

// ── Main component ────────────────────────────────────────────────────────────
export default function LessonScreen({
  lesson, token, korisnikId, isCompleted,
  savedProgress, gotoTask,
  onBack, onComplete,
}) {
  const ld = LESSON_DATA[lesson.redoslijed];
  const color = CARD_COLORS[lesson.redoslijed] || "#1a5c40";
  const steps = buildSteps(ld);

  const [stepIndex, setStepIndex] = useState(savedProgress?.stepIndex ?? 0);
  const [quizAnswers, setQuizAnswers] = useState(savedProgress?.quizAnswers ?? {});
  const [codeInputs, setCodeInputs] = useState(savedProgress?.codeInputs ?? {});
  const [codeResults, setCodeResults] = useState(savedProgress?.codeResults ?? {});
  const [syntaxInputs, setSyntaxInputs] = useState(savedProgress?.syntaxInputs ?? {});
  const [syntaxResults, setSyntaxResults] = useState(savedProgress?.syntaxResults ?? {});
  const [pogresnoUradjeni, setPogresnoUradjeni] = useState(
    new Set(savedProgress?.pogresnoUradjeni ?? [])
  );

  const [zadatakMapa, setZadatakMapa] = useState({});
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(isCompleted);
  const [shownSolutions, setShownSolutions] = useState({});
  const [codeOutputs, setCodeOutputs] = useState({});
  const [runningCode, setRunningCode] = useState({});

  // Greške modal
  const [showGreskeModal, setShowGreskeModal] = useState(false);
  const [greskeSnapshot, setGreskeSnapshot] = useState([]);
  const [modalAnswers, setModalAnswers] = useState({});
  const [modalFixed, setModalFixed] = useState(new Set());

  const step = steps[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;

  // Fetch zadaci DB IDs for backend posting
  useEffect(() => {
    request(`/zadaci/po-lekciji/${lesson.id}`, { token })
      .then((zadaci) => {
        const mapa = {};
        if (Array.isArray(zadaci)) {
          zadaci.forEach((z) => { if (z.redoslijed) mapa[z.redoslijed] = z.id; });
        }
        setZadatakMapa(mapa);
      })
      .catch(() => {});
  }, [lesson.id, token]);

  // Jump to specific task when opened from errors tab
  useEffect(() => {
    if (!gotoTask) return;
    const idx = steps.findIndex((s) => {
      if (gotoTask.tip === "quiz") return s.type === "quiz" && s.q?.redoslijed === gotoTask.redoslijed;
      return s.type === "coding" && s.task?.redoslijed === gotoTask.redoslijed;
    });
    if (idx >= 0) setStepIndex(idx);
  }, [gotoTask?.redoslijed]);

  const postTaskResult = (redoslijed, tacno) => {
    const zadId = zadatakMapa[redoslijed];
    if (!zadId || !korisnikId) return;
    if (tacno) {
      request(`/zadatak_korisnik/netacni/${korisnikId}/${zadId}`, { method: "DELETE", token }).catch(() => {});
    }
    request("/zadatak_korisnik/", {
      method: "POST", token,
      body: JSON.stringify({ zadatak_id: zadId, korisnik_id: korisnikId, tacno }),
    }).catch(() => {});
  };

  const handleBack = () => {
    onBack({
      stepIndex,
      quizAnswers,
      codeInputs,
      codeResults,
      syntaxInputs,
      syntaxResults,
      pogresnoUradjeni: [...pogresnoUradjeni],
    });
  };

  const canAdvance = () => {
    if (step.type === "theory" && step.block.vjezbaSintakse) {
      return syntaxResults[step.index] === "correct";
    }
    if (step.type === "quiz") return quizAnswers[step.index] !== undefined;
    if (step.type === "coding") return codeResults[step.index] === "correct";
    return true;
  };

  const next = () => { if (!isLast) setStepIndex((i) => i + 1); };
  const prev = () => { if (!isFirst) setStepIndex((i) => i - 1); };

  const handleQuizAnswer = (qi, ai) => {
    if (quizAnswers[qi] !== undefined) return;
    setQuizAnswers((prev) => ({ ...prev, [qi]: ai }));
    const correct = ai === step.q.correct;
    setPogresnoUradjeni((prev) => {
      const s = new Set(prev);
      if (correct) s.delete(`quiz-${qi}`); else s.add(`quiz-${qi}`);
      return s;
    });
    postTaskResult(step.q.redoslijed, correct);
  };

  const handleCodeCheck = (ti, task, code) => {
    const ok = task.check(normalizeCode(code));
    setCodeResults((prev) => ({ ...prev, [ti]: ok ? "correct" : "wrong" }));
    setPogresnoUradjeni((prev) => {
      const s = new Set(prev);
      if (ok) s.delete(`coding-${ti}`); else s.add(`coding-${ti}`);
      return s;
    });
    postTaskResult(task.redoslijed, ok);
  };

  const handleRunCode = async (ti, task, code) => {
    if (!code.trim()) {
      Alert.alert("Prazan kod", "Upiši kod prije pokretanja.");
      return;
    }
    setRunningCode((p) => ({ ...p, [ti]: true }));
    try {
      const data = await request("/kod/execute", {
        method: "POST", token,
        body: JSON.stringify({ kod: code }),
      });
      const output = data.greska
        ? `${data.greska.tip}: ${data.greska.poruka}`
        : (data.output ?? "(nema izlaza)");
      setCodeOutputs((p) => ({ ...p, [ti]: output }));
      if (!data.greska) handleCodeCheck(ti, task, code);
    } catch (e) {
      setCodeOutputs((p) => ({ ...p, [ti]: `Greška: ${e.message}` }));
    } finally {
      setRunningCode((p) => ({ ...p, [ti]: false }));
    }
  };

  const buildGreskeItems = () => {
    return [...pogresnoUradjeni].map((key) => {
      if (key.startsWith("quiz-")) {
        const qi = parseInt(key.slice(5));
        const qs = steps.find((s) => s.type === "quiz" && s.index === qi);
        if (!qs) return null;
        return { key, type: "quiz", qi, q: qs.q, stepIdx: steps.indexOf(qs) };
      } else if (key.startsWith("coding-")) {
        const ti = parseInt(key.slice(7));
        const cs = steps.find((s) => s.type === "coding" && s.index === ti);
        if (!cs) return null;
        return { key, type: "coding", ti, task: cs.task, stepIdx: steps.indexOf(cs) };
      }
      return null;
    }).filter(Boolean);
  };

  const handleDonePress = () => {
    if (done) { handleBack(); return; }
    if (pogresnoUradjeni.size > 0) {
      setGreskeSnapshot(buildGreskeItems());
      setModalAnswers({});
      setModalFixed(new Set());
      setShowGreskeModal(true);
      return;
    }
    markComplete();
  };

  const markComplete = async () => {
    setSaving(true);
    try {
      await Promise.all([
        request("/zavrsena_lekcija/", {
          method: "POST", token,
          body: JSON.stringify({ lekcija_id: lesson.id, korisnik_id: korisnikId }),
        }),
        request("/progres/", {
          method: "POST", token,
          body: JSON.stringify({ korisnik_id: korisnikId }),
        }),
      ]);
      setDone(true);
      setShowGreskeModal(false);
      onComplete(lesson.id);
    } catch (e) {
      Alert.alert("Greška", e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleModalAnswer = (item, ai) => {
    const isCorrect = ai === item.q.correct;
    setModalAnswers((prev) => ({ ...prev, [item.key]: ai }));
    if (isCorrect) {
      setModalFixed((prev) => new Set(prev).add(item.key));
      setPogresnoUradjeni((prev) => { const s = new Set(prev); s.delete(item.key); return s; });
      postTaskResult(item.q.redoslijed, true);
    }
  };

  const handleModalGoTo = (item) => {
    setShowGreskeModal(false);
    setStepIndex(item.stepIdx);
  };

  // Mark coding item as fixed in modal when codeResults[ti] === "correct"
  useEffect(() => {
    if (!showGreskeModal) return;
    greskeSnapshot.forEach((item) => {
      if (item.type === "coding" && codeResults[item.ti] === "correct") {
        setModalFixed((prev) => new Set(prev).add(item.key));
        setPogresnoUradjeni((prev) => { const s = new Set(prev); s.delete(item.key); return s; });
      }
    });
  }, [codeResults, showGreskeModal]);

  // Progress bar
  const contentSteps = steps.filter((s) => s.type !== "intro" && s.type !== "done");
  const contentIndex = contentSteps.findIndex((s) => s.type === step.type && s.index === step.index);
  const progress = contentSteps.length > 0
    ? Math.max(0, contentIndex) / contentSteps.length
    : step.type === "done" ? 1 : 0;

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" />

      {/* Top bar */}
      <View style={s.topbar}>
        <Pressable style={s.backBtn} onPress={handleBack}>
          <Text style={[s.backBtnText, { color }]}>← Nazad</Text>
        </Pressable>
        <View style={[s.badge, { backgroundColor: color }]}>
          <Text style={s.badgeText}>Lekcija {lesson.redoslijed}</Text>
        </View>
      </View>

      <SectionBar steps={steps} stepIndex={stepIndex} color={color} />

      <View style={s.progressTrack}>
        <View style={[s.progressFill, { width: `${progress * 100}%`, backgroundColor: color }]} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" key={stepIndex}>

          {/* ── INTRO ── */}
          {step.type === "intro" && (
            <View>
              <Text style={s.lessonTitle}>{lesson.naziv}</Text>
              {(ld?.duration || ld?.level) && (
                <View style={s.metaRow}>
                  {!!ld.duration && <View style={s.metaChip}><Text style={[s.metaChipTxt, { color }]}>⏱ {ld.duration}</Text></View>}
                  {!!ld.level   && <View style={s.metaChip}><Text style={[s.metaChipTxt, { color }]}>{ld.level}</Text></View>}
                </View>
              )}
              {!!ld?.description && <Text style={s.lessonDesc}>{ld.description}</Text>}
              {ld?.goals?.length > 0 && (
                <View style={[s.goalsCard, { borderLeftColor: color }]}>
                  <Text style={[s.goalsTitle, { color }]}>Šta ćeš naučiti</Text>
                  {ld.goals.map((g, i) => (
                    <View key={i} style={s.goalRow}>
                      <Text style={[s.goalDot, { color }]}>✓</Text>
                      <Text style={s.goalText}>{g.tekst}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* ── THEORY ── */}
          {step.type === "theory" && (
            <View>
              <Text style={[s.stepLabel, { color }]}>Teorija</Text>
              <Text style={s.theoryTitle}>{step.block.title}</Text>
              <Text style={s.theoryText}>{step.block.text}</Text>
              {!!step.block.code && (
                <View style={s.codeBlock}>
                  <Text style={s.codeBlockLabel}>Primjer</Text>
                  <Text style={s.codeBlockText}>{step.block.code}</Text>
                </View>
              )}
              {step.block.codeObjasnjenje?.map((line, li) => (
                <View key={li} style={s.explainRow}>
                  <Text style={[s.explainDot, { color }]}>•</Text>
                  <Text style={s.explainText}>{line}</Text>
                </View>
              ))}
              {!!step.block.vjezbaSintakse && (
                <View style={s.syntaxBox}>
                  <Text style={[s.syntaxLabel, { color }]}>Vježba sintakse</Text>
                  <Text style={s.syntaxInstr}>{step.block.vjezbaSintakse.uputstvo}</Text>
                  <CodeEditor
                    value={syntaxInputs[step.index] || ""}
                    onChange={(v) => setSyntaxInputs((p) => ({ ...p, [step.index]: v }))}
                    placeholder={step.block.vjezbaSintakse.placeholder}
                    disabled={syntaxResults[step.index] === "correct"}
                    style={syntaxResults[step.index] === "correct" ? s.inputCorrect
                         : syntaxResults[step.index] === "wrong"   ? s.inputWrong : null}
                  />
                  {syntaxResults[step.index] !== "correct" && (
                    <Pressable
                      style={[s.checkBtn, { backgroundColor: color }]}
                      onPress={() => {
                        const ok = step.block.vjezbaSintakse.check(
                          normalizeCode(syntaxInputs[step.index] || "")
                        );
                        setSyntaxResults((p) => ({ ...p, [step.index]: ok ? "correct" : "wrong" }));
                      }}
                    >
                      <Text style={s.checkBtnText}>Provjeri</Text>
                    </Pressable>
                  )}
                  {syntaxResults[step.index] === "correct" && <Text style={s.feedbackOk}>✓ Tačno!</Text>}
                  {syntaxResults[step.index] === "wrong" && (
                    <Text style={s.feedbackErr}>✗ Nije tačno.{"\n"}Hint: {step.block.vjezbaSintakse.hint}</Text>
                  )}
                </View>
              )}
            </View>
          )}

          {/* ── QUIZ ── */}
          {step.type === "quiz" && (() => {
            const q = step.q;
            const answered = quizAnswers[step.index] !== undefined;
            const correct = quizAnswers[step.index] === q.correct;
            return (
              <View>
                <Text style={[s.stepLabel, { color }]}>Pitanje {step.index + 1}</Text>
                <View style={[s.quizCard, answered && (correct ? s.cardCorrect : s.cardWrong)]}>
                  <Text style={s.quizQuestion}>{q.question}</Text>
                  {q.answers.map((ans, ai) => {
                    let st = s.answerBtn, ts = s.answerBtnText;
                    if (answered) {
                      if (ai === q.correct)                       { st = s.answerBtnGreen; ts = s.answerBtnTextGreen; }
                      else if (ai === quizAnswers[step.index])    { st = s.answerBtnRed;   ts = s.answerBtnTextRed; }
                    }
                    return (
                      <Pressable key={ai} style={st} disabled={answered}
                        onPress={() => handleQuizAnswer(step.index, ai)}>
                        <Text style={ts}>{ans}</Text>
                      </Pressable>
                    );
                  })}
                  {answered && (
                    <Text style={correct ? s.feedbackOk : s.feedbackErr}>
                      {correct ? "✓ Tačno!" : `✗ Tačan odgovor: ${q.answers[q.correct]}`}
                    </Text>
                  )}
                </View>
              </View>
            );
          })()}

          {/* ── CODING ── */}
          {step.type === "coding" && (() => {
            const task = step.task;
            const ti = step.index;
            const result = codeResults[ti];
            return (
              <View>
                <Text style={[s.stepLabel, { color }]}>Zadatak {ti + 1}</Text>
                <View style={[s.taskCard, result === "correct" && s.cardCorrect, result === "wrong" && s.cardWrong]}>
                  <Text style={s.taskTitle}>{task.title}</Text>
                  <Text style={s.taskDesc}>{task.description}</Text>
                  {result === "wrong" && !!task.hint && <Text style={s.hintText}>💡 {task.hint}</Text>}
                  <CodeEditor
                    value={codeInputs[ti] || ""}
                    onChange={(v) => setCodeInputs((p) => ({ ...p, [ti]: v }))}
                    placeholder="Upiši rješenje..."
                    disabled={result === "correct"}
                    style={[
                      { minHeight: 140 },
                      result === "correct" && s.inputCorrect,
                      result === "wrong"   && s.inputWrong,
                    ]}
                  />
                  {result !== "correct" && (
                    <View style={s.codeActions}>
                      <Pressable
                        style={[s.checkBtn, { backgroundColor: color, flex: 1 }]}
                        onPress={() => handleCodeCheck(ti, task, codeInputs[ti] || "")}
                      >
                        <Text style={s.checkBtnText}>Provjeri</Text>
                      </Pressable>
                      <Pressable
                        style={[s.checkBtn, s.runBtn, { flex: 1 }]}
                        disabled={runningCode[ti]}
                        onPress={() => handleRunCode(ti, task, codeInputs[ti] || "")}
                      >
                        {runningCode[ti]
                          ? <ActivityIndicator color="#fff" size="small" />
                          : <Text style={s.checkBtnText}>▶ Pokrni</Text>
                        }
                      </Pressable>
                    </View>
                  )}
                  {codeOutputs[ti] !== undefined && (
                    <View style={s.outputBox}>
                      <Text style={s.outputLabel}>Konzola</Text>
                      <Text style={s.outputText}>{codeOutputs[ti]}</Text>
                    </View>
                  )}
                  {result === "correct" && <Text style={s.feedbackOk}>✓ Tačno! Odlično!</Text>}
                  {result === "wrong"   && <Text style={s.feedbackErr}>✗ Nije tačno. Pokušaj ponovo.</Text>}
                  {!!task.solution && (
                    <Pressable
                      style={s.solutionToggle}
                      onPress={() => setShownSolutions((p) => ({ ...p, [ti]: !p[ti] }))}
                    >
                      <Text style={[s.solutionToggleTxt, { color }]}>
                        {shownSolutions[ti] ? "▲ Sakrij rješenje" : "▼ Prikaži rješenje"}
                      </Text>
                    </Pressable>
                  )}
                  {shownSolutions[ti] && !!task.solution && (
                    <View style={s.outputBox}>
                      <Text style={s.outputLabel}>Rješenje</Text>
                      <Text style={s.outputText}>{task.solution}</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })()}

          {/* ── DONE ── */}
          {step.type === "done" && (
            <View style={s.doneWrap}>
              <View style={[s.doneCircle, { backgroundColor: color }]}>
                <Text style={s.doneEmoji}>🎉</Text>
              </View>
              <Text style={s.doneTitle}>{done ? "Lekcija već završena!" : "Sve gotovo!"}</Text>
              <Text style={s.doneSubtitle}>
                {done
                  ? "Ova lekcija je označena kao završena."
                  : pogresnoUradjeni.size > 0
                    ? `Imaš ${pogresnoUradjeni.size} neispravljenih grešaka. Možeš ih ispraviti ili završiti bez toga.`
                    : "Odlično si odradio sve zadatke. Označi lekciju kao završenu."}
              </Text>
              <Pressable style={[s.doneBtn, { backgroundColor: color }]} onPress={handleDonePress} disabled={saving}>
                {saving
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={s.doneBtnText}>{done ? "Nazad na listu" : "Označi kao završeno ✓"}</Text>
                }
              </Pressable>
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom nav */}
      {!isLast && (
        <View style={s.nav}>
          <Pressable
            style={[s.navBtn, s.navBtnGhost, isFirst && s.navBtnDisabled]}
            onPress={prev} disabled={isFirst}>
            <Text style={[s.navBtnText, isFirst && { color: "#9ca3af" }]}>← Nazad</Text>
          </Pressable>
          <Text style={s.navCounter}>{stepIndex + 1} / {steps.length}</Text>
          <Pressable
            style={[s.navBtn, { backgroundColor: canAdvance() ? color : "#d1d5db" }]}
            onPress={next} disabled={!canAdvance()}>
            <Text style={s.navBtnTextWhite}>{step.type === "intro" ? "Počni →" : "Dalje →"}</Text>
          </Pressable>
        </View>
      )}

      {/* Greške modal */}
      {showGreskeModal && (
        <GreskeModal
          items={greskeSnapshot}
          modalAnswers={modalAnswers}
          modalFixed={modalFixed}
          onAnswer={handleModalAnswer}
          onGoTo={handleModalGoTo}
          onClose={() => setShowGreskeModal(false)}
          onFinish={markComplete}
          saving={saving}
          color={color}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f3f4f6" },

  topbar: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e5e7eb",
  },
  backBtn: { backgroundColor: "#f3f4f6", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7 },
  backBtnText: { fontSize: 14, fontWeight: "700" },
  badge: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5 },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "900", textTransform: "uppercase" },

  progressTrack: { height: 4, backgroundColor: "#e5e7eb" },
  progressFill: { height: 4, borderRadius: 2 },

  scroll: { padding: 20, paddingBottom: 16 },

  lessonTitle: { fontSize: 28, fontWeight: "900", color: "#111827", marginBottom: 10 },
  lessonDesc: { fontSize: 15, color: "#6b7280", lineHeight: 23, marginBottom: 16 },

  goalsCard: { backgroundColor: "#fff", borderRadius: 18, borderLeftWidth: 4, padding: 18, marginTop: 8 },
  goalsTitle: { fontSize: 14, fontWeight: "900", textTransform: "uppercase", marginBottom: 12 },
  goalRow: { flexDirection: "row", gap: 10, marginBottom: 8 },
  goalDot: { fontSize: 15, fontWeight: "900" },
  goalText: { color: "#374151", fontSize: 15, flex: 1, lineHeight: 22 },

  stepLabel: { fontSize: 12, fontWeight: "900", textTransform: "uppercase", marginBottom: 10, letterSpacing: 0.5 },

  theoryTitle: { fontSize: 22, fontWeight: "900", color: "#111827", marginBottom: 10 },
  theoryText: { fontSize: 15, color: "#374151", lineHeight: 24, marginBottom: 12 },

  codeBlock: { backgroundColor: "#0f172a", borderRadius: 14, padding: 16, marginBottom: 12 },
  codeBlockLabel: { color: "#5eead4", fontSize: 11, fontWeight: "900", textTransform: "uppercase", marginBottom: 8 },
  codeBlockText: { color: "#e2e8f0", fontFamily: MONO, fontSize: 13, lineHeight: 20 },

  explainRow: { flexDirection: "row", gap: 8, marginBottom: 6 },
  explainDot: { fontSize: 15, fontWeight: "900" },
  explainText: { color: "#4b5563", fontSize: 13, lineHeight: 20, flex: 1 },

  syntaxBox: { backgroundColor: "#f9fafb", borderColor: "#e5e7eb", borderRadius: 14, borderWidth: 1, marginTop: 16, padding: 14 },
  syntaxLabel: { fontSize: 12, fontWeight: "900", textTransform: "uppercase", marginBottom: 6 },
  syntaxInstr: { color: "#374151", fontSize: 14, lineHeight: 21, marginBottom: 10 },

  quizCard: { backgroundColor: "#fff", borderColor: "#e5e7eb", borderRadius: 18, borderWidth: 1.5, padding: 18 },
  quizQuestion: { fontSize: 17, fontWeight: "700", color: "#111827", lineHeight: 25, marginBottom: 16 },

  taskCard: { backgroundColor: "#fff", borderColor: "#e5e7eb", borderRadius: 18, borderWidth: 1.5, padding: 18 },
  taskTitle: { fontSize: 18, fontWeight: "900", color: "#111827", marginBottom: 6 },
  taskDesc: { fontSize: 14, color: "#374151", lineHeight: 22, marginBottom: 14 },
  hintText: { color: "#d97706", fontSize: 13, marginBottom: 10, lineHeight: 19 },

  cardCorrect: { borderColor: "#86efac", backgroundColor: "#f0fdf4" },
  cardWrong:   { borderColor: "#fca5a5", backgroundColor: "#fef2f2" },

  answerBtn:         { backgroundColor: "#f9fafb", borderColor: "#e5e7eb", borderRadius: 12, borderWidth: 1.5, padding: 13, marginBottom: 8 },
  answerBtnText:     { color: "#374151", fontSize: 14, fontWeight: "600" },
  answerBtnGreen:    { backgroundColor: "#dcfce7", borderColor: "#22c55e", borderRadius: 12, borderWidth: 1.5, padding: 13, marginBottom: 8 },
  answerBtnTextGreen:{ color: "#166534", fontSize: 14, fontWeight: "700" },
  answerBtnRed:      { backgroundColor: "#fee2e2", borderColor: "#ef4444", borderRadius: 12, borderWidth: 1.5, padding: 13, marginBottom: 8 },
  answerBtnTextRed:  { color: "#991b1b", fontSize: 14, fontWeight: "700" },

  feedbackOk:  { color: "#166534", fontSize: 14, fontWeight: "700", marginTop: 8 },
  feedbackErr: { color: "#991b1b", fontSize: 13, fontWeight: "600", marginTop: 8, lineHeight: 20 },

  inputCorrect: { borderWidth: 1.5, borderColor: "#22c55e" },
  inputWrong:   { borderWidth: 1.5, borderColor: "#ef4444" },

  metaRow: { flexDirection: "row", gap: 8, marginBottom: 12, marginTop: 4 },
  metaChip: { backgroundColor: "#fff", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: "#e5e7eb" },
  metaChipTxt: { fontSize: 12, fontWeight: "800" },

  codeActions: { flexDirection: "row", gap: 8, marginTop: 4 },
  checkBtn: { alignItems: "center", alignSelf: "flex-start", borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10, marginTop: 4 },
  runBtn: { backgroundColor: "#0f172a" },
  checkBtnText: { color: "#fff", fontWeight: "800", fontSize: 14 },

  outputBox: { backgroundColor: "#0f172a", borderRadius: 10, padding: 12, marginTop: 10 },
  outputLabel: { color: "#5eead4", fontSize: 10, fontWeight: "900", textTransform: "uppercase", marginBottom: 6 },
  outputText: { color: "#e2e8f0", fontFamily: MONO, fontSize: 12, lineHeight: 18 },

  solutionToggle: { paddingVertical: 10, marginTop: 4 },
  solutionToggleTxt: { fontSize: 13, fontWeight: "700" },

  doneWrap: { alignItems: "center", paddingVertical: 32 },
  doneCircle: { width: 100, height: 100, borderRadius: 50, alignItems: "center", justifyContent: "center", marginBottom: 24 },
  doneEmoji: { fontSize: 48 },
  doneTitle: { fontSize: 26, fontWeight: "900", color: "#111827", textAlign: "center", marginBottom: 10 },
  doneSubtitle: { fontSize: 15, color: "#6b7280", textAlign: "center", lineHeight: 23, marginBottom: 32, paddingHorizontal: 16 },
  doneBtn: { borderRadius: 16, paddingHorizontal: 32, paddingVertical: 16 },
  doneBtnText: { color: "#fff", fontSize: 16, fontWeight: "900" },

  nav: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#e5e7eb",
  },
  navBtn: { borderRadius: 12, paddingHorizontal: 18, paddingVertical: 11 },
  navBtnGhost: { backgroundColor: "#f3f4f6" },
  navBtnDisabled: { opacity: 0.4 },
  navBtnText: { color: "#374151", fontWeight: "700", fontSize: 14 },
  navBtnTextWhite: { color: "#fff", fontWeight: "800", fontSize: 14 },
  navCounter: { color: "#9ca3af", fontSize: 13, fontWeight: "600" },
});
