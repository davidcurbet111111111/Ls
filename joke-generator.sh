#!/bin/bash

# A simple script to generate a random joke using an external API

API_URL="https://official-joke-api.appspot.com/random_joke"

response=$(curl -s $API_URL)

# Extract the joke setup and punchline from the JSON response
setup=$(echo $response | jq -r '.setup')
punchline=$(echo $response | jq -r '.punchline')

# Print the joke
echo "Joke: $setup" 
echo "Punchline: $punchline"