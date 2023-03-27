import 'react-data-grid/lib/styles.css';
import React, { Component, useState, useEffect } from "react";
import _ from 'lodash';
import DataGrid, {Column} from 'react-data-grid';
import { convertTableDF } from "./staticData";

const updateAtMatch = (cols:Record<string, any>[], key:string, subst:any) => {

  const retColumns = cols.map((x) => {

    if (x.key === key) {
      console.log("x.key", x.key, key)      
      return {...x, ...subst}
    } else {
      return x
    }
  })
  return retColumns
  // const objCopy = _.clone(obj)
  // const orig = _.get(objCopy, key, null)
  // if( orig !== null) {
  //   objCopy[key] = 
  // }
  // return objCopy
}


//@ts-ignore
export function DFViewer(
  {df, style, activeCol, setActiveCol}:
  {df:any, style?:Record<string, any>, activeCol?:string, setActiveCol?:any} =
    {df:{}, style:{height:"300px"}, setActiveCol:()=>null}
) {
  const [localColumns, localRows] = convertTableDF(df)
  //Record<string, string|number>
  const localStyle = style;
  //@ts-ignore
  const styledColumns = updateAtMatch(localColumns, activeCol || '___never' , {cellClass:'activeCol'}) as Column<unknown>[]
  return (
    <DataGrid style={localStyle} columns={styledColumns} rows={localRows}
    onCellClick={({ row, column }:any, event:any) => {
      //@ts-ignore
      setActiveCol(column.key)
        }}
      />
  );
}
