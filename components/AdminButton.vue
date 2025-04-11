<template>
    <div class="fixed bottom-5 right-5">
      <div v-if="showAdminLogin" class="bg-white p-4 rounded-lg shadow-lg mb-2">
        <h3 class="text-lg font-medium mb-2">Connexion Admin</h3>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
          <input 
            type="text" 
            v-model="username" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
          <input 
            type="password" 
            v-model="password" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div class="flex justify-between">
          <button 
            @click="showAdminLogin = false" 
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Annuler
          </button>
          <button 
            @click="login" 
            class="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </div>
        <div v-if="errorMessage" class="mt-2 text-red-500 text-sm">
          {{ errorMessage }}
        </div>
      </div>
      
      <button 
        v-if="!isAuthenticated" 
        @click="toggleAdminLogin" 
        class="bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition"
      >
        <span v-if="!showAdminLogin">Admin</span>
        <span v-else>×</span>
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useAuthStore } from '~/stores/auth';
  import { storeToRefs } from 'pinia';
  
  const authStore = useAuthStore();
  const { isAuthenticated } = storeToRefs(authStore);
  
  const showAdminLogin = ref(false);
  const username = ref('');
  const password = ref('');
  const errorMessage = ref('');
  const isLoading = ref(false);
  
  const toggleAdminLogin = () => {
    showAdminLogin.value = !showAdminLogin.value;
    errorMessage.value = '';
  };
  
  const login = async () => {
    if (!username.value || !password.value) {
      errorMessage.value = 'Veuillez remplir tous les champs';
      return;
    }
    
    isLoading.value = true;
    errorMessage.value = '';
    
    try {
      const success = await authStore.login(username.value, password.value);
      
      if (success) {
        showAdminLogin.value = false;
        username.value = '';
        password.value = '';
      } else {
        errorMessage.value = 'Identifiants incorrects';
      }
    } catch (error) {
      errorMessage.value = 'Erreur de connexion, veuillez réessayer';
      console.error('Erreur de connexion:', error);
    } finally {
      isLoading.value = false;
    }
  };
  </script>