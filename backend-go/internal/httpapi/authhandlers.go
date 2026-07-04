package httpapi

import (
	"errors"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"ratracer/backend/internal/apierror"
	"ratracer/backend/internal/auth"
	"ratracer/backend/internal/config"
	"ratracer/backend/internal/models"
)

type AuthHandlers struct {
	db  *gorm.DB
	cfg *config.Config
}

func NewAuthHandlers(db *gorm.DB, cfg *config.Config) *AuthHandlers {
	return &AuthHandlers{db: db, cfg: cfg}
}

type registerBody struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type loginBody struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type userStats struct {
	XP         int     `json:"xp"`
	Level      int     `json:"level"`
	Coins      int     `json:"coins"`
	BestWpm    int     `json:"bestWpm"`
	AvgWpm     float64 `json:"avgWpm"`
	TotalRaces int     `json:"totalRaces"`
	TotalWins  int     `json:"totalWins"`
}

func statsOf(u *models.User) userStats {
	return userStats{
		XP:         u.XP,
		Level:      u.Level,
		Coins:      u.Coins,
		BestWpm:    u.BestWpm,
		AvgWpm:     u.AvgWpm,
		TotalRaces: u.TotalRaces,
		TotalWins:  u.TotalWins,
	}
}

type userResponse struct {
	Username   string `json:"username"`
	UserId     uint   `json:"userId"`
	Role       string `json:"role"`
	Email      string `json:"email"`
	IsVerified bool   `json:"isVerified"`
	userStats
}

func userResponseOf(payload auth.TokenPayload, u *models.User) userResponse {
	return userResponse{
		Username:   payload.Username,
		UserId:     payload.UserId,
		Role:       payload.Role,
		Email:      u.Email,
		IsVerified: u.IsVerified,
		userStats:  statsOf(u),
	}
}

func tokenPayloadOf(u *models.User) auth.TokenPayload {
	return auth.TokenPayload{Username: u.Username, UserId: u.ID, Role: string(u.Role)}
}

func (h *AuthHandlers) Register(c *fiber.Ctx) error {
	var body registerBody
	if err := c.BodyParser(&body); err != nil {
		return apierror.BadRequest("Please all fields : email , password and username")
	}
	if body.Username == "" || body.Email == "" || body.Password == "" {
		return apierror.BadRequest("Please all fields : email , password and username")
	}

	var existing models.User
	if err := h.db.Where("email = ?", body.Email).First(&existing).Error; err == nil {
		return apierror.BadRequest("Email already exists")
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}

	if err := h.db.Where("username = ?", body.Username).First(&existing).Error; err == nil {
		return apierror.BadRequest("Please choose a unique username")
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(body.Password), 10)
	if err != nil {
		return err
	}

	user := models.User{Username: body.Username, Email: body.Email, Password: string(hashed)}
	if err := h.db.Create(&user).Error; err != nil {
		return err
	}

	payload := tokenPayloadOf(&user)
	if err := auth.AttachCookie(c, h.cfg, payload); err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"user":    userResponseOf(payload, &user),
		"message": "Account Created",
	})
}

func (h *AuthHandlers) Login(c *fiber.Ctx) error {
	var body loginBody
	if err := c.BodyParser(&body); err != nil {
		return apierror.BadRequest("Please provide all fields")
	}
	if body.Email == "" || body.Password == "" {
		return apierror.BadRequest("Please provide all fields")
	}

	var user models.User
	if err := h.db.Where("email = ?", body.Email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return apierror.Unauthenticated("User does not exist , please create an account")
		}
		return err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password)); err != nil {
		return apierror.Unauthenticated("Invalid Credentials ")
	}

	payload := tokenPayloadOf(&user)
	if err := auth.AttachCookie(c, h.cfg, payload); err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"user":    userResponseOf(payload, &user),
		"message": "User Logged In",
	})
}

func (h *AuthHandlers) Logout(c *fiber.Ctx) error {
	auth.ClearCookie(c)
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"msg": "user logged out"})
}

func (h *AuthHandlers) CheckAuth(c *fiber.Ctx) error {
	payload := auth.UserFromCtx(c)

	var user models.User
	if err := h.db.First(&user, payload.UserId).Error; err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"user":    userResponseOf(payload, &user),
		"message": "User Logged In",
	})
}
