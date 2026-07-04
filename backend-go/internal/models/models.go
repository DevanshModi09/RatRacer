package models

import "time"

type Role string

const (
	RoleUser  Role = "USER"
	RoleAdmin Role = "ADMIN"
)

type User struct {
	ID          uint     `gorm:"primaryKey"`
	Username    string   `gorm:"uniqueIndex;not null"`
	Email       string   `gorm:"uniqueIndex;not null"`
	Password    string   `gorm:"not null"`
	Role        Role     `gorm:"type:varchar(10);not null;default:USER"`
	XP          int      `gorm:"not null;default:0"`
	Coins       int      `gorm:"not null;default:0"`
	Level       int      `gorm:"not null;default:1"`
	BestWpm     int      `gorm:"not null;default:0"`
	AvgWpm      float64  `gorm:"not null;default:0"`
	TotalRaces  int      `gorm:"not null;default:0"`
	TotalWins   int      `gorm:"not null;default:0"`
	IsVerified  bool     `gorm:"not null;default:false"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
	RaceResults []RaceResult
}

type RaceResult struct {
	ID            uint `gorm:"primaryKey"`
	UserID        uint `gorm:"not null;index"`
	User          User
	RoomCode      string
	Wpm           int
	Accuracy      float64
	Position      int
	PlayersInRoom int
	XPEarned      int
	CoinsEarned   int
	CreatedAt     time.Time
}
