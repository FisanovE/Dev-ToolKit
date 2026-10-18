package main

import (
	"context"
	"dev-toolkit/services"
)

type App struct {
	ctx           context.Context
	Base64Service *services.Base64Service
	CryptoService *services.CryptoService
	TokenService  *services.TokenService
	HexService    *services.HexService
}

func NewApp() *App {
	return &App{
		Base64Service: services.NewBase64Service(),
		CryptoService: services.NewCryptoService(),
		TokenService:  services.NewTokenService(),
		HexService:    services.NewHexService(),
	}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}
