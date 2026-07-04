package apierror

import "net/http"

// APIError is a request error carrying an HTTP status code, mirroring the
// old CustomAPIError hierarchy (BadRequest/Unauthenticated/Unauthorized/NotFound).
type APIError struct {
	StatusCode int
	Message    string
}

func (e *APIError) Error() string {
	return e.Message
}

func BadRequest(msg string) *APIError {
	return &APIError{StatusCode: http.StatusBadRequest, Message: msg}
}

func Unauthenticated(msg string) *APIError {
	return &APIError{StatusCode: http.StatusUnauthorized, Message: msg}
}

func Unauthorized(msg string) *APIError {
	return &APIError{StatusCode: http.StatusUnauthorized, Message: msg}
}

func NotFound(msg string) *APIError {
	return &APIError{StatusCode: http.StatusNotFound, Message: msg}
}
