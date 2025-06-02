# Gaussian KG Plugin Development Guide

This guide covers development workflows, testing, and contribution guidelines for the Gaussian Knowledge Graph plugin for Eliza OS.

## 🚀 Quick Start

### Prerequisites Verification

```bash
# Check Node.js version (must be 23+)
node --version  # Should be v23.x.x or higher

# Check pnpm
pnpm --version

# Check Python and Poetry
python3 --version  # Should be 3.8+
poetry --version

# Verify Python dependencies
cd py
poetry install
poetry run python -c "import cclib, rdflib, pydantic; print('All dependencies OK')"
```

### Initial Setup

```bash
# Clone and setup
git clone <your-repo-url>
cd plugin-gaussian-kg
chmod +x setup.sh
./setup.sh
```

## 🏗️ Project Structure

```
plugin-gaussian-kg/
├── src/                           # TypeScript plugin source
│   ├── index.ts                   # Main plugin export
│   ├── actions/                   # Eliza actions
│   │   ├── parseGaussian.ts       # Parse Gaussian files
│   │   └── queryKnowledgeGraph.ts # Query chemistry data
│   └── services/                  # Plugin services
│       └── gaussianParser.ts      # Gaussian parsing service
├── py/                            # Python parsing backend
│   ├── parse_gaussian.py          # Main parser script
│   ├── tests/                     # Python tests
│   └── pyproject.toml             # Poetry dependencies
├── characters/                    # Eliza character definitions
│   └── gaussian-scientist.character.json
├── tests/                         # TypeScript tests
│   ├── parse.spec.ts              # Plugin tests
│   └── data/                      # Test data files
├── .github/workflows/             # CI/CD pipelines
└── README.md                      # Main documentation
```

## 🧪 Development Workflow

### 1. Making Changes

```bash
# Start development mode
pnpm dev

# Watch for changes
pnpm build --watch
```

### 2. Testing Changes

```bash
# Run TypeScript tests
pnpm test

# Run Python tests
cd py && poetry run pytest -v

# Test with sample data
cd py
poetry run python parse_gaussian.py ../tests/data/sample_methane.log '{}'
```

### 3. Adding New Actions

Create a new action file in `src/actions/`:

```typescript
// src/actions/myNewAction.ts
import {
    ActionExample,
    Content,
    IAgentRuntime,
    Memory,
    State,
    type Action,
} from "@elizaos/core";

export const myNewAction: Action = {
    name: "MY_NEW_ACTION",
    similes: ["ALIAS1", "ALIAS2"],
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        // Validation logic
        return true;
    },
    description: "Description of what this action does",
    handler: async (runtime, message, state, options, callback) => {
        // Implementation
        return true;
    },
    examples: [
        // Action examples for training
    ],
};
```

Then add it to `src/index.ts`:

```typescript
import { myNewAction } from "./actions/myNewAction.js";

export const gaussianKnowledgeGraphPlugin: Plugin = {
    // ...
    actions: [
        parseGaussianAction,
        queryKnowledgeGraphAction,
        myNewAction,  // Add here
    ],
    // ...
};
```

### 4. Adding New Services

Create a service in `src/services/`:

```typescript
// src/services/myNewService.ts
import { Service, IAgentRuntime, ServiceType } from "@elizaos/core";

export const myNewService: Service = {
    serviceType: ServiceType.OTHER,
    initialize: async (runtime: IAgentRuntime) => {
        // Service initialization
        runtime.registerService("myNewService", serviceImpl);
    },
};
```

## 🧬 Python Parser Development

### Adding New Gaussian Features

1. **Extend the parser in `py/parse_gaussian.py`:**

```python
def gaussian_to_dict(file_path: str) -> Dict[str, Any]:
    # ... existing code ...
    
    # Add new feature extraction
    if hasattr(data, 'new_property'):
        result['new_property'] = process_new_property(data.new_property)
    
    return result
```

2. **Map to RDF in `dict_to_graph()`:**

```python
def dict_to_graph(calc_data: Dict[str, Any], file_uri: str, metadata: CalculationMetadata) -> Graph:
    # ... existing code ...
    
    # Add new RDF triples
    if calc_data.get('new_property'):
        new_node = BNode()
        g.add((calc_uri, ONTOLOGY.hasNewProperty, new_node))
        g.add((new_node, ONTOLOGY.hasValue, Literal(calc_data['new_property'])))
```

3. **Add tests:**

```python
# py/tests/test_parser.py
def test_new_property_extraction(self):
    calc_data = {
        'new_property': 'test_value'
    }
    # Test implementation
```

