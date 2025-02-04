// @ts-ignore
import React from "react"
// @ts-ignore
import ReactDOM from "react-dom/client"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import App from "./App"
import "./index.css"
import { Toaster } from "@/components/ui/sonner"
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="chat/:chatId" element={<App />} />
        </Route>
      </Routes>
    </Router>
    <Toaster position="bottom-right" richColors/>
  </React.StrictMode>,
)

