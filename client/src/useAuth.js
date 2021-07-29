import { useState, useContext, createContext } from 'react';
import axios from 'axios';

// auth stuff see https://reactrouter.com/web/example/auth-workflow
// and https://usehooks.com/useAuth/

function useProvideAuth() {
    const [user, setUser] = useState(null);

    const signIn = (email, password) => new Promise(async (resolve, reject) => {
        try {
            // In the future we want to encrypt password before sending
            const response = await axios.post('api/users/login', { email, password });
            setUser(response.data);
            resolve(response);
        } catch (err) {
            console.error(err);
            reject(err);
        }
    });

    const signOut = callback => {
        setUser(null);
        if (callback) callback();
    };

    return { user, signIn, signOut };
}

export function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    return (
      <authContext.Provider value={auth}>
        {children}
      </authContext.Provider>
    );
}

const authContext = createContext();

export const useAuth = () => {
    return useContext(authContext);
}