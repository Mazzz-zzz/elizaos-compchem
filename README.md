# Gaussian Knowledge Graph Plugin for Eliza OS

A professional-grade plugin for [Eliza OS](https://eliza.how/) that parses Gaussian 16 quantum chemistry logfiles and converts them into semantic knowledge graphs using standard ontologies.

![Bio x AI Hackathon](https://img.shields.io/badge/Bio%20x%20AI-Hackathon-blue)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.0+-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-23+-green.svg)
![Eliza OS](https://img.shields.io/badge/Eliza_OS-Compatible-purple.svg)

## 🚀 Features

- **🧪 Parse Gaussian Logfiles**: Extract computational chemistry data from Gaussian 16 output files
- **🧠 Semantic Knowledge Graphs**: Convert quantum chemistry data to RDF using standard ontologies
- **🤖 Eliza OS Actions**: Built-in actions for parsing files and querying knowledge graphs
- **🔬 Dr. Gaussian Character**: Pre-configured quantum chemistry expert agent
- **📚 Standard Ontologies**: Uses OntoCompChem, CHEMINF, and PROV-O for interoperability
- **🧪 Comprehensive Testing**: Full test suite for both TypeScript and Python components
- **⚡ Real-time Processing**: Automatic parsing and knowledge graph integration

## 📋 Prerequisites

- **Node.js** 23+ (required for Eliza OS)
- **pnpm** (package manager)
- **Python** 3.8+ and Poetry
- **Eliza OS** development environment

## 🛠️ Installation

### For Eliza OS Plugin Development

```bash
# 1. Clone the plugin template
git clone https://github.com/your-org/plugin-gaussian-kg.git
cd plugin-gaussian-kg

# 2. Run automated setup
chmod +x setup.sh
./setup.sh
```

### Integration with Eliza OS Project

```bash
# 1. Add as submodule to your Eliza project
cd /path/to/your/eliza/project
git submodule add https://github.com/your-org/plugin-gaussian-kg.git packages/plugin-gaussian-kg

# 2. Install dependencies
cd packages/plugin-gaussian-kg
pnpm install
pnpm build

# 3. Add to your agent's dependencies
pnpm add @elizaos-plugins/plugin-gaussian-kg@'workspace:*' --filter ./agent

# 4. Configure character to use the plugin
# Add "@elizaos-plugins/plugin-gaussian-kg" to plugins array in your character.json
```

## 🔧 Usage

### Running Dr. Gaussian Agent

```bash
# Start the Gaussian expert agent
pnpm start --character=characters/gaussian-scientist.character.json
```

### Chat Interface Examples

```
User: Parse this Gaussian file: https://example.com/benzene_b3lyp.log

Dr. Gaussian: I'll parse that Gaussian logfile for you and import the quantum chemistry data into my knowledge graph.
[Automatically triggers PARSE_GAUSSIAN_FILE action]

✅ Successfully parsed and imported Gaussian file
Processed: https://example.com/benzene_b3lyp.log
Triples generated: 156

User: What are the SCF energies for all B3LYP calculations?

Dr. Gaussian: I'll search the quantum chemistry knowledge graph for B3LYP calculations and their SCF energies.
[Automatically triggers QUERY_QUANTUM_CHEMISTRY action]

🔍 Found 3 results for your quantum chemistry query:

1. Benzene B3LYP Optimization
   SCF Energy: -232.24 eV
   Method: B3LYP
   Basis Set: 6-31G(d)

2. Methane B3LYP Calculation  
   SCF Energy: -40.52 eV
   Method: B3LYP
   Basis Set: 6-31G(d)
```

### Plugin Actions

#### PARSE_GAUSSIAN_FILE
Automatically triggered when users mention Gaussian files or provide URLs to .log/.out files.

**Triggers:**
- "Parse this Gaussian file: [URL]"
- "Import quantum calculation: [URL]" 
- "Analyze this logfile: [URL]"

#### QUERY_QUANTUM_CHEMISTRY  
Triggered when users ask questions about quantum chemistry data.

**Triggers:**
- "What are the SCF energies for B3LYP calculations?"
- "Show me HOMO-LUMO gaps larger than 4 eV"
- "Find frequency calculations for organic molecules"

## 📊 Data Schema & Ontologies

### Ontologies Used

- **OntoCompChem**: Computational chemistry concepts
- **CHEMINF**: Chemical information and molecular descriptors  
- **PROV-O**: Provenance and metadata
- **Dublin Core**: Basic metadata terms

### Example RDF Output

```turtle
@prefix ontocompchem: <http://www.theworldavatar.com/ontology/ontocompchem/> .
@prefix cheminf: <http://semanticscience.org/resource/> .
@prefix prov: <http://www.w3.org/ns/prov#> .

<https://example.org/gaussian/benzene_calc> a ontocompchem:QuantumCalculation ;
    ontocompchem:hasComputationalMethod [
        a ontocompchem:ComputationalMethod ;
        rdfs:label "B3LYP"
    ] ;
    ontocompchem:hasBasisSet [
        a ontocompchem:BasisSet ;
        rdfs:label "6-31G(d)"
    ] ;
    ontocompchem:hasSCFEnergy [
        a ontocompchem:SCFEnergy ;
        ontocompchem:hasValue "-232.2438745" ;
        ontocompchem:hasUnit "eV"
    ] ;
    prov:wasGeneratedBy [
        a prov:Activity, ex:GaussianRun ;
        rdfs:label "Gaussian 16 Calculation"
    ] .
```

## 🧪 Testing

### Run All Tests

```bash
# TypeScript tests
pnpm test

# Python tests  
cd py && poetry run pytest

# Coverage reports
pnpm test:coverage
cd py && poetry run pytest --cov
```

### Test with Sample Data

```bash
# Test the Python parser directly
cd py
poetry run python parse_gaussian.py ../tests/data/sample_methane.log '{"filename": "methane.log"}'

# Test the complete plugin
pnpm dev
```

## 🏗️ Plugin Architecture

```
┌─────────────────┐    Chat     ┌──────────────────┐
│  Dr. Gaussian   │ ◄────────── │ Eliza OS Agent   │
│   Character     │             │    Runtime       │
└─────────────────┘             └──────────────────┘
                                          │
                                          │ Plugin System
                                          ▼
                                ┌──────────────────┐
                                │ Actions:         │
                                │ • Parse Gaussian │
                                │ • Query KG       │
                                └──────────────────┘
                                          │
                                          │ Services
                                          ▼
                                ┌──────────────────┐
                                │ Python Parser    │
                                │ (cclib + rdflib) │
                                └──────────────────┘
                                          │
                                          │ RDF Output
                                          ▼
                                ┌──────────────────┐
                                │ Knowledge Graph  │
                                │ (Eliza Memory)   │
                                └──────────────────┘
```

## 🔬 Supported Gaussian Features

| Feature | Supported | Notes |
|---------|-----------|-------|
| SCF Energies | ✅ | Final SCF energy extracted |
| Molecular Geometry | ✅ | Cartesian coordinates |
| Basis Sets | ✅ | Standard basis set names |
| Methods | ✅ | DFT and ab initio methods |
| Frequencies | ✅ | Vibrational frequencies |
| HOMO-LUMO Gaps | ✅ | From molecular orbitals |
| Dipole Moments | ✅ | Vector magnitude |
| Charge/Multiplicity | ✅ | From input specification |
| Convergence Status | ✅ | Success/failure detection |

## 🎭 Dr. Gaussian Character

The plugin includes a pre-configured character **Dr. Gaussian**, a computational chemistry expert:

**Expertise:**
- PhD in Theoretical Chemistry from MIT
- 100+ publications in computational quantum chemistry
- Specializes in PFAS degradation mechanisms
- Expert in DFT, MP2, and basis set selection

**Capabilities:**
- Parse and analyze Gaussian logfiles
- Answer questions about quantum chemistry calculations
- Maintain comprehensive knowledge graphs
- Provide computational chemistry guidance

## 🤝 Contributing

### Plugin Development

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests
4. **Run the test suite**: `pnpm test && cd py && poetry run pytest`
5. **Submit a pull request**

### Development Guidelines

- Follow Eliza OS plugin patterns
- Use proper TypeScript/Python style guides
- Maintain test coverage above 80%
- Update documentation for new features
- Use semantic commit messages

### Adding New Actions

```typescript
// src/actions/newAction.ts
import { Action, IAgentRuntime, Memory, State } from "@elizaos/core";

export const newAction: Action = {
    name: "NEW_ACTION",
    similes: ["ALIAS1", "ALIAS2"],
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        // Validation logic
        return true;
    },
    description: "Description of the action",
    handler: async (runtime, message, state, options, callback) => {
        // Action implementation
        return true;
    },
    examples: [
        // Action examples
    ],
};
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **cclib** for quantum chemistry file parsing
- **rdflib** for RDF graph manipulation
- **Eliza OS** team for the plugin framework
- **Bio x AI Hackathon** organizers
- **OntoCompChem** ontology developers

## 🐛 Known Issues

- Type definitions for `@elizaos/core` are currently mocked
- Large logfiles (>100MB) may require streaming parser
- Some advanced Gaussian features not yet supported

## 🚀 Future Enhancements

- [ ] **Multi-format Support**: ORCA, Q-Chem, NWChem parsers
- [ ] **Batch Processing**: Handle multiple files simultaneously
- [ ] **3D Visualization**: Molecular structure visualization in chat
- [ ] **Literature Mining**: Connect calculations to research papers
- [ ] **Real-time Monitoring**: Live calculation status updates
- [ ] **Advanced Queries**: Complex SPARQL query builder

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-org/plugin-gaussian-kg/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/plugin-gaussian-kg/discussions)
- **Discord**: [Bio x AI Hackathon Discord](https://discord.gg/bioai)
- **Eliza OS Docs**: [https://eliza.how/docs/](https://eliza.how/docs/)

---

Made with ❤️ for the Bio x AI Hackathon & Eliza OS Community 