
# 🦊 **BudgetFox – AI Personal Finance Manager**

**Smart Money. Smarter You.**
A complete AI-powered personal finance app with **Virtual E-ATM Card, PayLater, EMI, AI Credit Score, Fraud Detection, OCR Receipt Scanner, and Foxy AI Assistant**.

---

# 🌟 **Overview**

**BudgetFox** is a modern and intelligent personal finance ecosystem designed for **students and young adults**.
It combines **FinTech + AI + ML + Virtual Wallets** to help users:

* Track expenses
* Manage budgets
* Use a simulated Virtual E-ATM card
* Access Pay-Later credit
* Convert bills into EMI
* Analyze spending behaviour
* Detect fraud
* Get AI-powered coaching

This repo contains **frontend, backend, ML models, APIs, database schema, and documentation** for the full-stack BudgetFox system.

---

# 🚀 **Key Features**

## 🧾 **1. Smart Expense Manager**

* Add expenses manually
* Scan receipts using **OCR**
* Auto-extract amount, merchant, date
* Auto-categorize using ML
* Import UPI/Bank statements (CSV/PDF)
* Daily/Weekly/Monthly insights

---

## 💳 **2. Multi-Wallet System**

* **Cash Wallet**
* **E-ATM Virtual Card Wallet**
* **PayLater Wallet**
* **Rewards Wallet**
  Each wallet has balance, transaction ledger, and spending rules.

---

## 🟧 **3. E-ATM Virtual Card**

Simulated virtual debit card with:

* Masked card number
* Expiry, CVV (hidden)
* Spend limits
* Freeze / Unfreeze
* Real-time balance deduction

---

## 🟩 **4. PayLater (BNPL System)**

* AI-powered eligibility
* Student-friendly micro-credit (₹500–₹5,000)
* Auto repayment
* Overdue penalty system
* PayLater dashboard
* Activity log

---

## 🧮 **5. EMI Bill Converter**

* Convert any purchase into EMI
* Tenure: 3 / 6 / 9 months
* EMI schedule generation
* Auto monthly deduction
* Missed payment penalties

---

## 🧠 **6. AI / ML Modules**

* **Expense Categorizer (NLP)**
* **Budget Predictor**
* **Credit Score Model (300–900)**
* **Fraud Detection (Anomaly ML)**
* **Habit Analyzer (Clustering: KMeans)**

---

## 🤖 **7. Foxy AI – In-App Chat Assistant**

Your personal finance coach:

* Shows wallet balances
* Helps apply PayLater
* Converts EMI
* Warns about fraud
* Sends saving tips
* Explains credit score
* Suggests budgets
* Gives spending analysis

---

## 🔔 **8. Subscription Tracker**

Track OTT & recurring payments:

* Netflix, Hotstar, Prime, Spotify
* College fees, recharge, cloud storage
* Renewal reminders
* AI prediction of next billing date

---

## 🛡 **9. Fraud Detection Engine**

* Suspicious transactions
* Unusual timing
* Location mismatch
* Merchant analysis
* Auto-freeze card workflow

---

## 📊 **10. Admin Dashboard**

* User management
* Fraud monitoring
* PayLater limit control
* Transaction insights
* AI model monitoring
* Reports & downloads

---

# 🏗 **Project Architecture**

```
BudgetFox/
│── mobile-app/            # React Native / Flutter
│── backend-api/           # FastAPI / Node.js
│── ml-engine/             # ML models (Python)
│── admin-dashboard/       # React admin panel
│── database/              # SQL schema + migrations
│── storage/               # Receipt images, logs
│── docs/                  # Project report, PPT, diagrams
│── README.md              # Project documentation
```

---

# 🛠 **Tech Stack**

### **Frontend**

* React Native (or Flutter)
* Redux / Zustand state management
* Tailwind / Styled Components
* Camera & Media APIs

### **Backend**

* FastAPI (Python) OR Node.js (Express/NestJS)
* JWT Authentication
* Redis (cache)
* Celery/RQ for scheduled jobs

### **Database**

* PostgreSQL
* Supabase / AWS S3 (file storage)

### **ML / AI**

* Python
* Scikit-Learn
* LightGBM
* Tesseract OCR
* Sentence Transformers
* FastAPI ML inference service

---

# 🗄 **Database Schema (Summary)**

### Tables Included:

* users
* wallets
* virtual_cards
* transactions
* paylater_accounts
* emi_plans
* emi_repayments
* subscriptions
* fraud_alerts
* budgets
* ai_credit_score
* chat_logs
* audit_logs

Detailed SQL available in `/database/schema.sql`.

---

# 🔌 **API Endpoints (Summary)**

### **Auth**

```
POST /auth/signup
POST /auth/login
```

### **Expense**

```
POST /expense/add
POST /expense/scan-receipt
GET  /expense/list
```

### **Wallets & Virtual Card**

```
GET  /wallets
POST /wallets/topup
POST /virtual-card/create
POST /virtual-card/freeze
```

### **PayLater**

```
POST /paylater/apply
GET  /paylater/status
POST /paylater/repay
```

### **EMI**

```
POST /emi/convert
GET  /emi/list
POST /emi/pay
```

### **Subscriptions**

```
POST /subscription/add
GET  /subscription/list
```

### **Foxy AI**

```
POST /ai/chat
POST /ai/analyze
```

Full API documentation available in `/docs/api.md`.

---

# 📱 **Screens Included**

* Splash Screen
* Sign Up / Login
* Dashboard
* Add Expense
* Receipt Scanner
* Analytics Page
* Virtual Card
* PayLater Screen
* EMI Screen
* Subscriptions
* Foxy AI Chat
* Settings

---

# 📦 **Installation**

### **1. Clone Repo**

```
git clone https://github.com/yourusername/budgetfox.git
cd budgetfox
```

### **2. Set up Backend**

```
cd backend-api
pip install -r requirements.txt
uvicorn main:app --reload
```

### **3. Set up Mobile App**

```
cd mobile-app
npm install
npm start
```

### **4. ML Engine**

```
cd ml-engine
pip install -r requirements.txt
python serve.py
```

---

# 🧪 **Testing**

* Unit tests for backend
* Integration tests for PayLater & EMI
* OCR accuracy tests
* ML performance evaluation
* Fraud false-positive checks

Run tests:

```
pytest
```

---

# 📜 **Project Deliverables**

* Full App Source Code
* Database Schema
* Machine Learning Models
* Admin Dashboard
* API Documentation
* Project Report (80 pages)
* UML Diagrams
* PPT Slides
* Branding Kit (Logo, Colors, Icons)

---

# 🤝 **Contributing**

PRs and feature suggestions are welcome.
Follow standard Git guidelines and naming conventions.

---

# ⚠️ **Important Notice**

BudgetFox is a **student FinTech simulation**.
**No real money, no real UPI, no real banking integration.
All financial operations are simulated for academic use.**

---

# ⭐ **License**

MIT License

---

# 🦊 **Author**

**Prakash Ramakrishnan**
Saakra Enterprises Pvt. Ltd
2025

---

