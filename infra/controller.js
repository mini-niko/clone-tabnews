import * as cookie from "cookie";
import session from "models/session";

async function setSessionCookie(sessionToken, res) {
  const setCookie = cookie.serialize(`session_id`, sessionToken, {
    path: "/",
    maxAge: session.EXPIRATION_IN_MILISSECONDS / 1000,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  res.setHeader("Set-Cookie", setCookie);
}

async function clearSessionCookie(res) {
  const setCookie = cookie.serialize("session_id", "invalid", {
    path: "/",
    maxAge: -1,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  res.setHeader("Set-Cookie", setCookie);
}

const controller = {
  setSessionCookie,
  clearSessionCookie,
};

export default controller;
