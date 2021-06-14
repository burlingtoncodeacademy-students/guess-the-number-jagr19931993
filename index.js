const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

//Game does not invite a min lower than 1, variable is global
let min = 1

start();
//Main body of guessing game
async function start() {
  console.log("Let's play a guessing game! You will pick a number between 1 and... oh... what do you want the max value to be?")
  //User inputs max range value
  console.log(`You entered ${max}.`)
  
  //User inputs their guess
  let secretNum = await ask("Now, enter your secret number here.\n(Don't worry, I can't see it.)")
  console.log(`You entered ${secretNum}.`)

  //Computer makes its guess
  let compNum = Math.floor((max - min) / 2);
  console.log(`Alright! Now: I am going to guess... ${compNum}.`)
  let guessCheck = await ask("Enter 'Yes' if I am right and 'No' if I am wrong.")

  //Sanitizing user input
  guessCheck = guessCheck.toLowerCase();

  //If first guess is correct
  while (guessCheck === "yes") {
    //Play again statements
    let playAgain = await ask(`Aha! Your number is ${compNum}. This just proves my superiority. Do you wish to try again? Enter 'yes' or 'no'.`)
    playAgain = playAgain.toLowerCase()

    if (playAgain === "yes") {
      start()
    }
    else if (playAgain === "no") {
      console.log("Don't feel too bad about losing! :-)")
      process.exit()
    }
  }

//If first guess is incorrect, enter guessing loop
  while (guessCheck === "no") {
    let newGuess = await ask("Alright then. Enter an 'H' if my guess should be higher or an 'L' if my guess should be lower.\nOr, if I am correct, enter 'yes'.")
    newGuess = newGuess.toLowerCase()

    if (newGuess === "h") {
      min = compNum + 1
      compNum = Math.floor((max - min) / 2) + min;
      console.log(`I am going to guess... ${compNum}.`)


    } else if (newGuess === "l") {
      max = compNum - 1
      compNum = Math.floor((max - min) / 2) + min;
      console.log(`I am going to guess... ${compNum}.`)
      
      //When computer guesses correctly during guessing loop
    } else if (newGuess === "yes") {
      //Play again statements
      let playAgain = await ask(`Aha! Your number is ${compNum}. This just proves my superiority. Do you wish to try again? Enter 'yes' or 'no'.`)
      playAgain = playAgain.toLowerCase()

      if (playAgain === "yes") {
        start()
      }
      else if (playAgain === "no") {
        console.log("Don't feel too bad about losing! :-)")
        process.exit()
      }
    }
  }
}


