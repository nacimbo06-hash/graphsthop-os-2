# 🧠 ASGARD — Local-First AI Integration Strategy
## From Cloud Dependency to On-Device Intelligence for Algerian Retail

> **Date**: February 10, 2026  
> **Context**: Analysis of "Demystifying Local AI" principles applied to ASGARD UNIFIED  
> **Goal**: Integrate local AI/ML capabilities into the existing Tauri + React desktop POS app

---

## 1. What Already Exists (Honest Audit)

### ✅ Current AI Layer — `forecastingService.ts` (479 lines)

The app already has a **pure-algorithmic intelligence layer** with:

| Component | What It Does | Limitation |
|:---|:---|:---|
| `ForecastingEngine` | Demand forecasting with Algerian calendar multipliers (Ramadan ×4.2 dates, Friday couscous ×2.5, salary period ×1.15) | Uses **mock historical data** (`generateMockHistory()` = random numbers) |
| `AnomalyDetector` | Z-score based spike/drop detection on sales data | Requires 7+ days of real sales data to function |
| `InsightsGenerator` | Calendar-aware daily insights (upcoming Ramadan, Friday prep, salary periods) | Returns **zero forecasts** when no real data exists |
| Algerian Calendar | Ramadan, Eid el-Fitr, Eid el-Adha, Date Harvest, Olive Harvest, Back to School | Hardcoded 2024 dates — **needs yearly updating** |

**First Principles Verdict**: The *algorithmic bones* are solid and Algeria-specific. But the engine runs on **fake data**. The #1 priority is feeding it REAL sales history from the SQLite database. An LLM layer amplifies value only AFTER real data flows through the pipeline.

---

## 2. The Two-Layer AI Architecture

Applying the local-first text to ASGARD, the optimal architecture has **two distinct AI layers**:

