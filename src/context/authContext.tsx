import { createContext, useMemo, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { useAuth, type User, type InvalidFieldToComponent} from '@hooks';
import { SignupData } from '../components/index.componentTypes';

type SignupFormData = SignupData.FormData;

interface Props {
    children: ReactNode;
}
type Value = [User, Dispatch<SetStateAction<User>>, (username: string, password: string) => Promise<InvalidFieldToComponent | number>, () => Promise<void>, (signupFormData: SignupFormData) => Promise<InvalidFieldToComponent | number>, (username: string) => Promise<number>];

const AuthContext = createContext<Value | null>(null);

function AuthProvider ({children}: Props) {
    const [ user, setUser, login, logout, signup, checkUsername ] = useAuth();
    const memoizedUser = useMemo<Value>(() => ([user, setUser, login, logout, signup, checkUsername]), [user]);

    return (
        <AuthContext.Provider value={memoizedUser}>
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider,
    AuthContext
}