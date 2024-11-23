package model

type Room struct {
    ID    string `json:"id"`
    Users []*User `json:"users"`
}

type NewRoom struct {
    UserIds []string `json:"userIds"`
}