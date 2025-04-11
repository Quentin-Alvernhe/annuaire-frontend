// plugins/keyboard-shortcuts.client.ts
export default defineNuxtPlugin(nuxtApp => {
    // Cette fonction s'exécute uniquement côté client
    if (process.client) {
      let keysPressed: { [key: string]: boolean } = {};
  
      // Détecter les combinaisons de touches (Ctrl+Shift+A)
      document.addEventListener('keydown', (e) => {
        keysPressed[e.key.toLowerCase()] = true;
  
        if (keysPressed['control'] && keysPressed['shift'] && keysPressed['a']) {
          // Trouver le bouton Admin et le cliquer
          const adminBtn = document.querySelector('button:contains("Admin")') as HTMLElement;
          if (adminBtn) {
            adminBtn.click();
          }
        }
      });
  
      document.addEventListener('keyup', (e) => {
        keysPressed[e.key.toLowerCase()] = false;
      });
  
      // Nettoyer les écouteurs d'événements lors du démontage
      nuxtApp.hook('page:finish', () => {
        keysPressed = {};
      });
    }
  });