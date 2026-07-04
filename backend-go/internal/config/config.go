package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port        string
	DatabaseURL string
	ClientURL   string
	JWTSecret   string
	JWTLifetime string
	NodeEnv     string
}

func Load() *Config {
	_ = godotenv.Load()

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	return &Config{
		Port:        port,
		DatabaseURL: os.Getenv("DATABASE_URL"),
		ClientURL:   os.Getenv("CLIENT_URL"),
		JWTSecret:   os.Getenv("JWT_SECRET"),
		JWTLifetime: os.Getenv("JWT_LIFETIME"),
		NodeEnv:     os.Getenv("NODE_ENV"),
	}
}

func (c *Config) IsProduction() bool {
	return c.NodeEnv == "production"
}
