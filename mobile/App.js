import { useState } from "react";
import AuthScreen from "./screens/AuthScreen";
import DashboardScreen from "./screens/DashboardScreen";

export default function App() {
  const [session, setSession] = useState(null);

  if (!session?.token) {
    return <AuthScreen onLogin={setSession} />;
  }

  return <DashboardScreen session={session} onLogout={() => setSession(null)} />;
}
