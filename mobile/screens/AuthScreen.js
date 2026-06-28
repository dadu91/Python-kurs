import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { request } from "../utils/api";
import { ACCENT } from "../theme";

export default function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mail, setMail] = useState("");
  const [loading, setLoading] = useState(false);
  const isLogin = mode === "login";

  async function submit() {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Nedostaju podaci", "Unesi korisničko ime i lozinku.");
      return;
    }
    if (!isLogin && !mail.trim()) {
      Alert.alert("Nedostaje email", "Unesi email adresu.");
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        const data = await request("/auth/login", {
          method: "POST",
          body: `username=${encodeURIComponent(username.trim())}&password=${encodeURIComponent(password)}`,
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          skipJsonHeader: true,
        });
        onLogin({ token: data.access_token || data.token, username: username.trim() });
      } else {
        await request("/korisnik/", {
          method: "POST",
          body: JSON.stringify({ username: username.trim(), mail: mail.trim(), password }),
        });
        Alert.alert("Nalog je kreiran", "Sada se možeš prijaviti.");
        setMode("login");
      }
    } catch (error) {
      Alert.alert("Greška", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={s.page}>
      <StatusBar barStyle="light-content" />
      <View style={s.card}>
        <Text style={s.brand}>
          Python <Text style={{ color: ACCENT }}>kurs</Text>
        </Text>
        <Text style={s.title}>{isLogin ? "Prijava" : "Registracija"}</Text>
        <Text style={s.sub}>
          {isLogin ? "Prijavi se na svoj nalog" : "Napravi nalog za mobilno učenje"}
        </Text>

        <View style={s.form}>
          <TextInput
            autoCapitalize="none"
            placeholder="Korisničko ime"
            placeholderTextColor="#9ca3af"
            style={s.input}
            value={username}
            onChangeText={setUsername}
          />
          {!isLogin && (
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Email"
              placeholderTextColor="#9ca3af"
              style={s.input}
              value={mail}
              onChangeText={setMail}
            />
          )}
          <TextInput
            placeholder="Lozinka"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            style={s.input}
            value={password}
            onChangeText={setPassword}
          />

          <Pressable style={[s.btn, { backgroundColor: ACCENT }]} onPress={submit} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.btnText}>{isLogin ? "Prijavi se" : "Registruj se"}</Text>
            }
          </Pressable>

          <Pressable style={s.link} onPress={() => setMode(isLogin ? "register" : "login")}>
            <Text style={[s.linkText, { color: ACCENT }]}>
              {isLogin ? "Nemaš nalog? Registruj se" : "Već imaš nalog? Prijavi se"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, justifyContent: "center", backgroundColor: "#4f46e5", padding: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 26,
    paddingVertical: 34,
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 7,
  },
  brand: { fontSize: 24, fontWeight: "800", color: "#333", marginBottom: 20 },
  title: { fontSize: 34, fontWeight: "900", color: "#111", marginBottom: 6 },
  sub: { fontSize: 15, color: "#6b7280", marginBottom: 24 },
  form: { gap: 12 },
  input: {
    backgroundColor: "#f9fafb",
    borderColor: "#e5e7eb",
    borderRadius: 14,
    borderWidth: 1,
    color: "#111827",
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  btn: {
    alignItems: "center",
    borderRadius: 14,
    minHeight: 50,
    justifyContent: "center",
    marginTop: 6,
    elevation: 4,
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  link: { alignItems: "center", padding: 12 },
  linkText: { fontWeight: "700" },
});
