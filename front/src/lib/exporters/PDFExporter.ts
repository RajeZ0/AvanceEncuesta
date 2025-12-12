import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

export class PDFExporter {
    private doc: jsPDF;
    private pageWidth: number;
    private pageHeight: number;
    private margin: number = 20;

    constructor() {
        this.doc = new jsPDF('p', 'mm', 'a4');
        this.pageWidth = this.doc.internal.pageSize.getWidth();
        this.pageHeight = this.doc.internal.pageSize.getHeight();
    }

    async generateReport(submissions: SubmissionData[]): Promise<Blob> {
        this.createCoverPage();
        this.createExecutiveSummary(submissions);
        this.createDetailedResults(submissions);
        this.createConclusions(submissions);

        return this.doc.output('blob');
    }

    private createCoverPage() {
        // Fondo degradado simulado
        this.doc.setFillColor(30, 58, 138); // bg-blue-900
        this.doc.rect(0, 0, this.pageWidth, 80, 'F');

        // Título principal
        this.doc.setTextColor(255, 255, 255);
        this.doc.setFontSize(28);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text('REPORTE DE EVALUACIONES', this.pageWidth / 2, 35, { align: 'center' });

        this.doc.setFontSize(20);
        this.doc.text('MEPLANSUS', this.pageWidth / 2, 50, { align: 'center' });

        this.doc.setFontSize(12);
        this.doc.setFont('helvetica', 'normal');
        this.doc.text('Modelo de Evaluación y Planeación para la Sustentabilidad Municipal',
            this.pageWidth / 2, 62, { align: 'center' });

        // Información de fecha
        this.doc.setTextColor(0, 0, 0);
        this.doc.setFontSize(11);
        const today = new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        this.doc.text(`Fecha de generación: ${today}`, this.pageWidth / 2, 100, { align: 'center' });

        // Icono/Badge simulado
        this.doc.setFillColor(59, 130, 246); // bg-blue-500
        this.doc.circle(this.pageWidth / 2, 140, 25, 'F');

        this.doc.setTextColor(255, 255, 255);
        this.doc.setFontSize(24);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text('[ MEPLANSUS ]', this.pageWidth / 2, 145, { align: 'center' });

        // Descripción
        this.doc.setTextColor(100, 116, 139);
        this.doc.setFontSize(10);
        this.doc.setFont('helvetica', 'normal');
        const description = [
            'Este reporte contiene una evaluación detallada del desempeño',
            'municipal en diferentes dimensiones del desarrollo sustentable.',
            '',
            'Incluye análisis estadísticos, comparativos y recomendaciones',
            'basadas en los resultados obtenidos.'
        ];

        let yPos = 180;
        description.forEach(line => {
            this.doc.text(line, this.pageWidth / 2, yPos, { align: 'center' });
            yPos += 6;
        });

        // Footer
        this.doc.setFontSize(8);
        this.doc.setTextColor(156, 163, 175);
        this.doc.text('Sistema de Evaluación Municipal | MEPLANSUS',
            this.pageWidth / 2, this.pageHeight - 15, { align: 'center' });
    }

