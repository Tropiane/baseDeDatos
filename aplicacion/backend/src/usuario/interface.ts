export interface user{
    nombre: string;
    edad: number;
    correo: string;
    contrasena: string;
    telefono?: string | null;
}

export type UsuarioEditable = Pick<user, 'nombre' | 'edad' | 'correo' | 'telefono'>;
