import React, { useContext } from 'react';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../../context/auth';
import {
  FormFields,
  FormLabel,
  FormTitle,
  Error,
  FormLink
} from '../../components/FormFields/FormFields';
import { Wrapper, FormWrapper, LogoImage, LogoWrapper } from './Login.style';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Logoimage from '../../assets/image/LogoHome.png';

const initialValues = {
  username: '',
  password: '',
};

const getLoginValidationSchema = () => {
  return Yup.object().shape({
    username: Yup.string().required('Username is Required!'),
    password: Yup.string().required('Password is Required!'),
  });
};

const MyInput = ({ field, form, ...props }) => {
  return <Input {...field} {...props} />;
};

const message = {
  link: "/password-reset",
  text: "忘記密碼?"
};

export default () => {
  let history = useHistory();
  let location = useLocation();
  const { authenticate, isAuthenticated } = useContext(AuthContext);
  if (isAuthenticated) return <Redirect to={{ pathname: '/' }} />;

  let { from } = (location.state as any) || { from: { pathname: '/' } };
  let login = async ({ username, password }, {setSubmitting, setErrors, resetForm}) => {
    try { 
      await authenticate({ username, password }, () => {
        history.replace(from);
      });
      resetForm({});
    } catch (err) {
      setSubmitting(false);
      setErrors({submit: err.message});
    }
  };
  return (
    <Wrapper>
      <FormWrapper>
        <Formik
          initialValues={initialValues}
          onSubmit={login}
          render={({ errors, status, touched, isSubmitting }) => (
            <Form>
              <FormFields>
                <LogoWrapper>
                  <LogoImage src={Logoimage} alt='admin' />
                </LogoWrapper>
                <FormTitle>登入管理平台</FormTitle>
              </FormFields>
              <FormFields>
                <FormLabel>帳號</FormLabel>
                <Field
                  type='text'
                  name='username'
                  component={MyInput}
                  placeholder='Enter username'
                />
                {errors.username && touched.username && (
                  <Error>{errors.username}</Error>
                )}
              </FormFields>
              <FormFields>
                <FormLabel>密碼</FormLabel>
                <Field
                  type='password'
                  name='password'
                  component={MyInput}
                  placeholder='Enter password'
                />
                {errors.password && touched.password && (
                  <Error>{errors.password}</Error>
                )}
              </FormFields>
              <FormLink>{message}</FormLink>
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
          validationSchema={getLoginValidationSchema}
        />
      </FormWrapper>
    </Wrapper>
  );
};
