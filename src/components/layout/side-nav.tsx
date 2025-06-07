'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutGrid,
  TableIcon,
  Settings,
  Apple,
  FileText,
  Tag,
  ShoppingCart,
} from 'lucide-react';

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutGrid,
    href: '/dashboard',
  },
  {
    label: 'Ingredientes',
    icon: Apple,
    href: '/ingredients',
  },
  {
    label: 'Categorias',
    icon: Tag, 
    href: '/categories',
  },
  {
    label: 'Produtos',
    icon: ShoppingCart,
    href: '/products',
  },
  {
    label: 'Menus',
    icon: FileText,
    href: '/menus',
  },
  {
    label: 'Mesas',
    icon: TableIcon,
    href: '/tables',
  },
  {
    label: 'Configurações',
    icon: Settings,
    href: '/settings',
  },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-gray-100 text-gray-800">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold">
          Seu Restaurante
        </h2>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                pathname === route.href ? "bg-gray-200 text-gray-900" : ""
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 