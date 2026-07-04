package main

import (
	"log"
	"net/http"
	"path/filepath"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/adaptor"
	"github.com/gofiber/fiber/v2/middleware/cors"

	"ratracer/backend/internal/auth"
	"ratracer/backend/internal/config"
	"ratracer/backend/internal/db"
	"ratracer/backend/internal/httpapi"
	"ratracer/backend/internal/realtime"
	"ratracer/backend/internal/room"
)

func main() {
	cfg := config.Load()

	database, err := db.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	rooms := room.NewManager()
	io := realtime.NewServer(cfg, database, rooms)

	app := fiber.New(fiber.Config{
		ErrorHandler: httpapi.ErrorHandler(cfg),
	})

	app.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.ClientURL,
		AllowCredentials: true,
	}))

	authHandlers := httpapi.NewAuthHandlers(database, cfg)
	leaderboardHandlers := httpapi.NewLeaderboardHandlers(database)

	authGroup := app.Group("/api/v1/auth")
	authGroup.Post("/register", authHandlers.Register)
	authGroup.Post("/login", authHandlers.Login)
	authGroup.Get("/logout", authHandlers.Logout)
	authGroup.Get("/check", auth.Authenticate(cfg), authHandlers.CheckAuth)

	leaderboardGroup := app.Group("/api/v1/leaderboard")
	leaderboardGroup.Get("/", auth.Authenticate(cfg), leaderboardHandlers.Get)

	if cfg.IsProduction() {
		frontendDist := filepath.Join("..", "frontend", "dist")
		app.Static("/", frontendDist)
		app.Get("/*", func(c *fiber.Ctx) error {
			return c.SendFile(filepath.Join(frontendDist, "index.html"))
		})
	}

	mux := http.NewServeMux()
	mux.Handle("/socket.io/", io.ServeHandler(nil))
	mux.Handle("/", adaptor.FiberApp(app))

	log.Printf("Server is running on port : %s", cfg.Port)
	if err := http.ListenAndServe(":"+cfg.Port, mux); err != nil {
		log.Fatal(err)
	}
}
