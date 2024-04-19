-- Create Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- CreateEnum
CREATE TYPE "PaymentReason" AS ENUM ('winner', 'second', 'third', 'kills', 'alt_split', 'creator_split');

-- CreateEnum
CREATE TYPE "Environment" AS ENUM ('PVP', 'PVE', 'REVIVE');

-- CreateTable
CREATE TABLE "Earnings" (
    "player" VARCHAR(45) NOT NULL,
    "today_earnings" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "Earnings_pkey" PRIMARY KEY ("player")
);

-- CreateTable
CREATE TABLE "SuggestedActivities" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "description" TEXT NOT NULL,
    "amountOfPlayers" INTEGER NOT NULL,
    "activityLoser" INTEGER[],
    "killCounts" DECIMAL(65,30)[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "environment" "Environment" NOT NULL,
    "activityWinner" INTEGER[],
    "is_custom" BOOLEAN NOT NULL DEFAULT false,
    "custom_created_by" TEXT,
    "guild_id" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "mature_users_only" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SuggestedActivities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activities" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "description" TEXT NOT NULL,
    "amountOfPlayers" INTEGER NOT NULL,
    "activityLoser" INTEGER[],
    "killCounts" DECIMAL(65,30)[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "environment" "Environment" NOT NULL,
    "activityWinner" INTEGER[],
    "is_custom" BOOLEAN NOT NULL DEFAULT false,
    "custom_created_by" TEXT,
    "guild_id" TEXT,
    "mature_users_only" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contracts" (
    "contract_address" VARCHAR(45) NOT NULL,
    "chain_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL,
    "network_name" TEXT NOT NULL,

    CONSTRAINT "Contracts_pkey" PRIMARY KEY ("contract_address")
);

-- CreateTable
CREATE TABLE "GameRoundLogs" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "round_counter" INTEGER NOT NULL,
    "players_remaining" INTEGER NOT NULL,
    "activity_order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "participants" TEXT[],
    "activity_id" UUID NOT NULL,
    "room_params_id" UUID NOT NULL,

    CONSTRAINT "GameRoundLogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payouts" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "payment_reason" "PaymentReason" NOT NULL,
    "public_address" VARCHAR(45) NOT NULL,
    "payment_amount" DECIMAL(10,2) NOT NULL,
    "notes" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "payment_completed" BOOLEAN NOT NULL DEFAULT false,
    "payment_completed_at" TIMESTAMP(3),
    "payment_transaction_hash" TEXT,
    "room_params_id" UUID NOT NULL,
    "payment_contract_id" VARCHAR(45) NOT NULL,

    CONSTRAINT "Payouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Players" (
    "slug" VARCHAR NOT NULL,
    "time_joined" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "room_params_id" UUID NOT NULL,
    "player" VARCHAR(45) NOT NULL,

    CONSTRAINT "Players_pkey" PRIMARY KEY ("room_params_id","player")
);

-- CreateTable
CREATE TABLE "RoomParams" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "pve_chance" INTEGER NOT NULL,
    "revive_chance" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "game_started" BOOLEAN DEFAULT false,
    "game_completed" BOOLEAN DEFAULT false,
    "winners" TEXT[],
    "room_slug" VARCHAR(100) NOT NULL,
    "created_by" VARCHAR(45),
    "contract_id" VARCHAR(45) NOT NULL,

    CONSTRAINT "RoomParams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rooms" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "slug" VARCHAR(100) NOT NULL,
    "params_id" UUID NOT NULL,
    "last_game_params_id" UUID,

    CONSTRAINT "Rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" VARCHAR(45) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "farcaster_id" VARCHAR(18),

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Players_room_params_id_player_key" ON "Players"("room_params_id", "player");

-- CreateIndex
CREATE UNIQUE INDEX "Rooms_slug_key" ON "Rooms"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Users_id_key" ON "Users"("id");

-- AddForeignKey
ALTER TABLE "Earnings" ADD CONSTRAINT "Earnings_player_fkey" FOREIGN KEY ("player") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameRoundLogs" ADD CONSTRAINT "GameRoundLogs_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "Activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameRoundLogs" ADD CONSTRAINT "GameRoundLogs_room_params_id_fkey" FOREIGN KEY ("room_params_id") REFERENCES "RoomParams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payouts" ADD CONSTRAINT "Payouts_room_params_id_fkey" FOREIGN KEY ("room_params_id") REFERENCES "RoomParams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payouts" ADD CONSTRAINT "Payouts_payment_contract_id_fkey" FOREIGN KEY ("payment_contract_id") REFERENCES "Contracts"("contract_address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Players" ADD CONSTRAINT "Players_room_params_id_fkey" FOREIGN KEY ("room_params_id") REFERENCES "RoomParams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Players" ADD CONSTRAINT "Players_player_fkey" FOREIGN KEY ("player") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomParams" ADD CONSTRAINT "RoomParams_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomParams" ADD CONSTRAINT "RoomParams_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "Contracts"("contract_address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rooms" ADD CONSTRAINT "Rooms_params_id_fkey" FOREIGN KEY ("params_id") REFERENCES "RoomParams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rooms" ADD CONSTRAINT "Rooms_last_game_params_id_fkey" FOREIGN KEY ("last_game_params_id") REFERENCES "RoomParams"("id") ON DELETE SET NULL ON UPDATE CASCADE;
