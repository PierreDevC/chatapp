// ============================================================
// Sidebar.js — Panneau latéral avec la liste des utilisateurs
// ============================================================

import React, { useState, useEffect } from "react";
// 🔹 useSocket pour s'abonner à activity_log
import { useSocket } from "../context/SocketContext";

function Sidebar({ users, room, show, onClose }) {
    // 🔹 Récupération du socket via le Context
    const socket = useSocket();

    // historique des 5 derniers évènements de connexion/déconnexion
    const [activityLog, setActivityLog] = useState([]);

    // ----------------------------------------------------------
    // useEffect : Abonnement à l'évènement activity_log
    // Persiste même après déconnexion d'un utilisateur
    // ----------------------------------------------------------
    useEffect(() => {
        const handleActivityLog = (event) => {
            setActivityLog((prev) => {
                const updated = [event, ...prev];
                // 🔹 On garde uniquement les 5 derniers évènements
                return updated.slice(0, 5);
            });
        };

        socket.on("activity_log", handleActivityLog);

        return () => {
            socket.off("activity_log", handleActivityLog);
        };
    }, [socket]);

    return (
        <>
            {/* Fond semi-transparent quand la sidebar est ouverte (mobile) */}
            {show && <div className="sidebarOverlay" onClick={onClose} />}

            <div className={`sidebar ${show ? "open" : ""}`}>
                <div className="sidebarHeader">
                    <h4>#{room}</h4>
                    <button className="closeSidebar" onClick={onClose}>✕</button>
                </div>

                <div className="sidebarSection">
                    {/* ---- Liste des participants connectés ---- */}
                    <p className="sidebarLabel">
                        PARTICIPANTS ({users.length})
                    </p>

                    {/* 🔹 Afficher chaque utilisateur avec son initiale */}
                    {users.length > 0 ? (
                        users.map((u) => (
                            <div className="userItem" key={u.socketId}>
                                <div className="userAvatar">
                                    {u.username.charAt(0).toUpperCase()}
                                </div>
                                <span>{u.username}</span>
                                {/* Point vert = en ligne */}
                                <span className="onlineDot" />
                            </div>
                        ))
                    ) : (
                        <p className="noUsers">Aucun utilisateur</p>
                    )}

                    {/* ---- Historique d'activité ---- */}
                    {/* contrairement à room_users, cet historique
                        persiste après déconnexion d'un utilisateur */}
                    <div className="activitySection">
                        <p className="sidebarLabel">ACTIVITÉ RÉCENTE</p>
                        {activityLog.length === 0 ? (
                            <p className="noUsers">Aucune activité</p>
                        ) : (
                            activityLog.map((event, index) => (
                                <div className="activityItem" key={index}>
                                    {/* Format : "Alice a rejoint #Generale à 14:30" */}
                                    <span className="activityText">
                                        <strong>{event.username}</strong> {event.action} <strong>#{event.room}</strong>
                                    </span>
                                    <span className="activityTime">à {event.time}</span>
                                </div>
                            ))
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}

export default Sidebar;