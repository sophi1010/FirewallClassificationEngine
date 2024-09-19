import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { Packet } from './interfaces/Packet';
import { MatchRuleCallback } from '../../interfaces/MatchRuleCallback';

export class PacketEngine {
    private packetSchema = z.object({
        userName: z.string(),
        ipv4: z.string().ip({ version: 'v4' })
    });

    private listTxtFiles(dirPath: string): string[] {
        return fs.readdirSync(dirPath)
            .filter(file => path.extname(file).toLowerCase() === '.txt')
            .map(file => path.join(dirPath, file));
    }

    private _getAgentsToPacketsMap(dirPath: string): Map<string, Packet[]> {
        const files = this.listTxtFiles(dirPath);
        const agentsToPacketsMap = new Map<string, Packet[]>();

        for (const file of files) {
            const packetsInFile = this.parsePacketsSingleFile(file);
            if (packetsInFile.length > 0) {
                agentsToPacketsMap.set(path.parse(file).name, packetsInFile);
            }
        }
        return agentsToPacketsMap;
    }

    public startEngine(dirPath: string, matchRuleCallback: MatchRuleCallback) {
        console.log(`${this.constructor.name}: starting engine...`);

        // can be done in parallel, all files in memory - bad! just for now
        const agentsToPacketsData = this._getAgentsToPacketsMap(dirPath);
        
        for (const [hostName, packets] of agentsToPacketsData) {
            for (const packet of packets) {
                matchRuleCallback(hostName, packet.userName, packet.destIp);
            }
        }

        console.log(`${this.constructor.name}: engine finished`);
    }

    parsePacketsSingleFile(filePath: string): Packet[] {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const lines = fileContent.split('\n');
    
        const packets: Packet[] = [];
        
        for (const line of lines) {
            if (line.trim() === '') {
                continue;
            }

            const [userName, ipv4] = line.split('|').map(s => s.trim());
            try {
                this.packetSchema.parse({ userName, ipv4 });
                packets.push({ userName: userName, destIp: ipv4 });
            } catch (error) {
                console.error(`${this.constructor.name}: Invalid packet: "${line}" in file: "${filePath}"`);
            }
        }
        return packets;
    }
}