import {
  AgGridEvent,
  CellContextMenuEvent,
  CellDoubleClickedEvent,
  CellEditingStartedEvent,
  CellValueChangedEvent,
  Column,
  ColumnEverythingChangedEvent,
  ColumnMenuVisibleChangedEvent,
  ColumnMovedEvent,
  ColumnResizedEvent,
  ColumnVisibleEvent,
  GetContextMenuItemsParams,
  GetMainMenuItemsParams,
  GetRowIdFunc,
  GridApi,
  GridReadyEvent,
  MenuItemDef,
  ModelUpdatedEvent,
  PasteStartEvent,
  ProcessCellForExportParams,
  ProcessDataFromClipboardParams,
  ProcessRowParams,
  RowClickedEvent,
  RowDoubleClickedEvent,
  RowHeightParams,
  SelectionChangedEvent,
  StateUpdatedEvent,
  SuppressKeyboardEventParams
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { first, cloneDeep } from 'lodash';
import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  API,
  COLUMN_MENU,
  GRID_OPTIONS_UPDATED,
  TOOL_PANEL_UI,
  UI_COLUMN_MOVED,
  UI_COLUMN_RESIZED
} from './constants';
import { setColumnVisible } from './gridUtil';
import { AG_GRID_LOCALE_EN } from './locale';
import { TAGGrid, TFilterChangedEvent, TGridColumn } from './types';
const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
const querySelector =
  'a:not([disabled]), button:not([disabled]), input[type=text]:not([disabled]), input:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"]), select';
const GRID_CELL_CLASSNAME = 'ag-cell';
function getAllFocusableElementsOf(el: HTMLElement) {
  return Array.from<HTMLElement>(el.querySelectorAll(querySelector)).filter(
    (focusableEl) => {
      return focusableEl.tabIndex !== -1;
    }
  );
}

const getEventPath: (event: Event) => HTMLElement[] = (event: Event) => {
  const path: HTMLElement[] = [];
  let currentTarget: any = event.target;
  while (currentTarget) {
    path.push(currentTarget);
    currentTarget = currentTarget.parentElement;
  }
  return path;
};

