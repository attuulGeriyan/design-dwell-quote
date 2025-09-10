// Type definitions for the interior quotation system

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  createdAt: string;
}

export interface Client {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  client: Client;
  status: 'draft' | 'in_progress' | 'completed';
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface FurnitureItem {
  id?: string;
  type: 'wardrobe' | 'kitchen' | 'tv_unit' | 'study_table' | 'shoe_rack' | 'other';
  dimensions: {
    x: number; // width
    y: number; // height  
    z: number; // depth
    skirtingHeight?: number;
    doorThickness?: number;
    backThickness?: number;
  };
  components: Record<string, number>; // component name -> quantity
  materials: {
    primary: string;
    innerLamination?: string;
    outerLamination?: string;
  };
  hardware: Record<string, number>; // hardware name -> quantity
  costs: {
    materialCost: number;
    hardwareCost: number;
    laborCost: number;
    total: number;
  };
}

export interface QuotationData {
  projectId: string;
  furnitureItems: FurnitureItem[];
  subtotal: number;
  tax: number;
  total: number;
  generatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  client: Client;
}

export interface StepData {
  dimensions?: FurnitureItem['dimensions'];
  components?: Record<string, number>;
  materials?: FurnitureItem['materials'];
  hardware?: Record<string, number>;
}