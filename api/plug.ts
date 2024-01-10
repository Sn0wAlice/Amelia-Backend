import { logs } from '../utils/logs.ts';

export class Plug {
    private static instance: Plug;

    private plugs: any[]

    private constructor() {
        this.plugs = [];
        this.init();
    }

    static getInstance(): Plug {
        if (!Plug.instance) {
            Plug.instance = new Plug();
        }
        return Plug.instance;
    }

    public findPlug(data:string[]) {
        // match to an existing plug
        // plugs.words is a list of array of string. each array is a list of words that trigger the plug
        // so we need to trigger the plug where all his words are in the data
        for(let i = 0; i < this.plugs.length; i++) {
            const plug = this.plugs[i];
            let found = true;
            for(let j = 0; j < plug.words.length; j++) {
                const words = plug.words[j];
                let found2 = false;
                for(let k = 0; k < words.length; k++) {
                    const word = words[k];
                    if(data.includes(word)) {
                        found2 = true;
                        break;
                    }
                }
                if(!found2) {
                    found = false;
                    break;
                }
            }
            if(found) {
                return plug;
            }
        }
    }

    private async init() {
        const files = ((this.readDir("./api/plug")).filter((file:string) => file.endsWith(".ts"))).map((file:string) => {
            return file.replace('./api', '.')
        });

        logs.info("Plu Loading " + files.length + " plugs");
        for(let i = 0; i < files.length; i++) {
            const file = files[i];
            logs.info("Plug Loading: " + file);
            this.plugs.push({
                words: (await import(file)).words,
                exec: (await import(file)).main
            });
        }
    }



    // private space
    private readDir(path:string) {
        let files:string[] = []
        for (const dirEntry of Deno.readDirSync(path)) {
            if(dirEntry.isDirectory) {
                let array = this.readDir(path + "/" + dirEntry.name);
                array.forEach((element:string) => {
                    files.push(element);
                });
            } else {
                files.push(path + "/" + dirEntry.name);
            }
        }
        return files;
    }
}