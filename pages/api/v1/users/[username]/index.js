import createCustomRouter from "infra/router";
import user from "models/user";

export default createCustomRouter({
  getHandler,
});

async function getHandler(req, res) {
  const { username } = req.query;
  const userFound = await user.findOneByUsername(username);
  res.status(200).json(userFound);
}