    private createExecutiveSummary(submissions: SubmissionData[]) {
        this.doc.addPage();

        // Título de sección
        this.addSectionTitle('>> RESUMEN EJECUTIVO', 1);

        // Introducción sobre MEPLANSUS
        this.doc.setFontSize(10);
        this.doc.setFont('helvetica', 'normal');
        this.doc.setTextColor(55, 65, 81);

        const intro = [
            'MEPLANSUS (Modelo de Evaluación y Planeación para la Sustentabilidad Municipal)',
            'es un sistema integral diseñado para evaluar el desempeño de los municipios en',
            'materia de desarrollo sustentable. A través de diversos módulos especializados,',
            'se analizan aspectos clave de la gestión municipal.',
            '',
            'Criterios de Evaluación:'
        ];

        let yPos = 45;
        intro.forEach(line => {
            this.doc.text(line, this.margin, yPos);
            yPos += 5;
        });

        // Tabla de criterios
        yPos += 3;
        const criteriaData = [
            ['[A] Excelente', '80 - 100 puntos', 'Desempeño sobresaliente, cumple ampliamente con los objetivos'],
            ['[M] Intermedio', '50 - 79 puntos', 'Desempeño aceptable, con áreas de oportunidad identificadas'],
            ['[B] Bajo', '0 - 49 puntos', 'Requiere atención prioritaria y mejora significativa']
        ];

        autoTable(this.doc, {
            startY: yPos,
            head: [['Nivel', 'Rango', 'Descripción']],
            body: criteriaData,
            theme: 'grid',
            headStyles: {
                fillColor: [59, 130, 246],
                textColor: 255,
                fontStyle: 'bold'
            },
            styles: {
                fontSize: 9,
                cellPadding: 4
            },
            columnStyles: {
                0: { cellWidth: 35, fontStyle: 'bold' },
                1: { cellWidth: 35 },
                2: { cellWidth: 90 }
            }
        });

        // Estadísticas clave
        const total = submissions.length;
        const completed = submissions.filter(s => s.status === 'SUBMITTED').length;
        const validScores = submissions.filter(s => s.score !== null);
        const avgScore = validScores.length > 0
            ? validScores.reduce((acc, s) => acc + (s.score || 0), 0) / validScores.length
            : 0;

        const excellent = submissions.filter(s => s.score && s.score >= 80).length;
        const intermediate = submissions.filter(s => s.score && s.score >= 50 && s.score < 80).length;
        const poor = submissions.filter(s => s.score && s.score < 50).length;

        //@ts-ignore
        yPos = this.doc.lastAutoTable.finalY + 10;

        // Sección de estadísticas
        this.doc.setFontSize(12);
        this.doc.setFont('helvetica', 'bold');
        this.doc.setTextColor(30, 64, 175);
        this.doc.text('Estadísticas Generales', this.margin, yPos);
        yPos += 8;

        const statsData = [
            ['Total de Evaluaciones', total.toString()],
            ['Evaluaciones Completadas', `${completed} (${((completed / total) * 100).toFixed(1)}%)`],
            ['Calificación Promedio Global', avgScore.toFixed(2) + ' puntos'],
            ['', ''],
            ['Distribución por Nivel:', ''],
            ['  [A] Excelente', `${excellent} municipios (${((excellent / total) * 100).toFixed(1)}%)`],
            ['  [M] Intermedio', `${intermediate} municipios (${((intermediate / total) * 100).toFixed(1)}%)`],
            ['  [B] Bajo', `${poor} municipios (${((poor / total) * 100).toFixed(1)}%)`]
        ];

        autoTable(this.doc, {
            startY: yPos,
            body: statsData,
            theme: 'plain',
            styles: {
                fontSize: 10,
                cellPadding: 3
            },
            columnStyles: {
                0: { cellWidth: 80, fontStyle: 'bold', textColor: [55, 65, 81] },
                1: { cellWidth: 80, halign: 'right', textColor: [30, 64, 175], fontStyle: 'bold' }
            }
        });

        // Interpretación
        //@ts-ignore
        yPos = this.doc.lastAutoTable.finalY + 10;

        this.doc.setFontSize(12);
        this.doc.setFont('helvetica', 'bold');
        this.doc.setTextColor(30, 64, 175);
        this.doc.text('Interpretación de Resultados', this.margin, yPos);
        yPos += 7;

        this.doc.setFontSize(10);
        this.doc.setFont('helvetica', 'normal');
        this.doc.setTextColor(55, 65, 81);

        let interpretation = '';
        if (avgScore >= 80) {
            interpretation = 'El promedio general muestra un EXCELENTE desempeño municipal, con una gestión sobresaliente en las áreas evaluadas. Se recomienda mantener las buenas prácticas y compartir experiencias exitosas con otros municipios.';
        } else if (avgScore >= 50) {
            interpretation = 'El promedio general indica un desempeño INTERMEDIO. Existen fortalezas identificadas, pero también áreas de oportunidad que requieren atención para mejorar la gestión municipal y alcanzar niveles óptimos.';
        } else {
            interpretation = 'El promedio general señala que se requiere una MEJORA PRIORITARIA en varios aspectos de la gestión municipal. Se recomienda desarrollar un plan de acción enfocado en las áreas más críticas.';
        }

        const interpretationLines = this.doc.splitTextToSize(interpretation, this.pageWidth - 2 * this.margin);
        this.doc.text(interpretationLines, this.margin, yPos);

        // Footer de página
        this.addPageFooter(2);
    }

