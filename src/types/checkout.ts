export interface FormFields {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    name: string;
    email: string;
    country: string;
}

export interface CheckoutFormRef {
    reset: () => void;
    focus: (field: keyof FormFields) => void;
    validate: () => boolean;
}