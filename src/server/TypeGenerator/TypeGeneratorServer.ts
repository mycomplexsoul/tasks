import { iNode } from "../iNode";
import * as Generator from '../MoBasicGenerator';

export class TypeGeneratorServer {
    entities: string[] = [
        'Catalog'
        ,'User'
        ,'Logger'
        ,'Task','TaskTimeTracking','TaskSchedule'
        ,'Account','Category','Place','Movement','Entry','Balance', 'Preset'
        ,'LastTime','LastTimeHistory'
    ];
    
    config = (node: iNode) => {
        const response = {
            entities: this.entities
        };
        node.response.end(JSON.stringify(response));
    };

    create = (node: iNode) => {
        let gen: Generator.MoBasicGenerator;
        let message: string = this.entities.join(', ');
    
        this.entities.forEach((entity: string) => {
            gen = new Generator.MoBasicGenerator(entity);
            gen.createTypeFile();
        });
        node.response.end(JSON.stringify({ operationOK: true, message: `Successfully generated File types for the entities: ${message}` }));
    };
}