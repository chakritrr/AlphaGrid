package postgres

import (
	"database/sql"
	"fmt"
	"strings"
	"time"

	"github.com/chakritrr/AlphaGrid/backend/internal/domain"
)

type UserRepo struct {
	db *sql.DB
}

func NewUserRepo(db *sql.DB) *UserRepo {
	return &UserRepo{db: db}
}

func (r *UserRepo) Create(user *domain.User) error {
	query := `INSERT INTO users (name, email, password_hash, role, plan, status, bots_used, bots_limit, country)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id, created_at, updated_at`
	return r.db.QueryRow(query,
		user.Name, user.Email, user.PasswordHash, user.Role,
		user.Plan, user.Status, user.BotsUsed, user.BotsLimit, user.Country,
	).Scan(&user.ID, &user.CreatedAt, &user.UpdatedAt)
}

func (r *UserRepo) FindByID(id string) (*domain.User, error) {
	u := &domain.User{}
	query := `SELECT id, name, email, password_hash, role, plan, status, bots_used, bots_limit,
		COALESCE(avatar_url,''), COALESCE(country,''), created_at, updated_at FROM users WHERE id = $1`
	err := r.db.QueryRow(query, id).Scan(
		&u.ID, &u.Name, &u.Email, &u.PasswordHash, &u.Role, &u.Plan,
		&u.Status, &u.BotsUsed, &u.BotsLimit, &u.AvatarURL, &u.Country,
		&u.CreatedAt, &u.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return u, err
}

func (r *UserRepo) FindByEmail(email string) (*domain.User, error) {
	u := &domain.User{}
	query := `SELECT id, name, email, password_hash, role, plan, status, bots_used, bots_limit,
		COALESCE(avatar_url,''), COALESCE(country,''), created_at, updated_at FROM users WHERE email = $1`
	err := r.db.QueryRow(query, email).Scan(
		&u.ID, &u.Name, &u.Email, &u.PasswordHash, &u.Role, &u.Plan,
		&u.Status, &u.BotsUsed, &u.BotsLimit, &u.AvatarURL, &u.Country,
		&u.CreatedAt, &u.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return u, err
}

func (r *UserRepo) Update(user *domain.User) error {
	user.UpdatedAt = time.Now()
	query := `UPDATE users SET name=$1, email=$2, role=$3, plan=$4, status=$5,
		bots_used=$6, bots_limit=$7, avatar_url=$8, country=$9, updated_at=$10 WHERE id=$11`
	_, err := r.db.Exec(query, user.Name, user.Email, user.Role, user.Plan, user.Status,
		user.BotsUsed, user.BotsLimit, user.AvatarURL, user.Country, user.UpdatedAt, user.ID)
	return err
}

func (r *UserRepo) UpdateStatus(id, status string) error {
	_, err := r.db.Exec(`UPDATE users SET status=$1, updated_at=NOW() WHERE id=$2`, status, id)
	return err
}

func (r *UserRepo) List(filter domain.UserFilter) ([]domain.User, int, error) {
	where := []string{"1=1"}
	args := []interface{}{}
	idx := 1

	if filter.Search != "" {
		where = append(where, fmt.Sprintf("(LOWER(name) LIKE LOWER($%d) OR LOWER(email) LIKE LOWER($%d) OR LOWER(id::text) LIKE LOWER($%d))", idx, idx, idx))
		args = append(args, "%"+filter.Search+"%")
		idx++
	}
	if filter.Plan != "" && filter.Plan != "All" {
		where = append(where, fmt.Sprintf("plan=$%d", idx))
		args = append(args, strings.ToLower(filter.Plan))
		idx++
	}
	if filter.Status != "" && filter.Status != "All" {
		where = append(where, fmt.Sprintf("status=$%d", idx))
		args = append(args, strings.ToLower(filter.Status))
		idx++
	}

	orderBy := "created_at DESC"
	if filter.Sort != "" {
		// Whitelist allowed sort columns to prevent SQL injection
		allowedSort := map[string]string{
			"name":     "name",
			"email":    "email",
			"plan":     "plan",
			"status":   "status",
			"created_at": "created_at",
		}
		if col, ok := allowedSort[filter.Sort]; ok {
			orderBy = col + " DESC"
			if filter.Order == "asc" {
				orderBy = col + " ASC"
			}
		}
	}

	page := filter.Page
	if page < 1 {
		page = 1
	}
	perPage := 20
	offset := (page - 1) * perPage

	var total int
	countQ := fmt.Sprintf("SELECT COUNT(*) FROM users WHERE %s", strings.Join(where, " AND "))
	if err := r.db.QueryRow(countQ, args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	// Use $N placeholders for LIMIT/OFFSET to avoid SQL injection
	limitArg := idx
	offsetArg := idx + 1
	query := fmt.Sprintf(`SELECT id, name, email, COALESCE(password_hash,''), role, plan, status,
		bots_used, bots_limit, COALESCE(avatar_url,''), COALESCE(country,''), created_at, updated_at
		FROM users WHERE %s ORDER BY %s LIMIT $%d OFFSET $%d`,
		strings.Join(where, " AND "), orderBy, limitArg, offsetArg)

	rows, err := r.db.Query(query, append(args, perPage, offset)...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var users []domain.User
	for rows.Next() {
		var u domain.User
		if err := rows.Scan(&u.ID, &u.Name, &u.Email, &u.PasswordHash, &u.Role, &u.Plan,
			&u.Status, &u.BotsUsed, &u.BotsLimit, &u.AvatarURL, &u.Country,
			&u.CreatedAt, &u.UpdatedAt); err != nil {
			return nil, 0, err
		}
		users = append(users, u)
	}
	return users, total, nil
}
