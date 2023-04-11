import React, {Component, useState, useEffect, useReducer, useRef, useLayoutEffect} from 'react';
import _ from 'lodash';
import {Operation, SetOperationsFunc, OperationEventFunc, NoArgEventFunc} from './OperationUtils';
import {CommandConfigT} from './CommandUtils';
import {bakedCommandConfig} from './bakedOperationDefaults';
import {OperationDetail, OperationAdder} from './CommandDetail';
import {AgGridReact} from 'ag-grid-react'; // the AG Grid React Component
import {ColDef, Grid, GridOptions} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {bakedOperations} from './staticData';

const getColumns = (passedOperations: Operation[]): ColDef[] =>
    _.map(Array.from(passedOperations.entries()), ([index, element]) => {
        const name = element[0]['symbol'];
        const key = name + index.toString();
        const column = {field: key, headerName: name}; // width: 20, maxWidth: 60};
        return column;
    });

export const OperationsList = ({operations}: {operations: Operation[]}) => {
    const rowElements = _.map(Array.from(operations.entries()), ([index, element]) => {
        const name = element[0]['symbol'];
        const key = name + index.toString();
        const rowEl: Record<string, string> = {};
        rowEl[key] = element[2];
        return rowEl;
    });
    const rows = [_.merge({}, ...rowElements)];
    const columns = getColumns(operations);
    console.log('OperationsList columns', columns);
    return (
        <div style={{height: 200, width: 600}} className='ag-theme-alpine'>
            <AgGridReact rowData={rows} columnDefs={columns}></AgGridReact>
        </div>
    );
};

export const OperationViewer = ({
    operations,
    setOperations,
    activeColumn,
    allColumns,
    commandConfig
}: {
    operations: Operation[];
    setOperations: SetOperationsFunc;
    activeColumn: string;
    allColumns: string[];
    commandConfig: CommandConfigT;
}) => {
    const operationObjs = _.map(Array.from(operations.entries()), ([index, element]) => {
        const name = element[0]['symbol'];
        const key = name + index.toString();
        const rowEl: Record<string, Operation> = {};
        rowEl[key] = element;
        return rowEl;
    });
    //why am I doing this? probably something so I gauruntee a clean dict

    const operationDict = _.merge({}, ...operationObjs);

    const idxObjs = _.map(Array.from(operations.entries()), ([index, element]) => {
        const name = element[0]['symbol'];
        const key = name + index.toString();
        const rowEl: Record<string, number> = {};
        rowEl[key] = index;
        return rowEl;
    });
    const keyToIdx = _.merge({}, ...idxObjs);

    // previously was null
    const [activeKey, setActiveKey] = useState('');

    function getSetOperation(key: string): OperationEventFunc {
        return (newOperation: Operation) => {
            const index = keyToIdx[key];
            const nextOperations = operations.map((c, i) => {
                if (i === index) {
                    return newOperation;
                } else {
                    return c;
                }
            });
            setOperations(nextOperations);
        };
    }

    function getDeleteOperation(key: string): NoArgEventFunc {
        return (): void => {
            const index = keyToIdx[key];
            const nextOperations = operations.map((c, i) => {
                if (i === index) {
                    return undefined;
                } else {
                    return c;
                }
            });
            setActiveKey('');
            setOperations(_.filter(nextOperations) as Operation[]);
        };
    }

    const addOperation: OperationEventFunc = (newOperation: Operation) => {
        const newOperationArr = [...operations, newOperation];
        setOperations(newOperationArr);
        const newOperationKey = getColumns(newOperationArr)[newOperationArr.length - 1].field;
        if (newOperationKey !== undefined) {
            setActiveKey(newOperationKey);
        }
    };
    const {argspecs, defaultArgs} = commandConfig;
    console.log('OperationsViewer operationDict', operationDict, 'activeKey', activeKey);
    return (
        <div className='command-viewer'>
            <h2> Operation adder </h2>
            <OperationAdder
                column={activeColumn}
                addOperationCb={addOperation}
                defaultArgs={defaultArgs}
            />
            <div className='command-box'>
                <h4> Operations </h4>
                <OperationsList operations={operations} />
            </div>
            {activeKey && (
                <OperationDetail
                    command={operationDict[activeKey]}
                    setCommand={getSetOperation(activeKey)}
                    deleteCB={getDeleteOperation(activeKey)}
                    columns={allColumns}
                    commandPatterns={argspecs}
                />
            )}
        </div>
    );
};

export const Commands = () => {
    const [c, setC] = useState(bakedOperations);
    const [commandConfig, setCommandConfig] = useState(bakedCommandConfig);

    useEffect(() => {
        fetch('http://localhost:5000/dcf/command-config').then(async (response) => {
            setCommandConfig(await response.json());
        });
    }, []);

    return (
        <div style={{width: '100%', height: '100%'}}>
            <OperationViewer
                operations={c}
                setOperations={setC}
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
