const myFunction = async (knex, valueFromSource, transformation) => {
  let inputValue = valueFromSource[transformation.findByValue];

  inputValue = inputValue.map((i) => {
    return `'${i}'`;
  });

  // console.log("inputValue ----", inputValue, inputValue.join(","));

  const queryBuilder = knex.raw(
    `select profiles.uuid, profiles.data->>'userSubTypes' as subTypes from profiles where profiles.data->>'userSubTypes' is not null and (profiles.data->'userSubTypes')::jsonb \\?| array[${inputValue}]`
  );

  // console.log("queryBuilder ----", queryBuilder.toString());

  const result = await queryBuilder;

  return result.rows.map((r) => {
    return r.uuid;
  });
};

module.exports = myFunction;
