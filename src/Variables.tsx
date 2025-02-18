import { Button, Paper } from '@mui/material'
import VariablesGrid from './VariableGrid'

export default function Variables({
  showWindow, setShowWindow
}: { showWindow: boolean, setShowWindow: (status: boolean) => void }) {
  return (
    <main id="main" className="main-wrapper">
      <Paper className="p-3 paper">
        <Button onClick={() => {
          setShowWindow(true)
        }} variant="contained">Open in New Window</Button>
        <div className="address-table-wrapper fixed-header-grid variable-grid">
          <div className="ag-grid">

            {showWindow ? <h1> Grid Opened in New Window</h1> : <VariablesGrid />}
          </div>
        </div>
      </Paper>
    </main >
  )
}
