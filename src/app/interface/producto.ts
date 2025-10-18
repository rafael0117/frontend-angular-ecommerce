export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  talla: string[];   // <-- debe ser string[]
  color: string[];
  imagen: string;
  categoriaId:number;
  categoriaNombre: string;
}