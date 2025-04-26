import { redirect } from '@remix-run/node'
import { destroySession, getSession } from '~/utils/session.server'
import type { ActionFunctionArgs } from '@remix-run/node'

/**
 * Handles the POST request to log the user out.
 * It retrieves the current session, destroys it, and redirects the user to the login page.
 * This action should typically be triggered by submitting a form with method="post" to this route.
 */
export const action = async ({ request } : ActionFunctionArgs) => {
    // 1. Get the current session from the request cookie
    const session = await getSession(request.headers.get('Cookie'))

    // 2. Redirect the user to the login page.
    // The `destroySession` function clears the session data and generates
    // a `Set-Cookie` header to remove the session cookie from the browser.
    return redirect(`/login`, {
        headers: {
            'Set-Cookie': await destroySession(session),
        },
    })
}

/**
 * Handles GET requests to this route.
 * Since logging out is an action (modifying state), GET requests are generally not appropriate.
 * This loader redirects any GET requests immediately to the homepage ('/') to prevent users
 * from accidentally logging out by simply visiting the /logout URL.
 */
export const loader = async () => {
  return redirect('/')
}