### Testing Python Changes

```bash
cd py

# Run specific tests
poetry run pytest tests/test_parser.py::test_new_property_extraction -v

# Run with coverage
poetry run pytest --cov=parse_gaussian --cov-report=html

# Test with real files
poetry run python parse_gaussian.py path/to/test.log '{}' --format turtle
```

## 🎭 Character Development

### Modifying Dr. Gaussian

Edit `characters/gaussian-scientist.character.json`:

```json
{
  "name": "Dr. Gaussian",
  "bio": [
    "Add new personality traits",
    "Update expertise areas"
  ],
  "messageExamples": [
    // Add new conversation examples
  ],
  "topics": [
    // Add new topic areas
  ]
}
```

### Testing Character Changes

```bash
# Start with the updated character
pnpm start --character=characters/gaussian-scientist.character.json

# Test conversations manually
# Or add automated character tests
```

## 🧪 Testing Strategy

### Unit Tests (TypeScript)

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test tests/parse.spec.ts

# Run with coverage
pnpm test:coverage
```

### Integration Tests (Python)

```bash
cd py
poetry run pytest

# Test specific modules
poetry run pytest tests/test_parser.py -v

# Performance tests
poetry run pytest tests/test_performance.py -v
```

### End-to-End Testing

```bash
# Test complete workflow
./scripts/e2e-test.sh

# Test with sample files
pnpm test:e2e
```

## 🚀 Deployment & Integration

### Building for Production

```bash
# Clean build
pnpm clean
pnpm build

# Verify build
node dist/index.js --help
```

### Adding to Eliza Project

```bash
# In your Eliza project root
git submodule add https://github.com/your-org/plugin-gaussian-kg.git packages/plugin-gaussian-kg

# Install and build
cd packages/plugin-gaussian-kg
pnpm install
pnpm build

# Add to agent dependencies
cd ../../agent
pnpm add @elizaos-plugins/plugin-gaussian-kg@'workspace:*'
```

### Character Configuration

Add to your character.json:

```json
{
  "plugins": [
    "@elizaos-plugins/plugin-gaussian-kg"
  ]
}
```

## 🐛 Debugging

### TypeScript Debugging

```bash
# Enable debug mode
DEBUG=eliza:* pnpm dev

# Use debugger in VS Code
# Set breakpoints in src/ files
# Run "Debug: Start Debugging"
```

### Python Debugging

```bash
cd py

# Run with pdb
poetry run python -m pdb parse_gaussian.py test.log '{}'

# Or use your IDE debugger
# VS Code: Set breakpoints and run in debug mode
```

### Common Issues

1. **Import errors with @elizaos/core**
   - Currently mocked - will be resolved when integrated with Eliza
   
2. **Python dependency issues**
   ```bash
   cd py
   poetry cache clear --all pypi
   poetry install --no-cache
   ```

3. **TypeScript compilation errors**
   ```bash
   pnpm clean
   rm -rf node_modules
   pnpm install
   pnpm build
   ```

## 📝 Code Style

### TypeScript

```bash
# Format code
pnpm format

# Lint
pnpm lint

# Fix lint issues
pnpm lint --fix
```

### Python

```bash
cd py

# Format with black
poetry run black .

# Sort imports
poetry run isort .

# Lint with flake8
poetry run flake8 .
```

## 🚀 Contributing

### Before Submitting PRs

1. **Run full test suite:**
   ```bash
   pnpm test
   cd py && poetry run pytest
   ```

2. **Check code style:**
   ```bash
   pnpm lint
   pnpm format
   cd py && poetry run black . && poetry run isort .
   ```

3. **Update documentation if needed**

4. **Add tests for new features**

### PR Guidelines

- Use conventional commit messages
- Include tests for new functionality
- Update README.md if adding user-facing features
- Ensure CI passes

### Review Process

1. Automated checks (CI/CD)
2. Code review by maintainers
3. Manual testing with sample data
4. Integration testing with Eliza OS

## 📚 Resources

- [Eliza OS Documentation](https://eliza.how/docs/)
- [cclib Documentation](https://cclib.github.io/)
- [RDFLib Documentation](https://rdflib.readthedocs.io/)
- [OntoCompChem Ontology](http://www.theworldavatar.com/ontology/ontocompchem/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🆘 Getting Help

- **Issues**: [GitHub Issues](https://github.com/your-org/plugin-gaussian-kg/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/plugin-gaussian-kg/discussions)
- **Discord**: [Bio x AI Hackathon Discord](https://discord.gg/bioai)
- **Eliza OS Community**: [Discord](https://discord.gg/elizaos) 