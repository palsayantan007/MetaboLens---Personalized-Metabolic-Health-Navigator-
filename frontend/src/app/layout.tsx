import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MetaboLens | Personalized Metabolic Health Navigator',
  description: 'AI-powered platform for personalized metabolic health insights using multi-modal contrastive learning',
  keywords: ['metabolic health', 'biomarkers', 'AI', 'healthcare', 'personalized medicine'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-healthcare-50">
        {children}
      </body>
    </html>
  );
}
