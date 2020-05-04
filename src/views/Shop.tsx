import React from 'react';
import {Link, RouteComponentProps, withRouter} from 'react-router-dom';
import {Wrapper} from './Shop.Wrapper';
import swr, {useSWRPages} from 'swr';
import {defaultHttpClient} from '../lib/HttpClient';
import {Loading} from '../components/Loading';
import {AxiosResponse} from 'axios';
import {Stretch} from '../components/Stretch';
import styled from 'styled-components';
import {ShapedDiv} from '../components/ShapedDiv';
import {Img} from '../components/Img';
import {Money} from '../components/Money';
import vars from '_vars.scss';
import {Space} from '../components/Space';
import {MainButton} from '../components/button/MainButton';
import {history} from '../lib/history';
import {Center} from '../components/Center';
import {Padding} from '../components/Padding';
import {Name} from '../components/Name';


const List = styled.div`
  padding: 16px;
  display:flex;
  justify-content: space-between;
  flex-wrap: wrap;
  &:empty{
    display:none;
  }
`;
const Item = styled(Link)`
  display:block; width: calc(50% - 8px); background:white; margin-bottom: 16px;
  border-radius: ${vars.borderRadius}; overflow: hidden;
  h3{padding: 0 8px;}
  p{ padding: 0 8px 8px; font-size: 18px; color: ${vars.colorDanger}; }
`;
const _Shop: React.FC<RouteComponentProps<{ id: string }>> = (props) => {
  const shopId = props.match.params.id;
  const {data: shop} = swr(`/shop/${shopId}`, async (key) => {
    const response = await defaultHttpClient.get<Resource<Shop>>(key, {autoHandlerError: true});
    return response.data.data;
  });
  const {
    pages, loadMore, isReachingEnd, isEmpty, isLoadingMore
  } = useSWRPages<number | null, PagedResources<Good>>(
    'shops',
    ({offset, withSWR}) => {
      offset = offset || 0;
      const {data: response} = withSWR(swr(['/goods', shopId, offset + 1, 10], async (url, shopId, pageNum, pageSize) => {
        return (await defaultHttpClient.get<PagedResources<Good>>(url, {
          params: {pageNum, pageSize, shopId},
          autoHandlerError: true
        })).data;
      }));

      if (!response) return <Stretch><Loading/></Stretch>;

      return response.data.map(good => (
        <Item key={good.id} to={`/admin/shops/${shopId}/goods/${good.id}`}>
          <ShapedDiv>
            <Img src={good.imgUrl} alt=""/>
          </ShapedDiv>
          <Name>{good.name}</Name>
          <p><Money>{good.price}</Money></p>
        </Item>
      ));
    },
    (SWR, index) => {
      return SWR.data?.totalPage && SWR.data?.totalPage > 0 && SWR.data?.pageNum < SWR.data?.totalPage ?
        index + 1 :
        null;
    },
    []
  );
  return (
    <Wrapper shop={shop}>
      <List>
        {pages}
      </List>
      {isEmpty ?
        <Center>
          <Space/>尚未创建商品<Space/>
          <MainButton onClick={() => history.push(`/admin/shops/${shopId}/goods/new`)}>创建新的商品</MainButton>
          <Space/>
        </Center>
        :
        <Padding>
          <Stretch>
            {isReachingEnd ?
              <Center>没有更多了</Center> :
              isLoadingMore ? null :
                <MainButton onClick={() => loadMore()}>加载更多</MainButton>
            }
          </Stretch>
        </Padding>
      }
    </Wrapper>
  );
};

export const Shop = withRouter(_Shop);
