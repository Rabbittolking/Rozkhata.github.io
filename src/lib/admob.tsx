import React, { useEffect, createContext, useContext } from 'react';
import { AdMob } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

interface AdContextType {
  showInterstitial: (onClose?: () => void) => void;
  showRewarded: (onReward: () => void, onClose?: () => void) => void;
}

const AdContext = createContext<AdContextType | null>(null);

export function useAdmob() {
  const context = useContext(AdContext);
  if (!context) {
    throw new Error('useAdmob must be used within an AdProvider');
  }
  return context;
}

export function AdProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const initAdMob = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          await AdMob.initialize({
            initializeForTesting: false,
          });
        } catch (err) {
          console.error(err);
        }
      }
    };
    initAdMob();
  }, []);

  const showInterstitial = async (onClose?: () => void) => {
    if (Capacitor.isNativePlatform()) {
      try {
        await AdMob.prepareInterstitial({
          adId: 'ca-app-pub-3113275088766608/4107067867',
          isTesting: false
        });
        await AdMob.showInterstitial();
      } catch (e) {
        console.error(e);
      } finally {
        if (onClose) onClose();
      }
    } else {
      if (onClose) onClose();
    }
  };

  const showRewarded = async (onReward: () => void, onClose?: () => void) => {
    if (Capacitor.isNativePlatform()) {
       try {
         await AdMob.prepareRewardVideoAd({
           adId: 'ca-app-pub-3113275088766608/5021570775',
           isTesting: false
         });
         const rewardItem = await AdMob.showRewardVideoAd();
         if (rewardItem) {
           onReward();
         }
       } catch(e) {
         console.error(e);
         onReward();
       } finally {
         if(onClose) onClose();
       }
    } else {
      onReward();
      if (onClose) onClose();
    }
  };

  return (
    <AdContext.Provider value={{ showInterstitial, showRewarded }}>
      {children}
    </AdContext.Provider>
  );
}
