# 📃 -

## 🌐 Live Demo

- **Backend API**:
- **Frontend**:
- **GitHub Code**: [https://github.com/Betopia24/jimgreen81-backend](https://github.com/Betopia24/jimgreen81-backend)

---

## 📑 Table of Contents

- [Documentation](#documentation)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Roles & Permissions](#roles--permissions)
- [API Endpoints](#api-endpoints)
- [Setup & Installation](#setup--installation)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [License](#license)

---

## 📄 Documentation

- **[📬 API endpoints documentation](https://documenter.getpostman.com/view/50868842/2sBXVfjWrP)**

---

## 🚀 Features

- 🧾 **User Authentication & Authorization (JWT)**
- 🐳 **Dockerized for Deployment**
- 🧪 **Unit & Integration Testing with Jest & supertest**
- 🔐 **Secure Password Hashing, Rate Limiting & Error Handling**

---

## 🛠️ Tech Stack

| Layer            | Technology             |
| ---------------- | ---------------------- |
| Language         | TypeScript             |
| Frameworks       | Node.js, Express.js    |
| Databases        | PostgreSQL             |
| Auth             | JWT, Bcrypt            |
| ORM              | Prisma                 |
| Validation       | Zod                    |
| CI/CD            | GitHub Actions         |
| Containerization | Docker, Docker Compose |
| Documentation    | Postman                |
| Notification     | Nodemailer             |
| Payment          | Stripe Integration     |
| Testing          | Jest, Supertest        |

---

<p align="right"><a href="#readme-top">back to top</a></p>

## 🧱 Architecture Overview

The backend follows a layered, modular architecture with:

- **Clean code structure**
- **Separation of concerns**
- **Zod-based DTO validation**
- **Role-based middleware**
- **Global error handling**
- **Logger (Winston)**

---

## 👥 Roles & Permissions

| Role | Capabilities |
| ---- | ------------ |
|      |              |
|      |              |
|      |              |

---

## 📬 API Endpoints

> Base URL: `https://example.com/api/v1`

- **API Documentation (postman)**: []()

---

<p align="right"><a href="#readme-top">back to top</a></p>

## ⚙️ Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Betopia24/jimgreen81-backend.git

cd jimgreen81-backend

npm install

cp .env.example .env

npm prisma generate

npm prisma db push

npm dev # And also add all .env variable
```

---

## 🧪 Scripts

```bash
# Run in development mode
npm dev

# Run tests
npm test

# Build for production
npm build

# Run in production mode
npm start

# Format code
npm format

# Lint code
npm lint
```

---

## 📦 Deployment

Server hosted on VPS

CI/CD managed via GitHub Actions

Dockerized infrastructure with support for docker-compose

---

## 🪪 License

This project is licensed under the MIT License.
