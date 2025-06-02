#!/usr/bin/env tsx

/**
 * Demo script for loading TolueneEnergy.log into ElizaOS knowledge graph
 * Following the Bio x AI Hackathon roadmap for Gaussian 16 plugin
 */

import { resolve } from "path";
import { readFileSync } from "fs";
import { gaussianKnowledgeGraphPlugin } from "./src/index.js";

// Mock ElizaOS runtime for demonstration
class MockRuntime {
    private knowledgeGraph: string[] = [];

    getService(name: string) {
        if (name === "knowledge") {
            return {
                addKnowledge: async (data: any) => {
                    console.log("📊 Adding knowledge to graph:");
                    console.log(`  Format: ${data.format}`);
                    console.log(`  Source: ${data.metadata.source}`);
                    console.log(`  Parser: ${data.metadata.parser}`);
                    
                    // Count triples
                    const tripleCount = (data.content.match(/\./g) || []).length;
                    console.log(`  Triples: ${tripleCount}`);
                    
                    this.knowledgeGraph.push(data.content);
                    return { success: true, triples: tripleCount };
                }
            };
        }
        return null;
    }

    messageManager = {
        createMemory: async (memory: any) => {
            console.log("💬 Agent Response:", memory.content.text);
        }
    };

    listKnowledge() {
        return this.knowledgeGraph;
    }
}

async function demonstrateGaussianKGPlugin() {
    console.log("🧪 Bio x AI Hackathon - Gaussian Knowledge Graph Demo");
    console.log("=" .repeat(60));
    
    // Step 1: Load the plugin
    console.log("\n1️⃣  Loading Gaussian KG Plugin...");
    console.log(`   Plugin: ${gaussianKnowledgeGraphPlugin.name}`);
    console.log(`   Actions: ${gaussianKnowledgeGraphPlugin.actions?.length || 0}`);
    console.log(`   Services: ${gaussianKnowledgeGraphPlugin.services?.length || 0}`);

    // Step 2: Simulate parsing the TolueneEnergy.log file
    console.log("\n2️⃣  Processing TolueneEnergy.log...");
    
    const mockRuntime = new MockRuntime();
    const parseAction = gaussianKnowledgeGraphPlugin.actions?.find(
        action => action.name === "PARSE_GAUSSIAN_FILE"
    );

    if (!parseAction) {
        console.error("❌ Parse action not found!");
        return;
    }

    // Create a mock message simulating user input
    const mockMessage = {
        userId: "user123",
        roomId: "hackathon-room",
        content: {
            url: resolve("example_logs/TolueneEnergy.log"),
            text: "Parse this Gaussian file: example_logs/TolueneEnergy.log",
            metadata: {
                filename: "TolueneEnergy.log",
                timestamp: "2017-02-23T14:06:39Z",
                software_version: "G16RevA.03"
            }
        }
    };

    const mockState = {};

    // Step 3: Execute the parse action
    console.log("\n3️⃣  Executing parse action...");
    try {
        const success = await parseAction.handler(
            mockRuntime as any,
            mockMessage as any,
            mockState as any
        );

        if (success) {
            console.log("\n✅ Success! Toluene calculation loaded into knowledge graph");
            
            // Step 4: Demonstrate knowledge querying
            console.log("\n4️⃣  Knowledge Graph Summary:");
            const knowledge = mockRuntime.listKnowledge();
            console.log(`   Graphs stored: ${knowledge.length}`);
            
            if (knowledge.length > 0) {
                const rdf = knowledge[0];
                const moleculeMatch = rdf.match(/cheminf:hasAtom/g);
                const energyMatch = rdf.match(/ontocompchem:hasSCFEnergy/g);
                const freqMatch = rdf.match(/ontocompchem:hasFrequency/g);
                
                console.log(`   Atoms: ${moleculeMatch?.length || 0}`);
                console.log(`   Energies: ${energyMatch?.length || 0}`);
                console.log(`   Frequencies: ${freqMatch?.length || 0}`);
            }

            console.log("\n🎯 Demo completed successfully!");
            console.log("\n📋 Next steps for hackathon:");
            console.log("   • Deploy to ElizaOS instance");
            console.log("   • Add SPARQL query interface");
            console.log("   • Integrate with 3Dmol.js visualization");
            console.log("   • Add batch processing for multiple files");
            
        } else {
            console.error("❌ Failed to parse file");
        }
    } catch (error) {
        console.error("❌ Error during demo:", error);
    }
}

// Run the demo
demonstrateGaussianKGPlugin().catch(console.error); 