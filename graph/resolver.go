package graph

import (
    "sync"

    "github.com/kenta-afk/gqlgen-todos/graph/model"
)

// Resolver型を定義しています。roomsフィールドを持ちます。
type Resolver struct {
    rooms           []*model.Room
    mu              sync.Mutex
    roomSubscribers []chan *model.Room
}


