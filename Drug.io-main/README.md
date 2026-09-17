<div align="center">

  <!-- Title -->
  <h1 style="font-size: 10em;">Drug.io: AI-Driven Drug Discovery Platform</h1>
  <h3>Integrated Ecosystem for Target Identification, ADMET Profiling & Therapy Optimization</h3>

  <!-- Logo -->
  <img width="200" height="200" alt="ADMET-X Logo" src="https://github.com/user-attachments/assets/5fe01a51-fec8-441e-a973-11cfdee642a1"/>


  <!-- Badges -->
  <p>
    <a href="https://admet-x.vercel.app/"><img src="https://img.shields.io/badge/Live-Demo-green" alt="LIVE DEMO"></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
    <a href="https://www.python.org/"><img src="https://img.shields.io/badge/Python-3.12-blue.svg" alt="Python"></a>
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-18.2.0-blue.svg" alt="React"></a>
    <a href="https://pytorch.org/"><img src="https://img.shields.io/badge/PyTorch-Deep_Learning-red.svg" alt="PyTorch"></a>
    <a href="https://streamlit.io/"><img src="https://img.shields.io/badge/Streamlit-Dashboard-FF4B4B.svg" alt="Streamlit"></a>
    <a href="https://www.docker.com/"><img src="https://img.shields.io/badge/Docker-Container-blue.svg" alt="Docker"></a>
    <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-Database-green.svg" alt="MongoDB"></a>
  </p>

</div>

**Drug.io** is a comprehensive, AI-powered ecosystem designed to accelerate the early stages of drug discovery. It unifies three cutting-edge modules to provide a holistic analysis of drug candidates:

1.  **ADMET-X**: Evaluates safety and pharmacokinetics.
2.  **Target-Net**: Predicts drug-target interactions (DTI).
3.  **Synergy-GNN**: Identifies optimizing drug combinations for cancer therapy.
4.  **Central Hub**: Orchestrates services with Authentication, User Management, and Work Tracking.

---

## 🚀 Unified Workflow & Architecture

The project is structured as a suite of specialized micro-services/applications that can work independently or together.

### **1. ADMET-X (Pharmacokinetics & Safefty)**
*Located in: `/Drug.io-main`*

A robust platform for predicting **Absorption, Distribution, Metabolism, Excretion, and Toxicity** properties.
*   **Input**: SMILES String (Text/File/Draw).
*   **Output**: 30+ ADMET properties, Radar Plots, Toxicity Alerts.
*   **Tech**: React (Frontend), Flask (Backend), RDKit, Scikit-learn.

### **2. Target-Net (Drug-Target Interaction)**
*Located in: `/AI Drug`*

A Deep Learning module designed to identify potential protein targets for a given small molecule.
*   **Input**: Drug SMILES + Protein Sequence (FASTA).
*   **Output**: Interaction Probability/Affinity Score.
*   **Tech**: Flask API, PyTorch, Drug-Target Neural Network.

### **3. Synergy-GNN (Combination Therapy)**
*Located in: `/Drug-Combination-Prediction`*

A Graph Neural Network (GNN) based engine for predicting the synergistic effects of drug pairs, specifically tailored for oncology.
*   **Input**: Pair of Drug SMILES + Cancer Cell Line Data.
*   **Output**: Synergy Score, Side Effect Risk Assessment (Hepatotoxicity, Cardiotoxicity, etc.).
*   **Tech**: Streamlit Dashboard, PyTorch Geometric (GNN).

### **4. Central Backend Service (New)**
*Located in: `/Drug.io-main/central-backend`*

The gateway service providing authentication and persistence.
*   **Authentication**: JWT-based Auth with Roles (Admin, Researcher, Pharmacologist).
*   **User Management**: Admin-controlled user creation.
*   **Work Tracking**: Records all queries and results; tracks frequent drugs.
*   **Safety**: Database of safer drug combinations (Pharmacologist curated).
*   **Orchestration**: Proxies requests to ADMET-X, Target-Net, and Synergy using a unified API.
*   **Tech**: Flask, MongoDB, PyMongo, PyJWT, Bcrypt.

---

