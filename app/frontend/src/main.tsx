import { createRoot } from "react-dom/client"
import App from "./App"

console.log("✅ main.tsx cargado")

const root = document.getElementById("root")

if (!root) {
  throw new Error("❌ No existe #root")
}

console.log("✅ renderizando App")

createRoot(root).render(<App />)