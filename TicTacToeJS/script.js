let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#Reset");
let newBtn = document.querySelector("#New");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let winnerModal = document.getElementById("winnerModal");
let modalMsg = document.getElementById("modalMsg");

let turnO = true; // true: O's turn, false: X's turn
let gameOver = false;

const winningPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function showMsg(text) {
  msg.innerText = text;
  msgContainer.classList.remove("hide");
}

function hideMsg() {
  msgContainer.classList.add("hide");
}

function enableBoxes() {
  boxes.forEach((box) => {
    box.disabled = false;
    box.innerText = "";
    box.classList.remove("x", "o");
  });
}

function disableBoxes() {
  boxes.forEach((box) => {
    box.disabled = true;
  });
}

function showWinnerModal(winner) {
  modalMsg.innerText = `Congratulations! ${winner} won!`;
  winnerModal.classList.add("show");
}

function checkWinner() {
  for (let pattern of winningPatterns) {
    let pos1val = boxes[pattern[0]].innerText;
    let pos2val = boxes[pattern[1]].innerText;
    let pos3val = boxes[pattern[2]].innerText;
    if (pos1val !== "" && pos1val === pos2val && pos2val === pos3val) {
      showMsg(`Winner: ${pos1val}`);
      showWinnerModal(pos1val);
      gameOver = true;
      disableBoxes();
      return;
    }
  }
  // Check for draw
  let isDraw = Array.from(boxes).every((box) => box.innerText !== "");
  if (isDraw) {
    showMsg("It's a Draw!");
    gameOver = true;
  }
}

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (box.innerText !== "" || gameOver) return;
    if (turnO) {
      box.innerText = "O";
      box.classList.add("o");
      turnO = false;
    } else {
      box.innerText = "X";
      box.classList.add("x");
      turnO = true;
    }
    box.disabled = true;
    checkWinner();
  });
});

function resetGame(showNewMsg = false) {
  turnO = true;
  gameOver = false;
  enableBoxes();
  if (showNewMsg) {
    showMsg("New game started! Your turn: O");
  } else {
    hideMsg();
  }
}

resetBtn.addEventListener("click", () => resetGame(false));
newBtn.addEventListener("click", () => {
  resetGame(true);
  winnerModal.classList.remove("show");
});

// Hide message at start
hideMsg();
