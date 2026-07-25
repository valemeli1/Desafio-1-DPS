export interface product {
    id: string;
    name: string;
    descrip: string;
    category: string;
    img: string;
    price: number;
    
}

export interface cartitem extends product {
    quant: number;
    
}

export interface invoice {
    id: string;
    date: string;
    items: cartitem[];
    email: string;
    total: number;
}

export interface user{
    username: string;
    password: string;
    email: string; 
}