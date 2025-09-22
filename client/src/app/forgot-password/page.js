"use client";
import { useState } from "react";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post("/api/auth/forgot-password", { email });
      setMessage(res.data.message || "If your email exists, a reset link has been sent.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error sending reset email.");
    }
    setLoading(false);
  };

  return (
    <div className='flex justify-center gap-5 container mx-auto p-8 w-max relative rounded-md shadow-2xl border-1 border-white/10 bg-[#303030]'>
      <form className='flex flex-col gap-5 w-full max-w-md mx-auto' onSubmit={handleSubmit}>
        <div>
          <h1 className='text-2xl text-center font-bold text-white'>Graphic Web</h1>
          <p className='text-center text-sm text-white/50'>Forgot your password? Enter your email below.</p>
        </div>
        <div>
          <p className='text-gray-100 font-semibold mb-1'>Email</p>
          <input
            type='email'
            name='email'
            placeholder='Email'
            className='text-gray-300 border-1 border-white/10 rounded-md p-1 px-2 outline-none w-full'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button className='mt-3 w-full bg-[#1f1f1f] border-1 border-transparent rounded-md p-1 px-2 cursor-pointer text-white' type='submit' disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
        {message && <p className='text-center text-sm text-white/50 mt-4'>{message}</p>}
      </form>
    </div>
  );
}
