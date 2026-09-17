# Drug.io: End-to-End Project Implementation Details

## 1. Project Overview
**Drug.io** is an AI-powered drug discovery ecosystem designed to accelerate early-stage pharmaceutical research. It integrates three core predictive modules into a unified platform, managed by a central gateway service.

### Core Modules:
1.  **ADMET-X**: Predicts Pharmacokinetics (Absorption, Distribution, Metabolism, Excretion) and Toxicity.
2.  **Target-Net**: Identifies Drug-Target Interactions (DTI) using Deep Learning.
3.  **Synergy-GNN**: Predicts synergistic effects of drug combinations for oncology therapy.

---

## 2. System Architecture

The project follows a **Microservices Architecture** with a Central Backend acting as an API Gateway and Orchestrator.

### High-Level Architecture
```mermaid
graph TD
    User[User (Browser)] -->|HTTP/React| Frontend[Frontend (Vite + React)]
    Frontend -->|API Requests| Central[Central Backend (Flask - Port 5000)]
    
    subgraph "Centralized Services"
        Central -->|Auth/User Data| DB[(MongoDB Atlas)]
    end
    
    subgraph "Microservices"
        Central -->|Proxy Request| ADMET[ADMET Service (Flask - Port 8080)]
        Central -->|Proxy Request| DTI[Target-Net Service (Flask - Port 5002)]
        Central -->|Proxy Request| Synergy[Synergy Service (Flask - Port 5010)]
    end
```

---

## 3. Implementation Details

### A. Frontend (Client Layer)
**Location:** `/Drug.io-main/FrontEnd`
**Tech Stack:** React 18, Vite, TailwindCSS, Framer Motion, Axios, React Router DOM.

#### Key Components:
1.  **Entry Point (`App.jsx`)**:
    -   Sets up Routing using `react-router-dom`.
    -   Wraps application in `AuthProvider` for global authentication state.
    -   **Routes**:
        -   Public: `/`, `/login`, `/predict` (Public access allowed).
        -   Protected: `/dashboard`, `/history`, `/admin/dashboard` (Requires JWT).

2.  **Authentication (`context/AuthContext.jsx`)**:
    -   Manages `user` state and `token` (stored in `localStorage`).
    -   Provides `login()` and `logout()` methods.
    -   Interacts with `/api/auth/login`.

3.  **Prediction Interface (`pages/PredictPage.jsx` & `components/MainPredict.jsx`)**:
    -   Acts as a switcher between the three tools (`ADMET`, `Drug-Target`, `Drug-Combination`).
    -   **Sub-components**:
        -   `Predict.jsx`: Handles ADMET inputs (SMILES) and displays Radar plots.
        -   `DrugTarget.jsx`: Handles DTI inputs (SMILES + Protein Sequence).
        -   `DrugCombination.jsx`: Handles Synergy inputs (Drug A + Drug B).

4.  **API Layer** (`src/api/`):
    -   Configured to point to the Central Backend (`http://localhost:5000/api`).

---

### B. Central Backend (Gateway & Orchestration)
**Location:** `/Drug.io-main/central-backend`
**Tech Stack:** Python (Flask), PyMongo, PyJWT, BCrypt.
**Port:** 5000

#### Responsibilities:
1.  **API Gateway**:
    -   Receives all requests from the Frontend.
    -   Routes prediction requests to the appropriate microservice.
2.  **Authentication & Authorization**:
    -   **JWT-based**: Uses `auth/middleware.py` (`@token_required`, `@token_optional`).
    -   **RBAC**: Supports roles (`Admin`, `Researcher`, `Pharmacologist`).
3.  **Data Persistence**:
    -   Stores User profiles.
    -   Logs all prediction history in MongoDB (`drug_queries` collection).
    -   Tracks `frequently_used_drugs`.

#### Key Endpoints (`app.py`):
| Endpoint | Method | Description | Target Service |
| :--- | :--- | :--- | :--- |
| `/api/auth/login` | POST | User login & Token generation | Internal |
| `/api/predict` | POST | ADMET Prediction (Batch/Single) | `ADMET_API_URL` (8080) |
| `/api/predict/target` | POST | Drug-Target Interaction | `DTI_API_URL` (5002) |
| `/api/predict/synergy` | POST | Drug Combination Synergy | `SYNERGY_API_URL` (5010) |
| `/api/work/history` | GET | Fetch user's past queries | Internal (MongoDB) |

#### Database Schema (MongoDB):
-   **`users`**: `{ _id, email, password_hash, role, name, created_at }`
-   **`drug_queries`**: `{ _id, user_id, smiles/query, results, created_at, type }`
-   **`frequently_used_drugs`**: `{ user_id, smiles, usage_count, last_used }`

---

### C. Microservices (Compute Layer)

#### 1. ADMET-X Service
-   **Location:** `/Drug.io-main/BackEnd`
-   **Port:** 8080
-   **Tech:** Flask, RDKit, Scikit-learn.
-   **Function:**
    -   Accepts SMILES string.
    -   Calculates molecular descriptors (MW, LogP, TPSA, etc.).
    -   Runs pre-trained ML models for toxicity and properties.
    -   Returns JSON with 30+ properties.

#### 2. Target-Net (DTI) Service
-   **Location:** `/AI Drug`
-   **Port:** 5002
-   **Tech:** Flask, PyTorch.
-   **Function:**
    -   Accepts `smiles` and `protein_sequence`.
    -   Encodes inputs using Deep Learning tokenizers.
    -   Predicts binding affinity/interaction classification.

#### 3. Synergy-GNN Service
-   **Location:** `/Drug-Combination-Prediction` (likely wrapper around `Drug-Combination-Prediction-main`)
-   **Port:** 5010
-   **Tech:** Flask (wrapper), PyTorch Geometric.
-   **Function:**
    -   Accepts two drugs and a cell line.
    -   Uses Graph Neural Networks to predict synergistic effects.

---

## 4. End-to-End Data Flow (Example: ADMET Prediction)

1.  **User Interaction**: User enters a SMILES string (e.g., `C9H8O4`) in `PredictPage`.
2.  **Frontend Request**: React calls `POST http://localhost:5000/api/predict` with `{ "smiles": "C9H8O4" }`. Authorization header included if logged in.
3.  **Central Gateway**:
    -   `app.py` receives request.
    -   Checks JWT (if present).
    -   Calls `services.admet_service.predict_admet("C9H8O4")`.
4.  **Service Call**:
    -   `admet_service` sends `POST http://localhost:8080/predict` to the ADMET microservice.
5.  **Computation**:
    -   ADMET service uses RDKit to calculate properties.
    -   Returns JSON result to Central Backend.
6.  **Persistence**:
    -   Central Backend receives result.
    -   If user is logged in, saves result to `drug_queries` collection in MongoDB.
7.  **Response**: Central Backend returns JSON to Frontend.
8.  **Visualization**: Frontend renders the data (Radar charts, Toxicity tables).

---

## 5. Configuration & Setup

### Environment Variables (.env)
**Central Backend:**
```env
MONGO_URI=mongodb+srv://...
JWT_SECRET_KEY=...
ADMET_API_URL=http://localhost:8080
DTI_API_URL=http://localhost:5002
SYNERGY_API_URL=http://localhost:5010
```

### Port Mapping
-   **Frontend**: 5173 (Vite Default)
-   **Central Backend**: 5000
-   **ADMET Service**: 8080
-   **DTI Service**: 5002
-   **Synergy Service**: 5010
