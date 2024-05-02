document.addEventListener("DOMContentLoaded", function () {
    // Configuración constante del juego
    var gameConfig = {
        liveLook: ["./img/monster5.png", "./img/monster4.png", "./img/monster3.png", "./img/monster2.png", "./img/monster1.png", "./img/monster0.png"],
        numberOfLives: 5,
    };

    // Estado del juego
    var gameStatus = {
        status: "stopped",
        lives: gameConfig.numberOfLives,
        wordCompleted: "",
        roomName: "",
        roomPwd: "",
        currentPlayer: "P1"
    };

    var divInfo = document.getElementById("info");
    var mensajes = {
        welcome: document.getElementById("welcome"),
        success: document.getElementById("game_success"),
        fail: document.getElementById("game_fail")
    };
    var btnOK = document.getElementById("btn_ok");
    var turnIndicator = document.getElementById("turn");

    // Configuración inicial cuando la página se carga
    window.onload = function () {
        // Muestra un mensaje inicial
        divInfo.style.display = "block";
        mensajes.welcome.style.display = "block";

        // Configura un botón "OK" para comenzar el juego y asegura que solo se ejecute una vez
        btnOK.addEventListener("click", function () {
            divInfo.style.display = "none";
            mensajes.welcome.style.display = "none";
            startNewGame();
        }, { once: true });
    }

    var newGameButton = document.getElementById("new_game");
    newGameButton.addEventListener("click", function () {
        startNewGame();
    });

    function startNewGame() {
        gameStatus.roomName = prompt("Insereix el nom de la sala:");
        gameStatus.roomPwd = prompt("Insereix la contrasenya de la teva sala:");
        var data = {
            action: "createGame",
            gameName: gameStatus.roomName,
            gamePassword: gameStatus.roomPwd
        };

        fetch('https://penjat.codifi.cat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(dataRespuesta => {
                console.log('Game created:', dataRespuesta);
                gameStatus.status = "playing"
                updateGameStatus();  // Update game status right after creating the game
            })
            .catch(error => {
                console.error('Error creating game:', error);
            });
    }

    function updateGameStatus() {
        var dataInfoGame = {
            action: "infoGame",
            gameName: gameStatus.roomName
        };

        fetch('https://penjat.codifi.cat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataInfoGame)
        })
            .then(response => response.json())
            .then(dataRespuestaInfo => {
                console.log('Game info updated:', dataRespuestaInfo);
                gameStatus.currentPlayer = dataRespuestaInfo.player;
                turnIndicator.textContent = "Turn: " + gameStatus.currentPlayer;
                gameStatus.lives = dataRespuestaInfo.gameInfo.livesP1;
                gameStatus.wordCompleted = dataRespuestaInfo.gameInfo.wordCompleted;

                document.getElementById("lives").innerHTML = gameStatus.lives + " LIVES LEFT";
                document.getElementById("letters").innerHTML = gameStatus.wordCompleted.split("").join(" ");
                document.getElementById("monster").src = gameConfig.liveLook[gameStatus.lives];

                if (gameStatus.lives === 0) {
                    gameOver();
                } else if (gameStatus.wordCompleted.indexOf('_') === -1) {
                    gameWin();
                }
            })
            .catch(error => console.error('Error updating game info:', error));
    }

    // Agrega un event listener para las teclas presionadas
    document.addEventListener("keypress", function (event) {
        if (gameStatus.status !== "playing") { // Asegura que el juego está en curso y es el turno del jugador
            return;
        }

        var letra = event.key.toLowerCase();
        if (/^[a-z]$/.test(letra)) { // Verifica que la tecla presionada es una letra
            playGame(letra);
        }
    });
    function playGame(letra) {
        var data = {
            action: "playGame",
            gameName: gameStatus.roomName,
            word: letra,
            player: gameStatus.currentPlayer
        };

        fetch('https://penjat.codifi.cat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(dataRespuesta => {
                console.log('Response:', dataRespuesta);
                if (dataRespuesta.status === "OK") {
                    if (dataRespuesta.response.includes("incorrect")) {
                        alert("Incorrect! You lose one life.");
                    } else {
                        alert("Correct!");
                    }
                    updateGameStatus(); // Actualiza el estado del juego después de cada jugada
                } else {
                    console.error('Game play error:', dataRespuesta.response);
                }
            })
            .catch(error => {
                console.error('Error playing game:', error);
            });
    }

    // Finaliza el juego y muestra un mensaje de derrota
    function gameOver() {
        divInfo.style.display = "block";
        mensajes.fail.style.display = "block";
        gameStatus.status = "stopped";

        // Configura el botón "OK" para reiniciar el juego
        var okButton = document.getElementById("btn_ok");
        okButton.addEventListener("click", function () {
            divInfo.style.display = "none";
            mensajes.fail.style.display = "none";
            gameStatus.status = "stopped";
        });
    }

    // Finaliza el juego y muestra un mensaje de victoria
    function gameWin() {
        divInfo.style.display = "block";
        mensajes.success.style.display = "block";
        gameStatus.status = "stopped";

        // Configura el botón "OK" para reiniciar el juego
        var okButton = document.getElementById("btn_ok");
        okButton.addEventListener("click", function () {
            divInfo.style.display = "none";
            gameStatus.status = "stopped";
            mensajes.success.style.display = "none";
        });
    }
});
