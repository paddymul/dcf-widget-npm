import 'react-data-grid/lib/styles.css';
import React, {Component, useState, useEffect} from 'react';
import _ from 'lodash';
import DataGrid, {Column, CellClickArgs} from 'react-data-grid';
import {convertTableDF, DFWhole, DFColumn, EmptyDf} from './staticData';
import {AgGridReact} from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

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


export const dfToAgrid = (tdf: DFWhole) => {
    const fields = tdf.schema.fields;
    const retColumns = fields.map((f: DFColumn) => {
        return {field: f.name};
    });
    return [retColumns, tdf.data];
};

const columnDefs = [
    {field: 'make', filter: true},
    {field: 'model', filter: true},
    {field: 'price'}
];

const rowData = [
    {make: 'Toyota', model: 'Celica', price: 35000},
    {make: 'Ford', model: 'Mondeo', price: 32000},
    {make: 'Porsche', model: 'Boxster', price: 72000}
];


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
    // const [localColumns, localRows] = convertTableDF(df);
    // const localStyle = style;
    // const styledColumns = updateAtMatch(localColumns, activeCol || '___never', {
    //     cellClass: 'activeCol'
    // }) as Column<unknown>[];
    const [agCols, agData] = dfToAgrid(df);
/*            <AgGridReact rowData={agData} columnDefs={agCols}></AgGridReact>*/    
/* <AgGridReact rowData={rowData} columnDefs={columnDefs}></AgGridReact>*/
    return (
        <div style={{height:500, width:600}} className="ag-theme-alpine">
            <AgGridReact rowData={agData} columnDefs={agCols}></AgGridReact>

        </div>
    );
}

// export const convertTableDF = (tdf: DFWhole): [Column<unknown>[], DFData] => {
//     const fields = tdf.schema.fields;
//     const retColumns = fields.map((f: DFColumn) => {
//         return {key: f.name, name: f.name};
//     });
//     return [retColumns, tdf.data];
// };


/*
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
  */
