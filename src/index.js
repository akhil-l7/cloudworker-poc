// Cloudflare Worker to handle Prismic webhook transform and trigger github CI build

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  // Retrieve the signature from the Prismic webhook 
  const signature = request.headers.get('x-prismic-signature')
  console.log(request.headers);
  // Optionally, you can verify the signature here if you set it in Prismic
  // const expectedSignature = 'super-secret-blog-0042' // Replace with your actual secret key

  // if (signature !== expectedSignature) {
  //   return new Response('Invalid signature', { status: 401 })
  // }
  return new Response('debug');
  // try {
  //   // Trigger the Vercel build hook
  //   const vercelBuildUrl = 'https://api.vercel.com/v1/integrations/deploy/your-build-hook-id' // Replace with your Vercel build hook URL
  //   const response = await fetch(vercelBuildUrl, { method: 'POST' })

  //   if (response.ok) {
  //     return new Response('Build triggered successfully', { status: 200 })
  //   } else {
  //     return new Response('Failed to trigger build', { status: 500 })
  //   }
  // } catch (error) {
  //   console.error('Error:', error)
  //   return new Response('Internal Server Error', { status: 500 })
  // }
}
