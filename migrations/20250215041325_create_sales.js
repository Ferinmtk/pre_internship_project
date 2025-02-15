exports.up = function (knex) {
    return knex.schema.createTable('sales', function (table) {
      table.increments('id').primary();
      table.date('date').notNullable();
      table.string('product', 255).notNullable();
      table.decimal('amount', 10, 2).notNullable();
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('sales');
  };
  