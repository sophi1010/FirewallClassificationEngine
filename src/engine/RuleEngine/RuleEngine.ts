import fs from 'fs';
import { z } from 'zod';
import { Action } from './interfaces/Rules';

export class RuleEngine {
    private _rules: Map<string, Map<string, Action>> = new Map();
    private _ruleSchema = z.object({
        userName: z.string(),
        ipv4: z.string().ip({ version: 'v4' }),
        action: z.enum(['allow', 'deny'])
    });

    private _isStarted(): boolean {
        return this._rules.size > 0;
    }

    public matchRule(hostName: string,userName: string, destIp: string) {
        if (!this._isStarted()){
            throw new Error(`${this.constructor.name}: Should be started first`);
        }

        const rulesForUser = this._rules.get(userName);
        const action = rulesForUser?.get(destIp);

        if (rulesForUser) {
            console.log(`${this.constructor.name}: ${hostName}: ${userName} access to ${destIp} was ${action === Action.ALLOW ? 'allowed' : 'denied'}`);
        } else {
            console.log(`${this.constructor.name}: ${hostName}: ${userName} access to ${destIp} was allowed by default (no rule applied)`);
        }
    }

    public startEngine(path: string) {
        this._populateRules(path);
        this._printRules();
    }

    private _populateRules(path: string) {
        const fileContent = fs.readFileSync(path, 'utf-8');
        const lines = fileContent.split('\n');

        for (const line of lines) {
            const [userName, ipv4, action] = line.split('|').map(s => s.trim());
            try {
                this._ruleSchema.parse({ userName, ipv4, action });
                
                if (!this._rules.has(userName)) {
                    this._rules.set(userName, new Map().set(ipv4, action as Action));
                    continue;
                }

                const userRules = this._rules.get(userName);

                // skip redundant rules
                if (!(userRules!.has(ipv4))) {
                    userRules!.set(ipv4, action as Action);
                }

            } catch (error) {
                console.error(`${this.constructor.name}: Invalid rule: ${line}`);
            }
        }
    }

    private _printRules(): void {
        console.log(`${this.constructor.name}: Rules -`)
        for (const [email, ipRules] of this._rules) {
            console.log(`  ${email}:`);
            for (const [ip, action] of ipRules) {
                console.log(`    ${ip}: ${action}`);
            }
        }
    }
}