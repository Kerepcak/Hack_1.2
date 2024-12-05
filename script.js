// Elementy HTML
const startButton = document.getElementById('startButton');
const centerBox = document.getElementById('centerBox');
const activeZone = document.getElementById('activeZone');
const gameOverMessage = document.createElement('div'); // Nowy element na napis "Hack Nieudany"
const countdownBar = document.createElement('div'); // Nowy element na pasek odliczający

// Litery do gry
const letters = ['A', 'S', 'D', 'F', 'G', 'H'];

// Zmienna do śledzenia kwadracików w aktywnej strefie
let activeBoxes = new Set(); // Zbiór liter kwadratów w aktywnej strefie
let gameOver = false; // Flaga do sprawdzania, czy gra została zakończona

let isGameRunning = false; // Flaga określająca, czy gra jest już uruchomiona

// Rozpoczęcie gry po kliknięciu Start
startButton.addEventListener('click', startGame);

// Globalne nasłuchiwanie klawiszy podczas gry
document.addEventListener('keydown', (event) => {
  if (gameOver) return; // Jeśli gra się zakończyła, ignorujemy klawisze
  const pressedLetter = event.key.toUpperCase();

  if (letters.includes(pressedLetter) && !activeBoxes.has(pressedLetter)) {
    // Jeśli naciśnięta litera nie jest w aktywnych kwadratach
    endGame();
  }
});

let collectedBoxes = 0; // Liczba zebranych kwadratów
const totalBoxes = 30; // Całkowita liczba kwadratów, które mają być zebrane

function startGame() {
  if (isGameRunning || gameOver) return; // Zabezpieczenie przed wielokrotnym uruchomieniem gry

  isGameRunning = true;     // Ustawienie flagi, że gra działa
  isPaused = false;         // Wyłączenie pauzy
  collectedBoxes = 0;       // Reset liczby zebranych kwadratów
  gameOver = false;         // Ustawienie flagi, że gra się nie skończyła

  activeZone.classList.add('active'); 
  gameOverMessage.remove(); 
  countdownBar.style.width = '0%';

  activeBoxes.clear(); 

  gameInterval = setInterval(() => {
      if (!gameOver) {
          createFallingBox(getRandomLetter());
      }
  }, 500);
}


// Funkcja do losowania litery
function getRandomLetter() {
  const randomIndex = Math.floor(Math.random() * letters.length);
  return letters[randomIndex];
}

// Funkcja tworząca spadający kwadracik
function createFallingBox(letter) {
  const box = document.createElement('div');
  box.classList.add('fallingBox');
  box.textContent = letter;

  const maxDistanceFromCenter = 250;
  const centerX = centerBox.clientWidth / 2;
  const randomOffset = Math.random() * maxDistanceFromCenter * 2 - maxDistanceFromCenter;

  box.style.left = `${centerX + randomOffset - 30}px`;
  box.style.top = '-100px';
  centerBox.appendChild(box);

  let position = -50;
  let inActiveZone = false;
  let isFalling = true;

function fall() {
    // Jeśli gra jest zakończona, zatrzymaj animację
    if (gameOver) {
        return; // Zatrzymaj animację, jeśli gra się skończyła
    }

    if (isFalling) {
        position += 8;
        box.style.top = `${position}px`;
    }

    const activeZoneTop = centerBox.clientHeight - 210;
    const activeZoneBottom = centerBox.clientHeight - 140;

    if (position >= activeZoneTop && position <= activeZoneBottom) {
        if (!inActiveZone) {
            inActiveZone = true;
            activeBoxes.add(letter); // Dodajemy literę kwadratu do aktywnych
            document.addEventListener('keydown', handleKeyPress);
        }
    } else if (position > activeZoneBottom && inActiveZone) {
        inActiveZone = false;
        activeBoxes.delete(letter); // Usuń literę po wyjściu ze strefy
        document.removeEventListener('keydown', handleKeyPress);

        // Dodajemy opóźnienie 1s, zanim zakończymy grę
        setTimeout(() => {
            endGame(); // Kończymy grę po 1s
        }, 200); // 1000ms = 1 sekunda
    }


    if (position < centerBox.clientHeight) {
        requestAnimationFrame(fall);
    } else {
        box.remove();
    }
}

function handleKeyPress(event) {
  if (event.key.toUpperCase() === letter) {
      isFalling = false; // Zatrzymaj spadanie
      box.remove(); // Usuń kwadracik natychmiast
      activeBoxes.delete(letter); // Usuń literę ze zbioru aktywnych
      document.removeEventListener('keydown', handleKeyPress); // Usuń nasłuch

      // Dodaj klasę podświetlenia do aktywnej strefy
      activeZone.classList.add('activeZoneGlow');

      // Usuń klasę podświetlenia po zakończeniu animacji (0.3s)
      setTimeout(() => {
          activeZone.classList.remove('activeZoneGlow');
      }, 300);

      // Zwiększ liczbę zebranych kwadratów
      collectedBoxes++;

      // Jeśli zebrano wszystkie kwadraty, zakończ grę pozytywnie
      if (collectedBoxes >= totalBoxes) {
          endGame(true); // Przekazujemy true do zakończenia gry z pozytywnym komunikatem
      }
  }
}

  requestAnimationFrame(fall);
}

