package httpapi

import (
	"errors"
	"log"
	"net/http"

	"github.com/gofiber/fiber/v2"

	"ratracer/backend/internal/apierror"
	"ratracer/backend/internal/config"
)

func ErrorHandler(cfg *config.Config) fiber.ErrorHandler {
	return func(c *fiber.Ctx, err error) error {
		if !cfg.IsProduction() {
			log.Println(err)
		}

		statusCode := http.StatusInternalServerError
		msg := "Something went wrong try again later"

		var apiErr *apierror.APIError
		var fiberErr *fiber.Error
		switch {
		case errors.As(err, &apiErr):
			statusCode = apiErr.StatusCode
			msg = apiErr.Message
		case errors.As(err, &fiberErr):
			statusCode = fiberErr.Code
			msg = fiberErr.Message
		}

		return c.Status(statusCode).JSON(fiber.Map{"msg": msg})
	}
}
