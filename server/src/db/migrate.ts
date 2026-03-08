import fs from 'fs';
import path from 'path';
import pool from './pool';

async function migrate() {
    console.log('🔄 Running migrations...');

    // Ensure _migrations table exists
    await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

    // Read migration files
    const migrationsDir = path.resolve(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir)
        .filter((f) => f.endsWith('.sql'))
        .sort();

    for (const file of files) {
        // Check if already executed
        const { rows } = await pool.query(
            'SELECT id FROM _migrations WHERE name = $1',
            [file]
        );

        if (rows.length > 0) {
            console.log(`  ⏭️  Skipping ${file} (already executed)`);
            continue;
        }

        // Execute migration
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
        try {
            await pool.query(sql);
            await pool.query(
                'INSERT INTO _migrations (name) VALUES ($1)',
                [file]
            );
            console.log(`  ✅ Executed ${file}`);
        } catch (err) {
            console.error(`  ❌ Failed to execute ${file}:`, err);
            process.exit(1);
        }
    }

    console.log('✅ All migrations complete.');
    await pool.end();
}

migrate().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});
