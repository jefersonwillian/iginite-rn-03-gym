import { UserDTO } from "@dtos/UserDTO";
import { ReactNode, createContext, useState } from "react";

export type AuthContextDataProps = {
    user: UserDTO;
    singIn: (email: string, password: string) => void;
}

type AuthContextProviderProps = {
    children: ReactNode
}


export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextProviderProps) {

    function singIn(email: string, password: string) {
        setUser({
            id: '',
            name: '',
            email,
            avatar: '',
        })
    }

    const [user, setUser] = useState({
        id: '1',
        name: 'Jeferson Carvalho',
        email: 'jeferson@email.com',
        avatar: 'jeferson.png'
    })
    
    return (
        <AuthContext.Provider value={{ user, singIn }}>
            {children}
        </AuthContext.Provider>
    )
}