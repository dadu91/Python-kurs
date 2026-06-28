import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import LessonScreen from "./LessonScreen";
import ProfileScreen from "./ProfileScreen";
import { request } from "../utils/api";
import { ACCENT, CARD_COLORS } from "../theme";

function StatChip({ label, value }) {
  return (
    <View style={s.chip}>
      <Text style={s.chipValue}>{value}</Text>
      <Text style={s.chipLabel}>{label}</Text>
    </View>
  );
}

function TabButton({ active, label, onPress }) {
  return (
    <Pressable style={[s.tabBtn, active && s.tabBtnActive]} onPress={onPress}>
      <Text style={[s.tabText, active && s.tabTextActive]}>{label}</Text>
    </Pressable>
  );
}

function LessonCard({ lesson, completed, onPress }) {
  const color = CARD_COLORS[lesson.redoslijed] || "#1a5c40";
  return (
    <Pressable style={[s.lessonCard, { backgroundColor: color }]} onPress={onPress}>
      <View style={s.cardGlow} />
      <Text style={s.cardBadge}>Lekcija {lesson.redoslijed}</Text>
      <Text style={s.cardTitle}>{lesson.naziv}</Text>
      <View style={s.progressBar}>
        <View style={[s.progressFill, { width: completed ? "100%" : "0%" }]} />
      </View>
      <Text style={s.cardAction}>{completed ? "✓ Završena" : "Otvori →"}</Text>
    </Pressable>
  );
}

