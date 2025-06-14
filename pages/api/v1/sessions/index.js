import createCustomRouter from "infra/router.js";
import authentication from "models/authentication.js";
import session from "models/session.js";
import * as cookie from "cookie";

export default createCustomRouter({
  postHandler,
});

async function postHandler(req, res) {
  const userInputData = req.body;

  const authenticatedUser = await authentication.getAuthenticatedUser(
    userInputData.email,
    userInputData.password,
  );

  const newSession = await session.create(authenticatedUser.id);

  const setCookie = cookie.serialize(`session_id`, newSession.token, {
    path: "/",
    maxAge: session.EXPIRATION_IN_MILISSECONDS / 1000,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  res.setHeader("Set-Cookie", setCookie);

  res.status(201).json(newSession);
}
