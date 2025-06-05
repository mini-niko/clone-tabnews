import createCustomRouter from "infra/router";
import user from "models/user";

export default createCustomRouter({
  postHandler,
});

async function postHandler(req, res) {
  const userInputData = req.body;

  const newUser = await user.create(userInputData);

  res.status(201).json(newUser);
}
