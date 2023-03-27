import React, { Component, useState, useEffect, useReducer, useRef, useLayoutEffect } from "react";
import _ from 'lodash';
import DataGrid from 'react-data-grid';
import { bakedCommands, defaultCommandConfig } from './CommandUtils'
import { CommandDetail, CommandAdder } from './CommandDetail'
//@ts-ignore
export const CommandViewer = ({commands, setCommands, activeColumn, allColumns}) => {

  //@ts-ignore
  const rowElements = _.map(Array.from(commands.entries()), ([index, element]) => {
    const name = element[0]['symbol']
    const key =  name+index.toString()
    const rowEl: Record<string, any> = {}
    rowEl[key] = element[2]
    return rowEl
  })
  const rows = [_.merge({}, ...rowElements)]

  //@ts-ignore
  const commandObjs = _.map(Array.from(commands.entries()), ([index, element]) => {
    const name = element[0]['symbol']
    const key =  name + index.toString()
    const rowEl: Record<string, any> = {}
    rowEl[key] = element
    return rowEl
  })
  const commandDict = _.merge({}, ...commandObjs)

  //@ts-ignore
  const idxObjs = _.map(Array.from(commands.entries()), ([index, element]) => {
    const name = element[0]['symbol']
    const key =  name + index.toString()
    const rowEl: Record<string, any> = {}
    rowEl[key] = index
    return rowEl
  })
  const keyToIdx = _.merge({}, ...idxObjs)

  const [activeKey, setActiveKey] = useState(null)

  const getColumns = (passedCommands:any[]) => _.map(Array.from(passedCommands.entries()), ([index, element]) => {
    const name = element[0]['symbol']
    const key =  name+index.toString()
    const column = {key, name, width:20, maxWidth:60}
    return column
  })

  const columns = getColumns(commands)

  function getSetCommand(key:any) {
    return (newCommand:any) => {
    const index = keyToIdx[key]
    //@ts-ignore
    const nextCommands = commands.map((c, i) => {
      if (i === index) {
        return newCommand
      } else {
        return c;
      }
    });
    setCommands(nextCommands);
    }
  }

  function getDeleteCommand(key:any) {
    return (newCommand:any) => {
      const index = keyToIdx[key]
      //@ts-ignore
      const nextCommands = commands.map((c, i) => {
	if (i === index) {
          return undefined
	} else {
          return c;
	}
      });
      setActiveKey(null)
      setCommands(_.filter(nextCommands));
    }
  }

  const addCommand = (newCommand:any) => {
    const newCommandArr = [...commands, newCommand]
    setCommands(newCommandArr)
    const newCommandKey = getColumns(newCommandArr)[newCommandArr.length-1].key
    //@ts-ignore
    setActiveKey(newCommandKey)
  }

  const [commandConfig, setCommandConfig ] = useState(defaultCommandConfig)

  useEffect(() => {
    fetch('http://localhost:5000/dcf/command-config')
      .then(async (response) => {
	setCommandConfig(await response.json())
      })
  }, []);


  const {commandPatterns, commandDefaults} = commandConfig;

  return (<div className="command-viewer">
    <CommandAdder column={activeColumn} addCommandCb={addCommand} commandDefaults={commandDefaults} />
      <div className="command-box">
        <h4> Commands </h4>
        <DataGrid style={{width:"1200px", height:"80px"}}
          //@ts-ignore
          columns={columns}
          rows={rows}
          onCellClick={({ row, column }:any, event:any) => {
            console.log("column", column.key);
            // add to generated commands
	    const tempRow = _.clone(rows[0])
	    const oldVal = tempRow[column.key]
	    tempRow[column.key] = oldVal == "false" ? "true": "false"
            //@ts-ignore
	    setActiveKey(column.key)
          }}/>
      </div>
      { activeKey && <CommandDetail command={commandDict[activeKey]}
                                    setCommand={getSetCommand(activeKey)}
                                    deleteCB={getDeleteCommand(activeKey)}
	                            columns={allColumns}
                                    commandPatterns={commandPatterns}   
	/> }
    </div>)
}

export const Commands = ()=> {
  const [c, setC] = useState(bakedCommands)
  return (<div style={{width:"100%", height:"100%"}}>
    <CommandViewer commands={c} setCommands={setC} 
	  activeColumn={'new-column2'}
	  allColumns={['foo-col', 'bar-col', 'baz-col']} />
    <code style={{fontSize:"1em", textAlign:"left"}}> {JSON.stringify(c, null, "\t\n\r")} </code>
    </div>)
}
