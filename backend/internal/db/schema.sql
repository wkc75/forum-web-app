PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS topics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    creator_username TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (creator_username)
        REFERENCES users(username)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    topic_id INTEGER NOT NULL,
    creator_username TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    likes_count INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (topic_id)
        REFERENCES topics(id)
        ON DELETE CASCADE,
    FOREIGN KEY (creator_username)
        REFERENCES users(username)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    post_id INTEGER NOT NULL,
    creator_username TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (post_id)
        REFERENCES posts(id)
        ON DELETE CASCADE,
    FOREIGN KEY (creator_username)
        REFERENCES users(username)
        ON DELETE CASCADE
);
