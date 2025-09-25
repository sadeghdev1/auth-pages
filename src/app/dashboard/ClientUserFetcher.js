"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ClientUserFetcher({ apiUrl }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const userInfoCookie = Cookies.get("user_info");
        if (userInfoCookie) {
          try {
            const parsed = JSON.parse(userInfoCookie);
            setUser(parsed);
            setLoading(false);
            return;
          } catch (e) {
            console.warn("client: user_info cookie parse failed", e);
          }
        }

        const token = Cookies.get("access_token") || Cookies.get("auth_token");
        if (!token) {
          setLoading(false);
          toast.error("No token found in client cookies. Please login.");
          return;
        }

        const res = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          cache: "no-store",
        });

        if (!res.ok) {
          if (res.status === 401) {
            toast.error("Session expired. Please log in again.");
            Cookies.remove("access_token", { path: "/" });
            router.push("/login");
            return;
          }
          const t = await res.text().catch(()=>null);
          toast.error("Failed to fetch user info");
          console.error("client fetch failed", res.status, t);
          setLoading(false);
          return;
        }

        const data = await res.json().catch(()=>null);
        const found = Array.isArray(data?.data) ? data.data[0] : data?.data ?? null;
        if (found) {
          setUser(found);
        } else {
          toast.error("No user data returned");
        }
      } catch (err) {
        console.error("client fetch error", err);
        toast.error("Network error while fetching user info");
      } finally {
        setLoading(false);
      }
    })();
  }, [apiUrl, router]);

  if (loading) return <div>Loading user data (client)...</div>;
  if (!user) return <div>No user info available (client).</div>;

  return (
    <section>
        <h2>Client-side user</h2>
        <p><strong>Nickname:</strong> {user.nickname ?? user.name ?? '—'}</p>
        <p><strong>Email:</strong> {user.email ?? '—'}</p>
        <p><strong>Last login:</strong> {user.last_login ? new Date(user.last_login).toLocaleString() : '—'}</p>
        <p><strong>Income:</strong> {user.income ?? '—'}</p>
        <p><strong>Expense:</strong> {user.expense ?? '—'}</p>
        <pre style={{ whiteSpace: "pre-wrap", marginTop: 12    }}>{JSON.stringify(user, null, 2)}</pre>
    </section>
  );
}