    private createDetailedResults(submissions: SubmissionData[]) {
        this.doc.addPage();

        this.addSectionTitle('>> RESULTADOS DETALLADOS', 3);

        // Subtítulo
        this.doc.setFontSize(10);
        this.doc.setFont('helvetica', 'italic');
        this.doc.setTextColor(100, 116, 139);
        this.doc.text('Evaluación completa de cada municipio participante', this.margin, 45);

        // Tabla de resultados
        const tableData = submissions.map(sub => {
            const score = sub.score || 0;
            const semaphore = score >= 80 ? '[A]' : score >= 50 ? '[M]' : '[B]';
            const evaluation = score >= 80 ? 'Excelente' : score >= 50 ? 'Intermedio' : 'Bajo';
            const status = sub.status === 'SUBMITTED' ? 'Completado' : 'En Progreso';
            const date = new Date(sub.updatedAt).toLocaleDateString('es-ES');

            return [
                sub.user.municipality || sub.user.username,
                status,
                score.toFixed(1),
                semaphore,
                evaluation,
                date
            ];
        });

        autoTable(this.doc, {
            startY: 52,
            head: [['Municipio', 'Estado', 'Puntaje', 'Nivel', 'Evaluacion', 'Fecha']],
            body: tableData,
            theme: 'striped',
            headStyles: {
                fillColor: [59, 130, 246],
                textColor: 255,
                fontStyle: 'bold',
                halign: 'center'
            },
            styles: {
                fontSize: 9,
                cellPadding: 4,
                halign: 'center'
            },
            columnStyles: {
                0: { cellWidth: 50, halign: 'left' },
                1: { cellWidth: 25 },
                2: { cellWidth: 20, fontStyle: 'bold' },
                3: { cellWidth: 15 },
                4: { cellWidth: 25 },
                5: { cellWidth: 30 }
            },
            didParseCell: function (data) {
                // Colorear el puntaje según el valor
                if (data.column.index === 2 && data.section === 'body') {
                    const score = parseFloat(data.cell.text[0]);
                    if (score >= 80) {
                        data.cell.styles.fillColor = [209, 250, 229]; // green-100
                        data.cell.styles.textColor = [6, 95, 70]; // green-900
                    } else if (score >= 50) {
                        data.cell.styles.fillColor = [254, 243, 199]; // yellow-100
                        data.cell.styles.textColor = [146, 64, 14]; // yellow-900
                    } else {
                        data.cell.styles.fillColor = [254, 226, 226]; // red-100
                        data.cell.styles.textColor = [153, 27, 27]; // red-900
                    }
                }
            }
        });

        this.addPageFooter(3);
    }

