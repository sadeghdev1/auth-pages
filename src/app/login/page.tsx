"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "./login.module.scss";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface LoginForm {
  email: string;
  password: string;
}

interface ApiUser {
  id?: number;
  nickname?: string;
  name?: string;
  email?: string;
  last_login?: string;
  access_token?: string;
  refresh_token?: string;
  // other possible fields...
}

interface LoginApiResponse {
  result?: boolean;
  message?: string;
  data?: ApiUser[] | ApiUser;
  token?: string;
  access_token?: string;
  auth_token?: string;
  // other shapes...
}

const LOGIN_API = "https://taysatest.pythonanywhere.com/api/auth/login/";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPass, setShowPass] = useState<boolean>(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    mode: "onTouched",
  });

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    setLoading(true);
    try {
      const res = await fetch(LOGIN_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      // attempt to parse json safely
      let json: LoginApiResponse | null = null;
      try {
        json = await res.json();
      } catch (err) {
        json = null;
      }

      if (!res.ok) {
        const message =
          (json && ((json as any).message || (json as any).error)) || "Login failed";
        toast.error(String(message), { id: "auth-error" });
      } else {
        // normalize possible token and user shapes
        const possibleToken =
          (json && (Array.isArray(json.data) ? json.data[0]?.access_token : (json as any).access_token)) ||
          (json as any).token ||
          (json as any).auth_token ||
          null;

        const possibleUser =
          (json && (Array.isArray(json.data) ? json.data[0] : json.data)) ||
          (json as any).user ||
          null;

        if (possibleToken) {
          Cookies.set("access_token", String(possibleToken), { expires: 7, path: "/" });
        }

        if (possibleUser) {
          const userToStore: Partial<ApiUser> = { ...(possibleUser as ApiUser) };
          // remove tokens if present
          delete (userToStore as any).access_token;
          delete (userToStore as any).refresh_token;
          Cookies.set("user_info", JSON.stringify(userToStore), { expires: 7, path: "/" });
        }

        toast.success("Login successful — redirecting to Dashboard", { id: "auth-success" });
        // small delay for user to see toast
        setTimeout(() => router.push("/dashboard"), 700);
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Network error — try again", { id: "auth-network" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Sign in</h2>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Email is invalid" },
              })}
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
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
                    message: "Must include letters and numbers",
                  },
                })}
                placeholder="Your password"
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className={styles.toggleBtn}
                aria-label="Toggle password visibility"
              >
                {showPass ? <i className="bx bx-hide" /> : <i className="bx bx-show" />}
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
          Don&apos;t have an account? <a className={styles.link} onClick={() => router.push("/register")}>Register</a>
        </p>
      </div>
    </div>
  );
};
