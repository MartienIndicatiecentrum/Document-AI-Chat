import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    rating: number;
    reviewCount: number;
    inStock: boolean;
    isNew?: boolean;
    isBestseller?: boolean;
    waterType: 'fresh' | 'salt' | 'both';
  };
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div 
      className={cn(
        "group relative bg-card rounded-xl border overflow-hidden product-card-hover cursor-pointer",
        className
      )}
      onClick={() => handleNavigation(`/product/${product.id}`)}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className={cn(
            "w-full h-full object-cover group-hover:scale-105 smooth-transition",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
        />
        
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.isNew && (
            <Badge className="bg-secondary text-secondary-foreground">
              Nieuw
            </Badge>
          )}
          {product.isBestseller && (
            <Badge className="bg-accent text-accent-foreground">
              Bestseller
            </Badge>
          )}
          {discount > 0 && (
            <Badge variant="destructive">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-3 right-3 bg-white/90 backdrop-blur-sm hover:bg-white opacity-0 group-hover:opacity-100 smooth-transition",
            isWishlisted && "opacity-100 text-red-500"
          )}
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
        >
          <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
        </Button>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 smooth-transition">
          <div className="flex gap-2">
            <Button 
              size="sm" 
              className="flex-1"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Add to cart functionality would go here
                console.log('Added to cart:', product.name);
              }}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Toevoegen
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="bg-white/90 backdrop-blur-sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleNavigation(`/product/${product.id}`);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stock Indicator */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary" className="text-sm">
              Uitverkocht
            </Badge>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Category & Water Type */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{product.category}</span>
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs",
              product.waterType === 'fresh' && "border-blue-200 text-blue-700",
              product.waterType === 'salt' && "border-green-200 text-green-700",
              product.waterType === 'both' && "border-purple-200 text-purple-700"
            )}
          >
            {product.waterType === 'fresh' && 'Zoet water'}
            {product.waterType === 'salt' && 'Zout water'}
            {product.waterType === 'both' && 'Universeel'}
          </Badge>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-base leading-tight line-clamp-2 group-hover:text-primary smooth-transition">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < Math.floor(product.rating) 
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                )}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">
            €{product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              €{product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="text-sm">
          {product.inStock ? (
            <span className="text-secondary font-medium">Op voorraad</span>
          ) : (
            <span className="text-destructive">Uitverkocht</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;