export default function DashboardScreen({ session, onLogout }) {
  const [lessons, setLessons] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [errors, setErrors] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [activeTab, setActiveTab] = useState("lessons");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ bodovi: 0, nivo: 1 });
  const [korisnikId, setKorisnikId] = useState(null);
  const [korisnik, setKorisnik] = useState(null);
  const [tacni, setTacni] = useState(0);
  const [activity, setActivity] = useState([]);
  const [lessonProgress, setLessonProgress] = useState({});
  const [gotoTask, setGotoTask] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const token = session.token;
  const username = session.username || "";

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const lessonData = await request("/lekcije/", { token });
      setLessons([...lessonData].sort((a, b) => a.redoslijed - b.redoslijed));

      const user = await request(
        `/korisnik/pretraga/username?username=${encodeURIComponent(username)}`,
        { token }
      );
      setKorisnikId(user.id);
      setKorisnik(user);

      try {
        const progress = await request(`/progres/po-korisniku/${user.id}`, { token });
        if (progress) setStats({ bodovi: progress.bodovi || 0, nivo: progress.nivo || 1 });
      } catch {}

      try {
        const completed = await request(`/zavrsena_lekcija/po-korisnik-id/${user.id}`, { token });
        setCompletedLessons(Array.isArray(completed) ? completed : []);
      } catch { setCompletedLessons([]); }

      try {
        const errData = await request(`/zadatak_korisnik/netacni/detalji/${user.id}`, { token });
        setErrors(Array.isArray(errData) ? errData : []);
      } catch { setErrors([]); }

      try {
        const tacniData = await request(`/zadatak_korisnik/tacni/po-korisnik/${user.id}`, { token });
        setTacni(Array.isArray(tacniData) ? tacniData.length : 0);
      } catch {}

      try {
        const actData = await request(`/zadatak_korisnik/aktivnost/sedmica/${user.id}`, { token });
        setActivity(Array.isArray(actData) ? actData : []);
      } catch {}

    } catch (error) {
      Alert.alert("Backend nije dostupan", error.message);
    } finally {
      setLoading(false);
    }
  }, [token, username]);

  useEffect(() => { loadData(); }, [loadData]);

  const completedIds = useMemo(
    () => new Set(completedLessons.map((c) => c.lekcija_id)),
    [completedLessons]
  );

  const currentLesson = useMemo(
    () => lessons.find((l) => !completedIds.has(l.id)) || lessons[0] || null,
    [lessons, completedIds]
  );

  const handleLessonComplete = (lekcijaId) => {
    setCompletedLessons((prev) =>
      prev.some((c) => c.lekcija_id === lekcijaId)
        ? prev
        : [...prev, { lekcija_id: lekcijaId }]
    );
    setStats((prev) => ({ bodovi: prev.bodovi + 10, nivo: Math.floor((prev.bodovi + 10) / 50) + 1 }));
  };

  if (showProfile) {
    return (
      <ProfileScreen
        korisnik={korisnik}
        stats={stats}
        token={token}
        completedCount={completedLessons.length}
        totalLessons={lessons.length}
        tacni={tacni}
        netacni={errors.length}
        onBack={() => setShowProfile(false)}
        onLogout={onLogout}
        onKorisnikUpdate={(k) => setKorisnik(k)}
      />
    );
  }

  if (selectedLesson) {
    return (
      <LessonScreen
        lesson={selectedLesson}
        token={token}
        korisnikId={korisnikId}
        isCompleted={completedIds.has(selectedLesson.id)}
        savedProgress={gotoTask ? null : (lessonProgress[selectedLesson.id] ?? null)}
        gotoTask={gotoTask}
        onBack={(progress) => {
          if (progress && !gotoTask) {
            setLessonProgress((prev) => ({ ...prev, [selectedLesson.id]: progress }));
          }
          setSelectedLesson(null);
          setGotoTask(null);
        }}
        onComplete={(lekcijaId) => {
          handleLessonComplete(lekcijaId);
          setLessonProgress((prev) => { const n = {...prev}; delete n[lekcijaId]; return n; });
        }}
      />
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" />

      <View style={s.topbar}>
        <View>
          <Text style={s.brand}>Python <Text style={{ color: ACCENT }}>kurs</Text></Text>
          <Text style={s.handle}>{username ? `@${username}` : ""}</Text>
        </View>
        <Pressable style={s.avatarBtn} onPress={() => setShowProfile(true)}>
          <Text style={s.avatarText}>{username ? username[0].toUpperCase() : "P"}</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={s.content}>
        {/* Hero */}
        <View style={s.hero}>
          <Text style={s.heroLabel}>Python kurs</Text>
          <Text style={s.heroTitle}>Zdravo{username ? `, ${username}` : ""}</Text>
          <Text style={s.heroSub}>Prati lekcije, bodove i nivo na jednom mjestu.</Text>
          <View style={s.chips}>
            <StatChip label="bodova" value={stats.bodovi} />
            <StatChip label="nivo" value={stats.nivo} />
            <StatChip label="lekcija" value={completedLessons.length} />
          </View>
        </View>

        {/* Tabs */}
        <View style={s.tabs}>
          <TabButton active={activeTab === "lessons"}  label="Lekcije"  onPress={() => setActiveTab("lessons")} />
          <TabButton active={activeTab === "current"}  label="Trenutna" onPress={() => setActiveTab("current")} />
          <TabButton active={activeTab === "progress"} label="Napredak" onPress={() => setActiveTab("progress")} />
          <TabButton active={activeTab === "errors"}   label="Greške"   onPress={() => setActiveTab("errors")} />
        </View>

        {/* ── Lekcije ── */}
        {activeTab === "lessons" && (
          <>
            <View style={s.sectionRow}>
              <Text style={s.sectionTitle}>Odaberi lekciju</Text>
              <Pressable onPress={loadData}>
                <Text style={[s.refreshText, { color: ACCENT }]}>Osvježi</Text>
              </Pressable>
            </View>
            {loading ? (
              <ActivityIndicator style={{ marginTop: 32 }} color={ACCENT} />
            ) : (
              <FlatList
                data={lessons}
                keyExtractor={(item) => String(item.id)}
                scrollEnabled={false}
                contentContainerStyle={{ gap: 14, paddingTop: 12 }}
                renderItem={({ item }) => (
                  <LessonCard
                    lesson={item}
                    completed={completedIds.has(item.id)}
                    onPress={() => { setGotoTask(null); setSelectedLesson(item); }}
                  />
                )}
                ListEmptyComponent={<Text style={s.emptyText}>Nema učitanih lekcija.</Text>}
              />
            )}
          </>
        )}

        {/* ── Trenutna ── */}
        {activeTab === "current" && (
          <View style={s.currentCard}>
            <View style={[s.currentLeft, { backgroundColor: CARD_COLORS[currentLesson?.redoslijed] || ACCENT }]}>
              <Text style={s.currentIcon}>Py</Text>
            </View>
            <View style={s.currentRight}>
              <Text style={[s.currentLabel, { color: ACCENT }]}>Trenutna lekcija</Text>
              <Text style={s.currentTitle}>{currentLesson?.naziv || "Nema lekcija"}</Text>
              <Text style={s.currentDesc}>
                {currentLesson ? "Nastavi gdje si stao." : "Učitaj lekcije da počneš."}
              </Text>
              {!!currentLesson && (
                <Pressable
                  style={[s.currentBtn, { backgroundColor: CARD_COLORS[currentLesson.redoslijed] || ACCENT }]}
                  onPress={() => setSelectedLesson(currentLesson)}
                >
                  <Text style={s.currentBtnText}>Nastavi →</Text>
                </Pressable>
              )}
            </View>
          </View>
        )}

        {/* ── Napredak ── */}
        {activeTab === "progress" && (() => {
          const netacni = errors.length;
          const ukupno = tacni + netacni;
          const tacnostPct = ukupno > 0 ? Math.round((tacni / ukupno) * 100) : 0;
          const bodoviZaNivo = stats.nivo * 100;
          const progresNivo = bodoviZaNivo > 0
            ? Math.min(Math.round(((stats.bodovi % bodoviZaNivo) / bodoviZaNivo) * 100), 100)
            : 0;
          const maxAct = Math.max(...activity.map((a) => a.value || 0), 1);
          const badges = [
            { icon: "🏆", label: "Prva lekcija",    desc: "Završi prvu lekciju",    earned: completedLessons.length >= 1 },
            { icon: "📚", label: "Marljivi učenik", desc: "Završi 3 lekcije",       earned: completedLessons.length >= 3 },
            { icon: "🔥", label: "Na pola puta",    desc: "Završi 6 lekcija",       earned: completedLessons.length >= 6 },
            { icon: "⭐", label: "100 bodova",      desc: "Skupi 100 bodova",       earned: stats.bodovi >= 100 },
            { icon: "💎", label: "500 bodova",      desc: "Skupi 500 bodova",       earned: stats.bodovi >= 500 },
            { icon: "⚡", label: "Nivo 3",          desc: "Dostigni nivo 3",        earned: stats.nivo >= 3 },
            { icon: "🐍", label: "Python majstor",  desc: "Dostigni nivo 5",        earned: stats.nivo >= 5 },
            { icon: "🎯", label: "Oštar um",        desc: "90%+ tačnost",           earned: tacnostPct >= 90 && ukupno > 0 },
            { icon: "✅", label: "Vrijedan",        desc: "50 tačnih zadataka",     earned: tacni >= 50 },
            { icon: "🎓", label: "Kurs završen",    desc: "Završi sve lekcije",     earned: lessons.length > 0 && completedLessons.length >= lessons.length },
          ];
          return (
            <View style={{ gap: 14, marginTop: 16 }}>
              {/* Stats grid */}
              <View style={s.pGrid}>
                {[
                  { val: stats.bodovi, lbl: "Bodovi" },
                  { val: stats.nivo, lbl: "Nivo" },
                  { val: completedLessons.length, lbl: "Lekcije" },
                  { val: tacni, lbl: "Tačni" },
                  { val: `${tacnostPct}%`, lbl: "Tačnost" },
                ].map((item) => (
                  <View key={item.lbl} style={s.pStatCard}>
                    <Text style={s.pStatVal}>{item.val}</Text>
                    <Text style={s.pStatLbl}>{item.lbl}</Text>
                  </View>
                ))}
              </View>

              {/* Level progress */}
              <View style={s.pLevelCard}>
                <View style={s.pLevelRow}>
                  <Text style={s.pLevelLabel}>Nivo {stats.nivo}</Text>
                  <Text style={s.pLevelNext}>Nivo {stats.nivo + 1} →</Text>
                </View>
                <View style={s.pLevelTrack}>
                  <View style={[s.pLevelFill, { width: `${progresNivo}%` }]} />
                </View>
                <Text style={s.pLevelPct}>{progresNivo}% do sljedećeg nivoa</Text>
              </View>

              {/* Weekly activity chart */}
              {activity.length > 0 && (
                <View style={s.pActCard}>
                  <Text style={s.pActTitle}>Sedmična aktivnost</Text>
                  <View style={s.pActBars}>
                    {activity.map((item, i) => {
                      const barH = Math.max(4, Math.round((item.value / maxAct) * 56));
                      return (
                        <View key={i} style={s.pActCol}>
                          <Text style={s.pActVal}>{item.value > 0 ? item.value : ""}</Text>
                          <View style={[s.pActBar, { height: barH, backgroundColor: item.value > 0 ? ACCENT : "#e5e7eb" }]} />
                          <Text style={s.pActDay}>{item.day}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Achievements */}
              <View style={s.pBadgesCard}>
                <Text style={s.pBadgesTitle}>Dostignuća ({badges.filter((b) => b.earned).length}/{badges.length})</Text>
                <View style={s.pBadgesGrid}>
                  {badges.map((b, i) => (
                    <View key={i} style={[s.pBadge, !b.earned && s.pBadgeLocked]}>
                      <Text style={[s.pBadgeIcon, !b.earned && { opacity: 0.25 }]}>{b.icon}</Text>
                      <Text style={[s.pBadgeName, !b.earned && { color: "#9ca3af" }]}>{b.label}</Text>
                      <Text style={s.pBadgeDesc}>{b.desc}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          );
        })()}

        {/* ── Greške ── */}
        {activeTab === "errors" && (
          <>
            <View style={s.errSumCard}>
              <Text style={s.errSumValue}>{errors.length}</Text>
              <Text style={s.errSumLabel}>ukupno grešaka</Text>
            </View>

            {errors.length === 0 ? (
              <View style={s.emptyCard}>
                <Text style={s.emptyCardIcon}>✓</Text>
                <Text style={s.emptyCardTitle}>Nema zabilježenih grešaka</Text>
                <Text style={s.emptyCardDesc}>Odlično! Greške iz zadataka prikazuju se ovdje.</Text>
              </View>
            ) : (
              <FlatList
                data={errors}
                keyExtractor={(item) => String(item.id)}
                scrollEnabled={false}
                contentContainerStyle={{ gap: 10, paddingTop: 12 }}
                renderItem={({ item }) => (
                  <Pressable
                    style={s.errorCard}
                    onPress={() => {
                      const lesson = lessons.find((l) => l.id === item.lekcija_id);
                      if (!lesson) return;
                      setGotoTask({ redoslijed: item.zadatak_redoslijed, tip: item.zadatak_tip });
                      setSelectedLesson(lesson);
                    }}
                  >
                    <View style={s.errorLeft}>
                      <Text style={s.errorType}>{item.zadatak_tip === "quiz" ? "Kviz" : "Kod"}</Text>
                    </View>
                    <View style={s.errorRight}>
                      <Text style={s.errorName}>{item.zadatak_naziv || "Zadatak"}</Text>
                      <Text style={s.errorLesson}>{item.lekcija_naziv}</Text>
                      {!!item.datum && <Text style={s.errorDate}>{item.datum}</Text>}
                      <Text style={[s.errorDate, { color: ACCENT, marginTop: 4, fontWeight: "700" }]}>Ispravi →</Text>
                    </View>
                  </Pressable>
                )}
              />
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f3f4f6" },

  topbar: {
    alignItems: "center", backgroundColor: "#fff",
    borderBottomColor: "#e5e7eb", borderBottomWidth: 1,
    flexDirection: "row", justifyContent: "space-between",
    paddingHorizontal: 20, paddingVertical: 14,
  },
  brand: { fontSize: 22, fontWeight: "900", color: "#111" },
  handle: { color: "#9ca3af", fontSize: 12, marginTop: 2 },
  avatarBtn: {
    alignItems: "center", backgroundColor: ACCENT,
    borderRadius: 21, height: 42, justifyContent: "center", width: 42,
  },
  avatarText: { color: "#fff", fontWeight: "900", fontSize: 16 },

  content: { padding: 18, paddingBottom: 40 },

  hero: { backgroundColor: "#0f172a", borderRadius: 24, padding: 24, marginBottom: 16 },
  heroLabel: {
    alignSelf: "flex-start", backgroundColor: "rgba(99,102,241,0.18)",
    borderColor: "rgba(99,102,241,0.35)", borderRadius: 999, borderWidth: 1,
    color: "#a5b4fc", fontSize: 12, fontWeight: "900",
    paddingHorizontal: 12, paddingVertical: 5, textTransform: "uppercase",
  },
  heroTitle: { color: "#fff", fontSize: 28, fontWeight: "900", marginTop: 12 },
  heroSub: { color: "#94a3b8", fontSize: 14, lineHeight: 21, marginTop: 6 },
  chips: { flexDirection: "row", gap: 10, marginTop: 18 },
  chip: {
    backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.14)",
    borderRadius: 999, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 8, alignItems: "center",
  },
  chipValue: { color: "#f0fdfa", fontSize: 16, fontWeight: "900" },
  chipLabel: { color: "#94a3b8", fontSize: 11, fontWeight: "700" },

  tabs: { backgroundColor: "#fff", borderRadius: 16, flexDirection: "row", gap: 6, padding: 6, marginBottom: 4 },
  tabBtn: { alignItems: "center", borderRadius: 12, flex: 1, paddingVertical: 10 },
  tabBtnActive: { backgroundColor: ACCENT },
  tabText: { color: "#374151", fontSize: 12, fontWeight: "700" },
  tabTextActive: { color: "#fff" },

  sectionRow: {
    alignItems: "center", flexDirection: "row",
    justifyContent: "space-between", marginTop: 20, marginBottom: 4,
  },
  sectionTitle: { color: "#111827", fontSize: 18, fontWeight: "900" },
  refreshText: { fontWeight: "700" },
  emptyText: { color: "#64748b", textAlign: "center", marginTop: 20 },

  lessonCard: { borderRadius: 20, minHeight: 130, overflow: "hidden", padding: 20 },
  cardGlow: {
    backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 90,
    height: 130, position: "absolute", right: -40, top: -40, width: 130,
  },
  cardBadge: {
    alignSelf: "flex-start", backgroundColor: "rgba(0,0,0,0.18)",
    borderRadius: 999, color: "#fff", fontSize: 12, fontWeight: "800",
    marginBottom: 8, paddingHorizontal: 10, paddingVertical: 4,
  },
  cardTitle: { color: "#fff", fontSize: 20, fontWeight: "900" },
  progressBar: { backgroundColor: "rgba(255,255,255,0.22)", borderRadius: 999, height: 5, marginTop: 16, overflow: "hidden" },
  progressFill: { backgroundColor: "rgba(255,255,255,0.9)", borderRadius: 999, height: "100%" },
  cardAction: { alignSelf: "flex-end", color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: "800", marginTop: 10 },

  currentCard: {
    backgroundColor: "#fff", borderColor: "#e5e7eb", borderRadius: 20,
    borderWidth: 1, flexDirection: "row", marginTop: 16, overflow: "hidden",
  },
  currentLeft: { alignItems: "center", justifyContent: "center", width: 80 },
  currentIcon: { color: "#fff", fontSize: 20, fontWeight: "900" },
  currentRight: { flex: 1, padding: 18 },
  currentLabel: { fontSize: 11, fontWeight: "900", textTransform: "uppercase" },
  currentTitle: { color: "#111827", fontSize: 18, fontWeight: "900", marginTop: 4 },
  currentDesc: { color: "#6b7280", fontSize: 13, lineHeight: 20, marginTop: 6 },
  currentBtn: { alignSelf: "flex-start", borderRadius: 10, marginTop: 12, paddingHorizontal: 14, paddingVertical: 9 },
  currentBtnText: { color: "#fff", fontWeight: "900", fontSize: 13 },

  errSumCard: {
    backgroundColor: "#fff", borderRadius: 16, borderWidth: 1,
    borderColor: "#fca5a5", padding: 20, alignItems: "center", marginTop: 16,
  },
  errSumValue: { color: "#e11d48", fontSize: 40, fontWeight: "900" },
  errSumLabel: { color: "#6b7280", fontSize: 14, marginTop: 4 },

  emptyCard: {
    backgroundColor: "#fff", borderRadius: 20, borderWidth: 1,
    borderColor: "#e5e7eb", padding: 28, alignItems: "center", marginTop: 16,
  },
  emptyCardIcon: { fontSize: 36, color: "#22c55e", marginBottom: 12 },
  emptyCardTitle: { fontSize: 17, fontWeight: "900", color: "#111827", marginBottom: 6 },
  emptyCardDesc: { fontSize: 14, color: "#6b7280", textAlign: "center", lineHeight: 21 },

  errorCard: {
    backgroundColor: "#fff", borderRadius: 14, borderWidth: 1,
    borderColor: "#fca5a5", flexDirection: "row", overflow: "hidden",
  },
  errorLeft: { backgroundColor: "#fef2f2", width: 56, alignItems: "center", justifyContent: "center" },
  errorType: { color: "#e11d48", fontSize: 11, fontWeight: "900", textTransform: "uppercase" },
  errorRight: { flex: 1, padding: 14 },
  errorName: { color: "#111827", fontWeight: "700", fontSize: 15 },
  errorLesson: { color: "#6b7280", fontSize: 13, marginTop: 3 },
  errorDate: { color: "#9ca3af", fontSize: 12, marginTop: 2 },

  // ── Napredak tab ──
  pGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  pStatCard: {
    backgroundColor: "#fff", borderRadius: 14, borderWidth: 1, borderColor: "#e5e7eb",
    padding: 14, alignItems: "center", minWidth: "28%", flex: 1,
  },
  pStatVal: { fontSize: 22, fontWeight: "900", color: "#111827" },
  pStatLbl: { fontSize: 11, color: "#6b7280", fontWeight: "700", marginTop: 2 },

  pLevelCard: { backgroundColor: "#fff", borderRadius: 16, borderWidth: 1, borderColor: "#e5e7eb", padding: 16 },
  pLevelRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  pLevelLabel: { fontSize: 15, fontWeight: "900", color: "#111827" },
  pLevelNext: { fontSize: 13, color: "#6b7280", fontWeight: "700" },
  pLevelTrack: { height: 10, backgroundColor: "#e5e7eb", borderRadius: 999, overflow: "hidden" },
  pLevelFill: { height: "100%", backgroundColor: ACCENT, borderRadius: 999 },
  pLevelPct: { fontSize: 12, color: "#9ca3af", marginTop: 8, fontWeight: "600" },

  pActCard: { backgroundColor: "#fff", borderRadius: 16, borderWidth: 1, borderColor: "#e5e7eb", padding: 16 },
  pActTitle: { fontSize: 15, fontWeight: "900", color: "#111827", marginBottom: 14 },
  pActBars: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", minHeight: 80 },
  pActCol: { flex: 1, alignItems: "center", gap: 4 },
  pActVal: { fontSize: 10, color: "#6b7280", fontWeight: "700", minHeight: 14 },
  pActBar: { width: "70%", borderRadius: 4 },
  pActDay: { fontSize: 10, color: "#9ca3af", fontWeight: "700" },

  pBadgesCard: { backgroundColor: "#fff", borderRadius: 16, borderWidth: 1, borderColor: "#e5e7eb", padding: 16 },
  pBadgesTitle: { fontSize: 15, fontWeight: "900", color: "#111827", marginBottom: 14 },
  pBadgesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  pBadge: {
    backgroundColor: "#f0fdf4", borderRadius: 14, borderWidth: 1.5, borderColor: "#86efac",
    padding: 12, alignItems: "center", width: "30%", flex: 1, minWidth: "28%",
  },
  pBadgeLocked: { backgroundColor: "#f9fafb", borderColor: "#e5e7eb" },
  pBadgeIcon: { fontSize: 26, marginBottom: 4 },
  pBadgeName: { fontSize: 11, fontWeight: "900", color: "#166534", textAlign: "center" },
  pBadgeDesc: { fontSize: 10, color: "#9ca3af", textAlign: "center", marginTop: 2, lineHeight: 13 },
});
