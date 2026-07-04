package auth

import (
	"github.com/gofiber/fiber/v2"

	"ratracer/backend/internal/apierror"
	"ratracer/backend/internal/config"
)

const UserLocalsKey = "user"

func Authenticate(cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		token := c.Cookies(CookieName)
		if token == "" {
			return apierror.Unauthenticated("Authentication Invalid")
		}
		payload, err := VerifyToken(cfg.JWTSecret, token)
		if err != nil {
			return apierror.Unauthenticated("Authentication Invalid")
		}
		c.Locals(UserLocalsKey, *payload)
		return c.Next()
	}
}

func UserFromCtx(c *fiber.Ctx) TokenPayload {
	return c.Locals(UserLocalsKey).(TokenPayload)
}
