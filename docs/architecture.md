# Project Architecture

This document outlines the high-level architecture of the application, its key components, and their interactions. It serves as a guide for both human developers and the AI assistant to understand the system's structure and ensure changes are consistent with the overall design.

## 1. High-Level Overview

```mermaid
graph LR
    A[Client (Browser)] --> B(Frontend (React/ShadCN/TailwindCSS));
    B -- HTTP/JSON --> C(Backend (FastAPI));
    C -- SQL --> D[(PostgreSQL Database)];

## 2. Component Breakdown
2.1 Frontend

    Technology Stack: React (TypeScript), ShadCN/ui, TailwindCSS
    Key Principles:
        Component-based architecture using React.
        Consistent UI using ShadCN/ui components.
        Responsive and styled using TailwindCSS utility classes.
        [Specify: State management approach - e.g., Context API, Zustand, Redux.]
        [Specify: Data fetching strategy - e.g., Fetch API, Axios, React Query.]
    Module Boundaries:
        components/: Reusable UI elements built with React and ShadCN/ui.
        hooks/: Custom React hooks encapsulating reusable logic.
        pages/: Top-level components representing application views/routes.
        utils/: Helper functions and constants.
        api/: Functions responsible for making API calls to the backend.

2.2 Backend

    Technology Stack: Python (3.11+), FastAPI, SQLModel, PostgreSQL
    Key Principles:
        RESTful API design using FastAPI.
        Data modeling, validation, and database interaction managed by SQLModel.
        Asynchronous operations (async/await) for efficient handling of I/O-bound tasks.
        Dependency Injection for managing dependencies and middleware.
        Modular organization into routers, services, and models.
    Module Boundaries:
        main.py: Entry point for the FastAPI application.
        routers/: Define API endpoints using FastAPI's APIRouter.
        services/: Implement business logic, often orchestrating data access.
        models/: Define SQLModel classes that represent database tables and Pydantic schemas for data validation and serialization.
        database/: Handles database connection, session management (using SQLModel's create_engine and Session), and potentially base model definitions.
        alembic/: Contains scripts for database schema migrations.

2.3 Database

    Technology: PostgreSQL
    Schema: [Reference: Link to or embed a simplified ERD or description of key tables and their relationships. This will be crucial for understanding data structures.]
    Key Principles:
        Relational database adhering to defined schema.
        Data integrity enforced through constraints and relationships.

## 3. API Design

    Protocols: RESTful API over HTTP.
    Data Format: JSON for request and response bodies.
    Endpoints: [Reference: A list of key API endpoints, their HTTP methods, and a brief description of their functionality. Include examples of request/response structures if available or planned.]
    Authentication and Authorization: [Specify: Outline the planned authentication and authorization mechanisms (e.g., JWT, OAuth2) and how they will be implemented using FastAPI's security features.]

## 4. Data Flow

[TO DO Diagram: A simplified data flow diagram illustrating a typical user interaction, showing the flow of data from the Frontend to the Backend API, the Backend's interaction with the PostgreSQL database (using SQLModel), and the response back to the Frontend.] 

## 5. Component Dependencies

[TO DO Diagram: A high-level diagram showing the dependencies between major components. For example, Frontend components depend on the Backend API contract, Backend services depend on SQLModel for database interactions.]

## 6. Technology Stack Specifics

    FastAPI: Used for building the API with features like automatic data validation (Pydantic via SQLModel), dependency injection, and asynchronous request handling.
    SQLModel: The primary ORM for interacting with the PostgreSQL database. It combines Pydantic for data validation and SQLAlchemy for database querying.
    PostgreSQL: The relational database used for persistent data storage.
    React: A JavaScript library for building dynamic and interactive user interfaces using a component-based approach.
    ShadCN/ui: A collection of accessible and composable UI primitives built using Radix UI and styled with Tailwind CSS. Promotes consistency and rapid UI development.
    TailwindCSS: A utility-first CSS framework for rapidly styling the frontend by applying small, single-purpose classes.

## 7. Established Patterns

    Backend:
        FastAPI Dependency Injection: Used for managing dependencies like database sessions and authentication.
        SQLModel for Data Access: SQLModel models define database tables and are used for creating, reading, updating, and deleting data. Services often utilize these models for database interactions.
    Frontend:
        React Hooks: For managing state and side effects in functional components.
        ShadCN/ui Composition: Building complex UI elements by composing smaller ShadCN/ui components.
        Tailwind Utility Classes: Styling elements by applying predefined utility classes directly in the JSX.

## 8. Validation

All development efforts must adhere to this architectural design. Any proposed changes or deviations should be clearly communicated and justified, ensuring they align with the overall system structure and principles.