import WebSocket from 'ws'
import { compose, map, tap, curry, forEach, filter, head, identity, defaultTo, prop } from 'ramda'
import isMessageValid from './validation'
import { History, cleanUp } from './history'
import { prettyDate, foldM, orElse, on, composeMessage } from './util'
import { logStr } from './io'

/**
* Chat Server
*
* npm run-script transpile
* node dist/main.js --mode=server --port=1337
* @see http://websockets.github.io/ws/
*/

// Store all conversation history
const history = []  // use immutable list?
const users = []

// Driver
// Initialize server and begin listening for new connections
export default curry((port, name) =>
  compose(
    logStr(`Started Websocket server on port ${port} and server name ${name}. You can terminate the program at any time by pressing Ctrl + C`),
    listenConnections,
    initServer
  )(port)
)

const send = curry((msg, connection) => connection.send(composeMessage('server', msg)) || msg)

// Send a message out to any open connections
// broadcast :: ( () -> Array) -> String -> String
const broadcast = curry((connectionsProvider, msg) => defaultTo(msg, head(map(send(msg), connectionsProvider()))))

// Add new message to global history
// addToHistory :: Array -> History -> Number
const addToHistory = curry((history, h) => history = history.push(h))

// Convert a new message to history
// asHistory :: String -> History
const asHistory = msg => History([Date.now()], msg)

// Adds a dividor between each log for ease of parsing
// formatLog :: String -> String
const formatLog = msg => msg + History.separator

// Handle incomming mesage, and emit to all other connections
// This function contains a side effect upon exit
// emitMessage :: WebSocketServer -> WebSocket -> String -> Void
const emitMessage = curry((server, connection) =>
   compose(
     orElse(logStr),
     map(compose(addToHistory(history), asHistory, formatLog, JSON.stringify)),
     map(broadcast(() =>
        // Use a thunk here to make this operation lazy
        Array.from(server.clients)
             .filter(c => c !== connection && c.readyState === WebSocket.OPEN))
     ),
     isMessageValid,
     JSON.parse
   )
 )

const handleConnection = curry((server, connection) => on('message', emitMessage(server), connection))

const listenConnections = on('connection', handleConnection)

const initServer = port => new WebSocket.Server({ port })

// Handle exit event and dump the history into a log file
Array.from(['SIGINT']).forEach(e => {
  process.on(e, () => {
    //TODO: Write to file
    console.log(
      // Fold (reduce) all history into one
      foldM(History)(history)
         // Format the history
         .bimap(map(prettyDate), cleanUp)
         //.bimap(identity, toFile)
         .toString())
    process.exit()
  })
})
