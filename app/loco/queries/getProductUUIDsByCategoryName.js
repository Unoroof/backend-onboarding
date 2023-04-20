const getProductUUIDsByCategoryName = async (
  knex,
  valueFromSource,
  transformation
) => {
  let inputValue = valueFromSource[transformation.findByValue];

  const queryBuilder = knex.raw(
    `select product_uuid from fm_products_categories where category_uuid in (select uuid from fm_categories where name='${inputValue}');`
  );

  const result = await queryBuilder;

  return result.rows.map((r) => {
    return r.product_uuid;
  });
};

module.exports = getProductUUIDsByCategoryName;
