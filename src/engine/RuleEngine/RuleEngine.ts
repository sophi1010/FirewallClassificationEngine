import fs from 'fs';
import { z } from 'zod';
import { Action, Matcher, UsersToRulesMap } from './interfaces/Rules';
import { AddressValidator } from './AddressValidator';
import { MatchersFactory } from './Matchers/MatchersFactory';

export class RuleEngine {
    private _matchers: Matcher[] = MatchersFactory.getMatchers();
    private _rules: UsersToRulesMap = new Map();
    private _ruleSchema = z.object({
        userName: z.string(),
        ipv4: z.string().refine(
            (str) => AddressValidator.isValidIPv4OrCIDR(str),
            { message: "Invalid IPv4 or CIDR notation" }
        ),
        action: z.enum(['allow', 'deny'])
    });

    private _isStarted(): boolean {
        return this._rules.size > 0;
    }

    public matchRule(hostName: string, userName: string, destIp: string) {
        if (!this._isStarted()){
            throw new Error(`${this.constructor.name}: Should be started first / rules not be empty`);
        }

        // get relevant rules for user
        const rulesForUser = this._rules.get(userName);

        if (!rulesForUser) {
            console.log(`${this.constructor.name}: ${hostName}: ${userName} access to ${destIp} was allowed by default (no rule applied, no user name match)`);
            return;
        }

        // search for a match
        let action: Action | null = null;

        for (const matcher of this._matchers) {
            action = matcher.matches(rulesForUser!, destIp);
            if (action) {
                console.log(`${this.constructor.name}: ${hostName}: ${userName} access to ${destIp} was ${action === Action.ALLOW ? 'allowed' : 'denied'}`);
                break;
            }
        }

        if (!action) {
            console.log(`${this.constructor.name}: ${hostName}: ${userName} access to ${destIp} was allowed by default (no rule applied, no matching address)`);
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
            const [userName, ipOrCidr, action] = line.split('|').map(s => s.trim());
            try {
                this._ruleSchema.parse({ userName, ipv4: ipOrCidr, action });
                
                if (!this._rules.has(userName)) {
                    this._rules.set(userName, new Map().set(ipOrCidr, action as Action));
                    continue;
                }

                const userRules = this._rules.get(userName);

                // skip redundant rules
                if (!(userRules!.has(ipOrCidr))) {
                    userRules!.set(ipOrCidr, action as Action);
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