
import React, { useState, useMemo } from 'react';
import { Product, CreditCard } from '../../types';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { formatCurrency, PLACEHOLDER_PRODUCT_IMAGE } from '../../lib/utils';
import { Star, Check, ExternalLink, Sparkles, ShoppingBag, CreditCard as CreditCardIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ProductCardProps {
  product: Product;
  isTopPick?: boolean;
  cards?: CreditCard[];
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isTopPick, cards = [] }) => {
  const getScreenshotUrl = (url: string) => {
    // Using WordPress mshots as a reliable, free screenshot service
    return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=600&h=450`;
  };

  const getInitialImage = () => {
    if (product.imageUrl && product.imageUrl.length > 5) return product.imageUrl;
    // If no provided image, try screenshot of buyUrl immediately if available
    if (product.buyUrl) return getScreenshotUrl(product.buyUrl);
    return PLACEHOLDER_PRODUCT_IMAGE;
  };

  const [imgSrc, setImgSrc] = useState(getInitialImage());
  const [imgError, setImgError] = useState(false);
  const [triedScreenshot, setTriedScreenshot] = useState(false);

  // Deterministically select a card from user's wallet based on product id
  const recommendedCard = useMemo(() => {
    if (!cards || cards.length === 0) return null;
    // Simple hash to index
    const hash = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return cards[hash % cards.length];
  }, [product.id, cards]);

  const handleImageError = () => {
    // If we haven't tried the screenshot yet and we have a valid buyUrl, try that
    if (!triedScreenshot && product.buyUrl && imgSrc !== getScreenshotUrl(product.buyUrl)) {
      setTriedScreenshot(true);
      setImgSrc(getScreenshotUrl(product.buyUrl));
      setImgError(false); // Reset error state to try the new src
    } else {
      // If we already tried screenshot or don't have a url, show fallback
      setImgError(true);
      setImgSrc(PLACEHOLDER_PRODUCT_IMAGE);
    }
  };

  const handleBuyClick = () => {
    // Basic validation for URL
    const isValidUrl = product.buyUrl && product.buyUrl.trim().length > 0 && (product.buyUrl.startsWith('http://') || product.buyUrl.startsWith('https://'));
    
    if (isValidUrl) {
      window.open(product.buyUrl, '_blank');
    } else {
      // Fallback to Google Shopping search
      const query = `${product.brand} ${product.name}`;
      window.open(`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(query)}`, '_blank');
    }
  };

  return (
    <Card className={cn(
        "flex flex-col h-full overflow-hidden hover:border-primary-purple/50 group bg-dark-elevated transition-all duration-300 relative",
        isTopPick ? "border-primary-purple/40 shadow-[0_0_20px_-10px_rgba(99,102,241,0.3)]" : "border-dark-border"
    )}>
      
      {/* Top Pick Badge */}
      {isTopPick && (
        <div className="absolute top-0 left-0 right-0 z-20 flex justify-center">
            <div className="bg-gradient-to-r from-primary-purple to-primary-pink text-white text-[10px] font-bold px-3 py-1 rounded-b-lg shadow-lg flex items-center gap-1">
                <Sparkles size={10} /> Concierge Pick
            </div>
        </div>
      )}

      {/* Image Section */}
      <div className="relative aspect-[4/3] w-full bg-dark-bg overflow-hidden flex items-center justify-center shrink-0">
        {!imgError ? (
          <img 
            src={imgSrc} 
            alt={product.name}
            onError={handleImageError}
            className={cn(
              "w-full h-full object-cover transition-transform duration-500 opacity-90 group-hover:opacity-100",
               // If it's a screenshot (mshots), it might need different scaling or background
               imgSrc.includes('mshots') ? "object-top" : "group-hover:scale-105"
            )}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-dark-border-active">
             <ShoppingBag size={48} className="opacity-20 mb-2" />
             <span className="text-[10px] uppercase font-bold tracking-wider opacity-40">No Image</span>
          </div>
        )}
        
        {/* Brand Tag */}
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-medium text-white/90">
          {product.brand}
        </div>
      </div>
      
      {/* Content Section */}
      <CardContent className="p-4 flex flex-col flex-1">
        <div className="mb-2">
          <div className="flex justify-between items-start gap-2 mb-1">
            <h3 className="font-semibold text-sm text-white leading-tight line-clamp-2 min-h-[2.5em]" title={product.name}>
                {product.name}
            </h3>
          </div>
          <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            {formatCurrency(product.price, product.currency)}
          </div>
        </div>

        {/* Pros List */}
        <div className="mb-3">
          <div className="space-y-1 bg-dark-bg/50 rounded-lg p-2 border border-white/5">
            {product.pros.slice(0, 2).map((pro, i) => (
              <div key={i} className="flex items-start gap-1.5 text-[11px] text-text-secondary leading-tight">
                <Check size={12} className="text-emerald-500 mt-0.5 shrink-0" /> 
                <span className="line-clamp-2">{pro}</span>
              </div>
            ))}
            {product.pros.length === 0 && (
                <p className="text-[10px] text-text-muted italic px-1">See details for features</p>
            )}
          </div>
        </div>

        {/* Recommended Payment */}
        {recommendedCard && (
          <div className="mb-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-primary-pink uppercase tracking-widest flex items-center gap-1.5">
                <CreditCardIcon size={10} /> Best for checkout
              </span>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-dark-card border border-white/5">
                <div className={cn(
                  "w-7 h-5 rounded-[3px] bg-gradient-to-br flex items-center justify-center text-[7px] font-bold text-white shadow-sm",
                  recommendedCard.color || "from-gray-700 to-gray-900"
                )}>
                  {recommendedCard.network === 'Amex' ? 'AX' : (recommendedCard.network || 'CC').slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-medium text-white truncate">{recommendedCard.name}</p>
                  <p className="text-[9px] text-text-muted font-mono leading-none">•••• {recommendedCard.last4}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 mt-auto flex gap-2">
          <Button 
            variant="primary" 
            size="sm" 
            className="flex-1 h-9 text-xs font-semibold shadow-none" 
            onClick={handleBuyClick}
          >
            View Deal <ExternalLink size={12} className="ml-1.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
