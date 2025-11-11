import createCustomRouter from "infra/router.js";
import controller from "infra/controller";
import authentication from "models/authentication.js";
import session from "models/session.js";

export default createCustomRouter({
  postHandler,
  deleteHandler,
});

async function postHandler(req, res) {
  const userInputData = req.body;

  const authenticatedUser = await authentication.getAuthenticatedUser(
    userInputData.email,
    userInputData.password,
  );

  const newSession = await session.create(authenticatedUser.id);

  controller.setSessionCookie(newSession.token, res);

  res.status(201).json(newSession);
}

async function deleteHandler(req, res) {
  const sessionToken = req.cookies.session_id;

  const sessionObject = await session.findOneValidByToken(sessionToken);
  const expiredSession = await session.expireById(sessionObject.id);
  controller.clearSessionCookie(res);

  res.status(200).json(expiredSession);
}
