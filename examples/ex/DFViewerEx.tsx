
import {DFViewer, staticData} from 'paddy-react-edit-list';
import React, {Component, useState, useEffect} from 'react';


export default function Simple() {
    const [activeCol, setActiveCol] = useState('tripduration')
    return <DFViewer df={staticData.tableDf} activeCol={activeCol} setActiveCol={setActiveCol} />;
}
