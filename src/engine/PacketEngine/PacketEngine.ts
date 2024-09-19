import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { Packet } from './interfaces/Packet';

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

    public parsePackets(dirPath: string): Map<string, Packet[]> {
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