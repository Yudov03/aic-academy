import { redirect } from '@remix-run/node'
import { destroySession, getSession } from '~/utils/session.server'
import type { ActionFunctionArgs } from '@remix-run/node'

export const action = async ({ request } : ActionFunctionArgs) => {
    const session = await getSession(request.headers.get('Cookie'))
    return redirect(`/login`, {
        headers: {
            'Set-Cookie': await destroySession(session),
        },
    })
}

export const loader = async () => {
  return redirect('/')
}