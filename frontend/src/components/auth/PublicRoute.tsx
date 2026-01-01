import { Navigate } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../../../firebase.ts"
import { useEffect, useState } from "react"

export function PublicRoute({ children }) {
  const [checking, setChecking] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setChecking(false)
    })

    return () => unsub()
  }, [])

  if (checking) return null

  if (user) {
    // 🔥 replace: true prevents back navigation
    return <Navigate to="/dashboard" replace />
  }

  return children
}
