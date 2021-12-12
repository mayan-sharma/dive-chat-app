import { useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import { ref, set, push, onValue } from 'firebase/database';

import { db } from '../firebase';

const Chat = ({ user }) => {
    
    const chatId = useLocation().pathname.substr(1);
    const chatRef = ref(db, 'chats/' + chatId); 

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([])
    
    useEffect(() => {
        onValue(chatRef, snap => {
            if (snap.val()) {
                setMessages(Object.values(snap.val()))
                updateMessages();
            }
        })
    }, [chatId])

    const updateMessages = () => {
        // update status to read when chat is opened
        onValue(chatRef, snap => {
            if (snap.val()) {
                setMessages(Object.keys(snap.val()).map(messageId => {
                    const message = snap.val()[messageId];
                    if (message.reciever === user.uid && message.status === 'delivered') {
                        message.status = 'read';
                        set(ref(db, 'chats/' + chatId + '/' + messageId), {
                            ...message,
                            status: 'read'
                        });
                    }

                    return message;
                }))
            }
        });
    }

    const sendMessage = () => {
        const sendRef = push(chatRef);
        set(sendRef, {
            content: message,
            sender: user.uid,
            senderName: user.displayName,
            reciever: chatId.split('-').find(id => id !== user.uid) || user.uid,
            status: 'sent'
        })
    }

    const showMessages = () => (
        messages.map(message => (
            <div key={message.content} className='message'>
                <p>{message.content} - <sub>{message.senderName}</sub></p>
                <p>{message.status}</p>
            </div>
        ))
    )

    return (
        <div className='chat'>
            {showMessages()}
            <div className='input'>
                <input 
                    type='text' 
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}

export default Chat;