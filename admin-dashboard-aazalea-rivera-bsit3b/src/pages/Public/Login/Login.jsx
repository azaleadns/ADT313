import { useState, useRef, useCallback, useEffect } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../utils/hooks/useDebounce';
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
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleShowPassword = useCallback(() => {
    setIsShowPassword((prev) => !prev);
  }, []);

  const handleOnChange = (event, type) => {
    setDebounceState(false);
    setIsFieldsDirty(true);

    if (type === 'email') {
      setEmail(event.target.value);
    } else if (type === 'password') {
      setPassword(event.target.value);
    }
  };

  const handleLogin = async () => {
    const data = { email, password };
    setStatus('loading');

    try {
      const res = await axios.post('/admin/login', data, {
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
      localStorage.setItem('accessToken', res.data.access_token);
      navigate('/main/movies');
      setStatus('idle');
    } catch (e) {
      setError(e.response.data.message);
      alert(e.response.data.message);
      setStatus('idle');
    }
  };

  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  return (
    <div className='Login'>
      <div className='main-container'>
        <form>
          <div className='form-container'>
            <h3>Login</h3>

            {error && <span className='login errors'>{error}</span>}
            
            <div className='form-group'>
              <label>E-mail:</label>
              <input
                type='text'
                name='email'
                ref={emailRef}
                onChange={(e) => handleOnChange(e, 'email')}
              />
              {debounceState && isFieldsDirty && email === '' && (
                <span className='errors'>This field is required</span>
              )}
            </div>

            <div className='form-group'>
              <label>Password:</label>
              <input
                type={isShowPassword ? 'text' : 'password'}
                name='password'
                ref={passwordRef}
                onChange={(e) => handleOnChange(e, 'password')}
              />
              {debounceState && isFieldsDirty && password === '' && (
                <span className='errors'>This field is required</span>
              )}
            </div>

            <div className='show-password' onClick={handleShowPassword}>
              {isShowPassword ? 'Hide' : 'Show'} Password
            </div>

            <div className='submit-container'>
              <button
                type='button'
                disabled={status === 'loading'}
                onClick={() => {
                  if (status !== 'loading' && email && password) {
                    handleLogin();
                  } else {
                    setIsFieldsDirty(true);
                    if (email === '') {
                      emailRef.current.focus();
                    }
                    if (password === '') {
                      passwordRef.current.focus();
                    }
                  }
                }}
              >
                {status === 'idle' ? 'Login' : 'Loading...'}
              </button>
            </div>

            <div className='register-container'>
              <a href='/register'>
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
