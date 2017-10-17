import WebSocket from 'ws'
import { compose, map, tap, curry, forEach, filter, head, identity, defaultTo, prop } from 'ramda'
import isMessageValid from './validation'
import { History, cleanUp } from './history'
import { prettyDate, foldM, orElse, on, composeMessage } from '../shared/util'
import { logStr } from '../shared/io'
import { store, addHistory } from './store'

/**
* Chat Server
*
* npm run-script transpile
* node dist/main.js --mode=server --port=1337
* @see http://websockets.github.io/ws/
*/

// Driver
// Initialize server and begin listening for new connections
export default curry((port, name) =>
  compose(
    logStr(`Started Websocket server on port ${port} and server name ${name}. You can terminate the program at any time by pressing Ctrl + C`),
    listenConnections(store),
    initServer
  )(port)
)

const send = curry((msg, connection) => connection.send(composeMessage('server', msg)) || msg)

// Send a message out to any open connections
// broadcast :: ( () -> Array) -> String -> String
const broadcast = curry((connectionsProvider, msg) => defaultTo(msg, head(map(send(msg), connectionsProvider()))))

// Add new message to global history
// addToHistory :: Array -> History -> Number
const storeNewHistory = curry((store, h) => store.dispatch(addHistory(h)))

// Convert a new message to history
// asHistory :: String -> History
const asHistory = msg => History(Date.now(), msg)

// Adds a dividor between each log for ease of parsing
// formatLog :: String -> String
const formatLog = msg => msg + History.separator

// Handle incomming mesage, and emit to all other connections
// This function contains a side effect upon exit
// emitMessage :: Store -> WebSocketServer -> WebSocket -> String -> Void
const emitMessage = curry((store, server, connection) =>
   compose(
     orElse(logStr),
     map(compose(storeNewHistory(store), asHistory, formatLog, JSON.stringify)),
     map(broadcast(() =>
        // Use a thunk here to make this operation lazy
        Array.from(server.clients)
             .filter(c => c !== connection && c.readyState === WebSocket.OPEN))
     ),
     isMessageValid,
     JSON.parse
   )
 )

const handleConnection = curry((store, server, connection) => on('message', emitMessage(store, server), connection))

const listenConnections = store => on('connection', handleConnection(store))

const initServer = port => new WebSocket.Server({ port })

const render = () => {
  console.log(store.getState())
    //TODO: Write to file
    // Fold (reduce) all history into one
    // foldM(History)(store.getState()['history'])
    //    // Format the history log
    //    //.bimap(Array, String)(compose(map(prettyDate), map(prop('time'))), cleanUp)
    //    .merge((a,b) => console.log(a,b))
}

const unsubscribe = store.subscribe(render)

// Handle exit event and dump the history into a log file
Array.from(['SIGINT']).forEach(e => {
  process.on(e, () => {
    render()
    unsubscribe()
    process.exit()
  })
})
