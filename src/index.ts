import type { Expand } from "./utils/Expand.ts";

interface Segment<
  Name extends string,
  Separator extends string,
  Items extends readonly Node[],
> {
  type: "segment";
  name: Name;
  separator: Separator;
  items: Items;
}

interface Switch<
  Name extends string,
  Separator extends string,
  Cases extends {
    [caseName: string]: readonly Node[];
  },
> {
  type: "switch";
  name: Name;
  separator: Separator;
  cases: Cases;
}

interface Param<Name extends string, Options extends readonly string[]> {
  type: "param";
  name: Name;
  options: Options;
}

type Node =
  | string
  | Segment<any, any, any>
  | Switch<any, any, any>
  | Param<any, any>;

interface SwitchWithCaseMethod<
  Name extends string,
  Separator extends string,
  Cases extends {
    [caseName: string]: readonly Node[];
  },
> extends Switch<Name, Separator, Cases> {
  case: <CaseName extends string>(
    name: CaseName,
  ) => <const Items extends readonly Node[]>(
    ...items: Items
  ) => SwitchWithCaseMethod<
    Name,
    Separator,
    Cases & {
      [caseName in CaseName]: Items;
    }
  >;
}

type Matcher<Separator extends string> = <Name extends string>(
  name: Name,
) => {
  <const Items extends readonly Node[]>(
    ...items: Items
  ): Segment<Name, Separator, Items>;
  case: <CaseName extends string>(
    name: CaseName,
  ) => <const Items extends readonly Node[]>(
    ...items: Items
  ) => SwitchWithCaseMethod<
    Name,
    Separator,
    {
      [caseName in CaseName]: Items;
    }
  >;
  param: <Options extends readonly string[]>(
    ...options: Options
  ) => Param<Name, Options>;
};

type SegmentContent<T extends Segment<any, any, any>> = {
  [segmentName in T["name"]]: Content<T["items"]>;
};

type SwitchContent<
  T extends Switch<any, any, any>,
  CaseName = keyof T["cases"],
> = {
  [switchName in T["name"]]: CaseName extends string
    ? { __type: CaseName } & Content<T["cases"][CaseName]>
    : never;
};

type ParamContent<T extends Param<any, any>> = {
  [paramName in T["name"]]: [] extends T["options"]
    ? string
    : T["options"][number];
};

type Content<
  Items extends readonly Node[],
  // biome-ignore lint/complexity/noBannedTypes: Initial type needs to start somewhere.
  ContentSoFar = {},
> = Items extends readonly [infer Item, ...infer Rest extends readonly Node[]]
  ? Item extends string
    ? Content<Rest, ContentSoFar>
    : Item extends Segment<any, any, any>
      ? Content<Rest, ContentSoFar & SegmentContent<Item>>
      : Item extends Switch<any, any, any>
        ? Content<Rest, ContentSoFar & SwitchContent<Item>>
        : Item extends Param<any, any>
          ? Content<Rest, ContentSoFar & ParamContent<Item>>
          : never
  : ContentSoFar;

type Sanpo = <T extends Segment<any, any, any>>(
  schema: T,
) => {
  parse(content: string): Expand<SegmentContent<T>>;
  format(content: Expand<SegmentContent<T>>): string;
};
