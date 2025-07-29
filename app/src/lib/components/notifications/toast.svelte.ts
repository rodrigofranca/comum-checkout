
import { v4 as uuidv4 } from 'uuid';

export type ToastMessage = {
	id: string;
	message: string;
	type: 'success' | 'error' | 'info' | 'warning';
	duration: number;
};

const toasts = $state<ToastMessage[]>([]);

function addToast(message: string, type: ToastMessage['type'] = 'info', duration = 3000) {
	const id = uuidv4();
	toasts.push({ id, message, type, duration });
	setTimeout(() => removeToast(id), duration);
}

function removeToast(id: string) {
	const index = toasts.findIndex((toast) => toast.id === id);
	if (index !== -1) {
		toasts.splice(index, 1);
	}
}

export default {
	get toasts() {
		return toasts;
	},
	addToast,
	removeToast
};

