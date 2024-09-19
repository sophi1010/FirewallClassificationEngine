import { Netmask } from "netmask";
import { Action, Matcher, RulesMap } from "../interfaces/Rules";

// works for CIDR and IPV4 exact match
export class CIDRMatcher implements Matcher {
    matches(rules: RulesMap, destIp: string): Action | null {
        for (const rule of rules) {
            const address = rule[0];
            const block = new Netmask(address);
            if (block.contains(destIp)) {
                return rule[1];
            }
        }
        return null;
    }
}