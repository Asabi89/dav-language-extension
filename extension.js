const vscode = require('vscode');
const path = require('path');
const { spawn } = require('child_process');

function activate(context) {
    console.log('Extension DAV Language Support activée');

    // Fournisseur d'autocomplétion pour DAV
    const completionProvider = vscode.languages.registerCompletionItemProvider('dav', {
        provideCompletionItems(document, position, token, context) {
            return getDAVCompletions(document, position);
        }
    }, ' ', '.', '\n');

    // Fournisseur de validation de syntaxe
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('dav');
    
    // Validation automatique lors de l'ouverture ou de la modification d'un fichier
    const validateDocument = (document) => {
        if (document.languageId === 'dav') {
            validateDAVSyntax(document, diagnosticCollection);
        }
    };

    // Événements de validation
    const openDocumentEvent = vscode.workspace.onDidOpenTextDocument(validateDocument);
    const changeDocumentEvent = vscode.workspace.onDidChangeTextDocument(event => {
        if (event.document.languageId === 'dav') {
            setTimeout(() => validateDAVSyntax(event.document, diagnosticCollection), 500);
        }
    });

    // Fournisseur d'indentation automatique
    const indentProvider = vscode.languages.registerOnTypeFormattingEditProvider('dav', {
        provideOnTypeFormattingEdits(document, position, ch, options, token) {
            return getDAVIndentation(document, position, ch, options);
        }
    }, '\n', '.');

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

    // Enregistrement des commandes et fournisseurs
    context.subscriptions.push(runFileCommand);
    context.subscriptions.push(showLogoCommand);
    context.subscriptions.push(openWebEditorCommand);
    context.subscriptions.push(completionProvider);
    context.subscriptions.push(diagnosticCollection);
    context.subscriptions.push(openDocumentEvent);
    context.subscriptions.push(changeDocumentEvent);
    context.subscriptions.push(indentProvider);

    // Validation des documents ouverts
    vscode.workspace.textDocuments.forEach(validateDocument);

    // Affichage du message de bienvenue
    const config = vscode.workspace.getConfiguration('dav');
    if (config.get('showLogo', true)) {
        vscode.window.showInformationMessage('DAV Language Support activé! 🚀 Auto-indentation, autocomplétion et validation activées');
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

// Fonction d'autocomplétion DAV
function getDAVCompletions(document, position) {
    const completions = [];
    
    // Mots-clés français
    const frenchKeywords = [
        { word: 'J\'ai un nombre appelé', detail: 'Déclarer une variable numérique', insertText: 'J\'ai un nombre appelé ${1:nom}.', kind: vscode.CompletionItemKind.Keyword },
        { word: 'J\'ai du texte appelé', detail: 'Déclarer une variable texte', insertText: 'J\'ai du texte appelé ${1:nom}.', kind: vscode.CompletionItemKind.Keyword },
        { word: 'J\'ai une liste appelée', detail: 'Déclarer une liste', insertText: 'J\'ai une liste appelée ${1:nom}.', kind: vscode.CompletionItemKind.Keyword },
        { word: 'Assigne', detail: 'Assigner une valeur', insertText: 'Assigne ${1:valeur} à ${2:variable}.', kind: vscode.CompletionItemKind.Keyword },
        { word: 'Affiche', detail: 'Afficher du contenu', insertText: 'Affiche ${1:contenu}${2| ligne, continue,|}.', kind: vscode.CompletionItemKind.Keyword },
        { word: 'Si', detail: 'Structure conditionnelle', insertText: 'Si ${1:condition}.\n    ${2:instructions}\nFinSi.', kind: vscode.CompletionItemKind.Snippet },
        { word: 'Sinon', detail: 'Alternative conditionnelle', insertText: 'Sinon.\n    ${1:instructions}', kind: vscode.CompletionItemKind.Snippet },
        { word: 'TantQue', detail: 'Boucle tant que', insertText: 'TantQue ${1:condition}.\n    ${2:instructions}\nFinTantQue.', kind: vscode.CompletionItemKind.Snippet },
        { word: 'Pour', detail: 'Boucle pour', insertText: 'Pour ${1:variable} de ${2:début} à ${3:fin}.\n    ${4:instructions}\nFinPour.', kind: vscode.CompletionItemKind.Snippet },
        { word: 'Crée une fonction nommée', detail: 'Définir une fonction', insertText: 'Crée une fonction nommée ${1:nom} qui prend ${2:paramètres}.\n    ${3:instructions}\nRetourne ${4:valeur}.\nFinFonction.', kind: vscode.CompletionItemKind.Function },
        { word: 'Demande', detail: 'Demander une entrée utilisateur', insertText: 'Demande "${1:message}" et stocke dans ${2:variable}.', kind: vscode.CompletionItemKind.Keyword }
    ];
    
    // Mots-clés anglais
    const englishKeywords = [
        { word: 'I have a number called', detail: 'Declare a numeric variable', insertText: 'I have a number called ${1:name}.', kind: vscode.CompletionItemKind.Keyword },
        { word: 'I have text called', detail: 'Declare a text variable', insertText: 'I have text called ${1:name}.', kind: vscode.CompletionItemKind.Keyword },
        { word: 'I have a list called', detail: 'Declare a list', insertText: 'I have a list called ${1:name}.', kind: vscode.CompletionItemKind.Keyword },
        { word: 'Set', detail: 'Assign a value', insertText: 'Set ${1:variable} to ${2:value}.', kind: vscode.CompletionItemKind.Keyword },
        { word: 'Display', detail: 'Display content', insertText: 'Display ${1:content}${2| line, continue,|}.', kind: vscode.CompletionItemKind.Keyword },
        { word: 'If', detail: 'Conditional structure', insertText: 'If ${1:condition}.\n    ${2:instructions}\nEndIf.', kind: vscode.CompletionItemKind.Snippet },
        { word: 'Else', detail: 'Conditional alternative', insertText: 'Else.\n    ${1:instructions}', kind: vscode.CompletionItemKind.Snippet },
        { word: 'While', detail: 'While loop', insertText: 'While ${1:condition}.\n    ${2:instructions}\nEndWhile.', kind: vscode.CompletionItemKind.Snippet },
        { word: 'For', detail: 'For loop', insertText: 'For ${1:variable} from ${2:start} to ${3:end}.\n    ${4:instructions}\nEndFor.', kind: vscode.CompletionItemKind.Snippet },
        { word: 'Create a function named', detail: 'Define a function', insertText: 'Create a function named ${1:name} that takes ${2:parameters}.\n    ${3:instructions}\nReturn ${4:value}.\nEndFunction.', kind: vscode.CompletionItemKind.Function },
        { word: 'Ask', detail: 'Ask for user input', insertText: 'Ask "${1:message}" and store in ${2:variable}.', kind: vscode.CompletionItemKind.Keyword }
    ];

    // Fonctions intégrées
    const builtinFunctions = [
        { word: 'taille', detail: 'Fonction: obtenir la taille d\'une liste', insertText: 'taille(${1:liste})', kind: vscode.CompletionItemKind.Function },
        { word: 'ajouter', detail: 'Fonction: ajouter un élément à une liste', insertText: 'ajouter(${1:liste}, ${2:élément})', kind: vscode.CompletionItemKind.Function },
        { word: 'size', detail: 'Function: get list size', insertText: 'size(${1:list})', kind: vscode.CompletionItemKind.Function },
        { word: 'add', detail: 'Function: add element to list', insertText: 'add(${1:list}, ${2:element})', kind: vscode.CompletionItemKind.Function }
    ];

    // Configuration pour déterminer la langue préférée
    const config = vscode.workspace.getConfiguration('dav');
    const language = config.get('language', 'both');

    // Ajouter les suggestions selon la préférence
    if (language === 'french' || language === 'both') {
        frenchKeywords.forEach(item => {
            const completion = new vscode.CompletionItem(item.word, item.kind);
            completion.detail = item.detail;
            completion.insertText = new vscode.SnippetString(item.insertText);
            completion.documentation = new vscode.MarkdownString(`**${item.word}**\n\n${item.detail}`);
            completions.push(completion);
        });
    }

    if (language === 'english' || language === 'both') {
        englishKeywords.forEach(item => {
            const completion = new vscode.CompletionItem(item.word, item.kind);
            completion.detail = item.detail;
            completion.insertText = new vscode.SnippetString(item.insertText);
            completion.documentation = new vscode.MarkdownString(`**${item.word}**\n\n${item.detail}`);
            completions.push(completion);
        });
    }

    // Ajouter les fonctions intégrées
    builtinFunctions.forEach(item => {
        const completion = new vscode.CompletionItem(item.word, item.kind);
        completion.detail = item.detail;
        completion.insertText = new vscode.SnippetString(item.insertText);
        completion.documentation = new vscode.MarkdownString(`**${item.word}**\n\n${item.detail}`);
        completions.push(completion);
    });

    return completions;
}

// Fonction de validation de syntaxe DAV
function validateDAVSyntax(document, diagnosticCollection) {
    const diagnostics = [];
    const text = document.getText();
    const lines = text.split('\n');

    let inFunction = false;
    let inIf = false;
    let inWhile = false;
    let inFor = false;
    let functionNesting = 0;
    let conditionalNesting = 0;
    let loopNesting = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith('//')) continue;

        const lineNumber = i;
        const range = new vscode.Range(lineNumber, 0, lineNumber, lines[i].length);

        // Vérifier les blocs de structure
        if (line.match(/^(Crée une fonction nommée|Create a function named)/)) {
            inFunction = true;
            functionNesting++;
            // Vérifier la syntaxe de déclaration de fonction
            if (!line.match(/qui prend|that takes/) && !line.endsWith('.')) {
                diagnostics.push(new vscode.Diagnostic(range, 
                    'Syntaxe de fonction incorrecte. Utilisez: "Crée une fonction nommée [nom] qui prend [paramètres]." ou "Create a function named [name] that takes [parameters]."', 
                    vscode.DiagnosticSeverity.Error));
            }
        }
        
        if (line.match(/^(Si|If)\s/)) {
            inIf = true;
            conditionalNesting++;
            if (!line.endsWith('.')) {
                diagnostics.push(new vscode.Diagnostic(range, 
                    'Les conditions Si/If doivent se terminer par un point.', 
                    vscode.DiagnosticSeverity.Error));
            }
        }
        
        if (line.match(/^(TantQue|While)\s/)) {
            inWhile = true;
            loopNesting++;
            if (!line.endsWith('.')) {
                diagnostics.push(new vscode.Diagnostic(range, 
                    'Les boucles TantQue/While doivent se terminer par un point.', 
                    vscode.DiagnosticSeverity.Error));
            }
        }
        
        if (line.match(/^(Pour|For)\s/)) {
            inFor = true;
            loopNesting++;
            if (!line.match(/(de|from).*?à|to/) || !line.endsWith('.')) {
                diagnostics.push(new vscode.Diagnostic(range, 
                    'Syntaxe de boucle Pour/For incorrecte. Utilisez: "Pour [var] de [début] à [fin]." ou "For [var] from [start] to [end]."', 
                    vscode.DiagnosticSeverity.Error));
            }
        }

        // Vérifier les fins de blocs
        if (line === 'FinFonction.' || line === 'EndFunction.') {
            if (!inFunction || functionNesting <= 0) {
                diagnostics.push(new vscode.Diagnostic(range, 
                    'FinFonction/EndFunction sans fonction correspondante.', 
                    vscode.DiagnosticSeverity.Error));
            } else {
                inFunction = functionNesting > 1;
                functionNesting--;
            }
        }
        
        if (line === 'FinSi.' || line === 'EndIf.') {
            if (!inIf || conditionalNesting <= 0) {
                diagnostics.push(new vscode.Diagnostic(range, 
                    'FinSi/EndIf sans Si/If correspondant.', 
                    vscode.DiagnosticSeverity.Error));
            } else {
                inIf = conditionalNesting > 1;
                conditionalNesting--;
            }
        }
        
        if (line === 'FinTantQue.' || line === 'EndWhile.') {
            if (!inWhile || loopNesting <= 0) {
                diagnostics.push(new vscode.Diagnostic(range, 
                    'FinTantQue/EndWhile sans TantQue/While correspondant.', 
                    vscode.DiagnosticSeverity.Error));
            } else {
                inWhile = loopNesting > 1;
                loopNesting--;
            }
        }
        
        if (line === 'FinPour.' || line === 'EndFor.') {
            if (!inFor || loopNesting <= 0) {
                diagnostics.push(new vscode.Diagnostic(range, 
                    'FinPour/EndFor sans Pour/For correspondant.', 
                    vscode.DiagnosticSeverity.Error));
            } else {
                inFor = loopNesting > 1;
                loopNesting--;
            }
        }

        // Vérifier les déclarations de variables
        if (line.match(/^(J'ai|I have)/)) {
            if (!line.match(/(appelé|called)/) || !line.endsWith('.')) {
                diagnostics.push(new vscode.Diagnostic(range, 
                    'Déclaration de variable incorrecte. Utilisez: "J\'ai [type] appelé [nom]." ou "I have [type] called [name]."', 
                    vscode.DiagnosticSeverity.Error));
            }
        }

        // Vérifier les assignations
        if (line.match(/^(Assigne|Set)/)) {
            if (!line.match(/(à|to)/) || !line.endsWith('.')) {
                diagnostics.push(new vscode.Diagnostic(range, 
                    'Assignation incorrecte. Utilisez: "Assigne [valeur] à [variable]." ou "Set [variable] to [value]."', 
                    vscode.DiagnosticSeverity.Error));
            }
        }

        // Vérifier les affichages
        if (line.match(/^(Affiche|Display)/)) {
            if (!line.endsWith('ligne.') && !line.endsWith('continue.') && !line.endsWith('line.') && !line.endsWith('.')) {
                diagnostics.push(new vscode.Diagnostic(range, 
                    'Instruction d\'affichage doit se terminer par "ligne.", "continue.", "line." ou "."', 
                    vscode.DiagnosticSeverity.Warning));
            }
        }

        // Vérifier les parenthèses non fermées
        const openParens = (line.match(/\(/g) || []).length;
        const closeParens = (line.match(/\)/g) || []).length;
        if (openParens !== closeParens) {
            diagnostics.push(new vscode.Diagnostic(range, 
                'Parenthèses non équilibrées sur cette ligne.', 
                vscode.DiagnosticSeverity.Warning));
        }
    }

    // Vérifier les blocs non fermés à la fin du fichier
    if (functionNesting > 0) {
        const range = new vscode.Range(lines.length - 1, 0, lines.length - 1, lines[lines.length - 1]?.length || 0);
        diagnostics.push(new vscode.Diagnostic(range, 
            `${functionNesting} fonction(s) non fermée(s). Ajoutez FinFonction./EndFunction.`, 
            vscode.DiagnosticSeverity.Error));
    }
    if (conditionalNesting > 0) {
        const range = new vscode.Range(lines.length - 1, 0, lines.length - 1, lines[lines.length - 1]?.length || 0);
        diagnostics.push(new vscode.Diagnostic(range, 
            `${conditionalNesting} bloc(s) Si/If non fermé(s). Ajoutez FinSi./EndIf.`, 
            vscode.DiagnosticSeverity.Error));
    }
    if (loopNesting > 0) {
        const range = new vscode.Range(lines.length - 1, 0, lines.length - 1, lines[lines.length - 1]?.length || 0);
        diagnostics.push(new vscode.Diagnostic(range, 
            `${loopNesting} boucle(s) non fermée(s). Ajoutez FinTantQue./FinPour. ou EndWhile./EndFor.`, 
            vscode.DiagnosticSeverity.Error));
    }

    diagnosticCollection.set(document.uri, diagnostics);
}

// Fonction d'indentation automatique
function getDAVIndentation(document, position, ch, options) {
    if (ch !== '\n') return null;

    const line = document.lineAt(position.line - 1);
    const text = line.text.trim();
    const edits = [];

    // Déterminer le niveau d'indentation actuel
    const currentIndent = line.firstNonWhitespaceCharacterIndex;
    let newIndent = currentIndent;

    // Augmenter l'indentation après ces mots-clés
    const increaseIndentPatterns = [
        /^(Si|If)\s/,
        /^(Sinon|Else)\.?$/,
        /^(TantQue|While)\s/,
        /^(Pour|For)\s/,
        /^(Crée une fonction nommée|Create a function named)/
    ];

    // Diminuer l'indentation pour ces mots-clés
    const decreaseIndentPatterns = [
        /^(FinSi|EndIf)\./,
        /^(FinTantQue|EndWhile)\./,
        /^(FinPour|EndFor)\./,
        /^(FinFonction|EndFunction)\./,
        /^(Sinon|Else)\.?$/
    ];

    const tabSize = options.tabSize || 4;

    // Vérifier si on doit augmenter l'indentation
    if (increaseIndentPatterns.some(pattern => pattern.test(text))) {
        newIndent += tabSize;
    }

    // Vérifier si la ligne courante doit diminuer l'indentation
    const currentLine = document.lineAt(position.line);
    const currentText = currentLine.text.trim();
    
    if (decreaseIndentPatterns.some(pattern => pattern.test(currentText))) {
        newIndent = Math.max(0, newIndent - tabSize);
    }

    // Créer l'indentation
    if (newIndent > 0) {
        const spaces = ' '.repeat(newIndent);
        edits.push(vscode.TextEdit.insert(position, spaces));
    }

    return edits;
}

function deactivate() {
    console.log('Extension DAV Language Support désactivée');
}

module.exports = {
    activate,
    deactivate
};
