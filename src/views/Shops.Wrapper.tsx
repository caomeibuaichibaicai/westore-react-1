import React from 'react';
import swr, {useSWRPages} from 'swr';
import {defaultHttpClient} from '../lib/HttpClient';
import {Center} from '../components/Center';
import {Space} from '../components/Space';
import {MainButton} from '../components/button/MainButton';
import {Item} from './Shops.styled';
import {Link} from 'react-router-dom';
import {Img} from '../components/Img';
import westore from '../images/westore.svg';
import Icon from '../components/Icon';
import {AxiosResponse} from 'axios';
import {Loading} from '../components/Loading';
import {Stretch} from '../components/Stretch';
import styled from 'styled-components';
import {history} from '../lib/history';
import {Padding} from '../components/Padding';


const List = styled.div`
  background: white;
  &:empty{
    display:none;
  }
`;


export const Wrapper: React.FC = () => {
  console.log('wrapper');
  const {
    pages, loadMore, isReachingEnd, isEmpty, isLoadingMore, pageCount, pageSWRs
  } = useSWRPages<number | null, PagedResources<Shop>>(
    'shops',
    ({offset, withSWR}) => {
      offset = offset || 0;
      const {data: response} = withSWR(swr(['/shop', offset + 1, 10], async (url, pageNum, pageSize) => {
        console.log('ajax');
        return (await defaultHttpClient.get<PagedResources<Shop>>(url, {
          params: {pageNum, pageSize},
          autoHandlerError: true
        })).data;
      }));

      if (!response) return <Stretch><Loading/></Stretch>;

      return response.data.map(shop => (
        <Item key={shop.id}>
          <Link to={`/admin/shops/${shop.id}`}>
            <Img src={shop.imgUrl} fallbackSrc={westore}/>
            <span className="name oneLine">{shop.name}</span>
            <Icon name="right"/>
          </Link>
        </Item>
      ));
    },
    (SWR, index) => {
      return (SWR.data && SWR.data.pageNum < SWR.data.totalPage) ? index + 1 : null;
    },
    []
  );
  console.log('pageCount');
  console.log(pageCount);
  console.log('isEmpty, isReachingEnd, isLoadingMore');
  console.log(isEmpty, isReachingEnd, isLoadingMore);
  return <>
    <List>
      {pages}
    </List>
    {isEmpty ?
      <Center>
        <Space/>尚未创建店铺<Space/>
        <MainButton onClick={() => history.push(`/admin/shops/new`)}>创建新的店铺</MainButton>
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
  </>;
};
