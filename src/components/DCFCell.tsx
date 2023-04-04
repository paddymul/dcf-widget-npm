import React, {Component, useState, useEffect, Dispatch, SetStateAction} from 'react';
import _ from 'lodash';
import {ColumnsEditor, serverGetTransformRequester} from './ColumnsEditor';
import {tableDf, convertTableDF, columns, rows, DFWhole} from './staticData';
import {DFViewer} from './DFViewer';
import {CommandConfigT, defaultCommandConfig} from './CommandUtils';
import {requestDf} from './utils';

export function DCFCell() {
    const [origDf, setOrigDf] = useState<DFWhole>(tableDf);
    useEffect(() => {
        requestDf('http://localhost:5000/dcf/df/1?slice_end=50', setOrigDf);
    }, []);

    const [commandConfig, setCommandConfig] = useState(defaultCommandConfig);

    useEffect(() => {
        fetch('http://localhost:5000/dcf/command-config').then(async (response) => {
            setCommandConfig(await response.json());
        });
    }, []);

    const [activeCol, setActiveCol] = useState('stoptime');
    return (
        <div className='dcf-root flex flex-col' style={{width: '100%', height: '100%'}}>
            <h1 style={{fontSize: '1.25rem', margin: '5px', textAlign: 'left'}}>
                Data Cleaning Framework{' '}
            </h1>
            <div className='orig-df flex flex-row' style={{height: '250px', overflow: 'hidden'}}>
                <DFViewer df={origDf} activeCol={activeCol} setActiveCol={setActiveCol} />
            </div>
            <ColumnsEditor
                df={origDf}
                activeColumn={activeCol}
                getTransformRequester={serverGetTransformRequester}
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
    getTransformRequester,
    commandConfig,
    exposeCommandConfigSetter
}: {
    origDf: DFWhole;
    getTransformRequester: unknown;
    commandConfig: CommandConfigT;
    exposeCommandConfigSetter: CommandConfigSetterT;
}) {
    const [activeCommandConfig, setCommandConfig] = useState(commandConfig);
    exposeCommandConfigSetter(setCommandConfig);
    const [activeCol, setActiveCol] = useState('stoptime');

    return (
        <div className='dcf-root flex flex-col' style={{width: '100%', height: '100%'}}>
            <h1 style={{fontSize: '1.25rem', margin: '5px', textAlign: 'left'}}>
                Data Cleaning Framework{' '}
            </h1>
            <div className='orig-df flex flex-row' style={{height: '250px', overflow: 'hidden'}}>
                <DFViewer df={origDf} activeCol={activeCol} setActiveCol={setActiveCol} />
            </div>
            <ColumnsEditor
                df={origDf}
                activeColumn={activeCol}
                getTransformRequester={getTransformRequester}
                commandConfig={activeCommandConfig}
            />
        </div>
    );
}