```
┌──────────────────────────────────────────────────────────┐
│                    ASGARD DESKTOP OS                      │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │             LAYER 1: ALGORITHMIC AI                │  │
│  │            (Runs always, zero latency)             │  │
│  │                                                    │  │
│  │  • Demand Forecasting (moving avg + multipliers)   │  │
│  │  • Anomaly Detection (Z-score)                     │  │
│  │  • Reorder Suggestions (stock × forecast)          │  │
│  │  • Expiry Risk Scoring (FEFO)                      │  │
│  │  • Margin Analysis (cost vs selling price)         │  │
│  │  • Seasonal Pattern Recognition                    │  │
│  │                                                    │  │
│  │  DATA SOURCE: SQLite ← Real sales/stock history    │  │
│  └────────────────────────────────────────────────────┘  │
│                         ↓ feeds                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │            LAYER 2: LOCAL LLM (Ollama)             │  │
│  │           (Runs on-demand, needs GPU)              │  │
│  │                                                    │  │
│  │  • Natural Language Reports ("How was my week?")   │  │
│  │  • Conversational Analytics ("Why did milk drop?") │  │
│  │  • Smart Action Suggestions (context-aware)        │  │
│  │  • Product Description Generator                   │  │
│  │  • Anomaly Explanation (human-readable)            │  │
│  │                                                    │  │
│  │  RUNTIME: Ollama sidecar → Llama 3.2 3B (Q4)      │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─────────────────────┐  ┌───────────────────────────┐  │
│  │   Tauri Rust Core   │  │    React 19 Frontend      │  │
│  │   • Ollama IPC      │  │    • AI Insights Panel    │  │
│  │   • SQLite queries  │  │    • Chat Interface       │  │
│  │   • Model manager   │  │    • Forecast Charts      │  │
│  └─────────────────────┘  └───────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### Why Two Layers?

| | Layer 1: Algorithmic | Layer 2: Local LLM |
|:---|:---|:---|
| **Speed** | <1ms per query | 2-10s per response |
| **Hardware** | Any CPU | Needs GPU (6GB VRAM+) |
| **Reliability** | 100% deterministic | Probabilistic, may hallucinate |
| **Offline** | Always works | Always works (local) |
| **Use case** | Numbers, predictions, alerts | Explanations, reports, conversations |

> **Key insight from the text**: "Local-first avoids the 'Technological Cliff' of cloud-centric models." Both layers run 100% offline — no API costs, no latency, no data leaving the machine.

---

## 3. Integration Plan: What To Build, In What Order

### Phase A: Fix the Data Pipeline (PREREQUISITE — from Finalization Roadmap P1)

> *"An AI without real data is just a random number generator."*

Before ANY AI improvement, complete these from the finalization roadmap:

- [ ] **A.1** — Real SQLite schema for `sales`, `sale_items`, `products` (with timestamps, categories)
- [ ] **A.2** — Zustand stores persist TO/FROM SQLite (not localStorage)
- [ ] **A.3** — Every sale writes: `{product_id, quantity, price, category, timestamp}` to the DB

**Once this is done, the existing `ForecastingEngine` immediately starts working with real data instead of mock data.** This alone is a massive upgrade.

---

### Phase B: Upgrade the Algorithmic Layer (Layer 1 — No LLM needed)

> *Maximum intelligence, minimum complexity.*

- [ ] **B.1** — **Connect ForecastingEngine to real SQLite data.**
  Replace `generateMockHistory()` with actual SQLite queries:
  ```sql
  SELECT date(created_at) as day, SUM(quantity) as total
  FROM sale_items 
  WHERE product_id = ? AND created_at > date('now', '-90 days')
  GROUP BY day ORDER BY day
  ```
  
- [ ] **B.2** — **Exponential Moving Average (EMA) over Simple Moving Average.**
  Current: simple average of all history (weights old and new data equally).
  Better: EMA with α=0.3 weights recent sales 3× more than old.
  ```typescript
  // Replace generateMockHistory with:
  private calculateEMA(values: number[], alpha: number = 0.3): number {
    return values.reduce((ema, val) => alpha * val + (1 - alpha) * ema, values[0]);
  }
  ```

- [ ] **B.3** — **Dynamic Algerian calendar (auto-calculate Hijri dates).**
  Replace hardcoded 2024 dates with dynamic Hijri calculation.
  Use the existing `getApproximateHijriMonth()` to auto-detect Ramadan for ANY year.

- [ ] **B.4** — **Add margin analysis to insights.**
  ```typescript
  // New insight type: profitability per category
  interface MarginInsight {
    category: string;
    revenue: number;
    cost: number;
    margin: number;
    trend: 'improving' | 'declining' | 'stable';
    suggestion: string;  // "Raise price on X" or "Negotiate with supplier Y"
  }
  ```

- [ ] **B.5** — **Add ABC analysis for inventory.**
  Classify products: A (top 20% of revenue), B (next 30%), C (bottom 50%).
  Focus reorder alerts on A-items. Suggest delisting low-performing C-items.

- [ ] **B.6** — **Add day-of-week sales patterns.**
  Beyond Friday: detect Sunday dips, Thursday pre-weekend spikes.
  Auto-learn from real data after 4+ weeks of sales.

- [ ] **B.7** — **Reports page powered by real data.**
  Fill the empty `services/reports/` directory with:
  - `dailyReport.ts` — Today's P&L, top sellers, anomalies
  - `weeklyReport.ts` — Week comparison, growth %, top/worst performers
  - `monthlyReport.ts` — Full month overview, margin trends, category breakdown

**Phase B alone gives 80% of the AI value with 0% LLM complexity.**

---

### Phase C: Integrate Local LLM via Ollama (Layer 2)

> *"The Local LLM executes entirely on local hardware. Data never leaves the OS level."*

#### C.1 — Architecture: Ollama as Tauri Sidecar

```
                    ┌─────────────────┐
                    │  React Frontend │
                    │                 │
                    │  "Ask IGO AI"   │
                    │  Chat Panel     │
                    └────────┬────────┘
                             │ Tauri IPC command
                    ┌────────▼────────┐
                    │  Rust Backend   │
                    │                 │
                    │  invoke_ollama()│
                    │  stream_response│
                    └────────┬────────┘
                             │ HTTP localhost:11434
                    ┌────────▼────────┐
                    │  Ollama Process │
                    │  (Sidecar)      │
                    │                 │
                    │  Llama 3.2 3B   │
                    │  (quantized Q4) │
                    │  ~6GB VRAM      │
                    └─────────────────┘
