import createCustomRouter from "infra/router";
import user from "models/user";

export default createCustomRouter({
  getHandler,
  patchHandler,
});

async function getHandler(req, res) {
  const { username } = req.query;
  const userFound = await user.findOneByUsername(username);
  res.status(200).json(userFound);
}

async function patchHandler(req, res) {
  const { username } = req.query;
  const userInputValues = req.body;

  const updatedUser = await user.update(username, userInputValues);
  res.status(200).json(updatedUser);
}
