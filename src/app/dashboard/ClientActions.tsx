// @ts-nocheck

"use client";

import React, { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ClientActions({ email }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Unified logout: try server-side logout first, then clean client cookies as fallback/cleanup
  const unifiedLogout = async () => {
    setLoading(true);
    try {
      // 1) Try server-side logout route (this will clear HttpOnly cookies on the server)
      const res = await fetch("/api/logout", { method: "POST" });

      // 2) Regardless of server response, remove client cookies (cleanup)
      Cookies.remove("access_token", { path: "/" });
      Cookies.remove("user_info", { path: "/" });

      if (res.ok) {
        toast.success("Logged out");
      } else {
        // if server failed, still proceed but inform user
        toast("Logged out (local) — server logout returned an error", { icon: "⚠️" });
      }

      // redirect to login or home
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
      // network error -> still clear client-side tokens and redirect
      Cookies.remove("access_token", { path: "/" });
      Cookies.remove("user_info", { path: "/" });
      toast.error("Network issue — local logout done");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = () => {
    router.refresh(); // Next.js app router refresh
    toast.success("Profile refreshed");
  };

  // other buttons (copy, refresh, edit) kept as is...
  const copyEmail = async () => {
    if (!email) return toast.error("No email");
    try { await navigator.clipboard.writeText(email); toast.success("Email copied"); }
    catch { toast.error("Can't copy"); }
  };

  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 20 }}>
      <button onClick={refreshProfile} className="btn outline">Refresh</button>
      <button onClick={copyEmail} className="btn">Copy Email</button>

      {/* single unified logout */}
      <button onClick={unifiedLogout} className="btn danger" disabled={loading}>
        {loading ? "Logging out..." : "Logout"}
      </button>

      <style jsx>{`
        .btn {
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid rgba(0,0,0,0.08);
          color: #000;
          background: #fff;
          cursor: pointer;
        }

        .btn.outline { 
            background: transparent; 
            border: 1px solid #fff;
            color: white; 
        }
        .btn.outline:hover {
            color: #fff;
            background: #a6a6a6b9;
        }

        .btn.danger { 
            background: #ff6b6b; 
            color: #fff; 
            border: none; 
        }
        .btn.danger:hover {
            background: #ff3b3bff;
        }
        
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
