-- CreateTable
CREATE TABLE "TelegramLinkRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ownerGithubId" INTEGER NOT NULL,
    "chatRequestId" INTEGER,
    "fromChatId" INTEGER,
    "fromUserId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "TelegramLink" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ownerGithubId" INTEGER NOT NULL,
    "telegramChatId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "LinkedGitHubOrg" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "telegramLinkId" INTEGER NOT NULL,
    "githubOrgId" INTEGER NOT NULL,
    CONSTRAINT "LinkedGitHubOrg_telegramLinkId_fkey" FOREIGN KEY ("telegramLinkId") REFERENCES "TelegramLink" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GitHubEntityTelegramMessage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "telegramMessageId" INTEGER NOT NULL,
    "githubEntityId" INTEGER NOT NULL,
    "githubEntityType" TEXT NOT NULL,
    "linkedGitHubOrgId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GitHubEntityTelegramMessage_linkedGitHubOrgId_fkey" FOREIGN KEY ("linkedGitHubOrgId") REFERENCES "LinkedGitHubOrg" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "TelegramLink_telegramChatId_key" ON "TelegramLink"("telegramChatId");
