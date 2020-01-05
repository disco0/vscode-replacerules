import * as vscode from 'vscode';

import ReplaceRulesEditProvider from './editProvider';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('replacerules.runRule', runSingleRule));
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('replacerules.runRuleset', runRuleset));
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('replacerules.pasteAndReplace', pasteReplace));
    context.subscriptions.push(vscode.commands.registerCommand('replacerules.stringifyRegex', stringifyRegex));
}

function runSingleRule(textEditor: vscode.TextEditor, _edit: vscode.TextEditorEdit, args?: any) {
    let editP = new ReplaceRulesEditProvider(textEditor);
    if (args) {
        let ruleName = args['ruleName'];
        editP.runSingleRule(ruleName);
    } else {
        editP.pickRuleAndRun();
    }
    return;
}

function runRuleset(textEditor: vscode.TextEditor, _edit: vscode.TextEditorEdit, args?: any) {
    let editP = new ReplaceRulesEditProvider(textEditor);
    if (args) {
        let rulesetName = args['rulesetName'];
        editP.runRuleset(rulesetName);
    } else {
        editP.pickRulesetAndRun();
    }
    return;
}

function pasteReplace(textEditor: vscode.TextEditor, _edit: vscode.TextEditorEdit, args?: any) {
    let editP = new ReplaceRulesEditProvider(textEditor);
    if (args) {
        let ruleName = args['ruleName'];
        editP.pasteReplace(ruleName);
    } else {
        editP.pickRuleAndPaste();
    }
    return;
}

function stringifyRegex() {
    let options = { prompt: 'Enter a valid regular expression.', placeHolder: '(.*)' };
    vscode.window.showInputBox(options).then(input => {
        if (input) {
            // Strip forward slashes if regex string is enclosed in them
            input = (input.startsWith('/') && input.endsWith('/')) ? input.slice(1, -1) : input;
            try {
                let regex = new RegExp(input);
                let jString = JSON.stringify(regex.toString().slice(1, -1));
                let msg = 'JSON-escaped RegEx: ' + jString;
                vscode.window.showInformationMessage(msg, 'Copy to clipboard').then(choice => {
                    if (choice && choice === 'Copy to clipboard') {
                        vscode.env.clipboard.writeText(jString);
                    }
                });
            } catch (err) {
                vscode.window.showErrorMessage(err.message);
            }
        }
    });
}
