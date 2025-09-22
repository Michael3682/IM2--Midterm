"use client"
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function RegisterPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === 'authenticated' && window.location.pathname !== '/main') {
      router.push('/main');
    }
  }, [status, router]);
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const API = process.env.NEXT_PUBLIC_API_URL;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let fieldErrors = {};
    if (!form.email) {
      fieldErrors.email = 'Email is required.';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      fieldErrors.email = 'Please enter a valid email address.';
    }
    if (!form.password) {
      fieldErrors.password = 'Password is required.';
    } else if (form.password.length < 8) {
      fieldErrors.password = 'Password must be at least 8 characters long.';
    }
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;
    try {
      const res = await axios.post(`${API}/api/auth/register`, form);
      setMessage(res.data.message || 'Registration successful!');
      if (res.data.token) {
        localStorage.setItem('authToken', res.data.token);
      }
      router.push('/onboarding');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className='flex justify-center flex-col gap-5 container mx-auto p-8 w-100 relative rounded-md shadow-2xl border-1 border-white/10 bg-[#303030]'>
      <form className='flex flex-col gap-5 w-full' onSubmit={handleSubmit}>
        <div>
          <h1 className='text-2xl text-center font-bold text-white'>Graphic Web</h1>
          <p className='text-center text-sm text-white/50'>Create your account</p>
        </div>
        <div>
          <p className='text-gray-100 font-semibold mb-1'>Email</p>
          {errors.email && <p className='text-xs text-red-400 mb-1'>{errors.email}</p>}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className='text-gray-300 border-1 border-white/10 rounded-md p-1 px-2 outline-none w-full'
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <p className='text-gray-100 font-semibold mb-1'>Password</p>
          {errors.password && <p className='text-xs text-red-400 mb-1'>{errors.password}</p>}
          <input
            type="password"
            name="password"
            placeholder="Password"
            className='text-gray-300 border-1 border-white/10 rounded-md p-1 px-2 outline-none w-full'
            value={form.password}
            onChange={handleChange}
          />
        </div>
        <button className='mt-3 w-full bg-[#1f1f1f] border-1 border-transparent rounded-md p-1.5 px-2 cursor-pointer text-white' type="submit">Sign Up</button>
        <div className="flex flex-col items-center w-full">
          <div className="flex items-center w-full">
            <hr className="flex-grow border-t border-white/20" />
            <span className="mx-2 text-white/50 text-sm">or</span>
            <hr className="flex-grow border-t border-white/20" />
          </div>
          <button type="button" className="flex justify-center align-center gap-2 mt-3 w-full bg-[#1f1f1f] border-1 border-transparent rounded-md p-1.5 px-2 cursor-pointer text-white" onClick={() => signIn('google', { callbackUrl: '/main' })}>
            <img src="/google-logo.png" alt="Google Logo" className="w-5 h-5" />Continue with Google</button>
        </div>
        <div className='text-center text-sm text-white/50'>
          <p>Already have an account?{' '}
            <span className='text-blue-500 cursor-pointer hover:underline' onClick={() => router.push('/login')}>Sign Up</span>
          </p>
        </div>
      </form>
      {message && <p className='text-center text-sm text-white/50 mt-4'>{message}</p>}
    </div>
  );
}