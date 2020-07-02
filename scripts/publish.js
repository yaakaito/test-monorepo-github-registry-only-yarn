#!/usr/bin/env node

const { program } = require('commander')

const main = async() => {

    program.option('--patch', 'verbose logs', false)
    program.option('--minor', 'verbose logs', false)
    program.option('--major', 'verbose logs', false)
    program.parse(process.argv)

    const log = console.log

    try {
        logVerbose(program.args[0])
        throw new Error('Hi!')
    }
    catch(e) {
        logError(e.message)
    }
}

if (require.main === module) {
    main()
}
