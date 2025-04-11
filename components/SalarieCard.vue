<template>
    <div class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition">
      <div class="px-6 py-4">
        <div class="font-bold text-xl mb-2">{{ salarie.nom }} {{ salarie.prenom }}</div>
        
        <p class="text-gray-600 text-sm mb-2">
          <span class="font-medium">Site :</span> {{ salarie.siteVille || 'Non assigné' }}
        </p>
        
        <p class="text-gray-600 text-sm mb-4">
          <span class="font-medium">Service :</span> {{ salarie.serviceNom || 'Non assigné' }}
        </p>
        
        <div class="grid grid-cols-1 gap-2 text-gray-700">
          <p v-if="salarie.telephoneFixe" class="flex items-center">
            <span class="w-6 h-6 mr-2">📞</span>
            <span>{{ formatPhone(salarie.telephoneFixe) }}</span>
          </p>
          
          <p v-if="salarie.telephonePortable" class="flex items-center">
            <span class="w-6 h-6 mr-2">📱</span>
            <span>{{ formatPhone(salarie.telephonePortable) }}</span>
          </p>
          
          <p v-if="salarie.email" class="flex items-center">
            <span class="w-6 h-6 mr-2">✉️</span>
            <span class="truncate">{{ salarie.email }}</span>
          </p>
        </div>
      </div>
      
      <div v-if="isAdmin" class="px-6 py-2 bg-gray-50 border-t border-gray-200 flex justify-end space-x-2">
        <button 
          @click="$emit('edit', salarie)" 
          class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Modifier
        </button>
        <button 
          @click="$emit('delete', salarie.id)" 
          class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Supprimer
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useAuthStore } from '~/stores/auth';
  import { storeToRefs } from 'pinia';
  import { Salarie } from '~/services/salarieService';
  
  const props = defineProps<{
    salarie: Salarie;
  }>();
  
  defineEmits(['edit', 'delete']);
  
  const authStore = useAuthStore();
  const { isAdmin } = storeToRefs(authStore);
  
  // Formatage du numéro de téléphone: 0123456789 -> 01 23 45 67 89
  const formatPhone = (phone: string): string => {
    if (!phone) return '';
    return phone.replace(/(\d{2})(?=\d)/g, '$1 ');
  };
  </script>