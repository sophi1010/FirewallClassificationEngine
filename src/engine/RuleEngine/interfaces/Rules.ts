//type UserName = string; // Can be a specific username or "*"
//type DestIp = string; // Can be an IP, CIDR, or domain name
export enum Action {
    ALLOW = 'allow',
    DENY = 'deny'
}

export interface Matcher {
    matches(rules: RulesMap, destIp: string): Action | null;
}
export type UserName = string;
export type IpAddress = string;
export type RulesMap = Map<IpAddress, Action>;
export type UsersToRulesMap = Map<UserName, RulesMap>;

