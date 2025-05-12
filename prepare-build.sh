#!/bin/bash

# Script de préparation du build amélioré
echo "===== DÉBUT DE LA PRÉPARATION DU BUILD ====="

# Afficher l'arborescence des fichiers pour le débogage
echo "Structure du répertoire de travail :"
ls -la
echo "Structure du répertoire android :"
ls -la ./android

# Rendre le fichier gradlew exécutable
echo "Application des permissions d'exécution sur gradlew :"
chmod +x ./android/gradlew

# Créer la structure attendue par EAS
echo "Création de la structure de répertoires attendue par EAS :"
mkdir -p /home/expo/workingdir/build/android

# Copier gradlew à l'emplacement où EAS le recherche
echo "Copie des fichiers Gradle vers l'emplacement attendu :"
cp ./android/gradlew /home/expo/workingdir/build/android/
chmod +x /home/expo/workingdir/build/android/gradlew

# Copier également le dossier gradle contenant le wrapper
mkdir -p /home/expo/workingdir/build/android/gradle/wrapper
cp -r ./android/gradle/wrapper/* /home/expo/workingdir/build/android/gradle/wrapper/

# Vérifier la structure créée
echo "Vérification de la structure créée :"
ls -la /home/expo/workingdir/build/android/
ls -la /home/expo/workingdir/build/android/gradle/wrapper/

echo "===== FIN DE LA PRÉPARATION DU BUILD ====="