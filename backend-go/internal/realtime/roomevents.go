package realtime

import (
	"time"

	socketio "github.com/zishang520/socket.io/servers/socket/v3"

	"ratracer/backend/internal/room"
)

func registerRoomEvents(io *socketio.Server, socket *socketio.Socket, rooms *room.Manager) {
	socket.On("create-room", func(args ...any) {
		user := userOf(socket)
		roomCode := generateRoomCode()
		player := &room.Player{
			UserId:   user.UserId,
			Username: user.Username,
			SocketId: string(socket.Id()),
		}
		r := &room.Room{
			RoomCode:  roomCode,
			Players:   []*room.Player{player},
			CreatedAt: time.Now().UnixMilli(),
		}
		rooms.Set(r)
		socket.Join(socketio.Room(roomCode))
		socket.Emit("room_created", r)
	})

	socket.On("join-room", func(args ...any) {
		var body struct {
			RoomCode string `json:"roomCode"`
		}
		if len(args) == 0 || bind(args[0], &body) != nil || body.RoomCode == "" {
			return
		}

		r, ok := rooms.Get(body.RoomCode)
		if !ok {
			socket.Emit("error_message", "Room not found")
			return
		}
		if r.RaceStarted {
			socket.Emit("error_message", "Race already started")
			return
		}

		user := userOf(socket)
		player := &room.Player{
			UserId:   user.UserId,
			Username: user.Username,
			SocketId: string(socket.Id()),
		}
		rooms.WithLock(func() {
			r.Players = append(r.Players, player)
		})
		socket.Join(socketio.Room(body.RoomCode))
		io.To(socketio.Room(body.RoomCode)).Emit("room_updated", r)
	})

	socket.On("leave-room", func(args ...any) {
		var body struct {
			RoomCode string `json:"roomCode"`
		}
		if len(args) == 0 || bind(args[0], &body) != nil || body.RoomCode == "" {
			return
		}

		r, ok := rooms.Get(body.RoomCode)
		if !ok {
			socket.Emit("error_message", "Room not found")
			return
		}

		rooms.WithLock(func() {
			r.Players = filterPlayers(r.Players, string(socket.Id()))
		})
		socket.Leave(socketio.Room(body.RoomCode))
		if len(r.Players) == 0 {
			rooms.Delete(body.RoomCode)
		}
		io.To(socketio.Room(body.RoomCode)).Emit("room_updated", r)
	})
}

func filterPlayers(players []*room.Player, excludeSocketId string) []*room.Player {
	out := players[:0]
	for _, p := range players {
		if p.SocketId != excludeSocketId {
			out = append(out, p)
		}
	}
	return out
}
