'use client';

type RegisterFormData = {
  nickname: string;
  email: string;
  password: string;
};

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./register.module.scss";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const REGISTER_API = "https://taysatest.pythonanywhere.com/api/auth/register/"; 

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
  mode: "onTouched"
});


  const onSubmit = async (data: RegisterFormData) => {
  setLoading(true);
  try {
    const res = await fetch(REGISTER_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nickname: data.nickname,
        email: data.email,
        password: data.password
      })
    });

    const json: any = await res.json();

    if (!res.ok) {
      const message = json?.message || json?.error || "Registration failed";
      toast.error(message, { id: "auth-error" });
    } else {
      const possibleToken = json?.data?.[0]?.access_token || json?.access_token || json?.token || json?.auth_token || null;
      const possibleUser = json?.data?.[0] || json?.user || json?.data?.user || null;

      if (possibleToken) {
        Cookies.set("access_token", possibleToken, { expires: 7, path: "/" });
      }

      if (possibleUser) {
        const { access_token, refresh_token, ...userSafe } = possibleUser;
        Cookies.set("user_info", JSON.stringify(userSafe), { expires: 7, path: "/" });
      }

      toast.success("Registration successful — redirecting to Login", { id: "auth-success" });
      router.push("/login");
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
        <h2 className={styles.title}>Create account</h2>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.field}>
            <label className={styles.label}>Nickname</label>
            <input
              className={styles.input}
              {...register("nickname", { required: "Nickname is required" })}
              placeholder="Your nickname"
            />
            {errors.nickname && <p className={styles.errorText}>{errors.nickname.message}</p>}
          </div>

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
                placeholder="At least 8 chars with letters and numbers"
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
              {loading ? "Submitting..." : "Register"}
            </button>
          </div>

        </form>

        <p className={styles.smallText}>
          Already have an account? <a className={styles.link} onClick={() => router.push("/login")}>Sign in</a>
        </p>
      </div>
    </div>
  );
}
