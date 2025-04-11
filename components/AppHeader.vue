<template>
    <header class="bg-primary-700 text-white shadow-md">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold">Annuaire Entreprise</h1>
        
        <div>
          <button 
            v-if="isAdmin" 
            @click="logout" 
            class="px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 transition">
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  </template>
  
  <script setup lang="ts">
  import { useAuthStore } from '~/stores/auth';
  import { storeToRefs } from 'pinia';
  
  const authStore = useAuthStore();
  const { isAdmin } = storeToRefs(authStore);
  
  const logout = () => {
    authStore.logout();
  };
  </script>