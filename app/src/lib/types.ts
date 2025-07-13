export interface Product {
  id: string;
  codigo: string;
  nome: string;
  preco: number;
  status: 'disponivel' | 'vendido';
  foto_url?: string;
  categoria?: string;
  descricao?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}