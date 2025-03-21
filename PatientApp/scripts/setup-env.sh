#!/bin/bash

# Create config directory if it doesn't exist
mkdir -p src/config/env

# Copy template to development and production if they don't exist
if [ ! -f src/config/env/development.ts ]; then
  cp src/config/env/config.template.ts src/config/env/development.ts
  echo "Created development config from template"
  
  # Replace placeholder with development URL
  sed -i '' 's|API_BASE_URL|http://localhost:3000/api|g' src/config/env/development.ts
fi

if [ ! -f src/config/env/production.ts ]; then
  cp src/config/env/config.template.ts src/config/env/production.ts
  echo "Created production config from template"
  
  # Replace placeholder with production URL (developer should update this)
  sed -i '' 's|API_BASE_URL|https://api.autobebe.com/api|g' src/config/env/production.ts
fi

echo "Environment setup complete. Please update the API URLs in the config files as needed." 