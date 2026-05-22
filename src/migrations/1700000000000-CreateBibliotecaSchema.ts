import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBibliotecaSchema1700000000000 implements MigrationInterface {
  name = 'CreateBibliotecaSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1) autores (sin dependencias)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "autores" (
        "id"           SERIAL PRIMARY KEY,
        "nombre"       VARCHAR(100) NOT NULL,
        "apellido"     VARCHAR(100) NOT NULL,
        "nacionalidad" VARCHAR(100)
      )
    `);

    // 2) usuarios (sin dependencias)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "usuarios" (
        "id"     SERIAL PRIMARY KEY,
        "nombre" VARCHAR(100) NOT NULL,
        "email"  VARCHAR(150) NOT NULL UNIQUE,
        "activo" BOOLEAN NOT NULL DEFAULT TRUE
      )
    `);

    // 3) libros (sin dependencias)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "libros" (
        "id"                  SERIAL PRIMARY KEY,
        "titulo"              VARCHAR(200) NOT NULL,
        "isbn"                VARCHAR(20)  NOT NULL UNIQUE,
        "anio_publicacion"    INTEGER,
        "copias_disponibles"  INTEGER NOT NULL DEFAULT 0,
        "activo"              BOOLEAN NOT NULL DEFAULT TRUE,
        CONSTRAINT "chk_copias_no_negativas" CHECK ("copias_disponibles" >= 0)
      )
    `);

    // 4) tabla intermedia libros_autores (depende de libros y autores)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "libros_autores" (
        "libro_id"  INTEGER NOT NULL REFERENCES "libros"("id")  ON DELETE CASCADE,
        "autor_id"  INTEGER NOT NULL REFERENCES "autores"("id") ON DELETE CASCADE,
        PRIMARY KEY ("libro_id", "autor_id")
      )
    `);

    // 5) prestamos (depende de libros y usuarios)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "prestamos" (
        "id"                        SERIAL PRIMARY KEY,
        "libro_id"                  INTEGER NOT NULL REFERENCES "libros"("id"),
        "usuario_id"                INTEGER NOT NULL REFERENCES "usuarios"("id"),
        "fecha_prestamo"            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "fecha_devolucion_esperada" DATE NOT NULL,
        "fecha_devolucion_real"     DATE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "prestamos"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "libros_autores"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "libros"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "usuarios"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "autores"`);
  }
}
