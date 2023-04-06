import 'react-data-grid/lib/styles.css';
import React, {Component, useState, useEffect} from 'react';
import _ from 'lodash';
import DataGrid, {Column, CellClickArgs} from 'react-data-grid';
import {convertTableDF, DFWhole, DFColumn, EmptyDf} from './staticData';
import {AgGridReact} from 'ag-grid-react'; // the AG Grid React Component
import {ColDef, Grid, GridOptions} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const updateAtMatch = (cols: ColDef[], key: string, subst: Partial<ColDef>, negative:Partial<ColDef>) => {
    const retColumns = cols.map((x) => {
        if (x.field === key) {
            return {...x, ...subst};
        } else {
            return {...x, ...negative};
        }
    });
    return retColumns;
};

export type setColumFunc = (newCol: string) => void;
export type StyleAnalogue = Record<string, string | number>;


export function dfToAgrid(tdf: DFWhole): [ColDef[], unknown[]] {
    const fields = tdf.schema.fields;
    const retColumns = fields.map((f: DFColumn) => {
        return {field: f.name};
    });
    return [retColumns, tdf.data];
}

const columnDefs: ColDef[] = [
    {field: 'make', filter: true},
    {field: 'model', filter: true, cellStyle: {background: 'green'}},
    {field: 'price'}
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
    const [agColsPure, agData] = dfToAgrid(df);
    
    const styledColumns = updateAtMatch(_.clone(agColsPure), activeCol || '___never', {
        cellStyle: {background: 'green'}
    }, {cellStyle:{}} );

    //console.log("styledColumns after updateAtMatch", activeCol, styledColumns)
    const gridOptions: GridOptions = {
        rowSelection: 'single',
        onRowClicked: (event) => console.log('A row was clicked'),
        onCellClicked: (event) => {
            const colName = event.column.getColId()
            if (
                setActiveCol === undefined ||
                colName === undefined
            ) {
                return;
            } else {
                setActiveCol(colName);
            }
        }
    };
    return (
        <div style={{height: 500, width: 600}} className='ag-theme-alpine'>
            <p> {activeCol}</p>
            <AgGridReact
                gridOptions={gridOptions}
                rowData={agData}
                columnDefs={styledColumns}
            ></AgGridReact>
        </div>
    );
}
