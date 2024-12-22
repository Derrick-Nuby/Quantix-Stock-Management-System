import Link from 'next/link';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div className="max-w-max mx-auto">
        <main className="sm:flex">
          <p className="text-4xl font-extrabold text-primary sm:text-5xl">404</p>
          <div className="sm:ml-6">
            <div className="sm:border-l sm:border-border sm:pl-6">
              <h1 className="text-4xl font-extrabold text-foreground tracking-tight sm:text-5xl">Page not found</h1>
              <p className="mt-1 text-base text-muted-foreground">Please check the URL in the address bar and try again.</p>
            </div>
            <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <Home className="mr-2 h-4 w-4" aria-hidden="true" />
                Go back home
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-4 py-2 border border-input text-sm font-medium rounded-md text-accent-foreground bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
              >
                <AlertCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                Contact support
              </Link>
            </div>
          </div>
        </main>
        <div className="mt-16">
          <svg
            className="mx-auto h-40 w-auto text-muted-foreground"
            fill="none"
            viewBox="0 0 184 152"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 82.7c0 32.4 26.2 58.6 58.6 58.6 32.4 0 58.6-26.2 58.6-58.6S112 24.1 79.6 24.1 21 50.3 21 82.7zm0 0c0-15.8 12.8-28.6 28.6-28.6m85.8 28.6c0 15.8-12.8 28.6-28.6 28.6"
              stroke="currentColor"
            />
            <circle cx={80} cy={83} r={5} fill="currentColor" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M103.6 83H150m-98.6 0H5"
              stroke="currentColor"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M79.6 107v28M79.6 51V23"
              stroke="currentColor"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}