import React, {
    Component,
    useState,
    useRef,
    useEffect,
    useLayoutEffect,
    useCallback,
    CSSProperties
} from 'react';
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

export type setColumFunc = (newCol: string) => void;

export interface DfConfig {
    totalRows: number;
    columns: number;
    rowsShown: number;
    sampleSize: number;
    summaryStats: boolean;
    reorderdColumns: boolean;
}

const columnDefs: ColDef[] = [
    {field: 'totalRows'},
    {field: 'columns'},
    {field: 'rowsShown'},
    {field: 'sampleSize'},
    {field: 'summaryStats'},
    {field: 'reorderdColumns'}
];

// export function StatusBar({config:DfConfig,
// 			   setConfig:unknown}) {
export function StatusBar({config, setConfig}) {
    const {totalRows, columns, rowsShown, sampleSize, summaryStats, reorderdColumns} = config;

    const rowData = [
        {
            totalRows,
            columns,
            rowsShown,
            sampleSize,
            summaryStats: summaryStats.toString(),
            reorderdColumns: reorderdColumns.toString()
        }
    ];
    // const styledColumns = updateAtMatch(
    //     _.clone(agColsPure),
    //     activeCol || '___never',
    //     {
    //         cellStyle: {background: 'var(--ag-range-selection-background-color-3)'}
    //     },
    //     {cellStyle: {}}
    // );

    //console.log("styledColumns after updateAtMatch", activeCol, styledColumns)
  const coreUpdate = () => {
	    const origSummaryStats = config.summaryStats;
	    const newSummaryStats = !origSummaryStats
	    console.log("origSummaryStats", origSummaryStats, "newSummaryStats", newSummaryStats);
	    const newConfig = _.clone({...config, 'summaryStats':newSummaryStats,
				       'rowsShown': config.rowsShown + 1
				      });
	    console.log("newConfig", newConfig)
	    setConfig(newConfig)
  }
  const updateDict = (event) =>  {
          const colName = event.column.getColId();
	  if (colName == "summaryStats") {
	    coreUpdate()
	  }
        }
    const gridOptions: GridOptions = {
        rowSelection: 'single',
        //onRowClicked: (event) => console.log('A row was clicked'),

    };

    const gridRef = useRef<AgGridReact<unknown>>(null);
    const defaultColDef = {
        type: 'left-aligned',
        cellStyle: {'textAlign': 'left'}
    };
    return (
        <div className='statusBar'>
	<button onClick={coreUpdate}>outside click</button>
            <div style={{height: 50, width: 2500}} className='theme-hanger ag-theme-alpine-dark'>

                <AgGridReact
                    ref={gridRef}
      onCellClicked={ updateDict}
                    gridOptions={gridOptions}
                    defaultColDef={defaultColDef}
                    rowData={rowData}
                    columnDefs={columnDefs}
                ></AgGridReact>
            </div>
        </div>
    );
}

function StatusPairWrapper({config, setConfig}) {
  console.log("statusPairWrapper config.summaryStats", config.summaryStats);
    return (
        <div>
            <StatusBar config={config} setConfig={setConfig} />
        </div>
    );


}
export function StatusBarEx() {
    const [sampleConfig, setConfig] = useState<DfConfig>({
        totalRows: 1309,
        columns: 30,
        rowsShown: 500,
        sampleSize: 10_000,
        summaryStats: false,
        reorderdColumns: false
    });

  return (<StatusPairWrapper config={sampleConfig} setConfig={setConfig} />)
}

export const DictView = ({fullDict}) => {
    return (
        <table>
            <tr>
                <th>foo</th>
                <th>bar</th>
                <th>baz</th>
            </tr>
            <tr>
                <td>{fullDict['foo']}</td>
                <td>{fullDict['bar']}</td>
                <td>{fullDict['baz']}</td>
            </tr>
        </table>
    );
};
