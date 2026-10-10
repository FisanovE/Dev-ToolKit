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
	ExpiresIn    int64                  `json:"expiresIn"`              // Время жизни в секундах
	NotBefore    int64                  `json:"notBefore,omitempty"`    // Unix timestamp
	CustomClaims map[string]interface{} `json:"customClaims,omitempty"` // Любые доп. поля формы
}

// GenerateSimpleToken создает HS256 JWT токен с именем пользователя на 1 час
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

	// 2. Инициализируем токен с алгоритмом подписи HS256
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// 3. Подписываем токен нашим секретным ключом (преобразованным в байты)
	tokenString, err := token.SignedString([]byte(req.Secret))
	if err != nil {
		return "", fmt.Errorf("ошибка подписи токена: %v", err)
	}

	return tokenString, nil
}
