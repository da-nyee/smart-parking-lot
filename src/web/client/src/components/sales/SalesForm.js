import React from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Label from '../common/Label';
import { FormWrapper, Form, FormBlock } from '../common/StyeldForm';

const SalesForm = ({ form, onChange, onSubmit }) => {
  return (
    <Form onSubmit={onSubmit}>
      <FormWrapper>
        <FormBlock>
          <Label for="oldCharge">변경 전 : </Label>
          <Input
            name="oldCharge"
            id="oldCharge"
            onChange={onChange}
            value={form.oldCharge}
            disabled={true}
          />
        </FormBlock>
        <FormBlock>
          <Label for="newCharge">변경 후 : </Label>
          <Input
            name="newCharge"
            id="newCharge"
            onChange={onChange}
            value={form.newCharge}
          />
        </FormBlock>
      </FormWrapper>
      <Button flex cyan>
        확인
      </Button>
    </Form>
  );
};

export default SalesForm;
