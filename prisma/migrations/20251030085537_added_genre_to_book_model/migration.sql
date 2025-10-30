/*
  Warnings:

  - Added the required column `genre` to the `books` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."books" ADD COLUMN     "genre" TEXT NOT NULL;
