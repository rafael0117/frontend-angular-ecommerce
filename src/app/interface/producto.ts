export interface Producto {
  id: number;                 // para crear puedes usar 0 o no enviarlo
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;

  categoriaId: number;
  categoriaNombre?: string;   // opcional (si el back lo envía)

  talla: string[];            // arrays
  color: string[];            // arrays

  imagenesBase64: string[];   // arrays con data:image/...;base64,XXXX
}
