import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const res = await fetch('http://localhost:4000/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (res.ok) {
          // Save the JWT token (for example, in localStorage)
          localStorage.setItem('token', data.access_token);
          alert('Login successful!');
          // Optionally redirect or update UI here
        } else {
            setError(data.message || 'Login failed');
        }
      } catch (err) {
        alert('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button type="submit">Login</button>
    </form>
  );
}
