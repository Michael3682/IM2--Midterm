"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState({ name: "", age: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [checked, setChecked] = useState(false);
  
  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    let token = null;
    let email = null;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("authToken");
      email = session?.user?.email;
      if (!email && token) {
        try {
          const decoded = jwtDecode(token);
          email = decoded.email;
        } catch {}
      }
    }
    setUserEmail(email);
    setChecked(true);
    if (!email) {
      setLoading(false);
      return;
    }
    setLoading(true);
    let google = false;
    if (session?.user?.email && session?.user?.image) {
      google = true;
    }
    setShowChangePassword(!google);
    axios.get(`${API}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { email },
    })
      .then(res => setProfile(res.data))
      .catch(() => setProfile({ name: "", age: "", address: "" }))
      .finally(() => setLoading(false));
  }, [session]);

  if (!checked) return null;
  if (!userEmail) {
    return <div className="text-white text-center mt-10">No user email found. Please log in again.</div>;
  }
  if (loading) return <div className="text-white text-center mt-10">Loading...</div>;

  return (
    <div className="flex justify-center gap-5 container mx-auto p-8 w-100 relative rounded-md shadow-2xl border-1 border-white/10 bg-[#303030] mt-10">
      <div className="flex flex-col gap-5 w-full max-w-md mx-auto">
        <div>
          <h1 className="text-2xl text-center font-bold text-white/80">Profile</h1>
        </div>
        <div>
          <label className="text-white/80 font-semibold mb-1">Name</label>
          <p className="text-white/60 border-b-1 border-white/20 p-1 px-0 ">{profile.name || "-"}</p>
        </div>
        <div>
          <label className="text-white/80 font-semibold mb-1">Age</label>
          <p className="text-white/60 border-b-1 border-white/20 p-1 px-0 ">{profile.age || "-"}</p>
        </div>
        <div>
          <label className="text-white/80 font-semibold mb-1">Address</label>
          <p className="text-white/60 border-b-1 border-white/20 p-1 px-0 ">{profile.address || "-"}</p>
        </div>
        {showChangePassword && (
          <button className="mt-3 w-full bg-[#1f1f1f] border-1 border-transparent rounded-md p-1.5 px-2 cursor-pointer text-white/80 transition-all duration-250 hover:border-white/50" type="button" onClick={() => window.location.href = "/changepassword"}>Change Password</button>
        )}
      </div>
    </div>
  );
}
