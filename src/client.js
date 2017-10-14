import WebSocket from 'ws'
import readline from 'readline'
import { compose, curry, curryN, tap } from 'ramda'
import { cleanUp,  prettyDate, foldM, orElse, on, composeMessage } from './util'
import { logStr, logMsg } from './io'


/**
 * Chat client
 * node dist/main.js --mode=client --port=1337 --name=Bob
 *
 * For debugging:
 * wscat -c ws://echo.websocket.org
 * @see http://websockets.github.io/ws/
 */

// Driver
// Initialize WebSocket client, open a connection with a listening server,
// and send/respond-to messages
export default curry((port, name) =>
  compose(
    logStr(`Starting websocket client on ${port} and name ${name}`),
    listenMessages,
    openConnection(name),
    initClient
  )(port)
)

const handleMessage = connection =>
  compose(
    logMsg,
    JSON.parse
  )

const listenMessages = on('message', handleMessage)

const handleOpen = curry((name, ws) => {
  return function open() { // Note: Could not use curry when calling a no-arg function at the end
    ws.send(composeMessage(name, `Hello! This is ${name}`)) // Use an IO monad to drive this side effect an ap

    const rl = readline.createInterface(process.stdin, process.stdout)
    rl.on('line', function (data) {
      ws.send(composeMessage(name, data.toString().trim()))

      // prompt for next message
      rl.setPrompt('>', 1)
      rl.prompt();
    });
    rl.setPrompt('>', 1)
    rl.prompt();
  }
})

// Open the client connection
// openConnection :: String -> (String, Function, WebSocket -> ()) -> WebSocket
const openConnection = name => tap(on('open', handleOpen(name)))

// Instantiate the WebSocket connection for the client
// initClient :: Number -> WebSocket
const initClient = port => new WebSocket(`ws://localhost:${port}`)
