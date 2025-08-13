# DAV Language Support

Extension VS Code officielle pour le langage de programmation DAV - Programmez en français et en anglais avec une syntaxe naturelle!

## ✨ Fonctionnalités

- **Syntaxe bilingue**: Écrivez du code en français ou anglais
- **Coloration syntaxique**: Mise en évidence intelligente du code DAV
- **Snippets**: Modèles de code pour accélérer le développement
- **Thèmes**: Thèmes sombres et clairs optimisés pour DAV
- **Exécution intégrée**: Lancez vos programmes DAV directement depuis VS Code
- **Symboles**: Navigation rapide dans votre code (fonctions, variables)

## 🚀 Installation

1. Ouvrez VS Code
2. Allez dans Extensions (`Ctrl+Shift+X`)
3. Recherchez "DAV Language Support"
4. Cliquez "Install"

Ou installez via la ligne de commande:
```bash
code --install-extension dav-language.dav-language-support
```

## 📝 Utilisation

### Créer un fichier DAV

1. Créez un nouveau fichier avec l'extension `.dav`
2. Commencez à écrire du code DAV:

**Français:**
```dav
Variable nom = "DAV"
Afficher "Bonjour " + nom

Si nom == "DAV" alors
    Afficher "C'est le langage DAV!"
Fin Si
```

**Anglais:**
```dav
Variable name = "DAV"  
Display "Hello " + name

If name == "DAV" then
    Display "This is DAV language!"
End If
```

### Commandes disponibles

- **Exécuter fichier DAV** (`Ctrl+F5`): Exécute le fichier DAV actuel
- **Afficher logo DAV**: Affiche le logo dans un panneau
- **Ouvrir éditeur web**: Lance l'éditeur web DAV

## ⚙️ Configuration

Accédez aux paramètres DAV via `Ctrl+,` puis recherchez "DAV":

- `dav.interpreterPath`: Chemin vers l'interpréteur DAV
- `dav.language`: Langage préféré (french/english/both)
- `dav.showLogo`: Afficher le logo au démarrage
- `dav.enableSyntaxHighlighting`: Activer la coloration syntaxique

## 🎨 Thèmes

L'extension inclut des thèmes optimisés pour DAV:
- **DAV Dark Theme**: Thème sombre avec couleurs distinctes
- **DAV Light Theme**: Thème clair avec contrastes optimisés

Activez un thème: `Ctrl+Shift+P` → "Color Theme" → Sélectionnez un thème DAV

## 📚 Syntaxe DAV

### Mots-clés supportés

**Français**: Si, Alors, Sinon, Fin, Pour, Tant, Que, Faire, Variable, Fonction, Afficher, Lire
**Anglais**: If, Then, Else, End, For, While, Do, Variable, Function, Display, Read

### Exemples de snippets

Tapez ces raccourcis puis `Tab`:
- `si` → Structure if complète
- `pour` → Boucle for complète  
- `fonction` → Déclaration de fonction
- `var` → Déclaration de variable

## 🛠️ Installation de l'interpréteur

Pour exécuter du code DAV, installez l'interpréteur:

```bash
# Clone le repository
git clone https://github.com/dav-language/dav-interpreter.git

# Installation
cd dav-interpreter
python setup.py install

# Test
dav mon_fichier.dav
```

## 📖 Documentation

- [Site officiel DAV](https://davlanguage.com)
- [Documentation complète](https://davlanguage.com/docs)
- [Exemples de code](https://davlanguage.com/examples)
- [Tutoriels](https://davlanguage.com/tutorials)

## 🤝 Contribution

Les contributions sont les bienvenues!

1. Fork le projet
2. Créez une branche feature
3. Commit vos changements
4. Push sur la branche
5. Ouvrez une Pull Request

## 📄 License

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🐛 Signaler un Bug

[Créez une issue](https://github.com/dav-language/vscode-extension/issues) sur GitHub avec:
- Description du problème
- Étapes pour reproduire
- Version VS Code et extension
- Exemples de code DAV

## 🔄 Changelog

Voir [CHANGELOG.md](CHANGELOG.md) pour l'historique des versions.

---

**Développé avec ❤️ pour la communauté DAV**
