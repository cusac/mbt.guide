/* eslint-disable react/jsx-key */
import React, { createRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Icon,
  Image,
  Label,
  Menu,
  Table,
  Header,
  Pagination,
  Sticky,
  Grid,
} from 'semantic-ui-react';
import { RootState, setLoadingSegments, useAppDispatch } from 'store';
import { useTable } from 'react-table';
import { repository } from 'services';
import { captureAndLog, toastError } from 'utils';
import { Segment } from 'types';
import { debounce } from 'lodash';
import { Loading } from '../../components';
import { Params } from '../../utils/restful-resource-utility';
import statefulDebounce from '../../utils/statefulDebounce';

const MySegments = () => {
  const [error, setError] = React.useState();
  const [contextRef, setContextRef] = React.useState(undefined);
  const [data, setData] = React.useState([] as Segment[]);
  const [totalPages, setTotalPages] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedPage, setSelectedPage] = React.useState(1);
  const [itemLimit, setItemLimit] = React.useState(25);
  const [hasNextPage, setHasNextPage] = React.useState(true);
  const [hasPrevPage, setHasPrevPage] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const [currentPageTimeout, setCurrentPageTimeout] = React.useState(0);

  const loadingSegments = useSelector((state: RootState) => state.video.loadingSegments);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const dispatch = useAppDispatch();

  // TODO: Cancel fetching data if page has changed
  // TODO: Fix broken loop of fetching data when page changes quickly
  React.useEffect(() => {
    async function fetchSegments() {
      try {
        dispatch(setLoadingSegments({ loadingSegments: true }));

        const query: Params = {
          // ownerEmail: currentUser?.email,
          $page: currentPage,
          $embed: ['video', 'tags'],
          $limit: itemLimit,
        };

        if (searchText) {
          query.$text = searchText;
        }

        const {
          data: {
            docs,
            pages: { current, total, hasNext, hasPrev },
          },
        } = await repository.segment.list(query);

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
  }, [currentPage, currentUser, itemLimit, searchText]);

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

  const onSelectedPageChange = (page: number) => {
    setSelectedPage(page);
    onPageChange(page);
  };

  const onPageChange = statefulDebounce(
    (page: number) => setCurrentPage(page),
    500,
    currentPageTimeout,
    setCurrentPageTimeout
  );

  const onSearchChange = debounce((text: string) => {
    setSearchText(text);
    setCurrentPage(1);
    setSelectedPage(1);
  }, 500);

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
    <div ref={setContextRef as any}>
      <Sticky context={contextRef} active={true} offset={135}>
        <Grid>
          <Grid.Row>
            <Grid.Column width={5}>
              <div className="ui icon input">
                <input
                  className="prompt"
                  onChange={event => onSearchChange(event.target.value)}
                  type="text"
                  placeholder={'Search your segments.'}
                  // value={term}
                />
                <i className="search icon" />
              </div>
            </Grid.Column>
            <Grid.Column width={6}>
              <Pagination
                defaultActivePage={currentPage}
                totalPages={totalPages}
                activePage={selectedPage}
                onPageChange={(_, { activePage }) => {
                  // activePage && onPageChange(Number(activePage));
                  activePage && onSelectedPageChange(Number(activePage));
                }}
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
                prevItem={{
                  content: <Icon name="angle left" />,
                  icon: true,
                  disabled: !hasPrevPage,
                }}
                nextItem={{
                  content: <Icon name="angle right" />,
                  icon: true,
                  disabled: !hasNextPage,
                }}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Sticky>

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
          {loadingSegments ? (
            <Loading>Loading Segments...</Loading>
          ) : (
            rows.map(row => {
              prepareRow(row);
              return (
                <Table.Row {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return <Table.Cell {...cell.getCellProps()}>{cell.render('Cell')}</Table.Cell>;
                  })}
                </Table.Row>
              );
            })
          )}
        </Table.Body>
      </Table>
    </div>
  );
};

export default MySegments;
