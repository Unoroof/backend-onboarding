const myFun = async (knex, valueFromSource, transformation) => {
  let inputValue = valueFromSource[transformation.findByValue];

  inputValue = inputValue.map((i) => {
    return `'${i}'`;
  });
  // `select * from profiles where type='fm-seller' and uuid in (select distinct uuid from profiles,jsonb_array_elements
  //   (("data"->>'offered_products')::jsonb) as product where product->>'value' in (${inputValue.toString()}))`

  const queryBuilder = knex.raw(
    `select distinct uuid from profiles,jsonb_array_elements
    (("data"->>'offered_products')::jsonb) as product where product->>'value' in (${inputValue.toString()})`
  );

  console.log("queryBuilder ----", queryBuilder.toString());
  const result = await queryBuilder;

  return result.rows.map((r) => {
    return r.uuid;
  });
};

module.exports = myFun;
