'use client';

import { AlertTriangle, ExternalLink, Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-healthcare-100 mt-auto">
      {/* Disclaimer Banner */}
      <div className="bg-gradient-to-r from-warning-50 to-warning-100/50 border-b border-warning-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-warning-800">Research Prototype - Not for Clinical Use</p>
              <p className="text-sm text-warning-700 mt-1">
                This system uses synthetic data and is designed for demonstration purposes only. 
                Results require clinical validation and should not be used for medical decision-making.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">🔬</span>
              </div>
              <span className="text-lg font-bold text-healthcare-900">MetaboLens</span>
            </div>
            <p className="text-sm text-healthcare-500 max-w-md">
              AI-powered platform for personalized metabolic health insights using 
              multi-modal contrastive learning on biomarker data.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-xs text-healthcare-500">
                <Shield className="w-4 h-4" />
                <span>HIPAA-ready architecture</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-healthcare-900 mb-3">Resources</h4>
            <ul className="space-y-2">
              <FooterLink href="#" label="Documentation" />
              <FooterLink href="#" label="API Reference" />
              <FooterLink href="#" label="Model Details" />
              <FooterLink href="#" label="Research Paper" external />
            </ul>
          </div>

          {/* Data Sources */}
          <div>
            <h4 className="text-sm font-semibold text-healthcare-900 mb-3">Data Sources</h4>
            <ul className="space-y-2">
              <FooterLink href="#" label="NHANES Dataset" external />
              <FooterLink href="#" label="iHMP Prediabetes" external />
              <FooterLink href="#" label="Synthetic Data Info" />
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-healthcare-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-healthcare-400">
            © {new Date().getFullYear()} MetaboLens. Developed for Healthcare AI Hackathon.
          </p>
          <div className="flex items-center gap-6 text-xs text-healthcare-400">
            <a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-600 transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-primary-600 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label, external }: { href: string; label: string; external?: boolean }) {
  return (
    <li>
      <a
        href={href}
        className="text-sm text-healthcare-500 hover:text-primary-600 transition-colors inline-flex items-center gap-1"
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {label}
        {external && <ExternalLink className="w-3 h-3" />}
      </a>
    </li>
  );
}
