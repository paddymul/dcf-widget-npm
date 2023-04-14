import React, {
    Component,
    useState,
    useEffect,
    CSSProperties,
    Dispatch,
    SetStateAction
} from 'react';
import {tableDf, DFWhole, EmptyDf} from './staticData';
import {requestDf} from './utils';
import {DFViewer} from './DFViewer';
import _ from 'lodash';
import {Operation} from './OperationUtils';

export function OperationDisplayer({filledOperations, style}) {
    const baseStyle = {margin: '0', textAlign: 'left'};
    const localStyle = {...baseStyle, ...style};
    return (
        <div className='command-displayer' style={{width: '100%'}}>
            <pre style={localStyle}>{JSON.stringify(filledOperations)}</pre>
        </div>
    );
}

export function PythonDisplayer({style, generatedPyCode}) {
    const baseStyle = {margin: '0', textAlign: 'left'};
    const localStyle = {...baseStyle, ...style};
    return (
        <div className='python-displayer' style={{width: '100%'}}>
            <pre style={localStyle}>{generatedPyCode}</pre>
        </div>
    );
}

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

export function TransformViewer({
    style,
    transformedDf
}: {
    style: CSSProperties;
    transformedDf: DFWhole;
}) {
    return (
        <div className='transform-viewer'>
            <DFViewer style={style} df={transformedDf} />
        </div>
    );
}
export type OperationResult = {transformed_df: DFWhole; generated_py_code: string};

export type OrRequesterT = (ops: Operation[]) => void;
export type getOperationResultSetterT = (
    setter: Dispatch<SetStateAction<OperationResult>>
) => OrRequesterT;

export const baseOperationResults: OperationResult = {
    transformed_df: EmptyDf,
    generated_py_code: 'default py code'
};

export function DependentTabs({
    filledOperations,
    getOrRequester
}: {
    filledOperations: Operation[];
    getOrRequester: getOperationResultSetterT;
}) {
    const [operationResult, setOperationResult] = useState<OperationResult>(baseOperationResults);
    const orRequester = getOrRequester(setOperationResult);

    const fullInstructions = makeFullInstructions(filledOperations);

    useEffect(() => {
        orRequester(fullInstructions);
    }, [filledOperations, fullInstructions, operationResult, orRequester]);

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
                        command: (
                            <OperationDisplayer style={style} filledOperations={filledOperations} />
                        ),
                        python: (
                            <PythonDisplayer
                                style={style}
                                generatedPyCode={operationResult.generated_py_code}
                            />
                        ),
                        df: (
                            <TransformViewer
                                style={style}
                                transformedDf={operationResult.transformed_df}
                            />
                        )
                    }[tab]
                }
            </div>
        </div>
    );
}
