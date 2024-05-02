// Cuando el DOM está completamente cargado, se ejecuta la función anónima
document.addEventListener("DOMContentLoaded", function () {
    // Se define la configuración del juego
    var gameConfig = {
        liveLook: ["./img/monster5.png", "./img/monster4.png", "./img/monster3.png", "./img/monster2.png", "./img/monster1.png", "./img/monster0.png"],
        numberOfLives: 5
    };

    // Se define el estado del juego inicial
    var gameStatus = {
        status: "stopped",
        livesP1: gameConfig.numberOfLives,
        livesP2: gameConfig.numberOfLives,
        wordCompletedP1: "",
        wordCompletedP2: "",
        roomName: "",
        roomPwd: "",
        currentPlayer: "P1",
        isCreator: null
    };

    // Se obtienen elementos del DOM
    var divInfo = document.getElementById("info");
    var success = document.getElementById("game_success");
    var turnIndicator = document.getElementById("turn");
    var livesIndicator = document.getElementById("lives");
    var wordIndicator = document.getElementById("letters");
    var monsterImage = document.getElementById("monster");

    // Evento click para crear un nuevo juego
    document.getElementById("create_game").addEventListener("click", function () {
        startNewGame(true);
    });

    // Evento click para unirse a un juego existente
    document.getElementById("join_game").addEventListener("click", function () {
        startNewGame(false);
    });

    // Función para configurar un nuevo juego
    function configureNewGame(isCreator) {
        // Se establece si el jugador es el creador o se une al juego
        gameStatus.isCreator = isCreator;
        var actionType = isCreator ? "createGame" : "joinGame";
        
        // Se solicita al usuario ingresar el nombre y contraseña de la sala
        if (isCreator) {
            gameStatus.roomName = prompt("Ingresa el nombre de la sala:");
            gameStatus.roomPwd = prompt("Ingresa la contraseña de tu sala:");
        } else {
            gameStatus.roomName = prompt("Ingresa el nombre de la sala:");
            gameStatus.roomPwd = prompt("Ingresa la contraseña para unirte a la sala:");
        }

        // Se envía la solicitud al servidor
        var data = {
            action: actionType,
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
            console.log(actionType + ' response:', dataRespuesta);
            // Se actualiza el estado del juego y el turno del jugador
            gameStatus.status = "playing";
            gameStatus.currentPlayer = isCreator ? "P1" : "P2";
            updateGameStatus();
        })
        .catch(error => {
            console.error('Error in ' + actionType, error);
        });
    }

    // Función para iniciar un nuevo juego
    function startNewGame(isCreator) {
        configureNewGame(isCreator);
    }

    // Se ejecuta la actualización del juego cada 2 segundos
    setInterval(function () {
        if (gameStatus.status === "playing") {
            updateGameStatus();
        }
    }, 2000);

    // Función para actualizar el estado del juego
    function updateGameStatus() {
        // Se envía una solicitud para obtener información del juego al servidor
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
            // Se actualiza la interfaz de usuario con la información del juego
            gameStatus.currentPlayer = dataRespuestaInfo.player;
            turnIndicator.textContent = "Turno: " + gameStatus.currentPlayer;
            gameStatus.livesP1 = dataRespuestaInfo.gameInfo.livesP1;
            gameStatus.livesP2 = dataRespuestaInfo.gameInfo.livesP2;
            var currentPlayerLives = gameStatus.isCreator ? gameStatus.livesP1 : gameStatus.livesP2;
            livesIndicator.innerHTML = currentPlayerLives + " LIVES LEFT";
            var wordProgress = dataRespuestaInfo.gameInfo.wordCompleted;
            wordIndicator.innerHTML = wordProgress;
            monsterImage.src = gameConfig.liveLook[currentPlayerLives];
            // Se verifica si el juego ha terminado y se muestra el resultado
            if(gameStatus.currentPlayer == "P1") {
                var winner = "P2"
                var loser = "P1"
            } else {
                var winner = "P1"
                var loser = "P2"
            }
            
            if (!wordProgress.includes('_')) {
                showResults(winner, loser);
            } else if (currentPlayerLives === 0) {
                showResults(loser, winner);
            }
        })
        .catch(error => console.error('Error updating game info:', error));
    }
    
    // Función para mostrar los resultados del juego
    function showResults(winner, loser) {
        divInfo.style.display = "block";
        success.style.display = "block";
        success.textContent = winner + " ha guanyat!" + " I el " + loser + " ha perdut!!";
        gameStatus.status = "stopped";
    
        var okButton = document.getElementById("btn_ok");
        okButton.onclick = function () {
            divInfo.style.display = "none";
            success.style.display = "none";
            gameStatus.status = "stopped";
        };
    }
    
    // Evento de tecla presionada para jugar
    document.addEventListener("keypress", function (event) {
        // Se verifica si es el turno del jugador y el juego está en curso
        if (gameStatus.status !== "playing" || gameStatus.currentPlayer !== (gameStatus.isCreator ? "P1" : "P2")) {
            console.log("No es tu turno o el juego no está activo.");
            return;
        }

        // Se obtiene la letra presionada
        var letra = event.key.toLowerCase();
        // Se verifica si la tecla presionada es una letra
        if (/^[a-z]$/.test(letra)) {
            playGame(letra);
        }
    });

    // Función para jugar una letra
    function playGame(letra) {
        // Se verifica si es el turno del jugador
        if (gameStatus.currentPlayer !== (gameStatus.isCreator ? "P1" : "P2")) {
            alert("¡No es tu turno!");
            return;
        }

        // Se envía la letra jugada al servidor
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
                updateGameStatus();
            } else {
                console.error('Error en la jugada:', dataRespuesta.response);
            }
        })
        .catch(error => {
            console.error('Error jugando:', error);
        });
    }
});
