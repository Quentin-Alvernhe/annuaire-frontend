// services/siteService.ts
import { $fetch } from 'ofetch';

export interface Site {
  id?: number;
  ville: string;
}

export default class SiteService {
  private baseUrl: string;
  
  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || 'http://localhost:8080/api/sites';
  }
  
  async getAll(): Promise<Site[]> {
    try {
      return await $fetch(this.baseUrl, {
        headers: this.getHeaders()
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des sites:', error);
      return [];
    }
  }
  
  async getById(id: number): Promise<Site | null> {
    try {
      return await $fetch(`${this.baseUrl}/${id}`, {
        headers: this.getHeaders()
      });
    } catch (error) {
      console.error(`Erreur lors de la récupération du site ${id}:`, error);
      return null;
    }
  }
  
  async create(site: Site): Promise<Site | null> {
    try {
      return await $fetch(this.baseUrl, {
        method: 'POST',
        headers: this.getHeaders(),
        body: site
      });
    } catch (error) {
      console.error('Erreur lors de la création du site:', error);
      return null;
    }
  }
  
  async update(id: number, site: Site): Promise<Site | null> {
    try {
      return await $fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: site
      });
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du site ${id}:`, error);
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
      console.error(`Erreur lors de la suppression du site ${id}:`, error);
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