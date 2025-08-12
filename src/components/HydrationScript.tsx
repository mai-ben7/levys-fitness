'use client';

import Script from 'next/script';

export default function HydrationScript() {
  return (
    <Script
      id="hydration-fix"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          // Suppress hydration warnings for browser extension attributes
          (function() {
            const originalError = console.error;
            console.error = function(...args) {
              const message = args[0];
              if (typeof message === 'string' && 
                  (message.includes('fdprocessedid') || 
                   message.includes('hydration') ||
                   message.includes('server rendered HTML'))) {
                return;
              }
              originalError.apply(console, args);
            };
            
            // Remove fdprocessedid attributes from buttons
            function removeExtensionAttributes() {
              const buttons = document.querySelectorAll('button[fdprocessedid]');
              buttons.forEach(button => {
                button.removeAttribute('fdprocessedid');
              });
            }
            
            // Run on DOM ready and observe for changes
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', removeExtensionAttributes);
            } else {
              removeExtensionAttributes();
            }
            
            // Observe for new buttons being added
            const observer = new MutationObserver(function(mutations) {
              mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'fdprocessedid') {
                  const target = mutation.target;
                  if (target && target.hasAttribute('fdprocessedid')) {
                    target.removeAttribute('fdprocessedid');
                  }
                }
              });
            });
            
            observer.observe(document.body, {
              attributes: true,
              attributeFilter: ['fdprocessedid'],
              subtree: true
            });
          })();
        `,
      }}
    />
  );
} 