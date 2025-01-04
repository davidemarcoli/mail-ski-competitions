FROM oven/bun:latest

ENV FROM_MAIL "mail@example.com"
ENV FROM_MAIL_PASSWORD "abcd abcd abcd abcd"
ENV TO_MAIL "mail@example.com"

COPY package.json .
COPY bun.lockb .
COPY src .

RUN bun install

# CMD bun run fetch-weekly-most-pirated-movies.ts && bun run mail-weekly-most-pirated-movies.ts
CMD bun run index.ts