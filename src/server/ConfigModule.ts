import * as fs from 'fs';

class ConfigModule {
    config = {};

    constructor() {
        this.loadConfig();
    }

    /**
     * Loads a file from file system and returns content as JSON object.
     */
    loadJSON = (file: string) => {
        let obj = JSON.parse(fs.readFileSync(file + '.json', 'utf8'));
        return obj;
    }

    loadConfig = () => {
        this.config = this.loadJSON('./cfg');
    }

    getConfigValue = (match: string = null): any | string | null => {
        if (match) {
            const pieces: string[] = match.split('.');
            let matched = {...this.config};
            pieces.forEach(p => {
                if (matched[p]) {
                    matched = matched[p];
                }
                return null;
            });
            return matched;
        }
        return this.config;
    }
}

export let configModule = new ConfigModule();
