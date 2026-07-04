package room

import "sync"

type Player struct {
	UserId     uint    `json:"userId"`
	SocketId   string  `json:"socketId"`
	Username   string  `json:"username"`
	Ready      bool    `json:"ready"`
	Accuracy   float64 `json:"accuracy"`
	FinishedAt int64   `json:"finishedAt"`
	Progress   int     `json:"progress"`
	Wpm        int     `json:"wpm"`
	Finished   bool    `json:"finished"`
}

type Room struct {
	RoomCode    string    `json:"roomCode"`
	Players     []*Player `json:"players"`
	RaceEnded   bool      `json:"raceEnded"`
	Text        string    `json:"text"`
	RaceStarted bool      `json:"raceStarted"`
	CreatedAt   int64     `json:"createdAt"`
}

// Manager is a concurrency-safe in-memory store of active rooms, mirroring
// the `rooms` Map shared across the Node socket handlers.
type Manager struct {
	mu    sync.Mutex
	rooms map[string]*Room
}

func NewManager() *Manager {
	return &Manager{rooms: make(map[string]*Room)}
}

func (m *Manager) Get(roomCode string) (*Room, bool) {
	m.mu.Lock()
	defer m.mu.Unlock()
	r, ok := m.rooms[roomCode]
	return r, ok
}

func (m *Manager) Set(r *Room) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.rooms[r.RoomCode] = r
}

func (m *Manager) Delete(roomCode string) {
	m.mu.Lock()
	defer m.mu.Unlock()
	delete(m.rooms, roomCode)
}

// All returns a snapshot slice of the current rooms, safe to range over
// even while other goroutines mutate the manager (mirroring `for (const
// [roomCode, room] of rooms)` in registerPlayerEvents.ts).
func (m *Manager) All() []*Room {
	m.mu.Lock()
	defer m.mu.Unlock()
	out := make([]*Room, 0, len(m.rooms))
	for _, r := range m.rooms {
		out = append(out, r)
	}
	return out
}

// WithLock runs fn while holding the manager lock, so callers can safely
// read-modify-write a room's player list without racing other handlers.
func (m *Manager) WithLock(fn func()) {
	m.mu.Lock()
	defer m.mu.Unlock()
	fn()
}
