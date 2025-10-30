-- DropForeignKey
ALTER TABLE "public"."books" DROP CONSTRAINT "books_authorId_fkey";

-- AddForeignKey
ALTER TABLE "public"."books" ADD CONSTRAINT "books_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
