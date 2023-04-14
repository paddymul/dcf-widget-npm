import * as React from 'react';
import {
    DCFCell,
    staticData,
    CommandUtils,
    ColumnsEditor,
    DependentTabs
} from 'paddy-react-edit-list';

export default function Simple() {
    return (
        <ColumnsEditor.ColumnsEditor
            df={staticData.tableDf}
            activeColumn={'foo'}
            commandConfig={staticData.bakedCommandConfig}
            getOrRequester={DependentTabs.serverGetTransformRequester}
        />
    );
}
