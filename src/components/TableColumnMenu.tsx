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

export default function ContextMenuDemo() {
  const [contextMenuProps, setContextMenuProps] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const menuRef = useRef<HTMLMenuElement | null>(null);
  const isContextMenuOpen = contextMenuProps !== null
  useLayoutEffect(() => {
    if (!isContextMenuOpen) return;
    function onClick(event: MouseEvent) {
      if (event.target instanceof Node && menuRef.current?.contains(event.target)) {
        return;
      }
      setContextMenuProps(null);
    }
    addEventListener('click', onClick);
    return () => {
      removeEventListener('click', onClick);
    };
  }, [isContextMenuOpen]);

//        onCellContextMenu={({ row }:any, event:any) => {
//    onCellClick={({ row, column }:any, event:any) => {
  return (
    <div className="TableColumnsMenu" style={{padding:"0 10px 0 0"}}>
      <DataGrid style={{height:"150px"}}
        columns={columns}
        rows={rows.slice(0,2)}
        //@ts-ignore
        //onCellContextMenu={({ row, column }:any, event:any) => {
        onCellClick={({ row, column }:any, event:any) => {
//	  console.log("row", row);
	  //console.log("column", column);
//	  console.log("event", event);
          //event.preventDefault();
	  console.log("column", column.name);
          setContextMenuProps({
            top: event.clientY,
            left: event.clientX
          });
//	  setContextMenuOpen(true)
//      console.log("after setContextMenuProps")
        }}
      />
      {contextMenuProps !== null &&
        createPortal(
          <menu
            ref={menuRef}
            className="modal"
            style={
              {
                top: contextMenuProps.top,
                left: contextMenuProps.left
              } as unknown as React.CSSProperties
            }
          >
            <li><button
                  onClick={() => {
                    console.log("delete row clicked");
                    setContextMenuProps(null);
                  }}
              >
                Delete Row
              </button>
            </li>
          </menu>,
          document.body
        )}
    </div>
  );
}
