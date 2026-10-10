package services

import (
	"encoding/hex"
	"fmt"
)

type HexService struct{}

func NewHexService() *HexService {
	return &HexService{}
}

func (s *HexService) Encode(text string) (string, error) {
	return hex.EncodeToString([]byte(text)), nil
}

func (s *HexService) Decode(encodedText string) (string, error) {
	decoded, err := hex.DecodeString(encodedText)
	if err != nil {
		return "", fmt.Errorf("ошибка декодирования: %v", err)
	}
	return string(decoded), nil
}
