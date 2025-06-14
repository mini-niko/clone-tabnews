import { createRouter } from "next-connect";
import {
  InternalServerError,
  MethodNotAllowedError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "./errors";

export default function createCustomRouter({
  getHandler,
  postHandler,
  putHandler,
  patchHandler,
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
  if (patchHandler) {
    router.patch(patchHandler);
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
  if (
    error instanceof ValidationError ||
    error instanceof NotFoundError ||
    error instanceof UnauthorizedError
  ) {
    return res.status(error.statusCode).json(error);
  }

  const publicErrorObject = new InternalServerError({
    cause: error,
  });

  console.error(publicErrorObject);

  return res.status(publicErrorObject.statusCode).json(publicErrorObject);
}
