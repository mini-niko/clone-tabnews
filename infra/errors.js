export class InternalServerError extends Error {
  constructor({ cause, statusCode }) {
    super("Um erro interno não esperado aconteceu.", {
      cause,
    });

    this.name = "InternalServerError";
    this.statusCode = statusCode || 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: "Entre em contato com o suporte.",
      status_code: this.statusCode,
    };
  }
}

export class MethodNotAllowedError extends Error {
  constructor() {
    super("Método não permitido para este endpoint.");

    this.name = "MethodNotAllowed";
    this.message = "Metodo não permitido para este endpoint.";
    this.statusCode = 405;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: "Verifique se o método HTTP enviado é válido para este endpoint.",
      status_code: this.statusCode,
    };
  }
}

export class ServiceError extends Error {
  constructor({ message, cause }) {
    super(message || "Serviço indisponível no momento", {
      cause,
    });

    this.name = "ServiceError";
    this.message = "Verifique se o serviço está disponível.";
    this.statusCode = 503;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: "Verifique se o método HTTP enviado é válido para este endpoint.",
      status_code: this.statusCode,
    };
  }
}
