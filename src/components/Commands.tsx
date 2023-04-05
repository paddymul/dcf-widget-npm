import React, {Component, useState, useEffect, useReducer, useRef, useLayoutEffect} from 'react';
import _ from 'lodash';
import DataGrid from 'react-data-grid';
import {
    bakedCommands,
    defaultCommandConfig,
    Command,
    SetCommandsFunc,//
    CommandConfigT//
} from './CommandUtils';
import {CommandDetail, CommandAdder} from './CommandDetail';

export const CommandViewer = ({
    commands,
    setCommands,
    activeColumn,
    allColumns,
    commandConfig//
}: {
    commands: Command[];
    setCommands: SetCommandsFunc;//
    activeColumn: string;
    allColumns: string[];
    commandConfig: CommandConfigT;
}) => {
    const rowElements = _.map(Array.from(commands.entries()), ([index, element]) => {
        const name = element[0]['symbol'];
        const key = name + index.toString();
        const rowEl: Record<string, string> = {};
        rowEl[key] = element[2];
        return rowEl;
    });
    const rows = [_.merge({}, ...rowElements)];

    const commandObjs = _.map(Array.from(commands.entries()), ([index, element]) => {
        const name = element[0]['symbol'];
        const key = name + index.toString();
        const rowEl: Record<string, Command> = {};
        rowEl[key] = element;
        return rowEl;
    });
    const commandDict = _.merge({}, ...commandObjs);

    const idxObjs = _.map(Array.from(commands.entries()), ([index, element]) => {
        const name = element[0]['symbol'];
        const key = name + index.toString();
        const rowEl: Record<string, number> = {};
        rowEl[key] = index;
        return rowEl;
    });
    const keyToIdx = _.merge({}, ...idxObjs);

    // previously was null
    const [activeKey, setActiveKey] = useState('');

    const getColumns = (passedCommands: Command[]) =>
        _.map(Array.from(passedCommands.entries()), ([index, element]) => {
            const name = element[0]['symbol'];
            const key = name + index.toString();
            const column = {key, name, width: 20, maxWidth: 60};
            return column;
        });

    const columns = getColumns(commands);

    function getSetCommand(key: string) {//makeSetCommand?
        return (newCommand: Command) => {
            const index = keyToIdx[key];
            const nextCommands = commands.map((c, i) => {
                if (i === index) {
                    return newCommand;
                } else {
                    return c;
                }
            });
            setCommands(nextCommands);
        };
    }

    function getDeleteCommand(key: string) {//makeDeleteCommand
        return (newCommand: Command) => {
            const index = keyToIdx[key];
            const nextCommands = commands.map((c, i) => {
                if (i === index) {
                    return undefined;
                } else {
                    return c;
                }
            });
            setActiveKey('');
            setCommands(_.filter(nextCommands) as Command[]);
        };
    }

    const addCommand = (newCommand: Command) => {
        const newCommandArr = [...commands, newCommand];
        setCommands(newCommandArr);
        const newCommandKey = getColumns(newCommandArr)[newCommandArr.length - 1].key;
        setActiveKey(newCommandKey);
    };

    const {commandPatterns, commandDefaults} = commandConfig;

    return (
        <div className='command-viewer'>
            <CommandAdder
                column={activeColumn}
                addCommandCb={addCommand}
                commandDefaults={commandDefaults}
            />
            <div className='command-box'>
                <h4> Commands </h4>

                <DataGrid
                    style={{width: '1200px', height: '80px'}}
                    columns={columns}
                    rows={rows}
                    onCellClick={({row, column}) => {
                        // add to generated commands
                        const tempRow = _.clone(rows[0]);
                        const oldVal = tempRow[column.key];
                        tempRow[column.key] = oldVal == 'false' ? 'true' : 'false';
                        setActiveKey(column.key);
                    }}
                />
            </div>
            {activeKey && (
                <CommandDetail
                    command={commandDict[activeKey]}
                    setCommand={getSetCommand(activeKey)}
                    deleteCB={getDeleteCommand(activeKey)}
                    columns={allColumns}
                    commandPatterns={commandPatterns}
                />
            )}
        </div>
    );
};

//
export const Commands = () => {
    const [c, setC] = useState(bakedCommands);
    const [commandConfig, setCommandConfig] = useState(defaultCommandConfig);

    useEffect(() => {
        fetch('http://localhost:5000/dcf/command-config').then(async (response) => {
            setCommandConfig(await response.json());
        });
    }, []);

    return (
        <div style={{width: '100%', height: '100%'}}>
            <CommandViewer
                commands={c}
                setCommands={setC}
                activeColumn={'new-column2'}
                allColumns={['foo-col', 'bar-col', 'baz-col']}
                commandConfig={commandConfig}
            />
            <code style={{fontSize: '1em', textAlign: 'left'}}>
                {' '}
                {JSON.stringify(c, null, '\t\n\r')}{' '}
            </code>
        </div>
    );
};
