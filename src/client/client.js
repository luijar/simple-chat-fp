import WebSocket from 'ws'
import readline from 'readline'
import { compose, curry, curryN, tap, prop, chain } from 'ramda'
import { composeMessage, on, logMsg, logStr } from '../shared/util'
import IO from 'io-monad'

/**
 * Chat client
 * node dist/main.js --mode=client --port=1337 --name=Bob
 *
 * For debugging:
 * wscat -c ws://echo.websocket.org
 * @see http://websockets.github.io/ws/
 */

const prompt = 'chat > '

// Driver
// Initialize WebSocket client, open a connection with a listening server,
// and send/respond-to messages
export default curry((port, name) =>
  compose(
    IO.runIO,
    IO.of,
    logStr(`Starting websocket client on ${port} and name ${name}`),
    listenMessages,
    openConnection(name),
    initClient
  )(port)
)

const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt
})

// use a contravariant that can accept messages, apply some behavior, then keep listening for messages

const handleMessage = connection =>
  compose(
    // Run the effect
    IO.runIO,
    // At the end prompt the user using the configured CLI reader
    chain(promptUser(reader)),
    // tap(io => console.log('Debug', io)),
    // Lift effect into an IO
    IO.of,
    // Effectul function
    logMsg,
    // Extract the message property
    prop('msg'),
    // Parse the message object broadcasted from server
    JSON.parse
  )

const promptUser = reader => () => IO.of(reader.prompt)

const listenMessages = on('message', handleMessage)

/*
//
//     rl.on('line', function (data) {
//       ws.send(composeMessage(name, data.toString().trim()))
//       rl.prompt()
//     })
//      .on('close', function() {
//       logMsg('Have a great day!')
//       process.exit(0)
//     })
//     rl.prompt()
*/

const handleOpen = curry((name, reader, ws) => {

  // I could use flip with the original
  const on = curry((event, handle, handler) => handle.on(event, handler))

  return function open() { // Note: Could not use curry when calling a no-arg function at the end
    IO.of(on('close', reader))
       .ap(IO.of(() =>
         {
           //logMsg('Have a great day!')
           process.exit(0)
         }
       ))
       .runIO()

    IO.of(on('line', reader))
       .ap(IO.of(
         data => {
           ws.send(composeMessage(name, data.toString().trim()))
           reader.prompt()
         }
       ))
       .chain(promptUser(reader))
       .runIO()
  }
})

// Open the client connection
// openConnection :: String -> (String, Function, WebSocket -> ()) -> WebSocket
const openConnection = name => tap(on('open', handleOpen(name, reader)))

// Instantiate the WebSocket connection for the client
// initClient :: Number -> WebSocket
const initClient = port => new WebSocket(`ws://localhost:${port}`)
