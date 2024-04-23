-- AlterTable
ALTER TABLE "Activities" ALTER COLUMN "created_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "Contracts" ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "updated_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "GameRoundLogs" ALTER COLUMN "created_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "Payouts" ALTER COLUMN "created_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "Players" ALTER COLUMN "time_joined" SET DEFAULT now();

-- AlterTable
ALTER TABLE "RoomParams" ADD COLUMN     "completed_at" TIMESTAMP(3),
ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "updated_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "Rooms" ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "updated_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "SuggestedActivities" ALTER COLUMN "created_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "updated_at" SET DEFAULT now();
