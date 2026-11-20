export default interface auditoria{
    id_usuario: number;
    accion: 'crear' | 'editar' | 'eliminar';
    detalles: string;
    entidad: string;
    id_entidad: number;
}
