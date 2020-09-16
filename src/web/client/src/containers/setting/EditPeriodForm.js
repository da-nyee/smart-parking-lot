import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeField, getPeriod, editPeriod } from '../../modules/setting';
import SettingForm from '../../components/setting/SettingForm';
import { initializeForm } from '../../modules/setting';

const EditPeriodForm = () => {
  const dispatch = useDispatch();
  const { form } = useSelector(({ setting }) => ({
    form: setting.period,
  }));

  const onChange = useCallback(
    (e) => {
      const { value, name } = e.target;
      const num = value.replace(/[^0-9]/g, '');

      dispatch(
        changeField({
          form: 'period',
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

      const newPeriod = form.newPeriod;
      dispatch(editPeriod({ newPeriod }));
    },
    [dispatch, form.newPeriod]
  );

  useEffect(() => {
    dispatch(getPeriod());

    return () => {
      dispatch(initializeForm('period'));
    };
  }, [dispatch]);

  return (
    <SettingForm
      type="period"
      form={form}
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
};

export default EditPeriodForm;
