// src/app/dashboard/page.js
import { cookies } from "next/headers";
import ClientActions from "./ClientActions";
import styles from './dashboard.module.scss'

const USER_API = "https://taysatest.pythonanywhere.com//api/auth/user-info/";

function hasFullProfile(userObj) {
  if (!userObj) return false;
  return (userObj.nickname || userObj.name || userObj.last_login || userObj.income || userObj.expense) ? true : false;
}

export default async function DashboardPage() {
  let cookieStore = null;
  try { cookieStore = await cookies(); } catch (e) { cookieStore = null; console.error(e); }

  const accessToken = cookieStore?.get("access_token")?.value || cookieStore?.get("auth_token")?.value || null;
  const userInfoRaw = cookieStore?.get("user_info")?.value || null;

  let userFromCookie = null;
  if (userInfoRaw) {
    try { userFromCookie = JSON.parse(userInfoRaw); } catch(e){ userFromCookie = null; }
  }

  const renderUserSection = (user, source="cookie") => (
    <main className={styles.dashboard}>
      <h1 className={styles.title}>Dashboard ({source})</h1>
      <section className={styles.userInfo}>
        <p><strong>Id:</strong> {user.id ?? "—"}</p>
        <p><strong>Nickname:</strong> {user.nickname ?? "—"}</p>
        <p><strong>Name:</strong> {user.name ?? "—"}</p>
        <p><strong>Email:</strong> {user.email ?? "—"}</p>
        <p><strong>Last login:</strong> {user.last_login ? new Date(user.last_login).toLocaleString() : "—"}</p>
        <p><strong>Income:</strong> {user.income ?? '—'}</p>
        <p><strong>Expense:</strong> {user.expense ?? '—'}</p>
        <ClientActions email={user.email} />
      </section>
    </main>
  );

  if (hasFullProfile(userFromCookie)) return renderUserSection(userFromCookie, "from cookie");

  if (accessToken) {
    try {
      const res = await fetch(USER_API, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cookie": `access_token=${accessToken}`,
          "Authorization": `Bearer ${accessToken}`,
        },
        cache: "no-store",
      });

      if (res.status === 401) {
        return <main className={styles.dashboard}><h1 className={styles.title}>Dashboard</h1><p className={styles.errorText}>Session invalid — please log in again.</p></main>;
      }

      const text = await res.text();
      let data = null;
      try { data = JSON.parse(text); } catch(e){ data = null; }

      const user = data && Array.isArray(data.data) && data.data.length > 0 ? data.data[0] : (data?.data ?? null);

      if (user) return renderUserSection(user, "server fetched");
      return <main className={styles.dashboard}><h1 className={styles.title}>Dashboard</h1><p className={styles.errorText}>No user data returned from API.</p></main>;

    } catch (err) {
      console.error("dashboard fetch error:", err);
      return <main className={styles.dashboard}><h1 className={styles.title}>Dashboard</h1><p className={styles.errorText}>Network/server error while fetching user info.</p></main>;
    }
  }

  return <main className={styles.dashboard}><h1 className={styles.title}>Dashboard</h1><p className={styles.errorText}>No user data available. Please login.</p></main>;
}
