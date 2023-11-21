/* eslint-disable react/jsx-key */
import React, {useEffect} from "react";
import 'regenerator-runtime/runtime';
import {useAsyncDebounce, useFilters, useGlobalFilter, usePagination, useSortBy, useTable} from "react-table";
import {ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronLeftIcon, ChevronRightIcon} from "@heroicons/react/solid";
import {Button, PageButton} from "./PageButton";
import {SortDownIcon, SortIcon, SortUpIcon} from "./Icon";

// Define a default UI for filtering
function GlobalFilter({
                          preGlobalFilteredRows,
                          globalFilter,
                          setGlobalFilter
                      }) {

    const [value, setValue] = React.useState(globalFilter);

    const onChange = useAsyncDebounce((value) => {
        setGlobalFilter(value);
    }, 200);

    return (
        <input type="text"
               className="bg-[#e2e3e5] shadow-md w-full border-1 border-green focus:border-green rounded-md p-4 mb-4"
               value={value}
               onChange={(e) => {
                   setValue(e.target.value);
                   onChange(e.target.value);
               }}
               placeholder={`Buscar...`}/>
    );
}

// This is a custom filter UI for selecting
// a unique option from a list
export function SelectColumnFilter({
                                       column: {filterValue, setFilter, preFilteredRows, id, render}
                                   }) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = React.useMemo(() => {
        const options = new Set();
        preFilteredRows.forEach((row) => {
            options.add(row.values[id]);
        });
        return [...options.values()];
    }, [id, preFilteredRows]);

    // Render a multi-select box
    return (
        <label className="flex gap-x-2 items-baseline">
            <span className="text-gray-700">{render("Header")}: </span>
            <select className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    name={id}
                    id={id}
                    value={filterValue}
                    onChange={(e) => {
                        setFilter(e.target.value || undefined);
                    }}>
                <option value="">All</option>
                {options.map((option, i) => (
                    <option key={i}
                            value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </label>
    );
}

export function StatusPill({value}) {
    const status = value ? value.toLowerCase() : "unknown";

    return (
        <span className={classNames(
            "px-3 py-1 uppercase leading-wide font-bold text-xs rounded-full shadow-sm",
            status.startsWith("active") ? "bg-green-100 text-green-700" : null,
            status.startsWith("inactive") ? "bg-yellow-100 text-yellow-700" : null,
            status.startsWith("offline") ? "bg-red-100 text-red-700" : null
        )}>
      {status}
    </span>
    );
}


function Table({columns, data, handleTapOnRow, fetchData, controlledPageCount, loading}) {
    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: {pageSize, pageIndex, globalFilter},
        preGlobalFilteredRows,
        setGlobalFilter
    } = useTable(
        {
            columns,
            data,
            initialState: {pageIndex: 0},
            manualPagination: true,
            pageCount: controlledPageCount,
            autoResetPage: false
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    useEffect(() => {
        console.log("pageSize " + pageSize + " " + pageIndex + "pagecount" + controlledPageCount + "pageIndex " + pageIndex);
        fetchData(pageIndex, pageSize);
    }, [fetchData, pageIndex, pageSize]);


    // Handling click on row to enter modal.
    const handleClickOnRow = (e, cell) => {
        console.log("Tap on row.")
        let object = cell.original
        handleTapOnRow(object)
    }

    // Render the UI for your table
    return (
        <>
            <div className="sm:flex sm:gap-x-2">
                <GlobalFilter preGlobalFilteredRows={preGlobalFilteredRows}
                              globalFilter={globalFilter}
                              setGlobalFilter={setGlobalFilter}/>
            </div>
            <div className="mt-2 flex flex-col">
                <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow-xl overflow-hidden sm:rounded-lg">
                            <table
                                {...getTableProps()} className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-[#f4f4f5]">
                                {headerGroups.map((headerGroup) => (
                                    // eslint-disable-next-line react/jsx-key
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map((column) => (
                                            // Add the sorting props to control sorting. For this example
                                            // we can add them into the header props
                                            <th scope="col"
                                                className="group px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase tracking-wider"
                                                {...column.getHeaderProps(
                                                    column.getSortByToggleProps()
                                                )}
                                            >
                                                <div className="flex items-center justify-between">
                                                    {column.render("Header")}
                                                    {/* Add a sort direction indicator */}
                                                    <span>
                              {column.isSorted ? (
                                  column.isSortedDesc ? (
                                      <SortDownIcon className="w-4 h-4 text-gray-700"/>
                                  ) : (
                                      <SortUpIcon className="w-4 h-4 text-gray-700"/>
                                  )
                              ) : (
                                  <SortIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100"/>
                              )}
                            </span>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                                </thead>
                                <tbody
                                    {...getTableBodyProps()} className="bg-[#f0f2f6] divide-y divide-text-light">
                                {page.map((row, i) => {
                                    // new
                                    prepareRow(row);
                                    return (
                                        <tr {...row.getRowProps()} onClick={e => handleClickOnRow(e, row)}>
                                            {row.cells.map((cell) => {
                                                return (
                                                    <td {...cell.getCellProps()}
                                                        className="px-6 py-4 whitespace-nowrap text-text">
                                                        {cell.render("Cell")}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-3 mt-4 flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                    <Button onClick={() => previousPage()}
                            disabled={!canPreviousPage}>
                        Previous
                    </Button>
                    <Button onClick={() => nextPage()}
                            disabled={!canNextPage}>
                        Next
                    </Button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    {
                        !loading ? (
                            <div className="flex gap-x-2">
                  <span className="text-sm text-gray-700">
                    Página <span className="font-medium">{pageIndex + 1}</span> de{" "}
                      <span className="font-medium">{pageOptions.length}</span>
                  </span>
                                <label>
                                    <span className="sr-only">Items Per Page</span>
                                    <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            value={pageSize}
                                            onChange={(e) => {
                                                setPageSize(Number(e.target.value));
                                            }}>
                                        {[5, 10, 20].map((pageSize) => (
                                            <option key={pageSize}
                                                    value={pageSize}>
                                                Mostrar {pageSize}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                        ) : (
                            <span className="text-sm text-gray-700"> Cargando </span>
                        )
                    }
                    <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                             aria-label="Pagination">
                            <PageButton className="bg-light-lighter rounded-l-md"
                                        onClick={() => gotoPage(0)}
                                        disabled={!canPreviousPage}>
                                <span className="sr-only">First</span>
                                <ChevronDoubleLeftIcon className="h-5 w-5"
                                                       aria-hidden="true"/>
                            </PageButton>
                            <PageButton className="bg-light-lighter"
                                        onClick={() => previousPage()}
                                        disabled={!canPreviousPage}>
                                <span className="sr-only">Previous</span>
                                <ChevronLeftIcon className="h-5 w-5"
                                                 aria-hidden="true"/>
                            </PageButton>
                            <PageButton className="bg-light-lighter"
                                        onClick={() => nextPage()}
                                        disabled={!canNextPage}>
                                <span className="sr-only">Next</span>
                                <ChevronRightIcon className="h-5 w-5"
                                                  aria-hidden="true"/>
                            </PageButton>
                            <PageButton className="bg-light-lighter rounded-r-md"
                                        onClick={() => gotoPage(pageCount - 1)}
                                        disabled={!canNextPage}>
                                <span className="sr-only">Last</span>
                                <ChevronDoubleRightIcon className="h-5 w-5"
                                                        aria-hidden="true"/>
                            </PageButton>
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Table;
