const vscode = require('vscode');
const path = require('path');

function activate(context) {
    console.log('Extension DAV Language Support activée');

    // Commande pour exécuter un fichier DAV
    const runFileCommand = vscode.commands.registerCommand('dav.runFile', () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            vscode.window.showWarningMessage('Aucun fichier DAV ouvert');
            return;
        }

        const filePath = activeEditor.document.fileName;
        if (!filePath.endsWith('.dav')) {
            vscode.window.showWarningMessage('Le fichier doit avoir l\'extension .dav');
            return;
        }

        const config = vscode.workspace.getConfiguration('dav');
        const interpreterPath = config.get('interpreterPath', 'dav');
        
        // Création d'un terminal pour exécuter le fichier
        const terminal = vscode.window.createTerminal('DAV Interpreter');
        terminal.show();
        terminal.sendText(`${interpreterPath} "${filePath}"`);
    });

    // Commande pour afficher le logo DAV
    const showLogoCommand = vscode.commands.registerCommand('dav.showLogo', () => {
        const panel = vscode.window.createWebviewPanel(
            'davLogo',
            'Logo DAV',
            vscode.ViewColumn.Two,
            {
                enableScripts: true
            }
        );

        const logoPath = path.join(context.extensionPath, 'images', 'dav-extension-icon.png');
        const logoUri = panel.webview.asWebviewUri(vscode.Uri.file(logoPath));

        panel.webview.html = getLogoHtml(logoUri.toString());
    });

    // Commande pour ouvrir l'éditeur web DAV
    const openWebEditorCommand = vscode.commands.registerCommand('dav.openWebEditor', () => {
        vscode.env.openExternal(vscode.Uri.parse('https://github.com/Asabi89/dav-language'));
    });

    // Enregistrement des commandes
    context.subscriptions.push(runFileCommand);
    context.subscriptions.push(showLogoCommand);
    context.subscriptions.push(openWebEditorCommand);

    // Affichage du message de bienvenue
    const config = vscode.workspace.getConfiguration('dav');
    if (config.get('showLogo', true)) {
        vscode.window.showInformationMessage('DAV Language Support activé! 🚀 Langage bilingue français/anglais');
    }
}

function getLogoHtml(logoUri) {
    return `<!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Logo DAV</title>
        <style>
            body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            .logo-container {
                text-align: center;
                padding: 2rem;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                backdrop-filter: blur(10px);
            }
            .logo {
                max-width: 200px;
                height: auto;
                margin-bottom: 1rem;
            }
            .title {
                color: white;
                font-size: 2rem;
                font-weight: bold;
                margin: 0;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            .subtitle {
                color: rgba(255, 255, 255, 0.8);
                font-size: 1rem;
                margin-top: 0.5rem;
            }
        </style>
    </head>
    <body>
        <div class="logo-container">
            <img src="${logoUri}" alt="Logo DAV" class="logo">
            <h1 class="title">DAV</h1>
            <p class="subtitle">Programmation en Langage Naturel</p>
            <p class="subtitle">🇫🇷 Français • 🇬🇧 English</p>
        </div>
    </body>
    </html>`;
}

function deactivate() {
    console.log('Extension DAV Language Support désactivée');
}

module.exports = {
    activate,
    deactivate
};
