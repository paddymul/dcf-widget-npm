import React, {useState} from 'react';
import {DFWhole, EmptyDf} from './staticData';
import {OperationViewer} from './Commands';
import {Operation} from './OperationUtils';
import {CommandConfigT} from './CommandUtils';
import {bakedCommandConfig} from './bakedOperationDefaults';
import {serverGetTransformRequester, serverGetPyRequester, DependentTabs} from './DependentTabs';

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
    console.log('Columns Editor, commandConfig', commandConfig);
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
