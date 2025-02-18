// import 'ag-grid-enterprise';
import {
  CellClassParams,
  CellKeyDownEvent,
  ColDef,
  FullWidthCellKeyDownEvent,
  GridApi,
  RowClickedEvent
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import { LicenseManager } from 'ag-grid-enterprise';
import {
  AgGridReact,
  CustomCellEditorProps,
  CustomCellRendererProps
} from 'ag-grid-react';
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import ColumnEditorWrapper from './ColumnEditorWrapper';
import ColumnWrapper from './ColumnWrapper';
import './ag-grid.scss';
import { TAGGrid, TGridColumn, TRowDefaultType } from './types';
import useAgGridHook from './useAGGridHook';
import.meta.env.REACT_APP_AG_GRID_KEY &&
  LicenseManager.setLicenseKey(import.meta.env.REACT_APP_AG_GRID_KEY);



function Grid<RowType = TRowDefaultType>(
  props: TAGGrid<RowType>,
  ref: any
): JSX.Element {
  const {
    data,
    contextMenu = [],
    loading,
    rowSelection = 'single',
    getRowClass,
    rowKey = '',
    editType = 'fullRow',
    onCellDoubleClicked,
    onRowSelected,
    getContextMenuItems,
    onRowEditingStopped,
    onRowEditingStarted,
    onRowValueChanged,
    pinnedBottomRowData,
    onCellEditingStopped,
    suppressContextMenu,
    getRowStyle,
    rowGroupPanelShow = 'never',
    onGridReady,
    draggable,
    onCellClicked,
    onCellValueChanged,
    autoGroupColumnDef,
    processCellFromClipboard,
    suppressMovableColumns = false,
    showColumnOptions,
    defaultColDef,
    onCellKeyDown,
    processDataFromClipboard,
    onFilterModified,
    onRowClicked,
    onCellEditingStarted,
    treeData = false,
    getDataPath,
    groupDisplayType,
    excludeChildrenWhenTreeDataFiltering,
    suppressDragLeaveHidesColumns,
    icons,
    gridType,
    debounceVerticalScrollbar = false,
    initialState = null,
    groupDefaultExpanded,
    suppressGroupRowsSticky,
    onRowDataUpdated,
    onFirstDataRendered,
    ...rest
  } = props;
  const rootRef = useRef(null);
  const gridRef = useRef<AgGridReact<RowType> | null>(null);
  const nodeRef = useRef<HTMLDivElement>();

  const getAPI = () => {
    return gridRef.current?.api;
  };

  useImperativeHandle(
    ref,
    () => ({
      setGridRow: (selectedId: number) => {
        const node = (gridRef?.current?.api as GridApi<RowType>).getRowNode(
          selectedId + ''
        );
        if (node) {
          const rowIndex = node.rowIndex;
          gridRef?.current?.api?.ensureIndexVisible(rowIndex || 0, 'middle');
          const allColumn = gridRef.current?.api.getAllGridColumns();
          const firstColumn = allColumn ? allColumn[0] : null;
          firstColumn &&
            gridRef.current?.api.setFocusedCell(rowIndex || 0, firstColumn);
          firstColumn &&
            gridRef?.current?.api?.ensureColumnVisible(firstColumn, 'end');
          onRowClicked &&
            onRowClicked({ data: node.data, node } as RowClickedEvent<
              RowType,
              any
            >);
        }
      },
      setGridRowEditable: (rowIndex: number, colKey: string) => {
        colKey &&
          rowIndex !== null &&
          (gridRef?.current?.api as GridApi<RowType>)?.startEditingCell({
            colKey: colKey || '',
            rowIndex: rowIndex
          });
      },
      stopEditing: (params = false) => {
        (gridRef?.current?.api as GridApi<RowType>)?.stopEditing(params);
      },
      getCheckedRows: () => {
        return (gridRef?.current?.api as GridApi<RowType>)?.getSelectedRows();
      },
      clearAllFilter: () => {
        return (gridRef?.current?.api as GridApi<RowType>)?.setFilterModel(
          null
        );
      },
      getGridNodeById: (id: number) => {
        return (gridRef?.current?.api as GridApi<RowType>).getRowNode(id + '');
      },
      api: getAPI()
    }),
    [onRowClicked, gridRef, getAPI]
  );
  const {
    handleRowPost,
    isCompactGrid,
    cellEditingStarted,
    handleColumnWidthUpdated,
    localeText,
    onColumnPositionShuffle,
    destroyed,
    handleNodeTopDrop,
    handleNodeDrop,
    handleGridReady,
    columns,
    getAgGridMenuItems,
    handleSortChanged,
    handleFilterChanged,
    getCustomContextMenuItems,
    handleColumnVisibleCases,
    suppressKeyboardEvent,
    handleOnPasteStart,
    handleCellContextMenu,
    handleRowClicked,
    handleGetRowId,
    handleStateUpdated,
    handleProcessCellFromClipboard,
    handleProcessDataFromClipboard,
    handleSelectionChanged,
    handleCellDoubleClicked,
    handleRowHeight,
    handleClickAway,
    handleDoubleRowClicked,
    handleColumnEverythingChanged,
    handleModelUpdated,
    setGridRowEditable,
    handleColumnMenuVisibleChanges,
    gridColumnState
  } = useAgGridHook<RowType>({ ...props, gridRef });


  const convertValidValue = (value: string) => {
    if (typeof value === 'string') {
      return value
        ?.replaceAll('\n', '')
        ?.replaceAll('\r', '')
        ?.replaceAll(/\s/g, '');
    }
    return value;
  };
  const handleCellKeyDown = (
    event: CellKeyDownEvent<RowType> | FullWidthCellKeyDownEvent<RowType>
  ): void => {
    onCellKeyDown && onCellKeyDown(event);
  };
  const getUpdatedColumn = useCallback((col, i) => {
    let columnWidth = col.width
    const newColumn: TGridColumn<RowType> = {
      ...col,
      colId: col.field,
      mainMenu: getAgGridMenuItems,
      headerName: `${col?.headerName as string} ${col?.showCurrency ? col.currencyType : ''
        }`,
      cellClass: (params: CellClassParams) =>
        `col-${col.field} OzNumber-${params?.data?.OzNumber} ${params.rowIndex
        }-rowKey grid-column ${col.field}-${convertValidValue(params?.value)} ${col.checkboxSelection ? 'ag-checkbox-selection' : ''
        }`,
      minWidth: col.minWidth || 60,
      hide: !col.visible,
      width: columnWidth,
      suppressMovable: col?.fixed,
      wrapText: false,
      isNumeric: !!col?.isNumeric,
      isOnlyNumeric: !!col?.isOnlyNumeric,
      isOzNumber: !!col?.isOzNumber,
      headerTooltip: `${col?.headerName as string} ${col?.showCurrency ? col.currencyType : ''
        }`,
      showThousandSeperator: !!col?.showThousandSeperator,
      lockPinned: false,
      mainMenuItems: col?.mainMenuItems
        ? col?.mainMenuItems
        : getAgGridMenuItems,
      autoHeight: false,
      tooltipValueGetter: (params) => {
        if (col?.tooltipValueGetter) {
          return col?.tooltipValueGetter(params);
        } else if (params.valueFormatted) {
          return params.valueFormatted;
        } else {
          return params.value;
        }
      },
      cellRenderer: (param: CustomCellRendererProps) => {
        const colId = param.column?.getColId();
        return (
          <ColumnWrapper<RowType>
            showDragIcon={
              i === 0 &&
              draggable &&
              col?.showDragIcon &&
              col?.showDragIcon(param)
            }
            alignment={col?.alignment || 'left'}
            isCompactGrid={isCompactGrid as boolean}
            data={param.data}
            setGridRowEditable={setGridRowEditable}
            rowIndex={param.node.rowIndex}
            checkboxSelection={col.checkboxSelection}
            handleNodeTopDrop={handleNodeTopDrop}
            handleNodeDrop={handleNodeDrop}
            node={param.node}
            colId={colId || ''}
            eGridCell={param.eGridCell}
          >
            {typeof col.cellRenderer === 'function'
              ? col.cellRenderer(param)
              : typeof col.cellRenderer === 'string'
                ? col.cellRenderer
                : param.valueFormatted || param.value || ''}
          </ColumnWrapper>
        );
      },
      cellEditor: (param: CustomCellEditorProps) => {
        return (
          <ColumnEditorWrapper node={param?.node} params={undefined}>
            {typeof col.cellEditor === 'function'
              ? col.cellEditor(param)
              : null}
          </ColumnEditorWrapper>
        );
      },
      sortingOrder: col.sortingOrder || ['desc', 'asc', null],
      menuTabs: col.menuTabs ? col.menuTabs : ['filterMenuTab'],
      suppressHeaderFilterButton:
        col.suppressHeaderFilterButton === false ? false : true
    };
    return newColumn;
  }, [draggable, gridType, isCompactGrid, setGridRowEditable]);

  const updatedColumn: ColDef<RowType>[] = useMemo(() => {
    return columns.map((col, i) => {
      const newColumn = getUpdatedColumn(col, i);
      newColumn.cellRenderer =
        col.field === 'expandable' ? col.cellRenderer : newColumn.cellRenderer;
      delete newColumn['alignment'];
      newColumn.children =
        newColumn?.children?.length > 0
          ? newColumn.children.map(getUpdatedColumn)
          : undefined;
      return newColumn;
    });
  }, [
    columns
  ]);
  if (destroyed) {
    return <></>;
  }

  const CustomNoRowsOverlay = React.memo(() => (
    <div className="custom-no-rows-overlay">
      <p>{'NoRowsToShow'}</p>
    </div>
  ));

  return (
    <div className="ag-grid">
      <div
        className={`ag-theme-alpine${isCompactGrid ? ' compact compactGrid' : ''
          } ag-drop-zone-section`}
        id="drop-zone"
        ref={rootRef}
      >
        <AgGridReact<RowType>

          getRowId={handleGetRowId}
          ref={gridRef}
          initialState={initialState}
          groupDefaultExpanded={groupDefaultExpanded}
          editType={editType}
          processRowPostCreate={handleRowPost}
          suppressDragLeaveHidesColumns={suppressDragLeaveHidesColumns || false}
          suppressContextMenu={suppressContextMenu}
          suppressGroupRowsSticky={suppressGroupRowsSticky}
          onGridReady={handleGridReady}
          onRowClicked={handleRowClicked}
          onCellContextMenu={handleCellContextMenu}
          onCellDoubleClicked={handleCellDoubleClicked}
          rowSelection={rowSelection}
          suppressRowHoverHighlight={true}
          rowData={data}
          getRowClass={getRowClass}
          suppressCutToClipboard={true}
          suppressRowClickSelection={true}
          onCellEditingStarted={
            onCellEditingStarted ? onCellEditingStarted : cellEditingStarted
          }
          rowBuffer={5}
          // suppressColumnVirtualisation
          debounceVerticalScrollbar={debounceVerticalScrollbar}
          suppressClickEdit={true}
          defaultColDef={{
            ...defaultColDef,
            cellDataType: false,
            suppressKeyboardEvent,
            initialHide: true
          }}
          onRowDataUpdated={onRowDataUpdated}
          onRowDoubleClicked={handleDoubleRowClicked}
          animateRows={false}
          onSortChanged={handleSortChanged}
          onFilterChanged={handleFilterChanged}
          rowGroupPanelShow={rowGroupPanelShow}
          autoGroupColumnDef={autoGroupColumnDef}
          onCellValueChanged={onCellValueChanged}
          onColumnResized={handleColumnWidthUpdated}
          localeText={localeText}
          loading={loading}
          suppressCopyRowsToClipboard={true}
          onRowValueChanged={onRowValueChanged}
          onRowEditingStopped={onRowEditingStopped}
          onRowEditingStarted={onRowEditingStarted}
          reactiveCustomComponents
          onCellEditingStopped={onCellEditingStopped}
          onRowSelected={onRowSelected}
          onCellClicked={onCellClicked}
          processCellFromClipboard={handleProcessCellFromClipboard}
          getContextMenuItems={getCustomContextMenuItems}
          pinnedBottomRowData={pinnedBottomRowData}
          getRowStyle={getRowStyle}
          getRowHeight={handleRowHeight}
          icons={icons}
          groupDisplayType={groupDisplayType || 'singleColumn'}
          rowDragManaged={false}
          columnMenu={'new'}
          treeData={treeData}
          getDataPath={getDataPath}
          excludeChildrenWhenTreeDataFiltering={
            excludeChildrenWhenTreeDataFiltering
          }
          onColumnMoved={onColumnPositionShuffle}
          onColumnVisible={handleColumnVisibleCases}
          columnDefs={updatedColumn}
          suppressMultiSort={true}
          onSelectionChanged={handleSelectionChanged}
          suppressAnimationFrame
          suppressClipboardPaste
          enableBrowserTooltips
          suppressMovableColumns={suppressMovableColumns}
          onCellKeyDown={handleCellKeyDown}
          getMainMenuItems={getAgGridMenuItems}
          onColumnEverythingChanged={handleColumnEverythingChanged}
          onModelUpdated={handleModelUpdated}
          onColumnMenuVisibleChanged={handleColumnMenuVisibleChanges}
          onFirstDataRendered={onFirstDataRendered}
          headerHeight={isCompactGrid ? 27 : 48}
          groupHeaderHeight={isCompactGrid ? 27 : 48}
        // onStateUpdated={handleStateUpdated}
        />
      </div>
    </div>
  );
}
export default forwardRef(Grid);
