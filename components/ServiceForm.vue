<template>
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-6">{{ editMode ? 'Modifier un service' : 'Ajouter un service' }}</h2>
      
      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Nom du service</label>
          <input 
            type="text" 
            v-model="form.nom" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            :class="{ 'border-red-500': error }"
            required
          />
          <p v-if="error" class="text-red-500 text-xs mt-1">{{ error }}</p>
        </div>
        
        <div class="flex justify-end space-x-3">
          <button 
            type="button" 
            @click="$emit('cancel')" 
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            class="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
            :disabled="isSubmitting"
          >
          {{ isSubmitting ? 'Enregistrement...' : (editMode ? 'Mettre à jour' : 'Ajouter') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import ServiceService, { Service } from '~/services/serviceService';

const props = defineProps<{
  service?: Service;
  editMode: boolean;
}>();

const emit = defineEmits(['submit', 'cancel']);

const form = reactive<Service>({
  nom: ''
});

const error = ref('');
const isSubmitting = ref(false);

// Initialisation en mode édition
onMounted(() => {
  if (props.editMode && props.service) {
    form.id = props.service.id;
    form.nom = props.service.nom;
  }
});

const submitForm = async () => {
  if (!form.nom.trim()) {
    error.value = 'Le nom du service est obligatoire';
    return;
  }
  
  error.value = '';
  isSubmitting.value = true;
  
  try {
    const serviceService = new ServiceService();
    let result;
    
    if (props.editMode && form.id) {
      result = await serviceService.update(form.id, form);
    } else {
      result = await serviceService.create(form);
    }
    
    if (result) {
      emit('submit', result);
    }
  } catch (error: any) {
    if (error.response?.status === 409) {
      error.value = 'Un service avec ce nom existe déjà';
    } else {
      error.value = 'Une erreur est survenue lors de l\'enregistrement';
    }
    console.error('Erreur lors de l\'enregistrement du service:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>