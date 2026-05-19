-- CreateEnum
CREATE TYPE "GenderEnum" AS ENUM ('BOY', 'GIRL');

-- CreateTable
CREATE TABLE "gender_reveal_settings" (
    "id" SERIAL NOT NULL,
    "gender" "GenderEnum",
    "revealDate" TIMESTAMP(3),
    "isRevealed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "gender_reveal_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gender_guesses" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "guess" "GenderEnum" NOT NULL,
    "mediaUrls" TEXT[],

    CONSTRAINT "gender_guesses_pkey" PRIMARY KEY ("id")
);
