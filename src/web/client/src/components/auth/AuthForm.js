import React from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Label from '../common/Label';
import { FormWrapper, Form, FormBlock } from '../common/StyeldForm';

const AuthForm = ({ form, onChange, onSubmit }) => {
  return (
    <Form onSubmit={onSubmit}>
      <FormWrapper>
        <FormBlock>
          <Label for="username">ID : </Label>
          <Input
            autoComplete="username"
            name="username"
            id="username"
            onChange={onChange}
            value={form.username}
          />
        </FormBlock>
        <FormBlock>
          <Label for="password">PW : </Label>
          <Input
            autoComplete="new-password"
            name="password"
            type="password"
            id="password"
            onChange={onChange}
            value={form.password}
          />
        </FormBlock>
      </FormWrapper>
      <Button flex cyan login>
        로그인
      </Button>
    </Form>
  );
};

export default AuthForm;
