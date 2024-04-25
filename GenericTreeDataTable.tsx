import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';

import AppButton from '../button/AppButton';
import { useEffect, useMemo, useRef, useState } from 'react';
import _ from 'lodash';
import { Skeleton } from 'survey-react-ui';
import { InputText } from 'primereact/inputtext';
import { useTranslation } from 'react-i18next';
import { IColumn, IGenericTreeDataTableProps } from './genericTreeDataTable.model';

export default function GenericTreeDataTable(
  props: IGenericTreeDataTableProps,
) {
  const {
    value,
    columns,
    actionBodyTemplate,
    dataLoading,
    openNew,
    headerText,
    componentNameForSelectingColumns,
    globalSearchValue,
    globalSearchOption,
    paginator,
    scrollable,
    scrollHeight,
    rows,
    sortMode,
    selectionMode,
    filterMode,
    selectionKeys,
    handleRowClickEvent,
    onSelectionChange,
    expandedKeys,
    filterService
  } = props;

  const treeTableRef = useRef(null);

  const [visibleColumns, setVisibleColumns] = useState<IColumn[]>([]);
  const { t } = useTranslation();
  const [filters, setFilters] = useState<string>('');
  const searchRef = useRef<any>(null);
  const setDataTableValueBouncing = useRef<any>(
    _.debounce((componentName, columns) => {
      filterService && filterService
        .getComponentValue(componentName)
        .then((res: any) => {
          if (res && res.length > 0) {
            const cols = columns.filter((col: IColumn) =>
              res.some((resCol: IColumn) => resCol.field === col.field),
            );
            setVisibleColumns(cols);
          } else {
            setVisibleColumns(columns);
          }
        });
    }, 250),
  );

  const bodyTemplate = () => {
    return <Skeleton className="my-2"></Skeleton>;
  };

  const dynamicColumns = useMemo(() => {
    if (visibleColumns) {
      const dynamicColumn = visibleColumns?.map((col, index) => (
        <Column
          key={index}
          className={`${col.className} `}
          style={col.style}
          field={col.field}
          header={col.header}
          filterPlaceholder={`Filter By ${col.header}`}
          filter={col.filter !== false}
          sortable={col.sortable || true}
          filterField={col.field}
          body={dataLoading ? bodyTemplate : col.template}
          editor={col.editor}
          expander={col.expander}
        />
      ));
      return dynamicColumn;
    }
  }, [visibleColumns]);

  const isColumnDefined =
    dynamicColumns && dynamicColumns.length > 0 ? true : false;

  useEffect(() => {
    if (columns) {
      if (
        componentNameForSelectingColumns &&
        componentNameForSelectingColumns !== undefined 
        && filterService
      ) {
        setDataTableValueBouncing.current(
          componentNameForSelectingColumns,
          columns,
        );
      } else {
        setVisibleColumns(columns);
      }
    }
  }, [columns, componentNameForSelectingColumns]);

  useEffect(() => {
    if (
      globalSearchValue &&
      searchRef.current &&
      searchRef.current.value !== globalSearchValue.value
    ) {
      searchRef.current.value = globalSearchValue.value;
      onGlobalFilterChange(searchRef.current.value);
    }
  }, [globalSearchValue]);

  const onGlobalFilterChange = (value: any) => {
    if (value !== undefined) {
      setFilters(value);
      searchRef.current.value = value;
    }
  };

  const header = (
    <div className="flex flex-row flex-wrap justify-content-between">
      {headerText !== undefined && (
        <div className="flex align-items-center justify-content-center font-bold m-2">
          {headerText}
        </div>
      )}
      <div className="flex flex-wrap ">
        <div className="m-2">
          {' '}
          {openNew && <AppButton type="Add" onClick={openNew} />}
        </div>

        <div className="flex">
          {globalSearchOption !== false && (
            <span className="md:mt-0 p-input-icon-left text-center ">
              <i className="pi pi-search ml-2" />
              <InputText
                onChange={(e) => {
                  onGlobalFilterChange(e.target.value);
                }}
                className="w-full md:w-20rem m-2"
                placeholder={`${t('components.genericDataTable.placeholder')}`}
                ref={searchRef}
              />
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <TreeTable
      ref={treeTableRef}
      value={dataLoading && isColumnDefined ? [] : value}
      tableStyle={{ minWidth: '50rem' }}
      header={header}
      rows={rows || 30}
      sortMode={sortMode || 'single'}
      paginator={paginator ?? (value && value.length > 0) ? true : false}
      scrollable={scrollable}
      scrollHeight={scrollHeight}
      globalFilter={filters}
      selectionMode={selectionMode}
      filterMode={filterMode || 'lenient'}
      selectionKeys={selectionKeys}
      onSelectionChange={onSelectionChange}
      onRowClick={handleRowClickEvent}
      expandedKeys={expandedKeys}
      emptyMessage={
        isColumnDefined && !dataLoading
          ? t('components.genericDataTable.noResultFound') //TODO: Need to add image but now got the error while build
          : 'Loading...'
      }
    >
      {isColumnDefined && dynamicColumns}

      <Column body={actionBodyTemplate} headerClassName="w-10rem" />
    </TreeTable>
  );
}
