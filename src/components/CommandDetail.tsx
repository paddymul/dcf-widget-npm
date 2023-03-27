import React, { Component, useState, useEffect, useReducer, useRef, useLayoutEffect } from "react";
import _ from 'lodash';
import DataGrid from 'react-data-grid';
import { sym, bakedCommands, ActualArg, ArgSpec, defaultCommandPatterns } from './CommandUtils'

const nullSetter = ()=> 5

const replaceInArr = (arr:any[], old:any, subst:any) => {
  return arr.map((item:any) => item === old ? subst : item)
}

const replaceAtIdx = (arr:any[], idx:number, subst:any) => {
  return arr.map((item:any, innerIdx:number) => innerIdx === idx? subst : item)
}

const replaceAtKey = (obj:Record<string, any>, key:string, subst:any) => {
  const objCopy = _.clone(obj)
  objCopy[key] = subst
  return objCopy
}


const objWithoutNull = (obj:Record<string, any>, extraStrips:any[]=[]) =>
  _.pickBy(obj, (x) => ![null, undefined].includes(x))




//@ts-ignore
export const CommandDetail = ({command, setCommand, deleteCB, columns, commandPatterns}) => {
  const commandName = command[0]['symbol']
  const pattern = commandPatterns[commandName]
  
  if (! _.isArray(pattern)){
    //we shouldn't get here
    return <h2>unknown command {commandName}</h2>
  } else if (_.isEqual(pattern, [null])) {
    return <div className="command-detail"><h4>no arguments</h4><button onClick={deleteCB}>X</button></div>
  } else {
    const fullPattern = pattern as ActualArg[]
    return (<div className="command-detail">
      <ArgGetters command={command} fullPattern={fullPattern} setCommand={setCommand} columns={columns}
	    deleteCB={deleteCB}
      />
      </div>)
  }
  return <h2></h2>
}

//@ts-ignore
export const ArgGetters = (
  {command, fullPattern, setCommand, columns, deleteCB}:
  {command:any, fullPattern:ActualArg[], setCommand:any
   columns:string[], deleteCB:any}) => {
    const makeArgGetter = (pattern:ActualArg) => {
      const idx = pattern[0]
      const val = command[idx]
      const valSetter = (newVal:any) => {
	const newCommand = replaceAtIdx(command, idx, newVal)
	console.log("newCommand", newCommand)
	setCommand(newCommand)
      }
      return (<ArgGetter argProps={pattern} val={val} setter={valSetter}
	      columns={columns} />)
    }
    return (<div className="arg-getters">
      <button onClick={deleteCB}>X</button>
      {fullPattern.map(makeArgGetter)}
	    </div>)
}


//@ts-ignore
const ArgGetter = (
  {argProps, val, setter, columns}:
  {argProps:ActualArg, val:any, setter:any, columns:string[]}
) => {
  //@ts-ignore
  const [argPos, label, argType, lastArg] = argProps

  const defaultShim = (event:any) => setter(event.target.value)
  if (argType === 'enum') {
    return (<fieldset>
      <label> {label} </label>
      <select defaultValue={val} onChange={defaultShim}>
      //@ts-ignore
      {lastArg.map((optionVal:any) => <option key={optionVal} value={optionVal}>{optionVal}</option>)}
	</select>
      </fieldset>)
  }
  else if(argType === 'type') {
    if(lastArg === 'integer'){
      const valSetterShim = (event:any) => setter(parseInt(event.target.value))
      return (<fieldset>
	<label> {label} </label>
	<input type="number" defaultValue={val} step="1" onChange={valSetterShim} />
	</fieldset>)
    } else {
      return (<fieldset>
	<label> {label} </label>
	  <input  value="dont know"/>
	</fieldset>)
    }
  }
  else if (argType === 'colEnum') {
    const widgetRow = columns.map((colName:string) => {
      const colSetter = (event:any) => {
	const newColVal = event.target.value
	const updatedColDict = replaceAtKey(val, colName, newColVal)
	setter(objWithoutNull(updatedColDict, ['null']))
      }
      const colVal = _.get(val, colName, 'null')
      return (<td><select defaultValue={colVal} onChange={colSetter}>
	//@ts-ignore
	{lastArg.map((optionVal:any) => <option key={optionVal} value={optionVal}>{optionVal}</option>)}
	      </select>
	</td>
	)
    })
    
    return (<div className="col-enum"><table>
      <thead><tr>
      {columns.map((colName) => (<th>{colName}</th>))}
	    </tr>
      </thead>
      <tbody>
      <tr>
          {widgetRow} 
	    </tr>
      </tbody>
      </table>
      </div>
      )
  }
  else {
    return <h3> unknown argtype </h3>
  }
}


//@ts-ignore
export const CommandAdder = ({column, addCommandCb, commandDefaults}) => {
  //@ts-ignore
  const addCommandByName = (localCommandName:string) => {
    return () => {
      const defaultCommand = commandDefaults[localCommandName]
      addCommandCb(replaceInArr(defaultCommand, "col", column))
    }
  }

  return (<div className="command-adder">
    <fieldset>
    <button> Column: {column}</button>
      <label> Command Name </label>
	  {_.keys(commandDefaults).map(
	    (optionVal:any) => <button onClick={addCommandByName(optionVal)}> {optionVal} </button> )}
    </fieldset>
    </div>)
}

//@ts-ignore
export const CommandDetailHarness = () => {
      const activeCommand = bakedCommands[0]
  return (<div>
    <CommandDetail command={activeCommand} setCommand={nullSetter} deleteCB={nullSetter}
	  columns={['foo', 'bar', 'baz']}
	  commandPatterns={defaultCommandPatterns}
	  /> 
    </div>)
}

/*


  */
