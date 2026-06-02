import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-accent">404</p>
      <h1 className="mt-4 text-2xl font-bold">Página no encontrada</h1>
      <Link to="/" className="mt-6 text-accent hover:underline">
        Volver al inicio
      </Link>
    </div>
  );
}
