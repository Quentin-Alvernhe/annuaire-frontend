<template>
    <div v-if="show" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="fixed inset-0 bg-black opacity-50"></div>
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 z-10">
        <h2 class="text-xl font-semibold mb-4">{{ title }}</h2>
        <p class="mb-6">{{ message }}</p>
        
        <div class="flex justify-end space-x-3">
          <button 
            @click="$emit('cancel')" 
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Annuler
          </button>
          <button 
            @click="$emit('confirm')" 
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    show: boolean;
    title: string;
    message: string;
  }>();
  
  defineEmits(['confirm', 'cancel']);
  </script>