export interface ProductoPayload {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  talla: string[];     // <— array
  color: string[];     // <— array
  categoriaId: number;
  imagenesBase64: string[];
}