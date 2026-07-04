package httpapi

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"ratracer/backend/internal/models"
)

type LeaderboardHandlers struct {
	db *gorm.DB
}

func NewLeaderboardHandlers(db *gorm.DB) *LeaderboardHandlers {
	return &LeaderboardHandlers{db: db}
}

type leaderboardEntry struct {
	Username   string  `json:"username"`
	BestWpm    int     `json:"bestWpm"`
	AvgWpm     float64 `json:"avgWpm"`
	TotalWins  int     `json:"totalWins"`
	TotalRaces int     `json:"totalRaces"`
	Level      int     `json:"level"`
}

func (h *LeaderboardHandlers) Get(c *fiber.Ctx) error {
	var users []models.User
	if err := h.db.Order("best_wpm DESC").Limit(30).Find(&users).Error; err != nil {
		return err
	}

	leaderboard := make([]leaderboardEntry, 0, len(users))
	for _, u := range users {
		leaderboard = append(leaderboard, leaderboardEntry{
			Username:   u.Username,
			BestWpm:    u.BestWpm,
			AvgWpm:     u.AvgWpm,
			TotalWins:  u.TotalWins,
			TotalRaces: u.TotalRaces,
			Level:      u.Level,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"leaderboard": leaderboard})
}
