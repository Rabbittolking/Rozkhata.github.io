import React, { useEffect, useState } from 'react';
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

export const AdBanner = () => {
  const [isBannerVisible, setIsBannerVisible] = useState(false);

  useEffect(() => {
    let adShown = false;
    const showBanner = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          await AdMob.showBanner({
            adId: 'ca-app-pub-3113275088766608/6699921703',
            adSize: BannerAdSize.ADAPTIVE_BANNER,
            position: BannerAdPosition.BOTTOM_CENTER,
            margin: 0,
            isTesting: false
          });
          adShown = true;
          setIsBannerVisible(true);
        } catch (e) {
          console.error(e);
        }
      }
    };
    
    showBanner();

    const handleResize = () => {
       if (Capacitor.isNativePlatform() && adShown) {
          // If window height shrinks significantly, keyboard is likely open
          if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
             AdMob.hideBanner().catch(console.error);
          } else {
             AdMob.resumeBanner().catch(console.error);
          }
       }
    };
    
    window.addEventListener('resize', handleResize);
    // document focus events can also capture when inputs are focused
    const handleFocus = () => {
      if (Capacitor.isNativePlatform() && adShown) AdMob.hideBanner().catch(console.error);
    };
    const handleBlur = () => {
      if (Capacitor.isNativePlatform() && adShown) AdMob.resumeBanner().catch(console.error);
    };
    
    window.addEventListener('focusin', handleFocus);
    window.addEventListener('focusout', handleBlur);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('focusin', handleFocus);
      window.removeEventListener('focusout', handleBlur);
      if (Capacitor.isNativePlatform() && adShown) {
        AdMob.hideBanner().catch(console.error);
        AdMob.removeBanner().catch(console.error);
      }
    };
  }, []);

  if (isBannerVisible) {
    // Add spacing at bottom to prevent banner from hiding content
    return <div className="w-full h-[60px] shrink-0" />;
  }

  return null;
}
