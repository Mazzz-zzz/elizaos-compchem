#!/usr/bin/env tsx

/**
 * Query Demo - Showing how to interact with loaded TolueneEnergy.log data
 * This demonstrates the "chat with your quantum chemistry data" capability
 */

import { gaussianKnowledgeGraphPlugin } from "./src/index.js";

// Sample queries you can ask after loading TolueneEnergy.log
const exampleQueries = [
    {
        userQuery: "What's the SCF energy of toluene?",
        expectedResponse: "The SCF energy is -7,342.238 eV according to the CBS-QB3 calculation.",
        sparql: `
            SELECT ?energy WHERE {
                ?calc ontocompchem:hasSCFEnergy/ontocompchem:hasValue ?energy .
            }
        `
    },
    {
        userQuery: "How many atoms does this molecule have?",
        expectedResponse: "Toluene has 15 atoms: 7 carbons and 8 hydrogens.",
        sparql: `
            SELECT (COUNT(?atom) as ?atomCount) WHERE {
                ?calc ontocompchem:hasMolecularStructure/cheminf:hasAtom ?atom .
            }
        `
    },
    {
        userQuery: "What computational method was used?",
        expectedResponse: "The calculation used the CBS-QB3 method with DFT.",
        sparql: `
            SELECT ?method ?basis WHERE {
                ?calc ontocompchem:hasComputationalMethod/rdfs:label ?method ;
                      ontocompchem:hasBasisSet/rdfs:label ?basis .
            }
        `
    },
    {
        userQuery: "Show me the HOMO-LUMO gap",
        expectedResponse: "The HOMO-LUMO gap is 9.886 eV.",
        sparql: `
            SELECT ?gap WHERE {
                ?calc ontocompchem:hasHOMOLUMOGap/ontocompchem:hasValue ?gap .
            }
        `
    },
    {
        userQuery: "What are the highest vibrational frequencies?",
        expectedResponse: "The highest frequencies are around 3100-3170 cm⁻¹, corresponding to C-H stretches.",
        sparql: `
            SELECT ?freq WHERE {
                ?calc ontocompchem:hasVibrationalFrequencies/ontocompchem:hasFrequency/ontocompchem:hasValue ?freq .
            } ORDER BY DESC(?freq) LIMIT 5
        `
    }
];

console.log("🔍 TolueneEnergy.log Query Demonstration");
console.log("=" .repeat(50));

console.log("\n📊 After loading your TolueneEnergy.log file, you can ask:");

exampleQueries.forEach((query, i) => {
    console.log(`\n${i + 1}. 👤 User: "${query.userQuery}"`);
    console.log(`   🤖 Agent: ${query.expectedResponse}`);
    console.log(`   📝 SPARQL: ${query.sparql.trim()}`);
});

console.log("\n" + "=" .repeat(50));
console.log("🧬 Scientific Insights You Can Extract:");
console.log("");
console.log("🔬 **Molecular Properties**");
console.log("   • Molecular formula: C₇H₈");
console.log("   • HOMO-LUMO gap: 9.886 eV (semiconductor range)");
console.log("   • Dipole moment: ~0 Debye (symmetric aromatic)");
console.log("");
console.log("⚡ **Electronic Structure**");
console.log("   • Method: CBS-QB3 (high accuracy composite method)");
console.log("   • Total energy: -271.020456 Hartrees");
console.log("   • Electronic configuration: closed shell singlet");
console.log("");
console.log("🎵 **Vibrational Analysis**");
console.log("   • 39 normal modes identified");
console.log("   • C-H stretches: ~3100-3170 cm⁻¹");
console.log("   • Aromatic C=C stretches: ~1500-1650 cm⁻¹");
console.log("   • Methyl vibrations: various frequencies");
console.log("");
console.log("📐 **3D Structure**");
console.log("   • Benzene ring with methyl substitution");
console.log("   • All atomic coordinates available");
console.log("   • Optimized geometry at CBS-QB3 level");

console.log("\n" + "=" .repeat(50));
console.log("🚀 Next: Deploy to ElizaOS and chat with your data!");
console.log("   Chat: 'What makes toluene different from benzene?'");
console.log("   Chat: 'Compare this energy to other aromatics'");
console.log("   Chat: 'Show me the molecular structure'"); 