import { createContext, useEffect, useState, type ReactNode } from "react";
import authService from "../services/index.services";
import BookloopSpinner from "../components/BookLoopSpinner";

// Context Component => shared the context with the app
type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;

  loggedUserId: number | null;
  setLoggedUserId: React.Dispatch<React.SetStateAction<number | null>>;

  userRole: string | null;
  setUserRole: React.Dispatch<React.SetStateAction<string | null>>;

  verifyUser: () => Promise<void>;
};

type AuthWrapperProps = {
  children: ReactNode;
};


const AuthContext = createContext<AuthContextType | null>(null);

// Wrapper Component => holds the states and functions to be shared 
const AuthWrapper = ({ children }: AuthWrapperProps) => {
    // add states and functions here
    const [ isLoggedIn, setIsLoggedIn ] = useState<boolean>(false)
    const [ loggedUserId, setLoggedUserId ] = useState<number | null>(null)
    const [ userRole, setUserRole ] = useState<string | null>(null)
    const [ isVerifyingUser, setIsVerifyingUser ] = useState<boolean>(true)

    const verifyUser = async() => {
        // send token to the BE to verify it
        const  authToken = localStorage.getItem("authToken")
        try {
            
            if (!authToken) {
                setIsLoggedIn(false)
                setLoggedUserId(null)
                setUserRole(null)
                setIsVerifyingUser(false)
                return
            }
            const response = await authService.get("/auth/verify")
            
            console.log("verify", response.data)
            setIsLoggedIn(true)
            setLoggedUserId(response.data.id)
            // setUserRole(response.data.payload.role)
            setIsVerifyingUser(false)
        } catch(error) {
            setIsLoggedIn(false)
            setLoggedUserId(null)
            setUserRole(null)
            setIsVerifyingUser(false)
        } 
    }

    useEffect(() => {
        verifyUser()
    }, [])

    const passedContext = {
        isLoggedIn,
        setIsLoggedIn,
        loggedUserId,
        setLoggedUserId,
        userRole,
        setUserRole,
        verifyUser,
    }

    if(isVerifyingUser) {
        return <BookloopSpinner label="Verifying your session" />
    }

    return (
        <AuthContext.Provider value={passedContext}>
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthContext,
    AuthWrapper
}