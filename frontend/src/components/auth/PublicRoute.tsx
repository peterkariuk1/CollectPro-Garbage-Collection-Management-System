import { Navigate } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../../../firebase.ts"
import { useEffect, useRef, useState } from "react"

export function PublicRoute({ children }) {
  const [checking, setChecking] = useState(true)
  const [user, setUser] = useState(null)
  const hasResolved = useRef(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (!hasResolved.current) {
        hasResolved.current = true
        setUser(firebaseUser)
        setChecking(false)
      }
    })

    return () => unsub()
  }, [])

  if (checking) return null

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
