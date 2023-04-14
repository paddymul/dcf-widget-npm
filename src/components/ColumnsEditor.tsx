import React, {useState} from 'react';
import {DFWhole, EmptyDf} from './staticData';
import {OperationViewer} from './Commands';
import {Operation} from './OperationUtils';
import {CommandConfigT} from './CommandUtils';
import {bakedCommandConfig} from './bakedOperationDefaults';
import {
    serverGetTransformRequester,
    DependentTabs,
    getOperationResultSetterT
} from './DependentTabs';

export function ColumnsEditor(
    {
        df,
        activeColumn,
        getOrRequester,
        commandConfig
    }: {
        df: DFWhole;
        activeColumn: string;
        getOrRequester: getOperationResultSetterT;
        commandConfig: CommandConfigT;
    } = {
        df: EmptyDf,
        activeColumn: 'stoptime',
        getOrRequester: serverGetTransformRequester,
        commandConfig: bakedCommandConfig
    }
) {
    const schema = df.schema;
    const [operations, setOperations] = useState<Operation[]>([]);

    const allColumns = df.schema.fields.map((field) => field.name);
    //console.log('Columns Editor, commandConfig', commandConfig);
    return (
        <div className='columns-editor' style={{width: '100%'}}>
            <OperationViewer
                operations={operations}
                setOperations={setOperations}
                activeColumn={activeColumn}
                allColumns={allColumns}
                commandConfig={commandConfig}
            />
            <DependentTabs filledOperations={operations} getOrRequester={getOrRequester} />
        </div>
    );
}
