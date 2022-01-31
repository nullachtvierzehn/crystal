import type { NodeIdCodec, NodeIdHandler } from "graphile-crystal";
import { constant, node, NodePlan, resolveType } from "graphile-crystal";
import { EXPORTABLE } from "graphile-exporter";
import type { Plugin } from "graphile-plugin";
import type { GraphQLObjectType } from "graphql";

import { isValidObjectType } from "../utils.js";

declare global {
  namespace GraphileEngine {
    interface Inflection {
      nodeIdFieldName(this: Inflection): string;
    }

    interface Build {
      [NODE_ID_CODECS]: { [codecName: string]: NodeIdCodec };
      [NODE_ID_HANDLER_BY_TYPE_NAME]: { [typeName: string]: NodeIdHandler };
      registerNodeIdCodec(codecName: string, codec: NodeIdCodec): void;
      registerNodeIdHandler(typeName: string, matcher: NodeIdHandler): void;
    }

    interface ScopeGraphQLObjectTypeFieldsField {
      isRootNodeField?: boolean;
    }
  }
}

// Deliberately private
const NODE_ID_CODECS = Symbol("nodeIdCodecs");
const NODE_ID_HANDLER_BY_TYPE_NAME = Symbol("nodeIdHandlerByTypeName");

export const NodePlugin: Plugin = {
  name: "NodePlugin",
  version: "1.0.0",
  description: `Adds the interfaces required to support the GraphQL Global Object Identification Specification`,

  inflection: {
    add: {
      nodeIdFieldName() {
        return "id";
      },
    },
  },

  schema: {
    hooks: {
      build(build) {
        const nodeIdCodecs: { [codecName: string]: NodeIdCodec } =
          Object.create(null);
        const nodeIdHandlerByTypeName: { [typeName: string]: NodeIdHandler } =
          Object.create(null);

        // Add the 'raw' encoder
        nodeIdCodecs.raw = {
          encode(value) {
            return typeof value === "string" ? value : null;
          },
          decode(value) {
            return typeof value === "string" ? value : null;
          },
        };

        // Add 'query' as the id for the Query type
        nodeIdHandlerByTypeName[build.inflection.builtin("Query")] = {
          codecName: "raw",
          match: EXPORTABLE(
            () => (specifier) => {
              return specifier === "query";
            },
            [],
          ),
          get: EXPORTABLE(
            (constant) => () => {
              return constant({});
            },
            [constant],
          ),
          plan: EXPORTABLE(
            (constant) => () => {
              return constant`query`;
            },
            [constant],
          ),
        };

        return build.extend(
          build,
          {
            [NODE_ID_CODECS]: nodeIdCodecs,
            [NODE_ID_HANDLER_BY_TYPE_NAME]: nodeIdHandlerByTypeName,
            registerNodeIdCodec(codecName, codec) {
              if (nodeIdCodecs[codecName]) {
                throw new Error(
                  `Node ID codec '${codecName}' is already registered`,
                );
              }
              nodeIdCodecs[codecName] = codec;
            },
            registerNodeIdHandler(typeName, handler) {
              if (nodeIdHandlerByTypeName[typeName]) {
                throw new Error(
                  `Node ID handler for type '${typeName}' already registered`,
                );
              }
              nodeIdHandlerByTypeName[typeName] = handler;
            },
          },
          "Adding helpers from NodePlugin",
        );
      },

      init(_, build) {
        const {
          graphql: { GraphQLNonNull, GraphQLID },
        } = build;
        const nodeTypeName = build.inflection.builtin("Node");
        const nodeIdFieldName = build.inflection.nodeIdFieldName();
        const queryTypeName = build.inflection.builtin("Query");
        const nodeIdCodecs = build[NODE_ID_CODECS];
        const nodeIdHandlerByTypeName = build[NODE_ID_HANDLER_BY_TYPE_NAME];
        build.registerInterfaceType(
          nodeTypeName,
          {},
          () => ({
            description: build.wrapDescription(
              "An object with a globally unique `ID`.",
              "type",
            ),
            resolveType,
            fields: {
              [nodeIdFieldName]: {
                description: build.wrapDescription(
                  "A globally unique identifier. Can be used in various places throughout the system to identify this single value.",
                  "field",
                ),
                type: new GraphQLNonNull(GraphQLID),
              },
            },
          }),
          "Node interface from NodePlugin",
        );
        return _;
      },

      // Add the 'node' field to the root Query type
      GraphQLObjectType_fields(fields, build, context) {
        const {
          scope: { isRootQuery },
          fieldWithHooks,
        } = context;
        if (!isRootQuery) {
          return fields;
        }
        const {
          getTypeByName,
          extend,
          graphql: { GraphQLNonNull, GraphQLID },
          inflection,
          [NODE_ID_CODECS]: nodeIdCodecs,
          [NODE_ID_HANDLER_BY_TYPE_NAME]: nodeIdHandlerByTypeName,
        } = build;
        const nodeIdFieldName = build.inflection.nodeIdFieldName();
        const nodeType = build.getTypeByName(inflection.builtin("Node")) as
          | GraphQLObjectType
          | undefined;
        if (!nodeType) {
          return fields;
        }
        return extend(
          fields,
          {
            node: fieldWithHooks(
              {
                fieldName: "node",
                isRootNodeField: true,
              },
              () => ({
                description: build.wrapDescription(
                  "Fetches an object given its globally unique `ID`.",
                  "field",
                ),
                type: nodeType,
                args: {
                  [nodeIdFieldName]: {
                    description: build.wrapDescription(
                      "The globally unique `ID`.",
                      "arg",
                    ),
                    type: new GraphQLNonNull(GraphQLID),
                  },
                },
                plan: EXPORTABLE(
                  (
                    node,
                    nodeIdCodecs,
                    nodeIdFieldName,
                    nodeIdHandlerByTypeName,
                  ) =>
                    function plan(_$root, args) {
                      return node(
                        nodeIdCodecs,
                        nodeIdHandlerByTypeName,
                        args[nodeIdFieldName],
                      );
                    },
                  [
                    node,
                    nodeIdCodecs,
                    nodeIdFieldName,
                    nodeIdHandlerByTypeName,
                  ],
                ),
              }),
            ),
          },
          `Adding Relay Global Object Identification support to the root Query via 'node' and '${nodeIdFieldName}' fields`,
        );
      },
    },
  },
};