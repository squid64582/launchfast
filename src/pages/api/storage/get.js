// Import necessary modules and functions
import { getSession } from '@/lib/utils/auth'
// Import the necessary Firebase modules and configuration.
import { initializeApp } from 'firebase/app'
import fireBaseConfig from '@/lib/db/firebaseConfig.example'
import { getDownloadURL, getStorage, ref } from 'firebase/storage'

// Define an asynchronous function named GET that accepts a request object.
export async function GET({ request }) {
  // Check if the user is authenticated using the getSession function
  const user = getSession(request)
  if (!user) {
    // If the user is not authenticated, return a 403 (Forbidden) response
    return new Response(null, {
      status: 403,
    })
  }

  // Extract the 'image' parameter from the request URL.
  const url = new URL(request.url)
  const image = url.searchParams.get('image')

  // Check if the 'image' parameter exists in the URL.
  if (image) {
    try {
      // Initialize the Firebase app with the provided configuration.
      const app = initializeApp(fireBaseConfig)

      // Get a reference to the Firebase storage.
      const storage = getStorage(app)

      // Create a reference to the specified image in storage.
      const fileRef = ref(storage, image)

      // Get the download URL of the image.
      const imagePublicURL = await getDownloadURL(fileRef)

      // Return a JSON response with the image's public URL and a 200 status code.
      return new Response(JSON.stringify({ imagePublicURL }), {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
      })
    } catch (error) {
      // If an error occurs, log the error message and return a JSON response with a 500 status code.
      console.log(error.message || error.toString())
      return new Response(JSON.stringify({ error: error.message || error.toString() }), {
        status: 500,
        headers: {
          'content-type': 'application/json',
        },
      })
    }
  }

  // If the 'image' parameter is not found in the URL, return a JSON response with a 400 status code.
  return new Response(JSON.stringify({ error: 'Invalid Request.' }), {
    status: 400,
    headers: {
      'content-type': 'application/json',
    },
  })
}
