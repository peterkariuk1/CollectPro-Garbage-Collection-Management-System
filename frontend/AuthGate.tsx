import { useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./firebase"

const PUBLIC_ROUTES = ["/", "/login"]

export function AuthGate({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const hasRedirected = useRef(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (
        user &&
        PUBLIC_ROUTES.includes(location.pathname) &&
        !hasRedirected.current
      ) {
        hasRedirected.current = true
        navigate("/dashboard", { replace: true })
      }
    })

    return () => unsub()
  }, []) // ✅ EMPTY dependency array

  return children
}
