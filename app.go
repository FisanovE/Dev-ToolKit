package main

import (
	"context"
	"dev-toolkit/services" // Подключаем наш пакет
)

type App struct {
	ctx           context.Context
	Base64Service *services.Base64Service // Добавляем сервис в структуру
	CryptoService *services.CryptoService
	TokenService  *services.TokenService
	HexService    *services.HexService
}

func NewApp() *App {
	return &App{
		Base64Service: services.NewBase64Service(), // Инициализируем
		CryptoService: services.NewCryptoService(),
		TokenService:  services.NewTokenService(),
		HexService:    services.NewHexService(),
	}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}
