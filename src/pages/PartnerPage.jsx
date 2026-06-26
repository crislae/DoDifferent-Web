import StaticPageLayout from '../components/StaticPageLayout';

export default function PartnerPage() {
  return (
    <StaticPageLayout title="Become a Partner">
      <p>
        Do you organize experiences people never forget? We&apos;re always looking for
        exceptional hosts, guides and creators. If you think your experience belongs on Do
        Different, we&apos;d love to hear from you.
      </p>
      <p>
        <a href="mailto:hello@dodifferent.com" className="btn-primary static-page__cta">
          Contact us
        </a>
      </p>
    </StaticPageLayout>
  );
}
