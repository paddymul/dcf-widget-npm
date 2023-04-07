import _ from 'lodash';
import {DFWhole} from './staticData';

export type setDFFunc = (newDf: DFWhole) => void;

export const requestDf = (url: string, setCallBack: setDFFunc) => {
    const retPromise = fetch(url).then(async (response) => {
        const tableDf = await response.json();
        setCallBack(tableDf);
    });
    return retPromise;
};

export const sym = (symbolName: string) => {
    return {symbol: symbolName};
};
