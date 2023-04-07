import _ from 'lodash';

export const sym = (symbolName: string) => {
    return {symbol: symbolName};
};

const UnknownCommand = [sym('nonexistent'), sym('df'), 'col1'];

const ArgNames = ['Idx', 'label', 'specName', 'extraSpecArgs'];
type TypeSpec = [number, string, 'type', 'integer' | 'float' | 'string'];
type EnumSpec = [number, string, 'enum', string[]];
type ColEnumSpec = [number, string, 'colEnum', string[]];
export type NoArgs = null;
export type ActualArg = TypeSpec | EnumSpec | ColEnumSpec;
export type ArgSpec = TypeSpec | EnumSpec | ColEnumSpec | NoArgs;

export interface SymbolT {
    symbol: string;
}

export interface SymbolDf {
    symbol: 'df';
}

export const symDf: SymbolDf = {
    symbol: 'df'
};

export type ColEnumArgs = Record<string, string>;

export type Atom = number | string | SymbolT | ColEnumArgs;
export type SettableArg = number | string | ColEnumArgs;

export type OperationSingleColumn = [SymbolT, SymbolDf, string];
export type OperationSingleArg = [SymbolT, SymbolDf, string, Atom];
export type OperationTwoArg = [SymbolT, SymbolDf, string, Atom, Atom];
export type Operation = OperationSingleColumn | OperationSingleArg | OperationTwoArg;

export type SetOperationFunc = (newCommand: Operation) => void;
export type SetOperationsFunc = (newCommands: Operation[]) => void;

export type CommandArgSpec = Record<string, ArgSpec[]>;
export type OperationDefaultArgs = Record<string, Operation>;
export const bakedArgSpecs: CommandArgSpec = {
    dropcol: [null],
    fillna: [[3, 'fillVal', 'type', 'integer']],
    resample: [
        [3, 'frequency', 'enum', ['daily', 'weekly', 'monthly']],
        [4, 'colMap', 'colEnum', ['null', 'sum', 'mean', 'count']]
    ]
};

export const bakedOperationDefaults: OperationDefaultArgs = {
    dropcol: [sym('dropcol'), symDf, 'col'],
    fillna: [sym('fillna'), symDf, 'col', 8],
    resample: [sym('resample'), symDf, 'col', 'monthly', {}]
};

export type CommandConfigT = {
    argspecs: CommandArgSpec;
    defaultArgs: OperationDefaultArgs;
};

export const bakedCommandConfig: CommandConfigT = {
    argspecs: bakedArgSpecs,
    defaultArgs: bakedOperationDefaults
};

export const bakedOperations: Operation[] = [
    [sym('dropcol'), symDf, 'col1'],
    [sym('fillna'), symDf, 'col2', 5],
    [sym('resample'), symDf, 'month', 'monthly', {}]
];

//this will become OperationEventFunc
export type OperationEventFunc = (newCommand: Operation) => void;
export type NoArgEventFunc = () => void;
