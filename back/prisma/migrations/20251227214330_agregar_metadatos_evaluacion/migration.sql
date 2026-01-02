-- CreateTable
CREATE TABLE "MetadatosEvaluacion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submissionId" TEXT NOT NULL,
    "nombreMunicipio" TEXT,
    "estado" TEXT,
    "anioCapturo" INTEGER,
    "fechaInicioEvaluacion" DATETIME,
    "periodoVigencia" TEXT,
    "poblacion" INTEGER,
    "presupuestoAnual" REAL,
    "numeroEmpleados" INTEGER,
    "presidenteMunicipal" TEXT,
    "nombreResponsable" TEXT,
    "cargoResponsable" TEXT,
    "correoInstitucional" TEXT,
    "correoPersonal" TEXT,
    "telefonoMovil" TEXT,
    "telefonoDepartamental" TEXT,
    "fechaNacimiento" DATETIME,
    "departamento" TEXT,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" DATETIME NOT NULL,
    CONSTRAINT "MetadatosEvaluacion_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "MetadatosEvaluacion_submissionId_key" ON "MetadatosEvaluacion"("submissionId");
