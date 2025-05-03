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
  const publicErrorObject = new InternalServerError({
    cause: error,
    statusCode: error.statusCode,
  });

  console.error(publicErrorObject);
  return res
    .status(publicErrorObject.statusCode)
    .json(publicErrorObject.toJSON());
}
