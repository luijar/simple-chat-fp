import WebSocket from 'ws'
import { compose, map, tap, curry, forEach, filter, head, identity } from 'ramda'
import isMessageValid from './validation'
import { History } from './history'
import { cleanUp,  prettyDate, foldM, orElse, on, composeMessage } from './util'
import { logStr } from './io'

/**
* Chat Server
*
* npm run-script transpile
* node dist/main.js --mode=server --port=1337
* @see http://websockets.github.io/ws/
*/

// Store all conversation history
const history = []
const users = []

// Driver
export default curry((port, name) =>
  compose(
    logStr(`Started Websocket server on port ${port} and server name ${name}`),
    listenConnections,
    initServer
  )(port)
)

const send = curry((msg, connection) => connection.send(composeMessage('server', msg)) || msg)

// Send a message out to any open connections
// broadcast :: ( () -> Array) -> String -> String
const broadcast = curry((connectionsProvider, msg) => tap(() => map(send(msg), connectionsProvider())))

// Add new message to global history
// addToHistory :: Array -> String -> Number
const addToHistory = curry((history, h) => history.push(h))

// Convert a new message to history
// asHistory :: String -> History
const asHistory = (msg) => History(Date.now(), msg)

// Handle incomming mesage, and emit to all other connections
// This function contains a side effect upon exit
// emitMessage :: WebSocketServer -> WebSocket -> String -> Void
const emitMessage = curry((server, connection) =>
   compose(
     orElse(logStr),
     //map(logStr),
     map(compose(addToHistory(history), asHistory)),
     map(broadcast(() => filter(c => c !== connection && c.readyState === WebSocket.OPEN, Array.from(server.clients)))),     
     isMessageValid,
     JSON.parse
   )
 )

const handleConnection = curry((server, connection) => on('message', emitMessage(server), connection))

const listenConnections = on('connection', handleConnection)

const initServer = port => new WebSocket.Server({ port })

// Handle exit event
Array.from(['exit', 'SIGINT']).forEach(e => {
  process.on(e, () => {
    //TODO: Write to file
    console.log(
      foldM(History)(history)
         .bimap(prettyDate, cleanUp)
         //.bimap(identity, toFile)
         .toString())
    process.exit()
  })
})
