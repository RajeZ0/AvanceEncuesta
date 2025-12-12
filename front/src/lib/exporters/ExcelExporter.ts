import ExcelJS from 'exceljs';

interface SubmissionData {
    id: string;
    user: {
        username: string;
        municipality?: string;
    };
    status: string;
    score: number | null;
    updatedAt: string;
}

export class ExcelExporter {
    private workbook: ExcelJS.Workbook;

    constructor() {
        this.workbook = new ExcelJS.Workbook();
        this.workbook.creator = 'MEPLANSUS - Sistema de Evaluación Municipal';
        this.workbook.created = new Date();
    }

    async generateReport(submissions: SubmissionData[]): Promise<ArrayBuffer> {
        // Crear las hojas
        await this.createSummarySheet(submissions);
        await this.createDetailSheet(submissions);
        await this.createModuleAnalysisSheet(submissions);

        // Generar el archivo
        const buffer = await this.workbook.xlsx.writeBuffer();
        return buffer;
    }

    private async createSummarySheet(submissions: SubmissionData[]) {
        const sheet = this.workbook.addWorksheet('Resumen General', {
            properties: { tabColor: { argb: '3B82F6' } }
        });

        // Título principal
        sheet.mergeCells('A1:F1');
        const titleCell = sheet.getCell('A1');
        titleCell.value = '📊 REPORTE DE EVALUACIONES - MEPLANSUS';
        titleCell.font = { size: 18, bold: true, color: { argb: '1E3A8A' } };
        titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
        titleCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'DBEAFE' }
        };
        sheet.getRow(1).height = 40;

        // Metadata
        sheet.getCell('A2').value = 'Fecha de generación:';
        sheet.getCell('B2').value = new Date().toLocaleDateString('es-ES', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
        sheet.getCell('A2').font = { bold: true };

        // Estadísticas clave
        const total = submissions.length;
        const completed = submissions.filter(s => s.status === 'SUBMITTED').length;
        const inProgress = submissions.filter(s => s.status === 'IN_PROGRESS').length;
        const validScores = submissions.filter(s => s.score !== null);
        const avgScore = validScores.length > 0
            ? validScores.reduce((acc, s) => acc + (s.score || 0), 0) / validScores.length
            : 0;

        const excellent = submissions.filter(s => s.score && s.score >= 80).length;
        const intermediate = submissions.filter(s => s.score && s.score >= 50 && s.score < 80).length;
        const poor = submissions.filter(s => s.score && s.score < 50).length;

        // Tabla de estadísticas
        sheet.getCell('A4').value = '📈 ESTADÍSTICAS GENERALES';
        sheet.getCell('A4').font = { size: 14, bold: true, color: { argb: '1E40AF' } };
        sheet.mergeCells('A4:B4');

        const stats = [
            ['Total de Evaluaciones', total],
            ['Completadas', `${completed} (${((completed / total) * 100).toFixed(1)}%)`],
            ['En Progreso', `${inProgress} (${((inProgress / total) * 100).toFixed(1)}%)`],
            ['Calificación Promedio', avgScore.toFixed(2)],
            ['', ''],
            ['🟢 Excelente (≥80)', excellent],
            ['🟡 Intermedio (50-79)', intermediate],
            ['🔴 Bajo (<50)', poor]
        ];

        let row = 5;
        stats.forEach(([label, value]) => {
            sheet.getCell(`A${row}`).value = label;
            sheet.getCell(`B${row}`).value = value;
            sheet.getCell(`A${row}`).font = { bold: true };

            const labelStr = String(label);
            if (labelStr.includes('🟢')) {
                sheet.getCell(`A${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D1FAE5' } };
            } else if (labelStr.includes('🟡')) {
                sheet.getCell(`A${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEF3C7' } };
            } else if (labelStr.includes('🔴')) {
                sheet.getCell(`A${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEE2E2' } };
            }
            row++;
        });

        // Explicación del modelo MEPLANSUS
        sheet.getCell('D4').value = '📝 ACERCA DE MEPLANSUS';
        sheet.getCell('D4').font = { size: 14, bold: true, color: { argb: '1E40AF' } };
        sheet.mergeCells('D4:F4');

        const explanation = [
            'MEPLANSUS es el Modelo de Evaluación y Planeación',
            'para la Sustentabilidad Municipal.',
            '',
            'Evalúa diferentes dimensiones del desarrollo',
            'municipal sostenible a través de módulos',
            'especializados.',
            '',
            'Criterios de Evaluación:',
            '🟢 Excelente: 80-100 puntos',
            '🟡 Intermedio: 50-79 puntos',
            '🔴 Bajo: 0-49 puntos'
        ];

        let explRow = 5;
        explanation.forEach(line => {
            const cell = sheet.getCell(`D${explRow}`);
            cell.value = line;
            const cellStr = String(cell.value);
            if (cellStr.includes('80-100') || cellStr.includes('50-79') || cellStr.includes('0-49')) {
                cell.font = { bold: true };
            }
            explRow++;
        });

        // Ajustar anchos de columna
        sheet.getColumn('A').width = 30;
        sheet.getColumn('B').width = 20;
        sheet.getColumn('C').width = 5;
        sheet.getColumn('D').width = 35;
        sheet.getColumn('E').width = 15;
        sheet.getColumn('F').width = 15;

        // Agregar bordes a las estadísticas
        for (let i = 5; i <= 12; i++) {
            ['A', 'B'].forEach(col => {
                const cell = sheet.getCell(`${col}${i}`);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
        }
    }

    private async createDetailSheet(submissions: SubmissionData[]) {
        const sheet = this.workbook.addWorksheet('Detalle por Municipio', {
            properties: { tabColor: { argb: '10B981' } }
        });

        // Título
        sheet.mergeCells('A1:F1');
        const titleCell = sheet.getCell('A1');
        titleCell.value = '📋 DETALLE COMPLETO POR MUNICIPIO';
        titleCell.font = { size: 16, bold: true, color: { argb: 'FFFFFF' } };
        titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
        titleCell.fill = {
            type: 'pattern', pattern: 'solid', fgColor: { argb: '10B981' }
        };
        sheet.getRow(1).height = 35;

        // Encabezados de tabla
        const headers = ['Municipio', 'Estado', 'Puntaje', 'Semáforo', 'Evaluación', 'Última Actualización'];
        headers.forEach((header, idx) => {
            const cell = sheet.getCell(3, idx + 1);
            cell.value = header;
            cell.font = { bold: true, color: { argb: 'FFFFFF' } };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '059669' }
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });
        sheet.getRow(3).height = 25;

        // Datos
        submissions.forEach((sub, idx) => {
            const row = idx + 4;
            const score = sub.score || 0;
            const status = score >= 80 ? '🟢' : score >= 50 ? '🟡' : '🔴';
            const evaluation = score >= 80 ? 'Excelente' : score >= 50 ? 'Intermedio' : 'Bajo';

            sheet.getCell(row, 1).value = sub.user.municipality || sub.user.username;
            sheet.getCell(row, 2).value = sub.status === 'SUBMITTED' ? 'Completado' : 'En Progreso';
            sheet.getCell(row, 3).value = score;
            sheet.getCell(row, 4).value = status;
            sheet.getCell(row, 5).value = evaluation;
            sheet.getCell(row, 6).value = new Date(sub.updatedAt).toLocaleDateString('es-ES');

            // Formato condicional en puntaje
            const scoreCell = sheet.getCell(row, 3);
            scoreCell.font = { bold: true };
            if (score >= 80) {
                scoreCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D1FAE5' } };
                scoreCell.font = { bold: true, color: { argb: '065F46' } };
            } else if (score >= 50) {
                scoreCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEF3C7' } };
                scoreCell.font = { bold: true, color: { argb: '92400E' } };
            } else {
                scoreCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEE2E2' } };
                scoreCell.font = { bold: true, color: { argb: '991B1B' } };
            }

            // Bordes
            for (let col = 1; col <= 6; col++) {
                const cell = sheet.getCell(row, col);
                cell.border = {
                    top: { style: 'thin', color: { argb: 'E5E7EB' } },
                    left: { style: 'thin', color: { argb: 'E5E7EB' } },
                    bottom: { style: 'thin', color: { argb: 'E5E7EB' } },
                    right: { style: 'thin', color: { argb: 'E5E7EB' } }
                };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
            }
        });

        // Anchos de columna
        sheet.getColumn(1).width = 25;
        sheet.getColumn(2).width = 15;
        sheet.getColumn(3).width = 12;
        sheet.getColumn(4).width = 12;
        sheet.getColumn(5).width = 15;
        sheet.getColumn(6).width = 20;

        // Habilitar filtros
        sheet.autoFilter = {
            from: { row: 3, column: 1 },
            to: { row: submissions.length + 3, column: 6 }
        };
    }

    private async createModuleAnalysisSheet(submissions: SubmissionData[]) {
        const sheet = this.workbook.addWorksheet('Análisis por Módulo', {
            properties: { tabColor: { argb: 'F59E0B' } }
        });

        // Título
        sheet.mergeCells('A1:D1');
        const titleCell = sheet.getCell('A1');
        titleCell.value = '📊 ANÁLISIS POR MÓDULO DE EVALUACIÓN';
        titleCell.font = { size: 16, bold: true, color: { argb: 'FFFFFF' } };
        titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
        titleCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F59E0B' }
        };
        sheet.getRow(1).height = 35;

        // Información general
        sheet.getCell('A3').value = 'Módulos Evaluados';
        sheet.getCell('A3').font = { size: 14, bold: true };

        const moduleInfo = [
            'Los módulos del sistema MEPLANSUS evalúan diferentes',
            'dimensiones del desarrollo sustentable municipal:',
            '',
            '• Gestión Administrativa',
            '• Planeación Estratégica',
            '• Desarrollo Social',
            '• Medio Ambiente y Sustentabilidad',
            '• Infraestructura y Servicios',
            '• Participación Ciudadana',
            '',
            'Cada módulo tiene un conjunto de indicadores específicos',
            'que permiten medir el desempeño municipal en esa área.'
        ];

        let row = 4;
        moduleInfo.forEach(line => {
            sheet.getCell(`A${row}`).value = line;
            if (line.startsWith('•')) {
                sheet.getCell(`A${row}`).font = { bold: true, color: { argb: 'F59E0B' } };
            }
            row++;
        });

        // Estadísticas de promedios
        sheet.getCell('A18').value = '📈 ESTADÍSTICAS GENERALES';
        sheet.getCell('A18').font = { size: 14, bold: true, color: { argb: 'D97706' } };

        const validScores = submissions.filter(s => s.score !== null);
        const avgScore = validScores.length > 0
            ? validScores.reduce((acc, s) => acc + (s.score || 0), 0) / validScores.length
            : 0;
        const maxScore = validScores.length > 0 ? Math.max(...validScores.map(s => s.score || 0)) : 0;
        const minScore = validScores.length > 0 ? Math.min(...validScores.map(s => s.score || 0)) : 0;

        const statistics = [
            ['Calificación Promedio General', avgScore.toFixed(2)],
            ['Calificación Más Alta', maxScore.toFixed(2)],
            ['Calificación Más Baja', minScore.toFixed(2)],
            ['Total de Evaluaciones Válidas', validScores.length]
        ];

        row = 19;
        statistics.forEach(([label, value]) => {
            sheet.getCell(`A${row}`).value = label;
            sheet.getCell(`B${row}`).value = value;
            sheet.getCell(`A${row}`).font = { bold: true };
            sheet.getCell(`B${row}`).alignment = { horizontal: 'center' };

            // Bordes
            ['A', 'B'].forEach(col => {
                const cell = sheet.getCell(`${col}${row}`);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
            row++;
        });

        // Anchos de columna
        sheet.getColumn('A').width = 40;
        sheet.getColumn('B').width = 20;
        sheet.getColumn('C').width = 20;
        sheet.getColumn('D').width = 20;
    }

    async downloadReport(submissions: SubmissionData[], filename: string) {
        const buffer = await this.generateReport(submissions);
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(url);
    }
}
