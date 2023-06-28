import type { ExtractPropTypes, PropType } from 'vue'
import type { PropKey } from './runtime'
import type { IfNever, UnknownToNever, WritableArray } from './util'

type Value<T> = T[keyof T]

/**
 * Extract the type of a single prop
 *
 * 提取单个 prop 的参数类型
 *
 * @example
 * ExtractPropType<{ type: StringConstructor }> => string | undefined
 * ExtractPropType<{ type: StringConstructor, required: true }> => string
 * ExtractPropType<{ type: BooleanConstructor }> => boolean
 */
export type ExtractPropType<T extends object> = Value<
  ExtractPropTypes<{
    key: T
  }>
>

/**
 * Extracts types via `ExtractPropTypes`, accepting `PropType<T>`, `XXXConstructor`, `never`...
 *
 * 通过 `ExtractPropTypes` 提取类型，接受 `PropType<T>`、`XXXConstructor`、`never`...
 *
 * @example
 * ResolvePropType<BooleanConstructor> => boolean
 * ResolvePropType<PropType<T>> => T
 **/
export type ResolvePropType<T> = IfNever<
  T,
  never,
  ExtractPropType<{
    type: WritableArray<T>
    required: true
  }>
>

/**
 * Merge Type, Value, Validator types
 * 合并 Type、Value、Validator 的类型
 *
 * @example
 * UIPropMergeType<StringConstructor, '1', 1> =>  1 | "1" // ignores StringConstructor
 * UIPropMergeType<StringConstructor, never, number> =>  string | number
 */
export type UIPropMergeType<Type, Value, Validator> =
  | IfNever<UnknownToNever<Value>, ResolvePropType<Type>, never>
  | UnknownToNever<Value>
  | UnknownToNever<Validator>

/**
 * Handling default values for input (constraints)
 *
 * 处理输入参数的默认值（约束）
 */
export type UIPropInputDefault<
  Required extends boolean,
  Default,
> = Required extends true
  ? never
  : Default extends Record<string, unknown> | Array<any>
    ? () => Default
    : (() => Default) | Default

/**
 * Native prop types, e.g: `BooleanConstructor`, `StringConstructor`, `null`, `undefined`, etc.
 *
 * 原生 prop `类型，BooleanConstructor`、`StringConstructor`、`null`、`undefined` 等
 */
export type NativePropType =
  | ((...args: any) => any)
  | { new (...args: any): any }
  | undefined
  | null
export type IfNativePropType<T, Y, N> = [T] extends [NativePropType] ? Y : N

/**
 * input prop `buildProp` or `buildProps` (constraints)
 *
 * prop 输入参数（约束）
 *
 * @example
 * UIPropInput<StringConstructor, 'a', never, never, true>
 * ⬇️
 * {
    type?: StringConstructor | undefined;
    required?: true | undefined;
    values?: readonly "a"[] | undefined;
    validator?: ((val: any) => boolean) | ((val: any) => val is never) | undefined;
    default?: undefined;
  }
 */
export interface UIPropInput<
  Type,
  Value,
  Validator,
  Default extends UIPropMergeType<Type, Value, Validator>,
  Required extends boolean,
> {
  type?: Type
  required?: Required
  values?: readonly Value[]
  validator?: ((val: any) => val is Validator) | ((val: any) => boolean)
  default?: UIPropInputDefault<Required, Default>
}

/**
 * output prop `buildProp` or `buildProps`.
 *
 * prop 输出参数。
 *
 * @example
 * UIProp<'a', 'b', true>
 * ⬇️
 * {
    readonly type: PropType<"a">;
    readonly required: true;
    readonly validator: ((val: unknown) => boolean) | undefined;
    readonly default: "b";
    __epPropKey: true;
  }
 */
export type UIProp<Type, Default, Required> = {
  readonly type: PropType<Type>
  readonly required: [Required] extends [true] ? true : false
  readonly validator: ((val: unknown) => boolean) | undefined
  [PropKey]: true
} & IfNever<Default, unknown, { readonly default: Default }>

/**
 * Determine if it is `UIProp`
 */
export type IfUIProp<T, Y, N> = T extends { [PropKey]: true } ? Y : N

/**
 * Converting input to output.
 *
 * 将输入转换为输出
 */
export type UIPropConvert<Input> = Input extends UIPropInput<
  infer Type,
  infer Value,
  infer Validator,
  any,
  infer Required
>
  ? UIPropFinalized<Type, Value, Validator, Input['default'], Required>
  : never

/**
 * Finalized conversion output
 *
 * 最终转换 UIProp
 */
export type UIPropFinalized<Type, Value, Validator, Default, Required> = UIProp<
  UIPropMergeType<Type, Value, Validator>,
  UnknownToNever<Default>,
  Required
>

export {}
