import { createRouter } from "next-connect";
import { InternalServerError, MethodNotAllowedError } from "./errors";

export default function createCustomRouter({
  getHandler,
  postHandler,
  putHandler,
  deleteHandler,
}) {
  const router = createRouter();

  if (getHandler) {
    router.get(getHandler);
  }
  if (postHandler) {
    router.post(postHandler);
  }
  if (putHandler) {
    router.put(putHandler);
  }
  if (deleteHandler) {
    router.delete(deleteHandler);
  }

  return router.handler({
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  });
}

function onNoMatchHandler(req, res) {
  const publicErrorObject = new MethodNotAllowedError();

  res.status(405).json(publicErrorObject.toJSON());
}

function onErrorHandler(error, req, res) {
  console.log(error);

  const publicErrorObject = new InternalServerError({
    cause: error,
  });

  console.error(publicErrorObject);
  return res.status(500).json(publicErrorObject.toJSON());
}
