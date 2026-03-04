import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

function getErrorMessage(code) {
  switch (code) {
    case 'auth/user-not-found':      return 'Користувача з таким email не знайдено.';
    case 'auth/wrong-password':      return 'Неправильний пароль.';
    case 'auth/invalid-email':       return 'Невірний формат email.';
    case 'auth/invalid-credential':  return 'Невірний email або пароль.';
    case 'auth/too-many-requests':   return 'Забагато спроб. Спробуйте пізніше.';
    default:                         return 'Помилка входу. Спробуйте ще раз.';
  }
}

function LoginPage() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/projects');
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-box">
        <h2 className="auth-title">Вхід</h2>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">Пароль</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введіть пароль"
              required
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Вхід...' : 'Увійти'}
          </button>
        </form>

        <p className="auth-switch">
          Ще немає акаунту?{' '}
          <Link to="/register">Зареєструватись</Link>
        </p>
      </div>
    </main>
  );
}

export default LoginPage;