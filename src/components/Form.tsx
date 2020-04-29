import styled from 'styled-components';
import React, {InputHTMLAttributes, PropsWithChildren, useState} from 'react';
import {Input} from './Input';
import {RuleForValue} from '../lib/validate';

export const Form = styled.form`
  padding: 16px;
  background: white;
  > h1{
    font-size: 18px;
    margin-bottom: 8px;
    &:empty{display:none;}
  }
  > .fields{
    margin-bottom: 32px;
  }
`;

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'defaultValue'> {
}

type Props<FormData = any> = (
  | { data: FormData; onChange: (data: FormData) => void; }
  | { defaultData: FormData; })
  & {
  title?: string;
  fields: { key: keyof FormData; input: InputProps; rules?: RuleForValue[] }[];
  onSubmit?: (data: FormData) => void;
}

export function F<FormData extends { [K: string]: any }>(props: PropsWithChildren<Props<FormData>>) {
  const [_data, _setData] = useState<FormData | null>('defaultData' in props ? props.defaultData : null);
  const getData = () => 'defaultData' in props ? _data : props.data;
  const patchData = (key: keyof FormData, v: string) => {
    const fn = 'defaultData' in props ? _setData : props.onChange;
    const value = {...getData(), [key]: v} as FormData;
    fn(value);
  };

  return (
    <Form onSubmit={() => props.onSubmit?.(getData()!)}>
      <h1>{props.title}</h1>
      <div className="fields">
        {props.fields.map(field =>
          <FormRow key={field.key.toString()}>
            <Input {...field.input} value={getData()?.[field.key]}
              onChange={e => {
                patchData(field.key, e.target.value);
              }}/>
          </FormRow>
        )}
      </div>
      {props.children}
    </Form>
  );
}
export const FormRow = styled.div`
  display:flex;
  & + & {margin-top: 8px;}
  > * + * { margin-left: 8px; }
  &:empty{ display:block; }
`;


