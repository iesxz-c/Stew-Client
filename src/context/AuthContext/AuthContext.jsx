import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios'; // Make sure to import axios here

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await axios.get('/api/user'); // Adjust the API endpoint as needed
                setUserId(response.data.id); // Assuming the response contains an ID
            } catch (error) {
                console.error("Error fetching user ID:", error);
            }
        };

        fetchUserId();
    }, []);

    return (
        <AuthContext.Provider value={{ userId }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
