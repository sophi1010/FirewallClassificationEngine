export interface MatchRuleCallback {
    (hostName: string, userName: string, destIp: string): void;
}