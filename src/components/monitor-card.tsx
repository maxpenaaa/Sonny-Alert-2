'use client';

import { X, ExternalLink, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { createClient } from '../../supabase/client';

type Monitor = {
  id: string;
  user_id: string;
  product_url: string;
  product_name: string | null;
  product_image: string | null;
  stock_status: string;
  last_checked_at: string;
  last_status_change: string;
};

type MonitorCardProps = {
  monitor: Monitor;
  onDelete: (id: string) => Promise<void>;
  index: number;
};

export function MonitorCard({ monitor, onDelete, index }: MonitorCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const supabase = createClient();

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(monitor.id);
  };

  const handleCheckNow = async () => {
    setIsChecking(true);
    try {
      await supabase.functions.invoke('supabase-functions-check-single-monitor', {
        body: { 
          monitorId: monitor.id,
          userId: monitor.user_id
        },
      });
    } catch (error) {
      console.error('Error checking monitor:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const statusConfig = {
    checking: {
      label: 'CHECKING...',
      color: 'bg-[#ffff00]',
      animate: 'animate-pulse',
    },
    sold_out: {
      label: 'SOLD OUT',
      color: 'bg-[#ff69b4]',
      animate: '',
    },
    in_stock: {
      label: 'IN STOCK',
      color: 'bg-[#32ff32]',
      animate: 'animate-pulse',
    },
  };

  const status = statusConfig[monitor.stock_status as keyof typeof statusConfig] || statusConfig.checking;

  return (
    <div
      className={`bg-white border-4 border-[#1a1a1a] brutalist-shadow transition-all duration-300 ${
        isDeleting ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      <div className="relative">
        <button
          onClick={handleDelete}
          className="absolute top-3 right-3 z-10 w-10 h-10 bg-[#1a1a1a] text-white flex items-center justify-center border-2 border-[#1a1a1a] hover:bg-[#ff1493] transition-all duration-200 active:scale-90"
          aria-label="Delete monitor"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="aspect-square overflow-hidden border-b-4 border-[#1a1a1a]">
          <img
            src={monitor.product_image || 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&q=80'}
            alt={monitor.product_name || 'Product'}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-5">
          <div className={`inline-block px-4 py-2 ${status.color} text-[#1a1a1a] font-black text-sm border-2 border-[#1a1a1a] mb-4 ${status.animate}`}>
            {status.label}
          </div>

          <h3 className="font-bold text-xl mb-3 line-clamp-2 min-h-[3.5rem]">
            {monitor.product_name || 'Unknown Product'}
          </h3>

          <div className="space-y-2 mb-4">
            <p className="text-sm font-mono text-muted-foreground">
              Last checked: {new Date(monitor.last_checked_at).toLocaleTimeString()}
            </p>
            {monitor.stock_status !== 'checking' && (
              <p className="text-sm font-mono text-muted-foreground">
                Status since: {new Date(monitor.last_status_change).toLocaleString()}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <a
              href={monitor.product_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#1a1a1a] text-white font-bold text-sm border-2 border-[#1a1a1a] hover:bg-[#ff69b4] transition-all duration-200 active:scale-95"
            >
              VIEW PRODUCT
              <ExternalLink className="w-4 h-4" />
            </a>
            
            <button
              onClick={handleCheckNow}
              disabled={isChecking}
              className="px-4 py-3 bg-white text-[#1a1a1a] font-bold text-sm border-2 border-[#1a1a1a] hover:bg-[#f5f5f5] transition-all duration-200 active:scale-95 disabled:opacity-50"
              title="Check now"
            >
              <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
