#!/bin/bash

# Gaussian Knowledge Graph Plugin Setup Script
# Bio x AI Hackathon - Eliza OS Compatible

set -e

echo "🧪 Setting up Gaussian Knowledge Graph Plugin for Eliza OS..."
echo "============================================================="

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js version (Eliza requires 23+)
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 23+ and try again."
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 23 ]; then
    echo "❌ Node.js version 23+ is required for Eliza OS. Current version: $(node --version)"
    echo "💡 Install using: nvm install 23 && nvm use 23"
    exit 1
fi
echo "✅ Node.js $(node --version) found"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📦 pnpm not found. Installing pnpm..."
    npm install -g pnpm
    
    if ! command -v pnpm &> /dev/null; then
        echo "❌ Failed to install pnpm. Please install manually and try again."
        exit 1
    fi
fi
echo "✅ pnpm $(pnpm --version) found"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ and try again."
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1-2)
echo "✅ Python $PYTHON_VERSION found"

# Check Poetry
if ! command -v poetry &> /dev/null; then
    echo "📦 Poetry not found. Installing Poetry..."
    curl -sSL https://install.python-poetry.org | python3 -
    export PATH="$HOME/.local/bin:$PATH"
    
    if ! command -v poetry &> /dev/null; then
        echo "❌ Failed to install Poetry. Please install manually and try again."
        exit 1
    fi
fi
echo "✅ Poetry $(poetry --version | cut -d' ' -f3) found"

# Install Node.js dependencies with pnpm
echo ""
echo "📦 Installing Node.js dependencies with pnpm..."
pnpm install

# Install Python dependencies
echo ""
echo "🐍 Installing Python dependencies..."
cd py
poetry install
cd ..

# Build TypeScript
echo ""
echo "🔨 Building TypeScript plugin..."
pnpm build

echo ""
echo "🧪 Running tests to verify setup..."
echo "Testing TypeScript..."
pnpm test

echo ""
echo "Testing Python..."
cd py
poetry run pytest -v
cd ..

# Create sample test data directory
echo ""
echo "📁 Creating test data directory..."
mkdir -p tests/data

# Create a sample Gaussian log file for testing
cat > tests/data/sample_methane.log << 'EOF'
 Entering Gaussian System, Link 0=g16
 %mem=1GB
 %nprocshared=4
 Will use up to    4 processors via shared memory.
 
 # B3LYP/6-31G(d) opt freq
 
 Methane optimization
 
 0 1
 C      0.000000    0.000000    0.000000
 H      1.089000    0.000000    0.000000
 H     -0.363000    1.026719    0.000000
 H     -0.363000   -0.513360   -0.889165
 H     -0.363000   -0.513360    0.889165
 
 SCF Done:  E(RB3LYP) =    -40.5180970716     A.U. after    8 cycles
 
 Frequencies --     1000.0000  1200.0000  1400.0000
 
 Normal termination of Gaussian 16 at Wed Oct 25 12:00:00 2023.
EOF

echo "✅ Created sample test file: tests/data/sample_methane.log"

# Test the Python parser with sample data
echo ""
echo "🧪 Testing Python parser with sample data..."
cd py
poetry run python parse_gaussian.py ../tests/data/sample_methane.log '{"filename": "methane_test.log", "software_version": "16.C.01"}' --format turtle > ../tests/data/sample_output.ttl
echo "✅ Generated sample RDF output: tests/data/sample_output.ttl"
cd ..

# Display next steps
echo ""
echo "🎉 Setup completed successfully!"
echo "============================================================="
echo ""
echo "📚 Next steps for Eliza OS integration:"
echo ""
echo "1. 📖 Read the documentation:"
echo "   - Main README: ./README.md"
echo "   - Python README: ./py/README.md"
echo "   - Character file: ./characters/gaussian-scientist.character.json"
echo ""
echo "2. 🚀 Add to your Eliza project as a submodule:"
echo "   cd /path/to/your/eliza/project"
echo "   git submodule add https://github.com/your-org/plugin-gaussian-kg.git packages/plugin-gaussian-kg"
echo "   cd packages/plugin-gaussian-kg"
echo "   pnpm install"
echo "   pnpm build"
echo ""
echo "3. 📝 Update the plugin package name in package.json:"
echo "   Change name to: @elizaos-plugins/plugin-gaussian-kg"
echo ""
echo "4. 🔗 Add to your agent's package.json:"
echo "   pnpm add @elizaos-plugins/plugin-gaussian-kg@'workspace:*' --filter ./agent"
echo ""
echo "5. 🤖 Configure your character to use the plugin:"
echo "   Add \"@elizaos-plugins/plugin-gaussian-kg\" to plugins array in character.json"
echo ""
echo "6. ▶️ Run your Eliza agent:"
echo "   pnpm start --character=characters/gaussian-scientist.character.json"
echo ""
echo "7. 🧪 Test the plugin:"
echo "   cd py"
echo "   poetry run python parse_gaussian.py ../tests/data/sample_methane.log '{}'"
echo ""
echo "8. 🔍 Explore the sample output:"
echo "   cat tests/data/sample_output.ttl"
echo ""
echo "📖 Plugin Development:"
echo "• Actions: Parse Gaussian files, Query knowledge graph"
echo "• Services: Gaussian parser service"
echo "• Character: Dr. Gaussian - quantum chemistry expert"
echo ""
echo "🐛 Need help? Check the troubleshooting section in README.md"
echo "💬 Join the Bio x AI Hackathon Discord for support"
echo "📚 Eliza OS docs: https://eliza.how/docs/"
echo ""
echo "Happy hacking! 🧬🤖" 