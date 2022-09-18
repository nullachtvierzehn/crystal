import type { Deferred } from "../deferred.js";
import { defer } from "../deferred.js";
import type { __ItemStep } from "../index.js";
import type {
  CrystalResultsList,
  CrystalValuesList,
  ExecutionExtra,
  PromiseOrDirect,
} from "../interfaces.js";
import { ExecutableStep } from "../step.js";
import { canonicalJSONStringify, isPromiseLike } from "../utils.js";
import { access } from "./access.js";

export interface LoadOneOptions<TData, TParams extends Record<string, any>> {
  attributes: ReadonlyArray<keyof TData> | null;
  params: Partial<TParams>;
}

export type LoadOneCallback<
  TSpec,
  TData,
  TParams extends Record<string, any>,
> = {
  (
    specs: ReadonlyArray<TSpec>,
    options: LoadOneOptions<TData, TParams>,
  ): PromiseOrDirect<ReadonlyArray<TData>>;
  displayName?: string;
};

/**
 * A TypeScript Identity Function to help you strongly type your
 * LoadManyCallback.
 */
export function loadOneCallback<
  TSpec,
  TData,
  TParams extends Record<string, any>,
>(
  callback: LoadOneCallback<TSpec, TData, TParams>,
): LoadOneCallback<TSpec, TData, TParams> {
  return callback;
}

interface LoadOneMeta {
  cacheByOptionsByCallback?: Map<
    LoadOneCallback<any, any, any>,
    Map<string, Map<any, PromiseOrDirect<any>>>
  >;
}

export class LoadOneStep<
  TSpec,
  TData,
  TParams extends Record<string, any>,
> extends ExecutableStep {
  static $$export = { moduleName: "grafast", exportName: "LoadOneStep" };
  metaKey = "LoadOneStep";

  loadOptions: LoadOneOptions<TData, TParams> | null = null;
  loadOptionsKey = "";

  attributes = new Set<keyof TData>();
  params: Partial<TParams> = Object.create(null);
  constructor(
    $spec: ExecutableStep<TSpec>,
    private load: LoadOneCallback<TSpec, TData, TParams>,
  ) {
    super();
    this.addDependency($spec);
  }
  toStringMeta() {
    return this.load.displayName || this.load.name;
  }
  get(attr: keyof TData & (string | number)) {
    this.attributes.add(attr);
    return access(this, attr);
  }
  setParam<TParamKey extends keyof TParams>(
    paramKey: TParamKey,
    value: TParams[TParamKey],
  ): void {
    this.params[paramKey] = value;
  }
  finalize() {
    // Find all steps of this type that use the same callback and have
    // equivalent params and then match their list of attributes together.
    const stringifiedParams = canonicalJSONStringify(this.params);
    const kin = (
      this.opPlan.getStepsByMetaKey(this.metaKey) as LoadOneStep<
        any,
        any,
        any
      >[]
    ).filter((step) => {
      if (step.id === this.id) return false;
      if (step.load !== this.load) return false;
      if (canonicalJSONStringify(step.params) !== stringifiedParams)
        return false;
      return true;
    });
    for (const otherStep of kin) {
      for (const attr of otherStep.attributes) {
        this.attributes.add(attr as any);
      }
    }

    // Build the loadOptions
    this.loadOptions = {
      attributes: this.attributes.size ? [...this.attributes].sort() : null,
      params: this.params,
    };
    // If the canonicalJSONStringify is the same, then we deem that the options are the same
    this.loadOptionsKey = canonicalJSONStringify(this.loadOptions);
  }
  execute(
    [specs]: [CrystalValuesList<TSpec>],
    extra: ExecutionExtra,
  ): PromiseOrDirect<CrystalResultsList<TData>> {
    const loadOptions = this.loadOptions!;
    const meta = extra.meta as LoadOneMeta;
    let cacheByOptionsByCallback = meta.cacheByOptionsByCallback;
    if (!cacheByOptionsByCallback) {
      cacheByOptionsByCallback = new Map();
      meta.cacheByOptionsByCallback = cacheByOptionsByCallback;
    }
    let cacheByOptions = cacheByOptionsByCallback.get(this.load);
    if (!cacheByOptions) {
      cacheByOptions = new Map();
      cacheByOptionsByCallback.set(this.load, cacheByOptions);
    }
    let cache = cacheByOptions.get(this.loadOptionsKey);
    if (!cache) {
      cache = new Map();
      cacheByOptions.set(this.loadOptionsKey, cache);
    }
    const batchSpecs: Array<TSpec> = [];
    const batchIndexes: Array<number[]> = [];

    const results: Array<PromiseOrDirect<TData> | null> = [];
    for (let i = 0, l = specs.length; i < l; i++) {
      const spec = specs[i];
      const cachedResult = cache.get(spec);
      if (cachedResult) {
        results.push(cachedResult);
      } else {
        // We'll fill this in in a minute
        const index = results.push(null) - 1;
        const existingIdx = batchSpecs.indexOf(spec);
        if (existingIdx >= 0) {
          batchIndexes[existingIdx].push(index);
        } else {
          batchSpecs.push(spec);
          batchIndexes.push([index]);
        }
      }
    }
    const pendingCount = batchSpecs.length;
    if (pendingCount > 0) {
      const loadResults = this.load(batchSpecs, loadOptions);
      const loadResultsWasPromise = isPromiseLike(loadResults);
      for (let pendingIndex = 0; pendingIndex < pendingCount; pendingIndex++) {
        const spec = batchSpecs[pendingIndex];
        const targetIndexes = batchIndexes[pendingIndex];
        const promise = loadResultsWasPromise
          ? loadResults.then((r) => r[pendingIndex])
          : loadResults[pendingIndex];
        cache.set(spec, promise);
        for (const targetIndex of targetIndexes) {
          results[targetIndex] = promise;
        }
      }
    }
    return results as Array<PromiseOrDirect<TData>>;
  }
}

export function loadOne<TSpec, TData, TParams extends Record<string, any>>(
  $spec: ExecutableStep<TSpec>,
  load: LoadOneCallback<TSpec, TData, TParams>,
) {
  return new LoadOneStep($spec, load);
}
