import { PacketEngine } from "../PacketEngine/PacketEngine";
import { Packet } from "../PacketEngine/interfaces/Packet";
import { RuleEngine } from '../RuleEngine/RuleEngine';
import { Action } from '../RuleEngine/interfaces/Rules';

export class ClassificationEngine {

    constructor(private packetEngine: PacketEngine, private ruleEngine: RuleEngine) {}

    private printRules(rules: Map<string, Map<string, Action>>): void {
        console.log(`${this.constructor.name}: Rules -`)
        for (const [email, ipRules] of rules) {
            console.log(`  ${email}:`);
            for (const [ip, action] of ipRules) {
                console.log(`    ${ip}: ${action}`);
            }
        }
    }

    public async startEngine(packetsPath: string, rulesPath: string) {
        const rules = this.ruleEngine.getRules(rulesPath);
        this.printRules(rules);
        const hostsToPacketsData = this.packetEngine.parsePackets(packetsPath);
        
        this._startEngine(hostsToPacketsData, rules);
    }

    private _startEngine(hostPacketsData: Map<string, Packet[]>, rules: Map<string, Map<string, Action>>) {
        console.log(`${this.constructor.name}: starting engine...`);

        for (const [hostName, packets] of hostPacketsData) {
            for (const packet of packets) {
                const userName = packet.userName; 
                const destIp = packet.destIp;
                const rulesForUser = rules.get(userName);
                const action = rulesForUser?.get(destIp);

                if (rulesForUser) {
                    console.log(`${this.constructor.name}: ${hostName}: ${userName} access to ${destIp} was ${action === Action.ALLOW ? 'allowed' : 'denied'}`);
                } else {
                    console.log(`${this.constructor.name}: ${hostName}: ${userName} access to ${destIp} was allowed by default (no rule applied)`);
                }
            }
        }
    }


}