```

**Why Ollama as sidecar, not embedded:**
- Ollama manages model downloading, versioning, and GPU allocation
- Tauri's `shell.Command` sidecar pattern handles process lifecycle
- HTTP API (`:11434`) is simple, stable, and well-documented
- User can also install Ollama independently for other uses

#### C.2 — The Rust Integration Layer

```rust
// src-tauri/src/ai.rs

use tauri::command;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct OllamaRequest {
    model: String,
    prompt: String,
    system: String,
    stream: bool,
}

#[command]
async fn ask_ai(prompt: String, context: String) -> Result<String, String> {
    let system_prompt = format!(
        "Tu es IGO AI, un assistant intelligent pour la gestion de supermarché algérien. \
         Réponds toujours en français. Sois concis et actionnable. \
         Voici les données contextuelles du magasin:\n{}", context
    );
    
    let client = reqwest::Client::new();
    let response = client
        .post("http://localhost:11434/api/generate")
        .json(&OllamaRequest {
            model: "llama3.2:3b".to_string(),
            prompt,
            system: system_prompt,
            stream: false,
        })
        .send()
        .await
        .map_err(|e| format!("Ollama non disponible: {}", e))?;
    
    // Parse and return
    let body: serde_json::Value = response.json().await
        .map_err(|e| format!("Erreur de parsing: {}", e))?;
    
    Ok(body["response"].as_str().unwrap_or("").to_string())
}

#[command]
async fn check_ollama_status() -> Result<bool, String> {
    let client = reqwest::Client::new();
    match client.get("http://localhost:11434/api/tags").send().await {
        Ok(resp) => Ok(resp.status().is_success()),
        Err(_) => Ok(false),
    }
}
```

#### C.3 — The Frontend AI Panel

```
┌─────────────────────────────────────────────┐
│  🧠 IGO AI — Assistant Intelligent          │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ "Comment était ma journée?"         │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  📊 Résumé: Votre journée en bref          │
│  ─────────────────────────────────────      │
│  CA total: 145,000 DA (+12% vs hier)        │
│  Transactions: 83 (moyenne 1,747 DA)        │
│  Top vente: CANDIA Lait UHT 1L (47 unités)  │
│                                             │
│  ⚠️ Attention: Stock de dates < seuil.      │
│  Ramadan est dans 18 jours.                 │
│  → Suggestion: Commander 200 unités.         │
│                                             │
│  ┌────────────┐  ┌─────────────────┐        │
│  │ 💬 Poser   │  │ 📋 Rapport PDF  │        │
│  │ question   │  │                 │        │
│  └────────────┘  └─────────────────┘        │
└─────────────────────────────────────────────┘
```

#### C.4 — Practical LLM Use Cases for Retail

| Use Case | Prompt Pattern | Data Fed to LLM |
|:---|:---|:---|
| **Daily Briefing** | "Summarize today's sales performance" | Day's sales totals, top items, anomalies |
| **Why Analysis** | "Why did [category] sales drop?" | Category trends vs calendar events vs stock levels |
| **Reorder Narrative** | "Write a purchase order email to supplier" | Supplier info + stock levels + forecast needs |
| **Product Description** | "Generate label text for [product]" | Product name + category + price + weight |
| **Price Optimization** | "Should I change the price of [product]?" | Margin data + competitor context + demand elasticity |
| **End-of-Day Report** | "Generate my closing report" | Full day's data: sales, cash, stock movements |

#### C.5 — Graceful Degradation

> **Critical design principle**: The app MUST work perfectly WITHOUT Ollama.

```typescript
// services/ai/localLLMService.ts

class LocalLLMService {
  private available: boolean = false;

  async checkAvailability(): Promise<boolean> {
    try {
      this.available = await invoke<boolean>('check_ollama_status');
    } catch {
      this.available = false;
    }
    return this.available;
  }

