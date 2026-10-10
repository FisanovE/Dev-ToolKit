package services

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type TokenService struct{}

func NewTokenService() *TokenService {
	return &TokenService{}
}

type JWTRequest struct {
	Secret       string                 `json:"secret"`
	Issuer       string                 `json:"issuer,omitempty"`
	Subject      string                 `json:"subject,omitempty"`
	Audience     string                 `json:"audience,omitempty"`
	ExpiresIn    int64                  `json:"expiresIn"`
	NotBefore    int64                  `json:"notBefore,omitempty"`
	CustomClaims map[string]interface{} `json:"customClaims,omitempty"`
}

func (s *TokenService) GenerateAdvancedToken(req JWTRequest) (string, error) {
	if req.Secret == "" {
		return "", fmt.Errorf("секретный ключ обязателен")
	}

	claims := jwt.MapClaims{}

	if req.Issuer != "" {
		claims["iss"] = req.Issuer
	}

	if req.Subject != "" {
		claims["sub"] = req.Subject
	}

	if req.Audience != "" {
		claims["aud"] = req.Audience
	}

	now := time.Now()
	claims["iat"] = now.Unix()

	if req.ExpiresIn > 0 {
		claims["exp"] = now.Add(time.Duration(req.ExpiresIn) * time.Second).Unix()
	}

	if req.NotBefore > 0 {
		claims["nbf"] = req.NotBefore
	}

	for key, value := range req.CustomClaims {
		claims[key] = value
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte(req.Secret))
	if err != nil {
		return "", fmt.Errorf("ошибка подписи токена: %v", err)
	}

	return tokenString, nil
}
