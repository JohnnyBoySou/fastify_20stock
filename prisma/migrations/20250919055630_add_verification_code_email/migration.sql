-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "emailVerificationCode" TEXT,
ADD COLUMN     "emailVerificationCodeExpires" TIMESTAMP(3);
