require('dotenv').config()
const app = require('./src/app')
const http = require('http')

// Get port from environment or use 3001 as default
const PRIMARY_PORT = process.env.PORT || 3001
const ALTERNATIVE_PORT = 3001

// Create HTTP server
const server = http.createServer(app)

// Function to handle port conflicts
function startServer(port) {
    server.listen(port)
    
    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.log(`Port ${port} is already in use. Trying port ${ALTERNATIVE_PORT}...`)
            // If the port is in use, try the alternative port
            if (port !== ALTERNATIVE_PORT) {
                startServer(ALTERNATIVE_PORT)
            } else {
                console.error(`Port ${ALTERNATIVE_PORT} is also in use. Please choose another port.`)
                process.exit(1)
            }
        } else {
            console.error('Server error:', error)
            process.exit(1)
        }
    })
    
    server.on('listening', () => {
        const addr = server.address()
        const actualPort = addr.port
        console.log(`Server is running on http://localhost:${actualPort}`)
    })
}

// Start the server
startServer(PRIMARY_PORT)