import React, {Component, useState, useRef, useEffect, useLayoutEffect, useCallback, CSSProperties} from 'react';
import _ from 'lodash';
import {updateAtMatch, dfToAgrid} from './gridUtils';
import {AgGridReact} from 'ag-grid-react'; // the AG Grid React Component
import {
    ColDef,
    Grid,
    GridOptions,
    GridColumnsChangedEvent,
    GridReadyEvent
} from 'ag-grid-community';

// import '../../css/ag-alpine-theme-local.scss'
// import '../npm-styles.scss';
// import '../tight-grid.css';
export type setColumFunc = (newCol: string) => void;



const columnDefs: ColDef[] = [
    {field: 'totalRows' },
    {field: 'columns' },
    {field: 'rowsShown' },
    {field: 'sampleSize'},
    {field: 'summaryStats'},
    {field: 'reorderdColumns'}
];


export function StatusBar(
    {
	totalRows,
	columns,
	rowsShown,
	sampleSize,
	summaryStats,
	reorderdColumns
    }: {
	totalRows:number;
	columns:number;
	rowsShown:number;
	sampleSize:number;
	summaryStats:boolean;
	reorderdColumns:boolean;
    }
) {

    const rowData = [{
	totalRows,
	columns,
	rowsShown,
	sampleSize,
	summaryStats:summaryStats.toString(),
	reorderdColumns:reorderdColumns.toString()
    }];
    // const styledColumns = updateAtMatch(
    //     _.clone(agColsPure),
    //     activeCol || '___never',
    //     {
    //         cellStyle: {background: 'var(--ag-range-selection-background-color-3)'}
    //     },
    //     {cellStyle: {}}
    // );

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
    const gridRef = useRef<AgGridReact<unknown>>(null);
    const defaultColDef= {
	type: 'leftAligned',
	cellStyle: {'text-align':'left'}
    };
    return (
        <div className='statusBar'>
            <div style={{height: 50, width: 2500}} className='theme-hanger ag-theme-alpine-dark'>
                <AgGridReact
                    ref={gridRef}
        gridOptions={gridOptions}
	defaultColDef={defaultColDef}
                    rowData={rowData}
                    columnDefs={columnDefs}
                ></AgGridReact>
            </div>
        </div>
    );
}

export function StatusBarEx() {

    return <StatusBar
    totalRows={1309}
    columns={30}
    rowsShown={500}
    sampleSize={10_000}
    summaryStats={false}
    reorderdColumns={true}
	/>
}






export const  DictView = ({fullDict}) => {
        return (<Table>
                  <tr><th>foo</th><th>bar</th><th>baz</th></tr>
                  <tr><td>{fullDict['foo']}</td><td>{fullDict['bar']}</td><td>{fullDict['baz']}</td></tr>
                </Table>);
    }








