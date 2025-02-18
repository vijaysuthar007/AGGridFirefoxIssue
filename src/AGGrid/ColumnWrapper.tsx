import { CheckboxSelectionCallback } from 'ag-grid-community';
import { DragEvent, memo, useCallback, useMemo } from 'react';
import { TGridNode } from './types';
type TColumnWrapperProps<T> = {
  children: JSX.Element;
  handleNodeTopDrop: (
    e: DragEvent<HTMLDivElement>,
    data: T,
    rowIndex: number
  ) => void;
  handleNodeDrop: (e: DragEvent<HTMLDivElement>, data: T) => void;
  data: T;
  alignment?: 'right' | 'left' | 'center';
  draggable?: boolean;
  isCompactGrid: boolean;
  checkboxSelection?: boolean | CheckboxSelectionCallback<T> | undefined;
  isEditable?: boolean;
  eGridCell?: HTMLElement;
  rowIndex: number | null;
  node: TGridNode<T>;
  showDragIcon?: boolean;
  colId: string;
  setGridRowEditable?: (rowIndex: number, colId: string) => void;
};
const typedMemo: <T>(c: T) => T = memo;

function ColumnWrapper<T = any>({
  children,
  handleNodeTopDrop,
  handleNodeDrop,
  data,
  rowIndex,
  alignment,
  checkboxSelection,
  node,
  showDragIcon,
  column,
  colId,
  isCompactGrid,
  setGridRowEditable
}: TColumnWrapperProps<T>): JSX.Element {
  /**
   * Drag enter event of top div
   */
  const handleNodeTopEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      const targetElement = e?.target as HTMLDivElement;
      targetElement?.closest('.ag-row')?.childNodes.forEach((o) => {
        (o as HTMLDivElement)
          ?.querySelector('.ag-drop-zone')
          ?.classList.add('bg-green');
      });
    },
    []
  );
  /**
   * Drag leave event of top div
   */
  const handleNodeTopLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      const targetElement = e?.target as HTMLDivElement;
      targetElement?.closest('.ag-row')?.childNodes.forEach((o) => {
        (o as HTMLDivElement)
          ?.querySelector('.ag-drop-zone')
          ?.classList.remove('bg-green');
      });
    },
    []
  );
  const handleDropOnTopNode = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      const targetElement = e?.target as HTMLDivElement;
      targetElement?.closest('.ag-row')?.childNodes.forEach((o) => {
        (o as HTMLDivElement)
          ?.querySelector('.ag-drop-zone')
          ?.classList.remove('bg-green');
      });
      handleNodeTopDrop && handleNodeTopDrop(e, data, rowIndex || 0);
    },
    []
  );
  /**
   * Drag enter event of bottom div
   */
  const handleNodeBottomEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      const targetElement = e?.target as HTMLDivElement;
      targetElement?.closest('.ag-row')?.childNodes.forEach((o) => {
        (o as HTMLDivElement)
          ?.querySelector('.drop-ag-row')
          ?.classList.add('bg-gray');
      });
    },
    []
  );
  /**
   * Drag leave event of bottom div
   */
  const handleNodeBottomLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      const targetElement = e?.target as HTMLDivElement;
      targetElement?.closest('.ag-row')?.childNodes.forEach((o) => {
        (o as HTMLDivElement)
          ?.querySelector('.drop-ag-row')
          ?.classList.remove('bg-gray');
      });
    },
    []
  );
  /**
   * Drag leave event of bottom div
   */
  const handleNodeBottomDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      const targetElement = e?.target as HTMLDivElement;
      targetElement?.closest('.ag-row')?.childNodes.forEach((o) => {
        (o as HTMLDivElement)
          ?.querySelector('.drop-ag-row')
          ?.classList.remove('bg-gray');
      });
      handleNodeDrop && handleNodeDrop(e, data);
      // (isNodeHover) && setIsNodeBottomHover(false)
    },
    []
  );

  const columnClass = useMemo(() => {
    let classes = `drop-ag-row ${colId === 'Title' ? 'align-start' : 'align-center'} draggable-content `;
    if (alignment === 'right') {
      classes += ' row-right-align';
    }

    if (checkboxSelection) {
      classes += ' absolate-position-row';
    }

    return classes;
  }, [alignment, checkboxSelection, colId]);

  const handleClick = (e) => {
    if (e.detail === 2) {
      setGridRowEditable && setGridRowEditable(rowIndex, colId);
    }
  };
  const remainingHeight = isCompactGrid ? 3 : 4;
  const height = node.rowHeight ? node.rowHeight - remainingHeight : 0;
  return (
    <div
      onMouseDown={handleClick}
      className="wrapper"
      style={{ height: '100%', verticalAlign: 'middle' }}
    >
      <div
        onDragEnter={handleNodeTopEnter}
        onDragOver={handleNodeTopEnter}
        onDragLeave={handleNodeTopLeave}
        onDrop={handleDropOnTopNode}
        className={
          checkboxSelection
            ? 'absolate-top-position-row ag-drop-zone'
            : 'ag-drop-zone'
        }
      ></div>

      <div
        style={{
          height: height
        }}
        className={columnClass}
        onDragEnter={handleNodeBottomEnter}
        onDragOver={handleNodeBottomEnter}
        onDragLeave={handleNodeBottomLeave}
        onDrop={handleNodeBottomDrop}
      >
        {showDragIcon && (
          <div className="ag-drag-handle ag-row-drag" draggable="true">
            <span
              className="ag-icon ag-icon-grip"
              unselectable="on"
              role="presentation"
            ></span>
          </div>
        )}
        {children || ''}
      </div>
    </div>
  );
}
export default typedMemo(ColumnWrapper);
