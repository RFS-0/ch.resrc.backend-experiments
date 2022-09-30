CREATE TABLE "users" (
  "id" uuid NOT NULL,
  "username" character varying(255) NOT NULL,
  "first_name" character varying(255) NOT NULL,
  "last_name" character varying(255) NOT NULL,
  "email" character varying(255) NOT NULL,
  "password" character varying(100) NOT NULL,
  "phone" character varying(50) NOT NULL
);

CREATE TABLE "authentications" (
  "user_id" uuid NOT NULL,
  "token" uuid NOT NULL,
  "token_expires_after" timestamp NOT NULL
);

