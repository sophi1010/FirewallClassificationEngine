import { PacketEngine } from "../PacketEngine/PacketEngine";
import { RuleEngine } from '../RuleEngine/RuleEngine';

export class ClassificationEngine {
    private _packetEngine: PacketEngine;
    private _ruleEngine: RuleEngine;

    constructor(private _packetsPath: string, private _rulesPath: string) {
        this._packetEngine = new PacketEngine();
        this._ruleEngine = new RuleEngine();
    }

    public async startEngine() {
        this._ruleEngine.startEngine(this._rulesPath);
        this._packetEngine.startEngine(this._packetsPath, this._ruleEngine.matchRule.bind(this._ruleEngine));
    }
}