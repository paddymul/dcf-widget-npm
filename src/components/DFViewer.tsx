import React, {Component, useState, useEffect} from 'react';
import _ from 'lodash';
import {DFWhole, DFColumn, EmptyDf} from './staticData';
import {updateAtMatch, dfToAgrid} from './gridUtils';
import {AgGridReact} from 'ag-grid-react'; // the AG Grid React Component
import {ColDef, Grid, GridOptions} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
// import '../../css/ag-alpine-theme-local.scss'
// import '../npm-styles.scss';

export type setColumFunc = (newCol: string) => void;
export type StyleAnalogue = Record<string, string | number>;

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

    const styledColumns = updateAtMatch(
        _.clone(agColsPure),
        activeCol || '___never',
        {
            cellStyle: {background: 'green'}
        },
        {cellStyle: {}}
    );

    //console.log("styledColumns after updateAtMatch", activeCol, styledColumns)
    const gridOptions: GridOptions = {
        rowSelection: 'single',
        onRowClicked: (event) => console.log('A row was clicked'),
        onCellClicked: (event) => {
            const colName = event.column.getColId();
            if (setActiveCol === undefined || colName === undefined) {
                return;
            } else {
                setActiveCol(colName);
            }
        }
    };
    /*             <div style={{height: 500, width: 1000}} className='ag-alpine-theme-local df-grid'> */
    return (
        <div className='df-viewer'>
            <div style={{height: 500, width: 1000}} className='ag-theme-alpine-dark'>
                <AgGridReact
                    gridOptions={gridOptions}
                    rowData={agData}
                    columnDefs={styledColumns}
                ></AgGridReact>
            </div>
        </div>
    );
}
