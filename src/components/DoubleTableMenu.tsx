import React, { Component, useState, useEffect, useReducer, useRef, useLayoutEffect } from "react";
import { createPortal } from 'react-dom';
import { tableDf } from "./staticData";
import { propsToCommands, requestDf } from "./utils";
import DataGrid from 'react-data-grid';
import { columns, rows } from "./staticData";
import _ from 'lodash';

export type Direction = 'ltr' | 'rtl';
export interface Props {
  direction: Direction;
}

function rowKeyGetter(row: any) {
  return row.index;
}


export default function DoubleTableMenu2() {

  const row1:Record<string,any> = {}
  columns.map((col:any) => {row1[col.key] = "false"})
  const [columnSelectRows, setColumnSelect] = useState([row1])

  const commandsColumns = [{key:"fillna", name:"fillna-name"}, {key:"drop", name:"drop-name"}]
  const commandRows = [{fillna:"false", drop:"false"}]
  
  const [generatedCommands, setGeneratedCommands] = useState([])
  
  return (
    <div className="TableColumnsMenu" style={{padding:"0 10px 0 0", width:"100%"}}>
      <DataGrid style={{height:"150px"}}
        columns={columns}
         rows={columnSelectRows}
        //@ts-ignore
        onCellClick={({ row, column }:any, event:any) => {
	  console.log("column", column.name);
	  const tempRow = _.clone(columnSelectRows[0])
	  const oldVal = tempRow[column.key]
	  tempRow[column.key] = oldVal == "false" ? "true": "false"
	  setColumnSelect([tempRow])
        }}
      />
    <DataGrid style={{height:"150px"}}
        columns={commandsColumns}
        rows={commandRows}
    onCellClick={({ row, column }:any, event:any) => {
	  console.log("column", column.name);
          // add to generated commands
	  const tempRow = _.clone(columnSelectRows[0])
	  const oldVal = tempRow[column.key]
	  tempRow[column.key] = oldVal == "false" ? "true": "false"
	  setColumnSelect([tempRow])
        }}
    />

    </div>
  );
}

