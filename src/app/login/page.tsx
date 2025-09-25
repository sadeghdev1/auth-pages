// @ts-nocheck

'use client';

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./login.module.scss";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const LOGIN_API = "https://taysatest.pythonanywhere.com/api/auth/login/";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: "onTouched"
  });

  const onSubmit = async (data) => {
  setLoading(true);
  try {
    const res = await fetch(LOGIN_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email, password: data.password })
    });

    const json = await res.json();

    if (!res.ok) {
      const message = json?.message || json?.error || "Login failed";
      toast.error(message, { id: "auth-error" });
    } else {
      // extract token & user safely (support multiple shapes)
      const possibleToken = json?.data?.[0]?.access_token || json?.access_token || json?.token || json?.auth_token || null;
      const possibleUser = json?.data?.[0] || json?.user || json?.data?.user || null;

      if (possibleToken) {
        // set access_token cookie so server-side can read it
        Cookies.set("access_token", possibleToken, { expires: 7, path: "/" });
      }

      if (possibleUser) {
        const { access_token, refresh_token, ...userSafe } = possibleUser;
        Cookies.set("user_info", JSON.stringify(userSafe), { expires: 7, path: "/" });
      }

      toast.success("Login successful — redirecting to Dashboard", { id: "auth-success" });
      router.push("/dashboard");
    }
    } catch (err) {
      console.error(err);
      toast.error("Network error — try again", { id: "auth-network" });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Sign in</h2>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Email is invalid" }
              })}
              placeholder="you@example.com"
            />
            {errors.email && <p className={styles.errorText}>{errors.email.message}</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <div className={styles.passwordRow}>
              <input
                type={showPass ? "text" : "password"}
                className={styles.input}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Minimum 8 characters" },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d].*$/,
                    message: "Must include letters and numbers"
                  }
                })}
                placeholder="Your password"
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className={styles.toggleBtn}
                aria-label="Toggle password visibility"
              >
                {showPass ? <i className='bx bx-hide'></i> : <i className='bx bx-show'></i>}
              </button>
            </div>
            {errors.password && <p className={styles.errorText}>{errors.password.message}</p>}
          </div>

          <div className={styles.actions}>
            <button className={styles.button} type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        <p className={styles.smallText}>
          Don't have an account? <a className={styles.link} onClick={() => router.push("/register")}>Register</a>
        </p>
      </div>
    </div>
  );
}
