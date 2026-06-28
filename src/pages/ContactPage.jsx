import StaticPageLayout from '../components/StaticPageLayout';
import StaticPageMvpNotice from '../components/StaticPageMvpNotice';

export default function ContactPage() {
  return (
    <StaticPageLayout title="Contact Do Different">
      <StaticPageMvpNotice />

      <section className="static-page__section">
        <h2 className="static-page__heading">I have a question as a customer</h2>
        <p>
          Email us at{' '}
          <a href="mailto:hello@dodifferent.com" className="static-page__link">
            hello@dodifferent.com
          </a>
          .
        </p>
      </section>

      <section className="static-page__section">
        <h2 className="static-page__heading">I organize experiences and want to partner</h2>
        <p>
          We&apos;d love to hear from hosts, guides and creators. Reach out at{' '}
          <a href="mailto:hello@dodifferent.com" className="static-page__link">
            hello@dodifferent.com
          </a>
          .
        </p>
      </section>
    </StaticPageLayout>
  );
}
