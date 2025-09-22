"use client";
import React, { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { jwtDecode } from "jwt-decode";

export default function ChangePasswordPage() {
    const { data: session } = useSession();
    const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [userEmail, setUserEmail] = useState(null);
    const [checked, setChecked] = useState(false);
    const API = process.env.NEXT_PUBLIC_API_URL;

    React.useEffect(() => {
        if (typeof window === "undefined") return;
        let email = null;
        try {
            const sess = session;
            if (sess && sess.user && sess.user.email) {
                email = sess.user.email;
            } else {
                const token = localStorage.getItem("authToken");
                if (token) {
                    try {
                        const decoded = jwtDecode(token);
                        email = decoded.email;
                    } catch { }
                }
            }
        } catch { }
        setUserEmail(email);
        setChecked(true);
    }, [session]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        let fieldErrors = {};
        if (!form.oldPassword) fieldErrors.oldPassword = "Old password is required.";
        if (!form.newPassword) fieldErrors.newPassword = "New password is required.";
        else if (form.newPassword.length < 8) fieldErrors.newPassword = "New password must be at least 8 characters.";
        if (!form.confirmPassword) fieldErrors.confirmPassword = "Please confirm your new password.";
        else if (form.newPassword !== form.confirmPassword) fieldErrors.confirmPassword = "Passwords do not match.";
        if (form.oldPassword && form.newPassword && form.oldPassword === form.newPassword) fieldErrors.newPassword = "New password cannot be the same as old password.";
        setErrors(fieldErrors);
        if (Object.keys(fieldErrors).length > 0) return;
        setLoading(true);
        try {
            const res = await axios.post(`${API}/api/auth/change-password`, {
                email: userEmail,
                oldPassword: form.oldPassword,
                newPassword: form.newPassword
            });
            setMessage(res.data.message || "Password changed successfully.");
            setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            if (err.response?.data?.message) {
                setMessage(err.response.data.message);
            } else if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
                setMessage(err.response.data.errors.map(e => e.message).join(" "));
            } else {
                setMessage("An unexpected error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (!checked) return null;
    if (!userEmail) {
        return <div className="text-white text-center mt-10">No user email found. Please log in again.</div>;
    }

    return (
        <div className="flex justify-center flex-col gap-5 container mx-auto p-8 w-100 relative rounded-md shadow-2xl border-1 border-white/10 bg-[#303030]">
            <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold text-white text-center mb-4">Change Password</h2>
                <div>
                    <p className="text-white/80 font-semibold mb-1">Old Password</p>
                    {errors.oldPassword && <p className="text-xs text-red-400 mb-1">{errors.oldPassword}</p>}
                    <input
                        type="password"
                        name="oldPassword"
                        placeholder="Old Password"
                        className="text-gray-300 border-1 border-white/10 rounded-md p-1 px-2 outline-none w-full transition-all duration-250 focus:border-white/50"
                        value={form.oldPassword}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <p className="text-white/80 font-semibold mb-1">New Password</p>
                    {errors.newPassword && <p className="text-xs text-red-400 mb-1">{errors.newPassword}</p>}
                    <input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        className="text-gray-300 border-1 border-white/10 rounded-md p-1 px-2 outline-none w-full transition-all duration-250 focus:border-white/50"
                        value={form.newPassword}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <p className="text-white/80 font-semibold mb-1">Confirm New Password</p>
                    {errors.confirmPassword && <p className="text-xs text-red-400 mb-1">{errors.confirmPassword}</p>}
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm New Password"
                        className="text-gray-300 border-1 border-white/10 rounded-md p-1 px-2 outline-none w-full transition-all duration-250 focus:border-white/50"
                        value={form.confirmPassword}
                        onChange={handleChange}
                    />
                </div>
                <button
                    type="submit"
                    className="mt-3 w-full bg-[#1f1f1f] border-1 border-transparent rounded-md p-1.5 px-2 cursor-pointer text-white/80 transition-all duration-250 hover:border-white/50"
                    disabled={loading}
                >
                    {loading ? "Changing..." : "Change Password"}
                </button>
                {message && <div className="text-center text-sm text-white/50 mt-4">{message}</div>}
            </form>
        </div>
    );
}
