# GRAPHSHOP OS: Quick Installation Guide
## One-Command Setup for All Professional Skills

---

## 🚀 Quick Install

Run this single command to install all OpenCode professional skills:

```bash
curl -fsSL https://raw.githubusercontent.com/GRAPHSHOP-OS/skills/main/setup_opencode_skills.sh | bash
```

---

## 📁 What Gets Installed

### 🤖 AI Development Tools
- **OpenHands** - AI-driven development assistant
- **TabbyML** - Self-hosted AI coding assistant  
- **Claude Code Configs** - Battle-tested configurations

### 🛠️ Developer Tools
- **IT-Tools** - Developer productivity suite
- **Puppeteer** - Browser automation
- **Bruno** - API testing IDE

### 🎨 UI/UX Resources
- **Complete UI/UX Library** - 50,000+ resources
- **Design System** - GRAPHSHOP OS component library
- **Icon Collections** - Professional icon sets

### 📊 API Development
- **Hoppscotch** - API development ecosystem
- **PostgreSQL** - Database integration tools

---

## 📂 Installation Structure

```
~/graphshop-skills/
├── ai-tools/
│   ├── openhands/          # AI development assistant
│   ├── tabby/             # Self-hosted AI coding
│   └── claude-configs/     # Claude configurations
├── dev-tools/
│   ├── it-tools/          # Productivity suite
│   ├── puppeteer/          # Browser automation
│   └── bruno/             # API testing
├── ui-resources/
│   └── ui-ux-library/     # Complete design resources
├── api-tools/
│   └── hoppscotch/        # API development
└── launch-*.sh            # Quick launchers
```

---

## 🎯 After Installation

### 1. Launch Tools
```bash
# AI Assistant
~/graphshop-skills/launch-openhands.sh

# Developer Tools
~/graphshop-skills/launch-it-tools.sh

# API Testing
~/graphshop-skills/launch-hoppscotch.sh
```

### 2. Configure IDE Integration
```bash
# VS Code - Install extensions
code --install-extension ms-python.python
code --install-extension ms-vscode.cpptools
code --install-extension bradlc.vscode-tailwindcss

# TabbyML - Configure
# Open: http://localhost:8080
# Follow setup wizard for GRAPHSHOP OS
```

### 3. Set Up Claude Code
```bash
# Verify configurations
ls ~/.config/claude-code/

# Test with Claude Code
claude-code --version
```

---

## 🔧 Prerequisites Check

### Required Dependencies
```bash
# Check versions
python3 --version    # Should be 3.8+
node --version       # Should be 16+
npm --version        # Should be 8+
docker --version     # Should be 20+

# Install if missing
# Python
brew install python3

# Node.js
brew install node

# Docker
brew install docker docker-compose
```

### System Requirements
- **RAM**: 8GB+ (16GB recommended for AI tools)
- **Storage**: 10GB free space
- **OS**: macOS 10.15+, Ubuntu 20.04+, Windows 10+

---

## 🎨 GRAPHSHOP OS UI Setup

### Install Design System
```bash
# Clone UI components
git clone https://github.com/GRAPHSHOP-OS/ui-components.git
cd ui-components

# Install dependencies
npm install

# Start development server
npm run dev
```

### Configure Theme
```css
/* Add to your CSS variables */
:root {
  --graphshop-primary: #0D0D12;
  --graphshop-accent: #00D4FF;
  --graphshop-secondary: #9333EA;
  --graphshop-success: #10B981;
}
```

---

## 📊 Development Workflow

### Daily Development
1. **Start AI Assistant**: `~/graphshop-skills/launch-openhands.sh`
2. **Open API Tools**: `~/graphshop-skills/launch-hoppscotch.sh`
3. **Launch Dev Tools**: `~/graphshop-skills/launch-it-tools.sh`
4. **Code with TabbyML**: Configure in IDE settings

