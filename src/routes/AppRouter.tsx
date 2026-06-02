import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout/AppLayout';
import { Spinner } from '@/components/shared/Spinner/Spinner';
import { useUiStore } from '@/store/uiStore';

const HomePage = lazy(() =>
  import('@/pages/HomePage/HomePage').then((m) => ({ default: m.HomePage })),
);
const CatalogPage = lazy(() =>
  import('@/pages/CatalogPage/CatalogPage').then((m) => ({ default: m.CatalogPage })),
);
const DetailPage = lazy(() =>
  import('@/pages/DetailPage/DetailPage').then((m) => ({ default: m.DetailPage })),
);
const ComparePage = lazy(() =>
  import('@/pages/ComparePage/ComparePage').then((m) => ({ default: m.ComparePage })),
);
const FavoritesPage = lazy(() =>
  import('@/pages/FavoritesPage/FavoritesPage').then((m) => ({ default: m.FavoritesPage })),
);
const BerriesPage = lazy(() =>
  import('@/pages/BerriesPage/BerriesPage').then((m) => ({ default: m.BerriesPage })),
);
const ItemsPage = lazy(() =>
  import('@/pages/ItemsPage/ItemsPage').then((m) => ({ default: m.ItemsPage })),
);
const MovesPage = lazy(() =>
  import('@/pages/MovesPage/MovesPage').then((m) => ({
    default: m.MovesPage,
  })),
);
const MoveDetailPage = lazy(() =>
  import('@/pages/MovesPage/MovesPage').then((m) => ({ default: m.MoveDetailPage })),
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Spinner className="h-10 w-10" />
    </div>
  );
}

export function AppRouter() {
  const applyThemeToDocument = useUiStore((s) => s.applyThemeToDocument);

  useEffect(() => {
    applyThemeToDocument();
  }, [applyThemeToDocument]);

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="catalog" element={<CatalogPage />} />
            <Route path="pokemon/:idOrName" element={<DetailPage />} />
            <Route path="compare" element={<ComparePage />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="berries" element={<BerriesPage />} />
            <Route path="items" element={<ItemsPage />} />
            <Route path="moves" element={<MovesPage />} />
            <Route path="moves/:idOrName" element={<MoveDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
