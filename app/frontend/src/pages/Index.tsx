import { useState } from "react"
import { Plane, LogOut, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth"
import Login from "./Login"

export default function Index() {
  const auth = useAuth()
  const [tab, setTab] = useState<"home">("home")

  if (auth.loading) {
    return (
      <div style={{ padding: 40 }}>
        <Loader2 /> Cargando sesión…
      </div>
    )
  }

  if (!auth.user) {
    return <Login onLogin={auth.login} />
  }

  return (
    <div style={{ padding: 40 }}>
      <header style={{ marginBottom: 20 }}>
        <Plane />
        <h1>Skyfree Shop</h1>
        <button onClick={auth.logout}>
          <LogOut /> Salir
        </button>
      </header>

      <main>
        <h2>✅ La aplicación ya renderiza correctamente</h2>
        <p>
          Si ves este mensaje, React, Vite, rutas y Auth están funcionando.
        </p>
      </main>
    </div>
  )
}