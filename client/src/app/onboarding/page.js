"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export default function OnboardingPage() {
  const [form, setForm] = useState({ name: '', age: '', address: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const router = useRouter();

  const API = process.env.NEXT_PUBLIC_API_URL;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let fieldErrors = {};
    if (!form.name.trim()) fieldErrors.name = 'Name is required.';
    if (!form.age) {
      fieldErrors.age = 'Age is required.';
    } else if (isNaN(form.age) || form.age <= 0) {
      fieldErrors.age = 'Please enter a valid age.';
    }
    if (!form.address.trim()) fieldErrors.address = 'Address is required.';

    setErrors(fieldErrors);

    if (Object.keys(fieldErrors).length > 0) return;

    try {
      const token = localStorage.getItem('authToken');
      let userId = null;
      if (token) {
        const decoded = jwtDecode(token);
        userId = decoded.id || decoded.userId || decoded.email;
      }
      const payload = { ...form, userId };
      const res = await axios.post(`${API}/api/onboarding`, payload);
      setMessage(res.data.message || 'Onboarding info saved!');
      router.push('/main');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to save info.');
    }
  };

  return (
    <div className='flex justify-center flex-col gap-5 container mx-auto p-8 w-100 relative rounded-md shadow-2xl border-1 border-white/10 bg-[#303030]'>
      <form className='flex flex-col gap-5 w-full' onSubmit={handleSubmit}>
        <div>
          <h1 className='text-2xl text-center font-bold text-white'>Onboarding</h1>
          <p className='text-center text-sm text-white/50 mb-5'>Complete your profile</p>
        </div>
        <div>
          <p className='text-gray-100 font-semibold mb-1'>Name</p>
          {errors.name && <p className='text-xs text-red-400 mb-1'>{errors.name}</p>}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className='text-gray-300 border-1 border-white/10 rounded-md p-1 px-2 outline-none w-full transition-all duration-250 focus:border-white/50'
            value={form.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <p className='text-gray-100 font-semibold mb-1'>Age</p>
          {errors.age && <p className='text-xs text-red-400 mb-1'>{errors.age}</p>}
          <input
            type="number"
            name="age"
            placeholder="Age"
            className='text-gray-300 border-1 border-white/10 rounded-md p-1 px-2 outline-none w-full transition-all duration-250 focus:border-white/50'
            value={form.age}
            onChange={handleChange}
          />
        </div>
        <div>
          <p className='text-gray-100 font-semibold mb-1'>Address</p>
          {errors.address && <p className='text-xs text-red-400 mb-1'>{errors.address}</p>}
          <input
            type="text"
            name="address"
            placeholder="Address"
            className='text-gray-300 border-1 border-white/10 rounded-md p-1 px-2 outline-none w-full transition-all duration-250 focus:border-white/50'
            value={form.address}
            onChange={handleChange}
          />
        </div>

        <button className='mt-3 w-full bg-[#1f1f1f] border-1 border-transparent rounded-md p-1 px-2 cursor-pointer text-white transition-all duration-250 hover:border-white/50' type="submit">Save Info</button>
        {message && <p className='text-center text-sm text-white/50 mt-4'>{message}</p>}
      </form>
    </div>
  );
}