// Funkcja kończąca grę
function endGame(success = false) {
  if (isPaused) return; // Jeśli gra jest w stanie pauzy, nie kończ gry

  gameOver = true;
  isGameRunning = false; // Zresetowanie flagi po zakończeniu gry

  const allBoxes = document.querySelectorAll('.fallingBox');
  allBoxes.forEach(box => box.remove());

  // Tworzymy komunikat o wyniku gry
  const resultMessage = document.createElement('div');
  resultMessage.classList.add('gameOverMessage');

  // Tworzymy elementy na wynik gry i liczbę zebranych kwadratów
  const statusMessage = document.createElement('div');
  const collectedMessage = document.createElement('div');

  if (success) {
      statusMessage.textContent = 'Hack Udany!';
  } else {
      statusMessage.textContent = 'Hack Nieudany!';
  }

  const collectedText = `Zebrano `;
  const collectedNumber = document.createElement('span');
  collectedNumber.textContent = collectedBoxes; // Wstawiamy liczbę zebranych kwadratów

  // Ustawiamy kolor liczby w zależności od wyniku gry
  if (success) {
      collectedNumber.style.color = 'green'; // Kolor zielony dla wygranej
  } else {
      collectedNumber.style.color = 'red'; // Kolor czerwony dla przegranej
  }

  collectedMessage.textContent = collectedText; // Tekst przed liczbą
  collectedMessage.appendChild(collectedNumber); // Dodajemy liczbę jako osobny element

  // Dodajemy komunikaty do kontenera
  resultMessage.appendChild(statusMessage); // Komunikat o wyniku
  resultMessage.appendChild(collectedMessage); // Liczba zebranych kwadratów

  // Dodajemy kontener z komunikatem na ekranie
  centerBox.appendChild(resultMessage); // Ta linia dodaje komunikaty do DOM

  startCountdownBar(); // Uruchamiamy pasek odliczania (jeśli jest)

  // Zresetowanie gry
  removeAllFallingBoxes();  // Usuwamy wszystkie spadające kwadraciki
  resetGameState();         // Resetujemy stan gry
}


// Nasłuch na klawisze
document.addEventListener('keydown', (event) => {
  // Jeśli gra jest zakończona, ignorujemy naciśnięcie klawisza
  if (gameOver) return;

  // Spacja = Start gry
  if (event.code === 'Space') {
      startGame();
  }

  // `R` = Restart gry + usunięcie komunikatów
  if (event.code === 'KeyR' || event.code === 'Keyr') {
      clearGameOverMessages(); // Usuwamy komunikaty o zakończeniu gry
      restartGame();            // Restart gry
  }
});

// Nasłuch na klawisze
document.addEventListener('keydown', (event) => {
  // `R` = Restart gry + usunięcie komunikatów
  if (event.code === 'KeyR' || event.code === 'Keyr') {
      clearGameOverMessages(); // Usuwamy komunikaty o zakończeniu gry
      removeGameOverMessage();
      restartGame();            // Restart gry
  }
});



restartButton.addEventListener('click', () => {
  removeGameOverMessage();  // Usunięcie komunikatu o końcu gry natychmiastowo
  resetGameState();         // Resetowanie gry do stanu początkowego
});

let isPaused = false; // Nowa zmienna kontrolująca, czy gra jest wstrzymana

let gameInterval; // Dodaj globalną zmienną do przechowywania interwału gry

function resetGameState() {
  clearInterval(gameInterval);       // Zatrzymanie interwału generującego kwadraty
  removeAllFallingBoxes();           // Usunięcie wszystkich spadających kwadratów
  activeBoxes.clear();               // Wyczyść zestaw aktywnych liter
  isPaused = true;                   // Wstrzymanie gry
  isGameRunning = false;             // Flaga oznaczająca, że gra nie działa
  collectedBoxes = 0;                // Zresetowanie liczby zebranych kwadratów
  gameOver = false;                  // Zresetowanie flagi zakończenia gry
  document.removeEventListener('keydown', handleKeyPress); // Usuwamy nasłuch klawiszy
}

function removeGameOverMessage() {
  // Usunięcie komunikatu o zakończeniu gry (np. "Hack Udany!" czy "Hack Nieudany!")
  const gameOverMessage = document.querySelector('.gameOverMessage');
  if (gameOverMessage) {
      gameOverMessage.remove(); // Usuwamy element z komunikatem
  }

  const collectedText = document.querySelector('#collectedText');
  if (collectedText) {
      collectedText.remove(); // Usuwamy element z liczbą zebranych kwadratów
  }
}

function restartGame() {
    clearInterval(gameInterval);  // Zatrzymanie pojawiania się nowych kwadratów
    removeAllFallingBoxes();      // Usunięcie wszystkich obecnych kwadratów
    isPaused = true;              // Włączenie pauzy
    isGameRunning = false;        // Zresetowanie flagi gry
    collectedBoxes = 0;           // Reset liczby zebranych kwadratów
    gameOver = false;             // Ustawienie flagi, że gra się nie skończyła
}


function clearGameOverMessages() {
  // Usunięcie komunikatu o zakończeniu gry (np. "Hack Udany!" czy "Hack Nieudany!")
  const gameOverMessage = document.querySelector('.gameOverMessage');
  if (gameOverMessage) {
      gameOverMessage.remove(); // Usuwamy element z komunikatem
  }

  // Usunięcie komunikatu o zebranych kwadratach
  const collectedText = document.querySelector('#collectedText');
  if (collectedText) {
      collectedText.remove(); // Usuwamy element z liczbą zebranych kwadratów
  }
}


// Funkcja do usuwania wszystkich spadających kwadratów
function removeAllFallingBoxes() {
    const allBoxes = document.querySelectorAll('.fallingBox');
    allBoxes.forEach(box => box.remove());
}
function removeAllFallingBoxes() {
    const allBoxes = document.querySelectorAll('.fallingBox');
    allBoxes.forEach(box => box.remove());
}


