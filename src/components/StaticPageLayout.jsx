import { navigateHome } from '../utils/appRoute';

export default function StaticPageLayout({ title, children }) {
  return (
    <div className="static-page">
      <header className="header static-page__header">
        <div className="header__inner">
          <button type="button" className="header__brand" onClick={navigateHome}>
            Do Different
          </button>
        </div>
      </header>

      <main className="static-page__main">
        <button type="button" className="static-page__back" onClick={navigateHome}>
          ← Back to home
        </button>
        <h1 className="static-page__title">{title}</h1>
        <div className="static-page__content">{children}</div>
      </main>
    </div>
  );
}
