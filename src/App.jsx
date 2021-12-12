import { useAuthState } from 'react-firebase-hooks/auth';

import './App.css';
import { auth, logout } from './firebase';
import Chat from './components/Chat'
import Login from './components/Login';
import SidePanel from './components/SidePanel';

const App = () => {

    // logged in user
    const [user] = useAuthState(auth);

    if (user) {
        return (
            <div className='app'>
                <SidePanel user={user} />
                <Chat user={user} />
                <button className='logout' onClick={logout}>Logout</button>
            </div>
        );
    }

    return (
        <div className='login'>
            <Login />
        </div>
    );
}

export default App;
