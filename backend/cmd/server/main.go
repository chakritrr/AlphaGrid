package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"github.com/chakritrr/AlphaGrid/backend/internal/handler"
	"github.com/chakritrr/AlphaGrid/backend/internal/middleware"
	"github.com/chakritrr/AlphaGrid/backend/internal/pkg/config"
	"github.com/chakritrr/AlphaGrid/backend/internal/pkg/database"
	"github.com/chakritrr/AlphaGrid/backend/internal/repository/postgres"
	"github.com/chakritrr/AlphaGrid/backend/internal/usecase"
	"github.com/chakritrr/AlphaGrid/backend/seed"
)

func main() {
	// Load .env
	_ = godotenv.Load()

	cfg := config.Load()

	// Database
	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Database connection failed: %v", err)
	}
	defer db.Close()

	// Run migrations
	if err := database.RunMigrations(db, "migrations"); err != nil {
		log.Printf("Warning: migrations: %v", err)
	}

	// Seed data
	seeder := seed.NewSeeder(db)
	if err := seeder.Seed(); err != nil {
		log.Printf("Warning: seeding: %v", err)
	}

	// Repositories
	userRepo := postgres.NewUserRepo(db)
	botRepo := postgres.NewBotRepo(db)
	tradeRepo := postgres.NewTradeRepo(db)
	exchangeRepo := postgres.NewExchangeRepo(db)
	subRepo := postgres.NewSubscriptionRepo(db)
	alertRepo := postgres.NewAlertRepo(db)
	analyticsRepo := postgres.NewAnalyticsRepo(db)

	// Usecases
	authUsecase := usecase.NewAuthUsecase(userRepo, cfg.JWTSecret, cfg.JWTExpiration)
	dashboardUsecase := usecase.NewDashboardUsecase(botRepo, tradeRepo, analyticsRepo)
	exchangeUsecase := usecase.NewExchangeUsecase(exchangeRepo)
	subUsecase := usecase.NewSubscriptionUsecase(subRepo)
	adminUsecase := usecase.NewAdminUsecase(userRepo, botRepo, subRepo, alertRepo, analyticsRepo)

	// Handlers
	authHandler := handler.NewAuthHandler(authUsecase)
	dashHandler := handler.NewDashboardHandler(dashboardUsecase, exchangeUsecase, subUsecase)
	adminHandler := handler.NewAdminHandler(adminUsecase)

	// Router
	r := gin.Default()
	r.Use(middleware.CORSMiddleware(cfg.CORSOrigin))

	// Health
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Public
	r.POST("/api/v1/auth/register", authHandler.Register)
	r.POST("/api/v1/auth/login", authHandler.Login)

	// User API (JWT required)
	user := r.Group("/api/v1")
	user.Use(middleware.AuthMiddleware(cfg.JWTSecret))
	{
		user.GET("/dashboard/stats", dashHandler.GetStats)
		user.GET("/portfolio/pnl", dashHandler.GetPnL)
		user.GET("/bots", dashHandler.GetBots)
		user.POST("/bots", dashHandler.CreateBot)
		user.PATCH("/bots/:id/toggle", dashHandler.ToggleBot)
		user.GET("/trades", dashHandler.GetTrades)
		user.GET("/exchanges", dashHandler.GetExchanges)
		user.POST("/exchanges", dashHandler.ConnectExchange)
		user.GET("/performance", dashHandler.GetPerformance)
		user.GET("/subscription", dashHandler.GetSubscription)
		user.GET("/subscription/plans", dashHandler.GetPlans)
		user.GET("/subscription/payments", dashHandler.GetPayments)
	}

	// Admin API (JWT + admin role)
	admin := r.Group("/api/admin/v1")
	admin.Use(middleware.AuthMiddleware(cfg.JWTSecret))
	admin.Use(middleware.AdminMiddleware())
	{
		admin.GET("/dashboard", adminHandler.GetDashboard)
		admin.GET("/signups", adminHandler.GetSignups)
		admin.GET("/revenue/split", adminHandler.GetRevenueSplit)
		admin.GET("/users", adminHandler.ListUsers)
		admin.PATCH("/users/:id/status", adminHandler.UpdateUserStatus)
		admin.GET("/bots", adminHandler.ListBots)
		admin.GET("/subscriptions/mrr", adminHandler.GetMRRSeries)
		admin.GET("/subscriptions/plans", adminHandler.GetPlanBreakdown)
		admin.GET("/subscriptions/renewals", adminHandler.GetRenewals)
		admin.GET("/alerts", adminHandler.ListAlerts)
		admin.PATCH("/alerts/:id/acknowledge", adminHandler.AcknowledgeAlert)
	}

	// Start server
	log.Printf("Starting server on port %s", cfg.ServerPort)
	if err := r.Run(":" + cfg.ServerPort); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
