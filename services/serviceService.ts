// services/serviceService.ts
import { $fetch } from 'ofetch';

export interface Service {
  id?: number;
  nom: string;
}

export default class ServiceService {
  private baseUrl: string;
  
  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || 'http://localhost:8080/api/departements';
  }
  
  async getAll(): Promise<Service[]> {
    try {
      return await $fetch(this.baseUrl, {
        headers: this.getHeaders()
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des services:', error);
      return [];
    }
  }
  
  async getById(id: number): Promise<Service | null> {
    try {
      return await $fetch(`${this.baseUrl}/${id}`, {
        headers: this.getHeaders()
      });
    } catch (error) {
      console.error(`Erreur lors de la récupération du service ${id}:`, error);
      return null;
    }
  }
  
  async create(service: Service): Promise<Service | null> {
    try {
      // suite du code précédent...
      return await $fetch(this.baseUrl, {
        method: 'POST',
        headers: this.getHeaders(),
        body: service
      });
    } catch (error) {
      console.error('Erreur lors de la création du service:', error);
      return null;
    }
  }
  
  async update(id: number, service: Service): Promise<Service | null> {
    try {
      return await $fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: service
      });
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du service ${id}:`, error);
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
      console.error(`Erreur lors de la suppression du service ${id}:`, error);
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