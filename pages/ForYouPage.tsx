
import React from 'react';
import Header from '../components/layout/Header';
import ProductCard from '../components/chat/ProductCard';
import { Product } from '../types';
import { Sparkles, History, ThumbsUp, TrendingUp } from 'lucide-react';
import { PLACEHOLDER_PRODUCT_IMAGE } from '../lib/utils';

// Mock Recommendations Data
const MOCK_RECOMMENDATIONS: { title: string; reason: string; icon: React.ReactNode; products: Product[] }[] = [
  {
    title: "Top Picks: Laptops",
    reason: "Because you asked about programming laptops recently",
    icon: <History size={14} className="text-primary-purple" />,
    products: [
      {
        id: "rec-1",
        name: 'MacBook Pro 14" M3 Pro',
        brand: "Apple",
        price: 1999,
        currency: "USD",
        description: "The ultimate laptop for developers with incredible battery life and performance per watt.",
        pros: ["M3 Pro Chip", "120Hz XDR Display", "18h Battery"],
        cons: [],
        imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&w=800&q=80",
        buyUrl: "https://www.apple.com/macbook-pro/"
      },
      {
         id: "rec-2",
         name: 'Dell XPS 15',
         brand: "Dell",
         price: 1499,
         currency: "USD",
         description: "Premium Windows laptop with stunning OLED display and bezel-less design.",
         pros: ["OLED Screen", "Premium Build", "Great Keyboard"],
         cons: [],
         imageUrl: "https://images.unsplash.com/photo-1593642632823-8f78536788c6?auto=format&fit=crop&w=800&q=80",
         buyUrl: "https://www.dell.com"
      },
      {
         id: "rec-3",
         name: 'Lenovo ThinkPad X1 Carbon',
         brand: "Lenovo",
         price: 1649,
         currency: "USD",
         description: "The business standard. Lightweight, durable, and the best keyboard in the class.",
         pros: ["Ultralight", "Legendary Keyboard", "Business Ports"],
         cons: [],
         imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80",
         buyUrl: "https://www.lenovo.com"
      }
    ]
  },
  {
    title: "Trending: Audio",
    reason: "Popular among users like you",
    icon: <TrendingUp size={14} className="text-primary-pink" />,
    products: [
      {
        id: "rec-4",
        name: 'Sony WH-1000XM5',
        brand: "Sony",
        price: 348,
        currency: "USD",
        description: "Industry leading noise cancellation headphones with exceptional call quality.",
        pros: ["Best ANC", "30h Battery", "Lightweight"],
        cons: [],
        imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80",
        buyUrl: "https://electronics.sony.com"
      },
       {
        id: "rec-5",
        name: 'AirPods Max',
        brand: "Apple",
        price: 549,
        currency: "USD",
        description: "High-fidelity audio with spatial audio and premium aluminum build.",
        pros: ["Spatial Audio", "Premium Build", "Ecosystem"],
        cons: [],
        imageUrl: "https://images.unsplash.com/photo-1613040996308-48b5014552a1?auto=format&fit=crop&w=800&q=80",
        buyUrl: "https://www.apple.com"
      }
    ]
  },
  {
      title: "New Arrivals: Running",
      reason: "Based on your search for 'shoes'",
      icon: <History size={14} className="text-emerald-500" />,
      products: [
        {
          id: "rec-6",
          name: 'Nike Air Zoom Pegasus 40',
          brand: "Nike",
          price: 130,
          currency: "USD",
          description: "A springy ride for every run, familiar just for you.",
          pros: ["Responsive", "Durable", "Breathable"],
          cons: [],
          imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
          buyUrl: "https://www.nike.com"
        },
        {
          id: "rec-7",
          name: 'Adidas Ultraboost Light',
          brand: "Adidas",
          price: 190,
          currency: "USD",
          description: "Epic energy in every stride with the lightest Ultraboost ever.",
          pros: ["Energy Return", "Comfort", "Style"],
          cons: [],
          imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
          buyUrl: "https://www.adidas.com"
        }
      ]
    }
];

const ForYouPage: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-dark-bg text-white overflow-hidden">
      <Header />
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="max-w-5xl mx-auto space-y-10 pb-10">
            
            {/* Header Section */}
            <div className="space-y-4 mt-8 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-elevated border border-dark-border text-[10px] font-bold uppercase tracking-wider text-primary-purple">
                    <Sparkles size={12} /> Personalized Feed
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                    For You
                </h1>
                <p className="text-text-secondary text-lg max-w-2xl">
                    Recommendations curated by your AI concierge based on your recent interactions and global trends.
                </p>
            </div>

            {/* Feed */}
            <div className="space-y-16">
                {MOCK_RECOMMENDATIONS.map((section, idx) => (
                    <section key={idx} className="space-y-6 animate-fade-in" style={{ animationDelay: `${idx * 150}ms` }}>
                        <div className="flex items-end justify-between border-b border-white/5 pb-4">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1">{section.title}</h2>
                                <p className="text-xs text-text-muted flex items-center gap-2">
                                    {section.icon} {section.reason}
                                </p>
                            </div>
                            <button className="text-xs text-primary-purple hover:text-white transition-colors font-medium px-3 py-1 rounded-lg hover:bg-white/5">
                                View all
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {section.products.map(product => (
                                <div key={product.id} className="h-[400px]">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
            
            {/* Footer helper */}
            <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-dark-elevated border border-dark-border mb-4">
                    <ThumbsUp size={20} className="text-text-muted" />
                </div>
                <p className="text-sm text-text-muted">That's all for now. Continue chatting to get better recommendations.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ForYouPage;
