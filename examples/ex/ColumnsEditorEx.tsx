import * as React from 'react';
import {DCFCell, staticData, CommandUtils, ColumnsEditor} from 'paddy-react-edit-list';

export default function Simple() {
    return (
        <ColumnsEditor.ColumnsEditor
            df={staticData.tableDf}
            activeColumn={'foo'}
            commandConfig={CommandUtils.defaultCommandConfig}
            getTransformRequester={ColumnsEditor.serverGetTransformRequester}
            getPyRequester={ColumnsEditor.serverGetPyRequester}
        />
    );
}
