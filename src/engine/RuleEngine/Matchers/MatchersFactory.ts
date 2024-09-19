import { Matcher } from "../interfaces/Rules";
import { CIDRMatcher } from "./CIDRMatcher";

export class MatchersFactory {
    static getMatchers(): Matcher[] {
        return [new CIDRMatcher()];
    }
}