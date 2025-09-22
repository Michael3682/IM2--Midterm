"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const API = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    let fieldErrors = {};
    if (!newPassword) {
      fieldErrors.newPassword = 'Password is required.';
    } else if (newPassword.length < 8) {
      fieldErrors.newPassword = 'Password must be at least 8 characters long.';
    }
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      setLoading(false);
      return;
    }
    try {
      const res = await axios.post(`${API}/api/auth/reset-password`, { token, newPassword });
      setMessage(res.data.message || "Password reset successful!");
      setTimeout(() => router.push("/login"), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error resetting password.");
    }
    setLoading(false);
  };

  return (
    <div className='flex justify-center gap-5 container mx-auto p-8 w-100 relative rounded-md shadow-2xl border-1 border-white/10 bg-[#303030]'>
      <form className='flex flex-col gap-5 w-full max-w-md mx-auto' onSubmit={handleSubmit}>
        <div>
          <h1 className='text-2xl text-center font-bold text-white/80'>Graphic Web</h1>
          <p className='text-center text-sm text-white/50'>Enter your new password below.</p>
        </div>
        <div>
          <p className='text-white/80 font-semibold mb-1'>New Password</p>
          {errors.newPassword && <p className='text-xs text-red-400 mb-1'>{errors.newPassword}</p>}
          <input
            type='password'
            name='newPassword'
            placeholder='Enter New Password'
            className='text-gray-300 border-1 border-white/10 rounded-md p-1 px-2 outline-none w-full transition-all duration-250 focus:border-white/50'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <button className='mt-3 w-full bg-[#1f1f1f] border-1 border-transparent rounded-md p-1 px-2 cursor-pointer text-white/80 transition-all duration-250 hover:border-white/50' type='submit' disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
        {message && <p className='text-center text-sm text-white/50 mt-4'>{message}</p>}
      </form>
    </div>
  );
}
