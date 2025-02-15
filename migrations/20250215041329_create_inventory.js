exports.up = function (knex) {
    return knex.schema.createTable('inventory', function (table) {
      table.increments('id').primary();
      table.string('product_name', 100).notNullable();
      table.integer('quantity').notNullable();
      table.integer('daily_sales').notNullable();
      table.decimal('unit_price', 10, 2).notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('inventory');
  };
  