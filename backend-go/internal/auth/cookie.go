package auth

import (
	"time"

	"github.com/gofiber/fiber/v2"

	"ratracer/backend/internal/config"
)

const CookieName = "token"

// AttachCookie signs a JWT for the given payload and sets it as an httpOnly
// cookie, mirroring attachCookiesToResponse from the Express backend.
func AttachCookie(c *fiber.Ctx, cfg *config.Config, payload TokenPayload) error {
	token, err := CreateJWT(cfg.JWTSecret, cfg.JWTLifetime, payload)
	if err != nil {
		return err
	}
	sixDays := 6 * 24 * time.Hour
	c.Cookie(&fiber.Cookie{
		Name:     CookieName,
		Value:    token,
		Expires:  time.Now().Add(sixDays),
		HTTPOnly: true,
		Secure:   cfg.IsProduction(),
		SameSite: "Lax",
	})
	return nil
}

func ClearCookie(c *fiber.Ctx) {
	c.Cookie(&fiber.Cookie{
		Name:     CookieName,
		Value:    "logout",
		Expires:  time.Now(),
		HTTPOnly: true,
	})
}
