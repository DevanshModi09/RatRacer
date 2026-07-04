package realtime

import (
	socketio "github.com/zishang520/socket.io/servers/socket/v3"

	"ratracer/backend/internal/room"
)

func registerPlayerEvents(io *socketio.Server, socket *socketio.Socket, rooms *room.Manager) {
	socket.On("disconnect", func(args ...any) {
		socketId := string(socket.Id())
		for _, r := range rooms.All() {
			var stillHasPlayers bool
			rooms.WithLock(func() {
				r.Players = filterPlayers(r.Players, socketId)
				stillHasPlayers = len(r.Players) > 0
			})

			io.To(socketio.Room(r.RoomCode)).Emit("room_updated", r)

			if !stillHasPlayers {
				rooms.Delete(r.RoomCode)
			}
		}
	})
}
