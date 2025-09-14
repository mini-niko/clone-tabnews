import createCustomRouter from "infra/router.js";
import controller from "infra/controller";
import authentication from "models/authentication.js";
import session from "models/session.js";

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

  controller.setSessionCookie(newSession.token, res);

  res.status(201).json(newSession);
}
