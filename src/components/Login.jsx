import { loginWithGoogle } from '../firebase';

const Login = () => {
    return (
        <div className='login'>
            <button onClick={loginWithGoogle}>Sign In</button>
        </div>
    );
}

export default Login;