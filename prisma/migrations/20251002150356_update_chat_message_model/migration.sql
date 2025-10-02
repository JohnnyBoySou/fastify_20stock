/*
  Warnings:

  - You are about to drop the column `message` on the `chat_messages` table. All the data in the column will be lost.
  - You are about to drop the column `response` on the `chat_messages` table. All the data in the column will be lost.
  - Added the required column `content` to the `chat_messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."chat_messages" DROP COLUMN "message",
DROP COLUMN "response",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "isFromUser" BOOLEAN NOT NULL DEFAULT true;
