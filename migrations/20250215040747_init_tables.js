const knex = require('knex')(require('./knexfile').development);

async function initializeTables() {
  try {
    console.log('🔹 Initializing database tables...');

    // Check if tables already exist, if not create them
    const exists = await knex.schema.hasTable('admins');
    if (!exists) {
      console.log('🔹 Creating admins table...');
      await knex.schema.createTable('admins', function (table) {
        table.increments('id').primary();
        table.string('email', 100).notNullable().unique();
        table.string('password', 255).notNullable();
        table.string('full_name', 200);
        table.integer('tera_id').unique();
        table.string('username', 255).notNullable();
      });
    }

    const customersExists = await knex.schema.hasTable('customers');
    if (!customersExists) {
      console.log('🔹 Creating customers table...');
      await knex.schema.createTable('customers', function (table) {
        table.increments('id').primary();
        table.string('full_name', 200).notNullable();
        table.string('username', 100).notNullable().unique();
        table.string('email', 100).notNullable().unique();
        table.string('password', 255).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.boolean('is_active').defaultTo(true);
      });
    }

    console.log('✅ Tables checked and initialized.');
  } catch (error) {
    console.error('❌ Error initializing tables:', error);
  } finally {
    knex.destroy();
  }
}

initializeTables();
