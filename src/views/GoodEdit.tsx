import React, {useState} from 'react';
import Layout from '../components/Layout';
import {F} from '../components/Form';
import {MainButton} from '../components/button/MainButton';
import {Stretch} from '../components/Stretch';
import {defaultHttpClient} from '../lib/HttpClient';
import {RouteComponentProps, withRouter} from 'react-router-dom';

const _GoodEdit: React.FC<RouteComponentProps<{ id: string }>> = (props) => {
  const [formData] = useState<Partial<Good>>({
    name: '',
    description: '',
    imgUrl: '',
    stock: undefined,
    price: undefined,
    shopId: parseInt(props.match.params.id)
  });
  const submit = async (v: typeof formData) => {
    await defaultHttpClient.post('/goods', v, {autoHandlerError: true});
  };
  return (
    <Layout title="新增商品">
      <F onSubmit={submit} title="商品详情" defaultData={formData} fields={[
        {key: 'name', input: {placeholder: '* 标题'}, rules: [{required: true}]},
        {key: 'price', input: {placeholder: '* 价格'}, rules: [{required: true}]},
        {key: 'stock', input: {placeholder: '* 库存'}, rules: [{required: true}]},
        {key: 'description', input: {placeholder: '副标题'}},
        {key: 'details', input: {placeholder: '详细描述'}},
        {key: 'imgUrl', input: {placeholder: '图片'}},
        {key: 'shopId', input: {type: 'hidden'}}
      ]}>
        <Stretch>
          <MainButton type="submit">提交</MainButton>
        </Stretch>
      </F>
    </Layout>
  );
};

export const GoodEdit = withRouter(_GoodEdit);
