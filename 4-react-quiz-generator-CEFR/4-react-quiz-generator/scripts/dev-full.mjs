import { spawn } from 'node:child_process'

const start = (name, command, args) => {
    const child = spawn(command, args, {
        stdio: 'inherit'
    })

    child.on('exit', (code) => {
        if (code && code !== 0) {
            console.error(`${name} exited with code ${code}`)
            process.exitCode = code
        }
    })

    return child
}

const nodeCommand = process.execPath
const web = start('web', nodeCommand, ['./node_modules/vite/bin/vite.js'])
const api = start('api', nodeCommand, ['./server/index.js'])

const shutdown = () => {
    web.kill('SIGINT')
    api.kill('SIGINT')
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
