import {
  CellKeyDownEvent,
  CellStyle,
  CellValueChangedEvent,
  CheckboxSelectionCallbackParams,
  ColDef, ColumnMenuTab, DndSourceCallbackParams,
  EditableCallbackParams,
  FilterChangedEvent,
  GetContextMenuItemsParams,
  GridApi,
  GridReadyEvent,
  IRowNode,
  MenuItemLeafDef,
  ProcessCellForExportParams,
  ProcessDataFromClipboardParams,
  RowClassParams,
  RowClickedEvent,
  RowDataTransaction,
  RowEditingStartedEvent,
  RowEditingStoppedEvent, RowHeightParams, RowSelectedEvent,
  RowValueChangedEvent,
  SelectionChangedEvent,
  SelectionEventSourceType,
  StartEditingCellParams, ValueFormatterParams,
  ValueGetterParams
} from 'ag-grid-community';
import {
  AgGridReactProps,
  CustomCellEditorProps,
  CustomCellRendererProps,
  CustomTooltipProps
} from 'ag-grid-react';
export type TDragStartParams<T> = { row: T; event: DragEvent };
export type TDropParams<T> = { row: T; event: React.DragEvent<HTMLDivElement> };
export type TTopDropParams<T> = {
  row: T;
  previousRow: T | null;
  event: React.DragEvent<HTMLDivElement>;
};
export type TAGGrid<T> = {
  draggable?: boolean;
  data: T[];
  columns: TGridColumn<T>[];
  rowKey: string;
  loading: boolean;
  dragHoverKey?: string;
  gridType?: string;
  onColumnPositionUpdated?: (columns: ColDef<T>[]) => void;
  customOnGridReady?(event: GridReadyEvent<T>): void;
  customCellValueChanged?: (event: CellValueChangedEvent<T>) => void;
  onDragStart?: (param: TDragStartParams<T>) => void;
  onTopDrop?: (param: TTopDropParams<T>) => void;
  onDrop?: (param: TDropParams<T>) => void;
  contextMenu?: TMenuItems;
  handleColumnOptionsUpdated?: (column: TGridColumn<T>) => void;
  showColumnOptions?: boolean;
} & AgGridReactProps<T>;

export type TGridColumn<RowType = any> = ColDef<RowType> & {
  alignment?: 'left' | 'right' | 'center';
  colKey?: string;
  position?: number;
  visible?: boolean;
  fixed?: boolean;
  sortabled?: boolean;
  isNumeric?: boolean;
  [x: string]: any;
  showDragIcon?: (params: any) => boolean;
  validate?: (param: any) => { status?: boolean; message?: '' };
};
export type TCustomEditorProps<T> = CustomCellEditorProps<T>;
export type TCustomRendererProps<T> = CustomCellRendererProps<T>;
export type TGridNode<T> = IRowNode<T>;
export type TRowDefaultType = Record<string, any>;
export type TCheckboxSelectionParam<T> = CheckboxSelectionCallbackParams<T>;
export type TDndSourceCallbackParams<T> = DndSourceCallbackParams<T>;
export type TGetContextMenuItemsParams<T> = GetContextMenuItemsParams<T>;
export type TMenuItems = MenuItemLeafDef[];
export type TCellStyle = CellStyle[];
export type TRowEditingStartedEvent<T> = RowEditingStartedEvent<T>;
export type TRowValueChangeEvent<T> = RowValueChangedEvent<T>;
export type TRowDataTransaction<T> = RowDataTransaction<T>;
export type TProcessDataFromClipboardParams<T> =
  ProcessDataFromClipboardParams<T>;
export type TAGGridRef<T> = {
  setGridRow: (rowId: number) => void;
  setGridRowEditable: (rowIndex: number, colKey: string) => void;
  getGridNodeById: (id: number) => IRowNode<T>;
  stopEditing: (cancel?: boolean) => void;
  getCheckedRows: () => T[];
  clearAllFilter: () => void;
  api: GridApi<T> | null;
};
export type TProcessCellForExportParams<T> = ProcessCellForExportParams<T>;
export type TRowSelectedEvent<T> = RowSelectedEvent<T>;
export type TSelectionEventSourceType = SelectionEventSourceType;
export type TRowClassParams<T> = RowClassParams<T>;
export type TRowEditingStoppedEvent<T> = RowEditingStoppedEvent<T>;
export type TAGGridWrapperProps<RowType = TRowDefaultType> = {
  [x: string]: any;
  columns: TGridColumn<RowType>[];
  gridType: any;
  onColumnPositionUpdated?: TOnColumnPositionUpdatedCB<RowType> | undefined;
  loadColumns?: boolean | undefined;
  showContextMenu?: boolean | undefined;
  type?: 'grid' | 'addPannel';
  title?: string;
};
/** GridWrapper.tsx */
export type TOnColumnPositionUpdatedCB<RowType> = (
  columns: TGridColumn<RowType>[]
) => void;
export type TRowClickedEvent<T> = RowClickedEvent<T>;
export type TValueFormatterParams<T> = ValueFormatterParams<T>;
export type TCellValueChangedEvent<T> = CellValueChangedEvent<T>;
export type TSelectionChangedEvent<T> = SelectionChangedEvent<T>;
export type TCellKeyDownEvent<T> = CellKeyDownEvent<T>;
export type TStartEditingCellParams = StartEditingCellParams;
export type TFilterChangedEvent<T> = FilterChangedEvent<T>;
export type THideFilterPopupType = null | (() => void);
export type TCustomTooltipProps<T> = CustomTooltipProps<T>;
export type TEditableCallbackParams<T> = EditableCallbackParams<T>;
export type TColumnMenuTab = ColumnMenuTab;
export type TColumnTransformers<TData> = {
  [key: string]: (data: TData) => any;
};
export type TRowHeightParams<T> = RowHeightParams<T, any>;
export type TValueGetterParams<T> = ValueGetterParams<T, any>;