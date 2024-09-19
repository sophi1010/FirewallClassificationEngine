import { RulesMap, UserRoleContextGetter, UsersToRulesMap } from "../interfaces/Rules";

export class SingleUserRuleContext implements UserRoleContextGetter {
    public getRuleContext(rules: UsersToRulesMap, userName: string): RulesMap | null {
        return rules.get(userName) || null;
    }
}