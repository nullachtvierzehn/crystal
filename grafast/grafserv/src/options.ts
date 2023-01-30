export function optionsFromConfig(config: GraphileConfig.ResolvedPreset) {
  const {
    graphqlPath = "/graphql",
    graphiql = true,
    graphiqlOnGraphQLGET = true,
    graphiqlPath = "/",
    watch = false,
    // TODO: Why 'Path' for graphqlPath and graphiqlPath, but 'Route' for this?!
    eventStreamRoute = "/graphql/stream",
    maxRequestLength = 100_000,
    outputDataAsString = false,
  } = config.server ?? {};
  return {
    outputDataAsString,
    graphqlPath,
    graphiql,
    graphiqlOnGraphQLGET,
    graphiqlPath,
    watch,
    eventStreamRoute,
    maxRequestLength,
  };
}
export type OptionsFromConfig = ReturnType<typeof optionsFromConfig>;