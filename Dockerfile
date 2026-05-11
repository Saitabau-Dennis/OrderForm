FROM node:20

# Set the working directory (must be in the allowlist, /app is allowed)
WORKDIR /app

# The build system places this Dockerfile at the root.
# Copy all files including the .git directory.
COPY . .

# Install dependencies using the lockfile and generate the Prisma client
# We also copy the example env to .env so dummy variables are available
# We skip 'npm run build' to prevent Next.js from trying to connect to the database during static generation
RUN cp .env.example .env && \
    npm ci && \
    npx prisma generate
