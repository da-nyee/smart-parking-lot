import React from 'react';
import '../../lib/icon/remixicon.css';
import '../../lib/styles/board.css';
import classNames from 'classnames';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  customWidth: {
    maxWidth: 117.5,
  },
}));

const BoardTable = ({ parking }) => {
    const classes=useStyles();
    const tooltip=parking.map((p)=>{
        const info=`차 번호 : ${p.number}\n
                    입차 시간 : ${(new Date(p.start)).getMonth()+1}/${(new Date(p.start)).getDate()} ${(new Date(p.start)).getHours()}:${(new Date(p.start)).getMinutes()}\n
                    현재 요금 : ${p.fee}원`;
    
    if(p)
        return info;
    else
        return '빈 자리';
});
    
  return (
    <table>
      <tr>
        <th colspan="13" className="lightgray">
          1층
        </th>
      </tr>
      <tr>
        <td> </td>
        <td>
       <Tooltip title={tooltip[0]} classes={{ tooltip: classes.customWidth }}>
          <i
            className={classNames("ri-car-fill", {parking:parking[0]})}
          ></i>
                       </Tooltip>
        </td>
        <td>
              <Tooltip title={tooltip[1]} classes={{ tooltip: classes.customWidth }}>
          <i
            className={classNames("ri-car-fill", {parking:parking[1]})}
          ></i>
                       </Tooltip>
        </td>
        <td>
                       <Tooltip title={tooltip[2]} classes={{ tooltip: classes.customWidth }}>
          <i
            className={classNames("ri-car-fill", {parking:parking[2]})}
          ></i>
                       </Tooltip>
        </td>
        <td>
                       <Tooltip title={tooltip[3]} classes={{ tooltip: classes.customWidth }}>
          <i
            className={classNames("ri-car-fill", {parking:parking[3]})}
          ></i>
                       </Tooltip>
        </td>
        <td>
                       <Tooltip title={tooltip[4]} classes={{ tooltip: classes.customWidth }}>
          <i
            className={classNames("ri-car-fill", {parking:parking[4]})}
          ></i>
                       </Tooltip>
        </td>
        <td>
                       <Tooltip title={tooltip[5]} classes={{ tooltip: classes.customWidth }}>
          <i
            className={classNames("ri-car-fill", {parking:parking[5]})}
          ></i>
                       </Tooltip>
        </td>
        <td>
                       <Tooltip title={tooltip[6]} classes={{ tooltip: classes.customWidth }}>
          <i
            className={classNames("ri-car-fill", {parking:parking[6]})}
          ></i>
                       </Tooltip>
        </td>
        <td>
                       <Tooltip title={tooltip[7]} classes={{ tooltip: classes.customWidth }}>
          <i
            className={classNames("ri-car-fill", {parking:parking[7]})}
          ></i>
                       </Tooltip>
        </td>
        <td>
                       <Tooltip title={tooltip[8]} classes={{ tooltip: classes.customWidth }}>
          <i
            className={classNames("ri-car-fill", {parking:parking[8]})}
          ></i>
                       </Tooltip>
        </td>
        <td>
                       <Tooltip title={tooltip[9]} classes={{ tooltip: classes.customWidth }}>
          <i
            className={classNames("ri-car-fill", {parking:parking[9]})}
          ></i>
                       </Tooltip>
        </td>
        <td> </td>
        <td>
                       <Tooltip title={tooltip[10]} classes={{ tooltip: classes.customWidth }}>
          <i
            className={classNames("ri-car-fill", {parking:parking[10]})}
          ></i>
                       </Tooltip>
        </td>
      </tr>
      <tr>
        <td>
          <i className="ri-arrow-left-circle-line space"></i>
        </td>
        <td> </td>
        <td> </td>
        <td>
          <i className="ri-arrow-left-line"></i>
        </td>
        <td> </td>
        <td>
          <i className="ri-arrow-left-line"></i>
        </td>
        <td> </td>
        <td>
          <i className="ri-arrow-left-line"></i>
        </td>
        <td> </td>
        <td>
          <i className="ri-arrow-left-line"></i>
        </td>
        <td> </td>
        <td> </td>
        <td>
                       <Tooltip title={tooltip[11]} classes={{ tooltip: classes.customWidth }}>
          <i
            className={classNames("ri-car-fill", {parking:parking[11]})}
          ></i>
                       </Tooltip>
        </td>
      </tr>
      <tr>
        <td> </td>
        <td> </td>
        <td>
          <i
            className={classNames("ri-car-fill", {parking:parking[12]})}
          ></i>
        </td>
        <td>
          <i
            className={classNames("ri-car-fill", {parking:parking[13]})}
          ></i>
        </td>
        <td>
          <i
            className={classNames("ri-car-fill", {parking:parking[14]})}
          ></i>
        </td>
        <td>
          <i
            className={classNames("ri-car-fill", {parking:parking[15]})}
          ></i>
        </td>
        <td>
          <i
            className={classNames("ri-car-fill", {parking:parking[16]})}
          ></i>
        </td>
        <td>
          <i
            className={classNames("ri-car-fill", {parking:parking[17]})}
          ></i>
        </td>
        <td>
          <i
            className={classNames("ri-car-fill", {parking:parking[18]})}
          ></i>
        </td>
        <td>
          <i
            className={classNames("ri-car-fill", {parking:parking[19]})}
          ></i>
        </td>
        <td>
          <i
            className={classNames("ri-car-fill", {parking:parking[20]})}
          ></i>
        </td>
        <td>
         
        </td>
        <td>
          <i
            className={classNames("ri-car-fill", {parking:parking[21]})}
          ></i>
        </td>
      </tr>
      <tr style={{ height: '4rem' }}>
        <td>
          <i className="ri-arrow-right-circle-line space"></i>
        </td>
        <td> </td>
        <td> </td>
        <td>
          <i className="ri-arrow-right-line"></i>
        </td>
        <td> </td>
        <td>
          <i className="ri-arrow-right-line"></i>
        </td>
        <td> </td>
        <td>
          <i className="ri-arrow-right-line"></i>
        </td>
        <td> </td>
        <td>
          <i className="ri-arrow-right-line"></i>
        </td>
        <td> </td>
        <td> </td>
        <td style={{ background: 'lightgray' }}>
          <i className="ri-arrow-up-down-line"></i>
        </td>
      </tr>
    </table>
  );
};

export default BoardTable;
