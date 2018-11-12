export interface User {
    email: string;
    password: string;
}

export interface Message {
    message: string;
}

export interface Category {
    name: string;
    imageSrc?: string;
    user?: string;
    _id?: string;
}

export interface Position {
    name: string;
    cost: number;
    category: string;
    user?: string;
    _id?: string;
    quantity?: number;
}

export interface Order {
    list: OrderPosition[]
    date?: Date
    order?: number
    user?: string
    _id?: string
}

export interface OrderPosition {
    name: string
    cost: number
    quantity: number
    _id?: string
}

export interface Filter {
    start?: Date,
    end?: Date,
    order?: number
}