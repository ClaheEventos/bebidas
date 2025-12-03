import jsPDF from 'jspdf';
import type { FormData } from '../types';

export const generatePDF = (formData: FormData) => {
    const doc = new jsPDF();

    // Set font
    doc.setFont('helvetica');

    // Title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PLANILLA DE STOCK BEBIDAS EN SALONES', 105, 15, { align: 'center' });

    // Salon and Date info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const roleText = (formData.rol || 'PLANIFICADORA').toUpperCase();
    doc.text(`${roleText}: ${formData.coordinadora}`, 20, 30);
    doc.text(`SALÓN: ${formData.salon}`, 20, 37);
    doc.text(`FECHA DE CONTEO: ${formData.fecha}`, 20, 44);

    let yPosition = 55;

    // Helper function to draw a table
    const drawTable = (title: string, headers: string[], data: any[], startY: number) => {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setFillColor(60, 60, 60);
        doc.rect(20, startY, 170, 6, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text(title, 105, startY + 4.5, { align: 'center' });

        startY += 6;

        // Headers
        doc.setFillColor(200, 200, 200);
        // Headers
        doc.setFillColor(200, 200, 200);
        doc.rect(20, startY, 170, 5, 'F');
        doc.setTextColor(0, 0, 0);

        // Use smaller font for Barra table headers (5 columns)
        const headerFontSize = headers.length === 4 ? 8 : 6.5;
        doc.setFontSize(headerFontSize);

        // Adjusted column widths - wider for Barra table
        const colWidths = headers.length === 4
            ? [80, 30, 30, 30]
            : [60, 30, 30, 30, 20]; // Product, Llenos, Abierto, Observación (adjusted)

        let xPos = 20;
        headers.forEach((header, i) => {
            doc.text(header, xPos + colWidths[i] / 2, startY + 3.5, { align: 'center' });
            xPos += colWidths[i];
        });

        startY += 5;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8); // Reset to normal size for data

        // Data rows
        data.forEach((row, index) => {
            // Check if we need a new page (leave more margin for safety)
            if (startY > 265) {
                doc.addPage();
                startY = 20;
            }

            // Alternate row colors
            if (index % 2 === 0) {
                doc.setFillColor(245, 245, 245);
                doc.rect(20, startY, 170, 5.5, 'F');
            }

            xPos = 20;

            if (title.includes('BARRA')) {
                // Barra products
                doc.text(row.name, xPos + 2, startY + 4);
                doc.text(row.unidadesLlenos || '', xPos + 80 + 15, startY + 4, { align: 'center' });
                doc.text(row.unidadesAbierto || '', xPos + 110 + 15, startY + 4, { align: 'center' });
                doc.text(row.observacion || '', xPos + 140 + 2, startY + 4);
            } else {
                // Regular products
                doc.text(row.name, xPos + 2, startY + 4);
                doc.text(row.unidades || '', xPos + 80 + 15, startY + 4, { align: 'center' });
                doc.text(row.pack || '', xPos + 110 + 15, startY + 4, { align: 'center' });
                doc.text(row.observacion || '', xPos + 140 + 2, startY + 4);
            }

            startY += 5.5;
        });

        return startY + 5;
    };

    // Draw all tables
    yPosition = drawTable(
        'VINOS (1RA Y 2DA LÍNEA)',
        ['PRODUCTOS', 'UNIDADES', 'PACK', 'OBSERVACIÓN'],
        [...formData.vinosPrimeraLinea, ...formData.vinosSegundaLinea],
        yPosition
    );

    if (yPosition > 220) {
        doc.addPage();
        yPosition = 20;
    }

    yPosition = drawTable(
        'GASEOSAS PRIMERA LÍNEA',
        ['PRODUCTOS', 'UNIDADES', 'PACK', 'OBSERVACIÓN'],
        formData.gaseosasPrimeraLinea,
        yPosition
    );

    if (yPosition > 220) {
        doc.addPage();
        yPosition = 20;
    }

    yPosition = drawTable(
        'GASEOSAS SEGUNDA LÍNEA',
        ['PRODUCTOS', 'UNIDADES', 'PACK', 'OBSERVACIÓN'],
        formData.gaseosasSegundaLinea,
        yPosition
    );

    if (yPosition > 160) {
        doc.addPage();
        yPosition = 20;
    }

    yPosition = drawTable(
        'BARRA (COLOCAR POR UNIDADES)',
        ['PRODUCTOS', 'ULLENOS', 'ABIERTO', 'OBSERVACIÓN'],
        formData.barra,
        yPosition
    );

    // Footer - ensure there's enough space
    if (yPosition > 240) {
        doc.addPage();
        yPosition = 20;
    }

    yPosition += 10;
    doc.setFontSize(9);
    doc.text('FIRMA Y ACLARACIÓN', 20, yPosition);
    const footerRoleText = (formData.rol || 'PLANIFICADORA').toUpperCase();
    doc.text(footerRoleText, 20, yPosition + 5);
    doc.line(20, yPosition + 15, 120, yPosition + 15);

    // Save PDF
    const fileName = `Stock_${formData.salon}_${formData.fecha}.pdf`;
    doc.save(fileName);
};
