import { Product } from '@/types/product';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const finalPrice = product.price * (1 - product.discount / 100);

  return (
    <div className="group bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300 animate-fade-in">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.discount > 0 && (
          <Badge variant="discount" className="absolute top-3 left-3">
            -{product.discount}%
          </Badge>
        )}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
          {product.sizes.slice(0, 4).map((size) => (
            <Badge key={size} variant="size" className="text-[10px] px-1.5 py-0.5">
              {size}
            </Badge>
          ))}
          {product.sizes.length > 4 && (
            <Badge variant="size" className="text-[10px] px-1.5 py-0.5">
              +{product.sizes.length - 4}
            </Badge>
          )}
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
          {product.category}
        </p>
        <h3 className="font-display text-lg font-medium text-foreground mb-2 line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">
            ${finalPrice.toFixed(2)}
          </span>
          {product.discount > 0 && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
