/**
 * Datos oficiales de la tesis: Avance de la implementación de las acciones de
 * Restauración del Paisaje Forestal (SMRPF) 2011-2025 en Guatemala.
 * Extraído con precisión del informe Canva oficial de resultados (Febrero 2026).
 */

const THESIS_METADATA = {
    title: "Avance de la Implementación de las Acciones de Restauración del Paisaje Forestal",
    subtitle: "Sistema de Monitoreo de la Restauración del Paisaje Forestal (SMRPF) 2011–2025",
    author: "Presentación y Defensa de Tesis",
    institution: "INAB — Instituto Nacional de Bosques & Mesa Nacional de Restauración",
    period: "2011 - 2025",
    updateDate: "Febrero 2026"
};

const MODALIDADES_COLORS = {
    "M.B.N. Producción": "#3b82f6",                          // Azul
    "M.B.N. Protección": "#ea580c",                          // Naranja rojizo oficial
    "Manejo Reg. Nat.": "#94a3b8",                           // Gris plateado
    "Plantaciones forestales": "#eab308",                    // Amarillo / Dorado
    "Restauración de tierras forestales degradadas": "#0ea5e9", // Celeste brillante
    "Sistemas agroforestales": "#22c55e"                     // Verde esmeralda
};

const REGIONS_DATA = {
    "general": {
        id: "general",
        codreg: "all",
        number: "0",
        roman: "General",
        name: "General - Guatemala",
        label: "Nivel Nacional (Guatemala)",
        deptos: "Todos los departamentos (22) y 10 Regiones Administrativas",
        area_ha: 592178.79,
        carbono_tco2: 154729588.77,
        ha_ap: 83944.63,
        empleos: 308469,
        financiamiento_usd: 572967336.14,
        poligonos: 94458,
        bounds: [[13.73, -92.24], [17.82, -88.22]],
        center: [15.78, -90.23],
        zoom: 7,
        modalidades: {
            "M.B.N. Protección": 58.60,
            "Plantaciones forestales": 18.91,
            "Restauración de tierras forestales degradadas": 14.99,
            "Sistemas agroforestales": 5.41,
            "M.B.N. Producción": 1.82,
            "Manejo Reg. Nat.": 0.28
        },
        highlights: [
            "Meta nacional alcanzada de más de 592,000 hectáreas en proceso de restauración.",
            "Captura estimada acumulada superior a 154 millones de toneladas de CO₂ equivalente.",
            "Más de 308,000 empleos rurales generados y $572 millones invertidos en incentivos y restauración."
        ]
    },
    "r1": {
        id: "r1",
        codreg: "i",
        number: "1",
        roman: "I",
        name: "Región I - Metropolitana",
        label: "Región I — Metropolitana",
        deptos: "Guatemala",
        area_ha: 134223.18,
        carbono_tco2: 9054930.20,
        ha_ap: 237.16,
        empleos: 61793,
        financiamiento_usd: 173412194.35,
        poligonos: 555,
        bounds: [[14.24, -90.76], [14.91, -90.21]],
        center: [14.63, -90.51],
        zoom: 10,
        modalidades: {
            "Restauración de tierras forestales degradadas": 51.42,
            "Plantaciones forestales": 36.18,
            "Sistemas agroforestales": 10.46,
            "M.B.N. Protección": 1.57,
            "M.B.N. Producción": 0.29,
            "Manejo Reg. Nat.": 0.08
        },
        highlights: [
            "Fuerte predominio de restauración de tierras forestales degradadas (51.42%) y plantaciones (36.18%).",
            "Elevado monto de inversión ($173.4M USD) con 61,793 empleos en el cinturón metropolitano.",
            "Baja cobertura en áreas protegidas (237 Ha), concentrándose en zonas periurbanas e cuencas abastecedoras."
        ]
    },
    "r2": {
        id: "r2",
        codreg: "ii",
        number: "2",
        roman: "II",
        name: "Región II - Alta Verapaz e Ixcán",
        label: "Región II — Alta Verapaz e Ixcán",
        deptos: "Alta Verapaz e Ixcán (Quiché)",
        area_ha: 56015.36,
        carbono_tco2: 16208654.35,
        ha_ap: 1948.32,
        empleos: 29506,
        financiamiento_usd: 61383381.88,
        poligonos: 14095,
        bounds: [[15.11, -91.13], [16.07, -89.41]],
        center: [15.55, -90.25],
        zoom: 9,
        modalidades: {
            "M.B.N. Protección": 64.79,
            "Plantaciones forestales": 26.18,
            "Restauración de tierras forestales degradadas": 5.10,
            "Sistemas agroforestales": 2.91,
            "M.B.N. Producción": 0.99,
            "Manejo Reg. Nat.": 0.03
        },
        highlights: [
            "Gran densidad de proyectos familiares y comunitarios con 14,095 polígonos registrados.",
            "Predominio de M.B.N. Protección (64.79%) clave para recarga hídrica de la cuenca del Río Polochic y Chixoy.",
            "Captura significativa de 16.2M TCO2 en bosques húmedos tropicales y nubosos."
        ]
    },
    "r3": {
        id: "r3",
        codreg: "iii",
        number: "3",
        roman: "III",
        name: "Región III - Nor Oriente",
        label: "Región III — Nor Oriente",
        deptos: "Izabal, Zacapa, Chiquimula, El Progreso",
        area_ha: 125433.71,
        carbono_tco2: 42206708.85,
        ha_ap: 37779.96,
        empleos: 58528,
        financiamiento_usd: 79137209.08,
        poligonos: 16024,
        bounds: [[14.40, -90.41], [15.97, -88.22]],
        center: [15.15, -89.35],
        zoom: 9,
        modalidades: {
            "M.B.N. Protección": 79.96,
            "Plantaciones forestales": 9.60,
            "Sistemas agroforestales": 7.20,
            "Restauración de tierras forestales degradadas": 2.25,
            "M.B.N. Producción": 0.99,
            "Manejo Reg. Nat.": 0.01
        },
        highlights: [
            "Líder nacional en captura de carbono con más de 42.2 millones de TCO2.",
            "Más de 37,700 hectáreas restauradas dentro de Áreas Protegidas (Sierra de las Minas, Cerro San Gil).",
            "Casi el 80% de la superficie bajo modalidad M.B.N. Protección."
        ]
    },
    "r4": {
        id: "r4",
        codreg: "iv",
        number: "4",
        roman: "IV",
        name: "Región IV - Sur Oriente",
        label: "Región IV — Sur Oriente",
        deptos: "Jutiapa, Jalapa, Santa Rosa",
        area_ha: 27670.35,
        carbono_tco2: 9346454.85,
        ha_ap: 2527.77,
        empleos: 12445,
        financiamiento_usd: 21169166.09,
        poligonos: 4324,
        bounds: [[13.74, -90.68], [14.87, -89.50]],
        center: [14.35, -90.05],
        zoom: 9,
        modalidades: {
            "M.B.N. Protección": 79.05,
            "M.B.N. Producción": 7.37,
            "Plantaciones forestales": 6.22,
            "Sistemas agroforestales": 4.62,
            "Restauración de tierras forestales degradadas": 2.75,
            "Manejo Reg. Nat.": 0.00
        },
        highlights: [
            "Región crucial del Corredor Seco orientada a la protección de fuentes de agua (79.05% M.B.N. Protección).",
            "Inversión de $21.1M USD orientada a mitigar la sequía estacional y el avance de la degradación.",
            "Diversificación mediante M.B.N. Producción (7.37%) y agroforestería sostenible."
        ]
    },
    "r5": {
        id: "r5",
        codreg: "v",
        number: "5",
        roman: "V",
        name: "Región V - Chimaltenango y Sacatepéquez",
        label: "Región V — Chimaltenango y Sacatepéquez",
        deptos: "Chimaltenango, Sacatepéquez",
        area_ha: 9354.50,
        carbono_tco2: 2564655.22,
        ha_ap: 3339.85,
        empleos: 3400,
        financiamiento_usd: 8870020.51,
        poligonos: 2751,
        bounds: [[14.37, -91.13], [14.94, -90.61]],
        center: [14.65, -90.87],
        zoom: 10,
        modalidades: {
            "M.B.N. Protección": 70.04,
            "Plantaciones forestales": 15.97,
            "M.B.N. Producción": 7.83,
            "Sistemas agroforestales": 3.14,
            "Restauración de tierras forestales degradadas": 3.01,
            "Manejo Reg. Nat.": 0.00
        },
        highlights: [
            "Alta proporción en Áreas Protegidas (35.7% de su superficie restaurada, 3,339 Ha).",
            "Protección de laderas volcánicas (Volcán de Fuego, Acatenango, Agua) con 70% M.B.N. Protección.",
            "2,751 polígonos que articulan pequeñas propiedades minifundistas del altiplano central."
        ]
    },
    "r6": {
        id: "r6",
        codreg: "vi",
        number: "6",
        roman: "VI",
        name: "Región VI - Sur Occidente",
        label: "Región VI — Sur Occidente",
        deptos: "Quetzaltenango, San Marcos, Totonicapán, Sololá, Retalhuleu, Suchitepéquez",
        area_ha: 37024.30,
        carbono_tco2: 13916572.24,
        ha_ap: 12094.91,
        empleos: 17869,
        financiamiento_usd: 19030277.32,
        poligonos: 8469,
        bounds: [[14.52, -92.21], [15.42, -91.07]],
        center: [14.97, -91.64],
        zoom: 9,
        modalidades: {
            "M.B.N. Protección": 89.50,
            "Restauración de tierras forestales degradadas": 5.51,
            "Plantaciones forestales": 2.94,
            "M.B.N. Producción": 0.95,
            "Sistemas agroforestales": 0.96,
            "Manejo Reg. Nat.": 0.13
        },
        highlights: [
            "Máxima concentración nacional en M.B.N. Protección con un impresionante 89.50%.",
            "Gestión comunitaria e indígena de bosques comunales y parcialidades de Totonicapán y Quetzaltenango.",
            "Más de 12,000 Ha restauradas dentro del SIGAP (Áreas Protegidas)."
        ]
    },
    "r7": {
        id: "r7",
        codreg: "vii",
        number: "7",
        roman: "VII",
        name: "Región VII - Nor Occidente",
        label: "Región VII — Nor Occidente",
        deptos: "Huehuetenango, Quiché",
        area_ha: 57461.76,
        carbono_tco2: 19149646.16,
        ha_ap: 1773.18,
        empleos: 40312,
        financiamiento_usd: 53185758.46,
        poligonos: 21485,
        bounds: [[14.78, -92.12], [16.07, -90.48]],
        center: [15.42, -91.30],
        zoom: 9,
        modalidades: {
            "M.B.N. Protección": 81.05,
            "Restauración de tierras forestales degradadas": 8.64,
            "Plantaciones forestales": 3.71,
            "M.B.N. Producción": 3.15,
            "Manejo Reg. Nat.": 1.95,
            "Sistemas agroforestales": 1.51
        },
        highlights: [
            "Récord nacional en número de polígonos reportados con 21,485 predios rurales restaurados.",
            "Líder en inclusión comunitaria y generación de mano de obra con 40,312 empleos rurales.",
            "Sierra de los Cuchumatanes: 81.05% bajo M.B.N. Protección y 1.95% Manejo de Regeneración Natural."
        ]
    },
    "r8": {
        id: "r8",
        codreg: "viii",
        number: "8",
        roman: "VIII",
        name: "Región VIII - Petén",
        label: "Región VIII — Petén",
        deptos: "Petén",
        area_ha: 84356.59,
        carbono_tco2: 25076001.90,
        ha_ap: 17943.92,
        empleos: 50952,
        financiamiento_usd: 79223315.06,
        poligonos: 11316,
        bounds: [[15.85, -91.44], [17.82, -89.15]],
        center: [16.83, -90.29],
        zoom: 8,
        modalidades: {
            "M.B.N. Protección": 71.04,
            "Plantaciones forestales": 18.31,
            "Restauración de tierras forestales degradadas": 5.37,
            "Sistemas agroforestales": 3.26,
            "M.B.N. Producción": 2.01,
            "Manejo Reg. Nat.": 0.00
        },
        highlights: [
            "Segunda región en captura de carbono con más de 25 millones de TCO2 fijadas.",
            "84,356 Ha restauradas en la Reserva de la Biosfera Maya y zonas de amortiguamiento.",
            "Equilibrio entre conservación estricta (71.04%) y fomento a plantaciones comerciales de maderas preciosas (18.31%)."
        ]
    },
    "r9": {
        id: "r9",
        codreg: "ix",
        number: "9",
        roman: "IX",
        name: "Región IX - Costa Sur",
        label: "Región IX — Costa Sur",
        deptos: "Escuintla, Santa Rosa (Costa), Suchitepéquez (Costa), Retalhuleu (Costa)",
        area_ha: 27282.17,
        carbono_tco2: 5630871.26,
        ha_ap: 4051.83,
        empleos: 12072,
        financiamiento_usd: 52638952.97,
        poligonos: 6816,
        bounds: [[13.91, -92.24], [15.04, -90.58]],
        center: [14.47, -91.41],
        zoom: 9,
        modalidades: {
            "M.B.N. Protección": 49.94,
            "Plantaciones forestales": 44.78,
            "Sistemas agroforestales": 4.35,
            "Restauración de tierras forestales degradadas": 0.83,
            "M.B.N. Producción": 0.08,
            "Manejo Reg. Nat.": 0.01
        },
        highlights: [
            "Región con la más alta proporción de plantaciones forestales comerciales y teca/hule del país (44.78%).",
            "Restauración de ecosistemas clave de humedales y manglares en el litoral pacífico (4,051 Ha en SIGAP).",
            "Fuerte sinergia con el sector productivo agroindustrial y fincas azucareras/bananeras."
        ]
    },
    "r10": {
        id: "r10",
        codreg: "x",
        number: "10",
        roman: "X",
        name: "Región X - Baja Verapaz",
        label: "Región X — Baja Verapaz",
        deptos: "Baja Verapaz",
        area_ha: 33356.88,
        carbono_tco2: 11575093.73,
        ha_ap: 2247.73,
        empleos: 21591,
        financiamiento_usd: 24917060.43,
        poligonos: 8623,
        bounds: [[14.87, -90.81], [15.35, -89.89]],
        center: [15.11, -90.35],
        zoom: 10,
        modalidades: {
            "M.B.N. Protección": 79.84,
            "Plantaciones forestales": 7.77,
            "M.B.N. Producción": 6.60,
            "Restauración de tierras forestales degradadas": 3.80,
            "Sistemas agroforestales": 1.88,
            "Manejo Reg. Nat.": 0.12
        },
        highlights: [
            "Fuerte vocación protectora con 79.84% en M.B.N. Protección para la cuenca media del Río Motagua y Chixoy.",
            "8,623 polígonos y 21,591 empleos rurales generados en municipios con alta vulnerabilidad climática.",
            "Captura de 11.5M TCO2 y alta participación de comunidades locales en incentivos PINPEP y PROBOSQUE."
        ]
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { THESIS_METADATA, MODALIDADES_COLORS, REGIONS_DATA };
}
