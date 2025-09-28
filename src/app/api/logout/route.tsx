import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true, loggedOut: true });

  // expire cookies we used
  res.cookies.set({
    name: "access_token",
    value: "",
    path: "/",
    expires: new Date(0),
  });
  res.cookies.set({
    name: "user_info",
    value: "",
    path: "/",
    expires: new Date(0),
  });

  return res;
}
