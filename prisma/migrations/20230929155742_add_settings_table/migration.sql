-- CreateTable
CREATE TABLE "Settings" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "displayName" TEXT,
    "avatarUrl" TEXT,
    "blueskyEnabled" BOOLEAN NOT NULL DEFAULT false,
    "blueskyUrl" TEXT,
    "blueskyIdentifier" TEXT,
    "blueskyPassword" TEXT,
    "mastodonEnabled" BOOLEAN NOT NULL DEFAULT false,
    "mastodonUrl" TEXT,
    "mastodonAccessToken" TEXT,
    "twitterEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twitterConsumerKey" TEXT,
    "twitterConsumerSecret" TEXT,
    "twitterAccessToken" TEXT,
    "twitterAccessSecret" TEXT,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
