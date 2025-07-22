import Client from 'shopify-buy';

// Shopify client configuratie voor je store
export const shopifyClient = Client.buildClient({
  domain: 'pyezxt-my.myshopify.com',
  storefrontAccessToken: '7c17c0dce3773dc954ba94ae7bd8ca36' // Public token - veilig voor frontend gebruik
});

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  images: Array<{
    id: string;
    src: string;
    altText: string | null;
  }>;
  variants: Array<{
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    compareAtPrice?: {
      amount: string;
      currencyCode: string;
    } | null;
    available: boolean;
  }>;
  tags: string[];
  productType: string;
  vendor: string;
  createdAt: string;
  updatedAt: string;
}

// Haal alle producten op
export const fetchProducts = async (limit: number = 20): Promise<ShopifyProduct[]> => {
  try {
    const products = await shopifyClient.product.fetchAll(limit);
    return products.map(product => ({
      id: product.id.toString(),
      title: product.title,
      handle: product.handle,
      description: product.description,
      images: product.images.map(image => ({
        id: image.id.toString(),
        src: image.src,
        altText: image.altText
      })),
      variants: product.variants.map(variant => ({
        id: variant.id.toString(),
        title: variant.title,
        price: {
          amount: variant.price.amount,
          currencyCode: variant.price.currencyCode
        },
        compareAtPrice: variant.compareAtPrice ? {
          amount: variant.compareAtPrice.amount,
          currencyCode: variant.compareAtPrice.currencyCode
        } : null,
        available: variant.available
      })),
      tags: product.tags,
      productType: product.productType,
      vendor: product.vendor,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }));
  } catch (error) {
    console.error('Error fetching products from Shopify:', error);
    return [];
  }
};

// Haal specifiek product op via handle
export const fetchProduct = async (handle: string): Promise<ShopifyProduct | null> => {
  try {
    const product = await shopifyClient.product.fetchByHandle(handle);
    if (!product) return null;
    
    return {
      id: product.id.toString(),
      title: product.title,
      handle: product.handle,
      description: product.description,
      images: product.images.map(image => ({
        id: image.id.toString(),
        src: image.src,
        altText: image.altText
      })),
      variants: product.variants.map(variant => ({
        id: variant.id.toString(),
        title: variant.title,
        price: {
          amount: variant.price.amount,
          currencyCode: variant.price.currencyCode
        },
        compareAtPrice: variant.compareAtPrice ? {
          amount: variant.compareAtPrice.amount,
          currencyCode: variant.compareAtPrice.currencyCode
        } : null,
        available: variant.available
      })),
      tags: product.tags,
      productType: product.productType,
      vendor: product.vendor,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    };
  } catch (error) {
    console.error('Error fetching product from Shopify:', error);
    return null;
  }
};

// Helper functie voor price formatting
export const formatPrice = (amount: string, currencyCode: string): string => {
  const price = parseFloat(amount);
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: currencyCode
  }).format(price);
};

// Helper functie voor discount percentage
export const calculateDiscount = (price: string, compareAtPrice: string): number => {
  const current = parseFloat(price);
  const original = parseFloat(compareAtPrice);
  return Math.round(((original - current) / original) * 100);
};