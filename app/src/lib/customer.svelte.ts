import type { CustomerData, CustomerState } from '$lib/types';

// Estado inicial do cliente
const initialCustomerData: CustomerData = {
	name: '',
	email: '',
	wantsReceipt: false
};

// Estado reativo do cliente
export const customerState = $state<CustomerState>({
	data: { ...initialCustomerData },
	isValid: true,
	emailError: null
});

// Validação de email usando regex robusta
export function validateEmail(email: string): boolean {
	if (!email.trim()) return true; // Email vazio é válido se não obrigatório
	
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	return emailRegex.test(email.trim());
}

// Atualizar dados do cliente
export function setCustomerData(field: keyof CustomerData, value: string | boolean) {
	customerState.data[field] = value as never;
	
	// Validar email quando alterado
	if (field === 'email') {
		const email = value as string;
		if (email && !validateEmail(email)) {
			customerState.emailError = 'Email deve ter um formato válido';
			customerState.isValid = false;
		} else {
			customerState.emailError = null;
			customerState.isValid = canFinalizePurchase();
		}
	}
	
	// Revalidar quando checkbox de recibo muda
	if (field === 'wantsReceipt') {
		customerState.isValid = canFinalizePurchase();
		customerState.emailError = null;
	}
}

// Verificar se pode finalizar compra
export function canFinalizePurchase(): boolean {
	const { data } = customerState;
	
	// Se não quer recibo, pode finalizar sem email
	if (!data.wantsReceipt) {
		return true;
	}
	
	// Se quer recibo, email é obrigatório e deve ser válido
	if (data.wantsReceipt) {
		return data.email.trim() !== '' && validateEmail(data.email);
	}
	
	return true;
}

// Limpar dados do cliente
export function clearCustomerData() {
	customerState.data = { ...initialCustomerData };
	customerState.isValid = true;
	customerState.emailError = null;
}

// Obter dados do cliente (para envio ao backend)
export function getCustomerData(): CustomerData {
	return { ...customerState.data };
}

// Persistir dados no localStorage (para recuperação em caso de reload)
export function saveToLocalStorage() {
	if (typeof window !== 'undefined') {
		localStorage.setItem('customer-data', JSON.stringify(customerState.data));
	}
}

// Recuperar dados do localStorage
export function loadFromLocalStorage() {
	if (typeof window !== 'undefined') {
		const saved = localStorage.getItem('customer-data');
		if (saved) {
			try {
				const data = JSON.parse(saved);
				customerState.data = { ...initialCustomerData, ...data };
				customerState.isValid = canFinalizePurchase();
			} catch (error) {
				console.warn('Erro ao recuperar dados do cliente do localStorage:', error);
			}
		}
	}
}

// Limpar dados do localStorage
export function clearLocalStorage() {
	if (typeof window !== 'undefined') {
		localStorage.removeItem('customer-data');
	}
}