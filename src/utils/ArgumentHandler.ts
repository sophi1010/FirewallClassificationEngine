import { existsSync, statSync } from 'fs';
import { resolve } from 'path';

function isValidFile(path: string): boolean {
    return existsSync(path) && statSync(path).isFile();
}

function isValidDirectory(path: string): boolean {
    return existsSync(path) && statSync(path).isDirectory();
}

export function validateAndResolveArguments(args: string[]): { firewallRulesFilePath: string, sourceHostsDirPath: string } {
    if (args.length !== 2) {
        throw new Error("Error: You must provide exactly two arguments.");
    }

    const firewallRulesFilePath = resolve(args[0]);
    const sourceHostsDirPath = resolve(args[1]);

    if (!isValidFile(firewallRulesFilePath)) {
        throw new Error(`Error: The firewall rules file path "${firewallRulesFilePath}" is invalid or does not point to a file.`);
    }

    if (!isValidDirectory(sourceHostsDirPath)) {
        throw new Error(`Error: The source hosts directory path "${sourceHostsDirPath}" is invalid or does not point to a directory.`);
    }

    return { firewallRulesFilePath, sourceHostsDirPath };
}