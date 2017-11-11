// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

// Get our API routes
const api = require('./server/routes/api');

const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes
app.use('/api', api);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Socket IO settings
 */
const io = require('socket.io').listen(server);

io.on('connection', function(socket){
  console.log('a user connected');

  /**
   * Socket event for set timer.
   * Where timerInfo is strcture with next properties:
   *  duration - in milliseconds
   *  isPeriod - indicates that timer is for period otherwise it's a rest between periods
   *  title - number of the period or title for the rest (timeout).
   */
  socket.on('timer-set', function(timerInfo){
    setTimer(timerInfo);
    io.emit('timer-set', timerInfo);
  });

  // Socket event for start/resume timer
  socket.on('timer-start', function(){
    startTimer();
  });

  // Socket event for pause timer
  socket.on('timer-pause', function(){
    stopTimer();
  });

  // Socket event for set score
  socket.on('update-team-stat', function(teamStat){
    io.emit('update-team-stat', teamStat);
  });

  // Socket event for set next input team
  socket.on('next-input', function(teamId){
    io.emit('next-input', teamId);
  });

  // Socket event for set timeout
  socket.on('set-game-info', function(gameInfo){
    io.emit('set-game-info', gameInfo);
  });
});

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));

// additional functions and variables to control timer
function updateTimer() {
  const dateNow = Date.now();
  timerValueInMS -= dateNow - timerLastTime;
  timerLastTime = dateNow;
  if(timerValueInMS <= 0){
    timerValueInMS = 0;
    // stop timer immediately
    stopTimer();
  }

  // fire update timer value event
  raiseUpdateTimerEvent();
}

function startTimer(){
  if (timerRef){
    return;
  }

  timerLastTime = Date.now();
  timerRef = setInterval(updateTimer, interval);
  setImmediate(updateTimer);
}

function stopTimer(){
  console.log('stop timer was called');
  console.log('timerRef is' + timerRef);
  if (!timerRef){
    return;
  }

  clearInterval(timerRef);
  timerRef = null;
}

function setTimer(timerInfo){
  stopTimer();
  timerValueInMS = timerInfo.duration;
  raiseUpdateTimerEvent();
}

function raiseUpdateTimerEvent(){
  io.emit('update-timer', timerValueInMS);
}

let timerValueInMS = 0;
let timerLastTime = 0;
const interval = 100; // in milliseconds
let timerRef = null;


