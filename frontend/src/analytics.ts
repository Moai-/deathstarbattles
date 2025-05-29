export const setupAnalytics = () => {
  // @ts-expect-error doesn't recognize env
  if (import.meta.env.PROD) {
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-8VGDCHXJ84';
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-8VGDCHXJ84');
    `;
    document.head.appendChild(script2);
  }
};
