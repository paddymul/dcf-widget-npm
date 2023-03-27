import _ from 'lodash';

export const sym = (symbolName:string) => {
  return {'symbol':symbolName}
}
export const bakedCommands = [
  [sym("dropcol"), sym('df'), 'col1'],
  [sym("fillna"), sym('df'), 'col2', 5],
  [sym("resample"), sym('df'), 'month', 'monthly', {}]
]



const UnknownCommand = [sym("nonexistent"), sym('df'), 'col1']

const ArgNames =   ['Idx', 'label', 'specName',   'extraSpecArgs']
type TypeSpec =    [number, string, 'type',       'integer' | 'float' | 'string']
type EnumSpec =    [number, string, 'enum',       string[]]
type ColEnumSpec = [number, string, 'colEnum',    string[]]
export type NoArgs = null
export type ActualArg = TypeSpec | EnumSpec | ColEnumSpec
export type ArgSpec = TypeSpec | EnumSpec | ColEnumSpec | NoArgs

export const defaultCommandPatterns:Record<string, ArgSpec[]> = {
  "dropcol":[null],
  "fillna":[[3, 'fillVal', 'type', 'integer']],
  "resample":[[3, 'frequency', 'enum', ['daily', 'weekly', 'monthly']],
	      [4, 'colMap', 'colEnum', ['null', 'sum', 'mean', 'count']]]
}

export const commandDefaults:Record<string, any> = {
  "dropcol":  [sym("dropcol"), sym("df"), "col"],
  "fillna":   [sym("fillna"), sym("df"), "col", 8],
  "resample": [sym("resample"), sym('df'), 'col', 'monthly', {}]
}

export const defaultCommandConfig = {
  commandPatterns:defaultCommandPatterns,
  commandDefaults
}
