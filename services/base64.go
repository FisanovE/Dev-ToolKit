package services

import (
	"encoding/base64"
	"fmt"
)

type Base64Service struct{}

func NewBase64Service() *Base64Service {
	return &Base64Service{}
}

// Encode кодирует строку в Base64
func (s *Base64Service) Encode(text string) (string, error) {
	return base64.StdEncoding.EncodeToString([]byte(text)), nil
}

// Decode декодирует строку из Base64
func (s *Base64Service) Decode(encodedText string) (string, error) {
	decoded, err := base64.StdEncoding.DecodeString(encodedText)
	if err != nil {
		return "", fmt.Errorf("ошибка декодирования: %v", err)
	}
	return string(decoded), nil
}
