import * as React from 'react';
import {
    DCFCell,
    staticData,
    CommandUtils,
    CommandsComponent,
    staticData
} from 'paddy-react-edit-list';

export default function Simple() {
    return (
        <CommandsComponent.OperationViewer
            operations={staticData.bakedOperations}
            setOperations={(foo: unknown) => {
                console.log('setCommands sent', foo);
            }}
            activeColumn={'foo-column'}
            allColumns={['foo-col', 'bar-col', 'baz-col']}
            commandConfig={staticData.bakedCommandConfig}
        />
    );
}
