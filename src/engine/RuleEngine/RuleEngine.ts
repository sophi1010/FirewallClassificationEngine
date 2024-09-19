import fs from 'fs';
import { z } from 'zod';
import { Action } from './interfaces/Rules';

export class RuleEngine {
    private ruleSchema = z.object({
        userName: z.string(),
        ipv4: z.string().ip({ version: 'v4' }),
        action: z.enum(['allow', 'deny'])
    });

    public getRules(path: string): Map<string, Map<string, Action>> {
        const rules: Map<string, Map<string, Action>> = new Map();
        const fileContent = fs.readFileSync(path, 'utf-8');
        const lines = fileContent.split('\n');

        for (const line of lines) {
            const [userName, ipv4, action] = line.split('|').map(s => s.trim());
            try {
                this.ruleSchema.parse({ userName, ipv4, action });
                
                if (!rules.has(userName)) {
                    rules.set(userName, new Map().set(ipv4, action as Action));
                    continue;
                }

                const userRules = rules.get(userName);

                // skip redundant rules
                if (!(userRules!.has(ipv4))) {
                    userRules!.set(ipv4, action as Action);
                }

            } catch (error) {
                console.error(`${this.constructor.name}: Invalid rule: ${line}`);
            }
        }

        return rules;
    }
}