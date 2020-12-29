import React, { useState } from 'react'
import _ from 'lodash'

const MAX_HISTORY = 20

const SyntaxContext = React.createContext()

const SyntaxProvider = (() => {

  const f = (props) => {
    // tree data and selected key
    const [ treeData,           setTreeData           ] = useState([])
    const [ expandedKeys,       setExpandedKeys       ] = useState([])
    const [ selectedKey,        setSelectedKey        ] = useState(null)
    // test data
    const [ testData,           setTestData           ] = useState([])
    // common data
    const [ treeDirty,          setTreeDirty          ] = useState(false)
    const [ livePreview,        setLivePreview        ] = useState(true)
    const [ previewInitialized, setPreviewInitialized ] = useState(false)
    // history
    const [ updateKey, setUpdateKey ] = useState(null)
    const [ history, setHistory ] = useState({
      undo: [],
      current: null,
      redo: [],
    })

    // update action
    const updateAction = (action, newTreeData, newTestData, newExpandedKeys, newSelectedKey, nodeKey) => {

      // console.log('updateAction', action, newTreeData, newExpandedKeys, newSelectedKey, nodeKey)

      setUpdateKey(nodeKey)
      if (nodeKey !== updateKey) {
        makeAction(action, newTreeData, newTestData, newExpandedKeys, newSelectedKey)
        return
      }

      // if node key is same as updateKey
      const newHistory = {
        undo: _.cloneDeep(history.undo),
        current: {
          action: action,
          treeData: newTreeData,
          testData: newTestData,
          expandedKeys: newExpandedKeys,
          selectedKey: newSelectedKey,
        },
        redo: _.cloneDeep(history.redo),
      }

      // update state from record
      setTreeData(newTreeData)
      setTestData(newTestData)
      setExpandedKeys(newExpandedKeys)
      setSelectedKey(newSelectedKey)
      setTreeDirty(true)

      // set history
      setHistory(newHistory)
    }

    // make action
    const makeAction = (action, newTreeData, newTestData, newExpandedKeys, newSelectedKey, fresh=false) => {

      // console.log('makeAction', action, newTreeData, newExpandedKeys, newSelectedKey)

      // if fresh, clear history, and mark record as fresh
      if (!!fresh) {
        // set current
        const newHistory = {
          undo: [],
          current: {
            action: action,
            treeData: newTreeData,
            testData: newTestData,
            expandedKeys: newExpandedKeys,
            selectedKey: newSelectedKey,
            fresh: fresh,
          },
          redo: [],
        }

        // update state from record
        setTreeData(newTreeData)
        setTestData(newTestData)
        setExpandedKeys(newExpandedKeys)
        setSelectedKey(newSelectedKey)
        setTreeDirty(false)

        // set history
        setHistory(newHistory)
        return
      }

      // keep the record
      const record = {
        action: action,
        treeData: !!newTreeData ? newTreeData : treeData,
        testData: !!newTestData ? newTestData : testData,
        expandedKeys: !!newExpandedKeys ? newExpandedKeys : expandedKeys,
        selectedKey: !!newSelectedKey ? newSelectedKey : selectedKey,
      }

      // keep history record, clear redo buffer
      const newHistory = {
        undo: _.cloneDeep(history.undo),
        current: record,
        redo: [],
      }
      // push undo history
      newHistory.undo.push(_.cloneDeep(history.current))

      // keep up to max # of histories
      if (newHistory.undo.length > MAX_HISTORY) {
        newHistory.undo.splice(0, newHistory.undo.length - MAX_HISTORY)
      }

      // update state from action
      setTreeData(record.treeData)
      setTestData(record.testData)
      setExpandedKeys(record.expandedKeys)
      setSelectedKey(record.selectedKey)
      setTreeDirty(true)

      // set history
      setHistory(newHistory)
    }

    // undo
    const undo = () => {
      // console.log('undo')
      if (history.undo.length) {
        // get record for redo
        const newHistory = _.clone(history)
        const record = newHistory.undo.pop()

        // add record to redo history
        newHistory.redo.push(newHistory.current)
        // keep up to max # of histories
        if (newHistory.redo.length > MAX_HISTORY) {
          newHistory.redo.splice(0, newHistory.redo.length - MAX_HISTORY)
        }

        // update current
        newHistory.current = record

        // update state from record
        setTreeData(record.treeData)
        setTestData(record.testData)
        setExpandedKeys(record.expandedKeys)
        setSelectedKey(record.selectedKey)
        setTreeDirty(!record.fresh)

        // set history
        setHistory(newHistory)
      }
    }

    // redo
    const redo = () => {
      // console.log('redo')
      if (history.redo.length) {
        // get record for redo
        const newHistory = _.clone(history)
        const record = newHistory.redo.pop()

        // add record to undo history
        newHistory.undo.push(newHistory.current)
        // keep up to max # of histories
        if (newHistory.undo.length > MAX_HISTORY) {
          newHistory.undo.splice(0, newHistory.undo.length - MAX_HISTORY)
        }

        // update current
        newHistory.current = record

        // update state from record
        setTreeData(record.treeData)
        setTestData(record.testData)
        setExpandedKeys(record.expandedKeys)
        setSelectedKey(record.selectedKey)
        setTreeDirty(!record.fresh)

        // set history
        setHistory(newHistory)
      }
    }

    return (
      <SyntaxContext.Provider
        value={{
          // syntax tree data
          treeData: treeData,
          expandedKeys: expandedKeys,
          setExpandedKeys: setExpandedKeys,
          selectedKey: selectedKey,
          setSelectedKey: setSelectedKey,
          // test data
          testData: testData,
          setTestData: setTestData,
          // common data
          treeDirty: treeDirty,
          setTreeDirty: setTreeDirty,
          livePreview: livePreview,
          setLivePreview: setLivePreview,
          previewInitialized: previewInitialized,
          setPreviewInitialized: setPreviewInitialized,
          // history and actions
          history: history,
          makeAction: makeAction,
          updateAction: updateAction,
          undo: undo,
          redo: redo,
        }}
      >
        {props.children}
      </SyntaxContext.Provider>
    )
  }

  // update Context variable
  f.Context = SyntaxContext

  return f
}) ()

export { SyntaxContext as Context }

export default SyntaxProvider
