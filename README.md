# ⚔️ Dungeons & Dragons: Tactical Web Edition

A full-stack, turn-based dungeon crawler that transforms a Java OOP terminal assignment into an interactive React web app with animated sprites.

---

## 🛠️ Tech Stack

* **Frontend**: React, TypeScript, Vite, CSS Grid / HTML Canvas
* **Backend**: Java 17+, Custom Lightweight Server
* **Architecture & Patterns**: Object-Oriented Design, Visitor, Observer, Factory

---

## ✨ Key Features

* **React UI**: Replaces ASCII text with dynamic tilemaps, health/mana bars, animated sprites, and an auto-scrolling combat log.
* **Pure Java OOP Engine**: 
  * Double-dispatch **Visitor Pattern** for grid collisions and combat without `instanceof` checks.
  * Decoupled **Observer Pattern** to stream game events directly to the frontend.
* **Expanded Gameplay**: Distinct playable classes (Warrior, Mage, Rogue, Hunter) with cooldowns and unique abilities, AI-driven enemies that chase or ambush, dynamic traps, and boss phases.

---

## 🎮 Controls

W / A / S / D: Move

E: Cast Class Ability

Q: Skip Turn

---

## 🚀 How to Run Locally

### 1. Start the Java Backend
```bash
cd backend
javac GameServer.java
java GameServer
