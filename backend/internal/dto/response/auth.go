package response

type AuthResponse struct {
	Token string   `json:"token"`
	User  UserInfo `json:"user"`
}

type UserInfo struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	AvatarURL string `json:"avatar,omitempty"`
	Role      string `json:"role"`
	Plan      string `json:"plan"`
	BotsUsed  int    `json:"botsUsed"`
	BotsLimit int    `json:"botsLimit"`
}
