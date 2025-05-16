# Technical Specifications and Patterns

This document provides detailed technical specifications, established patterns, and guidelines for the project. Refer to this document to ensure consistency and adherence to best practices.

## 1. Backend (Python/FastAPI/SQLModel)
* **Python Usage:** 
    * When declaring optional types use the newer python 3.11 syntax instead of Optional type
* **Python Version:** 3.11+
* **Type Hinting:** Mandatory for all Python code (PEP 484).
* **ORM:** SQLModel is the exclusive Object-Relational Mapper (ORM) for database interaction. It leverages Pydantic for data validation and serialization and SQLAlchemy Core for database communication. Define clear SQLModel classes that serve as both database models and Pydantic schemas.
* **FastAPI Usage:**
    * Leverage FastAPI's Dependency Injection system for managing dependencies (e.g., database sessions, authentication).
    * Utilize `async/await` for handling asynchronous operations, especially for database interactions and network requests.
    * Structure the application into logical modules: `routers` for API endpoints, `services` for business logic, and `models` for data structures.
* **Docstrings:** Write comprehensive docstrings (Google or NumPy style - PEP 257) for all modules, classes, and functions, explaining their purpose, arguments, and return values.
* **Code Structure:**
    * `routers/`: Organize API endpoints by resource (e.g., `user_router.py`, `item_router.py`). Each router should handle specific API paths and delegate business logic to service functions.
    * `services/`: Implement the core business logic of the application. These functions often interact with the database using SQLModel and may orchestrate multiple operations. Keep services independent of specific API frameworks.
    * `models/`: Define SQLModel classes that inherit from `sqlmodel.SQLModel` and represent database tables. These models should also include Pydantic validation rules.
    * `database/`: Contains code for initializing the database engine (`create_engine`), creating database sessions (`SessionLocal`), and potentially defining a base class for SQLModel models.
    * `alembic/`: Holds Alembic migration scripts for managing database schema changes. Configure Alembic to point to the correct database and model definitions.
* **Alembic Migrations:**
    * Generate Alembic migrations for all database schema modifications.
    * Follow Alembic best practices for creating, reviewing, and applying migrations.
    * Ensure migrations are tested in a development environment before applying them to production.

## 2. Frontend (React/TypeScript/ShadCN/TailwindCSS)

* **TypeScript:** Use TypeScript consistently throughout the frontend codebase. Enable and adhere to strict mode in `tsconfig.json` to catch potential type-related errors early. Avoid using `any` unless absolutely necessary and provide a clear explanation when it is used.
* **React Components:**
    * Develop using functional components with React Hooks for managing state, side effects, and component logic.
    * Define clear and explicit types for component props, state variables, and the return values of custom hooks.
    * Break down complex UI into smaller, reusable components with single responsibilities.
* **ShadCN/ui:**
    * Utilize components from the ShadCN/ui library for building the user interface. Prefer composition of these primitives over creating custom components that replicate their functionality.
    * Refer to the `components.json` file for configuration and available components.
    * Leverage ShadCN/ui's TypeScript support for type safety.
* **TailwindCSS:**
    * Adhere to the utility-first approach of TailwindCSS. Style elements by applying predefined utility classes directly in the JSX.
    * Avoid writing custom CSS or using `@apply` unless there is a strong and well-documented reason. Keep the `tailwind.config.js` file clean and extend it thoughtfully.
    * Use the Tailwind CSS IntelliSense extension in your IDE for better developer experience.
* **Documentation:** Document complex component logic, public component APIs, and custom hooks using TSDoc syntax for generating API documentation.
* **File Naming:** Use PascalCase for React component files (e.g., `UserProfileCard.tsx`), camelCase for variables and function names, and consistent naming conventions within directories.

## 3. Linting and Formatting

* **Python:** Ensure all Python code is formatted using Black and adheres to linting rules defined by Ruff (or Flake8 with relevant plugins like isort). Configure these tools in the `pyproject.toml` file.
* **Frontend (TypeScript):** Maintain code consistency using Prettier for formatting and ESLint (with recommended TypeScript and React plugins) for linting. Configuration files (`.prettierrc.js`, `.eslintrc.js`) should be present in the frontend directory.

