import type { Plugin } from "./types/eliza-core.js";
import { parseGaussianAction } from "./actions/parseGaussian.js";
import { queryKnowledgeGraphAction } from "./actions/queryKnowledgeGraph.js";
import { GaussianParserService } from "./services/gaussianParser.js";

const gaussianKnowledgeGraphPlugin: Plugin = {
    name: "gaussian-kg",
    description: "Parse Gaussian 16 quantum chemistry logfiles into knowledge graphs using standard ontologies (OntoCompChem, CHEMINF, PROV-O)",
    actions: [
        parseGaussianAction,
        queryKnowledgeGraphAction,
    ],
    services: [GaussianParserService],
    evaluators: [],
    providers: [],
};

export default gaussianKnowledgeGraphPlugin;

// Export individual components for modularity
export { parseGaussianAction, queryKnowledgeGraphAction, GaussianParserService }; 