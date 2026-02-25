'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Activity, 
  BarChart3, 
  FileText, 
  Settings, 
  Info,
  Menu,
  X,
  Microscope
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

interface HeaderProps {
  onModelInfoClick?: () => void;
}

export function Header({ onModelInfoClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-healthcare-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/30 transition-shadow">
                <Microscope className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-success-500 rounded-full border-2 border-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-healthcare-900 tracking-tight">
                Metabo<span className="text-primary-600">Lens</span>
              </h1>
              <p className="text-xs text-healthcare-500 -mt-0.5">Metabolic Health Navigator</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavItem href="/" icon={<Activity className="w-4 h-4" />} label="Dashboard" active />
            <NavItem href="#" icon={<BarChart3 className="w-4 h-4" />} label="Analytics" />
            <NavItem href="#" icon={<FileText className="w-4 h-4" />} label="Reports" />
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Badge variant="warning" size="sm" icon={<span>🔬</span>}>
              Research Prototype
            </Badge>
            <button
              onClick={onModelInfoClick}
              className="p-2 text-healthcare-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Model Information"
            >
              <Info className="w-5 h-5" />
            </button>
            <button className="p-2 text-healthcare-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-healthcare-500 hover:bg-healthcare-50 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-healthcare-100">
          <div className="px-4 py-3 space-y-1">
            <MobileNavItem href="/" icon={<Activity className="w-4 h-4" />} label="Dashboard" active />
            <MobileNavItem href="#" icon={<BarChart3 className="w-4 h-4" />} label="Analytics" />
            <MobileNavItem href="#" icon={<FileText className="w-4 h-4" />} label="Reports" />
            <div className="pt-3 border-t border-healthcare-100 mt-3">
              <Badge variant="warning" size="sm" icon={<span>🔬</span>}>
                Research Prototype
              </Badge>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
        active
          ? 'bg-primary-50 text-primary-700'
          : 'text-healthcare-600 hover:bg-healthcare-50 hover:text-healthcare-900'
      )}
    >
      {icon}
      {label}
    </Link>
  );
}

function MobileNavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors',
        active
          ? 'bg-primary-50 text-primary-700'
          : 'text-healthcare-600 hover:bg-healthcare-50'
      )}
    >
      {icon}
      {label}
    </Link>
  );
}
