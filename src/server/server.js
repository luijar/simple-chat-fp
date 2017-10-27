import WebSocket from 'ws'
import { join, compose, map, tap, curry, forEach, filter, head, identity, defaultTo, prop } from 'ramda'
import { prettyDate, foldM, orElse, on, composeMessage, fork, logStr } from '../shared/util'
import { store, addHistory } from './store'
import validateMessage from './validation'
import HistoryLog from './history'
import IO from 'io-monad'

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
    IO.runIO,
    IO.of,
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
const asHistory = ({name, msg}) => HistoryLog(`New message received from user ${name}\n`, [{time: Date.now(), msg}])

// Adds some formatting to log
// formatLog :: String -> String
const formatLog = identity  // for now keep the same

// Handle incomming mesage, and emit to all other connections
// This function contains a side effect upon exit
// emitMessage :: Store -> WebSocketServer -> WebSocket -> String -> Void
const emitMessage = curry((store, server, connection) =>
   compose(
     orElse(compose(IO.runIO, IO.of, logStr, join('\n'))),
     map(compose(storeNewHistory(store), asHistory, formatLog)),  //TODO: map a lens over the msg attr to JSON.stringify
     map(broadcast(() =>
        // Use a thunk here to make this operation lazy
        Array.from(server.clients)
             .filter(c => c !== connection && c.readyState === WebSocket.OPEN))
     ),
     validateMessage,
     JSON.parse
   )
 )

const handleConnection = curry((store, server, connection) => on('message', emitMessage(store, server), connection))

const listenConnections = store => on('connection', handleConnection(store))

const initServer = port => new WebSocket.Server({ port })

const render = () => {
    //TODO: Write to file
    // return an IO from render
    // Fold (reduce) all history into one
    foldM(HistoryLog)(store.getState()['history'])
       // Format the history log
       .bimap(String, Array)(identity, map(fork(
         (a, b) => `${a}: ${b}`,
         compose(prettyDate, prop('time')),
         prop('msg')))
       )
       .merge((a,b) => console.log(a,b))
}

const unsubscribe = store.subscribe(render)

// Handle exit event and dump the history into a log file
Array.from(['SIGINT']).forEach(e => {
  process.on(e, () => {
    // TODO: wrap all of these effects into an IO
    render(store.getState()['history'])
    unsubscribe()
    process.exit()
  })
})
