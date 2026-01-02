import { Navigate, Outlet, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import loaderSVG from "../../assets/loader.svg";
import Loader from "../system/Loader";

export function ProtectedRoute({ allowedRoles }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(firebaseUser);

      if (allowedRoles) {
        const ref = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(ref);
        setRole(snap.exists() ? snap.data().role : null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, [allowedRoles]);

  if (loading)
    return (
     <Loader/>
    );

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
