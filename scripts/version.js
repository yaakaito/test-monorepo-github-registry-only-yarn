#!/usr/bin/env node

const { program } = require('commander')
const semver = require('semver')
const { workspace, packages, updateWorkspace } = require('./lib/util')

const main = async() => {
    program.parse(process.argv)
    const log = console.log
    try {
        const ws = await workspace()
        console.log(ws)
        const version = semver.inc(ws.version, program.args[0])
        if (!version) {
            throw 'Invalid version'
        }
        const pkgs = await packages()
        for (const pkg of pkgs) {
            pkg.packageJson.version = version
            const { dependencies, peerDependencies } = pkg.packageJson
            for (const otherPackage of pkgs) {
                if (dependencies && dependencies[otherPackage.name]) {
                    dependencies[otherPackage.name] = version
                }
                if (peerDependencies && peerDependencies[otherPackage.name]) {
                    peerDependencies[otherPackage.name] = version
                }
            }
            await pkg.update()
        }
        await updateWorkspace({
            ...ws,
            version
        })
    }
    catch(e) {
        log(e)
    }
}

if (require.main === module) {
    main()
}
