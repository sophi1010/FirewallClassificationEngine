import { Action, IpAddress, RulesMap, UserRoleContextGetter, UsersToRulesMap } from "../interfaces/Rules";

export class WildcardRuleContext implements UserRoleContextGetter {
    public getRuleContext(rules: UsersToRulesMap, userName: string): RulesMap | null {
        const wildcardRules = new Map<IpAddress, Action>();
        for (const [u, r] of rules.entries()) {
            for (const [ip, action] of r.entries()) {
                wildcardRules.set(ip, action);
            }
        }
        return wildcardRules;
    }
}