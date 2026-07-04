package realtime

import (
	"math/rand"
	"strings"
)

const roomCodeAlphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"

func generateRoomCode() string {
	var sb strings.Builder
	for i := 0; i < 6; i++ {
		sb.WriteByte(roomCodeAlphabet[rand.Intn(len(roomCodeAlphabet))])
	}
	return sb.String()
}
