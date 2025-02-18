import { TGridColumn } from "./types";

export const setColumnWidth = (field: string, val: number, columns: TGridColumn<any>[]): TGridColumn<any>[] => {
   const updateWidth = (columns: TGridColumn<any>[]) => {
      return columns.map((item) => {
         if (item.field === field) {
            item.width = val;
         }
         if (item.children) {
            item.children = updateWidth(item.children)
         }
         return item;
      });
   }
   const updatedColumns = updateWidth(columns);
   return updatedColumns
}
export const setColumnVisible = (hiddenState: string[], columns: TGridColumn<any>[]): TGridColumn<any>[] => {
   const updateVisible = (columns: TGridColumn<any>[]) => {
      return columns.map((item) => {
         const isVisible = !hiddenState.includes(item.field || '')
         item.visible = isVisible
         if (item.children) {
            item.children = updateVisible(item.children)
         }
         return item;
      });
   }
   const updatedColumns = updateVisible(columns);
   return updatedColumns
}


