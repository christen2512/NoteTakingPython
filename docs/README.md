# Template Python React
Use this template for python apps

## Technology Stack

* **Backend:** Python (3.11+), FastAPI, SQLModel, PostgreSQL
* **Frontend:** React (TypeScript), ShadCN/ui, TailwindCSS

## Setup Instructions

**Prerequisites:**

1.  **Python:** Ensure you have Python 3.11 or higher installed.
2.  **Node.js and npm (or yarn/pnpm):** Required for the frontend.
3.  **PostgreSQL:** Make sure PostgreSQL is installed and running.

**Backend Setup:**

1.  **Navigate to the `backend` directory:**
    ```bash
    cd backend
    ```
2.  **Create a virtual environment (recommended):**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On macOS/Linux
    venv\Scripts\activate  # On Windows
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt  # Assuming you have a requirements.txt
    # OR if using Poetry:
    # poetry install
    ```
4.  **Database Setup:**
    * Create a PostgreSQL database for the project.
    * Configure the database connection URL in a `.env` file (see `.env.example` for the format).
5.  **Run Alembic migrations:**
    ```bash
    alembic upgrade head
    ```
6.  **Run the FastAPI development server:**
    ```bash
    uvicorn main:app --reload
    ```

**Frontend Setup:**

1.  **Navigate to the `frontend` directory:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # OR yarn install
    # OR pnpm install
    ```
3.  **Configure API base URL:**
    * Update the API base URL in the frontend code or environment variables to point to your backend server.
4.  **Run the React development server:**
    ```bash
    npm start
    # OR yarn start
    # OR pnpm dev
    ```

## Project Structure
├── backend/
|   |── __init__.py         # All subdirectories are declared as modules
│   ├── main.py             # FastAPI application entry point
│   ├── routers/            # API endpoint definitions
│   ├── services/           # Business logic
│   ├── models/             # SQLModel definitions
│   ├── database/           # Database connection and session management
│   ├── alembic/            # Database migration scripts
|   └── requirements.txt        # Backend dependencies (or pyproject.toml)
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components (ShadCN/ui)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Application views/routes
│   │   ├── utils/          # Utility functions
│   │   └── api/            # Functions for backend API interaction
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.js  # TailwindCSS configuration
├── docs/
│   ├── architecture.md
│   ├── technical.md
│   └── ...
├── tasks/
│   └── tasks.md
├── .gitignore
├── package-lock.json       # Frontend dependency lockfile (or yarn.lock, pnpm-lock.yaml)
└── README.md

## Established Patterns

* **Backend:** FastAPI Dependency Injection, SQLModel-based data modeling and CRUD operations.
* **Frontend:** React Hooks for state and logic, Composition with ShadCN/ui components, Utility-first styling with TailwindCSS.
