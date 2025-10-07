# 🧩 Hangman Game

This is my own version of the classic **Hangman** game, built with **HTML**, **CSS**, and **JavaScript**.  
It’s a simple project I made to practice DOM manipulation, event handling, and working with a backend API.

---

## 🎮 About the Game

The game can be played between **two players online**.  
One player creates a room, and the other joins using the same room name and password.  
Each player takes turns guessing letters until one wins — or runs out of lives!

It connects to a small backend (`https://penjat.codifi.cat`) that handles the shared game data in real time.  
The game updates automatically every few seconds so both players stay in sync.

---

## ⚙️ How It Works (Quick Summary)

- When you open the page, you can create or join a game.  
- The script sends info to the server using **fetch()**.  
- Lives and word progress are updated on screen with DOM manipulation.  
- The monster image changes as you lose lives.  
- When the word is guessed or lives reach zero, the game shows who won.  

---

## 🧠 Tech Used

- HTML, CSS, JavaScript (no frameworks)
- Basic API communication with `fetch()`
- Simple interval updates for real-time play

---

## 🚀 Try It

1. Clone the repo  
   ```bash
   git clone https://github.com/AdriaChillon/hangman-game.git
