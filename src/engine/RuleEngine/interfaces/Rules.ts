export enum Action {
    ALLOW = 'allow',
    DENY = 'deny'
}

export interface Matcher {
    matches(rules: RulesMap, destIp: string): Action | null;
}
export interface UserRoleContextGetter {
    getRuleContext(rules: UsersToRulesMap, userName: string): RulesMap | null;
}
export type UserName = string;
export type IpAddress = string;
export type RulesMap = Map<IpAddress, Action>;
export type UsersToRulesMap = Map<UserName, RulesMap>;

