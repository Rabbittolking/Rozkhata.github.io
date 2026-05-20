import Dexie, { type Table } from 'dexie';

export interface Customer {
  id?: number;
  name: string;
  phone: string;
  address?: string;
  photo?: string;
  totalUdhaar: number;
  totalJama: number;
  netBalance: number;
  createdAt: string;
}

export interface Transaction {
  id?: number;
  customerId: number;
  type: 'udhaar' | 'jama';
  amount: number;
  date: string;
  dueDate?: string;
  note?: string;
  productId?: number;
  productName?: string;
  createdAt: string;
}

export interface Product {
  id?: number;
  name: string;
  price: number;
  unit: string;
  quantity?: number;
  createdAt: string;
}

export class RozKhataDB extends Dexie {
  customers!: Table<Customer>;
  transactions!: Table<Transaction>;
  products!: Table<Product>;

  constructor() {
    super('rozkhata_db');
    this.version(1).stores({
      customers: '++id, name, phone',
      transactions: '++id, customerId, type, date',
    });
    this.version(2).stores({
      customers: '++id, name, phone',
      transactions: '++id, customerId, type, date, dueDate',
    });
    this.version(3).stores({
      customers: '++id, name, phone',
      transactions: '++id, customerId, type, date, dueDate',
      products: '++id, name'
    });
  }
}

export const db = new RozKhataDB();
