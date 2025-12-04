import { useState } from 'react';
import type { FormData, Product } from '../types';
import {
    SALONES,
    VINOS_PRIMERA_LINEA,
    VINOS_SEGUNDA_LINEA,
    GASEOSAS_PRIMERA_LINEA,
    GASEOSAS_SEGUNDA_LINEA,
    BARRA
} from '../constants';
import { generatePDF } from '../utils/pdfGenerator';
import './StockForm.css';

const StockForm = () => {
    const [formData, setFormData] = useState<FormData>({
        salon: '',
        coordinadora: '',
        rol: 'Planificadora',
        fecha: new Date().toISOString().split('T')[0],
        vinosPrimeraLinea: VINOS_PRIMERA_LINEA.map(name => ({ name, unidades: '', pack: '', observacion: '' })),
        vinosSegundaLinea: VINOS_SEGUNDA_LINEA.map(name => ({ name, unidades: '', pack: '', observacion: '' })),
        gaseosasPrimeraLinea: GASEOSAS_PRIMERA_LINEA.map(name => ({ name, unidades: '', pack: '', observacion: '' })),
        gaseosasSegundaLinea: GASEOSAS_SEGUNDA_LINEA.map(name => ({ name, unidades: '', pack: '', observacion: '' })),
        barra: BARRA.map(name => ({ name, unidadesLlenos: '', unidadesAbierto: '', observacion: '' }))
    });

    const updateProduct = (category: keyof FormData, index: number, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [category]: (prev[category] as any[]).map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };

    const handleGeneratePDF = () => {
        if (!formData.salon || !formData.coordinadora) {
            alert('Por favor complete el salón y el nombre de la Planificadora/Organizadora');
            return;
        }
        generatePDF(formData);
    };

    const renderProductTable = (
        title: string,
        category: 'vinosPrimeraLinea' | 'vinosSegundaLinea' | 'gaseosasPrimeraLinea' | 'gaseosasSegundaLinea',
        products: Product[]
    ) => (
        <div className="table-container">
            <h3 className="table-title">{title}</h3>
            <table className="product-table">
                <thead>
                    <tr>
                        <th>PRODUCTOS</th>
                        <th>UNIDADES</th>
                        <th>PACK</th>
                        <th>OBSERVACIÓN</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={index}>
                            <td className="product-name">{product.name}</td>
                            <td>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={product.unidades}
                                    onChange={(e) => updateProduct(category, index, 'unidades', e.target.value)}
                                    placeholder="0"
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={product.pack}
                                    onChange={(e) => updateProduct(category, index, 'pack', e.target.value)}
                                    placeholder="0"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={product.observacion}
                                    onChange={(e) => updateProduct(category, index, 'observacion', e.target.value)}
                                    placeholder="Observaciones"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderBarraTable = () => (
        <div className="table-container">
            <h3 className="table-title">BARRA (COLOCAR POR UNIDADES)</h3>
            <table className="product-table">
                <thead>
                    <tr>
                        <th>PRODUCTOS</th>
                        <th>UNIDADES LLENOS</th>
                        <th>UNIDADES ABIERTO</th>
                        <th>OBSERVACIÓN</th>
                    </tr>
                </thead>
                <tbody>
                    {formData.barra.map((product, index) => (
                        <tr key={index}>
                            <td className="product-name">{product.name}</td>
                            <td>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={product.unidadesLlenos}
                                    onChange={(e) => updateProduct('barra', index, 'unidadesLlenos', e.target.value)}
                                    placeholder="0"
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={product.unidadesAbierto}
                                    onChange={(e) => updateProduct('barra', index, 'unidadesAbierto', e.target.value)}
                                    placeholder="0"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={product.observacion}
                                    onChange={(e) => updateProduct('barra', index, 'observacion', e.target.value)}
                                    placeholder="Observaciones"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="stock-form">
            <div className="form-header">
                <h1>PLANILLA DE STOCK BEBIDAS EN SALONES</h1>
                <div className="header-info">
                    <div className="info-group">
                        <label>ROL</label>
                        <select
                            value={formData.rol}
                            onChange={(e) => setFormData(prev => ({ ...prev, rol: e.target.value }))}
                            className="header-input"
                        >
                            <option value="Planificadora">Planificadora</option>
                            <option value="Organizadora">Organizadora</option>
                        </select>
                    </div>
                    <div className="info-group">
                        <label>NOMBRE</label>
                        <input
                            type="text"
                            value={formData.coordinadora}
                            onChange={(e) => setFormData(prev => ({ ...prev, coordinadora: e.target.value }))}
                            placeholder="Nombre completo"
                            className="header-input"
                        />
                    </div>
                    <div className="info-group">
                        <label>SALÓN</label>
                        <select
                            value={formData.salon}
                            onChange={(e) => setFormData(prev => ({ ...prev, salon: e.target.value }))}
                            className="header-input"
                        >
                            <option value="">Seleccione un salón</option>
                            {SALONES.map(salon => (
                                <option key={salon} value={salon}>{salon}</option>
                            ))}
                        </select>
                    </div>
                    <div className="info-group">
                        <label>FECHA DE CONTEO</label>
                        <input
                            type="date"
                            value={formData.fecha}
                            onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
                            className="header-input"
                        />
                    </div>
                </div>
            </div>

            <div className="table-container">
                <h3 className="table-title">VINOS (1RA Y 2DA LÍNEA)</h3>
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>PRODUCTOS</th>
                            <th>UNIDADES</th>
                            <th>PACK</th>
                            <th>OBSERVACIÓN</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formData.vinosPrimeraLinea.map((product, index) => (
                            <tr key={`1ra-${index}`}>
                                <td className="product-name">{product.name}</td>
                                <td>
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={product.unidades}
                                        onChange={(e) => updateProduct('vinosPrimeraLinea', index, 'unidades', e.target.value)}
                                        placeholder="0"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={product.pack}
                                        onChange={(e) => updateProduct('vinosPrimeraLinea', index, 'pack', e.target.value)}
                                        placeholder="0"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={product.observacion}
                                        onChange={(e) => updateProduct('vinosPrimeraLinea', index, 'observacion', e.target.value)}
                                        placeholder="Observaciones"
                                    />
                                </td>
                            </tr>
                        ))}
                        {formData.vinosSegundaLinea.map((product, index) => (
                            <tr key={`2da-${index}`}>
                                <td className="product-name">{product.name}</td>
                                <td>
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={product.unidades}
                                        onChange={(e) => updateProduct('vinosSegundaLinea', index, 'unidades', e.target.value)}
                                        placeholder="0"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={product.pack}
                                        onChange={(e) => updateProduct('vinosSegundaLinea', index, 'pack', e.target.value)}
                                        placeholder="0"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={product.observacion}
                                        onChange={(e) => updateProduct('vinosSegundaLinea', index, 'observacion', e.target.value)}
                                        placeholder="Observaciones"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {renderProductTable('GASEOSAS PRIMERA LÍNEA', 'gaseosasPrimeraLinea', formData.gaseosasPrimeraLinea)}
            {renderProductTable('GASEOSAS SEGUNDA LÍNEA', 'gaseosasSegundaLinea', formData.gaseosasSegundaLinea)}
            {renderBarraTable()}

            <div className="form-footer">
                <button
                    onClick={handleGeneratePDF}
                    className="generate-btn"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Generar PDF
                </button>
            </div>
        </div>
    );
};

export default StockForm;
