import getMdPaths from "./getMdPaths.js";

async function syncDeletedFiles(paths: string[]) {
  const endpoint = `${process.env.BASE_API_URL}markdown/missing`
  const apiKey = process.env.CODEBASE_KB_API_KEY;
  try {
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        'x-api-key': `${apiKey}`
       },
      body: JSON.stringify({ paths }),
    })
    const data = await response.json()
    console.log('Response from server:', data)
  } catch (error) {
    console.error('Error sending deleted files:', error)
  }
}

async function run() {
  // Collect all md paths
  const paths = getMdPaths('content', [])

  if (paths.length > 0) {
    // Check for markdown metadata in db that does not exist
    syncDeletedFiles(paths)
  } else {
    console.log('No markdown files found.')
  }
}

run(); // Start the process
