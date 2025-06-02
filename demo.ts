#!/usr/bin/env tsx

import { gaussianKnowledgeGraphPlugin } from "./dist/index.js";

// Mock runtime for demonstration
const mockRuntime = {
    messageManager: {
        createMemory: async (memory: any) => {
            console.log("📝 Created memory:", memory.content.text);
        }
    },
    getService: (name: string) => {
        if (name === "knowledge") {
            return {
                addKnowledge: async (data: any) => {
                    console.log("💾 Added to knowledge graph:", data.metadata.source);
                    console.log("📊 Format:", data.format);
                },
                query: async (query: string) => {
                    console.log("🔍 SPARQL Query:", query);
                    return [{ title: "Sample Result", scf_energy: "-40.52", method: "B3LYP" }];
                },
                search: async (query: string, options: any) => {
                    console.log("🔍 Natural Language Query:", query);
                    return [
                        { title: "Methane B3LYP Calculation", scf_energy: "-40.52", method: "B3LYP", basis_set: "6-31G(d)" },
                        { title: "Benzene B3LYP Calculation", scf_energy: "-232.24", method: "B3LYP", basis_set: "6-31G(d)" }
                    ];
                }
            };
        }
        return null;
    },
    registerService: (name: string, service: any) => {
        console.log(`✅ Registered service: ${name}`);
    }
};

console.log("🧪 Gaussian Knowledge Graph Plugin Demo");
console.log("=========================================\n");

console.log("📦 Plugin Details:");
console.log(`Name: ${gaussianKnowledgeGraphPlugin.name}`);
console.log(`Description: ${gaussianKnowledgeGraphPlugin.description}`);
console.log(`Actions: ${gaussianKnowledgeGraphPlugin.actions.length}`);
console.log(`Services: ${gaussianKnowledgeGraphPlugin.services.length}\n`);

console.log("⚡ Available Actions:");
gaussianKnowledgeGraphPlugin.actions.forEach((action, i) => {
    console.log(`${i + 1}. ${action.name}: ${action.description}`);
    console.log(`   Aliases: ${action.similes.join(", ")}\n`);
});

console.log("🔧 Available Services:");
gaussianKnowledgeGraphPlugin.services.forEach((service, i) => {
    console.log(`${i + 1}. ${service.serviceType} service\n`);
});

console.log("🧬 Generated Knowledge Graph Sample:");
console.log("=====================================");
console.log(`
@prefix ontocompchem: <http://www.theworldavatar.com/ontology/ontocompchem/> .
@prefix dcterms: <http://purl.org/dc/terms/> .

<https://example.org/gaussian/sample_methane.log> a ontocompchem:QuantumCalculation ;
    dcterms:title "sample_methane.log" ;
    ontocompchem:hasConverged false ;
    ex:parserVersion "0.1.0" .
`);

// Initialize services
console.log("🚀 Initializing services...");
for (const service of gaussianKnowledgeGraphPlugin.services) {
    try {
        await service.initialize(mockRuntime as any);
    } catch (error) {
        console.log(`⚠️  Service initialization skipped: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

console.log("\n✨ Demo completed! The Gaussian Knowledge Graph plugin is ready for Bio x AI Hackathon!");
console.log("\n🎯 Next Steps:");
console.log("1. Integrate with Eliza OS agent runtime");
console.log("2. Upload Gaussian logfiles for processing");
console.log("3. Query the quantum chemistry knowledge graph");
console.log("4. Chat with Dr. Gaussian about computational chemistry!"); 