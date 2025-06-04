CREATE TABLE "games" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"board" jsonb NOT NULL,
	"currentPlayer" varchar(255) NOT NULL,
	"endState" varchar(255)
);
