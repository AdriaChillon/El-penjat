// Espera a que se cargue el contenido de la página antes de ejecutar el código
document.addEventListener("DOMContentLoaded", function () {

    // Configuración constante del juego
    var gameConfig = {
        liveLook: ["./img/monster5.png", "./img/monster4.png", "./img/monster3.png", "./img/monster2.png", "./img/monster1.png", "./img/monster0.png"],
        wordsToGuess: ["elefant", "criatura", "llapis", "maduixa", "ordinador", "teclat", "ratoli", "pantalla", "sistema", "arxiu", "programa", "curs", "taula", "video"],
        numberOfLives: 5,
    }

    // Estado del juego
    var gameStatus = {
        status: "stopped",
        lives: gameConfig.numberOfLives,
        wordToGuess: "",
        wordCompleted: "",
    }

    // Obtener referencias a elementos del DOM
    var divInfo = document.getElementById("info");
    var mensajes = document.querySelectorAll(".info_msg");
    var pista = document.getElementById("clue");

    // Configuración inicial cuando la página se carga
    window.onload = function () {
        // Muestra un mensaje inicial
        divInfo.style.display = "block";
        mensajes[0].style.display = "block";

        // Configura un botón "OK" para comenzar el juego y asegura que solo se ejecute una vez
        var okButton = document.getElementById("btn_ok");
        okButton.addEventListener("click", function () {
            divInfo.style.display = "none";
            mensajes[0].style.display = "none";
            startNewGame();
        }, { once: true });
    }

    // Inicia un nuevo juego
    function startNewGame() {
        gameStatus.lives = gameConfig.numberOfLives;
        gameStatus.wordCompleted = "";
        gameStatus.status = "playing";

        // Selecciona una palabra aleatoria para adivinar
        var indexRandom = Math.floor(Math.random() * gameConfig.wordsToGuess.length);
        gameStatus.wordToGuess = gameConfig.wordsToGuess[indexRandom];
        console.log(gameStatus.wordToGuess);

        // Inicializa la representación de la palabra a adivinar
        for (var i = 0; i < gameStatus.wordToGuess.length; i++) {
            gameStatus.wordCompleted += "_";
        }

        // Actualiza la interfaz de usuario
        document.getElementById("lives").innerHTML = gameConfig.numberOfLives + " LIVES LEFT";
        document.getElementById("monster").src = gameConfig.liveLook[5];
        document.getElementById("letters").innerHTML = gameStatus.wordCompleted;
    }

    // Agrega un event listener para las teclas presionadas
    addEventListener("keypress", function (event) {
        // Verifica si el juego está en curso
        if (gameStatus.status !== "playing") {
            return;
        }

        var letra = event.key.toLowerCase();
        if (/^[a-zA-Z]+$/.test(letra)) {
            if (gameStatus.wordToGuess.includes(letra)) {
                // Actualiza la palabra adivinada
                gameStatus.wordCompleted = gameStatus.wordCompleted.split("");
                for (let i = 0; i < gameStatus.wordToGuess.length; i++) {
                    if (letra == gameStatus.wordToGuess[i]) {
                        gameStatus.wordCompleted[i] = letra;
                    }
                }
                gameStatus.wordCompleted = gameStatus.wordCompleted.join("");
                document.getElementById("letters").innerHTML = gameStatus.wordCompleted;
            } else {
                // Reduce el número de vidas y actualiza la interfaz
                gameStatus.lives--;
                document.getElementById("monster").src = gameConfig.liveLook[gameStatus.lives];
                document.getElementById("lives").innerHTML = gameStatus.lives + " LIVES LEFT ";
            }

            // Comprueba si el juego ha terminado (ya sea por derrota o victoria)
            if (gameStatus.lives == 0) {
                gameOver();
            }
            if (gameStatus.wordCompleted == gameStatus.wordToGuess) {
                gameWin();
            }
        }
    });

    // Agrega un event listener para mostrar una pista al pasar el mouse
    pista.addEventListener("mouseenter", function () {
        if (gameStatus.status == "playing") {
            // Muestra una pista al revelar una letra no adivinada
            var letrasRestantes = [];
            for (var i = 0; i < gameStatus.wordToGuess.length; i++) {
                if (gameStatus.wordCompleted[i] === "_") {
                    letrasRestantes.push(i);
                }
            }
            var randomIndex = letrasRestantes[Math.floor(Math.random() * letrasRestantes.length)];
            pista.getElementsByTagName("span")[0].innerHTML = gameStatus.wordToGuess[randomIndex];
            gameStatus.lives--;

            // Actualiza la interfaz
            document.getElementById("lives").innerHTML = gameStatus.lives + " LIVES LEFT";
            document.getElementById("monster").src = gameConfig.liveLook[gameStatus.lives];

            // Comprueba si el juego ha terminado
            if (gameStatus.lives === 0) {
                gameOver();
            }
        }
    });

    // Restablece la pista cuando se retira el mouse
    pista.addEventListener("mouseleave", function () {
        pista.getElementsByTagName("span")[0].innerHTML = "?";
    });

    // Finaliza el juego y muestra un mensaje de derrota
    function gameOver() {
        divInfo.style.display = "block";
        mensajes[2].style.display = "block";
        gameStatus.status = "stopped";

        // Configura el botón "OK" para reiniciar el juego
        var okButton = document.getElementById("btn_ok");
        okButton.addEventListener("click", function () {
            divInfo.style.display = "none";
            mensajes[2].style.display = "none";
            gameStatus.status = "stopped";
        });
    }

    // Finaliza el juego y muestra un mensaje de victoria
    function gameWin() {
        divInfo.style.display = "block";
        mensajes[1].style.display = "block";
        gameStatus.status = "stopped";

        // Configura el botón "OK" para reiniciar el juego
        var okButton = document.getElementById("btn_ok");
        okButton.addEventListener("click", function () {
            divInfo.style.display = "none";
            gameStatus.status = "stopped";
            mensajes[1].style.display = "none";
        });
    }

    // Agrega un event listener al botón "new_game" para comenzar un nuevo juego
    var newGame = document.getElementById("new_game");
    newGame.addEventListener("click", function () {
        startNewGame();
    });
})
