<div align="center">

<!-- ANIMATED HEADER -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f2027,30:203a43,60:2c5364,100:1a1a2e&height=300&section=header&text=EventOS&fontSize=90&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Real-Time%20Event%20Management%20Platform&descAlignY=58&descSize=22&descColor=a8d8ea"/>

<!-- TYPING ANIMATION -->
<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&duration=3000&pause=800&color=00D9FF&center=true&vCenter=true&multiline=false&width=700&height=50&lines=⚡+Real-Time+Event+Management+System;🌐+Spring+Boot+%2B+React+%2B+WebSockets;🔐+Secure+REST+API+Architecture;🐳+Dockerized+%26+Production-Ready;🚀+Built+by+Somnath+Rana"/>

<br/>

<!-- ANIMATED BADGES -->
<p>
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge&logo=checkmarx&logoColor=white&labelColor=0d1117"/>
  <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge&logo=semver&logoColor=white&labelColor=0d1117"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge&logo=opensourceinitiative&logoColor=white&labelColor=0d1117"/>
  <img src="https://img.shields.io/badge/PRs-Welcome-ff69b4?style=for-the-badge&logo=github&logoColor=white&labelColor=0d1117"/>
</p>

</div>

---

## <img src="https://media2.giphy.com/media/QssGEmpkyEOhBCb7e1/giphy.gif?cid=ecf05e47a0n3gi1bfqntqmob8g9aid1oyj2wr3ds3mg700bl&rid=giphy.gif" width="28"> Tech Stack

<div align="center">

<table>
<tr>
  <td align="center" width="130">
    <img src="https://skillicons.dev/icons?i=spring" width="48" height="48" alt="Spring Boot"/><br/>
    <sub><b>Spring Boot</b></sub>
  </td>
  <td align="center" width="130">
    <img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React"/><br/>
    <sub><b>React</b></sub>
  </td>
  <td align="center" width="130">
    <img src="https://skillicons.dev/icons?i=postgresql" width="48" height="48" alt="PostgreSQL"/><br/>
    <sub><b>PostgreSQL</b></sub>
  </td>
  <td align="center" width="130">
    <img src="https://skillicons.dev/icons?i=docker" width="48" height="48" alt="Docker"/><br/>
    <sub><b>Docker</b></sub>
  </td>
  <td align="center" width="130">
    <img src="https://skillicons.dev/icons?i=maven" width="48" height="48" alt="Maven"/><br/>
    <sub><b>Maven</b></sub>
  </td>
  <td align="center" width="130">
    <img src="https://skillicons.dev/icons?i=java" width="48" height="48" alt="Java"/><br/>
    <sub><b>Java 17</b></sub>
  </td>
</tr>
</table>

<br/>

