import { getTheme, ThemeProvider } from '@aic-kits/react';
import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
} from '@remix-run/react';
import './tailwind.css';

import { AppHeader } from './components';
import { getSession } from '~/utils/session.server';

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Sora:wght@100..800&display=swap',
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  const isSignedIn = !!userId;
  return json({ isSignedIn });
}

export function Layout({ children }: { children: React.ReactNode}) {
  const data = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isLoadingPage = navigation.state === 'loading';

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <style>{`
          @keyframes loading-progress {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .loading-bar {
            height: 100%;
            width: 50%; /* Adjust width as needed */
            background-color: #3b82f6; /* Example blue color */
            animation: loading-progress 1.5s infinite ease-in-out;
          }
        `}</style>
      </head>
      <body>
        {isLoadingPage && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '4px',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            zIndex: 9999,
            overflow: 'hidden',
          }}>
            <div className="loading-bar" />
          </div>
        )}

        <ThemeProvider theme={getTheme()}>
          <AppHeader isSignedIn={data.isSignedIn} />
          <main>{children}</main>
        </ThemeProvider>
        
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
      <Outlet />
  );
}
