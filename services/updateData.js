
/*
 * The second argument of the callback must always be updated state.
 * The third argument of the callback is what will be sent back to the player over socket.
 */
module.exports = function({player, cmd, args}, state, callback) {
  switch(cmd) {
    case 'sendState':
      callback(null, state);
      return;
    case 'pickQuestion':
      pickQuestion(args, state, callback);
      return;
    case 'hitBuzzer':
      playerHitsBuzzer(player, state, callback);
      return;
    case 'answer':
      playerAnswersQuestion(args, state, callback);
  }
};

function pickQuestion({row, col}, state, callback) {
  // TODO: Mark Picked Question as opened
  const question = state.questions[col][row];
  question.opened = true;
  // if(question.opened){
  //   console.log(state.countQues);
  //   state.countQues = state.countQues + 1;
  // }


  // TODO: Clear Cue
  state.cue = false;

  // TODO: Set Current Question
  state.currQuestion = question;
  state.currQuestion.row =  row;
  state.currQuestion.col = col;
  state.row = row;
  state.col = col;

  // TODO: Send playerPicksQuestion to client
  callback(null, state);
}

function playerHitsBuzzer(player, state, callback) {
  // TODO: Update Cue
      state.cue = player;
  // TODO: Send Options
      var index = Math.floor(Math.random() * 4 + 1);
      console.log(index);
      state.currQuestion.options.splice(index, 0, state.currQuestion.subject);
      // state.currQuestion.options = state.currQuestion.options.concat(state.currQuestion.subject);
      console.log(state);
      callback(null, state);
}

function playerAnswersQuestion(args, state, callback) {

    console.log('Entered Answers-------------------------');
    console.log('Args', args);
    console.log('---------------------------------------------');
    console.log('State', state);
    //Check Answer is Correct or wrong
    // TODO: Update Score
    if(state.currQuestion.subject === args) {
      state.answeredCorrect = true;
      console.log('True Answer');
      state.scores.forEach(function(playerInfo) {
            if(playerInfo.player === state.cue) {
              playerInfo.score = playerInfo.score + ((state.currQuestion.row + 1)*200);
              state.currQuestion = false;
            }
      })
      state.completed = state.questions.every( (col)=> {
        return col.every((question) => {
            return question.opened
        })
      })
    }
    //Set Cue to another player is answer is wrong
    else {
        state.answeredCorrect = false;
        for(let i = 0 ; i < state.scores.length; i = i + 1) {
          console.log('Wrong Answer');
          console.log("Cue", state.cue);
          if(state.scores[i].player === state.cue) {
            console.log("Player info",state.scores[i]);
            state.cue = state.scores[ (i+1) % 3].player;
            break;
          }
        }
    }
  // TODO: Cue
  // TODO: currQues
      callback(null, state);
}
