#!/bin/bash

cd "$(dirname "$0")"

# Install dependencies if needed
if [ ! -d "server/node_modules" ]; then
  echo "Installing server dependencies..."
  (cd server && npm install)
fi

if [ ! -d "client/node_modules" ]; then
  echo "Installing client dependencies..."
  (cd client && npm install)
fi

# Seed admin user if not exists
echo "Seeding admin user..."
(cd server && node src/seed.js 2>/dev/null)

# Start both servers
echo ""
echo "Starting Aroma Lab..."
echo "  API:    http://localhost:3001"
echo "  Client: http://localhost:5173"
echo "  Login:  admin / 1234"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

(cd server && npm run dev) &
SERVER_PID=$!

(cd client && npm run dev -- --open) &
CLIENT_PID=$!

trap "kill $SERVER_PID $CLIENT_PID 2>/dev/null; exit" INT TERM
wait
