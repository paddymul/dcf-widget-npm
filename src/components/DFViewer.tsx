import React, {Component, useState, useRef, useEffect, useCallback, CSSProperties} from 'react';
import _ from 'lodash';
import {DFWhole, DFColumn, EmptyDf} from './staticData';
import {updateAtMatch, dfToAgrid} from './gridUtils';
import {AgGridReact} from 'ag-grid-react'; // the AG Grid React Component
import {ColDef, Grid, GridOptions, GridColumnsChangedEvent,
	GridReadyEvent} from 'ag-grid-community';

// import '../../css/ag-alpine-theme-local.scss'
// import '../npm-styles.scss';
// import '../tight-grid.css';
export type setColumFunc = (newCol: string) => void;

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
        style?: CSSProperties;
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
            cellStyle: {background: 'var(--ag-range-selection-background-color-3)'}
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
    const gridRef = useRef<AgGridReact<unknown>>(null);

    const autoSize = (params: any) => { gridRef.current!.columnApi.autoSizeAllColumns()}
    const onStuffAutosize  = useCallback(autoSize)

    if(_.isEqual(df, EmptyDf)) {
	return (<div className='df-viewer'>
            <div style={{height: 500, width: 2500}} className='theme-hanger ag-theme-alpine-dark'>
  	    </div>
	    </div>)
    }
    
  
    useEffect(() => {
	const timer = setTimeout(() => {
	    onStuffAutosize()
	}, 150);
    return () => clearTimeout(timer);
    }, []);
    return (
        <div className='df-viewer'>
            <div style={{height: 500, width: 2500}} className='theme-hanger ag-theme-alpine-dark'>
	    
            <AgGridReact
	            ref={gridRef}
                    gridOptions={gridOptions}
                    rowData={agData}
                    columnDefs={styledColumns}
                ></AgGridReact>
            </div>
        </div>
    );
}
