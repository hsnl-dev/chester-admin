import React from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  FormFields,
  FormLabel,
  FormTitle,
  Error,
} from '../../components/FormFields/FormFields';
import { Wrapper, FormWrapper, LogoImage, LogoWrapper } from '../Login/Login.style';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Logoimage from '../../assets/image/PickBazar.png';
import { request } from "../../utils/request";

const initialValues = {
  username: '',
};

const MyInput = ({ field, form, ...props }) => {
  return <Input {...field} {...props} />;
};

const forgetPasswordValidationSchema = () => {
  return Yup.object().shape({
    username: Yup.string().required('This field is required!')
  });
};

export default () => {
  let history = useHistory();
  let submitUsername = async ({ username }, {resetForm}) => {
    try {
      const response = await request.post("/password-reset", {
        username,
      });
      if (response) {
        // console.log / alert
      }
      history.push('/login');
    } catch (err) {
      console.log(err);
      resetForm({});
    }
  };

  return (
    <Wrapper>
      <FormWrapper>
        <Formik
          initialValues={initialValues}
          onSubmit={submitUsername}
          validationSchema={forgetPasswordValidationSchema}
          render={({ errors, status, touched, isSubmitting }) => (
            <Form>
              <FormFields>
                <LogoWrapper>
                  <LogoImage src={Logoimage} alt='admin' />
                </LogoWrapper>
                <FormTitle>忘記密碼</FormTitle>
              </FormFields>
              <FormFields>
                <FormLabel>帳號</FormLabel>
                <Field
                  type='text'
                  name='username'
                  component={MyInput}
                  placeholder='Enter your username'
                />
                {errors.username && touched.username && (
                  <Error>{errors.username}</Error>
                )}
              </FormFields>
              <Button
                type='submit'
                disabled={isSubmitting}
                overrides={{
                  BaseButton: {
                    style: ({ $theme }) => ({
                      width: '100%',
                      marginLeft: 'auto',
                      borderTopLeftRadius: '3px',
                      borderTopRightRadius: '3px',
                      borderBottomLeftRadius: '3px',
                      borderBottomRightRadius: '3px',
                    }),
                  },
                }}
              >
                Submit
              </Button>
            </Form>
          )}
        />
      </FormWrapper>
    </Wrapper>
  );
};