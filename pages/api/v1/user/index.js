import controller from "infra/controller";
import createCustomRouter from "infra/router";
import session from "models/session";
import user from "models/user";

export default createCustomRouter({
  getHandler,
});

async function getHandler(req, res) {
  const sessionToken = req.cookies.session_id;

  const sessionObject = await session.findOneValidByToken(sessionToken);
  const renewedSessionObject = await session.renew(sessionObject.id);
  controller.setSessionCookie(renewedSessionObject.token, res);

  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, max-age=0, must-revalidate",
  );

  const userFound = await user.findOneById(sessionObject.user_id);

  return res.status(200).json(userFound);
}
