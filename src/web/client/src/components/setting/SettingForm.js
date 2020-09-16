import React from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Label from '../common/Label';
import { FormWrapper, Form, FormBlock } from '../common/StyeldForm';

const textMap = {
  period: {
    oldPeriod: '변경 전 : ',
    newPeriod: '변경 후 : ',
  },
  register: {
    oldPassword: '현재 PW : ',
    newPassword: '새 PW : ',
    newConfirm: 'PW 확인 : ',
  },
};

const SettingForm = ({ type, form, onChange, onSubmit }) => {
  const text = textMap[type];

  return (
    <Form onSubmit={onSubmit}>
      {type === 'register' ? (
        <FormWrapper>
          <FormBlock>
            <Label for="oldPassword" register>
              {text.oldPassword}
            </Label>
            <Input
              name="oldPassword"
              id="oldPassword"
              onChange={onChange}
              value={form.oldPassword}
              type="password"
            />
          </FormBlock>
          <FormBlock>
            <Label for="newPassword" register>
              {text.newPassword}
            </Label>
            <Input
              name="newPassword"
              id="newPassword"
              onChange={onChange}
              value={form.newPassword}
              type="password"
            />
          </FormBlock>
          <FormBlock>
            <Label for="newConfirm" register>
              {text.newConfirm}
            </Label>
            <Input
              name="newConfirm"
              id="newConfirm"
              onChange={onChange}
              value={form.newConfirm}
              type="password"
            />
          </FormBlock>
        </FormWrapper>
      ) : (
        <FormWrapper>
          <FormBlock>
            <Label for="oldPeriod">{text.oldPeriod}</Label>
            <Input
              name="oldPeriod"
              id="oldPeriod"
              onChange={onChange}
              value={form.oldPeriod}
              disabled={true}
            />
          </FormBlock>
          <FormBlock>
            <Label for="newPeriod">{text.newPeriod}</Label>
            <Input
              name="newPeriod"
              id="newPeriod"
              onChange={onChange}
              value={form.newPeriod}
            />
          </FormBlock>
        </FormWrapper>
      )}
      <Button flex cyan>
        확인
      </Button>
    </Form>
  );
};

export default SettingForm;
