export default function NotFound() {
  return (
    <html lang="en">
      <head>
        <title>404 - Page Not Found</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style jsx>{`
          body {
            margin: 0;
            padding: 0;
            min-height: 100vh;
            background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: system-ui, -apple-system, sans-serif;
          }
          .container {
            text-align: center;
            color: white;
          }
          .title {
            font-size: 4rem;
            font-weight: bold;
            margin-bottom: 1rem;
          }
          .subtitle {
            font-size: 1.5rem;
            color: #d1d5db;
            margin-bottom: 2rem;
          }
          .description {
            color: #9ca3af;
            margin-bottom: 2rem;
          }
          .link {
            display: inline-flex;
            align-items: center;
            padding: 0.75rem 1.5rem;
            background: rgba(59, 130, 246, 0.2);
            color: #93c5fd;
            text-decoration: none;
            border-radius: 0.5rem;
            transition: background-color 0.2s;
          }
          .link:hover {
            background: rgba(59, 130, 246, 0.3);
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <h1 className="title">404</h1>
          <h2 className="subtitle">Page Not Found</h2>
          <p className="description">
            The page you&apos;re looking for doesn&apos;t exist.
          </p>
          <a href="/" className="link">
            Go Home
          </a>
        </div>
      </body>
    </html>
  );
}
