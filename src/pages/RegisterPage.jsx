import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

function getErrorMessage(code) {
  switch (code) {
    case 'auth/email-already-in-use': return 'Цей email вже використовується.';
    case 'auth/invalid-email':        return 'Невірний формат email.';
    case 'auth/weak-password':        return 'Пароль занадто слабкий (мінімум 6 символів).';
    default:                          return 'Помилка реєстрації. Спробуйте ще раз.';
  }
}

function RegisterPage() {
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const { register } = useAuth();
  const navigate     = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      return setError('Паролі не збігаються.');
    }
    if (password.length < 6) {
      return setError('Пароль має містити щонайменше 6 символів.');
    }

    setLoading(true);
    try {
      await register(email, password, name);
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
        <h2 className="auth-title">Реєстрація</h2>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="reg-name">Ім'я</label>
            <input
              id="reg-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ваше ім'я"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="reg-password">Пароль</label>
            <input
              id="reg-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Мінімум 6 символів"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="reg-confirm">Підтвердіть пароль</label>
            <input
              id="reg-confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Повторіть пароль"
              required
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Реєстрація...' : 'Зареєструватись'}
          </button>
        </form>

        <p className="auth-switch">
          Вже є акаунт?{' '}
          <Link to="/login">Увійти</Link>
        </p>
      </div>
    </main>
  );
}

export default RegisterPage;