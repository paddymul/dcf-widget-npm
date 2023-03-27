import React, {Component, useState, useEffect, useReducer, useRef, useLayoutEffect} from 'react';
import _ from 'lodash';
import DataGrid from 'react-data-grid';
import {
    sym,
    bakedCommands,
    Atom,
    SetCommandFunc,
    Command,
    ActualArg,
    SettableArg,
    ArgSpec,
    defaultCommandPatterns
} from './CommandUtils';

const nullSetter = () => 5;

function replaceInArr<T>(arr: T[], old: T, subst: T): T[] {
    return arr.map((item: T) => (item === old ? subst : item));
}

function replaceAtIdx<T>(arr: T[], idx: number, subst: T): T[] {
    return arr.map((item: T, innerIdx: number) => (innerIdx === idx ? subst : item));
}

function replaceAtKey<T>(obj: Record<string, T>, key: string, subst: T): Record<string, T> {
    const objCopy = _.clone(obj);
    objCopy[key] = subst;
    return objCopy;
}

const objWithoutNull = (obj: Record<string, string>, extraStrips: string[] = []) =>
    _.pickBy(obj, (x) => ![null, undefined, ...extraStrips].includes(x));

export const CommandDetail = ({command, setCommand, deleteCB, columns, commandPatterns}) => {
    const commandName = command[0]['symbol'];
    const pattern = commandPatterns[commandName];

    if (!_.isArray(pattern)) {
        //we shouldn't get here
        return <h2>unknown command {commandName}</h2>;
    } else if (_.isEqual(pattern, [null])) {
        return (
            <div className='command-detail'>
                <h4>no arguments</h4>
                <button onClick={deleteCB}>X</button>
            </div>
        );
    } else {
        const fullPattern = pattern as ActualArg[];
        return (
            <div className='command-detail'>
                <ArgGetters
                    command={command}
                    fullPattern={fullPattern}
                    setCommand={setCommand}
                    columns={columns}
                    deleteCB={deleteCB}
                />
            </div>
        );
    }
    return <h2></h2>;
};

export const ArgGetters = ({
    command,
    fullPattern,
    setCommand,
    columns,
    deleteCB
}: {
    command: Command;
    fullPattern: ActualArg[];
    setCommand: SetCommandFunc;
    columns: string[];
    deleteCB: () => void;
}) => {
    const makeArgGetter = (pattern: ActualArg) => {
        const idx = pattern[0];
        const val = command[idx] as SettableArg;
        const valSetter = (newVal) => {
            const newCommand = replaceAtIdx(command, idx, newVal);
            //console.log('newCommand', newCommand);
            setCommand(newCommand as Command);
        };
        return <ArgGetter argProps={pattern} val={val} setter={valSetter} columns={columns} />;
    };
    return (
        <div className='arg-getters'>
            <button onClick={deleteCB}>X</button>
            {fullPattern.map(makeArgGetter)}
        </div>
    );
};

const ArgGetter = ({
    argProps,
    val,
    setter,
    columns
}: {
    argProps: ActualArg;
    val: SettableArg;
    setter: (arg: SettableArg) => void;
    columns: string[];
}) => {
    const [argPos, label, argType, lastArg] = argProps;

    const defaultShim = (event) => setter(event.target.value);
    if (argType === 'enum') {
        return (
            <fieldset>
                <label> {label} </label>
                <select defaultValue={val as string} onChange={defaultShim}>
                    {lastArg.map((optionVal) => (
                        <option key={optionVal} value={optionVal}>
                            {optionVal}
                        </option>
                    ))}
                </select>
            </fieldset>
        );
    } else if (argType === 'type') {
        if (lastArg === 'integer') {
            const valSetterShim = (event) => setter(parseInt(event.target.value));
            return (
                <fieldset>
                    <label> {label} </label>
                    <input
                        type='number'
                        defaultValue={val as number}
                        step='1'
                        onChange={valSetterShim}
                    />
                </fieldset>
            );
        } else {
            return (
                <fieldset>
                    <label> {label} </label>
                    <input value='dont know' />
                </fieldset>
            );
        }
    } else if (argType === 'colEnum') {
        const widgetRow = columns.map((colName: string) => {
            const colSetter = (event) => {
                const newColVal = event.target.value;
                if (_.isString(newColVal)) {
                    const updatedColDict = replaceAtKey(
                        val as Record<string, string>,
                        colName,
                        newColVal as string
                    ); // as Record<string, string>
                    setter(objWithoutNull(updatedColDict, ['null']));
                }
            };
            const colVal = _.get(val, colName, 'null');
            return (
                <td>
                    <select defaultValue={colVal} onChange={colSetter}>
                        {lastArg.map((optionVal) => (
                            <option key={optionVal} value={optionVal}>
                                {optionVal}
                            </option>
                        ))}
                    </select>
                </td>
            );
        });

        return (
            <div className='col-enum'>
                <table>
                    <thead>
                        <tr>
                            {columns.map((colName) => (
                                <th>{colName}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>{widgetRow}</tr>
                    </tbody>
                </table>
            </div>
        );
    } else {
        return <h3> unknown argtype </h3>;
    }
};

export const CommandAdder = ({column, addCommandCb, commandDefaults}) => {
    const addCommandByName = (localCommandName: string) => {
        return () => {
            const defaultCommand = commandDefaults[localCommandName];
            addCommandCb(replaceInArr(defaultCommand, 'col', column));
        };
    };

    return (
        <div className='command-adder'>
            <fieldset>
                <button> Column: {column}</button>
                <label> Command Name </label>
                {_.keys(commandDefaults).map((optionVal) => (
                    <button onClick={addCommandByName(optionVal)}> {optionVal} </button>
                ))}
            </fieldset>
        </div>
    );
};

export const CommandDetailHarness = () => {
    const activeCommand = bakedCommands[0];
    return (
        <div>
            <CommandDetail
                command={activeCommand}
                setCommand={nullSetter}
                deleteCB={nullSetter}
                columns={['foo', 'bar', 'baz']}
                commandPatterns={defaultCommandPatterns}
            />
        </div>
    );
};

/*


  */
