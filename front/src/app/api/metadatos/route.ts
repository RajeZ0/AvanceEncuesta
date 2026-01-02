import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

// GET - Obtener metadatos de la evaluación actual
export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get('userId')?.value;

        if (!userId) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }

        // Buscar submission activa del usuario
        const submission = await prisma.submission.findFirst({
            where: { userId },
            include: { metadatos: true },
        });

        if (!submission || !submission.metadatos) {
            return NextResponse.json({ metadatos: null });
        }

        return NextResponse.json({ metadatos: submission.metadatos });
    } catch (error) {
        console.error('Error al obtener metadatos:', error);
        return NextResponse.json({ error: 'Error al obtener metadatos' }, { status: 500 });
    }
}

// POST - Guardar/actualizar metadatos (auto-save)
export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get('userId')?.value;

        if (!userId) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }

        const datos = await request.json();

        // Buscar o crear submission
        let submission = await prisma.submission.findFirst({
            where: { userId },
        });

        if (!submission) {
            submission = await prisma.submission.create({
                data: { userId },
            });
        }

        // Upsert metadatos
        const metadatos = await prisma.metadatosEvaluacion.upsert({
            where: { submissionId: submission.id },
            update: {
                nombreMunicipio: datos.nombreMunicipio,
                estado: datos.estado,
                anioCapturo: datos.anioCapturo ? parseInt(datos.anioCapturo) : null,
                fechaInicioEvaluacion: datos.fechaInicioEvaluacion ? new Date(datos.fechaInicioEvaluacion) : null,
                periodoVigencia: datos.periodoVigencia,
                poblacion: datos.poblacion ? parseInt(datos.poblacion) : null,
                presupuestoAnual: datos.presupuestoAnual ? parseFloat(datos.presupuestoAnual) : null,
                numeroEmpleados: datos.numeroEmpleados ? parseInt(datos.numeroEmpleados) : null,
                presidenteMunicipal: datos.presidenteMunicipal,
                nombreResponsable: datos.nombreResponsable,
                cargoResponsable: datos.cargoResponsable,
                correoInstitucional: datos.correoInstitucional,
                correoPersonal: datos.correoPersonal,
                telefonoMovil: datos.telefonoMovil,
                telefonoDepartamental: datos.telefonoDepartamental,
                fechaNacimiento: datos.fechaNacimiento ? new Date(datos.fechaNacimiento) : null,
                departamento: datos.departamento,
            },
            create: {
                submissionId: submission.id,
                nombreMunicipio: datos.nombreMunicipio,
                estado: datos.estado,
                anioCapturo: datos.anioCapturo ? parseInt(datos.anioCapturo) : null,
                fechaInicioEvaluacion: datos.fechaInicioEvaluacion ? new Date(datos.fechaInicioEvaluacion) : null,
                periodoVigencia: datos.periodoVigencia,
                poblacion: datos.poblacion ? parseInt(datos.poblacion) : null,
                presupuestoAnual: datos.presupuestoAnual ? parseFloat(datos.presupuestoAnual) : null,
                numeroEmpleados: datos.numeroEmpleados ? parseInt(datos.numeroEmpleados) : null,
                presidenteMunicipal: datos.presidenteMunicipal,
                nombreResponsable: datos.nombreResponsable,
                cargoResponsable: datos.cargoResponsable,
                correoInstitucional: datos.correoInstitucional,
                correoPersonal: datos.correoPersonal,
                telefonoMovil: datos.telefonoMovil,
                telefonoDepartamental: datos.telefonoDepartamental,
                fechaNacimiento: datos.fechaNacimiento ? new Date(datos.fechaNacimiento) : null,
                departamento: datos.departamento,
            },
        });

        return NextResponse.json({ exito: true, metadatos });
    } catch (error) {
        console.error('Error al guardar metadatos:', error);
        return NextResponse.json({ error: 'Error al guardar metadatos' }, { status: 500 });
    }
}
