import { useState, useContext, createContext, useEffect } from 'react';
import axios from 'axios';

// auth stuff see https://reactrouter.com/web/example/auth-workflow
// and https://usehooks.com/useAuth/

function useProvideAuth() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (localStorage.getItem('user') !== null) {
            setUser(JSON.parse(localStorage.getItem('user')));
        }
    }, []);

    const signIn = (email, password) => new Promise(async (resolve, reject) => {
        try {
            // In the future we want to encrypt password before sending
            const response = await axios.post('api/users/login', { email, password });
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            resolve(response);
        } catch (err) {
            console.error(err);
            reject(err);
        }
    });

    const signOut = callback => {
        setUser(null);
        localStorage.removeItem('user');
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