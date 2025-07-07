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
