import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./firebase.ts"

const PUBLIC_ROUTES = ["/", "/login"]

export function AuthGate({ children }) {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && PUBLIC_ROUTES.includes(location.pathname)) {
        navigate("/dashboard", { replace: true })
      }
    })

    return () => unsub()
  }, [location.pathname, navigate])

  return children
}
