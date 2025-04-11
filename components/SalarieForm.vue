<template>
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-6">{{ editMode ? 'Modifier un salarié' : 'Ajouter un salarié' }}</h2>
      
      <form @submit.prevent="submitForm">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input 
              type="text" 
              v-model="form.nom" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              :class="{ 'border-red-500': errors.nom }"
              required
            />
            <p v-if="errors.nom" class="text-red-500 text-xs mt-1">{{ errors.nom }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input 
              type="text" 
              v-model="form.prenom" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              :class="{ 'border-red-500': errors.prenom }"
              required
            />
            <p v-if="errors.prenom" class="text-red-500 text-xs mt-1">{{ errors.prenom }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              v-model="form.email" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              :class="{ 'border-red-500': errors.email }"
              required
            />
            <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone fixe</label>
            <input 
              type="text" 
              v-model="form.telephoneFixe" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              :class="{ 'border-red-500': errors.telephoneFixe }"
              placeholder="0123456789"
            />
            <p v-if="errors.telephoneFixe" class="text-red-500 text-xs mt-1">{{ errors.telephoneFixe }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone portable</label>
            <input 
              type="text" 
              v-model="form.telephonePortable" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              :class="{ 'border-red-500': errors.telephonePortable }"
              placeholder="0612345678"
            />
            <p v-if="errors.telephonePortable" class="text-red-500 text-xs mt-1">{{ errors.telephonePortable }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Site</label>
            <select 
              v-model="form.siteId" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Sélectionner un site</option>
              <option v-for="site in sites" :key="site.id" :value="site.id">{{ site.ville }}</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Service</label>
            <select 
              v-model="form.serviceId" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Sélectionner un service</option>
              <option v-for="service in services" :key="service.id" :value="service.id">{{ service.nom }}</option>
            </select>
          </div>
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
  import { Salarie } from '~/services/salarieService';
  import SalarieService from '~/services/salarieService';
  import SiteService, { Site } from '~/services/siteService';
  import ServiceService, { Service } from '~/services/serviceService';
  

  
  const props = defineProps<{
    salarie?: Salarie;
    editMode: boolean;
  }>();
  
  const emit = defineEmits(['submit', 'cancel']);
  
  const form = reactive<Salarie>({
    nom: '',
    prenom: '',
    email: '',
    telephoneFixe: '',
    telephonePortable: '',
    serviceId: undefined,
    siteId: undefined
  });
  
  const errors = reactive({
    nom: '',
    prenom: '',
    email: '',
    telephoneFixe: '',
    telephonePortable: ''
  });
  
  const sites = ref<Site[]>([]);
  const services = ref<Service[]>([]);
  const isSubmitting = ref(false);
  
  // Charger les sites et services
  onMounted(async () => {
    const siteService = new SiteService();
    const serviceService = new ServiceService();
    
    sites.value = await siteService.getAll();
    services.value = await serviceService.getAll();
    
    // Si on est en mode édition, initialiser le formulaire avec les données du salarié
    if (props.editMode && props.salarie) {
      form.id = props.salarie.id;
      form.nom = props.salarie.nom;
      form.prenom = props.salarie.prenom;
      form.email = props.salarie.email;
      form.telephoneFixe = props.salarie.telephoneFixe;
      form.telephonePortable = props.salarie.telephonePortable;
      form.serviceId = props.salarie.serviceId;
      form.siteId = props.salarie.siteId;
    }
  });
  
  const validateForm = (): boolean => {
    let isValid = true;
    
    // Réinitialiser les erreurs
    Object.keys(errors).forEach(key => {
      errors[key as keyof typeof errors] = '';
    });
    
    // Validation du nom
    if (!form.nom.trim()) {
      errors.nom = 'Le nom est obligatoire';
      isValid = false;
    }
    
    // Validation du prénom
    if (!form.prenom.trim()) {
      errors.prenom = 'Le prénom est obligatoire';
      isValid = false;
    }
    
    // Validation de l'email
    if (!form.email.trim()) {
      errors.email = 'L\'email est obligatoire';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'L\'email n\'est pas valide';
      isValid = false;
    }
    
    // Validation du téléphone fixe (si fourni)
    if (form.telephoneFixe && !/^[0-9]{10}$/.test(form.telephoneFixe)) {
      errors.telephoneFixe = 'Le téléphone fixe doit contenir 10 chiffres';
      isValid = false;
    }
    
    // Validation du téléphone portable (si fourni)
    if (form.telephonePortable && !/^[0-9]{10}$/.test(form.telephonePortable)) {
      errors.telephonePortable = 'Le téléphone portable doit contenir 10 chiffres';
      isValid = false;
    }
    
    return isValid;
  };
  
  const submitForm = async () => {
    if (!validateForm()) return;
    
    isSubmitting.value = true;
    
    try {
      const salarieService = new SalarieService();
      let result;
      
      if (props.editMode && form.id) {
        result = await salarieService.update(form.id, form);
      } else {
        result = await salarieService.create(form);
      }
      
      if (result) {
        emit('submit', result);
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du salarié:', error);
    } finally {
      isSubmitting.value = false;
    }
  };
  </script>