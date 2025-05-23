import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/activities/activitiesSlice';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { getPageTitle } from '../../config';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import SectionMain from '../../components/SectionMain';
import CardBox from '../../components/CardBox';
import BaseButton from '../../components/BaseButton';
import BaseDivider from '../../components/BaseDivider';
import { mdiChartTimelineVariant } from '@mdi/js';
import { SwitchField } from '../../components/SwitchField';
import FormField from '../../components/FormField';

const ActivitiesView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { activities } = useAppSelector((state) => state.activities);

  const { id } = router.query;

  function removeLastCharacter(str) {
    console.log(str, `str`);
    return str.slice(0, -1);
  }

  useEffect(() => {
    dispatch(fetch({ id }));
  }, [dispatch, id]);

  return (
    <>
      <Head>
        <title>{getPageTitle('View activities')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View activities')}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Action</p>
            <p>{activities?.action}</p>
          </div>

          <FormField label='Timestamp'>
            {activities.timestamp ? (
              <DatePicker
                dateFormat='yyyy-MM-dd hh:mm'
                showTimeSelect
                selected={
                  activities.timestamp
                    ? new Date(
                        dayjs(activities.timestamp).format('YYYY-MM-DD hh:mm'),
                      )
                    : null
                }
                disabled
              />
            ) : (
              <p>No Timestamp</p>
            )}
          </FormField>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>User</p>

            <p>{activities?.user?.firstName ?? 'No data'}</p>
          </div>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/activities/activities-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

ActivitiesView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_ACTIVITIES'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default ActivitiesView;
