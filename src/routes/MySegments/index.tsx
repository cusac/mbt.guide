/* eslint-disable react/jsx-key */
import React from 'react';
import { useSelector } from 'react-redux';
import { Icon, Image, Label, Menu, Table, Header, Pagination } from 'semantic-ui-react';
import { RootState, setLoadingSegments, useAppDispatch } from 'store';
import { useTable } from 'react-table';
import { repository } from 'services';
import { captureAndLog, toastError } from 'utils';
import { Segment } from 'types';
import { debounce } from 'lodash';

const MySegments = () => {
  const [error, setError] = React.useState();
  const [data, setData] = React.useState([] as Segment[]);
  const [totalPages, setTotalPages] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemLimit, setItemLimit] = React.useState(25);
  const [hasNextPage, setHasNextPage] = React.useState(true);
  const [hasPrevPage, setHasPrevPage] = React.useState(false);

  const loadingSegments = useSelector((state: RootState) => state.video.loadingSegments);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const dispatch = useAppDispatch();

  // TODO: Cancel fetching data if page has changed
  // TODO: Fix broken loop of fetching data when page changes quickly
  React.useEffect(() => {
    async function fetchSegments() {
      try {
        dispatch(setLoadingSegments({ loadingSegments: true }));

        const {
          data: {
            docs,
            pages: { current, total, hasNext, hasPrev },
          },
        } = await repository.segment.list({
          // ownerEmail: currentUser?.email,
          $page: currentPage,
          $embed: ['video', 'tags'],
          $limit: itemLimit,
        });

        setData(docs);
        setTotalPages(total);
        setHasNextPage(hasNext);
        setHasPrevPage(hasPrev);
      } catch (err) {
        captureAndLog({ file: 'MySegments', method: 'fetchSegments', err });
        toastError(
          'There was an error fetching segment data. Please refresh the page and try again.',
          err
        );
      } finally {
        dispatch(setLoadingSegments({ loadingSegments: false }));
      }
    }
    currentUser && fetchSegments();
  }, [currentPage, currentUser, itemLimit]);

  const columns = React.useMemo(
    () => [
      {
        Header: () => null,
        id: '_id',
        accessor: 'video.youtube.snippet.thumbnails.medium.url',
        // eslint-disable-next-line react/display-name
        Cell: ({ value }: { value: string }) => {
          return <Image src={value} size="tiny" />;
        },
      },
      {
        Header: 'Title',
        accessor: 'title',
        // eslint-disable-next-line react/display-name
        Cell: ({ value }: { value: string }) => {
          return <Label ribbon>{value}</Label>;
        },
      },
      {
        Header: 'Owner',
        accessor: 'ownerEmail',
      },
    ],
    []
  ) as any;

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  const onPageChange = debounce((page: number) => setCurrentPage(page), 500);

  // const {
  //   getTableProps,
  //   getTableBodyProps,
  //   headerGroups,
  //   prepareRow,
  //   page,
  //   canPreviousPage,
  //   canNextPage,
  //   pageOptions,
  //   gotoPage,
  //   nextPage,
  //   previousPage,
  //   setPageSize,
  //   state: { pageIndex, pageSize, sortBy }
  // } = useTable(
  //   {
  //     columns,
  //     data,
  //     manualPagination: true,
  //     manualSortBy: true,
  //     autoResetPage: false,
  //     autoResetSortBy: false,
  //     pageCount: controlledPageCount
  //   },
  //   useSortBy,
  //   usePagination
  // );

  if (!currentUser) {
    return (
      <div>
        <Header style={{ marginTop: 50 }}>
          <h1>Sign in to view your segments!</h1>
        </Header>
      </div>
    );
  }

  return (
    <div>
      <Table celled {...getTableProps()}>
        <Table.Header>
          {headerGroups.map(headerGroup => (
            <Table.Row {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <Table.HeaderCell {...column.getHeaderProps()}>
                  {column.render('Header')}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <Table.Row {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <Table.Cell {...cell.getCellProps()}>{cell.render('Cell')}</Table.Cell>;
                })}
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
      <Pagination
        defaultActivePage={currentPage}
        totalPages={totalPages}
        onPageChange={(_, { activePage }) => activePage && onPageChange(Number(activePage))}
        ellipsisItem={{ content: <Icon name="ellipsis horizontal" />, icon: true }}
        firstItem={{
          content: <Icon name="angle double left" />,
          icon: true,
          disabled: !hasPrevPage,
        }}
        lastItem={{
          content: <Icon name="angle double right" />,
          icon: true,
          disabled: !hasNextPage,
        }}
        prevItem={{ content: <Icon name="angle left" />, icon: true, disabled: !hasPrevPage }}
        nextItem={{ content: <Icon name="angle right" />, icon: true, disabled: !hasNextPage }}
      />
    </div>
  );
};

export default MySegments;
