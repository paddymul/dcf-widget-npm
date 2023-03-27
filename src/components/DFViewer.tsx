import 'react-data-grid/lib/styles.css';
import React, {Component, useState, useEffect} from 'react';
import _ from 'lodash';
import DataGrid, {Column, CellClickArgs} from 'react-data-grid';
import {convertTableDF, DFWhole, EmptyDf} from './staticData';

const updateAtMatch = (
    cols: Column<unknown, unknown>[],
    key: string,
    subst: Record<string, string>
) => {
    const retColumns = cols.map((x) => {
        if (x.key === key) {
            return {...x, ...subst};
        } else {
            return x;
        }
    });
    return retColumns;
};

export type setColumFunc = (newCol: string) => void;
export type StyleAnalogue = Record<string, string | number>;

export function DFViewer(
    {
        df,
        style,
        activeCol,
        setActiveCol
    }: {
        df: DFWhole;
        style?: StyleAnalogue;
        activeCol?: string;
        setActiveCol?: setColumFunc;
    } = {
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
            onCellClick={({row, column}, event) => {
                if (
                    setActiveCol === undefined ||
                    column === undefined ||
                    column.key === undefined
                ) {
                    return;
                } else {
                    setActiveCol(column.key);
                }
            }}
        />
    );
}
