export interface Ruta  {
    id?: string | null;
    nombre: string;
    puntos: Punto[];
    novedades?: Novedad[];
    // vehiculos: Flota[];
    fechaInicio?: Date | null;
    fechaLlegada?: Date| null;
    recurrencia?: 'Diario' | 'Semanal' | 'Mensual' | 'Anual' | null;
};


export interface Punto  {
    id?: string | null;
    nombre: string;
    latitud: number;
    longitud: number;
    duracion?: string;
    direccion?: string;
};

export interface Novedad  {
    id?: string | null;
    nombre: string;
    tipo: 'Retrasos' | 'Incidentes en la Ruta' | 'Problemas Mecánicos' | 'Problemas con la Carga' | 'Problemas con el Conductor o Personal' | 'Factores Externos' | 'Tecnología y Comunicaciones' | 'Emergencias y Seguridad' | 'Cumplimiento Normativo' | 'Otros';
    latitud: number;
    longitud: number;
    duracion: string;
};