export default function useAgGridHook<RowType>(
  props: TAGGrid<RowType> & {
    gridRef: MutableRefObject<AgGridReact<RowType> | null>;
  }
) {
  const {
    columns = [],
    gridType = '',
    gridRef,
    onDrop,
    onTopDrop,
    rowKey,
    data,
    dragHoverKey,
    onDragStart,
    onGridReady,
    getContextMenuItems,
    contextMenu,
    handleColumnOptionsUpdated,
    onHeaderColumnMove,
    onHeaderAllColumnVisiblity,
    onHeaderColumnVisiblity,
    onColumnWidthUpdated,
    defaultSortColumn,
    defaultSortOrder,
    onRowClicked,
    processCellFromClipboard,
    processDataFromClipboard,
    onSelectionChanged,
    onFilterChanged,
    onCellDoubleClicked,
    getRowHeight,
    onRowDoubleClicked,
    onSortChanged
  } = props;

  const [destroyed, setDestroyed] = useState(false);
  const [currentNodeHover, setCurrentNodeHover] = useState<RowType | null>(
    null
  );
  const nodeRef = useRef<HTMLDivElement | null>(null);


  const isCompactGrid = false
  const [gridColumnState, setGridColumnState] = useState<TGridColumn<RowType>[]>(columns)



  useEffect(() => {
    // setGridColumnState(columns)
  }, [columns]);

  /**
   * @description Used for localozation in AG grid it will provide current selected language to grid
   */
  const localeText = useMemo(() => AG_GRID_LOCALE_EN, [])

  const handleGridReady = useCallback(
    (event: GridReadyEvent) => {
      const { api } = event;
      if (defaultSortColumn && defaultSortOrder) {
        api?.applyColumnState({
          state: [{ colId: defaultSortColumn, sort: defaultSortOrder }],
          defaultState: { sort: null }
        });
      }
      onGridReady && onGridReady(event);
    },
    [defaultSortColumn, defaultSortOrder]
  );

  const onCellValueChanged = useCallback((event: CellValueChangedEvent) => { },
    []);

  /***
   * Drop Handler on node
   */
  const handleNodeDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, row: RowType) => {
      e.preventDefault();
      setCurrentNodeHover(null);
      const dataType = e?.dataTransfer?.getData('dataType');
      if (dataType === 'gridHeader') {
        return;
      }
      onDrop &&
        onDrop({
          row,
          event: e
        });
    },
    [data]
  );
  /**
   * Drop Handler on between node
   */
  const handleNodeTopDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, row: RowType, rowIndex: number) => {
      e.preventDefault();
      e.stopPropagation();
      const dataType = e.dataTransfer.getData('dataType');
      if (dataType === 'gridHeader') {
        return;
      }
      const previousIndex = rowIndex - 1;
      const previousRow = (
        previousIndex >= 0
          ? (data as Record<string, any>[])[previousIndex]
          : null
      ) as RowType | null;
      setCurrentNodeHover(null);
      onTopDrop &&
        onTopDrop({
          row,
          event: e,
          previousRow
        });
    },
    [data, onTopDrop]
  );

  /**
   * @description Provide customiable menu options in AG grid after removing unwanted menu items
   */
  const getAgGridMenuItems = useCallback((params: GetMainMenuItemsParams) => {
    const menuItems: (MenuItemDef | string)[] = [];
    const itemsToExclude = [
      'sortAscending',
      'sortDescending',
      'separator',
      'pinSubMenu',
      'valueAggSubMenu',
      'autoSizeThis',
      'autoSizeAll',
      'resetColumns',
      'sortUnSort',
      'rowGroup',
      'expandAll',
      'contractAll',
      'rowUnGroup'
    ];
    params.defaultItems.forEach((item) => {
      if (itemsToExclude.indexOf(item) < 0) {
        menuItems.push(item);
      }
    });
    return menuItems;
  }, []);

  /**
   * Drag enter event of main node
   */
  const handleDragEnter = useCallback(
    (e: DragEvent, data: RowType) => {
      setCurrentNodeHover((data as Record<string, any>)[rowKey]);
    },
    [rowKey]
  );
  /**
   * Drag leave event of main node
   */
  const handleDragLeave = useCallback((e: DragEvent, data: RowType) => {
    setCurrentNodeHover(null);
  }, []);
  /**
   * Drag over event of main node
   */
  const handleOnDragOver = useCallback((e: DragEvent, data: RowType) => {
    e.preventDefault();
    setCurrentNodeHover((data as Record<string, any>)[rowKey]);
  }, []);

  const handleDragEnd = useCallback((e: DragEvent) => {
    const ghostRef = nodeRef?.current;
    document.getElementById('drag-ghost')?.remove();
    if (ghostRef) {
      ghostRef?.remove();
    }
  }, []);

  const handleDragStart = useCallback(
    (e: DragEvent, data: Record<string, any>, rowIndex: number) => {
      if (dragHoverKey) {
        document.getElementById('drag-ghost')?.remove();
        const crt = document.createElement('div');
        nodeRef.current = crt;
        if (crt) {
          crt.innerHTML = data[dragHoverKey];
          crt.classList.add('drag-ghost-node');
          crt.id = 'drag-ghost';
          document.body.appendChild(crt);
          e?.dataTransfer?.setDragImage(
            crt,
            isFirefox ? 35 : 0,
            isFirefox ? 35 : 0
          );
        }
      }
      e.dataTransfer?.setData('rowIndex', rowIndex + '');
      e.dataTransfer?.setData('currentNode', JSON.stringify(data));
      onDragStart && onDragStart({ row: data as RowType, event: e });
    },
    [dragHoverKey, onDragStart]
  );

  const handleRowPost = useCallback(
    (param: ProcessRowParams) => {
      const div = document.createElement('div');
      div.classList.add('ag-drop-zone');
      param.eRow.addEventListener('dragover', (e) =>
        handleOnDragOver(e, param.node.data)
      );
      param.eRow.addEventListener('dragleave', (event) =>
        handleDragLeave(event, param.node.data)
      );
      param.eRow.addEventListener('dragenter', (event) =>
        handleDragEnter(event, param.node.data)
      );
      param.eRow.addEventListener('dragend', (event) => handleDragEnd(event));
      param.eRow.addEventListener('dragstart', (event) =>
        handleDragStart(event, param.node.data, param.rowIndex)
      );

      param.eRow.childNodes.forEach((child) => child.appendChild(div));
    },
    [
      handleOnDragOver,
      handleDragLeave,
      handleDragEnter,
      handleDragEnd,
      handleDragStart
    ]
  );

  /**
   * @param provides event columnResized
   * @description handler for grid column width updation
   */
  const handleColumnWidthUpdated = useCallback(
    (params: ColumnResizedEvent) => {
      if (params?.source === UI_COLUMN_RESIZED && params?.finished) {
        const val = params?.column?.getActualWidth();
        const field = params?.column?.getColId();
        params?.column?.setActualWidth(val || 0, params?.source);
        onColumnWidthUpdated && onColumnWidthUpdated(field, val);
        // const updatedColumns = setColumnWidth(field || '', val || 0, gridColumnState);
        // setGridColumnState(updatedColumns);
      }
    },
    [onColumnWidthUpdated, gridColumnState]
  );

  const cellEditingStarted = useCallback(
    (event: CellEditingStartedEvent<RowType>) => {
      const data = event;
    },
    []
  );

  /**
   * @param provides columnMovedEvent
   * @description handler for column index change when user wants to update the column order
   */
  const onColumnPositionShuffle = useCallback(
    (event: ColumnMovedEvent) => {
      if (
        (event?.source == UI_COLUMN_MOVED || event?.source === TOOL_PANEL_UI) &&
        event?.finished
      ) {
        if (event.toIndex) {
          event?.column?.setSortIndex(event.toIndex);
          const droppedColField = columns[event.toIndex]?.field || '';
          onHeaderColumnMove &&
            onHeaderColumnMove(event?.column?.getColId(), droppedColField);
        }
      }
    },
    [columns, onHeaderColumnMove]
  );

  /**
   * @param provides columnVisibleEvent
   * @description handler for show/hide columns in Ag grid
   */
  const handleColumnVisibleCases = useCallback(
    (event: ColumnVisibleEvent) => {
      if (
        (event.source as string) === GRID_OPTIONS_UPDATED ||
        event.source === TOOL_PANEL_UI ||
        event.source === UI_COLUMN_MOVED
      ) {
        const updatedColumnName = event?.column?.getColDef().field;
        onHeaderColumnVisiblity &&
          onHeaderColumnVisiblity(updatedColumnName, event?.visible);
      } else if (
        (event.source === API || event.source === 'contextMenu') &&
        event.type === 'columnVisible'
      ) {
        onHeaderAllColumnVisiblity &&
          onHeaderAllColumnVisiblity(event?.visible);
      } else if (event.source === COLUMN_MENU) {
        onHeaderAllColumnVisiblity &&
          onHeaderAllColumnVisiblity(event?.visible);
      }
    },
    [onHeaderColumnVisiblity, onHeaderAllColumnVisiblity]
  );

  /**
   * @params event - Ag grid Event
   * @description refreshing grid cells on sort changed
   */
  const handleSortChanged = useCallback(
    (e: AgGridEvent) => {
      onSortChanged && onSortChanged(e);
      e.api.refreshCells({ force: true });
    },
    [onSortChanged]
  );

  /**
   * @params event -FilterChanged Event
   * @description refreshing grid cells on sort changed
   */
  const handleFilterChanged = useCallback(
    (e: TFilterChangedEvent<RowType>) => {
      onFilterChanged && onFilterChanged(e);
    },
    [onFilterChanged]
  );

  const handleRowHeight = useCallback(
    (params: RowHeightParams<RowType>): number => {
      if (getRowHeight) {
        return getRowHeight(params) || 0;
      } else {
        return isCompactGrid ? 28 : 32;
      }
    },
    [isCompactGrid, getRowHeight]
  );
  const getCustomContextMenuItems = useCallback(
    (params: GetContextMenuItemsParams<RowType>) => {
      if (getContextMenuItems && getContextMenuItems(params).length > 0) {
        return getContextMenuItems(params);
      } else {
        return [];
      }
    },
    [getContextMenuItems]
  );

  const handleOnPasteStart = useCallback((params: PasteStartEvent<RowType>) => {
    console.log(params);
  }, []);

  const suppressKeyboardEvent = useCallback(
    (params: SuppressKeyboardEventParams<RowType>) => {
      const event = params.event;

      const isALTKey =
        event.code === 'AltLeft' || event.code === 'AltRight' || event.altKey;

      const { key, shiftKey, ctrlKey, which } = event;
      const path = getEventPath(event);
      const isTabForward = key === 'Tab' && shiftKey === false;
      const isTabBackward = key === 'Tab' && shiftKey === true;
      let suppressEvent = false;


      if (isTabForward || isTabBackward) {
        const eGridCell = path.find((el) => {
          if (el.classList === undefined) return false;
          return el.classList.contains(GRID_CELL_CLASSNAME);
        });
        if (!eGridCell) {
          return suppressEvent;
        }

        const focusableChildrenElements = getAllFocusableElementsOf(eGridCell);
        const lastCellChildEl =
          focusableChildrenElements[focusableChildrenElements.length - 1];
        const firstCellChildEl = focusableChildrenElements[0];

        // Suppress keyboard event if tabbing forward within the cell and the current focused element is not the last child
        if (focusableChildrenElements.length === 0) {
          return false;
        }

        const currentIndex = focusableChildrenElements.indexOf(
          document.activeElement as HTMLElement
        );

        if (isTabForward) {
          const isLastChildFocused =
            lastCellChildEl && document.activeElement === lastCellChildEl;

          if (!isLastChildFocused) {
            suppressEvent = true;
            if (currentIndex !== -1 || document.activeElement === eGridCell) {
              event.preventDefault();
              focusableChildrenElements[currentIndex + 1].focus();
            }
          }
        }
        // Suppress keyboard event if tabbing backwards within the cell, and the current focused element is not the first child
        else {
          const cellHasFocusedChildren =
            eGridCell.contains(document.activeElement) &&
            eGridCell !== document.activeElement;

          // Manually set focus to the last child element if cell doesn't have focused children
          if (!cellHasFocusedChildren) {
            lastCellChildEl.focus();
            // Cancel keyboard press, so that it doesn't focus on the last child and then pass through the keyboard press to
            // move to the 2nd last child element
            event.preventDefault();
          }

          const isFirstChildFocused =
            firstCellChildEl && document.activeElement === firstCellChildEl;
          if (!isFirstChildFocused) {
            suppressEvent = true;
            if (currentIndex !== -1 || document.activeElement === eGridCell) {
              event.preventDefault();
              focusableChildrenElements[currentIndex - 1].focus();
            }
          }
        }
      }

      return suppressEvent;
    },
    []
  );

  const handleCellContextMenu = useCallback(
    (params: CellContextMenuEvent<RowType>) => {
      onRowClicked && onRowClicked(params);
    },
    []
  );

  const handleRowClicked = useCallback((params: RowClickedEvent<RowType>) => {
    onRowClicked && onRowClicked(params);
  }, []);

  const handleGetRowId: GetRowIdFunc<RowType> = useCallback((params) => {
    return params.data[rowKey as keyof RowType] as string;
  }, []);

  const handleStateUpdated = useCallback(
    (params: StateUpdatedEvent<RowType>) => {
      if (params.sources.includes('columnVisibility')) {
        const columnHidden: string[] = params.state.columnVisibility?.hiddenColIds || []
        const updatedColumns = setColumnVisible(columnHidden, gridColumnState)
        setGridColumnState(updatedColumns as TGridColumn<RowType>[])
      }
    },
    [gridColumnState]
  );
  const handleProcessCellFromClipboard = useCallback(
    (params: ProcessCellForExportParams<RowType, any>) => {
      if (processCellFromClipboard) {
        return processCellFromClipboard(params);
      } else {
        return null;
      }
    },
    [processCellFromClipboard]
  );
  const handleProcessDataFromClipboard = useCallback(
    (params: ProcessDataFromClipboardParams<RowType, any>) => {
      if (processDataFromClipboard) {
        return processDataFromClipboard(params);
      } else {
        return null;
      }
    },
    [processDataFromClipboard]
  );
  const handleSelectionChanged = useCallback(
    (params: SelectionChangedEvent<RowType, any>) => {
      if (onSelectionChanged) {
        onSelectionChanged(params);
      }
    },
    [onSelectionChanged]
  );
  const handleCellDoubleClicked = useCallback(
    (params: CellDoubleClickedEvent<RowType>) => {
      if (onCellDoubleClicked) {
        onCellDoubleClicked && onCellDoubleClicked(params);
      }
    },
    [onCellDoubleClicked]
  );

  const handleClickAway = useCallback(() => {
    gridRef.current?.api.stopEditing();
  }, [gridRef]);

  const handleColumnEverythingChanged = useCallback(
    (params: ColumnEverythingChangedEvent<RowType>) => {
      if (params.source === 'contextMenu') {
        const fields: Column[] = [];
        params.api.getAllGridColumns().forEach((o) => {
          if (!o.isVisible()) {
            fields.push(o);
          }
        });
        params.api.setColumnsVisible(fields, true);
      }
    },
    []
  );
  const handleModelUpdated = useCallback(
    (params: ModelUpdatedEvent<RowType>) => {
      if (params.api.getDisplayedRowCount() === 0) {
        params.api.showNoRowsOverlay();
      }
      if (params.api.getDisplayedRowCount() > 0) {
        params.api.hideOverlay();
      }
    },
    []
  );
  const setGridRowEditable = useCallback(
    (rowIndex: number, colKey: string) => {
      colKey &&
        rowIndex !== null &&
        (gridRef?.current?.api as GridApi<RowType>)?.startEditingCell({
          colKey: colKey || '',
          rowIndex: rowIndex
        });
    },
    [gridRef]
  );
  const handleColumnMenuVisibleChanges = useCallback(
    (params: ColumnMenuVisibleChangedEvent<RowType>) => {
      if (params.key === 'columnChooser' && params.visible) {
        const element = first(
          document.getElementsByClassName('ag-default-panel-title-bar-title')
        ) as HTMLSpanElement;
        if (element && localeText) {
          element.innerHTML = localeText['columnChooser'];
        }
      }
    },
    [localeText]
  );

  const handleDoubleRowClicked = useCallback(
    (params: RowDoubleClickedEvent) => {
      onRowDoubleClicked && onRowDoubleClicked(params);
    },
    [onRowDoubleClicked]
  );

  return {
    handleRowPost,
    onCellValueChanged,
    columns,
    handleGridReady,
    handleColumnWidthUpdated,
    localeText,
    isCompactGrid,
    cellEditingStarted,
    currentNodeHover,
    setCurrentNodeHover,
    handleNodeTopDrop,
    handleNodeDrop,
    onColumnPositionShuffle,
    destroyed,
    getCustomContextMenuItems,
    suppressKeyboardEvent,
    handleOnPasteStart,
    handleColumnVisibleCases,
    handleSortChanged,
    handleFilterChanged,
    getAgGridMenuItems,
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
  };
}