### Project Structure for GRAPHSHOP OS
```
my-graphshop-project/
├── components/
│   ├── ui/              # UI components from library
│   ├── pos/              # POS specific components
│   └── shared/          # Shared utilities
├── styles/
│   ├── tokens.css        # Design tokens
│   ├── components.css    # Component styles
│   └── utilities.css    # Utility classes
├── services/
│   ├── api.ts           # API integrations
│   ├── ai.ts            # AI service calls
│   └── database.ts      # Database connections
└── types/
    ├── product.ts        # Product types
    ├── sale.ts          # Sale types
    └── user.ts          # User types
```

---

## 🔍 Troubleshooting

### Common Issues & Solutions

#### Python/AI Tools Issues
```bash
# Issue: Command not found: python3
Solution: 
brew install python3
echo 'export PATH="/usr/local/opt/python/libexec/bin:$PATH"' >> ~/.zshrc

# Issue: pip install fails
Solution:
python3 -m pip install --upgrade pip
pip3 install -r requirements.txt --user
```

#### Node.js Dependencies
```bash
# Issue: npm command not found
Solution:
brew install node
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.zshrc

# Issue: Permission denied
Solution:
npm config set prefix ~/.npm-global
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
```

#### Docker Issues
```bash
# Issue: Docker daemon not running
Solution:
open /Applications/Docker.app

# Issue: Permission denied
Solution:
sudo usermod -aG docker $USER
newgrp docker
```

#### Port Conflicts
```bash
# Check what's running on ports
lsof -i :8080
lsof -i :3000

# Kill processes
kill -9 <PID>
```

---

## 📈 Performance Tips

### Optimize AI Tools
```yaml
# TabbyML configuration for best performance
model:
  device: "mps"  # Apple Silicon
  # device: "cuda"  # NVIDIA
  # device: "cpu"   # fallback
  
inference:
  max_tokens: 1024
  batch_size: 1
  temperature: 0.3
```

### Speed Up Development
```bash
# Use local package registry
npm config set registry https://registry.npmjs.org/

# Enable npm cache
npm config set cache ~/.npm-cache

# Use parallel installations
npm install --parallel
```

---

## 🎯 Next Steps

### Day 1: Setup
- [ ] Run installation script
- [ ] Verify all tools launch correctly
- [ ] Configure IDE integrations
- [ ] Test basic workflows

### Week 1: Learn
- [ ] Complete AI tool tutorials
- [ ] Explore UI/UX resources
- [ ] Build first GRAPHSHOP component
- [ ] Set up API testing workflows

### Month 1: Integrate
- [ ] Customize AI prompts for retail
- [ ] Create custom UI components
- [ ] Build automated workflows
- [ ] Optimize development environment

---

## 📚 Documentation & Resources

### Quick Links
- **Main Guide**: [OPENCODE_SKILLS_GUIDE.md](./OPENCODE_SKILLS_GUIDE.md)
- **UI/UX Skills**: [UI_UX_PROFESSIONAL_SKILLS.md](./UI_UX_PROFESSIONAL_SKILLS.md)
- **Markdown Mastery**: [MARKDOWN_MASTERY_GUIDE.md](./MARKDOWN_MASTERY_GUIDE.md)
- **Quick Reference**: [QUICK_REFERENCE_CARD.md](./QUICK_REFERENCE_CARD.md)

### Community Support
- **GitHub Discussions**: [github.com/GRAPHSHOP-OS/skills/discussions](https://github.com/GRAPHSHOP-OS/skills/discussions)
- **Discord Community**: [discord.gg/graphshop](https://discord.gg/graphshop)
- **Documentation**: [docs.graphshop.com](https://docs.graphshop.com)

---

## 🎉 Installation Complete!

You now have access to:
- 🤖 **3 AI Development Tools**
- 🛠️ **3 Professional Developer Tools**  
- 🎨 **50,000+ UI/UX Resources**
- 📊 **Complete API Development Suite**

**Total Tools Installed**: 6+ professional tools  
**Total Skills Available**: 100+ development capabilities  
**Time Saved**: 10+ hours per week  

---

*Need help? Check the full guides or join our community!*