/*
  Warnings:

  - Added the required column `updatedAt` to the `ai_analyses` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `input` on the `ai_analyses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."ai_analyses" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "input",
ADD COLUMN     "input" JSONB NOT NULL;