    private createConclusions(submissions: SubmissionData[]) {
        this.doc.addPage();

        this.addSectionTitle('>> CONCLUSIONES Y RECOMENDACIONES', 4);

        const validScores = submissions.filter(s => s.score !== null);
        const avgScore = validScores.length > 0
            ? validScores.reduce((acc, s) => acc + (s.score || 0), 0) / validScores.length
            : 0;
        const maxScore = validScores.length > 0 ? Math.max(...validScores.map(s => s.score || 0)) : 0;
        const minScore = validScores.length > 0 ? Math.min(...validScores.map(s => s.score || 0)) : 0;

        const bestMunicipality = submissions.find(s => s.score === maxScore);
        const worstMunicipality = submissions.find(s => s.score === minScore);

        let yPos = 45;

        // Conclusiones principales
        this.doc.setFontSize(11);
        this.doc.setFont('helvetica', 'bold');
        this.doc.setTextColor(30, 64, 175);
        this.doc.text('Hallazgos Principales:', this.margin, yPos);
        yPos += 8;

        this.doc.setFontSize(10);
        this.doc.setFont('helvetica', 'normal');
        this.doc.setTextColor(55, 65, 81);

        const findings = [
            `• El promedio general de evaluación es de ${avgScore.toFixed(2)} puntos.`,
            `• El municipio con mejor desempeño es "${bestMunicipality?.user.municipality || bestMunicipality?.user.username}" con ${maxScore.toFixed(1)} puntos.`,
            `• El municipio con mayor oportunidad de mejora es "${worstMunicipality?.user.municipality || worstMunicipality?.user.username}" con ${minScore.toFixed(1)} puntos.`,
            `• La diferencia entre el puntaje más alto y el más bajo es de ${(maxScore - minScore).toFixed(1)} puntos.`
        ];

        findings.forEach(finding => {
            const lines = this.doc.splitTextToSize(finding, this.pageWidth - 2 * this.margin - 5);
            this.doc.text(lines, this.margin + 2, yPos);
            yPos += lines.length * 5 + 2;
        });

        yPos += 5;

        // Recomendaciones
        this.doc.setFontSize(11);
        this.doc.setFont('helvetica', 'bold');
        this.doc.setTextColor(30, 64, 175);
        this.doc.text('Recomendaciones Generales:', this.margin, yPos);
        yPos += 8;

        this.doc.setFontSize(10);
        this.doc.setFont('helvetica', 'normal');
        this.doc.setTextColor(55, 65, 81);

        const recommendations = [
            '1. Establecer programas de intercambio de buenas prácticas entre municipios con mejor y menor desempeño.',
            '2. Identificar y replicar las estrategias exitosas implementadas por los municipios mejor evaluados.',
            '3. Desarrollar planes de mejora específicos para los municipios que obtuvieron calificaciones intermedias o bajas.',
            '4. Fortalecer la capacitación del personal municipal en las áreas identificadas como oportunidades de mejora.',
            '5. Implementar un sistema de seguimiento periódico para monitorear el progreso y los avances.',
            '6. Fomentar la participación ciudadana y la transparencia en la gestión municipal.',
            '7. Asignar recursos prioritarios a las áreas críticas identificadas en la evaluación.'
        ];

        recommendations.forEach(rec => {
            const lines = this.doc.splitTextToSize(rec, this.pageWidth - 2 * this.margin - 5);
            this.doc.text(lines, this.margin + 2, yPos);
            yPos += lines.length * 5 + 3;
        });

        // Nota final
        yPos += 10;
        this.doc.setFillColor(219, 234, 254); // bg-blue-100
        this.doc.roundedRect(this.margin, yPos, this.pageWidth - 2 * this.margin, 35, 3, 3, 'F');

        yPos += 8;
        this.doc.setFontSize(10);
        this.doc.setFont('helvetica', 'bold');
        this.doc.setTextColor(30, 64, 175);
        this.doc.text('NOTA IMPORTANTE:', this.margin + 5, yPos);

        yPos += 6;
        this.doc.setFontSize(9);
        this.doc.setFont('helvetica', 'normal');
        this.doc.setTextColor(55, 65, 81);
        const note = 'Este reporte es una herramienta de diagnóstico y planeación. Los resultados deben utilizarse para orientar la toma de decisiones y el diseño de políticas públicas municipales enfocadas en el desarrollo sustentable. Se recomienda complementar este análisis con evaluaciones cualitativas y consultas con actores locales.';
        const noteLines = this.doc.splitTextToSize(note, this.pageWidth - 2 * this.margin - 10);
        this.doc.text(noteLines, this.margin + 5, yPos);

        this.addPageFooter(4);
    }

    private addSectionTitle(title: string, pageNumber: number) {
        this.doc.setFillColor(59, 130, 246);
        this.doc.rect(0, 20, this.pageWidth, 15, 'F');

        this.doc.setTextColor(255, 255, 255);
        this.doc.setFontSize(14);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text(title, this.margin, 30);
    }

    private addPageFooter(pageNumber: number) {
        this.doc.setFontSize(8);
        this.doc.setTextColor(156, 163, 175);
        this.doc.text(
            `Página ${pageNumber} | Sistema de Evaluación Municipal MEPLANSUS`,
            this.pageWidth / 2,
            this.pageHeight - 10,
            { align: 'center' }
        );
    }

    async downloadReport(submissions: SubmissionData[], filename: string) {
        const blob = await this.generateReport(submissions);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(url);
    }
}
