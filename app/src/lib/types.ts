export interface Product {
  id: string;
  product_id: string; // SKU/código do produto
  title: string; // nome do produto
  price: number; // preço
  status: 'disponível' | 'vendido'; // status com acento conforme PocketBase
  images?: string[]; // array de imagens
  category?: string; // categoria
  description?: string; // descrição
  brand?: string;
  size?: string;
  // Campos legacy para compatibilidade
  codigo?: string;
  nome?: string;
  preco?: number;
  foto_url?: string;
  categoria?: string;
  descricao?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerData {
  name: string;
  email: string;
  wantsReceipt: boolean;
}

export interface CustomerState {
  data: CustomerData;
  isValid: boolean;
  emailError: string | null;
}

export interface Sale {
  id?: string;
  items: {
    id: string;
    product_id: string;
    title: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  total: number;
  customer_name?: string;
  customer_email?: string;
  wants_receipt?: boolean;
  payment_method?: string;
  sale_timestamp: string;
}