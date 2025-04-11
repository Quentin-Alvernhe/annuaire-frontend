<template>
    <div class="w-full max-w-xl mx-auto mb-8">
      <div class="relative">
        <input
          type="text"
          v-model="searchTerm"
          @input="onSearch"
          placeholder="Rechercher un salarié..."
          class="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        <button 
          @click="clearSearch" 
          v-if="searchTerm"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <span class="text-xl">×</span>
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  
  const searchTerm = ref('');
  const emit = defineEmits(['search']);
  
  const onSearch = () => {
    emit('search', searchTerm.value);
  };
  
  const clearSearch = () => {
    searchTerm.value = '';
    emit('search', '');
  };
  
  // Débounce pour éviter trop de requêtes lors de la saisie rapide
  let debounceTimeout: NodeJS.Timeout | null = null;
  watch(searchTerm, (newVal) => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      emit('search', newVal);
    }, 300);
  });
  </script>