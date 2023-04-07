import React, {Component, useState, useEffect} from 'react';
import {tableDf, DFWhole, EmptyDf} from './staticData';
import {requestDf} from './utils';
import {DFViewer} from './DFViewer';
import _ from 'lodash';
import {OperationViewer} from './Commands';
import {Operation, CommandConfigT, bakedCommandConfig} from './CommandUtils';

export function OperationDisplayer({filledOperations, style}) {
    const baseStyle = {margin: '0', textAlign: 'left'};
    const localStyle = {...baseStyle, ...style};
    return (
        <div className='command-displayer' style={{width: '100%'}}>
            <pre style={localStyle}>{JSON.stringify(filledOperations)}</pre>
        </div>
    );
}

export function PythonDisplayer({filledOperations, style, getPyRequester}) {
    const [pyString, setPyString] = useState('');
    const pyRequester = getPyRequester(setPyString);

    useEffect(() => {
        pyRequester(filledOperations);
    }, [filledOperations, getPyRequester, pyRequester]);
    const baseStyle = {margin: '0', textAlign: 'left'};
    const localStyle = {...baseStyle, ...style};
    return (
        <div className='python-displayer' style={{width: '100%'}}>
            <pre style={localStyle}>{pyString}</pre>
        </div>
    );
}

export const serverGetPyRequester = (setPyString) => {
    const baseGetPy = (instructions: Operation[]) => {
        const URLBase = 'http://localhost:5000/dcf/';
        const pyCodeUrl = `${URLBase}dcf_to_py/1?instructions=${JSON.stringify(instructions)}`;
        if (instructions.length == 0) {
            setPyString('');
            return;
        } else {
            fetch(pyCodeUrl).then(async (response) => {
                const fullResp = await response.json();
                const pyCode = fullResp['py'];
                setPyString(pyCode);
            });
        }
    };
    return baseGetPy;
};

const makeFullInstructions = (raw) => [{symbol: 'begin'}, ...raw];
const EmptyInstructions = makeFullInstructions([]);
const transformInstructions = (raw) => JSON.stringify(raw);

export const serverGetTransformRequester = (setDf) => {
    const baseRequestTransform = (passedInstructions) => {
        const URLBase = 'http://localhost:5000/dcf/';
        const sliceArgs = 'slice_start=3&slice_end=50';

        const emptyUrl = `${URLBase}df/1?${sliceArgs}`;
        const instructions = transformInstructions(passedInstructions);
        const transUrl = `${URLBase}transform_df/1?instructions=${instructions}&${sliceArgs}`;
        if (_.isEqual(passedInstructions, EmptyInstructions)) {
            requestDf(emptyUrl, setDf);
        } else {
            requestDf(transUrl, setDf);
        }
    };
    return baseRequestTransform;
};

export function TransformViewer({filledOperations, style, getTransformRequester}) {
    const [transDf, setTransDf] = useState<DFWhole>(tableDf);
    const transformRequester = getTransformRequester(setTransDf);

    const fullInstructions = makeFullInstructions(filledOperations);

    useEffect(() => {
        transformRequester(fullInstructions);
    }, [filledOperations, fullInstructions, transformRequester]);
    return (
        <div className='transform-viewer'>
            {' '}
            <DFViewer style={style} df={transDf} />{' '}
        </div>
    );
}

export function DependentTabs({filledOperations, getTransformRequester, getPyRequester}) {
    const [tab, _setTab] = useState('df');
    const setTab = (tabName: string) => {
        const retFunc = () => {
            _setTab(tabName);
        };
        return retFunc;
    };
    const baseStyle = {background: 'grey'};
    const [dfStyle, pythonStyle, commandStyle] = [
        _.clone(baseStyle),
        _.clone(baseStyle),
        _.clone(baseStyle)
    ];

    const activeBackground = '#261d1d';
    if (tab === 'df') {
        dfStyle['background'] = activeBackground;
    }
    if (tab === 'python') {
        pythonStyle['background'] = activeBackground;
    }
    if (tab === 'command') {
        commandStyle['background'] = activeBackground;
    }
    const style = {height: '45vh'};

    return (
        <div className='dependent-tabs' style={{width: '100%'}}>
            <ul className='tabs'>
                <li onClick={setTab('df')} style={dfStyle}>
                    DataFrame
                </li>
                <li onClick={setTab('python')} style={pythonStyle}>
                    Python
                </li>
                <li onClick={setTab('command')} style={commandStyle}>
                    Command
                </li>
            </ul>
            <div className='output-area'>
                {
                    {
                        command: <OperationDisplayer style={style} filledOperations={filledOperations} />,
                        python: (
                            <PythonDisplayer
                                style={style}
                                filledOperations={filledOperations}
                                getPyRequester={getPyRequester}
                            />
                        ),
                        df: (
                            <TransformViewer
                                style={style}
                                filledOperations={filledOperations}
                                getTransformRequester={getTransformRequester}
                            />
                        )
                    }[tab]
                }
            </div>
        </div>
    );
}

export function ColumnsEditor(
    {
        df,
        activeColumn,
        getTransformRequester,
        commandConfig,
        getPyRequester
    }: {
        df: DFWhole;
        activeColumn: string;
        getTransformRequester: unknown;
        commandConfig: CommandConfigT;
        getPyRequester: unknown;
    } = {
        df: EmptyDf,
        activeColumn: 'stoptime',
        getTransformRequester: serverGetTransformRequester,
        commandConfig: bakedCommandConfig,
        getPyRequester: serverGetPyRequester
    }
) {
    const schema = df.schema;
    const [operations, setOperations] = useState<Operation[]>([]);

    const allColumns = df.schema.fields.map((field) => field.name);
    return (
        <div className='columns-editor' style={{width: '100%'}}>
            <OperationViewer
                operations={operations}
                setOperations={setOperations}
                activeColumn={activeColumn}
                allColumns={allColumns}
                commandConfig={commandConfig}
            />
            <DependentTabs
                filledOperations={operations}
                getTransformRequester={getTransformRequester}
                getPyRequester={getPyRequester}
            />
        </div>
    );
}
