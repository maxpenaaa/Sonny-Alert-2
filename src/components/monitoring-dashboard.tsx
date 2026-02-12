'use client';

import { useState, useEffect } from 'react';
import { createClient } from '../../supabase/client';
import { HeroInput } from './hero-input';
import { MonitorCard } from './monitor-card';
import { EmptyState } from './empty-state';
import { AlertSetupModal } from './alert-setup-modal';
import { NotificationPreview } from './notification-preview';
import type { RealtimeChannel } from '@supabase/supabase-js';

type Monitor = {
  id: string;
  user_id: string;
  product_url: string;
  product_name: string | null;
  product_image: string | null;
  stock_status: string;
  last_checked_at: string;
  last_status_change: string;
  created_at: string;
};

type UserData = {
  email: string | null;
  phone: string | null;
};

type MonitoringDashboardProps = {
  initialMonitors: Monitor[];
  userData: UserData | null;
  userId: string;
};

export function MonitoringDashboard({ initialMonitors, userData, userId }: MonitoringDashboardProps) {
  const [monitors, setMonitors] = useState<Monitor[]>(initialMonitors);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [isAddingMonitor, setIsAddingMonitor] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const channel: RealtimeChannel = supabase
      .channel('monitors-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'monitors',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMonitors((prev) => [payload.new as Monitor, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setMonitors((prev) =>
              prev.map((m) => (m.id === payload.new.id ? (payload.new as Monitor) : m))
            );
          } else if (payload.eventType === 'DELETE') {
            setMonitors((prev) => prev.filter((m) => m.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase]);

  const handleAddMonitor = async (url: string) => {
    const hasAlertSetup = userData?.email || userData?.phone;
    
    if (!hasAlertSetup) {
      setShowAlertModal(true);
      return;
    }

    await addMonitor(url);
  };

  const addMonitor = async (url: string) => {
    setIsAddingMonitor(true);
    try {
      const { data: productData, error: scrapeError } = await supabase.functions.invoke(
        'supabase-functions-scrape-product',
        {
          body: { url },
        }
      );

      if (scrapeError) throw scrapeError;

      const { error: insertError } = await supabase.from('monitors').insert({
        user_id: userId,
        product_url: url,
        product_name: productData.name,
        product_image: productData.image,
        stock_status: productData.inStock ? 'in_stock' : 'sold_out',
      });

      if (insertError) throw insertError;
    } catch (error) {
      console.error('Error adding monitor:', error);
    } finally {
      setIsAddingMonitor(false);
    }
  };

  const handleDeleteMonitor = async (id: string) => {
    await supabase.from('monitors').delete().eq('id', id);
  };

  const handleAlertSetup = async (email?: string, phone?: string) => {
    await supabase.from('users').update({ email, phone }).eq('id', userId);
    setShowAlertModal(false);
  };

  return (
    <>
      <div className="min-h-screen noise-texture">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <HeroInput onAddMonitor={handleAddMonitor} isLoading={isAddingMonitor} />
          
          {monitors.length === 0 ? (
            <>
              <EmptyState />
              <NotificationPreview />
            </>
          ) : (
            <div className="mt-20 md:mt-32">
              <h2 className="text-2xl md:text-4xl font-bold mb-8 uppercase">
                ACTIVE MONITORS ({monitors.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {monitors.map((monitor, index) => (
                  <MonitorCard
                    key={monitor.id}
                    monitor={monitor}
                    onDelete={handleDeleteMonitor}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showAlertModal && (
        <AlertSetupModal
          onSetup={handleAlertSetup}
          onClose={() => setShowAlertModal(false)}
        />
      )}
    </>
  );
}
