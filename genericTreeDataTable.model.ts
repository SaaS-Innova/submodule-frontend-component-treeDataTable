import { ColumnBodyOptions } from 'primereact/column';
import {
  TreeTableSelectionEvent,
  TreeTableSelectionKeysType,
} from 'primereact/treetable';

export interface IGenericTreeDataTableProps {
  classNames?: string;
  columns: IColumn[];
  value?: any;
  actionBodyTemplate?:
    | React.ReactNode
    | ((data: any, options: ColumnBodyOptions) => React.ReactNode);
  displayCheckBoxesColumn?: boolean;
  handleRowClickEvent?: (e: any) => void;
  onRowExpand?: (e: any) => void;
  paginator?: boolean;
  expandedKeys?: any;
  sortMode?: 'multiple' | 'single';
  dataLoading?: boolean;
  openNew?: () => void;
  headerText?: string;
  componentNameForSelectingColumns?: string;
  globalSearchValue?: { value: string };
  globalSearchOption?: boolean;
  rows?: number;
  scrollHeight?: string;
  headerDropdown?: {
    options: any[];
    placeholder?: string;
    initialValue?: { label: string; value: string };
  };
  scrollable?: boolean;
  filterMode?: 'lenient' | 'strict';
  selectionMode?: 'single' | 'multiple' | 'checkbox' | undefined;
  selectionKeys?: TreeTableSelectionKeysType | null;
  onSelectionChange?: (e: TreeTableSelectionEvent) => void;
  filterService?: any
}
export interface IColumn {
  field: string;
  header: string;
  sortable?: boolean;
  filter?: boolean | {};
  template?: any;
  editor?: any;
  className?: string;
  style?: any;
  expander?: boolean;
}
