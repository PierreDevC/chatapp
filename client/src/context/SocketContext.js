// SocketContext.js
import React, { createContext, useContext } from "react";
import io from "socket.io-client";

const SocketContext = createContext(null);

// 🔑 LA CLÉ DU CORRECTIF :
// Le socket est créé ICI, au niveau du MODULE, complètement en dehors de React.
// Ainsi React StrictMode (qui monte/démonte les composants 2x) ne peut PAS le détruire.
// Chaque onglet du navigateur charge son propre module → chaque onglet a son propre socket.

// 🔹 PRODUCTION + DEV LOCAL 🔹
// En production (Vercel), REACT_APP_SERVER_URL pointe vers le backend Render.
// En local, le fallback utilise localhost ou l'IP réseau pour tests téléphone.
const SERVER_URL =
    process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

const socket = io(SERVER_URL, { autoConnect: false });

// ────────────────
// PROVIDER REACT
// ────────────────
export function SocketProvider({ children }) {
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}

// ────────────────
// HOOK UTILITAIRE
// ────────────────
export function useSocket() {
    return useContext(SocketContext);
}