<template>
    <div>
      <AppHeader />
      
      <main class="container mx-auto px-4 py-8">
        <h2 class="text-2xl font-bold mb-6">Annuaire des salariés</h2>
        
        <!-- Recherche et filtres -->
        <div class="mb-8">
          <SearchBar @search="searchSalaries" />
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FilterSelect
              id="site-filter"
              label="Filtrer par site"
              :options="siteOptions"
              defaultOption="Tous les sites"
              v-model="selectedSiteId"
              @change="filterBySite"
            />
            
            <FilterSelect
              id="service-filter"
              label="Filtrer par service"
              :options="serviceOptions"
              defaultOption="Tous les services"
              v-model="selectedServiceId"
              @change="filterByService"
            />
          </div>
        </div>
        
        <!-- Boutons d'administration -->
        <div v-if="isAdmin" class="mb-6 flex flex-wrap gap-2">
          <button
            @click="showSalarieForm = true"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Ajouter un salarié
          </button>
          
          <button
            @click="showSiteForm = true"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Gérer les sites
          </button>
          
          <button
            @click="showServiceForm = true"
            class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          >
            Gérer les services
          </button>
        </div>
        
        <!-- Liste des salariés -->
        <div v-if="isLoading" class="flex justify-center py-12">
          <p class="text-gray-500">Chargement...</p>
        </div>
        
        <div v-else-if="salaries.length === 0" class="bg-gray-100 rounded-lg p-8 text-center">
          <p class="text-gray-500">Aucun salarié trouvé</p>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SalarieCard 
            v-for="salarie in salaries" 
            :key="salarie.id" 
            :salarie="salarie"
            @edit="editSalarie"
            @delete="confirmDeleteSalarie"
          />
        </div>
        
        <!-- Formulaire d'ajout/modification de salarié -->
        <div v-if="showSalarieForm" class="fixed inset-0 flex items-center justify-center z-50">
          <div class="fixed inset-0 bg-black opacity-50" @click="showSalarieForm = false"></div>
          <div class="bg-white rounded-lg max-w-3xl w-full mx-4 z-10">
            <SalarieForm 
              :salarie="selectedSalarie" 
              :editMode="!!selectedSalarie" 
              @submit="handleSalarieSubmit" 
              @cancel="closeSalarieForm" 
            />
          </div>
        </div>
        
        <!-- Formulaire de gestion des sites -->
        <div v-if="showSiteForm" class="fixed inset-0 flex items-center justify-center z-50">
          <div class="fixed inset-0 bg-black opacity-50" @click="showSiteForm = false"></div>
          <div class="bg-white rounded-lg max-w-3xl w-full mx-4 z-10 p-6">
            <h2 class="text-xl font-semibold mb-6">Gestion des sites</h2>
            
            <button
              @click="addNewSite"
              class="px-4 py-2 mb-4 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Ajouter un site
            </button>
            
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th class="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ville
                    </th>
                    <th class="px-6 py-3 border-b text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="site in sites" :key="site.id" class="border-b hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">{{ site.ville }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        @click="editSite(site)"
                        class="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        Modifier
                      </button>
                      <button
                        @click="confirmDeleteSite(site.id)"
                        class="text-red-600 hover:text-red-800"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <!-- Formulaire d'ajout/modification de site -->
        <div v-if="showSiteEditForm" class="fixed inset-0 flex items-center justify-center z-50">
          <div class="fixed inset-0 bg-black opacity-50" @click="showSiteEditForm = false"></div>
          <div class="bg-white rounded-lg max-w-md w-full mx-4 z-10">
            <SiteForm 
              :site="selectedSite" 
              :editMode="!!selectedSite.id" 
              @submit="handleSiteSubmit" 
              @cancel="closeSiteForm" 
            />
          </div>
        </div>
        
        <!-- Formulaire de gestion des services -->
        <div v-if="showServiceForm" class="fixed inset-0 flex items-center justify-center z-50">
          <div class="fixed inset-0 bg-black opacity-50" @click="showServiceForm = false"></div>
          <div class="bg-white rounded-lg max-w-3xl w-full mx-4 z-10 p-6">
            <h2 class="text-xl font-semibold mb-6">Gestion des services</h2>
            
            <button
              @click="addNewService"
              class="px-4 py-2 mb-4 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Ajouter un service
            </button>
            
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th class="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th class="px-6 py-3 border-b text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="service in services" :key="service.id" class="border-b hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">{{ service.nom }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        @click="editService(service)"
                        class="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        Modifier
                      </button>
                      <button
                        @click="confirmDeleteService(service.id)"
                        class="text-red-600 hover:text-red-800"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <!-- Formulaire d'ajout/modification de service -->
        <div v-if="showServiceEditForm" class="fixed inset-0 flex items-center justify-center z-50">
          <div class="fixed inset-0 bg-black opacity-50" @click="showServiceEditForm = false"></div>
          <div class="bg-white rounded-lg max-w-md w-full mx-4 z-10">
            <ServiceForm 
              :service="selectedService" 
              :editMode="!!selectedService.id" 
              @submit="handleServiceSubmit" 
              @cancel="closeServiceForm" 
            />
          </div>
        </div>
        
        <!-- Modal de confirmation de suppression -->
        <ConfirmModal
          :show="showDeleteConfirm"
          title="Confirmation de suppression"
          :message="deleteConfirmMessage"
          @confirm="handleDeleteConfirm"
          @cancel="showDeleteConfirm = false"
        />
      </main>
      
      <AdminButton />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { useAuthStore } from '~/stores/auth';
  import { storeToRefs } from 'pinia';
  import SalarieService, { Salarie } from '~/services/salarieService';
  import SiteService, { Site } from '~/services/siteService';
  import ServiceService, { Service } from '~/services/serviceService';
  
  // Store d'authentification
  const authStore = useAuthStore();
  const { isAdmin } = storeToRefs(authStore);
  
  // États pour les données
  const salaries = ref<Salarie[]>([]);
  const sites = ref<Site[]>([]);
  const services = ref<Service[]>([]);
  const isLoading = ref(true);
  
  // États pour les filtres
  const searchQuery = ref('');
  const selectedSiteId = ref<number | string>('');
  const selectedServiceId = ref<number | string>('');
  
  // États pour les formulaires
  const showSalarieForm = ref(false);
  const selectedSalarie = ref<Salarie | undefined>(undefined);
  
  const showSiteForm = ref(false);
  const showSiteEditForm = ref(false);
  const selectedSite = ref<Site>({ ville: '' });
  
  const showServiceForm = ref(false);
  const showServiceEditForm = ref(false);
  const selectedService = ref<Service>({ nom: '' });
  
  // État pour la confirmation de suppression
  const showDeleteConfirm = ref(false);
  const deleteConfirmMessage = ref('');
  const deleteType = ref<'salarie' | 'site' | 'service'>('salarie');
  const deleteId = ref<number | null>(null);
  
  // Options pour les select de filtrage
  const siteOptions = computed(() => {
    return sites.value.map(site => ({
      id: site.id as number,
      label: site.ville
    }));
  });
  
  const serviceOptions = computed(() => {
    return services.value.map(service => ({
      id: service.id as number,
      label: service.nom
    }));
  });
  
  // Initialisation des données
  onMounted(async () => {
    await loadData();
    
    // Vérifier l'état d'authentification au chargement
    authStore.checkAuth();
  });
  
  const loadData = async () => {
    isLoading.value = true;
    
    try {
      // Charger les sites, services et salariés
      const siteService = new SiteService();
      const serviceService = new ServiceService();
      const salarieService = new SalarieService();
      
      const [sitesData, servicesData, salariesData] = await Promise.all([
        siteService.getAll(),
        serviceService.getAll(),
        salarieService.getAll()
      ]);
      
      sites.value = sitesData;
      services.value = servicesData;
      salaries.value = salariesData;
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      isLoading.value = false;
    }
  };
  
  // Fonctions de recherche et filtrage
  const searchSalaries = async (term: string) => {
    searchQuery.value = term;
    
    if (!term && !selectedSiteId.value && !selectedServiceId.value) {
      // Si aucun filtre, charger tous les salariés
      const salarieService = new SalarieService();
      salaries.value = await salarieService.getAll();
      return;
    }
    
    if (term) {
      // Recherche par terme
      const salarieService = new SalarieService();
      salaries.value = await salarieService.search(term);
      
      // Appliquer les filtres existants
      if (selectedSiteId.value) {
        salaries.value = salaries.value.filter(s => s.siteId === selectedSiteId.value);
      }
      
      if (selectedServiceId.value) {
        salaries.value = salaries.value.filter(s => s.serviceId === selectedServiceId.value);
      }
    }
  };
  
  const filterBySite = async (siteId: number | string) => {
    if (!siteId) {
      // Si pas de filtre de site, réappliquer uniquement les autres filtres
      if (searchQuery.value || selectedServiceId.value) {
        const salarieService = new SalarieService();
        
        if (searchQuery.value) {
          salaries.value = await salarieService.search(searchQuery.value);
        } else {
          salaries.value = await salarieService.getAll();
        }
        
        if (selectedServiceId.value) {
          salaries.value = salaries.value.filter(s => s.serviceId === selectedServiceId.value);
        }
      } else {
        // Si aucun filtre, charger tous les salariés
        const salarieService = new SalarieService();
        salaries.value = await salarieService.getAll();
      }
      return;
    }
    
    // Filtre par site
    const salarieService = new SalarieService();
    salaries.value = await salarieService.getBySiteId(Number(siteId));
    
    // Appliquer les autres filtres existants
    if (searchQuery.value) {
      salaries.value = salaries.value.filter(s => 
        s.nom.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
        s.prenom.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    }
    
    if (selectedServiceId.value) {
      salaries.value = salaries.value.filter(s => s.serviceId === selectedServiceId.value);
    }
  };
  
  const filterByService = async (serviceId: number | string) => {
    if (!serviceId) {
      // Si pas de filtre de service, réappliquer uniquement les autres filtres
      if (searchQuery.value || selectedSiteId.value) {
        const salarieService = new SalarieService();
        
        if (searchQuery.value) {
          salaries.value = await salarieService.search(searchQuery.value);
        } else {
          salaries.value = await salarieService.getAll();
        }
        
        if (selectedSiteId.value) {
          salaries.value = salaries.value.filter(s => s.siteId === selectedSiteId.value);
        }
      } else {
        // Si aucun filtre, charger tous les salariés
        const salarieService = new SalarieService();
        salaries.value = await salarieService.getAll();
      }
      return;
    }
    
    // Filtre par service
    const salarieService = new SalarieService();
    salaries.value = await salarieService.getByServiceId(Number(serviceId));
    
    // Appliquer les autres filtres existants
    if (searchQuery.value) {
      salaries.value = salaries.value.filter(s => 
        s.nom.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
        s.prenom.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    }
    
    if (selectedSiteId.value) {
      salaries.value = salaries.value.filter(s => s.siteId === selectedSiteId.value);
    }
  };
  
  // Fonctions pour la gestion des salariés
  const editSalarie = (salarie: Salarie) => {
    selectedSalarie.value = { ...salarie };
    showSalarieForm.value = true;
  };
  
  const closeSalarieForm = () => {
    showSalarieForm.value = false;
    selectedSalarie.value = undefined;
  };
  
  const handleSalarieSubmit = async (salarie: Salarie) => {
    await loadData();
    closeSalarieForm();
  };
  
  const confirmDeleteSalarie = (id: number | undefined) => {
    if (!id) return;
    
    deleteType.value = 'salarie';
    deleteId.value = id;
    deleteConfirmMessage.value = 'Êtes-vous sûr de vouloir supprimer ce salarié ? Cette action est irréversible.';
    showDeleteConfirm.value = true;
  };
  
  // Fonctions pour la gestion des sites
  const addNewSite = () => {
    selectedSite.value = { ville: '' };
    showSiteEditForm.value = true;
  };
  
  const editSite = (site: Site) => {
    selectedSite.value = { ...site };
    showSiteEditForm.value = true;
  };
  
  const closeSiteForm = () => {
    showSiteEditForm.value = false;
  };
  
  const handleSiteSubmit = async (site: Site) => {
    await loadData();
    closeSiteForm();
  };
  
  const confirmDeleteSite = (id: number | undefined) => {
    if (!id) return;
    
    deleteType.value = 'site';
    deleteId.value = id;
    deleteConfirmMessage.value = 'Êtes-vous sûr de vouloir supprimer ce site ? Tous les salariés associés à ce site seront mis à jour.';
    showDeleteConfirm.value = true;
  };
  
  // Fonctions pour la gestion des services
  const addNewService = () => {
    selectedService.value = { nom: '' };
    showServiceEditForm.value = true;
  };
  
  const editService = (service: Service) => {
    selectedService.value = { ...service };
    showServiceEditForm.value = true;
  };
  
  const closeServiceForm = () => {
    showServiceEditForm.value = false;
  };
  
  const handleServiceSubmit = async (service: Service) => {
    await loadData();
    closeServiceForm();
  };
  
  const confirmDeleteService = (id: number | undefined) => {
    if (!id) return;
    
    deleteType.value = 'service';
    deleteId.value = id;
    deleteConfirmMessage.value = 'Êtes-vous sûr de vouloir supprimer ce service ? Tous les salariés associés à ce service seront mis à jour.';
    showDeleteConfirm.value = true;
  };
  
  // Fonction de suppression
  const handleDeleteConfirm = async () => {
    if (!deleteId.value) return;
    
    try {
      switch (deleteType.value) {
        case 'salarie':
          const salarieService = new SalarieService();
          await salarieService.delete(deleteId.value);
          break;
        case 'site':
          const siteService = new SiteService();
          await siteService.delete(deleteId.value);
          break;
        case 'service':
          const serviceService = new ServiceService();
          await serviceService.delete(deleteId.value);
          break;
      }
      
      // Recharger les données
      await loadData();
    } catch (error) {
      console.error(`Erreur lors de la suppression du ${deleteType.value}:`, error);
    } finally {
      showDeleteConfirm.value = false;
      deleteId.value = null;
    }
  };
  </script>