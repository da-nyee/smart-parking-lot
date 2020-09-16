import React from 'react';
import styled from 'styled-components';
import SimpleLineChart from './SimplaLineChart';
import DatePickers4Sales from './DatePickers4Sales';
import DatePicker4Usage from './DatePicker4Usage';

const textMap = {
  sales: '기간별 매출',
  usage: '하루 이용률',
};

const MBdiv = styled.div`
  margin-bottom: 3rem;
  background: white;
`;
const LogoBox = styled.div`
  margin-left: 2rem;
  padding: 0.5rem;
  font-size: 3rem;
  width: 25rem;
`;

const FlexBox = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Graph = ({ type, ...props }) => {
  const text = textMap[type];

  return (
    <MBdiv>
      <FlexBox>
        <LogoBox>{text}</LogoBox>
        {type === 'sales' && (
          <DatePickers4Sales
            changeFrom={props.changeFrom}
            changeTo={props.changeTo}
            from={props.from}
            to={props.to}
          />
        )}
        {type === 'usage' && (
          <DatePicker4Usage changeDate={props.changeDate} date={props.date} />
        )}
      </FlexBox>
      {type === 'sales' && (
        <SimpleLineChart type={type} data={props.salesData} />
      )}
      {type === 'usage' && (
        <SimpleLineChart type={type} data={props.usageData} />
      )}
    </MBdiv>
  );
};

export default Graph;
