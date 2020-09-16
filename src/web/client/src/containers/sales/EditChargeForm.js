import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeField, getCharge, editCharge } from '../../modules/sales';
import SalesForm from '../../components/sales/SalesForm';
import { initializeForm } from '../../modules/sales';

const EditChargeForm = () => {
  const dispatch = useDispatch();
  const { form } = useSelector(({ sales }) => ({
    form: sales.charge,
  }));

  const onChange = useCallback(
    (e) => {
      const { value, name } = e.target;
      const num = value.replace(/[^0-9]/g, '');

      dispatch(
        changeField({
          form: 'charge',
          key: name,
          value: num,
        })
      );
    },
    [dispatch]
  );

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const newCharge = form.newCharge;
      dispatch(editCharge({ newCharge }));
    },
    [dispatch, form.newCharge]
  );

  useEffect(() => {
    dispatch(getCharge());

    return () => {
      dispatch(initializeForm('charge'));
    };
  }, [dispatch]);

  return <SalesForm form={form} onChange={onChange} onSubmit={onSubmit} />;
};

export default EditChargeForm;
