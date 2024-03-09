// Import necessary modules and functions
import { v4 as uuidv4 } from 'uuid'
import { getSession } from '@/lib/utils/auth'
// Import the necessary Firebase modules and configuration.
import { initializeApp } from 'firebase/app'
import fireBaseConfig from '@/lib/db/firebaseConfig.example'
import { getStorage, ref, uploadBytes } from 'firebase/storage'

// Define an asynchronous function to handle POST requests
export async function POST({ request }) {
  // Check if the user is authenticated using the getSession function
  const user = getSession(request)
  if (!user) {
    // If the user is not authenticated, return a 403 (Forbidden) response
    return new Response(null, {
      status: 403,
    })
  }

  // Check if the user has an email (an additional check for authentication)
  if (user.email) {
    // Initialize the Firebase app with the provided configuration
    const app = initializeApp(fireBaseConfig)

    // Get a reference to the Firebase Storage and parse the request data as a FormData object
    const storage = getStorage(app)
    const data = await request.formData()

    // Get the 'file' field from the form data
    const file = data.get('file')

    // Check if a file was provided
    if (!file) {
      return new Response(JSON.stringify({ error: 'No File Provided' }), {
        status: 400,
        headers: {
          'content-type': 'application/json',
        },
      })
    }

    // Check if the file size exceeds the limit of 5 MB
    if (file.size > 5 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: 'File size exceeds the limit of 5 MB.' }), {
        status: 400,
        headers: {
          'content-type': 'application/json',
        },
      })
    }

    try {
      // Generate a unique fileId (assuming uuidv4 is defined elsewhere)
      const fileId = uuidv4()

      console.log(`uploads/${fileId}/${file.name}`)

      // Check if the 'file' object is an instance of File (not necessary)
      // if (!(file instanceof File)) return

      // Create a reference to the Firebase Storage location where the file will be stored
      const storageRef = ref(storage, `uploads/${fileId}/${file.name}`)

      // Read the file as an array buffer
      const fileBuffer = await file.arrayBuffer()

      // Upload the file to Firebase Storage and retrieve metadata
      const { metadata } = await uploadBytes(storageRef, new Uint8Array(fileBuffer))
      const { fullPath } = metadata

      if (!fullPath) {
        // If there was an error during the upload, return a 403 response with an error message
        return new Response(
          JSON.stringify({
            error: `<span>There was some error while uploading the file.</span> <span class="mt-1 text-xs text-gray-500">Report an issue with the current URL that you are on and with the code XXX.</span>`,
          }),
          {
            status: 403,
            headers: {
              'content-type': 'application/json',
            },
          },
        )
      }

      // Generate a non-publicly accessible URL for the uploaded file
      // Use this url to perform a GET to this endpoint with image query param valued as below
      const imageURL = `https://storage.googleapis.com/${storageRef.bucket}/${storageRef.fullPath}`

      // Return a success response with a message
      return new Response(
        JSON.stringify({
          message: 'Uploaded Successfully',
        }),
        {
          status: 200,
          headers: {
            'content-type': 'application/json',
          },
        },
      )
    } catch (error) {
      // If there was an error during the upload process, return a 403 response with the error message
      return new Response(JSON.stringify({ error: error.message || error.toString() }), {
        status: 403,
        headers: {
          'content-type': 'application/json',
        },
      })
    }
  }

  // If the user doesn't have an email or there was an issue with authentication, return a 403 response
  return new Response(null, {
    status: 403,
  })
}
