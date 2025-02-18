import React from 'react'
import Variables from './Variables'
import WindowPortal from './WindowPortal'
import VariablesGrid from './VariableGrid'

export default function WindowPositionVariable({ setShowWindow, showWindow }) {
    const close = () => {
        setShowWindow(false)
    }
    if (!showWindow) {
        return null
    }
    return (
        <WindowPortal portalKey="variable" title={'Variables'} onClose={close} >
            <VariablesGrid />
        </WindowPortal >
    )
}
