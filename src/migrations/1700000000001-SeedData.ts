import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedData1700000000001 implements MigrationInterface {
  name = 'SeedData1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 3 autores
    await queryRunner.query(`
      INSERT INTO "autores" ("nombre", "apellido", "nacionalidad") VALUES
        ('Gabriel', 'García Márquez', 'Colombiana'),
        ('Isabel',  'Allende',        'Chilena'),
        ('Jorge',   'Luis Borges',    'Argentina')
      ON CONFLICT DO NOTHING
    `);

    // 2 usuarios
    await queryRunner.query(`
      INSERT INTO "usuarios" ("nombre", "email") VALUES
        ('Ana López',    'ana.lopez@email.com'),
        ('Carlos Pérez', 'carlos.perez@email.com')
      ON CONFLICT (email) DO NOTHING
    `);

    // 5 libros
    await queryRunner.query(`
      INSERT INTO "libros" ("titulo", "isbn", "anio_publicacion", "copias_disponibles") VALUES
        ('Cien años de soledad',     '978-0-06-088328-7', 1967, 3),
        ('El amor en los tiempos del cólera', '978-0-14-028328-7', 1985, 2),
        ('La casa de los espíritus', '978-0-553-38380-9', 1982, 4),
        ('Ficciones',                '978-0-802-13030-5', 1944, 5),
        ('El Aleph',                 '978-0-140-28628-8', 1949, 2)
      ON CONFLICT (isbn) DO NOTHING
    `);

    // relaciones libros-autores
    await queryRunner.query(`
      INSERT INTO "libros_autores" ("libro_id", "autor_id")
      SELECT l.id, a.id FROM "libros" l, "autores" a
      WHERE (l.isbn = '978-0-06-088328-7' AND a.apellido = 'García Márquez')
         OR (l.isbn = '978-0-14-028328-7' AND a.apellido = 'García Márquez')
         OR (l.isbn = '978-0-553-38380-9' AND a.apellido = 'Allende')
         OR (l.isbn = '978-0-802-13030-5' AND a.apellido = 'Luis Borges')
         OR (l.isbn = '978-0-140-28628-8' AND a.apellido = 'Luis Borges')
      ON CONFLICT DO NOTHING
    `);

    // 2 préstamos de muestra
    await queryRunner.query(`
      INSERT INTO "prestamos" ("libro_id", "usuario_id", "fecha_devolucion_esperada")
      SELECT l.id, u.id, NOW() + INTERVAL '14 days'
      FROM "libros" l, "usuarios" u
      WHERE l.isbn = '978-0-06-088328-7' AND u.email = 'ana.lopez@email.com'
      LIMIT 1
    `);

    await queryRunner.query(`
      INSERT INTO "prestamos" ("libro_id", "usuario_id", "fecha_devolucion_esperada")
      SELECT l.id, u.id, NOW() + INTERVAL '14 days'
      FROM "libros" l, "usuarios" u
      WHERE l.isbn = '978-0-553-38380-9' AND u.email = 'carlos.perez@email.com'
      LIMIT 1
    `);

    // ajustar copias disponibles por los préstamos creados
    await queryRunner.query(`
      UPDATE "libros" SET "copias_disponibles" = "copias_disponibles" - 1
      WHERE "isbn" IN ('978-0-06-088328-7', '978-0-553-38380-9')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "prestamos"`);
    await queryRunner.query(`DELETE FROM "libros_autores"`);
    await queryRunner.query(`DELETE FROM "libros"`);
    await queryRunner.query(`DELETE FROM "usuarios"`);
    await queryRunner.query(`DELETE FROM "autores"`);
  }
}
