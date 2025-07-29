import { BreadcrumbItem } from "@/components/layout/dashboard-breadcrumbs";
import { Business } from "@/types/businesses.types";
import { Restaurant } from "@/types/restaurants.types";

export interface PageConfig {
  title: string;
  description?: string;
}

export const PAGE_CONFIGS: Record<string, PageConfig> = {
  "/business": {
    title: "Négocios",
    description: "Gerencie suas negócios",
  },
  "/business/create": {
    title: "Criar Negócio",
    description: "Crie um novo negócio para gerenciar seus restaurantes",
  },
  "/business/[businessId]": {
    title: "Painel do Negócio",
    description: "Visão geral e gestão do negócio",
  },
  "/business/[businessId]/categories": {
    title: "Categorias",
    description: "Gerencie as categorias dos seus produtos",
  },
  "/business/[businessId]/ingredients": {
    title: "Ingredientes",
    description: "Gerencie os ingredientes dos seus pratos",
  },
  "/business/[businessId]/meals": {
    title: "Refeições",
    description: "Gerencie o cardápio e pratos do restaurante",
  },
  "/business/[businessId]/menus": {
    title: "Menus",
    description: "Organize seus pratos em menus temáticos",
  },
  "/business/[businessId]/restaurant/create": {
    title: "Criar Restaurante",
    description: "Adicione um novo restaurante ao seu negócio",
  },
  "/business/[businessId]/restaurant/[restaurantId]": {
    title: "Restaurante",
    description: "Visão geral das operações do restaurante",
  },
  "/business/[businessId]/restaurant/[restaurantId]/tables": {
    title: "Mesas",
    description: "Gerencie as mesas do seu restaurante",
  },
  "/business/[businessId]/restaurant/[restaurantId]/orders": {
    title: "Pedidos",
    description: "Acompanhe e gerencie os pedidos do restaurante",
  },
};

export interface GenerateBreadcrumbsOptions {
  pathname: string;
  business?: Business | null;
  restaurant?: Restaurant | null;
}

export function generateBreadcrumbs({
  pathname,
  business,
  restaurant,
}: GenerateBreadcrumbsOptions): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];

    switch (segment) {
      case "business":
        if (i === segments.length - 1) {
          breadcrumbs.push({
            label: "Negócios",
          });
        } else if (segments[i + 1] === "create") {
          breadcrumbs.push({
            label: "Negócios",
            href: "/business",
          });
        } else {
          // /business/[businessId]
          breadcrumbs.push({
            label: "Negócios",
            href: "/business",
          });
        }
        break;

      case "create":
        if (segments[i - 1] === "business") {
          breadcrumbs.push({
            label: "Criar Negócio",
          });
        } else if (segments[i - 1] === "restaurant") {
          breadcrumbs.push({
            label: "Criar Restaurante",
          });
        }
        break;

      case "categories":
        breadcrumbs.push({
          label: "Categorias",
        });
        break;

      case "ingredients":
        breadcrumbs.push({
          label: "Ingredientes",
        });
        break;

      case "meals":
        breadcrumbs.push({
          label: "Refeições",
        });
        break;

      case "menus":
        breadcrumbs.push({
          label: "Menus",
        });
        break;

      case "restaurant":
        if (segments[i + 1] === "create") {
        } else if (segments[i + 1] && segments[i + 1] !== "create") {
          if (restaurant) {
            if (i + 1 < segments.length - 1) {
              breadcrumbs.push({
                label: restaurant.name,
                href: `/business/${business?.id}/restaurant/${restaurant.id}`,
              });
            } else {
              breadcrumbs.push({
                label: restaurant.name,
              });
            }
          } else {
            breadcrumbs.push({
              label: "Restaurante",
            });
          }
        }
        break;

      case "tables":
        breadcrumbs.push({
          label: "Mesas",
        });
        break;

      case "orders":
        breadcrumbs.push({
          label: "Pedidos",
        });
        break;

      default:
        if (segments[i - 1] === "business") {
          if (business) {
            if (i < segments.length - 1) {
              breadcrumbs.push({
                label: business.name,
                href: `/business/${business.id}`,
              });
            } else {
              breadcrumbs.push({
                label: business.name,
              });
            }
          } else {
            breadcrumbs.push({
              label: "Empresa",
            });
          }
        }
        break;
    }
  }

  return breadcrumbs;
}

export function getPageConfig(pathname: string): PageConfig {
  if (PAGE_CONFIGS[pathname]) {
    return PAGE_CONFIGS[pathname];
  }

  const patternPath = pathname
    .replace(/\/business\/\d+/g, "/business/[businessId]")
    .replace(/\/restaurant\/\d+/g, "/restaurant/[restaurantId]");

  return (
    PAGE_CONFIGS[patternPath] || {
      title: "Página",
      description: "Gerenciamento do sistema",
    }
  );
}
