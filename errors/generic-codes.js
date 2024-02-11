
export const BAD_REQUEST = {
    "error": "BadRequest",
    "code": "400",
    "message": "Bad Request - The server cannot or will not process the request due to an apparent client error."
};
export const UNAUTHORIZED = {
    "error": "Unauthorized",
    "code": "401",
    "message": "Unauthorized - Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided."
};
export const PAYMENT_REQUIRED = {
    "error": "PaymentRequired",
    "code": "402",
    "message": "Payment Required - The server refuses the request because the client has not provided the proper payment."
};
export const FORBIDDEN = {
    "error": "Forbidden",
    "code": "403",
    "message": "Forbidden - The client does not have access rights to the content, i.e., they are unauthorized, so server is rejecting to give proper response."
};
export const NOT_FOUND = {
    "error": "NotFound",
    "code": "404",
    "message": "Not Found - The server can not find requested resource."
};
export const METHOD_NOT_ALLOWED = {
    "error": "MethodNotAllowed",
    "code": "405",
    "message": "Method Not Allowed - The method specified in the request is not allowed."
};
export const NOT_ACCEPTABLE = {
    "error": "NotAcceptable",
    "code": "406",
    "message": "Not Acceptable - The server can only generate a response that is not accepted by the client."
};
export const PROXY_AUTHENTICATION_REQUIRED = {
    "error": "ProxyAuthenticationRequired",
    "code": "407",
    "message": "Proxy Authentication Required - The client must first authenticate itself with the proxy."
};
export const REQUEST_TIMEOUT = {
    "error": "RequestTimeout",
    "code": "408",
    "message": "Request Timeout - The server timed out waiting for the request."
};
export const CONFLICT = {
    "error": "Conflict",
    "code": "409",
    "message": "Conflict - The request could not be completed because of a conflict in the request."
};

export const GONE = {
    "error": "Gone",
    "code": "410",
    "message": "Gone - The requested page is no longer available."
};

export const LENGTH_REQUIRED = {
    "error": "LengthRequired",
    "code": "411",
    "message": "Length Required - The request did not specify the length of its content, which is required by the requested resource."
};

export const PRECONDITION_FAILED = {
    "error": "PreconditionFailed",
    "code": "412",
    "message": "Precondition Failed - The server does not meet one of the preconditions that the requester put on the request."
};

export const PAYLOAD_TOO_LARGE = {
    "error": "PayloadTooLarge",
    "code": "413",
    "message": "Payload Too Large - The request is larger than the server is willing or able to process."
};

export const URI_TOO_LONG = {
    "error": "URITooLong",
    "code": "414",
    "message": "URI Too Long - The URI provided was too long for the server to process."
};

export const UNSUPPORTED_MEDIA_TYPE = {
    "error": "UnsupportedMediaType",
    "code": "415",
    "message": "Unsupported Media Type - The request entity has a media type which the server or resource does not support."
};

export const RANGE_NOT_SATISFIABLE = {
    "error": "RangeNotSatisfiable",
    "code": "416",
    "message": "Range Not Satisfiable - The client has asked for a portion of the file, but the server cannot supply that portion."
};

export const EXPECTATION_FAILED = {
    "error": "ExpectationFailed",
    "code": "417",
    "message": "Expectation Failed - The server cannot meet the requirements of the Expect request-header field."
};

export const I_AM_A_TEAPOT = {
    "error": "ImATeapot",
    "code": "418",
    "message": "I'm a teapot - The server refuses to brew coffee because it is, permanently, a teapot."
};

export const MISDIRECTED_REQUEST = {
    "error": "MisdirectedRequest",
    "code": "421",
    "message": "Misdirected Request - The request was directed at a server that is not able to produce a response."
};

export const UNPROCESSABLE_ENTITY = {
    "error": "UnprocessableEntity",
    "code": "422",
    "message": "Unprocessable Entity - The request was well-formed but was unable to be followed due to semantic errors."
};

export const LOCKED = {
    "error": "Locked",
    "code": "423",
    "message": "Locked - The resource that is being accessed is locked."
};

export const FAILED_DEPENDENCY = {
    "error": "FailedDependency",
    "code": "424",
    "message": "Failed Dependency - The request failed due to failure of a previous request."
};

export const TOO_EARLY = {
    "error": "TooEarly",
    "code": "425",
    "message": "Too Early - Indicates that the server is unwilling to risk processing a request that might be replayed."
};

export const UPGRADE_REQUIRED = {
    "error": "UpgradeRequired",
    "code": "426",
    "message": "Upgrade Required - The client should switch to a different protocol such as TLS/1.0."
};

export const PRECONDITION_REQUIRED = {
    "error": "PreconditionRequired",
    "code": "428",
    "message": "Precondition Required - The origin server requires the request to be conditional."
};

export const TOO_MANY_REQUESTS = {
    "error": "TooManyRequests",
    "code": "429",
    "message": "Too Many Requests - The user has sent too many requests in a given amount of time."
};

export const REQUEST_HEADER_FIELDS_TOO_LARGE = {
    "error": "RequestHeaderFieldsTooLarge",
    "code": "431",
    "message": "Request Header Fields Too Large - The server is unwilling to process the request because either an individual header field or all the header fields collectively are too large."
};

export const UNAVAILABLE_FOR_LEGAL_REASONS = {
    "error": "UnavailableForLegalReasons",
    "code": "451",
    "message": "Unavailable For Legal Reasons - A server operator has received a legal demand to deny access to a resource or to a set of resources that includes the requested resource."
};

export const INTERNAL_SERVER_ERROR = {
    "error": "InternalServerError",
    "code": "500",
    "message": "Internal Server Error - A generic error message, given when an unexpected condition was encountered and no more specific message is suitable."
};

export const NOT_IMPLEMENTED = {
    "error": "NotImplemented",
    "code": "501",
    "message": "Not Implemented - The server either does not recognize the request method, or it lacks the ability to fulfill the request."
};

export const BAD_GATEWAY = {
    "error": "BadGateway",
    "code": "502",
    "message": "Bad Gateway - The server was acting as a gateway or proxy and received an invalid response from the upstream server."
};

export const SERVICE_UNAVAILABLE = {
    "error": "ServiceUnavailable",
    "code": "503",
    "message": "Service Unavailable - The server is currently unavailable (because it is overloaded or down for maintenance)."
};

export const GATEWAY_TIMEOUT = {
    "error": "GatewayTimeout",
    "code": "504",
    "message": "Gateway Timeout - The server was acting as a gateway or proxy and did not receive a timely response from the upstream server."
};

export const HTTP_VERSION_NOT_SUPPORTED = {
    "error": "HTTPVersionNotSupported",
    "code": "505",
    "message": "HTTP Version"
};
