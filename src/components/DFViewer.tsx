import 'react-data-grid/lib/styles.css';
import React, {Component, useState, useEffect} from 'react';
import _ from 'lodash';
import DataGrid, {Column} from 'react-data-grid';
import {convertTableDF, DFWhole, EmptyDf} from './staticData';

const updateAtMatch = (cols: Record<string, any>[], key: string, subst: any) => {
    const retColumns = cols.map((x) => {
        if (x.key === key) {
            return {...x, ...subst};
        } else {
            return x;
        }
    });
    return retColumns;
};

export function DFViewer(
    {
        df,
        style,
        activeCol,
        setActiveCol
    }: {df: DFWhole; style?: Record<string, any>; activeCol?: string; setActiveCol?: any} = {
        df: EmptyDf,
        style: {height: '300px'},
        setActiveCol: () => null
    }
) {
    const [localColumns, localRows] = convertTableDF(df);
    //Record<string, string|number>
    const localStyle = style;
    const styledColumns = updateAtMatch(localColumns, activeCol || '___never', {
        cellClass: 'activeCol'
    }) as Column<unknown>[];
    return (
        <DataGrid
            style={localStyle}
            columns={styledColumns}
            rows={localRows}
            onCellClick={({row, column}: any, event: any) => {
                setActiveCol(column.key);
            }}
        />
    );
}
