import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
  Center,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState, useRef } from 'react';
import * as yup from 'yup';
import useSWR from 'swr';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ImagePicker } from 'components/image-file-picker';
import { getSavingsById, updateSavingsById } from 'apiSdk/savings';
import { savingsValidationSchema } from 'validationSchema/savings';
import { SavingsInterface } from 'interfaces/savings';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function SavingsEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<SavingsInterface>(
    () => (id ? `/savings/${id}` : null),
    () => getSavingsById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: SavingsInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateSavingsById(id, values);
      mutate(updated);
      resetForm();
      router.push('/savings');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<SavingsInterface>({
    initialValues: data,
    validationSchema: savingsValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Savings',
              link: '/savings',
            },
            {
              label: 'Update Savings',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Savings
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}

        <FormWrapper onSubmit={formik.handleSubmit}>
          <NumberInput
            label="Goal Amount"
            formControlProps={{
              id: 'goal_amount',
              isInvalid: !!formik.errors?.goal_amount,
            }}
            name="goal_amount"
            error={formik.errors?.goal_amount}
            value={formik.values?.goal_amount}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('goal_amount', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <NumberInput
            label="Current Amount"
            formControlProps={{
              id: 'current_amount',
              isInvalid: !!formik.errors?.current_amount,
            }}
            name="current_amount"
            error={formik.errors?.current_amount}
            value={formik.values?.current_amount}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('current_amount', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            labelField={'email'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/savings')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'savings',
    operation: AccessOperationEnum.UPDATE,
  }),
)(SavingsEditPage);
