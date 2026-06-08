.PHONY: run build test clean dev

run:
	go run ./cmd/server

build:
	go build -o bin/server ./cmd/server

test:
	go test ./...

clean:
	rm -rf bin/

dev:
	@echo "Starting with docker-compose..."
	docker-compose up --build -d
	@echo "App running at http://localhost:8080"

dev-down:
	docker-compose down

dev-logs:
	docker-compose logs -f

migrate-up:
	migrate -path migrations -database "$(DATABASE_URL)" up

migrate-down:
	migrate -path migrations -database "$(DATABASE_URL)" down

seed:
	go run ./seed

.PHONY: run build test clean dev dev-down dev-logs migrate-up migrate-down
