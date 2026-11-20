--Proofesor, en la consigna, no comprendi si los datos los creabas mediante un POST, igualmente te dejo los datos para que puedas insertarlos manualmente de ser necesario
--Aclarar que durante todo el curso utilice PostgreSQL.

create table if not exists usuario(
    id int generated always as IDENTITY PRIMARY key,
    nombre varchar(100) not null,
    edad int not null check(edad > 0 and edad <= 120),
    correo varchar(150) not null UNIQUE,
    contrasena varchar not null,
    telefono varchar(20),
    estado boolean not null DEFAULT(true),
    rol varchar not null check(rol in('Usuario', 'Administrador', 'Editor')) DEFAULT('Usuario')
);

create table if not exists recurso(
    id int generated always as identity PRIMARY key,
    nombre varchar(100) not null,
    estado varchar not null check(estado in('Disponible', 'No disponible', 'Fuera de servicio', 'Mantenimiento')) DEFAULT('Disponible'),
    detalles text
);

create table if not exists reserva(
    id int generated always as identity primary key,
    id_usuario int not null,
    id_recurso int not null,
    fecha_inicio timestamp not null,
    fecha_fin timestamp not null check(fecha_fin > fecha_inicio),
    estado varchar not null check(estado in('pendiente', 'aprobada', 'rechazada', 'cancelada')) default('pendiente'),

    CONSTRAINT fk_usuario FOREIGN KEY(id_usuario) REFERENCES usuario(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    constraint fk_recurso FOREIGN key(id_recurso) REFERENCES recurso(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

create table if not exists auditoria(
    id int generated ALWAYS as IDENTITY primary key,
    id_usuario int not null,
    fecha timestamp not null DEFAULT CURRENT_TIMESTAMP,
    accion varchar not null check(accion in('crear', 'eliminar', 'editar')),
    detalles text not null,
    entidad varchar(100) not null,
    id_entidad int not null,

    CONSTRAINT fk_usuario FOREIGN key(id_usuario) REFERENCES usuario(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);


--Contrasena para los cinco usuarios de prueba: SgrDemo2026
insert into usuario(nombre, edad, correo, telefono, estado, rol, contrasena)
values ('Juan Perez', 25, 'juan@gmail.com', '099123456', true, 'Usuario', '$2b$10$9yHV0eWlnCoDXNyGxbtmqOBrLuJdhFFhtBY281IgxYFgyO36lzMoO'),
    ('Maria Rodriguez', 32, 'maria@gmail.com', '098123456', true, 'Administrador', '$2b$10$9yHV0eWlnCoDXNyGxbtmqOBrLuJdhFFhtBY281IgxYFgyO36lzMoO'),
    ('Carlos Lopez', 28, 'carlos@gmail.com', '097123456', true, 'Editor', '$2b$10$9yHV0eWlnCoDXNyGxbtmqOBrLuJdhFFhtBY281IgxYFgyO36lzMoO'),
    ('Ana Martinez', 22, 'ana@gmail.com', null, true, 'Usuario', '$2b$10$9yHV0eWlnCoDXNyGxbtmqOBrLuJdhFFhtBY281IgxYFgyO36lzMoO'),
    ('Pedro Silva', 35, 'pedro@gmail.com', '096123456', false, 'Usuario', '$2b$10$9yHV0eWlnCoDXNyGxbtmqOBrLuJdhFFhtBY281IgxYFgyO36lzMoO');
    
insert into recurso(nombre, estado, detalles)
values('Sala de reuniones 1', 'Disponible', 'Capacidad para 10 personas'),
    ('Laboratorio de informatica', 'Disponible', '20 computadoras disponibles'),
    ('Proyector Epson', 'Mantenimiento', 'Revision tecnica'),
    ('Sala de conferencias', 'Disponible', 'Capacidad para 50 personas'),
    ('Notebook Lenovo', 'Fuera de servicio', 'Problemas de bateria'),
    ('Laboratorio de redes', 'No disponible', null);
    
insert into reserva(id_usuario, id_recurso, fecha_inicio, fecha_fin, estado)
values (1, 1, '2026-11-16 08:00:00', '2026-11-16 10:00:00', 'aprobada'),
    (2, 2, '2026-11-16 10:00:00', '2026-11-16 12:00:00', 'pendiente'),
    (3, 1, '2026-11-16 12:00:00', '2026-11-16 14:00:00', 'aprobada'),
    (4, 4, '2026-11-17 09:00:00', '2026-11-17 11:00:00', 'cancelada'),
    (1, 3, '2026-11-18 14:00:00', '2026-11-18 16:00:00', 'rechazada');
    
    
insert into auditoria(id_usuario, accion, detalles, entidad, id_entidad)
values(1, 'crear', 'Se creo una nueva reserva', 'reserva', 1),
    (2, 'editar', 'Se aprobo la reserva', 'reserva', 1),
    (2, 'crear', 'Se registro un nuevo recurso', 'recurso', 3),
    (3, 'editar', 'Se cambio el estado a mantenimiento', 'recurso', 3),
    (4, 'editar', 'Se cancelo la reserva', 'reserva', 4),
    (2, 'editar', 'Se desactivo el usuario', 'usuario', 5);
    
    
select * from usuario;
select * from recurso;
select * from reserva;
select * from auditoria;