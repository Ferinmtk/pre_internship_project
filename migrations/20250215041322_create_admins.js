exports.up = function (knex) {
    return knex.schema.createTable('admins', function (table) {
      table.increments('id').primary();
      table.string('email', 100).notNullable().unique();
      table.string('password', 255).notNullable();
      table.string('full_name', 200);
      table.integer('tera_id').unique();
      table.string('username', 255).notNullable();
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('admins');
  };
  