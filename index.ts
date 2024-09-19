import { ClassificationEngine } from './src/engine/ClassificationEngine/ClassificationEngine';
import { PacketEngine } from './src/engine/PacketEngine/PacketEngine';
import { RuleEngine } from './src/engine/RuleEngine/RuleEngine';
import { validateAndResolveArguments } from './src/utils/ArgumentHandler';

// Get command line arguments (ignore the first two: node and script path)
const args = process.argv.slice(2);

try {
    const { firewallRulesFilePath, sourceHostsDirPath } = validateAndResolveArguments(args);
    console.log("Both the firewall rules file and source hosts directory paths are valid.");
    
    const classificationEngine = new ClassificationEngine(new PacketEngine(), new RuleEngine());
    classificationEngine.startEngine(sourceHostsDirPath, firewallRulesFilePath);

} catch (error) {
    if (error instanceof Error) {
        console.error(error.message);
    } else {
        console.error("An unknown error occurred");
    }
    console.error("Usage: ts-node verifyPaths.ts <firewallRulesFilePath> <sourceHostsDirPath>");
    process.exit(1);
}

