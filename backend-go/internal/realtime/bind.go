package realtime

import "encoding/json"

// bind decodes a socket.io event argument (typically a map[string]any after
// JSON parsing) into a typed struct, since Go event listeners receive ...any.
func bind(arg any, target any) error {
	b, err := json.Marshal(arg)
	if err != nil {
		return err
	}
	return json.Unmarshal(b, target)
}
