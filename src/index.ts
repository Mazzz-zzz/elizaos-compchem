import { Plugin } from "./types/mock-eliza.js";
import { parseGaussianAction } from "./actions/parseGaussian.js";
import { queryKnowledgeGraphAction } from "./actions/queryKnowledgeGraph.js";
import { gaussianParserService } from "./services/gaussianParser.js";

export const gaussianKnowledgeGraphPlugin: Plugin = {
    name: "gaussian-kg",
    description: "Parse Gaussian 16 quantum chemistry logfiles into knowledge graphs",
    actions: [
        parseGaussianAction,
        queryKnowledgeGraphAction,
    ],
    services: [
        gaussianParserService,
    ],
    evaluators: [],
    providers: [],
    clients: [],
};

export default gaussianKnowledgeGraphPlugin;

// Export individual components for modularity
export { parseGaussianAction, queryKnowledgeGraphAction, gaussianParserService }; 