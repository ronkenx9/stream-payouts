import { Recipient } from './tempo';

// In-memory mock DB for hackathon
let globalRecipients: (Recipient & { id: string, label: string })[] = [
    { id: '1', label: 'Nigeria', address: '0x1111111111111111111111111111111111111111', amountUSDC: 5 },
    { id: '2', label: 'Philippines', address: '0x2222222222222222222222222222222222222222', amountUSDC: 5 },
    { id: '3', label: 'Brazil', address: '0x3333333333333333333333333333333333333333', amountUSDC: 5 },
    { id: '4', label: 'India', address: '0x4444444444444444444444444444444444444444', amountUSDC: 5 },
    { id: '5', label: 'Kenya', address: '0x5555555555555555555555555555555555555555', amountUSDC: 5 },
    { id: '6', label: 'Indonesia', address: '0x6666666666666666666666666666666666666666', amountUSDC: 5 },
    { id: '7', label: 'Mexico', address: '0x7777777777777777777777777777777777777777', amountUSDC: 5 },
    { id: '8', label: 'Vietnam', address: '0x8888888888888888888888888888888888888888', amountUSDC: 5 },
    { id: '9', label: 'Bangladesh', address: '0x9999999999999999999999999999999999999999', amountUSDC: 5 },
    { id: '10', label: 'Egypt', address: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', amountUSDC: 5 },
];

export function getRecipients() {
    return globalRecipients;
}

export function addRecipient(label: string, address: `0x${string}`, amountUSDC: number) {
    const newRecipient = {
        id: Math.random().toString(36).substring(7),
        label,
        address,
        amountUSDC
    };
    globalRecipients.push(newRecipient);
    return newRecipient;
}

export function removeRecipient(id: string) {
    globalRecipients = globalRecipients.filter(r => r.id !== id);
}
