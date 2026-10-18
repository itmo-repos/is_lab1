import { useEffect, useState } from 'react';
import LabWorksPage from './pages/LabWorksPage';
import ReferencesPage from './pages/ReferencesPage';
import SpecialPage from './pages/SpecialPage';

const ROUTES = [
  { path: '#/labworks', title: 'Лабораторные', page: LabWorksPage },
  { path: '#/references', title: 'Справочники', page: ReferencesPage },
  { path: '#/special', title: 'Спецоперации', page: SpecialPage },
];

function useHash() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return hash;
}

export default function App() {
  const hash = useHash();
  const route = ROUTES.find((r) => r.path === hash) ?? ROUTES[0];
  const Page = route.page;

  return (
    <div className="layout">
      <nav className="menu">
        {ROUTES.map((r) => (
          <a key={r.path} href={r.path} className={r === route ? 'active' : ''}>
            {r.title}
          </a>
        ))}
      </nav>
      <main>
        <Page />
      </main>
    </div>
  );
}
