// Live CSS Injector for Acode + Vite
const updateCSS = () => {
  document.querySelectorAll('link[rel=stylesheet]').forEach(link => {
    const href = link.href.split('?')[0];
    link.href = href + '?t=' + new Date().getTime();
  });
};
const observer = new MutationObserver(() => updateCSS());
observer.observe(document.head, { childList: true, subtree: true });
console.log('🎨 Live CSS injector active — all CSS changes now reflect instantly!');