![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=flat-square&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=flat-square&logo=docker&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-STOMP-FF6B35?style=flat-square&logo=socket.io&logoColor=white)
![Security](https://img.shields.io/badge/Spring_Security-Auth-6DB33F?style=flat-square&logo=springsecurity&logoColor=white)

</div>

---

## 🚀 Project Overview

> **EventOS** is a **production-grade full-stack Event Management Platform** engineered for performance, real-time responsiveness, and clean architecture — built to demonstrate enterprise-level engineering patterns.

<div align="center">

| 🎯 Feature | 💡 Tech Used | ✅ Status |
|:---|:---|:---:|
| REST API Architecture | Spring Boot MVC | ✅ Done |
| Real-Time Updates | WebSockets (STOMP) | ✅ Done |
| Secure Endpoints | Spring Security | ✅ Done |
| Frontend Integration | React + Axios | ✅ Done |
| Containerization | Docker | ✅ Done |
| Database ORM | Spring Data JPA | ✅ Done |

</div>

---

## 🌐 Web Interface

<div align="center">
  <img src="Image/Event_Web_Page .png" width="95%" alt="EventOS Web Interface" style="border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.3);"/>
</div>

---

## 📊 Live Dashboard

<div align="center">
  <img src="Image/Event_DashBoard.png" width="95%" alt="EventOS Dashboard" style="border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.3);"/>
</div>

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   🌐 React Frontend                      │
│              (UI Layer — Axios + STOMP Client)           │
└────────────────────┬──────────────┬─────────────────────┘
                     │              │
              REST (Axios)    WebSocket (STOMP)
                     │              │
                     ▼              ▼
┌─────────────────────────────────────────────────────────┐
│              🟢 Spring Boot Backend                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Controller Layer  (REST + WS)             │   │
│  └──────────────────────┬───────────────────────────┘   │
│                         ▼                                │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Service Layer (Business Logic)       │   │
│  └──────────────────────┬───────────────────────────┘   │
│                         ▼                                │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Repository Layer (Spring Data JPA)        │   │
│  └──────────────────────┬───────────────────────────┘   │
└───────────────────────────────────────────────────── ───┘
                          │
                          ▼
            ┌─────────────────────────┐
            │   🐘 PostgreSQL Database │
            └─────────────────────────┘
```

---

## 🔐 Security Layer

<div align="center">

```
🔒 Spring Security Configuration
┌─────────────────────────────────────────────┐
│  ✅ Basic Authentication (HTTP)              │
│  ✅ Secured REST Endpoints                   │
│  ✅ CORS Configuration                       │
│  🔜 Extendable to JWT                       │
│  🔜 Role-Based Access Control (RBAC)        │
└─────────────────────────────────────────────┘
```

</div>

---

## ✨ Core Features

<div align="center">

```
╔══════════════════════════════════════════════╗
║            🌟 EventOS Features               ║
╠══════════════════════════════════════════════╣
║  📝  Create / Update / Delete Events         ║
║  ⚡  Real-Time Dashboard via WebSockets      ║
║  🔍  Search & Filter Events                  ║
║  🟢  Live WebSocket Connection Status        ║
║  🏛️  Clean MVC Layered Architecture         ║
║  🐳  Docker Ready for Production             ║
╚══════════════════════════════════════════════╝
```

</div>

---

## 🐳 Docker Support

<details>
<summary><b>📦 Click to expand Docker setup</b></summary>

<br/>

**Dockerfile:**
```dockerfile
FROM eclipse-temurin:17
COPY target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

**Build & Run:**
```bash
# Build the image
docker build -t eventos-backend .

# Run the container
docker run -p 8095:8095 eventos-backend
```

</details>

---

## 🌍 Deployment Guide

<details>
<summary><b>🚀 Render Deployment</b></summary>

```
1. Connect GitHub repository to Render
2. Build Command:  ./mvnw clean install
3. Start Command:  java -jar target/*.jar
4. Set environment variables
5. Deploy 🎉
```

</details>

<details>
<summary><b>🚂 Railway Deployment</b></summary>

```
1. Create new Railway project
2. Connect GitHub repository
3. Add PostgreSQL plugin
4. Set environment variables
5. Deploy automatically 🎉
```

</details>

<details>
<summary><b>☁️ AWS EC2 Deployment</b></summary>

```bash
# 1. Launch EC2 instance (Ubuntu recommended)
# 2. Install dependencies
sudo apt update && sudo apt install openjdk-17-jdk maven git -y

# 3. Clone & Run
git clone <your-repo-url>
cd event-management
./mvnw spring-boot:run

# 4. Open port 8095 in Security Group ✅
```

</details>

---

## 📁 Project Structure

```
event-management/
│
├── 📂 src/
│   ├── 📂 main/
│   │   ├── 📂 java/
│   │   │   └── 📂 com/eventos/
│   │   │       ├── 📂 controller/     # REST + WebSocket Controllers
│   │   │       ├── 📂 service/        # Business Logic Layer
│   │   │       ├── 📂 repository/     # Spring Data JPA Repos
│   │   │       ├── 📂 model/          # JPA Entity Classes
│   │   │       └── 📂 config/         # Security & WS Config
│   │   └── 📂 resources/
│   │       └── application.properties
│   └── 📂 test/
│
├── 📂 event-frontend/                  # React Frontend
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   ├── 📂 pages/
│   │   └── 📂 services/               # Axios API Calls
│   └── package.json
│
├── 📂 Image/                           # Screenshots
├── 🐳 Dockerfile
└── 📄 pom.xml
```

---

## 📈 Learning Outcomes

<div align="center">

| 🎓 Concept | 📌 Applied In |
|:---|:---|
| Real-Time System Design | WebSocket (STOMP) Integration |
| REST API Best Practices | Spring MVC Controller Layer |
| Backend Security Fundamentals | Spring Security with Basic Auth |
| Docker Containerization | Dockerfile + Docker Compose |
| Frontend-Backend Integration | React + Axios + WebSocket Client |
| Production Deployment Workflow | Render / Railway / AWS EC2 |

</div>

---

## 🚀 Future Improvements

- [ ] 🔐 **JWT Authentication** — Stateless token-based auth
- [ ] 👥 **Role-Based Access Control** — Admin / User roles
- [ ] ⚡ **Redis Caching** — Faster data retrieval
- [ ] 🔄 **CI/CD Pipeline** — GitHub Actions automation
- [ ] 📊 **Analytics Dashboard** — Event statistics & charts
- [ ] 📱 **Mobile Responsive UI** — Full PWA support

---

## 👨‍💻 Developed By

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=0,2,2,5,30&height=1&width=100%"/>

<br/>

### **Somnath Rana**
#### Full Stack Backend Engineer

![Spring Boot](https://img.shields.io/badge/-Spring_Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black)
![WebSockets](https://img.shields.io/badge/-WebSockets-FF6B35?style=flat-square&logo=socket.io&logoColor=white)
![System_Design](https://img.shields.io/badge/-System_Design-1a1a2e?style=flat-square&logo=databricks&logoColor=white)

<br/>

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Somnath%20Rana-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/somnath7/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/somnathrana)

<br/>

<a href="https://www.linkedin.com/in/somnath7/" target="_blank">
  <img src="https://img.shields.io/badge/🔗%20Let's%20Connect%20on%20LinkedIn-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Profile"/>
</a>

</div>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:2c5364,50:203a43,100:0f2027&height=120&section=footer&animation=fadeIn"/>

**⭐ If you found this project helpful, please give it a star!**

<img src="https://komarev.com/ghpvc/?username=somnathrana-eventos&label=Profile+Views&color=00d9ff&style=flat-square" alt="Profile Views"/>

</div>