## 🏗 End-to-End Workflow

1.  **Login**: Access the dashboard via secure login `(Default Admin: admin@drug.io / admin123)`.
2.  **Target Screening**: Use **Target-Net** to confirm your candidate molecule binds to the desired disease target.
3.  **Safety Profiling**: Submit the candidate to **ADMET-X** to ensure it has drug-like properties (Lipinski's Rule), good bioavailability, and low toxicity.
4.  **Therapy Optimization**: Run **Synergy-GNN** to find existing drugs that could be combined with your candidate to enhance efficacy and reduce resistance.
5.  **Tracking**: All your attempts are saved in your **Work History**.

---

## 💡 Key Features

### **ADMET-X**
- **SMILES Input Options**: Text, CSV/TXT upload, interactive drawing.
- **Comprehensive Predictions**: Bioavailability, BBB Penetration, CYP450 Inhibition, hERG Toxicity, LD50, etc.
- **Interactive Visualization**: Molecular structures and dynamic radar plots.

### **Central Backend Features**
- **Role-Based Access Control**: Secure endpoints for Admins, Researchers, and Pharmacologists.
- **Work History**: Persistent history of all drug queries.
- **Safer Combinations**: A curated knowledge base of safe drug pairs.
- **Dashboard**: Centralized view of all activities.

---

##  Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS, Framer Motion, Streamlit.
- **Backend**: Python, Flask, FastAPI (optional).
- **Database**: MongoDB (Persistence).
- **AI/ML**: PyTorch, PyTorch Geometric, Scikit-learn, Joblib.
- **Cheminformatics**: RDKit.
- **Infrastructure**: Docker, Fly.io, Vercel.

---

## ⚙️ Quick Start Guide (Run Everything)

To get the full system running, you need to start 4 terminals.

### **Step 1: Configure MongoDB Atlas**
1.  **Configure Environment**:
    - Navigate to `central-backend`.
    - Rename `.env.example` to `.env` (if you haven't already).
    - Open `.env` and add your **MongoDB Atlas Connection String**:
      ```env
      MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/drug_io_db?retryWrites=true&w=majority
      ```
2.  **No Local Database Needed**: The application now connects directly to the cloud.

### **Step 2. Start Central Backend (Auth & Gateway)**
```bash
cd Drug.io-main/central-backend
pip install -r requirements.txt
python seed.py   # Run only once to create admin user
python app.py
# Runs on: http://localhost:5000
```

### **Step 3. Start ADMET-X Service**
```bash
cd Drug.io-main/BackEnd
# Recommended: Use a virtual environment
pip install -r requirements.txt
python app.py
# Runs on: http://localhost:8080
```

### **Step 4. Start Frontend**
```bash
cd Drug.io-main/FrontEnd
npm install
npm run dev
# Runs on: http://localhost:5173
```

### **Step 5. Access the App**
Open browser to `http://localhost:5173`.
*   **Login**: `admin@drug.io`
*   **Password**: `admin123`

---

## 🧪 Running Other Modules

### **Target-Net (DTI)**
```bash
cd AI\ Drug
pip install -r requirements.txt
python app.py  # Runs on http://127.0.0.1:5002
```

### **Synergy-GNN**
```bash
cd Drug-Combination-Prediction-main
pip install -r requirements.txt
streamlit run app.py  # Runs on http://127.0.0.1:8501
```

---

## 📊 Datasets

- **TDC (Therapeutics Data Commons)**: Used for training ADMET and DTI models.
- **PubChem**: Source for bulk chemical properties.
- **DrugComb**: Dataset for drug synergy scores.

---

## 🤝 Project Structure
```bash
harshi/
├── Drug.io-main/                 # Main ADMET Platform (React + Flask)
│   ├── central-backend/          # [NEW] Central Gateway & Auth (Flask + Mongo)
│   ├── BackEnd/                  # ADMET-X Service
│   └── FrontEnd/                 # React Frontend (Enhanced)
├── AI Drug/                      # Drug-Target Interaction (Flask + PyTorch)
└── Drug-Combination-Prediction/  # Synergy Prediction (Streamlit + GNN)
```
