import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSales, getUsage } from '../../modules/graph';
import Graph from '../../components/graph/Graph';

const GraphForm = () => {
  const dispatch = useDispatch();
  const { from, to, date, salesData, usageData } = useSelector(({ graph }) => ({
    from: graph.from,
    to: graph.to,
    date: graph.date,
    salesData: graph.salesData,
    usageData: graph.usageData,
  }));

  //아래는 useCallback의 dependency에 대해 아주 좋은 예가 되는 듯
  const changeFrom = useCallback(
    (date) => {
      dispatch(getSales({ from: date, to }));
    },
    [to, dispatch]
  );

  const changeTo = useCallback(
    (date) => {
      dispatch(getSales({ from, to: date }));
    },
    [from, dispatch]
  );

  const changeDate = useCallback(
    (date) => {
      dispatch(getUsage({ date }));
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(getSales({ from, to }));
    dispatch(getUsage({ date }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  //만약 [dispatch, from, to, date]로 되어있었다면
  //안의 원소들 중 하나라도 바뀌었을 경우(or) 다시 실행된다.
  //p195 참조
  return (
    <>
      <Graph
        type="sales"
        changeFrom={changeFrom}
        changeTo={changeTo}
        salesData={salesData}
        from={from}
        to={to}
      />
      <Graph
        type="usage"
        changeDate={changeDate}
        usageData={usageData}
        date={date}
      />
    </>
  );
};

export default GraphForm;
