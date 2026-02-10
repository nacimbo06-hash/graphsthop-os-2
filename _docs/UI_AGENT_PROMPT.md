# UI Agent Master Prompt: Bonilo OS Module Design Generation

---

## 🎯 Your Role
You are a **world-class UI/UX Designer** specializing in "Calm Technology" and retail POS systems. Your task is to design pixel-perfect, production-ready UI screens for **Bonilo OS**, a grocery management platform for neighborhood stores in Algeria. You will be given multiple design inspirations—your job is to **synthesize** them into a single, cohesive, and beautiful design language.

---

## 🧠 Design Philosophy: First Principles

Before designing ANY screen, internalize these rules:

1.  **Calm Over Flashy**: This is NOT a tech startup app. It's a tool for shopkeepers. Use soft colors, ample whitespace, and gentle shadows. Avoid neon, stark contrasts, or aggressive gradients.
2.  **Speed Over Decoration**: Every element must serve the user's goal. If it doesn't help them sell faster or manage stock better, remove it.
3.  **Human Over Machine**: Use warm, rounded shapes. The UI should feel like a helpful neighbor, not a corporate dashboard.
4.  **Consistency is Trust**: Every button, card, and icon must follow the exact same design tokens. No exceptions.

---

## 🎨 Design Tokens (Mandatory)

Use these exact values. Do not deviate.

### Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#FDFBF7` | Main app background (Warm Cream) |
| `--bg-surface` | `#FFFFFF` | Card backgrounds |
| `--primary` | `#3D7C4F` | Buttons, active states, key text (Bonilo Green) |
| `--primary-light` | `#E8F3EC` | Hover states, subtle highlights |
| `--accent` | `#E8A05D` | Warnings, promotions, limited use (Soft Amber) |
| `--text-primary` | `#2C2C2C` | Main body text (Soft Black) |
| `--text-secondary` | `#5A5A5A` | Secondary/muted text |
| `--border` | `rgba(61, 124, 79, 0.1)` | Card borders, dividers |
| `--shadow` | `0 4px 20px rgba(0,0,0,0.05)` | Soft card shadows |

### Typography
- **Font Family**: `Inter` or `Nunito` (Google Fonts, Rounded Sans-Serif)
- **Headings**: Weight 600, sizes 32px / 24px / 18px
- **Body**: Weight 400, size 16px, line-height 1.6
- **Labels**: Weight 500, size 12px, uppercase, letter-spacing 0.1em

### Shapes
- **Card Border Radius**: `20px`
- **Button Border Radius**: `48px` (Pill shape)
- **Input Border Radius**: `12px`

### Effects
- **Glassmorphism**: `background: rgba(255,255,255,0.7); backdrop-filter: blur(20px);`
- **Hover**: `transform: translateY(-2px); box-shadow: 0 8px 24px rgba(61,124,79,0.15);`

---

## 📄 Modules to Design

Generate a complete, self-contained UI screen for each of the following modules. Each screen should be responsive (Desktop-first, 1440px width).

### 1. Dashboard (`/`)
**Purpose**: At-a-glance view of store health.
**Key Elements**:
- 4 Metric Cards (Revenue, Transactions, Avg. Ticket, Alerts)
- Hourly Sales Chart (Area chart, green gradient)
- Category Breakdown (Donut/Pie chart)
- Quick Action Buttons (Large, pill-shaped)
- AI Insights Panel (Glassmorphism card with "Sparkle" icon)

### 2. Point of Sale (`/pos`)
**Purpose**: Lightning-fast checkout.
**Key Elements**:
- Product Grid (Large touchable tiles with emoji + price)
- Cart Panel (Right sidebar, sticky)
- Numpad for quantity
- Payment Modal (Cash, Card, Dahabia, Credit buttons)
- Customer Search Bar

### 3. Inventory (`/inventory`)
**Purpose**: Manage products and stock levels.
**Key Elements**:
- Product Table (Searchable, sortable)
- Quick Edit Modal
- Low Stock Alert Badge (Amber)
- Expiry Date Column with visual indicator
- Bulk Actions Bar

### 4. Circularity / Food Rescue (`/circularity`)
**Purpose**: Convert waste to revenue.
**Key Elements**:
- Surplus Alert Cards (Expiring soon items)
- "Create Surprise Bag" Button (Primary action)
- Active Rescue Panel (List of live bags)
- CO2 Saved / Revenue Rescued Metrics
- QR Code Scanner Button

### 5. AI Copilot (`/copilot`)
**Purpose**: Autonomous store management assistant.
**Key Elements**:
- Morning Briefing Card (AI-generated priorities)
- Pending Actions List (Checkboxes)
- Anomaly Alerts (Spikes/Drops)
- Forecast Chart (7-day prediction)
- "Let Copilot Handle" Toggle

### 6. Treasury (`/treasury`)
**Purpose**: Cash flow and session management.
**Key Elements**:
- Session Status Card (Open/Closed)
- Cash Drawer Balance
- Payment Method Breakdown (Bar chart)
- Z-Report Summary
- Movement History Table

### 7. Settings (`/settings`)
**Purpose**: Configure store preferences.
**Key Elements**:
- Tabbed Navigation (General, POS, Printer, Sync)
- Form Inputs with Labels
- Save Button (Sticky footer)
- Toggle Switches

---

## 🖼️ How to Use Design Inspirations

I will provide you with **[N] reference screenshots**. Follow this process:

1.  **Identify the Strengths**: What makes each reference beautiful? (e.g., spacing, color use, iconography, micro-animations)
2.  **Extract Patterns**: Find common UI patterns (cards, tables, navigation) and note the best implementation.
3.  **Synthesize, Don't Copy**: Combine the best elements into a **new, unified design** that adheres strictly to the Bonilo Design Tokens above. Never copy a reference verbatim.
4.  **Prioritize Calm**: If a reference is too "techy" or "loud," tone it down. Add more whitespace, soften colors, increase border-radius.

---

## ✅ Output Format

For each module, provide:
1.  A **full-screen mockup** (1440x900px or similar desktop resolution).
2.  Annotations pointing out key UI elements.
3.  (Optional) A brief description of any micro-interactions or hover states.

---

## 🚀 Begin

Start with the **Dashboard** screen. Apply the Bonilo Design Tokens. Reference the attached inspirations to inform layout and component choices, but ensure the final result is uniquely "Bonilo."
