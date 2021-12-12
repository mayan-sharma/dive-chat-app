import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useList } from 'react-firebase-hooks/database';
import { ref, onValue, onDisconnect, set } from 'firebase/database';

import { db, getChatId } from '../firebase';

const SidePanel = ({ user }) => {

    const usersRef = ref(db, 'users');
    const activeUsersRef = ref(db, 'activeUsers'); 
    const connectedRef = ref(db, '.info/connected');

    const [users, setUsers] = useState([]);
    const [usersSnap, loading] = useList(usersRef);

    useEffect(() => {
        // store active users
        onValue(connectedRef, snap => {
            if (snap.val()) {
                set(ref(db, 'activeUsers/' + user.uid), true);
                // updating messages status
                updateMessages();

                onDisconnect(ref(db, 'activeUsers/' + user.uid)).remove();
                // updating users to add status property
                updateUsers();
            }
        });
    }, [loading]);

    const updateUsers = () => {
        onValue(activeUsersRef, snap => {
            if (snap.val()) {
                setUsers(usersSnap.map(userObj => ({
                    ...userObj.val(),
                    status: Object.keys(snap.val()).includes(userObj.val().userId) ? 'online' : 'offline'
                })));
            }
        })
    }

    const updateMessages = () => {
        onValue(ref(db, 'chats/'), snap => {
            if (snap.val()) {
                Object.keys(snap.val()).map(threadId => {
                    Object.keys(snap.val()[threadId]).map(messageId => {
                        const message = snap.val()[threadId][messageId];
                        if (message.reciever === user.uid && message.status === 'sent') {
                            set(ref(db, 'chats/' + threadId + '/' + messageId), {
                                ...message,
                                status: 'delivered'
                            })
                        }
                    })
                });
            }
        })
    }

    return (
        <div className='sidepanel'>
            <h3>Users</h3>
            {users.map(_user => 
                <div className='sidepanel-user' key={_user.userId}>
                    <Link to={getChatId(_user.userId, user.uid)}>{_user.name}</Link>
                    <sub>{_user.status}</sub>
                </div>
            )}
        </div>
    );
}

export default SidePanel;