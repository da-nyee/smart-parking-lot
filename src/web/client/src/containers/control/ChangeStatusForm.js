import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  changeButton,
  getStatus,
  initializeStatus,
} from '../../modules/control';
import OnOffTable from '../../components/control/OnOffTable';

const ChangeStatusForm = () => {
  const dispatch = useDispatch();
  const { form } = useSelector(({ control }) => ({
    form: control.control,
  }));

  const onChange = useCallback(
    (index, e) => {
      const { value, name } = e.target;

      dispatch(
        changeButton({
          form: 'control',
          index,
          key: 'status',
          value: !!Number(value),
          name,
        })
      );
    },
    [dispatch]
  );
  const onClick = useCallback(() => {
    dispatch(initializeStatus());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getStatus());
  }, [dispatch]);

  return <OnOffTable form={form} onChange={onChange} onClick={onClick} />;
};

export default ChangeStatusForm;
