#!/bin/bash

# GRAPHSHOP OS OpenCode Skills Setup Script
# This script installs all recommended tools and resources

set -e

echo "🚀 Setting up OpenCode Skills for GRAPHSHOP OS..."

# Create directories
mkdir -p ~/graphshop-skills/{ai-tools,dev-tools,ui-resources,api-tools}
mkdir -p ~/.config/claude-code

# AI Tools
echo "🤖 Installing AI Development Tools..."

# OpenHands
echo "📥 Cloning OpenHands..."
git clone https://github.com/OpenHands/OpenHands.git ~/graphshop-skills/ai-tools/openhands
cd ~/graphshop-skills/ai-tools/openhands
pip install -r requirements.txt 2>/dev/null || echo "⚠️  Python/pip required for OpenHands"

# TabbyML
echo "📥 Cloning TabbyML..."
git clone https://github.com/TabbyML/tabby.git ~/graphshop-skills/ai-tools/tabby

# Claude Code Configs
echo "📥 Cloning Claude Code configurations..."
git clone https://github.com/affaan-m/everything-claude-code.git ~/graphshop-skills/ai-tools/claude-configs
cp -r ~/graphshop-skills/ai-tools/claude-configs/configs/* ~/.config/claude-code/ 2>/dev/null || true
cp -r ~/graphshop-skills/ai-tools/claude-configs/skills/* ~/.config/claude-code/skills/ 2>/dev/null || true

# Developer Tools
echo "🛠️ Installing Developer Tools..."

# IT-Tools
echo "📥 Cloning IT-Tools..."
git clone https://github.com/CorentinTh/it-tools.git ~/graphshop-skills/dev-tools/it-tools
cd ~/graphshop-skills/dev-tools/it-tools
npm install 2>/dev/null || echo "⚠️  Node.js/npm required for IT-Tools"

# Puppeteer
echo "📥 Installing Puppeteer..."
cd ~/graphshop-skills/dev-tools
npm init -y
npm install puppeteer 2>/dev/null || echo "⚠️  Failed to install Puppeteer"

# Bruno
echo "📥 Cloning Bruno..."
git clone https://github.com/usebruno/bruno.git ~/graphshop-skills/dev-tools/bruno

# UI/UX Resources
echo "🎨 Installing UI/UX Resources..."
git clone https://github.com/anupam-kumar-krishnan/UI-UX-Resources.git ~/graphshop-skills/ui-resources/ui-ux-library

# API Tools
echo "📊 Installing API Tools..."
git clone https://github.com/hoppscotch/hoppscotch.git ~/graphshop-skills/api-tools/hoppscotch

# Create launcher scripts
echo "📜 Creating launcher scripts..."

# OpenHands launcher
cat > ~/graphshop-skills/launch-openhands.sh << 'EOF'
#!/bin/bash
cd ~/graphshop-skills/ai-tools/openhands
python main.py "$@"
EOF
chmod +x ~/graphshop-skills/launch-openhands.sh

# IT-Tools launcher
cat > ~/graphshop-skills/launch-it-tools.sh << 'EOF'
#!/bin/bash
cd ~/graphshop-skills/dev-tools/it-tools
npm run dev
EOF
chmod +x ~/graphshop-skills/launch-it-tools.sh

# Hoppscotch launcher
cat > ~/graphshop-skills/launch-hoppscotch.sh << 'EOF'
#!/bin/bash
cd ~/graphshop-skills/api-tools/hoppscotch
npm run dev
EOF
chmod +x ~/graphshop-skills/launch-hoppscotch.sh

echo "✅ OpenCode Skills installation complete!"
echo ""
echo "📁 Tools installed in: ~/graphshop-skills/"
echo "🚀 Launchers available:"
echo "  • ~/graphshop-skills/launch-openhands.sh"
echo "  • ~/graphshop-skills/launch-it-tools.sh"
echo "  • ~/graphshop-skills/launch-hoppscotch.sh"
echo ""
echo "📚 UI/UX Resources: ~/graphshop-skills/ui-resources/ui-ux-library/"
echo "🤖 Claude Configs: ~/.config/claude-code/"
echo ""
echo "🔧 Don't forget to install dependencies:"
echo "  • Python 3.8+ and pip for AI tools"
echo "  • Node.js 16+ and npm for web tools"
echo "  • Docker for containerized deployment"