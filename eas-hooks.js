const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Ce hook sera exécuté après le téléchargement des fichiers mais avant l'étape de build
// C'est le moment idéal pour manipuler la structure de fichiers
module.exports = {
  onBuildStart: async (config) => {
    console.log("🔍 Hook onBuildStart: Démarrage des vérifications pré-build");

    // Affichage de la structure de répertoires
    try {
      console.log("📁 Structure du répertoire de travail:");
      execSync('find . -name "gradlew" -type f', { stdio: "inherit" });

      // Vérifier si le répertoire /home/expo/workingdir/build/android existe
      const targetDir = "/home/expo/workingdir/build/android";
      const sourceGradlew = "./android/gradlew";

      if (!fs.existsSync(targetDir)) {
        console.log(`🛠️ Création du répertoire ${targetDir}`);
        execSync(`mkdir -p ${targetDir}`, { stdio: "inherit" });
      }

      // Copie du fichier gradlew vers l'emplacement attendu par EAS
      console.log(`📋 Copie de gradlew vers ${targetDir}`);
      execSync(`cp ${sourceGradlew} ${targetDir}`, { stdio: "inherit" });
      execSync(`chmod +x ${targetDir}/gradlew`, { stdio: "inherit" });

      // Vérification que tous les fichiers nécessaires pour gradle sont présents
      console.log("✅ Vérification des fichiers de wrapper gradle");
      execSync("cp -r ./android/gradle ${targetDir}/", { stdio: "inherit" });

      console.log("🚀 Préparation terminée, début du build");
    } catch (error) {
      console.error("❌ Erreur dans le hook onBuildStart:", error.message);
      throw error;
    }
  },
};
