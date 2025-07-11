'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loginUser } from '../../features/user/userSlice';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

const LoginUserPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading } = useAppSelector((state) => state.user);

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    org: '',
  });

  const orgOptions = [
  { label: 'AFRINIC', value: 'AfrinicMSP' },
  { label: 'APNIC', value: 'ApnicMSP' },
  { label: 'ARIN', value: 'ArinMSP' },
  { label: 'RIPE NCC', value: 'RipenccMSP' },
  { label: 'LACNIC', value: 'LacnicMSP' },
  { label: 'RONO', value: 'RonoMSP' },
];


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(loginUser(formData)).unwrap();
      const token = res.token;
      localStorage.setItem('authToken', token);

      // Decode token and redirect
      const decoded = jwtDecode(token);
      const role = decoded.role;
      toast.success('Login successful!');

      if ((role === 'rono') || (role === 'rir') || (role === 'company')) 
        router.push('/dashboard');
    } catch (error) {
      toast.error(error || 'Login failed!');
    }
  };

  const handleSignupRedirect = () => {
    router.push('/user/create-user');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🔐 Login User</h2>

      <form onSubmit={handleLogin} style={styles.form}>
        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          style={styles.input}
          required
        />
       <select
  name="org"
  value={formData.org}
  onChange={handleChange}
  style={styles.select}
  required
>
  <option value="">Select Organization</option>
  {orgOptions.map((o) => (
    <option key={o.value} value={o.value}>
      {o.label}
    </option>
  ))}
</select>


        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <button
          type="button"
          onClick={handleSignupRedirect}
          style={{ ...styles.button, backgroundColor: '#28a745', marginTop: '10px' }}
        >
          Create Account For RIR Or RONO
        </button>
                <button
          type="button"
          onClick={()=>router.push('/user/register-company')}
          style={{ ...styles.button, backgroundColor: '#28a745', marginTop: '10px' }}
        >
          Register Company
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '700px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: '#f9f9fc',
    borderRadius: '12px',
    fontFamily: 'Segoe UI, sans-serif',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
  },
  title: {
    textAlign: 'center',
    fontSize: '24px',
    color: '#2c3e50',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '10px 14px',
    fontSize: '15px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    outline: 'none',
  },
  select: {
    padding: '10px 14px',
    fontSize: '15px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#fff',
    appearance: 'none',
    cursor: 'pointer',
  },
  button: {
    padding: '12px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    fontSize: '16px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};

export default LoginUserPage;