  async ask(prompt: string, context: object): Promise<string | null> {
    if (!this.available) return null;  // Silently degrade
    
    try {
      return await invoke<string>('ask_ai', {
        prompt,
        context: JSON.stringify(context)
      });
    } catch {
      return null;  // Never crash the app for AI failures
    }
  }
}
```

The UI shows:
- **Ollama installed + model loaded** → Full AI chat panel with streaming responses
- **Ollama installed but no model** → "Download Llama 3.2 3B (2GB)" button
- **Ollama not found** → Algorithmic insights only + "Install AI Assistant" link to Ollama.com

---

## 4. Hardware Reality Check for Algerian Market

| Typical Algerian  Store PC | Spec | Can Run Layer 1? | Can Run Layer 2? |
|:---|:---|:---|:---|
| Budget Desktop (Core i3, 8GB, no GPU) | No dedicated GPU | ✅ Always | ❌ Too slow |
| Mid-range (Core i5, 16GB, GTX 1650) | 4GB VRAM | ✅ Always | ⚠️ 1B model only |
| Modern (Core i7, 32GB, RTX 3060) | 12GB VRAM | ✅ Always | ✅ 3B model fluent |
| Server PC (Xeon, 64GB, RTX 4090) | 24GB VRAM | ✅ Always | ✅ 7B–13B models |

> **Design Decision**: Layer 1 (algorithmic) is the **core experience** that works on ANY hardware. Layer 2 (LLM) is a **premium enhancement** for users with capable GPUs. The app never degrades when the LLM is absent.

---

## 5. What NOT to Do with Local AI

| Anti-Pattern | Why It Fails |
|:---|:---|
| Use LLM for calculations | LLMs hallucinate numbers. Use SQL + algorithms for math. |
| Bundle the model with the app | +2GB installer size. Let Ollama manage downloading. |
| Require LLM for basic features | Most Algerian store PCs can't run it. Algorithmic = default. |
| Use cloud APIs as backup | Defeats "local-first." If no Ollama, degrade to Layer 1. |
| Train a custom model | Overkill for V1. Llama 3.2 3B with good prompts covers 95% of needs. |
| Build your own inference engine | Ollama already solves this. Don't reinvent the wheel. |

---

## 6. Implementation Priority & Timeline

```
Week 1-3: Phase A (Data Pipeline — from Finalization Roadmap)
    ↓ real data now flows into SQLite
Week 3-4: Phase B.1–B.3 (Connect forecasting to real data)
    ↓ algorithmic AI works on real data
Week 4-5: Phase B.4–B.7 (Margin analysis, ABC, reports)
    ↓ full intelligence dashboard
Week 5-6: Phase C.1–C.2 (Ollama sidecar + Rust IPC)
    ↓ LLM backend ready
Week 6-7: Phase C.3–C.5 (AI chat panel + use cases)
    ↓ conversational AI for premium users
```

| Phase | Effort | Hardware Required | Value Delivered |
|:---|:---|:---|:---|
| **A: Data Pipeline** | 5-7 days | Any | Foundation for everything |
| **B: Algorithmic AI** | 5-7 days | Any | **80% of AI value** |
| **C: Local LLM** | 5-7 days | GPU (optional) | Premium 20% — natural language reports |

---

## 7. Summary: First Principles Applied

The local-first AI text teaches us three truths:

1. **"Data Gravity"** — Process data where it lives. ASGARD's data lives in SQLite. The AI must query SQLite directly, not call external APIs.

2. **"Deterministic > Probabilistic"** for critical operations. Use algorithms (Layer 1) for stock alerts, reorder suggestions, and anomaly detection. Use LLM (Layer 2) only for **explanations and narratives** — never for calculations.

3. **"Graceful degradation is non-negotiable."** The app must be fully functional on a 10-year-old Core i3 with no GPU. The LLM is a bonus, not a requirement.

> **Bottom line**: Fix the data pipeline (Phase A) → the existing `forecastingService.ts` immediately becomes valuable with real data (Phase B) → then add Ollama for natural language superpowers (Phase C). Each phase delivers standalone value. No phase blocks the app from shipping. 🎯
