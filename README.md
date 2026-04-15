# Battleship Game (JavaScript)

This project is a fully functional implementation of the classic Battleship game built using modern JavaScript principles. The application focuses on clean architecture, modular design, and test-driven development, separating game logic from the user interface.

🚀 Features
    Ship System
        Ships track their length, hit count, and sunk status
        Methods include hit() and isSunk()
    Gameboard Logic
        Place ships at specific coordinates
        Handle attacks and determine hits or misses
        Track missed shots
        Check if all ships are sunk
    Player System
        Supports both human and computer players
        Each player owns a dedicated gameboard
    Game Flow
    Turn-based gameplay
        Players attack enemy boards via coordinate selection
        Automatic win detection when all ships are sunk
    Computer AI
        Generates random, valid moves
        Avoids repeating previous attacks
    User Interface
        Dynamic rendering of both player boards
        Event-driven interactions using DOM methods
        Real-time updates after each move

🧠 Architecture
The project is structured into independent modules:

    Ship – Handles ship state and behavior
    Gameboard – Manages ship placement and attack logic
    Player – Controls player behavior and interactions
    Game Controller / DOM Module – Handles game flow, turns, and UI updates

🧪 Testing
Core game logic is tested using unit tests, focusing only on public interfaces to ensure reliability without exposing internal implementation details.

🎮 Gameplay
Start a new game with pre-placed ships
Click on enemy board coordinates to attack
Alternate turns between player and computer
Game ends when one side’s fleet is fully destroyed

⭐ Extra Enhancements (Optional)
Drag-and-drop ship placement
Two-player local mode
Smarter AI (targeting adjacent cells after a hit)
