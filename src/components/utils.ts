import _ from 'lodash';

export const requestDf = (url: string, setCallBack: any) => {
    const retPromise = fetch(url).then(async (response) => {
        const tableDf = await response.json();
        setCallBack(tableDf);
    });
    return retPromise;
};
