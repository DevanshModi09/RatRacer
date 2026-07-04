package auth

import (
	"strconv"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type TokenPayload struct {
	Username string `json:"username"`
	UserId   uint   `json:"userId"`
	Role     string `json:"role"`
}

type claims struct {
	TokenPayload
	jwt.RegisteredClaims
}

// parseLifetime supports Node's `ms`-style shorthand used in JWT_LIFETIME
// (e.g. "6d", "12h"), falling back to Go's time.ParseDuration, and finally
// a 6 day default if unset or invalid.
func parseLifetime(raw string) time.Duration {
	const defaultLifetime = 6 * 24 * time.Hour
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return defaultLifetime
	}
	if strings.HasSuffix(raw, "d") {
		if n, err := strconv.Atoi(strings.TrimSuffix(raw, "d")); err == nil {
			return time.Duration(n) * 24 * time.Hour
		}
	}
	if d, err := time.ParseDuration(raw); err == nil {
		return d
	}
	return defaultLifetime
}

func CreateJWT(secret string, lifetime string, payload TokenPayload) (string, error) {
	now := time.Now()
	c := claims{
		TokenPayload: payload,
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(now.Add(parseLifetime(lifetime))),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, c)
	return token.SignedString([]byte(secret))
}

func VerifyToken(secret string, tokenString string) (*TokenPayload, error) {
	var c claims
	_, err := jwt.ParseWithClaims(tokenString, &c, func(t *jwt.Token) (any, error) {
		return []byte(secret), nil
	})
	if err != nil {
		return nil, err
	}
	return &c.TokenPayload, nil
}
