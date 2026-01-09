addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const OWNER = "akhil-l7"
  const REPO = "next-blogpoc"
  const WORKFLOW_ID = "nextjs.yml"
  const GITHUB_WORKFLOW_URL = `https://api.github.com/repos/${OWNER}/${REPO}/actions/workflows/${WORKFLOW_ID}/dispatches`

  // Get the super secret header
  const passCode = request.headers.get('x-super-secret')

  if (!passCode || passCode !== SUPER_SECRET_PASSCODE) {
    const noEntryText = "anuvadham ella - no entry"
    return new Response(noEntryText, { status: 403 });
  }

  // Only accept POST requests
  if (request.method !== 'POST') {
    return new Response('Only POST requests are allowed', { status: 405 })
  }

  try {
    const githubToken = request?.headers?.get('Authorization')?.split(' ')[1]
    const ref = request?.headers?.get('x-git-branch') || 'master'

    // Prepare your custom body for GitHub API
    const githubBody = {
      ref
    }

    // If no token is provided, return an error
    if (!githubToken) {
      return new Response('Authorization token is required', { status: 400 })
    }

    await delay(10000) // 10s delay before calling github.

    // Make the request to GitHub API
    const githubResponse = await fetch(GITHUB_WORKFLOW_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'akhil-l7'
      },
      body: JSON.stringify(githubBody),
    })

    // Check if the request was successful
    if (!githubResponse.ok) {
      return new Response('GitHub API request failed', { status: githubResponse.status })
    }

    // Return the GitHub API response as the response to the client
    return new Response(JSON.stringify({ message: 'success' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  } catch (error) {
    return new Response('Error processing the request', { status: 500 })
  }
}

// delay function to workaround the issue when newly published documents are not found via api instantly at github build time. 
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}