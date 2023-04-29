import React, {Component, useState, useEffect, Dispatch, SetStateAction} from 'react';
import _ from 'lodash';
import {getOperationResultSetterT, serverGetTransformRequester} from './DependentTabs';
import {ColumnsEditor} from './ColumnsEditor';
import {tableDf, DFWhole} from './staticData';
import {DFViewer} from './DFViewer';
import {StatusBar, DfConfig} from './StatusBar';
import {CommandConfigT} from './CommandUtils';
import {bakedCommandConfig} from './bakedOperationDefaults';
import {requestDf} from './utils';

export function DCFCell() {
    const [origDf, setOrigDf] = useState<DFWhole>(tableDf);
    useEffect(() => {
        requestDf('http://localhost:5000/dcf/df/1?slice_end=50', setOrigDf);
    }, []);

    const [commandConfig, setCommandConfig] = useState(bakedCommandConfig);

    useEffect(() => {
        fetch('http://localhost:5000/dcf/command-config').then(async (response) => {
            setCommandConfig(await response.json());
        });
    }, []);

    const [activeCol, setActiveCol] = useState('stoptime');
    return (
        <div className='dcf-root flex flex-col' style={{width: '100%', height: '100%'}}>
            <div className='orig-df flex flex-row' style={{height: '250px', overflow: 'hidden'}}>
                <DFViewer df={origDf} activeCol={activeCol} setActiveCol={setActiveCol} />
            </div>
            <ColumnsEditor
                df={origDf}
                activeColumn={activeCol}
                getOrRequester={serverGetTransformRequester}
                commandConfig={commandConfig}
            />
        </div>
    );
}

export type CommandConfigSetterT = (setter: Dispatch<SetStateAction<CommandConfigT>>) => void;

/*
  Widget DCFCell is meant to be used with callback functions and passed values, not explicit http calls
 */
export function WidgetDCFCell({
    origDf,
    getOrRequester,
    commandConfig,
    exposeCommandConfigSetter,
    dfConfig,
    on_dfConfig
}: {
    origDf: DFWhole;
    getOrRequester: getOperationResultSetterT;
    commandConfig: CommandConfigT;
    exposeCommandConfigSetter: CommandConfigSetterT;
    dfConfig: DfConfig;
    on_dfConfig: unknown;
}) {
    const [activeCommandConfig, setCommandConfig] = useState(commandConfig);
    exposeCommandConfigSetter(setCommandConfig);
    const [activeCol, setActiveCol] = useState('stoptime');

    return (
        <div className='dcf-root flex flex-col' style={{width: '100%', height: '100%'}}>
            <div className='orig-df flex flex-row' style={{height: '300px', overflow: 'hidden'}}>
                <StatusBar config={dfConfig} setConfig={on_dfConfig} />
                <DFViewer df={origDf} activeCol={activeCol} setActiveCol={setActiveCol} />
            </div>
            <ColumnsEditor
                df={origDf}
                activeColumn={activeCol}
                getOrRequester={getOrRequester}
                commandConfig={activeCommandConfig}
            />
        </div>
    );
}

export function WidgetDCFCellExample() {
    const [sampleConfig, setConfig] = useState<DfConfig>({
        totalRows: 1309,
        columns: 30,
        rowsShown: 500,
        sampleSize: 10_000,
        summaryStats: false,
        reorderdColumns: false
    });

    return (
        <WidgetDCFCell
            origDf={tableDf}
            getOrRequester={serverGetTransformRequester}
            exposeCommandConfigSetter={(e) =>
                console.log('exposeCommandConfigSetter called with', e)
            }
            commandConfig={bakedCommandConfig}
            dfConfig={sampleConfig}
            on_dfConfig={setConfig}
        />
    );
}
