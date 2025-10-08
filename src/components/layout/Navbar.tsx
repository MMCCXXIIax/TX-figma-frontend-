import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { 
  Menu, 
  TrendingUp, 
  BarChart3, 
  DollarSign, 
  Activity, 
  TestTube, 
  Brain,
  Shield,
  Settings
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: TrendingUp },
  { name: 'Charts', href: '/charts', icon: BarChart3 },
  { name: 'Paper Trading', href: '/paper-trading', icon: DollarSign },
  { name: 'Scan Control', href: '/scan-control', icon: Activity },
  { name: 'Backtesting', href: '/backtesting', icon: TestTube },
  { name: 'Sentiment', href: '/sentiment', icon: Brain },
  { name: 'Risk & Recommendations', href: '/risk', icon: Shield },
];

interface NavbarProps {
  alertCount?: number;
  isScanning?: boolean;
}

export function Navbar({ alertCount = 0, isScanning = false }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        
        return (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive 
                ? 'bg-sky-600 text-white' 
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            } ${mobile ? 'text-base' : 'text-sm'}`}
            onClick={() => mobile && setMobileMenuOpen(false)}
          >
            <Icon className="h-5 w-5" />
            {item.name}
            {item.name === 'Dashboard' && alertCount > 0 && (
              <Badge variant="destructive" className="ml-auto">
                {alertCount}
              </Badge>
            )}
          </Link>
        );
      })}
    </>
  );

  return (
    <nav className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 bg-sky-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl text-white">TX Predictive Intelligence</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavItems />
            </div>
          </div>

          {/* Status indicators and mobile menu */}
          <div className="flex items-center gap-4">
            {/* Scanning status */}
            {isScanning && (
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400">Scanning</span>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64 bg-black border-gray-800">
                  <div className="flex flex-col gap-4 pt-6">
                    <div className="flex items-center gap-2 pb-4 border-b border-gray-800">
                      <div className="h-8 w-8 bg-sky-500 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-lg text-white">TX Predictive</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <NavItems mobile />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}