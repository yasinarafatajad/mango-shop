# Project Name : Mango Shop | E-Commerce Platform

---

## Project Overview

**Mango Shop** is a comprehensive, modern e-commerce platform designed to provide a seamless shopping experience. This repository contains a fully integrated full-stack application consisting of a high-performance Client Portal and a scalable Backend API.

---

## 🏗️ Project Architecture

The system is organized into two core specialized layers:

1. **[client](./client)**: Public-facing e-commerce storefront built with **Next.js 16** .
2. **[SERVER](./SERVER)**: Scalable RESTful API powering the entire ecosystem using **Node.js/Express v5** and **MongoDB**.

---

## 📊 Project Status

- **Status**: Complete
- **Lead Developer**: Yasin Arafat Ajad

---

## 🚀 GitHub Badges

![License: ISC](https://img.shields.io/badge/License-ISC-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Express](https://img.shields.io/badge/Express-5-lightgrey)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

---

## 🛠️ Technology Stack (Summary)

| Layer      | Framework/Stack         | Primary Tools                     |
| ---------- | ----------------------- | --------------------------------- |
| **CLIENT** | Next.js 16 (App Router) | React 19, Raw css, Lucide     |
| **SERVER** | Node.js (Express v5)    | Mongoose, JWT, Nodemailer, Twilio |

---

## ✨ Core Features

### 🛒 Public Experience (Client)

- **High Performance**: Optimized Core Web Vitals with Next.js App Router.
- **Responsive Design**: Premium, consistent desktop user experience across all core pages (Homepage, Profile, Order sections).
- **Guest Checkout**: Guest Account Order Logic with auto-generated accounts and clear authentication feedback.

### 🔐 Backend Infrastructure (Server)

- **Security-First**: Integrated JWT auth, XSS protection, Helmet, and rate limiting.
- **Multi-Channel Authentication**: Multi-step verification process, Nodemailer for email OTPs, and Twilio WhatsApp API for message-based OTP delivery.
- **Data Integrity**: Strict Mongoose schemas and centralized error handling.

---

## 📂 Repository Structure

```text
Mango-Shop/
├── client/          # Frontend E-commerce Portal (Next.js)
├── SERVER/          # Backend REST API (Node/Express)
├── screenshots/     # Application screenshots
└── README.md        # Consolidated project documentation
```

---

## 🛠️ Installation & Setup

### Prerequisites

- **Node.js** >= 18
- **MongoDB** instance (for SERVER)
- **Cloudinary Account** (for SERVER media)
- **Twilio Account** (for WhatsApp OTP)

### Quick Start

1. **Clone the Repository**:
   ```bash
   git clone git@github.com:yasinarafatajad/mango-shop.git
   cd mango-shop
   ```
2. **Database & API (SERVER)**:
   ```bash
   cd SERVER && npm install
   # Configure .env variables for DB, JWT, Cloudinary, Nodemailer, and Twilio
   npm run dev
   ```
3. **Public Portal (client)**:
   ```bash
   cd ../client && npm install
   # Configure .env.local 
   npm run dev
   ```

---

## 🖼️ Screenshots

| Platform   | View        | Preview                                              |
| ---------- | ----------- | ---------------------------------------------------- |
| **CLIENT** | E-Commerce  | ![Screenshot 10](screenshots/Screenshot%20(10).png)   |
| **CLIENT** | E-Commerce  | ![Screenshot 11](screenshots/Screenshot%20(11).png)  |
| **CLIENT** | E-Commerce  | ![Screenshot 12](screenshots/Screenshot%20(12).png)  |

---

## 👷 Author

**Yasin Arafat Ajad**  
_Full-Stack Developer_

---