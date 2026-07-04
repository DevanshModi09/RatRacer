package realtime

import (
	"sort"
	"time"

	socketio "github.com/zishang520/socket.io/servers/socket/v3"
	"gorm.io/gorm"

	"ratracer/backend/internal/models"
	"ratracer/backend/internal/room"
)

const raceText = "should stand how still little back time real say play give even if can much in as order say should same well great but end could there would set well down take no because which early show plan"

func findPlayer(r *room.Room, socketId string) *room.Player {
	for _, p := range r.Players {
		if p.SocketId == socketId {
			return p
		}
	}
	return nil
}

func rewardFor(wpm int) (xp int, coins int) {
	xp, coins = 10, 20
	switch {
	case wpm >= 120:
		xp, coins = xp+200, coins+200
	case wpm >= 100:
		xp, coins = xp+100, coins+150
	case wpm >= 75:
		xp, coins = xp+40, coins+75
	case wpm >= 50:
		xp, coins = xp+20, coins+40
	}
	return xp, coins
}

func finalizeRace(db *gorm.DB, r *room.Room) {
	if r.RaceEnded {
		return
	}
	r.RaceEnded = true

	standings := make([]*room.Player, len(r.Players))
	copy(standings, r.Players)
	sort.Slice(standings, func(i, j int) bool {
		return standings[i].FinishedAt < standings[j].FinishedAt
	})

	for index, player := range standings {
		position := index + 1
		xp, coins := rewardFor(player.Wpm)

		var user models.User
		if err := db.First(&user, player.UserId).Error; err != nil {
			continue
		}

		bestWpm := user.BestWpm
		if player.Wpm > bestWpm {
			bestWpm = player.Wpm
		}
		avgWpm := (user.AvgWpm*float64(user.TotalRaces) + float64(player.Wpm)) / float64(user.TotalRaces+1)

		db.Transaction(func(tx *gorm.DB) error {
			result := models.RaceResult{
				UserID:        player.UserId,
				RoomCode:      r.RoomCode,
				PlayersInRoom: len(r.Players),
				Position:      position,
				Wpm:           player.Wpm,
				Accuracy:      player.Accuracy,
				XPEarned:      xp,
				CoinsEarned:   coins,
			}
			if err := tx.Create(&result).Error; err != nil {
				return err
			}

			updates := map[string]any{
				"xp":          gorm.Expr("xp + ?", xp),
				"coins":       gorm.Expr("coins + ?", coins),
				"total_races": gorm.Expr("total_races + ?", 1),
				"best_wpm":    bestWpm,
				"avg_wpm":     avgWpm,
			}
			if position == 1 {
				updates["total_wins"] = gorm.Expr("total_wins + ?", 1)
			}
			return tx.Model(&models.User{}).Where("id = ?", player.UserId).Updates(updates).Error
		})
	}
}

func registerRaceEvents(io *socketio.Server, socket *socketio.Socket, rooms *room.Manager, db *gorm.DB) {
	socket.On("player-ready", func(args ...any) {
		var body struct {
			RoomCode string `json:"roomCode"`
			IsReady  bool   `json:"isReady"`
		}
		if len(args) == 0 || bind(args[0], &body) != nil {
			return
		}

		r, ok := rooms.Get(body.RoomCode)
		if !ok {
			return
		}
		player := findPlayer(r, string(socket.Id()))
		if player == nil {
			return
		}

		var allReady bool
		rooms.WithLock(func() {
			player.Ready = body.IsReady
			allReady = true
			for _, p := range r.Players {
				if !p.Ready {
					allReady = false
					break
				}
			}
		})

		io.To(socketio.Room(body.RoomCode)).Emit("room_updated", r)

		if allReady {
			r.Text = raceText
			r.RaceStarted = true
			startTime := time.Now().Add(5 * time.Second).UnixMilli()
			io.To(socketio.Room(body.RoomCode)).Emit("start-race", map[string]any{
				"text":      r.Text,
				"startTime": startTime,
			})
		}
	})

	socket.On("progress-update", func(args ...any) {
		var body struct {
			RoomCode string `json:"roomCode"`
			Progress int    `json:"progress"`
			Wpm      int    `json:"wpm"`
		}
		if len(args) == 0 || bind(args[0], &body) != nil {
			return
		}

		r, ok := rooms.Get(body.RoomCode)
		if !ok {
			return
		}
		player := findPlayer(r, string(socket.Id()))
		if player == nil {
			return
		}

		rooms.WithLock(func() {
			player.Wpm = body.Wpm
			player.Progress = body.Progress
		})

		socket.To(socketio.Room(body.RoomCode)).Emit("opponent_progress", map[string]any{
			"username": player.Username,
			"socketId": string(socket.Id()),
			"progress": body.Progress,
			"wpm":      body.Wpm,
		})
	})

	socket.On("race-finished-for-one-user", func(args ...any) {
		var body struct {
			RoomCode string `json:"roomCode"`
			Stats    struct {
				Wpm      int     `json:"wpm"`
				Progress int     `json:"progress"`
				Accuracy float64 `json:"accuracy"`
			} `json:"stats"`
		}
		if len(args) == 0 || bind(args[0], &body) != nil {
			return
		}

		r, ok := rooms.Get(body.RoomCode)
		if !ok {
			return
		}
		player := findPlayer(r, string(socket.Id()))
		if player == nil {
			return
		}

		var allFinished bool
		rooms.WithLock(func() {
			player.Finished = true
			player.Wpm = body.Stats.Wpm
			player.Progress = body.Stats.Progress
			player.Accuracy = body.Stats.Accuracy
			player.FinishedAt = time.Now().UnixMilli()

			allFinished = true
			for _, p := range r.Players {
				if !p.Finished {
					allFinished = false
					break
				}
			}
		})

		if allFinished {
			finalizeRace(db, r)
		}
	})
}
