export interface Product {
    ProductId: string;
    ProductName: string;
    ProductDescription: string | null;
    ProductImages: string | null;
    ProductPrice: number;
    ProductStock: number;
    ProductOwner: string;
    CreatedAt: string | null;
    UpdatedAt: string | null;
    IsActive: boolean;
}

export interface ProductFormData {
    ProductName: string;
    ProductDescription: string;
    ProductPrice: number;
    ProductStock: number;
    ProductImage?: File | null;
    ProductOwner?: string;
}

export interface ApiResponse<T> {
    message: string;
    [key: string]: any;
}
