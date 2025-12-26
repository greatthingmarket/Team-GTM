// src/data/categories.js

// ✅ IMPORTATION DES ICÔNES
// Astro traite ces imports comme des objets images optimisables.
// Assurez-vous que les noms de fichiers correspondent exactement.
import iconHouse from '../assets/icon-house.png';
import iconDress from '../assets/icon-dress.png';
import iconTech from '../assets/icon-tech.png';
import iconDeal from '../assets/icon-deal.png';

export const categories = [
  {
    id: 'home',
    slug: 'home-gadgets',
    icon: iconHouse, // Utilisation de l'import
    translations: {
      en: {
        title: 'Home Gadgets',
        description: 'Kitchen, decoration, organization'
      },
      fr: {
        title: 'Gadgets Maison',
        description: 'Cuisine, décoration, organisation'
      },
      es: {
        title: 'Gadgets para el Hogar',
        description: 'Cocina, decoración, organización'
      },
      de: {
        title: 'Haushaltsgeräte',
        description: 'Küche, Dekoration, Organisation'
      },
      ar: {
        title: 'أدوات المنزل',
        description: 'مطبخ، ديكور، تنظيم'
      },
      pt: {
        title: 'Gadgets para Casa',
        description: 'Cozinha, decoração, organisation'
      }
    }
  },
  {
    id: 'fashion',
    slug: 'fashion-beauty',
    icon: iconDress, // Utilisation de l'import
    translations: {
      en: {
        title: 'Fashion & Beauty',
        description: 'Clothing, accessories, cosmetics'
      },
      fr: {
        title: 'Mode & Beauté',
        description: 'Vêtements, accessoires, cosmétiques'
      },
      es: {
        title: 'Moda y Belleza',
        description: 'Ropa, accesorios, cosméticos'
      },
      de: {
        title: 'Mode & Schönheit',
        description: 'Kleidung, Accessoires, Kosmetik'
      },
      ar: {
        title: 'الموضة والجمال',
        description: 'ملابس، إكسسوارات، مستحضرات تجميل'
      },
      pt: {
        title: 'Moda e Beleza',
        description: 'Roupas, acessórios, cosméticos'
      }
    }
  },
  {
    id: 'tech',
    slug: 'tech-accessories',
    icon: iconTech, // Utilisation de l'import
    translations: {
      en: {
        title: 'Tech Accessories',
        description: 'Smartphones, headphones, gadgets'
      },
      fr: {
        title: 'Accessoires Tech',
        description: 'Smartphones, écouteurs, gadgets'
      },
      es: {
        title: 'Accesorios Tech',
        description: 'Smartphones, auriculares, gadgets'
      },
      de: {
        title: 'Tech-Zubehör',
        description: 'Smartphones, Kopfhörer, Gadgets'
      },
      ar: {
        title: 'إكسسوارات التكنولوجيا',
        description: 'هواتف ذكية، سماعات، أدوات'
      },
      pt: {
        title: 'Acessórios Tech',
        description: 'Smartphones, fones, gadgets'
      }
    }
  },
  {
    id: 'deals',
    slug: 'monthly-deals',
    icon: iconDeal, // Utilisation de l'import
    translations: {
      en: {
        title: 'Top Monthly Deals',
        description: 'Exclusive monthly selection'
      },
      fr: {
        title: 'Meilleures Offres du Mois',
        description: 'Sélection mensuelle exclusive'
      },
      es: {
        title: 'Mejores Ofertas del Mes',
        description: 'Selección mensual exclusiva'
      },
      de: {
        title: 'Top Monatsangebote',
        description: 'Exklusive monatliche Auswahl'
      },
      ar: {
        title: 'أفضل عروض الشهر',
        description: 'مجموعة مختارة حصرية'
      },
      pt: {
        title: 'Melhores Ofertas do Mês',
        description: 'Seleção mensal exclusiva'
      }
    }
  }
];

/**
 * Helper pour trouver une catégorie par son slug
 */
export function getCategoryBySlug(slug) {
  return categories.find(category => category.slug === slug);
}