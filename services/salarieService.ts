// services/salarieService.ts
import { $fetch } from 'ofetch';

export interface Salarie {
  id?: number;
  nom: string;
  prenom: string;
  telephoneFixe: string;
  telephonePortable: string;
  email: string;
  serviceId?: number;
  serviceNom?: string;
  siteId?: number;
  siteVille?: string;
}

export default class SalarieService {
  private baseUrl: string;
  
  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || 'http://localhost:8080/api/salaries';
  }
  
  async getAll(): Promise<Salarie[]> {
    try {
      return await $fetch(this.baseUrl, {
        headers: this.getHeaders()
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des salariés:', error);
      return [];
    }
  }
  
  async getById(id: number): Promise<Salarie | null> {
    try {
      return await $fetch(`${this.baseUrl}/${id}`, {
        headers: this.getHeaders()
      });
    } catch (error) {
      console.error(`Erreur lors de la récupération du salarié ${id}:`, error);
      return null;
    }
  }
  
  async search(term: string): Promise<Salarie[]> {
    try {
      return await $fetch(`${this.baseUrl}/search`, {
        params: { term },
        headers: this.getHeaders()
      });
    } catch (error) {
      console.error(`Erreur lors de la recherche de salariés avec le terme "${term}":`, error);
      return [];
    }
  }
  
  async getBySiteId(siteId: number): Promise<Salarie[]> {
    try {
      return await $fetch(`${this.baseUrl}/site/${siteId}`, {
        headers: this.getHeaders()
      });
    } catch (error) {
      console.error(`Erreur lors de la récupération des salariés pour le site ${siteId}:`, error);
      return [];
    }
  }
  
  async getByServiceId(serviceId: number): Promise<Salarie[]> {
    try {
      return await $fetch(`${this.baseUrl}/service/${serviceId}`, {
        headers: this.getHeaders()
      });
    } catch (error) {
      console.error(`Erreur lors de la récupération des salariés pour le service ${serviceId}:`, error);
      return [];
    }
  }
  
  async create(salarie: Salarie): Promise<Salarie | null> {
    try {
      return await $fetch(this.baseUrl, {
        method: 'POST',
        headers: this.getHeaders(),
        body: salarie
      });
    } catch (error) {
      console.error('Erreur lors de la création du salarié:', error);
      return null;
    }
  }
  
  async update(id: number, salarie: Salarie): Promise<Salarie | null> {
    try {
      return await $fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: salarie
      });
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du salarié ${id}:`, error);
      return null;
    }
  }
  
  async delete(id: number): Promise<boolean> {
    try {
      await $fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression du salarié ${id}:`, error);
      return false;
    }
  }
  
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }
}