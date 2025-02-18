import { Button, IconButton, Paper } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TPositionVariable } from "./type";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import DeleteIcon from '@mui/icons-material/Delete';
import DATA from './data.json'
import Grid from "./AGGrid/Grid";

function getData() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(DATA)
        }, 2000)
    })
}
function VariablesGrid() {
    const [gridData, setGridData] = useState<TPositionVariable[]>([])
    const [loading, setLoading] = useState(false)
    const getGridData = useCallback(async () => {
        setLoading(true)
        const data = await getData()
        setLoading(false)
        setGridData(data.Variables)
    }, [])

    useEffect(() => {
        getGridData()
    }, [])

    const defaultColumns = useMemo(
        () => [
            {
                field: "Name",
                headerName: "variableName",
                width: 200,
                minWidth: 70,
                sortable: true,
                visible: true,
                suppressHeaderFilterButton: false,
            },
            {
                field: "Formula",
                headerName: "formula",
                width: 220,
                minWidth: 70,
                visible: true,
                suppressHeaderFilterButton: false,
                sortable: true,
                editable: false,
            },
            {
                field: "Value",
                headerName: "result",
                width: 220,
                visible: true,
                minWidth: 70,
                suppressHeaderFilterButton: false,
                sortable: true,
            },

            {
                field: "Description",
                width: 260,
                minWidth: 70,
                headerName: "variableDescription",
                sortable: true,
                visible: true,
                filter: "agTextColumnFilter",
                suppressHeaderFilterButton: false,
                editable: false,
            },
            {
                field: "OzNumber",
                width: 240,
                minWidth: 70,
                suppressHeaderFilterButton: false,
                headerName: "OZNumber",
                sortable: true,
                visible: true,
                suppressColumnsToolPanel: true,
            },
            {
                field: "action",
                width: 100,
                minWidth: 70,
                headerName: "Action",
                filter: false,
                pinned: "right",
                visible: true,
                suppressHeaderContextMenu: true,
                suppressMovable: true,
                suppressColumnsToolPanel: true,
                suppressHeaderMenuButton: true,
                lockPosition: "right",
                cellRenderer: (params) => {
                    const row = params.data;
                    return (
                        <IconButton
                            className="text-center f-color"
                        >
                            <DeleteIcon />
                        </IconButton>
                    );
                }
            },
        ],
        []
    );
    return (
        <div
            className={`ag-theme-alpine ag-drop-zone-section`}
            id="drop-zone"
        >
            <Grid
                data={gridData}
                loading={loading}
                rowKey="SNo"
                columns={defaultColumns}
            />
        </div>

    );
}
export default VariablesGrid;
