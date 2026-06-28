import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { request } from "../utils/api";
import { ACCENT } from "../theme";

export default function ProfileScreen({
  korisnik, stats, token,
  completedCount, totalLessons, tacni, netacni,
  onBack, onLogout, onKorisnikUpdate,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(korisnik?.username || "");
  const [editMail, setEditMail] = useState(korisnik?.mail || "");
  const [editPassword, setEditPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const ukupno = tacni + netacni;
  const tacnostPct = ukupno > 0 ? Math.round((tacni / ukupno) * 100) : 0;
  const bodoviZaNivo = stats.nivo * 100;
  const progresNivo = bodoviZaNivo > 0
    ? Math.min(Math.round(((stats.bodovi % bodoviZaNivo) / bodoviZaNivo) * 100), 100)
    : 0;
  const initial = (korisnik?.username || "P")[0].toUpperCase();

  const saveProfile = async () => {
    if (!editUsername.trim()) {
      Alert.alert("Greška", "Korisničko ime ne smije biti prazno.");
      return;
    }
    setSaving(true);
    try {
      const body = { username: editUsername.trim(), mail: editMail.trim() };
      if (editPassword.trim()) body.password = editPassword.trim();
      const updated = await request(`/korisnik/${korisnik.id}`, {
        method: "PUT", token,
        body: JSON.stringify(body),
      });
      onKorisnikUpdate(updated);
      setIsEditing(false);
      setEditPassword("");
      Alert.alert("Sačuvano", "Profil je uspješno ažuriran.");
    } catch (e) {
      Alert.alert("Greška", e.message);
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditUsername(korisnik?.username || "");
    setEditMail(korisnik?.mail || "");
    setEditPassword("");
    setIsEditing(false);
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" />

      {/* Top bar */}
      <View style={s.topbar}>
        <Pressable style={s.backBtn} onPress={onBack}>
          <Text style={[s.backBtnText, { color: ACCENT }]}>← Nazad</Text>
        </Pressable>
        <Text style={s.topTitle}>Profil</Text>
        <View style={{ width: 70 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll}>

        {/* Avatar + name */}
        <View style={s.header}>
          <View style={[s.avatar, { backgroundColor: ACCENT }]}>
            <Text style={s.avatarText}>{initial}</Text>
          </View>
          <Text style={s.name}>{korisnik?.username || ""}</Text>
          <Text style={s.mail}>{korisnik?.mail || ""}</Text>
        </View>

        {/* Level progress bar */}
        <View style={s.levelCard}>
          <View style={s.levelRow}>
            <Text style={s.levelLabel}>Nivo {stats.nivo}</Text>
            <Text style={s.levelPct}>{progresNivo}%</Text>
            <Text style={s.levelNext}>Nivo {stats.nivo + 1}</Text>
          </View>
          <View style={s.levelTrack}>
            <View style={[s.levelFill, { width: `${progresNivo}%` }]} />
          </View>
          <Text style={s.levelSub}>{stats.bodovi} bodova ukupno</Text>
        </View>

        {/* Stats */}
        <View style={s.statsRow}>
          {[
            { val: stats.bodovi, lbl: "Bodovi" },
            { val: `${completedCount}/${totalLessons}`, lbl: "Lekcije" },
            { val: tacni, lbl: "Tačni" },
            { val: `${tacnostPct}%`, lbl: "Tačnost" },
          ].map((item) => (
            <View key={item.lbl} style={s.statCard}>
              <Text style={s.statVal}>{item.val}</Text>
              <Text style={s.statLbl}>{item.lbl}</Text>
            </View>
          ))}
        </View>

        {/* Edit profile */}
        <View style={s.editCard}>
          <View style={s.editHeader}>
            <Text style={s.editTitle}>Podaci naloga</Text>
            {!isEditing && (
              <Pressable style={s.editBtn} onPress={() => setIsEditing(true)}>
                <Text style={[s.editBtnTxt, { color: ACCENT }]}>Uredi</Text>
              </Pressable>
            )}
          </View>

          {!isEditing ? (
            <View style={s.infoRows}>
              <View style={s.infoRow}>
                <Text style={s.infoLbl}>Korisničko ime</Text>
                <Text style={s.infoVal}>{korisnik?.username}</Text>
              </View>
              <View style={s.infoRow}>
                <Text style={s.infoLbl}>Email</Text>
                <Text style={s.infoVal}>{korisnik?.mail}</Text>
              </View>
              <View style={s.infoRow}>
                <Text style={s.infoLbl}>Lozinka</Text>
                <Text style={s.infoVal}>••••••••</Text>
              </View>
            </View>
          ) : (
            <View style={s.form}>
              <Text style={s.fieldLbl}>Korisničko ime</Text>
              <TextInput
                style={s.input}
                value={editUsername}
                onChangeText={setEditUsername}
                autoCapitalize="none"
                placeholderTextColor="#9ca3af"
              />
              <Text style={s.fieldLbl}>Email</Text>
              <TextInput
                style={s.input}
                value={editMail}
                onChangeText={setEditMail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor="#9ca3af"
              />
              <Text style={s.fieldLbl}>Nova lozinka (ostavi prazno za bez promjene)</Text>
              <TextInput
                style={s.input}
                value={editPassword}
                onChangeText={setEditPassword}
                secureTextEntry
                placeholder="Nova lozinka..."
                placeholderTextColor="#9ca3af"
              />
              <View style={s.formActions}>
                <Pressable style={s.cancelBtn} onPress={cancelEdit}>
                  <Text style={s.cancelTxt}>Otkaži</Text>
                </Pressable>
                <Pressable
                  style={[s.saveBtn, { backgroundColor: ACCENT }]}
                  onPress={saveProfile}
                  disabled={saving}
                >
                  {saving
                    ? <ActivityIndicator color="#fff" size="small" />
                    : <Text style={s.saveTxt}>Sačuvaj</Text>
                  }
                </Pressable>
              </View>
            </View>
          )}
        </View>

        {/* Logout */}
        <Pressable style={s.logoutBtn} onPress={() => {
          Alert.alert("Odjava", "Jesi li siguran da se želiš odjaviti?", [
            { text: "Otkaži", style: "cancel" },
            { text: "Odjavi se", style: "destructive", onPress: onLogout },
          ]);
        }}>
          <Text style={s.logoutTxt}>Odjavi se</Text>
        </Pressable>

      </ScrollView>
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
  backBtn: { backgroundColor: "#f3f4f6", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7, width: 70 },
  backBtnText: { fontSize: 14, fontWeight: "700" },
  topTitle: { fontSize: 17, fontWeight: "900", color: "#111827" },

  scroll: { padding: 20, paddingBottom: 40 },

  header: { alignItems: "center", paddingVertical: 24 },
  avatar: { width: 84, height: 84, borderRadius: 42, alignItems: "center", justifyContent: "center", marginBottom: 14 },
  avatarText: { color: "#fff", fontSize: 36, fontWeight: "900" },
  name: { fontSize: 24, fontWeight: "900", color: "#111827" },
  mail: { fontSize: 14, color: "#6b7280", marginTop: 4 },

  levelCard: { backgroundColor: "#fff", borderRadius: 16, borderWidth: 1, borderColor: "#e5e7eb", padding: 16, marginBottom: 14 },
  levelRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  levelLabel: { fontSize: 15, fontWeight: "900", color: "#111827" },
  levelPct: { fontSize: 13, fontWeight: "700", color: ACCENT },
  levelNext: { fontSize: 13, color: "#6b7280", fontWeight: "700" },
  levelTrack: { height: 10, backgroundColor: "#e5e7eb", borderRadius: 999, overflow: "hidden" },
  levelFill: { height: "100%", backgroundColor: ACCENT, borderRadius: 999 },
  levelSub: { fontSize: 12, color: "#9ca3af", marginTop: 8, fontWeight: "600" },

  statsRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  statCard: {
    backgroundColor: "#fff", borderRadius: 14, borderWidth: 1, borderColor: "#e5e7eb",
    padding: 12, alignItems: "center", flex: 1,
  },
  statVal: { fontSize: 18, fontWeight: "900", color: "#111827" },
  statLbl: { fontSize: 11, color: "#6b7280", fontWeight: "700", marginTop: 2 },

  editCard: { backgroundColor: "#fff", borderRadius: 16, borderWidth: 1, borderColor: "#e5e7eb", padding: 16, marginBottom: 14 },
  editHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  editTitle: { fontSize: 16, fontWeight: "900", color: "#111827" },
  editBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "#f0f4ff", borderRadius: 8 },
  editBtnTxt: { fontWeight: "800", fontSize: 13 },

  infoRows: { gap: 10 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  infoLbl: { color: "#6b7280", fontSize: 14 },
  infoVal: { color: "#111827", fontSize: 14, fontWeight: "600" },

  form: { gap: 8 },
  fieldLbl: { fontSize: 12, fontWeight: "700", color: "#374151", marginTop: 4 },
  input: {
    backgroundColor: "#f9fafb", borderColor: "#e5e7eb", borderRadius: 12, borderWidth: 1,
    color: "#111827", fontSize: 15, paddingHorizontal: 14, paddingVertical: 12,
  },
  formActions: { flexDirection: "row", gap: 10, marginTop: 6 },
  cancelBtn: { flex: 1, backgroundColor: "#f3f4f6", borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  cancelTxt: { color: "#374151", fontWeight: "700", fontSize: 14 },
  saveBtn: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  saveTxt: { color: "#fff", fontWeight: "800", fontSize: 14 },

  logoutBtn: {
    backgroundColor: "#fff", borderRadius: 16, borderWidth: 1.5, borderColor: "#fca5a5",
    paddingVertical: 16, alignItems: "center",
  },
  logoutTxt: { color: "#e11d48", fontWeight: "800", fontSize: 15 },
});
