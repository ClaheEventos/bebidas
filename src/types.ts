// Product types
export interface Product {
    name: string;
    unidades: string;
    pack: string;
    observacion: string;
}

export interface BarraProduct {
    name: string;
    unidadesLlenos: string;
    unidadesAbierto: string;
    observacion: string;
}

export interface FormData {
    salon: string;
    coordinadora: string;
    rol: string; // "Planificadora" or "Organizadora"
    fecha: string;
    vinosPrimeraLinea: Product[];
    vinosSegundaLinea: Product[];
    gaseosasPrimeraLinea: Product[];
    gaseosasSegundaLinea: Product[];
    barra: BarraProduct[];
}
