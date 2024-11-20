package graph

import (
    "sync"

    "github.com/kenta-afk/gqlgen-todos/graph/model"
)

// このファイルは自動的に再生成されません。
// 依存関係の注入を行うためのファイルです。必要な依存関係をここに追加します。

// Resolver型を定義しています。todosフィールドを持ちます。
type Resolver struct {
    todos           []*model.Todo // Todoのリスト
    mu              sync.Mutex    // ミューテックス
    todoSubscribers []chan *model.Todo // サブスクリプションのリスト
}


