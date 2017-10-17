import commandLineArgs from 'command-line-args'
import usage from 'command-line-usage'
import color from 'cli-color'
import Maybe from 'data.Maybe'
import startClient from './client/client'
import startServer from './server/server'
import { ifElse, equals } from 'ramda'

const UNK = 'anonymous'

const optionList = [
  { name: 'verbose', alias: 'v', type: Boolean, description: 'Runs in DEBUG mode.' },
  { name: 'mode',    alias: 'm', type: String,  description: 'Run in client or server mode' },
  { name: 'port',    alias: 'p', type: Number,  description: 'Which port to run the chat application with' },
  { name: 'name',    alias: 'n', type: String,  description: 'Name of the server or client. For clients the name identifies the user' }
]
const argv = commandLineArgs(optionList)

Maybe.fromNullable(argv.mode)
 .map(ifElse(equals('client'), () => startClient, () => startServer))
 .ap(Maybe.fromNullable(argv.port))
 .ap(Maybe.fromNullable(argv.name).orElse(() => Maybe.of(UNK)))
 .orElse(printUsage)

function printUsage() {
  console.log(usage([
      {
        header: 'Simple chat',
        content: 'Simple NodeJS console chat application using FP'
      },
      {
        header: 'Options',
        optionList
      }]
  ))
}
