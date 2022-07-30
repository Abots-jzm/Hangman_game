"use strict";

const dat1 = {
  category: "Popular book",
  answer: "The Hound of Baskerville",
};
const dat2 = {
  category: "Popular movie",
  answer: "Avengers infinity war",
};
const dat3 = {
  category: "Popular movie",
  answer: "Avengers endgame",
};
const dat4 = {
  category: "Phrase",
  answer: "If it ain't broke, don't fix it",
};

const data = [dat1, dat2, dat3, dat4];

const category = document.querySelector(".category");
const answers = document.querySelector(".answers__container");
const buttons = document.querySelectorAll(".letters__button");
const overlay = document.querySelector(".overlay");
const gameOverMessage = document.querySelector(".message");
const restartBtn = document.querySelector(".restart");
const livesBoxes = document.querySelectorAll(".lives__box");
const lettersContainer = document.querySelector(".letters__container");

const allAlphabets = "abcdefghijklmnopqrstuvwxyz".split("");

let lives = 4;
let chosenLetters = [];
let lettersSet;
let wordsArr;
let currentAnswer;
let activeData = data;
let currentDataIndex;
let currentData;

function setCurrentData() {
  currentDataIndex = Math.floor(Math.random() * data.length);
  currentData = activeData[currentDataIndex];
}

function displayInitializeData(data) {
  category.textContent = data.category;
  answers.innerHTML = "";

  currentAnswer = data.answer;
  wordsArr = currentAnswer.split(" ");
  lettersSet = new Set(data.answer.toLowerCase().split(""));
  lettersSet.delete(" ");

  let htmlText = "";

  wordsArr.forEach((word) => {
    let innerHtmlText = "";
    word.split("").forEach(() => {
      innerHtmlText += `<div class="answers__socket"></div>`;
    });

    htmlText = `
    <div class="answers__word">${innerHtmlText}</div>`;
    answers.insertAdjacentHTML("beforeend", htmlText);
  });
  handleSpecialCharacters();
}

function handleSpecialCharacters() {
  lettersSet.forEach((letter) => {
    if (!allAlphabets.includes(letter)) updateUI(letter);
  });
}

function updateUI(letter) {
  lettersSet.delete(letter);
  wordsArr.forEach((word, i) => {
    if (word.toLowerCase().includes(letter))
      [...word.toLowerCase()].forEach((wl, li) => {
        if (wl === letter) {
          const elementOfInterest = document.querySelector(
            `.answers__container :nth-child(${i + 1}) :nth-child(${li + 1})`,
          );
          elementOfInterest.textContent = letter;
          elementOfInterest.classList.add("answers__socket--filled");
        }
      });
  });
}

function gameOver() {
  gameOverMessage.textContent = "You Lost!";
  overlay.classList.remove("hidden");
}

function reset() {
  lives = 4;
  chosenLetters = [];
  lettersSet = null;
  wordsArr = null;
  currentAnswer = null;

  buttons.forEach((button) => {
    button.classList.remove("letters__button--clicked");
  });

  livesBoxes.forEach((box) => {
    box.classList.remove("lives__box--filled");
  });

  setCurrentData();
  displayInitializeData(currentData);
}

function removeLive() {
  const elementOfInterest = document.querySelector(
    `.lives :nth-child(${Math.abs(lives - 5)})`,
  );
  elementOfInterest.classList.add("lives__box--filled");
  lives--;

  if (lives <= 0) gameOver();
}

function nextLevel() {
  activeData.splice(currentDataIndex, 1);
  reset();
}

function checkForAnswer(letter) {
  if (lettersSet.has(letter)) updateUI(letter);
  else if (!chosenLetters.includes(letter)) removeLive();

  chosenLetters.push(letter);
  if (lettersSet.size === 0) nextLevel();
}

//EVENT LISTENERS
lettersContainer.addEventListener("click", (e) => {
  if (!e.target.classList.contains("letters__button")) return;

  e.target.classList.add("letters__button--clicked");
  checkForAnswer(e.target.textContent);
});

restartBtn.addEventListener("click", (e) => {
  e.preventDefault();
  reset();
  overlay.classList.add("hidden");
});

document.addEventListener("keydown", (e) => {
  const letter = e.key;
  if (!allAlphabets.includes(letter)) return;

  buttons.forEach((button) => {
    if (button.textContent === letter)
      button.classList.add("letters__button--clicked");
  });

  checkForAnswer(letter);
});

//Start
setCurrentData();
displayInitializeData(currentData);
