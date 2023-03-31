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

export type CommandSingleColumn = [SymbolT, SymbolDf, string];
export type CommandSingleArg = [SymbolT, SymbolDf, string, Atom];
export type CommandTwoArg = [SymbolT, SymbolDf, string, Atom, Atom];
export type Command = CommandSingleColumn | CommandSingleArg | CommandTwoArg;

export type SetCommandFunc = (newCommand: Command) => void;
export type SetCommandsFunc = (newCommands: Command[]) => void;

export type CommandDefaultArgSpec = Record<string, ArgSpec[]>;
export type CommandDefaultArgs = Record<string, Command>;
export const defaultCommandPatterns: CommandDefaultArgSpec = {
    dropcol: [null],
    fillna: [[3, 'fillVal', 'type', 'integer']],
    resample: [
        [3, 'frequency', 'enum', ['daily', 'weekly', 'monthly']],
        [4, 'colMap', 'colEnum', ['null', 'sum', 'mean', 'count']]
    ]
};

export const commandDefaults: CommandDefaultArgs = {
    dropcol: [sym('dropcol'), symDf, 'col'],
    fillna: [sym('fillna'), symDf, 'col', 8],
    resample: [sym('resample'), symDf, 'col', 'monthly', {}]
};

export type CommandConfigT = {
    commandPatterns: CommandDefaultArgSpec;
    commandDefaults: CommandDefaultArgs;
};

export const defaultCommandConfig: CommandConfigT = {
    commandPatterns: defaultCommandPatterns,
    commandDefaults
};

export const bakedCommands: Command[] = [
    [sym('dropcol'), symDf, 'col1'],
    [sym('fillna'), symDf, 'col2', 5],
    [sym('resample'), symDf, 'month', 'monthly', {}]
];
