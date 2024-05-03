const HTTPStatus = require("statuses");
const HTTP_RESPONSE = {
  BAD_REQUEST: {
    ref: "BAD_REQUEST",
    error: "BadRequest",
    statusCode: 400,
    message:
      "Bad Request - The server cannot or will not process the request due to an apparent client error.",
  },
  UNAUTHORIZED: {
    ref: "UNAUTHORIZED",
    error: "Unauthorized",
    statusCode: 401,
    message:
      "Unauthorized - Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided.",
  },
  PAYMENT_REQUIRED: {
    ref: "PAYMENT_REQUIRED",
    error: "PaymentRequired",
    statusCode: 402,
    message:
      "Payment Required - The server refuses the request because the client has not provided the proper payment.",
  },
  FORBIDDEN: {
    ref: "FORBIDDEN",
    error: "Forbidden",
    statusCode: 403,
    message:
      "Forbidden - The client does not have access rights to the content, i.e., they are unauthorized, so server is rejecting to give proper response.",
  },
  NOT_FOUND: {
    ref: "NOT_FOUND",
    error: "NotFound",
    statusCode: 404,
    message: "Not Found - The server can not find requested resource.",
  },
  METHOD_NOT_ALLOWED: {
    ref: "METHOD_NOT_ALLOWED",
    error: "MethodNotAllowed",
    statusCode: 405,
    message:
      "Method Not Allowed - The method specified in the request is not allowed.",
  },
  NOT_ACCEPTABLE: {
    ref: "NOT_ACCEPTABLE",
    error: "NotAcceptable",
    statusCode: 406,
    message:
      "Not Acceptable - The server can only generate a response that is not accepted by the client.",
  },
  PROXY_AUTHENTICATION_REQUIRED: {
    ref: "PROXY_AUTHENTICATION_REQUIRED",
    error: "ProxyAuthenticationRequired",
    statusCode: 407,
    message:
      "Proxy Authentication Required - The client must first authenticate itself with the proxy.",
  },
  REQUEST_TIMEOUT: {
    ref: "REQUEST_TIMEOUT",
    error: "RequestTimeout",
    statusCode: 408,
    message: "Request Timeout - The server timed out waiting for the request.",
  },
  CONFLICT: {
    ref: "CONFLICT",
    error: "Conflict",
    statusCode: 409,
    message:
      "Conflict - The request could not be completed because of a conflict in the request.",
  },

  GONE: {
    ref: "GONE",
    error: "Gone",
    statusCode: 410,
    message: "Gone - The requested page is no longer available.",
  },

  LENGTH_REQUIRED: {
    ref: "LENGTH_REQUIRED",
    error: "LengthRequired",
    statusCode: 411,
    message:
      "Length Required - The request did not specify the length of its content, which is required by the requested resource.",
  },

  PRECONDITION_FAILED: {
    ref: "PRECONDITION_FAILED",
    error: "PreconditionFailed",
    statusCode: 412,
    message:
      "Precondition Failed - The server does not meet one of the preconditions that the requester put on the request.",
  },

  PAYLOAD_TOO_LARGE: {
    ref: "PAYLOAD_TOO_LARGE",
    error: "PayloadTooLarge",
    statusCode: 413,
    message:
      "Payload Too Large - The request is larger than the server is willing or able to process.",
  },

  URI_TOO_LONG: {
    ref: "URI_TOO_LONG",
    error: "URITooLong",
    statusCode: 414,
    message:
      "URI Too Long - The URI provided was too long for the server to process.",
  },

  UNSUPPORTED_MEDIA_TYPE: {
    ref: "UNSUPPORTED_MEDIA_TYPE",
    error: "UnsupportedMediaType",
    statusCode: 415,
    message:
      "Unsupported Media Type - The request entity has a media type which the server or resource does not support.",
  },

  RANGE_NOT_SATISFIABLE: {
    ref: "RANGE_NOT_SATISFIABLE",
    error: "RangeNotSatisfiable",
    statusCode: 416,
    message:
      "Range Not Satisfiable - The client has asked for a portion of the file, but the server cannot supply that portion.",
  },

  EXPECTATION_FAILED: {
    ref: "EXPECTATION_FAILED",
    error: "ExpectationFailed",
    statusCode: 417,
    message:
      "Expectation Failed - The server cannot meet the requirements of the Expect request-header field.",
  },

  I_AM_A_TEAPOT: {
    ref: "I_AM_A_TEAPOT",
    error: "ImATeapot",
    statusCode: 418,
    message:
      "I'm a teapot - The server refuses to brew coffee because it is, permanently, a teapot.",
  },

  MISDIRECTED_REQUEST: {
    ref: "MISDIRECTED_REQUEST",
    error: "MisdirectedRequest",
    statusCode: 421,
    message:
      "Misdirected Request - The request was directed at a server that is not able to produce a response.",
  },

  UNPROCESSABLE_ENTITY: {
    ref: "UNPROCESSABLE_ENTITY",
    error: "UnprocessableEntity",
    statusCode: 422,
    message:
      "Unprocessable Entity - The request was well-formed but was unable to be followed due to semantic errors.",
  },

  LOCKED: {
    ref: "LOCKED",
    error: "Locked",
    statusCode: 423,
    message: "Locked - The resource that is being accessed is locked.",
  },

  FAILED_DEPENDENCY: {
    ref: "FAILED_DEPENDENCY",
    error: "FailedDependency",
    statusCode: 424,
    message:
      "Failed Dependency - The request failed due to failure of a previous request.",
  },

  TOO_EARLY: {
    ref: "TOO_EARLY",
    error: "TooEarly",
    statusCode: 425,
    message:
      "Too Early - Indicates that the server is unwilling to risk processing a request that might be replayed.",
  },

  UPGRADE_REQUIRED: {
    ref: "UPGRADE_REQUIRED",
    error: "UpgradeRequired",
    statusCode: 426,
    message:
      "Upgrade Required - The client should switch to a different protocol such as TLS/1.0.",
  },

  PRECONDITION_REQUIRED: {
    ref: "PRECONDITION_REQUIRED",
    error: "PreconditionRequired",
    statusCode: 428,
    message:
      "Precondition Required - The origin server requires the request to be conditional.",
  },

  TOO_MANY_REQUESTS: {
    ref: "TOO_MANY_REQUESTS",
    error: "TooManyRequests",
    statusCode: 429,
    message:
      "Too Many Requests - The user has sent too many requests in a given amount of time.",
  },

  REQUEST_HEADER_FIELDS_TOO_LARGE: {
    ref: "REQUEST_HEADER_FIELDS_TOO_LARGE",
    error: "RequestHeaderFieldsTooLarge",
    statusCode: 431,
    message:
      "Request Header Fields Too Large - The server is unwilling to process the request because either an individual header field or all the header fields collectively are too large.",
  },

  UNAVAILABLE_FOR_LEGAL_REASONS: {
    ref: "UNAVAILABLE_FOR_LEGAL_REASONS",
    error: "UnavailableForLegalReasons",
    statusCode: 451,
    message:
      "Unavailable For Legal Reasons - A server operator has received a legal demand to deny access to a resource or to a set of resources that includes the requested resource.",
  },

  INTERNAL_SERVER_ERROR: {
    ref: "INTERNAL_SERVER_ERROR",
    error: "InternalServerError",
    statusCode: 500,
    message:
      "Internal Server Error - A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.",
  },

  NOT_IMPLEMENTED: {
    ref: "NOT_IMPLEMENTED",
    error: "NotImplemented",
    statusCode: 501,
    message:
      "Not Implemented - The server either does not recognize the request method, or it lacks the ability to fulfill the request.",
  },

  BAD_GATEWAY: {
    ref: "BAD_GATEWAY",
    error: "BadGateway",
    statusCode: 502,
    message:
      "Bad Gateway - The server was acting as a gateway or proxy and received an invalid response from the upstream server.",
  },

  SERVICE_UNAVAILABLE: {
    ref: "SERVICE_UNAVAILABLE",
    error: "ServiceUnavailable",
    statusCode: 503,
    message:
      "Service Unavailable - The server is currently unavailable (because it is overloaded or down for maintenance).",
  },

  GATEWAY_TIMEOUT: {
    ref: "GATEWAY_TIMEOUT",
    error: "GatewayTimeout",
    statusCode: 504,
    message:
      "Gateway Timeout - The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.",
  },

  HTTP_VERSION_NOT_SUPPORTED: {
    ref: "HTTP_VERSION_NOT_SUPPORTED",
    error: "HTTPVersionNotSupported",
    statusCode: 505,
    message: "HTTP Version",
  },
};

module.exports = HTTP_RESPONSE;
