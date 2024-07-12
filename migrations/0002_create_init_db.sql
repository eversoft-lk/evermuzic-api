-- CreateTable
CREATE TABLE "accesstoken" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "used_at" DATETIME,
    CONSTRAINT "accesstoken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "auth_method" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "method" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "favorite" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "playlist_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    CONSTRAINT "favorite_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "playlist" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "favorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "playlist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "playlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "playlistitems" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "album" TEXT NOT NULL,
    "added_at" DATETIME NOT NULL,
    "playlist_id" TEXT NOT NULL,
    CONSTRAINT "playlistitems_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "playlist" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "auth_method_id" INTEGER NOT NULL,
    CONSTRAINT "user_auth_method_id_fkey" FOREIGN KEY ("auth_method_id") REFERENCES "auth_method" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateIndex
CREATE INDEX "accesstoken_user_id_idx" ON "accesstoken"("user_id");

-- CreateIndex
CREATE INDEX "favorite_playlist_id_idx" ON "favorite"("playlist_id");

-- CreateIndex
CREATE INDEX "favorite_user_id_idx" ON "favorite"("user_id");

-- CreateIndex
CREATE INDEX "playlist_user_id_idx" ON "playlist"("user_id");

-- CreateIndex
CREATE INDEX "playlistitems_playlist_id_idx" ON "playlistitems"("playlist_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE INDEX "user_auth_method_id_idx" ON "user"("auth_method_id");

