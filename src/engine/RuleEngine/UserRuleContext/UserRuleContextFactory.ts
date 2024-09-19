import { UserRoleContextGetter } from "../interfaces/Rules";
import { SingleUserRuleContext } from "./SingleUserRuleContext";
import { WildcardRuleContext } from "./WildcardRuleContext";

export class UserRoleContextGettersFactory {
    static getUserRoleContext(): UserRoleContextGetter[] {
        return [new SingleUserRuleContext(), new WildcardRuleContext()];
    }
}