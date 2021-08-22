const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

//Game does not invite a min lower than 1, variable is global
let min = 1;

//variable to hold base number of computer's attempt at guessing
let guessTries = 1;

//Main body of guessing game
async function start() {
  let whichGame = await ask(
    `\n Let's have some fun! Do you want me to guess your number, or you guess mine? \n \n Enter "guess" if you want to do the guessing, or "number" if you want to have the secret number. \n`
  );
  //sanitize user input
  whichGame = whichGame.toLowerCase();

  //if the player wants to guess the computer's number
  if (whichGame === "guess") {
    //choosing random number between 1 and 10
    let compNum = Math.floor(Math.random() * 10) + 1;

    let userGuess = await ask(
      `\n Ok! To make it easy on you, my number is between 1 and 10. What is your guess? \n`
    );

    //game break detector = if "secretNum" is not a number OR "secretNum" is greater than max
    if (isNaN(userGuess)) {
      console.log(`\n Play along or don't play at all!`);
      process.exit();
    } else if (userGuess > 10) {
      console.log(`\n Hey! I said between 1 and 10!`);
      process.exit();
    }

    //ensuring no type conflict
    userGuess = parseInt(userGuess);

    //what happens if the player guesses compNum initially
    while (userGuess === compNum) {
      let playMore = await ask(
        `\n Wow! You guessed it. Do you want to play again? Enter 'yes' or 'no'.\n`
      );
      playMore = playMore.toLowerCase();

      if (playMore === "yes") {
        start();
      } else {
        console.log(`\n Thanks for having fun!`);
        process.exit();
      }
    }

    //what happens if the player does not initially guess compNum
    while (userGuess !== compNum) {
      //holding the next player guess
      let nextGuess = await ask(`\n That's not quite it. Guess again!\n`);

      //ensuring no type conflict
      nextGuess = parseInt(nextGuess);

      //if their nextGuess is equal to compNum (win condition)
      if (nextGuess === compNum) {
        let playMore = await ask(
          `\n Wow! You guessed it. Do you want to play again? Enter 'yes' or 'no'. \n`
        );

        //sanitizing user input
        playMore = playMore.toLowerCase();

        //allowing player choice to play again
        if (playMore === "yes") {
          start();
        } else if (playMore === "no") {
          console.log(`\n Thanks for having fun!`);
          process.exit();
        } else {
          //game break detector = if player tries to say something other than yes or no
          console.log(`\n Guess you don't want to play again...`);
          process.exit();
        }
      }
    }
    //if the player wants the computer to guess their number
  } else if (whichGame === "number") {
    //allowing user to put in the max value
    let max = await ask(
      `\n Ok! You will pick a number between 1 and... oh... what do you want the max value to be?\n`
    );

    //game break detector = if "max" is not a number
    if (isNaN(max)) {
      console.log(`\n Play along or don't play at all!`);
      process.exit();
    }

    console.log(`\n You entered ${max}.`);

    //User inputs their guess
    let secretNum = await ask(
      `\n Now, enter your secret number here.\n\n (Don't worry, I can't see it.)\n`
    );

    console.log(`\n You entered ${secretNum}.`);
    //ensuring no type conflicts for cheat comparison
    secretNum = parseInt(secretNum);

    //game break detector = if "secretNum" is not a number OR "secretNum" is greater than max
    if (isNaN(secretNum)) {
      console.log(`\n Play along or don't play at all!`);
      process.exit();
    } else if (secretNum > max) {
      console.log(`\n Hey! You can't pick above your max!`);
      process.exit();
    }

    //Computer makes its guess
    let compNum = Math.floor((max - min) / 2);
    console.log(`Alright! Now: I am going to guess... ${compNum}.`);
    //player can confirm or deny if the guess was correct
    let guessCheck = await ask(
      `\n Enter 'Yes' if I am right and 'No' if I am wrong.\n`
    );

    //sanitizing user input
    guessCheck = guessCheck.toLowerCase();

    //game break detector = if player tries to say something other than yes or no
    if (guessCheck !== "yes" && guessCheck !== "no") {
      console.log(`\n Play along or don't play at all!`);
      process.exit();
    }

    //If first guess is correct
    while (guessCheck === "yes") {
      //asking if player wants to play again
      let playAgain = await ask(
        `Aha! Your number is ${compNum}. It took me ${guessTries} try. \n Do you wish to play again? Enter 'yes' or 'no'.`
      );
      playAgain = playAgain.toLowerCase();

      if (playAgain === "yes") {
        start();
      } else if (playAgain === "no") {
        console.log(`\n Don't feel too bad about losing! :-)`);
        process.exit();
      } else {
        //game break detector = if player tries to say something other than yes or no
        console.log(`\n Guess you don't want to play again...`);
        process.exit();
      }
    }

    //If first guess is incorrect, enter guessing loop
    while (guessCheck === "no") {
      //increments the variable holding the computer's tries at guessing
      ++guessTries;
      let newGuess = await ask(
        `\n Alright then. Enter an 'H' if my guess should be higher or an 'L' if my guess should be lower.\n Or, if I am correct, enter 'yes'.\n`
      );
      newGuess = newGuess.toLowerCase();

      //if the player states the next guess needs to be higher AND they aren't attempting to cheat
      if (newGuess === "h" && compNum < secretNum) {
        min = compNum + 1;
        compNum = Math.floor((max - min) / 2) + min;
        console.log(
          `I am going to guess... ${compNum}. It has taken me ${guessTries} guesses.`
        );

        //if the player states the next guess needs to be lower AND they aren't attempting to cheat
      } else if (newGuess === "l" && compNum > secretNum) {
        max = compNum - 1;
        compNum = Math.floor((max - min) / 2) + min;
        console.log(
          `I am going to guess... ${compNum}. It has taken me ${guessTries} guesses.`
        );

        //When computer guesses correctly during guessing loop
      } else if (newGuess === "yes") {
        //subtracts from the variable holding the computer tries at guessing so it matches the actual winning number
        --guessTries;
        //asking if player wants to play again
        let playAgain = await ask(
          `Aha! Your number is ${compNum}. It took me ${guessTries} tries. Do you wish to play again? Enter 'yes' or 'no'.\n`
        );
        playAgain = playAgain.toLowerCase();

        if (playAgain === "yes") {
          start();
        } else if (playAgain === "no") {
          console.log(`\n Don't feel too bad about losing! :-)`);
          process.exit();
        } else {
          //game break detector = if player tries to say something other than yes or no
          console.log(`\n Guess you don't want to play again...`);
          process.exit();
        }
      }

      //cheat detector = if player enters H or L when the opposite is true
      else {
        console.log(`\n Why are you cheating?`);
        process.exit();
      }
    }
  } else {
    //game break detector = if player does not enter "guess" or "number"
    console.log(`\n Play along or don't play at all!`);
    process.exit();
  }
}
start();