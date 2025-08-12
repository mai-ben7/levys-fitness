'use client';

import { useEffect, useRef } from 'react';

export function useFormHydration() {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    // Remove fdprocessedid attributes that are added by browser extensions
    const removeExtensionAttributes = () => {
      const buttons = form.querySelectorAll('button');
      buttons.forEach(button => {
        if (button.hasAttribute('fdprocessedid')) {
          button.removeAttribute('fdprocessedid');
        }
      });
    };

    // Run immediately and also on any DOM changes
    removeExtensionAttributes();
    
    const observer = new MutationObserver(removeExtensionAttributes);
    observer.observe(form, { 
      attributes: true, 
      attributeFilter: ['fdprocessedid'],
      subtree: true 
    });

    return () => observer.disconnect();
  }, []);

  return formRef;
} 