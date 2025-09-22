"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function MainPage() {
    const router = useRouter();

    const handleProfile = () => {
        router.push("/profile");
    };

    const handleLogout = async () => {
        // Remove local JWT if present
        localStorage.removeItem("authToken");
        localStorage.removeItem("onboardingInfo");
        await signOut({ redirect: false });
        router.push("/login");
    };

    return (
        <div className="h-full w-full bg-[url('/background.jpg')] bg-cover bg-center">
            <nav className="flex items-center justify-between p-4 py-1">
                <img className="w-15 invert-[65%]" src="/graphicweb-logo.png"/>
                <div className="flex gap-5">
                    <button className="bg-[#1f1f1f] border-1 border-white/20 rounded-md p-1 px-4 cursor-pointer text-white/80 text-sm transition-all duration-250 hover:border-white/50" onClick={handleProfile}>Profile</button>
                    <button className="border-b-1 border-white/20 p-1 px-4 cursor-pointer text-white/80 text-sm transition-all duration-250 hover:border-white/50" onClick={handleLogout}>Log out</button>
                </div>
            </nav>
            <main className="w-full h-[calc(100vh-150px)] flex justify-center items-center flex-col gap-3">
                <h1 className="text-5xl text-center font-bold text-white/70">ELEVATE YOUR BRAND WITH STUNNING DESIGN</h1>
                <p className="text-white/50">INNOVATIVE WEB AND GRAPHIC SOLUTIONS TAILORED TO YOUR VISION</p>
            </main>
        </div>
    );
}
