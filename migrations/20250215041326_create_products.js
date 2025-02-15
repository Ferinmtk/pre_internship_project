exports.up = function (knex) {
    return knex.schema.createTable('products', function (table) {
      table.increments('id').primary();
      table.string('product_name', 255).notNullable();
      table.string('category', 50).notNullable();
      table.string('region', 50).notNullable();
      table.integer('sales').defaultTo(0);
      table.decimal('profit', 10, 2).defaultTo(0.00);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.text('image_url');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('products');
  };
  