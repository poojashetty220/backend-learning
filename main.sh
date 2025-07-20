#!/bin/bash

# Set your PostgreSQL credentials
PG_USER="myuser"
PG_PASSWORD="1234"
PG_HOST="localhost"
PG_PORT="5432"
PG_DATABASE="mydb"
BLOG_DATABASE="blog_db"

# Export password
export PGPASSWORD="$PG_PASSWORD"

# Create both databases if they don't exist
createdb -U "$PG_USER" -h "$PG_HOST" -p "$PG_PORT" "$PG_DATABASE" 2>/dev/null
createdb -U "$PG_USER" -h "$PG_HOST" -p "$PG_PORT" "$BLOG_DATABASE" 2>/dev/null

# Run the SQL queries on mydb
for FILE in task1.sql task2.sql task3.sql task4.sql task5.sql task7.sql task8.sql task9.sql; do
  if [ -f "$FILE" ]; then
    echo "📄 Running $FILE on $PG_DATABASE"
    psql -U "$PG_USER" -h "$PG_HOST" -p "$PG_PORT" -d "$PG_DATABASE" -f "$FILE"
  else
    echo "⚠️  File '$FILE' not found. Skipping."
  fi
done

# Run the SQL queries on blog_db
for FILE in task10.sql task11.sql task12.sql task13.sql task14.sql; do
  if [ -f "$FILE" ]; then
    echo "📄 Running $FILE on $BLOG_DATABASE"
    psql -U "$PG_USER" -h "$PG_HOST" -p "$PG_PORT" -d "$BLOG_DATABASE" -f "$FILE"
  else
    echo "⚠️  File '$FILE' not found. Skipping."
  fi
done

echo "✅ All tasks completed successfully"

# Drop both databases
dropdb -U "$PG_USER" -h "$PG_HOST" -p "$PG_PORT" "$PG_DATABASE"
echo "🗑️  Database '$PG_DATABASE' has been dropped."

dropdb -U "$PG_USER" -h "$PG_HOST" -p "$PG_PORT" "$BLOG_DATABASE"
echo "🗑️  Database '$BLOG_DATABASE' has been dropped."

# Unset password
unset PGPASSWORD
