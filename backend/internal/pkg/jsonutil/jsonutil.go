package jsonutil

import (
	"encoding/json"
	"fmt"
	"os"
)

// ReadFile reads a JSON file and unmarshals it into dest.
// dest must be a pointer (e.g., &myStruct, &map[string]any).
//
// Usage:
//
//	var cfg Config
//	if err := jsonutil.ReadFile("config.json", &cfg); err != nil {
//	    return err
//	}
func ReadFile(path string, dest any) error {
	data, err := os.ReadFile(path)
	if err != nil {
		return fmt.Errorf("read file %s: %w", path, err)
	}

	if err := json.Unmarshal(data, dest); err != nil {
		return fmt.Errorf("unmarshal %s: %w", path, err)
	}

	return nil
}
