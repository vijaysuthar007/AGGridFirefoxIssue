import { IRowNode } from 'ag-grid-community';
import { CustomCellEditorProps } from 'ag-grid-react';
import { memo, useRef } from 'react';
type ColumnEditorWrapper = { params: CustomCellEditorProps } & {
  children?: JSX.Element;
  node?: IRowNode<any>;
};

function ColumnEditorWrapper(props: ColumnEditorWrapper): JSX.Element {
  const { children, node } = props;
  const editorRef = useRef<HTMLDivElement | null>(null);

  const elementRowHeight = node?.rowHeight || 0;
  return (
    <div
      ref={editorRef}
      style={{ height: elementRowHeight - 3, verticalAlign: 'middle' }}
      className="edit-wrapper "
    >
      {children || ''}
    </div>
  );
}
export default memo(ColumnEditorWrapper);
