import { UserDTO } from "@dtos/UserDTO";
import { api } from "@services/api";
import { storageAuthTokenSave } from "@storage/storageAuthToken";
import { storageUserGet, storageUserRemove, storageUserSave } from "@storage/storageUser";
import { ReactNode, createContext, useEffect, useState } from "react";

export type AuthContextDataProps = {
    user: UserDTO;
    singIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    isLoadingUserStorageData: boolean;
}

type AuthContextProviderProps = {
    children: ReactNode
}


export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
    const [user, setUser] = useState<UserDTO>({} as UserDTO);
    const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true); 

    async function storageUserAndToken(userData: UserDTO, token: string) {

        try {
            setIsLoadingUserStorageData(true);

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            await storageUserSave(userData);
            await storageAuthTokenSave(token);
            setUser(userData);
        } catch (error) {
            throw error
        } finally {
            setIsLoadingUserStorageData(false);
        }

    }
    
    async function singIn(email: string, password: string) {
        try {
            const { data } = await api.post('/sessions', { email, password });
            console.log("🚀 ~ file: AuthContext.tsx:46 ~ singIn ~ data:", data)

            if (data.user && data.token) {
                storageUserAndToken(data.user, data.token);
            }
        } catch (error) {
            throw error
        } 
    }

    async function signOut() {
        try {
            setIsLoadingUserStorageData(true);
            setUser({} as UserDTO);
            await storageUserRemove();
        } catch (error) {
            throw error;
        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    async function loadUserData() {
       try {
           const userLogged = await storageUserGet();

           if (userLogged) {
               setUser(userLogged)
           }
       } catch (error) {
           throw error
       } finally {
           setIsLoadingUserStorageData(false);
       }
    }

    useEffect(() => {
        loadUserData()
    }, [])
    
    
    
    return (
        <AuthContext.Provider value={{ user, singIn, isLoadingUserStorageData, signOut, }}>
            {children}
        </AuthContext.Provider>
    )
}