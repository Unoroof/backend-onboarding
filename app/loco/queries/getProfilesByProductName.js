const getProfilesByProductName = async (
  knex,
  valueFromSource,
  transformation
) => {
  let inputValue = valueFromSource[transformation.findByValue];

  const queryBuilder = knex.raw(
    `select distinct uuid from profiles,jsonb_array_elements
    (("data"->>'offered_products')::jsonb) as product where product->>'label' like '%${inputValue}%'`
  );

  const result = await queryBuilder;

  return result.rows.map((r) => {
    return r.uuid;
  });
};

module.exports = getProfilesByProductName;
