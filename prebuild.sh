#!/bin/bash
# Script de pré-build pour corriger les permissions de gradlew

echo "Fixing gradlew permissions..."
chmod +x ./android/gradlew
echo "Permissions fixed!"