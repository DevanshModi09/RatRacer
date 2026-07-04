package realtime

import (
	socketio "github.com/zishang520/socket.io/servers/socket/v3"
	"github.com/zishang520/socket.io/v3/pkg/types"
	"gorm.io/gorm"

	"ratracer/backend/internal/auth"
	"ratracer/backend/internal/config"
	"ratracer/backend/internal/room"
)

// NewServer builds the socket.io server, replicating initOrGetSocket.ts
// (JWT-cookie auth middleware) + socketHandler.ts (registering the
// room/race/player event handlers on every new connection).
func NewServer(cfg *config.Config, db *gorm.DB, rooms *room.Manager) *socketio.Server {
	opts := socketio.DefaultServerOptions()
	opts.SetCors(&types.Cors{
		Origin:      cfg.ClientURL,
		Credentials: true,
	})

	io := socketio.NewServer(nil, opts)

	io.Use(func(s *socketio.Socket, next func(*socketio.ExtendedError)) {
		req := s.Request().Request()
		cookie, err := req.Cookie(auth.CookieName)
		if err != nil || cookie.Value == "" {
			next(socketio.NewExtendedError("Unauthorized", nil))
			return
		}
		payload, err := auth.VerifyToken(cfg.JWTSecret, cookie.Value)
		if err != nil {
			next(socketio.NewExtendedError("Unauthorized", nil))
			return
		}
		s.SetData(*payload)
		next(nil)
	})

	io.On("connection", func(clients ...any) {
		socket := clients[0].(*socketio.Socket)
		registerRoomEvents(io, socket, rooms)
		registerRaceEvents(io, socket, rooms, db)
		registerPlayerEvents(io, socket, rooms)
	})

	return io
}

func userOf(s *socketio.Socket) auth.TokenPayload {
	return s.Data().(auth.TokenPayload)
}
