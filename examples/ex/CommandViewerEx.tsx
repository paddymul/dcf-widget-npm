import * as React from 'react';
import {DCFCell, staticData, CommandUtils, CommandsComponent} from 'paddy-react-edit-list';

export default function Simple() {
    return (
        <CommandsComponent.CommandViewer
            commands={CommandUtils.bakedCommands}
            setCommands={(foo: unknown) => {
                console.log('setCommands sent', foo);
            }}
            activeColumn={'foo-column'}
            allColumns={['foo-col', 'bar-col', 'baz-col']}
            commandConfig={CommandUtils.defaultCommandConfig}
        />
    );
}
