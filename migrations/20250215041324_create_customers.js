exports.up = function (knex) {
    return knex.schema.createTable('customers', function (table) {
      table.increments('id').primary();
      table.string('full_name', 200).notNullable();
      table.string('username', 100).notNullable().unique();
      table.string('email', 100).notNullable().unique();
      table.string('password', 255).notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.boolean('is_active').defaultTo(true);
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('customers');
  };
  