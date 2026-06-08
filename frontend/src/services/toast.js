// Simple toast notification system
const TOAST_DURATION = 3000;

let toastContainer = null;

function ensureContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.style.cssText = `
      position: fixed; bottom: 20px; right: 20px; z-index: 9999;
      display: flex; flex-direction: column; gap: 8px;
    `;
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

export function showToast(message, type = 'success') {
  const container = ensureContainer();
  const toast = document.createElement('div');
  const bg = type === 'success' ? 'rgba(0,255,136,0.12)' : type === 'error' ? 'rgba(255,90,110,0.12)' : 'rgba(0,212,255,0.12)';
  const border = type === 'success' ? 'rgba(0,255,136,0.30)' : type === 'error' ? 'rgba(255,90,110,0.30)' : 'rgba(0,212,255,0.30)';
  const color = type === 'success' ? '#5BFFB0' : type === 'error' ? '#FF8A98' : '#67E5FF';

  toast.style.cssText = `
    padding: 10px 16px; border-radius: 10px; font-size: 13px;
    background: ${bg}; border: 1px solid ${border}; color: ${color};
    backdrop-filter: blur(8px);
    animation: fadeUp 200ms ease;
    max-width: 360px;
  `;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 300ms ease';
    setTimeout(() => toast.remove(), 300);
  }, TOAST_DURATION);
}
