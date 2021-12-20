exports.up = async (knex) => {
  await knex.schema
    .createTable('users', (users) => {
      users.increments('user_id');
      users.string('username', 200)
        .notNullable()
        .unique();
      users.string('password', 200).notNullable();
      users.timestamps(false, true);
    })
    .createTable('potlucks', (potlucks) => {
      potlucks.increments('potluck_id');
      potlucks.string('potluck_name', 200).notNullable();
      potlucks.string('date', 200).notNullable();
      potlucks.string('time', 200).notNullable();
      potlucks.string('location', 200).notNullable();
      potlucks
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('user_id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    })
    .createTable('foods', (foods) => {
      foods.increments('food_id');
      foods.string('food_name', 200).notNullable();
    })
    .createTable('food_potluck', (food_potluck) => {
      food_potluck.increments('food_potluck_id');
      food_potluck
        .integer('food_id')
        .unsigned()
        .notNullable()
        .references('food_id')
        .inTable('foods')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      food_potluck
        .integer('potluck_id')
        .unsigned()
        .notNullable()
        .references('potluck_id')
        .inTable('potlucks')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    })
    .createTable('guests', (guests) => {
      guests.increments('guest_id');
      guests
        .integer('potluck_id')
        .unsigned()
        .notNullable()
        .references('potluck_id')
        .inTable('potlucks')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      guests
        .integer('food_potluck_id')
        .unsigned()
        .references('food_potluck_id')
        .inTable('food_potluck')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      guests
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('user_id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      guests.boolean('attending').notNullable().defaultTo(false);
    });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('guests');
  await knex.schema.dropTableIfExists('food_potluck');
  await knex.schema.dropTableIfExists('foods');
  await knex.schema.dropTableIfExists('potlucks');
  await knex.schema.dropTableIfExists('users');
};
