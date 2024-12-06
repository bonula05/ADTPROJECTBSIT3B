import { useState, useRef, useCallback, useEffect } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../util/hooks/useDebounce';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const userInputDebounce = useDebounce({ email, password }, 2000);
  const [debounceState, setDebounceState] = useState(false);
  const [status, setStatus] = useState('idle');
  
  const navigate = useNavigate();

  const handleShowPassword = useCallback(() => {
    setIsShowPassword(prev => !prev);
  }, []);

  const handleOnChange = (event, type) => {
    setDebounceState(false);
    setIsFieldsDirty(true);

    if (type === 'email') setEmail(event.target.value);
    else if (type === 'password') setPassword(event.target.value);
  };

  const handleLogin = async () => {
    try {
      setStatus('loading');
      const { data } = await axios.post('/admin/login', { email, password });
      localStorage.setItem('accessToken', data.access_token);
      navigate('/main/movies');
      setStatus('idle');
    } catch (error) {
      console.error(error);
      setStatus('idle');
    }
  };

  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  return (
    <div className="Login">
      <div className="main-container">
        <h3>Sign In</h3>
        <form>
          <div className="form-container">
            <div>
              <div className="form-group">
                <label>E-mail:</label>
                <input
                  type="text"
                  name="email"
                  ref={emailRef}
                  onChange={(e) => handleOnChange(e, 'email')}
                />
              </div>
              {debounceState && isFieldsDirty && !email && (
                <span className="errors">This field is required</span>
              )}
            </div>
            <div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type={isShowPassword ? 'text' : 'password'}
                  name="password"
                  ref={passwordRef}
                  onChange={(e) => handleOnChange(e, 'password')}
                />
              </div>
              {debounceState && isFieldsDirty && !password && (
                <span className="errors">This field is required</span>
              )}
            </div>
            <div className="show-password" onClick={handleShowPassword}>
              {isShowPassword ? 'Hide' : 'Show'} Password
            </div>

            <div className="submit-container">
              <button
                className="btn-primary"
                type="button"
                disabled={status === 'loading'}
                onClick={() => {
                  if (status === 'loading') return;

                  if (email && password) {
                    setStatus('loading');
                    setTimeout(handleLogin, 2000);
                  } else {
                    setIsFieldsDirty(true);
                    if (!email) emailRef.current.focus();
                    if (!password) passwordRef.current.focus();
                  }
                }}
              >
                {status === 'idle' ? 'Login' : 'Wait...'}
              </button>
            </div>
            <div className="register-container">
              <small>Don't have an account? </small>
              <a href="/register">
                <small>Register</small>
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
