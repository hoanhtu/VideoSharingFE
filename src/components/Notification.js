import React, { useEffect, useState } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [popupMessage, setPopupMessage] = useState('');

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = Stomp.over(socket);
        stompClient.connect({}, (frame) => {
            stompClient.subscribe('/topic/notifications', (message) => {
                if (message.body) {
                    const parsedMessage = JSON.parse(message.body);
                    if(parsedMessage.userId!=sessionStorage.getItem('uid')){
                        setNotifications((prev) => [...prev, parsedMessage.message]);
                        setPopupMessage(parsedMessage.message); // Set the popup message
                    }
                }
            });
        });

        return () => {
            stompClient.disconnect();
        };
    }, []);

    const closePopup = () => {
        setPopupMessage(''); // Close the popup
    };

    return (
        <div className="notification">
            {popupMessage && (
                <div className="popup" style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', border: '1px solid black', zIndex: 1000 }}>
                    <p>{popupMessage}</p>
                    <button onClick={closePopup}>Close</button>
                </div>
            )}
        </div>
    );
};

export default Notification;