## 4. Testing

* **Backend:** Write comprehensive unit tests using Pytest to verify the logic of services and utility functions. Implement integration tests using Pytest and an HTTP client (e.g., `httpx`) to test API endpoint behavior. Use SQLModel's testing utilities for testing database interactions, potentially using an in-memory SQLite database for isolation.
* **Frontend:** Write unit and integration tests for React components and custom hooks using testing libraries like Jest/Vitest and React Testing Library. Focus on testing component behavior from the user's perspective (e.g., rendering, user interactions).
* **End-to-End (E2E) Testing:** Consider implementing E2E tests using tools like Playwright or Cypress for critical user flows that involve both the frontend and backend.
* **Test Execution:** Ensure all tests pass before committing or deploying code.

## 5. Code Style

* **Readability:** Write clean, well-organized, and easily understandable code in both backend and frontend. Use meaningful variable and function names.
* **DRY (Don't Repeat Yourself):** Identify and refactor duplicated code into reusable functions, components, or services.
* **Small Files & Components/Functions:** Keep Python files and React component files reasonably sized. Break down large functions and components into smaller, more manageable units with single responsibilities.
* **Naming Conventions:** Adhere consistently to established naming conventions for files, classes, functions, variables, and constants in both the backend and frontend.

## 6. Database Considerations (SQLModel)

* **SQLModel Usage:** Utilize SQLModel for all database interactions. Define SQLModel classes that inherit from `sqlmodel.SQLModel` to represent database tables. These classes also function as Pydantic schemas for data validation.
* **Relationships:** Define relationships between SQLModel models using `Relationship` to manage related data. Understand different relationship types (one-to-one, one-to-many, many-to-many).
* **CRUD Operations:** Implement Create, Read, Update, and Delete (CRUD) operations using SQLModel's session methods. Encapsulate these operations within service layers.
* **Database Migrations (Alembic):** Use Alembic to manage database schema changes. Ensure that SQLModel model changes are reflected in Alembic migration scripts.

## Backend Architecture (FastAPI)

### Model Structure (SQLModel & Pydantic)

We employ a clear separation between database models and API data schemas:

1.  **Database Models (`backend/models/`)**:
    *   Defined using `SQLModel` with `table=True`.
    *   These classes directly map to database tables (e.g., `Page`).
    *   They represent the canonical structure of data as stored in the database.
    *   **Page Content Storage**: For entities like `Page` that represent rich-text documents (e.g., from Tiptap), the entire content structure is stored within a single database column using a suitable JSON type (e.g., `JSONB` for PostgreSQL). This simplifies the model structure significantly compared to normalizing nodes into separate tables.
        *   Example: `content: Any = Field(default={}, sa_column=Column(JSONB))`

2.  **API Schemas (`backend/schemas/`)**:
    *   Defined using `pydantic.BaseModel`.
    *   These classes define the structure of data for API requests and responses (e.g., `PageCreate`, `PageRead`, `PageUpdate`).
    *   **Page Content Validation**: For JSON content fields, the schemas use flexible types like `Any` or `Dict[str, Any] | List[Any]` to validate that the input/output is valid JSON, matching the expected editor structure.
    *   **Why this separation?**
        *   Decoupling, Security, Clarity, Flexibility (as before).
    *   `Config.from_attributes = True` is used in `Read` schemas to enable serialization from `SQLModel` database objects, including automatic deserialization of the JSON content field.

### Dependency Injection

FastAPI's dependency injection system is used for:

*   Database sessions (`get_session`)
*   Authentication (`get_current_user` - placeholder)
*   Service layer access (when implemented)

This promotes testability and modularity.

*(... Other sections like Routing, Services, Database can be added here ...)*

## Frontend Architecture (React)

*(... Details about React structure ...)*

## Testing Strategy

*(... Details about Pytest, Vitest ...)*

By adhering to these guidelines, we aim to create a maintainable, scalable, and high-quality application.
