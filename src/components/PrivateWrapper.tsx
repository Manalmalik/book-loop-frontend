import { Navigate } from "react-router-dom"
import { useAuth } from "../context/useAuth"
import type { ReactNode } from "react"


type PrivateWrapperProps = {
  children: ReactNode;
};

function PrivateWrapper({children}: PrivateWrapperProps) {
    const { isLoggedIn } = useAuth()

    if(isLoggedIn) {
        return children
    } else {
        return <Navigate to="/login" />
    }
}

export default PrivateWrapper
